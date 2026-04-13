import React, { useState } from 'react';
import {
  LayoutDashboard, Users, CreditCard, ClipboardCheck,
  Wallet, ArrowDownToLine, Settings,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { F, C } from './ds/tokens';

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface OrgAdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  darkMode?: boolean;
  onDarkModeToggle?: () => void;
  orgName?: string;
}

/* ─── Navigation config ─────────────────────────────────────────────────── */

const NAV_ITEMS_CONFIG: { group: string; items: { icon: React.ElementType; label: string; badge?: number; path?: string }[] }[] = [
  {
    group: 'ОБЗОР',
    items: [
      { icon: LayoutDashboard, label: 'Дашборд', path: '/org-dashboard' },
    ],
  },
  {
    group: 'УПРАВЛЕНИЕ',
    items: [
      { icon: Users,           label: 'Продавцы', path: '/sellers' },
      { icon: CreditCard,      label: 'Карты', path: '/org-cards' },
      { icon: ClipboardCheck,  label: 'Назначение карт' },
    ],
  },
  {
    group: 'ФИНАНСЫ',
    items: [
      { icon: Wallet,          label: 'Вознаграждения' },
      { icon: ArrowDownToLine, label: 'Выводы' },
    ],
  },
  {
    group: 'СИСТЕМА',
    items: [
      { icon: Settings, label: 'Настройки' },
    ],
  },
];

/* ─── NavItem row ────────────────────────────────────────────────────────── */

function NavItemRow({
  icon: Icon, label, active = false, badge, collapsed, dark, onClick,
}: NavItem & { collapsed: boolean; dark: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);

  const bg        = active  ? (dark ? '#1E3A5F' : C.blueLt)
                 : hovered ? (dark ? '#1F2937' : '#F9FAFB')
                 : 'transparent';
  const iconColor = active ? C.blue : dark ? '#9CA3AF' : C.text3;
  const textColor = active ? C.blue : dark ? '#D1D5DB' : C.text2;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        height: '40px',
        padding: collapsed ? '0' : '0 12px',
        paddingLeft: collapsed ? '0' : active ? '10px' : '12px',
        borderRadius: '8px',
        cursor: 'pointer',
        background: bg,
        justifyContent: collapsed ? 'center' : 'flex-start',
        transition: 'background 0.12s',
        boxSizing: 'border-box',
        borderLeft: !collapsed && active
          ? `2px solid ${C.blue}`
          : !collapsed ? '2px solid transparent' : 'none',
      }}
    >
      <Icon size={18} color={iconColor} strokeWidth={active ? 2 : 1.75} style={{ flexShrink: 0 }} />

      {!collapsed && (
        <span style={{
          fontFamily: F.inter,
          fontSize: '14px',
          fontWeight: active ? 500 : 400,
          color: textColor,
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {label}
        </span>
      )}

      {/* Numeric badge */}
      {badge !== undefined && badge > 0 && !collapsed && (
        <div style={{
          background: C.blue,
          color: '#FFFFFF',
          fontFamily: F.inter,
          fontSize: '11px',
          fontWeight: 600,
          minWidth: '18px',
          height: '18px',
          borderRadius: '9px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 5px',
          flexShrink: 0,
        }}>
          {badge}
        </div>
      )}

      {/* Collapsed badge dot */}
      {badge !== undefined && badge > 0 && collapsed && (
        <div style={{
          position: 'absolute',
          top: '7px', right: '10px',
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: C.blue,
        }} />
      )}

      {/* Hover tooltip (collapsed only) */}
      {collapsed && hovered && (
        <div style={{
          position: 'absolute',
          left: 'calc(100% + 10px)',
          top: '50%',
          transform: 'translateY(-50%)',
          background: dark ? '#1F2937' : C.text1,
          color: '#FFFFFF',
          fontFamily: F.inter,
          fontSize: '12px',
          fontWeight: 500,
          padding: '5px 10px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          zIndex: 100,
          pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
        }}>
          {label}
          <div style={{
            position: 'absolute',
            left: '-4px', top: '50%', transform: 'translateY(-50%)',
            width: 0, height: 0,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderRight: `4px solid ${dark ? '#1F2937' : C.text1}`,
          }} />
        </div>
      )}
    </div>
  );
}


/* ─── Main Sidebar ───────────────────────────────────────────────────────── */

