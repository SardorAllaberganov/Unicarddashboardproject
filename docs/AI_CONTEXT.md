# AI Context — Moment Card KPI Platform

Last synced: 2026-04-15

## Current state

Moment Card KPI is a React 18 + TypeScript + Vite single-page app that serves two admin roles for a partner-distributed VISA card program:

- **Bank Admin** — oversees every partner organization, card batch, KPI config, reward payout, notification rule, and system announcement across the platform.
- **Organization Admin** — runs their own shop: sellers, card inventory, KPI conversion, UCOIN withdrawals, and direct messaging to sellers.

There is no backend. All data is mock TypeScript arrays inside each page file. Role is inferred from the URL path (and `?from=org` query param for shared pages like `/notifications` and `/card-detail/:id`). Light and dark themes are both wired via token objects in [tokens.ts](../src/app/components/ds/tokens.ts). The target resolution is 1920×1080 desktop.

## Feature map (what lives where)

### Shared (role-aware)

| Route | Page | Notes |
|---|---|---|
| `/` | [LoginPage](../src/app/pages/LoginPage.tsx) | Entry point, seeds demo credentials |
| `/card-detail/:id` | [CardDetailPage](../src/app/pages/CardDetailPage.tsx) | KPI Stepper Variant B + Block Card modal |
| `/notifications` | [NotificationsHistoryPage](../src/app/pages/NotificationsHistoryPage.tsx) | End-user notification inbox; `?from=org` toggles role |
| `/empty-states` | [EmptyStatesShowcasePage](../src/app/pages/EmptyStatesShowcasePage.tsx) | 6 canonical variants |
| `/design-system` | [DesignSystemPage](../src/app/pages/DesignSystemPage.tsx) | Full DS showcase (10 rows) |
| `/sidebar`, `/sidebar-org` | Sidebar showcases | |

### Bank Admin

| Route | Page |
|---|---|
| `/dashboard` | [BankAdminDashboardPage](../src/app/pages/BankAdminDashboardPage.tsx) |
| `/organizations` | [OrganizationsPage](../src/app/pages/OrganizationsPage.tsx) |
| `/organizations/new` | [NewOrganizationPage](../src/app/pages/NewOrganizationPage.tsx) |
| `/organizations/:id` | [OrgDetailPage](../src/app/pages/OrgDetailPage.tsx) |
| `/organizations/:id/edit` | [EditOrganizationPage](../src/app/pages/EditOrganizationPage.tsx) |
| `/card-batches` | [CardBatchesPage](../src/app/pages/CardBatchesPage.tsx) |
| `/card-batches/new` | [NewBatchWizardPage](../src/app/pages/NewBatchWizardPage.tsx) |
| `/card-batches/:id` | [CardBatchDetailPage](../src/app/pages/CardBatchDetailPage.tsx) |
| `/card-batches/:id/edit` | [EditCardBatchPage](../src/app/pages/EditCardBatchPage.tsx) |
| `/kpi-config` | [KPIConfigurationPage](../src/app/pages/KPIConfigurationPage.tsx) |
| `/card-import` | [CardImportPage](../src/app/pages/CardImportPage.tsx) |
| `/all-cards` | [AllCardsPage](../src/app/pages/AllCardsPage.tsx) |
| `/rewards` | [RewardsFinancePage](../src/app/pages/RewardsFinancePage.tsx) — Manual Adjustment modal |
| `/reports` | [ReportsExportPage](../src/app/pages/ReportsExportPage.tsx) |
| `/reports/preview/:reportId` | [ReportPreviewPage](../src/app/pages/ReportPreviewPage.tsx) |
| `/reports/overdue-kpi` | [OverdueKpiReportPage](../src/app/pages/OverdueKpiReportPage.tsx) |
| `/users` | [UsersManagementPage](../src/app/pages/UsersManagementPage.tsx) |
| `/notification-rules` | [NotificationRulesPage](../src/app/pages/NotificationRulesPage.tsx) — 14 rules × 4 tabs + editor modal |
| `/announcements` | [AnnouncementHistoryPage](../src/app/pages/AnnouncementHistoryPage.tsx) |
| `/announcements/new` | [AnnouncementComposePage](../src/app/pages/AnnouncementComposePage.tsx) — two-column composer with preview |
| `/announcements/:id` | [AnnouncementDetailPage](../src/app/pages/AnnouncementDetailPage.tsx) — delivery stats + per-recipient table |
| `/notification-log` | [NotificationDeliveryLogPage](../src/app/pages/NotificationDeliveryLogPage.tsx) — system-wide delivery audit |
| `/settings` | [SettingsPage](../src/app/pages/SettingsPage.tsx) — 6 tabs |

