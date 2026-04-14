Sync the project documentation to reflect the current state of the code after a feature has landed.

Run this after a significant feature, refactor, or bug-fix session — not after every commit. Usage:

- `/doc_sync` — scan the whole working tree against `main` for changes
- `/doc_sync [module]` — narrow the scan to one module (e.g. `/doc_sync reports`, `/doc_sync sellers`, `/doc_sync notifications`). Interpret the argument as a folder hint or a feature keyword.

### Step 1: Detect what changed
Run in parallel:
- `git log --oneline origin/main..HEAD` — commits since the remote tip
- `git diff --name-only origin/main...HEAD` — touched files
- `git diff --stat origin/main...HEAD` — insertion/deletion size per file

If the branch is already pushed and clean, fall back to `git log --oneline -20` and inspect the last session's commits.

Classify touched files:
- `src/app/pages/*` → **pages**
- `src/app/components/*` → **components / shared primitives**
- `src/app/routes.tsx` → **routing**
- `src/styles/*`, `tokens.ts` → **design tokens / styles**
- `docs/*`, `tasks/*` → already-documentation, skip
- Anything else → flag for review

If a `[module]` argument was given, only keep files whose path or name contains that keyword.

### Step 2: Update `docs/AI_CONTEXT.md`
This file is the canonical snapshot read at the start of new AI sessions. It must always reflect current reality.

Structure to maintain:
```
# AI Context — Moment Card KPI Platform

Last synced: YYYY-MM-DD

## Current state
- Short paragraph: what the app does today, what roles are supported,
  what major feature areas exist.

## Feature map (what lives where)
- Bullet list grouped by area (Bank Admin / Org Admin / Shared)
  with the route and the primary page file for each.

## Shared primitives
- Shared hooks, components, tokens and what they're for.

## Data model (mock data)
- Which interfaces live in which page files. Note that this is a
  mock-data SPA — no real backend.

## Known gotchas
- Short list of non-obvious rules (e.g. overflow-x clipping, route +
  sidebar + navbar must be wired together).
```

Regenerate sections from the live files — don't just append. Always read `src/app/routes.tsx`, the two sidebar configs in `Sidebar.tsx`, and the ORG_PATHS array in `Navbar.tsx` to keep the feature map honest.

### Step 3: If data models / interfaces changed → update `docs/DATA_MODELS.md`
This project has no database. `DATA_MODELS.md` catalogues the TypeScript interfaces and mock-data arrays that play the backend role.

Trigger: any page added a new `interface Foo {}` that another page might need to know about, or a mock-data shape changed (e.g. a new field on `CardRow`, `SellerOption`, `UserRow`, `WdRow`).

For each listed interface: file path, purpose, fields, and where it's consumed.

### Step 4: If routes or component prop contracts changed → update `docs/ROUTES.md`
This project has no REST API. `ROUTES.md` documents the react-router paths and the "contract" of shared components (prop shape, what callbacks they emit).

Trigger: `src/app/routes.tsx` was touched, or any exported component's prop signature changed (e.g. `Navbar`, `Sidebar`, `DateRangePicker`, `EmptyState`, `useExportToast`, `usePopoverPosition`).

Each route entry: path, role (bank/org/shared), component, query-param contract (e.g. `?from=org`). Each shared component: exported name, props, usage example, what it renders.

### Step 5: If layer structure or dependencies changed → update `docs/ARCHITECTURE.md`
Trigger: `package.json` changed, a new top-level folder appeared, a shared primitive was added that others depend on, or the role-detection / navigation logic was rearranged.

Maintain these sections:
- **Stack** — framework, build tool, router, styling approach
- **Folder layout** — `/src/app/pages`, `/src/app/components`, `/src/app/components/ds`, `/src/app/components/ui`, `/src/styles`, `/tasks`, `/docs`
- **Role detection** — how Bank vs Org admin is inferred from the URL
- **Theming** — how light/dark tokens flow
- **Shared primitives** — popover hook, export toast, empty state, etc.

### Step 6: Checkpoint `docs/HISTORY.md`
Append (never rewrite) an entry at the top of the file:

```
## YYYY-MM-DD — <short session summary>

**Module:** [module name or "all"]
**Commits:** <short hashes since last sync>
**Files touched:** <count> — see list below
**What changed:**
- Bullet per logical feature (not per file).
**Follow-ups:** (optional)
- Anything known-incomplete or deferred.
```

If `HISTORY.md` does not exist, create it with a short intro paragraph explaining its purpose.

### Step 7: Lessons
If this session fixed a critical bug or landed a non-obvious pattern that future AI sessions need to know about, append an entry to [tasks/lessons.md](tasks/lessons.md) using the template at the top of that file. Do NOT duplicate lessons that are already there — check for similar entries first.

Good lesson triggers:
- A user correction that changed how you'd approach the same task next time.
- A browser/framework quirk that bit us (e.g. overflow-x forcing overflow-y: auto).
- A rule that applies to many future features (e.g. "every monetary input must be masked").

### Step 8: Report back to the user
Finish with a short summary in chat:
- What was synced (files updated)
- Any documentation gaps or inconsistencies you spotted but didn't fix
- If anything in the code looked suspicious during the sync, call it out — don't silently fix it

### Rules
- Never invent documentation content. Every fact must be traceable to a file in the repo.
- Never leave stale TODO markers like "coming soon" in docs — either document what exists or omit the section.
- Keep each doc file under ~300 lines. If a file grows past that, split it (e.g. `DATA_MODELS.md` → per-domain files).
- Docs must use relative markdown links (e.g. `[routes.tsx](../src/app/routes.tsx)`) so they stay clickable in IDEs and on GitHub.
- Do NOT commit automatically — end by showing the updated file list and let the user invoke `/commit`.
