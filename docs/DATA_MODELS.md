# Data Models

This project has **no backend**. Every "table" is a TypeScript array seeded at the top of its page file. This document catalogues the interfaces that play the backend role, so pages consuming the same shape can stay in sync.

If you add a new page and it invents yet another card/seller/user shape, check here first — you probably want to reuse one of these.

---

## Cards

### `CardRow` — registry row
Defined in both [AllCardsPage.tsx](../src/app/pages/AllCardsPage.tsx) and [OrgCardsPage.tsx](../src/app/pages/OrgCardsPage.tsx) with identical shape.

```ts
type CardStatus = 'Активна' | 'Зарег.' | 'У продавца' | 'На складе' | 'Продана';

interface CardRow {
  id: number;
  cardNumber: string;      // '8600 1234 5678 1001'
  type: string;            // 'VISA SUM' | 'VISA USD'
  organization: string;
  seller: string;
  client: string;
  status: CardStatus;
  kpi1: boolean | null;
  kpi2: boolean | null;
  kpi3: number | boolean | null; // number = progress %, boolean = done, null = not started
  topup: string;           // space-thousand string: '800 000'
  spent: string;
}
```

### `BatchCardRow` — cards inside a single batch
Defined in [CardBatchDetailPage.tsx](../src/app/pages/CardBatchDetailPage.tsx).

```ts
interface BatchCardRow {
  id: number; cardNumber: string; status: CardStatus;
  seller: string; client: string;
  kpi1: boolean | null; kpi2: boolean | null; kpi3: number | boolean | null;
  topup: string;
}
```

### `BatchCard` + `KpiConfig` — batch registry
Defined in [CardBatchesPage.tsx](../src/app/pages/CardBatchesPage.tsx).

```ts
type BatchStatus = 'Активна' | 'На паузе' | 'Завершена' | 'Черновик';
// EditCardBatchPage also uses 'Архивирована' (archived) in its own union.

interface KpiConfig { label: string; reward: string; }

interface BatchCard {
  id: number;
  title: string;
  org: string;
  totalCards: number;
  sold: number;
  kpiDone: number;
  rewarded: string;
  status: BatchStatus;
  created: string;          // '01.04.2026'
  kpiDays: number;
  kpi: [KpiConfig, KpiConfig, KpiConfig];
}
```

### `KPIStepData` — per-card KPI timeline
Defined in [CardDetailPage.tsx](../src/app/pages/CardDetailPage.tsx). Represents the 3 stages shown in KPI Stepper Variant B.

### `CardItem` — assignable card inventory
Defined in [CardAssignmentPage.tsx](../src/app/pages/CardAssignmentPage.tsx).

```ts
interface CardItem { id: number; number: string; type: string; }
```

---

## People

### `UserRow` — platform user (Bank Admin view)
Defined in [UsersManagementPage.tsx](../src/app/pages/UsersManagementPage.tsx).

```ts
type UserRole = 'Банк-админ' | 'Менеджер орг.' | 'Оператор' | 'Наблюдатель';
type UserStatus = 'Активен' | 'Заблокирован' | 'Ожидает';

interface UserRow {
  id: number; initials: string; name: string;
  phone: string; email: string;
  role: UserRole; organization: string;
  lastLogin: string;            // '13.04 09:12'
  status: UserStatus;
}
```

### `SellerRow` — seller inside an organization
Defined in [SellersManagementPage.tsx](../src/app/pages/SellersManagementPage.tsx).

```ts
interface SellerRow {
  id: number; name: string; phone: string;
  assigned: number; sold: number; percentSold: number;
  kpi1: number; kpi2: number; kpi3: number;
  earned: string; withdrawn: string; balance: string;
  status: 'Активен' | 'Неактивен';
}
```

### `SellerOption` — lightweight seller lookup
Defined twice with different shapes. If you need to show a seller picker, pick whichever of these matches the context better instead of inventing a third.

- **[CardAssignmentPage.tsx](../src/app/pages/CardAssignmentPage.tsx)** — `{ id, name, assigned, sold, onHand }` (focus: card inventory)
- **[RewardsFinancePage.tsx](../src/app/pages/RewardsFinancePage.tsx)** — `{ id, name, org, balance, ... }` (focus: UCOIN balance for manual adjustment)

