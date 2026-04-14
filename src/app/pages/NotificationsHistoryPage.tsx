import React, { useState } from 'react';
import {
  ChevronDown, ChevronRight, Settings, MoreVertical,
  CheckCircle2, CreditCard, ArrowDown, Upload, AlertTriangle,
  CheckCheck, Trash2, Check,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { usePopoverPosition } from '../components/usePopoverPosition';
import { DateRangePicker } from '../components/DateRangePicker';
import { useNavigate, useSearchParams } from 'react-router';

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

const ICON_COLORS: Record<NotifIconColor, { color: string; bg: string; border: string }> = {
  green: { color: C.success, bg: C.successBg, border: '#BBF7D0' },
  blue:  { color: C.blue,    bg: C.blueLt,    border: C.blueTint },
  amber: { color: C.warning, bg: '#FFFBEB',   border: '#FDE68A' },
  red:   { color: C.error,   bg: C.errorBg,   border: '#FECACA' },
};

const TYPE_OPTIONS: NotifType[] = ['KPI', 'Продажи', 'Финансы', 'Импорт', 'Система'];
const STATUS_OPTIONS = ['Непрочитанные', 'Прочитанные'];

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, value, onChange, minWidth }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; minWidth?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          height: '40px', padding: '0 36px 0 12px',
          border: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderRadius: '8px', background: C.surface,
          fontFamily: F.inter, fontSize: '13px',
          color: value ? C.text1 : C.text3,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          minWidth: minWidth ?? '170px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} color={C.text3} style={{
        position: 'absolute', right: '12px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NOTIFICATION ROW + ACTION MENU
═══════════════════════════════════════════════════════════════════════════ */

function NotifActionMenu({ onRead, onDelete, canRead }: {
  onRead: () => void; onDelete: () => void; canRead: boolean;
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
          border: `1px solid ${pop.open ? C.blue : hov ? '#D1D5DB' : 'transparent'}`,
          borderRadius: '6px',
          background: pop.open ? C.blueLt : hov ? '#F3F4F6' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
        }}
      >
        <MoreVertical size={14} color={pop.open ? C.blue : C.text3} strokeWidth={1.75} />
      </button>

      {pop.open && (
        <div ref={pop.menuRef} style={{
          ...pop.menuStyle,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '10px', padding: '6px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
          minWidth: '160px',
        }}>
          <MenuItem
            icon={Check}
            label="Прочитать"
            disabled={!canRead}
            onClick={() => { onRead(); pop.close(); }}
          />
          <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
          <MenuItem
            icon={Trash2}
            label="Удалить"
            danger
            onClick={() => { onDelete(); pop.close(); }}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, danger, disabled, onClick }: {
  icon: React.ElementType; label: string; danger?: boolean; disabled?: boolean; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
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
        background: !disabled && hov ? (danger ? '#FEF2F2' : '#F9FAFB') : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: F.inter, fontSize: '13px',
        color: disabled ? C.text4 : hov && danger ? '#DC2626' : C.text2,
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.1s',
      }}
    >
      <Icon size={13} strokeWidth={1.75} />
      {label}
    </button>
  );
}

