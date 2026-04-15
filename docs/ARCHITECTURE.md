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
│       ├── Sidebar.tsx            # unified bank/org sidebar
│       ├── Navbar.tsx             # sticky top bar + notification bell + user menu
│       ├── DateRangePicker.tsx
│       ├── EmptyState.tsx         # shared zero-state primitive
│       ├── OrgDetailDrawer.tsx
│       ├── usePopoverPosition.ts  # shared anchored-popover hook
│       ├── useExportToast.tsx     # shared export-toast hook
│       ├── ds/
│       │   ├── tokens.ts          # F (fonts), C (colors), D (dark), theme()
│       │   └── Row1…Row10.tsx     # design-system showcase rows
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
- Dark mode state lives on each page (`const [darkMode, setDarkMode] = useState(false)`) and is passed to `<Navbar>` / `<Sidebar>`. There is no global theme provider — persistence across routes is intentionally out of scope for this design prototype.

## Shared primitives

Three in-house hooks/components exist to prevent copy-paste drift:

1. **[usePopoverPosition.ts](../src/app/components/usePopoverPosition.ts)** — any ⋯ action menu anchored to a table row uses this. It handles `position: fixed`, measure-before-paint auto-flip, outside-click, and scroll/resize auto-close.
2. **[useExportToast.tsx](../src/app/components/useExportToast.tsx)** — every "Экспорт" / "Скачать Excel" button hooks through this. Three-phase toast (processing → success/error), single-flight, 8s auto-dismiss on success.
3. **[EmptyState.tsx](../src/app/components/EmptyState.tsx)** — every empty table/list/card view renders `<EmptyState />`, not an ad-hoc div. 6 canonical variants demoed at `/empty-states`.

If you find yourself writing a fourth copy of something, hoist it here too. See [tasks/lessons.md](../tasks/lessons.md) for the triggers that prompted each extraction.

## Inline-styles convention

Most pages use inline `style={{ ... }}` with values from `F`/`C` tokens rather than Tailwind classes. The project follows the rule: **no Tailwind font-size / font-weight / line-height classes** — those defaults live in [theme.css](../src/styles/theme.css). Tailwind is used mostly for the shadcn/ui primitives under [`components/ui/`](../src/app/components/ui/).

## Build & dev

- `pnpm dev` — Vite dev server on port 5173.
- `pnpm build` — Vite production build.
- No test suite currently wired up.
- No CI pipeline committed.
- `pnpm-lock.yaml` is **protected** — do not modify by hand.
