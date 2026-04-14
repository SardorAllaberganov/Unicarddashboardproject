# Moment Card KPI Platform — CRUD, Actions & Secondary Pages

**Prerequisite:** Prompt 0 (Design System) + Main Prompt Library (v2) must be generated first.
**Scope:** All create/edit/delete flows, confirmation dialogs, wizards, preview pages, bulk operations, and utility pages not covered in the main library.

---
---

## PART E — ORGANIZATION CRUD (Bank Admin)

---

### Prompt E-01: Create Organization — Full Page Form

```
Design a full-page form for creating a new organization in the Bank Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Breadcrumb (Prompt 0 §13):** "Организации" (link) → "Новая организация" (current).
"Добавить организацию" page-title + "Заполните данные организации-партнёра" subtitle.

**Form card:** White card, card-border-radius, card-padding (24px). Full-width.

**Section 1 — "Основная информация" section-heading:**
2-column grid, gap 24px horizontal, 16px vertical:
— Input (Prompt 0 §11): label "Название организации *", placeholder "ООО «Название»". Required asterisk red.
— Input: label "ИНН", placeholder "123456789".
— Input: label "Контактное лицо *", placeholder "Фамилия Имя Отчество".
— Input: label "Должность контактного лица", placeholder "Директор / Менеджер".
— Input: label "Телефон *", placeholder "+998 __ ___ __ __".
— Input: label "Email", placeholder "info@company.uz".
— Textarea (Prompt 0 §11): label "Юридический адрес", placeholder "г. Ташкент, ул. ...", spans full 2-column width.

Divider.

**Section 2 — "Договор" section-heading:**
2-column grid:
— Input: label "Номер договора", placeholder "MC-2026-___".
— Date picker input: label "Дата заключения", placeholder "ДД.ММ.ГГГГ".
— Date picker input: label "Срок действия до", placeholder "ДД.ММ.ГГГГ".
— Number Input (Prompt 0 §11): label "Лимит карт по договору", placeholder "500".

Divider.

**Section 3 — "Администратор организации" section-heading:**
Description: "Будет создан пользователь с ролью 'Менеджер организации'" small-body.
2-column grid:
— Input: label "ФИО администратора *", placeholder "Фамилия Имя Отчество".
— Input: label "Телефон администратора *", placeholder "+998 __ ___ __ __".
— Input: label "Email администратора", placeholder "admin@company.uz".
— Toggle Switch (Prompt 0 §11): label "Отправить приглашение по SMS". Default ON.

**Footer (sticky at bottom, white bg, top border, padding 16px 32px):**
Left: Ghost Button "Отмена" (navigates back to org list).
Right: Outline Button "Сохранить как черновик" + Primary Button "Создать организацию".

**Validation state (show one field in error):**
— "Название организации" input with error-border, below: "Это поле обязательно" error helper text (Prompt 0 §11 error state).

Responsive: single column on tablet/mobile. Footer buttons stack vertically on mobile.
```

---

### Prompt E-02: Edit Organization — Full Page Form

```
Design the Edit Organization page for Bank Admin. Same layout as E-01 but pre-filled with existing data.

**Breadcrumb:** "Организации" → "Mysafar OOO" → "Редактирование" (current).
"Редактирование организации" page-title + "Mysafar OOO" subtitle.

Same form structure as E-01 with pre-filled values:
— Section 1: "Mysafar OOO", "302456789", "Рустам Алиев", "Директор", "+998 90 123 45 67", "info@mysafar.uz", "г. Ташкент, ул. Навои, 12".
— Section 2: "MC-2026-042", "15.03.2026", "15.03.2027", "500".
— Section 3: fields disabled with note "Администратор уже создан: Рустам Алиев (+998 90 123 45 67)" small-body. Ghost Button "Сменить администратора" below.

Additional section at bottom before footer:

**Section 4 — "Статус организации" section-heading:**
Row: current status Badge Success "Активна" + Select: options "Активна", "На паузе", "Неактивна". Warning note below: "При деактивации все продавцы организации будут заблокированы" small-body, warning-color, with AlertTriangle icon.

**Footer:**
Left: Destructive outline Button "Деактивировать" with AlertTriangle icon.
Right: Outline Button "Отмена" + Primary Button "Сохранить изменения".

Changed fields: show left-border 3px primary-blue on modified inputs to indicate changed values.
```

---

### Prompt E-03: Deactivate Organization — Confirmation Dialog

```
Design a confirmation dialog (Prompt 0 §18, destructive variant) for deactivating an organization.

Modal (Prompt 0 §18): max-width 480px, centered, overlay.

**Header:** AlertTriangle icon (24px, warning-color) + "Деактивировать организацию" body-medium. Close X.

**Content:**
"Вы уверены, что хотите деактивировать организацию?" body.

Warning card: white card with left border 3px warning-color, padding 16px:
— "Mysafar OOO" body-medium.
— "При деактивации произойдёт следующее:" small-body.
— "• 6 продавцов будут заблокированы" small-body.
— "• 140 нераспроданных карт вернутся на склад банка" small-body.
— "• Новые продажи станут невозможны" small-body.
— "• Текущий KPI прогресс будет заморожен" small-body.

Input: label "Введите название организации для подтверждения", placeholder "Mysafar OOO". Helper: "Введите точное название" caption.

**Footer:**
Outline Button "Отмена" + Destructive Button "Деактивировать".
Destructive button disabled until confirmation input matches org name.
```

---
---

## PART F — CARD BATCH CRUD (Bank Admin)

---

### Prompt F-01: Create Card Batch — Multi-Step Wizard

