# History

Reverse-chronological log of documentation syncs. Prepend new entries — never rewrite. Each entry describes a session's logical changes (not per-file diffs).

---

## 2026-04-15 — Notifications & messaging build-out

**Module:** notifications
**Commits:** uncommitted (working tree). Session builds on `a428f43`.
**Files touched:** 9 — 6 new pages + Navbar/Sidebar/routes wiring.

**What changed:**

- **Announcements (Bank Admin).** Added full history/detail pair around the existing composer. `/announcements` lists every message with a filter bar (status, channel, date-range), a progress-bar cell for delivered/read counts, and status-gated row actions (sent → Подробнее/Дублировать; scheduled → + Отменить; draft → Редактировать/Дублировать/Удалить). `/announcements/:id` shows 3 stat cards (Отправлено / Доставлено / Прочитано, green at 100% / amber below), a read-only message card, and a per-recipient delivery table.
- **Notification Delivery Log (Bank Admin).** New `/notification-log` with 4 stat cards (Bell blue / CheckCircle2 green / Clock amber / XCircle red), 4-way filter bar (type, channel, status, date-range), 15 seeded rows, and an inline-expand error detail row with a 3px red inset border. Wired to shared `useExportToast`.
- **Seller messaging (Org Admin).** New `/seller-messages` (list with action menu), `/seller-messages/new` (two-column composer with recipient radios, seller checkbox list, quick templates, send confirmation), `/seller-messages/:id` (55/45 message + compact stat stack + delivery table).
- **Routing.** 5 new routes in [routes.tsx](../src/app/routes.tsx). Sidebar gained 4 entries (`Правила уведомлений`, `Объявления`, `Лог доставки` under Bank `СИСТЕМА`; `Сообщения` under Org `УПРАВЛЕНИЕ`). `Сообщения` now points at the list route; the composer is reachable from its header button. Navbar `ORG_PATHS` appended `/seller-messages`.
- **Date/time patterns.** [AnnouncementComposePage](../src/app/pages/AnnouncementComposePage.tsx) now hosts a single-date popover calendar (`DatePickerField`) and a masked HH:MM input (`TimeField`) — both reusable patterns worth lifting to shared if a second page needs them.
- **Docs.** AI_CONTEXT / DATA_MODELS / ROUTES / ARCHITECTURE refreshed to reflect the 6 new pages and the `Rule`, `LogRow`, `AnnouncementRow`, `AnnouncementDetail`, `MessageRow`, `MessageDetail` interfaces.

**Follow-ups (known-incomplete):**
- Rule editor `onSave` is a no-op — the form doesn't write back to the rules array.
- Action menus that should delete or cancel (rule Удалить, announcement Отменить/Удалить, message Удалить) are placeholders without confirmation dialogs.
- Compose → History doesn't persist — each page owns an isolated seed array; a shared in-memory store would unify flows.
- Every `/.../:id` detail page returns the same mock payload regardless of the param. Keyed-off-useParams lookup is a dev handoff item.
- Navbar bell dropdown seed is frozen; it doesn't reflect rule fires or message sends.

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
