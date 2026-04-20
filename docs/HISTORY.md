# History

Reverse-chronological log of documentation syncs. Prepend new entries — never rewrite. Each entry describes a session's logical changes (not per-file diffs).

---

## 2026-04-20 — Mobile polish: double-header fix, tab-bar clearance, iOS splash, iconVariant helper, ROUTES.md split

**Module:** all (mobile shell + PWA + docs)
**Commits:** uncommitted working tree — 25 modified + 23 new files (includes `public/splash/` 20 PNGs + 2 new component/script files). Builds on `7519fa9`.
**Files touched:** 48

**What changed:**

- **Mobile double-header fix.** [Navbar](../src/app/components/Navbar.tsx) gained a `hideOnMobile?: boolean` prop. When `true` on a <768 px viewport the navbar returns `null` (after running all hooks, so rules-of-hooks are respected). Pages that draw their own sticky 52 px back-button header now pass `hideOnMobile`: [AllCardsPage](../src/app/pages/AllCardsPage.tsx), [SellersManagementPage](../src/app/pages/SellersManagementPage.tsx), [SellerDetailPage](../src/app/pages/SellerDetailPage.tsx), [NotificationsHistoryPage](../src/app/pages/NotificationsHistoryPage.tsx), [NotificationRulesPage](../src/app/pages/NotificationRulesPage.tsx), [SettingsPage](../src/app/pages/SettingsPage.tsx), [OrgSettingsPage](../src/app/pages/OrgSettingsPage.tsx). Previously the 56 px mobile navbar stacked on top of the page header producing ~108 px chrome; now only one header renders.
- **Tab-bar clearance audit.** Replaced bare `padding-bottom: 96px` with `calc(80px + env(safe-area-inset-bottom, 0px))` across 11 bottom-tab-exposed containers in BankAdminDashboard, OrgAdminDashboard, AllCards, Sellers, SellerDetail, Organizations, OrgDetail, Notifications, NotificationRules, and MobileSettings. Previous 96 px under-covered iPhones with a home indicator by a few px; new value = 64 px bar + 16 px breathing + safe-area.
- **PWA icon artwork refined.** [public/favicon.svg](../public/favicon.svg) now layers a subtle white card silhouette (1.5 px stroke at 22 % opacity + 18 % filled magnetic stripe) behind the "M" mark, reinforcing the Moment Card / VISA theme. Maskable SVG inside [scripts/gen-pwa-icons.mjs](../scripts/gen-pwa-icons.mjs) updated to match. Regenerated `pwa-192x192.png`, `pwa-512x512.png`, `pwa-512x512-maskable.png`, `apple-touch-icon-180.png`, `favicon.ico`.
- **iOS PWA launch images.** New [scripts/gen-splash-screens.mjs](../scripts/gen-splash-screens.mjs) emits 20 PNGs to `public/splash/` covering 10 iPhone sizes (5/SE, 6/7/8/SE2, Plus, X/XS/11Pro, XR/11, XS Max/11 Pro Max, 12/13/14, 12/13 Pro Max, 14 Pro/15/15Pro/16, 14 Pro Max/15 Pro Max/16 Plus) × light (`#F9FAFB`) / dark (`#0B0D14`) themes. Each splash is a centered 22 %-of-shortest-side icon. Wired into [index.html](../index.html) as 20 `<link rel="apple-touch-startup-image" media="...">` entries. Splash glob added to PWA `includeAssets` in [vite.config.ts](../vite.config.ts).
- **Extracted `iconVariant` helper.** New [ds/iconVariant.ts](../src/app/components/ds/iconVariant.ts) exports `iconVariant(variant, dark): { bg, color }` with 6 variants (blue/violet/green/cyan/amber/rose). Inline duplicates removed from [BankAdminDashboardPage](../src/app/pages/BankAdminDashboardPage.tsx) and [OrgDetailPage](../src/app/pages/OrgDetailPage.tsx); both now import the shared helper.
- **Docs split.** [ROUTES.md](./ROUTES.md) (was 369 lines, past 300-line soft limit) split into ROUTES.md (124 lines: route table + query/state/event contracts + add-route checklist) and new [COMPONENTS.md](./COMPONENTS.md) (276 lines: shared component contracts for Sidebar, Navbar, MobileTabBar, MobileSettings, PopoverPosition, ExportToast, EmptyState, PaginationBar, RadioCard, DateRangePicker, OrgDetailDrawer, useDarkMode, useIsMobile, useInstallPrompt, iconVariant, renderMarkdown). Cross-links added between the two files and from ARCHITECTURE.md.
- **Docs updated:** AI_CONTEXT.md, ARCHITECTURE.md, HISTORY.md, this entry.

**Follow-ups:**
- None flagged — all 6 queued items landed.

---

## 2026-04-17 (late) — PWA wiring + 13 mobile page layouts + 3 new showcase routes + safe-area fixes

**Module:** all (PWA infrastructure + mobile page rollout)
**Commits:** uncommitted working tree — 19 modified + 10 new files (including `public/` assets and `scripts/`). Builds on `11ded12`.
**Files touched:** 29

**What changed:**