### Organization Admin

| Route | Page |
|---|---|
| `/org-dashboard` | [OrgAdminDashboardPage](../src/app/pages/OrgAdminDashboardPage.tsx) |
| `/sellers` | [SellersManagementPage](../src/app/pages/SellersManagementPage.tsx) |
| `/sellers/:id` | [SellerDetailPage](../src/app/pages/SellerDetailPage.tsx) |
| `/org-cards` | [OrgCardsPage](../src/app/pages/OrgCardsPage.tsx) |
| `/card-assignment` | [CardAssignmentPage](../src/app/pages/CardAssignmentPage.tsx) |
| `/card-assignment/bulk` | [BulkCardAssignmentPage](../src/app/pages/BulkCardAssignmentPage.tsx) |
| `/seller-messages` | [SellerMessageHistoryPage](../src/app/pages/SellerMessageHistoryPage.tsx) |
| `/seller-messages/new` | [SellerMessageComposePage](../src/app/pages/SellerMessageComposePage.tsx) — compose + quick templates |
| `/seller-messages/:id` | [SellerMessageDetailPage](../src/app/pages/SellerMessageDetailPage.tsx) |
| `/org-rewards` | [OrgFinancePage](../src/app/pages/OrgFinancePage.tsx) |
| `/org-withdrawals` | [OrgWithdrawalsPage](../src/app/pages/OrgWithdrawalsPage.tsx) |
| `/org-settings` | [OrgSettingsPage](../src/app/pages/OrgSettingsPage.tsx) |

## Shared primitives

| File | Export | Purpose |
|---|---|---|
| [usePopoverPosition.ts](../src/app/components/usePopoverPosition.ts) | `usePopoverPosition()` | Fixed-position anchored dropdown with auto-flip, measure-before-paint, click-outside + scroll/resize auto-close. Used by every `ActionDropdown`, every `FilterSelect`, and the bell dropdown. |
| [useExportToast.tsx](../src/app/components/useExportToast.tsx) | `useExportToast()` | Processing → Success/Error toast for every export flow. Returns `{ start, close, node }`. |
| [EmptyState.tsx](../src/app/components/EmptyState.tsx) | `<EmptyState />` | 64px muted icon + title + subtitle + up to 3 actions (primary / outline / ghost). Prompt 0 §16. |
| [Navbar.tsx](../src/app/components/Navbar.tsx) | `<Navbar />`, `ORG_PATHS`, `detectRole()` | Role switcher, theme toggle, notification bell dropdown, user menu. |
| [Sidebar.tsx](../src/app/components/Sidebar.tsx) | `<Sidebar role="bank"│"org" />` | Unified sidebar; 260px expanded / 68px collapsed. Auto-highlights active route. |
| [DateRangePicker.tsx](../src/app/components/DateRangePicker.tsx) | `<DateRangePicker />` | Range picker with quick-preset panel. |
| [ds/tokens.ts](../src/app/components/ds/tokens.ts) | `F`, `C`, `D`, `theme(dark)` | Fonts (Inter / DM Sans / JetBrains Mono), colors (light + dark sets). |

## Data model (mock data)

The full interface catalogue is in [DATA_MODELS.md](./DATA_MODELS.md). Each page owns its own seed arrays; no shared store. Highlights:

