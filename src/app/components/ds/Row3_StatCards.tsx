import React from 'react';
import { TrendingUp, CreditCard, Users, Building2, Wallet, BarChart3, ChevronRight } from 'lucide-react';
import { F, C, theme } from './tokens';
import { useDarkMode } from '../useDarkMode';

type T = ReturnType<typeof theme>;

const ICON_LIGHT = {
  blue:   { bg: '#EFF6FF', color: '#2563EB' },
  violet: { bg: '#F3F0FF', color: '#7C3AED' },
  green:  { bg: '#F0FDF4', color: '#16A34A' },
  cyan:   { bg: '#ECFEFF', color: '#0891B2' },
  amber:  { bg: '#FFFBEB', color: '#D97706' },
  rose:   { bg: '#FFF1F2', color: '#E11D48' },
};

const ICON_DARK = {
  blue:   { bg: 'rgba(59,130,246,0.12)',  color: '#3B82F6' },
  violet: { bg: 'rgba(167,139,250,0.12)', color: '#A78BFA' },
  green:  { bg: 'rgba(52,211,153,0.12)',  color: '#34D399' },
  cyan:   { bg: 'rgba(34,211,238,0.12)',  color: '#22D3EE' },
  amber:  { bg: 'rgba(251,191,36,0.12)',  color: '#FBBF24' },
  rose:   { bg: 'rgba(251,113,133,0.12)', color: '#FB7185' },
};

const TREND_LIGHT = {
  up:   { bg: '#F0FDF4', color: '#15803D' },
  down: { bg: '#FEF2F2', color: '#DC2626' },
};

const TREND_DARK = {
  up:   { bg: 'rgba(52,211,153,0.12)',  color: '#34D399' },
  down: { bg: 'rgba(248,113,113,0.12)', color: '#F87171' },
};

type IconKey = keyof typeof ICON_LIGHT;

const statCards: Array<{
  icon: React.ElementType;
  iconKey: IconKey;
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  subtitle?: string;
}> = [
  { icon: CreditCard, iconKey: 'blue',   label: 'Выдано карт',           value: '5 000',      trend: { value: '+12%', positive: true  } },
  { icon: Users,      iconKey: 'violet', label: 'Активных продавцов',    value: '342',        trend: { value: '+8%',  positive: true  }, subtitle: 'Из 400 зарегистрированных' },
  { icon: TrendingUp, iconKey: 'green',  label: 'KPI 3 выполнено',       value: '567',        trend: { value: '-3%',  positive: false } },
  { icon: Building2,  iconKey: 'cyan',   label: 'Организаций',           value: '28' },
  { icon: Wallet,     iconKey: 'amber',  label: 'Начислено UCOIN',       value: '18 250 000', trend: { value: '+24%', positive: true  }, subtitle: 'UZS за апрель 2026' },
  { icon: BarChart3,  iconKey: 'rose',   label: 'Просрочено KPI',        value: '89',         trend: { value: '+5',   positive: false } },
];

function StatCard({ icon: Icon, iconKey, label, value, trend, subtitle, t, dark }: {
  icon: React.ElementType; iconKey: IconKey;
  label: string; value: string;
  trend?: { value: string; positive: boolean };
  subtitle?: string;
  t: T; dark: boolean;
}) {
  const iconPal = (dark ? ICON_DARK : ICON_LIGHT)[iconKey];
  const trendPal = trend ? (dark ? TREND_DARK : TREND_LIGHT)[trend.positive ? 'up' : 'down'] : null;
  return (
    <div
      style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minWidth: '220px',
        flex: '1 1 220px',
      }}
    >
      {/* Icon circle */}
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: iconPal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={iconPal.color} strokeWidth={2} />
      </div>
      {/* Content */}
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text3, marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.dm, fontSize: '28px', fontWeight: 700, color: t.text1, lineHeight: 1 }}>
            {value}
          </span>
          {trend && trendPal && (
            <span style={{
              fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
              color: trendPal.color,
              background: trendPal.bg,
              padding: '2px 8px', borderRadius: '12px',
              display: 'inline-flex', alignItems: 'center', gap: '2px',
            }}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        {subtitle && (
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4, marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

// Breadcrumb component
function Breadcrumb({ t }: { t: T }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.blue, cursor: 'pointer' }}>Партии карт</span>
      <ChevronRight size={12} color={t.textDisabled} />
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2, cursor: 'pointer' }}>Все партии</span>
      <ChevronRight size={12} color={t.textDisabled} />
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text1, fontWeight: 500 }}>Партия Апрель 2026 — Mysafar OOO</span>
    </div>
  );
}

export function Row3StatCards() {
  const [darkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '20px' }}>Stat Cards — 6 variants</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {statCards.map((card, i) => (
            <StatCard key={i} {...card} t={t} dark={dark} />
          ))}
        </div>
      </div>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '16px' }}>Breadcrumb Navigation</div>
        <Breadcrumb t={t} />
      </div>
    </div>
  );
}
