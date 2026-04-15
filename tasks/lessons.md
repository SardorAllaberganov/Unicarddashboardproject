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

## 2026-04-16 — `location.state` handoff needs a consumed-ref guard + state clear

Mistake: Early draft of the "compose sends announcement → history highlights row" flow re-prepended the row every time the history page re-rendered (React StrictMode's double-invoke surfaced the bug immediately).
Root cause: `useEffect(() => { setRows(prev => [s.newRow, ...prev]); ... }, [location, navigate])` fires on every location change AND in StrictMode fires twice on mount. Without an idempotency guard, the newRow was inserted multiple times.
Fix: Guard the consumption with a `useRef(false)` flipped on first successful read. After consuming, clear the state via `navigate(location.pathname, { replace: true, state: null })` so a refresh or back-forward navigation doesn't re-trigger the pulse.
Rule: One-shot `location.state` handoffs need two guards: (1) a `consumedRef` so the effect runs its body at most once per navigation, (2) a `navigate(replace: true, state: null)` at the end so a refresh / back-button doesn't re-fire. Pattern applies to compose→history, duplicate rule prefills, and any "redirect with payload" flow.