```
Design a multi-step wizard for creating a new card batch in Bank Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Breadcrumb:** "Партии карт" → "Новая партия" (current).
"Создание партии карт" page-title.

**Horizontal step indicator (top of form):**
3 steps, horizontal, connected by line:
— Step 1 "Основные данные" — ACTIVE (blue circle "1", blue text).
— Step 2 "KPI настройки" — upcoming (gray circle "2", gray text).
— Step 3 "Импорт карт" — upcoming (gray circle "3", gray text).
Connecting line: completed = solid blue, upcoming = dashed gray. Each step circle 32×32.

---

**Step 1 — "Основные данные" (show this step active):**

White card, card-padding (24px), full-width.
Section heading: "Информация о партии".

2-column grid:
— Input: label "Название партии *", placeholder "Партия Апрель 2026".
— Select: label "Организация *", options: list of active organizations. Placeholder "Выберите организацию".
— Select: label "Тип карт", options: "VISA SUM", "VISA USD", "Смешанная". Default "VISA SUM".
— Number Input: label "Ожидаемое количество карт", placeholder "500".
— Number Input: label "Срок выполнения KPI (дней)", value "30", helper "По умолчанию: 30 дней".
— Date picker: label "Дата начала KPI", placeholder "ДД.ММ.ГГГГ", helper "Если не указано, KPI начинается с момента продажи каждой карты".

Selected org info card (appears after org selection):
Light blue bg card (#EFF6FF), padding 12px:
"Mysafar OOO" body-medium + "Активна" Badge Success + "Текущий лимит: 500 карт, использовано: 360" small-body + "Доступно: 140 карт" body-medium primary-blue.

**Footer:**
Right: Outline Button "Отмена" + Primary Button "Далее: KPI настройки →".

---

**Step 2 — "KPI настройки" (show as separate state):**

Step indicator: Step 1 completed (green check), Step 2 active (blue), Step 3 upcoming.

White card with summary strip at top:
"Партия: Партия Апрель 2026 | Организация: Mysafar OOO | Тип: VISA SUM | Срок KPI: 30 дней" small-body on light gray bg strip.

Below: full KPI Stepper Variant A (Prompt 0 §7A) — same as B-05 but starting empty:
— Step 1: all fields empty, active/editing state. Select "Действие клиента" open with dropdown.
— Dashed "+ Добавить этап" button below.

Pre-fill link: Ghost Button "Заполнить из шаблона по умолчанию" — when clicked, fills 3 standard KPI steps.

Budget preview card (bottom):
"Бюджет партии" section-heading.
— "Этапов: 0" | "За карту: 0 UZS" | "Всего (× 500 карт): 0 UZS".
Updates dynamically as steps are added.

**Footer:**
Left: Ghost Button "← Назад".
Right: Outline Button "Пропустить (настроить позже)" + Primary Button "Далее: Импорт карт →".

---

**Step 3 — "Импорт карт" (show as separate state):**

Step indicator: Steps 1–2 completed (green), Step 3 active.

Same upload interface as B-06 (File Upload / Drop Zone from Prompt 0 §19), but embedded in wizard context.

Two options (Radio Group):
— ○ "Импортировать из Excel" → shows drop zone (B-06 style).
— ○ "Импортировать позже" → shows info note: "Вы сможете импортировать карты позже на странице партии" small-body.

**Footer:**
Left: Ghost Button "← Назад".
Right: Primary Button "Создать партию".

---

**Success state (after creation):**
Full-page centered card (white, card-border-radius, padding 40px, max-width 560px centered):
— Large green CheckCircle icon (64px).
— "Партия успешно создана" section-heading.
— Summary key-value grid:
  "Партия" | "Партия Апрель 2026"
  "Организация" | "Mysafar OOO"
  "Тип карт" | "VISA SUM"
  "KPI этапов" | "3"
  "Карт импортировано" | "498 из 500"
— Primary Button "Перейти к партии" + Outline Button "Создать ещё" + Ghost Button "К списку партий".
```

---

### Prompt F-02: Card Batch Detail — Full Page

