# AI Context — Moment Card KPI Platform

Last synced: 2026-04-16 (+ mobile design system foundation — `/mobile-design-system` + `/mobile-tab-bar`)

## Current state

Moment Card KPI is a React 18 + TypeScript + Vite single-page app serving two admin roles for a partner-distributed VISA card program:

- **Bank Admin** — oversees every partner organization, card batch, KPI config, reward payout, notification rule, delivery log, and system announcement across the platform.
- **Organization Admin** — runs their own shop: sellers, card inventory, KPI conversion, UCOIN withdrawals, and direct messaging to sellers.

There is no backend. All data is mock TypeScript arrays inside each page file. Role is inferred from the URL path (and `?from=org` for shared pages like `/notifications` and `/card-detail/:id`). Dark mode persists via a module-level theme store backed by `localStorage['moment-kpi-theme']` with values `'light' | 'dark' | 'system'`. Every page, showcase, modal, and Design System showcase row (Row 1 through Row 10) now themes against the `theme(dark)` token surface — the rollout hit 100%. The target resolution is 1920×1080 desktop.

A parallel **mobile design system** now lives at [/mobile-design-system](../src/app/pages/MobileDesignSystemPage.tsx) (master reference, 20 sections) plus a detailed per-component showcase at [/mobile-tab-bar](../src/app/pages/MobileTabBarShowcasePage.tsx). These are rendered **inside `PhoneFrame` wrappers on the desktop canvas** — they are reference catalogues, not actual mobile-responsive routes. The app itself still targets desktop.

## Feature map (what lives where)

### Shared (role-aware)

| Route | Page | Notes |
|---|---|---|
| `/`, `/login` | [LoginPage](../src/app/pages/LoginPage.tsx) | Entry; both paths mount the same page. "Войти" / "Войти через Unired ID" auto-routes to `/org-dashboard` if the login field matches `/org|mysafar|muhammad/i`, else `/dashboard`. |
| `/card-detail/:id` | [CardDetailPage](../src/app/pages/CardDetailPage.tsx) | KPI Stepper Variant B + Block Card modal |
| `/notifications` | [NotificationsHistoryPage](../src/app/pages/NotificationsHistoryPage.tsx) | `?from=org` flips sidebar/navbar |
| `/empty-states` | [EmptyStatesShowcasePage](../src/app/pages/EmptyStatesShowcasePage.tsx) | 6 filtered-empty variants |
| `/empty-states-first-use` | [FirstUseEmptyStatesShowcasePage](../src/app/pages/FirstUseEmptyStatesShowcasePage.tsx) | 7 "no data yet" variants |
| `/skeleton-states` | [SkeletonStatesShowcasePage](../src/app/pages/SkeletonStatesShowcasePage.tsx) | 6 shimmer loading variants |
| `/pagination-showcase` | [PaginationShowcasePage](../src/app/pages/PaginationShowcasePage.tsx) | 3-state × 2-theme pagination matrix |
| `/radio-card-showcase` | [RadioCardShowcasePage](../src/app/pages/RadioCardShowcasePage.tsx) | Accessible radio group + 5-state × 2-theme matrix |
| `/markdown-showcase` | [MarkdownShowcasePage](../src/app/pages/MarkdownShowcasePage.tsx) | FormatToolbar + textarea + rendered preview |
| `/export-toast-showcase` | [ExportToastShowcasePage](../src/app/pages/ExportToastShowcasePage.tsx) | Processing / success / error — light + dark stacks |
| `/design-system` | [DesignSystemPage](../src/app/pages/DesignSystemPage.tsx) | 10-row DS tour |
| `/mobile-design-system` | [MobileDesignSystemPage](../src/app/pages/MobileDesignSystemPage.tsx) | 20-section mobile reference (390×844 baseline, pinned light+dark phone frames) |
| `/mobile-tab-bar` | [MobileTabBarShowcasePage](../src/app/pages/MobileTabBarShowcasePage.tsx) | Detailed bottom-tab-bar spec (2 roles × 2 themes, pressed state, home indicator) |
| `/sidebar`, `/sidebar-org` | Sidebar showcases |  |
| `/flow/announcements` | [AnnouncementFlowPage](../src/app/pages/AnnouncementFlowPage.tsx) | Dev-handoff diagram (no sidebar/navbar) |

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
| `/notification-rules` | [NotificationRulesPage](../src/app/pages/NotificationRulesPage.tsx) — 14 rules × 4 tabs |
| `/notification-rules/new` | [NotificationRuleEditorPage](../src/app/pages/NotificationRuleEditorPage.tsx) |
| `/notification-rules/:id` | [NotificationRuleDetailPage](../src/app/pages/NotificationRuleDetailPage.tsx) — config summary · 4 stat cards · 3 tabs (Лог срабатываний · Ошибки + retry · Статистика charts) |
| `/notification-rules/:id/edit` | [NotificationRuleEditorPage](../src/app/pages/NotificationRuleEditorPage.tsx) |
| `/announcements` | [AnnouncementHistoryPage](../src/app/pages/AnnouncementHistoryPage.tsx) — consumes `location.state.newRow` on mount for pulse + toast |
| `/announcements/new` | [AnnouncementComposePage](../src/app/pages/AnnouncementComposePage.tsx) — auto-save indicator, markdown preview, draft-edit state from `location.state.draft` |
| `/announcements/:id` | [AnnouncementDetailPage](../src/app/pages/AnnouncementDetailPage.tsx) — sent/scheduled/draft variants (scheduled gets 55/45 two-column layout + SendNowModal) |
| `/notification-log` | [NotificationDeliveryLogPage](../src/app/pages/NotificationDeliveryLogPage.tsx) — inline expanded error row with retry + alt-channel dropdown |
| `/settings` | [SettingsPage](../src/app/pages/SettingsPage.tsx) — 6 tabs, theme radio with thumbnails |

