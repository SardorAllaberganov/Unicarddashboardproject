import React, { useState, useRef, useEffect } from 'react';
import {
  CreditCard, Building2, ShoppingBag, UserCheck, ArrowUpDown, Wallet,
  Download, Calendar, ChevronRight, ChevronUp, ChevronDown,
  TrendingUp, ChevronLeft,
} from 'lucide-react';
import { BankAdminSidebar } from '../components/BankAdminSidebar';
import { F, C } from '../components/ds/tokens';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';
import { DateRangePicker } from '../components/DateRangePicker';

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS — local aliases
═══════════════════════════════════════════════════════════════════════════ */

const ICON_VARIANTS = {
  blue:   { bg: '#EFF6FF', color: '#2563EB' },
  violet: { bg: '#F3F0FF', color: '#7C3AED' },
  green:  { bg: '#F0FDF4', color: '#16A34A' },
  cyan:   { bg: '#ECFEFF', color: '#0891B2' },
  amber:  { bg: '#FFFBEB', color: '#D97706' },
  rose:   { bg: '#FFF1F2', color: '#E11D48' },
};

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

function StatCard({
  icon: Icon, variant, label, value, trend,
}: {
  icon: React.ElementType;
  variant: keyof typeof ICON_VARIANTS;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
}) {
  const { bg, color } = ICON_VARIANTS[variant];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surface,
        border: `1px solid ${hovered ? '#D1D5DB' : C.border}`,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        flex: '1 1 0',
        minWidth: 0,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
        cursor: 'default',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={20} color={color} strokeWidth={2} />
      </div>

      {/* Content */}
      <div>
        <div style={{
          fontFamily: F.inter,
          fontSize: '13px',
          color: C.text3,
          marginBottom: '6px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: F.dm,
            fontSize: '26px',
            fontWeight: 700,
            color: C.text1,
            lineHeight: 1,
          }}>
            {value}
          </span>
          {trend && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '2px',
              fontFamily: F.inter,
              fontSize: '12px',
              fontWeight: 500,
              color: trend.positive ? '#15803D' : '#DC2626',
              background: trend.positive ? '#F0FDF4' : '#FEF2F2',
              padding: '2px 7px',
              borderRadius: '10px',
            }}>
              <TrendingUp size={11} strokeWidth={2.5} />
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FUNNEL CHART CARD
═══════════════════════════════════════════════════════════════════════════ */

const FUNNEL_DATA = [
  { label: 'Выдано',  count: 5000, pct: '100%',  fill: '#93C5FD', textFill: C.text2 },
  { label: 'Продано', count: 2340, pct: '46.8%',  fill: '#60A5FA', textFill: C.text2 },
  { label: 'KPI 1',   count: 1890, pct: '37.8%',  fill: '#3B82F6', textFill: C.text2 },
  { label: 'KPI 2',   count: 1210, pct: '24.2%',  fill: '#2563EB', textFill: C.text2 },
  { label: 'KPI 3',   count: 567,  pct: '11.3%',  fill: '#1D4ED8', textFill: C.text2 },
];
const FUNNEL_MAX = 5000;

function FunnelCard() {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '24px',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 700, color: C.text1, marginBottom: '3px' }}>
          Воронка конверсии
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>
          От выдачи до выполнения KPI 3
        </div>
      </div>

      {/* Funnel bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {FUNNEL_DATA.map((row, i) => {
          const barW = (row.count / FUNNEL_MAX) * 100;
          const isFirst = i === 0;
          return (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Label */}
              <div style={{
                width: '68px', flexShrink: 0,
                fontFamily: F.inter, fontSize: '13px', color: C.text2,
                textAlign: 'right',
              }}>
                {row.label}
              </div>

              {/* Bar track */}
              <div style={{ flex: 1, height: '10px', borderRadius: '5px', background: '#EFF6FF', overflow: 'hidden' }}>
                <div style={{
                  width: `${barW}%`, height: '100%',
                  background: row.fill, borderRadius: '5px',
                  transition: 'width 0.4s ease',
                }} />
              </div>

              {/* Count + pct */}
              <div style={{
                width: '120px', flexShrink: 0,
                display: 'flex', alignItems: 'baseline', gap: '6px',
              }}>
                <span style={{
                  fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: C.text1,
                }}>
                  {row.count.toLocaleString('ru-RU')}
                </span>
                <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4 }}>
                  {isFirst ? '(база)' : `(${row.pct})`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion note */}
      <div style={{
        marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4 }}>
          Итоговая конверсия KPI 3
        </div>
        <div style={{
          fontFamily: F.mono, fontSize: '14px', fontWeight: 700,
          color: '#1D4ED8', background: C.blueLt,
          padding: '3px 10px', borderRadius: '8px',
          border: `1px solid ${C.blueTint}`,
        }}>
          11.3%
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REWARDS SUMMARY CARD
═══════════════════════════════════════════════════════════════════════════ */

