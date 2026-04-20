# Shared Component Contracts

Prop shapes and usage examples for the primitives shared across pages. This file lives beside [ROUTES.md](./ROUTES.md) — routes point at pages, these components are the glue pages reuse. For the app-level folder map see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## Layout shell

### `<Sidebar />`
File: [Sidebar.tsx](../src/app/components/Sidebar.tsx)

```ts
interface SidebarProps {
  role: 'bank' | 'org';
  collapsed?: boolean;
  onToggle?: () => void;
  darkMode?: boolean;
  /** @deprecated — theme toggle moved to Navbar; prop kept for backward compat */
  onDarkModeToggle?: () => void;
  orgName?: string;         // shown as subtitle when role === 'org'
  activePath?: string;      // overrides useLocation(); used by showcases where the URL doesn't match any menu entry
}
```

Routing-aware: highlights the nav item whose `path` matches the current pathname (exact match or a `path + '/'` prefix). By default the pathname comes from `useLocation()`, but showcase pages (`/sidebar`, `/sidebar-org`) pass `activePath="/dashboard"` / `"/org-dashboard"` so each 4-quadrant matrix cell still shows a realistic active item. Groups are defined in `BANK_NAV` and `ORG_NAV` at the top of the file — add a new entry there when creating a new page. Uses dedicated `sidebarBg` / `sidebarBorder` tokens (`#FFFFFF` → `#12141C`, `#E5E7EB` → `#2D3148`).

### `<Navbar />`
File: [Navbar.tsx](../src/app/components/Navbar.tsx)

```ts
interface NavbarProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
  /** Pages that draw their own mobile sticky header opt out of the 56 px
   *  mobile navbar by passing `hideOnMobile`. On desktop the prop is a no-op. */
  hideOnMobile?: boolean;
}
```

Self-detects role via `detectRole(pathname)` against the module-level `ORG_PATHS` array. Current membership: `/org-dashboard`, `/sellers`, `/org-cards`, `/card-assignment`, `/org-rewards`, `/org-withdrawals`, `/org-settings`, `/seller-messages`. **Add new org routes to that array** or the navbar will show the wrong avatar and "switch to other role" target.

Theme toggle is a 36×36 button in the right-hand cluster. Clicking runs the `themeIconSpin` keyframe — icon rotates from `-180deg` → `0deg` over 250 ms, so it always lands back at 0° regardless of click count (prior implementation accumulated `+180deg` unbounded).

User-menu actions:
- **"Сменить роль"** — toggles between `/dashboard` and `/org-dashboard` (or the equivalent home path for whichever role the user is currently in).
- **"Выйти из системы"** — `navigate('/login')` + closes the menu.

`hideOnMobile` is required on pages that render their own sticky 52-56 px back-button header (`AllCardsPage`, `SellersManagementPage`, `SellerDetailPage`, `NotificationsHistoryPage`, `NotificationRulesPage`, `SettingsPage`, `OrgSettingsPage`) — without it the 56 px mobile navbar stacks on top, producing a ~108 px double header.

### `useIsMobile()`
File: [useIsMobile.tsx](../src/app/components/useIsMobile.tsx)

```ts
useIsMobile(): boolean   // true when window.innerWidth < 768
```

Module-level resize listener with shared state — no per-component listener duplication. Used by `Sidebar` (returns `<MobileTabBar>` on mobile) and `Navbar` (renders 56 px mobile header on mobile). Pages that need per-page mobile content branches also call this hook.

### `<MobileTabBar />`
File: [MobileTabBar.tsx](../src/app/components/MobileTabBar.tsx)

```ts
interface MobileTabBarProps {
  darkMode?: boolean;  // defaults to false
}
```

Position: fixed bottom, `z-index: 50`. Total height `calc(64px + env(safe-area-inset-bottom))` with `box-sizing: border-box` so the tab content row stays exactly 64 px on any device; safe-area just adds below. Auto-detects role from URL (same `ORG_PATHS` logic as Navbar). Bank tabs: Дашборд → `/dashboard`, Организации → `/organizations`, Карты → `/all-cards`, Ещё → `/settings`. Org tabs: Дашборд → `/org-dashboard`, Продавцы → `/sellers`, Карты → `/org-cards`, Ещё → `/org-settings`. Active tab detection includes a "Ещё" catch-all for routes not matched by other tabs. Backdrop-blur bg, 1 px top border.

**Tab-bar clearance rule:** every page rendered above the tab bar should pad its bottom with `calc(80px + env(safe-area-inset-bottom, 0px))` — 64 px bar + 16 px breathing room + safe-area. Using a bare `96px` under-covers iPhones with the home indicator by a few pixels.

### `<MobileSettings />`
File: [MobileSettings.tsx](../src/app/components/MobileSettings.tsx)

```ts
interface MobileSettingsProps {
  role: 'bank' | 'org';
  t: ReturnType<typeof theme>;
  dark: boolean;
  navigate: (p: string) => void;
}
```

