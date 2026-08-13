<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# CLAUDE.md — Convenções do projeto

Documento de referência pra manter consistência entre sessões de trabalho com IA e entre humanos.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5 (strict + noUncheckedIndexedAccess)
- Tailwind v4 (CSS-first, design tokens em globals.css)
- ESLint 9 (flat config) + Prettier
- Husky + lint-staged + commitlint

## Git

- Conventional Commits com scope obrigatório em kebab-case
- Exemplo: `feat(hero): add cta button`, `chore(config): update tsconfig`
- Branches: `feat/*`, `fix/*`, `chore/*`, `refactor/*`, `test/*`
- Branch base: `main` (protegida via CI verde)

## Estrutura de pastas

- `src/components/ui/` — primitivos reutilizáveis
- `src/components/sections/` — composições específicas
- `src/components/layout/` — Nav, MenuOverlay
- `src/data/` — fonte única de dados (UPPER_SNAKE_CASE constants)
- `src/types/` — tipagens compartilhadas
- `src/lib/` — utilities puras
- `src/hooks/` — custom hooks

## Nomenclatura

- Componentes: PascalCase (`Button.tsx`, `Hero.tsx`)
- Demais arquivos: kebab-case (`cta.ts`, `use-scroll.ts`)
- Identifiers: inglês sempre
- Conteúdo/strings para usuário: pt-BR
- Constantes de config: UPPER_SNAKE_CASE

## TypeScript

- `import type { X }` pra tipos puros
- `as const satisfies Type` pra dados estáticos com validação
- Dados em `/data` e tipos em `/types` não importam de libs de UI
- Evitar `any`; usar `unknown` + narrowing quando tipo é incerto

## Acessibilidade

- Target: WCAG 2.1 AA
- Ícones decorativos: `aria-hidden`
- `prefers-reduced-motion` respeitado
- Contraste mínimo 4.5:1 em texto normal

## Performance budget

- Lighthouse target: Performance 98, A11y 100, Best Practices 100, SEO 100
- Bundle JS inicial: < 150kb gzipped
- LCP: < 1.5s
- CLS: 0

## Design tokens (globals.css)

- Cores: sand, accent, bg, etc (prefixo `--color-*`)
- Fontes: `--font-serif` (Fraunces), `--font-sans` (DM Sans)
- Gerar classes Tailwind automaticamente via `@theme inline`
