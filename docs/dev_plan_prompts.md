# Moment Card KPI Platform — Figma Make Prompt Library (v2)

**Project:** Moment Card KPI Platform (UCOIN / WalletHub)
**Prerequisite:** Generate Prompt 0 (Design System & Component Library) first. All prompts below reference components, tokens, and typography defined in Prompt 0.
**Responsive:** Desktop 1440px → Tablet 1024px → Mobile 375px
**Note:** No real logos — use placeholder rectangles labeled "Universalbank" or "UCOIN". Post-production branding in Figma.

---
---

## PART A — SHARED COMPONENTS

---

### Prompt A-01: Login Page

```
Design a login page for the "Moment Card KPI Platform" at 1440×900. Reference Prompt 0 design system for all tokens and components.

Layout:
— Left half: solid background page-background token (#F9FAFB) panel. Centered illustration placeholder (rounded rectangle 280×200, dashed border, label "Illustration"). Below: "Управление продажами Moment VISA карт" in small-body typography.
— Right half: white, vertically centered login card (max-width 400px, card-padding 40px, card-border-radius).

Login card contents top to bottom:
1. Placeholder logo rectangle (120×32, default-border, label "Universalbank").
2. "Вход в систему" — page-title typography.
3. "Moment Card KPI Platform" — small-body typography.
4. Spacer 24px.
5. Form Input component (from Prompt 0 §11): label "Телефон или логин", placeholder "+998 __ ___ __ __".
6. Form Input component: label "Пароль", type password, placeholder "••••••••", eye icon toggle inside.
7. Row: Checkbox component + label "Запомнить меня". Right: Ghost Button as text link "Забыли пароль?" in primary-blue.
8. Spacer 16px.
9. Primary Button (lg size): full-width, label "Войти".
10. Divider with centered text "или".
11. Outline Button (lg size): full-width, label "Войти через Unired ID".

Bottom of page: "© 2026 Universalbank. Все права защищены." — caption typography, centered.

Responsive:
— Tablet: hide left panel, center login card.
— Mobile: login card full-width, padding 20px horizontal.
```

---

### Prompt A-02: Sidebar Navigation — Bank Admin

```
Design the persistent Left Sidebar component (from Prompt 0 §2) configured for Bank Admin role.

Use all sidebar tokens from Prompt 0: 260px expanded / 68px collapsed, white background, right border default-border. Logo placeholder + "Moment KPI" in sidebar header typography. Collapse toggle chevron at top-right.

Navigation items (use nav-item active/hover/default states from Prompt 0):

Group label "ОБЗОР":
1. LayoutDashboard icon — "Дашборд" — ACTIVE STATE

Group label "УПРАВЛЕНИЕ":
2. Building2 icon — "Организации"
3. CreditCard icon — "Партии карт"
4. Settings2 icon — "KPI конфигурации"
5. Upload icon — "Импорт карт"
6. Layers icon — "Все карты"

Group label "ФИНАНСЫ":
7. Wallet icon — "Вознаграждения"
8. FileSpreadsheet icon — "Отчёты и экспорт"

Group label "СИСТЕМА":
9. Users icon — "Пользователи"
10. Settings icon — "Настройки"

Bottom pinned section: avatar initials "АК" + "Админ Камолов" + "Банк-администратор" + logout icon. Dark theme toggle (moon/sun icon) above user section.

Show both expanded and collapsed states side by side.
```

---

### Prompt A-03: Sidebar Navigation — Organization Admin

```
Design the Left Sidebar component (Prompt 0 §2) configured for Organization Admin role.

Same visual spec as A-02. Add organization name badge below platform name: Badge Outline variant (Prompt 0 §6) with text "Mysafar OOO".

Navigation items:

Group label "ОБЗОР":
1. LayoutDashboard icon — "Дашборд"

Group label "УПРАВЛЕНИЕ":
2. Users icon — "Продавцы"
3. CreditCard icon — "Карты"
4. ClipboardCheck icon — "Назначение карт"

Group label "ФИНАНСЫ":
5. Wallet icon — "Вознаграждения"
6. ArrowDownToLine icon — "Выводы"

Group label "СИСТЕМА":
7. Settings icon — "Настройки"

Bottom: avatar + "Рустам Алиев" + "Менеджер организации" + logout.

Show expanded and collapsed states.
```

---
---

## PART B — BANK ADMIN SCREENS

---

### Prompt B-01: Bank Overview Dashboard

```
Design the main Bank Admin dashboard for the "Moment Card KPI Platform". Reference all components from Prompt 0.

Layout: Content area right of 260px sidebar space. Page-background (#F9FAFB). Full-width content (stretches to fill available space), page-padding (32px).

**Top Bar (Prompt 0 §1):**
Left: "Дашборд" page-title + "Общая сводка по всем организациям" subtitle.
Right: Date Range Picker component (Prompt 0 §22), default "01.04.2026 — 13.04.2026" + Outline Button "Экспорт" with Download icon.

**Row 1 — 6× Stat Card components (Prompt 0 §3), equal width, gap 16px:**
1. Blue icon variant, CreditCard. Label: "Всего карт выпущено". Value: "5 000". No trend.
2. Violet icon variant, Building2. Label: "Организаций". Value: "8". No trend.
3. Green icon variant, ShoppingBag. Label: "Карт продано". Value: "2 340". Trend: "+12%" green.
4. Cyan icon variant, UserCheck. Label: "Регистраций (KPI 1)". Value: "1 890". Trend: "+8%" green.
5. Amber icon variant, ArrowUpDown. Label: "Пополнений (KPI 2)". Value: "1 210". Trend: "+5%" green.
6. Rose icon variant, Wallet. Label: "Оплата 500K (KPI 3)". Value: "567". Trend: "+15%" green.

**Row 2 — Two cards (60%/40%), gap 16px:**

Left — Funnel Bar Chart component (Prompt 0 §8):
Card heading: "Воронка конверсии" section-heading + "От выдачи до выполнения KPI 3" small-body.
5 funnel levels:
— "Выдано" — 100% — "5 000"
— "Продано" — 46.8% — "2 340"
— "KPI 1" — 37.8% — "1 890"
— "KPI 2" — 24.2% — "1 210"
— "KPI 3" — 11.3% — "567"

Right — Rewards summary card:
Heading: "Вознаграждения" section-heading.
Large number: "24 565 000 UZS" large-display-number typography.
Below: "Всего начислено продавцам" small-body.
Divider.
Four rows (key-value style from Prompt 0 §9):
— "KPI 1 — Регистрация" | "9 450 000 UZS" | "38.5%"
— "KPI 2 — Пополнение" | "6 050 000 UZS" | "24.6%"
— "KPI 3 — Оплата 500K" | "5 670 000 UZS" | "23.1%"
— "Выведено" | "3 395 000 UZS" | "13.8%"

**Row 3 — Organization comparison table (full width):**
Card heading: "Организации" section-heading. Right: Ghost Button "Показать все →".

Data Table component (Prompt 0 §4):
Columns: Организация (text) | Карт выдано (mono) | Продано (mono) | % продано (progress-cell) | KPI 1 (mono) | KPI 2 (mono) | KPI 3 (mono) | Начислено KPI (mono) | Статус (badge)

Rows:
1. Mysafar OOO | 500 | 230 | 46% bar | 185 | 120 | 45 | 1 825 000 | Badge Success "Активна"
2. Unired Marketing | 500 | 310 | 62% bar | 280 | 190 | 78 | 2 740 000 | Badge Success "Активна"
3. Express Finance | 400 | 180 | 45% bar | 150 | 95 | 32 | 1 370 000 | Badge Success "Активна"
4. Digital Pay | 300 | 120 | 40% bar | 98 | 65 | 22 | 920 000 | Badge Warning "На паузе"
5. SmartCard Group | 500 | 290 | 58% bar | 250 | 170 | 68 | 2 440 000 | Badge Success "Активна"

Footer row: bold "Итого" with column sums.
Each row clickable (row-hover state). Chevron-right icon at row end.

Responsive: Tablet — stat cards 3×2 grid, table horizontal scroll. Mobile — single column stats, table scroll.
```