```
Design a full-page detail view for a single card batch in Bank Admin. Reference Prompt 0 components.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Breadcrumb:** "Партии карт" → "Партия Апрель 2026 — Mysafar OOO" (current).

**Header row:**
Left: "Партия Апрель 2026" page-title. Below: "Mysafar OOO" small-body + Badge Success "Активна".
Right: Outline Button "Редактировать" with Pencil icon + Outline Button "Экспорт" with Download icon + action-dots dropdown (Архивировать, Дублировать, Удалить).

**Row 1 — Batch info strip:**
White card, padding 16px. Horizontal row of key-value pairs:
"Тип карт" | Badge Outline "VISA SUM" — "Создана" | "01.04.2026" — "Срок KPI" | "30 дней" — "Карт" | "500" — "Импортировано" | "498" — "Продано" | "230".

**Row 2 — 5× Stat Cards (Prompt 0 §3):**
1. Blue, CreditCard. "Всего карт" — "498".
2. Green, ShoppingBag. "Продано" — "230 (46.2%)".
3. Cyan, UserCheck. "KPI 1 Регистрация" — "185 (80.4%)".
4. Amber, ArrowUpDown. "KPI 2 Пополнение" — "120 (52.2%)".
5. Rose, CheckCircle. "KPI 3 Оплата 500K" — "45 (19.6%)".

**Row 3 — Tabs (full-width, below stats):**
Shadcn Tabs (Prompt 0 §9 tabs): Карты | KPI конфигурация | Продавцы | Финансы | История

---

**Tab: Карты (default active)**

Stat Pill row (Prompt 0 §14):
"На складе: 138" | "У продавцов: 130" | "Продано: 230" | "Активных: 185".

Filter Bar (Prompt 0 §5): Search + Filter Select "Статус" + Filter Select "Продавец" + Filter Select "KPI".

Data Table (Prompt 0 §4):
Карта (mono) | Продавец (text) | Клиент (text) | Телефон (text) | Статус (badge) | KPI 1 (kpi-check) | KPI 2 (kpi-check) | KPI 3 (kpi-check) | Пополнено (mono) | Расход (mono)
(10 rows, same data pattern as B-07 but filtered to this batch.)
Rows clickable → Card Detail page (B-08).
Pagination.

---

**Tab: KPI конфигурация**

Same content as B-05 KPI stepper but in read-only mode (Variant A completed state for all 3 steps).
Bottom: Ghost Button "Редактировать KPI конфигурацию" → navigates to B-05 edit mode.

---

**Tab: Продавцы**

Data Table:
Продавец (avatar+name) | Карт назначено | Продано | % продано (progress-cell) | KPI 1 | KPI 2 | KPI 3 | Заработано (mono)
Санжар М. | 100 | 62 | 62% | 55 | 41 | 15 | 555 000
Абдуллох Р. | 100 | 45 | 45% | 38 | 22 | 8 | 330 000
Нилуфар К. | 100 | 33 | 33% | 28 | 18 | 5 | 255 000
(... more)
Bottom: Ghost Button "Назначить карты продавцам →".

---

**Tab: Финансы**

3× compact Stat Cards:
"Начислено" — "1 825 000 UZS" | "Выведено" — "1 200 000 UZS" | "Баланс" — "625 000 UZS".

Data Table (reward log filtered to this batch):
Дата | Продавец | Карта | KPI | Сумма | Статус
(5+ rows)

---

**Tab: История**

Activity Timeline (Prompt 0 §15):
— "Партия создана" — "01.04.2026 10:00" — gray dot.
— "498 карт импортированы" — "01.04.2026 10:05" — blue dot.
— "100 карт назначены → Санжар М." — "01.04.2026 11:00" — blue dot.
— "100 карт назначены → Абдуллох Р." — "01.04.2026 11:15" — blue dot.
— "Первая продажа: карта ...1001 → Алишер Н." — "02.04.2026 09:30" — green dot.
— "KPI конфигурация изменена" — "03.04.2026 14:00" — amber dot.
(... 10+ items)
```

---

### Prompt F-03: Edit Card Batch — Form

```
Design the Edit Card Batch page for Bank Admin. Reference Prompt 0.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Breadcrumb:** "Партии карт" → "Партия Апрель 2026 — Mysafar OOO" → "Редактирование" (current).
"Редактирование партии" page-title.

**White card, card-padding (24px):**

Section heading: "Основные данные".
2-column grid (pre-filled):
— Input: label "Название партии *", value "Партия Апрель 2026".
— Select: label "Организация", value "Mysafar OOO", DISABLED with lock icon, helper "Организацию нельзя изменить после создания".
— Select: label "Тип карт", value "VISA SUM", DISABLED, helper "Тип карт нельзя изменить".
— Number Input: label "Срок выполнения KPI (дней)", value "30". Warning note if cards already sold: "Изменение срока повлияет на 230 уже проданных карт" small-body warning-color.

Divider.

Section heading: "Статус партии".
Row: current Badge Success "Активна" + Select: "Активна", "На паузе", "Завершена", "Архивирована".
Conditional warning for each status:
— "На паузе": "KPI отслеживание будет приостановлено. Продавцы не смогут фиксировать продажи."
— "Завершена": "Партия будет закрыта. Незавершённые KPI будут отмечены как просроченные."
— "Архивирована": "Партия будет скрыта из основных списков."

Divider.

Section heading: "Дополнительный импорт".
"В партии: 498 карт из 500 ожидаемых" body.
Outline Button "Импортировать ещё карт" with Upload icon → navigates to B-06 with batch pre-selected.

**Footer (sticky):**
Left: Ghost Button "Отмена".
Right: Primary Button "Сохранить изменения".
```

---

### Prompt F-04: Archive Card Batch — Confirmation Dialog

```
Design a confirmation dialog (Prompt 0 §18) for archiving a card batch.

Modal: max-width 480px, centered, overlay.

**Header:** Archive icon (24px, muted) + "Архивировать партию" body-medium. Close X.

**Content:**
"Вы уверены, что хотите архивировать эту партию?" body.

Info card (left border 3px primary-blue, padding 12px):
— "Партия Апрель 2026 — Mysafar OOO" body-medium.
— "498 карт | 230 продано | 45 KPI 3 выполнено" small-body.

"После архивирования:" body, muted.
"• Партия будет скрыта из основных списков" small-body.
"• Данные сохранятся и будут доступны в разделе 'Архив'" small-body.
"• Продавцы не смогут фиксировать новые продажи по этой партии" small-body.

**Footer:**
Outline Button "Отмена" + Primary Button "Архивировать".
```

---

### Prompt F-05: Delete Card Batch — Destructive Confirmation

```
Design a destructive confirmation dialog (Prompt 0 §18, destructive variant) for deleting a card batch.

Modal: max-width 480px, centered, overlay.

**Header:** AlertTriangle icon (error-color) + "Удалить партию" body-medium error-color. Close X.

**Content:**
"Это действие нельзя отменить. Все данные партии будут безвозвратно удалены." body.

Warning card (left border 3px error-color, bg error-bg-tint, padding 12px):
— "Партия Тест — CardPlus" body-medium.
— "50 карт | 0 продано | 0 KPI выполнено" small-body.

"Будут удалены:" body error-color.
"• Все карты этой партии (50)" small-body.
"• KPI конфигурации" small-body.
"• История событий" small-body.

Note: "Удаление возможно только для партий без продаж" caption.

Input: label "Введите DELETE для подтверждения", placeholder "DELETE".

**Footer:**
Outline Button "Отмена" + Destructive Button "Удалить навсегда" (disabled until input = "DELETE").
```

---
---

## PART G — SELLER CRUD (Organization Admin)