- **PWA (new):** installed `vite-plugin-pwa 1.2` + `workbox-window 7`. Configured in [vite.config.ts](../vite.config.ts) with manifest (`Moment KPI`, Russian, standalone, portrait, `#2563EB` theme) + runtime caching strategies (NetworkFirst pages, StaleWhileRevalidate scripts, CacheFirst images/fonts) + 4 MB precache ceiling. Build emits `dist/sw.js`, `dist/manifest.webmanifest`, raster icons. SW registered via `registerSW({ autoUpdate })` in [src/main.tsx](../src/main.tsx). 17 files / ~2.2 MB precached.
- **PWA icons (new):** [public/favicon.svg](../public/favicon.svg) (master blue-tile "M"), generated PNG rasters via [scripts/gen-pwa-icons.mjs](../scripts/gen-pwa-icons.mjs) (one-shot `sharp`-based script). Placeholder art — ready for brand replacement.
- **PWA meta tags:** [index.html](../index.html) — `theme-color` (light/dark media queries), `apple-mobile-web-app-*`, favicon links, `viewport-fit=cover`.
- **Install button:** new [useInstallPrompt](../src/app/components/useInstallPrompt.tsx) hook captures `beforeinstallprompt` event (Chrome/Edge/Android), detects `(display-mode: standalone)` + iOS Safari. New "Приложение" section in [MobileSettings](../src/app/components/MobileSettings.tsx) renders one of 4 states: installed (green check) / can-install (blue Download) / iOS (Share icon + 3-step help sheet) / waiting (gray with "Откройте в Chrome/Edge…" hint). IosInstallSheet is a dedicated bottom sheet with numbered instructions.
- **Safe-area fix for PWA standalone mode:** [Navbar](../src/app/components/Navbar.tsx) mobile header now uses `height: calc(56px + env(safe-area-inset-top))` + `box-sizing: border-box`. [MobileTabBar](../src/app/components/MobileTabBar.tsx) uses `calc(64px + env(safe-area-inset-bottom))` same way. Tabs/header content stays exact size; safe-area pushes into notch/home-indicator.
- **New shared component:** [MobileSettings](../src/app/components/MobileSettings.tsx) — role-aware iOS-grouped settings list. Consumed by both [SettingsPage](../src/app/pages/SettingsPage.tsx) (bank) and [OrgSettingsPage](../src/app/pages/OrgSettingsPage.tsx) (org). Sections: Профиль → Приложение → Аккаунт → Организация (org only) → KPI по умолчанию (bank only) → Интеграции (bank only) → Система уведомлений (bank only: Правила / Объявления / Лог доставки) → Внешний вид → Поддержка → Выйти.
- **13 pages got mobile branches:**
  - `/` + `/login` — [LoginPage](../src/app/pages/LoginPage.tsx) full-screen mobile login: 80×80 blue logo tile + title + stacked inputs + Remember/Forgot row + primary "Войти" + divider + outline "Войти через Unired ID" + copyright caption
  - `/dashboard` — already had mobile branch; no changes this session
  - `/org-dashboard` — new [OrgAdminDashboardPage](../src/app/pages/OrgAdminDashboardPage.tsx) mobile: greeting + hero gradient card + 2×2 stats + seller rankings (🥇🥈🥉) + KPI conversion bars + activity rows
  - `/all-cards` — new [AllCardsPage](../src/app/pages/AllCardsPage.tsx) mobile: Y-02 V2 header + horizontal stat pills + grouped "Сегодня/Вчера" sections + 3-dot KPI indicator rows + full-screen FilterSheet
  - `/sellers` — new [SellersManagementPage](../src/app/pages/SellersManagementPage.tsx) mobile: search + stat pills + seller rows with swipe-left (Редакт./Карты) + full-screen MobileAddSellerModal
  - `/sellers/:id` — new [SellerDetailPage](../src/app/pages/SellerDetailPage.tsx) mobile: Y-02 V3 header + 72 px avatar hero + 2×2 stats + iOS segmented tabs (Сводка/Карты/Финансы) + gradient UCOIN balance card + 4-action bottom sheet
  - `/notifications` — new [NotificationsHistoryPage](../src/app/pages/NotificationsHistoryPage.tsx) mobile: back + "Прочитать все" + segmented (Все/Непрочитанные) + date-grouped rows with swipe-left delete + 3 px blue left accent for unread
  - `/notification-rules` — new [NotificationRulesPage](../src/app/pages/NotificationRulesPage.tsx) mobile (M-01): segmented (KPI/Финансы/Карты/Система) + rule cards with toggle switch + swipe-left (Дублировать blue + Удалить red). DeleteRuleModal/DuplicateRuleModal/DuplicateSuccessToast hoisted out of desktop wrapper to render for both branches.
  - `/notification-rules/new` + `/notification-rules/:id/edit` — new [NotificationRuleEditorPage](../src/app/pages/NotificationRuleEditorPage.tsx) mobile (M-02): full-screen form with Y-02 V4 header + grouped sections (Событие / Каналы / Получатели / Расписание / Активно) + trigger select opens bottom sheet with trigger groups + digest-frequency sub-sheet
  - `/announcements/new` — new [AnnouncementComposePage](../src/app/pages/AnnouncementComposePage.tsx) mobile (M-03): full-screen form + FormatToolbar + char count + full-screen RecipientPicker (Все/Организации/Пользователи segmented) + Preview bottom sheet + SMS cost hint + date/time pickers
  - `/seller-messages/new` — new [SellerMessageComposePage](../src/app/pages/SellerMessageComposePage.tsx) mobile (N-01): same as announcement compose + горизонтальная "БЫСТРЫЕ ШАБЛОНЫ" row of template cards (200×92) at top
  - `/settings` + `/org-settings` — both now render `<MobileSettings>` on mobile
- **3 new showcase routes:**
  - `/mobile-bottom-sheets` — [MobileBottomSheetsShowcasePage](../src/app/pages/MobileBottomSheetsShowcasePage.tsx) — 6 sheet variants (action menu / filter single-select / confirm delete / confirm simple / export / approve-reject) × light+dark pairs + spec table. X-00 §11.
  - `/mobile-empty-skeletons` — [MobileEmptySkeletonsShowcasePage](../src/app/pages/MobileEmptySkeletonsShowcasePage.tsx) — 6 empty states + 4 skeleton loaders (list/stat/stepper/detail) + 3 PTR states. Shimmer via `@keyframes mdsShimmer`. X-00 §15 §16.
  - `/mobile-toasts` — [MobileToastsShowcasePage](../src/app/pages/MobileToastsShowcasePage.tsx) — 6 toast variants + 2 positioning scenes (above tab bar / no tab bar). Entrance `toastSlideUp 200 ms`, exit `toastSlideDown 200 ms`. X-00 §13.
