# Lessons Learned

Patterns and mistakes to avoid. Updated after every correction from the user. Review this file at the start of each task via `/start_task`.

## Template

```
[YYYY-MM-DD] — [Short description]
Mistake: What went wrong
Root cause: Why it happened
Fix: What was done to correct it
Rule: What to do differently next time
```

---

## 2026-04-16 — `<Sidebar>` / `<Navbar>` use `darkMode`, NOT `dark`

Mistake: Multiple theming agents threaded `dark={dark}` into `<Sidebar>` / `<Navbar>` instead of `darkMode={darkMode}`. TypeScript tolerated it as an unknown prop (stripped at runtime), so the shell appeared to work in light mode but flickered on theme toggle.
Root cause: Every page-local helper in this codebase uses `dark: boolean` as its prop name, so it feels natural to pass `dark` everywhere. But the shared shell components were written before the `dark`-prop convention solidified and kept their original name `darkMode: boolean`.
Fix: When the theming agent reports complete, grep each touched file for `<Sidebar ` / `<Navbar ` and confirm the prop name is `darkMode`, not `dark`.
Rule: Shared shell components (`Sidebar`, `Navbar`) take `darkMode={darkMode}`. Every other component in the codebase takes `dark={dark}`. When reviewing a page's theming work, audit the shell props first.

## 2026-04-17 — Mobile form inputs must auto-scroll to center on focus

Mistake: On mobile, tapping a form field near the bottom of the viewport caused the keyboard to open and push the field out of view — the user couldn't see what they were typing.
Root cause: Mobile browsers don't reliably scroll focused elements into view when the virtual keyboard appears, especially inside scrollable divs that aren't the document body.
Fix: Added `scrollIntoView({ behavior: 'smooth', block: 'center' })` on focus with a 120 ms `setTimeout`. The delay lets the keyboard animation start before the scroll adjusts, so the field lands in the visible center of the viewport — not at the edge.
Rule: Every `FormInput`, `FormTextarea`, and custom input wrapper in a mobile form page must have a wrapper `ref` and call `scrollIntoView` on focus. Pattern: `const wrapRef = useRef<HTMLDivElement>(null); onFocus={() => { setFocused(true); setTimeout(() => wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120); }}`.

## 2026-04-16 — Mobile reference ≠ mobile-responsive route

Mistake: When first asked to build "a mobile-first design system at 390×844", it's tempting to (a) make the whole app mobile-responsive via viewport media queries, or (b) create standalone mobile routes with no desktop chrome. Neither matches the project's intent.
Root cause: The project targets desktop 1920×1080. Mobile work in this codebase is a **design reference catalogue** for designers and mobile-app engineers — it documents what mobile *should* look like, but the live SPA stays desktop. The existing sidebar/navbar shell is already wired for every page, so wrapping mobile mockups in it lets devs navigate between `/design-system` and `/mobile-design-system` without a separate shell.
Fix: Built [src/app/components/mds/frame.tsx](../src/app/components/mds/frame.tsx) with a `PhoneFrame` primitive — 390 px fixed width, rounded bezel, dark outer surround — plus a `<Pair>` helper that renders pinned light+dark side-by-side regardless of the global theme (same pattern as other showcases). Every section in `/mobile-design-system` and `/mobile-tab-bar` renders inside `PhoneFrame` on the desktop canvas. Mobile-specific tokens (safe areas, tab-bar backdrop, iOS touch highlight, Android ripple) live in the `MDS` const in `frame.tsx`, separate from `ds/tokens.ts`.
Rule: For any new mobile deliverable — master reference, per-component drill-down, or new §-section — reuse `PhoneFrame` / `Pair` / `SectionBlock` from `mds/frame.tsx`. Keep the desktop sidebar+navbar shell. Treat interactions as static visual mocks unless explicitly asked to wire a real mobile route. When adding a new §-section, either extend one of the existing `M_*.tsx` files or add a new file following the same export shape (`export const M_Foo = { SectionA: ({ t }) => <Pair …>{(dark) => <Col dark={dark} />}</Pair> }`). Mobile tokens don't belong in `ds/tokens.ts`.

## 2026-04-16 — DS showcase rows: theme the chrome, keep the specimens literal