### Organization Admin

| Route | Page |
|---|---|
| `/org-dashboard` | [OrgAdminDashboardPage](../src/app/pages/OrgAdminDashboardPage.tsx) |
| `/sellers` | [SellersManagementPage](../src/app/pages/SellersManagementPage.tsx) |
| `/sellers/:id` | [SellerDetailPage](../src/app/pages/SellerDetailPage.tsx) |
| `/org-cards` | [OrgCardsPage](../src/app/pages/OrgCardsPage.tsx) |
| `/card-assignment` | [CardAssignmentPage](../src/app/pages/CardAssignmentPage.tsx) |
| `/card-assignment/bulk` | [BulkCardAssignmentPage](../src/app/pages/BulkCardAssignmentPage.tsx) |
| `/seller-messages` | [SellerMessageHistoryPage](../src/app/pages/SellerMessageHistoryPage.tsx) — consumes `location.state.newRow` for pulse + toast |
| `/seller-messages/new` | [SellerMessageComposePage](../src/app/pages/SellerMessageComposePage.tsx) — markdown preview |
| `/seller-messages/:id` | [SellerMessageDetailPage](../src/app/pages/SellerMessageDetailPage.tsx) |
| `/org-rewards` | [OrgFinancePage](../src/app/pages/OrgFinancePage.tsx) |
| `/org-withdrawals` | [OrgWithdrawalsPage](../src/app/pages/OrgWithdrawalsPage.tsx) |
| `/org-settings` | [OrgSettingsPage](../src/app/pages/OrgSettingsPage.tsx) |

## Shared primitives

