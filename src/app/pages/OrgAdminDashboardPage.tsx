import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, CreditCard, ShoppingBag, UserCheck,
  ArrowUpDown, Wallet, Check, TrendingUp,
  ArrowRight, Circle, Dot,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useIsMobile } from '../components/useIsMobile';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';
import { DateRangePicker } from '../components/DateRangePicker';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

interface Seller {
  rank: number;
  name: string;
  total: number;
  sold: number;
  kpi1: number;
  kpi2: number;
  kpi3: number;
  earned: string;
}

const SELLERS: Seller[] = [
  { rank: 1, name: 'Санжар М.', total: 100, sold: 62, kpi1: 55, kpi2: 41, kpi3: 15, earned: '555 000' },
  { rank: 2, name: 'Абдуллох Р.', total: 100, sold: 45, kpi1: 38, kpi2: 22, kpi3: 8, earned: '330 000' },
  { rank: 3, name: 'Ислом Т.', total: 80, sold: 42, kpi1: 35, kpi2: 20, kpi3: 10, earned: '350 000' },
  { rank: 4, name: 'Нилуфар К.', total: 100, sold: 33, kpi1: 28, kpi2: 18, kpi3: 5, earned: '255 000' },
  { rank: 5, name: 'Дарья Н.', total: 70, sold: 30, kpi1: 15, kpi2: 10, kpi3: 5, earned: '210 000' },
  { rank: 6, name: 'Камола Р.', total: 50, sold: 18, kpi1: 14, kpi2: 9, kpi3: 2, earned: '125 000' },
];

interface Activity {
  type: 'kpi' | 'withdrawal' | 'assignment';
  color: 'green' | 'blue' | 'amber' | 'gray';
  text: string;
  time: string;
}