---

### Prompt B-02: Organizations Management

```
Design the Organizations list page for Bank Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Организации" page-title + "Управление организациями-партнёрами" subtitle. Right: Primary Button "+ Добавить организацию" with Plus icon.

**Filter Bar (Prompt 0 §5):**
— Search Input with Search icon, placeholder "Поиск по названию...", width 280px.
— Filter Select "Статус": Все, Активна, Неактивна, На паузе.
— Filter Select "Сортировка": По названию, По дате, По кол-ву карт.

**Data Table (Prompt 0 §4):**
Columns: # (text) | Организация (text) | Контактное лицо (text) | Телефон (text) | Карт выдано (mono) | Продано (mono) | KPI выполнено (mono) | Начислено (mono) | Статус (badge) | Действия (action-dots)

8 rows:
1. 1 | Mysafar OOO | Рустам Алиев | +998 90 123 45 67 | 500 | 230 | 45 | 1 825 000 | Badge Success "Активна" | ⋮
2. 2 | Unired Marketing | Лола Каримова | +998 91 234 56 78 | 500 | 310 | 78 | 2 740 000 | Badge Success "Активна" | ⋮
3. 3 | Express Finance | Тимур Насыров | +998 93 345 67 89 | 400 | 180 | 32 | 1 370 000 | Badge Success "Активна" | ⋮
4. 4 | Digital Pay | Азиз Хамидов | +998 94 456 78 90 | 300 | 120 | 22 | 920 000 | Badge Warning "На паузе" | ⋮
5. 5 | SmartCard Group | Нодира Усманова | +998 95 567 89 01 | 500 | 290 | 68 | 2 440 000 | Badge Success "Активна" | ⋮
6. 6 | PayVerse | Бахром Шарипов | +998 90 678 90 12 | 350 | 145 | 28 | 1 085 000 | Badge Success "Активна" | ⋮
7. 7 | FinBridge | Дилноза Ахмедова | +998 91 789 01 23 | 200 | 55 | 8 | 395 000 | Badge Error "Неактивна" | ⋮
8. 8 | CardPlus | Жавлон Турсунов | +998 93 890 12 34 | 450 | 210 | 52 | 1 790 000 | Badge Success "Активна" | ⋮

Action dots dropdown (Prompt 0 §4h): Подробнее, Редактировать, Деактивировать.

Pagination component below table: "Показано 1–8 из 8".

Responsive: tablet — hide Телефон, Контактное лицо. Mobile — horizontal scroll.
```

---

### Prompt B-03: Organization Detail — Side Drawer

```
Design a Detail Drawer (Prompt 0 §9) that opens when clicking an organization row. Width 640px.

**Drawer header:**
Title: "Mysafar OOO". Badges: Badge Success "Активна". Below: "Контакт: Рустам Алиев, +998 90 123 45 67" small-body.

**Tabs (Prompt 0 §9 tabs):** Сводка | Продавцы | Карты | Финансы

---

**Tab: Сводка**

4× Stat Card components (compact, 2×2 grid):
1. Blue, CreditCard. "Карт выдано" — "500".
2. Green, ShoppingBag. "Продано" — "230 (46%)".
3. Violet, CheckCircle2. "KPI выполнено (все 3)" — "45 (19.6%)".
4. Amber, Wallet. "Начислено" — "1 825 000 UZS".

KPI progress section — 3 horizontal bars (use Funnel Bar Chart row style from Prompt 0 §8, but only 3 bars):
— "Регистрация": 185/230 = 80.4%, label "185 из 230".
— "Пополнение": 120/230 = 52.2%, label "120 из 230".
— "Оплата 500K": 45/230 = 19.6%, label "45 из 230".

Activity Timeline component (Prompt 0 §15), 3 items:
— Green dot: "Карта ...4521 — KPI 3 выполнен (512 000 UZS)" — "2 часа назад".
— Blue dot: "Карта ...3892 — KPI 2 выполнен" — "5 часов назад".
— Gray dot: "Новый продавец добавлен: Камола Р." — "вчера".

---

**Tab: Продавцы**

Search Input + Primary Button "+ Добавить продавца".
Compact Data Table:
Продавец | Карт | Продано | KPI 1 | KPI 2 | KPI 3 | Заработано (mono)
Абдуллох Р. | 100 | 45 | 38 | 22 | 8 | 330 000
Санжар М. | 100 | 62 | 55 | 41 | 15 | 555 000
Нилуфар К. | 100 | 33 | 28 | 18 | 5 | 255 000
Камола Р. | 50 | 18 | 14 | 9 | 2 | 125 000
Ислом Т. | 80 | 42 | 35 | 20 | 10 | 350 000
Дарья Н. | 70 | 30 | 15 | 10 | 5 | 210 000

---

**Tab: Карты**

Filter Select "Статус": Все, На складе, У продавца, Продана, Зарегистрирована, Активна + Search Input.
Compact Data Table:
Карта (mono) | Продавец | Клиент | Статус (badge) | KPI 1 (kpi-check) | KPI 2 (kpi-check) | KPI 3 (kpi-check)
...1001 | Абдуллох | Алишер Н. | Badge Success "Активна" | ✅ | ✅ | ✅ 510K
...1002 | Абдуллох | Дилшод К. | Badge Info "Зарег." | ✅ | ✅ | 64% progress
...1003 | — | — | Badge Default "На складе" | — | — | —

---

**Tab: Финансы**

Summary row: "Всего начислено: 1 825 000 UZS" stat-display-number + "Выведено: 1 200 000" + "Баланс: 625 000".
Data Table:
Дата (date) | Продавец | Карта (mono) | KPI (badge-blue) | Сумма (mono) | Статус (badge)
13.04 | Абдуллох | ...4521 | "KPI 3" | 10 000 | Badge Success "Начислено"
12.04 | Санжар | ...3892 | "KPI 2" | 5 000 | Badge Success "Начислено"
11.04 | Абдуллох | ...1002 | "KPI 1" | 5 000 | Badge Success "Начислено"
```

---

### Prompt B-04: Card Batches Management

```
Design the Card Batches page for Bank Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Партии карт" page-title + "Управление партиями выпущенных карт" subtitle. Right: Primary Button "+ Создать партию".

**Filter Bar (Prompt 0 §5):**
— Search Input, placeholder "Поиск по названию партии...".
— Filter Select "Организация": Все, Mysafar OOO, Unired Marketing, etc.
— Filter Select "Статус": Все, Активна, Завершена, Черновик.

**Card grid layout (not table — use card grid, 3 columns desktop, 2 tablet, 1 mobile, gap 16px):**

Each batch card: white, default-border, card-border-radius, card-padding (20px).

Card structure:
— Top row: card-title "Партия Апрель 2026" + Badge status (right-aligned).
— "Mysafar OOO" small-body.
— Divider.
— Stats grid 2×2 (body-medium typography):
  "Всего карт: 500" | "Продано: 230" | "KPI завершено: 45" | "Начислено: 1 825 000"
— Divider.
— KPI config row: 3× Badge Blue variant (Prompt 0 §6):
  "KPI 1: Регистрация — 5 000" | "KPI 2: P2P — 5 000" | "KPI 3: Оплата 500K — 10 000"
— Bottom row: "Создана: 01.04.2026" caption + "Срок KPI: 30 дней" caption.
— Action row: Ghost Button "Подробнее" + action-dots dropdown (Карты, KPI настройки, Импорт, Архивировать).

6 sample cards:
1. Партия Апрель 2026 — Mysafar OOO — 500 — Badge Success "Активна"
2. Партия Апрель 2026 — Unired Marketing — 500 — Badge Success "Активна"
3. Партия Март 2026 — Express Finance — 400 — Badge Success "Активна"
4. Партия Март 2026 — Digital Pay — 300 — Badge Warning "На паузе"
5. Партия Февраль 2026 — SmartCard Group — 500 — Badge Default "Завершена"
6. Партия Тест — CardPlus — 50 — Badge Outline "Черновик"
```

