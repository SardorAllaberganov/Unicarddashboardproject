import React, { useState } from 'react';
import {
  LayoutDashboard, TrendingUp, Building2, Users, Package, CreditCard,
  Grid3X3, Receipt, Wallet, Settings, UserCog, ChevronLeft, ChevronRight,
  LogOut, Plus, Trash2, X, Download, Loader2
} from 'lucide-react';
import { F, C, D, theme } from './tokens';
import { useDarkMode } from '../useDarkMode';

type T = ReturnType<typeof theme>;

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

function NavItem({ icon: Icon, label, active, collapsed, t }: any) {
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
        background: active ? t.blueLt : hovered ? t.tableHover : 'transparent',
        justifyContent: collapsed ? 'center' : 'flex-start',
        transition: 'background 0.1s',
      }}
    >
      <Icon size={20} color={active ? t.blue : t.text3} strokeWidth={1.75} />
      {!collapsed && (
        <span style={{ fontFamily: F.inter, fontSize: '14px', color: active ? t.blue : t.text2 }}>
          {label}
        </span>
      )}
    </div>
  );
}

function DemoSidebar({ navGroups, role, collapsed, onToggle, t, dark }: any) {
  return (
    <div style={{
      width: collapsed ? '68px' : '260px',
      background: t.sidebarBg,
      borderRight: `1px solid ${t.sidebarBorder}`,
      height: '600px',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s',
      flexShrink: 0,
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
      border: `1px solid ${t.sidebarBorder}`,
    }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start', borderBottom: `1px solid ${t.border}`, paddingBottom: '12px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${t.border}`, background: dark ? t.tableHeaderBg : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: F.dm, fontSize: '10px', fontWeight: 700, color: t.blue }}>M</span>
        </div>
        {!collapsed && (
          <span style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1 }}>Moment KPI</span>
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute', top: '14px', right: '-12px',
          width: '24px', height: '24px', borderRadius: '50%',
          background: t.surface, border: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10,
        }}
      >
        {collapsed ? <ChevronRight size={12} color={t.text3} /> : <ChevronLeft size={12} color={t.text3} />}
      </button>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navGroups.map((group: any, gi: number) => (
          <div key={group.group} style={{ marginTop: gi > 0 ? '8px' : '0' }}>
            {gi > 0 && <div style={{ height: '1px', background: t.border, margin: '4px 0 8px' }} />}
            {!collapsed && (
              <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 12px 6px' }}>
                {group.group}
              </div>
            )}
            {group.items.map((item: any) => (
              <NavItem key={item.label} {...item} collapsed={collapsed} t={t} />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom user */}
      <div style={{ borderTop: `1px solid ${t.border}`, padding: '12px 12px', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: t.blueLt, border: `1px solid ${t.blueTint}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.blue }}>{role === 'bank' ? 'БА' : 'ОА'}</span>
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1 }}>{role === 'bank' ? 'Банк Админ' : 'Орг Админ'}</div>
              <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>{role === 'bank' ? 'bank_admin' : 'org_admin'}</div>
            </div>
          )}
        </div>
        {!collapsed && <LogOut size={16} color={t.text4} style={{ cursor: 'pointer', flexShrink: 0 }} />}
      </div>
    </div>
  );
}

// ─── BUTTONS ────────────────────────────────────────────────────────────────