| File | Export | Purpose |
|---|---|---|
| [usePopoverPosition.ts](../src/app/components/usePopoverPosition.ts) | `usePopoverPosition()` | Fixed-position anchored dropdown: auto-flip, measure-before-paint, outside-click, scroll/resize **re-anchoring** (follows trigger; closes only when trigger leaves viewport). |
| [useExportToast.tsx](../src/app/components/useExportToast.tsx) | `useExportToast()`, `<ExportToast />` | Processing → success/error toast. Hook returns `{ start, close, node }`. `<ExportToast />` is also exported for showcase pages (supports `inline` + `dark` override). Auto-themes via `useDarkMode()`. |
| [useDarkMode.tsx](../src/app/components/useDarkMode.tsx) | `useDarkMode()`, `useThemePref()` | Module-level theme store persisting to `localStorage['moment-kpi-theme']`. `useDarkMode()` is a drop-in for `useState<boolean>(false)`; `useThemePref()` exposes the 3-way `'light'|'dark'|'system'` preference. |
| [renderMarkdown.tsx](../src/app/components/renderMarkdown.tsx) | `renderMarkdown(text, dark?)`, `<FormatToolbar dark? />` | Markdown-lite renderer (`**bold**`, `_italic_`, `-`/`•` lists). Dark-aware via 2nd arg; toolbar reads global `useDarkMode()` by default. |
| [PaginationBar.tsx](../src/app/components/PaginationBar.tsx) | `<PaginationBar dark? />` | Range readout + 10/20/50/100 page-size select + ellipsis page buttons. Persists size via `storageKey` → `pagesize:{key}`. Dark-aware. |
| [RadioCard.tsx](../src/app/components/RadioCard.tsx) | `<RadioGroup dark? />`, `<RadioIndicator />` | Accessible radio pattern: `role="radiogroup"`, roving tabindex, arrow/Home/End/Space keys, `:focus-visible`-only ring (via scoped CSS variable `--rc-focus-ring`). `RadioOption.disabled?` supported. |
| [EmptyState.tsx](../src/app/components/EmptyState.tsx) | `<EmptyState dark? />` | 64 px muted icon + DM-Sans 600 title + subtitle + up to 3 actions. Dark-aware via global store or explicit `dark` prop. |
| [Navbar.tsx](../src/app/components/Navbar.tsx) | `<Navbar />`, `ORG_PATHS`, `detectRole()` | Role switcher, **theme toggle** (180° keyframe spin, lands back at 0° each click), notification bell with 4 states (`app:notif:new` / `app:notif:batch` CustomEvents), bell flyout, user menu. "Выйти из системы" menu item navigates to `/login`. Fully dark-themed across shell, bell dropdown, flyout, user menu, demo controls. |
| [Sidebar.tsx](../src/app/components/Sidebar.tsx) | `<Sidebar role="bank"│"org" />` | Unified sidebar; 260 px / 68 px. Uses dedicated `sidebarBg` / `sidebarBorder` tokens (`#FFFFFF` → `#12141C`). Theme toggle **removed** (moved to navbar); bottom row is the collapse button only. `onDarkModeToggle` prop is a deprecated no-op kept for backward compat. Optional `activePath?: string` overrides `useLocation()` — used by `/sidebar` and `/sidebar-org` showcases so their pinned quadrants highlight a real nav item despite the URL (`/sidebar`) not matching any menu entry. |
| [DateRangePicker.tsx](../src/app/components/DateRangePicker.tsx) | `<DateRangePicker />` | Range picker with quick-preset panel. Fully dark-themed; reads `useDarkMode()` internally. |
| [OrgDetailDrawer.tsx](../src/app/components/OrgDetailDrawer.tsx) | `<OrgDetailDrawer />` | 4-tab slide-in drawer used on `/organizations`. Full dark theme; status badges use dedicated dark palettes. |
| [ds/tokens.ts](../src/app/components/ds/tokens.ts) | `F`, `C`, `D`, `theme(dark)` | Fonts / colors / dark-mode overrides. New tokens: `sidebarBg`, `sidebarBorder`, `tableHeaderBg`, `tableHover`, `tableAlt`, `focusRing`, `skeletonBase`, `skeletonShimmer`, `overlay`, `progressTrack`. |

## Data model (mock data)

Full interface catalogue in [DATA_MODELS.md](./DATA_MODELS.md). Each page owns its own seed arrays; no shared store. Highlights:

- **Cards** — `CardRow`, `BatchCardRow`, `BatchCard`, `KpiConfig`, `KPIStepData`.
- **People** — `UserRow`, `SellerRow`, three shapes of `SellerOption` across CardAssignment / Rewards / SellerMessageCompose.
- **Finance** — `WdRow`, `TxRow`, `Transaction`.
- **Notifications & messaging** — `Notif`, `Rule` (exported from NotificationRulesPage), `LogRow` + `ErrorDetail`, `AnnouncementRow` + `AnnouncementDetail` + `ScheduledDetail`, `MessageRow` + `MessageDetail`, `FireRow` + `ErrorRow` (with `RetryState` machine).
- **Reports** — `OverdueRow`, `PreviewRow`.

## Known gotchas

