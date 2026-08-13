# Next.js Template

Personal Next.js starter template with strict tooling, designed for production-grade projects.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5 (strict + noUncheckedIndexedAccess)
- **Styling**: Tailwind CSS v4 (CSS-first with `@theme inline`)
- **Tooling**: ESLint 9 (flat config), Prettier, Husky, lint-staged, commitlint
- **CI/CD**: GitHub Actions

## What's included

- ✅ TypeScript strict configuration with extra rules
- ✅ ESLint 9 flat config integrated with Prettier
- ✅ Husky + lint-staged blocking bad commits
- ✅ Conventional Commits enforced via commitlint
- ✅ GitHub Actions CI (format, lint, typecheck, build)
- ✅ Folder structure (`components/ui`, `components/sections`, `components/layout`, `data`, `types`, `lib`, `hooks`)
- ✅ `cn()` utility for class merging
- ✅ Modern browserslist config

## What's NOT included (intentionally)

- No design system — add yours
- No components — add yours
- No data — add yours

## Usage

Click **Use this template** at the top of the GitHub page, or:

```
npx create-next-app@latest my-app-name --example https://github.com/felipedev90/next-starter
```

## Scripts

| Script                 | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Development server with Turbopack |
| `npm run build`        | Production build                  |
| `npm run lint`         | Run ESLint                        |
| `npm run lint:fix`     | ESLint with auto-fix              |
| `npm run typecheck`    | TypeScript check                  |
| `npm run format`       | Format with Prettier              |
| `npm run format:check` | Check formatting                  |

## Conventions

- Conventional Commits with required scope (`feat(scope): description`)
- Branches: `feat/*`, `fix/*`, `chore/*`, `refactor/*`, `test/*`
- TypeScript: `type` over `interface`, `import type` for type-only imports
- Data files use `as const satisfies Type`

---

Built by [Felipe Augusto](https://devfelipeaugusto.com.br)