### `OrgRow` — organization directory
Defined in [OrganizationsPage.tsx](../src/app/pages/OrganizationsPage.tsx).

```ts
type StatusKey = 'Активна' | 'На паузе' | 'Неактивна';

interface OrgRow {
  id: number; name: string; inn: string;
  cardsIssued: number; cardsSold: number;
  sellers: number; status: StatusKey; /* … */
}
```

---

## Finance

### `WdRow` — withdrawal request row
Defined in [OrgWithdrawalsPage.tsx](../src/app/pages/OrgWithdrawalsPage.tsx).

```ts
type WdStatus = 'Выполнен' | 'В обработке' | 'Отклонён';

interface WdRow {
  id: number; date: string; seller: string;
  amount: string; method: string; details: string;
  ucoinTx: string;          // 'UCN-8832'
  status: WdStatus;
}
```

The approve modal reads from sibling lookup tables in the same file — `SELLER_FULL_NAMES` and `SELLER_BALANCES` — for the balance-before → balance-after math.

### `TxRow` — generic transaction row
Defined in both [OrgFinancePage.tsx](../src/app/pages/OrgFinancePage.tsx) and [SellerDetailPage.tsx](../src/app/pages/SellerDetailPage.tsx) with the same shape.

### `Transaction` — bank-admin rewards log
Defined in [RewardsFinancePage.tsx](../src/app/pages/RewardsFinancePage.tsx). Feeds the transaction log beside the donut chart. Manual adjustments append rows with `source: 'adjustment-credit' | 'adjustment-debit'`.

---

## Cross-cutting

### `Notif` — notification record
Defined in [NotificationsHistoryPage.tsx](../src/app/pages/NotificationsHistoryPage.tsx). The same `SEED` pattern is duplicated in [Navbar.tsx](../src/app/components/Navbar.tsx) for the bell-dropdown preview (first ~10 entries).

```ts
type NotifType = 'KPI' | 'Продажи' | 'Финансы' | 'Импорт' | 'Система';
type NotifIconColor = 'green' | 'blue' | 'amber' | 'red';

interface Notif {
  id: number;
  icon: React.ElementType;
  color: NotifIconColor;
  type: NotifType;
  title: string;
  sub?: string;              // optional secondary line (e.g. "10 000 UZS начислено")
  time: string;              // '14:30'
  group: 'Сегодня' | 'Вчера' | '11 апреля' | '10 апреля';
  unread: boolean;
}
```

### Notification rules — `Rule`
Defined and **exported** from [NotificationRulesPage.tsx](../src/app/pages/NotificationRulesPage.tsx). Consumed by [NotificationRuleEditorPage.tsx](../src/app/pages/NotificationRuleEditorPage.tsx), which imports `Rule` + `INITIAL_RULES` to hydrate the form from `location.state.preFilled` or from the id param.

```ts
type RuleTab = 'kpi' | 'finance' | 'cards' | 'system';
type IconTone = 'green' | 'amber' | 'red' | 'blue' | 'gray';
type Channel = 'Push' | 'In-app' | 'Email' | 'SMS';

interface Rule {
  id: string;
  tab: RuleTab;
  icon: React.ElementType;
  iconTone: IconTone;
  title: string;
  description: string;
  channels: Channel[];
  recipients: string[];
  timing?: string;
  configLabel?: string;
  enabled: boolean;
}
```

Companion `FormState` now lives in [NotificationRuleEditorPage.tsx](../src/app/pages/NotificationRuleEditorPage.tsx) (the editor moved from a modal into a standalone page). Keep `ruleToForm(Rule) → FormState` in sync if either shape changes.

### Notification delivery log — `LogRow`
Defined in [NotificationDeliveryLogPage.tsx](../src/app/pages/NotificationDeliveryLogPage.tsx).

```ts
type EventType = 'KPI' | 'Финансы' | 'Карты' | 'Система' | 'Объявление';
type Channel = 'In-app' | 'Push' | 'Email' | 'SMS';
type Delivery = 'delivered' | 'queued' | 'error';

interface LogRow {
  id: number;
  date: string;              // '13.04 14:32'
  type: EventType;
  event: string;
  recipient: string;
  initials: string;
  channel: Channel;
  status: Delivery;
  readAt: string | null;     // 'HH:MM' or null
  error?: string;            // present when status === 'error'
}
```

