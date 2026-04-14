import React, { useState } from 'react';
import {
  ChevronRight, ChevronDown, Search, Check,
  Wallet, CheckCircle, ArrowDownToLine, Coins,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { DateRangePicker } from '../components/DateRangePicker';

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

const VARIANTS = {
  green:  { icon: '#16A34A', iconBg: '#F0FDF4', border: '#BBF7D0' },
  blue:   { icon: C.blue,    iconBg: C.blueLt,  border: C.blueTint },
  amber:  { icon: '#D97706', iconBg: '#FFFBEB', border: '#FDE68A' },
  violet: { icon: '#7C3AED', iconBg: '#F5F3FF', border: '#DDD6FE' },
} as const;

function StatCard({ icon: Icon, variant, label, value }: {
  icon: React.ElementType;
  variant: keyof typeof VARIANTS;
  label: string;
  value: string;
}) {
  const v = VARIANTS[variant];
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: v.iconBg, border: `1px solid ${v.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={v.icon} strokeWidth={1.75} />
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text3, marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '28px', fontWeight: 700, color: C.text1, lineHeight: 1.2 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HORIZONTAL BAR CHART
═══════════════════════════════════════════════════════════════════════════ */

const SELLER_BARS = [
  { name: 'Санжар',    value: 555000 },
  { name: 'Ислом',     value: 350000 },
  { name: 'Абдуллох',  value: 330000 },
  { name: 'Нилуфар',   value: 255000 },
  { name: 'Дарья',     value: 210000 },
  { name: 'Камола',    value: 125000 },
];

function SellerBarChart() {
  const max = Math.max(...SELLER_BARS.map(b => b.value));

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '24px',
    }}>
      <div style={{
        fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
        color: C.text1, marginBottom: '20px',
      }}>
        По продавцам
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {SELLER_BARS.map(bar => {
          const pct = (bar.value / max) * 100;
          return (
            <div key={bar.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontFamily: F.inter, fontSize: '14px', color: C.text2,
                width: '80px', flexShrink: 0, textAlign: 'right',
              }}>
                {bar.name}
              </span>
              <div style={{
                flex: 1, height: '8px', borderRadius: '4px',
                background: '#E5E7EB', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${pct}%`, height: '100%', borderRadius: '4px',
                  background: C.blue, transition: 'width 0.4s ease',
                }} />
              </div>
              <span style={{
                fontFamily: F.mono, fontSize: '14px', fontWeight: 600,
                color: C.text1, width: '90px', flexShrink: 0, textAlign: 'right',
              }}>
                {bar.value.toLocaleString('ru-RU')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI BREAKDOWN
═══════════════════════════════════════════════════════════════════════════ */

const KPI_ROWS = [
  { label: 'KPI 1 — Регистрация', value: 925000, detail: '185 × 5 000', pct: 51 },
  { label: 'KPI 2 — Пополнение',  value: 600000, detail: '120 × 5 000', pct: 33 },
  { label: 'KPI 3 — Оплата 500K', value: 450000, detail: '45 × 10 000', pct: 25 },
];

function KpiBreakdown() {
  const colors = ['#2563EB', '#7C3AED', '#10B981'];

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '24px',
      display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box',
    }}>
      <div style={{
        fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
        color: C.text1, marginBottom: '20px',
      }}>
        По KPI этапам
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
        {KPI_ROWS.map((row, i) => (
          <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{row.label}</span>
              <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: C.text1 }}>
                {row.value.toLocaleString('ru-RU')} UZS
              </span>
            </div>
            <div style={{ height: '6px', borderRadius: '3px', background: '#F3F4F6', overflow: 'hidden' }}>
              <div style={{
                width: `${row.pct}%`, height: '100%', borderRadius: '3px',
                background: colors[i], transition: 'width 0.4s ease',
              }} />
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4 }}>
              {row.detail}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: '1px', background: C.border, margin: '16px 0 12px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: C.text1 }}>Итого</span>
        <span style={{ fontFamily: F.mono, fontSize: '16px', fontWeight: 700, color: C.text1 }}>1 825 000 UZS</span>
      </div>
    </div>
  );
}

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

