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
