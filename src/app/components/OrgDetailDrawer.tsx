import React, { useState, useEffect, useRef } from 'react';
import {
  X, CreditCard, ShoppingBag, CheckCircle2, Wallet,
  Check, Minus, Search, Plus, User,
} from 'lucide-react';
import { F, C } from './ds/tokens';

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
   SMALL REUSABLE ATOMS
═══════════════════════════════════════════════════════════════════════════ */

const STATUS_STYLE = {
  'Активна':   { bg: '#F0FDF4', color: '#15803D', dot: '#16A34A' },
  'На паузе':  { bg: '#FFFBEB', color: '#B45309', dot: '#D97706' },
  'Неактивна': { bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' },
} as const;

function StatusBadge({ status }: { status: OrgDetail['status'] }) {
  const s = STATUS_STYLE[status];
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

function KpiCheck({ status, progress }: { status: 'done' | 'progress' | 'none'; progress?: number }) {
  if (status === 'done') return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Check size={10} color="#fff" strokeWidth={3} />
      </div>
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
  blue:   { icon: C.blue,    iconBg: C.blueLt,    border: C.blueTint  },
  green:  { icon: '#16A34A', iconBg: '#F0FDF4',   border: '#BBF7D0'   },
  violet: { icon: '#7C3AED', iconBg: '#F5F3FF',   border: '#DDD6FE'   },
  amber:  { icon: '#D97706', iconBg: '#FFFBEB',   border: '#FDE68A'   },
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
   KPI PROGRESS BAR ROW
═══════════════════════════════════════════════════════════════════════════ */

function KpiBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>{value} из {total}</span>
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
   ACTIVITY TIMELINE
═══════════════════════════════════════════════════════════════════════════ */

function Timeline({ items }: { items: { dot: string; text: string; time: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '14px', position: 'relative' }}>
          {/* Line */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.dot, marginTop: '4px', flexShrink: 0 }} />
            {i < items.length - 1 && (
              <div style={{ width: '1px', flex: 1, background: C.border, minHeight: '24px', margin: '4px 0' }} />
            )}
          </div>
          {/* Content */}
          <div style={{ paddingBottom: i < items.length - 1 ? '16px' : '0', minWidth: 0 }}>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1, lineHeight: 1.4 }}>
              {item.text}
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4, marginTop: '2px' }}>
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