Role-aware mobile settings list — rendered by [SettingsPage](../src/app/pages/SettingsPage.tsx) and [OrgSettingsPage](../src/app/pages/OrgSettingsPage.tsx) when `useIsMobile()` is true. iOS-grouped section cards: ПРОФИЛЬ → АККАУНТ (Безопасность / Уведомления / Язык) → **ПРИЛОЖЕНИЕ** (install button, 4 states) → ОРГАНИЗАЦИЯ (org only) → KPI ПО УМОЛЧАНИЮ (bank only) → ИНТЕГРАЦИИ (bank only) → **СИСТЕМА УВЕДОМЛЕНИЙ** (bank only: Правила / Объявления / Лог доставки) → ВНЕШНИЙ ВИД (opens ThemeSheet bottom sheet for light/dark/system) → ПОДДЕРЖКА → Выйти destructive ghost + v1.0.0 caption.

### `useInstallPrompt()`
File: [useInstallPrompt.tsx](../src/app/components/useInstallPrompt.tsx)

```ts
useInstallPrompt(): {
  canInstall: boolean;    // Chrome/Edge/Android fired beforeinstallprompt
  isInstalled: boolean;   // already running in standalone mode
  isIos: boolean;         // iOS Safari (no prompt API, manual flow needed)
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
}
```

Captures the `beforeinstallprompt` event (calls `preventDefault()` to defer it for the Settings "Установить" button). Listens for `appinstalled` + `(display-mode: standalone)` media-query changes. Used by `MobileSettings` to render one of four states: installed (green "Установлено"), can-install (blue "Установить"), iOS (Share icon + 3-step sheet), or waiting (gray "Ожидание браузера…").

---

## Popovers, toasts, empty states

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

### `useExportToast()` / `<ExportToast />`
File: [useExportToast.tsx](../src/app/components/useExportToast.tsx)

```ts
useExportToast() → {
  start: (p: ExportToastParams) => void;
  close: () => void;
  node: ReactNode;           // render once, e.g. inside the page root
}

interface ExportToastParams {
  title?: string;
  subtitle?: string;       // e.g. 'Отчёт по организациям за 01.04–13.04.2026'
  fileName?: string;       // shown in success
  fileSize?: string;       // '245 KB'
  shouldError?: boolean;   // force error phase (for retry demo)
  delayMs?: number;        // default 1500
}

// Also exported for showcase pages:
<ExportToast
  phase="processing" | "success" | "error"
  params={ExportToastParams}
  onClose={() => void}
  onRetry?={() => void}
  inline?={boolean}      // static positioning instead of fixed top-right
  dark?={boolean}        // override global useDarkMode()
/>
```

Phases: `processing` (spinner, no close) → `success` (8s auto-dismiss, Download ghost) or `error` (Retry ghost, manual close). Dark theme: card bg `#1A1D27`, 1px border `#2D3148`, 3px left-border semantic color, subtle `0 2px 8px rgba(0,0,0,0.3)` shadow, 8px radius. Auto-themes via `useDarkMode()`.

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
  dark?: boolean;            // force theme variant; omit to follow useDarkMode()
}
```

Drop inside any empty table body or dashboard card. Six canonical variants are showcased at `/empty-states`. Dark spec — icon `#4A4F63`, title `D.text2 #A0A5B8` (subdued, not `text1`), subtext `#6B7280`, outline-btn hover bg `D.tableHover #1E2130`. Typography: DM-Sans 18/600.

---

## Theming, inputs, forms

### `useDarkMode()` / `useThemePref()`
File: [useDarkMode.tsx](../src/app/components/useDarkMode.tsx)

```ts
useDarkMode(): [boolean, (next: boolean | ((prev: boolean) => boolean)) => void]
useThemePref(): [ThemePref, resolvedDark: boolean, setPref: (p: ThemePref) => void]
// ThemePref = 'light' | 'dark' | 'system'
```

Module-level store backed by `localStorage['moment-kpi-theme']`. `useDarkMode()` is a **drop-in** for `useState<boolean>(false)` — the signature is identical, but state is shared across all pages and persists across route changes. Writes always normalize to `'light'` / `'dark'`; use `useThemePref()` to write `'system'`. Listens to OS `prefers-color-scheme` changes when pref is `'system'`.

### `iconVariant()`
File: [iconVariant.ts](../src/app/components/ds/iconVariant.ts)

```ts
type IconVariantName = 'blue' | 'violet' | 'green' | 'cyan' | 'amber' | 'rose';
iconVariant(variant: string, dark: boolean): { bg: string; color: string };
```

Dark-aware palette for tinted icon tiles inside stat cards, list rows and compact chips. Light palette matches Tailwind 50/600 pairs; dark palette is 15 % alpha washes over the colored accent for consistent contrast on `#1A1D27`. Returns blue as the fallback for unknown variant names. Used by `BankAdminDashboardPage`, `OrgDetailPage`, and the mobile-dashboard row components.

