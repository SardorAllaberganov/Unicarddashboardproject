import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Moon, Sun, LogOut, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { F, C } from './ds/tokens';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

type AdminRole = 'bank' | 'org';

interface NavbarProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROLE CONFIG
═══════════════════════════════════════════════════════════════════════════ */

const ROLE_CONFIG: Record<AdminRole, {
  initials: string;
  name: string;
  roleLabel: string;
  email: string;
  homePath: string;
}> = {
  bank: {
    initials: 'АК',
    name: 'Админ Камолов',
    roleLabel: 'Bank Admin',
    email: 'admin@momentcard.uz',
    homePath: '/dashboard',
  },
  org: {
    initials: 'МН',
    name: 'Мухаммад Н.',
    roleLabel: 'Org Admin',
    email: 'muhammad@mysafar.uz',
    homePath: '/org-dashboard',
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS — detect current role from URL
═══════════════════════════════════════════════════════════════════════════ */

const ORG_PATHS = ['/org-dashboard', '/sellers', '/org-cards', '/card-assignment', '/org-rewards', '/org-withdrawals', '/org-settings'];

function detectRole(pathname: string): AdminRole {
  if (ORG_PATHS.some(p => pathname.startsWith(p))) return 'org';
  if (window.location.search.includes('from=org')) return 'org';
  return 'bank';
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export function Navbar({ darkMode, onDarkModeToggle }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeHov, setThemeHov] = useState(false);
  const [logoutHov, setLogoutHov] = useState(false);
  const [switchHov, setSwitchHov] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentRole = detectRole(window.location.pathname);
  const cfg = ROLE_CONFIG[currentRole];
  const otherRole: AdminRole = currentRole === 'bank' ? 'org' : 'bank';
  const otherCfg = ROLE_CONFIG[otherRole];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSwitchRole = () => {
    setMenuOpen(false);
    navigate(otherCfg.homePath);
  };

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: C.surface, borderBottom: `1px solid ${C.border}`,
      height: '60px', display: 'flex', alignItems: 'center',
      padding: '0 32px', flexShrink: 0,
    }}>
      {/* Left: branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
        <span style={{
          fontFamily: F.dm, fontSize: '15px', fontWeight: 700,
          color: currentRole === 'org' ? C.blue : C.text1, whiteSpace: 'nowrap',
        }}>
          {currentRole === 'org' ? 'Mysafar OOO' : 'Moment KPI'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Theme toggle */}
        <button
          onClick={onDarkModeToggle}
          onMouseEnter={() => setThemeHov(true)}
          onMouseLeave={() => setThemeHov(false)}
          title={darkMode ? 'Светлая тема' : 'Тёмная тема'}
          style={{
            width: '36px', height: '36px', borderRadius: '8px',
            border: `1px solid ${themeHov ? '#D1D5DB' : C.border}`,
            background: themeHov ? '#F9FAFB' : C.surface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
          }}
        >
          {darkMode
            ? <Sun size={15} color="#F59E0B" strokeWidth={1.75} />
            : <Moon size={15} color={C.text3} strokeWidth={1.75} />}
        </button>

        {/* Divider */}
        <div style={{ width: '1px', height: '24px', background: C.border, margin: '0 6px', flexShrink: 0 }} />

        {/* User button */}
        <div ref={ref} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '5px 10px 5px 6px',
              border: 'none',
              borderRadius: '10px',
              background: menuOpen ? C.blueLt : C.surface,
              cursor: 'pointer', transition: 'all 0.12s',
              boxShadow: menuOpen ? `0 0 0 3px ${C.blueTint}` : 'none',
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: C.blueTint, border: `1.5px solid ${C.blue}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 700, color: C.blue }}>
                {cfg.initials}
              </span>
            </div>

            {/* Name + role */}
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                color: C.text1, whiteSpace: 'nowrap', lineHeight: 1.3,
              }}>
                {cfg.name}
              </div>
              <div style={{
                fontFamily: F.inter, fontSize: '11px',
                color: C.text4, lineHeight: '16px', whiteSpace: 'nowrap',
              }}>
                {cfg.roleLabel}
              </div>
            </div>

            {/* Chevron */}
            <ChevronDown size={14} color={C.text4} strokeWidth={1.75}
              style={{
                transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s', flexShrink: 0,
              }}
            />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', right: 0,
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: '10px', padding: '6px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.09)', zIndex: 60, minWidth: '220px',
            }}>
              {/* Profile row */}
              <button style={{
                width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '8px 10px', borderRadius: '7px',
                border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: F.inter, fontSize: '13px', color: C.text2,
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: C.blueTint, border: `1.5px solid ${C.blue}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ fontFamily: F.inter, fontSize: '10px', fontWeight: 700, color: C.blue }}>
                    {cfg.initials}
                  </span>
                </div>
                <div>
                  <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text1 }}>
                    {cfg.name}
                  </div>
                  <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4 }}>
                    {cfg.email}
                  </div>
                </div>
              </button>

              <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />

              {/* Switch role */}
              <button
                onMouseEnter={() => setSwitchHov(true)}
                onMouseLeave={() => setSwitchHov(false)}
                onClick={handleSwitchRole}
                style={{
                  width: '100%', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', borderRadius: '7px', border: 'none',
                  background: switchHov ? C.blueLt : 'none',
                  cursor: 'pointer',
                  fontFamily: F.inter, fontSize: '13px',
                  color: switchHov ? C.blue : C.text2,
                  transition: 'all 0.1s',
                }}
              >
                <ArrowLeftRight size={14} strokeWidth={1.75} />
                <div>
                  <div>Переключить на {otherCfg.roleLabel}</div>
                  <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4, marginTop: '1px' }}>
                    {otherCfg.name}
                  </div>
                </div>
              </button>

              {/* Logout */}
              <button
                onMouseEnter={() => setLogoutHov(true)}
                onMouseLeave={() => setLogoutHov(false)}
                style={{
                  width: '100%', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', borderRadius: '7px', border: 'none',
                  background: logoutHov ? '#FEF2F2' : 'none', cursor: 'pointer',
                  fontFamily: F.inter, fontSize: '13px',
                  color: logoutHov ? '#DC2626' : C.text3, transition: 'all 0.1s',
                }}
              >
                <LogOut size={14} strokeWidth={1.75} /> Выйти из системы
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
