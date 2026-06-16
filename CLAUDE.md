# Developer Reference & Guidelines — Carbon Print AI

Quick instructions, style guides, and operational details for developing inside this repository.

## Overview & Scope

**Carbon Print AI** is a browser-only tool for tracking carbon footprints: users complete a brief profile, see interactive bar/donut breakdowns of their annual CO₂e impact, view game-theoretic attribution (SHAP values) showing why their footprints deviate from averages, set targets, and track milestones over time. 

Status: Fully built and optimized (live at https://carbonprintai.vercel.app).

## Code Quality Status (verified 2026-06-16)

The codebase is fully refactored and CI-gated on Node 20 (see `.github/workflows/ci.yml`).

**Coverage** (`npm run test:coverage`, 104 tests across 14 test files):

| Module | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| `calculator.ts` | 100% | 100% | 100% | 100% |
| `shap.ts` | 100% | 100% | 100% | 100% |
| `tips-engine.ts` | 100% | 100% | 100% | 100% |
| `storage.ts` | 100% | 100% | 100% | 100% |
| **All files** | **100%** | **100%** | **100%** | **100%** |

**`console.log`** — zero occurrences in `src/`. `console.warn` and `console.error` are allowed by ESLint config (the `no-console` rule has an explicit `allow: ["warn","error"]` exception).

**No-console rule** — set to `"error"` (not warn) so any future `console.log` introduction fails CI immediately.

**Duplicate utilities** — consolidated. All rounding goes through `src/lib/number.ts:round()`. All emission coefficients live in `src/lib/emission-factors.ts` (imported by `calculator.ts`, `shap.ts`, `tips-engine.ts`, and `comparisons.ts`). No inline magic numbers remain in domain logic.



## Architectural Principles

- **React Server Components (RSC)**: Used by default for page shells and layout headers/footers to minimize client payload.
- **Client-Side Islands**: Use `'use client'` only where local storage, forms, state transitions, or charting libraries (Recharts) are required.
- **Pure Domain Engine**: All calculations are pure, framework-free functions located in `src/lib` to allow isolated unit testing.
- **Zero Backend Dependency**: No external database or API endpoints exist. Browser persistence uses validated, schema-enforced `localStorage` (`src/lib/storage.ts`).

---

## Data Validation & Contracts

Zod schemas in `src/lib/schemas.ts` are the absolute source of truth for types and shapes. Infer TypeScript types from schemas rather than duplicate declarations.

### Main Functions (`src/lib/`):
- `calculateFootprint(input: FootprintInput): FootprintResult`
- `calculateShap(input, result): ShapExplanationItem[]`
- `generateTips(input, result, options?): Tip[]`
- `storage.ts`: Handles secure reading and fallback migration of inputs/milestones.

---

## Design System: "Cyber-Biophilic"

The UI uses a modern, high-contrast dark theme. Always consume CSS custom variables and Tailwind utilities (do not hardcode custom hex colors in markup):
- **Primary Color**: `#10b981` (emerald green)
- **Secondary Color**: `#06b6d4` (cyan)
- **Accent Color**: `#6366f1` (indigo)
- **Backgrounds**: Deep charcoal slate (`#0b0f19` / `#131a26`)
- **Text Color**: Light slate (`#f1f5f9`)

All charts must provide a keyboard-accessible fallback (`<details>` summary containing structured HTML tables) and use colors mapping to variables.

---

## Technical Standards

- **Type Safety**: Strictly avoid `any` declarations. Use strict TypeScript configurations.
- **Strict Headers**: Content Security Policy (CSP) includes per-request nonces for Next.js scripts to prevent XSS.
- **Reliable Persistence**: Every key read from `localStorage` is verified against Zod schemas; malformed configurations default to a safe null state.
- **Accessibility Compliance**: WCAG 2.1 AA targets (labels, fieldsets, keyboard tab ordering, 44px minimum touch sizes, skip-to-content links).

---

## CLI Workflow

Use these commands for local checks:

```bash
npm install          # Install dependencies
npm run dev          # Run hot-reloading dev server
npm run test         # Execute unit test suite (Vitest)
npm run typecheck    # Check TypeScript compiles
npm run lint         # Scan for lint errors (ESLint)
npm run build        # Build optimized production assets
```

---

## Development Conventions

- Use named exports for React components.
- Group unit test files adjacent to their matching source code file (e.g. `storage.test.ts` next to `storage.ts`).
- Avoid installing new external packages without justification to keep bundle weight and security exposure minimal.
