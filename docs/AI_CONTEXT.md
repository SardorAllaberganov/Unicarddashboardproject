# AI Context — Moment Card KPI Platform

Last synced: 2026-04-14

## Current state

Moment Card KPI is a React 18 + TypeScript + Vite single-page app that serves two admin roles for a partner-distributed VISA card program:

- **Bank Admin** — oversees every partner organization, card batch, KPI config, and reward payout across the platform.
- **Organization Admin** — runs their own shop: sellers, card inventory, KPI conversion, and UCOIN withdrawals.

There is no backend. All data is mock TypeScript arrays inside each page file. Role is inferred from the URL path (and `?from=org` query param for shared pages like `/notifications` and `/card-detail/:id`). Light and dark themes are both wired via token objects in [tokens.ts](../src/app/components/ds/tokens.ts). The target resolution is 1920×1080 desktop.

## Feature map (what lives where)

### Shared (role-aware)

| Route | Page | Notes |
|---|---|---|
| `/` | [LoginPage](../src/app/pages/LoginPage.tsx) | Entry point, seeds demo credentials |
| `/card-detail/:id` | [CardDetailPage](../src/app/pages/CardDetailPage.tsx) | KPI Stepper Variant B + Block Card modal |
| `/notifications` | [NotificationsHistoryPage](../src/app/pages/NotificationsHistoryPage.tsx) | `?from=org` toggles role |
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
| `/rewards` | [RewardsFinancePage](../src/app/pages/RewardsFinancePage.tsx) — donut + Manual Adjustment modal |
| `/reports` | [ReportsExportPage](../src/app/pages/ReportsExportPage.tsx) |
| `/reports/preview/:reportId` | [ReportPreviewPage](../src/app/pages/ReportPreviewPage.tsx) |
| `/reports/overdue-kpi` | [OverdueKpiReportPage](../src/app/pages/OverdueKpiReportPage.tsx) |
| `/users` | [UsersManagementPage](../src/app/pages/UsersManagementPage.tsx) |
| `/settings` | [SettingsPage](../src/app/pages/SettingsPage.tsx) — 6 tabs |

### Organization Admin

| Route | Page |
|---|---|
| `/org-dashboard` | [OrgAdminDashboardPage](../src/app/pages/OrgAdminDashboardPage.tsx) |
| `/sellers` | [SellersManagementPage](../src/app/pages/SellersManagementPage.tsx) |
| `/sellers/:id` | [SellerDetailPage](../src/app/pages/SellerDetailPage.tsx) — edit/deactivate/reassign modals |
| `/org-cards` | [OrgCardsPage](../src/app/pages/OrgCardsPage.tsx) — inline sale recording |
| `/card-assignment` | [CardAssignmentPage](../src/app/pages/CardAssignmentPage.tsx) |
| `/card-assignment/bulk` | [BulkCardAssignmentPage](../src/app/pages/BulkCardAssignmentPage.tsx) |
| `/org-rewards` | [OrgFinancePage](../src/app/pages/OrgFinancePage.tsx) |
| `/org-withdrawals` | [OrgWithdrawalsPage](../src/app/pages/OrgWithdrawalsPage.tsx) — approve/reject modals |
| `/org-settings` | [OrgSettingsPage](../src/app/pages/OrgSettingsPage.tsx) |

## Shared primitives

| File | Export | Purpose |
|---|---|---|
| [usePopoverPosition.ts](../src/app/components/usePopoverPosition.ts) | `usePopoverPosition()` | Fixed-position anchored dropdown with auto-flip, measure-before-paint, click-outside + scroll/resize auto-close. Used by every `ActionDropdown`. |
| [useExportToast.tsx](../src/app/components/useExportToast.tsx) | `useExportToast()` | Processing → Success/Error toast for every export flow. Returns `{ start, close, node }`. |
| [EmptyState.tsx](../src/app/components/EmptyState.tsx) | `<EmptyState />` | 64px muted icon + title + subtitle + up to 3 actions (primary / outline / ghost). Prompt 0 §16. |
| [Navbar.tsx](../src/app/components/Navbar.tsx) | `<Navbar />`, `ORG_PATHS`, `detectRole()` | Role switcher, theme toggle, notification bell dropdown, user menu. |
| [Sidebar.tsx](../src/app/components/Sidebar.tsx) | `<Sidebar role="bank"│"org" />` | Unified sidebar; 260px expanded / 68px collapsed. Auto-highlights active route. |
| [DateRangePicker.tsx](../src/app/components/DateRangePicker.tsx) | `<DateRangePicker />` | Range picker with quick-preset panel. |
| [ds/tokens.ts](../src/app/components/ds/tokens.ts) | `F`, `C`, `D`, `theme(dark)` | Fonts (Inter / DM Sans / JetBrains Mono), colors (light + dark sets). |