export function OrgAdminSidebar({
  collapsed = false,
  onToggle,
  darkMode = false,
  orgName = 'Mysafar OOO',
}: OrgAdminSidebarProps) {
  const dark = darkMode;
  const [collapseHovered, setCollapseHovered] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const surfaceBg       = dark ? '#111827' : C.surface;
  const borderColor     = dark ? '#374151' : C.border;
  const groupLabelColor = dark ? '#6B7280' : C.text4;
  const dividerColor    = dark ? '#1F2937' : C.divider;

  return (
    <div style={{
      width: collapsed ? '68px' : '260px',
      minWidth: collapsed ? '68px' : '260px',
      background: surfaceBg,
      borderRight: `1px solid ${borderColor}`,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s ease, min-width 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Header ─────────────────────────────────────── */}
      <div style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: '0 16px',
        borderBottom: `1px solid ${borderColor}`,
        flexShrink: 0,
        gap: '10px',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: C.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: F.dm, fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>M</span>
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontFamily: F.dm, fontSize: '15px', fontWeight: 700, color: dark ? '#F9FAFB' : C.text1, whiteSpace: 'nowrap', lineHeight: 1.2 }}>
              Moment KPI
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.blue, whiteSpace: 'nowrap', marginTop: '1px' }}>
              {orgName}
            </div>
          </div>
        )}
      </div>

      {/* ── Nav ────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        scrollbarWidth: 'none',
      }}>
        {NAV_ITEMS_CONFIG.map((group, gi) => (
          <div key={group.group}>
            {gi > 0 && (
              <div style={{ height: '1px', background: dividerColor, margin: '6px 4px 8px' }} />
            )}

            {!collapsed && (
              <div style={{
                fontFamily: F.inter,
                fontSize: '11px',
                fontWeight: 600,
                color: groupLabelColor,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                padding: '0 12px 4px',
                marginTop: gi > 0 ? '0' : '4px',
              }}>
                {group.group}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {group.items.map(item => {
                const isActive = item.path ? pathname === item.path : false;
                return (
                  <NavItemRow
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    active={isActive}
                    collapsed={collapsed}
                    dark={dark}
                    onClick={item.path ? () => navigate(item.path!) : undefined}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom: collapse toggle ─────────────────────────────── */}
      <div style={{ flexShrink: 0, borderTop: `1px solid ${borderColor}` }}>
        <button
          onClick={onToggle}
          onMouseEnter={() => setCollapseHovered(true)}
          onMouseLeave={() => setCollapseHovered(false)}
          title={collapsed ? 'Развернуть панель' : 'Свернуть панель'}
          style={{
            width: '100%', height: '44px',
            background: collapseHovered ? (dark ? '#1F2937' : '#F9FAFB') : 'transparent',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '10px', padding: collapsed ? '0' : '0 16px',
            transition: 'background 0.12s',
          }}
        >
          {collapsed ? (
            <ChevronRight size={16} color={groupLabelColor} strokeWidth={1.75} />
          ) : (
            <>
              <ChevronLeft size={16} color={groupLabelColor} strokeWidth={1.75} />
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: groupLabelColor, whiteSpace: 'nowrap' }}>
                Свернуть панель
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Showcase demo (4 states) ───────────────────────────────────────────── */

function StateLabel({ text, dark }: { text: string; dark: boolean }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      marginBottom: '12px',
      padding: '3px 10px',
      borderRadius: '6px',
      background: dark ? '#111827' : '#F3F4F6',
      border: `1px solid ${dark ? '#374151' : C.border}`,
    }}>
      <div style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: dark ? '#6B7280' : '#10B981',
      }} />
      <span style={{
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: dark ? '#9CA3AF' : C.text3,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.06em',
      }}>
        {text}
      </span>
    </div>
  );
}

export function OrgAdminSidebarDemo() {
  const [expandedDark, setExpandedDark] = useState(false);

  return (
    <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

      {/* Expanded · Light */}
      <div>
        <StateLabel text="Expanded · 260px" dark={false} />
        <div style={{
          height: '600px', display: 'flex',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: `1px solid ${C.border}`,
        }}>
          <OrgAdminSidebar
            collapsed={false}
            onToggle={() => {}}
            darkMode={expandedDark}
            onDarkModeToggle={() => setExpandedDark(d => !d)}
          />
        </div>
      </div>

      {/* Collapsed · Light */}
      <div>
        <StateLabel text="Collapsed · 68px" dark={false} />
        <div style={{
          height: '600px', display: 'flex',
          borderRadius: '12px', overflow: 'visible',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: `1px solid ${C.border}`,
        }}>
          <OrgAdminSidebar
            collapsed={true}
            onToggle={() => {}}
            darkMode={false}
            onDarkModeToggle={() => {}}
          />
        </div>
      </div>

      {/* Expanded · Dark */}
      <div>
        <StateLabel text="Expanded · Dark" dark={true} />
        <div style={{
          height: '600px', display: 'flex',
          borderRadius: '12px', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.32)',
          border: '1px solid #374151',
        }}>
          <OrgAdminSidebar
            collapsed={false}
            onToggle={() => {}}
            darkMode={true}
            onDarkModeToggle={() => {}}
          />
        </div>
      </div>

      {/* Collapsed · Dark */}
      <div>
        <StateLabel text="Collapsed · Dark" dark={true} />
        <div style={{
          height: '600px', display: 'flex',
          borderRadius: '12px', overflow: 'visible',
          boxShadow: '0 1px 3px rgba(0,0,0,0.32)',
          border: '1px solid #374151',
        }}>
          <OrgAdminSidebar
            collapsed={true}
            onToggle={() => {}}
            darkMode={true}
            onDarkModeToggle={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
