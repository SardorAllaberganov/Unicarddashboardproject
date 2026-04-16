# Architecture

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **React 18.3.1** | functional components only |
| Build | **Vite 6.3.5** | `pnpm dev` / `pnpm build` |
| Language | TypeScript | |
| Routing | **react-router 7.13** | `createBrowserRouter`, not `react-router-dom` |
| Styling | **Tailwind CSS 4.1.12** | No `tailwind.config.js`; theme tokens live in CSS `@theme inline`. Inline `style={{ ... }}` is the primary styling mechanism — Tailwind is used sparingly. |
| UI primitives | **@radix-ui/*** (40+ packages) + **shadcn/ui** patterns | In [src/app/components/ui/](../src/app/components/ui/) |
| Charts | recharts 2.15 | |
| Animation | motion 12 | |
| Forms | react-hook-form 7.55 | |
| Icons | lucide-react 0.487 | |
| Dates | date-fns 3.6 | |
| Drag-drop | react-dnd 16 | Card import page |
| Toasts | sonner 2 + bespoke `useExportToast` | |

## Folder layout

```
src/
├── app/
│   ├── App.tsx                    # RouterProvider entry
│   ├── routes.tsx                 # createBrowserRouter config
│   ├── pages/                     # one file per route
│   └── components/
│       ├── Sidebar.tsx            # unified bank/org sidebar (role-switched); theme toggle now lives in Navbar
│       ├── Navbar.tsx             # sticky top bar + theme toggle (180° spin) + 4-state notification bell + user menu
│       ├── DateRangePicker.tsx    # dark-aware range picker
│       ├── EmptyState.tsx         # shared zero-state primitive (dark-aware)
│       ├── PaginationBar.tsx      # shared pagination with page-size select + ellipsis (dark-aware)
│       ├── RadioCard.tsx          # accessible radiogroup + roving tabindex (dark-aware + disabled support)
│       ├── OrgDetailDrawer.tsx    # 4-tab slide-in drawer for /organizations (dark-aware)
│       ├── usePopoverPosition.ts  # shared anchored-popover hook
│       ├── useExportToast.tsx     # shared export-toast hook + <ExportToast /> (dark-aware)
│       ├── useDarkMode.tsx        # module-level theme store (localStorage-backed)
│       ├── renderMarkdown.tsx     # markdown-lite renderer + FormatToolbar (dark-aware)
│       ├── ds/
│       │   ├── tokens.ts          # F (fonts), C (colors), D (dark), theme()
│       │   └── Row1…Row10.tsx     # design-system showcase rows
│       ├── mds/                   # mobile design system sections (desktop-canvas reference, not mobile routes)
│       │   ├── frame.tsx          # PhoneFrame / Pair / SectionBlock + MDS constants (safe areas, tab-bar blur bg)
│       │   └── M_*.tsx            # section components for /mobile-design-system (§1 Navigation…§20 Advanced)
│       ├── ui/                    # ~40 shadcn/ui primitives
│       └── figma/
│           └── ImageWithFallback.tsx   # PROTECTED — do not modify
├── styles/
│   ├── theme.css                  # @theme inline tokens (light + dark)
│   └── fonts.css                  # the only place fonts are imported
docs/                              # this folder
tasks/
└── lessons.md                     # cross-session lessons
.claude/
└── commands/                      # slash commands (/doc_sync, /commit, /start_task)
```

## Role detection

There's no auth state; role is inferred from the URL:

- Paths under `/dashboard`, `/organizations`, `/card-batches`, `/kpi-config`, `/card-import`, `/all-cards`, `/rewards`, `/reports`, `/users`, `/settings` → **Bank Admin**.
- Paths in `ORG_PATHS` (declared at module level in [Navbar.tsx](../src/app/components/Navbar.tsx) — `/org-dashboard`, `/sellers`, `/org-cards`, `/card-assignment`, `/org-rewards`, `/org-withdrawals`, `/org-settings`, `/seller-messages`) → **Organization Admin**.
- Shared pages (`/notifications`, `/card-detail/:id`) accept `?from=org` to flip the detected role. Navbar checks `window.location.search` for this flag.

The `detectRole()` helper in [Navbar.tsx](../src/app/components/Navbar.tsx) is the single source of truth. If you add a new org-only route, **append it to `ORG_PATHS`**, or the navbar will render the wrong avatar and switch target.

## Theming

- All tokens live in [tokens.ts](../src/app/components/ds/tokens.ts) as three objects:
  - `C` — light palette.
  - `D` — dark-mode overrides (merged on top of `C`).
  - `F` — font families.
- `theme(dark: boolean)` returns the merged palette for the current mode.
- CSS custom properties for shadcn/ui-style components live in [theme.css](../src/styles/theme.css) and toggle via a `.dark` class on a root element.
- **Dark mode state is global** via the [useDarkMode](../src/app/components/useDarkMode.tsx) hook — a module-level store backed by `localStorage['moment-kpi-theme']` with values `'light' | 'dark' | 'system'`. Every page calls `const [darkMode, setDarkMode] = useDarkMode();` (signature identical to `useState<boolean>(false)`), so toggles from the **Navbar** or Settings Profile tab persist across route changes. The `useThemePref()` sibling hook exposes the 3-way preference for the Settings Profile tab.
- **Toggle location:** the theme toggle lives in the [Navbar](../src/app/components/Navbar.tsx) right-hand cluster. It was previously in the Sidebar's bottom bar; that row has been removed. The `onDarkModeToggle` prop on `<Sidebar>` is now a deprecated no-op kept for backward compatibility.

### Token surface (tokens.ts)

Spec-aligned dark palette (Prompt 0). Both `C` and `D` expose:

- **Backgrounds** — `pageBg`, `surface`, `sidebarBg`, `tableHeaderBg`, `tableHover`, `tableAlt`
- **Text** — `text1` / `text2` / `text3` / `text4`, `textDisabled`
- **Borders** — `border`, `sidebarBorder`, `inputBorder`, `divider`
- **Brand** — `blue`, `blueHover`, `blueLt`, `blueTint`
- **Semantic** — `success` / `successBg`, `warning` / `warningBg`, `error` / `errorBg`, `info` / `infoBg`
- **Decoration** — `focusRing`, `skeletonBase`, `skeletonShimmer`, `overlay`, `progressTrack`

Dark notes: sidebar has its own deeper shade `#12141C` (vs generic `surface #1A1D27`); semantic bg tints are at **10% opacity** (reduced from 12%); `tableHeaderBg #161822` is distinct from card surface; `focusRing #1E3A5F` is used as the `box-shadow` for keyboard focus on inputs.

### Page-level dark-theming pattern

Pages add `const t = theme(darkMode); const dark = darkMode;` at the top of the default export, then replace `C.*` → `t.*` throughout JSX. Page-local helper components (`StatusBadge`, `FilterSelect`, `StatCard`, `ActionMenu`, …) **accept `t` + `dark` as props** rather than calling `useDarkMode()` inline — this lets showcase pages force a specific theme per-cell to show light/dark side-by-side.

Shared primitives ([EmptyState](../src/app/components/EmptyState.tsx), [PaginationBar](../src/app/components/PaginationBar.tsx), [RadioGroup](../src/app/components/RadioCard.tsx), [ExportToast](../src/app/components/useExportToast.tsx), [FormatToolbar](../src/app/components/renderMarkdown.tsx), [DateRangePicker](../src/app/components/DateRangePicker.tsx), [OrgDetailDrawer](../src/app/components/OrgDetailDrawer.tsx)) use the opposite pattern — they read `useDarkMode()` by default and accept an optional `dark` prop to override. The `renderMarkdown()` function takes dark as its **2nd positional arg** instead since it's a function, not a component.

Status badges with multiple states (e.g. Активна / На паузе / Неактивна across pages) define two sibling maps — `STATUS_STYLE_LIGHT` and `STATUS_STYLE_DARK` — and branch on `dark`. Saturated pill colors aren't in the token layer.

## Shared primitives

In-house hooks/components that exist to prevent copy-paste drift:

1. **[usePopoverPosition.ts](../src/app/components/usePopoverPosition.ts)** — any ⋯ action menu, filter select, or form dropdown anchored to a trigger uses this. It handles `position: fixed`, measure-before-paint auto-flip, outside-click, and **re-anchoring on scroll/resize** (the popover follows its trigger as the container scrolls; it only closes if the trigger leaves the viewport). Important for dropdowns hosted inside scrollable modals.
2. **[useExportToast.tsx](../src/app/components/useExportToast.tsx)** — every "Экспорт" / "Скачать Excel" button hooks through this. Three-phase toast (processing → success/error), single-flight, 8s auto-dismiss on success. Dark-aware. The `<ExportToast />` view component is also exported for showcase pages (`inline` + `dark` props).
3. **[EmptyState.tsx](../src/app/components/EmptyState.tsx)** — every empty table/list/card view renders `<EmptyState />`, not an ad-hoc div. 6 canonical variants demoed at `/empty-states`; 7 first-use variants at `/empty-states-first-use`. Dark-aware.
4. **[useDarkMode.tsx](../src/app/components/useDarkMode.tsx)** — drop-in replacement for `useState<boolean>(false)` on page-level dark-mode state. Backed by a module-level store + `localStorage['moment-kpi-theme']`. Also exposes `useThemePref()` for the 3-way preference.
5. **[renderMarkdown.tsx](../src/app/components/renderMarkdown.tsx)** — markdown-lite renderer + `<FormatToolbar>` for announcement / message body composition. Narrow grammar (`**bold**`, `_italic_`, bullet lists). Dark-aware — `renderMarkdown(text, dark)` / `<FormatToolbar dark? />`. Live demo at `/markdown-showcase`.
6. **[PaginationBar.tsx](../src/app/components/PaginationBar.tsx)** — full-width pagination row with page-size selector and ellipsis page buttons. Persists preferred page size in `localStorage['pagesize:{storageKey}']`. Dark-aware. Live demo at `/pagination-showcase`.
7. **[RadioCard.tsx](../src/app/components/RadioCard.tsx)** — accessible `<RadioGroup>` with roving tabindex, arrow-key navigation, and `:focus-visible`-only ring (scoped via `--rc-focus-ring` CSS var so multiple groups with different themes can coexist). Supports per-option `disabled`. Dark-aware. Live demo at `/radio-card-showcase`.

Shimmer loading states share a single `@keyframes skeletonShimmer` recipe (light→lighter→light gradient, 200% background-size, 1.5s linear infinite) — see `/skeleton-states` for 6 variants. Dark shimmer uses `D.skeletonBase #2D3148` → `D.skeletonShimmer #363B52`.

If you find yourself writing a fourth copy of something, hoist it here too. See [tasks/lessons.md](../tasks/lessons.md) for the triggers that prompted each extraction.

## Inline-styles convention

Most pages use inline `style={{ ... }}` with values from `F`/`C` tokens rather than Tailwind classes. The project follows the rule: **no Tailwind font-size / font-weight / line-height classes** — those defaults live in [theme.css](../src/styles/theme.css). Tailwind is used mostly for the shadcn/ui primitives under [`components/ui/`](../src/app/components/ui/).

## Build & dev

- `pnpm dev` — Vite dev server on port 5173.
- `pnpm build` — Vite production build.
- No test suite currently wired up.
- No CI pipeline committed.
- `pnpm-lock.yaml` is **protected** — do not modify by hand.