Mistake: First instinct when "theming" `Row1_ColorTypo` was to replace every hardcoded hex — including the `background: hex` on `Swatch` tiles and the `color` on `typeScale` samples — with `t.*` tokens. That would turn the palette demo into a demo of the *current theme only*, erasing the entire purpose of a swatch catalogue.
Root cause: The DS rows look like regular UI at first glance. But a swatch is a specimen, not a styled element — its whole job is to render the raw hex so a designer can point to it and say "this is `C.blue`". Typography specimens are the same: each row demonstrates "body text at #374151 looks like this". Theming the sample overwrites the demonstration.
Fix: Theme only the chrome — card container (`t.surface` / `t.border`), section headings, group labels, captions, dividers, table borders, hover bgs, input chromes, chart axis/grid, tooltip, drawer tabs, modal shadows, toast surfaces, status-pill multi-state maps via `_LIGHT`/`_DARK` siblings. Leave literal: (a) hex values inside `Swatch` tile backgrounds, (b) per-row `color` values in typography specimens, (c) Row10's light + dark side-by-side "Dark Theme Token Overrides" strip which is a pinned reference regardless of global theme.
Rule: In any showcase/reference page, ask "is this element a *specimen* or *chrome*?" Specimens demonstrate a specific literal value — leave them alone. Chrome is everything else (container, navigation, structure) — theme it. When in doubt, check: does the element appear in the page's "title" (the thing being demonstrated)? If yes, it's a specimen.

## 2026-04-16 — Modal-first theming is a valid middle state

Mistake: When asked to "theme every modal across the platform," the first instinct was to theme each modal's parent page in full — which ballooned scope to ~10,000 lines and blocked delivery.
Root cause: Modals are rendered as helpers inside parent pages, so a modal can only read `t = theme(darkMode)` if the page sets that up at root. Feels like the page must be themed first.
Fix: Each unthemed parent page already called `useDarkMode()` to forward `darkMode` to the shell. Adding `const t = theme(darkMode); const dark = darkMode;` right after that line takes the modal dependencies from zero to ready in one edit — no page-level changes needed. Then thread `t`/`dark` into just the modal helpers. The page stays visually light; the modal flips correctly with the global toggle.
Rule: For multi-pass rollouts (ship modal theming before page-body theming), add the `t`/`dark` derivation at page root even if you're not going to consume it outside helpers yet. The derivation is a no-op cost and unblocks modal theming immediately. The resulting half-themed state is fine as a landing pad — it's ugly but functional, and the next pass only needs to walk the JSX.

---

## 2026-04-14 — Action dropdowns clipped inside table with `overflow-x: auto`

Mistake: The `ActionDropdown` menu on the last row of `UsersManagementPage` was cut off at the table's bottom edge — only a few items were visible.
Root cause: The menu used `position: absolute` inside a wrapper with `overflow-x: auto`. Per the CSS spec, setting `overflow-x` to anything other than `visible` forces `overflow-y` to `auto` too, which clips absolutely-positioned children.
Fix: Switched the menu to `position: fixed` anchored to the trigger's `getBoundingClientRect()` — escapes every ancestor's overflow.
Rule: Dropdown/popover menus rendered inside scrollable containers must use `position: fixed` with viewport-relative coordinates, never `position: absolute`. A parent using `overflow-x: auto` silently clips the y-axis too.

## 2026-04-14 — Dropdown appearing "too far above" when flipped

Mistake: When the menu flipped upward for last-row clicks, it floated well above the trigger instead of sitting right above it.
Root cause: The flip used a hardcoded `menuHeight = 220` estimate, but the real menu was ~150–160px. The extra 60–70px of phantom height pushed the `top` coordinate too high.
Fix: Replaced the estimate with a real measurement — render the menu hidden first, then read `menu.offsetHeight` via `useLayoutEffect` before the browser paints.
Rule: Never hardcode element dimensions when deciding anchored-popover placement. Measure via a ref after mount, and use `useLayoutEffect` so the measurement + final position are committed before paint.

## 2026-04-14 — Visible "jump" animation when menu flipped direction

