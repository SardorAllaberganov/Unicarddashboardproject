import React, { useState } from 'react';
import {
  LayoutDashboard, TrendingUp, Building2, Users, Package, CreditCard,
  Grid3X3, Receipt, Wallet, Settings, UserCog, ChevronLeft, ChevronRight,
  LogOut, Plus, Trash2, X, Download, Loader2
} from 'lucide-react';
import { F, C } from './tokens';

// ─── SIDEBAR ────────────────────────────────────────────────────────────────

const bankAdminNav = [
  { group: 'ОБЗОР', items: [
    { icon: LayoutDashboard, label: 'Главная', active: true },
    { icon: TrendingUp, label: 'Аналитика' },
  ]},
  { group: 'УПРАВЛЕНИЕ', items: [
    { icon: Building2, label: 'Организации' },
    { icon: Users, label: 'Продавцы' },
    { icon: Package, label: 'Партии карт' },
    { icon: Grid3X3, label: 'Реестр карт' },
  ]},
  { group: 'ФИНАНСЫ', items: [
    { icon: Receipt, label: 'Транзакции' },
    { icon: Wallet, label: 'UCOIN кошельки' },
  ]},
  { group: 'СИСТЕМА', items: [
    { icon: Settings, label: 'Настройки KPI' },
    { icon: UserCog, label: 'Пользователи' },
  ]},
];

const orgAdminNav = [
  { group: 'ОБЗОР', items: [
    { icon: LayoutDashboard, label: 'Главная', active: true },
    { icon: TrendingUp, label: 'Аналитика' },
  ]},
  { group: 'УПРАВЛЕНИЕ', items: [
    { icon: Users, label: 'Продавцы' },
    { icon: Package, label: 'Партии карт' },
    { icon: CreditCard, label: 'Реестр карт' },
  ]},
  { group: 'ФИНАНСЫ', items: [
    { icon: Receipt, label: 'Транзакции' },
  ]},
  { group: 'СИСТЕМА', items: [
    { icon: Settings, label: 'Настройки' },
  ]},
];

function NavItem({ icon: Icon, label, active, collapsed }: any) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: collapsed ? '10px 0' : '10px 12px',
        borderRadius: '8px',
        cursor: 'pointer',
        background: active ? '#EFF6FF' : hovered ? '#F9FAFB' : 'transparent',
        justifyContent: collapsed ? 'center' : 'flex-start',
        transition: 'background 0.1s',
      }}
    >
      <Icon size={20} color={active ? '#2563EB' : '#6B7280'} strokeWidth={1.75} />
      {!collapsed && (
        <span style={{ fontFamily: F.inter, fontSize: '14px', color: active ? '#2563EB' : '#374151' }}>
          {label}
        </span>
      )}
    </div>
  );
}

function Sidebar({ navGroups, role, collapsed, onToggle }: any) {
  return (
    <div style={{
      width: collapsed ? '68px' : '260px',
      background: '#FFFFFF',
      borderRight: `1px solid #E5E7EB`,
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s',
      flexShrink: 0,
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start', borderBottom: `1px solid #E5E7EB`, paddingBottom: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', border: `1px solid #E5E7EB`, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: F.dm, fontSize: '10px', fontWeight: 700, color: '#2563EB' }}>M</span>
        </div>
        {!collapsed && (
          <span style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: '#111827' }}>Moment KPI</span>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute', top: '14px', right: '-12px',
          width: '24px', height: '24px', borderRadius: '50%',
          background: '#FFFFFF', border: `1px solid #E5E7EB`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10,
        }}
      >
        {collapsed ? <ChevronRight size={12} color="#6B7280" /> : <ChevronLeft size={12} color="#6B7280" />}
      </button>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navGroups.map((group: any, gi: number) => (
          <div key={group.group} style={{ marginTop: gi > 0 ? '8px' : '0' }}>
            {gi > 0 && <div style={{ height: '1px', background: '#E5E7EB', margin: '4px 0 8px' }} />}
            {!collapsed && (
              <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 6px' }}>
                {group.group}
              </div>
            )}
            {group.items.map((item: any) => (
              <NavItem key={item.label} {...item} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom user */}
      <div style={{ borderTop: `1px solid #E5E7EB`, padding: '12px 12px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EFF6FF', border: `1px solid #DBEAFE`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: '#2563EB' }}>{role === 'bank' ? 'БА' : 'ОА'}</span>
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#111827' }}>{role === 'bank' ? 'Банк Админ' : 'Орг Админ'}</div>
              <div style={{ fontFamily: F.inter, fontSize: '12px', color: '#9CA3AF' }}>{role === 'bank' ? 'bank_admin' : 'org_admin'}</div>
            </div>
          )}
        </div>
        {!collapsed && <LogOut size={16} color="#9CA3AF" style={{ cursor: 'pointer', flexShrink: 0 }} />}
      </div>
    </div>
  );
}

