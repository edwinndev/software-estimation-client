<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Guías de desarrollo

## Sintaxis

- Siempre funciones flecha.

## UI

- No modificar `globals.css`.
- Usar componentes **shadcn/ui** (instalar con CLI). No usar `asChild`.

## Estructura

```
src/enumeration/          Enums de dominio (un archivo cada uno)
src/lib/api/              Cliente HTTP + JWT
src/features/{feature}/
  ui/  hooks/  services/  schemas/  types/  index.ts
```

- `index.ts` exporta solo la vista principal (`*-view`).
- UI en piezas pequeñas dentro de `ui/`.
- Formularios: TanStack Form + Zod (`schemas/`).
- Datos: TanStack Query en `hooks/` (sin toasts ahí).
- Toasts solo desde `ui/` con `toast.add`.
- `services/`: solo llamar endpoints (`apiClient`). Sin validación ni reglas.
- Enums en `src/enumeration/`. Tipos DTO/modelo en `types/`.
- Listados: `QueryRequest` → `PaginatedResponse<T, "{entity}Response">`.

## Git

- Rama: `feature/{feature}`
- Commits en inglés, máx. 15 palabras, prefijos: `feat`, `fix`, `ref`, `style`
