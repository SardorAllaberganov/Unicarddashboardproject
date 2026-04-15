import React, { useState } from 'react';
import {
  X, CreditCard, ShoppingBag, CheckCircle2, Wallet,
  Check, Minus, Search, ChevronDown, ChevronRight, Plus,
  Pencil, AlertTriangle,
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
      background: C.successBg, color: '#15803D', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.success, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function BadgeBlue({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '2px 8px', borderRadius: '8px',
      background: C.blueLt, color: C.blue, whiteSpace: 'nowrap',
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

function KpiCheck({ status, progress }: { status: 'done' | 'progress' | 'none'; progress?: number }) {
  if (status === 'done') return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: C.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

function KpiBar({ label, value, total, color }: {
  label: string; value: number; total: number; color: string;
}) {
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
   TIMELINE
═══════════════════════════════════════════════════════════════════════════ */

function Timeline({ items }: { items: { dot: string; text: string; time: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '14px', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.dot, marginTop: '4px', flexShrink: 0 }} />
            {i < items.length - 1 && (
              <div style={{ width: '1px', flex: 1, background: C.border, minHeight: '24px', margin: '4px 0' }} />
            )}
          </div>
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

function TabSvodka() {
  return (
    <div>
      <SectionLabel text="Ключевые показатели" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <CompactStatCard icon={CreditCard}   variant="blue"   label="Карт выдано"          value="500" />
        <CompactStatCard icon={ShoppingBag}  variant="green"  label="Продано"               value="230 (46%)" />
        <CompactStatCard icon={CheckCircle2} variant="violet" label="KPI выполнено (все 3)" value="45 (19.6%)" />
        <CompactStatCard icon={Wallet}       variant="amber"  label="Начислено"             value="1 825 000 UZS" />
      </div>

      <Divider />

      <SectionLabel text="KPI прогресс" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <KpiBar label="Регистрация"  value={185} total={230} color="#2563EB" />
        <KpiBar label="Пополнение"   value={120} total={230} color="#7C3AED" />
        <KpiBar label="Оплата 500K"  value={45}  total={230} color="#10B981" />
      </div>

      <Divider />

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
    <div>
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
            <tr style={{ background: '#FAFBFC', borderBottom: `1px solid ${C.border}` }}>
              {['Продавец', 'Карт', 'Продано', 'KPI 1', 'KPI 2', 'KPI 3', 'Заработано'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: h === 'Заработано' ? 'right' : 'left',
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
                    background: hov ? '#FAFBFC' : C.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: C.blueLt, border: `1px solid ${C.blueTint}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: F.inter, fontSize: '9px', fontWeight: 700, color: C.blue }}>
                          {s.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1, fontWeight: 500 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{s.cards}</span></td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{s.sold}</span></td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{s.k1}</span></td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{s.k2}</span></td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>{s.k3}</span></td>
                  <td style={{ ...td, textAlign: 'right' }}>
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
  { num: '...1001', seller: 'Абдуллох', client: 'Алишер Н.',  statusLabel: 'Активна',   statusBg: '#F0FDF4', statusColor: '#15803D', k1: 'done' as const,  k2: 'done' as const,  k3: { p: 100, label: '510K' } },
  { num: '...1002', seller: 'Абдуллох', client: 'Дилшод К.',  statusLabel: 'Зарег.',    statusBg: '#ECFEFF', statusColor: '#0E7490', k1: 'done' as const,  k2: 'done' as const,  k3: { p: 64,  label: '64%'  } },
  { num: '...1003', seller: '—',        client: '—',           statusLabel: 'На складе', statusBg: '#F9FAFB', statusColor: '#6B7280', k1: 'none' as const,  k2: 'none' as const,  k3: { p: 0,   label: '—'   } },
];

function TabCards() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
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
          <ChevronDown size={13} color={C.text4} style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
        </div>
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
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
            <tr style={{ background: '#FAFBFC', borderBottom: `1px solid ${C.border}` }}>
              {['Карта', 'Продавец', 'Клиент', 'Статус', 'KPI 1', 'KPI 2', 'KPI 3'].map(h => (
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
            {CARDS_DATA.map((card, i) => {
              const hov = hovRow === i;
              return (
                <tr key={card.num}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: i < CARDS_DATA.length - 1 ? `1px solid ${C.border}` : 'none',
                    background: hov ? '#FAFBFC' : C.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: C.text1 }}>{card.num}</span></td>
                  <td style={td}><span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{card.seller}</span></td>
                  <td style={td}><span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{card.client}</span></td>
                  <td style={td}>
                    <span style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '8px',
                      background: card.statusBg, color: card.statusColor, whiteSpace: 'nowrap',
                    }}>
                      {card.statusLabel}
                    </span>
                  </td>
                  <td style={td}><KpiCheck status={card.k1} /></td>
                  <td style={td}><KpiCheck status={card.k2} /></td>
                  <td style={td}>
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

function TabFinance() {
  const [hovRow, setHovRow] = useState<number | null>(null);

  return (
    <div>
      {/* Summary */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', padding: '20px 24px', marginBottom: '24px',
      }}>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginBottom: '6px' }}>
          Всего начислено
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '28px', fontWeight: 700, color: C.text1, lineHeight: 1.2 }}>
          1 825 000 <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text3 }}>UZS</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
          <div>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Выведено: </span>
            <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: C.text1 }}>1 200 000</span>
          </div>
          <div>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Баланс: </span>
            <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: '#15803D' }}>625 000</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <SectionLabel text="История выплат" />
      <div style={{ border: `1px solid ${C.border}`, borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFBFC', borderBottom: `1px solid ${C.border}` }}>
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
                    background: hov ? '#FAFBFC' : C.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text3 }}>{row.date}</span></td>
                  <td style={td}><span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{row.seller}</span></td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: C.text1 }}>{row.card}</span></td>
                  <td style={td}><BadgeBlue>{row.kpi}</BadgeBlue></td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: C.text1 }}>{row.amount}</span>
                  </td>
                  <td style={td}><BadgeSuccess>{row.status}</BadgeSuccess></td>
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

function DeactivateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [confirmInput, setConfirmInput] = useState('');
  const [cancelHov, setCancelHov] = useState(false);
  const [deactivateHov, setDeactivateHov] = useState(false);

  if (!open) return null;

  const canDeactivate = confirmInput === 'Mysafar OOO';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '16px', width: '480px', maxWidth: '90vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={24} color={C.warning} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1 }}>
              Деактивировать организацию
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px',
              border: `1px solid ${C.border}`, borderRadius: '8px',
              background: C.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <p style={{
            fontFamily: F.inter, fontSize: '14px', color: C.text2,
            margin: '0 0 16px',
          }}>
            Вы уверены, что хотите деактивировать организацию?
          </p>

          {/* Warning card */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.warning}`,
            borderRadius: '8px', padding: '16px', marginBottom: '20px',
          }}>
            <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1, marginBottom: '8px' }}>
              Mysafar OOO
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginBottom: '8px' }}>
              При деактивации произойдёт следующее:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                '6 продавцов будут заблокированы',
                '140 нераспроданных карт вернутся на склад банка',
                'Новые продажи станут невозможны',
                'Текущий KPI прогресс будет заморожен',
              ].map(text => (
                <div key={text} style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>
                  • {text}
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation input */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Введите название организации для подтверждения
            </label>
            <input
              value={confirmInput}
              onChange={e => setConfirmInput(e.target.value)}
              placeholder="Mysafar OOO"
              style={{
                width: '100%', height: '40px', padding: '0 12px',
                border: `1px solid ${C.inputBorder}`,
                borderRadius: '8px', background: C.surface,
                fontFamily: F.inter, fontSize: '14px', color: C.text1,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4, marginTop: '6px' }}>
              Введите точное название
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: '12px', padding: '16px 24px', borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '40px', padding: '0 20px',
              border: `1px solid ${cancelHov ? C.blue : C.border}`,
              borderRadius: '8px',
              background: cancelHov ? C.blueLt : C.surface,
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
              color: cancelHov ? C.blue : C.text2,
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
              background: canDeactivate ? (deactivateHov ? '#DC2626' : C.error) : C.border,
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
              color: '#FFFFFF',
              cursor: canDeactivate ? 'pointer' : 'not-allowed',
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

export default function OrgDetailPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [closeHov, setCloseHov] = useState(false);
  const [editHov, setEditHov] = useState(false);
  const [deactivateHov, setDeactivateHov] = useState(false);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar role="bank"
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
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/organizations')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Организации</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Mysafar OOO</span>
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
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                {/* Org avatar */}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: C.blueLt, border: `1.5px solid ${C.blueTint}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontFamily: F.dm, fontSize: '14px', fontWeight: 700, color: C.blue }}>MY</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h1 style={{
                      fontFamily: F.dm, fontSize: '22px', fontWeight: 700,
                      color: C.text1, margin: 0, lineHeight: 1.2,
                    }}>
                      Mysafar OOO
                    </h1>
                    <BadgeSuccess>Активна</BadgeSuccess>
                  </div>
                  <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '6px' }}>
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
                    border: `1px solid ${deactivateHov ? C.error : C.border}`,
                    borderRadius: '8px',
                    background: deactivateHov ? C.errorBg : C.surface,
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: deactivateHov ? '#DC2626' : C.text3,
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
                    border: `1px solid ${editHov ? C.blue : C.border}`,
                    borderRadius: '8px',
                    background: editHov ? C.blueLt : C.surface,
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: editHov ? C.blue : C.text2,
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
                    border: `1px solid ${closeHov ? '#D1D5DB' : C.border}`,
                    borderRadius: '8px',
                    background: closeHov ? '#F9FAFB' : C.surface,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                >
                  <X size={16} color={C.text3} strokeWidth={1.75} />
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
                      borderBottom: active ? `2px solid ${C.blue}` : '2px solid transparent',
                      background: 'none',
                      fontFamily: F.inter, fontSize: '14px',
                      fontWeight: active ? 500 : 400,
                      color: active ? C.blue : C.text3,
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
            {activeTab === 'summary' && <TabSvodka />}
            {activeTab === 'sellers' && <TabSellers />}
            {activeTab === 'cards' && <TabCards />}
            {activeTab === 'finance' && <TabFinance />}
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      <DeactivateModal open={deactivateModalOpen} onClose={() => setDeactivateModalOpen(false)} />
    </div>
  );
}
