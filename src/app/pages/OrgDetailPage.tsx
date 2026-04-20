import React, { useState } from 'react';
import {
  X, CreditCard, ShoppingBag, CheckCircle2, Wallet,
  Check, Minus, Search, ChevronDown, ChevronRight, Plus,
  Pencil, AlertTriangle, ChevronLeft, MoreHorizontal,
  Phone, Users, PauseCircle, XCircle,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { iconVariant } from '../components/ds/iconVariant';
import { useDarkMode } from '../components/useDarkMode';
import { useIsMobile } from '../components/useIsMobile';
import { useNavigate } from 'react-router';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

function BadgeSuccess({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const bg   = dark ? 'rgba(52,211,153,0.12)' : C.successBg;
  const text = dark ? '#34D399' : '#15803D';
  const dot  = dark ? '#34D399' : C.success;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: bg, color: text, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function BadgeBlue({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '2px 8px', borderRadius: '8px',
      background: t.blueLt, color: t.blue, whiteSpace: 'nowrap',
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

function KpiCheck({ status, progress, t, dark }: {
  status: 'done' | 'progress' | 'none'; progress?: number; t: T; dark: boolean;
}) {
  const successBg = dark ? '#34D399' : C.success;
  const trackBg = dark ? D.progressTrack : '#E5E7EB';
  const emptyIconColor = dark ? D.text4 : '#D1D5DB';

  if (status === 'done') return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Check size={10} color="#FFFFFF" strokeWidth={3} />
      </div>
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
  return <Minus size={13} color={emptyIconColor} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPACT STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

const VARIANT_COLORS_LIGHT = {
  blue:   { icon: C.blue,    iconBg: C.blueLt,   border: C.blueTint },
  green:  { icon: '#16A34A', iconBg: '#F0FDF4',  border: '#BBF7D0' },
  violet: { icon: '#7C3AED', iconBg: '#F5F3FF',  border: '#DDD6FE' },
  amber:  { icon: '#D97706', iconBg: '#FFFBEB',  border: '#FDE68A' },
} as const;

const VARIANT_COLORS_DARK = {
  blue:   { icon: '#3B82F6', iconBg: 'rgba(59,130,246,0.14)',  border: 'rgba(59,130,246,0.32)' },
  green:  { icon: '#34D399', iconBg: 'rgba(52,211,153,0.12)',  border: 'rgba(52,211,153,0.32)' },
  violet: { icon: '#A78BFA', iconBg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.32)' },
  amber:  { icon: '#FBBF24', iconBg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.32)' },
} as const;

function CompactStatCard({ icon: Icon, variant, label, value, t, dark }: {
  icon: React.ElementType;
  variant: keyof typeof VARIANT_COLORS_LIGHT;
  label: string;
  value: string;
  t: T; dark: boolean;
}) {
  const v = (dark ? VARIANT_COLORS_DARK : VARIANT_COLORS_LIGHT)[variant];
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

function KpiBar({ label, value, total, color, t, dark }: {
  label: string; value: number; total: number; color: string;
  t: T; dark: boolean;
}) {
  const pct = Math.round((value / total) * 100);
  const trackBg = dark ? D.progressTrack : '#F3F4F6';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>{value} из {total}</span>
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
   TIMELINE
═══════════════════════════════════════════════════════════════════════════ */

function Timeline({ items, t }: { items: { dot: string; text: string; time: string }[]; t: T }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '14px', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.dot, marginTop: '4px', flexShrink: 0 }} />
            {i < items.length - 1 && (
              <div style={{ width: '1px', flex: 1, background: t.border, minHeight: '24px', margin: '4px 0' }} />
            )}
          </div>
          <div style={{ paddingBottom: i < items.length - 1 ? '16px' : '0', minWidth: 0 }}>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text1, lineHeight: 1.4 }}>
              {item.text}
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, marginTop: '2px' }}>
              {item.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: СВОДКА
═══════════════════════════════════════════════════════════════════════════ */

function TabSvodka({ t, dark }: { t: T; dark: boolean }) {
  const greenBar  = dark ? '#34D399' : '#16A34A';
  const violetBar = dark ? '#A78BFA' : '#7C3AED';

  return (
    <div>
      <SectionLabel text="Ключевые показатели" t={t} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <CompactStatCard icon={CreditCard}   variant="blue"   label="Карт выдано"          value="500" t={t} dark={dark} />
        <CompactStatCard icon={ShoppingBag}  variant="green"  label="Продано"               value="230 (46%)" t={t} dark={dark} />
        <CompactStatCard icon={CheckCircle2} variant="violet" label="KPI выполнено (все 3)" value="45 (19.6%)" t={t} dark={dark} />
        <CompactStatCard icon={Wallet}       variant="amber"  label="Начислено"             value="1 825 000 UZS" t={t} dark={dark} />
      </div>

      <Divider t={t} />

      <SectionLabel text="KPI прогресс" t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <KpiBar label="Регистрация"  value={185} total={230} color={t.blue}    t={t} dark={dark} />
        <KpiBar label="Пополнение"   value={120} total={230} color={violetBar} t={t} dark={dark} />
        <KpiBar label="Оплата 500K"  value={45}  total={230} color={greenBar}  t={t} dark={dark} />
      </div>

      <Divider t={t} />

      <SectionLabel text="Последняя активность" t={t} />
      <Timeline t={t} items={[
        { dot: greenBar, text: 'Карта ...4521 — KPI 3 выполнен (512 000 UZS)', time: '2 часа назад' },
        { dot: t.blue,   text: 'Карта ...3892 — KPI 2 выполнен', time: '5 часов назад' },
        { dot: t.text4,  text: 'Новый продавец добавлен: Камола Р.', time: 'вчера' },
      ]} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: ПРОДАВЦЫ
═══════════════════════════════════════════════════════════════════════════ */

const SELLERS = [
  { name: 'Абдуллох Р.', cards: 100, sold: 45, k1: 38, k2: 22, k3: 8,  earned: '330 000' },
  { name: 'Санжар М.',   cards: 100, sold: 62, k1: 55, k2: 41, k3: 15, earned: '555 000' },
  { name: 'Нилуфар К.',  cards: 100, sold: 33, k1: 28, k2: 18, k3: 5,  earned: '255 000' },
  { name: 'Камола Р.',   cards: 50,  sold: 18, k1: 14, k2: 9,  k3: 2,  earned: '125 000' },
  { name: 'Ислом Т.',    cards: 80,  sold: 42, k1: 35, k2: 20, k3: 10, earned: '350 000' },
  { name: 'Дарья Н.',    cards: 70,  sold: 30, k1: 15, k2: 10, k3: 5,  earned: '210 000' },
];

function TabSellers({ t, dark }: { t: T; dark: boolean }) {
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);
  const [addHov, setAddHov] = useState(false);

  const filtered = SELLERS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const headerBg = dark ? D.tableHeaderBg : '#FAFBFC';
  const rowHoverBg = dark ? D.tableHover : '#FAFBFC';

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} color={focused ? t.blue : t.text4} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Поиск продавца..."
            style={{
              width: '100%', height: '36px', paddingLeft: '34px', paddingRight: '10px',
              border: `1px solid ${focused ? t.blue : t.inputBorder}`,
              borderRadius: '8px', background: t.surface,
              fontFamily: F.inter, fontSize: '13px', color: t.text1,
              outline: 'none', boxSizing: 'border-box',
              boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
              transition: 'all 0.12s',
            }}
          />
        </div>
        <button
          onMouseEnter={() => setAddHov(true)}
          onMouseLeave={() => setAddHov(false)}
          style={{
            height: '36px', padding: '0 14px', flexShrink: 0,
            background: addHov ? t.blueHover : t.blue,
            border: 'none', borderRadius: '8px',
            fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: '#FFFFFF',
            display: 'flex', alignItems: 'center', gap: '6px',
            cursor: 'pointer', transition: 'background 0.12s',
          }}
        >
          <Plus size={14} strokeWidth={2.25} />
          Добавить продавца
        </button>
      </div>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: headerBg, borderBottom: `1px solid ${t.border}` }}>
              {['Продавец', 'Карт', 'Продано', 'KPI 1', 'KPI 2', 'KPI 3', 'Заработано'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: h === 'Заработано' ? 'right' : 'left',
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: t.text4,
                  textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const hov = hovRow === i;
              return (
                <tr key={s.name}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: i < filtered.length - 1 ? `1px solid ${t.border}` : 'none',
                    background: hov ? rowHoverBg : t.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: t.blueLt, border: `1px solid ${t.blueTint}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: F.inter, fontSize: '9px', fontWeight: 700, color: t.blue }}>
                          {s.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text1, fontWeight: 500 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{s.cards}</span></td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{s.sold}</span></td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{s.k1}</span></td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{s.k2}</span></td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{s.k3}</span></td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: t.text1 }}>{s.earned}</span>
                    <span style={{ fontFamily: F.inter, fontSize: '10px', color: t.text4, marginLeft: '3px' }}>UZS</span>
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

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: КАРТЫ
═══════════════════════════════════════════════════════════════════════════ */

type CardStatusKey = 'Активна' | 'Зарег.' | 'На складе';

interface CardRow {
  num: string;
  seller: string;
  client: string;
  statusKey: CardStatusKey;
  k1: 'done' | 'progress' | 'none';
  k2: 'done' | 'progress' | 'none';
  k3: { p: number; label: string };
}

const CARDS_DATA: CardRow[] = [
  { num: '...1001', seller: 'Абдуллох', client: 'Алишер Н.',  statusKey: 'Активна',   k1: 'done',  k2: 'done',  k3: { p: 100, label: '510K' } },
  { num: '...1002', seller: 'Абдуллох', client: 'Дилшод К.',  statusKey: 'Зарег.',    k1: 'done',  k2: 'done',  k3: { p: 64,  label: '64%'  } },
  { num: '...1003', seller: '—',        client: '—',           statusKey: 'На складе', k1: 'none',  k2: 'none',  k3: { p: 0,   label: '—'   } },
];

const STATUS_PILL_LIGHT: Record<CardStatusKey, { bg: string; color: string }> = {
  'Активна':   { bg: '#F0FDF4', color: '#15803D' },
  'Зарег.':    { bg: '#ECFEFF', color: '#0E7490' },
  'На складе': { bg: '#F9FAFB', color: '#6B7280' },
};

const STATUS_PILL_DARK: Record<CardStatusKey, { bg: string; color: string }> = {
  'Активна':   { bg: 'rgba(52,211,153,0.12)', color: '#34D399' },
  'Зарег.':    { bg: 'rgba(34,211,238,0.12)', color: '#22D3EE' },
  'На складе': { bg: D.tableAlt,              color: D.text2 },
};

function TabCards({ t, dark }: { t: T; dark: boolean }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);

  const headerBg = dark ? D.tableHeaderBg : '#FAFBFC';
  const rowHoverBg = dark ? D.tableHover : '#FAFBFC';
  const statusMap = dark ? STATUS_PILL_DARK : STATUS_PILL_LIGHT;

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
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
            {['На складе', 'У продавца', 'Продана', 'Зарег.', 'Активна'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <ChevronDown size={13} color={t.text4} style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
        </div>
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <Search size={14} color={focused ? t.blue : t.text4} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Поиск по карте..."
            style={{
              width: '100%', height: '36px', paddingLeft: '32px', paddingRight: '10px',
              border: `1px solid ${focused ? t.blue : t.inputBorder}`,
              borderRadius: '8px', background: t.surface,
              fontFamily: F.inter, fontSize: '13px', color: t.text1,
              outline: 'none', boxSizing: 'border-box',
              boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
              transition: 'all 0.12s',
            }}
          />
        </div>
      </div>

      <div style={{ border: `1px solid ${t.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: headerBg, borderBottom: `1px solid ${t.border}` }}>
              {['Карта', 'Продавец', 'Клиент', 'Статус', 'KPI 1', 'KPI 2', 'KPI 3'].map(h => (
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
            {CARDS_DATA.map((card, i) => {
              const hov = hovRow === i;
              const pill = statusMap[card.statusKey];
              return (
                <tr key={card.num}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: i < CARDS_DATA.length - 1 ? `1px solid ${t.border}` : 'none',
                    background: hov ? rowHoverBg : t.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: t.text1 }}>{card.num}</span></td>
                  <td style={td}><span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{card.seller}</span></td>
                  <td style={td}><span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{card.client}</span></td>
                  <td style={td}>
                    <span style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '8px',
                      background: pill.bg, color: pill.color, whiteSpace: 'nowrap',
                    }}>
                      {card.statusKey}
                    </span>
                  </td>
                  <td style={td}><KpiCheck status={card.k1} t={t} dark={dark} /></td>
                  <td style={td}><KpiCheck status={card.k2} t={t} dark={dark} /></td>
                  <td style={td}>
                    {card.k3.p === 100 ? <KpiCheck status="done" t={t} dark={dark} /> :
                     card.k3.p > 0 ? <KpiCheck status="progress" progress={card.k3.p} t={t} dark={dark} /> :
                     <KpiCheck status="none" t={t} dark={dark} />}
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

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: ФИНАНСЫ
═══════════════════════════════════════════════════════════════════════════ */

const FIN_ROWS = [
  { date: '13.04', seller: 'Абдуллох', card: '...4521', kpi: 'KPI 3', amount: '10 000', status: 'Начислено' },
  { date: '12.04', seller: 'Санжар',   card: '...3892', kpi: 'KPI 2', amount: '5 000',  status: 'Начислено' },
  { date: '11.04', seller: 'Абдуллох', card: '...1002', kpi: 'KPI 1', amount: '5 000',  status: 'Начислено' },
];

function TabFinance({ t, dark }: { t: T; dark: boolean }) {
  const [hovRow, setHovRow] = useState<number | null>(null);

  const headerBg = dark ? D.tableHeaderBg : '#FAFBFC';
  const rowHoverBg = dark ? D.tableHover : '#FAFBFC';
  const balanceColor = dark ? '#34D399' : '#15803D';

  return (
    <div>
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: '12px', padding: '20px 24px', marginBottom: '24px',
      }}>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '6px' }}>
          Всего начислено
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '28px', fontWeight: 700, color: t.text1, lineHeight: 1.2 }}>
          1 825 000 <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text3 }}>UZS</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
          <div>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Выведено: </span>
            <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: t.text1 }}>1 200 000</span>
          </div>
          <div>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Баланс: </span>
            <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: balanceColor }}>625 000</span>
          </div>
        </div>
      </div>

      <SectionLabel text="История выплат" t={t} />
      <div style={{ border: `1px solid ${t.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: headerBg, borderBottom: `1px solid ${t.border}` }}>
              {[
                { label: 'Дата',     align: 'left'  },
                { label: 'Продавец', align: 'left'  },
                { label: 'Карта',    align: 'left'  },
                { label: 'KPI',      align: 'left'  },
                { label: 'Сумма',    align: 'right' },
                { label: 'Статус',   align: 'left'  },
              ].map(h => (
                <th key={h.label} style={{
                  padding: '10px 14px', textAlign: h.align as any,
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: t.text4,
                  textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                }}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIN_ROWS.map((row, i) => {
              const hov = hovRow === i;
              return (
                <tr key={i}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: i < FIN_ROWS.length - 1 ? `1px solid ${t.border}` : 'none',
                    background: hov ? rowHoverBg : t.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '12px', color: t.text3 }}>{row.date}</span></td>
                  <td style={td}><span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{row.seller}</span></td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: t.text1 }}>{row.card}</span></td>
                  <td style={td}><BadgeBlue t={t}>{row.kpi}</BadgeBlue></td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: t.text1 }}>{row.amount}</span>
                  </td>
                  <td style={td}><BadgeSuccess dark={dark}>{row.status}</BadgeSuccess></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const td: React.CSSProperties = { padding: '11px 14px', whiteSpace: 'nowrap' };

/* ═══════════════════════════════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════════════════════════════ */

type TabId = 'summary' | 'sellers' | 'cards' | 'finance';

const TABS: { id: TabId; label: string }[] = [
  { id: 'summary', label: 'Сводка' },
  { id: 'sellers', label: 'Продавцы' },
  { id: 'cards',   label: 'Карты' },
  { id: 'finance', label: 'Финансы' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DEACTIVATE CONFIRMATION MODAL
═══════════════════════════════════════════════════════════════════════════ */

function DeactivateModal({ open, onClose, t, dark }: { open: boolean; onClose: () => void; t: T; dark: boolean }) {
  const [confirmInput, setConfirmInput] = useState('');
  const [cancelHov, setCancelHov] = useState(false);
  const [deactivateHov, setDeactivateHov] = useState(false);

  if (!open) return null;

  const canDeactivate = confirmInput === 'Mysafar OOO';

  const overlayBg = dark ? 'rgba(0,0,0,0.6)' : 'rgba(0, 0, 0, 0.4)';
  const modalShadow = dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.15)';
  const warningTint = dark ? 'rgba(251,191,36,0.08)' : t.surface;
  const disabledRedBg = dark ? 'rgba(248,113,113,0.3)' : t.border;
  const errorHoverColor = dark ? '#EF4444' : '#DC2626';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: overlayBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: '16px', width: '480px', maxWidth: '90vw',
        boxShadow: modalShadow,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: `1px solid ${t.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} color={t.warning} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1 }}>
              Деактивировать организацию
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px',
              border: `1px solid ${t.border}`, borderRadius: '8px',
              background: t.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} color={t.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <p style={{
            fontFamily: F.inter, fontSize: '14px', color: t.text2,
            margin: '0 0 16px',
          }}>
            Вы уверены, что хотите деактивировать организацию?
          </p>

          {/* Warning card */}
          <div style={{
            background: warningTint,
            border: `1px solid ${t.border}`,
            borderLeft: `3px solid ${t.warning}`,
            borderRadius: '8px', padding: '16px', marginBottom: '20px',
          }}>
            <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1, marginBottom: '8px' }}>
              Mysafar OOO
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2, marginBottom: '8px' }}>
              При деактивации произойдёт следующее:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                '6 продавцов будут заблокированы',
                '140 нераспроданных карт вернутся на склад банка',
                'Новые продажи станут невозможны',
                'Текущий KPI прогресс будет заморожен',
              ].map(text => (
                <div key={text} style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2, display: 'flex', gap: '6px' }}>
                  <span style={{ color: t.text4 }}>•</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation input */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, marginBottom: '8px',
            }}>
              Введите название организации для подтверждения
            </label>
            <input
              value={confirmInput}
              onChange={e => setConfirmInput(e.target.value)}
              placeholder="Mysafar OOO"
              style={{
                width: '100%', height: '40px', padding: '0 12px',
                border: `1px solid ${t.inputBorder}`,
                borderRadius: '8px', background: t.surface,
                fontFamily: F.inter, fontSize: '14px', color: t.text1,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4, marginTop: '6px' }}>
              Введите точное название
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: '12px', padding: '16px 24px', borderTop: `1px solid ${t.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '40px', padding: '0 20px',
              border: `1px solid ${cancelHov ? t.blue : t.border}`,
              borderRadius: '8px',
              background: cancelHov ? (dark ? t.tableHover : t.blueLt) : 'transparent',
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
              color: cancelHov ? t.blue : t.text2,
              cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            onMouseEnter={() => setDeactivateHov(true)}
            onMouseLeave={() => setDeactivateHov(false)}
            disabled={!canDeactivate}
            onClick={() => { console.log('Deactivating Mysafar OOO'); onClose(); }}
            style={{
              height: '40px', padding: '0 20px',
              border: 'none', borderRadius: '8px',
              background: canDeactivate ? (deactivateHov ? errorHoverColor : t.error) : disabledRedBg,
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
              color: '#FFFFFF',
              cursor: canDeactivate ? 'pointer' : 'not-allowed',
              opacity: canDeactivate ? 1 : 0.5,
              transition: 'all 0.12s',
            }}
          >
            Деактивировать
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE LAYOUT (< 768 px)
═══════════════════════════════════════════════════════════════════════════ */

function MobileSegmented({ active, onTabChange, t }: { active: TabId; onTabChange: (id: TabId) => void; t: T }) {
  const trackBg = t.pageBg === D.pageBg ? '#2D3148' : '#F3F4F6';
  return (
    <div style={{ display: 'flex', padding: 4, borderRadius: 999, background: trackBg, height: 36, boxSizing: 'border-box' }}>
      {TABS.map(tab => {
        const isActive = active === tab.id;
        return (
          <div key={tab.id} onClick={() => onTabChange(tab.id)} style={{
            flex: 1, borderRadius: 999,
            background: isActive ? t.surface : 'transparent',
            boxShadow: isActive ? (t.pageBg === D.pageBg ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 2px rgba(17,24,39,0.08)') : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F.inter, fontSize: 13, fontWeight: 500,
            color: isActive ? t.text1 : t.text3,
            cursor: 'pointer',
          }}>
            {tab.label}
          </div>
        );
      })}
    </div>
  );
}

function MobileActionSheet({ open, onClose, dark, t, navigate }: { open: boolean; onClose: () => void; dark: boolean; t: T; navigate: (p: string) => void }) {
  if (!open) return null;
  const actions: Array<{ icon: React.ElementType; label: string; destructive?: boolean; onClick: () => void }> = [
    { icon: Pencil,      label: 'Редактировать',       onClick: () => { onClose(); navigate('/organizations/1/edit'); } },
    { icon: Users,       label: 'Назначить карты',      onClick: () => { onClose(); navigate('/card-assignment'); } },
    { icon: PauseCircle, label: 'Поставить на паузу',   onClick: onClose },
    { icon: XCircle,     label: 'Деактивировать',       destructive: true, onClick: onClose },
  ];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: dark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)' }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: t.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        boxShadow: dark ? '0 -4px 24px rgba(0,0,0,0.6)' : '0 -4px 24px rgba(17,24,39,0.15)',
        paddingBottom: 'env(safe-area-inset-bottom, 16px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: t.inputBorder }} />
        </div>
        <div style={{ padding: '8px 20px 12px', fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1 }}>
          Действия с организацией
        </div>
        {actions.map((a, i) => {
          const Icon = a.icon;
          const color = a.destructive ? t.error : t.text1;
          const iconBg = a.destructive ? (dark ? 'rgba(248,113,113,0.15)' : '#FEF2F2') : t.blueLt;
          const iconColor = a.destructive ? t.error : t.blue;
          return (
            <div key={i} onClick={a.onClick} style={{
              minHeight: 52, display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 20px', borderBottom: `1px solid ${t.border}`, cursor: 'pointer',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={iconColor} strokeWidth={2} />
              </div>
              <span style={{ fontFamily: F.inter, fontSize: 16, fontWeight: 500, color }}>{a.label}</span>
            </div>
          );
        })}
        <div style={{ padding: '12px 16px' }}>
          <button onClick={onClose} style={{
            width: '100%', height: 48, borderRadius: 12,
            background: dark ? 'rgba(160,165,184,0.12)' : '#F3F4F6',
            border: 'none', fontFamily: F.inter, fontSize: 16, fontWeight: 600, color: t.text2, cursor: 'pointer',
          }}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileSH({ text, t }: { text: string; t: T }) {
  return (
    <div style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 600, color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '20px 0 10px' }}>
      {text}
    </div>
  );
}

function MobileOrgDetail({ t, dark, navigate, activeTab, setActiveTab }: {
  t: T; dark: boolean; navigate: (p: string) => void; activeTab: TabId; setActiveTab: (id: TabId) => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const iv = iconVariant;
  const successBg = dark ? 'rgba(52,211,153,0.12)' : C.successBg;
  const successFg = dark ? '#34D399' : '#15803D';
  const greenBar = dark ? '#34D399' : '#16A34A';
  const violetBar = dark ? '#A78BFA' : '#7C3AED';

  return (
    <>
      {/* Mobile header — Y-02 V3 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        height: 56, display: 'flex', alignItems: 'center', padding: '0 4px',
        background: t.surface, borderBottom: `1px solid ${t.border}`, flexShrink: 0,
      }}>
        <div onClick={() => navigate('/organizations')} style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ChevronLeft size={24} color={t.blue} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: F.inter, fontSize: 17, fontWeight: 600, color: t.text1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          Mysafar OOO
        </div>
        <div onClick={() => setSheetOpen(true)} style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <MoreHorizontal size={24} color={t.text1} strokeWidth={1.75} />
        </div>
      </div>

      {/* Scroll content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 16px calc(80px + env(safe-area-inset-bottom, 0px))' }}>
        {/* Hero */}
        <div style={{ padding: '16px 0 12px' }}>
          <h1 style={{ fontFamily: F.dm, fontSize: 24, fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.15 }}>
            Mysafar OOO
          </h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: F.inter, fontSize: 13, fontWeight: 500, padding: '3px 10px', borderRadius: 12, background: successBg, color: successFg, whiteSpace: 'nowrap' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: successFg }} />
              Активна
            </span>
          </div>
          <div style={{ fontFamily: F.inter, fontSize: 13, color: t.text3, marginTop: 10 }}>
            Контакт: Рустам Алиев
          </div>
          <div onClick={() => {}} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, cursor: 'pointer' }}>
            <Phone size={14} color={t.blue} strokeWidth={2} />
            <span style={{ fontFamily: F.mono, fontSize: 14, color: t.blue }}>+998 90 123 45 67</span>
          </div>
        </div>

        {/* Stat cards 2×2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          {([
            { icon: CreditCard,  v: 'blue',   label: 'Карт выдано',    value: '500' },
            { icon: ShoppingBag, v: 'green',  label: 'Продано',         value: '230 (46%)' },
            { icon: CheckCircle2,v: 'violet', label: 'KPI завершено',   value: '45 (19.6%)' },
            { icon: Wallet,      v: 'amber',  label: 'Начислено',       value: '1.83M UZS' },
          ] as const).map(s => {
            const pal = iconVariant(s.v, dark);
            const Icon = s.icon;
            return (
              <div key={s.label} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: pal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icon size={20} color={pal.color} strokeWidth={2} />
                </div>
                <div style={{ fontFamily: F.inter, fontSize: 12, fontWeight: 500, color: t.text3, marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontFamily: F.dm, fontSize: 20, fontWeight: 700, color: t.text1, lineHeight: 1 }}>{s.value}</div>
              </div>
            );
          })}
        </div>

        {/* Segmented */}
        <MobileSegmented active={activeTab} onTabChange={setActiveTab} t={t} />

        {/* Tab content */}
        <div style={{ marginTop: 16 }}>
          {activeTab === 'summary' && (
            <div>
              <MobileSH text="KPI ПРОГРЕСС" t={t} />
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 16 }}>
                {([
                  { label: 'Регистрация', value: 185, total: 230, color: t.blue },
                  { label: 'Пополнение',  value: 120, total: 230, color: violetBar },
                  { label: 'Оплата 500K', value: 45,  total: 230, color: greenBar },
                ]).map((row, i, arr) => {
                  const pct = ((row.value / row.total) * 100).toFixed(1);
                  return (
                    <div key={row.label} style={{ marginBottom: i < arr.length - 1 ? 16 : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: F.inter, fontSize: 14, color: t.text2 }}>{row.label}</span>
                        <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 500, color: t.text1 }}>{row.value}/{row.total} ({pct}%)</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: dark ? D.progressTrack : '#EFF6FF', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: row.color, borderRadius: 4 }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <MobileSH text="ПОСЛЕДНЯЯ АКТИВНОСТЬ" t={t} />
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: '0 16px' }}>
                {([
                  { dot: greenBar, text: 'KPI 3 выполнен: карта …4521', time: '2 часа назад' },
                  { dot: t.blue,   text: 'KPI 2 выполнен: карта …3892', time: '5 часов назад' },
                  { dot: t.text4,  text: 'Новый продавец: Камола Р.',   time: 'вчера' },
                  { dot: t.blue,   text: 'Партия обновлена',             time: '2 дня назад' },
                  { dot: greenBar, text: 'KPI 1 выполнен: карта …2210',  time: '3 дня назад' },
                ]).map((ev, i, arr) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${ev.dot}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: ev.dot }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: F.inter, fontSize: 14, color: t.text1 }}>{ev.text}</div>
                      <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text4, marginTop: 2 }}>{ev.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sellers' && (
            <div>
              {SELLERS.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0',
                  borderBottom: `1px solid ${t.border}`, cursor: 'pointer',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.blueLt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: F.inter, fontSize: 12, fontWeight: 600, color: t.blue }}>{s.name.slice(0, 2)}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1 }}>{s.name}</div>
                    <div style={{ fontFamily: F.inter, fontSize: 13, color: t.text3, marginTop: 1 }}>{s.sold} продано · {s.k3} KPI 3</div>
                  </div>
                  <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 500, color: t.text2, flexShrink: 0 }}>{s.earned}</span>
                  <ChevronRight size={18} color={t.textDisabled} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cards' && (
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <div style={{ flex: 1, height: 40, borderRadius: 12, background: dark ? '#2D3148' : '#F3F4F6', padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Search size={16} color={t.text3} />
                  <span style={{ fontFamily: F.inter, fontSize: 14, color: t.text4 }}>Поиск карт…</span>
                </div>
              </div>
              {[
                { num: '…1001', seller: 'Абдуллох Р.', status: 'Активна', kind: 'success' as const },
                { num: '…1002', seller: 'Санжар М.',   status: 'Продана', kind: 'info' as const },
                { num: '…1003', seller: 'Нилуфар К.',  status: 'KPI 1',   kind: 'blue' as const },
                { num: '…1004', seller: 'Камола Р.',   status: 'На складе', kind: 'neutral' as const },
                { num: '…1005', seller: 'Ислом Т.',    status: 'Активна', kind: 'success' as const },
              ].map((c, i) => {
                const badgePal: Record<string, { bg: string; fg: string }> = {
                  success: dark ? { bg: 'rgba(52,211,153,0.15)', fg: '#34D399' } : { bg: '#F0FDF4', fg: '#15803D' },
                  info:    dark ? { bg: 'rgba(34,211,238,0.15)', fg: '#22D3EE' } : { bg: '#ECFEFF', fg: '#0E7490' },
                  blue:    dark ? { bg: 'rgba(59,130,246,0.15)', fg: '#3B82F6' } : { bg: '#EFF6FF', fg: '#1D4ED8' },
                  neutral: dark ? { bg: 'rgba(160,165,184,0.15)', fg: '#A0A5B8' } : { bg: '#F3F4F6', fg: '#4B5563' },
                };
                const bp = badgePal[c.kind];
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: `1px solid ${t.border}`, cursor: 'pointer' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.blueLt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CreditCard size={16} color={t.blue} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: F.mono, fontSize: 15, fontWeight: 500, color: t.text1 }}>•••• {c.num.slice(1)}</div>
                      <div style={{ fontFamily: F.inter, fontSize: 13, color: t.text3, marginTop: 1 }}>{c.seller} · VISA SUM</div>
                    </div>
                    <span style={{ fontFamily: F.inter, fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 12, background: bp.bg, color: bp.fg, whiteSpace: 'nowrap' }}>{c.status}</span>
                    <ChevronRight size={18} color={t.textDisabled} />
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'finance' && (
            <div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {([
                  { label: 'Начислено', value: '1.83M', color: t.blue },
                  { label: 'Выведено',  value: '1.2M',  color: dark ? '#34D399' : '#16A34A' },
                  { label: 'Баланс',    value: '625K',  color: dark ? '#FBBF24' : '#D97706' },
                ]).map(s => (
                  <div key={s.label} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: '10px 14px', flex: '1 1 100px' }}>
                    <div style={{ fontFamily: F.inter, fontSize: 11, color: t.text4, marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 18, fontWeight: 600, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <MobileSH text="ТРАНЗАКЦИИ" t={t} />
              {([
                { text: 'KPI 3 начисление — карта …4521', amount: '+10 000', color: dark ? '#34D399' : '#16A34A', time: '2 часа назад' },
                { text: 'KPI 2 начисление — карта …3892', amount: '+5 000',  color: dark ? '#3B82F6' : '#2563EB', time: '5 часов назад' },
                { text: 'Вывод на кошелёк — Санжар М.',   amount: '−50 000', color: dark ? '#F87171' : '#DC2626', time: 'вчера' },
                { text: 'KPI 1 начисление — карта …2210', amount: '+5 000',  color: dark ? '#3B82F6' : '#2563EB', time: '2 дня назад' },
              ]).map((tx, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: `1px solid ${t.border}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: F.inter, fontSize: 14, color: t.text1 }}>{tx.text}</div>
                    <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text4, marginTop: 2 }}>{tx.time}</div>
                  </div>
                  <span style={{ fontFamily: F.mono, fontSize: 15, fontWeight: 600, color: tx.color, flexShrink: 0 }}>{tx.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileActionSheet open={sheetOpen} onClose={() => setSheetOpen(false)} dark={dark} t={t} navigate={navigate} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function OrgDetailPage() {
  const navigate = useNavigate();
  const mobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [closeHov, setCloseHov] = useState(false);
  const [editHov, setEditHov] = useState(false);
  const [deactivateHov, setDeactivateHov] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

  const errorHoverBg   = dark ? 'rgba(248,113,113,0.12)' : C.errorBg;
  const errorTextHov   = dark ? '#F87171' : '#DC2626';
  const closeHoverBg   = dark ? D.tableHover : '#F9FAFB';
  const closeHoverBorder = dark ? D.inputBorder : '#D1D5DB';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar role="bank"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {mobile ? (
          <MobileOrgDetail t={t} dark={dark} navigate={navigate} activeTab={activeTab} setActiveTab={setActiveTab} />
        ) : (
        <>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/organizations')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Организации</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Mysafar OOO</span>
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
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: `1px solid ${t.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                {/* Org avatar */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: t.blueLt, border: `1.5px solid ${t.blueTint}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontFamily: F.dm, fontSize: '14px', fontWeight: 700, color: t.blue }}>MY</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h1 style={{
                      fontFamily: F.dm, fontSize: '22px', fontWeight: 700,
                      color: t.text1, margin: 0, lineHeight: 1.2,
                    }}>
                      Mysafar OOO
                    </h1>
                    <BadgeSuccess dark={dark}>Активна</BadgeSuccess>
                  </div>
                  <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '6px' }}>
                    Контакт: Рустам Алиев, <span style={{ fontFamily: F.mono, fontSize: '13px' }}>+998 90 123 45 67</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {/* Deactivate */}
                <button
                  onMouseEnter={() => setDeactivateHov(true)}
                  onMouseLeave={() => setDeactivateHov(false)}
                  onClick={() => setDeactivateModalOpen(true)}
                  style={{
                    height: '36px', padding: '0 14px',
                    border: `1px solid ${deactivateHov ? t.error : t.border}`,
                    borderRadius: '8px',
                    background: deactivateHov ? errorHoverBg : t.surface,
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: deactivateHov ? errorTextHov : t.text3,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.12s',
                  }}
                >
                  <AlertTriangle size={14} strokeWidth={1.75} />
                  Деактивировать
                </button>
                {/* Edit */}
                <button
                  onMouseEnter={() => setEditHov(true)}
                  onMouseLeave={() => setEditHov(false)}
                  onClick={() => navigate('/organizations/1/edit')}
                  style={{
                    height: '36px', padding: '0 14px',
                    border: `1px solid ${editHov ? t.blue : t.border}`,
                    borderRadius: '8px',
                    background: editHov ? t.blueLt : t.surface,
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: editHov ? t.blue : t.text2,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.12s',
                  }}
                >
                  <Pencil size={14} strokeWidth={1.75} />
                  Редактировать
                </button>
                {/* Close */}
                <button
                  onMouseEnter={() => setCloseHov(true)}
                  onMouseLeave={() => setCloseHov(false)}
                  onClick={() => navigate('/organizations')}
                  style={{
                    width: '36px', height: '36px',
                    border: `1px solid ${closeHov ? closeHoverBorder : t.border}`,
                    borderRadius: '8px',
                    background: closeHov ? closeHoverBg : t.surface,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                >
                  <X size={16} color={t.text3} strokeWidth={1.75} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0', padding: '0 24px' }}>
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
                      fontFamily: F.inter, fontSize: '14px',
                      fontWeight: active ? 500 : 400,
                      color: active ? t.blue : t.text3,
                      cursor: 'pointer', transition: 'all 0.12s',
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
            {activeTab === 'sellers' && <TabSellers t={t} dark={dark} />}
            {activeTab === 'cards' && <TabCards t={t} dark={dark} />}
            {activeTab === 'finance' && <TabFinance t={t} dark={dark} />}
          </div>

          <div style={{ height: '48px' }} />
        </div>
        </>
        )}
      </div>

      <DeactivateModal open={deactivateModalOpen} onClose={() => setDeactivateModalOpen(false)} t={t} dark={dark} />
    </div>
  );
}
