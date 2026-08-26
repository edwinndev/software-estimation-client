<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Mandatory Development Guidelines

## 1. Syntax and Functions
- Always use arrow functions for components, hooks, utilities, and functions.

## 2. Styling and Global CSS
- Do not modify `globals.css` (or `global.css`). Keep all global styles intact and use component-level styling/Tailwind utility classes.
- Always use **shadcn/ui** components.
- Install shadcn/ui components via CLI commands (e.g., `npx shadcn@latest add <component-name>`).
- Avoid using `asChild` on shadcn components (e.g., `<Button asChild>`); style the child component directly (e.g., using `buttonVariants()`) or wrap cleanly.

## 3. Feature Architecture and Structure
All features must be implemented under the `src/features/{feature}` directory following this structure:

```
src/features/{feature}/
├── ui/
│   ├── {feature}-view.tsx
│   ├── component-one.tsx
│   └── component-two.tsx
├── hooks/
├── services/
├── schemas/
├── types/
└── index.ts
```

### Module Rules:
- **Feature Entrypoint (`index.ts`)**: `src/features/{feature}/index.ts` must export only the main UI view component named `{feature}-view.tsx` (e.g., `users-view.tsx` -> `UsersView`).
- **UI Modularization (`ui/`)**: Avoid large, monolithic files. Break down views into small, focused, and reusable sub-components placed inside `src/features/{feature}/ui/` (e.g., `component-one.tsx`, `component-two.tsx`).
- **Forms & Validation**: Use **TanStack Form** along with **Zod** for all form handling and validation. Define Zod schemas inside `schemas/`.
- **Hooks & State Management**: Always use **TanStack Query** (React Query) within the `hooks/` directory for data fetching, mutations, and caching.
- **Services (API Layer)**: Implement services in `services/` using `localStorage` for now. Structure them as mock async API services to ensure seamless future transition to a backend API.
- **Types**: Define TypeScript interfaces/types inside `types/`.

## 4. GitFlow and Commit Guidelines

### Branch Naming Convention:
- Always create feature branches using the format: `feature/{feature}` (e.g., `feature/projects`, `feature/estimation`, `feature/costs`).

### Commit Message Guidelines:
- Write all commit messages in English.
- Keep commit messages concise (maximum 15 words).
- Use the following prefixes depending on the type of change:
  - **`feat`**: Introduces a new feature or functionality (e.g., `feat: add estimation view and sprint calculator`).
  - **`fix`**: Fixes a bug or unexpected behavior (e.g., `fix: resolve sidebar active item highlight`).
  - **`ref`**: Refactors code without changing external behavior (e.g., `ref: extract user table to separate component`).
  - **`style`**: Changes related to styling, formatting, or UI design adjustments without logic changes (e.g., `style: update color tokens in globals css`).


