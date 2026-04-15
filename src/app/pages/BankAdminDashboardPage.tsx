import React, { useState } from 'react';
import {
  CreditCard, Building2, ShoppingBag, UserCheck, ArrowUpDown, Wallet,
  Download, ChevronRight, ChevronUp, ChevronDown,
  TrendingUp,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';
import { DateRangePicker } from '../components/DateRangePicker';

/* ═══════════════════════════════════════════════════════════════════════════
   ICON VARIANTS (dark-aware)
═══════════════════════════════════════════════════════════════════════════ */

function iconVariant(variant: string, dark: boolean) {
  const light: Record<string, { bg: string; color: string }> = {
    blue:   { bg: '#EFF6FF', color: '#2563EB' },
    violet: { bg: '#F3F0FF', color: '#7C3AED' },
    green:  { bg: '#F0FDF4', color: '#16A34A' },
    cyan:   { bg: '#ECFEFF', color: '#0891B2' },
    amber:  { bg: '#FFFBEB', color: '#D97706' },
    rose:   { bg: '#FFF1F2', color: '#E11D48' },
  };
  const darkV: Record<string, { bg: string; color: string }> = {
    blue:   { bg: 'rgba(37,99,235,0.15)',  color: '#3B82F6' },
    violet: { bg: 'rgba(124,58,237,0.15)', color: '#A78BFA' },
    green:  { bg: 'rgba(22,163,74,0.15)',  color: '#34D399' },
    cyan:   { bg: 'rgba(8,145,178,0.15)',  color: '#22D3EE' },
    amber:  { bg: 'rgba(217,119,6,0.15)',  color: '#FBBF24' },
    rose:   { bg: 'rgba(225,29,72,0.15)',  color: '#FB7185' },
  };
  return (dark ? darkV : light)[variant] || light.blue;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

function StatCard({
  icon: Icon, variant, label, value, trend, t,
}: {
  icon: React.ElementType;
  variant: string;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  t: ReturnType<typeof theme>;
}) {
  const iv = iconVariant(variant, t === theme(true));
  const dark = t.pageBg === D.pageBg;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: t.surface,
        border: `1px solid ${hovered ? (dark ? '#3A3F50' : '#D1D5DB') : t.border}`,
        borderRadius: '12px', padding: '20px',
        display: 'flex', flexDirection: 'column', gap: '14px',
        flex: '1 1 0', minWidth: 0,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? (dark ? '0 2px 8px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.06)') : 'none',
      }}
    >
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: iv.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={20} color={iv.color} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.dm, fontSize: '26px', fontWeight: 700, color: t.text1, lineHeight: 1 }}>
            {value}
          </span>
          {trend && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '2px',
              fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
              color: trend.positive ? (dark ? '#34D399' : '#15803D') : (dark ? '#F87171' : '#DC2626'),
              background: trend.positive ? (dark ? 'rgba(52,211,153,0.12)' : '#F0FDF4') : (dark ? 'rgba(248,113,113,0.12)' : '#FEF2F2'),
              padding: '2px 7px', borderRadius: '10px',
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
  { label: 'Выдано',  count: 5000, pct: '100%',  fill: '#93C5FD' },
  { label: 'Продано', count: 2340, pct: '46.8%',  fill: '#60A5FA' },
  { label: 'KPI 1',   count: 1890, pct: '37.8%',  fill: '#3B82F6' },
  { label: 'KPI 2',   count: 1210, pct: '24.2%',  fill: '#2563EB' },
  { label: 'KPI 3',   count: 567,  pct: '11.3%',  fill: '#1D4ED8' },
];
const FUNNEL_MAX = 5000;

