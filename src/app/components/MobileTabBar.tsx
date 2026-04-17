import React from 'react';
import { LayoutDashboard, Building2, CreditCard, Users, MoreHorizontal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { F, C, D } from './ds/tokens';

type AdminRole = 'bank' | 'org';

type TabDef = { icon: React.ElementType; label: string; path: string };

const BANK_TABS: TabDef[] = [
  { icon: LayoutDashboard, label: 'Дашборд',      path: '/dashboard' },
  { icon: Building2,       label: 'Организации',   path: '/organizations' },
  { icon: CreditCard,      label: 'Карты',          path: '/all-cards' },
  { icon: MoreHorizontal,  label: 'Ещё',            path: '/settings' },
];

const ORG_TABS: TabDef[] = [
  { icon: LayoutDashboard, label: 'Дашборд',   path: '/org-dashboard' },
  { icon: Users,           label: 'Продавцы',   path: '/sellers' },
  { icon: CreditCard,      label: 'Карты',       path: '/org-cards' },
  { icon: MoreHorizontal,  label: 'Ещё',         path: '/org-settings' },
];

const ORG_PATHS = ['/org-dashboard', '/sellers', '/org-cards', '/card-assignment', '/org-rewards', '/org-withdrawals', '/org-settings', '/seller-messages'];

function detectRole(pathname: string): AdminRole {
  if (ORG_PATHS.some(p => pathname.startsWith(p))) return 'org';
  if (typeof window !== 'undefined' && window.location.search.includes('from=org')) return 'org';
  return 'bank';
}

function isTabActive(tabPath: string, pathname: string, tabs: TabDef[]): boolean {
  if (pathname === tabPath || pathname.startsWith(tabPath + '/')) return true;
  const isMoreTab = tabPath === '/settings' || tabPath === '/org-settings';
  if (isMoreTab) {
    const otherPaths = tabs.filter(t => t.path !== tabPath).map(t => t.path);
    return !otherPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
  }
  return false;
}

export function MobileTabBar({ darkMode = false }: { darkMode?: boolean }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dark = darkMode;
  const role = detectRole(pathname);
  const tabs = role === 'bank' ? BANK_TABS : ORG_TABS;

  const bg = dark ? 'rgba(26,29,39,0.97)' : 'rgba(255,255,255,0.97)';
  const borderColor = dark ? D.border : C.border;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      // Total height = 64 px tabs + safe-area-inset-bottom (34 pt on iPhones
      // with home indicator, 0 on Android + non-PWA web). box-sizing makes
      // the padding part of the height so tabs stay exactly 64 px tall.
      height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
      boxSizing: 'border-box',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      background: bg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderTop: `1px solid ${borderColor}`,
      display: 'flex', alignItems: 'stretch',
    }}>
      {tabs.map(tab => {
        const active = isTabActive(tab.path, pathname, tabs);
        const Icon = tab.icon;
        const color = active ? (dark ? D.blue : C.blue) : (dark ? D.text3 : C.text3);
        return (
          <div
            key={tab.label}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 4,
              cursor: 'pointer',
            }}
          >
            <Icon size={24} color={color} strokeWidth={active ? 2 : 1.75} />
            <span style={{
              fontFamily: F.inter, fontSize: 11,
              fontWeight: active ? 600 : 500,
              color,
            }}>
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
