import React, { useState, useRef, useEffect } from 'react';
import { usePopoverPosition } from '../components/usePopoverPosition';
import {
  ChevronRight, ChevronDown, Search, MoreVertical,
  ArrowDownToLine, Clock, CheckCircle, X, XCircle, Check,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { DateRangePicker } from '../components/DateRangePicker';

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

const VARIANTS = {
  amber:  { icon: '#D97706', iconBg: '#FFFBEB', border: '#FDE68A' },
  blue:   { icon: C.blue,    iconBg: C.blueLt,  border: C.blueTint },
  green:  { icon: '#16A34A', iconBg: '#F0FDF4',  border: '#BBF7D0' },
} as const;

function StatCard({ icon: Icon, variant, label, value, subtitle }: {
  icon: React.ElementType;
  variant: keyof typeof VARIANTS;
  label: string;
  value: string;
  subtitle?: string;
}) {
  const v = VARIANTS[variant];
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '12px', flex: 1,
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: v.iconBg, border: `1px solid ${v.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={v.icon} strokeWidth={1.75} />
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text3, marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '28px', fontWeight: 700, color: C.text1, lineHeight: 1.2 }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4, marginTop: '4px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
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
          fontFamily: F.inter, fontSize: '14px', color: C.text2,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s', minWidth: '160px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} color={C.text3} style={{
        position: 'absolute', right: '10px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

type WdStatus = 'Выполнен' | 'В обработке' | 'Отклонён';

function StatusBadge({ status }: { status: WdStatus }) {
  const cfg: Record<WdStatus, { bg: string; color: string; dot: string }> = {
    'Выполнен':     { bg: C.successBg, color: '#15803D', dot: C.success },
    'В обработке':  { bg: C.warningBg, color: '#B45309', dot: C.warning },
    'Отклонён':     { bg: '#FEF2F2',   color: '#DC2626', dot: '#EF4444' },
  };
  const c = cfg[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: c.bg, color: c.color, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AVATAR CELL
═══════════════════════════════════════════════════════════════════════════ */

function AvatarCell({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: C.blueLt, border: `1px solid ${C.blueTint}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{ fontFamily: F.inter, fontSize: '10px', fontWeight: 700, color: C.blue }}>{initials}</span>
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2, whiteSpace: 'nowrap' }}>{name}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION DROPDOWN
═══════════════════════════════════════════════════════════════════════════ */