---

### Prompt G-01: Edit Seller — Modal

```
Design an edit seller modal (Prompt 0 §18, form dialog) for Organization Admin.

Modal: max-width 520px, centered, overlay.

**Header:** "Редактировать продавца" section-heading. Close X.

**Content:**
Form fields (Prompt 0 §11), vertical stack:
— Input: label "ФИО *", value "Санжар Мирзаев".
— Input: label "Телефон *", value "+998 91 111 22 33". Helper: "Изменение телефона потребует повторной верификации" caption.
— Input: label "UCOIN кошелёк", value "UCN-0091", DISABLED with lock icon. Helper: "Кошелёк создаётся автоматически" caption.

Divider.

Section: "Статус".
Row: Badge Success "Активен" + Select: "Активен", "Неактивен".
Warning note when "Неактивен" selected:
"При деактивации:" small-body warning-color.
"• 38 нераспроданных карт будут возвращены на склад организации" small-body.
"• Новые назначения станут невозможны" small-body.
"• Текущий KPI прогресс по проданным картам сохранится" small-body.

**Footer:**
Outline Button "Отмена" + Primary Button "Сохранить".
```

---

### Prompt G-02: Deactivate Seller — Confirmation with Card Reassignment

```
Design a multi-step confirmation dialog for deactivating a seller and reassigning their unsold cards.

Modal: max-width 560px, centered, overlay.

**Header:** AlertTriangle icon (warning-color) + "Деактивировать продавца" body-medium. Close X.

**Step 1 — Confirmation:**

"Вы уверены, что хотите деактивировать этого продавца?" body.

Seller info card (left border 3px warning-color, padding 12px):
— Avatar "СМ" + "Санжар Мирзаев" body-medium + Badge Success "Активен".
— "Карт назначено: 100 | Продано: 62 | На руках: 38" small-body.
— "Заработано: 555 000 UZS | Баланс: 155 000 UZS" small-body.

**Step 2 — Card reassignment (below, always visible):**

Section: "Что делать с 38 нераспроданными картами?" body-medium.

Radio Group:
— ○ "Вернуть на склад организации" (default) — "Карты получат статус 'На складе'" caption.
— ○ "Передать другому продавцу" → Select appears: "Выберите продавца", options: "Абдуллох Рахимов (100 карт)", "Ислом Тошматов (80 карт)", etc.

Section: "Баланс кошелька: 155 000 UZS" body-medium.
"Продавец сможет вывести остаток средств после деактивации" caption.

**Footer:**
Outline Button "Отмена" + Destructive outline Button "Деактивировать продавца".
```

---

### Prompt G-03: Card Reassignment Between Sellers

```
Design a card reassignment modal for moving cards from one seller to another. Organization Admin.

Modal: max-width 560px, centered, overlay.

**Header:** "Переназначить карты" section-heading. Close X.

**From section:**
"Откуда" label muted. Seller card: avatar + "Санжар Мирзаев" body-medium + "На руках: 38 карт" small-body.

Arrow down icon (24px, muted, centered).

**To section:**
"Кому" label muted. Select: "Выберите продавца", options list.
After selection: seller card appears: avatar + "Абдуллох Рахимов" body-medium + "На руках: 55 карт → будет 55 + 10 = 65" small-body.

**Card selection:**
"Количество карт для переназначения" label.
Number Input, value "10", min 1, max 38.

Or Toggle: "Выбрать конкретные карты" → scrollable checkbox list of card numbers (same as C-05 pattern):
☑ ...3041 — VISA SUM
☑ ...3042 — VISA SUM
☐ ...3043 — VISA USD
(...)
"Выбрано: 10 из 38" body-medium primary-blue.

**Summary:**
Info card (left border 3px primary-blue, padding 12px):
"Переназначить 10 карт: Санжар М. → Абдуллох Р." body-medium.
"Карты перейдут в статус 'У продавца' у нового продавца" caption.

**Footer:**
Outline Button "Отмена" + Primary Button "Переназначить".
```

---
---

## PART H — CARD ACTIONS (Bank Admin + Org Admin)

---

### Prompt H-01: Card Block / Deactivate — Confirmation

```
Design a confirmation dialog for blocking/deactivating a card. Accessible from Card Detail page (B-08) or cards table row actions.

Modal (Prompt 0 §18): max-width 480px, centered, overlay.

**Header:** ShieldAlert icon (error-color) + "Заблокировать карту" body-medium. Close X.

**Content:**

Card info (left border 3px error-color, padding 12px):
— "Карта •••• 1002" body-medium mono + Badge Info "Зарегистрирована".
— "Клиент: Дилшод К. | Продавец: Абдуллох Р." small-body.
— "Баланс: 180 000 UZS" small-body.

Select: label "Причина блокировки *", options: "Подозрительная активность", "Запрос клиента", "Утеря / кража", "Ошибка выдачи", "Другое".

Textarea: label "Комментарий", placeholder "Опишите причину блокировки...".

Checkbox: "Уведомить клиента по SMS" (checked by default).

Warning:
"При блокировке:" small-body.
"• Все операции по карте будут приостановлены" small-body.
"• Незавершённые KPI будут заморожены" small-body.
"• Вознаграждения за незавершённые KPI не начисляются" small-body.

**Footer:**
Outline Button "Отмена" + Destructive Button "Заблокировать карту".
```

---

### Prompt H-02: Card Sale Recording — Confirmation (Org Admin inline)