- **Infrastructure:** `.gitignore` adds `/dev-dist` (vite-plugin-pwa dev output). `package-lock.json` deleted — this project is pnpm, not npm.

**Follow-ups:**
- Placeholder PWA icons are a plain blue "M" tile — replace `public/favicon.svg` with real brand artwork, then `node scripts/gen-pwa-icons.mjs` regenerates all sizes.
- No iOS splash screens generated (optional; needs `pwa-asset-generator` for ~15 device-sized images).
- Double-header issue: pages with their own mobile sticky header (NotificationsHistoryPage, NotificationRulesPage, SellersManagementPage, AllCardsPage, SellerDetailPage) render BOTH the Navbar mobile header AND their own page header, stacking to ~108 px of header. For a more native feel, consider hiding Navbar on mobile for pages that render their own Y-02 V3/V4 header.
- `MobileTabBar` `paddingBottom: calc(96px + env(safe-area-inset-bottom))` is correct for tab-bar clearance, but many existing mobile pages only use `paddingBottom: 96px` — last content row may clip by a few px on devices with home indicators. Audit pass recommended.

---

## 2026-04-17 — Responsive mobile shell + per-page mobile layouts + 5 showcase pages

**Module:** all (responsive infrastructure + mobile page content)
**Commits:** uncommitted working tree — 15 files (+7 new, 8 modified), +1,211 lines. Builds on `08caab3`.
**Files touched:** 15

**What changed:**

- **Responsive shell** — new [useIsMobile](../src/app/components/useIsMobile.tsx) hook (breakpoint 768 px, module-level resize listener) + new [MobileTabBar](../src/app/components/MobileTabBar.tsx) (position: fixed bottom, 4 tabs per role auto-detected from URL). [Sidebar](../src/app/components/Sidebar.tsx) returns `<MobileTabBar>` on mobile instead of the side panel. [Navbar](../src/app/components/Navbar.tsx) renders a simplified 56 px mobile header on mobile (brand left, bell + theme + avatar + ChevronDown right, with dropdown menu). All 50+ pages get this shell automatically.
- **Per-page mobile branches** — 4 pages now conditionally render mobile content via `useIsMobile()`:
  - `/dashboard` — greeting + hero blue-gradient KPI card + 2×2 stats + compact funnel + top orgs list + activity feed.
  - `/organizations` — search bar + stat strip + list rows with avatar + status badge + amount + chevron.
  - `/organizations/:id` — Y-02 V3 header (back + title + ⋯) + hero with badges + phone tap-to-call + 2×2 stats + iOS segmented control (4 tabs) + all 4 tab contents (Сводка with KPI bars + activity, Продавцы list rows, Карты with search + badge rows, Финансы with summary chips + transaction list) + action bottom sheet (Edit / Assign / Pause / Deactivate + Cancel).
  - `/organizations/new` — Y-02 V4 modal header (X close + title + "Создать" text button) + stacked single-column form fields grouped by section headers + SMS toggle + sticky bottom "Создать организацию" button with disabled state.
- **Mobile form auto-scroll** — `FormInput` and `FormTextarea` call `scrollIntoView({ behavior: 'smooth', block: 'center' })` on focus with 120 ms delay for keyboard open.
- **`iconVariant` bug fix** — function was missing in `OrgDetailPage.tsx` (defined only in `BankAdminDashboardPage.tsx`), causing `ReferenceError` on mobile. Added inline.
- **5 new mobile showcase pages** — `/mobile-header` (4 header variants × 2 scroll states × light/dark), `/mobile-more-menu` (Bank "Ещё", 9 tiles), `/mobile-more-menu-org` (Org "Ещё", 6 tiles), `/mobile-nav-map` (navigation tree diagram with presentation rules), `/mobile-dashboard` (Bank dashboard spec Y-06). All routed and linked from `/mobile-design-system`.
- **Routes** — 5 new entries in [routes.tsx](../src/app/routes.tsx): `/mobile-header`, `/mobile-more-menu`, `/mobile-more-menu-org`, `/mobile-nav-map`, `/mobile-dashboard`.

**Follow-ups:**
- Remaining pages (card batches, KPI config, settings, all org-admin pages, etc.) still need per-page mobile branches — they get the responsive shell (tab bar + mobile header) but content is still desktop layout at narrow widths.
- `iconVariant` is duplicated across `BankAdminDashboardPage` and `OrgDetailPage` — consider extracting to a shared util.

---

## 2026-04-16 (night) — Mobile design system foundation

**Module:** mobile (new area)
**Commits:** uncommitted working tree — 1 modified + 11 new files, builds on `f81983c`.
**Files touched:** 12 — see below.

**What changed:**