function NotifRow({ notif, onRead, onDelete }: {
  notif: Notif; onRead: () => void; onDelete: () => void;
}) {
  const [hov, setHov] = useState(false);
  const cfg = ICON_COLORS[notif.color];
  const Icon = notif.icon;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '14px',
        padding: '16px 20px',
        background: hov ? '#F9FAFB' : C.surface,
        borderLeft: notif.unread ? `3px solid ${C.blue}` : '3px solid transparent',
        borderBottom: `1px solid ${C.border}`,
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
            color: notif.unread ? C.text1 : C.text2,
            fontWeight: notif.unread ? 500 : 400,
            lineHeight: 1.4,
          }}>
            {notif.title}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            fontFamily: F.inter, fontSize: '10px', fontWeight: 500,
            padding: '2px 7px', borderRadius: '6px',
            background: '#F3F4F6', color: C.text3,
            border: `1px solid ${C.border}`,
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            {notif.type}
          </span>
        </div>
        {notif.sub && (
          <div style={{
            fontFamily: F.inter, fontSize: '12px',
            color: C.success, fontWeight: 500,
            marginTop: '3px',
          }}>
            {notif.sub}
          </div>
        )}
      </div>

      {/* Timestamp */}
      <span style={{
        fontFamily: F.mono, fontSize: '12px', color: C.text4,
        marginTop: '3px', flexShrink: 0, minWidth: '48px', textAlign: 'right',
      }}>
        {notif.time}
      </span>

      {/* Action dots */}
      <NotifActionMenu
        canRead={notif.unread}
        onRead={onRead}
        onDelete={onDelete}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function NotificationsHistoryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar role={role}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span onClick={() => navigate(fromOrg ? '/org-dashboard' : '/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Уведомления</span>
          </div>

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '22px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Уведомления
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
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
                  border: `1px solid ${unreadCount === 0 ? C.border : readAllHov ? C.blue : C.border}`,
                  borderRadius: '8px',
                  background: unreadCount === 0 ? C.surface : readAllHov ? C.blueLt : C.surface,
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                  color: unreadCount === 0 ? C.text4 : readAllHov ? C.blue : C.text1,
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
                  background: settingsHov ? C.blueLt : 'transparent',
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                  color: C.blue,
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
            <FilterSelect label="Тип: Все"    options={TYPE_OPTIONS}    value={typeFilter}   onChange={setTypeFilter} />
            <FilterSelect label="Статус: Все" options={STATUS_OPTIONS}  value={statusFilter} onChange={setStatusFilter} />
            <DateRangePicker value={dateRange} onChange={setDateRange} />

            <span style={{ marginLeft: 'auto', fontFamily: F.inter, fontSize: '13px', color: C.text4 }}>
              <span style={{ fontFamily: F.mono, color: C.text2 }}>{filtered.length}</span> из <span style={{ fontFamily: F.mono, color: C.text2 }}>156</span>
            </span>
          </div>

          {/* List card */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', overflow: 'hidden',
          }}>
            {groupedRows.length === 0 ? (
              <div style={{
                padding: '60px 20px', textAlign: 'center',
                fontFamily: F.inter, fontSize: '14px', color: C.text4,
              }}>
                Нет уведомлений, соответствующих фильтрам
              </div>
            ) : (
              groupedRows.map(g => (
                <div key={g.group}>
                  <div style={{
                    position: 'sticky', top: 0, zIndex: 1,
                    padding: '10px 20px',
                    background: '#F9FAFB',
                    borderBottom: `1px solid ${C.border}`,
                    fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                    color: C.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {g.group}
                  </div>
                  {g.items.map(n => (
                    <NotifRow
                      key={n.id}
                      notif={n}
                      onRead={() => markRead(n.id)}
                      onDelete={() => removeNotif(n.id)}
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
            <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
              Показано <span style={{ fontFamily: F.mono, color: C.text1 }}>1–{filtered.length}</span> из{' '}
              <span style={{ fontFamily: F.mono, color: C.text1 }}>156</span>
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, '...', 8].map((p, i) => (
                <PageBtn key={i} active={p === 1}>{p}</PageBtn>
              ))}
            </div>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}

function PageBtn({ children, active }: { children: React.ReactNode; active?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        minWidth: '32px', height: '32px', padding: '0 8px',
        border: `1px solid ${active ? C.blue : C.border}`,
        background: active ? C.blue : hov ? '#F9FAFB' : C.surface,
        color: active ? '#fff' : C.text2,
        fontFamily: F.inter, fontSize: '12px', fontWeight: active ? 600 : 500,
        borderRadius: '7px', cursor: 'pointer',
        transition: 'all 0.12s',
      }}
    >
      {children}
    </button>
  );
}