```
Design an inline card sale recording flow. This replaces the need for a separate page — it's a modal triggered from the cards list (C-04) when org admin clicks "Зафиксировать продажу" on a card with status "У продавца".

Modal (Prompt 0 §18): max-width 520px, centered, overlay.

**Header:** ShoppingBag icon (success-color) + "Фиксация продажи" section-heading. Close X.

**Content:**

Card info strip (light blue bg #EFF6FF, padding 12px, border-radius 8px):
"Карта •••• 3041" mono body-medium + Badge Outline "VISA SUM" + "Продавец: Санжар Мирзаев" small-body.

Form fields:
— Input: label "Телефон клиента *", placeholder "+998 __ ___ __ __". Helper: "Номер для привязки и уведомлений".
— Input: label "ФИО клиента", placeholder "Фамилия Имя". Helper: "Опционально — будет отображаться в отчётах".

Divider.

"После фиксации:" small-body muted.
"• Карта перейдёт в статус 'Продана'" small-body.
"• Начнётся отслеживание KPI (срок: 30 дней)" small-body.
"• KPI 1 (Регистрация) будет отслеживаться автоматически" small-body.

**Footer:**
Outline Button "Отмена" + Primary Button "Зафиксировать продажу".

**Success Toast (Prompt 0 §17, success variant):**
"Продажа зафиксирована: карта •••• 3041 → +998 91 555 44 33".
```

---

### Prompt H-03: Bulk Card Assignment

```
Design a bulk card assignment page for assigning multiple cards to multiple sellers at once. Organization Admin.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Breadcrumb:** "Карты" → "Массовое назначение".
"Массовое назначение карт" page-title + "Распределите карты со склада между продавцами" subtitle.

**Available cards summary:**
White card, padding 16px. "На складе доступно: 140 карт" body-medium. Badge Outline "VISA SUM: 120" + Badge Outline "VISA USD: 20".

**Assignment table:**
White card, full-width, card-padding.
Heading: "Распределение" section-heading.

Editable table:
Продавец (select, pre-filled) | Текущие карты (text, read-only) | Назначить (number input, editable) | Итого будет (text, auto-calc)
Санжар Мирзаев | 100 | [Input: 0] | 100
Абдуллох Рахимов | 100 | [Input: 20] | 120
Ислом Тошматов | 80 | [Input: 15] | 95
Нилуфар Каримова | 100 | [Input: 25] | 125
Дарья Нам | 70 | [Input: 10] | 80
Камола Расулова | 50 | [Input: 0] | 50

Number inputs: border focus-ring when edited, min 0. Cells with value > 0 highlighted with light blue bg.

Bottom row: "+ Добавить строку" ghost button (for adding new sellers not yet in table).

**Summary strip (sticky, below table):**
White card, top border 2px primary-blue, padding 16px:
"К назначению: 70 карт из 140 доступных" body-medium + "Останется на складе: 70" small-body.
Progress bar: 70/140 = 50% filled.

**Footer:**
Outline Button "Отмена" + Primary Button "Назначить 70 карт".
```

---
---

## PART I — USER ACTIONS (Bank Admin)

---

### Prompt I-01: Edit User Role — Modal

```
Design a modal for editing a user's role and permissions. Bank Admin.

Modal (Prompt 0 §18): max-width 520px, centered, overlay.

**Header:** "Изменить роль пользователя" section-heading. Close X.

**Content:**

User info strip (padding 12px, bg #F9FAFB, border-radius 8px):
Avatar "РА" (36px) + "Рустам Алиев" body-medium + "+998 90 123 45 67" small-body + current Badge Warning "Менеджер орг.".

Divider.

Select: label "Новая роль *", current value "Менеджер организации", options: "Банк-администратор", "Менеджер организации", "Оператор", "Наблюдатель".

Role description card (changes dynamically based on selection):
Light bg card (#F9FAFB), padding 12px:
— "Менеджер организации" body-medium.
— "Полный доступ к данным своей организации: продавцы, карты, финансы, настройки" small-body.
— "Не может видеть данные других организаций" small-body.

Conditional field (visible when role = "Менеджер организации"):
Select: label "Организация *", value "Mysafar OOO", options: org list.

Warning (if changing from org manager to different org):
"Пользователь потеряет доступ к данным Mysafar OOO" small-body warning-color.

**Footer:**
Outline Button "Отмена" + Primary Button "Сохранить роль".
```

---

### Prompt I-02: Block / Unblock User — Confirmation

```
Design two states of a confirmation dialog for blocking and unblocking a user.

**State A — Block user:**
Modal (Prompt 0 §18, destructive): max-width 480px.
Header: ShieldAlert icon (error-color) + "Заблокировать пользователя".
User card: Avatar "АХ" + "Азиз Хамидов" + "Менеджер орг. — Digital Pay" + Badge Success "Активен".
Select: label "Причина блокировки", options: "Нарушение политики", "Запрос организации", "Подозрительная активность", "Другое".
"При блокировке пользователь немедленно потеряет доступ к платформе." small-body.
Footer: Outline Button "Отмена" + Destructive Button "Заблокировать".

**State B — Unblock user:**
Modal: max-width 480px.
Header: ShieldCheck icon (success-color) + "Разблокировать пользователя".
User card: Avatar "АХ" + "Азиз Хамидов" + "Менеджер орг. — Digital Pay" + Badge Default "Заблокирован".
"Причина блокировки: Запрос организации" small-body muted.
"Дата блокировки: 08.04.2026" caption.
Checkbox: "Отправить уведомление о разблокировке по SMS".
Footer: Outline Button "Отмена" + Primary Button "Разблокировать".

Show both states side by side on canvas.
```

---

### Prompt I-03: Reset User Password — Confirmation

