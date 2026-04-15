import React, { useState, useRef, useEffect } from 'react';
import { usePopoverPosition } from '../components/usePopoverPosition';
import {
  ChevronRight, ChevronDown, Search, Plus, MoreVertical, X,
  ShieldAlert, ShieldCheck, Check, KeyRound,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════════════════════════ */

type UserRole = 'Банк-админ' | 'Менеджер орг.' | 'Оператор' | 'Наблюдатель';
type UserStatus = 'Активен' | 'Заблокирован' | 'Ожидает';

interface UserRow {
  id: number;
  initials: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  organization: string;
  lastLogin: string;
  status: UserStatus;
}

const USERS: UserRow[] = [
  {
    id: 1,
    initials: 'АК',
    name: 'Админ Камолов',
    phone: '+998 90 100 00 01',
    email: 'admin@ubank.uz',
    role: 'Банк-админ',
    organization: 'Universalbank',
    lastLogin: '13.04 09:12',
    status: 'Активен',
  },
  {
    id: 2,
    initials: 'ШР',
    name: 'Шерзод Рахимов',
    phone: '+998 90 100 00 02',
    email: 'sh.rahimov@ubank.uz',
    role: 'Банк-админ',
    organization: 'Universalbank',
    lastLogin: '12.04 18:30',
    status: 'Активен',
  },
  {
    id: 3,
    initials: 'НТ',
    name: 'Нодира Тошева',
    phone: '+998 91 100 00 03',
    email: 'n.tosheva@ubank.uz',
    role: 'Оператор',
    organization: 'Universalbank',
    lastLogin: '13.04 10:45',
    status: 'Активен',
  },
  {
    id: 4,
    initials: 'РА',
    name: 'Рустам Алиев',
    phone: '+998 90 123 45 67',
    email: 'r.aliev@mysafar.uz',
    role: 'Менеджер орг.',
    organization: 'Mysafar OOO',
    lastLogin: '13.04 08:20',
    status: 'Активен',
  },
  {
    id: 5,
    initials: 'ЛК',
    name: 'Лола Каримова',
    phone: '+998 91 234 56 78',
    email: 'l.karimova@unired.uz',
    role: 'Менеджер орг.',
    organization: 'Unired Marketing',
    lastLogin: '12.04 17:00',
    status: 'Активен',
  },
  {
    id: 6,
    initials: 'ТН',
    name: 'Тимур Насыров',
    phone: '+998 93 345 67 89',
    email: 't.nasyrov@express.uz',
    role: 'Менеджер орг.',
    organization: 'Express Finance',
    lastLogin: '11.04 14:30',
    status: 'Активен',
  },
  {
    id: 7,
    initials: 'АХ',
    name: 'Азиз Хамидов',
    phone: '+998 94 456 78 90',
    email: 'a.hamidov@dpay.uz',
    role: 'Менеджер орг.',
    organization: 'Digital Pay',
    lastLogin: '08.04 11:15',
    status: 'Заблокирован',
  },
  {
    id: 8,
    initials: 'НУ',
    name: 'Нодира Усманова',
    phone: '+998 95 567 89 01',
    email: 'n.usmanova@smart.uz',
    role: 'Менеджер орг.',
    organization: 'SmartCard Group',
    lastLogin: '13.04 07:50',
    status: 'Активен',
  },
  {
    id: 9,
    initials: 'ДА',
    name: 'Дилноза Ахмедова',
    phone: '+998 91 789 01 23',
    email: 'd.ahmedova@finb.uz',
    role: 'Менеджер орг.',
    organization: 'FinBridge',
    lastLogin: '01.04 09:00',
    status: 'Заблокирован',
  },
  {
    id: 10,
    initials: 'ФМ',
    name: 'Фарход Маматов',
    phone: '+998 90 900 00 10',
    email: '—',
    role: 'Наблюдатель',
    organization: 'Universalbank',
    lastLogin: '—',
    status: 'Ожидает',
  },
];

const ORGANIZATIONS = ['Universalbank', 'Mysafar OOO', 'Unired Marketing', 'Express Finance', 'Digital Pay', 'SmartCard Group', 'FinBridge'];
const ROLES = ['Банк-администратор', 'Менеджер организации', 'Оператор', 'Наблюдатель'];
const STATUSES = ['Активен', 'Заблокирован', 'Ожидает'];

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: '40px',
          padding: '0 36px 0 12px',
          border: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderRadius: '8px',
          background: C.surface,
          fontFamily: F.inter,
          fontSize: '14px',
          color: C.text2,
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          minWidth: '160px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} color={C.text3} style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROLE BADGE
═══════════════════════════════════════════════════════════════════════════ */

function RoleBadge({ role }: { role: UserRole }) {
  const configs: Record<UserRole, { bg: string; color: string }> = {
    'Банк-админ': { bg: C.blueLt, color: C.blue },
    'Менеджер орг.': { bg: C.warningBg, color: C.warning },
    'Оператор': { bg: '#F3F4F6', color: '#374151' },
    'Наблюдатель': { bg: '#F3F4F6', color: '#374151' },
  };

  const cfg = configs[role];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: F.inter,
      fontSize: '12px',
      fontWeight: 500,
      padding: '3px 10px',
      borderRadius: '10px',
      background: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      border: role === 'Оператор' || role === 'Наблюдатель' ? `1px solid ${C.border}` : 'none',
    }}>
      {role}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS BADGE
