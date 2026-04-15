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
| `/` | shared | [LoginPage](../src/app/pages/LoginPage.tsx) | Role-based login, demo credentials |
| `/card-detail/:id` | shared | [CardDetailPage](../src/app/pages/CardDetailPage.tsx) | Block Card modal; navbar role flips via `?from=org` |
| `/notifications` | shared | [NotificationsHistoryPage](../src/app/pages/NotificationsHistoryPage.tsx) | `?from=org` switches sidebar to org role |
| `/empty-states` | shared | [EmptyStatesShowcasePage](../src/app/pages/EmptyStatesShowcasePage.tsx) | 6 filtered-empty variants |
| `/empty-states-first-use` | shared | [FirstUseEmptyStatesShowcasePage](../src/app/pages/FirstUseEmptyStatesShowcasePage.tsx) | 7 "no data yet" variants — Bell / Megaphone / MessageSquare / ListChecks / Wallet / Clock / Activity |
| `/skeleton-states` | shared | [SkeletonStatesShowcasePage](../src/app/pages/SkeletonStatesShowcasePage.tsx) | 6 shimmer variants (table / stat cards / KPI stepper / charts / full page / filter bar) |
| `/pagination-showcase` | shared | [PaginationShowcasePage](../src/app/pages/PaginationShowcasePage.tsx) | 3 live `<PaginationBar />` states |
| `/radio-card-showcase` | shared | [RadioCardShowcasePage](../src/app/pages/RadioCardShowcasePage.tsx) | Accessible radio-group demo + keyboard diagram + focus matrix |
| `/design-system` | shared | [DesignSystemPage](../src/app/pages/DesignSystemPage.tsx) | 10-row DS tour |
| `/sidebar` | shared | [SidebarShowcasePage](../src/app/pages/SidebarShowcasePage.tsx) | |
| `/sidebar-org` | shared | [OrgSidebarShowcasePage](../src/app/pages/OrgSidebarShowcasePage.tsx) | |

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

Handles fixed positioning, auto-flip via layout-effect measurement, outside-click, and scroll/resize **re-anchoring** (the popover follows its trigger as the container scrolls; it only closes if the trigger leaves the viewport). **Default `alignRight: true`** — override for left-anchored triggers.

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

### `useDarkMode()` / `useThemePref()`
File: [useDarkMode.tsx](../src/app/components/useDarkMode.tsx)

```ts
useDarkMode(): [boolean, (next: boolean | ((prev: boolean) => boolean)) => void]
useThemePref(): [ThemePref, resolvedDark: boolean, setPref: (p: ThemePref) => void]
// ThemePref = 'light' | 'dark' | 'system'
```

Module-level store backed by `localStorage['moment-kpi-theme']`. `useDarkMode()` is a **drop-in** for `useState<boolean>(false)` — the signature is identical, but state is shared across all pages and persists across route changes. Writes always normalize to `'light'` / `'dark'`; use `useThemePref()` to write `'system'`. Listens to OS `prefers-color-scheme` changes when pref is `'system'`.

### `renderMarkdown(text)` / `<FormatToolbar />`
File: [renderMarkdown.tsx](../src/app/components/renderMarkdown.tsx)

```ts
renderMarkdown(text: string): React.ReactNode

<FormatToolbar
  textareaRef={React.RefObject<HTMLTextAreaElement | null>}
  value={string}
  onChange={(next: string) => void}
/>
```

Grammar (deliberately narrow): `**bold**`, `_italic_`, lines starting with `-`/`•`/`*` grouped into `<ul>`, blank lines separate paragraphs, single `\n` → `<br>`. Output is pure React nodes (no `dangerouslySetInnerHTML`). Toolbar wraps selection using `setSelectionRange`; the bullet button toggles list prefix across selected lines.

### `<PaginationBar />`
File: [PaginationBar.tsx](../src/app/components/PaginationBar.tsx)

```ts
interface PaginationBarProps {
  total: number;
  page: number;               // 1-indexed
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  storageKey?: string;        // persists pageSize to localStorage['pagesize:{key}']
  pageSizeOptions?: number[]; // default [10, 20, 50, 100]
}
```

Three sections: left range readout ("Показано X–Y из Z"), center page-size select (72 px compact), right page buttons with ellipsis algorithm (always show first + last + current ±1). Changing `pageSize` automatically resets `page` to 1 via `onPageChange(1)`.

### `<RadioGroup />` / `<RadioIndicator />`
File: [RadioCard.tsx](../src/app/components/RadioCard.tsx)

```ts
interface RadioOption<T> { value: T; label: string; sub?: string; children?: React.ReactNode }
interface RadioGroupProps<T> {
  label: string;              // aria-label on the radiogroup container
  name: string;
  value: T;
  options: RadioOption<T>[];
  onChange: (next: T) => void;
  orientation?: 'horizontal' | 'vertical';
}
```

WAI-ARIA `radiogroup` pattern. Roving tabindex: only the selected card is `tabIndex=0`. Keyboard — ↑/↓/←/→ wraps through options, Home/End jumps, Space/Enter re-selects. Focus ring is rendered only for `:focus-visible` (keyboard focus); injected via a scoped `<style id="rc-focus-styles">` block on first mount.

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
