import React, { useState } from 'react';
import {
  X, CreditCard, ShoppingBag, CheckCircle2, Wallet,
  Check, Minus, Search, ChevronDown, ChevronRight,
} from 'lucide-react';
import { OrgAdminSidebar } from '../components/OrgAdminSidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useNavigate } from 'react-router';

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

function BadgeSuccess({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: C.successBg, color: '#15803D',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.success, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function BadgeDefault({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: '#F3F4F6', color: C.text2,
      border: `1px solid ${C.border}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function BadgeWarning({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: C.warningBg, color: '#B45309',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.warning, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function BadgeInfo({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: C.infoBg, color: '#0E7490',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.info, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function BadgeBlue({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: C.blueLt, color: C.blue,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SMALL ATOMS
═══════════════════════════════════════════════════════════════════════════ */

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
      color: C.text4, textTransform: 'uppercase', letterSpacing: '0.07em',
      marginBottom: '12px',
    }}>
      {text}
    </div>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: C.border, margin: '24px 0' }} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPACT STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

const VARIANT_COLORS = {
  blue:   { icon: C.blue,    iconBg: C.blueLt,  border: C.blueTint },
  green:  { icon: '#16A34A', iconBg: '#F0FDF4',  border: '#BBF7D0' },
  violet: { icon: '#7C3AED', iconBg: '#F5F3FF',  border: '#DDD6FE' },
  amber:  { icon: '#D97706', iconBg: '#FFFBEB',  border: '#FDE68A' },
} as const;

function CompactStatCard({ icon: Icon, variant, label, value }: {
  icon: React.ElementType;
  variant: keyof typeof VARIANT_COLORS;
  label: string;
  value: string;
}) {
  const v = VARIANT_COLORS[variant];
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '10px', padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: '10px',
    }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: v.iconBg, border: `1px solid ${v.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={16} color={v.icon} strokeWidth={1.75} />
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text3, marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 700, color: C.text1, lineHeight: 1.2 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI BAR
═══════════════════════════════════════════════════════════════════════════ */

function KpiBar({ label, value, total, color, description }: {
  label: string; value: number; total: number; color: string; description: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>{description}</span>
          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 600, color, minWidth: '42px', textAlign: 'right' }}>
            {pct}%
          </span>
        </div>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: '#F3F4F6', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: '3px',
          background: color, transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI CHECK CELL
═══════════════════════════════════════════════════════════════════════════ */

function KpiCheck({ status, progress, label }: { status: 'done' | 'progress' | 'none'; progress?: number; label?: string }) {
  if (status === 'done') return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: C.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Check size={10} color="#fff" strokeWidth={3} />
      </div>
      {label && <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.text3 }}>{label}</span>}
    </div>
  );
  if (status === 'progress') return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#E5E7EB', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: C.blue, borderRadius: '2px' }} />
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.text3 }}>{progress}%</span>
    </div>
  );
  return <Minus size={13} color="#D1D5DB" />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: СВОДКА
═══════════════════════════════════════════════════════════════════════════ */

function TabSvodka() {
  return (
    <div>
      {/* 2×2 Stat grid */}
      <SectionLabel text="Ключевые показатели" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <CompactStatCard icon={CreditCard}   variant="blue"   label="Карт назначено" value="100" />
        <CompactStatCard icon={ShoppingBag}  variant="green"  label="Продано"        value="62 (62%)" />
        <CompactStatCard icon={CheckCircle2} variant="violet" label="KPI 3 завершено" value="15" />
        <CompactStatCard icon={Wallet}       variant="amber"  label="Заработано"     value="555 000 UZS" />
      </div>

      <Divider />

      {/* KPI breakdown bars */}
      <SectionLabel text="KPI прогресс" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <KpiBar label="KPI 1 — Регистрация"  value={55} total={62} color="#2563EB" description="55 из 62 продано" />
        <KpiBar label="KPI 2 — Пополнение"   value={41} total={62} color="#7C3AED" description="41 из 62" />
        <KpiBar label="KPI 3 — Оплата 500K"  value={15} total={62} color="#10B981" description="15 из 62" />
      </div>

      <Divider />

      {/* Earnings breakdown */}
      <SectionLabel text="Расчёт заработка" />
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '10px', padding: '16px 20px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <EarningsRow label="KPI 1 × 55" value="275 000 UZS" />
          <EarningsRow label="KPI 2 × 41" value="205 000 UZS" />
          <EarningsRow label="KPI 3 × 15" value="150 000 UZS" />

          <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: C.text1 }}>
              Итого
            </span>
            <span style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: C.text1 }}>
              555 000 UZS
            </span>
          </div>

          <div style={{ height: '1px', background: C.border, margin: '2px 0' }} />

          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Выведено:</span>
              <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: C.text2 }}>400 000</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Баланс:</span>
              <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: C.blue }}>155 000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EarningsRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>{label}</span>
      <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: КАРТЫ