---

### Prompt B-05: KPI Configuration — Stepper

```
Design the KPI Configuration page for a card batch. Reference Prompt 0 — this page uses KPI Stepper Variant A (§7, config builder).

Layout: right of sidebar, page-background, full-width content, page-padding.

**Breadcrumb (Prompt 0 §13):** "Партии карт" (link) → "Партия Апрель 2026 — Mysafar OOO" (current).
Below: "KPI конфигурация" page-title + "Настройте этапы KPI и вознаграждения для этой партии карт" subtitle.

**Batch info summary card:**
Horizontal row, card-padding 16px: "Партия: Партия Апрель 2026" | "Организация: Mysafar OOO" | "Карт: 500" | "Срок KPI: 30 дней". All body typography, labels in muted-text.

**KPI Stepper Variant A (Prompt 0 §7A) — 3 steps:**

**Step 1 — completed state (green circle checkmark):**
Card header: "Этап 1 — Регистрация" card-title. Right: Badge Success "Настроено". Collapse chevron.
Content:
— Select (Prompt 0 §11): label "Действие клиента", value "Регистрация в Unired Mobile" (disabled).
— Input with suffix: label "Порог суммы", value "0", suffix "UZS", disabled + note "(Не применимо)".
— Input with suffix: label "Вознаграждение продавцу", value "5 000", suffix "UZS".
— Input: label "Описание", value "Клиент зарегистрировал карту в Unired Mobile".

**Step 2 — completed state:**
"Этап 2 — Пополнение". Action: "P2P пополнение карты". Threshold: "0". Reward: "5 000 UZS". Description: "Клиент получил P2P перевод на карту".

**Step 3 — active/editing state (blue circle "3", blue border card with shadow):**
"Этап 3 — Оплата в рознице". Active card styling from Prompt 0 §7A.
— Select dropdown OPEN, showing options: Регистрация в Unired Mobile, P2P пополнение карты, Оплата в рознице (selected ✓), Оплата в категории.
— Input with suffix: "500 000" suffix "UZS" — focus-ring state.
— Input with suffix: "10 000" suffix "UZS".
— Input: "Клиент потратил 500 000 UZS по карте (POS + ECOM)".
— Additional: Multi-select with tags (Prompt 0 §11): label "Категория оплаты", chips: "Розница" ✕, "Топливо" ✕, "Еда" ✕ + "+ добавить".

**Below stepper:** dashed add-step button "+ Добавить этап" (from Prompt 0 §7A).

**Summary footer card:**
Row: "Итого этапов: 3" | "Максимум за карту: 20 000 UZS" | "Бюджет на партию: 10 000 000 UZS".
Right: Primary Button "Сохранить конфигурацию" + Outline Button "Отмена".

Responsive: stack inputs vertically on mobile.
```

---

### Prompt B-06: Card Import from Excel

```
Design the Card Import page for Bank Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Breadcrumb:** "Партии карт" → "Импорт карт".
"Импорт карт" page-title + "Загрузите Excel файл с номерами карт для добавления в партию" subtitle.

**Step 1 — Select batch:**
White card, card-padding.
Select component (Prompt 0 §11): label "Выберите партию", full-width, options: "Партия Апрель 2026 — Mysafar OOO (500 карт)", "Партия Апрель 2026 — Unired Marketing (500 карт)", etc.

**Step 2 — File Upload / Drop Zone (Prompt 0 §19):**
White card, card-padding.
Drop zone: dashed border, height 180px. Upload icon + "Перетащите Excel файл сюда" + "или" + Outline Button "Выбрать файл" + "Форматы: .xlsx, .xls, .csv" caption.

**Post-upload validation preview (show this state below drop zone):**
White card, card-padding.
— Uploaded file row (Prompt 0 §19 uploaded state): "📎 cards_april_2026.xlsx", "245 KB", Badge Success "Загружен". Right: Destructive text "✕ Удалить".
— Divider.
— "Предварительный просмотр" section-heading.
— Stat Pill row (Prompt 0 §14): "Найдено карт: 500" neutral | "Валидных: 498" green | "С ошибками: 2" error.
— Compact Data Table (first 5 + error rows):
  # | Номер карты (mono) | Тип | Статус валидации
  1 | 8600 1234 5678 1001 | VISA SUM | ✅ OK
  2 | 8600 1234 5678 1002 | VISA SUM | ✅ OK
  3 | 8600 1234 5678 1003 | VISA USD | ✅ OK
  247 | 8600 1234 56__ ____ | — | ❌ Неверный формат (error-bg-tint row)
  389 | 8600 1234 5678 2001 | VISA SUM | ❌ Дубликат (error-bg-tint row)

**Bottom actions:**
Left: Ghost Button "Скачать шаблон Excel" with Download icon.
Right: Outline Button "Отмена" + Primary Button "Импортировать 498 карт".

**Success state (separate view):**
Centered in card: large green CheckCircle icon (64px) + "498 карт успешно импортированы" section-heading + "Партия: Партия Апрель 2026 — Mysafar OOO" small-body + "2 карты пропущены из-за ошибок" in error color.
Primary Button "Перейти к партии" + Outline Button "Импортировать ещё".
```

---

### Prompt B-07: All Cards Management

```
Design the All Cards master list for Bank Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Все карты" page-title + "Полный реестр карт в системе" subtitle. Right: Outline Button "Экспорт в Excel" with Download icon.

**Stat Pill row (Prompt 0 §14):**
"Всего: 5 000" neutral | "На складе: 1 260" neutral | "У продавцов: 1 400" neutral | "Продано: 2 340" green | "KPI 3 ✅: 567" neutral.

**Filter Bar (Prompt 0 §5):**
— Search Input "Поиск по номеру карты или клиенту..." width 300px.
— Filter Select "Организация": Все + list.
— Filter Select "Партия": Все + list.
— Filter Select "Статус": Все, На складе, У продавца, Продана, Зарегистрирована, Активна.
— Filter Select "KPI прогресс": Все, KPI 1 ✅, KPI 2 ✅, KPI 3 ✅, Без KPI.

**Data Table (Prompt 0 §4, all cell types):**
Columns: Карта (mono) | Тип (badge-outline) | Организация (text) | Продавец (text) | Клиент (text) | Статус (badge) | KPI 1 (kpi-check) | KPI 2 (kpi-check) | KPI 3 (kpi-check) | Пополнено (mono) | Расход (mono)

10 rows:
1. ...1001 | "VISA SUM" | Mysafar | Абдуллох | Алишер Н. | Badge Success "Активна" | ✅ | ✅ | ✅ 510K | 800 000 | 520 000
2. ...1002 | "VISA SUM" | Mysafar | Абдуллох | Дилшод К. | Badge Info "Зарег." | ✅ | ✅ | 64% progress-cell | 500 000 | 320 000
3. ...1003 | "VISA SUM" | Mysafar | Абдуллох | — | Badge Warning "У продавца" | — | — | — | — | —
4. ...1004 | "VISA USD" | Mysafar | Санжар | Камол Т. | Badge Success "Активна" | ✅ | ✅ | ✅ 620K | 1 200 000 | 680 000
5. ...1005 | "VISA SUM" | Unired Mkt | Лола К. | — | Badge Default "На складе" | — | — | — | — | —
6. ...1006 | "VISA SUM" | Unired Mkt | Мухаммад | Дилноза А. | Badge Info "Зарег." | ✅ | — | — | — | —
7. ...1007 | "VISA SUM" | Express | Бобур | Шахзод Р. | Badge Success "Активна" | ✅ | ✅ | 82% progress-cell | 700 000 | 410 000
8. ...1008 | "VISA SUM" | Express | — | — | Badge Default "На складе" | — | — | — | — | —
9. ...1009 | "VISA USD" | SmartCard | Нодира | Фарход М. | Badge Info "Продана" | ✅ | — | — | 50 000 | —
10. ...1010 | "VISA SUM" | SmartCard | Нодира | Ислом С. | Badge Success "Активна" | ✅ | ✅ | ✅ 530K | 600 000 | 545 000

Each row clickable → opens Card Detail Drawer (B-08).
Pagination: "Показано 1–10 из 5 000".

Responsive: horizontal scroll. Priority columns: Карта, Статус, KPI 1–3.
```

