import fs from 'node:fs/promises';
import path from 'node:path';
import prettier from 'prettier';
import ts from 'typescript';

const check = process.argv.includes('--check');
const ignored = new Set([
  '.git',
  'node_modules',
  'dist',
  'old',
  '.codex',
  '.agents',
]);

async function singleLineImports(text, filename) {
  const source = ts.createSourceFile(
    filename,
    text,
    ts.ScriptTarget.Latest,
    true,
  );

  for (const statement of [...source.statements].reverse()) {
    if (!ts.isImportDeclaration(statement)) continue;

    const start = statement.getStart(source);
    const declaration = text.slice(start, statement.end);
    // Keep comments intact; ordinary imports can use an unlimited line width.
    const formatted = await prettier.format(declaration, {
      parser: 'typescript',
      singleQuote: true,
      printWidth: Number.MAX_SAFE_INTEGER,
    });

    text =
      text.slice(0, start) + formatted.trimEnd() + text.slice(statement.end);
  }

  return text;
}

function singleLineDeclarations(text, filename) {
  const source = ts.createSourceFile(
    filename,
    text,
    ts.ScriptTarget.Latest,
    true,
  );
  const ranges = [];

  function visit(node) {
    if (ts.isFunctionLike(node) && node.body) {
      ranges.push([node.getStart(source), node.body.getStart(source)]);
    } else if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
      const brace = node
        .getChildren(source)
        .find((child) => child.kind === ts.SyntaxKind.OpenBraceToken);
      if (brace) ranges.push([node.getStart(source), brace.getStart(source)]);
    }
    ts.forEachChild(node, visit);
  }

  visit(source);

  const headers = ranges.filter(
    ([start, end], index) => !ranges.some(
        ([outerStart, outerEnd], other) => other !== index && outerStart <= start && outerEnd >= end,
      ),
  );

  for (const [start, end] of headers.sort((a, b) => b[0] - a[0])) {
    const header = text.slice(start, end);
    const scanner = ts.createScanner(
      ts.ScriptTarget.Latest,
      false,
      ts.LanguageVariant.Standard,
      header,
    );
    let compact = '';
    let hasLineComment = false;
    let token;

    while ((token = scanner.scan()) !== ts.SyntaxKind.EndOfFileToken) {
      if (token === ts.SyntaxKind.SingleLineCommentTrivia)
        hasLineComment = true;
      compact +=
        token === ts.SyntaxKind.WhitespaceTrivia ||
        token === ts.SyntaxKind.NewLineTrivia
          ? ' '
          : scanner.getTokenText();
    }

    // Preserve comments and literal contents rather than changing their meaning.
    if (hasLineComment || /[\r\n]/.test(compact)) continue;
    const tokens = ts.createScanner(
      ts.ScriptTarget.Latest,
      false,
      ts.LanguageVariant.Standard,
      compact,
    );
    let normalized = '';
    while ((token = tokens.scan()) !== ts.SyntaxKind.EndOfFileToken) {
      normalized +=
        token === ts.SyntaxKind.WhitespaceTrivia ? ' ' : tokens.getTokenText();
    }
    text = text.slice(0, start) + normalized.trimEnd() + ' ' + text.slice(end);
  }

  return text;
}

// Separate logical sections without changing expressions or executable code.
function separateSections(text, filename) {
  const source = ts.createSourceFile(
    filename,
    text,
    ts.ScriptTarget.Latest,
    true,
    filename.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const insertions = new Set();
  const isMethod = (node) => ts.isFunctionDeclaration(node) ||
    (ts.isVariableStatement(node) &&
      node.declarationList.declarations.some(
        (declaration) => declaration.initializer &&
          (ts.isArrowFunction(declaration.initializer) ||
            ts.isFunctionExpression(declaration.initializer)),
      ));

  const isImport = (node) => ts.isImportDeclaration(node);
  const isVariable = (node) => ts.isVariableStatement(node) && !isMethod(node);

  function blankBefore(node, previousEnd) {
    const start = node.getStart(source);
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    if (!text.slice(previousEnd, lineStart).includes('\n\n')) {
      insertions.add(lineStart);
    }
  }

  function visit(node) {
    if (ts.isSourceFile(node) || ts.isBlock(node)) {
      const statements = node.statements;

      // A blank line inside components and methods introduces their body.
      if (
        ts.isBlock(node) &&
        ts.isFunctionLike(node.parent) &&
        statements.length
      ) {
        blankBefore(statements[0], node.getStart(source) + 1);
      }

      for (let i = 1; i < statements.length; i++) {
        const previous = statements[i - 1];
        const current = statements[i];
        const groupedImports = isImport(previous) && isImport(current);
        const groupedVariables = isVariable(previous) && isVariable(current);

        if (!groupedImports && !groupedVariables) {
          blankBefore(current, previous.end);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(source);

  for (const offset of [...insertions].sort((a, b) => b - a)) {
    text = text.slice(0, offset) + '\n' + text.slice(offset);
  }

  return text;
}

async function formatDirectory(directory) {
  let failures = 0;

  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;

    const filename = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      failures += await formatDirectory(filename);
      continue;
    }

    const info = await prettier.getFileInfo(filename, {
      ignorePath: '.prettierignore',
    });

    if (info.ignored || !info.inferredParser) continue;

    const original = await fs.readFile(filename, 'utf8');
    const config = await prettier.resolveConfig(filename);
    let formatted = await prettier.format(original, {
      ...config,
      filepath: filename,
    });

    if (/\.tsx?$/.test(filename)) {
      formatted = separateSections(formatted, filename);
    }

    if (/\.(?:[cm]?[jt]sx?)$/.test(filename)) {
      formatted = await singleLineImports(formatted, filename);
      formatted = singleLineDeclarations(formatted, filename);
    }

    if (original === formatted) continue;

    if (check) {
      console.error(`Formato pendiente: ${filename}`);
      failures++;
    } else {
      await fs.writeFile(filename, formatted);
      console.log(`Formateado: ${filename}`);
    }
  }

  return failures;
}

const failures = await formatDirectory('.');

if (check && failures) {
  process.exitCode = 1;
} else {
  console.log(check ? 'Formato correcto.' : 'Formato aplicado.');
}
