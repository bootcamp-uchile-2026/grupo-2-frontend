# Formato obligatorio del proyecto

- Mantener cada declaración `import` completa en una sola línea, sin límite de longitud.
- Mantener la firma de cada componente React, función, método y clase en una sola línea, incluidos parámetros desestructurados y tipos de props. El cuerpo permanece en varias líneas.
- No volver a dividir estas declaraciones para ajustarlas al ancho de Prettier.
- Conservar líneas en blanco entre secciones lógicas del cuerpo.
- Aplicar `npm run format` después de editar y comprobar con `npm run format:check`. Usar el formateador del proyecto, no Prettier directamente.
- Respetar cambios existentes del usuario. `old/` conserva el Hito 1 como referencia histórica.