---

### Prompt B-08: Card Detail — Side Drawer with KPI Stepper

```
Design a Detail Drawer (Prompt 0 §9) showing full card detail. Width 560px. This page uses KPI Stepper Variant B (Prompt 0 §7B, progress tracker).

**Header:**
Title: "Карта •••• 1001". Close X.
Badges row: Badge Outline "VISA SUM" + Badge Success "Активна" + Badge Default "Mysafar OOO".

**Client & Seller info (key-value grid from Prompt 0 §9):**
Left column: "Клиент" label → "Алишер Набиев" value → "+998 90 123 45 67" muted.
Right column: "Продавец" label → "Абдуллох Р." value → "Mysafar OOO" muted.
"Продана: 01.04.2026" caption.

Divider.

**KPI Stepper Variant B (Prompt 0 §7B) — 3 steps:**

Label: "KPI прогресс" section-heading. Right: "Срок: 30 дней (осталось 18)" in warning-color.

Step 1 — Completed (green circle checkmark, green connecting line below):
Title: "Регистрация в Unired Mobile" body-medium.
Subtitle: "Клиент зарегистрировал карту" small-body.
Right: "✅ Выполнено" success-color + "02.04.2026, 14:32" caption.
Reward: "Начислено: 5 000 UZS → Абдуллох" in success-color, small-body.

Step 2 — Completed (green circle checkmark, dashed gray line below):
Title: "P2P пополнение карты".
Subtitle: "Клиент получил P2P перевод".
Right: "✅ Выполнено" + "03.04.2026, 09:15".
Reward: "Начислено: 5 000 UZS → Абдуллох" success-color.

Step 3 — In Progress (blue ring with dot, no line below):
Title: "Оплата в рознице — 500 000 UZS" in primary-blue, body-medium.
Subtitle: "Клиент тратит по карте (POS + ECOM)" small-body.
Progress bar: 8px height, 64% filled primary-blue, track default-border-color.
Below bar: "320 000 / 500 000 UZS" mono-value + "64%" primary-blue.
"Осталось: 180 000 UZS" small-body.
Right: "⏳ В процессе" warning-color.
Reward: "Вознаграждение: 10 000 UZS (после выполнения)" caption.

Divider.

**Financial summary:**
"Финансы по карте" card-title.
3 rows:
— "Пополнено" | "800 000 UZS" mono — green ArrowDown icon.
— "Потрачено" | "520 000 UZS" mono — red ArrowUp icon.
— "Баланс" | "280 000 UZS" mono — blue Wallet icon.

Divider.

**Transaction history (5 recent):**
"Последние операции" body-medium.
Compact list:
12.04 | POS оплата | -45 000 | "Korzinka Go" — red amount
11.04 | POS оплата | -32 000 | "Shro" — red
10.04 | ECOM | -28 000 | "Uzum Market" — red
03.04 | P2P приход | +300 000 | "Перевод" — green
01.04 | P2P приход | +500 000 | "Перевод" — green
```

---

### Prompt B-09: Rewards & Finance Page

```
Design the Rewards & Finance page for Bank Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Вознаграждения" page-title + "Все начисления KPI и выводы средств" subtitle. Right: Date Range Picker (Prompt 0 §22) + Outline Button "Экспорт".

**4× Stat Card components (Prompt 0 §3), equal row:**
1. Blue, Wallet. "Всего начислено" — "24 565 000 UZS". Trend: "+18% vs прошлый месяц".
2. Green, CheckCircle. "KPI выплаты" — "21 170 000 UZS".
3. Amber, ArrowDownToLine. "Выведено продавцами" — "14 890 000 UZS".
4. Violet, Coins. "Остаток в кошельках" — "6 280 000 UZS".

**Row 2 — Two cards (55%/45%):**

Left — Donut Chart (Prompt 0 §20):
Heading: "Начисления по KPI этапам".
Segments: KPI 1: 9 450 000 (38.5%) #3B82F6, KPI 2: 6 050 000 (24.6%) #60A5FA, KPI 3: 5 670 000 (23.1%) #93C5FD.
Center: "21 170 000 UZS" stat-display-number.
Legend below with colored dots.

Right — "Топ продавцов по заработку":
Ordered list:
1. 🥇 Санжар М. (Mysafar) — 555 000 UZS — 62 карты
2. 🥈 Ислом Т. (Mysafar) — 350 000 UZS — 42 карты
3. 🥉 Абдуллох Р. (Mysafar) — 330 000 UZS — 45 карт
4. Нодира У. (SmartCard) — 310 000 UZS — 38 карт
5. Мухаммад (Unired) — 290 000 UZS — 35 карт
Each: rank, name body-medium, org small-body, amount mono-value, card count caption.

**Row 3 — Transaction log (full width):**
Card heading: "Лог начислений" section-heading.
Tabs (Prompt 0 §9 tabs): Все | KPI вознаграждения | Выводы средств

Filter Bar: Search + Filter Select "Организация" + Filter Select "KPI этап".

Data Table:
Дата (date) | Продавец (text) | Организация (text) | Карта (mono) | Тип (badge) | KPI этап (badge-blue) | Сумма (mono) | UCOIN TX (mono-small) | Статус (badge)
13.04 14:32 | Абдуллох | Mysafar | ...4521 | Badge Default "KPI" | "KPI 3" | 10 000 | UCN-8834 | Badge Success "Начислено"
13.04 12:10 | Санжар | Mysafar | ...3892 | Badge Default "KPI" | "KPI 2" | 5 000 | UCN-8833 | Badge Success "Начислено"
13.04 09:00 | Абдуллох | Mysafar | — | Badge Warning "Вывод" | — | -120 000 (red) | UCN-8832 | Badge Info "Выведено"
12.04 18:45 | Лола | Unired | ...2105 | Badge Default "KPI" | "KPI 1" | 5 000 | UCN-8831 | Badge Success "Начислено"
12.04 15:20 | Нодира | SmartCard | ...1010 | Badge Default "KPI" | "KPI 3" | 10 000 | UCN-8830 | Badge Success "Начислено"

Pagination.
```

---

### Prompt B-10: Reports & Export

```
Design the Reports & Export page for Bank Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Отчёты и экспорт" page-title + "Формирование и скачивание отчётов по продажам и KPI" subtitle.

**Report cards grid (2 columns, gap 16px):**

Each card: white, default-border, card-border-radius, card-padding (24px).
Structure: Icon circle (44×44, colored tint from Prompt 0 §3) + card-title + small-body description (2 lines max) + collapsible filter row (Date Range Picker + relevant Filter Selects) + bottom row: Outline Button "Скачать Excel" with FileSpreadsheet icon + Ghost Button "Предпросмотр".

6 cards:
1. Blue, Building2. "Отчёт по организациям". "Сводка по всем организациям: карты, продажи, KPI, начисления." Filters: Date range.
2. Violet, Users. "Отчёт по продавцам". "Детализация по каждому продавцу: карты, KPI прогресс, заработок." Filters: Date range, Organization.
3. Green, CreditCard. "Отчёт по картам". "Полный реестр карт со статусами, KPI прогрессом, финансами." Filters: Date range, Organization, Status.
4. Amber, Wallet. "Отчёт по вознаграждениям". "Все начисления и выводы средств по продавцам." Filters: Date range, Organization, KPI step.
5. Cyan, TrendingUp. "KPI воронка конверсии". "Воронка от выдачи до выполнения KPI 3 по организациям." Filters: Date range, Organization.
6. Rose, Clock. "Просроченные KPI". "Карты с истёкшим сроком выполнения KPI (30 дней)." Filters: Date range, Organization, KPI step.

Below grid: "📋 Все отчёты экспортируются в формате .xlsx с форматированием и автофильтрами." caption.

Responsive: single column on mobile.
```


