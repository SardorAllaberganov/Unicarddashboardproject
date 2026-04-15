# Routes & Shared Component Contracts

There is no REST API. This document lists react-router paths and the "contract" of each shared primitive (props + usage example).

For the full router config see [routes.tsx](../src/app/routes.tsx).

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
| `/notification-rules` | bank | [NotificationRulesPage](../src/app/pages/NotificationRulesPage.tsx) | 4 tabs × 14 rules + create/edit modal |
| `/announcements` | bank | [AnnouncementHistoryPage](../src/app/pages/AnnouncementHistoryPage.tsx) | Filter bar + table + action menu gated by status |
| `/announcements/new` | bank | [AnnouncementComposePage](../src/app/pages/AnnouncementComposePage.tsx) | Two-column composer, preview, masked HH:MM time |
| `/announcements/:id` | bank | [AnnouncementDetailPage](../src/app/pages/AnnouncementDetailPage.tsx) | Delivery stats + per-recipient table (mock ignores `:id`) |
| `/notification-log` | bank | [NotificationDeliveryLogPage](../src/app/pages/NotificationDeliveryLogPage.tsx) | 4 stat cards, filter bar, inline error expand |
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
| `/seller-messages` | org | [SellerMessageHistoryPage](../src/app/pages/SellerMessageHistoryPage.tsx) | Sent-messages history |
| `/seller-messages/new` | org | [SellerMessageComposePage](../src/app/pages/SellerMessageComposePage.tsx) | Compose + quick templates + send confirm |
| `/seller-messages/:id` | org | [SellerMessageDetailPage](../src/app/pages/SellerMessageDetailPage.tsx) | 55/45 message + stats + delivery table (mock ignores `:id`) |
| `/org-rewards` | org | [OrgFinancePage](../src/app/pages/OrgFinancePage.tsx) | |
| `/org-withdrawals` | org | [OrgWithdrawalsPage](../src/app/pages/OrgWithdrawalsPage.tsx) | Approve / Reject modals |
| `/org-settings` | org | [OrgSettingsPage](../src/app/pages/OrgSettingsPage.tsx) | |

### Shared

| Path | Role | Component | Notes |
|---|---|---|---|
| `/` | shared | [LoginPage](../src/app/pages/LoginPage.tsx) | Role-based login, demo credentials |
| `/card-detail/:id` | shared | [CardDetailPage](../src/app/pages/CardDetailPage.tsx) | Block Card modal; navbar role flips via `?from=org` |
| `/notifications` | shared | [NotificationsHistoryPage](../src/app/pages/NotificationsHistoryPage.tsx) | `?from=org` switches sidebar to org role |
| `/empty-states` | shared | [EmptyStatesShowcasePage](../src/app/pages/EmptyStatesShowcasePage.tsx) | |
| `/design-system` | shared | [DesignSystemPage](../src/app/pages/DesignSystemPage.tsx) | 10-row DS tour |
| `/sidebar` | shared | [SidebarShowcasePage](../src/app/pages/SidebarShowcasePage.tsx) | |
| `/sidebar-org` | shared | [OrgSidebarShowcasePage](../src/app/pages/OrgSidebarShowcasePage.tsx) | |

### Query-param contracts

- `?from=org` — shared pages (`/notifications`, `/card-detail/:id`) use this to flip the sidebar + navbar from Bank Admin to Organization Admin. Set by any org-side link navigating to a shared page. Detected in [Navbar.tsx](../src/app/components/Navbar.tsx) `detectRole()`.
- `?from=YYYY-MM-DD&to=YYYY-MM-DD` — `/reports/preview/:reportId` reads the selected date range from [ReportsExportPage](../src/app/pages/ReportsExportPage.tsx).

---

## Shared component contracts

### `<Sidebar />`
File: [Sidebar.tsx](../src/app/components/Sidebar.tsx)

```ts
interface SidebarProps {
  role: 'bank' | 'org';
  collapsed?: boolean;
  onToggle?: () => void;
  darkMode?: boolean;
  onDarkModeToggle?: () => void;
  orgName?: string;         // shown as subtitle when role === 'org'
}
```

