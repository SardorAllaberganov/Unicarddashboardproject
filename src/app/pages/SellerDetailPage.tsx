import React, { useState } from 'react';
import {
  X, CreditCard, ShoppingBag, CheckCircle2, Wallet,
  Check, Minus, Search, ChevronDown, ChevronRight,
  Pencil, Lock, AlertTriangle, Info, ArrowDown, ArrowRightLeft,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useNavigate } from 'react-router';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

function BadgeSuccess({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  const tk = dark ? { ...C, ...D } : C;
  const textColor = dark ? '#34D399' : '#15803D';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: tk.successBg, color: textColor,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: tk.success, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function BadgeDefault({ children, t, dark }: { children: React.ReactNode; t: T; dark: boolean }) {
  const bg = dark ? t.tableAlt : '#F3F4F6';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: bg, color: t.text2,
      border: `1px solid ${t.border}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function BadgeWarning({ children, t, dark }: { children: React.ReactNode; t: T; dark: boolean }) {
  const textColor = dark ? t.warning : '#B45309';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: t.warningBg, color: textColor,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.warning, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function BadgeInfo({ children, t, dark }: { children: React.ReactNode; t: T; dark: boolean }) {
  const textColor = dark ? t.info : '#0E7490';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: t.infoBg, color: textColor,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.info, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function BadgeBlue({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: t.blueLt, color: t.blue,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SMALL ATOMS
═══════════════════════════════════════════════════════════════════════════ */

function SectionLabel({ text, t }: { text: string; t: T }) {
  return (
    <div style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
      color: t.text4, textTransform: 'uppercase', letterSpacing: '0.07em',
      marginBottom: '12px',
    }}>
      {text}
    </div>
  );
}

function Divider({ t }: { t: T }) {
  return <div style={{ height: '1px', background: t.border, margin: '24px 0' }} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPACT STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

const VARIANT_LIGHT = {
  blue:   { icon: '#2563EB', iconBg: '#EFF6FF', border: '#DBEAFE' },
  green:  { icon: '#16A34A', iconBg: '#F0FDF4', border: '#BBF7D0' },
  violet: { icon: '#7C3AED', iconBg: '#F5F3FF', border: '#DDD6FE' },
  amber:  { icon: '#D97706', iconBg: '#FFFBEB', border: '#FDE68A' },
} as const;

const VARIANT_DARK = {
  blue:   { icon: '#60A5FA', iconBg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.30)' },
  green:  { icon: '#34D399', iconBg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.30)' },
  violet: { icon: '#A78BFA', iconBg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.30)' },
  amber:  { icon: '#FBBF24', iconBg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.30)' },
} as const;

type VariantKey = keyof typeof VARIANT_LIGHT;

function CompactStatCard({ icon: Icon, variant, label, value, t, dark }: {
  icon: React.ElementType;
  variant: VariantKey;
  label: string;
  value: string;
  t: T;
  dark: boolean;
}) {
  const v = (dark ? VARIANT_DARK : VARIANT_LIGHT)[variant];
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
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
        <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text3, marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 700, color: t.text1, lineHeight: 1.2 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI BAR
═══════════════════════════════════════════════════════════════════════════ */

function KpiBar({ label, value, total, color, description, t, dark }: {
  label: string; value: number; total: number; color: string; description: string;
  t: T; dark: boolean;
}) {
  const pct = total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
  const trackBg = dark ? t.tableAlt : '#F3F4F6';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>{description}</span>
          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 600, color, minWidth: '42px', textAlign: 'right' }}>
            {pct}%
          </span>
        </div>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: trackBg, overflow: 'hidden' }}>
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

function KpiCheck({ status, progress, label, t, dark }: {
  status: 'done' | 'progress' | 'none';
  progress?: number;
  label?: string;
  t: T;
  dark: boolean;
}) {
  const trackBg = dark ? t.tableAlt : '#E5E7EB';
  const dashColor = dark ? t.text4 : '#D1D5DB';
  if (status === 'done') return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: t.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Check size={10} color="#fff" strokeWidth={3} />
      </div>
      {label && <span style={{ fontFamily: F.mono, fontSize: '11px', color: t.text3 }}>{label}</span>}
    </div>
  );
  if (status === 'progress') return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: trackBg, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: t.blue, borderRadius: '2px' }} />
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '11px', color: t.text3 }}>{progress}%</span>
    </div>
  );
  return <Minus size={13} color={dashColor} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: СВОДКА
═══════════════════════════════════════════════════════════════════════════ */

function TabSvodka({ t, dark }: { t: T; dark: boolean }) {
  const kpi1Color = dark ? '#60A5FA' : '#2563EB';
  const kpi2Color = dark ? '#A78BFA' : '#7C3AED';
  const kpi3Color = dark ? '#34D399' : '#10B981';
  return (
    <div>
      {/* 2×2 Stat grid */}
      <SectionLabel text="Ключевые показатели" t={t} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <CompactStatCard icon={CreditCard}   variant="blue"   label="Карт назначено" value="100"            t={t} dark={dark} />
        <CompactStatCard icon={ShoppingBag}  variant="green"  label="Продано"        value="62 (62%)"       t={t} dark={dark} />
        <CompactStatCard icon={CheckCircle2} variant="violet" label="KPI 3 завершено" value="15"            t={t} dark={dark} />
        <CompactStatCard icon={Wallet}       variant="amber"  label="Заработано"     value="555 000 UZS"    t={t} dark={dark} />
      </div>

      <Divider t={t} />

      {/* KPI breakdown bars */}
      <SectionLabel text="KPI прогресс" t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <KpiBar label="KPI 1 — Регистрация"  value={55} total={62} color={kpi1Color} description="55 из 62 продано" t={t} dark={dark} />
        <KpiBar label="KPI 2 — Пополнение"   value={41} total={62} color={kpi2Color} description="41 из 62"         t={t} dark={dark} />
        <KpiBar label="KPI 3 — Оплата 500K"  value={15} total={62} color={kpi3Color} description="15 из 62"         t={t} dark={dark} />
      </div>

      <Divider t={t} />

      {/* Earnings breakdown */}
      <SectionLabel text="Расчёт заработка" t={t} />
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: '10px', padding: '16px 20px',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <EarningsRow label="KPI 1 × 55" value="275 000 UZS" t={t} />
          <EarningsRow label="KPI 2 × 41" value="205 000 UZS" t={t} />
          <EarningsRow label="KPI 3 × 15" value="150 000 UZS" t={t} />

          <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: t.text1 }}>
              Итого
            </span>
            <span style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: t.text1 }}>
              555 000 UZS
            </span>
          </div>

          <div style={{ height: '1px', background: t.border, margin: '2px 0' }} />

          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Выведено:</span>
              <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: t.text2 }}>400 000</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Баланс:</span>
              <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: t.blue }}>155 000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EarningsRow({ label, value, t }: { label: string; value: string; t: T }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>{label}</span>
      <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{value}</span>
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
  const [darkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [reassignHov, setReassignHov] = useState(false);

  const headerBg = dark ? t.tableHeaderBg : '#FAFBFC';
  const rowHoverBg = dark ? t.tableHover : '#FAFBFC';

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <Search size={15} color={searchFocused ? t.blue : t.text4} style={{
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
              border: `1px solid ${searchFocused ? t.blue : t.inputBorder}`,
              borderRadius: '8px', background: t.surface,
              fontFamily: F.inter, fontSize: '13px', color: t.text1,
              outline: 'none', boxSizing: 'border-box',
              boxShadow: searchFocused ? `0 0 0 3px ${t.focusRing}` : 'none',
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
              border: `1px solid ${t.inputBorder}`, borderRadius: '8px',
              background: t.surface, fontFamily: F.inter, fontSize: '13px',
              color: t.text2, outline: 'none', appearance: 'none', cursor: 'pointer',
              minWidth: '140px',
            }}
          >
            <option value="">Статус: Все</option>
            {CARD_STATUSES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown size={13} color={t.text4} style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
        </div>

        <button
          onMouseEnter={() => setReassignHov(true)}
          onMouseLeave={() => setReassignHov(false)}
          onClick={() => setReassignOpen(true)}
          style={{
            height: '36px', padding: '0 14px',
            border: `1px solid ${reassignHov ? t.blue : t.border}`,
            borderRadius: '8px',
            background: reassignHov ? t.blueLt : t.surface,
            fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
            color: reassignHov ? t.blue : t.text1,
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
      <div style={{ border: `1px solid ${t.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: headerBg, borderBottom: `1px solid ${t.border}` }}>
              {['Карта', 'Клиент', 'Продано', 'KPI 1', 'KPI 2', 'KPI 3', 'Пополнено', 'Расход'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: 'left',
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: t.text4,
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
                    borderBottom: i < SELLER_CARDS.length - 1 ? `1px solid ${t.border}` : 'none',
                    background: hov ? rowHoverBg : t.surface,
                    cursor: 'pointer', transition: 'background 0.1s',
                  }}
                >
                  <td style={tdStyle}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text1 }}>{card.num}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{card.client}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>{card.soldDate}</span>
                  </td>
                  <td style={tdStyle}>
                    <KpiCheck status={card.k1} t={t} dark={dark} />
                  </td>
                  <td style={tdStyle}>
                    <KpiCheck status={card.k2} t={t} dark={dark} />
                  </td>
                  <td style={tdStyle}>
                    <KpiCheck status={card.k3.status} progress={card.k3.progress} label={card.k3.label} t={t} dark={dark} />
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{card.topup}</span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{card.spent}</span>
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
        t={t}
        dark={dark}
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