const ACTIVITIES: Activity[] = [
  { type: 'kpi', color: 'green', text: 'Карта ...4521 — KPI 3 выполнен (Абдуллох)', time: 'сегодня, 14:32' },
  { type: 'kpi', color: 'blue', text: 'Карта ...3892 — KPI 2 выполнен (Санжар)', time: 'сегодня, 09:15' },
  { type: 'withdrawal', color: 'amber', text: 'Камола Р. — вывод 80 000 UZS', time: 'вчера, 18:00' },
  { type: 'kpi', color: 'green', text: 'Карта ...2204 — KPI 1 выполнен (Нилуфар)', time: 'вчера, 15:30' },
  { type: 'assignment', color: 'gray', text: '5 новых карт назначены Санжару', time: '11.04.2026' },
  { type: 'kpi', color: 'green', text: 'Карта ...1829 — KPI 3 выполнен (Ислом)', time: '11.04.2026' },
  { type: 'kpi', color: 'blue', text: 'Карта ...5103 — KPI 2 выполнен (Дарья)', time: '10.04.2026' },
  { type: 'withdrawal', color: 'amber', text: 'Абдуллох Р. — вывод 120 000 UZS', time: '10.04.2026' },
  { type: 'assignment', color: 'gray', text: '10 новых карт назначены Нилуфар', time: '09.04.2026' },
  { type: 'kpi', color: 'green', text: 'Карта ...6721 — KPI 1 выполнен (Санжар)', time: '09.04.2026' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD COLOR MAPS
═══════════════════════════════════════════════════════════════════════════ */

const STAT_COLOR_LIGHT = {
  blue:  { bg: '#EFF6FF', iconColor: '#2563EB' },
  green: { bg: '#F0FDF4', iconColor: '#10B981' },
  cyan:  { bg: '#ECFEFF', iconColor: '#0891B2' },
  amber: { bg: '#FFFBEB', iconColor: '#D97706' },
  rose:  { bg: '#FFF1F2', iconColor: '#E11D48' },
} as const;

const STAT_COLOR_DARK = {
  blue:  { bg: 'rgba(37,99,235,0.15)',  iconColor: '#3B82F6' },
  green: { bg: 'rgba(52,211,153,0.15)', iconColor: '#34D399' },
  cyan:  { bg: 'rgba(8,145,178,0.15)',  iconColor: '#22D3EE' },
  amber: { bg: 'rgba(251,191,36,0.15)', iconColor: '#FBBF24' },
  rose:  { bg: 'rgba(225,29,72,0.15)',  iconColor: '#FB7185' },
} as const;

const ACTIVITY_COLOR_LIGHT = {
  green: { bg: '#F0FDF4', dot: '#10B981' },
  blue:  { bg: '#EFF6FF', dot: '#2563EB' },
  amber: { bg: '#FFFBEB', dot: '#D97706' },
  gray:  { bg: '#F3F4F6', dot: '#9CA3AF' },
} as const;

const ACTIVITY_COLOR_DARK = {
  green: { bg: 'rgba(52,211,153,0.15)', dot: '#34D399' },
  blue:  { bg: 'rgba(37,99,235,0.15)',  dot: '#3B82F6' },
  amber: { bg: 'rgba(251,191,36,0.15)', dot: '#FBBF24' },
  gray:  { bg: 'rgba(156,163,175,0.15)', dot: '#6B7280' },
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  subtitle,
  color,
  t,
  dark,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  subtitle?: string;
  color: 'blue' | 'green' | 'cyan' | 'amber' | 'rose';
  t: T;
  dark: boolean;
}) {
  const cfg = (dark ? STAT_COLOR_DARK : STAT_COLOR_LIGHT)[color];

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: cfg.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={20} color={cfg.iconColor} strokeWidth={2} />
      </div>

      <div>
        <div style={{
          fontFamily: F.inter,
          fontSize: '13px',
          color: t.text3,
          marginBottom: '4px',
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: F.mono,
          fontSize: '22px',
          fontWeight: 700,
          color: t.text1,
          lineHeight: 1.2,
          marginBottom: subtitle ? '4px' : '0',
        }}>
          {value}
        </div>
        {subtitle && (
          <div style={{
            fontFamily: F.inter,
            fontSize: '12px',
            color: t.text3,
          }}>
            {subtitle}
          </div>
        )}
      </div>

      {trend && (
        <div style={{
          fontFamily: F.inter,
          fontSize: '12px',
          color: t.success,
        }}>
          {trend}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SELLER TABLE
═══════════════════════════════════════════════════════════════════════════ */

function SellerTable({ sellers, t, dark }: { sellers: Seller[]; t: T; dark: boolean }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const headerCellStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    fontFamily: F.inter,
    fontSize: '12px',
    fontWeight: 600,
    color: t.text3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
  };

  const dataCellStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  };

  const topRankBg = dark ? 'rgba(52,211,153,0.10)' : '#F0FDF4';

  return (
    <div style={{
      border: `1px solid ${t.border}`,
      borderRadius: '8px',
      overflowX: 'auto',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '700px',
      }}>
        <thead>
          <tr style={{
            background: t.tableHeaderBg,
            borderBottom: `1px solid ${t.border}`,
          }}>
            <th style={headerCellStyle}>#</th>
            <th style={headerCellStyle}>Продавец</th>
            <th style={headerCellStyle}>Карт</th>
            <th style={headerCellStyle}>Продано</th>
            <th style={headerCellStyle}>KPI 1</th>
            <th style={headerCellStyle}>KPI 2</th>
            <th style={headerCellStyle}>KPI 3</th>
            <th style={headerCellStyle}>Заработано</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller, idx) => (
            <tr
              key={seller.rank}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                borderBottom: idx < sellers.length - 1 ? `1px solid ${t.border}` : 'none',
                background: seller.rank === 1 ? topRankBg : hoveredRow === idx ? t.tableHover : t.surface,
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
            >
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
                  {seller.rank}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{
                  fontFamily: F.inter,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: t.text1,
                }}>
                  {seller.name}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                  {seller.total}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: t.text1 }}>
                  {seller.sold}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                  {seller.kpi1}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                  {seller.kpi2}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                  {seller.kpi3}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{
                  fontFamily: F.mono,
                  fontSize: '13px',
                  fontWeight: 600,
                  color: t.text1,
                }}>
                  {seller.earned}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI MINI STEPPER
═══════════════════════════════════════════════════════════════════════════ */