## Data model (mock data)

The full interface catalogue is in [DATA_MODELS.md](./DATA_MODELS.md). Highlights:

- Card-related — `CardRow` ([AllCardsPage](../src/app/pages/AllCardsPage.tsx)), `BatchCardRow` ([CardBatchDetailPage](../src/app/pages/CardBatchDetailPage.tsx)), `BatchCard`/`KpiConfig` ([CardBatchesPage](../src/app/pages/CardBatchesPage.tsx)), `KPIStepData` ([CardDetailPage](../src/app/pages/CardDetailPage.tsx)).
- People — `UserRow` ([UsersManagementPage](../src/app/pages/UsersManagementPage.tsx)), `SellerRow` ([SellersManagementPage](../src/app/pages/SellersManagementPage.tsx)), `SellerOption` ([CardAssignmentPage](../src/app/pages/CardAssignmentPage.tsx) and [RewardsFinancePage](../src/app/pages/RewardsFinancePage.tsx)).
- Finance — `WdRow` ([OrgWithdrawalsPage](../src/app/pages/OrgWithdrawalsPage.tsx)), `TxRow` ([OrgFinancePage](../src/app/pages/OrgFinancePage.tsx), [SellerDetailPage](../src/app/pages/SellerDetailPage.tsx)), `Transaction` ([RewardsFinancePage](../src/app/pages/RewardsFinancePage.tsx)).
- Cross-cutting — `Notif` ([NotificationsHistoryPage](../src/app/pages/NotificationsHistoryPage.tsx)), `OverdueRow` ([OverdueKpiReportPage](../src/app/pages/OverdueKpiReportPage.tsx)), `PreviewRow` ([ReportPreviewPage](../src/app/pages/ReportPreviewPage.tsx)).

Each page owns its own arrays (`const SEED: Row[] = [...]`). Cross-page data like seller lookup tables (`SELLER_FULL_NAMES`, `SELLER_BALANCES`) live where they're used — duplicated rather than centralized, because this is a design prototype.

## Known gotchas

- **`overflow-x: auto` also clips the y-axis.** Dropdown/popover menus inside a scrollable table must use `position: fixed`, never `position: absolute`. See [usePopoverPosition.ts](../src/app/components/usePopoverPosition.ts).
- **New page ≠ done until it's navigable.** A new page requires touching [routes.tsx](../src/app/routes.tsx), the right sidebar group in [Sidebar.tsx](../src/app/components/Sidebar.tsx), and (if it's an org page) the `ORG_PATHS` array in [Navbar.tsx](../src/app/components/Navbar.tsx).
- **Main content area = `width: 100%`, `padding: 28px 32px`, never `maxWidth`.** Enforced across every page.
- **No Tailwind font-size / font-weight / line-height classes.** Defaults live in [theme.css](../src/styles/theme.css).
- **Every monetary input must be masked.** Use `fmtUzs(parseInt(digits))` on each keystroke + `inputMode="numeric"` + `F.mono`. See the lesson in [tasks/lessons.md](../tasks/lessons.md).
- **Every export button must route through `useExportToast`.** Never attach a plain `onClick` that silently "downloads".
- **Empty state views use `<EmptyState />`, not inline divs.** 6 canonical variants showcased at `/empty-states`.
- **Figma & `ImageWithFallback` are protected.** Do not modify [`ImageWithFallback.tsx`](../src/app/components/figma/ImageWithFallback.tsx) or `pnpm-lock.yaml`.