function TabFinance({ t, dark }: { t: T; dark: boolean }) {
  const [hovRow, setHovRow] = useState<number | null>(null);

  const headerBg = dark ? t.tableHeaderBg : '#FAFBFC';
  const rowHoverBg = dark ? t.tableHover : '#FAFBFC';
  const posColor = dark ? '#34D399' : '#15803D';
  const negColor = dark ? '#F87171' : '#DC2626';

  return (
    <div>
      {/* Balance display */}
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: '12px', padding: '20px 24px', marginBottom: '24px',
      }}>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '6px' }}>
          Баланс UCOIN кошелька
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '28px', fontWeight: 700, color: t.text1, lineHeight: 1.2 }}>
          155 000 <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text3 }}>UZS</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
          <div>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Всего заработано: </span>
            <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: t.text1 }}>555 000</span>
          </div>
          <div>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Выведено: </span>
            <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: t.text1 }}>400 000</span>
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <SectionLabel text="История операций" t={t} />
      <div style={{ border: `1px solid ${t.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: headerBg, borderBottom: `1px solid ${t.border}` }}>
              {['Дата', 'Тип', 'Карта', 'KPI', 'Сумма', 'Статус'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: 'left',
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: t.text4,
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
                    borderBottom: i < TRANSACTIONS.length - 1 ? `1px solid ${t.border}` : 'none',
                    background: hov ? rowHoverBg : t.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={tdStyleFin}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>{tx.date}</span>
                  </td>
                  <td style={tdStyleFin}>
                    {tx.type === 'kpi'
                      ? <BadgeDefault t={t} dark={dark}>KPI</BadgeDefault>
                      : <BadgeWarning t={t} dark={dark}>Вывод</BadgeWarning>
                    }
                  </td>
                  <td style={tdStyleFin}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{tx.card}</span>
                  </td>
                  <td style={tdStyleFin}>
                    {tx.kpiLabel !== '—'
                      ? <BadgeBlue t={t}>{tx.kpiLabel}</BadgeBlue>
                      : <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text4 }}>—</span>
                    }
                  </td>
                  <td style={tdStyleFin}>
                    <span style={{
                      fontFamily: F.mono, fontSize: '13px', fontWeight: 600,
                      color: tx.positive ? posColor : negColor,
                    }}>
                      {tx.amount}
                    </span>
                  </td>
                  <td style={tdStyleFin}>
                    {tx.status === 'credited'
                      ? <BadgeSuccess dark={dark}>Начислено</BadgeSuccess>
                      : <BadgeInfo t={t} dark={dark}>Выведено</BadgeInfo>
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

function DeactivateSellerModal({ open, onClose, onConfirm, t, dark }: {
  open: boolean; onClose: () => void; onConfirm: () => void; t: T; dark: boolean;
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

  const overlay = dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(17, 24, 39, 0.50)';
  const modalShadow = dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 24px 48px rgba(0,0,0,0.18)';
  const closeHovBg = dark ? t.tableHover : '#F3F4F6';
  const cancelHovBg = dark ? t.tableHover : '#F9FAFB';
  const warningCardBg = dark ? 'rgba(251,191,36,0.08)' : '#FFFBEB';
  const warningCardBorder = dark ? t.border : '#FDE68A';
  const warningTitleColor = dark ? t.text1 : t.text1;
  const disabledErrBorder = dark ? 'rgba(248,113,113,0.3)' : '#FECACA';
  const disabledErrText = dark ? 'rgba(248,113,113,0.5)' : '#FCA5A5';
  const errHoverBorder = dark ? '#EF4444' : '#DC2626';
  const errHoverText = dark ? '#EF4444' : '#B91C1C';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: overlay,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '560px',
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '12px',
          boxShadow: modalShadow,
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '18px 20px', borderBottom: `1px solid ${t.border}`,
        }}>
          <AlertTriangle size={22} color={t.warning} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1,
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
              background: closeHov ? closeHovBg : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={closeHov ? t.text1 : t.text3} strokeWidth={1.75} />
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
            color: t.text1, lineHeight: 1.5,
          }}>
            Вы уверены, что хотите деактивировать этого продавца?
          </p>

          {/* Seller info card */}
          <div style={{
            background: warningCardBg,
            borderTop: `1px solid ${warningCardBorder}`,
            borderRight: `1px solid ${warningCardBorder}`,
            borderBottom: `1px solid ${warningCardBorder}`,
            borderLeft: `3px solid ${t.warning}`,
            borderRadius: '8px', padding: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: t.blueLt, border: `1px solid ${t.blueTint}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.blue,
                flexShrink: 0,
              }}>
                СМ
              </div>
              <span style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: warningTitleColor,
              }}>
                Санжар Мирзаев
              </span>
              <BadgeSuccess dark={dark}>Активен</BadgeSuccess>
            </div>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: t.text2,
              marginBottom: '4px', lineHeight: 1.5,
            }}>
              Карт назначено: <span style={{ fontFamily: F.mono, color: t.text1, fontWeight: 500 }}>100</span>
              {' | '}
              Продано: <span style={{ fontFamily: F.mono, color: t.text1, fontWeight: 500 }}>62</span>
              {' | '}
              На руках: <span style={{ fontFamily: F.mono, color: t.text1, fontWeight: 500 }}>38</span>
            </div>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: t.text2, lineHeight: 1.5,
            }}>
              Заработано: <span style={{ fontFamily: F.mono, color: t.text1, fontWeight: 500 }}>555 000 UZS</span>
              {' | '}
              Баланс: <span style={{ fontFamily: F.mono, color: t.text1, fontWeight: 500 }}>155 000 UZS</span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: t.border }} />

          {/* Step 2: Card reassignment */}
          <div>
            <div style={{
              fontFamily: F.dm, fontSize: '14px', fontWeight: 700,
              color: t.text1, marginBottom: '12px',
            }}>
              Что делать с 38 нераспроданными картами?
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <RadioOption
                selected={mode === 'warehouse'}
                onClick={() => setMode('warehouse')}
                title="Вернуть на склад организации"
                caption="Карты получат статус «На складе»"
                t={t}
                dark={dark}
              />
              <RadioOption
                selected={mode === 'transfer'}
                onClick={() => setMode('transfer')}
                title="Передать другому продавцу"
                t={t}
                dark={dark}
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
                        border: `1px solid ${targetFocus ? t.blue : t.inputBorder}`,
                        borderRadius: '8px', background: t.surface,
                        fontFamily: F.inter, fontSize: '13px',
                        color: targetSeller ? t.text1 : t.text4,
                        outline: 'none', appearance: 'none', cursor: 'pointer',
                        boxShadow: targetFocus ? `0 0 0 3px ${t.focusRing}` : 'none',
                        transition: 'border-color 0.12s, box-shadow 0.12s',
                      }}
                    >
                      <option value="">Выберите продавца</option>
                      {OTHER_SELLERS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} color={t.text3} style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)', pointerEvents: 'none',
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: t.border }} />

          {/* Wallet balance section */}
          <div>
            <div style={{
              fontFamily: F.dm, fontSize: '14px', fontWeight: 700,
              color: t.text1, marginBottom: '4px',
            }}>
              Баланс кошелька: <span style={{ fontFamily: F.mono, color: t.blue }}>155 000 UZS</span>
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, lineHeight: 1.4 }}>
              Продавец сможет вывести остаток средств после деактивации
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: `1px solid ${t.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${t.border}`, borderRadius: '8px',
              background: cancelHov ? cancelHovBg : 'transparent',
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, cursor: 'pointer',
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
              border: `1px solid ${!canConfirm ? disabledErrBorder : confirmHov ? errHoverBorder : t.error}`,
              borderRadius: '8px',
              background: !canConfirm ? 'transparent' : confirmHov ? t.errorBg : 'transparent',
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: !canConfirm ? disabledErrText : confirmHov ? errHoverText : t.error,
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              opacity: canConfirm ? 1 : 0.5,
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