function ActionDropdown({ status, onAction }: { status: WdStatus; onAction: (action: string) => void }) {
  const pop = usePopoverPosition();
  const [hovered, setHovered] = useState<string | null>(null);

  const actions = [
    { id: 'details', label: 'Подробнее' },
    ...(status === 'В обработке' ? [
      { id: 'approve', label: 'Подтвердить' },
      { id: 'reject', label: 'Отклонить', danger: true },
    ] : []),
  ];

  return (
    <div ref={pop.rootRef} style={{ position: 'relative' }}>
      <button
        ref={pop.triggerRef as React.RefObject<HTMLButtonElement>}
        onClick={e => { e.stopPropagation(); pop.toggle(); }}
        style={{
          width: '28px', height: '28px',
          border: `1px solid ${pop.open ? C.blue : C.border}`,
          borderRadius: '6px',
          background: pop.open ? C.blueLt : C.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.12s',
        }}
      >
        <MoreVertical size={14} color={pop.open ? C.blue : C.text3} strokeWidth={1.75} />
      </button>

      {pop.open && (
        <div ref={pop.menuRef} style={{
          ...pop.menuStyle,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '10px', padding: '6px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: '180px',
        }}>
          {actions.map((action, idx) => (
            <React.Fragment key={action.id}>
              {action.danger && <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />}
              <button
                onMouseEnter={() => setHovered(action.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={e => { e.stopPropagation(); onAction(action.id); pop.close(); }}
                style={{
                  width: '100%', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', borderRadius: '7px', border: 'none',
                  background: hovered === action.id ? (action.danger ? '#FEF2F2' : '#F9FAFB') : 'none',
                  cursor: 'pointer', fontFamily: F.inter, fontSize: '13px',
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
   DATA
═══════════════════════════════════════════════════════════════════════════ */

interface WdRow {
  id: number;
  date: string;
  seller: string;
  amount: string;
  method: string;
  details: string;
  ucoinTx: string;
  status: WdStatus;
}

const WITHDRAWALS: WdRow[] = [
  { id: 1, date: '13.04 14:00', seller: 'Абдуллох Р.',  amount: '120 000', method: 'UZCARD', details: '8600 •••• 4455', ucoinTx: 'UCN-8832', status: 'Выполнен' },
  { id: 2, date: '13.04 10:30', seller: 'Санжар М.',    amount: '200 000', method: 'HUMO',   details: '9860 •••• 7788', ucoinTx: 'UCN-8835', status: 'Выполнен' },
  { id: 3, date: '12.04 16:00', seller: 'Нилуфар К.',   amount: '80 000',  method: 'UZCARD', details: '8600 •••• 1122', ucoinTx: 'UCN-8829', status: 'Выполнен' },
  { id: 4, date: '12.04 12:00', seller: 'Ислом Т.',     amount: '100 000', method: 'VISA',   details: '4278 •••• 9900', ucoinTx: 'UCN-8828', status: 'Выполнен' },
  { id: 5, date: '11.04 18:00', seller: 'Камола Р.',    amount: '60 000',  method: 'UZCARD', details: '8600 •••• 3344', ucoinTx: 'UCN-8825', status: 'Выполнен' },
  { id: 6, date: '11.04 09:00', seller: 'Дарья Н.',     amount: '50 000',  method: 'HUMO',   details: '9860 •••• 5566', ucoinTx: 'UCN-8824', status: 'Выполнен' },
  { id: 7, date: '13.04 15:30', seller: 'Санжар М.',    amount: '50 000',  method: 'UZCARD', details: '8600 •••• 7788', ucoinTx: 'UCN-8836', status: 'В обработке' },
  { id: 8, date: '13.04 11:00', seller: 'Ислом Т.',     amount: '35 000',  method: 'HUMO',   details: '9860 •••• 2233', ucoinTx: 'UCN-8837', status: 'В обработке' },
];

const SELLERS_LIST = ['Санжар', 'Абдуллох', 'Ислом', 'Нилуфар', 'Дарья', 'Камола'];
const STATUS_OPTIONS = ['Выполнен', 'В обработке', 'Отклонён'];

/* ═══════════════════════════════════════════════════════════════════════════
   TABLE STYLES
═══════════════════════════════════════════════════════════════════════════ */

const hCell: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left',
  fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: C.text4,
  textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
};

const dCell: React.CSSProperties = {
  padding: '14px 16px', whiteSpace: 'nowrap',
};

/* ═══════════════════════════════════════════════════════════════════════════
   APPROVE WITHDRAWAL MODAL
═══════════════════════════════════════════════════════════════════════════ */

const SELLER_FULL_NAMES: Record<string, string> = {
  'Санжар М.':    'Санжар Мирзаев',
  'Абдуллох Р.':  'Абдуллох Рахимов',
  'Нилуфар К.':   'Нилуфар Каримова',
  'Ислом Т.':     'Ислом Тошматов',
  'Камола Р.':    'Камола Расулова',
  'Дарья Н.':     'Дарья Нам',
};

const SELLER_BALANCES: Record<string, number> = {
  'Санжар М.':    155_000,
  'Абдуллох Р.':  220_000,
  'Нилуфар К.':   90_000,
  'Ислом Т.':     60_000,
  'Камола Р.':    45_000,
  'Дарья Н.':     80_000,
};

function fmtUzs(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function KV({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '110px 1fr',
      alignItems: 'baseline', gap: '14px',
      padding: '6px 0',
    }}>
      <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4 }}>{label}</span>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1 }}>{children}</span>
    </div>
  );
}

function ApproveWithdrawalModal({ open, wd, onClose, onConfirm }: {
  open: boolean; wd: WdRow | null; onClose: () => void; onConfirm: () => void;
}) {
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open || !wd) return null;

  const fullName = SELLER_FULL_NAMES[wd.seller] ?? wd.seller;
  const balanceBefore = SELLER_BALANCES[wd.seller] ?? 0;
  const amountNum = parseInt(wd.amount.replace(/\s/g, '')) || 0;
  const balanceAfter = balanceBefore - amountNum;

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
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <CheckCircle size={22} color={C.success} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Подтвердить вывод средств
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
          {/* Transaction card */}
          <div style={{
            background: '#F0FDF4',
            borderTop: `1px solid #BBF7D0`,
            borderRight: `1px solid #BBF7D0`,
            borderBottom: `1px solid #BBF7D0`,
            borderLeft: `3px solid ${C.success}`,
            borderRadius: '8px', padding: '16px',
          }}>
            <KV label="Продавец">{fullName}</KV>
            <KV label="Сумма">
              <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: C.text1 }}>
                {wd.amount} UZS
              </span>
            </KV>
            <KV label="Метод">{wd.method}</KV>
            <KV label="Реквизиты">
              <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text2 }}>{wd.details}</span>
            </KV>
            <KV label="Баланс">
              <span>
                <span style={{ fontFamily: F.mono, color: C.text3 }}>{fmtUzs(balanceBefore)}</span>
                <span style={{ margin: '0 6px', color: C.text4 }}>→</span>
                <span style={{ fontFamily: F.mono, fontWeight: 600, color: C.text1 }}>{fmtUzs(balanceAfter)}</span>
                <span style={{ color: C.text4, marginLeft: '4px' }}>UZS</span>
              </span>
            </KV>
            <KV label="Запрошено">
              <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text2 }}>
                {wd.date.replace(' ', ', ')}
              </span>
            </KV>
          </div>

          <div style={{
            fontFamily: F.inter, fontSize: '12px', color: C.text3, lineHeight: 1.5,
          }}>
            Средства будут переведены на карту продавца через UCOIN.
          </div>
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
            aria-label="Подтвердить вывод"
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
            <CheckCircle size={14} strokeWidth={2} />
            Подтвердить вывод
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REJECT WITHDRAWAL MODAL
═══════════════════════════════════════════════════════════════════════════ */