- **New folder [src/app/components/mds/](../src/app/components/mds/)** — mobile design system building blocks. Contains [frame.tsx](../src/app/components/mds/frame.tsx) (`PhoneFrame`, `Pair` light+dark matrix, `SectionBlock`, `VariantLabel`, `MDS` constants) plus 8 section files — `M_Navigation` (§1 Headers, §2 Tab bars, §3 More menu), `M_Lists` (§4 List rows, §5 Section headers, §20 Swipe actions), `M_Cards` (§6 Stat cards), `M_Sheets` (§7 Filter sheet, §11 Bottom sheet), `M_Detail` (§8 Detail page, §9 Segmented control), `M_Forms` (§10 Form, §12 Sticky action, §17 Search), `M_Feedback` (§13 Toast, §14 Pull-to-refresh, §15 Empty, §16 Skeleton), `M_Advanced` (§18 KPI stepper, §19 Badges). ~2,582 lines.
- **New master reference page [MobileDesignSystemPage](../src/app/pages/MobileDesignSystemPage.tsx) at `/mobile-design-system`** — 20-section tour, 390×844 baseline. Each section renders pinned light+dark phone-frame matrices via `<Pair>`. Shell uses the standard bank-admin sidebar+navbar so devs can navigate back to `/design-system`.
- **New detailed spec page [MobileTabBarShowcasePage](../src/app/pages/MobileTabBarShowcasePage.tsx) at `/mobile-tab-bar`** — 2×2 matrix (Bank/Org × Light/Dark) drilling into X-00 §2. Shows pressed state (`transform: scale(0.96); opacity: 0.7`) on Bank·Light tab 2, active-tab 8 px red dot badge on icon, 14×14 "3" count badge on Ещё tab, 36×5 iOS home indicator in the safe area. Spec token table + per-role tab composition table beneath the matrix.
- **Mobile-specific tokens** — `MDS` const in `frame.tsx` (not added to `tokens.ts`): `phoneW 390`, `safeTop 44`, `safeBottom 34`, `headerH 56`, `tabBarH 64`, `cardRadius 16`, `frameRadius 40`, `touchTarget 48`, plus tab-bar translucent bgs, iOS touch highlights, Android ripple. All color values inherit from existing `F`/`C`/`D`/`theme()`.
- **Convention:** mobile is a **desktop-canvas reference**, not a mobile-responsive route. Static mocks — no real tab switching, sheet open/close, or PTR gestures. Converting any section to a live mobile route is a separate future task.
- **Routes** — 2 new entries in [routes.tsx](../src/app/routes.tsx): `/mobile-design-system` and `/mobile-tab-bar`.
- **Docs** — `AI_CONTEXT.md` + `ROUTES.md` + `ARCHITECTURE.md` all bumped to reference the new folder, routes, and mobile-reference convention.

**Follow-ups:** none. Dev build green: 2312 modules, 8.74 s. Home indicator uses 36×5 per the spec in the user's prompt (iOS hardware is ~134×5) — flagged in the Tab Bar page report for decision.

---

## 2026-04-16 (evening) — DS showcase rows themed + flagged-item cleanup

**Module:** all (design-system showcase + small fixes)
**Commits:** uncommitted working tree — 15 files, +945 / −837 lines. Session builds on `8573129`.
**Files touched:** 15 — 10 DS rows + `Sidebar.tsx` + `CardBatchDetailPage.tsx` + `SettingsPage.tsx` + 2 sidebar showcase pages.

**What changed:**

- **10/10 DS showcase rows now themed** — `Row1_ColorTypo`, `Row2_SidebarBtnBadge`, `Row3_StatCards`, `Row4_Table`, `Row5_KPIStepper`, `Row6_Charts`, `Row7_Forms`, `Row8_DrawerModalToast`, `Row9_Misc`, `Row10_DateDark`. Each row now hoists `const [dark] = useDarkMode(); const t = theme(dark);` at the top and threads `t` / `dark` into its page-local helpers. Card chrome, labels, dividers, input chromes, chart axis / grid / tooltip, drawer tabs, modal shadows + overlay-tint icons, toast accents, sidebar item hover/active, stat-card icon tints all switch via the tokens. Status pills with multi-state palettes (Table status / Card-status flow / Row2 badge grid / Row3 trend pills / Row3 icon tints) use dedicated `_LIGHT` / `_DARK` sibling maps branched on `dark`. Funnel + donut chart palettes split into `FUNNEL_LIGHT` / `FUNNEL_DARK` and `DONUT_LIGHT` / `DONUT_DARK` so the lightest blues don't wash out on the dark surface.
- **Palette + typography specimens stay literal.** Swatch tiles in Row1 keep `background: hex` as-is (they exist to demonstrate that exact color), and Row1's `typeScale` sample `color` values stay literal for the same reason. Only the chrome around them themes. Row10's "Dark Theme Token Overrides" strip is a pinned side-by-side light + dark reference regardless of the global theme.
- **`<Sidebar>` gained `activePath?: string`** — overrides `useLocation()` for active-item detection. Both `/sidebar` and `/sidebar-org` showcase pages now pass `activePath="/dashboard"` / `"/org-dashboard"` so each 4-quadrant matrix cell highlights a realistic nav item.
- **Sidebar dead code deleted** — `BankAdminSidebarDemo`, `OrgAdminSidebarDemo`, and the `StateLabel` helper used only by them were removed (~85 lines). No page imported them; the showcase pages render `<Sidebar>` directly.
- **`CardBatchDetailPage` `ArchiveModal` confirm button reverted to primary-blue in both themes.** Archive is reversible (data stays accessible in "Архив") — the destructive-outline treatment that landed during T-13 was wrong for a reversible action. Now: filled `t.blue` / `t.blueHover` with white text + Archive icon in both themes.
- **`SettingsPage` `ThemeThumbnail` SVG fixed.** The `system` variant referenced `mask="url(#dark)"` without a matching `<mask>` definition — dead code that silently rendered wrong. Replaced with a proper `systemSplitDark` complement clip so the lower-right triangle actually shows dark sidebar + content rects.
- **Docs**: `AI_CONTEXT.md` bumped to "10/10 DS showcase rows" and notes the DS-row theming rule (chrome themes, specimens stay literal); `ROUTES.md` updated `<Sidebar>` prop contract to include `activePath`.

**Follow-ups:** none — all flagged items from the prior session ("Dark-theme rollout completed") are now closed. Dev build green: `2301 modules transformed`, `built in 12.92s`.