Error rows render with a 3px `C.error` left inset and are clickable to expand an inline detail row with the `error` string.

### Announcements — history + detail

**`AnnouncementRow`** — [AnnouncementHistoryPage.tsx](../src/app/pages/AnnouncementHistoryPage.tsx).

```ts
type Status = 'sent' | 'scheduled' | 'draft';
type Channel = 'In-app' | 'Email' | 'SMS';

interface AnnouncementRow {
  id: number;
  date: string | null;
  title: string;
  recipientsLabel: string;
  channels: Channel[];
  delivered: [number, number] | null;
  read:      [number, number] | null;
  status: Status;
}
```

**`AnnouncementDetail` + `DeliveryRow`** — [AnnouncementDetailPage.tsx](../src/app/pages/AnnouncementDetailPage.tsx).

```ts
interface DeliveryRow {
  id: number; initials: string; name: string; org: string;
  channels: Channel[];
  deliveredAt: string | null;  // 'DD.MM HH:MM' or null
  readAt: string | null;
}

interface AnnouncementDetail {
  id: number; title: string; body: string;
  sentAt: string; from: string;
  recipientsLabel: string; channels: Channel[];
  stats: {
    sent:      [number, number];
    delivered: [number, number];
    read:      [number, number];
  };
  rows: DeliveryRow[];
}
```

`AnnouncementComposePage.tsx` has its own `FormState` shape for the composer; it does not round-trip through `AnnouncementRow` — composing a new announcement does not currently append to the history seed array.

### Seller messages — history + detail

**`MessageRow`** — [SellerMessageHistoryPage.tsx](../src/app/pages/SellerMessageHistoryPage.tsx).

```ts
type Channel = 'In-app' | 'Push';

interface MessageRow {
  id: number; date: string; title: string;
  recipientsLabel: string;
  channels: Channel[];
  delivered: [number, number];
  read:      [number, number];
}
```

**`MessageDetail` + `DeliveryRow`** — [SellerMessageDetailPage.tsx](../src/app/pages/SellerMessageDetailPage.tsx). Same shape as the announcement detail but without `org` on each recipient and with the narrower `Channel = 'In-app' | 'Push'` union.

**`SellerOption` (compose variant)** — [SellerMessageComposePage.tsx](../src/app/pages/SellerMessageComposePage.tsx): `{ id: number; name: string; cardsSold: number }`. Distinct from the `SellerOption` used by `CardAssignmentPage` and `RewardsFinancePage` — see the earlier "People" section.

`Template` in the same file is the shape for the Quick Templates panel: `{ id, emoji, title, body }`.

### `OverdueRow` — overdue KPI report
Defined in [OverdueKpiReportPage.tsx](../src/app/pages/OverdueKpiReportPage.tsx).

```ts
interface OverdueRow {
  id: number; last4: string; org: string; seller: string; client: string;
  soldDate: string; dueDate: string; overdueDays: number;
  overdueKpi: 'KPI 1' | 'KPI 2' | 'KPI 3';
  lastKpi: string;            // 'KPI 1 ✅' | '—'
  topup: string; spent: string;
}
```

### `PreviewRow` — report-preview row
Defined in [ReportPreviewPage.tsx](../src/app/pages/ReportPreviewPage.tsx). Numeric counts (not strings) so the sticky ИТОГО row can `reduce` them.

```ts
interface PreviewRow {
  org: string;
  issued: number; sold: number; pct: number;
  k1: number; k2: number; k3: number;
  credited: number; withdrawn: number; balance: number;
}
```

---

## Formatting helpers (convention, not shared module)

- `fmtUzs(n: number)` — mask a number as `1 234 567`. Redefined ad-hoc at the top of each finance page. If you add a third copy, consider hoisting it to [ds/tokens.ts](../src/app/components/ds/tokens.ts).
- Monetary **inputs** must strip digits, parse, and re-apply `fmtUzs` on every keystroke. See the lesson in [tasks/lessons.md](../tasks/lessons.md).
- Monetary **display** uses `F.mono` ('JetBrains Mono').