### `renderMarkdown(text, dark?)` / `<FormatToolbar />`
File: [renderMarkdown.tsx](../src/app/components/renderMarkdown.tsx)

```ts
renderMarkdown(text: string, dark?: boolean = false): React.ReactNode

<FormatToolbar
  textareaRef={React.RefObject<HTMLTextAreaElement | null>}
  value={string}
  onChange={(next: string) => void}
  dark?={boolean}          // omit to follow useDarkMode()
/>
```

Grammar (deliberately narrow): `**bold**`, `_italic_`, lines starting with `-`/`•`/`*` grouped into `<ul>`, blank lines separate paragraphs, single `\n` → `<br>`. Output is pure React nodes (no `dangerouslySetInnerHTML`). Toolbar wraps selection using `setSelectionRange`; the bullet button toggles list prefix across selected lines.

Dark rendering: body text `D.text2`, strong `D.text1`, em `D.text2`, bullets `D.text4`, links `D.blue`. Toolbar — container bg `D.tableAlt #161822`, icons `D.text2`, active/hover icon `D.blue`, hover bg `D.tableHover`. Callers must pass `darkMode` to `renderMarkdown(body, darkMode)` — it does **not** read the hook directly since it's a function, not a component.

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
  dark?: boolean;             // omit to follow useDarkMode()
}
```

Three sections: left range readout ("Показано X–Y из Z"), center page-size select (72 px compact), right page buttons with ellipsis algorithm (always show first + last + current ±1). Changing `pageSize` automatically resets `page` to 1 via `onPageChange(1)`. Dark spec — container transparent (sits on card), top border `D.border #2D3148`, arrows `D.text3 #6B7280` → `D.text2 #A0A5B8` on hover, page buttons `D.text2` default / `D.blue` active bg with white text, hover bg `D.tableHover #1E2130`, page-size select bg `D.surface`.

### `<RadioGroup />` / `<RadioIndicator />`
File: [RadioCard.tsx](../src/app/components/RadioCard.tsx)

```ts
interface RadioOption<T> {
  value: T;
  label: string;
  sub?: string;
  disabled?: boolean;         // non-interactive, muted, excluded from roving tabindex
  children?: React.ReactNode;
}
interface RadioGroupProps<T> {
  label: string;              // aria-label on the radiogroup container
  name: string;
  value: T;
  options: RadioOption<T>[];
  onChange: (next: T) => void;
  orientation?: 'horizontal' | 'vertical';
  dark?: boolean;             // omit to follow useDarkMode()
}
```

WAI-ARIA `radiogroup` pattern. Roving tabindex: only the selected card is `tabIndex=0`. Keyboard — ↑/↓/←/→ wraps through **enabled** options, Home/End jumps, Space/Enter re-selects. Focus ring is rendered only for `:focus-visible` (keyboard focus); injected once via a scoped `<style id="rc-focus-styles">` that references a CSS variable `--rc-focus-ring` set inline on each `radiogroup` root — so light and dark groups on the same page can coexist with different ring colors. `RadioIndicator` fills solid blue with white inner dot when selected (no hollow-ring quirks on dark).

Dark states: default border `D.border`, hover bg `D.tableHover`, selected bg `D.blueLt #1E2A4A` + 2px `D.blue` border, disabled bg `D.tableAlt #161822` + text `D.text4 #4A4F63`, focus ring `D.focusRing #1E3A5F`.

### `<DateRangePicker />`
File: [DateRangePicker.tsx](../src/app/components/DateRangePicker.tsx)

Range picker with a quick-presets panel (Сегодня / Вчера / 7 дней / 30 дней / этот месяц / прошлый месяц). No fixed width on the presets column — it sizes to content. Fully dark-themed: trigger, popover, preset list, dual-calendar nav, day cells, footer action bar, warning pill, Cancel/Apply. Reads `useDarkMode()` internally — no prop required. Popover shadow deepens on dark bg.

### `<OrgDetailDrawer />`
File: [OrgDetailDrawer.tsx](../src/app/components/OrgDetailDrawer.tsx)

Slide-in drawer used from [OrganizationsPage](../src/app/pages/OrganizationsPage.tsx). Full-page equivalent is [OrgDetailPage](../src/app/pages/OrgDetailPage.tsx) at `/organizations/:id`. Fully dark-aware: 4 tabs (Сводка / Продавцы / Карты / Финансы) all themed, status badges + card-row status pills use dedicated dark palettes (`ORG_STATUS_DARK`, `CARD_STATUS_DARK`). `CompactStatCard` variant colors (blue/green/violet/amber) swap to 15% opacity tints on dark. Backdrop deepens from `rgba(17,24,39,0.35)` to `rgba(0,0,0,0.55)` on dark. Reads `useDarkMode()` internally.