// ─── BUTTONS ────────────────────────────────────────────────────────────────

function Btn({ variant, label, size = 'default', icon: Icon, loading, disabled }: any) {
  const heights: any = { sm: '32px', default: '40px', lg: '44px' };
  const fontSizes: any = { sm: '13px', default: '14px', lg: '14px' };
  const paddings: any = { sm: '0 12px', default: '0 16px', lg: '0 20px' };

  const variants: any = {
    primary: { bg: disabled ? '#93C5FD' : '#2563EB', color: '#FFFFFF', border: 'none' },
    outline: { bg: '#FFFFFF', color: '#374151', border: `1px solid #D1D5DB` },
    ghost: { bg: 'transparent', color: '#374151', border: 'none' },
    destructive: { bg: '#EF4444', color: '#FFFFFF', border: 'none' },
    'destructive-outline': { bg: '#FFFFFF', color: '#EF4444', border: `1px solid #EF4444` },
    icon: { bg: 'transparent', color: '#374151', border: 'none' },
  };

  const v = variants[variant] || variants.primary;

  return (
    <button style={{
      height: heights[size],
      padding: variant === 'icon' ? '0' : paddings[size],
      width: variant === 'icon' ? heights[size] : 'auto',
      background: v.bg,
      color: v.color,
      border: v.border,
      borderRadius: '8px',
      fontFamily: F.inter,
      fontSize: fontSizes[size],
      fontWeight: 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      opacity: disabled ? 0.5 : 1,
      whiteSpace: 'nowrap',
    }}>
      {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : Icon && variant !== 'icon' ? <Icon size={16} /> : null}
      {variant === 'icon' ? (Icon && <Icon size={16} />) : loading ? 'Загрузка...' : label}
    </button>
  );
}

// ─── BADGES ────────────────────────────────────────────────────────────────

function Badge({ label, bg, color, border }: any) {
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '2px 10px', borderRadius: '10px',
      background: bg, color, border: border || 'none',
      display: 'inline-flex', alignItems: 'center',
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );
}

// ─── STAT PILL ─────────────────────────────────────────────────────────────

function StatPill({ label, variant = 'neutral' }: { label: string; variant?: 'neutral' | 'blue' | 'green' }) {
  const styles: any = {
    neutral: { color: '#374151', border: `1px solid #E5E7EB`, bg: '#FFFFFF' },
    blue: { color: '#2563EB', border: `1px solid #DBEAFE`, bg: '#FFFFFF' },
    green: { color: '#15803D', border: `1px solid #BBF7D0`, bg: '#FFFFFF' },
  };
  const s = styles[variant];
  return (
    <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: s.color, border: s.border, borderRadius: '20px', padding: '6px 16px', background: s.bg }}>
      {label}
    </div>
  );
}

