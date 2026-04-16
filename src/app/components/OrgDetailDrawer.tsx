import React, { useState, useEffect } from 'react';
import {
  X, CreditCard, ShoppingBag, CheckCircle2, Wallet,
  Check, Minus, Search, Plus,
} from 'lucide-react';
import { F, C, D, theme } from './ds/tokens';
import { useDarkMode } from './useDarkMode';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

export interface OrgDetail {
  id: number;
  name: string;
  contact: string;
  phone: string;
  issued: number;
  sold: number;
  kpiDone: number;
  rewarded: string;
  status: 'Активна' | 'На паузе' | 'Неактивна';
}

interface Props {
  org: OrgDetail | null;
  onClose: () => void;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS STYLES (dark-aware)
═══════════════════════════════════════════════════════════════════════════ */

const ORG_STATUS_LIGHT = {
  'Активна':   { bg: '#F0FDF4', color: '#15803D', dot: '#16A34A' },
  'На паузе':  { bg: '#FFFBEB', color: '#B45309', dot: '#D97706' },
  'Неактивна': { bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' },
} as const;

const ORG_STATUS_DARK = {
  'Активна':   { bg: 'rgba(52,211,153,0.12)',  color: '#34D399', dot: '#34D399' },
  'На паузе':  { bg: 'rgba(251,191,36,0.12)',  color: '#FBBF24', dot: '#FBBF24' },
  'Неактивна': { bg: 'rgba(248,113,113,0.12)', color: '#F87171', dot: '#F87171' },
} as const;

function StatusBadge({ status, dark }: { status: OrgDetail['status']; dark: boolean }) {
  const s = (dark ? ORG_STATUS_DARK : ORG_STATUS_LIGHT)[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: s.bg, color: s.color, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

/* Card-row status pill (inside Карты tab) */
type CardStatus = 'Активна' | 'Зарег.' | 'На складе';
const CARD_STATUS_LIGHT: Record<CardStatus, { bg: string; color: string }> = {
  'Активна':   { bg: '#F0FDF4', color: '#15803D' },
  'Зарег.':    { bg: '#ECFEFF', color: '#0E7490' },
  'На складе': { bg: '#F9FAFB', color: '#6B7280' },
};
const CARD_STATUS_DARK: Record<CardStatus, { bg: string; color: string }> = {
  'Активна':   { bg: 'rgba(52,211,153,0.12)', color: '#34D399' },
  'Зарег.':    { bg: 'rgba(34,211,238,0.12)', color: '#22D3EE' },
  'На складе': { bg: 'rgba(156,163,175,0.12)', color: '#9CA3AF' },
};

/* ═══════════════════════════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════════════════════════ */

function KpiCheck({ status, progress, t, dark }: {
  status: 'done' | 'progress' | 'none'; progress?: number; t: T; dark: boolean;
}) {
  const trackBg = dark ? D.progressTrack : '#E5E7EB';
  const doneBg  = dark ? '#34D399' : '#10B981';
  const noneCol = dark ? D.text4 : '#D1D5DB';

  if (status === 'done') return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%', background: doneBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Check size={10} color="#fff" strokeWidth={3} />
      </div>
    </div>
  );
  if (status === 'progress') return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <div style={{
        width: '40px', height: '4px', borderRadius: '2px',
        background: trackBg, overflow: 'hidden',
      }}>
        <div style={{ width: `${progress}%`, height: '100%', background: t.blue, borderRadius: '2px' }} />
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '11px', color: t.text3 }}>{progress}%</span>
    </div>
  );
  return <Minus size={13} color={noneCol} />;
}

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
  blue:   { icon: '#2563EB', iconBg: '#EFF6FF',  border: '#DBEAFE' },
  green:  { icon: '#16A34A', iconBg: '#F0FDF4',  border: '#BBF7D0' },
  violet: { icon: '#7C3AED', iconBg: '#F5F3FF',  border: '#DDD6FE' },
  amber:  { icon: '#D97706', iconBg: '#FFFBEB',  border: '#FDE68A' },
} as const;