```
Design a confirmation dialog for resetting a user's password. Bank Admin.

Modal (Prompt 0 §18): max-width 440px, centered, overlay.

**Header:** KeyRound icon (primary-blue) + "Сбросить пароль" body-medium. Close X.

**Content:**

User info: Avatar "НТ" + "Нодира Тошева" + "Оператор — Universalbank" body-medium / small-body.

"Текущий пароль будет аннулирован. Новый временный пароль будет отправлен пользователю." body.

Radio Group: "Способ отправки":
— ○ "SMS на +998 91 100 00 03" (default).
— ○ "Email на n.tosheva@ubank.uz".

Checkbox: "Потребовать смену пароля при первом входе" (checked by default).

**Footer:**
Outline Button "Отмена" + Primary Button "Сбросить пароль".
```

---
---

## PART J — WITHDRAWAL ACTIONS (Organization Admin)

---

### Prompt J-01: Approve Withdrawal — Confirmation

```
Design a confirmation dialog for approving a pending withdrawal. Organization Admin or Bank Admin.

Modal (Prompt 0 §18): max-width 480px, centered, overlay.

**Header:** CheckCircle icon (success-color) + "Подтвердить вывод средств" body-medium. Close X.

**Content:**

Transaction card (left border 3px success-color, padding 16px):
Key-value grid:
— "Продавец" | "Санжар Мирзаев"
— "Сумма" | "50 000 UZS" mono body-medium
— "Метод" | "UZCARD"
— "Реквизиты" | "8600 •••• 7788" mono-small
— "Баланс" | "155 000 UZS → 105 000 UZS"
— "Запрошено" | "13.04.2026, 15:30"

"Средства будут переведены на карту продавца через UCOIN." small-body.

**Footer:**
Outline Button "Отмена" + Primary Button "Подтвердить вывод".
```

---

### Prompt J-02: Reject Withdrawal — Confirmation

```
Design a confirmation dialog for rejecting a pending withdrawal.

Modal (Prompt 0 §18, destructive): max-width 480px, centered, overlay.

**Header:** XCircle icon (error-color) + "Отклонить вывод средств" body-medium. Close X.

**Content:**

Transaction card (left border 3px error-color, padding 16px):
— "Продавец: Ислом Тошматов" body-medium.
— "Сумма: 35 000 UZS" mono.
— "Запрошено: 13.04.2026, 11:00" small-body.

Select: label "Причина отклонения *", options: "Недостаточно средств на счёте организации", "Неверные реквизиты", "Подозрительная операция", "Запрос организации", "Другое".

Textarea: label "Комментарий (опционально)", placeholder "Дополнительная информация для продавца...".

Checkbox: "Уведомить продавца о причине отклонения" (checked).

"Средства будут возвращены на баланс кошелька продавца." small-body.

**Footer:**
Outline Button "Отмена" + Destructive Button "Отклонить вывод".
```

---
---

## PART K — REPORTS & PREVIEWS

---

### Prompt K-01: Report Preview — Modal with Table

```
Design a report preview modal that opens when clicking "Предпросмотр" on any report card in B-10.

Modal: max-width 900px (wide), centered, overlay.

**Header:** "Предпросмотр: Отчёт по организациям" section-heading. Close X.

**Subheader row:**
Left: "Период: 01.04.2026 — 13.04.2026" small-body + Badge Default "Предварительный".
Right: Outline Button "Скачать Excel" with Download icon (small size).

**Report table (scrollable, max-height 500px):**
Data Table (Prompt 0 §4):
Columns: # | Организация | Карт выдано | Продано | % продано | KPI 1 | KPI 2 | KPI 3 | Начислено | Выведено | Баланс
1. Mysafar OOO | 500 | 230 | 46% | 185 | 120 | 45 | 1 825 000 | 1 200 000 | 625 000
2. Unired Marketing | 500 | 310 | 62% | 280 | 190 | 78 | 2 740 000 | 2 100 000 | 640 000
3. Express Finance | 400 | 180 | 45% | 150 | 95 | 32 | 1 370 000 | 980 000 | 390 000
4. Digital Pay | 300 | 120 | 40% | 98 | 65 | 22 | 920 000 | 600 000 | 320 000
5. SmartCard Group | 500 | 290 | 58% | 250 | 170 | 68 | 2 440 000 | 1 800 000 | 640 000
6. PayVerse | 350 | 145 | 41% | 118 | 72 | 28 | 1 085 000 | 750 000 | 335 000
7. FinBridge | 200 | 55 | 28% | 42 | 25 | 8 | 395 000 | 280 000 | 115 000
8. CardPlus | 450 | 210 | 47% | 175 | 130 | 52 | 1 790 000 | 1 180 000 | 610 000

Footer row: bold "ИТОГО" with all sums.

All money values in mono. Percentage column with mini progress bars.

**Modal footer:**
"8 организаций, 3 200 карт" caption left.
Right: Outline Button "Закрыть" + Primary Button "Скачать Excel".
```

---

### Prompt K-02: Overdue KPI Report Preview

```
Design a preview page for the "Просроченные KPI" report. This can be a full page since it needs detailed filtering. Bank Admin.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Breadcrumb:** "Отчёты" → "Просроченные KPI".
"Просроченные KPI" page-title + "Карты с истёкшим сроком выполнения KPI" subtitle.

**3× Stat Card:**
1. Error, Clock. "Всего просрочено" — "127 карт".
2. Amber, AlertTriangle. "KPI 1 просрочен" — "23".
3. Rose, XCircle. "KPI 2–3 просрочены" — "104".

**Filter Bar:** Filter Select "Организация" + Filter Select "KPI этап" + Filter Select "Дней просрочки": Все, 1–7 дней, 8–14 дней, 15–30 дней, > 30 дней.

**Data Table:**
Карта (mono) | Организация | Продавец | Клиент | Продана (date) | Срок истёк (date) | Дней просрочки (text, red) | Просроченный KPI (badge-error) | Последний KPI (badge) | Пополнено (mono) | Расход (mono)
...2105 | Unired Mkt | Мухаммад | Фарруx М. | 01.03 | 31.03 | 13 дней | Badge Error "KPI 2" | Badge Success "KPI 1 ✅" | 200 000 | 80 000
...3078 | Express | Бобур | Шахзод Р. | 28.02 | 30.03 | 14 дней | Badge Error "KPI 3" | Badge Success "KPI 2 ✅" | 450 000 | 310 000
(... 8+ rows)

"Дней просрочки" column: red text, sorted descending by default.
Rows clickable → Card Detail page (B-08).

Pagination + Export button top-right.
```

