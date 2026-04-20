import React, { useRef, useState } from 'react';
import {
  ChevronDown, ChevronRight, ChevronLeft, Settings, MoreVertical,
  CheckCircle2, CreditCard, ArrowDown, Upload, AlertTriangle,
  CheckCheck, Trash2, Check, Bell,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useIsMobile } from '../components/useIsMobile';
import { usePopoverPosition } from '../components/usePopoverPosition';
import { DateRangePicker } from '../components/DateRangePicker';
import { EmptyState } from '../components/EmptyState';
import { useNavigate, useSearchParams } from 'react-router';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

type NotifType = 'KPI' | 'Продажи' | 'Финансы' | 'Импорт' | 'Система';
type NotifIconColor = 'green' | 'blue' | 'amber' | 'red';

interface Notif {
  id: number;
  icon: React.ElementType;
  color: NotifIconColor;
  type: NotifType;
  title: string;
  sub?: string;
  time: string;
  group: 'Сегодня' | 'Вчера' | '11 апреля' | '10 апреля';
  unread: boolean;
}

const SEED: Notif[] = [
  // Today (unread from L-01)
  { id: 1,  icon: CheckCircle2,  color: 'green', type: 'KPI',      title: 'KPI 3 выполнен: карта •••• 4521 (Абдуллох Р.)', sub: '10 000 UZS начислено', time: '14:30', group: 'Сегодня', unread: true },
  { id: 2,  icon: CreditCard,    color: 'blue',  type: 'Продажи',  title: 'Новая продажа: карта •••• 3092 → Дилшод К.',                                  time: '13:42', group: 'Сегодня', unread: true },
  { id: 3,  icon: ArrowDown,     color: 'amber', type: 'Финансы',  title: 'Запрос на вывод: Санжар М. — 50 000 UZS',                                     time: '12:30', group: 'Сегодня', unread: true },
  { id: 4,  icon: Upload,        color: 'blue',  type: 'Импорт',   title: 'Импорт завершён: 498 карт в «Партия Апрель 2026»',                            time: '11:20', group: 'Сегодня', unread: true },
  { id: 5,  icon: AlertTriangle, color: 'red',   type: 'KPI',      title: 'KPI просрочен: 3 карты Unired Marketing',                                    time: '09:45', group: 'Сегодня', unread: true },
  // Yesterday (read)
  { id: 6,  icon: CheckCircle2,  color: 'green', type: 'KPI',      title: 'KPI 2 выполнен: карта •••• 2204 (Нилуфар К.)', sub: '5 000 UZS начислено',  time: '18:12', group: 'Вчера',   unread: false },
  { id: 7,  icon: CreditCard,    color: 'blue',  type: 'Продажи',  title: '5 карт назначены Камола Р.',                                                  time: '14:55', group: 'Вчера',   unread: false },
  { id: 8,  icon: ArrowDown,     color: 'amber', type: 'Финансы',  title: 'Вывод выполнен: Нилуфар К. — 80 000 UZS',                                     time: '11:30', group: 'Вчера',   unread: false },
  { id: 9,  icon: CheckCircle2,  color: 'green', type: 'KPI',      title: 'KPI 1 выполнен: карта •••• 3108',                                             time: '10:05', group: 'Вчера',   unread: false },
  { id: 10, icon: AlertTriangle, color: 'red',   type: 'Система',  title: 'Провальная попытка входа: r.aliev@mysafar.uz',                                time: '08:48', group: 'Вчера',   unread: false },
  // 11 апреля (read)
  { id: 11, icon: CheckCircle2,  color: 'green', type: 'KPI',      title: 'KPI 1 выполнен: карта •••• 1089',                                             time: '21:17', group: '11 апреля', unread: false },
  { id: 12, icon: ArrowDown,     color: 'amber', type: 'Финансы',  title: 'Вывод выполнен: Абдуллох Р. — 120 000 UZS',                                   time: '19:04', group: '11 апреля', unread: false },
  { id: 13, icon: CreditCard,    color: 'blue',  type: 'Продажи',  title: 'Новый продавец: Камола Расулова',                                             time: '15:30', group: '11 апреля', unread: false },
  { id: 14, icon: Upload,        color: 'blue',  type: 'Импорт',   title: 'Импорт: 400 карт в «Партия Март 2026»',                                       time: '13:11', group: '11 апреля', unread: false },
  { id: 15, icon: CheckCircle2,  color: 'green', type: 'KPI',      title: 'KPI 3 выполнен: карта •••• 2987',                                             time: '12:00', group: '11 апреля', unread: false },
  // 10 апреля (read)
  { id: 16, icon: CreditCard,    color: 'blue',  type: 'Продажи',  title: 'Продажа: карта •••• 2415 → Мадина Ю.',                                        time: '17:25', group: '10 апреля', unread: false },
  { id: 17, icon: ArrowDown,     color: 'amber', type: 'Финансы',  title: 'Запрос на вывод: Ислом Т. — 35 000 UZS',                                      time: '14:50', group: '10 апреля', unread: false },
  { id: 18, icon: CheckCircle2,  color: 'green', type: 'KPI',      title: 'KPI 2 выполнен: карта •••• 3040',                                             time: '11:42', group: '10 апреля', unread: false },
  { id: 19, icon: AlertTriangle, color: 'red',   type: 'KPI',      title: 'KPI просрочен: карта •••• 8033',                                              time: '09:30', group: '10 апреля', unread: false },
  { id: 20, icon: Upload,        color: 'blue',  type: 'Импорт',   title: 'Импорт завершён: 200 карт в «Партия Тест»',                                   time: '08:10', group: '10 апреля', unread: false },
];

