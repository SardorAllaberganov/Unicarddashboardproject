import React from 'react';
import { CreditCard, Users, TrendingUp, Wallet, Building2, BarChart3 } from 'lucide-react';
import { F, theme, Pair, T } from './frame';

/* ═══════════════════════════════════════════════════════════════════════════
   §6 STAT CARDS — MOBILE
═══════════════════════════════════════════════════════════════════════════ */

type IconKey = 'blue' | 'violet' | 'green' | 'cyan' | 'amber' | 'rose';

const ICON_LIGHT: Record<IconKey, { bg: string; fg: string }> = {
  blue:   { bg: '#EFF6FF', fg: '#2563EB' },
  violet: { bg: '#F3F0FF', fg: '#7C3AED' },
  green:  { bg: '#F0FDF4', fg: '#16A34A' },
  cyan:   { bg: '#ECFEFF', fg: '#0891B2' },
  amber:  { bg: '#FFFBEB', fg: '#D97706' },
  rose:   { bg: '#FFF1F2', fg: '#E11D48' },
};

const ICON_DARK: Record<IconKey, { bg: string; fg: string }> = {
  blue:   { bg: 'rgba(59,130,246,0.15)',  fg: '#3B82F6' },
  violet: { bg: 'rgba(167,139,250,0.15)', fg: '#A78BFA' },
  green:  { bg: 'rgba(52,211,153,0.15)',  fg: '#34D399' },
  cyan:   { bg: 'rgba(34,211,238,0.15)',  fg: '#22D3EE' },
  amber:  { bg: 'rgba(251,191,36,0.15)',  fg: '#FBBF24' },
  rose:   { bg: 'rgba(251,113,133,0.15)', fg: '#FB7185' },
};

const TREND_LIGHT = {
  up:   { bg: '#F0FDF4', fg: '#15803D' },
  down: { bg: '#FEF2F2', fg: '#DC2626' },
};

const TREND_DARK = {
  up:   { bg: 'rgba(52,211,153,0.15)',  fg: '#34D399' },
  down: { bg: 'rgba(248,113,113,0.15)', fg: '#F87171' },
};

type StatDef = {
  icon: React.ElementType;
  iconKey: IconKey;
  label: string;
  value: string;
  trend?: { value: string; up: boolean };
  subtitle?: string;
};

const STATS: StatDef[] = [
  { icon: CreditCard, iconKey: 'blue',   label: 'Выдано карт',        value: '5 000',      trend: { value: '+12%', up: true  } },
  { icon: Users,      iconKey: 'violet', label: 'Активных продавцов', value: '342',        trend: { value: '+8%',  up: true  }, subtitle: 'Из 400 зарегистрированных' },
  { icon: TrendingUp, iconKey: 'green',  label: 'KPI 3 выполнено',    value: '567',        trend: { value: '-3%',  up: false } },
  { icon: Building2,  iconKey: 'cyan',   label: 'Организаций',        value: '28' },
  { icon: Wallet,     iconKey: 'amber',  label: 'Начислено UCOIN',    value: '18.25M',     trend: { value: '+24%', up: true  }, subtitle: 'UZS · апрель 2026' },
  { icon: BarChart3,  iconKey: 'rose',   label: 'Просрочено KPI',     value: '89',         trend: { value: '+5',   up: false } },
];

function StatCard({
  stat, layout, dark,
}: { stat: StatDef; layout: 'full' | 'half'; dark: boolean }) {
  const t = theme(dark);
  const iconPal = (dark ? ICON_DARK : ICON_LIGHT)[stat.iconKey];
  const trendPal = stat.trend ? (dark ? TREND_DARK : TREND_LIGHT)[stat.trend.up ? 'up' : 'down'] : null;
  const Icon = stat.icon;
  return (
    <div style={{
      width: layout === 'full' ? '100%' : '100%',
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: 16, padding: 16,
      display: 'flex', flexDirection: 'column', gap: 12,
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        background: iconPal.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={24} color={iconPal.fg} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text3, marginBottom: 4 }}>
          {stat.label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.dm, fontSize: '28px', fontWeight: 700, color: t.text1, lineHeight: 1 }}>
            {stat.value}
          </span>
          {stat.trend && trendPal && (
            <span style={{
              fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
              color: trendPal.fg, background: trendPal.bg,
              padding: '2px 8px', borderRadius: '10px',
              display: 'inline-flex', alignItems: 'center', gap: 2,
            }}>
              {stat.trend.up ? '↑' : '↓'} {stat.trend.value}
            </span>
          )}
        </div>
        {stat.subtitle && (
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4, marginTop: 4 }}>
            {stat.subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, background: t.pageBg, padding: '24px 16px', minHeight: '100%' }}>
      {/* Full-width single-column */}
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          Single column · full-width
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StatCard stat={STATS[0]} layout="full" dark={dark} />
          <StatCard stat={STATS[4]} layout="full" dark={dark} />
        </div>
      </div>

      {/* 2-col grid */}
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          2-column grid (48 / 48 · gap 12)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {STATS.slice(0, 4).map((s, i) => (
            <StatCard key={i} stat={s} layout="half" dark={dark} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC
═══════════════════════════════════════════════════════════════════════════ */

export const M_Cards = {
  Stats: ({ t: _t }: { t: T }) => (
    <Pair height={820} note="Two full-width cards (primary KPIs) above a 2×2 grid (secondary metrics). 48 px tinted icon circle, DM Sans 28/700 value, inline trend pill.">
      {(dark) => <StatsCol dark={dark} />}
    </Pair>
  ),
};