═══════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ status }: { status: UserStatus }) {
  const configs: Record<UserStatus, { bg: string; color: string; dot: string }> = {
    'Активен': { bg: C.successBg, color: '#15803D', dot: C.success },
    'Заблокирован': { bg: '#F3F4F6', color: '#374151', dot: '#9CA3AF' },
    'Ожидает': { bg: C.infoBg, color: '#0E7490', dot: C.info },
  };

  const cfg = configs[status];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontFamily: F.inter,
      fontSize: '12px',
      fontWeight: 500,
      padding: '3px 10px',
      borderRadius: '10px',
      background: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AVATAR CELL
═══════════════════════════════════════════════════════════════════════════ */

function AvatarCell({ initials, name }: { initials: string; name: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: C.blueTint, border: `1.5px solid ${C.blue}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 700, color: C.blue }}>
          {initials}
        </span>
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2, whiteSpace: 'nowrap' }}>
        {name}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION DOTS DROPDOWN
═══════════════════════════════════════════════════════════════════════════ */

function ActionDropdown({ userId, status, onEditRole, onToggleBlock, onResetPassword }: {
  userId: number;
  status: UserStatus;
  onEditRole: () => void;
  onToggleBlock: () => void;
  onResetPassword: () => void;
}) {
  const pop = usePopoverPosition();
  const [hovered, setHovered] = useState<string | null>(null);

  const isBlocked = status === 'Заблокирован';
  const actions = [
    { id: 'details', label: 'Подробнее' },
    { id: 'edit-role', label: 'Редактировать роль' },
    { id: 'reset-pw', label: 'Сбросить пароль' },
    {
      id: 'block',
      label: isBlocked ? 'Разблокировать' : 'Заблокировать',
      danger: !isBlocked,
    },
  ];

  return (
    <div ref={pop.rootRef} style={{ position: 'relative' }}>
      <button
        ref={pop.triggerRef as React.RefObject<HTMLButtonElement>}
        onClick={pop.toggle}
        style={{
          width: '28px',
          height: '28px',
          border: `1px solid ${pop.open ? C.blue : C.border}`,
          borderRadius: '6px',
          background: pop.open ? C.blueLt : C.surface,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.12s',
        }}
      >
        <MoreVertical size={14} color={pop.open ? C.blue : C.text3} strokeWidth={1.75} />
      </button>

      {pop.open && (
        <div ref={pop.menuRef} style={{
          ...pop.menuStyle,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '10px',
          padding: '6px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: '220px',
        }}>
          {actions.map((action, idx) => (
            <React.Fragment key={action.id}>
              {idx === actions.length - 1 && <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />}
              <button
                onMouseEnter={() => setHovered(action.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => {
                  if (action.id === 'edit-role') onEditRole();
                  else if (action.id === 'block') onToggleBlock();
                  else if (action.id === 'reset-pw') onResetPassword();
                  else console.log('Action:', action.id, 'User:', userId);
                  pop.close();
                }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  border: 'none',
                  background: hovered === action.id ? (action.danger ? '#FEF2F2' : '#F9FAFB') : 'none',
                  cursor: 'pointer',
                  fontFamily: F.inter,
                  fontSize: '13px',
                  color: hovered === action.id && action.danger ? '#DC2626' : C.text2,
                  transition: 'all 0.1s',
                }}
              >
                {action.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA TABLE
═══════════════════════════════════════════════════════════════════════════ */

function DataTable({ users, onEditRole, onToggleBlock, onResetPassword }: {
  users: UserRow[];
  onEditRole: (user: UserRow) => void;
  onToggleBlock: (user: UserRow) => void;
  onResetPassword: (user: UserRow) => void;
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      overflowX: 'auto',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '1200px',
      }}>
        <thead>
          <tr style={{
            background: '#FAFBFC',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <th style={headerCellStyle}>#</th>
            <th style={headerCellStyle}>Пользователь</th>
            <th style={headerCellStyle}>Телефон</th>
            <th style={{ ...headerCellStyle, minWidth: '200px' }}>Email</th>
            <th style={headerCellStyle}>Роль</th>
            <th style={headerCellStyle}>Организация</th>
            <th style={headerCellStyle}>Последний вход</th>
            <th style={headerCellStyle}>Статус</th>
            <th style={headerCellStyle}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr
              key={user.id}
              onMouseEnter={() => setHoveredRow(user.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                borderBottom: `1px solid ${C.border}`,
                background: hoveredRow === user.id ? '#FAFBFC' : C.surface,
                transition: 'background 0.12s',
              }}
            >
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>
                  {user.id}
                </span>
              </td>
              <td style={dataCellStyle}>
                <AvatarCell initials={user.initials} name={user.name} />
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
                  {user.phone}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                  {user.email}
                </span>
              </td>
              <td style={dataCellStyle}>
                <RoleBadge role={user.role} />
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                  {user.organization}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>
                  {user.lastLogin}
                </span>
              </td>
              <td style={dataCellStyle}>
                <StatusBadge status={user.status} />
              </td>
              <td style={dataCellStyle}>
                <ActionDropdown
                  userId={user.id}
                  status={user.status}
                  onEditRole={() => onEditRole(user)}
                  onToggleBlock={() => onToggleBlock(user)}
                  onResetPassword={() => onResetPassword(user)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerCellStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontFamily: F.inter,
  fontSize: '12px',
  fontWeight: 600,
  color: C.text3,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
};

const dataCellStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

/* ═══════════════════════════════════════════════════════════════════════════
   ADD USER MODAL
═══════════════════════════════════════════════════════════════════════════ */

function AddUserModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [org, setOrg] = useState('');
  const [sendSMS, setSendSMS] = useState(true);

  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  if (!open) return null;

  const handleCreate = () => {
    console.log('Creating user:', { fullName, phone, email, role, org, sendSMS });
    onClose();
  };

  const showOrgField = role === 'Менеджер организации';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: '16px',
        width: '500px',
        maxWidth: '90vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <h2 style={{
            fontFamily: F.dm,
            fontSize: '18px',
            fontWeight: 700,
            color: C.text1,
            margin: 0,
          }}>
            Новый пользователь
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              border: `1px solid ${C.border}`,
              borderRadius: '8px',
              background: C.surface,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Full Name */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: F.inter,
                fontSize: '13px',
                fontWeight: 500,
                color: C.text2,
                marginBottom: '8px',
              }}>
                ФИО
              </label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Фамилия Имя Отчество"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: `1px solid ${C.inputBorder}`,
                  borderRadius: '8px',
                  background: C.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  color: C.text1,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: F.inter,
                fontSize: '13px',
                fontWeight: 500,
                color: C.text2,
                marginBottom: '8px',
              }}>
                Телефон
              </label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+998 __ ___ __ __"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: `1px solid ${C.inputBorder}`,
                  borderRadius: '8px',
                  background: C.surface,
                  fontFamily: F.mono,
                  fontSize: '14px',
                  color: C.text1,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: F.inter,
                fontSize: '13px',
                fontWeight: 500,
                color: C.text2,
                marginBottom: '8px',
              }}>
                Email
              </label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@company.uz"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 12px',
                  border: `1px solid ${C.inputBorder}`,
                  borderRadius: '8px',
                  background: C.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  color: C.text1,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Role */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: F.inter,
                fontSize: '13px',
                fontWeight: 500,
                color: C.text2,
                marginBottom: '8px',
              }}>
                Роль
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 36px 0 12px',
                    border: `1px solid ${C.inputBorder}`,
                    borderRadius: '8px',
                    background: C.surface,
                    fontFamily: F.inter,
                    fontSize: '14px',
                    color: C.text2,
                    outline: 'none',
                    appearance: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Выберите роль</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={14} color={C.text3} style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }} />
              </div>
            </div>

            {/* Organization (conditional) */}
            {showOrgField && (
              <div>
                <label style={{
                  display: 'block',
                  fontFamily: F.inter,
                  fontSize: '13px',
                  fontWeight: 500,
                  color: C.text2,
                  marginBottom: '8px',
                }}>
                  Организация
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={org}
                    onChange={e => setOrg(e.target.value)}
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 36px 0 12px',
                      border: `1px solid ${C.inputBorder}`,
                      borderRadius: '8px',
                      background: C.surface,
                      fontFamily: F.inter,
                      fontSize: '14px',
                      color: C.text2,
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="">Выберите организацию</option>
                    {ORGANIZATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={14} color={C.text3} style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }} />
                </div>
              </div>
            )}

            {/* Send SMS Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '10px',
              background: '#F9FAFB',
              border: `1px solid ${C.border}`,
            }}>
              <label style={{
                fontFamily: F.inter,
                fontSize: '13px',
                fontWeight: 500,
                color: C.text2,
                cursor: 'pointer',
              }}>
                Отправить приглашение по SMS
              </label>
              <button
                onClick={() => setSendSMS(!sendSMS)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  background: sendSMS ? C.blue : '#D1D5DB',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: C.surface,
                  position: 'absolute',
                  top: '3px',
                  left: sendSMS ? '23px' : '3px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          padding: '16px 24px',
          borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHover(true)}
            onMouseLeave={() => setCancelHover(false)}
            onClick={onClose}
            style={{
              height: '40px',
              padding: '0 20px',
              border: `1px solid ${cancelHover ? C.blue : C.border}`,
              borderRadius: '8px',
              background: cancelHover ? C.blueLt : C.surface,
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: cancelHover ? C.blue : C.text2,
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            onMouseEnter={() => setSaveHover(true)}
            onMouseLeave={() => setSaveHover(false)}
            onClick={handleCreate}
            style={{
              height: '40px',
              padding: '0 20px',
              border: 'none',
              borderRadius: '8px',
              background: saveHover ? C.blueHover : C.blue,
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EDIT ROLE MODAL
═══════════════════════════════════════════════════════════════════════════ */

const ROLE_DESCRIPTIONS: Record<string, { title: string; lines: string[] }> = {
  'Банк-администратор': {
    title: 'Банк-администратор',
    lines: [
      'Полный доступ ко всем данным банка: организации, партии карт, KPI, финансы',
      'Может управлять пользователями и настройками системы',
    ],
  },
  'Менеджер организации': {
    title: 'Менеджер организации',
    lines: [
      'Полный доступ к данным своей организации: продавцы, карты, финансы, настройки',
      'Не может видеть данные других организаций',
    ],
  },
  'Оператор': {
    title: 'Оператор',
    lines: [
      'Оперативные действия в назначенной организации: фиксация продаж, назначение карт',
      'Ограниченный доступ к финансовым отчётам',
    ],
  },
  'Наблюдатель': {
    title: 'Наблюдатель',
    lines: [
      'Только чтение: просмотр карт, продавцов, отчётов своей организации',
      'Не может редактировать или создавать данные',
    ],
  },
};

const ORG_OPTIONS = ['Mysafar OOO', 'Unired Marketing', 'Express Finance', 'Digital Pay', 'SmartCard Group', 'CardPlus'];

const ROLE_SHORT_TO_LONG: Record<UserRole, string> = {
  'Банк-админ':    'Банк-администратор',
  'Менеджер орг.': 'Менеджер организации',
  'Оператор':      'Оператор',
  'Наблюдатель':   'Наблюдатель',
};

const NEEDS_ORG = new Set(['Менеджер организации', 'Оператор', 'Наблюдатель']);

function EditRoleModal({ open, user, onClose, onSave }: {
  open: boolean;
  user: UserRow | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const initialRole = user ? ROLE_SHORT_TO_LONG[user.role] : '';
  const initialOrg = user?.organization ?? '';

  const [role, setRole] = useState(initialRole);
  const [org, setOrg] = useState(initialOrg);
  const [roleFocus, setRoleFocus] = useState(false);
  const [orgFocus, setOrgFocus] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [saveHov, setSaveHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (open && user) {
      setRole(ROLE_SHORT_TO_LONG[user.role]);
      setOrg(user.organization);
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open || !user) return null;

  const needsOrg = NEEDS_ORG.has(role);
  const desc = ROLE_DESCRIPTIONS[role];
  const orgChanged = needsOrg && org !== initialOrg && initialOrg !== '—';
  const canSave = !!role && (!needsOrg || !!org);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: F.dm, fontSize: '17px', fontWeight: 700, color: C.text1,
          }}>
            Изменить роль пользователя
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '28px', height: '28px',
              border: 'none', borderRadius: '7px',
              background: closeHov ? '#F3F4F6' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {/* User strip */}
          <div style={{
            background: '#F9FAFB', borderRadius: '8px', padding: '12px',
            display: 'flex', alignItems: 'center', gap: '12px',
            flexWrap: 'wrap',
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: C.blueLt, border: `1px solid ${C.blueTint}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: C.blue,
              flexShrink: 0,
            }}>
              {user.initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: C.text1,
              }}>
                {user.name}
              </div>
              <div style={{
                fontFamily: F.mono, fontSize: '12px', color: C.text3,
                marginTop: '2px',
              }}>
                {user.phone}
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <RoleBadge role={user.role} />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: C.border }} />

          {/* Role select */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Новая роль<span style={{ color: C.error, marginLeft: '3px' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                onFocus={() => setRoleFocus(true)}
                onBlur={() => setRoleFocus(false)}
                style={{
                  width: '100%', height: '40px', padding: '0 36px 0 12px',
                  border: `1px solid ${roleFocus ? C.blue : C.inputBorder}`,
                  borderRadius: '8px', background: C.surface,
                  fontFamily: F.inter, fontSize: '13px', color: C.text1,
                  outline: 'none', appearance: 'none', cursor: 'pointer',
                  boxShadow: roleFocus ? `0 0 0 3px ${C.blueTint}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={14} color={C.text3} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
            </div>
          </div>

          {/* Role description */}
          {desc && (
            <div style={{
              background: '#F9FAFB', border: `1px solid ${C.border}`,
              borderRadius: '8px', padding: '12px',
            }}>
              <div style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 600,
                color: C.text1, marginBottom: '6px',
              }}>
                {desc.title}
              </div>
              <ul style={{
                margin: 0, padding: 0, listStyle: 'none',
                display: 'flex', flexDirection: 'column', gap: '4px',
              }}>
                {desc.lines.map((line, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: '6px',
                    fontFamily: F.inter, fontSize: '12px', color: C.text2, lineHeight: 1.5,
                  }}>
                    <span style={{ color: C.text4, flexShrink: 0 }}>•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conditional org field */}
          {needsOrg && (
            <div>
              <label style={{
                display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                color: C.text2, marginBottom: '8px',
              }}>
                Организация<span style={{ color: C.error, marginLeft: '3px' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={org}
                  onChange={e => setOrg(e.target.value)}
                  onFocus={() => setOrgFocus(true)}
                  onBlur={() => setOrgFocus(false)}
                  style={{
                    width: '100%', height: '40px', padding: '0 36px 0 12px',
                    border: `1px solid ${orgFocus ? C.blue : C.inputBorder}`,
                    borderRadius: '8px', background: C.surface,
                    fontFamily: F.inter, fontSize: '13px',
                    color: org ? C.text1 : C.text4,
                    outline: 'none', appearance: 'none', cursor: 'pointer',
                    boxShadow: orgFocus ? `0 0 0 3px ${C.blueTint}` : 'none',
                    transition: 'border-color 0.12s, box-shadow 0.12s',
                  }}
                >
                  <option value="">Выберите организацию</option>
                  {ORG_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} color={C.text3} style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                }} />
              </div>

              {orgChanged && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '6px',
                  marginTop: '8px',
                  fontFamily: F.inter, fontSize: '12px',
                  color: C.warning, lineHeight: 1.4,
                }}>
                  <span style={{ flexShrink: 0 }}>⚠</span>
                  <span>Пользователь потеряет доступ к данным {initialOrg}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${C.border}`, borderRadius: '8px',
              background: cancelHov ? '#F9FAFB' : C.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text1, cursor: 'pointer',
              transition: 'background 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            onMouseEnter={() => setSaveHov(true)}
            onMouseLeave={() => setSaveHov(false)}
            onClick={() => { if (canSave) onSave(); }}
            disabled={!canSave}
            aria-label="Сохранить роль"
            style={{
              height: '38px', padding: '0 18px',
              border: 'none', borderRadius: '8px',
              background: !canSave ? '#93C5FD' : saveHov ? C.blueHover : C.blue,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF',
              cursor: canSave ? 'pointer' : 'not-allowed',
              opacity: canSave ? 1 : 0.85,
              boxShadow: canSave && saveHov ? '0 2px 8px rgba(37,99,235,0.28)' : canSave ? '0 1px 3px rgba(37,99,235,0.16)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            Сохранить роль
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BLOCK / UNBLOCK USER MODALS
═══════════════════════════════════════════════════════════════════════════ */

const BLOCK_REASONS = [
  'Нарушение политики',
  'Запрос организации',
  'Подозрительная активность',
  'Другое',
];

function UserCardStrip({ user }: { user: UserRow }) {
  const statusCfg: Record<UserStatus, { bg: string; color: string; dot: string; border?: string }> = {
    'Активен':      { bg: C.successBg, color: '#15803D', dot: C.success },
    'Заблокирован': { bg: '#F3F4F6',    color: C.text2,  dot: C.text4, border: C.border },
    'Ожидает':      { bg: C.warningBg,  color: '#B45309', dot: C.warning },
  };
  const s = statusCfg[user.status];
  return (
    <div style={{
      background: '#F9FAFB', borderRadius: '8px', padding: '12px',
      display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: C.blueLt, border: `1px solid ${C.blueTint}`,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: C.blue,
        flexShrink: 0,
      }}>
        {user.initials}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: C.text1,
        }}>
          {user.name}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: C.text3, marginTop: '2px',
        }}>
          {user.role} — {user.organization}
        </div>
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
        padding: '3px 10px', borderRadius: '10px',
        background: s.bg, color: s.color,
        border: s.border ? `1px solid ${s.border}` : '1px solid transparent',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot }} />
        {user.status}
      </span>
    </div>
  );
}

function BlockUserModal({ open, user, onClose, onConfirm }: {
  open: boolean; user: UserRow | null; onClose: () => void; onConfirm: () => void;
}) {
  const [reason, setReason] = useState('');
  const [reasonFocus, setReasonFocus] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!open) { setReason(''); return; }
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open || !user) return null;

  const canConfirm = !!reason;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <ShieldAlert size={22} color={C.error} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Заблокировать пользователя
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '28px', height: '28px',
              border: 'none', borderRadius: '7px',
              background: closeHov ? '#F3F4F6' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <UserCardStrip user={user} />

          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Причина блокировки
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                onFocus={() => setReasonFocus(true)}
                onBlur={() => setReasonFocus(false)}
                style={{
                  width: '100%', height: '40px', padding: '0 36px 0 12px',
                  border: `1px solid ${reasonFocus ? C.blue : C.inputBorder}`,
                  borderRadius: '8px', background: C.surface,
                  fontFamily: F.inter, fontSize: '13px',
                  color: reason ? C.text1 : C.text4,
                  outline: 'none', appearance: 'none', cursor: 'pointer',
                  boxShadow: reasonFocus ? `0 0 0 3px ${C.blueTint}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              >
                <option value="">Выберите причину</option>
                {BLOCK_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={14} color={C.text3} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
            </div>
          </div>

          <div style={{
            fontFamily: F.inter, fontSize: '13px', color: C.text2, lineHeight: 1.5,
          }}>
            При блокировке пользователь немедленно потеряет доступ к платформе.
          </div>
        </div>

        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${C.border}`, borderRadius: '8px',
              background: cancelHov ? '#F9FAFB' : C.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text1, cursor: 'pointer',
              transition: 'background 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            onMouseEnter={() => setConfirmHov(true)}
            onMouseLeave={() => setConfirmHov(false)}
            onClick={() => { if (canConfirm) onConfirm(); }}
            disabled={!canConfirm}
            aria-label="Заблокировать"
            style={{
              height: '38px', padding: '0 18px',
              border: 'none', borderRadius: '8px',
              background: !canConfirm ? '#FCA5A5' : confirmHov ? '#DC2626' : C.error,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              opacity: canConfirm ? 1 : 0.85,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: canConfirm && confirmHov ? '0 2px 8px rgba(239,68,68,0.32)' : canConfirm ? '0 1px 3px rgba(239,68,68,0.20)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <ShieldAlert size={14} strokeWidth={2} />
            Заблокировать
          </button>
        </div>
      </div>
    </div>
  );
}

function UnblockUserModal({ open, user, onClose, onConfirm }: {
  open: boolean; user: UserRow | null; onClose: () => void; onConfirm: () => void;
}) {
  const [notify, setNotify] = useState(true);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!open) { setNotify(true); return; }
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open || !user) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <ShieldCheck size={22} color={C.success} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Разблокировать пользователя
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '28px', height: '28px',
              border: 'none', borderRadius: '7px',
              background: closeHov ? '#F3F4F6' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <UserCardStrip user={user} />

          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '13px', color: C.text2, marginBottom: '3px',
            }}>
              Причина блокировки: <span style={{ color: C.text1, fontWeight: 500 }}>Запрос организации</span>
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4 }}>
              Дата блокировки: <span style={{ fontFamily: F.mono }}>08.04.2026</span>
            </div>
          </div>

          {/* Notify checkbox */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            cursor: 'pointer',
          }}>
            <div
              onClick={() => setNotify(n => !n)}
              style={{
                width: '16px', height: '16px', borderRadius: '4px',
                border: `1.5px solid ${notify ? C.blue : C.inputBorder}`,
                background: notify ? C.blue : C.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.12s',
              }}
            >
              {notify && <Check size={11} color="#fff" strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              checked={notify}
              onChange={e => setNotify(e.target.checked)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1 }}>
              Отправить уведомление о разблокировке по SMS
            </span>
          </label>
        </div>

        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${C.border}`, borderRadius: '8px',
              background: cancelHov ? '#F9FAFB' : C.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text1, cursor: 'pointer',
              transition: 'background 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            onMouseEnter={() => setConfirmHov(true)}
            onMouseLeave={() => setConfirmHov(false)}
            onClick={onConfirm}
            aria-label="Разблокировать"
            style={{
              height: '38px', padding: '0 18px',
              border: 'none', borderRadius: '8px',
              background: confirmHov ? C.blueHover : C.blue,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: confirmHov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
              transition: 'all 0.15s',
            }}
          >
            <ShieldCheck size={14} strokeWidth={2} />
            Разблокировать
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESET PASSWORD MODAL
═══════════════════════════════════════════════════════════════════════════ */

function ResetPasswordModal({ open, user, onClose, onConfirm }: {
  open: boolean; user: UserRow | null; onClose: () => void; onConfirm: () => void;
}) {
  const [method, setMethod] = useState<'sms' | 'email'>('sms');
  const [forceChange, setForceChange] = useState(true);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!open) { setMethod('sms'); setForceChange(true); return; }
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open || !user) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '440px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <KeyRound size={22} color={C.blue} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Сбросить пароль
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '28px', height: '28px',
              border: 'none', borderRadius: '7px',
              background: closeHov ? '#F3F4F6' : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {/* User info */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: C.blueLt, border: `1px solid ${C.blueTint}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: C.blue,
              flexShrink: 0,
            }}>
              {user.initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: C.text1,
              }}>
                {user.name}
              </div>
              <div style={{
                fontFamily: F.inter, fontSize: '12px', color: C.text3, marginTop: '2px',
              }}>
                {user.role} — {user.organization}
              </div>
            </div>
          </div>

          <p style={{
            margin: 0, fontFamily: F.inter, fontSize: '13px',
            color: C.text2, lineHeight: 1.5,
          }}>
            Текущий пароль будет аннулирован. Новый временный пароль будет отправлен пользователю.
          </p>

          {/* Method radio group */}
          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Способ отправки
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <MethodRadio
                selected={method === 'sms'}
                onClick={() => setMethod('sms')}
                label={<>SMS на <span style={{ fontFamily: F.mono, color: C.text1 }}>{user.phone}</span></>}
              />
              <MethodRadio
                selected={method === 'email'}
                onClick={() => setMethod('email')}
                label={<>Email на <span style={{ fontFamily: F.mono, color: C.text1 }}>{user.email}</span></>}
              />
            </div>
          </div>

          {/* Force change checkbox */}
          <label style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            cursor: 'pointer',
          }}>
            <div
              onClick={() => setForceChange(f => !f)}
              style={{
                width: '16px', height: '16px', borderRadius: '4px',
                border: `1.5px solid ${forceChange ? C.blue : C.inputBorder}`,
                background: forceChange ? C.blue : C.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.12s',
              }}
            >
              {forceChange && <Check size={11} color="#fff" strokeWidth={3} />}
            </div>
            <input
              type="checkbox"
              checked={forceChange}
              onChange={e => setForceChange(e.target.checked)}
              style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
            />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1 }}>
              Потребовать смену пароля при первом входе
            </span>
          </label>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: `1px solid ${C.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${C.border}`, borderRadius: '8px',
              background: cancelHov ? '#F9FAFB' : C.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text1, cursor: 'pointer',
              transition: 'background 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            onMouseEnter={() => setConfirmHov(true)}
            onMouseLeave={() => setConfirmHov(false)}
            onClick={onConfirm}
            aria-label="Сбросить пароль"
            style={{
              height: '38px', padding: '0 18px',
              border: 'none', borderRadius: '8px',
              background: confirmHov ? C.blueHover : C.blue,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: confirmHov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
              transition: 'all 0.15s',
            }}
          >
            <KeyRound size={14} strokeWidth={2} />
            Сбросить пароль
          </button>
        </div>
      </div>
    </div>
  );
}