function BadgeWarning({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: C.warningBg, color: '#B45309', whiteSpace: 'nowrap',
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
      background: C.infoBg, color: '#0E7490', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.info, flexShrink: 0 }} />
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
      background: '#F3F4F6', color: C.text2, border: `1px solid ${C.border}`,
      whiteSpace: 'nowrap',
    }}>
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
      background: C.blueLt, color: C.blue, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          height: '40px', padding: '0 36px 0 12px',
          border: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderRadius: '8px', background: C.surface,
          fontFamily: F.inter, fontSize: '14px', color: C.text2,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s', minWidth: '160px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} color={C.text3} style={{
        position: 'absolute', right: '10px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSACTION DATA
═══════════════════════════════════════════════════════════════════════════ */

interface TxRow {
  date: string;
  seller: string;
  type: 'kpi' | 'withdrawal';
  card: string;
  kpiLabel: string;
  amount: string;
  ucoinTx: string;
  positive: boolean;
  status: 'credited' | 'withdrawn' | 'pending';
}

const TRANSACTIONS: TxRow[] = [
  { date: '13.04', seller: 'Абдуллох',  type: 'kpi',        card: '...4521', kpiLabel: 'KPI 3', amount: '+10 000',  ucoinTx: 'UCN-TX-90421', positive: true,  status: 'credited' },
  { date: '13.04', seller: 'Камола',    type: 'withdrawal', card: '—',       kpiLabel: '—',     amount: '-80 000',  ucoinTx: 'UCN-TX-90420', positive: false, status: 'withdrawn' },
  { date: '12.04', seller: 'Санжар',    type: 'kpi',        card: '...3892', kpiLabel: 'KPI 2', amount: '+5 000',   ucoinTx: 'UCN-TX-90419', positive: true,  status: 'credited' },
  { date: '12.04', seller: 'Нилуфар',   type: 'kpi',        card: '...2204', kpiLabel: 'KPI 1', amount: '+5 000',   ucoinTx: 'UCN-TX-90418', positive: true,  status: 'credited' },
  { date: '11.04', seller: 'Абдуллох',  type: 'kpi',        card: '...1002', kpiLabel: 'KPI 1', amount: '+5 000',   ucoinTx: 'UCN-TX-90417', positive: true,  status: 'credited' },
  { date: '11.04', seller: 'Ислом',     type: 'kpi',        card: '...1829', kpiLabel: 'KPI 3', amount: '+10 000',  ucoinTx: 'UCN-TX-90416', positive: true,  status: 'credited' },
  { date: '10.04', seller: 'Дарья',     type: 'kpi',        card: '...5103', kpiLabel: 'KPI 2', amount: '+5 000',   ucoinTx: 'UCN-TX-90415', positive: true,  status: 'credited' },
  { date: '10.04', seller: 'Абдуллох',  type: 'withdrawal', card: '—',       kpiLabel: '—',     amount: '-120 000', ucoinTx: 'UCN-TX-90414', positive: false, status: 'withdrawn' },
  { date: '09.04', seller: 'Санжар',    type: 'kpi',        card: '...6721', kpiLabel: 'KPI 1', amount: '+5 000',   ucoinTx: 'UCN-TX-90413', positive: true,  status: 'credited' },
  { date: '09.04', seller: 'Камола',    type: 'kpi',        card: '...7801', kpiLabel: 'KPI 1', amount: '+5 000',   ucoinTx: 'UCN-TX-90412', positive: true,  status: 'credited' },
];

const KPI_FILTER_OPTIONS = ['KPI 1', 'KPI 2', 'KPI 3'];

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSACTION TABLE
═══════════════════════════════════════════════════════════════════════════ */

type TxTab = 'all' | 'credits' | 'withdrawals';

function TransactionLog() {
  const [tab, setTab] = useState<TxTab>('all');
  const [search, setSearch] = useState('');
  const [kpiFilter, setKpiFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);

  const tabs: { id: TxTab; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'credits', label: 'Начисления' },
    { id: 'withdrawals', label: 'Выводы' },
  ];

  const filtered = TRANSACTIONS.filter(tx => {
    if (tab === 'credits' && tx.type !== 'kpi') return false;
    if (tab === 'withdrawals' && tx.type !== 'withdrawal') return false;
    return true;
  });

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', overflow: 'hidden',
    }}>
      {/* Header + Tabs */}
      <div style={{
        padding: '20px 24px 0', borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
          color: C.text1, marginBottom: '16px',
        }}>
          Лог операций
        </div>
        <div style={{ display: 'flex', gap: '0' }}>
          {tabs.map(t => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '10px 18px', border: 'none', background: 'none',
                  fontFamily: F.inter, fontSize: '13px',
                  fontWeight: active ? 600 : 400,
                  color: active ? C.blue : C.text3,
                  cursor: 'pointer',
                  borderBottom: active ? `2px solid ${C.blue}` : '2px solid transparent',
                  marginBottom: '-1px', transition: 'color 0.12s',
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: '12px', padding: '16px 24px',
        flexWrap: 'wrap', alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} color={searchFocused ? C.blue : C.text4} style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
            placeholder="Поиск по продавцу или карте..."
            style={{
              width: '100%', height: '40px', paddingLeft: '38px', paddingRight: '12px',
              border: `1px solid ${searchFocused ? C.blue : C.inputBorder}`,
              borderRadius: '8px', background: C.surface,
              fontFamily: F.inter, fontSize: '14px', color: C.text1,
              outline: 'none', boxSizing: 'border-box',
              boxShadow: searchFocused ? `0 0 0 3px ${C.blueTint}` : 'none',
              transition: 'border-color 0.12s, box-shadow 0.12s',
            }}
          />
        </div>
        <FilterSelect label="KPI этап: Все" options={KPI_FILTER_OPTIONS} value={kpiFilter} onChange={setKpiFilter} />
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
          <thead>
            <tr style={{ background: '#FAFBFC', borderBottom: `1px solid ${C.border}` }}>
              {['Дата', 'Продавец', 'Тип', 'Карта', 'KPI', 'Сумма', 'UCOIN TX', 'Статус'].map(h => (
                <th key={h} style={{
                  padding: '10px 16px', textAlign: 'left',
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: C.text4,
                  textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx, i) => {
              const hov = hovRow === i;
              return (
                <tr key={i}
                  onMouseEnter={() => setHovRow(i)}
                  onMouseLeave={() => setHovRow(null)}
                  style={{
                    borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                    background: hov ? '#FAFBFC' : C.surface, transition: 'background 0.1s',
                  }}
                >
                  <td style={td}><span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>{tx.date}</span></td>
                  <td style={td}><span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{tx.seller}</span></td>
                  <td style={td}>
                    {tx.type === 'kpi' ? <BadgeDefault>KPI</BadgeDefault> : <BadgeWarning>Вывод</BadgeWarning>}
                  </td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text1 }}>{tx.card}</span></td>
                  <td style={td}>
                    {tx.kpiLabel !== '—' ? <BadgeBlue>{tx.kpiLabel}</BadgeBlue> : <span style={{ color: C.text4 }}>—</span>}
                  </td>
                  <td style={td}>
                    <span style={{
                      fontFamily: F.mono, fontSize: '13px', fontWeight: 600,
                      color: tx.positive ? '#15803D' : '#DC2626',
                    }}>
                      {tx.amount}
                    </span>
                  </td>
                  <td style={td}><span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text4 }}>{tx.ucoinTx}</span></td>
                  <td style={td}>
                    {tx.status === 'credited' && <BadgeSuccess>Начислено</BadgeSuccess>}
                    {tx.status === 'withdrawn' && <BadgeInfo>Выведено</BadgeInfo>}
                    {tx.status === 'pending' && <BadgeWarning>Ожидание</BadgeWarning>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{
        padding: '12px 24px', fontFamily: F.inter, fontSize: '13px',
        color: C.text3, textAlign: 'center',
        borderTop: `1px solid ${C.border}`,
      }}>
        Показано 1–10 из 248
      </div>
    </div>
  );
}

const td: React.CSSProperties = { padding: '12px 16px', whiteSpace: 'nowrap' };

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function OrgFinancePage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-13' });

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
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Вознаграждения</span>
          </div>

          {/* Top Bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Вознаграждения
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
                Финансовый обзор Mysafar OOO
              </p>
            </div>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* 4× Stat Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px', marginBottom: '24px',
          }}>
            <StatCard icon={Wallet}          variant="green"  label="Всего начислено"      value="1 825 000" />
            <StatCard icon={CheckCircle}     variant="blue"   label="KPI выплаты"          value="1 825 000" />
            <StatCard icon={ArrowDownToLine} variant="amber"  label="Выведено"             value="1 200 000" />
            <StatCard icon={Coins}           variant="violet" label="Баланс в кошельках"   value="625 000" />
          </div>

          {/* Row 2: Bar chart + KPI breakdown */}
          <div style={{
            display: 'grid', gridTemplateColumns: '55% 1fr',
            gap: '16px', marginBottom: '24px',
          }}>
            <SellerBarChart />
            <KpiBreakdown />
          </div>

          {/* Row 3: Transaction log */}
          <TransactionLog />

          <div style={{ height: '48px' }} />
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 1280px) {
          div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          div[style*="grid-template-columns: 55%"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
