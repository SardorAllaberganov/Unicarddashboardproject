# History

Reverse-chronological log of documentation syncs. Prepend new entries — never rewrite. Each entry describes a session's logical changes (not per-file diffs).

---

## 2026-04-15 (pm) — Notification rule lifecycle + detail-page action mirroring

**Module:** notifications
**Commits:** uncommitted (working tree). Session builds on `9999ff4`.
**Files touched:** 11 — 1 new page + 8 modified pages + 1 modified shared hook + routes + lessons.

**What changed:**

- **Delete rule confirmation** ([NotificationRulesPage](../src/app/pages/NotificationRulesPage.tsx)). Replaced the silent delete with a 480px destructive modal — rule info card (3px red left border, warning-bg tint, channel/recipient pills, "Последний раз сработало" caption) + consequence list. Trash2 header, Outline/Destructive footer.
- **Duplicate rule flow.** Added a confirmation modal (source rule card + pre-filled "(копия)" title input + "Создать в неактивном состоянии" checkbox) and a success toast with an "Открыть →" ghost action that navigates to the editor.
- **Rule editor moved to a page** ([NotificationRuleEditorPage](../src/app/pages/NotificationRuleEditorPage.tsx)) at `/notification-rules/new` and `/notification-rules/:id/edit`. Two-column layout: form left, **live preview** card (Bell avatar + `🔔 {name}` + template with sample-value variable substitution) + summary card (Событие / Каналы / Получатели / Расписание / Статус) right. Sticky preview on desktop, stacks under 1100px. Form hydrates from `location.state.preFilled` → `INITIAL_RULES[id]` → `EMPTY_FORM`. Rule's data types (`Rule`, `INITIAL_RULES`) are now exported from [NotificationRulesPage](../src/app/pages/NotificationRulesPage.tsx).
- **Template variable chips.** Replaced the placeholder-stuffed "Доступные переменные: …" textarea with a short placeholder + clickable `{token}` chips under the field that insert at the current caret position via `setSelectionRange`.
- **Announcement history: cancel scheduled + delete draft.** Added `CancelScheduledModal` (amber XCircle header, warning-bg announcement card with scheduled date / recipients / channels) and `DeleteDraftModal` (440px, Trash2 red header, plain confirmation). Converted `ROWS` to state so cancel flips status `scheduled → draft` and clears the date in-place.
- **Announcement detail: status-gated actions.** Derives `status` from `:id` (`4` → scheduled, `5` → draft, else sent). Header action group swaps buttons (sent → Дублировать; scheduled → Дублировать + Отменить отправку in amber; draft → Редактировать + Дублировать + Удалить). Stats cards and delivery table only render for sent; scheduled + draft get info strips explaining next steps.
- **Seller message history + detail: delete confirmation.** `DeleteMessageModal` mirrors the same destructive pattern. Detail page gained Дублировать + Удалить header actions (matches the new "detail mirrors the row's ⋯ menu" rule).
- **`usePopoverPosition` re-anchors on scroll.** Was closing on any captured scroll event, which broke dropdowns inside scrollable modals (rule editor trigger select). Now re-reads `getBoundingClientRect()` and re-applies the auto-flip math on scroll/resize. Closes only if the trigger leaves the viewport.
- **CheckboxRow label-click bug fixed** across four files ([NotificationRulesPage](../src/app/pages/NotificationRulesPage.tsx), [AnnouncementComposePage](../src/app/pages/AnnouncementComposePage.tsx), [SellerMessageComposePage](../src/app/pages/SellerMessageComposePage.tsx), [OrgSettingsPage](../src/app/pages/OrgSettingsPage.tsx)). The `<label>` wrapped two spans with no native input — clicking text did nothing. Moved `onClick={toggle}` to the label element itself.
- **Lessons:** Added `label-wrapper needs explicit onClick` and `detail pages must mirror their row's ⋯ menu` rules to [tasks/lessons.md](../tasks/lessons.md).

**Follow-ups (known-incomplete):**
- Rule editor's Сохранить still navigates back without persisting — the new `FormState` doesn't write back to the exported `INITIAL_RULES`.
- Dead code left in [NotificationRulesPage](../src/app/pages/NotificationRulesPage.tsx): the old `RuleEditorModal` function, its form primitives (`FormSection`, `TextInput`, `TextArea`, `TemplateField`, `TriggerSelect`, `DigestSelect`, `AdvanceDaysChips`, `CheckboxRow`, `RadioRow`), plus `FormState` / `EMPTY_FORM` / `ruleToForm` / `TRIGGER_GROUPS`. Vite/esbuild tree-shakes them from the bundle; cleanup can be a separate refactor.
- Duplicate "Открыть →" toast passes the new rule through `location.state`, but since rule state lives per-page, re-entering the editor via a deep link won't find the new id in `INITIAL_RULES`. The location-state path is the only hydration route that works for freshly duplicated rules.
- `DeleteDraftModal` and `DeleteMessageModal` are near-duplicate components in announcement vs seller-message codepaths; could be lifted into a shared `<ConfirmDialog />` if a fourth copy appears.

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