---

### Prompt B-11: Users Management (Bank Admin)

```
Design the Users Management page for Bank Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Пользователи" page-title + "Управление пользователями платформы" subtitle. Right: Primary Button "+ Добавить пользователя" with Plus icon.

**Filter Bar (Prompt 0 §5):**
— Search Input "Поиск по имени, телефону или email...", width 300px.
— Filter Select "Роль": Все, Банк-администратор, Менеджер организации, Оператор, Наблюдатель.
— Filter Select "Организация": Все, Universalbank, Mysafar OOO, Unired Marketing, etc.
— Filter Select "Статус": Все, Активен, Заблокирован, Ожидает.

**Data Table (Prompt 0 §4):**
Columns: # (text) | Пользователь (avatar+name cell) | Телефон (text) | Email (text) | Роль (badge) | Организация (text) | Последний вход (date) | Статус (badge) | Действия (action-dots)

10 rows:
1. 1 | Avatar "АК" + Админ Камолов | +998 90 100 00 01 | admin@ubank.uz | Badge Blue "Банк-админ" | Universalbank | 13.04 09:12 | Badge Success "Активен" | ⋮
2. 2 | Avatar "ШР" + Шерзод Рахимов | +998 90 100 00 02 | sh.rahimov@ubank.uz | Badge Blue "Банк-админ" | Universalbank | 12.04 18:30 | Badge Success "Активен" | ⋮
3. 3 | Avatar "НТ" + Нодира Тошева | +998 91 100 00 03 | n.tosheva@ubank.uz | Badge Outline "Оператор" | Universalbank | 13.04 10:45 | Badge Success "Активен" | ⋮
4. 4 | Avatar "РА" + Рустам Алиев | +998 90 123 45 67 | r.aliev@mysafar.uz | Badge Warning "Менеджер орг." | Mysafar OOO | 13.04 08:20 | Badge Success "Активен" | ⋮
5. 5 | Avatar "ЛК" + Лола Каримова | +998 91 234 56 78 | l.karimova@unired.uz | Badge Warning "Менеджер орг." | Unired Marketing | 12.04 17:00 | Badge Success "Активен" | ⋮
6. 6 | Avatar "ТН" + Тимур Насыров | +998 93 345 67 89 | t.nasyrov@express.uz | Badge Warning "Менеджер орг." | Express Finance | 11.04 14:30 | Badge Success "Активен" | ⋮
7. 7 | Avatar "АХ" + Азиз Хамидов | +998 94 456 78 90 | a.hamidov@dpay.uz | Badge Warning "Менеджер орг." | Digital Pay | 08.04 11:15 | Badge Default "Заблокирован" | ⋮
8. 8 | Avatar "НУ" + Нодира Усманова | +998 95 567 89 01 | n.usmanova@smart.uz | Badge Warning "Менеджер орг." | SmartCard Group | 13.04 07:50 | Badge Success "Активен" | ⋮
9. 9 | Avatar "ДА" + Дилноза Ахмедова | +998 91 789 01 23 | d.ahmedova@finb.uz | Badge Warning "Менеджер орг." | FinBridge | 01.04 09:00 | Badge Default "Заблокирован" | ⋮
10. 10 | Avatar "ФМ" + Фарход Маматов | +998 90 900 00 10 | — | Badge Outline "Наблюдатель" | Universalbank | — | Badge Info "Ожидает" | ⋮

Action dots dropdown: Подробнее, Редактировать роль, Сбросить пароль, Заблокировать / Разблокировать.

Pagination: "Показано 1–10 из 10".

**"Добавить пользователя" Modal (Prompt 0 §18, form dialog):**
Title: "Новый пользователь".
Fields (Prompt 0 §11):
— Input: label "ФИО", placeholder "Фамилия Имя Отчество".
— Input: label "Телефон", placeholder "+998 __ ___ __ __".
— Input: label "Email", placeholder "user@company.uz".
— Select: label "Роль", options: Банк-администратор, Менеджер организации, Оператор, Наблюдатель.
— Select: label "Организация" (visible only when role = Менеджер организации), options: org list.
— Toggle Switch: label "Отправить приглашение по SMS".
Footer: Outline Button "Отмена" + Primary Button "Создать".

Responsive: hide Email, Последний вход on tablet. Horizontal scroll mobile.
```

---

### Prompt B-12: Settings (Bank Admin)

```
Design the Settings page for Bank Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Настройки" page-title + "Настройки платформы и профиля" subtitle.

**Layout: Left sidebar tabs (vertical) + Right content area.**
Left tab list (200px width, white card, card-border-radius, padding 8px):
Vertical nav list, same styling as sidebar nav items but without icons:
— "Профиль" — ACTIVE
— "Безопасность"
— "Уведомления"
— "KPI по умолчанию"
— "Интеграции"
— "Система"

Right content area: white card, card-border-radius, card-padding (24px). Full remaining width.

---

**Tab: Профиль**

Section heading: "Личные данные".
Form fields (Prompt 0 §11), 2-column grid:
— Input: label "ФИО", value "Админ Камолов".
— Input: label "Телефон", value "+998 90 100 00 01".
— Input: label "Email", value "admin@ubank.uz".
— Select: label "Язык интерфейса", value "Русский", options: Русский, O'zbek, English.

Divider.

Section heading: "Тема оформления".
Radio Group (Prompt 0 §11): ○ Светлая (active) | ○ Тёмная | ○ Системная.

Footer: Primary Button "Сохранить изменения" + Outline Button "Отмена".

---

**Tab: Безопасность**

Section heading: "Смена пароля".
— Input: label "Текущий пароль", type password.
— Input: label "Новый пароль", type password.
— Input: label "Подтвердите пароль", type password.
Primary Button "Обновить пароль".

Divider.

Section heading: "Двухфакторная аутентификация".
Row: "2FA через SMS" body-medium + Toggle Switch (Prompt 0 §11) ON state. Below: "Код будет отправлен на +998 90 100 00 01" caption.

Divider.

Section heading: "Активные сессии".
Compact list (3 items):
— "Chrome, Windows — 13.04.2026 09:12 — Ташкент" + Badge Success "Текущая" + Ghost Button "Завершить".
— "Safari, iPhone — 12.04.2026 18:30 — Ташкент" + Ghost Button "Завершить".
— "Chrome, MacOS — 10.04.2026 14:00 — Самарканд" + Ghost Button "Завершить".
Destructive outline Button "Завершить все сессии".

---

**Tab: Уведомления**

Section heading: "Email уведомления".
Checkbox Group (Prompt 0 §11), vertical:
☑ Новая организация добавлена
☑ KPI этап выполнен (массовый)
☑ Запрос на вывод средств
☐ Ежедневный отчёт
☐ Еженедельная сводка

Divider.

Section heading: "Push уведомления".
Toggle rows:
— "KPI 3 выполнен" — Toggle ON.
— "Новый импорт карт" — Toggle ON.
— "Ошибки системы" — Toggle ON.
— "Вход с нового устройства" — Toggle OFF.

Footer: Primary Button "Сохранить".

---

**Tab: KPI по умолчанию**

Section heading: "Шаблон KPI для новых партий".
Description: "Эти значения будут подставлены по умолчанию при создании новой партии карт." small-body.

Mini KPI Stepper Variant A (Prompt 0 §7A), 3 steps, all editable:
— Step 1: Action "Регистрация в Unired Mobile", Threshold "0", Reward "5 000 UZS".
— Step 2: Action "P2P пополнение карты", Threshold "0", Reward "5 000 UZS".
— Step 3: Action "Оплата в рознице", Threshold "500 000 UZS", Reward "10 000 UZS".

Below:
— Number Input: label "Срок выполнения KPI (дней)", value "30".
— Number Input: label "Максимум этапов", value "3".

Footer: Primary Button "Сохранить шаблон" + Outline Button "Сбросить по умолчанию".

---

**Tab: Интеграции**

Section heading: "Подключённые сервисы".

3 integration cards (vertical list, gap 12px):
Each card: white, default-border, card-border-radius, padding 16px. Row layout: icon placeholder (40×40) + service name (card-title) + description (small-body) + right: Badge + Toggle.

1. Icon placeholder "U" + "Unired Mobile" + "Webhook: регистрация карт, статусы" + Badge Success "Подключено" + Toggle ON.
2. Icon placeholder "P" + "Процессинг" + "Webhook: P2P переводы, POS/ECOM транзакции" + Badge Success "Подключено" + Toggle ON.
3. Icon placeholder "UC" + "UCOIN Wallet" + "API: начисление вознаграждений, вывод средств" + Badge Success "Подключено" + Toggle ON.

Below each card (expandable): "Webhook URL" mono-small + "Последний вызов: 13.04.2026 14:32" caption + "Ошибок за 24ч: 0" caption green.

Ghost Button "+ Добавить интеграцию".

---

**Tab: Система**

Section heading: "Информация о системе".
Key-value grid (Prompt 0 §9 style):
— "Версия" | "1.0.0"
— "Среда" | "Production"
— "База данных" | Badge Success "Подключена"
— "Redis" | Badge Success "Подключён"
— "Последний деплой" | "12.04.2026 03:00"

Divider.

Section heading: "Обслуживание".
— Outline Button "Очистить кеш" + Outline Button "Скачать логи" with Download icon.
— Destructive outline Button "Режим обслуживания" with AlertTriangle icon.

Responsive: on tablet/mobile, left tab list moves to horizontal scrollable tabs above content.
```

