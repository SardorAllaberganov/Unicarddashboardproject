# Routes

There is no REST API. This document lists the react-router paths and the cross-page wiring contracts (query params, `location.state`, `CustomEvent` dispatches).

For the full router config see [routes.tsx](../src/app/routes.tsx). For the shared component contracts (Sidebar, Navbar, Drawer, PopoverPosition, DateRangePicker, etc.) see [COMPONENTS.md](./COMPONENTS.md).

---

## Route table

Role column: **bank** = Bank Admin, **org** = Organization Admin, **shared** = both roles.

### Bank Admin

| Path | Role | Component | Notes |
|---|---|---|---|
| `/dashboard` | bank | [BankAdminDashboardPage](../src/app/pages/BankAdminDashboardPage.tsx) | KPI stats, charts, activity |
| `/organizations` | bank | [OrganizationsPage](../src/app/pages/OrganizationsPage.tsx) | |
| `/organizations/new` | bank | [NewOrganizationPage](../src/app/pages/NewOrganizationPage.tsx) | |
| `/organizations/:id` | bank | [OrgDetailPage](../src/app/pages/OrgDetailPage.tsx) | 4 tabs + deactivate modal |
| `/organizations/:id/edit` | bank | [EditOrganizationPage](../src/app/pages/EditOrganizationPage.tsx) | |
| `/card-batches` | bank | [CardBatchesPage](../src/app/pages/CardBatchesPage.tsx) | Row click → `/card-batches/:id`; action menu uses `usePopoverPosition` |
| `/card-batches/new` | bank | [NewBatchWizardPage](../src/app/pages/NewBatchWizardPage.tsx) | |
| `/card-batches/:id` | bank | [CardBatchDetailPage](../src/app/pages/CardBatchDetailPage.tsx) | 5 tabs; archive/delete/duplicate modals |
| `/card-batches/:id/edit` | bank | [EditCardBatchPage](../src/app/pages/EditCardBatchPage.tsx) | Locked fields show a Lock icon + helper text |
| `/kpi-config` | bank | [KPIConfigurationPage](../src/app/pages/KPIConfigurationPage.tsx) | 4-step wizard |
| `/card-import` | bank | [CardImportPage](../src/app/pages/CardImportPage.tsx) | Drag-drop CSV/XLSX |
| `/all-cards` | bank | [AllCardsPage](../src/app/pages/AllCardsPage.tsx) | |
| `/rewards` | bank | [RewardsFinancePage](../src/app/pages/RewardsFinancePage.tsx) | Manual Adjustment modal |
| `/reports` | bank | [ReportsExportPage](../src/app/pages/ReportsExportPage.tsx) | 6 export cards; uses `useExportToast` |
| `/reports/preview/:reportId` | bank | [ReportPreviewPage](../src/app/pages/ReportPreviewPage.tsx) | Query: `?from=YYYY-MM-DD&to=YYYY-MM-DD` |
| `/reports/overdue-kpi` | bank | [OverdueKpiReportPage](../src/app/pages/OverdueKpiReportPage.tsx) | Row click → `/card-detail/:id` |
| `/users` | bank | [UsersManagementPage](../src/app/pages/UsersManagementPage.tsx) | Edit role / Block-Unblock / Reset password modals |
| `/notification-rules` | bank | [NotificationRulesPage](../src/app/pages/NotificationRulesPage.tsx) | 4 tabs × 14 rules, delete + duplicate confirmation modals |
| `/notification-rules/new` | bank | [NotificationRuleEditorPage](../src/app/pages/NotificationRuleEditorPage.tsx) | Create a rule; two-column form + preview + summary |
| `/notification-rules/:id` | bank | [NotificationRuleDetailPage](../src/app/pages/NotificationRuleDetailPage.tsx) | Config summary + 4 stat cards + 3 tabs (Лог срабатываний / Ошибки + retry flow / Статистика charts) |
| `/notification-rules/:id/edit` | bank | [NotificationRuleEditorPage](../src/app/pages/NotificationRuleEditorPage.tsx) | Edit existing rule; hydrates from `INITIAL_RULES` by `:id` (don't pass `preFilled` with forward-ref icons — structured-clone will reject) |
| `/announcements` | bank | [AnnouncementHistoryPage](../src/app/pages/AnnouncementHistoryPage.tsx) | Filter bar + table; consumes `location.state.newRow` on mount for pulse-highlight + `SentAnnouncementToast` |
| `/announcements/new` | bank | [AnnouncementComposePage](../src/app/pages/AnnouncementComposePage.tsx) | Two-column composer with `FormatToolbar` + markdown preview. Auto-save indicator. Draft-edit mode when `location.state.draft` is set (flips breadcrumb, title, footer to destructive "Удалить черновик") |
| `/announcements/:id` | bank | [AnnouncementDetailPage](../src/app/pages/AnnouncementDetailPage.tsx) | 3 variants by `:id` — sent (stat cards + delivery table), `4` → scheduled (55/45 two-column layout + SendNowModal), `5` → draft (info strip) |
| `/flow/announcements` | shared | [AnnouncementFlowPage](../src/app/pages/AnnouncementFlowPage.tsx) | Dev-handoff reference — no sidebar/navbar. Flow diagram + state model + integration checklist |
| `/notification-log` | bank | [NotificationDeliveryLogPage](../src/app/pages/NotificationDeliveryLogPage.tsx) | 4 stat cards, filter bar. Collapsed error rows get rotating chevron; expanded row is a two-column card with KVPair error details + Outline "Повторить" + Ghost alt-channel dropdown + Info recommendation |
| `/settings` | bank | [SettingsPage](../src/app/pages/SettingsPage.tsx) | 6 tabs |

### Organization Admin

| Path | Role | Component | Notes |
|---|---|---|---|
| `/org-dashboard` | org | [OrgAdminDashboardPage](../src/app/pages/OrgAdminDashboardPage.tsx) | |
| `/sellers` | org | [SellersManagementPage](../src/app/pages/SellersManagementPage.tsx) | |
| `/sellers/:id` | org | [SellerDetailPage](../src/app/pages/SellerDetailPage.tsx) | Edit / Deactivate / Reassign cards modals |
| `/org-cards` | org | [OrgCardsPage](../src/app/pages/OrgCardsPage.tsx) | Inline "Зафиксировать" sale flow |
| `/card-assignment` | org | [CardAssignmentPage](../src/app/pages/CardAssignmentPage.tsx) | |
| `/card-assignment/bulk` | org | [BulkCardAssignmentPage](../src/app/pages/BulkCardAssignmentPage.tsx) | Capacity-capped distribution table |
| `/seller-messages` | org | [SellerMessageHistoryPage](../src/app/pages/SellerMessageHistoryPage.tsx) | Consumes `location.state.newRow` → prepend + pulse + `SentMessageToast` |
| `/seller-messages/new` | org | [SellerMessageComposePage](../src/app/pages/SellerMessageComposePage.tsx) | Compose with `FormatToolbar` + markdown preview + quick templates + send confirm |
| `/seller-messages/:id` | org | [SellerMessageDetailPage](../src/app/pages/SellerMessageDetailPage.tsx) | 55/45 message + stats + delivery table (mock ignores `:id`) |
| `/org-rewards` | org | [OrgFinancePage](../src/app/pages/OrgFinancePage.tsx) | |
| `/org-withdrawals` | org | [OrgWithdrawalsPage](../src/app/pages/OrgWithdrawalsPage.tsx) | Approve / Reject modals |
| `/org-settings` | org | [OrgSettingsPage](../src/app/pages/OrgSettingsPage.tsx) | |

### Shared

| Path | Role | Component | Notes |
|---|---|---|---|
| `/` | shared | [LoginPage](../src/app/pages/LoginPage.tsx) | Role-based login, demo credentials. Submit routes to `/dashboard` (bank) or `/org-dashboard` if the login value matches `/org|mysafar|muhammad/i`. |
| `/login` | shared | [LoginPage](../src/app/pages/LoginPage.tsx) | Alias of `/`. Exists so logout can `navigate('/login')` without guessing. Navbar's "Выйти из системы" menu item sends users here. |
| `/card-detail/:id` | shared | [CardDetailPage](../src/app/pages/CardDetailPage.tsx) | Block Card modal; navbar role flips via `?from=org` |
| `/notifications` | shared | [NotificationsHistoryPage](../src/app/pages/NotificationsHistoryPage.tsx) | `?from=org` switches sidebar to org role |
| `/empty-states` | shared | [EmptyStatesShowcasePage](../src/app/pages/EmptyStatesShowcasePage.tsx) | 6 filtered-empty variants |
| `/empty-states-first-use` | shared | [FirstUseEmptyStatesShowcasePage](../src/app/pages/FirstUseEmptyStatesShowcasePage.tsx) | 7 "no data yet" variants — Bell / Megaphone / MessageSquare / ListChecks / Wallet / Clock / Activity |
| `/skeleton-states` | shared | [SkeletonStatesShowcasePage](../src/app/pages/SkeletonStatesShowcasePage.tsx) | 6 shimmer variants (table / stat cards / KPI stepper / charts / full page / filter bar) |
| `/pagination-showcase` | shared | [PaginationShowcasePage](../src/app/pages/PaginationShowcasePage.tsx) | 3 states × 2 themes — Light / Dark columns, first / middle / last page scenarios |
| `/radio-card-showcase` | shared | [RadioCardShowcasePage](../src/app/pages/RadioCardShowcasePage.tsx) | Live radio-group demo + keyboard diagram + 5 states × 2 themes matrix (default / selected / hover / focused / disabled) |
| `/markdown-showcase` | shared | [MarkdownShowcasePage](../src/app/pages/MarkdownShowcasePage.tsx) | Compose (FormatToolbar + themed textarea) + rendered preview; follows global theme |
| `/export-toast-showcase` | shared | [ExportToastShowcasePage](../src/app/pages/ExportToastShowcasePage.tsx) | All 3 `ExportToast` phases stacked in both light and dark variants |
| `/design-system` | shared | [DesignSystemPage](../src/app/pages/DesignSystemPage.tsx) | 10-row DS tour |
| `/mobile-design-system` | shared | [MobileDesignSystemPage](../src/app/pages/MobileDesignSystemPage.tsx) | 20-section mobile reference (390×844). Each section in a pinned light+dark `PhoneFrame` matrix. Desktop shell wraps the canvas — not a real mobile route. |
| `/mobile-tab-bar` | shared | [MobileTabBarShowcasePage](../src/app/pages/MobileTabBarShowcasePage.tsx) | Bottom tab bar spec (Y-01) |
| `/mobile-header` | shared | [MobileHeaderShowcasePage](../src/app/pages/MobileHeaderShowcasePage.tsx) | Top header 4 variants (Y-02) |
| `/mobile-more-menu` | shared | [MobileMoreMenuShowcasePage](../src/app/pages/MobileMoreMenuShowcasePage.tsx) | Bank "Ещё" menu (Y-03) |
| `/mobile-more-menu-org` | shared | [MobileMoreMenuOrgShowcasePage](../src/app/pages/MobileMoreMenuOrgShowcasePage.tsx) | Org "Ещё" menu (Y-04) |
| `/mobile-nav-map` | shared | [MobileNavMapPage](../src/app/pages/MobileNavMapPage.tsx) | Navigation tree diagram (Y-05) |
| `/mobile-dashboard` | shared | [MobileDashboardShowcasePage](../src/app/pages/MobileDashboardShowcasePage.tsx) | Bank dashboard spec (Y-06) |
| `/mobile-bottom-sheets` | shared | [MobileBottomSheetsShowcasePage](../src/app/pages/MobileBottomSheetsShowcasePage.tsx) | 6 sheet variants (action menu / filter single-select / confirm delete / confirm simple / export / approve-reject) × light+dark PhoneFrame pairs. X-00 §11 |
| `/mobile-empty-skeletons` | shared | [MobileEmptySkeletonsShowcasePage](../src/app/pages/MobileEmptySkeletonsShowcasePage.tsx) | 6 empty-state variants + 4 skeleton loaders (list / stat 2×2 / KPI stepper / detail) + 3 PTR states (idle / pulling / refreshing). Shimmer via `@keyframes mdsShimmer`. X-00 §15 §16 |
| `/mobile-toasts` | shared | [MobileToastsShowcasePage](../src/app/pages/MobileToastsShowcasePage.tsx) | 6 toast variants (success / error / warning / info-long / loading / undo) + 2 positioning scenes (above tab bar / no tab bar). Entrance `toastSlideUp 200 ms`, exit `toastSlideDown 200 ms`. X-00 §13 |
| `/sidebar` | shared | [SidebarShowcasePage](../src/app/pages/SidebarShowcasePage.tsx) | |
| `/sidebar-org` | shared | [OrgSidebarShowcasePage](../src/app/pages/OrgSidebarShowcasePage.tsx) | |

---

## Cross-page wiring

### Query-param contracts

- `?from=org` — shared pages (`/notifications`, `/card-detail/:id`) use this to flip the sidebar + navbar from Bank Admin to Organization Admin. Set by any org-side link navigating to a shared page. Detected in [Navbar.tsx](../src/app/components/Navbar.tsx) `detectRole()`.
- `?from=YYYY-MM-DD&to=YYYY-MM-DD` — `/reports/preview/:reportId` reads the selected date range from [ReportsExportPage](../src/app/pages/ReportsExportPage.tsx).

### `location.state` contracts

- **Compose → History handoff** — `/announcements/new` and `/seller-messages/new` navigate to their history with `state: { newRow, toast }`. History pages (M-04, N-02) guard the read with a `consumedRef`, prepend the row, run the `.anno-row-pulse` / `.msg-row-pulse` animation, render the success toast, then clear state via `navigate(pathname, { replace: true, state: null })`.
- **Draft edit** — M-04 draft row click / menu navigates to `/announcements/new` with `state: { draft: row }`. M-03 consumes it and flips into draft-edit mode.
- **Rule duplicate** — `/notification-rules/:id/edit` **does not** accept `state.preFilled` containing a lucide forward-ref `icon` — the browser's structured-clone used by `pushState` rejects React forward-ref symbols. The editor re-hydrates from `INITIAL_RULES` keyed by `:id` instead. Only the duplicate flow (for synthesized ids) may need serializable preFilled.

### CustomEvent contracts (navbar notification bell)

Dispatched via `window.dispatchEvent(new CustomEvent(...))`:

- `app:notif:new` — `{ color: 'green'|'blue'|'amber'|'red', title: string, sub?: string }`. Prepends one unread notif, triggers `bellPulse`, renders `BellFlyout` for 4 s.
- `app:notif:batch` — `{ count: number, title?: string, color?: NotifIconColor }`. Prepends N unread notifs, triggers `bellBounce`. No flyout.

Events dispatched from a page before `navigate()` are lost — navbar unmounts on route change. For real cross-page delivery, route through a module-level store.

---

## Checklist: adding a new route

1. Create the page file in `src/app/pages/`.
2. Add an import + route entry in [routes.tsx](../src/app/routes.tsx).
3. Add a sidebar entry in [Sidebar.tsx](../src/app/components/Sidebar.tsx) (under `BANK_NAV` or `ORG_NAV`, in the right group).
4. If it's an org page, append the path to `ORG_PATHS` in [Navbar.tsx](../src/app/components/Navbar.tsx) so `detectRole` picks it up.
5. Apply the main-content pattern: flex row with sidebar + main area (`width: 100%`, `padding: 28px 32px`, never `maxWidth`).
6. If the page has its own mobile sticky back-button header, pass `hideOnMobile` to `<Navbar />` to avoid double-stacking.
