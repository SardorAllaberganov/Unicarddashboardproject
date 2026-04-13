import React from 'react';
import { TrendingUp, CreditCard, Users, Building2, Wallet, BarChart3, ChevronRight } from 'lucide-react';
import { F, C } from './tokens';

const statCards = [
  {
    icon: CreditCard,
    iconBg: '#EFF6FF', iconColor: '#2563EB',
    label: 'Выдано карт',
    value: '5 000',
    trend: { value: '+12%', positive: true },
  },
  {
    icon: Users,
    iconBg: '#F3F0FF', iconColor: '#7C3AED',
    label: 'Активных продавцов',
    value: '342',
    trend: { value: '+8%', positive: true },
    subtitle: 'Из 400 зарегистрированных',
  },
  {
    icon: TrendingUp,
    iconBg: '#F0FDF4', iconColor: '#16A34A',
    label: 'KPI 3 выполнено',
    value: '567',
    trend: { value: '-3%', positive: false },
  },
  {
    icon: Building2,
    iconBg: '#ECFEFF', iconColor: '#0891B2',
    label: 'Организаций',
    value: '28',
  },
  {
    icon: Wallet,
    iconBg: '#FFFBEB', iconColor: '#D97706',
    label: 'Начислено UCOIN',
    value: '18 250 000',
    trend: { value: '+24%', positive: true },
    subtitle: 'UZS за апрель 2026',
  },
  {
    icon: BarChart3,
    iconBg: '#FFF1F2', iconColor: '#E11D48',
    label: 'Просрочено KPI',
    value: '89',
    trend: { value: '+5', positive: false },
  },
];

function StatCard({ icon: Icon, iconBg, iconColor, label, value, trend, subtitle }: any) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1px solid #E5E7EB`,
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
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={20} color={iconColor} strokeWidth={2} />
      </div>
      {/* Content */}
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: '#6B7280', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.dm, fontSize: '28px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
            {value}
          </span>
          {trend && (
            <span style={{
              fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
              color: trend.positive ? '#15803D' : '#DC2626',
              background: trend.positive ? '#F0FDF4' : '#FEF2F2',
              padding: '2px 8px', borderRadius: '12px',
              display: 'inline-flex', alignItems: 'center', gap: '2px',
            }}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        {subtitle && (
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

// Breadcrumb component
function Breadcrumb() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: '#2563EB', cursor: 'pointer' }}>Партии карт</span>
      <ChevronRight size={12} color="#D1D5DB" />
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: '#374151', cursor: 'pointer' }}>Все партии</span>
      <ChevronRight size={12} color="#D1D5DB" />
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: '#111827', fontWeight: 500 }}>Партия Апрель 2026 — Mysafar OOO</span>
    </div>
  );
}

export function Row3StatCards() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Stat Cards — 6 variants</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {statCards.map((card, i) => (
            <StatCard key={i} {...card} />
          ))}
        </div>
      </div>

      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Breadcrumb Navigation</div>
        <Breadcrumb />
      </div>
    </div>
  );
}