---

## 2026-04-16 (late) — Dark-theme rollout completed (50/50 pages) + login/logout wiring

**Module:** all
**Commits:** uncommitted working tree — Navbar + routes + 41 page files.
**Files touched:** 43 — +7,679 / −6,222 lines.

**What changed:**

- **T-09 — 11 remaining bank-admin pages themed** (followed the 6 done in the prior session): `UsersManagementPage`, `NotificationRulesPage`, `NotificationRuleEditorPage`, `NotificationRuleDetailPage`, `AnnouncementHistoryPage`, `AnnouncementDetailPage`, `AnnouncementComposePage`, `NotificationDeliveryLogPage`, `ReportPreviewPage`, `OverdueKpiReportPage`, `SettingsPage`. Same pattern as the first batch — `const t = theme(darkMode); const dark = darkMode;` at root, thread `t`/`dark` through every page-local helper, `_LIGHT`/`_DARK` sibling maps for multi-state pills. Charts (recharts bar + donut) get grid-stroke `t.border`, axis-tick `t.text3`, bar-fill `t.blue`, tooltip `t.surface`.
- **T-10 — all 12 org-admin pages themed**: `OrgAdminDashboardPage`, `OrgCardsPage`, `OrgFinancePage`, `OrgSettingsPage`, `OrgWithdrawalsPage`, `SellersManagementPage`, `SellerDetailPage`, `CardAssignmentPage`, `BulkCardAssignmentPage`, `SellerMessageComposePage`, `SellerMessageHistoryPage`, `SellerMessageDetailPage`. Sibling-map pills for `STATUS_STYLE` / `ROLE_STYLE` / `VARIANT_COLORS` / `TX_TYPE` / `TX_STATUS` / `CARD_STATUS`. Avatar circles switch bg `#E5E7EB` → `#2D3148` on dark with `#F1F2F6` initials.
- **T-11 — 4 shared pages themed**: `LoginPage` (dual-panel with pinned dark card border), `CardDetailPage` (KPI stepper + financial rows + transaction list + BlockCardModal; role-aware via `?from=org` preserved), `NotificationsHistoryPage` (unread left-border `3px t.blue`, read-state bg `t.tableHeaderBg`, sticky date labels), `DesignSystemPage` (shell only; Row1..Row10 left intentionally light).
- **T-12 — 8 showcase pages rebuilt as pinned light + dark matrix references**: `EmptyStatesShowcasePage`, `FirstUseEmptyStatesShowcasePage`, `SkeletonStatesShowcasePage`, `PaginationShowcasePage`, `RadioCardShowcasePage`, `SidebarShowcasePage` (4-quadrant light/dark × expanded/collapsed using `Sidebar`'s `darkMode` override), `OrgSidebarShowcasePage`, `AnnouncementFlowPage` (follows global theme — it's an architectural reference doc, no visual mock-ups). `Skeleton` primitive inside the skeleton showcase now accepts a `dark?` override so each matrix cell can be pinned.
- **T-13 — 15+ modals themed as a batch** across 10 host pages: `OrgDetailPage` (E-03 Deactivate), `CardBatchDetailPage` (F-04 Archive, F-05 Delete, L-03 Duplicate), `SellersManagementPage` (AddSellerModal), `SellerDetailPage` (G-01 Edit, G-02 Deactivate, G-03 Reassign), `OrgCardsPage` (H-02 Record Sale), `OrgWithdrawalsPage` (J-01 Approve, J-02 Reject), `RewardsFinancePage` (L-04 Manual Reward Adjustment), `SellerMessageComposePage` (SendConfirmDialog), `SellerMessageHistoryPage` (DeleteMessageModal), `SellerMessageDetailPage` (DeleteMessageModal). Universal treatment: overlay `rgba(0,0,0,0.6)` on dark, container `t.surface` + `1px solid ${t.border}` (no border on light), shadow `0 4px 24px rgba(0,0,0,0.4)` on dark, semantic header icons use `D` variants, info/warning cards use 8%-opacity tints, type-to-confirm inputs themed, destructive/primary/approve footer buttons follow T-08 spec.
- **6 deferred bank-admin pages finally themed**: `NewBatchWizardPage`, `CardImportPage`, `OrgDetailPage`, `KPIConfigurationPage`, `RewardsFinancePage`, `CardBatchDetailPage` (the non-modal parts that the T-13 modal pass left alone). `labelStyle`/`inputStyle` module-scope constants in `NewBatchWizardPage` were converted to factory functions `(t) => …` to thread tokens. `CardImportPage` drop-zone keeps `2px dashed t.inputBorder` idle and `t.blue` on drag-over.
- **Routes — new `/login` alias** added alongside `/`, both mount `LoginPage`. Needed so the logout button has a stable target to navigate to without guessing the app's root path.
- **Login form wired**. `handleLogin` in `LoginPage` routes to `/org-dashboard` if the login value matches `/org|mysafar|muhammad/i`, else `/dashboard`. Both "Войти" (primary) and "Войти через Unired ID" (outline) call the same handler.
- **Logout wired** — Navbar's "Выйти из системы" menu item gets an `onClick={() => { setMenuOpen(false); navigate('/login'); }}`.