function RadioOption({ selected, onClick, title, caption, t, dark }: {
  selected: boolean; onClick: () => void; title: string; caption?: string; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const hoverBg = dark ? t.tableHover : '#F9FAFB';
  const unselectedRing = dark ? t.inputBorder : '#D1D5DB';
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        padding: '10px 12px',
        border: `1px solid ${selected ? t.blue : hov ? t.inputBorder : t.border}`,
        borderRadius: '8px',
        background: selected ? t.blueLt : hov ? hoverBg : 'transparent',
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        border: `2px solid ${selected ? t.blue : unselectedRing}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: '1px', flexShrink: 0,
        transition: 'border-color 0.12s',
      }}>
        {selected && (
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.blue }} />
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
          color: t.text1, lineHeight: 1.3,
        }}>
          {title}
        </div>
        {caption && (
          <div style={{
            fontFamily: F.inter, fontSize: '11px', color: t.text4,
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

function ReassignCardsModal({ open, onClose, onConfirm, t, dark }: {
  open: boolean; onClose: () => void; onConfirm: () => void; t: T; dark: boolean;
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

  const targetInfo = REASSIGN_TARGETS.find(tg => tg.name === target);
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

  const overlay = dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(17, 24, 39, 0.50)';
  const modalShadow = dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 24px 48px rgba(0,0,0,0.18)';
  const closeHovBg = dark ? t.tableHover : '#F3F4F6';
  const cancelHovBg = dark ? t.tableHover : '#F9FAFB';
  const disabledBtnBg = dark ? 'rgba(59,130,246,0.3)' : '#93C5FD';
  const btnShadowHov = dark ? '0 2px 8px rgba(59,130,246,0.35)' : '0 2px 8px rgba(37,99,235,0.28)';
  const btnShadow = dark ? '0 1px 3px rgba(59,130,246,0.2)' : '0 1px 3px rgba(37,99,235,0.16)';
  const stepperDisabledBg = dark ? t.tableHover : '#F9FAFB';
  const summaryBg = dark ? t.tableAlt : '#F9FAFB';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: overlay,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '560px',
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '12px',
          boxShadow: modalShadow,
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: `1px solid ${t.border}`,
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: F.dm, fontSize: '17px', fontWeight: 700, color: t.text1,
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
              background: closeHov ? closeHovBg : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={closeHov ? t.text1 : t.text3} strokeWidth={1.75} />
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
              color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: '8px',
            }}>
              Откуда
            </div>
            <SellerRow name="Санжар Мирзаев" meta={`На руках: ${TOTAL_ON_HAND} карт`} t={t} />
          </div>

          {/* Arrow down */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ArrowDown size={22} color={t.text4} strokeWidth={1.75} />
          </div>

          {/* To */}
          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
              color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em',
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
                  border: `1px solid ${targetFocus ? t.blue : t.inputBorder}`,
                  borderRadius: '8px', background: t.surface,
                  fontFamily: F.inter, fontSize: '13px',
                  color: target ? t.text1 : t.text4,
                  outline: 'none', appearance: 'none', cursor: 'pointer',
                  boxShadow: targetFocus ? `0 0 0 3px ${t.focusRing}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              >
                <option value="">Выберите продавца</option>
                {REASSIGN_TARGETS.map(s => (
                  <option key={s.name} value={s.name}>{s.name} ({s.onHand} карт)</option>
                ))}
              </select>
              <ChevronDown size={14} color={t.text3} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
            </div>

            {targetInfo && (
              <div style={{ marginTop: '10px' }}>
                <SellerRow
                  name={targetInfo.name}
                  meta={`На руках: ${targetInfo.onHand} карт → будет ${targetInfo.onHand} + ${effectiveCount} = ${targetInfo.onHand + effectiveCount}`}
                  t={t}
                />
              </div>
            )}
          </div>

          <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />

          {/* Card selection */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, marginBottom: '8px',
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
                    border: `1px solid ${t.inputBorder}`, borderRight: 'none',
                    borderRadius: '8px 0 0 8px',
                    background: (specific || count <= 1) ? stepperDisabledBg : t.surface,
                    fontFamily: F.inter, fontSize: '16px',
                    color: (specific || count <= 1) ? t.textDisabled : t.text2,
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
                    border: `1px solid ${countFocus ? t.blue : t.inputBorder}`,
                    borderRadius: 0,
                    background: specific ? stepperDisabledBg : t.surface,
                    fontFamily: F.mono, fontSize: '14px',
                    color: specific ? t.text4 : t.text1,
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
                    border: `1px solid ${t.inputBorder}`, borderLeft: 'none',
                    borderRadius: '0 8px 8px 0',
                    background: (specific || count >= TOTAL_ON_HAND) ? stepperDisabledBg : t.surface,
                    fontFamily: F.inter, fontSize: '16px',
                    color: (specific || count >= TOTAL_ON_HAND) ? t.textDisabled : t.text2,
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
                  color: specific ? t.text4 : maxHov ? t.blueHover : t.blue,
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
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                Выбрать конкретные карты
              </span>
              <Toggle on={specific} onChange={setSpecific} t={t} dark={dark} />
            </div>

            {specific && (
              <div style={{ marginTop: '12px' }}>
                <div style={{
                  border: `1px solid ${t.border}`, borderRadius: '8px',
                  maxHeight: '180px', overflowY: 'auto', background: t.surface,
                }}>
                  {UNSOLD_CARDS.map(c => {
                    const checked = selectedCards.has(c.num);
                    return (
                      <label key={c.num} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 12px',
                        borderBottom: `1px solid ${t.border}`,
                        cursor: 'pointer',
                        background: checked ? t.blueLt : 'transparent',
                        transition: 'background 0.1s',
                      }}>
                        <div style={{
                          width: '16px', height: '16px', borderRadius: '4px',
                          border: `1.5px solid ${checked ? t.blue : t.inputBorder}`,
                          background: checked ? t.blue : t.surface,
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
                        <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text1 }}>
                          {c.num}
                        </span>
                        <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>
                          — {c.type}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div style={{
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                  color: t.blue, marginTop: '10px',
                }}>
                  Выбрано: <span style={{ fontFamily: F.mono }}>{selectedCards.size}</span> из <span style={{ fontFamily: F.mono }}>{TOTAL_ON_HAND}</span>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          {target && effectiveCount > 0 && (
            <div style={{
              background: summaryBg,
              borderTop: `1px solid ${t.border}`,
              borderRight: `1px solid ${t.border}`,
              borderBottom: `1px solid ${t.border}`,
              borderLeft: `3px solid ${t.blue}`,
              borderRadius: '8px', padding: '12px',
            }}>
              <div style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 600,
                color: t.text1, marginBottom: '4px',
              }}>
                Переназначить {effectiveCount} карт: Санжар М. → {targetInfo?.name.split(' ')[0]} {targetInfo?.name.split(' ')[1]?.[0]}.
              </div>
              <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4 }}>
                Карты перейдут в статус «У продавца» у нового продавца
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: `1px solid ${t.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${t.border}`, borderRadius: '8px',
              background: cancelHov ? cancelHovBg : 'transparent',
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, cursor: 'pointer',
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
              background: !canConfirm ? disabledBtnBg : confirmHov ? t.blueHover : t.blue,
              opacity: canConfirm ? 1 : 0.5,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              boxShadow: canConfirm && confirmHov ? btnShadowHov : canConfirm ? btnShadow : 'none',
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

function SellerRow({ name, meta, t }: { name: string; meta: string; t: T }) {
  const inits = name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 12px',
      border: `1px solid ${t.border}`, borderRadius: '8px',
      background: t.surface,
    }}>
      <div style={{
        width: '34px', height: '34px', borderRadius: '50%',
        background: t.blueLt, border: `1px solid ${t.blueTint}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.blue,
        flexShrink: 0,
      }}>
        {inits}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: t.text1,
          lineHeight: 1.3,
        }}>
          {name}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: t.text3,
          marginTop: '2px', lineHeight: 1.4,
        }}>
          {meta}
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onChange, t, dark }: { on: boolean; onChange: (v: boolean) => void; t: T; dark: boolean }) {
  const offBg = dark ? t.inputBorder : '#D1D5DB';
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: '40px', height: '22px',
        border: 'none', borderRadius: '999px',
        background: on ? t.blue : offBg,
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

function EditSellerModal({ open, onClose, onSave, t, dark }: {
  open: boolean; onClose: () => void; onSave: () => void; t: T; dark: boolean;
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
    border: `1px solid ${focused ? t.blue : t.inputBorder}`,
    borderRadius: '8px', background: t.surface,
    fontFamily: F.inter, fontSize: '14px', color: t.text1,
    outline: 'none', boxSizing: 'border-box',
    boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
    transition: 'border-color 0.12s, box-shadow 0.12s',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
    color: t.text2, marginBottom: '8px',
  };

  const helperStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    marginTop: '6px',
    fontFamily: F.inter, fontSize: '11px', color: t.text4,
  };

  const overlay = dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(17, 24, 39, 0.50)';
  const modalShadow = dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 24px 48px rgba(0,0,0,0.18)';
  const closeHovBg = dark ? t.tableHover : '#F3F4F6';
  const cancelHovBg = dark ? t.tableHover : '#F9FAFB';
  const disabledWalletBg = dark ? t.tableHover : '#F9FAFB';
  const warningBoxBg = dark ? 'rgba(251,191,36,0.08)' : t.warningBg;
  const warningBoxBorder = dark ? t.border : '#FDE68A';
  const warningTextColor = dark ? t.warning : '#B45309';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: overlay,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px',
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '12px',
          boxShadow: modalShadow,
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: `1px solid ${t.border}`,
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: F.dm, fontSize: '17px', fontWeight: 700, color: t.text1,
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
              background: closeHov ? closeHovBg : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={closeHov ? t.text1 : t.text3} strokeWidth={1.75} />
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
              ФИО<span style={{ color: t.error, marginLeft: '3px' }}>*</span>
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
              Телефон<span style={{ color: t.error, marginLeft: '3px' }}>*</span>
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
              border: `1px solid ${t.inputBorder}`, borderRadius: '8px',
              background: disabledWalletBg,
              display: 'flex', alignItems: 'center',
              padding: '0 36px 0 12px',
              fontFamily: F.mono, fontSize: '14px', color: t.text3,
              cursor: 'not-allowed',
            }}>
              UCN-0091
              <Lock size={14} color={t.text4} strokeWidth={1.75} style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              }} />
            </div>
            <div style={helperStyle}>
              <Info size={11} strokeWidth={1.75} />
              Кошелёк создаётся автоматически
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />

          {/* Статус */}
          <div>
            <div style={{
              fontFamily: F.dm, fontSize: '14px', fontWeight: 700,
              color: t.text1, marginBottom: '10px',
            }}>
              Статус
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
                Текущий:
              </span>
              <BadgeSuccess dark={dark}>Активен</BadgeSuccess>
              <div style={{ width: '1px', height: '18px', background: t.border }} />
              <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
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
                    border: `1px solid ${statusFocus ? t.blue : t.inputBorder}`,
                    borderRadius: '8px', background: t.surface,
                    fontFamily: F.inter, fontSize: '13px', color: t.text1,
                    outline: 'none', appearance: 'none', cursor: 'pointer',
                    boxShadow: statusFocus ? `0 0 0 3px ${t.focusRing}` : 'none',
                    transition: 'border-color 0.12s, box-shadow 0.12s',
                  }}
                >
                  <option>Активен</option>
                  <option>Неактивен</option>
                </select>
                <ChevronDown size={14} color={t.text3} style={{
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
                background: warningBoxBg, border: `1px solid ${warningBoxBorder}`,
                borderLeft: `3px solid ${t.warning}`,
                borderRadius: '8px',
              }}>
                <AlertTriangle size={15} color={t.warning} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                    color: warningTextColor, marginBottom: '6px',
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
                        fontFamily: F.inter, fontSize: '12px', color: t.text2, lineHeight: 1.5,
                      }}>
                        <span style={{ flexShrink: 0, color: t.text4 }}>•</span>
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
          borderTop: `1px solid ${t.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${t.border}`, borderRadius: '8px',
              background: cancelHov ? cancelHovBg : 'transparent',
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, cursor: 'pointer',
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
              background: saveHov ? t.blueHover : t.blue,
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
  const t = theme(darkMode);
  const dark = darkMode;
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [closeHov, setCloseHov] = useState(false);
  const [editHov, setEditHov] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deactivateHov, setDeactivateHov] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  const closeBtnHoverBorder = dark ? t.inputBorder : '#D1D5DB';
  const closeBtnHoverBg = dark ? t.tableHover : '#F9FAFB';
  const deactivateHoverText = dark ? '#F87171' : '#DC2626';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg }}>
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
            <span onClick={() => navigate('/org-dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/sellers')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Продавцы</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Санжар Мирзаев</span>
          </div>

          {/* Header card */}
          <div style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            marginBottom: '24px',
          }}>
            {/* Title row */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: `1px solid ${t.border}`,
            }}>
              <div>
                <h1 style={{
                  fontFamily: F.dm, fontSize: '22px', fontWeight: 700,
                  color: t.text1, margin: '0 0 8px', lineHeight: 1.2,
                }}>
                  Санжар Мирзаев
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text3 }}>
                    +998 91 111 22 33
                  </span>
                  <BadgeSuccess dark={dark}>Активен</BadgeSuccess>
                  <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>
                    UCOIN: <span style={{ fontFamily: F.mono, fontSize: '12px', color: t.text3 }}>UCN-0091</span>
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
                    border: `1px solid ${deactivateHov ? t.error : t.border}`,
                    borderRadius: '8px',
                    background: deactivateHov ? t.errorBg : t.surface,
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: deactivateHov ? deactivateHoverText : t.text3,
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
                    border: `1px solid ${editHov ? t.blue : t.border}`,
                    borderRadius: '8px',
                    background: editHov ? t.blueLt : t.surface,
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: editHov ? t.blue : t.text1,
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
                    border: `1px solid ${closeHov ? closeBtnHoverBorder : t.border}`,
                    borderRadius: '8px',
                    background: closeHov ? closeBtnHoverBg : t.surface,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
                  }}
                >
                  <X size={16} color={t.text3} strokeWidth={1.75} />
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
                      borderBottom: active ? `2px solid ${t.blue}` : '2px solid transparent',
                      background: 'none',
                      fontFamily: F.inter,
                      fontSize: '14px',
                      fontWeight: active ? 500 : 400,
                      color: active ? t.blue : t.text3,
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
            {activeTab === 'summary' && <TabSvodka t={t} dark={dark} />}
            {activeTab === 'cards' && <TabCards />}
            {activeTab === 'finance' && <TabFinance t={t} dark={dark} />}
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      <EditSellerModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={() => setEditOpen(false)}
        t={t}
        dark={dark}
      />

      <DeactivateSellerModal
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={() => setDeactivateOpen(false)}
        t={t}
        dark={dark}
      />
    </div>
  );
}