function Btn({ variant, label, size = 'default', icon: Icon, loading, disabled, t, dark }: any) {
  const heights: any = { sm: '32px', default: '40px', lg: '44px' };
  const fontSizes: any = { sm: '13px', default: '14px', lg: '14px' };
  const paddings: any = { sm: '0 12px', default: '0 16px', lg: '0 20px' };

  const primaryDisabled = dark ? 'rgba(59,130,246,0.35)' : '#93C5FD';
  const variants: any = {
    primary: { bg: disabled ? primaryDisabled : t.blue, color: '#FFFFFF', border: 'none' },
    outline: { bg: t.surface, color: t.text2, border: `1px solid ${t.inputBorder}` },
    ghost: { bg: 'transparent', color: t.text2, border: 'none' },
    destructive: { bg: t.error, color: '#FFFFFF', border: 'none' },
    'destructive-outline': { bg: t.surface, color: t.error, border: `1px solid ${t.error}` },
    icon: { bg: 'transparent', color: t.text2, border: 'none' },
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

type BadgeKey = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'blue';

const BADGE_LIGHT: Record<BadgeKey, { bg: string; color: string }> = {
  success: { bg: '#F0FDF4', color: '#15803D' },
  warning: { bg: '#FFFBEB', color: '#B45309' },
  error:   { bg: '#FEF2F2', color: '#DC2626' },
  info:    { bg: '#ECFEFF', color: '#0E7490' },
  neutral: { bg: '#F3F4F6', color: '#4B5563' },
  blue:    { bg: '#EFF6FF', color: '#1D4ED8' },
};

const BADGE_DARK: Record<BadgeKey, { bg: string; color: string }> = {
  success: { bg: 'rgba(52,211,153,0.12)',  color: '#34D399' },
  warning: { bg: 'rgba(251,191,36,0.12)',  color: '#FBBF24' },
  error:   { bg: 'rgba(248,113,113,0.12)', color: '#F87171' },
  info:    { bg: 'rgba(34,211,238,0.12)',  color: '#22D3EE' },
  neutral: { bg: 'rgba(160,165,184,0.12)', color: '#A0A5B8' },
  blue:    { bg: 'rgba(59,130,246,0.12)',  color: '#3B82F6' },
};

// ─── STAT PILL ─────────────────────────────────────────────────────────────

function StatPill({ label, variant = 'neutral', t, dark }: { label: string; variant?: 'neutral' | 'blue' | 'green'; t: T; dark: boolean }) {
  const pills: any = {
    neutral: { color: t.text2,    borderCol: t.border },
    blue:    { color: t.blue,     borderCol: dark ? D.blueTint  : '#DBEAFE' },
    green:   { color: dark ? '#34D399' : '#15803D', borderCol: dark ? 'rgba(52,211,153,0.35)' : '#BBF7D0' },
  };
  const s = pills[variant];
  return (
    <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: s.color, border: `1px solid ${s.borderCol}`, borderRadius: '20px', padding: '6px 16px', background: t.surface }}>
      {label}
    </div>
  );
}