Mistake: On last-row clicks the menu briefly rendered below the trigger, then jumped upward when the useEffect fired — looked like a janky slide animation.
Root cause: Initial render placed the menu at `rect.bottom + 6` before measurement. The subsequent flip via `setMenuPos` caused a visible second paint.
Fix: Added a `measured` flag; on first render the menu is `visibility: hidden` + `pointer-events: none` so it can measure invisibly, then reveals only after the `useLayoutEffect` has placed it in the correct final position.
Rule: When anchored positioning needs a measure-then-flip step, keep the element hidden until the final coordinates are applied. A user should never see an intermediate wrong position.

## 2026-04-14 — Duplicated popover logic across pages

Mistake: Every page rebuilt its own `ActionDropdown` with the same clipping/flip bugs — fixing one didn't help the others.
Root cause: Copy-pasted patterns with no shared primitive. Each page had its own outside-click handler, open state, and absolute positioning.
Fix: Extracted [usePopoverPosition.ts](src/app/components/usePopoverPosition.ts) — returns `{ open, toggle, close, triggerRef, menuRef, rootRef, menuStyle }`. Migrated all 4 action dropdowns (Users, Withdrawals, CardBatchDetail, CardBatches, Sellers) to use it.
Rule: The third time a pattern appears, extract it. For popovers specifically: one shared hook that handles fixed positioning, auto-flip, measure-before-paint, click-outside, and scroll/resize auto-close.

## 2026-04-14 — Disabled-looking buttons that are still clickable

Mistake: Buttons at their bounds (count=1 on a "−" button, or non-applicable in a given mode) still had `cursor: pointer` and no `disabled` attribute.
Root cause: Visual state was changed but the `disabled` prop was never set — accessibility tooling and keyboard users could still fire the handler.
Fix: Added `disabled` attribute + `cursor: not-allowed` + muted color/bg when the button is non-functional. Added `aria-label` on icon-only buttons.
Rule: If a button is non-functional in a given state, set `disabled={true}` (not just styling). Non-clickable ≠ merely muted.

## 2026-04-14 — Auto-connecting routes when creating new pages

Mistake: Created a new page file but forgot to wire the route / sidebar link / navbar org-path.
Root cause: Each page creation had three-to-four separate edit points; easy to miss one.
Fix: Always touch [routes.tsx](src/app/routes.tsx), the relevant sidebar (BankAdmin or OrgAdmin in [Sidebar.tsx](src/app/components/Sidebar.tsx)), and [Navbar.tsx](src/app/components/Navbar.tsx) `ORG_PATHS` in the same turn as the new page.
Rule: A new page isn't done until it's navigable. Route + sidebar + navbar role detection are part of "creating the page".

## 2026-04-14 — Ad-hoc empty states duplicated across pages