**Follow-ups (known-incomplete):**
- `CardBatchDetailPage` `ArchiveModal`: confirm button was changed in BOTH themes from primary-blue to destructive-outline during the T-13 sweep (following T-08 spec literally). Light mode may want to revert to primary-blue — flag for designer review.
- `Sidebar.tsx` still exports `BankAdminSidebarDemo` / `OrgAdminSidebarDemo` but no page imports them anymore (sidebar showcase pages now render `<Sidebar>` directly). Safe to delete in a follow-up.
- `SettingsPage.tsx:1362` `ThemeThumbnail` SVG references `mask="url(#dark)"` with no matching `<mask id="dark">` — pre-existing silent no-op, not touched per "flag, don't silently fix".
- `ds/Row1…Row10` showcase rows under `/design-system` are still light-only — intentionally deferred (they're static palette demos).
- Sidebar showcase pages (`/sidebar`, `/sidebar-org`) won't show an active nav item because `Sidebar` reads `useLocation()` and neither path matches any menu entry.

---

**Module:** all
**Commits:** `d5bc097`, `28e39d8`, `ade2adb`, `b708241`, `7bbb9a2`, `ecf92c6`, `5179611`, `80ce29b` (all pushed); plus an in-flight working tree with `OrgDetailDrawer`, `useExportToast`, 6 bank-admin pages, and showcase-label updates for the deleted legacy sidebars.
**Files touched:** 20+ pages/components + 5 docs + routes + 2 deletions.

**What changed:**

- **Tokens ([ds/tokens.ts](../src/app/components/ds/tokens.ts))** — Spec-aligned dark palette per Prompt 0. Dark semantic bg tints dropped `0.12 → 0.10` opacity; `text4 #7C8194 → #4A4F63`; `textDisabled #4B5060 → #3A3F50`; `infoBg` changed to cyan `rgba(8,145,178,0.10)`. **New tokens** in both `C` and `D`: `sidebarBg` (`#FFFFFF` → `#12141C`), `sidebarBorder`, `tableHeaderBg` (`#F9FAFB` → `#161822`), `tableHover`, `tableAlt`, `focusRing` (`#DBEAFE` → `#1E3A5F`), `skeletonBase` (`#E5E7EB` → `#2D3148`), `skeletonShimmer` (`#F3F4F6` → `#363B52`), `overlay` (`rgba(0,0,0,0.2)` → `rgba(0,0,0,0.4)`), `progressTrack`.
- **Shell** — Theme toggle **moved from sidebar to navbar**. Navbar button uses a one-shot `themeIconSpin` keyframe (`-180deg → 0deg`) so the icon always lands back at 0° regardless of click count (prior impl accumulated `+180deg` unbounded). Navbar fully dark-themed across shell, bell dropdown, flyout, user menu, demo controls. Sidebar now uses dedicated `sidebarBg` / `sidebarBorder` tokens and exposes `onDarkModeToggle` as a deprecated no-op.
- **Shared primitives dark-aware**: [EmptyState](../src/app/components/EmptyState.tsx) (+ `dark?` override; font weight 600 per spec), [PaginationBar](../src/app/components/PaginationBar.tsx) (+ `dark?`), [RadioCard](../src/app/components/RadioCard.tsx) (+ `dark?`, `disabled?` on option, hover state added; focus ring scoped via `--rc-focus-ring` CSS var so groups with different themes coexist on one page), [renderMarkdown](../src/app/components/renderMarkdown.tsx) (+ 2nd arg `dark = false`) + `<FormatToolbar dark? />`, [DateRangePicker](../src/app/components/DateRangePicker.tsx) (auto reads hook), [useExportToast](../src/app/components/useExportToast.tsx) (`<ExportToast>` now exported with `inline` + `dark` props for showcase use; container radius 10→8 px to match spec).
- **OrgDetailDrawer** fully dark-themed — all 4 tabs (Сводка / Продавцы / Карты / Финансы), status badges with dedicated `ORG_STATUS_DARK` / `CARD_STATUS_DARK` maps, stat-card variant tints at 15% opacity, backdrop deepened to `rgba(0,0,0,0.55)`.
- **OrganizationsPage** — first full page-level dark theme as the reference impl. Fixed a stray `useState(false)` straggler from the earlier mass migration.
- **Bank-admin pages dark-themed (batch-by-batch)**: `ReportsExportPage`, `NewOrganizationPage`, `EditOrganizationPage`, `EditCardBatchPage`, `CardBatchesPage`, `AllCardsPage`. Per-page pattern: `const t = theme(darkMode); const dark = darkMode;` at the root, thread `t`/`dark` as props through every local helper, add `_DARK` sibling maps for status pills, substitute hardcoded hex hovers (`'#F9FAFB'`, `'#D1D5DB'`) with `dark ? D.tableHover : '#F9FAFB'` etc.
- **Showcase pages**: new [/markdown-showcase](../src/app/pages/MarkdownShowcasePage.tsx) (compose + preview follows global theme) and [/export-toast-showcase](../src/app/pages/ExportToastShowcasePage.tsx) (all 3 phases stacked light + dark). Existing showcases for EmptyState / Pagination / Radio reworked to render dark comparisons using forced-dark wrappers.
- **Legacy sidebars deleted** — `BankAdminSidebar.tsx` (418 lines) and `OrgAdminSidebar.tsx` (441 lines) were orphaned (no page imported them). Removed entirely; `BankAdminSidebarDemo` / `OrgAdminSidebarDemo` still re-export from the unified [Sidebar](../src/app/components/Sidebar.tsx). Showcase pages' "Component" label updated from `BankAdminSidebar` → `Sidebar role="bank"`.
- **Routing**. 2 new routes: `/markdown-showcase`, `/export-toast-showcase`.
- **Lessons**: added `:focus-visible` via injected stylesheet (scoped CSS var pattern), dark-theme token-threading pattern, status-pill dedicated dark maps.

**Follow-ups (known-incomplete):**
- 6 of 12 bank-admin pages in the requested "all 12 pages" batch are **still light-only**: `OrgDetailPage` (890 lines), `NewBatchWizardPage` (772), `CardImportPage` (814), `KPIConfigurationPage` (1,305), `RewardsFinancePage` (1,351), `CardBatchDetailPage` (1,710). Each has 60–176 color refs + dozens of internal helpers — best tackled in a dedicated session.
- All 11 org-admin pages still light-only. Same pattern applies.
- Showcase pages `SidebarShowcasePage`, `OrgSidebarShowcasePage`, `FirstUseEmptyStatesShowcasePage`, `SkeletonStatesShowcasePage`, `AnnouncementFlowPage` have not been themed.
- `ds/Row1…Row10` showcase rows (under `/design-system`) are static palette demos — theming them means either redesigning them to show tokens inline, or preserving their static intent.

---

## 2026-04-16 — Cross-page integration + design-system primitives

**Module:** all
**Commits:** uncommitted (working tree). Session builds on `ba0212a`.
**Files touched:** 55 — 4 new components + 6 new pages + 45 modified (mass migration) + routes.

**What changed:**

- **Auto-save indicator + DraftSavedToast** in [AnnouncementComposePage](../src/app/pages/AnnouncementComposePage.tsx). 3 s debounce on title/body edits → `saving` phase → flips to `saved` with `HH:MM` stamp. "Сохранить как черновик" button triggers the same transition + opens a success toast (3 px green left border, CheckCircle2, "Перейти к черновикам →" CTA, 6 s auto-dismiss). Scoped `@keyframes draftSpin` + `draftToastIn`.
- **Announcement + message "sent" flow.** Compose confirm now builds a full row payload and navigates to history with `location.state = { newRow, toast }`. History pages (M-04 + N-02) consume the state once via a ref guard, prepend the row, set `highlightId`, render a success toast ("Объявление отправлено" / "Сообщение отправлено" with summary + "Открыть в истории →" CTA), and clear state via `navigate(..., { replace: true, state: null })`. New row animates with `.anno-row-pulse` / `.msg-row-pulse` classes — background fades `C.blueLt → transparent` + first-`<td>` inset shadow fades from 3 px `C.blue` over 2 s. "Только что" date cell renders non-mono in `C.blue`.
- **Scheduled announcement detail** — new `SCHEDULED_DETAIL` payload ("Акция: бонус за KPI 3", 3-para body, 2 orgs, 4 recipients). When `status === 'scheduled'`, the detail page renders a 55/45 two-column layout: left "Содержание" (title + divider + body + divider + created/author caption); right "Расписание доставки" (warning-tinted info card with Clock + "Запланировано на 15.04.2026 09:00" + "Через 2 дня, 19 часов" + divider + recipient list with avatar/org/channel badge). Header actions swap to `Отправить сейчас` (Primary, Send) + `Редактировать` (Outline Pencil) + `Отменить отправку` (Outline danger XCircle). New `SendNowModal` (460 px, blue Send icon).
- **Draft announcement edit** — M-04 draft rows now navigate to `/announcements/new` with `location.state.draft`. Compose consumes the state: breadcrumb flips to "Редактирование черновика", page title changes, top-right compose card gains a grey "Черновик" badge + "Сохранён 12.04 15:30" caption, footer swaps to Destructive-outline "Удалить черновик" + Ghost "Сохранить черновик" + Primary "Отправить объявление" (no Отмена). New `DestructiveOutlineButton` + inline `DeleteDraftModal`.
- **Notification rule detail** — new page [NotificationRuleDetailPage](../src/app/pages/NotificationRuleDetailPage.tsx) at `/notification-rules/:id`. Header with title + status badge + large 52×28 px switch + Outline "Редактировать" + action-dots (Дублировать / Удалить). Config summary card (Триггер / Каналы / Получатели / Расписание — 4-col grid). 4 stat cards (blue Bell 347 / green CheckCircle2 694 / amber Eye 612 88.2% / red XCircle 4 0.6%). 3 tabs — **Лог срабатываний** (24 seeded rows, paginated 20/page showing "1–20 из 347", filter bar with DateRangePicker + Канал select + search), **Ошибки**, **Статистика** (recharts vertical bar chart of 14 days + donut Push/In-app 50/50 + "Средняя скорость прочтения: 3 мин 22 сек"). Rules list gains "Подробнее" menu entry + full-card click navigation with `stopPropagation` on inner controls.
- **Retry flow** (rule detail Errors tab). Per-row 5-state machine: `idle → confirming → sending → success | failed`. Confirm → 3 px `C.blue` inset + `C.blueLt` bg; Sending → disabled Primary-sm with rotating Loader2; Success → row tints `rgba(16,185,129,0.04)`, Error badge → Success "Доставлено", action cell shows green "✓ Повторено · HH:MM"; Failed → "Ошибка (N)" + "Повтор также не удался · {original reason}". Bulk retry → `BulkRetryModal` (480 px, RefreshCw blue header) → header button animates through `idle → running (spinner + X/N) → done (success/error badge row + Ghost "Готово")`. Rows retry staggered 600 ms apart with 75 % success / 25 % failure.
- **Notification delivery log (M-05) expanded error row.** `LogRow.errorDetail` adds `{ title, device, lastPushAt, attempts, nextAttempt, recommendation }`. `ErrorDetailRow` rewritten to a two-column card (left "Детали ошибки" KVPairs in 140 px label grid; right "Действия" Outline "Повторить отправку" + Ghost `AltChannelDropdown` "Отправить через другой канал" with `Email вместо Push` / `SMS вместо Push` options + divider + Info recommendation caption). Collapsed error rows now show a rotating `ChevronDown` in the last cell.
- **Notification bell** ([Navbar](../src/app/components/Navbar.tsx)). 4 states implemented. Badge resized to 16×16 px. Subscribes to `window` `app:notif:new` (arrival with flyout) and `app:notif:batch` (bulk with bounce) CustomEvents. `@keyframes bellPulse` / `bellBounce` — key-driven one-shot animations. `BellFlyout` (320 px, fixed anchored, 3 px blue left border, Только что + "Нажмите чтобы открыть →" CTA, 4 s auto-dismiss). Empty state ("Нет новых уведомлений" with BellOff icon) for the Непрочитанные tab. Demo controls footer row ("+1 событие" / "+5 пакетом" ghost buttons) dispatching the events.
- **Dark mode persistence** — new [useDarkMode](../src/app/components/useDarkMode.tsx) hook + module-level theme store (`localStorage['moment-kpi-theme']`, values `'light' | 'dark' | 'system'`). Mass migration: all 42 page files swapped `useState(false)` → `useDarkMode()` via bash sed. Sidebar gains `ThemeToggleRow` above the collapse row (Sun 20 px `#D97706` / Moon 20 px `#93C5FD`, 200 ms rotation on click, tooltip "Тёмная тема" / "Светлая тема"). Settings Profile tab gets 3-option radio card group with 48×32 px inline-SVG thumbnails (light / dark / system-diagonal-split), "Текущая: …" caption, DEV-labeled dev-reference strip with the localStorage contract.
- **Markdown body rendering** — new shared [renderMarkdown](../src/app/components/renderMarkdown.tsx) + `<FormatToolbar>`. Grammar: `**bold**`, `_italic_`, lines starting with `-`/`•`/`*` group into `<ul>`, blank lines separate paragraphs. Toolbar has Bold / Italic / List icon buttons that wrap selection via `setSelectionRange`. Integrated into both announcement (M-03) and seller-message (N-01) compose pages — preview now renders formatted content instead of plain text + 2-line clamp.
- **Dev-handoff flow diagram** — new [AnnouncementFlowPage](../src/app/pages/AnnouncementFlowPage.tsx) at `/flow/announcements`. Standalone layout (no sidebar/navbar), centered 1200 px white card, 6 sections: legend · Compose → Store → History grid · M-04 row-action mutations · JSON-like state model · modal/toast reference (P-03/P-04/P-06/P-07/Q-02) · Integration checklist (9 ☑ items) + N-01/N-02 parallel note · Current implementation footnote.
- **Design-system showcase pages** — 5 new:
  - [SkeletonStatesShowcasePage](../src/app/pages/SkeletonStatesShowcasePage.tsx) at `/skeleton-states` — 6 shimmer variants (table / stat cards / KPI stepper / donut+bars / full-page / filter-bar). Single `@keyframes skeletonShimmer` 1.5 s linear infinite.
  - [FirstUseEmptyStatesShowcasePage](../src/app/pages/FirstUseEmptyStatesShowcasePage.tsx) at `/empty-states-first-use` — 7 "no data yet" variants (rules / announcements / messages / log / withdrawals / activity / rule-fires) in a 3-col grid using the shared `<EmptyState />` primitive.
  - [PaginationShowcasePage](../src/app/pages/PaginationShowcasePage.tsx) at `/pagination-showcase` — 3 live states of new `<PaginationBar />` primitive (range readout / page-size select 10/20/50/100 / ellipsis page buttons / localStorage persistence via `storageKey`).
  - [RadioCardShowcasePage](../src/app/pages/RadioCardShowcasePage.tsx) at `/radio-card-showcase` — live `<RadioGroup />` demo + keyboard interaction diagram (Tab / ↑↓ / ←→ / Space / Home / End kbd chips) + 4-state focus matrix. Accessible `role="radiogroup"` with roving tabindex and `:focus-visible`-only ring (injected via `<style id="rc-focus-styles">` since inline styles can't express pseudo-classes).
- **New shared primitives**:
  - [PaginationBar](../src/app/components/PaginationBar.tsx) — full-width pagination row with page-size select + ellipsis algorithm + localStorage hydration via `storageKey`.
  - [RadioCard](../src/app/components/RadioCard.tsx) — `<RadioGroup>` + `<RadioIndicator>`. Roving tabindex, arrow-key wrap, Home/End, Space/Enter, `:focus-visible` ring.
  - [useDarkMode](../src/app/components/useDarkMode.tsx) — `useDarkMode()` (drop-in for `useState<boolean>(false)`) + `useThemePref()` (3-way 'light'|'dark'|'system').
  - [renderMarkdown](../src/app/components/renderMarkdown.tsx) — `renderMarkdown(text)` + `<FormatToolbar>`.
- **Routing**. 7 new routes: `/notification-rules/:id`, `/flow/announcements`, `/skeleton-states`, `/empty-states-first-use`, `/pagination-showcase`, `/radio-card-showcase`.
- **Lessons**: added 4 entries — structured-clone of `location.state` can't carry lucide forward-refs (drop `preFilled` when editor can hydrate from `:id`); roving-tabindex pattern for accessible radio groups; shimmer keyframes recipe; dispatching custom events from unmounting pages loses them (navbar unmounts on route change).

**Follow-ups (known-incomplete):**
- Existing `RadioRow` primitives in compose pages aren't migrated to the new `<RadioGroup />` — they lack arrow-key + `:focus-visible` support. Swap is mechanical but ~4 call sites.
- Table pages still use bespoke inline pagination. Migration to `<PaginationBar />` is a separate pass.
- `preFilled` state hand-off in [NotificationRulesPage.openEdit](../src/app/pages/NotificationRulesPage.tsx) still crashes on structured-clone for lucide `forwardRef` icons; only the detail-page copy of that flow has been fixed. Duplicate→edit from the rules list will surface the same bug if ever exercised.
- Compose pages dispatch no cross-page notification events because the navbar unmounts on navigate; demo buttons inside the bell dropdown substitute for testing. Real wiring needs a module-level store or socket connection.
- `renderMarkdown` doesn't support headings, links, or inline code — grammar is deliberately narrow.

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