- **Cards** — `CardRow` ([AllCardsPage](../src/app/pages/AllCardsPage.tsx), [OrgCardsPage](../src/app/pages/OrgCardsPage.tsx)), `BatchCardRow` ([CardBatchDetailPage](../src/app/pages/CardBatchDetailPage.tsx)), `BatchCard`/`KpiConfig` ([CardBatchesPage](../src/app/pages/CardBatchesPage.tsx)), `KPIStepData` ([CardDetailPage](../src/app/pages/CardDetailPage.tsx)).
- **People** — `UserRow` ([UsersManagementPage](../src/app/pages/UsersManagementPage.tsx)), `SellerRow` ([SellersManagementPage](../src/app/pages/SellersManagementPage.tsx)), `SellerOption` (two different shapes across [CardAssignmentPage](../src/app/pages/CardAssignmentPage.tsx), [RewardsFinancePage](../src/app/pages/RewardsFinancePage.tsx), [SellerMessageComposePage](../src/app/pages/SellerMessageComposePage.tsx)).
- **Finance** — `WdRow` ([OrgWithdrawalsPage](../src/app/pages/OrgWithdrawalsPage.tsx)), `TxRow` ([OrgFinancePage](../src/app/pages/OrgFinancePage.tsx), [SellerDetailPage](../src/app/pages/SellerDetailPage.tsx)), `Transaction` ([RewardsFinancePage](../src/app/pages/RewardsFinancePage.tsx)).
- **Notifications & messaging** — `Notif` ([NotificationsHistoryPage](../src/app/pages/NotificationsHistoryPage.tsx)), `Rule` ([NotificationRulesPage](../src/app/pages/NotificationRulesPage.tsx)), `LogRow` ([NotificationDeliveryLogPage](../src/app/pages/NotificationDeliveryLogPage.tsx)), `AnnouncementRow` + `AnnouncementDetail` + `DeliveryRow` (across [AnnouncementHistoryPage](../src/app/pages/AnnouncementHistoryPage.tsx) and [AnnouncementDetailPage](../src/app/pages/AnnouncementDetailPage.tsx)), `MessageRow` + `MessageDetail` + `DeliveryRow` (across [SellerMessageHistoryPage](../src/app/pages/SellerMessageHistoryPage.tsx) and [SellerMessageDetailPage](../src/app/pages/SellerMessageDetailPage.tsx)).
- **Reports** — `OverdueRow` ([OverdueKpiReportPage](../src/app/pages/OverdueKpiReportPage.tsx)), `PreviewRow` ([ReportPreviewPage](../src/app/pages/ReportPreviewPage.tsx)).

## Known gotchas

- **`overflow-x: auto` also clips the y-axis.** Dropdown/popover menus inside a scrollable table must use `position: fixed`, never `position: absolute`. See [usePopoverPosition.ts](../src/app/components/usePopoverPosition.ts).
- **New page ≠ done until it's navigable.** A new page requires touching [routes.tsx](../src/app/routes.tsx), the right sidebar group in [Sidebar.tsx](../src/app/components/Sidebar.tsx), and (if it's an org page) the `ORG_PATHS` array in [Navbar.tsx](../src/app/components/Navbar.tsx).
- **Main content area = `width: 100%`, `padding: 28px 32px`, never `maxWidth`.** Enforced across every page.
- **No Tailwind font-size / font-weight / line-height classes.** Defaults live in [theme.css](../src/styles/theme.css).
- **Every monetary input must be masked.** Use `fmtUzs(parseInt(digits))` on each keystroke + `inputMode="numeric"` + `F.mono`. See [tasks/lessons.md](../tasks/lessons.md).
- **Every time input must be masked HH:MM.** Strip to digits, auto-insert colon after 2 digits, clamp hours ≤ 23 / minutes ≤ 59 on blur, render in `F.mono`. Pattern in [AnnouncementComposePage.tsx](../src/app/pages/AnnouncementComposePage.tsx) `TimeField`.
- **Every export button must route through `useExportToast`.** Never attach a plain `onClick` that silently "downloads".
- **Empty state views use `<EmptyState />`, not inline divs.** 6 canonical variants showcased at `/empty-states`.
- **Radio cards inside a row container use `flex: 1; min-width: 0`.** Gives equal widths and lets them shrink. Nested inputs should `stopPropagation` on their wrapper so the radio card doesn't swallow the click — but label/sub-label text must stay bubble-up so clicking the title selects the card.
- **Detail pages ignore `:id`.** Every `/.../:id` detail page in the notifications/messages area returns the same mock payload regardless of the URL param. This is intentional for the prototype; a real backend wiring would key off `useParams().id`.
- **Figma & `ImageWithFallback` are protected.** Do not modify [`ImageWithFallback.tsx`](../src/app/components/figma/ImageWithFallback.tsx) or `pnpm-lock.yaml`.