const VARIANT_DARK = {
  blue:   { icon: '#3B82F6', iconBg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.25)'  },
  green:  { icon: '#34D399', iconBg: 'rgba(52,211,153,0.15)',  border: 'rgba(52,211,153,0.25)'  },
  violet: { icon: '#A78BFA', iconBg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.25)' },
  amber:  { icon: '#FBBF24', iconBg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.25)'  },
} as const;

function CompactStatCard({ icon: Icon, variant, label, value, t, dark }: {
  icon: React.ElementType;
  variant: keyof typeof VARIANT_LIGHT;
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
   KPI PROGRESS BAR ROW
═══════════════════════════════════════════════════════════════════════════ */

function KpiBar({ label, value, total, color, t, dark }: {
  label: string; value: number; total: number; color: string; t: T; dark: boolean;
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
   ACTIVITY TIMELINE
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

function TabSvodka({ org, t, dark }: { org: OrgDetail; t: T; dark: boolean }) {
  return (
    <div style={{ padding: '24px' }}>
      <SectionLabel text="Ключевые показатели" t={t} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '0' }}>
        <CompactStatCard icon={CreditCard}   variant="blue"   label="Карт выдано"          value={String(org.issued)} t={t} dark={dark} />
        <CompactStatCard icon={ShoppingBag}  variant="green"  label="Продано"              value={`${org.sold} (${Math.round(org.sold/org.issued*100)}%)`} t={t} dark={dark} />
        <CompactStatCard icon={CheckCircle2} variant="violet" label="KPI выполнено (все 3)" value={`${org.kpiDone} (${((org.kpiDone/org.issued)*100).toFixed(1)}%)`} t={t} dark={dark} />
        <CompactStatCard icon={Wallet}       variant="amber"  label="Начислено"             value={`${org.rewarded} UZS`} t={t} dark={dark} />
      </div>

      <Divider t={t} />

      <SectionLabel text="KPI прогресс" t={t} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <KpiBar label="Регистрация" value={185} total={org.sold} color={dark ? '#3B82F6' : '#2563EB'} t={t} dark={dark} />
        <KpiBar label="Пополнение"  value={120} total={org.sold} color={dark ? '#A78BFA' : '#7C3AED'} t={t} dark={dark} />
        <KpiBar label="Оплата 500K" value={org.kpiDone} total={org.sold} color={dark ? '#34D399' : '#10B981'} t={t} dark={dark} />
      </div>

      <Divider t={t} />

      <SectionLabel text="Последняя активность" t={t} />
      <Timeline t={t} items={[
        { dot: dark ? '#34D399' : '#16A34A', text: 'Карта ...4521 — KPI 3 выполнен (512 000 UZS)', time: '2 часа назад' },
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

  const rowHoverBg  = dark ? D.tableHover : '#F9FAFB';
  const headerBg    = dark ? D.tableHeaderBg : C.pageBg;

  const filtered = SELLERS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} color={focused ? t.blue : t.text4} style={{
            position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
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
            fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: '#fff',
            display: 'flex', alignItems: 'center', gap: '6px',
            cursor: 'pointer', transition: 'background 0.12s',
            boxShadow: '0 1px 3px rgba(37,99,235,0.18)',
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
                  padding: '10px 12px', textAlign: h === 'Заработано' ? 'right' : 'left',
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
                  <td style={{ padding: '11px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: t.blueLt, border: `1px solid ${t.blueTint}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <span style={{ fontFamily: F.inter, fontSize: '9px', fontWeight: 700, color: t.blue }}>
                          {s.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text1, fontWeight: 500 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 12px' }}><span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{s.cards}</span></td>
                  <td style={{ padding: '11px 12px' }}><span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{s.sold}</span></td>
                  <td style={{ padding: '11px 12px' }}><span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{s.k1}</span></td>
                  <td style={{ padding: '11px 12px' }}><span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{s.k2}</span></td>
                  <td style={{ padding: '11px 12px' }}><span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>{s.k3}</span></td>
                  <td style={{ padding: '11px 12px', textAlign: 'right' }}>
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

interface CardDataRow {
  num: string;
  seller: string;
  client: string;
  statusLabel: CardStatus;
  k1: 'done' | 'progress' | 'none';
  k2: 'done' | 'progress' | 'none';
  k3: { p: number; label: string };
}

const CARDS_DATA: CardDataRow[] = [
  { num: '...1001', seller: 'Абдуллох', client: 'Алишер Н.', statusLabel: 'Активна',   k1: 'done', k2: 'done', k3: { p: 100, label: '510K' } },
  { num: '...1002', seller: 'Абдуллох', client: 'Дилшод К.', statusLabel: 'Зарег.',    k1: 'done', k2: 'done', k3: { p: 64,  label: '64%'  } },
  { num: '...1003', seller: '—',        client: '—',          statusLabel: 'На складе', k1: 'none', k2: 'none', k3: { p: 0,   label: '—'   } },
];

function TabCards({ t, dark }: { t: T; dark: boolean }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);

  const rowHoverBg = dark ? D.tableHover : '#F9FAFB';
  const headerBg   = dark ? D.tableHeaderBg : C.pageBg;
  const statusMap  = dark ? CARD_STATUS_DARK : CARD_STATUS_LIGHT;

  return (
    <div style={{ padding: '24px' }}>
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
          <span style={{
            position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none', fontSize: '10px', color: t.text4,
          }}>▾</span>
        </div>

        <div style={{ position: 'relative', flex: 1, minWidth: '120px' }}>
          <Search size={14} color={focused ? t.blue : t.text4} style={{
            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
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
                  padding: '10px 12px', textAlign: 'left',
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
              const cs = statusMap[card.statusLabel];
              return (
                <tr key={card.num}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: i < CARDS_DATA.length - 1 ? `1px solid ${t.border}` : 'none',
                    background: hov ? rowHoverBg : t.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: t.text1 }}>{card.num}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{card.seller}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{card.client}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '8px',
                      background: cs.bg, color: cs.color, whiteSpace: 'nowrap',
                    }}>
                      {card.statusLabel}
                    </span>
                  </td>
                  <td style={{ padding: '11px 12px' }}><KpiCheck status={card.k1} t={t} dark={dark} /></td>
                  <td style={{ padding: '11px 12px' }}><KpiCheck status={card.k2} t={t} dark={dark} /></td>
                  <td style={{ padding: '11px 12px' }}>
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

function TabFinance({ org, t, dark }: { org: OrgDetail; t: T; dark: boolean }) {
  const [hovRow, setHovRow] = useState<number | null>(null);

  const rowHoverBg   = dark ? D.tableHover : '#F9FAFB';
  const headerBg     = dark ? D.tableHeaderBg : C.pageBg;
  const balanceColor = dark ? '#34D399' : '#15803D';
  const successBg    = dark ? 'rgba(52,211,153,0.12)' : '#F0FDF4';
  const successText  = dark ? '#34D399' : '#15803D';

  return (
    <div style={{ padding: '24px' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px', marginBottom: '24px',
      }}>
        {[
          { label: 'Всего начислено', value: `${org.rewarded} UZS`, color: t.text1 },
          { label: 'Выведено',        value: '1 200 000 UZS',       color: t.text1 },
          { label: 'Баланс',          value: '625 000 UZS',         color: balanceColor },
        ].map(stat => (
          <div key={stat.label} style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '10px', padding: '14px 16px',
          }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text3, marginBottom: '6px' }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: F.mono, fontSize: '15px', fontWeight: 700, color: stat.color, lineHeight: 1.2 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <SectionLabel text="История выплат" t={t} />
      <div style={{ border: `1px solid ${t.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: headerBg, borderBottom: `1px solid ${t.border}` }}>
              {[
                { label: 'Дата',    align: 'left'  },
                { label: 'Продавец',align: 'left'  },
                { label: 'Карта',   align: 'left'  },
                { label: 'KPI',     align: 'left'  },
                { label: 'Сумма',   align: 'right' },
                { label: 'Статус',  align: 'left'  },
              ].map(h => (
                <th key={h.label} style={{
                  padding: '10px 12px', textAlign: h.align as any,
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
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '12px', color: t.text3 }}>{row.date}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{row.seller}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: t.text1 }}>{row.card}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '8px',
                      background: t.blueLt, color: t.blue, whiteSpace: 'nowrap',
                    }}>
                      {row.kpi}
                    </span>
                  </td>
                  <td style={{ padding: '11px 12px', textAlign: 'right' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: t.text1 }}>
                      {row.amount}
                    </span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '8px',
                      background: successBg, color: successText, whiteSpace: 'nowrap',
                    }}>
                      {row.status}
                    </span>
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
   MAIN DRAWER
═══════════════════════════════════════════════════════════════════════════ */

const TABS = ['Сводка', 'Продавцы', 'Карты', 'Финансы'] as const;
type TabKey = typeof TABS[number];

export function OrgDetailDrawer({ org, onClose }: Props) {
  const [darkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  const [activeTab, setActiveTab] = useState<TabKey>('Сводка');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (org) {
      setActiveTab('Сводка');
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [org]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  if (!org) return null;

  const backdropBg = dark ? 'rgba(0,0,0,0.55)' : 'rgba(17,24,39,0.35)';
  const drawerShadow = dark ? '-8px 0 32px rgba(0,0,0,0.55)' : '-8px 0 32px rgba(0,0,0,0.10)';
  const closeHoverBg     = dark ? D.tableHover : '#F3F4F6';
  const closeHoverBorder = dark ? '#4A4F63'    : '#9CA3AF';

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 80,
          background: backdropBg,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.22s ease',
          backdropFilter: 'blur(1px)',
        }}
      />

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '640px', zIndex: 90,
        background: t.surface,
        borderLeft: `1px solid ${t.border}`,
        display: 'flex', flexDirection: 'column',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.26s cubic-bezier(0.32, 0, 0.16, 1)',
        boxShadow: drawerShadow,
      }}>

        {/* ── Drawer Header ───────────────────────────── */}
        <div style={{
          padding: '20px 24px 0',
          borderBottom: `1px solid ${t.border}`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: t.blueLt, border: `1.5px solid ${t.blueTint}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontFamily: F.dm, fontSize: '14px', fontWeight: 700, color: t.blue }}>
                  {org.name.slice(0, 2).toUpperCase()}
                </span>
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 700, color: t.text1 }}>
                    {org.name}
                  </span>
                  <StatusBadge status={org.status} dark={dark} />
                </div>
                <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, marginTop: '4px' }}>
                  Контакт: {org.contact}, {org.phone}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: `1px solid ${t.border}`, background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, marginLeft: '12px',
                transition: 'background 0.12s, border-color 0.12s',
              }}
              onMouseEnter={e => { (e.currentTarget.style.background = closeHoverBg); (e.currentTarget.style.borderColor = closeHoverBorder); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'transparent'); (e.currentTarget.style.borderColor = t.border); }}
            >
              <X size={15} color={t.text3} strokeWidth={1.75} />
            </button>
          </div>

          {/* ── Tabs bar ── */}
          <div style={{ display: 'flex', gap: '0', marginTop: '16px' }}>
            {TABS.map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 18px',
                    border: 'none', background: 'none',
                    fontFamily: F.inter, fontSize: '13px', fontWeight: isActive ? 600 : 400,
                    color: isActive ? t.blue : t.text3,
                    cursor: 'pointer',
                    borderBottom: isActive ? `2px solid ${t.blue}` : '2px solid transparent',
                    marginBottom: '-1px',
                    transition: 'color 0.12s, border-color 0.12s',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget.style.color = t.text1); }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget.style.color = t.text3); }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Scrollable content ───────────────────────── */}
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          scrollbarWidth: 'thin', scrollbarColor: `${t.border} transparent`,
        }}>
          {activeTab === 'Сводка'   && <TabSvodka   org={org} t={t} dark={dark} />}
          {activeTab === 'Продавцы' && <TabSellers  t={t} dark={dark} />}
          {activeTab === 'Карты'    && <TabCards    t={t} dark={dark} />}
          {activeTab === 'Финансы'  && <TabFinance  org={org} t={t} dark={dark} />}
        </div>
      </div>
    </>
  );
}