const REWARD_ROWS = [
  { label: 'KPI 1 — Регистрация', amount: '9 450 000 UZS', pct: '38.5%', color: '#3B82F6', barW: 38.5 },
  { label: 'KPI 2 — Пополнение',  amount: '6 050 000 UZS', pct: '24.6%', color: '#60A5FA', barW: 24.6 },
  { label: 'KPI 3 — Оплата 500K', amount: '5 670 000 UZS', pct: '23.1%', color: '#2563EB', barW: 23.1 },
  { label: 'Выведено',            amount: '3 395 000 UZS', pct: '13.8%', color: '#93C5FD', barW: 13.8 },
];

function RewardsCard() {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '24px',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Heading */}
      <div style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 700, color: C.text1, marginBottom: '16px' }}>
        Вознаграждения
      </div>

      {/* Large number */}
      <div style={{ marginBottom: '4px' }}>
        <div style={{
          fontFamily: F.dm, fontSize: '32px', fontWeight: 800,
          color: C.text1, lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          24 565 000
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
          color: C.blue, marginTop: '4px',
        }}>UZS</div>
      </div>
      <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginBottom: '20px' }}>
        Всего начислено продавцам
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: C.border, marginBottom: '20px' }} />

      {/* Key-value rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {REWARD_ROWS.map(row => (
          <div key={row.label}>
            {/* Label + pct badge */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '5px',
            }}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                {row.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: C.text1,
                }}>
                  {row.amount}
                </span>
                <span style={{
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                  color: '#1D4ED8', background: C.blueLt,
                  padding: '1px 6px', borderRadius: '6px',
                }}>
                  {row.pct}
                </span>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: '4px', borderRadius: '2px', background: '#EFF6FF', overflow: 'hidden' }}>
              <div style={{
                width: `${row.barW}%`, height: '100%',
                background: row.color, borderRadius: '2px',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ORGANISATION TABLE
═══════════════════════════════════════════════════════════════════════════ */

const ORG_ROWS = [
  {
    org: 'Mysafar OOO',        issued: 500,  sold: 230, soldPct: 46,
    kpi1: 185, kpi2: 120, kpi3: 45,  reward: '1 825 000',
    status: { label: 'Активна',  bg: '#F0FDF4', color: '#15803D' },
  },
  {
    org: 'Unired Marketing',   issued: 500,  sold: 310, soldPct: 62,
    kpi1: 280, kpi2: 190, kpi3: 78,  reward: '2 740 000',
    status: { label: 'Активна',  bg: '#F0FDF4', color: '#15803D' },
  },
  {
    org: 'Express Finance',    issued: 400,  sold: 180, soldPct: 45,
    kpi1: 150, kpi2: 95,  kpi3: 32,  reward: '1 370 000',
    status: { label: 'Активна',  bg: '#F0FDF4', color: '#15803D' },
  },
  {
    org: 'Digital Pay',        issued: 300,  sold: 120, soldPct: 40,
    kpi1: 98,  kpi2: 65,  kpi3: 22,  reward: '920 000',
    status: { label: 'На паузе', bg: '#FFFBEB', color: '#B45309' },
  },
  {
    org: 'SmartCard Group',    issued: 500,  sold: 290, soldPct: 58,
    kpi1: 250, kpi2: 170, kpi3: 68,  reward: '2 440 000',
    status: { label: 'Активна',  bg: '#F0FDF4', color: '#15803D' },
  },
];

const ORG_TOTALS = {
  issued: 2200, sold: 1130, soldPct: 51,
  kpi1: 963, kpi2: 640, kpi3: 245, reward: '9 295 000',
};

type SortKey = 'org' | 'issued' | 'sold' | 'soldPct' | 'kpi1' | 'kpi2' | 'kpi3' | 'reward';

function ProgressCell({ pct }: { pct: number }) {
  const color = pct >= 60 ? '#16A34A' : pct >= 45 ? '#2563EB' : '#D97706';
  const trackColor = pct >= 60 ? '#F0FDF4' : pct >= 45 ? '#EFF6FF' : '#FFFBEB';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '72px', height: '6px', borderRadius: '3px',
        background: trackColor, overflow: 'hidden', flexShrink: 0,
      }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px' }} />
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color, flexShrink: 0 }}>
        {pct}%
      </span>
    </div>
  );
}