---
---


---
---

## PART C — ORGANIZATION ADMIN SCREENS

---

### Prompt C-01: Organization Overview Dashboard

```
Design the Organization Admin dashboard. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Дашборд" page-title + "Mysafar OOO — обзор продаж и KPI" subtitle. Right: Date Range Picker (Prompt 0 §22).

**Row 1 — 5× Stat Card (Prompt 0 §3), equal width:**
1. Blue, CreditCard. "Карт получено" — "500".
2. Green, ShoppingBag. "Карт продано" — "230". Trend: "+12%".
3. Cyan, UserCheck. "KPI 1 — Регистрация" — "185". Subtitle: "80.4% от продано".
4. Amber, ArrowUpDown. "KPI 2 — Пополнение" — "120". Subtitle: "52.2%".
5. Rose, Wallet. "KPI 3 — Оплата 500K" — "45". Subtitle: "19.6%".

**Row 2 — Left (60%): Seller table. Right (40%): KPI stepper summary.**

Left — "Рейтинг продавцов" section-heading:
Data Table:
# | Продавец | Карт | Продано | KPI 1 | KPI 2 | KPI 3 | Заработано (mono)
1 | Санжар М. | 100 | 62 | 55 | 41 | 15 | 555 000
2 | Абдуллох Р. | 100 | 45 | 38 | 22 | 8 | 330 000
3 | Ислом Т. | 80 | 42 | 35 | 20 | 10 | 350 000
4 | Нилуфар К. | 100 | 33 | 28 | 18 | 5 | 255 000
5 | Дарья Н. | 70 | 30 | 15 | 10 | 5 | 210 000
6 | Камола Р. | 50 | 18 | 14 | 9 | 2 | 125 000
Sorted by Продано desc. Row 1 green highlight (top performer). Rows clickable.
Ghost Button "Управление продавцами →".

Right — "KPI конверсия" section-heading:
Mini KPI stepper (compact Variant B from Prompt 0 §7B, read-only, bars only — no reward lines):
— Step 1 green ✓: "Регистрация" bar 80.4% — "185/230".
— Step 2 blue ●: "Пополнение" bar 52.2% — "120/230".
— Step 3 gray ○: "Оплата 500K" bar 19.6% — "45/230".

Below: "Общий заработок продавцов: 1 825 000 UZS" stat-display-number.
"Выведено: 1 200 000 UZS" small-body.

**Row 3 — Activity Timeline (Prompt 0 §15), full width card:**
"Последняя активность" section-heading.
10 items:
— Green: "Карта ...4521 — KPI 3 выполнен (Абдуллох)" — "сегодня, 14:32"
— Blue: "Карта ...3892 — KPI 2 выполнен (Санжар)" — "сегодня, 09:15"
— Amber: "Камола Р. — вывод 80 000 UZS" — "вчера, 18:00"
— Green: "Карта ...2204 — KPI 1 выполнен (Нилуфар)" — "вчера, 15:30"
— Gray: "5 новых карт назначены Санжару" — "11.04.2026"
(...5 more similar)
Ghost Button "Показать все →".

Responsive: tablet — stat cards 3+2 grid, left/right stack vertically. Mobile — single column.
```

---

### Prompt C-02: Sellers Management (Organization Admin)

```
Design the Sellers Management page for Organization Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Продавцы" page-title + "Управление продавцами Mysafar OOO" subtitle. Right: Primary Button "+ Добавить продавца".

**Filter Bar (Prompt 0 §5):**
— Search Input "Поиск по имени или телефону...".
— Filter Select "Статус": Все, Активен, Неактивен.
— Filter Select "Сортировка": По имени, По продажам, По заработку.

**Data Table (Prompt 0 §4):**
Columns: # | Продавец (text) | Телефон (text) | Карт назначено (mono) | Продано (mono) | % продано (progress-cell) | KPI 1 | KPI 2 | KPI 3 | Заработано (mono) | Выведено (mono) | Баланс (mono) | Статус (badge) | Действия (action-dots)

6 rows:
1. 1 | Санжар Мирзаев | +998 91 111 22 33 | 100 | 62 | 62% | 55 | 41 | 15 | 555 000 | 400 000 | 155 000 | Badge Success "Активен" | ⋮
2. 2 | Абдуллох Рахимов | +998 90 222 33 44 | 100 | 45 | 45% | 38 | 22 | 8 | 330 000 | 250 000 | 80 000 | Badge Success "Активен" | ⋮
3. 3 | Ислом Тошматов | +998 93 333 44 55 | 80 | 42 | 52% | 35 | 20 | 10 | 350 000 | 200 000 | 150 000 | Badge Success "Активен" | ⋮
4. 4 | Нилуфар Каримова | +998 94 444 55 66 | 100 | 33 | 33% | 28 | 18 | 5 | 255 000 | 180 000 | 75 000 | Badge Success "Активен" | ⋮
5. 5 | Дарья Нам | +998 95 555 66 77 | 70 | 30 | 43% | 15 | 10 | 5 | 210 000 | 150 000 | 60 000 | Badge Success "Активен" | ⋮
6. 6 | Камола Расулова | +998 90 666 77 88 | 50 | 18 | 36% | 14 | 9 | 2 | 125 000 | 60 000 | 65 000 | Badge Success "Активен" | ⋮

Action dots dropdown: Подробнее, Назначить карты, Редактировать, Деактивировать.
Pagination below.

**"Добавить продавца" Modal (Prompt 0 §18, form dialog variant):**
Title: "Новый продавец".
Form fields (Prompt 0 §11):
— Input: label "ФИО", placeholder "Фамилия Имя Отчество".
— Input: label "Телефон", placeholder "+998 __ ___ __ __".
— Input: label "UCOIN кошелёк (опционально)", placeholder "Будет создан автоматически".
— Number Input: label "Карт назначить", default 0, note "Можно назначить позже".
Footer: Outline Button "Отмена" + Primary Button "Добавить".

Responsive: hide phone/balance columns tablet. Horizontal scroll mobile.
```

---

### Prompt C-03: Seller Detail — Side Drawer