Mistake: Several pages had copy-pasted "Ничего не найдено" divs with inconsistent padding, typography, and action buttons.
Root cause: No shared primitive; each page invented its own look for the zero-state.
Fix: Added [EmptyState.tsx](src/app/components/EmptyState.tsx) implementing Prompt 0 §16 — 64px muted icon (stroke 1.25, color #D1D5DB), DM-Sans 18/700 title, Inter 13/muted subtitle, and up to three optional actions (primary / outline / ghost).
Rule: Any page with a possible zero-rows view must import `<EmptyState />` with the right icon + title + subtitle + action for that context. Never inline a `div` with an icon and text. A showcase of all 6 canonical variants lives at `/empty-states`.

## 2026-04-14 — Export buttons without user feedback

Mistake: Every "Экспорт" / "Скачать Excel" button across the app was a no-op with no visual feedback; clicking felt broken.
Root cause: Each page wired its own download button but none of them triggered any toast or progress UI. Building a per-page toast for every export would have been duplication.
Fix: Added [useExportToast.tsx](src/app/components/useExportToast.tsx) — a shared hook that manages a single top-right toast through three phases: Processing (spinner, no close) → Success (file name + size, Ghost "Скачать" action, 8s auto-dismiss) → Error (Ghost "Повторить", manual close). Pages wire `start({ subtitle, fileName, fileSize, shouldError? })` and render `node` once.
Rule: Every export button must route through `useExportToast`. Never attach a plain `onClick` that silently "downloads". Call `start()` with at minimum a subtitle describing what's being exported; the hook handles the rest. Stack multiple exports is prevented because the hook holds one flow at a time.

## 2026-04-15 — Row action menu actions must also appear on the detail page

Mistake: Individual detail pages (`/announcements/:id`, `/seller-messages/:id`, …) only exposed "Дублировать" in the header while the list row's ⋯ menu offered richer status-gated actions (Редактировать / Удалить / Отменить отправку). Users who arrived via direct link or breadcrumb couldn't run those actions without bouncing back to the list.
Root cause: Detail pages were built as read-only views. Row-level actions were assumed to live only next to the row.
Fix: Every `:id` detail page now renders the same status-gated action group that its list row offers. For announcements: sent → Дублировать; scheduled → Дублировать + Отменить отправку; draft → Редактировать + Дублировать + Удалить. For seller messages (single status): Дублировать + Удалить. Destructive actions open the same confirmation modals used on the list; confirming navigates back to the list.
Rule: When a detail page exists for a list row, its header action group must **mirror** the row's ⋯ menu and use the same confirmation modals. If the list has status-gated actions, the detail page must read the status (from params, state, or the detail payload) and gate the buttons the same way. The detail page is a first-class editing surface, not a read-only pane.

## 2026-04-15 — Radio card swallowed clicks on its own label text

Mistake: On the announcement composer's Расписание and Получатели radio cards, clicking the title/sub-label text did not select the card. Only clicking the empty gutter or the radio dot worked.
Root cause: The inner content wrapper had `onClick={e => { if (children) e.stopPropagation(); }}` — a catch-all meant to stop nested inputs from re-triggering the card's `onSelect`. But that wrapper also contained the `<div>{label}</div>` and `<div>{sub}</div>` text, so text clicks were stopped too.
Fix: Keep the outer radio-card div as the single `onClick={onSelect}` surface. Wrap **only** `{children}` (the nested inputs) in a separate `<div onClick={e => e.stopPropagation()}>`. Label and sub stay bubble-up.
Rule: When a clickable card contains both text (should select the card) and inputs (should not re-select), scope `stopPropagation` to the inputs — never to the whole content area. Measure twice: any nested interactive region needs its own stop-wrapper; text labels should always bubble.

## 2026-04-14 — Monetary input left unformatted while typing

Mistake: The amount field in the manual reward adjustment modal accepted raw digits; the preview ("Баланс: 155 000 → 165 000") used thousand-space formatting but the input itself showed `10000` with no separators, breaking visual consistency.
Root cause: The onChange only filtered characters (`replace(/[^0-9 ]/g, '')`) without actively re-formatting the digits into the project's mono-style `1 234 567` shape.
Fix: On every keystroke, strip non-digits, parse to int, then re-mask through the shared `fmtUzs` helper before calling `setAmountStr`.
Rule: Every monetary input must be masked with space-thousand separators as the user types. Strip to pure digits on change, then re-apply `n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')` (same helper used for display). Also use `inputMode="numeric"` and render in `F.mono`. The internal numeric value for calculations is always `parseInt(str.replace(/\s/g, ''))`.

## 2026-04-16 — `location.state` + lucide `forwardRef` icons = `DataCloneError`

Mistake: `navigate('/notification-rules/${r.id}/edit', { state: { preFilled: r } })` crashed with `DataCloneError: Symbol(react.forward_ref) could not be cloned.` whenever the user clicked "Редактировать" from the rule detail page.
Root cause: `history.pushState` serializes `state` via the structured-clone algorithm. `Rule.icon: React.ElementType` was a lucide component — all lucide-react icons are `React.forwardRef` wrappers carrying a `Symbol(react.forward_ref)` that structured-clone rejects.
Fix: Dropped the `state` on the edit-from-detail path. The editor falls back to `INITIAL_RULES.find(r => r.id === id)` when no state is present, which works for real rules. The latent copy in `NotificationRulesPage.openEdit` was left alone because it's needed for duplicate-then-edit (synthesized ids won't be in `INITIAL_RULES`) — fix there would be to strip the `icon` field before passing.
Rule: Anything passed through `location.state` must be JSON-serializable. React components, functions, DOM nodes, Maps/Sets, and most class instances will crash `pushState`. For rows that carry `icon: React.ElementType`, either strip the icon before navigating OR navigate without state and let the destination re-hydrate from a module-level lookup keyed by `:id`. Test the navigation end-to-end — the error only surfaces at runtime, not at type-check.

