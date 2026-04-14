# PROMPT 0 — Design System & Component Library

## Moment Card KPI Platform — Master Component Reference

---

```
Create a comprehensive design system and UI component library for a fintech admin dashboard called "Moment Card KPI Platform" at 1920×1080.

This platform manages Moment VISA card sales through partner organizations, tracks three-stage KPI completion by sellers, and automates reward payouts via UCOIN wallets. Two admin roles exist: Bank Admin (sees all organizations) and Organization Admin (sees only their own sellers and cards).

STYLE: Shadcn/ui inspired — light, clean, minimal. No gradients, no decorative elements. Flat surfaces with 1px borders for hierarchy. Professional fintech aesthetic.

---

COLOR TOKENS:

Backgrounds:
- Page background: #F9FAFB
- Card / Surface: #FFFFFF with 1px border #E5E7EB
- Sidebar background: #FFFFFF, right border 1px #E5E7EB
- Table header row: #F9FAFB
- Table row hover: #F9FAFB
- Table row alternate stripe: #FAFBFC (subtle)
- Input background: #FFFFFF

Text:
- Primary text: #111827 (gray-900)
- Secondary text: #374151 (gray-700)
- Muted text: #6B7280 (gray-500)
- Placeholder text: #9CA3AF (gray-400)
- Disabled text: #D1D5DB (gray-300)

Brand & Accent:
- Primary blue: #2563EB (blue-600)
- Primary blue hover: #1D4ED8 (blue-700)
- Primary blue light: #EFF6FF (blue-50, for active nav bg, selected states)
- Primary blue tint: #DBEAFE (blue-100, for badge/icon backgrounds)

Semantic:
- Success: #10B981 (emerald-500) — text, icons
- Success bg tint: #F0FDF4 (green-50)
- Warning: #D97706 (amber-600)
- Warning bg tint: #FFFBEB (amber-50)
- Error / Destructive: #EF4444 (red-500)
- Error bg tint: #FEF2F2 (red-50)
- Info: #0891B2 (cyan-600)
- Info bg tint: #ECFEFF (cyan-50)

Stat card icon backgrounds (light tinted circles):
- Blue: #EFF6FF icon #2563EB
- Violet: #F3F0FF icon #7C3AED
- Green: #F0FDF4 icon #16A34A
- Cyan: #ECFEFF icon #0891B2
- Amber: #FFFBEB icon #D97706
- Rose: #FFF1F2 icon #E11D48

Borders & Dividers:
- Default border: #E5E7EB (gray-200)
- Input border: #D1D5DB (gray-300)
- Input focus border: #2563EB with 2px ring offset #DBEAFE
- Divider: #E5E7EB

Dark theme overrides (reference only — show as a token swatch strip, not full layout):
- Page background: #0F1117
- Card / Surface: #1A1D27, border #2D3148
- Primary text: #F1F2F6
- Secondary text: #A0A5B8
- Sidebar: #12141C, border #2D3148
- Primary blue: #3B82F6
- Input background: #1A1D27, border #2D3148
- Table row hover: #1E2130
- Success: #34D399, Error: #F87171, Warning: #FBBF24

---

TYPOGRAPHY:

Primary font: Inter (all UI text, labels, body, captions).
Heading font: DM Sans (page titles, card headings, large display numbers).
Mono font: JetBrains Mono (card numbers, amounts, IDs, transaction references).

Scale:
- Page title: DM Sans 24px / 600 weight / #111827
- Section heading: DM Sans 18px / 600 / #111827
- Card title: DM Sans 16px / 600 / #111827
- Stat display number: DM Sans 28px / 700 / #111827
- Large display number: DM Sans 32px / 700 / #111827
- Body: Inter 14px / 400 / #374151
- Body medium: Inter 14px / 500 / #374151
- Small body: Inter 13px / 400 / #6B7280
- Caption: Inter 12px / 400 / #9CA3AF
- Table header: Inter 11px / 600 / #6B7280 / uppercase / tracking-wide
- Nav group label: Inter 11px / 600 / #9CA3AF / uppercase / tracking-wide
- Badge text: Inter 12px / 500
- Button text: Inter 14px / 500
- Mono value: JetBrains Mono 14px / 500 / #111827
- Mono small: JetBrains Mono 13px / 400 / #374151

---

SPACING & LAYOUT:

Base grid: 4px increments.
Page padding: 32px.
Card padding: 20px (compact) / 24px (standard).
Card border-radius: 12px.
Card border: 1px #E5E7EB. No shadow by default (optional shadow-sm on hover for clickable cards).
Gap between cards: 16px.
Gap between sections: 24px.
Table row height: 48px.
Button height: 36px (sm) / 40px (default) / 44px (lg).
Input height: 40px.
Icon size: 16px (inline) / 20px (nav, buttons) / 40px (stat card circle) / 48px (empty state).
Avatar: 32px (nav) / 36px (sidebar user) / 28px (table cell).
Sidebar width: 260px expanded / 68px collapsed.
Content max-width: full-width (content stretches to fill available space right of sidebar).

Responsive breakpoints:
- Desktop: 1440px
- Tablet: 1024px (sidebar collapses, tables scroll, grids adjust)
- Mobile: 375px (sidebar overlay, single column, full-width cards)

---

COMPONENTS TO INCLUDE:

1. TOP BAR (not a separate navbar — integrated into content area):
   - Left: Page title (DM Sans 24px 600) + subtitle line below (Inter 14px #6B7280).
   - Right: Action buttons and controls (date picker, export button, add button) depending on page.
   - Height: auto, sits at top of content area with 32px padding. Not fixed/sticky.

2. LEFT SIDEBAR (persistent, 260px):
   - Background: white, right border 1px #E5E7EB.
   - Top: Platform logo placeholder (32×32 rounded square, border, label "Logo") + "Moment KPI" DM Sans 16px 600 #111827.
   - Collapse toggle: chevron icon button at sidebar top-right edge.
   - Navigation items: Lucide icon (20×20) + label (Inter 14px). Row height 40px, padding-left 16px, border-radius 8px.
   - Active state: background #EFF6FF, text #2563EB, icon #2563EB.
   - Hover state: background #F9FAFB.
   - Default state: text #374151, icon #6B7280.
   - Navigation group labels: "ОБЗОР", "УПРАВЛЕНИЕ", "ФИНАНСЫ", "СИСТЕМА" — styled as nav group label token.
   - Divider line between groups: 1px #E5E7EB, margin 8px vertical.
   - Bottom pinned section: User avatar (36×36, initials) + name (Inter 14px 500) + role (Inter 12px #9CA3AF). Logout icon button.
   - Collapsed state: 68px width, icons only centered, tooltip on hover with label. Logo becomes icon only. User becomes avatar only.
   - Show both Bank Admin variant (10 nav items) and Org Admin variant (7 nav items) side by side on canvas.

3. STAT CARD:
   - White card, border 1px #E5E7EB, border-radius 12px, padding 20px.
   - Layout: Icon circle (40×40, colored bg tint + colored icon) at top-left.
   - Label: Inter 13px 500, #6B7280.
   - Value: DM Sans 28px 700, #111827.
   - Trend badge (optional): small pill (border-radius 12px, padding 2px 8px), green bg tint + green text + ↑ arrow for positive, red for negative, Inter 12px 500.
   - Show 6 variants: blue, violet, green, cyan, amber, rose icon colors. One with trend, one without, one with subtitle line below value.

4. DATA TABLE (Shadcn table style):
   - Container: white card, border-radius 12px, overflow hidden.
   - Header row: background #F9FAFB, Inter 11px 600 uppercase #6B7280, sticky. Padding 12px 16px. Sort arrows (ChevronUp/Down, #D1D5DB, active #111827).
   - Body rows: 48px height, padding 12px 16px. Hover: bg #F9FAFB.
   - Cell types to show:
     a. Plain text: Inter 14px #374151.
     b. Mono value: JetBrains Mono 14px #111827 (for card numbers like "•••• 1001", amounts like "1 825 000").
     c. Badge cell (see Badge component).
     d. Avatar + Name: 28px avatar circle with initials + name text.
     e. Date: Inter 14px #374151, format "13.04.2026" or "13.04 14:32".
     f. Progress cell: mini progress bar (48px wide, 4px height, border-radius 2px, fill #3B82F6, track #E5E7EB) + percentage text.
     g. KPI check cell: green circle checkmark (✅ completed), gray dash (— not started), or mini progress bar + "64%" (in progress).
     h. Actions cell: three-dot icon (MoreHorizontal), opens dropdown.
   - Row click: entire row has cursor pointer, subtle highlight.
   - Pagination bar below table: "Показано 1–10 из 5 000" left (Inter 13px #6B7280), page buttons right (Previous, 1, 2, 3, ..., Next) Shadcn Button ghost/outline small size.

5. FILTER BAR:
   - Horizontal row above table, gap 12px.
   - Search input: Shadcn Input with Search icon (Lucide), placeholder text, width 280px.
   - Filter select: Shadcn Select component, width 160px, with chevron-down. Show: "Статус" with options, "Организация", "Партия", "KPI прогресс".
   - Date range picker: Shadcn Popover trigger button showing "01.04 — 13.04.2026", Calendar icon left.
   - Clear filters: text button "Сбросить фильтры" Inter 13px #6B7280, visible only when filters active.
   - Active filter count: blue badge circle on filter button (e.g., "3").
   - Responsive: wraps to 2 rows on tablet, vertical stack on mobile.

6. BADGE VARIANTS:
   All badges: Inter 12px 500, padding 2px 10px, border-radius 10px (pill shape).
   - Success: bg #F0FDF4, text #15803D, border none. Labels: "Активна", "Начислено", "Выполнено".
   - Warning: bg #FFFBEB, text #B45309. Labels: "На паузе", "В процессе", "Ожидание".
   - Error: bg #FEF2F2, text #DC2626. Labels: "Неактивна", "Ошибка", "Просрочено".
   - Info: bg #ECFEFF, text #0E7490. Labels: "Зарег.", "Продана".
   - Default: bg #F3F4F6, text #4B5563. Labels: "На складе", "Черновик".
   - Outline: bg transparent, border 1px #E5E7EB, text #374151. Labels: "VISA SUM", "VISA USD".
   - Blue: bg #EFF6FF, text #1D4ED8. Labels: "KPI 1", "KPI 2", "KPI 3".
   - Show all 7 variants in a row on canvas.

7. KPI STEPPER — VERTICAL (signature component):
   This is the platform's core visual element. Two variants:

   **Variant A — KPI Config Builder (editable, for bank admin setup):**
   - Vertical layout, connected by dashed line (2px #D1D5DB) on the left margin.
   - Step indicator circle: 36×36 on the line.
     - Completed: filled #10B981, white checkmark icon.
     - Active/Editing: filled #2563EB, white step number.
     - Upcoming: border 2px #E5E7EB, #9CA3AF step number.
   - Step card: white, border 1px #E5E7EB, border-radius 12px, padding 24px. Connects to circle.
     - Active card: border #2563EB, shadow-sm with blue tint.
   - Card content: Title (DM Sans 16px 600) + form fields (Select for action_type, Input for threshold, Input for reward, Input for description).
   - Below all steps: dashed-border "+" add step button.
   - Show 3 steps: step 1 completed, step 2 completed, step 3 active/editing.

   **Variant B — KPI Progress Tracker (read-only, for card detail page):**
   - Vertical layout, connected by solid line (2px).
     - Green line between completed steps.
     - Dashed gray line before in-progress/pending steps.
   - Step indicator circle: 32×32.
     - Completed: green filled #10B981, white checkmark.
     - In-progress: blue ring #2563EB, small pulsing dot center (show as filled blue dot, slightly smaller).
     - Pending: gray ring #D1D5DB, gray number.
   - Step content (right of circle):
     - Title: Inter 14px 600 #111827 (completed/in-progress) or #9CA3AF (pending).
     - Subtitle: Inter 13px #6B7280.
     - Completed: "✅ Выполнено" green text + date "02.04.2026, 14:32" caption. Reward line: "Начислено: 5 000 UZS → Абдуллох" Inter 13px #10B981.
     - In-progress: Shadcn Progress bar (100% width, 8px height, border-radius 4px, fill #3B82F6, track #E5E7EB) + "320 000 / 500 000 UZS (64%)" below.
     - Pending: all text muted, no progress.
   - Show 3 steps: step 1 completed, step 2 completed, step 3 in-progress at 64%.

8. FUNNEL BAR CHART:
   - Vertical stack of horizontal bars, each bar on its own row.
   - Bar container: full width of card content area, height 10px per bar, border-radius 5px, track #E5E7EB.
   - Fill: gradual shading from #93C5FD (lightest) to #2563EB (darkest) as you go deeper in funnel.
   - Each row: label left (Inter 14px #374151), bar center, count + percentage right (Inter 14px 600 #111827 + Inter 13px #6B7280).
   - Show 5 levels: "Выдано 5 000", "Продано 2 340 (46.8%)", "KPI 1 — 1 890 (37.8%)", "KPI 2 — 1 210 (24.2%)", "KPI 3 — 567 (11.3%)".

9. DETAIL PAGE LAYOUT:
   All detail views (Organization, Card, Seller, Withdrawal) are full-width pages, not drawers.
   - Layout: right of sidebar, page-background, full-width content, page-padding.
   - Breadcrumb at top (see §13).
   - Header row: Title (page-title) left + badges row below. Action buttons right.
   - Stat Cards row below header (see §3).
   - Tabs: Shadcn Tabs component, underline variant. Tab labels Inter 14px 500. Active: #2563EB text, 2px blue underline. Inactive: #6B7280. Full-width below stats.
   - Tab content: full-width, padding 0 (cards inside handle their own padding).
   - Key-value grid: 2 columns. Label (Inter 13px #6B7280) left, value (Inter 14px 500 #111827) right. Rows separated by 1px #E5E7EB divider, padding 12px 0.
   - Multi-column layouts inside tabs: use 55%/45% or 60%/40% splits with gap 16px. Stack vertically on tablet/mobile.
   - Show a detail page example with breadcrumb "Все карты → Карта •••• 1001", header with badges "VISA SUM" + "Активна", stat cards, and tabs "Сводка | Карты | Финансы".

10. CARD STATUS FLOW:
    Show a horizontal flow diagram of card statuses with connecting arrows:
    "На складе" (gray badge) → "У продавца" (amber badge) → "Продана" (info/teal badge) → "Зарегистрирована" (blue badge) → "Активна" (green badge).
    Arrows: 1px #D1D5DB, small chevron heads. Labels below each: brief description Inter 12px #9CA3AF.

11. FORM COMPONENTS:
    - Input with label: Label above (Inter 14px 500 #374151), Input below (height 40px, border 1px #D1D5DB, border-radius 8px, padding 8px 12px, Inter 14px). Focus: border #2563EB, ring 2px #DBEAFE.
    - Input with suffix: same + suffix text "UZS" inside input, right-aligned, #9CA3AF.
    - Input with icon: Search icon or QR icon inside left side.
    - Select dropdown: same height/border as input, chevron-down right, options list below with hover #F9FAFB.
    - Number input: with +/- stepper buttons.
    - Textarea: same border style, height 80px.
    - Checkbox: Shadcn Checkbox (16×16, border-radius 4px, checked: #2563EB fill, white check).
    - Toggle switch: Shadcn Switch (36×20, track #E5E7EB off / #2563EB on, knob white).
    - Radio group: Shadcn RadioGroup (16×16 circle, selected: #2563EB fill ring).
    - Error state: border #EF4444, helper text below "Неверный формат" Inter 13px #EF4444.
    - Disabled state: bg #F9FAFB, text #D1D5DB, border #E5E7EB.
    - Show all variants on canvas.

12. BUTTON VARIANTS:
    All buttons: border-radius 8px, Inter 14px 500. Lucide icon optional (20px, left of label).
    - Primary: bg #2563EB, text white. Hover: #1D4ED8. Label: "Сохранить".
    - Secondary/Outline: bg white, border 1px #D1D5DB, text #374151. Hover: bg #F9FAFB. Label: "Отмена".
    - Ghost: bg transparent, text #374151. Hover: bg #F9FAFB. Label: "Показать все →".
    - Destructive: bg #EF4444, text white. Hover: #DC2626. Label: "Удалить".
    - Destructive outline: bg white, border 1px #EF4444, text #EF4444. Label: "Деактивировать".
    - Icon button: 36×36, bg transparent, icon only. Hover: bg #F9FAFB.
    - Sizes: sm (32px height, 13px text), default (40px), lg (44px, 14px text).
    - Loading state: spinner icon replacing left icon, label "Загрузка...", opacity 70%.
    - Disabled state: opacity 50%, cursor not-allowed.
    - Show all variants in a row on canvas.

13. BREADCRUMB:
    - Horizontal row: Inter 14px.
    - Segments: link text #2563EB → separator "/" or ChevronRight (12px, #D1D5DB) → current text #111827.
    - Example: "Партии карт" (blue link) → "Партия Апрель 2026 — Mysafar OOO" (black, current).

14. STAT PILL (compact inline stat):
    - Inline pill badge for summary rows above tables.
    - Border 1px #E5E7EB, border-radius 20px, padding 6px 16px, Inter 13px 500.
    - Variants: neutral (#374151 text), blue accent (#2563EB text, border #DBEAFE), green (#15803D text, border #BBF7D0).
    - Example row: "Всего: 5 000" | "На складе: 1 260" | "Продано: 2 340" | "KPI 3 ✅: 567".

15. ACTIVITY TIMELINE:
    - Vertical list of events.
    - Left: colored dot (8×8, border-radius full). Green = KPI completed, Blue = card event, Amber = financial, Gray = system.
    - Center: event text (Inter 14px #374151) + detail (Inter 13px #6B7280 below or inline).
    - Right: timestamp "сегодня, 14:32" Inter 13px #9CA3AF.
    - Vertical connecting line (1px #E5E7EB) between dots.
    - Show 5 sample events.

16. EMPTY STATE:
    - Centered in card or content area.
    - Icon placeholder: 64×64, Lucide icon in #D1D5DB.
    - Heading: "Карты не найдены" DM Sans 18px 600 #374151.
    - Subtext: "Попробуйте изменить фильтры или импортировать новую партию" Inter 14px #6B7280.
    - Optional CTA button: primary or outline.
    - Show 2 variants: with CTA button, without.

17. TOAST NOTIFICATION:
    - Position: top-right of viewport, below top bar.
    - Container: white card, border-radius 8px, shadow-lg, padding 16px, max-width 360px.
    - Layout: icon (20px) + content (title Inter 14px 600 + message Inter 13px #6B7280) + close X.
    - Variants:
      a. Success: green icon CheckCircle, left border 3px #10B981. "KPI начислен".
      b. Error: red icon XCircle, left border 3px #EF4444. "Ошибка импорта".
      c. Warning: amber icon AlertTriangle, left border 3px #D97706. "Срок KPI истекает".
      d. Info: blue icon Info, left border 3px #2563EB. "Новая партия создана".
    - Show all 4 variants stacked on canvas.

18. MODAL / DIALOG:
    - Shadcn Dialog component. Centered on screen, overlay black/40%.
    - Container: white, border-radius 16px, padding 24px, max-width 480px, shadow-2xl.
    - Header: Title DM Sans 18px 600 + optional subtitle Inter 14px #6B7280 + X close.
    - Content: form fields or confirmation text.
    - Footer: right-aligned buttons. "Отмена" outline + "Подтвердить" primary.
    - Destructive variant: "Удалить" destructive button instead.
    - Show 2 variants: form dialog (add seller) and confirm dialog (delete confirmation).

19. FILE UPLOAD / DROP ZONE:
    - Dashed border 2px #D1D5DB, border-radius 12px, height 180px.
    - Centered: Upload icon (48×48 #9CA3AF), heading "Перетащите файл сюда" (DM Sans 16px 600 #374151), "или" (Inter 13px #9CA3AF), outline button "Выбрать файл".
    - Below: "Форматы: .xlsx, .xls, .csv" Inter 12px #9CA3AF.
    - Hover/drag state: border #2563EB dashed, bg #EFF6FF light.
    - Uploaded state: file info row with icon, filename, size, green check, and "✕ Удалить" red text button.

20. DONUT CHART (for reward breakdown):
    - Circle chart with hollow center.
    - Segments: 3 KPI colors (#3B82F6, #60A5FA, #93C5FD) + optional 4th for "Выведено" (#D1D5DB).
    - Center: total value DM Sans 18px 600.
    - Legend below: colored dot + label + value + percentage per row.
    - Container: white card, heading "Начисления по KPI" DM Sans 18px 600.

21. HORIZONTAL BAR CHART (for seller performance):
    - Vertical list of horizontal bars.
    - Each row: seller name left (Inter 14px #374151), bar center (fill #3B82F6, track #E5E7EB, height 8px, border-radius 4px), value right (JetBrains Mono 14px #111827).
    - Bars scaled proportionally to max value.
    - Show 6 rows with sample seller names and UZS amounts.

22. DATE RANGE PICKER:
    - Trigger button: outline style, Calendar icon left, date range text "01.04.2026 — 13.04.2026" Inter 14px.
    - Popover: white card, shadow-lg, border-radius 12px.
    - Two calendar months side by side.
    - Selected range: blue highlight #EFF6FF, start/end dates: blue filled circles #2563EB.
    - Quick presets on left: "Сегодня", "Вчера", "7 дней", "30 дней", "Этот месяц", "Прошлый месяц".
    - Footer: "Отмена" + "Применить" buttons.

---

DARK THEME SWATCH:
Show a horizontal strip at the bottom of the canvas with the dark theme token overrides listed in the COLOR TOKENS section. Each swatch: 60×60 rounded square with hex label below. Two rows: Light Theme | Dark Theme equivalent.

---

CANVAS LAYOUT:
Arrange all components neatly on a 1920×1080 canvas (extend vertically as needed) with clear section labels. Use light gray (#F3F4F6) background for the canvas itself. Each component group separated by a section title label (Inter 16px 600 #111827) and thin divider.

Group order on canvas:
Row 1: Color swatches + Typography scale
Row 2: Sidebar (both variants) + Buttons + Badges + Stat pills
Row 3: Stat Cards (6 variants) + Breadcrumb
Row 4: Data Table with all cell types + Filter bar + Pagination
Row 5: KPI Stepper Variant A (config) + KPI Stepper Variant B (progress)
Row 6: Funnel Bar Chart + Donut Chart + Horizontal Bar Chart
Row 7: Form Components (all variants)
Row 8: Detail Page Layout + Modal (2 variants) + Toast (4 variants)
Row 9: File Upload + Empty State + Card Status Flow + Activity Timeline
Row 10: Date Range Picker + Dark theme swatch strip

This is the master component library. All subsequent page prompts reference these components by name and token.
```