function MethodRadio({ selected, onClick, label }: {
  selected: boolean; onClick: () => void; label: React.ReactNode;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 12px',
        border: `1px solid ${selected ? C.blue : hov ? C.inputBorder : C.border}`,
        borderRadius: '8px',
        background: selected ? C.blueLt : hov ? '#F9FAFB' : C.surface,
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        border: `2px solid ${selected ? C.blue : '#D1D5DB'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        transition: 'border-color 0.12s',
      }}>
        {selected && (
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.blue }} />
        )}
      </div>
      <span style={{
        fontFamily: F.inter, fontSize: '13px', color: C.text1,
      }}>
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function UsersManagementPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addUserHover, setAddUserHover] = useState(false);
  const [editRoleUser, setEditRoleUser] = useState<UserRow | null>(null);
  const [blockUser, setBlockUser] = useState<UserRow | null>(null);
  const [unblockUser, setUnblockUser] = useState<UserRow | null>(null);
  const [resetPwUser, setResetPwUser] = useState<UserRow | null>(null);

  const handleToggleBlock = (user: UserRow) => {
    if (user.status === 'Заблокирован') setUnblockUser(user);
    else setBlockUser(user);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar role="bank"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>


        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Пользователи</span>
          </div>

          {/* Top Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Пользователи
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
                Управление пользователями платформы
              </p>
            </div>

            <button
              onMouseEnter={() => setAddUserHover(true)}
              onMouseLeave={() => setAddUserHover(false)}
              onClick={() => setAddUserModalOpen(true)}
              style={{
                height: '40px',
                padding: '0 18px',
                border: 'none',
                borderRadius: '8px',
                background: addUserHover ? C.blueHover : C.blue,
                fontFamily: F.inter,
                fontSize: '14px',
                fontWeight: 500,
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                flexShrink: 0,
                transition: 'all 0.12s',
              }}
            >
              <Plus size={16} strokeWidth={2} />
              Добавить пользователя
            </button>
          </div>

          {/* Filter Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '24px',
          }}>
            {/* Search */}
            <div style={{ position: 'relative', width: '300px', flexShrink: 0 }}>
              <Search
                size={16}
                color={searchFocused ? C.blue : C.text4}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  transition: 'color 0.12s',
                }}
              />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Поиск по имени, телефону или email..."
                style={{
                  width: '100%',
                  height: '40px',
                  paddingLeft: '38px',
                  paddingRight: '12px',
                  border: `1px solid ${searchFocused ? C.blue : C.inputBorder}`,
                  borderRadius: '8px',
                  background: C.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  color: C.text1,
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: searchFocused ? `0 0 0 3px ${C.blueTint}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              />
            </div>

            <FilterSelect
              label="Роль: Все"
              options={ROLES}
              value={roleFilter}
              onChange={setRoleFilter}
            />

            <FilterSelect
              label="Организация: Все"
              options={ORGANIZATIONS}
              value={orgFilter}
              onChange={setOrgFilter}
            />

            <FilterSelect
              label="Статус: Все"
              options={STATUSES}
              value={statusFilter}
              onChange={setStatusFilter}
            />

            {/* Clear filters */}
            {(search || roleFilter || orgFilter || statusFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setRoleFilter('');
                  setOrgFilter('');
                  setStatusFilter('');
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  fontFamily: F.inter,
                  fontSize: '13px',
                  color: C.text3,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'color 0.12s, background 0.12s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget.style.color = C.text1);
                  (e.currentTarget.style.background = '#F3F4F6');
                }}
                onMouseLeave={e => {
                  (e.currentTarget.style.color = C.text3);
                  (e.currentTarget.style.background = 'none');
                }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1, marginTop: '-1px' }}>×</span>
                Сбросить
              </button>
            )}
          </div>

          {/* Data Table */}
          <DataTable
            users={USERS}
            onEditRole={setEditRoleUser}
            onToggleBlock={handleToggleBlock}
            onResetPassword={setResetPwUser}
          />

          {/* Pagination */}
          <div style={{
            marginTop: '16px',
            fontFamily: F.inter,
            fontSize: '13px',
            color: C.text3,
            textAlign: 'center',
          }}>
            Показано 1–10 из 10
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal open={addUserModalOpen} onClose={() => setAddUserModalOpen(false)} />

      {/* Edit Role Modal */}
      <EditRoleModal
        open={!!editRoleUser}
        user={editRoleUser}
        onClose={() => setEditRoleUser(null)}
        onSave={() => setEditRoleUser(null)}
      />

      {/* Block User Modal */}
      <BlockUserModal
        open={!!blockUser}
        user={blockUser}
        onClose={() => setBlockUser(null)}
        onConfirm={() => setBlockUser(null)}
      />

      {/* Unblock User Modal */}
      <UnblockUserModal
        open={!!unblockUser}
        user={unblockUser}
        onClose={() => setUnblockUser(null)}
        onConfirm={() => setUnblockUser(null)}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        open={!!resetPwUser}
        user={resetPwUser}
        onClose={() => setResetPwUser(null)}
        onConfirm={() => setResetPwUser(null)}
      />
    </div>
  );
}