function FunnelCard({ t }: { t: ReturnType<typeof theme> }) {
  const dark = t.pageBg === D.pageBg;
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: '12px', padding: '24px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 700, color: t.text1, marginBottom: '3px' }}>
          Воронка конверсии
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
          От выдачи до выполнения KPI 3
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {FUNNEL_DATA.map((row, i) => {
          const barW = (row.count / FUNNEL_MAX) * 100;
          return (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '68px', flexShrink: 0, fontFamily: F.inter, fontSize: '13px', color: t.text2, textAlign: 'right' }}>
                {row.label}
              </div>
              <div style={{ flex: 1, height: '10px', borderRadius: '5px', background: dark ? D.progressTrack : '#EFF6FF', overflow: 'hidden' }}>
                <div style={{ width: `${barW}%`, height: '100%', background: row.fill, borderRadius: '5px', transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ width: '120px', flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: t.text1 }}>
                  {row.count.toLocaleString('ru-RU')}
                </span>
                <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>
                  {i === 0 ? '(база)' : `(${row.pct})`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${t.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>Итоговая конверсия KPI 3</div>
        <div style={{
          fontFamily: F.mono, fontSize: '14px', fontWeight: 700,
          color: dark ? '#3B82F6' : '#1D4ED8',
          background: dark ? D.blueLt : C.blueLt,
          padding: '3px 10px', borderRadius: '8px',
          border: `1px solid ${dark ? D.blueTint : C.blueTint}`,
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

function RewardsCard({ t }: { t: ReturnType<typeof theme> }) {
  const dark = t.pageBg === D.pageBg;
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: '12px', padding: '24px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 700, color: t.text1, marginBottom: '16px' }}>
        Вознаграждения
      </div>
      <div style={{ marginBottom: '4px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '32px', fontWeight: 800, color: t.text1, lineHeight: 1, letterSpacing: '-0.02em' }}>
          24 565 000
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.blue, marginTop: '4px' }}>UZS</div>
      </div>
      <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '20px' }}>
        Всего начислено продавцам
      </div>
      <div style={{ height: '1px', background: t.divider, marginBottom: '20px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {REWARD_ROWS.map(row => (
          <div key={row.label}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{row.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: t.text1 }}>{row.amount}</span>
                <span style={{
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                  color: dark ? '#3B82F6' : '#1D4ED8',
                  background: dark ? D.blueLt : C.blueLt,
                  padding: '1px 6px', borderRadius: '6px',
                }}>
                  {row.pct}
                </span>
              </div>
            </div>
            <div style={{ height: '4px', borderRadius: '2px', background: dark ? D.progressTrack : '#EFF6FF', overflow: 'hidden' }}>
              <div style={{ width: `${row.barW}%`, height: '100%', background: row.color, borderRadius: '2px' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS CELL
═══════════════════════════════════════════════════════════════════════════ */

function ProgressCell({ pct, t }: { pct: number; t: ReturnType<typeof theme> }) {
  const dark = t.pageBg === D.pageBg;
  const color = pct >= 60 ? (dark ? '#34D399' : '#16A34A') : pct >= 45 ? '#3B82F6' : (dark ? '#FBBF24' : '#D97706');
  const trackColor = dark ? D.progressTrack : (pct >= 60 ? '#F0FDF4' : pct >= 45 ? '#EFF6FF' : '#FFFBEB');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '72px', height: '6px', borderRadius: '3px', background: trackColor, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px' }} />
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color, flexShrink: 0 }}>{pct}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ORGANISATION TABLE
═══════════════════════════════════════════════════════════════════════════ */

const ORG_ROWS = [
  { org: 'Mysafar OOO',       issued: 500,  sold: 230, soldPct: 46, kpi1: 185, kpi2: 120, kpi3: 45,  reward: '1 825 000', status: { label: 'Активна',  lightBg: '#F0FDF4', lightColor: '#15803D', darkBg: 'rgba(52,211,153,0.12)', darkColor: '#34D399' } },
  { org: 'Unired Marketing',  issued: 500,  sold: 310, soldPct: 62, kpi1: 280, kpi2: 190, kpi3: 78,  reward: '2 740 000', status: { label: 'Активна',  lightBg: '#F0FDF4', lightColor: '#15803D', darkBg: 'rgba(52,211,153,0.12)', darkColor: '#34D399' } },
  { org: 'Express Finance',   issued: 400,  sold: 180, soldPct: 45, kpi1: 150, kpi2: 95,  kpi3: 32,  reward: '1 370 000', status: { label: 'Активна',  lightBg: '#F0FDF4', lightColor: '#15803D', darkBg: 'rgba(52,211,153,0.12)', darkColor: '#34D399' } },
  { org: 'Digital Pay',       issued: 300,  sold: 120, soldPct: 40, kpi1: 98,  kpi2: 65,  kpi3: 22,  reward: '920 000',   status: { label: 'На паузе', lightBg: '#FFFBEB', lightColor: '#B45309', darkBg: 'rgba(251,191,36,0.12)', darkColor: '#FBBF24' } },
  { org: 'SmartCard Group',   issued: 500,  sold: 290, soldPct: 58, kpi1: 250, kpi2: 170, kpi3: 68,  reward: '2 440 000', status: { label: 'Активна',  lightBg: '#F0FDF4', lightColor: '#15803D', darkBg: 'rgba(52,211,153,0.12)', darkColor: '#34D399' } },
];

const ORG_TOTALS = { issued: 2200, sold: 1130, soldPct: 51, kpi1: 963, kpi2: 640, kpi3: 245, reward: '9 295 000' };

type SortKey = 'org' | 'issued' | 'sold' | 'soldPct' | 'kpi1' | 'kpi2' | 'kpi3' | 'reward';

function OrgTable({ t }: { t: ReturnType<typeof theme> }) {
  const dark = t.pageBg === D.pageBg;
  const [sortKey, setSortKey] = useState<SortKey>('sold');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sorted = [...ORG_ROWS].sort((a, b) => {
    let av: any = a[sortKey], bv: any = b[sortKey];
    if (typeof av === 'string') av = av.replace(/\s/g, '');
    if (typeof bv === 'string') bv = bv.replace(/\s/g, '');
    return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
  });

  const cols: { key: SortKey | 'status' | 'arrow'; label: string; sortable: boolean; align?: 'right' }[] = [
    { key: 'org',     label: 'Организация',  sortable: true  },
    { key: 'issued',  label: 'Карт выдано',  sortable: true, align: 'right' },
    { key: 'sold',    label: 'Продано',       sortable: true, align: 'right' },
    { key: 'soldPct', label: '% продано',     sortable: true  },
    { key: 'kpi1',    label: 'KPI 1',         sortable: true, align: 'right' },
    { key: 'kpi2',    label: 'KPI 2',         sortable: true, align: 'right' },
    { key: 'kpi3',    label: 'KPI 3',         sortable: true, align: 'right' },
    { key: 'reward',  label: 'Начислено KPI', sortable: true, align: 'right' },
    { key: 'status',  label: 'Статус',        sortable: false },
    { key: 'arrow',   label: '',              sortable: false },
  ];

  const headerBg = dark ? D.tableAlt : C.pageBg;
  const sortInactive = dark ? '#3A3F50' : '#D1D5DB';
  const hoverBg = dark ? D.tableHover : '#F9FAFB';
  const totalsBg = dark ? D.tableAlt : '#F9FAFB';

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '860px' }}>
        <thead>
          <tr style={{ background: headerBg, borderBottom: `1px solid ${t.border}` }}>
            {cols.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key as SortKey)}
                style={{
                  padding: '11px 16px',
                  textAlign: col.align === 'right' ? 'right' : 'left',
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                  color: sortKey === col.key ? t.blue : t.text4,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  whiteSpace: 'nowrap', cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none',
                }}
              >
                {col.sortable ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start' }}>
                    {col.label}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <ChevronUp size={10} color={sortKey === col.key && sortDir === 'asc' ? t.blue : sortInactive} />
                      <ChevronDown size={10} color={sortKey === col.key && sortDir === 'desc' ? t.blue : sortInactive} />
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
              <tr key={row.org}
                onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
                style={{ borderBottom: `1px solid ${t.border}`, background: hov ? hoverBg : t.surface, cursor: 'pointer', transition: 'background 0.1s' }}
              >
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      background: dark ? D.blueLt : C.blueLt,
                      border: `1px solid ${dark ? D.blueTint : C.blueTint}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 700, color: t.blue }}>
                        {row.org.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1 }}>{row.org}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '14px', color: t.text2 }}>{row.issued}</span></td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '14px', color: t.text2 }}>{row.sold}</span></td>
                <td style={{ padding: '14px 16px' }}><ProgressCell pct={row.soldPct} t={t} /></td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '14px', color: t.text2 }}>{row.kpi1}</span></td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '14px', color: t.text2 }}>{row.kpi2}</span></td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '14px', color: t.text2 }}>{row.kpi3}</span></td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: t.text1 }}>{row.reward}</span></td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                    padding: '3px 10px', borderRadius: '10px',
                    background: dark ? row.status.darkBg : row.status.lightBg,
                    color: dark ? row.status.darkColor : row.status.lightColor,
                    whiteSpace: 'nowrap',
                  }}>
                    {row.status.label}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', width: '40px' }}>
                  <ChevronRight size={16} color={hov ? t.blue : t.text4} strokeWidth={1.75} />
                </td>
              </tr>
            );
          })}
          {/* Totals */}
          <tr style={{ background: totalsBg, borderTop: `2px solid ${t.border}` }}>
            <td style={{ padding: '13px 16px' }}><span style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 700, color: t.text1 }}>Итого</span></td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: t.text1 }}>{ORG_TOTALS.issued}</span></td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: t.text1 }}>{ORG_TOTALS.sold}</span></td>
            <td style={{ padding: '13px 16px' }}><ProgressCell pct={ORG_TOTALS.soldPct} t={t} /></td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: t.text1 }}>{ORG_TOTALS.kpi1}</span></td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: t.text1 }}>{ORG_TOTALS.kpi2}</span></td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: t.text1 }}>{ORG_TOTALS.kpi3}</span></td>
            <td style={{ padding: '13px 16px', textAlign: 'right' }}><span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 700, color: t.text1 }}>{ORG_TOTALS.reward}</span></td>
            <td colSpan={2} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function BankAdminDashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-13' });

  const t = theme(darkMode);
  const dark = darkMode;

  return (
    <div style={{
      display: 'flex', height: '100vh', overflow: 'hidden',
      background: t.pageBg, transition: 'background 0.2s',
    }}>
      <style>{`
        .stat-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
        @media (max-width: 1280px) { .stat-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .stat-grid { grid-template-columns: 1fr; } }
        .row2-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 16px; }
        @media (max-width: 1024px) { .row2-grid { grid-template-columns: 1fr; } }
        .sidebar-wrap { flex-shrink: 0; }
        @media (max-width: 768px) { .sidebar-wrap { display: none; } }
      `}</style>

      <div className="sidebar-wrap">
        <Sidebar role="bank"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(d => !d)}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
              <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Дашборд</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>Дашборд</h1>
                <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '3px 0 0' }}>Общая сводка по всем организациям</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <DateRangePicker value={dateRange} onChange={setDateRange} />
                <button style={{
                  height: '40px', padding: '0 16px',
                  border: `1px solid ${t.inputBorder}`, borderRadius: '8px',
                  background: t.surface, fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                  color: t.text2, display: 'flex', alignItems: 'center', gap: '7px',
                  cursor: 'pointer', flexShrink: 0, transition: 'all 0.12s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = dark ? D.tableHover : '#F9FAFB'; e.currentTarget.style.borderColor = dark ? '#3A3F50' : '#9CA3AF'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = t.surface; e.currentTarget.style.borderColor = t.inputBorder; }}
                >
                  <Download size={14} color={t.text3} strokeWidth={1.75} />
                  Экспорт
                </button>
              </div>
            </div>
          </div>

          {/* Row 1: Stat Cards */}
          <div className="stat-grid" style={{ marginBottom: '20px' }}>
            <StatCard icon={CreditCard}  variant="blue"   label="Всего карт выпущено" value="5 000" t={t} />
            <StatCard icon={Building2}   variant="violet" label="Организаций"          value="8" t={t} />
            <StatCard icon={ShoppingBag} variant="green"  label="Карт продано"         value="2 340" trend={{ value: '+12%', positive: true }} t={t} />
            <StatCard icon={UserCheck}   variant="cyan"   label="Регистраций (KPI 1)"  value="1 890" trend={{ value: '+8%', positive: true }} t={t} />
            <StatCard icon={ArrowUpDown} variant="amber"  label="Пополнений (KPI 2)"   value="1 210" trend={{ value: '+5%', positive: true }} t={t} />
            <StatCard icon={Wallet}      variant="rose"   label="Оплата 500K (KPI 3)"  value="567"   trend={{ value: '+15%', positive: true }} t={t} />
          </div>

          {/* Row 2: Funnel + Rewards */}
          <div className="row2-grid" style={{ marginBottom: '20px' }}>
            <FunnelCard t={t} />
            <RewardsCard t={t} />
          </div>

          {/* Row 3: Org Table */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '12px', overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 700, color: t.text1 }}>Организации</div>
                <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '2px' }}>KPI прогресс и вознаграждения по всем партнёрам</div>
              </div>
              <button style={{
                border: 'none', background: 'none',
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.blue,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                padding: '6px 10px', borderRadius: '8px', transition: 'background 0.12s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = dark ? D.blueLt : C.blueLt)}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                Показать все
                <ChevronRight size={15} strokeWidth={2} />
              </button>
            </div>
            <OrgTable t={t} />
          </div>

          <div style={{ height: '40px' }} />
        </div>
      </div>
    </div>
  );
}
