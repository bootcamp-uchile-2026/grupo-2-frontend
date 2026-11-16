// Tipos de la API simulada (server/index.mjs).
export function startApi(
  port?: number,
): Promise<import('node:http').Server | null>;