```
Design a Detail Drawer (Prompt 0 §9) for a seller. Width 600px.

**Header:**
Title: "Санжар Мирзаев". Close X.
Below: "+998 91 111 22 33" small-body + Badge Success "Активен" + "UCOIN: UCN-0091" caption.

**Tabs:** Сводка | Карты | Финансы

---

**Tab: Сводка**

4× compact Stat Cards (2×2):
1. "Карт назначено" — "100".
2. "Продано" — "62 (62%)".
3. "KPI 3 завершено" — "15".
4. "Заработано" — "555 000 UZS".

KPI breakdown bars (Funnel Bar row style, Prompt 0 §8):
— KPI 1: 55/62 = 88.7% — "55 из 62 продано".
— KPI 2: 41/62 = 66.1% — "41 из 62".
— KPI 3: 15/62 = 24.2% — "15 из 62".

Earnings breakdown (key-value grid, Prompt 0 §9):
— "KPI 1 × 55 = 275 000 UZS"
— "KPI 2 × 41 = 205 000 UZS"
— "KPI 3 × 15 = 150 000 UZS"
— Divider.
— "Итого: 555 000 UZS" body-medium bold.
— "Выведено: 400 000" | "Баланс: 155 000".

---

**Tab: Карты**

Search Input + Filter Select "Статус".
Compact Data Table:
Карта (mono) | Клиент | Продано (date) | KPI 1 (kpi-check) | KPI 2 (kpi-check) | KPI 3 (kpi-check) | Пополнено (mono) | Расход (mono)
...2001 | Камол Т. | 02.04 | ✅ | ✅ | ✅ 620K | 1 200 000 | 680 000
...2002 | Шахзод Р. | 03.04 | ✅ | ✅ | 82% progress | 700 000 | 410 000
...2003 | Фарход М. | 04.04 | ✅ | — | — | 50 000 | —
...2004 | — | — | — | — | — | — | —

Rows clickable → Card Detail Drawer (B-08).

---

**Tab: Финансы**

Balance display: "Баланс UCOIN кошелька: 155 000 UZS" stat-display-number.
"Всего заработано: 555 000" | "Выведено: 400 000" body typography.

Data Table:
Дата (date) | Тип (badge) | Карта (mono) | KPI (badge-blue) | Сумма (mono) | Статус (badge)
13.04 | Badge Default "KPI" | ...4521 | "KPI 3" | +10 000 (green) | Badge Success "Начислено"
13.04 | Badge Warning "Вывод" | — | — | -120 000 (red) | Badge Info "Выведено"
12.04 | Badge Default "KPI" | ...3892 | "KPI 2" | +5 000 (green) | Badge Success "Начислено"
10.04 | Badge Default "KPI" | ...2003 | "KPI 1" | +5 000 (green) | Badge Success "Начислено"
```

---

### Prompt C-04: Cards List (Organization Admin)

```
Design the Cards list page for Organization Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Карты" page-title + "Карты организации Mysafar OOO" subtitle. Right: Outline Button "Экспорт".

**Stat Pill row (Prompt 0 §14):**
"Всего: 500" | "На складе: 140" | "У продавцов: 130" | "Продано: 230" | "KPI 3 ✅: 45".

**Filter Bar (Prompt 0 §5):**
— Search Input "Поиск по номеру карты, клиенту, продавцу...".
— Filter Select "Продавец": Все, Санжар, Абдуллох, Ислом, Нилуфар, Дарья, Камола.
— Filter Select "Статус": Все, На складе, У продавца, Продана, Зарегистрирована, Активна.
— Filter Select "KPI": Все, Без KPI, KPI 1 ✅, KPI 2 ✅, KPI 3 ✅.

**Data Table (Prompt 0 §4):**
Same structure as B-07 without "Организация" column:
Карта (mono) | Тип (badge-outline) | Продавец (text) | Клиент (text) | Телефон (text) | Статус (badge) | KPI 1 (kpi-check) | KPI 2 (kpi-check) | KPI 3 (kpi-check) | Пополнено (mono) | Расход (mono)

10 sample rows with consistent data. Rows clickable → Card Detail Drawer (B-08).
Pagination.

Responsive: horizontal scroll.
```

---

### Prompt C-05: Card Assignment Page

```
Design the Card Assignment page for Organization Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Назначение карт" page-title + "Назначьте карты со склада продавцам" subtitle.

**Step 1 — Select seller:**
White card, card-padding.
Select component (Prompt 0 §11): label "Выберите продавца", options with card counts: "Санжар Мирзаев (100 карт)", "Абдуллох Рахимов (100 карт)", etc.

Selected seller info card below:
"Санжар Мирзаев" card-title.
"Назначено: 100 | Продано: 62 | На руках: 38" body.

**Step 2 — Select cards:**
White card, card-padding.
Label: "Выберите карты для назначения".

Radio Group (Prompt 0 §11):
— ○ "Назначить количество" → Number Input, helper "Система выберет карты автоматически".
— ○ "Выбрать конкретные карты" → shows scrollable list below (max-height 300px):
  Checkbox list:
  ☑ 8600 1234 5678 3001 — Badge Outline "VISA SUM"
  ☑ 8600 1234 5678 3002 — Badge Outline "VISA SUM"
  ☐ 8600 1234 5678 3003 — Badge Outline "VISA USD"
  ☐ 8600 1234 5678 3004 — Badge Outline "VISA SUM"
  (...more)
  "Выбрано: 25 карт" body-medium primary-blue below list.
  Ghost Button "Выбрать все" / "Снять все".

**Summary card:**
White card, card-padding 20px, left border 4px primary-blue.
"Назначить 25 карт → Санжар Мирзаев" card-title.
"После назначения карты перейдут в статус 'У продавца'" small-body.

Footer: Outline Button "Отмена" + Primary Button "Назначить карты".

Responsive: stack vertically on mobile.
```

---

### Prompt C-06: Organization Finance Page

```
Design the Finance page for Organization Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Вознаграждения" page-title + "Финансовый обзор Mysafar OOO" subtitle. Right: Date Range Picker (Prompt 0 §22).

**4× Stat Card (Prompt 0 §3):**
1. Green, Wallet. "Всего начислено" — "1 825 000 UZS".
2. Blue, CheckCircle. "KPI выплаты" — "1 825 000 UZS".
3. Amber, ArrowDownToLine. "Выведено" — "1 200 000 UZS".
4. Violet, Coins. "Баланс в кошельках" — "625 000 UZS".

**Row 2 — Left (55%): Bar chart. Right (45%): KPI breakdown.**

Left — Horizontal Bar Chart (Prompt 0 §21):
Heading: "По продавцам" section-heading.
6 bars:
Санжар: 555 000 | Ислом: 350 000 | Абдуллох: 330 000 | Нилуфар: 255 000 | Дарья: 210 000 | Камола: 125 000

Right — "По KPI этапам":
3 rows with progress bars:
— "KPI 1 — Регистрация": 925 000 UZS (185 × 5 000).
— "KPI 2 — Пополнение": 600 000 UZS (120 × 5 000).
— "KPI 3 — Оплата 500K": 450 000 UZS (45 × 10 000).
Total: "1 825 000 UZS" body-medium bold.

**Row 3 — Transaction log (full width):**
"Лог операций" section-heading.
Tabs: Все | Начисления | Выводы

Filter Bar: Search + Filter Select "KPI этап".

Data Table:
Дата (date) | Продавец (text) | Тип (badge) | Карта (mono) | KPI (badge-blue) | Сумма (mono) | UCOIN TX (mono-small) | Статус (badge)
(Same structure as B-09 filtered to this org.)

Pagination.
Responsive: stat cards 2×2 tablet, single column mobile.
```

---

### Prompt C-07: Withdrawals (Organization Admin)