---
---

## PART L — NOTIFICATIONS & UTILITY

---

### Prompt L-01: Notification Center — Dropdown Panel

```
Design a notification dropdown panel that opens from the bell icon in the sidebar or top-right area.

Trigger: Bell icon with red dot badge (unread count "5" inside dot if > 0). Click opens dropdown panel.

**Dropdown panel:** white card, border-radius 12px, shadow-xl, width 400px, max-height 480px, positioned top-right.

**Header row:**
"Уведомления" body-medium + Badge Blue "5 новых". Right: Ghost Button "Прочитать все".

**Tabs (compact):** Все | Непрочитанные

**Notification list (scrollable):**

Each notification row: padding 12px 16px, hover #F9FAFB, border-bottom 1px #E5E7EB.
— Unread: left blue dot indicator (6px), white bg.
— Read: no dot, subtle #F9FAFB bg.

Layout per row: colored icon (20px) + content + timestamp.

5 unread + 5 read notifications:
1. 🟢 Green CheckCircle: "KPI 3 выполнен: карта •••• 4521 (Абдуллох Р.)" body + "10 000 UZS начислено" small-body. "14 мин назад" caption. UNREAD.
2. 🔵 Blue CreditCard: "Новая продажа: карта •••• 3092 → Дилшод К." body. "1 час назад" caption. UNREAD.
3. 🟡 Amber ArrowDown: "Запрос на вывод: Санжар М. — 50 000 UZS" body. "2 часа назад". UNREAD.
4. 🔵 Blue Upload: "Импорт завершён: 498 карт в 'Партия Апрель 2026'" body. "3 часа назад". UNREAD.
5. 🔴 Red AlertTriangle: "KPI просрочен: 3 карты Unired Marketing" body. "5 часов назад". UNREAD.
6. 🟢 Green: "KPI 2 выполнен: карта •••• 2204 (Нилуфар К.)" — "вчера". READ.
7. 🔵 Blue: "5 карт назначены Камола Р." — "вчера". READ.
8. 🟢 Green: "KPI 1 выполнен: карта •••• 1089" — "2 дня назад". READ.
9. 🟡 Amber: "Вывод выполнен: Абдуллох Р. — 120 000 UZS" — "2 дня назад". READ.
10. 🔵 Blue: "Новый продавец: Камола Расулова" — "3 дня назад". READ.

**Footer:**
Ghost Button "Показать все уведомления →" (navigates to full notification page).
```

---

### Prompt L-02: Notification History — Full Page

```
Design a full notification history page. Accessible from "Показать все" in L-01 dropdown. Both Bank and Org admin.

Layout: right of sidebar, page-background, full-width content, page-padding.

**Top Bar:** "Уведомления" page-title + "Все уведомления" subtitle. Right: Outline Button "Прочитать все" + Ghost Button "Настройки уведомлений →".

**Filter Bar:**
— Filter Select "Тип": Все, KPI, Продажи, Финансы, Импорт, Система.
— Filter Select "Статус": Все, Непрочитанные, Прочитанные.
— Date Range Picker.

**Notification list (full-width card):**

Each notification: white card, padding 16px 20px, border-bottom 1px default-border. Hover #F9FAFB.
Layout: colored icon circle (36px, tinted bg) + content block + timestamp right + action-dots.

Unread: left border 3px primary-blue.
Read: no left border.

20 sample notifications grouped by date:

**"Сегодня" date group label (small-body, muted, sticky):**
(Notifications 1–5 from L-01)

**"Вчера" date group label:**
(Notifications 6–7 from L-01 + more)

**"11 апреля" date group label:**
(Older notifications)

Action dots per notification: "Прочитать", "Удалить".

Pagination: "Показано 1–20 из 156".
```

---

### Prompt L-03: Duplicate Card Batch — Confirmation

```
Design a confirmation dialog for duplicating an existing card batch (creates a new batch with same KPI config but empty cards).

Modal (Prompt 0 §18): max-width 480px, centered, overlay.

**Header:** Copy icon (primary-blue) + "Дублировать партию" body-medium. Close X.

**Content:**

Source batch card (bg #F9FAFB, padding 12px, border-radius 8px):
"Партия Апрель 2026 — Mysafar OOO" body-medium.
"VISA SUM | 498 карт | 3 KPI этапа | Срок 30 дней" small-body.

"Будет создана новая партия с:" body.
"• Такой же KPI конфигурацией (3 этапа)" small-body.
"• Без карт (потребуется новый импорт)" small-body.
"• Новое название" small-body.

Input: label "Название новой партии *", placeholder "Партия Май 2026".
Select: label "Организация", value "Mysafar OOO" (pre-filled, editable).

**Footer:**
Outline Button "Отмена" + Primary Button "Создать копию".
```

---

### Prompt L-04: Manual Reward Adjustment — Modal