## 2026-04-16 — Cross-page events are lost when the dispatcher unmounts

Mistake: Compose pages dispatched `window.dispatchEvent(new CustomEvent('app:notif:batch', ...))` right before `navigate()` to tell the navbar bell a batch had landed. The bell on the next page never received them.
Root cause: Each page mounts its own `<Navbar>`. `navigate()` triggers unmount of the current page (and its navbar instance) before the next page mounts its own. The event fires in the window between unmount and mount — no subscribers.
Fix: For the bell's design spec, added in-dropdown demo buttons that dispatch + consume the events in the same navbar instance so the flow is exercisable. Real cross-page delivery requires a module-level store (or a queue hydrated from `sessionStorage` on mount).
Rule: Don't rely on `window` CustomEvents to carry state across navigations when the subscriber unmounts with the page. Options in order of preference: (1) module-level mutable store with a subscribe API, (2) `sessionStorage` queue consumed on mount, (3) `location.state` handoff if it's a one-shot per-navigation payload. Never dispatch-and-navigate expecting the destination to hear.

## 2026-04-16 — `:focus-visible` cannot be expressed with inline styles

Mistake: Accessible radio cards should show a focus ring for keyboard focus but not for mouse clicks. Writing `onFocus`/`onBlur` state tracking gave rings on every focus (including mouse), defeating the spec.
Root cause: CSS `:focus-visible` is a pseudo-class — browsers compute it themselves based on heuristics (last input modality). React inline styles can't target pseudo-classes; `onFocus` fires for both mouse and keyboard focus.
Fix: The RadioGroup component injects a scoped `<style>` block once on first mount via a `STYLE_ID` idempotent `document.head.appendChild` — the block defines `.rc-option:focus-visible { outline: 2px solid blue; outline-offset: 2px; }`. Cards get `className="rc-option"`. A mousedown handler also calls `focus({ preventScroll: true })` so the focus ring doesn't flicker on mouse.
Rule: Whenever the spec calls for keyboard-only focus rings, use `:focus-visible` via a scoped injected stylesheet — never approximate with `onFocus` state or plain `:focus`. Inline styles only work for always-on visuals; pseudo-class states need CSS. Pattern template in [RadioCard.tsx](../src/app/components/RadioCard.tsx).

## 2026-04-16 — Cross-route state needs a drop-in hook signature

Mistake: Adding dark-mode persistence tempted a full refactor — replacing `darkMode: boolean` props + local `useState` across 42 pages with a new context provider pattern. That's 42 PR-worthy changes.
Root cause: Default thinking for "global state" goes to Context or external stores, which both change call-site shape.
Fix: Built `useDarkMode()` to return the exact shape of `useState<boolean>(false)` — `[value, setter]` where the setter accepts both `boolean` and updater functions. All 42 pages needed only a 1-line swap: `const [darkMode, setDarkMode] = useState(false)` → `= useDarkMode()`. Done via `sed` in a single bash loop.
Rule: When retrofitting global state into an existing codebase, match the signature the pages are already using. A hook that mimics `useState<T>()` is a trivial swap; a Context provider that forces call-site restructure is a refactor. Corollary: when you design a hook from scratch, consider whether a future upgrade to "shared" might happen — preserving the `[value, setter]` shape keeps the upgrade painless.

## 2026-04-16 — Dark theming needs page-local helpers to accept `t` as a prop, not read the hook