export function Row2SidebarBtnBadge() {
  const [bankCollapsed, setBankCollapsed] = useState(false);
  const [orgCollapsed, setOrgCollapsed] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Sidebars */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Sidebar Navigation</div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>Bank Admin (10 items) · Org Admin (7 items) · Toggle collapse</div>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Bank Admin {bankCollapsed ? '(Collapsed)' : '(Expanded)'}</div>
            <Sidebar navGroups={bankAdminNav} role="bank" collapsed={bankCollapsed} onToggle={() => setBankCollapsed(!bankCollapsed)} />
          </div>
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Org Admin {orgCollapsed ? '(Collapsed)' : '(Expanded)'}</div>
            <Sidebar navGroups={orgAdminNav} role="org" collapsed={orgCollapsed} onToggle={() => setOrgCollapsed(!orgCollapsed)} />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Button Variants</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Variants</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <Btn variant="primary" label="Сохранить" icon={null} />
              <Btn variant="outline" label="Отмена" />
              <Btn variant="ghost" label="Показать все →" />
              <Btn variant="destructive" label="Удалить" icon={Trash2} />
              <Btn variant="destructive-outline" label="Деактивировать" />
              <Btn variant="icon" icon={Download} />
              <Btn variant="icon" icon={X} />
            </div>
          </div>
          <div style={{ height: '1px', background: '#E5E7EB' }} />
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Sizes</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <Btn variant="primary" label="Small" size="sm" />
              <Btn variant="primary" label="Default" size="default" />
              <Btn variant="primary" label="Large" size="lg" />
              <Btn variant="outline" label="Small" size="sm" />
              <Btn variant="outline" label="Default" size="default" />
            </div>
          </div>
          <div style={{ height: '1px', background: '#E5E7EB' }} />
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>States</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <Btn variant="primary" label="Загрузка..." loading={true} />
              <Btn variant="primary" label="Disabled" disabled={true} />
              <Btn variant="outline" label="Disabled" disabled={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Badge Variants</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="Активна" bg="#F0FDF4" color="#15803D" />
              <Badge label="Начислено" bg="#F0FDF4" color="#15803D" />
              <Badge label="Выполнено" bg="#F0FDF4" color="#15803D" />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#E5E7EB' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Warning</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="На паузе" bg="#FFFBEB" color="#B45309" />
              <Badge label="В процессе" bg="#FFFBEB" color="#B45309" />
              <Badge label="Ожидание" bg="#FFFBEB" color="#B45309" />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#E5E7EB' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Error</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="Неактивна" bg="#FEF2F2" color="#DC2626" />
              <Badge label="Ошибка" bg="#FEF2F2" color="#DC2626" />
              <Badge label="Просрочено" bg="#FEF2F2" color="#DC2626" />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#E5E7EB' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Info</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="Зарег." bg="#ECFEFF" color="#0E7490" />
              <Badge label="Продана" bg="#ECFEFF" color="#0E7490" />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#E5E7EB' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Default</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="На складе" bg="#F3F4F6" color="#4B5563" />
              <Badge label="Черновик" bg="#F3F4F6" color="#4B5563" />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#E5E7EB' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Outline</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="VISA SUM" bg="transparent" color="#374151" border="1px solid #E5E7EB" />
              <Badge label="VISA USD" bg="transparent" color="#374151" border="1px solid #E5E7EB" />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#E5E7EB' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Blue</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="KPI 1" bg="#EFF6FF" color="#1D4ED8" />
              <Badge label="KPI 2" bg="#EFF6FF" color="#1D4ED8" />
              <Badge label="KPI 3" bg="#EFF6FF" color="#1D4ED8" />
            </div>
          </div>
        </div>
      </div>

      {/* Stat Pills */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Stat Pills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <StatPill label="Всего: 5 000" variant="neutral" />
          <StatPill label="На складе: 1 260" variant="neutral" />
          <StatPill label="Продано: 2 340" variant="blue" />
          <StatPill label="KPI 1 ✅: 1 890" variant="blue" />
          <StatPill label="KPI 2 ✅: 1 210" variant="blue" />
          <StatPill label="KPI 3 ✅: 567" variant="green" />
        </div>
      </div>
    </div>
  );
}