function iconColorsFor(dark: boolean): Record<NotifIconColor, { color: string; bg: string; border: string }> {
  if (dark) {
    return {
      green: { color: D.success, bg: 'rgba(52,211,153,0.15)',  border: 'rgba(52,211,153,0.30)' },
      blue:  { color: D.blue,    bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.30)' },
      amber: { color: D.warning, bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.30)' },
      red:   { color: D.error,   bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.30)' },
    };
  }
  return {
    green: { color: C.success, bg: 'rgba(16,185,129,0.10)', border: '#BBF7D0' },
    blue:  { color: C.blue,    bg: C.blueLt,                border: C.blueTint },
    amber: { color: C.warning, bg: '#FFFBEB',               border: '#FDE68A' },
    red:   { color: C.error,   bg: C.errorBg,               border: '#FECACA' },
  };
}

const TYPE_OPTIONS: NotifType[] = ['KPI', 'Продажи', 'Финансы', 'Импорт', 'Система'];
const STATUS_OPTIONS = ['Непрочитанные', 'Прочитанные'];

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, value, onChange, minWidth, t, dark }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; minWidth?: string; t: T; dark: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          height: '40px', padding: '0 36px 0 12px',
          border: `1px solid ${focused ? t.blue : t.inputBorder}`,
          borderRadius: '8px', background: t.surface,
          fontFamily: F.inter, fontSize: '13px',
          color: value ? t.text1 : t.text3,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${dark ? D.focusRing : C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          minWidth: minWidth ?? '170px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} color={t.text3} style={{
        position: 'absolute', right: '12px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NOTIFICATION ROW + ACTION MENU
═══════════════════════════════════════════════════════════════════════════ */

function NotifActionMenu({ onRead, onDelete, canRead, t, dark }: {
  onRead: () => void; onDelete: () => void; canRead: boolean; t: T; dark: boolean;
}) {
  const pop = usePopoverPosition();
  const [hov, setHov] = useState(false);

  return (
    <div ref={pop.rootRef} style={{ position: 'relative' }}>
      <button
        ref={pop.triggerRef as React.RefObject<HTMLButtonElement>}
        onClick={e => { e.stopPropagation(); pop.toggle(); }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-label="Действия"
        style={{
          width: '28px', height: '28px',
          border: `1px solid ${pop.open ? t.blue : hov ? t.inputBorder : 'transparent'}`,
          borderRadius: '6px',
          background: pop.open ? t.blueLt : hov ? t.tableHover : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
        }}
      >
        <MoreVertical size={14} color={pop.open ? t.blue : t.text3} strokeWidth={1.75} />
      </button>

      {pop.open && (
        <div ref={pop.menuRef} style={{
          ...pop.menuStyle,
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '10px', padding: '6px',
          boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.35)' : '0 8px 24px rgba(0,0,0,0.10)',
          minWidth: '160px',
        }}>
          <MenuItem
            icon={Check}
            label="Прочитать"
            disabled={!canRead}
            onClick={() => { onRead(); pop.close(); }}
            t={t}
            dark={dark}
          />
          <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />
          <MenuItem
            icon={Trash2}
            label="Удалить"
            danger
            onClick={() => { onDelete(); pop.close(); }}
            t={t}
            dark={dark}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, danger, disabled, onClick, t, dark }: {
  icon: React.ElementType; label: string; danger?: boolean; disabled?: boolean; onClick: () => void; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const dangerHoverBg = dark ? 'rgba(248,113,113,0.12)' : '#FEF2F2';
  const dangerHoverFg = dark ? D.error : '#DC2626';
  return (
    <button
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 10px', borderRadius: '7px', border: 'none',
        background: !disabled && hov ? (danger ? dangerHoverBg : t.tableHover) : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: F.inter, fontSize: '13px',
        color: disabled ? t.text4 : hov && danger ? dangerHoverFg : t.text2,
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.1s',
      }}
    >
      <Icon size={13} strokeWidth={1.75} />
      {label}
    </button>
  );
}

function NotifRow({ notif, onRead, onDelete, t, dark }: {
  notif: Notif; onRead: () => void; onDelete: () => void; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const cfg = iconColorsFor(dark)[notif.color];
  const Icon = notif.icon;

  const readBg = t.tableHeaderBg;
  const defaultBg = notif.unread ? t.surface : readBg;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '14px',
        padding: '16px 20px',
        background: hov ? t.tableHover : defaultBg,
        borderLeft: notif.unread ? `3px solid ${t.blue}` : '3px solid transparent',
        borderBottom: `1px solid ${t.border}`,
        transition: 'background 0.12s',
      }}
    >
      {/* Colored icon circle */}
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: cfg.bg, border: `1px solid ${cfg.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={17} color={cfg.color} strokeWidth={1.75} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: F.inter, fontSize: '13px',
            color: notif.unread ? t.text1 : t.text2,
            fontWeight: notif.unread ? 500 : 400,
            lineHeight: 1.4,
          }}>
            {notif.title}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            fontFamily: F.inter, fontSize: '10px', fontWeight: 500,
            padding: '2px 7px', borderRadius: '6px',
            background: dark ? D.tableAlt : '#F3F4F6', color: t.text3,
            border: `1px solid ${t.border}`,
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            {notif.type}
          </span>
        </div>
        {notif.sub && (
          <div style={{
            fontFamily: F.inter, fontSize: '12px',
            color: t.success, fontWeight: 500,
            marginTop: '3px',
          }}>
            {notif.sub}
          </div>
        )}
      </div>

      {/* Timestamp */}
      <span style={{
        fontFamily: F.mono, fontSize: '12px', color: t.text4,
        marginTop: '3px', flexShrink: 0, minWidth: '48px', textAlign: 'right',
      }}>
        {notif.time}
      </span>

      {/* Action dots */}
      <NotifActionMenu
        canRead={notif.unread}
        onRead={onRead}
        onDelete={onDelete}
        t={t}
        dark={dark}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE — Notifications history
═══════════════════════════════════════════════════════════════════════════ */

type NotifColorKey = 'green' | 'blue' | 'amber' | 'red';

function notifTint(color: NotifColorKey, dark: boolean) {
  const light: Record<NotifColorKey, { bg: string; fg: string }> = {
    green: { bg: '#F0FDF4', fg: '#16A34A' },
    blue:  { bg: '#EFF6FF', fg: '#2563EB' },
    amber: { bg: '#FFFBEB', fg: '#D97706' },
    red:   { bg: '#FEF2F2', fg: '#DC2626' },
  };
  const darkV: Record<NotifColorKey, { bg: string; fg: string }> = {
    green: { bg: 'rgba(52,211,153,0.15)',  fg: '#34D399' },
    blue:  { bg: 'rgba(59,130,246,0.15)',  fg: '#3B82F6' },
    amber: { bg: 'rgba(251,191,36,0.15)',  fg: '#FBBF24' },
    red:   { bg: 'rgba(248,113,113,0.15)', fg: '#F87171' },
  };
  return (dark ? darkV : light)[color];
}

type MobileFilter = 'all' | 'unread';

function MobileSegmented({
  active, onChange, unreadCount, t, dark,
}: {
  active: MobileFilter;
  onChange: (f: MobileFilter) => void;
  unreadCount: number;
  t: T;
  dark: boolean;
}) {
  const trackBg = dark ? '#2D3148' : '#F3F4F6';
  const items: Array<{ id: MobileFilter; label: string; badge?: number }> = [
    { id: 'all',    label: 'Все' },
    { id: 'unread', label: 'Непрочитанные', badge: unreadCount > 0 ? unreadCount : undefined },
  ];
  return (
    <div style={{
      display: 'flex', padding: 4, borderRadius: 999,
      background: trackBg, height: 36, boxSizing: 'border-box',
    }}>
      {items.map(it => {
        const isActive = it.id === active;
        return (
          <div
            key={it.id}
            onClick={() => onChange(it.id)}
            style={{
              flex: 1, borderRadius: 999,
              background: isActive ? t.surface : 'transparent',
              boxShadow: isActive ? (dark ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 2px rgba(17,24,39,0.08)') : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: F.inter, fontSize: 13, fontWeight: 500,
              color: isActive ? t.text1 : t.text3,
              cursor: 'pointer',
            }}
          >
            {it.label}
            {it.badge && (
              <span style={{
                minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999,
                background: t.blue, color: '#FFFFFF',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: F.inter, fontSize: 10, fontWeight: 700, lineHeight: 1,
              }}>
                {it.badge}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MobileNotifRow({
  n, isLast, t, dark, onTap, onDelete, swipedId, setSwipedId,
}: {
  n: Notif;
  isLast: boolean;
  t: T;
  dark: boolean;
  onTap: (n: Notif) => void;
  onDelete: (id: number) => void;
  swipedId: number | null;
  setSwipedId: (id: number | null) => void;
}) {
  const Icon = n.icon;
  const pal = notifTint(n.color, dark);
  const startX = useRef<number | null>(null);
  const movedX = useRef(0);
  const actionsW = 88;
  const revealed = swipedId === n.id;

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    movedX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    movedX.current = e.touches[0].clientX - startX.current;
  };
  const onTouchEnd = () => {
    if (movedX.current < -40) setSwipedId(n.id);
    else if (movedX.current > 40) setSwipedId(null);
    startX.current = null;
    movedX.current = 0;
  };

  const handleTap = () => {
    if (revealed) { setSwipedId(null); return; }
    onTap(n);
  };

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
    }}>
      {/* Swipe-revealed delete */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: actionsW, display: 'flex',
      }}>
        <button
          onClick={() => onDelete(n.id)}
          style={{
            flex: 1, border: 'none', background: t.error,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, cursor: 'pointer',
          }}
        >
          <Trash2 size={18} color="#FFFFFF" strokeWidth={2} />
          <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 500, color: '#FFFFFF' }}>
            Удалить
          </span>
        </button>
      </div>

      {/* Row foreground */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={handleTap}
        style={{
          position: 'relative',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          padding: '14px 16px',
          paddingLeft: n.unread ? 13 : 16,
          borderLeft: n.unread ? `3px solid ${t.blue}` : 'none',
          background: t.surface,
          transform: `translateX(${revealed ? -actionsW : 0}px)`,
          transition: 'transform 0.18s ease',
          cursor: 'pointer',
        }}
      >
        {/* Icon circle */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: pal.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          marginTop: 2,
        }}>
          <Icon size={20} color={pal.fg} strokeWidth={2} />
        </div>

        {/* Middle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: F.inter, fontSize: 14,
            fontWeight: n.unread ? 600 : 500,
            color: t.text1,
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {n.title}
          </div>
          {n.sub && (
            <div style={{
              fontFamily: F.inter, fontSize: 12, color: t.text3,
              marginTop: 3, lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {n.sub}
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0, marginTop: 4 }}>
          <span style={{ fontFamily: F.inter, fontSize: 11, color: t.text4, whiteSpace: 'nowrap' }}>
            {n.time}
          </span>
          {n.unread && (
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.blue }} />
          )}
        </div>
      </div>
    </div>
  );
}

function MobileNotifications({
  t, dark, navigate, fromOrg, notifs, markAllRead, markRead, removeNotif,
}: {
  t: T;
  dark: boolean;
  navigate: (p: string) => void;
  fromOrg: boolean;
  notifs: Notif[];
  markAllRead: () => void;
  markRead: (id: number) => void;
  removeNotif: (id: number) => void;
}) {
  const [filter, setFilter] = useState<MobileFilter>('all');
  const [swipedId, setSwipedId] = useState<number | null>(null);
  const unreadCount = notifs.filter(n => n.unread).length;

  const visible = notifs.filter(n => filter === 'all' ? true : n.unread);

  const groups = ['Сегодня', 'Вчера', '11 апреля', '10 апреля'] as const;
  const groupedRows = groups
    .map(g => ({ group: g, items: visible.filter(n => n.group === g) }))
    .filter(g => g.items.length > 0);

  const handleTap = (n: Notif) => {
    if (n.unread) markRead(n.id);
  };

  return (
    <>
      {/* Sticky header Y-02 V3 */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 4px',
        background: t.surface, borderBottom: `1px solid ${t.border}`,
      }}>
        <button
          onClick={() => navigate(fromOrg ? '/org-dashboard' : '/dashboard')}
          style={{
            width: 48, height: 48, border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={24} color={t.blue} strokeWidth={2} />
        </button>

        {/* Absolute-centered title */}
        <span style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1,
          whiteSpace: 'nowrap',
        }}>
          Уведомления
        </span>

        <button
          onClick={unreadCount > 0 ? markAllRead : undefined}
          disabled={unreadCount === 0}
          style={{
            height: 40, padding: '0 12px',
            border: 'none', background: 'transparent',
            fontFamily: F.inter, fontSize: 13, fontWeight: 500,
            color: unreadCount > 0 ? t.blue : t.textDisabled,
            cursor: unreadCount > 0 ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Прочитать все
        </button>
      </div>

      <div
        onClick={() => swipedId !== null && setSwipedId(null)}
        style={{ padding: '12px 0 calc(80px + env(safe-area-inset-bottom, 0px))', boxSizing: 'border-box', width: '100%' }}
      >
        {/* Segmented */}
        <div style={{ padding: '0 16px 12px' }}>
          <MobileSegmented
            active={filter}
            onChange={setFilter}
            unreadCount={unreadCount}
            t={t}
            dark={dark}
          />
        </div>

        {groupedRows.length === 0 ? (
          <div style={{
            padding: '80px 24px 48px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: dark ? 'rgba(59,130,246,0.10)' : '#EFF6FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Bell size={34} color={t.blue} strokeWidth={1.5} />
            </div>
            <h2 style={{
              fontFamily: F.dm, fontSize: 18, fontWeight: 600, color: t.text1,
              margin: '0 0 6px',
            }}>
              Нет уведомлений
            </h2>
            <p style={{
              fontFamily: F.inter, fontSize: 14, color: t.text3, margin: 0, maxWidth: 280,
            }}>
              {filter === 'unread'
                ? 'Все уведомления прочитаны. Хорошая работа!'
                : 'Пока ничего нового. Мы сообщим, когда что-то произойдёт.'}
            </p>
          </div>
        ) : (
          <>
            {groupedRows.map(g => (
              <React.Fragment key={g.group}>
                <div style={{
                  fontFamily: F.inter, fontSize: 11, fontWeight: 600,
                  color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
                  padding: '16px 20px 8px',
                }}>
                  {g.group}
                </div>
                <div style={{
                  margin: '0 16px',
                  background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
                  overflow: 'hidden',
                }}>
                  {g.items.map((n, i) => (
                    <MobileNotifRow
                      key={n.id}
                      n={n}
                      isLast={i === g.items.length - 1}
                      t={t}
                      dark={dark}
                      onTap={handleTap}
                      onDelete={removeNotif}
                      swipedId={swipedId}
                      setSwipedId={setSwipedId}
                    />
                  ))}
                </div>
              </React.Fragment>
            ))}

            <div style={{
              fontFamily: F.inter, fontSize: 12, color: t.text4,
              textAlign: 'center', padding: '18px 16px 0',
            }}>
              Проведите уведомление влево для удаления
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function NotificationsHistoryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const mobile = useIsMobile();
  const t = theme(darkMode);
  const dark = darkMode;
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ from: '2026-04-10', to: '2026-04-14' });
  const [notifs, setNotifs] = useState(SEED);
  const [readAllHov, setReadAllHov] = useState(false);
  const [settingsHov, setSettingsHov] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fromOrg = params.get('from') === 'org';
  const role = fromOrg ? 'org' : 'bank';

  const unreadCount = notifs.filter(n => n.unread).length;

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, unread: false })));
  const markRead = (id: number) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, unread: false } : n));
  const removeNotif = (id: number) => setNotifs(ns => ns.filter(n => n.id !== id));

  const filtered = notifs
    .filter(n => !typeFilter || n.type === typeFilter)
    .filter(n => !statusFilter || (statusFilter === 'Непрочитанные' ? n.unread : !n.unread));

  // Group by date
  const groups = ['Сегодня', 'Вчера', '11 апреля', '10 апреля'] as const;
  const groupedRows = groups
    .map(g => ({ group: g, items: filtered.filter(n => n.group === g) }))
    .filter(g => g.items.length > 0);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar role={role}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} hideOnMobile />

        {mobile ? (
          <MobileNotifications
            t={t}
            dark={dark}
            navigate={navigate}
            fromOrg={fromOrg}
            notifs={notifs}
            markAllRead={markAllRead}
            markRead={markRead}
            removeNotif={removeNotif}
          />
        ) : (
        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span onClick={() => navigate(fromOrg ? '/org-dashboard' : '/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Уведомления</span>
          </div>

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '22px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Уведомления
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
                Все уведомления
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                onMouseEnter={() => setReadAllHov(true)}
                onMouseLeave={() => setReadAllHov(false)}
                onClick={markAllRead}
                disabled={unreadCount === 0}
                aria-label="Прочитать все"
                style={{
                  height: '40px', padding: '0 16px',
                  border: `1px solid ${unreadCount === 0 ? t.border : readAllHov ? t.blue : t.border}`,
                  borderRadius: '8px',
                  background: unreadCount === 0 ? 'transparent' : readAllHov ? t.tableHover : 'transparent',
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                  color: unreadCount === 0 ? t.text4 : readAllHov ? t.blue : t.text2,
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  cursor: unreadCount === 0 ? 'not-allowed' : 'pointer',
                  opacity: unreadCount === 0 ? 0.7 : 1,
                  transition: 'all 0.12s',
                }}
              >
                <CheckCheck size={14} strokeWidth={1.75} />
                Прочитать все
              </button>

              <button
                onMouseEnter={() => setSettingsHov(true)}
                onMouseLeave={() => setSettingsHov(false)}
                onClick={() => navigate(fromOrg ? '/org-settings' : '/settings')}
                style={{
                  height: '40px', padding: '0 14px',
                  border: 'none', borderRadius: '8px',
                  background: settingsHov ? t.blueLt : 'transparent',
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                  color: t.blue,
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  cursor: 'pointer', transition: 'background 0.12s',
                }}
              >
                <Settings size={14} strokeWidth={1.75} />
                Настройки уведомлений →
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '18px' }}>
            <FilterSelect label="Тип: Все"    options={TYPE_OPTIONS}    value={typeFilter}   onChange={setTypeFilter}   t={t} dark={dark} />
            <FilterSelect label="Статус: Все" options={STATUS_OPTIONS}  value={statusFilter} onChange={setStatusFilter} t={t} dark={dark} />
            <DateRangePicker value={dateRange} onChange={setDateRange} />

            <span style={{ marginLeft: 'auto', fontFamily: F.inter, fontSize: '13px', color: t.text4 }}>
              <span style={{ fontFamily: F.mono, color: t.text2 }}>{filtered.length}</span> из <span style={{ fontFamily: F.mono, color: t.text2 }}>156</span>
            </span>
          </div>

          {/* List card */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '12px', overflow: 'hidden',
          }}>
            {groupedRows.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="Нет уведомлений"
                subtitle="Нет уведомлений, соответствующих фильтрам"
              />
            ) : (
              groupedRows.map(g => (
                <div key={g.group}>
                  <div style={{
                    position: 'sticky', top: 0, zIndex: 1,
                    padding: '10px 20px',
                    background: t.tableHeaderBg,
                    borderBottom: `1px solid ${t.border}`,
                    fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                    color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {g.group}
                  </div>
                  {g.items.map(n => (
                    <NotifRow
                      key={n.id}
                      notif={n}
                      onRead={() => markRead(n.id)}
                      onDelete={() => removeNotif(n.id)}
                      t={t}
                      dark={dark}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '14px', flexWrap: 'wrap', gap: '10px',
          }}>
            <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Показано <span style={{ fontFamily: F.mono, color: t.text1 }}>1–{filtered.length}</span> из{' '}
              <span style={{ fontFamily: F.mono, color: t.text1 }}>156</span>
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, '...', 8].map((p, i) => (
                <PageBtn key={i} active={p === 1} t={t}>{p}</PageBtn>
              ))}
            </div>
          </div>

          <div style={{ height: '48px' }} />
        </div>
        )}
      </div>
    </div>
  );
}

function PageBtn({ children, active, t }: { children: React.ReactNode; active?: boolean; t: T }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        minWidth: '32px', height: '32px', padding: '0 8px',
        border: `1px solid ${active ? t.blue : t.border}`,
        background: active ? t.blue : hov ? t.tableHover : t.surface,
        color: active ? '#fff' : t.text2,
        fontFamily: F.inter, fontSize: '12px', fontWeight: active ? 600 : 500,
        borderRadius: '7px', cursor: 'pointer',
        transition: 'all 0.12s',
      }}
    >
      {children}
    </button>
  );
}