```
Design the Withdrawals (Выводы) page for Organization Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Выводы средств" page-title + "Запросы на вывод вознаграждений продавцами Mysafar OOO" subtitle. Right: Date Range Picker (Prompt 0 §22).

**3× Stat Card (Prompt 0 §3), equal row:**
1. Amber, ArrowDownToLine. "Всего выведено" — "1 200 000 UZS".
2. Blue, Clock. "В обработке" — "85 000 UZS". Subtitle: "2 запроса".
3. Green, CheckCircle. "Баланс в кошельках" — "625 000 UZS". Subtitle: "6 продавцов".

**Filter Bar (Prompt 0 §5):**
— Search Input "Поиск по продавцу или номеру транзакции...".
— Filter Select "Продавец": Все, Санжар, Абдуллох, Ислом, Нилуфар, Дарья, Камола.
— Filter Select "Статус": Все, Выполнен, В обработке, Отклонён.

**Data Table (Prompt 0 §4):**
Columns: # (text) | Дата (date) | Продавец (avatar+name) | Сумма (mono) | Метод (text) | Реквизиты (mono-small) | UCOIN TX (mono-small) | Статус (badge) | Действия (action-dots)

8 rows:
1. 1 | 13.04 14:00 | Абдуллох Р. | 120 000 | UZCARD | 8600 •••• 4455 | UCN-8832 | Badge Success "Выполнен" | ⋮
2. 2 | 13.04 10:30 | Санжар М. | 200 000 | HUMO | 9860 •••• 7788 | UCN-8835 | Badge Success "Выполнен" | ⋮
3. 3 | 12.04 16:00 | Нилуфар К. | 80 000 | UZCARD | 8600 •••• 1122 | UCN-8829 | Badge Success "Выполнен" | ⋮
4. 4 | 12.04 12:00 | Ислом Т. | 100 000 | VISA | 4278 •••• 9900 | UCN-8828 | Badge Success "Выполнен" | ⋮
5. 5 | 11.04 18:00 | Камола Р. | 60 000 | UZCARD | 8600 •••• 3344 | UCN-8825 | Badge Success "Выполнен" | ⋮
6. 6 | 11.04 09:00 | Дарья Н. | 50 000 | HUMO | 9860 •••• 5566 | UCN-8824 | Badge Success "Выполнен" | ⋮
7. 7 | 13.04 15:30 | Санжар М. | 50 000 | UZCARD | 8600 •••• 7788 | UCN-8836 | Badge Warning "В обработке" | ⋮
8. 8 | 13.04 11:00 | Ислом Т. | 35 000 | HUMO | 9860 •••• 2233 | UCN-8837 | Badge Warning "В обработке" | ⋮

"В обработке" rows: subtle amber-left-border (3px) for visual emphasis.
Action dots dropdown: Подробнее, Подтвердить (for pending), Отклонить (for pending).

Pagination: "Показано 1–8 из 8".

**Withdrawal Detail Drawer (Prompt 0 §9), width 480px — opens from row click:**
Header: "Вывод #UCN-8832" + Badge Success "Выполнен". Close X.
Key-value grid:
— "Продавец" | "Абдуллох Рахимов"
— "Телефон" | "+998 90 222 33 44"
— "Сумма" | "120 000 UZS"
— "Метод" | "UZCARD"
— "Реквизиты" | "8600 1234 5678 4455"
— "Баланс до" | "200 000 UZS"
— "Баланс после" | "80 000 UZS"
— "UCOIN TX ID" | "UCN-8832"
— "Запрошено" | "13.04.2026, 14:00"
— "Выполнено" | "13.04.2026, 14:02"

Responsive: horizontal scroll on mobile.
```

---

### Prompt C-08: Settings (Organization Admin)

```
Design the Settings page for Organization Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Настройки" page-title + "Настройки профиля и организации" subtitle.

**Layout: Left sidebar tabs (vertical, 200px) + Right content area (white card, full remaining width).**
Same structure as B-12.

Tabs:
— "Профиль" — ACTIVE
— "Безопасность"
— "Уведомления"
— "Организация"

---

**Tab: Профиль**

Section heading: "Личные данные".
Form fields 2-column (Prompt 0 §11):
— Input: label "ФИО", value "Рустам Алиев".
— Input: label "Телефон", value "+998 90 123 45 67".
— Input: label "Email", value "r.aliev@mysafar.uz".
— Select: label "Язык интерфейса", value "Русский".

Divider.

Section heading: "Тема оформления".
Radio Group: ○ Светлая (active) | ○ Тёмная | ○ Системная.

Footer: Primary Button "Сохранить" + Outline Button "Отмена".

---

**Tab: Безопасность**

Same structure as B-12 Безопасность tab:
— Change password fields.
— 2FA toggle.
— Active sessions list (2 sessions for this user).

---

**Tab: Уведомления**

Section heading: "Email уведомления".
Checkbox Group:
☑ Продавец выполнил KPI 3
☑ Запрос на вывод средств
☑ Новые карты назначены
☐ Ежедневный отчёт по продавцам
☐ Еженедельная сводка

Divider.

Section heading: "Push уведомления".
Toggle rows:
— "KPI выполнен" — Toggle ON.
— "Новый вывод средств" — Toggle ON.
— "Просроченный KPI" — Toggle OFF.
— "Вход с нового устройства" — Toggle ON.

Footer: Primary Button "Сохранить".

---

**Tab: Организация**

Section heading: "Данные организации".
Form fields 2-column (Prompt 0 §11):
— Input: label "Название", value "Mysafar OOO", disabled (only bank can edit).
— Input: label "Контактное лицо", value "Рустам Алиев".
— Input: label "Телефон организации", value "+998 90 123 45 67".
— Input: label "Email организации", value "info@mysafar.uz".
— Textarea: label "Адрес", value "г. Ташкент, ул. Навои, 12".

Divider.

Section heading: "Договор".
Key-value grid (Prompt 0 §9 style):
— "Номер договора" | "MC-2026-042"
— "Дата заключения" | "15.03.2026"
— "Срок действия" | "15.03.2027"
— "Лимит карт" | "500"
— "Статус" | Badge Success "Активен"

Note: "Для изменения условий договора обратитесь в банк." caption.

Responsive: on tablet/mobile, left tab list moves to horizontal scrollable tabs above content.
```

---
---

---
---

## PART D — DARK THEME

---

### Prompt D-01: Dark Theme Token Override

```
Apply the dark theme token overrides from Prompt 0 (COLOR TOKENS → Dark theme overrides section) to the Bank Overview Dashboard layout from B-01.

All typography sizes, spacing, component structure, and layout remain identical — only color tokens change:

Page background → #0F1117
Cards → #1A1D27, border #2D3148
Primary text → #F1F2F6
Secondary text → #A0A5B8
Sidebar → #12141C, border #2D3148, active item #1E2A4A bg + #3B82F6 text
Primary blue → #3B82F6
Inputs → bg #1A1D27, border #2D3148
Table row hover → #1E2130
Table alternate → #161822
Progress bar track → #2D3148
Success → #34D399, Error → #F87171, Warning → #FBBF24
Stat card icon tints → reduce to 15% opacity
Badge backgrounds → lighten 10% on dark base, borders #2D3148
Dividers → #2D3148

Toggle: sun/moon icon in sidebar bottom, 200ms transition.

No gradients, no glow. Flat dark surfaces, subtle borders.
```

---
---

## USAGE NOTES

1. **Generate Prompt 0 first** — it defines every component, token, and typography scale referenced by §-number in all subsequent prompts.
2. Each screen prompt is self-contained and copy-paste ready for Figma Make.
3. Component references use format: "Component Name (Prompt 0 §N)" — e.g., "Data Table (Prompt 0 §4)".
4. Token references use named tokens: "page-title", "body-medium", "primary-blue", "default-border", "card-padding", etc.
5. Cell type references match Prompt 0 §4 definitions: "mono", "badge", "progress-cell", "kpi-check", "date", "action-dots", "text".
6. Badge variant references match Prompt 0 §6: Success, Warning, Error, Info, Default, Outline, Blue.
7. Sample data is consistent across all prompts (same org names, sellers, card numbers, amounts).
8. All money values: UZS with space-separated thousands via mono typography.
9. Post-production in Figma: logos, branding, real text replacements.