```
Design a modal for manually adjusting a seller's reward (Bank Admin only — for corrections, bonuses, or deductions).

Modal (Prompt 0 §18): max-width 520px, centered, overlay.

**Header:** "Ручная корректировка вознаграждения" section-heading. Close X.

**Content:**

Select: label "Продавец *", options: seller list with org names — "Санжар Мирзаев (Mysafar OOO)", etc.

Selected seller info (appears after selection):
"Текущий баланс: 155 000 UZS" body-medium + "Всего заработано: 555 000 UZS" small-body.

Divider.

Radio Group: "Тип операции":
— ○ "Начисление" (default) — adds to balance.
— ○ "Списание" — deducts from balance.

Input with suffix: label "Сумма *", placeholder "10 000", suffix "UZS".

Select: label "Причина *", options:
— For начисление: "Бонус за перевыполнение", "Компенсация ошибки", "Промо-акция", "Другое".
— For списание: "Корректировка ошибки", "Штраф", "Возврат начисления", "Другое".

Textarea: label "Комментарий *", placeholder "Опишите причину корректировки...".

Preview card (left border 3px primary-blue for начисление, error-color for списание):
"Санжар Мирзаев" body-medium.
"Баланс: 155 000 → 165 000 UZS (+10 000)" body, amounts in mono.

**Footer:**
Outline Button "Отмена" + Primary Button "Начислить 10 000 UZS" (or Destructive Button "Списать 10 000 UZS" for deduction).
```

---

### Prompt L-05: Export Progress — Toast Sequence

```
Design 3 toast notification states (Prompt 0 §17) for the export flow. These appear sequentially when a user clicks any "Экспорт" or "Скачать Excel" button.

**Toast 1 — Processing (info variant):**
Left border 3px primary-blue. Spinner icon (animated) + "Формирование отчёта..." body-medium + "Отчёт по организациям за 01.04–13.04.2026" small-body. No close button (auto-dismiss after completion).

**Toast 2 — Success (success variant):**
Left border 3px success. CheckCircle icon + "Отчёт готов" body-medium + "report_organizations_2026-04.xlsx (245 KB)" small-body. Ghost Button "Скачать" primary-blue text. Auto-dismiss 8 seconds. Close X available.

**Toast 3 — Error (error variant):**
Left border 3px error. XCircle icon + "Ошибка экспорта" body-medium + "Не удалось сформировать отчёт. Попробуйте снова." small-body. Ghost Button "Повторить" primary-blue. Close X.

Show all 3 toasts stacked vertically on canvas (as they would appear one at a time in sequence, top-right positioned).
```

---

### Prompt L-06: Empty States Collection

```
Design 6 empty state variants (Prompt 0 §16) for different contexts across the platform. Show all on canvas.

**1. No cards found (filtered table):**
Icon: CreditCard (64px, #D1D5DB).
Heading: "Карты не найдены".
Subtext: "Попробуйте изменить параметры фильтрации".
Outline Button "Сбросить фильтры".

**2. No sellers yet (org admin, new org):**
Icon: Users (64px, #D1D5DB).
Heading: "Нет продавцов".
Subtext: "Добавьте первого продавца для начала продаж".
Primary Button "+ Добавить продавца".

**3. Empty card batch (just created, no cards imported):**
Icon: Upload (64px, #D1D5DB).
Heading: "Карты не импортированы".
Subtext: "Импортируйте карты из Excel файла для начала работы с партией".
Primary Button "Импортировать карты" + Ghost Button "Скачать шаблон".

**4. No transactions (finance page, new period):**
Icon: Receipt (64px, #D1D5DB).
Heading: "Нет операций за период".
Subtext: "За выбранный период начислений и выводов не было".
Outline Button "Изменить период".

**5. No notifications:**
Icon: Bell (64px, #D1D5DB).
Heading: "Нет уведомлений".
Subtext: "Здесь будут отображаться уведомления о KPI, продажах и финансах".

**6. Search no results:**
Icon: SearchX (64px, #D1D5DB).
Heading: "Ничего не найдено".
Subtext: "По запросу «дилшод» ничего не найдено. Проверьте написание или измените запрос".
Ghost Button "Очистить поиск".

All 6 variants arranged in 2×3 grid on canvas, each within a card frame showing context.
```

---
---

## SUMMARY

| # | Prompt | Type | Role |
|---|--------|------|------|
| E-01 | Create Organization | Full page form | Bank |
| E-02 | Edit Organization | Full page form | Bank |
| E-03 | Deactivate Organization | Destructive dialog | Bank |
| F-01 | Create Card Batch | Multi-step wizard | Bank |
| F-02 | Card Batch Detail | Full page + tabs | Bank |
| F-03 | Edit Card Batch | Full page form | Bank |
| F-04 | Archive Card Batch | Confirmation dialog | Bank |
| F-05 | Delete Card Batch | Destructive dialog | Bank |
| G-01 | Edit Seller | Form modal | Org |
| G-02 | Deactivate Seller + Reassign | Multi-step dialog | Org |
| G-03 | Card Reassignment | Form modal | Org |
| H-01 | Block / Deactivate Card | Destructive dialog | Both |
| H-02 | Record Card Sale | Form modal | Org |
| H-03 | Bulk Card Assignment | Full page | Org |
| I-01 | Edit User Role | Form modal | Bank |
| I-02 | Block / Unblock User | Confirmation dialog (2 states) | Bank |
| I-03 | Reset User Password | Confirmation dialog | Bank |
| J-01 | Approve Withdrawal | Confirmation dialog | Org/Bank |
| J-02 | Reject Withdrawal | Destructive dialog | Org/Bank |
| K-01 | Report Preview | Wide modal | Bank |
| K-02 | Overdue KPI Report | Full page | Bank |
| L-01 | Notification Dropdown | Dropdown panel | Both |
| L-02 | Notification History | Full page | Both |
| L-03 | Duplicate Card Batch | Confirmation dialog | Bank |
| L-04 | Manual Reward Adjustment | Form modal | Bank |
| L-05 | Export Progress Toasts | Toast sequence (3 states) | Both |
| L-06 | Empty States Collection | Component collection | Both |

**Total: 27 additional prompts**
**Grand total with main library: 24 + 27 = 51 prompts**