function KPIMiniStepper({ t, dark }: { t: T; dark: boolean }) {
  const steps = [
    { num: 1, label: 'Регистрация', progress: 80.4, count: '185/230', status: 'completed' },
    { num: 2, label: 'Пополнение', progress: 52.2, count: '120/230', status: 'in-progress' },
    { num: 3, label: 'Оплата 500K', progress: 19.6, count: '45/230', status: 'pending' },
  ];

  const pendingBg = dark ? '#2D3148' : '#F3F4F6';
  const progressTrack = dark ? '#2D3148' : '#E5E7EB';
  const pendingFill = dark ? '#3A3F50' : '#D1D5DB';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {steps.map((step, idx) => (
        <div key={step.num} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Circle */}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: step.status === 'completed' ? t.success : step.status === 'in-progress' ? t.blueLt : pendingBg,
            border: step.status === 'in-progress' ? `2px solid ${t.blue}` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {step.status === 'completed' ? (
              <Check size={12} color="#FFFFFF" strokeWidth={3} />
            ) : step.status === 'in-progress' ? (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.blue }} />
            ) : (
              <Circle size={12} color={t.text4} strokeWidth={2} />
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: step.status === 'pending' ? t.text4 : t.text1,
              marginBottom: '6px',
            }}>
              {step.label}
            </div>

            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: progressTrack,
              overflow: 'hidden',
              marginBottom: '6px',
            }}>
              <div style={{
                width: `${step.progress}%`,
                height: '100%',
                background: step.status === 'completed' ? t.success : step.status === 'in-progress' ? t.blue : pendingFill,
                borderRadius: '4px',
              }} />
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                fontFamily: F.mono,
                fontSize: '12px',
                color: t.text2,
              }}>
                {step.count}
              </span>
              <span style={{
                fontFamily: F.inter,
                fontSize: '12px',
                fontWeight: 600,
                color: step.status === 'completed' ? t.success : step.status === 'in-progress' ? t.blue : t.text4,
              }}>
                {step.progress}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTIVITY TIMELINE
═══════════════════════════════════════════════════════════════════════════ */

function ActivityTimeline({ activities, t, dark }: { activities: Activity[]; t: T; dark: boolean }) {
  const colorMap = dark ? ACTIVITY_COLOR_DARK : ACTIVITY_COLOR_LIGHT;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {activities.map((activity, idx) => {
        const cfg = colorMap[activity.color];
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '12px',
              paddingBottom: idx < activities.length - 1 ? '16px' : '0',
              position: 'relative',
            }}
          >
            {/* Left: dot + line */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '20px',
              flexShrink: 0,
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: cfg.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: cfg.dot,
                }} />
              </div>

              {idx < activities.length - 1 && (
                <div style={{
                  width: '2px',
                  flex: 1,
                  background: t.border,
                  marginTop: '4px',
                  minHeight: '16px',
                }} />
              )}
            </div>

            {/* Right: content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: F.inter,
                fontSize: '14px',
                color: t.text1,
                marginBottom: '2px',
              }}>
                {activity.text}
              </div>
              <div style={{
                fontFamily: F.inter,
                fontSize: '12px',
                color: t.text4,
              }}>
                {activity.time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE — Org Admin Dashboard (Y-06 · Org Tab 1)
═══════════════════════════════════════════════════════════════════════════ */

function mIconVariant(variant: 'blue' | 'green' | 'cyan' | 'rose', dark: boolean) {
  const light = {
    blue:  { bg: '#EFF6FF', color: '#2563EB' },
    green: { bg: '#F0FDF4', color: '#16A34A' },
    cyan:  { bg: '#ECFEFF', color: '#0891B2' },
    rose:  { bg: '#FFF1F2', color: '#E11D48' },
  };
  const darkV = {
    blue:  { bg: 'rgba(37,99,235,0.15)',  color: '#3B82F6' },
    green: { bg: 'rgba(22,163,74,0.15)',  color: '#34D399' },
    cyan:  { bg: 'rgba(8,145,178,0.15)',  color: '#22D3EE' },
    rose:  { bg: 'rgba(225,29,72,0.15)',  color: '#FB7185' },
  };
  return (dark ? darkV : light)[variant];
}

function MobileStatCard({
  icon: Icon, variant, label, value, trend, t, dark,
}: {
  icon: React.ElementType;
  variant: 'blue' | 'green' | 'cyan' | 'rose';
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  t: T; dark: boolean;
}) {
  const iv = mIconVariant(variant, dark);
  const trendBg = trend?.positive
    ? (dark ? 'rgba(52,211,153,0.15)' : '#F0FDF4')
    : (dark ? 'rgba(248,113,113,0.15)' : '#FEF2F2');
  const trendFg = trend?.positive
    ? (dark ? '#34D399' : '#15803D')
    : (dark ? '#F87171' : '#DC2626');

  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
      padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: iv.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={22} color={iv.color} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: 13, fontWeight: 500, color: t.text3, marginBottom: 3 }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.dm, fontSize: 24, fontWeight: 700, color: t.text1, lineHeight: 1 }}>
            {value}
          </span>
          {trend && (
            <span style={{
              fontFamily: F.inter, fontSize: 11, fontWeight: 500,
              color: trendFg, background: trendBg,
              padding: '1px 6px', borderRadius: 8,
            }}>
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function MSectionHeader({ text, t }: { text: string; t: T }) {
  return (
    <div style={{
      fontFamily: F.inter, fontSize: 11, fontWeight: 600,
      color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '24px 4px 10px',
    }}>
      {text}
    </div>
  );
}

function MSellerRow({
  medal, name, sold, kpi3, earned, isLast, t, onTap,
}: {
  medal: string; name: string; sold: number; kpi3: number; earned: string;
  isLast: boolean; t: T; onTap: () => void;
}) {
  return (
    <div
      onClick={onTap}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: t.blueLt,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        fontSize: 22, lineHeight: 1,
      }}>
        {medal}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {name}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: 13, color: t.text3, marginTop: 2,
        }}>
          {sold} продано · {kpi3} KPI 3
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 500, color: t.text2 }}>
          {earned}
        </span>
        <ChevronRight size={18} color={t.textDisabled} strokeWidth={1.75} />
      </div>
    </div>
  );
}