Routing-aware: highlights the nav item whose `path` matches `useLocation().pathname` (exact match or a `path + '/'` prefix). Groups are defined in `BANK_NAV` and `ORG_NAV` at the top of the file — add a new entry there when creating a new page.

### `<Navbar />`
File: [Navbar.tsx](../src/app/components/Navbar.tsx)

```ts
interface NavbarProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
}
```

Self-detects role via `detectRole(pathname)` against the module-level `ORG_PATHS` array. Current membership: `/org-dashboard`, `/sellers`, `/org-cards`, `/card-assignment`, `/org-rewards`, `/org-withdrawals`, `/org-settings`, `/seller-messages`. **Add new org routes to that array** or the navbar will show the wrong avatar and "switch to other role" target.

### `usePopoverPosition()`
File: [usePopoverPosition.ts](../src/app/components/usePopoverPosition.ts)

```ts
usePopoverPosition(options?: { alignRight?: boolean })
  → { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle }
```

Typical usage:

```tsx
const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } = usePopoverPosition();

<div ref={rootRef}>
  <button ref={triggerRef} onClick={toggle}>⋯</button>
  {open && (
    <div ref={menuRef} style={{ ...menuStyle, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: '0 8px 24px rgba(17,24,39,0.1)' }}>
      {/* menu items — call close() on click */}
    </div>
  )}
</div>
```

Handles fixed positioning, auto-flip via layout-effect measurement, outside-click, scroll/resize auto-close. **Default `alignRight: true`** — override for left-anchored triggers.

### `useExportToast()`
File: [useExportToast.tsx](../src/app/components/useExportToast.tsx)

```ts
useExportToast() → {
  start: (p: {
    title?: string;
    subtitle?: string;       // e.g. 'Отчёт по организациям за 01.04–13.04.2026'
    fileName?: string;       // shown in success
    fileSize?: string;       // '245 KB'
    shouldError?: boolean;   // force error phase (for retry demo)
    delayMs?: number;        // default 1500
  }) => void;
  close: () => void;
  node: ReactNode;           // render once, e.g. inside the page root
}
```

Phases: `processing` (spinner, no close) → `success` (8s auto-dismiss, Download ghost) or `error` (Retry ghost, manual close).

### `<EmptyState />`
File: [EmptyState.tsx](../src/app/components/EmptyState.tsx)

```ts
interface EmptyStateAction { label: string; onClick?: () => void; icon?: ReactNode; }

interface EmptyStateProps {
  icon: React.ElementType;   // lucide-react icon component
  title: string;
  subtitle?: string;
  primary?: EmptyStateAction;
  outline?: EmptyStateAction;
  ghost?: EmptyStateAction;
  padding?: string;          // default '56px 24px'
}
```

Drop inside any empty table body or dashboard card. Six canonical variants are showcased at `/empty-states`.

### `<DateRangePicker />`
File: [DateRangePicker.tsx](../src/app/components/DateRangePicker.tsx)

Range picker with a quick-presets panel (Сегодня / Вчера / 7 дней / 30 дней / этот месяц / прошлый месяц). No fixed width on the presets column — it sizes to content.

### `<OrgDetailDrawer />`
File: [OrgDetailDrawer.tsx](../src/app/components/OrgDetailDrawer.tsx)

Slide-in drawer used from [OrganizationsPage](../src/app/pages/OrganizationsPage.tsx). Full-page equivalent is [OrgDetailPage](../src/app/pages/OrgDetailPage.tsx) at `/organizations/:id`.

---

## Checklist: adding a new route

1. Create the page file in `src/app/pages/`.
2. Add an import + route entry in [routes.tsx](../src/app/routes.tsx).
3. Add a sidebar entry in [Sidebar.tsx](../src/app/components/Sidebar.tsx) (under `BANK_NAV` or `ORG_NAV`, in the right group).
4. If it's an org page, append the path to `ORG_PATHS` in [Navbar.tsx](../src/app/components/Navbar.tsx) so `detectRole` picks it up.
5. Apply the main-content pattern: flex row with sidebar + main area (`width: 100%`, `padding: 28px 32px`, never `maxWidth`).