export function Row2SidebarBtnBadge() {
  const [darkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  const [bankCollapsed, setBankCollapsed] = useState(false);
  const [orgCollapsed, setOrgCollapsed] = useState(true);

  const badgeMap = dark ? BADGE_DARK : BADGE_LIGHT;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Sidebars */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '8px' }}>Sidebar Navigation</div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '24px' }}>Bank Admin (10 items) · Org Admin (7 items) · Toggle collapse</div>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Bank Admin {bankCollapsed ? '(Collapsed)' : '(Expanded)'}</div>
            <DemoSidebar navGroups={bankAdminNav} role="bank" collapsed={bankCollapsed} onToggle={() => setBankCollapsed(!bankCollapsed)} t={t} dark={dark} />
          </div>
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Org Admin {orgCollapsed ? '(Collapsed)' : '(Expanded)'}</div>
            <DemoSidebar navGroups={orgAdminNav} role="org" collapsed={orgCollapsed} onToggle={() => setOrgCollapsed(!orgCollapsed)} t={t} dark={dark} />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '20px' }}>Button Variants</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Variants</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <Btn variant="primary" label="Сохранить" icon={null} t={t} dark={dark} />
              <Btn variant="outline" label="Отмена" t={t} dark={dark} />
              <Btn variant="ghost" label="Показать все →" t={t} dark={dark} />
              <Btn variant="destructive" label="Удалить" icon={Trash2} t={t} dark={dark} />
              <Btn variant="destructive-outline" label="Деактивировать" t={t} dark={dark} />
              <Btn variant="icon" icon={Download} t={t} dark={dark} />
              <Btn variant="icon" icon={X} t={t} dark={dark} />
            </div>
          </div>
          <div style={{ height: '1px', background: t.border }} />
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Sizes</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <Btn variant="primary" label="Small" size="sm" t={t} dark={dark} />
              <Btn variant="primary" label="Default" size="default" t={t} dark={dark} />
              <Btn variant="primary" label="Large" size="lg" t={t} dark={dark} />
              <Btn variant="outline" label="Small" size="sm" t={t} dark={dark} />
              <Btn variant="outline" label="Default" size="default" t={t} dark={dark} />
            </div>
          </div>
          <div style={{ height: '1px', background: t.border }} />
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>States</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <Btn variant="primary" label="Загрузка..." loading={true} t={t} dark={dark} />
              <Btn variant="primary" label="Disabled" disabled={true} t={t} dark={dark} />
              <Btn variant="outline" label="Disabled" disabled={true} t={t} dark={dark} />
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '20px' }}>Badge Variants</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Success</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="Активна"   bg={badgeMap.success.bg} color={badgeMap.success.color} />
              <Badge label="Начислено" bg={badgeMap.success.bg} color={badgeMap.success.color} />
              <Badge label="Выполнено" bg={badgeMap.success.bg} color={badgeMap.success.color} />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: t.border }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Warning</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="На паузе"   bg={badgeMap.warning.bg} color={badgeMap.warning.color} />
              <Badge label="В процессе" bg={badgeMap.warning.bg} color={badgeMap.warning.color} />
              <Badge label="Ожидание"   bg={badgeMap.warning.bg} color={badgeMap.warning.color} />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: t.border }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Error</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="Неактивна"  bg={badgeMap.error.bg} color={badgeMap.error.color} />
              <Badge label="Ошибка"     bg={badgeMap.error.bg} color={badgeMap.error.color} />
              <Badge label="Просрочено" bg={badgeMap.error.bg} color={badgeMap.error.color} />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: t.border }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Info</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="Зарег."   bg={badgeMap.info.bg} color={badgeMap.info.color} />
              <Badge label="Продана"  bg={badgeMap.info.bg} color={badgeMap.info.color} />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: t.border }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Default</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="На складе" bg={badgeMap.neutral.bg} color={badgeMap.neutral.color} />
              <Badge label="Черновик"  bg={badgeMap.neutral.bg} color={badgeMap.neutral.color} />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: t.border }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Outline</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="VISA SUM" bg="transparent" color={t.text2} border={`1px solid ${t.border}`} />
              <Badge label="VISA USD" bg="transparent" color={t.text2} border={`1px solid ${t.border}`} />
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: t.border }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Blue</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <Badge label="KPI 1" bg={badgeMap.blue.bg} color={badgeMap.blue.color} />
              <Badge label="KPI 2" bg={badgeMap.blue.bg} color={badgeMap.blue.color} />
              <Badge label="KPI 3" bg={badgeMap.blue.bg} color={badgeMap.blue.color} />
            </div>
          </div>
        </div>
      </div>

      {/* Stat Pills */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '16px' }}>Stat Pills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <StatPill label="Всего: 5 000"      variant="neutral" t={t} dark={dark} />
          <StatPill label="На складе: 1 260"  variant="neutral" t={t} dark={dark} />
          <StatPill label="Продано: 2 340"    variant="blue"    t={t} dark={dark} />
          <StatPill label="KPI 1 ✅: 1 890"    variant="blue"    t={t} dark={dark} />
          <StatPill label="KPI 2 ✅: 1 210"    variant="blue"    t={t} dark={dark} />
          <StatPill label="KPI 3 ✅: 567"      variant="green"   t={t} dark={dark} />
        </div>
      </div>
    </div>
  );
}
