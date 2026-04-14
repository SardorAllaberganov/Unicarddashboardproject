# History

Reverse-chronological log of documentation syncs. Prepend new entries — never rewrite. Each entry describes a session's logical changes (not per-file diffs).

---

## 2026-04-14 — Batch workflows, modals, shared primitives, and initial docs

**Module:** all
**Commits:** `ec919d4`..`4bb5482` (16 commits)
**Files touched:** 42 — 13,755 insertions, 772 deletions

**What changed:**

- **New pages.** Card Batch Detail (`/card-batches/:id`) with 5 tabs, Edit Card Batch (`/card-batches/:id/edit`) with Lock-icon immutable fields, Bulk Card Assignment (`/card-assignment/bulk`) with capacity-capped distribution, Report Preview (`/reports/preview/:reportId`) with sticky totals, Overdue KPI report (`/reports/overdue-kpi`), Notifications history (`/notifications`, role-aware via `?from=org`), Empty States showcase (`/empty-states`).
- **Modals.** Archive / Delete (typed DELETE) / Duplicate batch; Edit / Deactivate / Reassign seller; Block card; Inline "Зафиксировать" sale with success toast; Edit role / Block-Unblock user / Reset password; Approve / Reject withdrawal; Manual reward adjustment (masked amount input).
- **Shared primitives extracted.** `usePopoverPosition()` for fixed-position anchored dropdowns with auto-flip + measure-before-paint, migrated across 5 action-dropdowns. `useExportToast()` for processing → success/error export feedback, wired to every Экспорт button. `<EmptyState />` reusable primitive for zero-state views.
- **Navbar.** Added notification bell dropdown (400px panel, Все/Непрочитанные tabs, "Показать все" footer → `/notifications`).
- **Role-aware navigation.** `/notifications` and `/card-detail/:id` flip sidebar + navbar based on `?from=org`.
- **Routing.** `routes.tsx` grew by 70 lines for the new routes above. Sidebar + `ORG_PATHS` updated in lockstep with each new page.
- **Documentation.** Initial set: `AI_CONTEXT.md`, `DATA_MODELS.md`, `ROUTES.md`, `ARCHITECTURE.md`, `HISTORY.md`. `tasks/lessons.md` grew to 9 entries covering the overflow-x clipping gotcha, measure-before-paint anti-flicker, popover extraction, disabled buttons, auto-wired routes, empty-state consolidation, export feedback, and monetary input masking. `.claude/commands/doc_sync.md` slash command added.

**Follow-ups:**
- `fmtUzs` is redefined in multiple finance pages — consider hoisting to `ds/tokens.ts` or a shared `format.ts` helper.
- `SELLER_FULL_NAMES` / `SELLER_BALANCES` lookup tables live inline in pages that need them; a shared mock-data module could deduplicate, though it conflicts with the "each page owns its data" design-prototype convention.
- `BatchStatus` is declared separately in [CardBatchesPage.tsx](../src/app/pages/CardBatchesPage.tsx) (`'Черновик'`) and [EditCardBatchPage.tsx](../src/app/pages/EditCardBatchPage.tsx) (`'Архивирована'`). If these pages ever need to share batch data, reconcile the unions.