- **`overflow-x: auto` also clips the y-axis.** Popover menus inside scrollable tables must use `position: fixed` via [usePopoverPosition](../src/app/components/usePopoverPosition.ts).
- **`usePopoverPosition` re-anchors on scroll** rather than closing — required for dropdowns inside scrollable modals.
- **New page ≠ done until it's navigable.** Touch [routes.tsx](../src/app/routes.tsx), the right sidebar group in [Sidebar.tsx](../src/app/components/Sidebar.tsx), and (for org pages) `ORG_PATHS` in [Navbar.tsx](../src/app/components/Navbar.tsx).
- **Main content area**: `width: 100%`, `padding: 28px 32px`, never `maxWidth`.
- **No Tailwind font-size / font-weight / line-height classes** — defaults in [theme.css](../src/styles/theme.css).
- **Every monetary input must be masked**. `fmtUzs(parseInt(digits))` on each keystroke + `inputMode="numeric"` + `F.mono`.
- **Every time input must be masked HH:MM.** See [AnnouncementComposePage](../src/app/pages/AnnouncementComposePage.tsx) `TimeField`.
- **Every export button must route through `useExportToast`.**
- **Empty-state views use `<EmptyState />`**, not inline divs. 6 filtered variants at `/empty-states`; 7 first-use variants at `/empty-states-first-use`.
- **`<label>` wrappers around two spans need an explicit `onClick`** — no native input to forward to.
- **Detail pages must mirror their list row's ⋯ menu** (actions + modals). Applies to announcement / seller-message / rule detail pages.
- **Cross-page handoff uses `location.state`.** Compose → History (`newRow` + `toast`), draft edit (`draft`), duplicate rule (`preFilled`). History pages guard the read with a `consumedRef` and clear state via `navigate(..., { replace: true, state: null })`.
- **Structured-clone rejects React forward-ref components.** Passing a `Rule` with `icon: lucide.forwardRef` via `location.state` crashes `pushState`. Strip non-serializable fields before navigating, or skip `state` when the destination can re-hydrate from `:id` + a module-level lookup.
- **Dark-mode state is global** via `useDarkMode()`. Do not re-introduce `useState(false)` — toggle in Navbar or Settings must persist across route changes. (Sidebar no longer has a theme toggle — it moved to the Navbar.)
- **Page-level dark theming uses `theme()`, not CSS variables.** Pattern: `const t = theme(darkMode); const dark = darkMode;` at the top of the default export, then `t.pageBg` / `t.surface` / `t.border` / `t.text1-4` / `t.blue` etc. in inline styles. Page-local helper components must accept `t` + `dark` as props (not read `useDarkMode()` inline) so showcase pages can force a specific variant. Shared primitives (EmptyState, PaginationBar, RadioGroup, ExportToast, FormatToolbar) follow the opposite pattern — read `useDarkMode()` by default, accept optional `dark` override.
- **DS showcase rows (Row1–Row10) theme the chrome, not the specimens.** Each row card container, labels, captions, dividers, and interactive samples switch via `t`. But hardcoded hex inside `Swatch` tiles (Row1 palette) and `color` values on `typeScale` entries (Row1 typography specimens) stay literal — they exist to demonstrate that exact color. Row10 deliberately shows both light + dark swatches side-by-side in the "Dark Theme Token Overrides" strip regardless of global theme (it's a reference strip).
- **Mobile design system is a desktop-canvas reference, not a mobile route.** [/mobile-design-system](../src/app/pages/MobileDesignSystemPage.tsx) and [/mobile-tab-bar](../src/app/pages/MobileTabBarShowcasePage.tsx) wrap every section in the `PhoneFrame` primitive from [mds/frame.tsx](../src/app/components/mds/frame.tsx) — a 390 px fixed-width rounded bezel — so the existing desktop sidebar/navbar frame the mobile mockups. Mobile-specific tokens (safe areas, tab-bar backdrop blur, iOS touch highlight, Android ripple) live in the `MDS` const in `frame.tsx`, not in `ds/tokens.ts`. All color values inherit from existing `F`/`C`/`D`/`theme()`. Sections render pinned light+dark via the `<Pair>` helper. Interactions are static representational mocks (no real tab switching, sheet open/close, PTR gesture) — converting any section to a real mobile route is a separate future task.
- **Status pills need dedicated dark palettes.** The semantic token layer (`t.successBg` etc.) only covers pill backgrounds, not the saturated pill text colors. For status badges with multiple-state maps (Активна / На паузе / Неактивна, Активна / Зарег. / На складе …), define a `_DARK` sibling map at module scope and branch on `dark`.
- **Notification bell consumes `window` CustomEvents** (`app:notif:new`, `app:notif:batch`). Events dispatched before `navigate()` are lost (navbar unmounts) — needs a module-level store for real cross-page delivery.
- **`:focus-visible` only, not `:focus`.** Accessible radio/checkbox cards inject a scoped `<style>` block since inline styles can't express the pseudo-class. Pattern at [RadioCard.tsx](../src/app/components/RadioCard.tsx) — focus-ring color is driven by a scoped CSS variable `--rc-focus-ring` so multiple groups with different themes can coexist on the same page.
- **Legacy sidebars deleted.** `BankAdminSidebar.tsx` / `OrgAdminSidebar.tsx` were orphaned after the unified `Sidebar` rollout; they were removed entirely. The `BankAdminSidebarDemo` / `OrgAdminSidebarDemo` / `StateLabel` exports in [Sidebar.tsx](../src/app/components/Sidebar.tsx) were also removed (no page imported them). Only the main `Sidebar` with `role="bank"` / `role="org"` remains. The sidebar showcase pages render `<Sidebar role=… darkMode=… activePath=…>` directly in a 4-quadrant matrix (light/dark × expanded/collapsed), with `activePath` forcing a realistic active nav item.
- **`<Sidebar>` / `<Navbar>` accept `darkMode: boolean`, NOT `dark`.** Agents theming pages frequently trip on this because every page-local helper uses `dark` as the prop name. Remember: for the shared shell components, pass `darkMode={darkMode}`.
- **Figma & `ImageWithFallback` are protected.** Do not modify [`ImageWithFallback.tsx`](../src/app/components/figma/ImageWithFallback.tsx) or `pnpm-lock.yaml`.
