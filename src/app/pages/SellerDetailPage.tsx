import React, { useState } from 'react';
import {
  X, CreditCard, ShoppingBag, CheckCircle2, Wallet,
  Check, Minus, Search, ChevronDown, ChevronRight,
  Pencil, Lock, AlertTriangle, Info, ArrowDown, ArrowRightLeft,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
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
  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignHov, setReassignHov] = useState(false);

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

        <button
          onMouseEnter={() => setReassignHov(true)}
          onMouseLeave={() => setReassignHov(false)}
          onClick={() => setReassignOpen(true)}
          style={{
            height: '36px', padding: '0 14px',
            border: `1px solid ${reassignHov ? C.blue : C.border}`,
            borderRadius: '8px',
            background: reassignHov ? C.blueLt : C.surface,
            fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
            color: reassignHov ? C.blue : C.text1,
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            cursor: 'pointer', transition: 'all 0.12s',
            marginLeft: 'auto',
          }}
        >
          <ArrowRightLeft size={14} strokeWidth={1.75} />
          Переназначить карты
        </button>
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

      <ReassignCardsModal
        open={reassignOpen}
        onClose={() => setReassignOpen(false)}
        onConfirm={() => setReassignOpen(false)}
      />
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

/* ═══════════════════════════════════════════════════════════════════════════
   DEACTIVATE SELLER MODAL
═══════════════════════════════════════════════════════════════════════════ */

const OTHER_SELLERS = [
  'Абдуллох Рахимов (100 карт)',
  'Ислом Тошматов (80 карт)',
  'Нилуфар Каримова (100 карт)',
  'Камола Расулова (100 карт)',
];