const REJECT_REASONS = [
  'Недостаточно средств на счёте организации',
  'Неверные реквизиты',
  'Подозрительная операция',
  'Запрос организации',
  'Другое',
];

function RejectWithdrawalModal({ open, wd, onClose, onConfirm }: {
  open: boolean; wd: WdRow | null; onClose: () => void; onConfirm: () => void;
}) {
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [notify, setNotify] = useState(true);
  const [reasonFocus, setReasonFocus] = useState(false);
  const [commentFocus, setCommentFocus] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!open) { setReason(''); setComment(''); setNotify(true); return; }
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open || !wd) return null;

  const fullName = SELLER_FULL_NAMES[wd.seller] ?? wd.seller;
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
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <XCircle size={22} color={C.error} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Отклонить вывод средств
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
          {/* Transaction card */}
          <div style={{
            background: C.errorBg,
            borderTop: `1px solid #FECACA`,
            borderRight: `1px solid #FECACA`,
            borderBottom: `1px solid #FECACA`,
            borderLeft: `3px solid ${C.error}`,
            borderRadius: '8px', padding: '16px',
          }}>
            <div style={{
              fontFamily: F.inter, fontSize: '14px', fontWeight: 600,
              color: C.text1, marginBottom: '4px',
            }}>
              Продавец: {fullName}
            </div>
            <div style={{
              fontFamily: F.inter, fontSize: '13px', color: C.text2,
              marginBottom: '4px',
            }}>
              Сумма: <span style={{ fontFamily: F.mono, color: C.text1, fontWeight: 500 }}>{wd.amount} UZS</span>
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
              Запрошено: <span style={{ fontFamily: F.mono }}>{wd.date.replace(' ', ', ')}</span>
            </div>
          </div>

          {/* Reason select */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Причина отклонения<span style={{ color: C.error, marginLeft: '3px' }}>*</span>
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
                {REJECT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={14} color={C.text3} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
            </div>
          </div>

          {/* Comment textarea */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Комментарий (опционально)
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              onFocus={() => setCommentFocus(true)}
              onBlur={() => setCommentFocus(false)}
              placeholder="Дополнительная информация для продавца..."
              style={{
                width: '100%', minHeight: '72px', padding: '10px 12px',
                border: `1px solid ${commentFocus ? C.blue : C.inputBorder}`,
                borderRadius: '8px', background: C.surface,
                fontFamily: F.inter, fontSize: '13px', color: C.text1,
                outline: 'none', boxSizing: 'border-box', resize: 'vertical',
                boxShadow: commentFocus ? `0 0 0 3px ${C.blueTint}` : 'none',
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
            />
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
              Уведомить продавца о причине отклонения
            </span>
          </label>

          <div style={{
            fontFamily: F.inter, fontSize: '12px', color: C.text3, lineHeight: 1.5,
          }}>
            Средства будут возвращены на баланс кошелька продавца.
          </div>
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
            onClick={() => { if (canConfirm) onConfirm(); }}
            disabled={!canConfirm}
            aria-label="Отклонить вывод"
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
            <XCircle size={14} strokeWidth={2} />
            Отклонить вывод
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function OrgWithdrawalsPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-13' });

  const [search, setSearch] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);
  const [approveWd, setApproveWd] = useState<WdRow | null>(null);
  const [rejectWd, setRejectWd] = useState<WdRow | null>(null);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar role="org"
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
            <span onClick={() => navigate('/org-dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Выводы средств</span>
          </div>

          {/* Top Bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Выводы средств
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
                Запросы на вывод вознаграждений продавцами Mysafar OOO
              </p>
            </div>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* 3× Stat Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px', marginBottom: '24px',
          }}>
            <StatCard icon={ArrowDownToLine} variant="amber" label="Всего выведено" value="1 200 000" />
            <StatCard icon={Clock}           variant="blue"  label="В обработке"    value="85 000" subtitle="2 запроса" />
            <StatCard icon={CheckCircle}     variant="green" label="Баланс в кошельках" value="625 000" subtitle="6 продавцов" />
          </div>

          {/* Filter Bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '12px',
            alignItems: 'center', marginBottom: '24px',
          }}>
            <div style={{ position: 'relative', width: '340px', flexShrink: 0 }}>
              <Search size={16} color={searchFocused ? C.blue : C.text4} style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                placeholder="Поиск по продавцу или номеру транзакции..."
                style={{
                  width: '100%', height: '40px', paddingLeft: '38px', paddingRight: '12px',
                  border: `1px solid ${searchFocused ? C.blue : C.inputBorder}`,
                  borderRadius: '8px', background: C.surface,
                  fontFamily: F.inter, fontSize: '14px', color: C.text1,
                  outline: 'none', boxSizing: 'border-box',
                  boxShadow: searchFocused ? `0 0 0 3px ${C.blueTint}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              />
            </div>
            <FilterSelect label="Продавец: Все" options={SELLERS_LIST} value={sellerFilter} onChange={setSellerFilter} />
            <FilterSelect label="Статус: Все" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />

            {(search || sellerFilter || statusFilter) && (
              <button
                onClick={() => { setSearch(''); setSellerFilter(''); setStatusFilter(''); }}
                style={{
                  border: 'none', background: 'none',
                  fontFamily: F.inter, fontSize: '13px', color: C.text3,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '4px 8px', borderRadius: '6px',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = C.text1; e.currentTarget.style.background = '#F3F4F6'; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.text3; e.currentTarget.style.background = 'none'; }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1, marginTop: '-1px' }}>×</span>
                Сбросить
              </button>
            )}
          </div>

          {/* Data Table */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', overflowX: 'auto',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
              <thead>
                <tr style={{ background: '#FAFBFC', borderBottom: `1px solid ${C.border}` }}>
                  <th style={hCell}>#</th>
                  <th style={hCell}>Дата</th>
                  <th style={hCell}>Продавец</th>
                  <th style={hCell}>Сумма</th>
                  <th style={hCell}>Метод</th>
                  <th style={hCell}>Реквизиты</th>
                  <th style={hCell}>UCOIN TX</th>
                  <th style={hCell}>Статус</th>
                  <th style={hCell}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {WITHDRAWALS.map((wd, i) => {
                  const hov = hovRow === i;
                  const isPending = wd.status === 'В обработке';
                  return (
                    <tr key={wd.id}
                      onMouseEnter={() => setHovRow(i)}
                      onMouseLeave={() => setHovRow(null)}
                      style={{
                        borderBottom: i < WITHDRAWALS.length - 1 ? `1px solid ${C.border}` : 'none',
                        background: hov ? '#FAFBFC' : C.surface,
                        borderLeft: isPending ? `3px solid ${C.warning}` : '3px solid transparent',
                        transition: 'background 0.1s',
                      }}
                    >
                      <td style={dCell}>
                        <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>{wd.id}</span>
                      </td>
                      <td style={dCell}>
                        <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>{wd.date}</span>
                      </td>
                      <td style={dCell}>
                        <AvatarCell name={wd.seller} />
                      </td>
                      <td style={dCell}>
                        <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: C.text1 }}>
                          {wd.amount}
                        </span>
                      </td>
                      <td style={dCell}>
                        <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>{wd.method}</span>
                      </td>
                      <td style={dCell}>
                        <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text3 }}>{wd.details}</span>
                      </td>
                      <td style={dCell}>
                        <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text4 }}>{wd.ucoinTx}</span>
                      </td>
                      <td style={dCell}>
                        <StatusBadge status={wd.status} />
                      </td>
                      <td style={dCell}>
                        <ActionDropdown
                          status={wd.status}
                          onAction={action => {
                            if (action === 'approve') setApproveWd(wd);
                            else if (action === 'reject') setRejectWd(wd);
                            else console.log(action, wd.id);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{
            marginTop: '16px', fontFamily: F.inter, fontSize: '13px',
            color: C.text3, textAlign: 'center',
          }}>
            Показано 1–8 из 8
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      <ApproveWithdrawalModal
        open={!!approveWd}
        wd={approveWd}
        onClose={() => setApproveWd(null)}
        onConfirm={() => setApproveWd(null)}
      />

      <RejectWithdrawalModal
        open={!!rejectWd}
        wd={rejectWd}
        onClose={() => setRejectWd(null)}
        onConfirm={() => setRejectWd(null)}
      />
    </div>
  );
}