function TabSvodka({ org }: { org: OrgDetail }) {
  return (
    <div style={{ padding: '24px' }}>
      {/* 2×2 Stat grid */}
      <SectionLabel text="Ключевые показатели" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '0' }}>
        <CompactStatCard icon={CreditCard}   variant="blue"   label="Карт выдано"          value={String(org.issued)} />
        <CompactStatCard icon={ShoppingBag}  variant="green"  label="Продано"               value={`${org.sold} (${Math.round(org.sold/org.issued*100)}%)`} />
        <CompactStatCard icon={CheckCircle2} variant="violet" label="KPI выполнено (все 3)" value={`${org.kpiDone} (${((org.kpiDone/org.issued)*100).toFixed(1)}%)`} />
        <CompactStatCard icon={Wallet}       variant="amber"  label="Начислено"             value={`${org.rewarded} UZS`} />
      </div>

      <Divider />

      {/* KPI Progress */}
      <SectionLabel text="KPI прогресс" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <KpiBar label="Регистрация"  value={185} total={org.sold} color="#2563EB" />
        <KpiBar label="Пополнение"   value={120} total={org.sold} color="#7C3AED" />
        <KpiBar label="Оплата 500K"  value={org.kpiDone} total={org.sold} color="#10B981" />
      </div>

      <Divider />

      {/* Activity Timeline */}
      <SectionLabel text="Последняя активность" />
      <Timeline items={[
        { dot: '#16A34A', text: 'Карта ...4521 — KPI 3 выполнен (512 000 UZS)', time: '2 часа назад' },
        { dot: C.blue,    text: 'Карта ...3892 — KPI 2 выполнен', time: '5 часов назад' },
        { dot: C.text4,   text: 'Новый продавец добавлен: Камола Р.', time: 'вчера' },
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

function TabSellers() {
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);
  const [addHov, setAddHov] = useState(false);

  const filtered = SELLERS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '24px' }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} color={focused ? C.blue : C.text4} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Поиск продавца..."
            style={{
              width: '100%', height: '36px', paddingLeft: '34px', paddingRight: '10px',
              border: `1px solid ${focused ? C.blue : C.inputBorder}`,
              borderRadius: '8px', background: C.surface,
              fontFamily: F.inter, fontSize: '13px', color: C.text1,
              outline: 'none', boxSizing: 'border-box',
              boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
              transition: 'all 0.12s',
            }}
          />
        </div>
        <button
          onMouseEnter={() => setAddHov(true)}
          onMouseLeave={() => setAddHov(false)}
          style={{
            height: '36px', padding: '0 14px', flexShrink: 0,
            background: addHov ? C.blueHover : C.blue,
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

      {/* Table */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.pageBg, borderBottom: `1px solid ${C.border}` }}>
              {['Продавец', 'Карт', 'Продано', 'KPI 1', 'KPI 2', 'KPI 3', 'Заработано'].map(h => (
                <th key={h} style={{
                  padding: '10px 12px', textAlign: h === 'Заработано' ? 'right' : 'left',
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: C.text4,
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
                    borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                    background: hov ? '#F9FAFB' : C.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={{ padding: '11px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: C.blueLt, border: `1px solid ${C.blueTint}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: F.inter, fontSize: '9px', fontWeight: 700, color: C.blue }}>
                          {s.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1, fontWeight: 500 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{s.cards}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{s.sold}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{s.k1}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{s.k2}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{s.k3}</span>
                  </td>
                  <td style={{ padding: '11px 12px', textAlign: 'right' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: C.text1 }}>{s.earned}</span>
                    <span style={{ fontFamily: F.inter, fontSize: '10px', color: C.text4, marginLeft: '3px' }}>UZS</span>
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

const CARDS_DATA = [
  { num: '...1001', seller: 'Абдуллох', client: 'Алишер Н.',  statusLabel: 'Активна',   statusBg: '#F0FDF4', statusColor: '#15803D', k1: 'done' as const,     k2: 'done' as const,     k3: { p: 100, label: '510K' } },
  { num: '...1002', seller: 'Абдуллох', client: 'Дилшод К.',  statusLabel: 'Зарег.',    statusBg: '#ECFEFF', statusColor: '#0E7490', k1: 'done' as const,     k2: 'done' as const,     k3: { p: 64,  label: '64%'  } },
  { num: '...1003', seller: '—',        client: '—',           statusLabel: 'На складе', statusBg: '#F9FAFB', statusColor: '#6B7280', k1: 'none' as const,     k2: 'none' as const,     k3: { p: 0,   label: '—'   } },
];

function TabCards() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);

  return (
    <div style={{ padding: '24px' }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        {/* Filter select */}
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
            {['На складе', 'У продавца', 'Продана', 'Зарег.', 'Активна'].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '10px', color: C.text4 }}>▾</span>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '120px' }}>
          <Search size={14} color={focused ? C.blue : C.text4} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Поиск по карте..."
            style={{
              width: '100%', height: '36px', paddingLeft: '32px', paddingRight: '10px',
              border: `1px solid ${focused ? C.blue : C.inputBorder}`,
              borderRadius: '8px', background: C.surface,
              fontFamily: F.inter, fontSize: '13px', color: C.text1,
              outline: 'none', boxSizing: 'border-box',
              boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
              transition: 'all 0.12s',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.pageBg, borderBottom: `1px solid ${C.border}` }}>
              {['Карта', 'Продавец', 'Клиент', 'Статус', 'KPI 1', 'KPI 2', 'KPI 3'].map(h => (
                <th key={h} style={{
                  padding: '10px 12px', textAlign: 'left',
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: C.text4,
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
              return (
                <tr key={card.num}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: i < CARDS_DATA.length - 1 ? `1px solid ${C.border}` : 'none',
                    background: hov ? '#F9FAFB' : C.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: C.text1 }}>{card.num}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{card.seller}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{card.client}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '8px',
                      background: card.statusBg, color: card.statusColor, whiteSpace: 'nowrap',
                    }}>
                      {card.statusLabel}
                    </span>
                  </td>
                  <td style={{ padding: '11px 12px' }}><KpiCheck status={card.k1} /></td>
                  <td style={{ padding: '11px 12px' }}><KpiCheck status={card.k2} /></td>
                  <td style={{ padding: '11px 12px' }}>
                    {card.k3.p === 100 ? <KpiCheck status="done" /> :
                     card.k3.p > 0 ? <KpiCheck status="progress" progress={card.k3.p} /> :
                     <KpiCheck status="none" />}
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

function TabFinance({ org }: { org: OrgDetail }) {
  const [hovRow, setHovRow] = useState<number | null>(null);

  return (
    <div style={{ padding: '24px' }}>
      {/* Summary row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px', marginBottom: '24px',
      }}>
        {[
          { label: 'Всего начислено', value: `${org.rewarded} UZS`, color: C.text1 },
          { label: 'Выведено',        value: '1 200 000 UZS',       color: C.text1 },
          { label: 'Баланс',          value: '625 000 UZS',         color: '#15803D' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '10px', padding: '14px 16px',
          }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text3, marginBottom: '6px' }}>
              {stat.label}
            </div>
            <div style={{ fontFamily: F.mono, fontSize: '15px', fontWeight: 700, color: stat.color, lineHeight: 1.2 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <SectionLabel text="История выплат" />
      <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.pageBg, borderBottom: `1px solid ${C.border}` }}>
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
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: C.text4,
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
                    borderBottom: i < FIN_ROWS.length - 1 ? `1px solid ${C.border}` : 'none',
                    background: hov ? '#F9FAFB' : C.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text3 }}>{row.date}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{row.seller}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: C.text1 }}>{row.card}</span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '8px',
                      background: C.blueLt, color: C.blue, whiteSpace: 'nowrap',
                    }}>
                      {row.kpi}
                    </span>
                  </td>
                  <td style={{ padding: '11px 12px', textAlign: 'right' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: C.text1 }}>
                      {row.amount}
                    </span>
                  </td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '8px',
                      background: '#F0FDF4', color: '#15803D', whiteSpace: 'nowrap',
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
  const [activeTab, setActiveTab] = useState<TabKey>('Сводка');
  const [visible, setVisible] = useState(false);

  /* Animate in */
  useEffect(() => {
    if (org) {
      setActiveTab('Сводка');
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [org]);

  /* Escape key */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  if (!org) return null;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 80,
          background: 'rgba(17, 24, 39, 0.35)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.22s ease',
          backdropFilter: 'blur(1px)',
        }}
      />

      {/* ── Drawer panel ── */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '640px', zIndex: 90,
        background: C.surface,
        borderLeft: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.26s cubic-bezier(0.32, 0, 0.16, 1)',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.10)',
      }}>

        {/* ── Drawer Header ───────────────────────────── */}
        <div style={{
          padding: '20px 24px 0',
          borderBottom: `1px solid ${C.border}`,
          flexShrink: 0,
        }}>
          {/* Top row: avatar + name + status + close */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              {/* Org avatar */}
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: C.blueLt, border: `1.5px solid ${C.blueTint}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontFamily: F.dm, fontSize: '14px', fontWeight: 700, color: C.blue }}>
                  {org.name.slice(0, 2).toUpperCase()}
                </span>
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 700, color: C.text1 }}>
                    {org.name}
                  </span>
                  <StatusBadge status={org.status} />
                </div>
                <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3, marginTop: '4px' }}>
                  Контакт: {org.contact}, {org.phone}
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: `1px solid ${C.border}`, background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0, marginLeft: '12px',
                transition: 'background 0.12s, border-color 0.12s',
              }}
              onMouseEnter={e => { (e.currentTarget.style.background = '#F3F4F6'); (e.currentTarget.style.borderColor = '#9CA3AF'); }}
              onMouseLeave={e => { (e.currentTarget.style.background = 'transparent'); (e.currentTarget.style.borderColor = C.border); }}
            >
              <X size={15} color={C.text3} strokeWidth={1.75} />
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
                    color: isActive ? C.blue : C.text3,
                    cursor: 'pointer',
                    borderBottom: isActive ? `2px solid ${C.blue}` : '2px solid transparent',
                    marginBottom: '-1px',
                    transition: 'color 0.12s, border-color 0.12s',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget.style.color = C.text1); }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget.style.color = C.text3); }}
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
          scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent`,
        }}>
          {activeTab === 'Сводка'   && <TabSvodka  org={org} />}
          {activeTab === 'Продавцы' && <TabSellers />}
          {activeTab === 'Карты'    && <TabCards   />}
          {activeTab === 'Финансы'  && <TabFinance org={org} />}
        </div>
      </div>
    </>
  );
}