function DeactivateSellerModal({ open, onClose, onConfirm }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
}) {
  const [mode, setMode] = useState<'warehouse' | 'transfer'>('warehouse');
  const [targetSeller, setTargetSeller] = useState('');
  const [targetFocus, setTargetFocus] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  React.useEffect(() => {
    if (!open) { setMode('warehouse'); setTargetSeller(''); return; }
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const canConfirm = mode === 'warehouse' || (mode === 'transfer' && !!targetSeller);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '560px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <AlertTriangle size={22} color={C.warning} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Деактивировать продавца
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            style={{
              width: '28px', height: '28px',
              border: 'none', borderRadius: '7px',
              background: closeHov ? '#F3F4F6' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '18px',
        }}>
          {/* Step 1: Confirmation text */}
          <p style={{
            margin: 0, fontFamily: F.inter, fontSize: '14px',
            color: C.text1, lineHeight: 1.5,
          }}>
            Вы уверены, что хотите деактивировать этого продавца?
          </p>

          {/* Seller info card */}
          <div style={{
            background: '#FFFBEB',
            borderTop: `1px solid #FDE68A`,
            borderRight: `1px solid #FDE68A`,
            borderBottom: `1px solid #FDE68A`,
            borderLeft: `3px solid ${C.warning}`,
            borderRadius: '8px', padding: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: C.blueLt, border: `1px solid ${C.blueTint}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: C.blue,
                flexShrink: 0,
              }}>
                СМ
              </div>
              <span style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: C.text1,
              }}>
                Санжар Мирзаев
              </span>
              <BadgeSuccess>Активен</BadgeSuccess>
            </div>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: C.text2,
              marginBottom: '4px', lineHeight: 1.5,
            }}>
              Карт назначено: <span style={{ fontFamily: F.mono, color: C.text1, fontWeight: 500 }}>100</span>
              {' | '}
              Продано: <span style={{ fontFamily: F.mono, color: C.text1, fontWeight: 500 }}>62</span>
              {' | '}
              На руках: <span style={{ fontFamily: F.mono, color: C.text1, fontWeight: 500 }}>38</span>
            </div>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: C.text2, lineHeight: 1.5,
            }}>
              Заработано: <span style={{ fontFamily: F.mono, color: C.text1, fontWeight: 500 }}>555 000 UZS</span>
              {' | '}
              Баланс: <span style={{ fontFamily: F.mono, color: C.text1, fontWeight: 500 }}>155 000 UZS</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: C.border }} />

          {/* Step 2: Card reassignment */}
          <div>
            <div style={{
              fontFamily: F.dm, fontSize: '14px', fontWeight: 700,
              color: C.text1, marginBottom: '12px',
            }}>
              Что делать с 38 нераспроданными картами?
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <RadioOption
                selected={mode === 'warehouse'}
                onClick={() => setMode('warehouse')}
                title="Вернуть на склад организации"
                caption="Карты получат статус «На складе»"
              />
              <RadioOption
                selected={mode === 'transfer'}
                onClick={() => setMode('transfer')}
                title="Передать другому продавцу"
              />

              {mode === 'transfer' && (
                <div style={{ marginLeft: '30px', marginTop: '-2px' }}>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={targetSeller}
                      onChange={e => setTargetSeller(e.target.value)}
                      onFocus={() => setTargetFocus(true)}
                      onBlur={() => setTargetFocus(false)}
                      style={{
                        width: '100%', height: '40px', padding: '0 36px 0 12px',
                        border: `1px solid ${targetFocus ? C.blue : C.inputBorder}`,
                        borderRadius: '8px', background: C.surface,
                        fontFamily: F.inter, fontSize: '13px',
                        color: targetSeller ? C.text1 : C.text4,
                        outline: 'none', appearance: 'none', cursor: 'pointer',
                        boxShadow: targetFocus ? `0 0 0 3px ${C.blueTint}` : 'none',
                        transition: 'border-color 0.12s, box-shadow 0.12s',
                      }}
                    >
                      <option value="">Выберите продавца</option>
                      {OTHER_SELLERS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} color={C.text3} style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)', pointerEvents: 'none',
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: C.border }} />

          {/* Wallet balance section */}
          <div>
            <div style={{
              fontFamily: F.dm, fontSize: '14px', fontWeight: 700,
              color: C.text1, marginBottom: '4px',
            }}>
              Баланс кошелька: <span style={{ fontFamily: F.mono, color: C.blue }}>155 000 UZS</span>
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4, lineHeight: 1.4 }}>
              Продавец сможет вывести остаток средств после деактивации
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${C.border}`, borderRadius: '8px',
              background: cancelHov ? '#F9FAFB' : C.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text1, cursor: 'pointer',
              transition: 'background 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            onMouseEnter={() => setConfirmHov(true)}
            onMouseLeave={() => setConfirmHov(false)}
            onClick={() => { if (canConfirm) onConfirm(); }}
            disabled={!canConfirm}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${!canConfirm ? '#FECACA' : confirmHov ? '#DC2626' : C.error}`,
              borderRadius: '8px',
              background: !canConfirm ? '#FFFFFF' : confirmHov ? C.errorBg : C.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: !canConfirm ? '#FCA5A5' : confirmHov ? '#B91C1C' : C.error,
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              transition: 'all 0.12s',
            }}
          >
            <AlertTriangle size={14} strokeWidth={1.75} />
            Деактивировать продавца
          </button>
        </div>
      </div>
    </div>
  );
}

function RadioOption({ selected, onClick, title, caption }: {
  selected: boolean; onClick: () => void; title: string; caption?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        padding: '10px 12px',
        border: `1px solid ${selected ? C.blue : hov ? C.inputBorder : C.border}`,
        borderRadius: '8px',
        background: selected ? C.blueLt : hov ? '#F9FAFB' : C.surface,
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        border: `2px solid ${selected ? C.blue : '#D1D5DB'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: '1px', flexShrink: 0,
        transition: 'border-color 0.12s',
      }}>
        {selected && (
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.blue }} />
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
          color: C.text1, lineHeight: 1.3,
        }}>
          {title}
        </div>
        {caption && (
          <div style={{
            fontFamily: F.inter, fontSize: '11px', color: C.text4,
            marginTop: '3px', lineHeight: 1.4,
          }}>
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REASSIGN CARDS MODAL
═══════════════════════════════════════════════════════════════════════════ */

const REASSIGN_TARGETS: { name: string; onHand: number }[] = [
  { name: 'Абдуллох Рахимов', onHand: 55 },
  { name: 'Ислом Тошматов',   onHand: 34 },
  { name: 'Нилуфар Каримова', onHand: 67 },
  { name: 'Камола Расулова',  onHand: 50 },
];

const UNSOLD_CARDS: { num: string; type: string }[] = [
  { num: '...3041', type: 'VISA SUM' },
  { num: '...3042', type: 'VISA SUM' },
  { num: '...3043', type: 'VISA USD' },
  { num: '...3044', type: 'VISA SUM' },
  { num: '...3045', type: 'VISA SUM' },
  { num: '...3046', type: 'VISA USD' },
  { num: '...3047', type: 'VISA SUM' },
  { num: '...3048', type: 'VISA SUM' },
  { num: '...3049', type: 'VISA SUM' },
  { num: '...3050', type: 'VISA SUM' },
  { num: '...3051', type: 'VISA SUM' },
  { num: '...3052', type: 'VISA SUM' },
];

const TOTAL_ON_HAND = 38;

function ReassignCardsModal({ open, onClose, onConfirm }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
}) {
  const [target, setTarget] = useState('');
  const [targetFocus, setTargetFocus] = useState(false);
  const [count, setCount] = useState(10);
  const [specific, setSpecific] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [maxHov, setMaxHov] = useState(false);
  const [countFocus, setCountFocus] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  React.useEffect(() => {
    if (!open) {
      setTarget('');
      setCount(10);
      setSpecific(false);
      setSelectedCards(new Set());
      return;
    }
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const targetInfo = REASSIGN_TARGETS.find(t => t.name === target);
  const effectiveCount = specific ? selectedCards.size : count;
  const canConfirm = !!target && effectiveCount > 0;

  const toggleCard = (num: string) => {
    setSelectedCards(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '560px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: F.dm, fontSize: '17px', fontWeight: 700, color: C.text1,
          }}>
            Переназначить карты
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            style={{
              width: '28px', height: '28px',
              border: 'none', borderRadius: '7px',
              background: closeHov ? '#F3F4F6' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          {/* From */}
          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
              color: C.text4, textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: '8px',
            }}>
              Откуда
            </div>
            <SellerRow name="Санжар Мирзаев" meta={`На руках: ${TOTAL_ON_HAND} карт`} />
          </div>

          {/* Arrow down */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowDown size={22} color={C.text4} strokeWidth={1.75} />
          </div>

          {/* To */}
          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
              color: C.text4, textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: '8px',
            }}>
              Кому
            </div>
            <div style={{ position: 'relative' }}>
              <select
                value={target}
                onChange={e => setTarget(e.target.value)}
                onFocus={() => setTargetFocus(true)}
                onBlur={() => setTargetFocus(false)}
                style={{
                  width: '100%', height: '40px', padding: '0 36px 0 12px',
                  border: `1px solid ${targetFocus ? C.blue : C.inputBorder}`,
                  borderRadius: '8px', background: C.surface,
                  fontFamily: F.inter, fontSize: '13px',
                  color: target ? C.text1 : C.text4,
                  outline: 'none', appearance: 'none', cursor: 'pointer',
                  boxShadow: targetFocus ? `0 0 0 3px ${C.blueTint}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              >
                <option value="">Выберите продавца</option>
                {REASSIGN_TARGETS.map(s => (
                  <option key={s.name} value={s.name}>{s.name} ({s.onHand} карт)</option>
                ))}
              </select>
              <ChevronDown size={14} color={C.text3} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
            </div>

            {targetInfo && (
              <div style={{ marginTop: '10px' }}>
                <SellerRow
                  name={targetInfo.name}
                  meta={`На руках: ${targetInfo.onHand} карт → будет ${targetInfo.onHand} + ${effectiveCount} = ${targetInfo.onHand + effectiveCount}`}
                />
              </div>
            )}
          </div>

          <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />

          {/* Card selection */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Количество карт для переназначения
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => setCount(c => Math.max(1, c - 1))}
                  disabled={specific || count <= 1}
                  aria-label="Уменьшить"
                  style={{
                    width: '36px', height: '40px',
                    border: `1px solid ${C.inputBorder}`, borderRight: 'none',
                    borderRadius: '8px 0 0 8px',
                    background: (specific || count <= 1) ? '#F9FAFB' : C.surface,
                    fontFamily: F.inter, fontSize: '16px',
                    color: (specific || count <= 1) ? C.textDisabled : C.text2,
                    cursor: (specific || count <= 1) ? 'not-allowed' : 'pointer',
                    opacity: specific ? 0.5 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'color 0.12s, background 0.12s',
                  }}
                >−</button>
                <input
                  type="number" value={count}
                  onChange={e => {
                    const v = parseInt(e.target.value) || 1;
                    setCount(Math.min(TOTAL_ON_HAND, Math.max(1, v)));
                  }}
                  onFocus={() => setCountFocus(true)}
                  onBlur={() => setCountFocus(false)}
                  min={1} max={TOTAL_ON_HAND}
                  disabled={specific}
                  style={{
                    width: '80px', height: '40px', padding: '0 10px',
                    border: `1px solid ${countFocus ? C.blue : C.inputBorder}`,
                    borderRadius: 0,
                    background: specific ? '#F9FAFB' : C.surface,
                    fontFamily: F.mono, fontSize: '14px',
                    color: specific ? C.text4 : C.text1,
                    textAlign: 'center', outline: 'none', boxSizing: 'border-box',
                    cursor: specific ? 'not-allowed' : 'text',
                    opacity: specific ? 0.6 : 1,
                  }}
                />
                <button
                  onClick={() => setCount(c => Math.min(TOTAL_ON_HAND, c + 1))}
                  disabled={specific || count >= TOTAL_ON_HAND}
                  aria-label="Увеличить"
                  style={{
                    width: '36px', height: '40px',
                    border: `1px solid ${C.inputBorder}`, borderLeft: 'none',
                    borderRadius: '0 8px 8px 0',
                    background: (specific || count >= TOTAL_ON_HAND) ? '#F9FAFB' : C.surface,
                    fontFamily: F.inter, fontSize: '16px',
                    color: (specific || count >= TOTAL_ON_HAND) ? C.textDisabled : C.text2,
                    cursor: (specific || count >= TOTAL_ON_HAND) ? 'not-allowed' : 'pointer',
                    opacity: specific ? 0.5 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'color 0.12s, background 0.12s',
                  }}
                >+</button>
              </div>
              <button
                type="button"
                onClick={() => setCount(TOTAL_ON_HAND)}
                onMouseEnter={() => setMaxHov(true)}
                onMouseLeave={() => setMaxHov(false)}
                disabled={specific}
                style={{
                  border: 'none', background: 'none', padding: '4px 6px',
                  borderRadius: '6px',
                  fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                  color: specific ? C.text4 : maxHov ? C.blueHover : C.blue,
                  cursor: specific ? 'not-allowed' : 'pointer',
                  textDecoration: maxHov && !specific ? 'underline' : 'none',
                  transition: 'color 0.12s',
                }}
                title={specific ? undefined : 'Установить максимум'}
              >
                из {TOTAL_ON_HAND} доступных
              </button>
            </div>

            {/* Specific cards toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '12px', marginTop: '14px',
            }}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                Выбрать конкретные карты
              </span>
              <Toggle on={specific} onChange={setSpecific} />
            </div>

            {specific && (
              <div style={{ marginTop: '12px' }}>
                <div style={{
                  border: `1px solid ${C.border}`, borderRadius: '8px',
                  maxHeight: '180px', overflowY: 'auto', background: C.surface,
                }}>
                  {UNSOLD_CARDS.map(c => {
                    const checked = selectedCards.has(c.num);
                    return (
                      <label key={c.num} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 12px',
                        borderBottom: `1px solid ${C.border}`,
                        cursor: 'pointer',
                        background: checked ? C.blueLt : 'transparent',
                        transition: 'background 0.1s',
                      }}>
                        <div style={{
                          width: '16px', height: '16px', borderRadius: '4px',
                          border: `1.5px solid ${checked ? C.blue : C.inputBorder}`,
                          background: checked ? C.blue : C.surface,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {checked && <Check size={10} color="#fff" strokeWidth={3} />}
                        </div>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCard(c.num)}
                          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                        />
                        <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text1 }}>
                          {c.num}
                        </span>
                        <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4 }}>
                          — {c.type}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div style={{
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                  color: C.blue, marginTop: '10px',
                }}>
                  Выбрано: <span style={{ fontFamily: F.mono }}>{selectedCards.size}</span> из <span style={{ fontFamily: F.mono }}>{TOTAL_ON_HAND}</span>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          {target && effectiveCount > 0 && (
            <div style={{
              background: '#F9FAFB',
              borderTop: `1px solid ${C.border}`,
              borderRight: `1px solid ${C.border}`,
              borderBottom: `1px solid ${C.border}`,
              borderLeft: `3px solid ${C.blue}`,
              borderRadius: '8px', padding: '12px',
            }}>
              <div style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 600,
                color: C.text1, marginBottom: '4px',
              }}>
                Переназначить {effectiveCount} карт: Санжар М. → {targetInfo?.name.split(' ')[0]} {targetInfo?.name.split(' ')[1]?.[0]}.
              </div>
              <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4 }}>
                Карты перейдут в статус «У продавца» у нового продавца
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${C.border}`, borderRadius: '8px',
              background: cancelHov ? '#F9FAFB' : C.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text1, cursor: 'pointer',
              transition: 'background 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            onMouseEnter={() => setConfirmHov(true)}
            onMouseLeave={() => setConfirmHov(false)}
            onClick={() => { if (canConfirm) onConfirm(); }}
            disabled={!canConfirm}
            style={{
              height: '38px', padding: '0 18px',
              border: 'none', borderRadius: '8px',
              background: !canConfirm ? '#93C5FD' : confirmHov ? C.blueHover : C.blue,
              opacity: canConfirm ? 1 : 0.85,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              boxShadow: canConfirm && confirmHov ? '0 2px 8px rgba(37,99,235,0.28)' : canConfirm ? '0 1px 3px rgba(37,99,235,0.16)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            Переназначить
          </button>
        </div>
      </div>
    </div>
  );
}

function SellerRow({ name, meta }: { name: string; meta: string }) {
  const inits = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 12px',
      border: `1px solid ${C.border}`, borderRadius: '8px',
      background: C.surface,
    }}>
      <div style={{
        width: '34px', height: '34px', borderRadius: '50%',
        background: C.blueLt, border: `1px solid ${C.blueTint}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: C.blue,
        flexShrink: 0,
      }}>
        {inits}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: C.text1,
          lineHeight: 1.3,
        }}>
          {name}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: C.text3,
          marginTop: '2px', lineHeight: 1.4,
        }}>
          {meta}
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: '40px', height: '22px',
        border: 'none', borderRadius: '999px',
        background: on ? C.blue : '#D1D5DB',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.15s',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: '2px', left: on ? '20px' : '2px',
        width: '18px', height: '18px', borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.15s',
      }} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EDIT SELLER MODAL
═══════════════════════════════════════════════════════════════════════════ */

function EditSellerModal({ open, onClose, onSave }: {
  open: boolean; onClose: () => void; onSave: () => void;
}) {
  const [name, setName] = useState('Санжар Мирзаев');
  const [phone, setPhone] = useState('+998 91 111 22 33');
  const [status, setStatus] = useState<'Активен' | 'Неактивен'>('Активен');
  const [nameFocus, setNameFocus] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [statusFocus, setStatusFocus] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [saveHov, setSaveHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%', height: '40px', padding: '0 12px',
    border: `1px solid ${focused ? C.blue : C.inputBorder}`,
    borderRadius: '8px', background: C.surface,
    fontFamily: F.inter, fontSize: '14px', color: C.text1,
    outline: 'none', boxSizing: 'border-box',
    boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
    transition: 'border-color 0.12s, box-shadow 0.12s',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
    color: C.text2, marginBottom: '8px',
  };

  const helperStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    marginTop: '6px',
    fontFamily: F.inter, fontSize: '11px', color: C.text4,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: F.dm, fontSize: '17px', fontWeight: 700, color: C.text1,
          }}>
            Редактировать продавца
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            style={{
              width: '28px', height: '28px',
              border: 'none', borderRadius: '7px',
              background: closeHov ? '#F3F4F6' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {/* ФИО */}
          <div>
            <label style={labelStyle}>
              ФИО<span style={{ color: C.error, marginLeft: '3px' }}>*</span>
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
              style={inputStyle(nameFocus)}
            />
          </div>

          {/* Телефон */}
          <div>
            <label style={labelStyle}>
              Телефон<span style={{ color: C.error, marginLeft: '3px' }}>*</span>
            </label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onFocus={() => setPhoneFocus(true)}
              onBlur={() => setPhoneFocus(false)}
              style={{ ...inputStyle(phoneFocus), fontFamily: F.mono }}
            />
            <div style={helperStyle}>
              <Info size={11} strokeWidth={1.75} />
              Изменение телефона потребует повторной верификации
            </div>
          </div>

          {/* UCOIN кошелёк (disabled) */}
          <div>
            <label style={labelStyle}>UCOIN кошелёк</label>
            <div style={{
              position: 'relative', width: '100%', height: '40px',
              border: `1px solid ${C.inputBorder}`, borderRadius: '8px',
              background: '#F9FAFB',
              display: 'flex', alignItems: 'center',
              padding: '0 36px 0 12px',
              fontFamily: F.mono, fontSize: '14px', color: C.text3,
              cursor: 'not-allowed',
            }}>
              UCN-0091
              <Lock size={14} color={C.text4} strokeWidth={1.75} style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              }} />
            </div>
            <div style={helperStyle}>
              <Info size={11} strokeWidth={1.75} />
              Кошелёк создаётся автоматически
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />

          {/* Статус */}
          <div>
            <div style={{
              fontFamily: F.dm, fontSize: '14px', fontWeight: 700,
              color: C.text1, marginBottom: '10px',
            }}>
              Статус
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
                Текущий:
              </span>
              <BadgeSuccess>Активен</BadgeSuccess>
              <div style={{ width: '1px', height: '18px', background: C.border }} />
              <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
                Изменить на:
              </span>
              <div style={{ position: 'relative', minWidth: '180px' }}>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as 'Активен' | 'Неактивен')}
                  onFocus={() => setStatusFocus(true)}
                  onBlur={() => setStatusFocus(false)}
                  style={{
                    width: '100%', height: '38px', padding: '0 36px 0 12px',
                    border: `1px solid ${statusFocus ? C.blue : C.inputBorder}`,
                    borderRadius: '8px', background: C.surface,
                    fontFamily: F.inter, fontSize: '13px', color: C.text1,
                    outline: 'none', appearance: 'none', cursor: 'pointer',
                    boxShadow: statusFocus ? `0 0 0 3px ${C.blueTint}` : 'none',
                    transition: 'border-color 0.12s, box-shadow 0.12s',
                  }}
                >
                  <option>Активен</option>
                  <option>Неактивен</option>
                </select>
                <ChevronDown size={14} color={C.text3} style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Deactivation warning */}
            {status === 'Неактивен' && (
              <div style={{
                display: 'flex', gap: '8px',
                marginTop: '12px', padding: '12px 14px',
                background: C.warningBg, border: `1px solid #FDE68A`,
                borderRadius: '8px',
              }}>
                <AlertTriangle size={15} color={C.warning} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                    color: '#B45309', marginBottom: '6px',
                  }}>
                    При деактивации:
                  </div>
                  <ul style={{
                    margin: 0, padding: 0, listStyle: 'none',
                    display: 'flex', flexDirection: 'column', gap: '4px',
                  }}>
                    {[
                      '38 нераспроданных карт будут возвращены на склад организации',
                      'Новые назначения станут невозможны',
                      'Текущий KPI прогресс по проданным картам сохранится',
                    ].map((txt, i) => (
                      <li key={i} style={{
                        display: 'flex', gap: '6px',
                        fontFamily: F.inter, fontSize: '12px', color: '#B45309', lineHeight: 1.5,
                      }}>
                        <span style={{ flexShrink: 0 }}>•</span>
                        <span>{txt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${C.border}`, borderRadius: '8px',
              background: cancelHov ? '#F9FAFB' : C.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text1, cursor: 'pointer',
              transition: 'background 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            onMouseEnter={() => setSaveHov(true)}
            onMouseLeave={() => setSaveHov(false)}
            onClick={onSave}
            style={{
              height: '38px', padding: '0 18px',
              border: 'none', borderRadius: '8px',
              background: saveHov ? C.blueHover : C.blue,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF', cursor: 'pointer',
              boxShadow: saveHov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
              transition: 'all 0.15s',
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SellerDetailPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [closeHov, setCloseHov] = useState(false);
  const [editHov, setEditHov] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deactivateHov, setDeactivateHov] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar role="org"
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
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onMouseEnter={() => setDeactivateHov(true)}
                  onMouseLeave={() => setDeactivateHov(false)}
                  onClick={() => setDeactivateOpen(true)}
                  style={{
                    height: '36px', padding: '0 14px',
                    border: `1px solid ${deactivateHov ? C.error : C.border}`,
                    borderRadius: '8px',
                    background: deactivateHov ? C.errorBg : C.surface,
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: deactivateHov ? '#DC2626' : C.text3,
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                >
                  <AlertTriangle size={14} strokeWidth={1.75} />
                  Деактивировать
                </button>
                <button
                  onMouseEnter={() => setEditHov(true)}
                  onMouseLeave={() => setEditHov(false)}
                  onClick={() => setEditOpen(true)}
                  style={{
                    height: '36px', padding: '0 14px',
                    border: `1px solid ${editHov ? C.blue : C.border}`,
                    borderRadius: '8px',
                    background: editHov ? C.blueLt : C.surface,
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: editHov ? C.blue : C.text1,
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                >
                  <Pencil size={14} strokeWidth={1.75} />
                  Редактировать
                </button>
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

      <EditSellerModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={() => setEditOpen(false)}
      />

      <DeactivateSellerModal
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={() => setDeactivateOpen(false)}
      />
    </div>
  );
}