function OrgTable() {
  const [sortKey, setSortKey]   = useState<SortKey>('sold');
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('desc');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sorted = [...ORG_ROWS].sort((a, b) => {
    let av: any = a[sortKey], bv: any = b[sortKey];
    if (typeof av === 'string') av = av.replace(/\s/g, '');
    if (typeof bv === 'string') bv = bv.replace(/\s/g, '');
    const n = Number(av) - Number(bv);
    return sortDir === 'asc' ? n : -n;
  });

  const cols: { key: SortKey | 'status' | 'arrow'; label: string; sortable: boolean; align?: 'right' }[] = [
    { key: 'org',     label: 'Организация',     sortable: true  },
    { key: 'issued',  label: 'Карт выдано',     sortable: true, align: 'right' },
    { key: 'sold',    label: 'Продано',          sortable: true, align: 'right' },
    { key: 'soldPct', label: '% продано',        sortable: true  },
    { key: 'kpi1',    label: 'KPI 1',            sortable: true, align: 'right' },
    { key: 'kpi2',    label: 'KPI 2',            sortable: true, align: 'right' },
    { key: 'kpi3',    label: 'KPI 3',            sortable: true, align: 'right' },
    { key: 'reward',  label: 'Начислено KPI',    sortable: true, align: 'right' },
    { key: 'status',  label: 'Статус',           sortable: false },
    { key: 'arrow',   label: '',                 sortable: false },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '860px' }}>
        <thead>
          <tr style={{ background: C.pageBg, borderBottom: `1px solid ${C.border}` }}>
            {cols.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key as SortKey)}
                style={{
                  padding: '11px 16px',
                  textAlign: col.align === 'right' ? 'right' : 'left',
                  fontFamily: F.inter,
                  fontSize: '11px', fontWeight: 600,
                  color: sortKey === col.key ? C.blue : C.text4,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                  cursor: col.sortable ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
              >
                {col.sortable ? (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start',
                  }}>
                    {col.label}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <ChevronUp size={10} color={sortKey === col.key && sortDir === 'asc' ? C.blue : '#D1D5DB'} />
                      <ChevronDown size={10} color={sortKey === col.key && sortDir === 'desc' ? C.blue : '#D1D5DB'} />
                    </div>
                  </div>
                ) : col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sorted.map((row, i) => {
            const hov = hoveredRow === i;
            return (
              <tr
                key={row.org}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  borderBottom: `1px solid ${C.border}`,
                  background: hov ? '#F9FAFB' : C.surface,
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                {/* Org name */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      background: C.blueLt, border: `1px solid ${C.blueTint}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 700, color: C.blue }}>
                        {row.org.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1 }}>
                      {row.org}
                    </span>
                  </div>
                </td>
                {/* Карт выдано */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '14px', color: C.text2 }}>
                    {row.issued}
                  </span>
                </td>
                {/* Продано */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '14px', color: C.text2 }}>
                    {row.sold}
                  </span>
                </td>
                {/* % продано — progress bar */}
                <td style={{ padding: '14px 16px' }}>
                  <ProgressCell pct={row.soldPct} />
                </td>
                {/* KPI 1 */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '14px', color: C.text2 }}>
                    {row.kpi1}
                  </span>
                </td>
                {/* KPI 2 */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '14px', color: C.text2 }}>
                    {row.kpi2}
                  </span>
                </td>
                {/* KPI 3 */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '14px', color: C.text2 }}>
                    {row.kpi3}
                  </span>
                </td>
                {/* Начислено */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: C.text1 }}>
                    {row.reward}
                  </span>
                </td>
                {/* Status badge */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                    padding: '3px 10px', borderRadius: '10px',
                    background: row.status.bg, color: row.status.color,
                    whiteSpace: 'nowrap',
                  }}>
                    {row.status.label}
                  </span>
                </td>
                {/* Arrow */}
                <td style={{ padding: '14px 16px', width: '40px' }}>
                  <ChevronRight size={16} color={hov ? C.blue : C.text4} strokeWidth={1.75} />
                </td>
              </tr>
            );
          })}

          {/* Footer / totals row */}
          <tr style={{ background: '#F9FAFB', borderTop: `2px solid ${C.border}` }}>
            <td style={{ padding: '13px 16px' }}>
              <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 700, color: C.text1 }}>
                Итого
              </span>
            </td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}>
              <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.text1 }}>
                {ORG_TOTALS.issued}
              </span>
            </td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}>
              <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.text1 }}>
                {ORG_TOTALS.sold}
              </span>
            </td>
            <td style={{ padding: '13px 16px' }}>
              <ProgressCell pct={ORG_TOTALS.soldPct} />
            </td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}>
              <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.text1 }}>
                {ORG_TOTALS.kpi1}
              </span>
            </td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}>
              <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.text1 }}>
                {ORG_TOTALS.kpi2}
              </span>
            </td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}>
              <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.text1 }}>
                {ORG_TOTALS.kpi3}
              </span>
            </td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}>
              <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: C.text1 }}>
                {ORG_TOTALS.reward}
              </span>
            </td>
            <td colSpan={2} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE — BANK ADMIN DASHBOARD
═══════════════════════════════════════════════════════════════════════════ */

export default function BankAdminDashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [darkMode, setDarkMode]                 = useState(false);
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-13' });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>

      {/* ── Responsive styles ─────────────────────────────────── */}
      <style>{`
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }
        @media (max-width: 1280px) {
          .stat-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: 1fr; }
        }
        .row2-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .row2-grid { grid-template-columns: 1fr; }
        }
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sidebar-wrap {
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .sidebar-wrap { display: none; }
        }
      `}</style>

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <div className="sidebar-wrap">
        <BankAdminSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(d => !d)}
        />
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        {/* ══ Scrollable page content ════════════════════════════ */}
        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>

          {/* ── Page header: breadcrumbs + title row ─────────── */}
          <div style={{ marginBottom: '24px' }}>

            {/* Breadcrumbs */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              marginBottom: '10px',
            }}>
              <span onClick={() => navigate('/dashboard')} style={{
                fontFamily: F.inter, fontSize: '13px', color: C.blue,
                cursor: 'pointer',
              }}>
                Главная
              </span>
              <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
              <span style={{
                fontFamily: F.inter, fontSize: '13px', color: C.text3,
              }}>
                Дашборд
              </span>
            </div>

            {/* Title row: heading left, date picker + export right */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: '16px',
              flexWrap: 'wrap',
            }}>
              {/* Left: title + subtitle */}
              <div>
                <h1 style={{
                  fontFamily: F.dm, fontSize: '22px', fontWeight: 700,
                  color: C.text1, margin: 0, lineHeight: 1.2,
                }}>
                  Дашборд
                </h1>
                <p style={{
                  fontFamily: F.inter, fontSize: '13px',
                  color: C.text3, margin: '3px 0 0',
                }}>
                  Общая сводка по всем организациям
                </p>
              </div>

              {/* Right: date picker + export */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <DateRangePicker value={dateRange} onChange={setDateRange} />
                <button style={{
                  height: '40px', padding: '0 16px',
                  border: `1px solid ${C.inputBorder}`,
                  borderRadius: '8px', background: C.surface,
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                  color: C.text2,
                  display: 'flex', alignItems: 'center', gap: '7px',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'border-color 0.12s, background 0.12s',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#F9FAFB';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = '#9CA3AF';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = C.surface;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.inputBorder;
                  }}
                >
                  <Download size={14} color={C.text3} strokeWidth={1.75} />
                  Экспорт
                </button>
              </div>
            </div>
          </div>

          {/* ── Row 1 — 6× Stat Cards ───────────────────── */}
          <div className="stat-grid" style={{ marginBottom: '20px' }}>
            <StatCard icon={CreditCard}    variant="blue"   label="Всего карт выпущено"   value="5 000" />
            <StatCard icon={Building2}     variant="violet" label="Организаций"            value="8" />
            <StatCard icon={ShoppingBag}   variant="green"  label="Карт продано"           value="2 340" trend={{ value: '+12%', positive: true }} />
            <StatCard icon={UserCheck}     variant="cyan"   label="Регистраций (KPI 1)"    value="1 890" trend={{ value: '+8%',  positive: true }} />
            <StatCard icon={ArrowUpDown}   variant="amber"  label="Пополнений (KPI 2)"     value="1 210" trend={{ value: '+5%',  positive: true }} />
            <StatCard icon={Wallet}        variant="rose"   label="Оплата 500K (KPI 3)"    value="567"   trend={{ value: '+15%', positive: true }} />
          </div>

          {/* ── Row 2 — Funnel 60% / Rewards 40% ─────────── */}
          <div className="row2-grid" style={{ marginBottom: '20px' }}>
            <FunnelCard />
            <RewardsCard />
          </div>

          {/* ── Row 3 — Organisation Table ─────────────────── */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', overflow: 'hidden',
          }}>
            {/* Card header */}
            <div style={{
              padding: '20px 24px 0',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <div>
                <div style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 700, color: C.text1 }}>
                  Организации
                </div>
                <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '2px' }}>
                  KPI прогресс и вознаграждения по всем партнёрам
                </div>
              </div>
              <button style={{
                border: 'none', background: 'none',
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: C.blue, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '6px 10px', borderRadius: '8px',
                transition: 'background 0.12s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = C.blueLt)}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                Показать все
                <ChevronRight size={15} strokeWidth={2} />
              </button>
            </div>

            <OrgTable />
          </div>

          {/* Bottom spacer */}
          <div style={{ height: '40px' }} />
        </div>
      </div>
    </div>
  );
}