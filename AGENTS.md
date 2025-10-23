# Repository Guidelines

## Project Structure & Module Organization
- `plugin-src/`: Figma plugin code (entry `code.ts`, handlers in `handlers/`).
- `ui-src/`: React + Vite UI (entry `main.tsx`, views in `app/`, components in `components/ui/`).
- `dist/`: Build outputs (`code.js`, `index.html`). Do not edit.
- `manifest.json`: Figma plugin manifest (points to `dist` assets).
- `types/`: Shared TypeScript types.

## Build, Test, and Development Commands
- `pnpm dev`: Watch TypeScript, bundle plugin, and run Vite for UI. Use for local development with Figma.
- `pnpm build`: Production build for UI and plugin (`dist/`).
- `pnpm test`: Type-check both projects then build (no unit tests).
- `pnpm format`: Format all files with Prettier.
- Helpful: `pnpm tsc:watch`, `pnpm build:watch` for targeted watching.

Example: after `pnpm dev`, load the plugin in Figma using this folder (manifest points to `dist`).

## Coding Style & Naming Conventions
- Language: TypeScript with `strict` mode in both `plugin-src` and `ui-src`.
- Style: Prettier default config; run `pnpm format` before PRs.
- React: Functional components; component identifiers in PascalCase; variables/functions in camelCase.
- Files: keep `components/ui` files kebab-case; views in `ui-src/app` are lower-case (e.g., `home.tsx`).
- Imports: use path aliases `@/*` in UI per `tsconfig.json`.

## Testing Guidelines
- No runtime tests yet; CI gate is type-check + build via `pnpm test`.
- Add tests only if introducing complex logic; colocate under the relevant package and document how to run them in your PR.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:` (see `git log`).
- PRs must include: clear description, linked issues, and screenshots/GIFs for UI changes (Figma panel states are helpful).
- Keep changes atomic and scoped; update docs if commands or flows change.

## Security & Configuration Tips
- Do not hardcode API keys. The plugin stores the OpenRouter key via settings/handlers; never commit secrets.
- Manifest allows network to `https://openrouter.ai/api/v1/`; update cautiously and justify changes in PRs.
