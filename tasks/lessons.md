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