═══════════════════════════════════════════════════════════════════════════ */

interface CardRow {
  num: string;
  client: string;
  soldDate: string;
  k1: 'done' | 'none';
  k2: 'done' | 'none';
  k3: { status: 'done' | 'progress' | 'none'; progress?: number; label?: string };
  topup: string;
  spent: string;
}

const SELLER_CARDS: CardRow[] = [
  { num: '...2001', client: 'Камол Т.',   soldDate: '02.04', k1: 'done', k2: 'done', k3: { status: 'done', label: '620K' },           topup: '1 200 000', spent: '680 000' },
  { num: '...2002', client: 'Шахзод Р.',  soldDate: '03.04', k1: 'done', k2: 'done', k3: { status: 'progress', progress: 82 },        topup: '700 000',   spent: '410 000' },
  { num: '...2003', client: 'Фарход М.',  soldDate: '04.04', k1: 'done', k2: 'none', k3: { status: 'none' },                          topup: '50 000',    spent: '—' },
  { num: '...2004', client: '—',          soldDate: '—',     k1: 'none', k2: 'none', k3: { status: 'none' },                          topup: '—',         spent: '—' },
];

const CARD_STATUSES = ['Активна', 'Зарег.', 'У продавца', 'Продана'];

function TabCards() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <Search size={15} color={searchFocused ? C.blue : C.text4} style={{
            position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Поиск по карте или клиенту..."
            style={{
              width: '100%', height: '36px', paddingLeft: '34px', paddingRight: '10px',
              border: `1px solid ${searchFocused ? C.blue : C.inputBorder}`,
              borderRadius: '8px', background: C.surface,
              fontFamily: F.inter, fontSize: '13px', color: C.text1,
              outline: 'none', boxSizing: 'border-box',
              boxShadow: searchFocused ? `0 0 0 3px ${C.blueTint}` : 'none',
              transition: 'all 0.12s',
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              height: '36px', padding: '0 32px 0 10px',
              border: `1px solid ${C.inputBorder}`, borderRadius: '8px',
              background: C.surface, fontFamily: F.inter, fontSize: '13px',
              color: C.text2, outline: 'none', appearance: 'none', cursor: 'pointer',
              minWidth: '140px',
            }}
          >
            <option value="">Статус: Все</option>
            {CARD_STATUSES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown size={13} color={C.text4} style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFBFC', borderBottom: `1px solid ${C.border}` }}>
              {['Карта', 'Клиент', 'Продано', 'KPI 1', 'KPI 2', 'KPI 3', 'Пополнено', 'Расход'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: 'left',
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: C.text4,
                  textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SELLER_CARDS.map((card, i) => {
              const hov = hovRow === i;
              return (
                <tr key={card.num}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: i < SELLER_CARDS.length - 1 ? `1px solid ${C.border}` : 'none',
                    background: hov ? '#FAFBFC' : C.surface,
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}
                >
                  <td style={tdStyle}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text1 }}>{card.num}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{card.client}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>{card.soldDate}</span>
                  </td>
                  <td style={tdStyle}>
                    <KpiCheck status={card.k1} />
                  </td>
                  <td style={tdStyle}>
                    <KpiCheck status={card.k2} />
                  </td>
                  <td style={tdStyle}>
                    <KpiCheck status={card.k3.status} progress={card.k3.progress} label={card.k3.label} />
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{card.topup}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{card.spent}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tdStyle: React.CSSProperties = {
  padding: '11px 14px',
  whiteSpace: 'nowrap',
};

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: ФИНАНСЫ
═══════════════════════════════════════════════════════════════════════════ */

interface TxRow {
  date: string;
  type: 'kpi' | 'withdrawal';
  card: string;
  kpiLabel: string;
  amount: string;
  positive: boolean;
  status: 'credited' | 'withdrawn';
}

const TRANSACTIONS: TxRow[] = [
  { date: '13.04', type: 'kpi',        card: '...4521', kpiLabel: 'KPI 3', amount: '+10 000',  positive: true,  status: 'credited' },
  { date: '13.04', type: 'withdrawal', card: '—',       kpiLabel: '—',     amount: '-120 000', positive: false, status: 'withdrawn' },
  { date: '12.04', type: 'kpi',        card: '...3892', kpiLabel: 'KPI 2', amount: '+5 000',   positive: true,  status: 'credited' },
  { date: '10.04', type: 'kpi',        card: '...2003', kpiLabel: 'KPI 1', amount: '+5 000',   positive: true,  status: 'credited' },
];

function TabFinance() {
  const [hovRow, setHovRow] = useState<number | null>(null);

  return (
    <div>
      {/* Balance display */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', padding: '20px 24px', marginBottom: '24px',
      }}>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginBottom: '6px' }}>
          Баланс UCOIN кошелька
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '28px', fontWeight: 700, color: C.text1, lineHeight: 1.2 }}>
          155 000 <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text3 }}>UZS</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
          <div>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Всего заработано: </span>
            <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: C.text1 }}>555 000</span>
          </div>
          <div>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Выведено: </span>
            <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: C.text1 }}>400 000</span>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <SectionLabel text="История операций" />
      <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFBFC', borderBottom: `1px solid ${C.border}` }}>
              {['Дата', 'Тип', 'Карта', 'KPI', 'Сумма', 'Статус'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: 'left',
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: C.text4,
                  textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((tx, i) => {
              const hov = hovRow === i;
              return (
                <tr key={i}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: i < TRANSACTIONS.length - 1 ? `1px solid ${C.border}` : 'none',
                    background: hov ? '#FAFBFC' : C.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={tdStyleFin}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>{tx.date}</span>
                  </td>
                  <td style={tdStyleFin}>
                    {tx.type === 'kpi'
                      ? <BadgeDefault>KPI</BadgeDefault>
                      : <BadgeWarning>Вывод</BadgeWarning>
                    }
                  </td>
                  <td style={tdStyleFin}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{tx.card}</span>
                  </td>
                  <td style={tdStyleFin}>
                    {tx.kpiLabel !== '—'
                      ? <BadgeBlue>{tx.kpiLabel}</BadgeBlue>
                      : <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text4 }}>—</span>
                    }
                  </td>
                  <td style={tdStyleFin}>
                    <span style={{
                      fontFamily: F.mono, fontSize: '13px', fontWeight: 600,
                      color: tx.positive ? '#15803D' : '#DC2626',
                    }}>
                      {tx.amount}
                    </span>
                  </td>
                  <td style={tdStyleFin}>
                    {tx.status === 'credited'
                      ? <BadgeSuccess>Начислено</BadgeSuccess>
                      : <BadgeInfo>Выведено</BadgeInfo>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tdStyleFin: React.CSSProperties = {
  padding: '12px 14px',
  whiteSpace: 'nowrap',
};

/* ═══════════════════════════════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════════════════════════════ */

type TabId = 'summary' | 'cards' | 'finance';

const TABS: { id: TabId; label: string }[] = [
  { id: 'summary', label: 'Сводка' },
  { id: 'cards',   label: 'Карты' },
  { id: 'finance', label: 'Финансы' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function SellerDetailPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [closeHov, setCloseHov] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <OrgAdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/org-dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/sellers')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Продавцы</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Санжар Мирзаев</span>
          </div>

          {/* Header card */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            marginBottom: '24px',
          }}>
            {/* Title row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: `1px solid ${C.border}`,
            }}>
              <div>
                <h1 style={{
                  fontFamily: F.dm, fontSize: '22px', fontWeight: 700,
                  color: C.text1, margin: '0 0 8px', lineHeight: 1.2,
                }}>
                  Санжар Мирзаев
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text3 }}>
                    +998 91 111 22 33
                  </span>
                  <BadgeSuccess>Активен</BadgeSuccess>
                  <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4 }}>
                    UCOIN: <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text3 }}>UCN-0091</span>
                  </span>
                </div>
              </div>
              <button
                onMouseEnter={() => setCloseHov(true)}
                onMouseLeave={() => setCloseHov(false)}
                onClick={() => window.history.back()}
                style={{
                  width: '36px', height: '36px',
                  border: `1px solid ${closeHov ? '#D1D5DB' : C.border}`,
                  borderRadius: '8px',
                  background: closeHov ? '#F9FAFB' : C.surface,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
                }}
              >
                <X size={16} color={C.text3} strokeWidth={1.75} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex', gap: '0', padding: '0 24px',
            }}>
              {TABS.map(tab => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '12px 20px',
                      border: 'none',
                      borderBottom: active ? `2px solid ${C.blue}` : '2px solid transparent',
                      background: 'none',
                      fontFamily: F.inter,
                      fontSize: '14px',
                      fontWeight: active ? 500 : 400,
                      color: active ? C.blue : C.text3,
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          <div>
            {activeTab === 'summary' && <TabSvodka />}
            {activeTab === 'cards' && <TabCards />}
            {activeTab === 'finance' && <TabFinance />}
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}
