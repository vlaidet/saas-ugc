# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About the Project

**UGC Studio** — SaaS platform for UGC (User-Generated Content) creators to manage brand relationships, track prospects, and optimize conversions. French-first product deployed at `ugcstudio.app`.

Core feature: **Pipeline** — Kanban/list views to track brands through statuses (À contacter → Contactée → En discussion → Deal signé / Refus / Blacklist), with contact history, channel tracking (Instagram, Email, LinkedIn, Form), and brand niche categorization.

## Commands

- `pnpm dev` — Dev server with Turbopack
- `pnpm build` — Production build
- `pnpm ts` — TypeScript type checking
- `pnpm lint` — ESLint with auto-fix
- `pnpm clean` — Lint + typecheck + format
- `pnpm test:ci` — Unit tests (Vitest, non-interactive) — tests in `__tests__/`
- `pnpm test:e2e:ci` — E2E tests (Playwright, headless) — tests in `e2e/`
- `pnpm prisma:migrate` — Run Prisma migrations
- `pnpm prisma:generate` — Generate Prisma client
- `pnpm prisma:seed` — Seed database
- `pnpm stripe-webhooks` — Forward Stripe webhooks locally
- `pnpm knip` — Detect unused code

**Never use** `pnpm test` or `pnpm test:e2e` (interactive mode, incompatible with Claude Code).

## Architecture

### Tech Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · TailwindCSS v4 + Shadcn/UI · PostgreSQL + Prisma 7 · Better Auth (orgs, RBAC) · TanStack Form + Zod · TanStack Query · Stripe · Resend · Redis (ioredis) · Zustand · nuqs

### App Router Structure

- `app/(layout)/` — Public pages (landing, about, changelog, contact, docs, legal, payments)
- `app/auth/` — Auth flows (signin, signup, verify, forget-password, new-user)
- `app/(logged-in)/` — Protected user account pages
- `app/orgs/[orgSlug]/(navigation)/` — Organization workspace (dashboard, settings, billing, users, pipeline)
- `app/admin/` — Admin panel (organizations, users, feedback)
- `app/@modal/` — Parallel routes for modal overlays
- `app/pipeline/` — Pipeline feature route (org-independent)

### Key Patterns

**Proxy (NOT middleware.ts)**: `proxy.ts` at root handles auth validation, org membership checks, and redirects. Helpers in `src/lib/auth/proxy-utils.ts`. Never create `middleware.ts`.

**Server Actions**: Use `next-safe-action` with 4 pre-configured clients in `src/lib/actions/safe-actions.ts`:
- `action` — Public (no auth)
- `authAction` — Requires authenticated user (`ctx.user`)
- `orgAction` — Requires org membership + RBAC (`ctx.org`, supports `metadata.roles` and `metadata.permissions`)
- `adminAction` — Requires admin role

Actions go in `.action.ts` files.

**API Routes**: Use `next-zod-route` with 3 handlers in `src/lib/zod-route.ts`:
- `route` — Public
- `authRoute` — Authenticated
- `orgRoute` — Org-scoped with permissions

**Dialog Manager**: Zustand-based global modal system in `src/features/dialog-manager/`. Three types: `confirm`, `input`, `custom`. Use `dialogManager.confirm(...)` / `dialogManager.input(...)` / `dialogManager.custom(...)`.

**HTTP Client**: All client-side API calls must use `src/lib/up-fetch.ts` (wrapper around `up-fetch` with Zod validation). Never use raw `fetch`.

**Environment Validation**: `src/lib/env.ts` using `@t3-oss/env-nextjs` for runtime env var validation.

### Multi-Tenancy

Organization-based data access with `[orgSlug]` dynamic segments. Auth creates an org automatically on signup. Org membership validated in proxy with Redis caching (5 min TTL). RBAC via Better Auth organization plugin.

## Important Files

- `src/lib/auth.ts` — Better Auth config (providers, org plugin, Stripe hooks)
- `src/lib/actions/safe-actions.ts` — Server action clients with auth/org/admin contexts
- `src/lib/zod-route.ts` — API route handlers with Zod validation
- `src/lib/up-fetch.ts` — Type-safe HTTP client wrapper
- `src/lib/env.ts` — Environment variable validation
- `src/features/dialog-manager/` — Global dialog system
- `src/features/form/tanstack-form.tsx` — TanStack Form components
- `src/site-config.ts` — App name, domain, brand colors, feature flags
- `proxy.ts` — Request proxy (replaces middleware.ts)
- `prisma/schema/schema.prisma` — Main database schema
- `prisma/schema/better-auth.prisma` — Better Auth schema (auto-generated)

## TypeScript Imports

Always use path aliases instead of relative imports:

- `@/*` → `./src/*` (e.g., `@/components/ui/button`)
- `@email/*` → `./emails/*`
- `@app/*` → `./app/*`

## Workflow

**BEFORE editing any files, you MUST read at least 3 files** — similar functionality files + imported dependency implementations — to ensure consistency with existing patterns. This is non-negotiable.