function MActivityRow({
  tint, text, time, isLast, t, dark,
}: {
  tint: 'green' | 'blue' | 'amber' | 'gray';
  text: string; time: string; isLast: boolean; t: T; dark: boolean;
}) {
  const palette = dark
    ? {
        green: { bg: 'rgba(52,211,153,0.15)', fg: '#34D399' },
        blue:  { bg: 'rgba(59,130,246,0.15)', fg: '#3B82F6' },
        amber: { bg: 'rgba(251,191,36,0.15)', fg: '#FBBF24' },
        gray:  { bg: 'rgba(160,165,184,0.15)', fg: '#A0A5B8' },
      }
    : {
        green: { bg: '#F0FDF4', fg: '#16A34A' },
        blue:  { bg: '#EFF6FF', fg: '#2563EB' },
        amber: { bg: '#FFFBEB', fg: '#D97706' },
        gray:  { bg: '#F3F4F6', fg: '#6B7280' },
      };
  const pal = palette[tint];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: pal.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: pal.fg }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: 14, color: t.text1,
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {text}
        </div>
        <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text4, marginTop: 2 }}>
          {time}
        </div>
      </div>
    </div>
  );
}

function MobileOrgDashboard({
  t, dark, navigate,
}: { t: T; dark: boolean; navigate: (p: string) => void }) {
  const conversionRows = [
    { label: 'Регистрация',    value: 185, pct: 80.4, tint: 'cyan'   as const },
    { label: 'Пополнение',     value: 120, pct: 52.2, tint: 'blue'   as const },
    { label: 'Оплата 500K',    value: 45,  pct: 19.6, tint: 'rose'   as const },
  ];

  return (
    <div style={{ padding: '12px 16px calc(80px + env(safe-area-inset-bottom, 0px))', boxSizing: 'border-box', width: '100%' }}>
      {/* Greeting */}
      <h1 style={{
        fontFamily: F.dm, fontSize: 32, fontWeight: 700,
        color: t.text1, margin: '4px 0 0', lineHeight: 1.1,
      }}>
        Привет, Рустам!
      </h1>
      <p style={{ fontFamily: F.inter, fontSize: 15, color: t.text3, margin: '6px 0 16px' }}>
        Mysafar OOO — обзор продаж
      </p>

      {/* Hero gradient card */}
      <div style={{
        background: dark
          ? 'linear-gradient(135deg, #1E3A5F 0%, #1A2B4A 100%)'
          : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
        borderRadius: 20, padding: 20, marginBottom: 16,
      }}>
        <div style={{ fontFamily: F.inter, fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 6 }}>
          Всего начислено
        </div>
        <div style={{ fontFamily: F.dm, fontSize: 32, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, marginBottom: 10 }}>
          1 825 000 UZS
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '4px 10px', borderRadius: 20,
          background: 'rgba(255,255,255,0.18)',
        }}>
          <TrendingUp size={14} color="#FFFFFF" strokeWidth={2.5} />
          <span style={{ fontFamily: F.inter, fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
            +12% vs прошлый месяц
          </span>
        </div>
      </div>

      {/* 2×2 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <MobileStatCard icon={CreditCard}  variant="blue"  label="Карт получено" value="500"      t={t} dark={dark} />
        <MobileStatCard icon={ShoppingBag} variant="green" label="Продано"       value="230" trend={{ value: '+12%', positive: true }} t={t} dark={dark} />
        <MobileStatCard icon={UserCheck}   variant="cyan"  label="KPI 1 (80%)"   value="185"      t={t} dark={dark} />
        <MobileStatCard icon={Wallet}      variant="rose"  label="KPI 3 (20%)"   value="45"       t={t} dark={dark} />
      </div>

      {/* Sellers */}
      <MSectionHeader text="Рейтинг продавцов" t={t} />
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
        overflow: 'hidden',
      }}>
        <MSellerRow medal="🥇" name="Санжар М."    sold={62} kpi3={15} earned="555K UZS" isLast={false} t={t} onTap={() => navigate('/sellers')} />
        <MSellerRow medal="🥈" name="Ислом Т."     sold={42} kpi3={10} earned="350K UZS" isLast={false} t={t} onTap={() => navigate('/sellers')} />
        <MSellerRow medal="🥉" name="Абдуллох Р."  sold={45} kpi3={8}  earned="330K UZS" isLast={true}  t={t} onTap={() => navigate('/sellers')} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 0' }}>
        <span
          onClick={() => navigate('/sellers')}
          style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.blue, padding: '10px 20px', cursor: 'pointer' }}
        >
          Все продавцы
        </span>
      </div>

      {/* KPI conversion */}
      <MSectionHeader text="KPI конверсия" t={t} />
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
        padding: 16,
      }}>
        {conversionRows.map((row, i) => {
          const iv = mIconVariant(row.tint, dark);
          return (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: i < conversionRows.length - 1 ? 14 : 0,
            }}>
              <div style={{
                minWidth: 100, fontFamily: F.inter, fontSize: 13, color: t.text2, flexShrink: 0,
              }}>
                {row.label}
              </div>
              <div style={{
                flex: 1, height: 8, borderRadius: 4,
                background: dark ? D.progressTrack : '#EFF6FF',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${row.pct}%`, height: '100%',
                  background: iv.color, borderRadius: 4,
                }} />
              </div>
              <div style={{
                width: 64, display: 'flex', flexDirection: 'column',
                alignItems: 'flex-end', flexShrink: 0,
              }}>
                <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 500, color: t.text1 }}>
                  {row.value}
                </span>
                <span style={{ fontFamily: F.inter, fontSize: 11, color: t.text4 }}>
                  {row.pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity */}
      <MSectionHeader text="Последняя активность" t={t} />
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
        overflow: 'hidden',
      }}>
        {ACTIVITIES.slice(0, 5).map((a, i, arr) => (
          <MActivityRow
            key={a.text}
            tint={a.color}
            text={a.text}
            time={a.time}
            isLast={i === arr.length - 1}
            t={t}
            dark={dark}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 0' }}>
        <span
          onClick={() => navigate('/notifications')}
          style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.blue, padding: '10px 20px', cursor: 'pointer' }}
        >
          Все уведомления
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function OrgAdminDashboardPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-13' });
  const [sellersHover, setSellersHover] = useState(false);
  const [activityHover, setActivityHover] = useState(false);
  const mobile = useIsMobile();

  const t = theme(darkMode);
  const dark = darkMode;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg }}>
      <style>{`
        .org-stat-cards {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        @media (max-width: 1200px) {
          .org-stat-cards {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .org-stat-cards {
            grid-template-columns: 1fr;
          }
        }
        .org-row2 {
          display: grid;
          grid-template-columns: 60fr 40fr;
          gap: 16px;
        }
        @media (max-width: 968px) {
          .org-row2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Sidebar role="org"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        {mobile ? (
          <MobileOrgDashboard t={t} dark={dark} navigate={navigate} />
        ) : (
        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/org-dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Дашборд</span>
          </div>

          {/* Top Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Дашборд
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
                Mysafar OOO — обзор продаж и KPI
              </p>
            </div>

            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* Row 1: Stat Cards */}
          <div className="org-stat-cards" style={{ marginBottom: '24px' }}>
            <StatCard
              icon={CreditCard}
              label="Карт получено"
              value="500"
              color="blue"
              t={t}
              dark={dark}
            />
            <StatCard
              icon={ShoppingBag}
              label="Карт продано"
              value="230"
              trend="+12%"
              color="green"
              t={t}
              dark={dark}
            />
            <StatCard
              icon={UserCheck}
              label="KPI 1 — Регистрация"
              value="185"
              subtitle="80.4% от продано"
              color="cyan"
              t={t}
              dark={dark}
            />
            <StatCard
              icon={ArrowUpDown}
              label="KPI 2 — Пополнение"
              value="120"
              subtitle="52.2%"
              color="amber"
              t={t}
              dark={dark}
            />
            <StatCard
              icon={Wallet}
              label="KPI 3 — Оплата 500K"
              value="45"
              subtitle="19.6%"
              color="rose"
              t={t}
              dark={dark}
            />
          </div>

          {/* Row 2: Seller Table + KPI Stepper */}
          <div className="org-row2" style={{ marginBottom: '24px' }}>
            {/* Left: Seller Table */}
            <div style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: '12px',
              padding: '24px',
            }}>
              <div style={{
                fontFamily: F.dm,
                fontSize: '16px',
                fontWeight: 600,
                color: t.text1,
                marginBottom: '20px',
              }}>
                Рейтинг продавцов
              </div>

              <SellerTable sellers={SELLERS} t={t} dark={dark} />

              <button
                onMouseEnter={() => setSellersHover(true)}
                onMouseLeave={() => setSellersHover(false)}
                style={{
                  marginTop: '16px',
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: sellersHover ? t.tableHover : 'transparent',
                  fontFamily: F.inter,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: sellersHover ? t.text1 : t.text3,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.12s',
                }}
              >
                Управление продавцами
                <ArrowRight size={14} strokeWidth={2} />
              </button>
            </div>

            {/* Right: KPI Conversion */}
            <div style={{
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: '12px',
              padding: '24px',
            }}>
              <div style={{
                fontFamily: F.dm,
                fontSize: '16px',
                fontWeight: 600,
                color: t.text1,
                marginBottom: '20px',
              }}>
                KPI конверсия
              </div>

              <KPIMiniStepper t={t} dark={dark} />

              <div style={{ height: '1px', background: t.border, margin: '24px 0' }} />

              <div style={{
                fontFamily: F.mono,
                fontSize: '20px',
                fontWeight: 700,
                color: t.text1,
                marginBottom: '4px',
              }}>
                1 825 000 UZS
              </div>
              <div style={{
                fontFamily: F.inter,
                fontSize: '13px',
                color: t.text3,
                marginBottom: '12px',
              }}>
                Общий заработок продавцов
              </div>
              <div style={{
                fontFamily: F.inter,
                fontSize: '13px',
                color: t.text3,
              }}>
                Выведено: 1 200 000 UZS
              </div>
            </div>
          </div>

          {/* Row 3: Activity Timeline */}
          <div style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{
              fontFamily: F.dm,
              fontSize: '16px',
              fontWeight: 600,
              color: t.text1,
              marginBottom: '24px',
            }}>
              Последняя активность
            </div>

            <ActivityTimeline activities={ACTIVITIES} t={t} dark={dark} />

            <button
              onMouseEnter={() => setActivityHover(true)}
              onMouseLeave={() => setActivityHover(false)}
              style={{
                marginTop: '20px',
                height: '36px',
                padding: '0 16px',
                border: 'none',
                borderRadius: '8px',
                background: activityHover ? t.tableHover : 'transparent',
                fontFamily: F.inter,
                fontSize: '14px',
                fontWeight: 500,
                color: activityHover ? t.text1 : t.text3,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.12s',
              }}
            >
              Показать все
              <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>

          <div style={{ height: '48px' }} />
        </div>
        )}
      </div>
    </div>
  );
}
