import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown, Moon, Sun, LogOut, ArrowLeftRight, Bell,
  CheckCircle2, CreditCard, ArrowDown, Upload, AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { F, C } from './ds/tokens';
import { usePopoverPosition } from './usePopoverPosition';

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

const ORG_PATHS = ['/org-dashboard', '/sellers', '/org-cards', '/card-assignment', '/org-rewards', '/org-withdrawals', '/org-settings', '/seller-messages'];

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
        {/* Notifications */}
        <NotificationBell />

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

/* ═══════════════════════════════════════════════════════════════════════════
   NOTIFICATION BELL + PANEL
═══════════════════════════════════════════════════════════════════════════ */

type NotifIconColor = 'green' | 'blue' | 'amber' | 'red';

interface Notif {
  id: number;
  icon: React.ElementType;
  color: NotifIconColor;
  title: string;
  sub?: string;
  time: string;
  unread: boolean;
}

const NOTIFS: Notif[] = [
  { id: 1,  icon: CheckCircle2,  color: 'green', title: 'KPI 3 выполнен: карта •••• 4521 (Абдуллох Р.)', sub: '10 000 UZS начислено', time: '14 мин назад', unread: true },
  { id: 2,  icon: CreditCard,    color: 'blue',  title: 'Новая продажа: карта •••• 3092 → Дилшод К.',                                      time: '1 час назад',  unread: true },
  { id: 3,  icon: ArrowDown,     color: 'amber', title: 'Запрос на вывод: Санжар М. — 50 000 UZS',                                        time: '2 часа назад', unread: true },
  { id: 4,  icon: Upload,        color: 'blue',  title: 'Импорт завершён: 498 карт в «Партия Апрель 2026»',                               time: '3 часа назад', unread: true },
  { id: 5,  icon: AlertTriangle, color: 'red',   title: 'KPI просрочен: 3 карты Unired Marketing',                                        time: '5 часов назад', unread: true },
  { id: 6,  icon: CheckCircle2,  color: 'green', title: 'KPI 2 выполнен: карта •••• 2204 (Нилуфар К.)',                                   time: 'вчера',        unread: false },
  { id: 7,  icon: CreditCard,    color: 'blue',  title: '5 карт назначены Камола Р.',                                                     time: 'вчера',        unread: false },
  { id: 8,  icon: CheckCircle2,  color: 'green', title: 'KPI 1 выполнен: карта •••• 1089',                                                time: '2 дня назад',  unread: false },
  { id: 9,  icon: ArrowDown,     color: 'amber', title: 'Вывод выполнен: Абдуллох Р. — 120 000 UZS',                                      time: '2 дня назад',  unread: false },
  { id: 10, icon: CreditCard,    color: 'blue',  title: 'Новый продавец: Камола Расулова',                                                time: '3 дня назад',  unread: false },
];

const ICON_COLORS: Record<NotifIconColor, { color: string; bg: string; border: string }> = {
  green: { color: C.success, bg: C.successBg, border: '#BBF7D0' },
  blue:  { color: C.blue,    bg: C.blueLt,    border: C.blueTint },
  amber: { color: C.warning, bg: '#FFFBEB',   border: '#FDE68A' },
  red:   { color: C.error,   bg: C.errorBg,   border: '#FECACA' },
};

