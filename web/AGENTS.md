# AGENTS.md — Convenções do projeto Blick

Documento de referência pra manter consistência entre sessões de trabalho
com IA e entre humanos.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5 (strict + `noUncheckedIndexedAccess`)
- Tailwind v4 (CSS-first, design tokens em `globals.css`, dois temas via `[data-theme]`)
- ESLint 9 (flat config) + Prettier
- Husky + lint-staged + commitlint
- Vitest (unit) + Playwright (E2E)

## Git

- Conventional Commits com scope obrigatório em kebab-case
- Exemplo: `feat(evaluation): add score radio group`, `chore(config): update tsconfig`
- Branches: `feat/*`, `fix/*`, `chore/*`, `refactor/*`, `test/*`, `docs/*`
- Uma responsabilidade por branch, PR por mudança, squash merge
- Branch base: `main` (protegida via CI: lint, typecheck, testes, build, E2E)

## Estrutura de pastas

- `src/app/` — rotas (App Router), incluindo `app/api/` (Route Handlers,
  proxy pra API, nunca lógica de negócio)
- `src/components/ui/` — primitivos reutilizáveis (Button, WeightBar, StatCard)
- `src/components/sections/` — composições específicas de domínio
  (EvaluationForm, TeamTree, ProfileGrid)
- `src/components/layout/` — estrutura persistente entre rotas (Sidebar,
  SidebarShell, NavLinks)
- `src/data/` — fonte única de dados estáticos (QUESTIONS, UPPER_SNAKE_CASE)
- `src/types/` — tipagens de domínio, camelCase, sem imports de UI
- `src/lib/` — utilities puras: `lib/api/` (client server-only + adapters),
  `lib/dashboard.ts`, `lib/profile.ts`, `lib/tree.ts`, `lib/week.ts`
- `src/lib/schemas/` — schemas Zod (só pra input de formulário, não leitura)

## Nomenclatura

- Componentes: PascalCase (`TeamTree.tsx`, `EvaluationForm.tsx`)
- Demais arquivos: kebab-case (`use-scroll.ts`, `db-cleanup.ts`)
- Identificadores: inglês sempre
- Conteúdo/strings pro usuário: pt-BR
- Constantes de config: UPPER_SNAKE_CASE

## TypeScript

- `type` sempre, nunca `interface`
- `import type { X }` pra tipos puros
- `as const satisfies Type` pra dados estáticos com validação
- Dados em `/data` e tipos em `/types` não importam de libs de UI
- Evitar `any`; usar `unknown` + narrowing quando tipo é incerto

## Camada de API (`lib/api/`)

- `server-only` no topo de `client.ts`, build quebra se importado em Client
  Component
- Fronteira raw (snake_case, vindo da API) → domínio (camelCase): adapters
  em `adapters.ts`, tipos `Raw*` nunca saem do módulo (barrel não reexporta)
- `ApiError` carrega status HTTP real; status `0` é convenção pra falha de
  rede/timeout
- Timeout via `AbortController` em toda chamada
- `cache: 'no-store'` em dado que muda por ação do usuário (avaliações);
  `revalidate` em dado estável (lista de funcionários)
- Zod só em input de formulário, nunca em leitura de resposta da API própria

## Identidade e autorização

- Sem login completo (fora de escopo do case). Líder identificado via
  cookie `leader_id`, **httpOnly**, gravado por Route Handler depois de
  validar contra `GET /employees`
- `leader_id` nunca vem do body/query controlado pelo cliente em mutação;
  sempre lido do cookie no servidor
- Toda leitura de hierarquia no backend valida a relação real
  (`is_subordinate`, `ensure_can_view_team`), não confia no parâmetro

## Server vs Client Components

- Server por padrão; `'use client'` só com hook, event handler, browser API
  ou lib client-only
- Componente grande com uma parte interativa pequena: extrai a parte pra
  sub-componente Client, mantém o resto Server
- Estado que precisa resetar por navegação usa `key={pathname}` no
  componente filho, não `useEffect` escrevendo estado (ver `SidebarShell`)

## Acessibilidade

- Target: WCAG 2.1 AA
- Ícones decorativos: `aria-hidden="true"`
- Item de navegação ativo: `aria-current="page"`
- `prefers-reduced-motion` respeitado (ver `globals.css`)
- Foco visível em todo elemento interativo (`focus-visible:outline-*`, no
  `BASE_STYLES` do `Button`, não repetido por variante)
- Contraste mínimo 4.5:1 em texto normal

## Testes

- Unit (Vitest): funções puras com fronteira sensível (`dashboard.ts`,
  `profile.ts`, `tree.ts`, `week.ts`). Não testar adapters (mapeamento
  mecânico) nem componentes isolados (E2E já cobre o fluxo real)
- E2E (Playwright): happy path + bad path, IDs de funcionário reservados
  (não usar em teste manual), banco limpo via `global-setup`/`global-teardown`
- Regra prática: sempre que um bug real aparecer num arquivo sem teste,
  escreve o teste que teria pego, não só corrige o sintoma

## Design tokens (`globals.css`)

- Cores: `--color-bg`, `--color-surface`, `--color-border`, `--color-text`,
  `--color-text-muted`, `--color-accent` — dois valores (dark/light) via
  `[data-theme]`, `@theme inline` só aponta pra variável, nunca hexadecimal
  direto
- Fontes: `--font-sans` (Instrument Sans), `--font-mono` (IBM Plex Mono) —
  sem serif, produto é denso em dado, não editorial
- Assinatura visual: régua de peso (`WeightBar`) reflete a rubrica real de
  avaliação, não decoração