Mistake: First attempt at retrofitting dark mode into `OrganizationsPage` did a global `C.*` → `t.*` sed swap. The page's default export compiled, but every helper component defined in the same file (`StatusBadge`, `FilterSelect`, `SortIcons`, `PaginationBtn`, `PrimaryButton`) broke with `t is not defined` at runtime because `t` was only in the default export's scope.
Root cause: Inline styles reference `t` as a closed-over variable. Helpers compiled in a different scope can't see it.
Fix: Thread `t: T` + `dark: boolean` as props into every helper component, top-down from the default export. Don't have helpers call `useDarkMode()` inline — it breaks the showcase pattern where multiple themes render on one page.
Rule: Page-local helpers (`StatusBadge`, `FilterSelect`, `StatCard`, `ActionMenu`, … — anything defined inside the page file) take `t` + `dark` as props. Shared primitives (`EmptyState`, `PaginationBar`, `RadioGroup`, `ExportToast`, `FormatToolbar`, `DateRangePicker`, `OrgDetailDrawer`) take the opposite approach — read `useDarkMode()` by default, accept optional `dark` prop to force a variant for showcase use. `renderMarkdown()` is a function (not a component) so it gets the dark flag as its 2nd positional arg.

## 2026-04-16 — Status badges need dedicated dark palettes, not token-level colors

Mistake: Attempted to reuse `t.successBg` / `t.warning` for status pill backgrounds and text colors. The pill text became unreadable — `C.success` (green-500) on light pill bg worked, but `D.success` (emerald-400) against a `rgba(52,211,153,0.10)` tint flattened into mush.
Root cause: Semantic tokens in `C` / `D` are designed for icons, borders, and plain text on neutral surfaces — not for the saturated "pill text on tinted pill bg" combination. The text color for a dark status pill needs to match the pill's accent hue at `~#34D399`, not the same `D.success` token used elsewhere.
Fix: Define sibling `STATUS_STYLE_LIGHT` + `STATUS_STYLE_DARK` maps at module scope. The dark map's `bg` is a `rgba(..., 0.12)` tint, the `color` is the saturated lucide-palette variant (`#34D399` / `#FBBF24` / `#F87171`), and `dot` matches `color`. Branch on `dark` at use site.
Rule: When a status pill is one of N states (Активна / На паузе / Неактивна / Черновик / Завершена etc.), write a dedicated `_DARK` sibling map instead of trying to derive it from `t.*`. Saturated accent colors aren't in the token layer and shouldn't be forced there — tokens are for UI chrome, not for brand-level status color systems.

## 2026-04-16 — `:focus-visible` ring needs a CSS variable when multiple themes share the page

Mistake: Radio-card showcase rendered five states × two themes on one page. Both the light-variant and dark-variant rows produced the same focus ring color because the injected stylesheet used a literal `${C.focusRing}` — hard-coded into the CSS text, not reactive.
Root cause: `ensureStyles()` runs once. The injected CSS is a static string. It can't branch on a component's `dark` prop.
Fix: Inject a single CSS rule using `var(--rc-focus-ring, ${C.focusRing})`. Each `radiogroup` root sets `--rc-focus-ring` inline via `style={{ ['--rc-focus-ring' as string]: t.focusRing }}`. The variable cascades only inside that group's DOM subtree, so light and dark groups on the same page get their own ring color.
Rule: When `:focus-visible` (or any pseudo-class) styling must vary per instance, don't inject per-variant stylesheets — inject one rule that references a CSS custom property, then set the property inline on the root of each instance. This works for any shared primitive that has multiple color-reactive visuals: focus rings, hover outlines, placeholder colors, etc.

## 2026-04-16 — `location.state` handoff needs a consumed-ref guard + state clear

Mistake: Early draft of the "compose sends announcement → history highlights row" flow re-prepended the row every time the history page re-rendered (React StrictMode's double-invoke surfaced the bug immediately).
Root cause: `useEffect(() => { setRows(prev => [s.newRow, ...prev]); ... }, [location, navigate])` fires on every location change AND in StrictMode fires twice on mount. Without an idempotency guard, the newRow was inserted multiple times.
Fix: Guard the consumption with a `useRef(false)` flipped on first successful read. After consuming, clear the state via `navigate(location.pathname, { replace: true, state: null })` so a refresh or back-forward navigation doesn't re-trigger the pulse.
Rule: One-shot `location.state` handoffs need two guards: (1) a `consumedRef` so the effect runs its body at most once per navigation, (2) a `navigate(replace: true, state: null)` at the end so a refresh / back-button doesn't re-fire. Pattern applies to compose→history, duplicate rule prefills, and any "redirect with payload" flow.