function NotificationBell() {
  const pop = usePopoverPosition();
  const [hov, setHov] = useState(false);
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [notifs, setNotifs] = useState(NOTIFS);

  const unreadCount = notifs.filter(n => n.unread).length;
  const visible = tab === 'unread' ? notifs.filter(n => n.unread) : notifs;

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, unread: false })));

  return (
    <div ref={pop.rootRef} style={{ position: 'relative' }}>
      <button
        ref={pop.triggerRef as React.RefObject<HTMLButtonElement>}
        onClick={pop.toggle}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-label={`Уведомления${unreadCount ? ` (${unreadCount} новых)` : ''}`}
        style={{
          position: 'relative',
          width: '36px', height: '36px', borderRadius: '8px',
          border: `1px solid ${pop.open ? C.blue : hov ? '#D1D5DB' : C.border}`,
          background: pop.open ? C.blueLt : hov ? '#F9FAFB' : C.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
        }}
      >
        <Bell size={15} color={pop.open ? C.blue : C.text3} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '5px', right: '5px',
            minWidth: '14px', height: '14px', padding: '0 3px',
            borderRadius: '999px', background: C.error,
            border: `2px solid ${C.surface}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F.inter, fontSize: '9px', fontWeight: 700,
            color: '#fff', lineHeight: 1,
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {pop.open && (
        <div ref={pop.menuRef} style={{
          ...pop.menuStyle,
          width: '400px', maxHeight: '480px',
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.14)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '10px', padding: '14px 16px',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontFamily: F.dm, fontSize: '15px', fontWeight: 700, color: C.text1,
              }}>
                Уведомления
              </span>
              {unreadCount > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                  padding: '2px 8px', borderRadius: '8px',
                  background: C.blueLt, color: C.blue,
                  border: `1px solid ${C.blueTint}`,
                }}>
                  {unreadCount} новых
                </span>
              )}
            </div>
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              style={{
                border: 'none', background: 'none',
                fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                color: unreadCount ? C.blue : C.text4,
                padding: '4px 6px', borderRadius: '6px',
                cursor: unreadCount ? 'pointer' : 'not-allowed',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { if (unreadCount) e.currentTarget.style.background = C.blueLt; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              Прочитать все
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '0', padding: '0 16px',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <TabBtn active={tab === 'all'}      onClick={() => setTab('all')}>Все</TabBtn>
            <TabBtn active={tab === 'unread'}   onClick={() => setTab('unread')}>
              Непрочитанные{unreadCount ? ` (${unreadCount})` : ''}
            </TabBtn>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {visible.length === 0 ? (
              <div style={{
                padding: '40px 16px', textAlign: 'center',
                fontFamily: F.inter, fontSize: '13px', color: C.text4,
              }}>
                Непрочитанных уведомлений нет
              </div>
            ) : (
              visible.map((n, i) => (
                <NotifRow key={n.id} notif={n} last={i === visible.length - 1} />
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 12px',
            borderTop: `1px solid ${C.border}`,
            background: C.surface,
          }}>
            <FooterLink onClick={pop.close} />
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: 'none', border: 'none',
        padding: '10px 14px',
        fontFamily: F.inter, fontSize: '13px',
        fontWeight: active ? 600 : 500,
        color: active ? C.blue : hov ? C.text1 : C.text3,
        borderBottom: `2px solid ${active ? C.blue : 'transparent'}`,
        marginBottom: '-1px',
        cursor: 'pointer', transition: 'color 0.12s',
      }}
    >
      {children}
    </button>
  );
}

function NotifRow({ notif, last }: { notif: Notif; last: boolean }) {
  const [hov, setHov] = useState(false);
  const cfg = ICON_COLORS[notif.color];
  const Icon = notif.icon;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        display: 'flex', gap: '10px', alignItems: 'flex-start',
        padding: '12px 16px 12px 20px',
        borderBottom: last ? 'none' : `1px solid ${C.border}`,
        background: notif.unread
          ? (hov ? '#F9FAFB' : C.surface)
          : (hov ? '#F3F4F6' : '#F9FAFB'),
        cursor: 'pointer', transition: 'background 0.12s',
      }}
    >
      {notif.unread && (
        <span style={{
          position: 'absolute', left: '8px', top: '18px',
          width: '6px', height: '6px', borderRadius: '50%',
          background: C.blue, flexShrink: 0,
        }} />
      )}
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px',
        background: cfg.bg, border: `1px solid ${cfg.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={14} color={cfg.color} strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px',
          color: notif.unread ? C.text1 : C.text2,
          fontWeight: notif.unread ? 500 : 400,
          lineHeight: 1.4,
        }}>
          {notif.title}
        </div>
        {notif.sub && (
          <div style={{
            fontFamily: F.inter, fontSize: '12px',
            color: C.success, fontWeight: 500,
            marginTop: '2px',
          }}>
            {notif.sub}
          </div>
        )}
        <div style={{
          fontFamily: F.inter, fontSize: '11px', color: C.text4,
          marginTop: '3px',
        }}>
          {notif.time}
        </div>
      </div>
    </div>
  );
}

function FooterLink({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();
  const role = detectRole(window.location.pathname);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => { onClick(); navigate(role === 'org' ? '/notifications?from=org' : '/notifications'); }}
      style={{
        width: '100%', height: '36px',
        border: 'none', borderRadius: '8px',
        background: hov ? C.blueLt : 'transparent',
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: C.blue, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
        transition: 'background 0.12s',
      }}
    >
      Показать все уведомления →
    </button>
  );
}
