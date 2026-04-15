import React, { useState, useRef, useEffect } from 'react';
import { usePopoverPosition } from '../components/usePopoverPosition';
import {
  ChevronRight, ChevronDown, Pencil, Download, MoreVertical,
  CreditCard, ShoppingBag, UserCheck, ArrowUpDown, CheckCircle,
  Search, Check, Archive, Copy, Trash2, X, AlertTriangle,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useNavigate, useParams } from 'react-router';

/* ═══════════════════════════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════════════════════════ */

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
      color: C.text4, textTransform: 'uppercase', letterSpacing: '0.07em',
      marginBottom: '12px',
    }}>
      {text}
    </div>
  );
}

function BadgeSuccess({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: C.successBg, color: '#15803D', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.success, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function BadgeOutline({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '2px 8px', borderRadius: '8px',
      border: `1px solid ${C.border}`, background: C.surface,
      color: C.text2, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTONS
═══════════════════════════════════════════════════════════════════════════ */

function OutlineButton({
  icon: Icon, children, onClick,
}: { icon?: React.ElementType; children: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '36px', padding: '0 14px',
        border: `1px solid ${C.border}`, borderRadius: '8px',
        background: hov ? '#F9FAFB' : C.surface,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: C.text1,
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        cursor: 'pointer', transition: 'background 0.12s',
        flexShrink: 0,
      }}
    >
      {Icon && <Icon size={14} strokeWidth={1.75} />}
      {children}
    </button>
  );
}

function GhostButton({
  icon: Icon, children, onClick,
}: { icon?: React.ElementType; children: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '36px', padding: '0 14px',
        border: 'none', borderRadius: '8px',
        background: hov ? C.blueLt : 'transparent',
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: C.blue,
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        cursor: 'pointer', transition: 'background 0.12s',
      }}
    >
      {Icon && <Icon size={14} strokeWidth={1.75} />}
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION DROPDOWN
═══════════════════════════════════════════════════════════════════════════ */

function ActionDropdown({ onArchive, onDuplicate, onDelete }: {
  onArchive: () => void; onDuplicate: () => void; onDelete: () => void;
}) {
  const pop = usePopoverPosition();
  const [hov, setHov] = useState(false);

  return (
    <div ref={pop.rootRef} style={{ position: 'relative' }}>
      <button
        ref={pop.triggerRef as React.RefObject<HTMLButtonElement>}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={pop.toggle}
        style={{
          width: '36px', height: '36px',
          border: `1px solid ${pop.open ? C.blue : C.border}`,
          borderRadius: '8px',
          background: pop.open ? C.blueLt : hov ? '#F9FAFB' : C.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
        }}
      >
        <MoreVertical size={15} color={pop.open ? C.blue : C.text2} strokeWidth={1.75} />
      </button>

      {pop.open && (
        <div ref={pop.menuRef} style={{
          ...pop.menuStyle,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '10px', padding: '6px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
          minWidth: '180px',
        }}>
          <MenuItem icon={Archive} label="Архивировать" onClick={() => { pop.close(); onArchive(); }} />
          <MenuItem icon={Copy}    label="Дублировать"  onClick={() => { pop.close(); onDuplicate(); }} />
          <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
          <MenuItem icon={Trash2}  label="Удалить"      danger onClick={() => { pop.close(); onDelete(); }} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARCHIVE CONFIRMATION MODAL
═══════════════════════════════════════════════════════════════════════════ */

function ArchiveModal({ open, onClose, onConfirm }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
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

  if (!open) return null;

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
          padding: '18px 20px',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <Archive size={24} color={C.text3} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Архивировать партию
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
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
          <p style={{
            margin: 0, fontFamily: F.inter, fontSize: '14px',
            color: C.text1, lineHeight: 1.5,
          }}>
            Вы уверены, что хотите архивировать эту партию?
          </p>

          {/* Info card */}
          <div style={{
            background: '#F9FAFB',
            borderTop: `1px solid ${C.border}`,
            borderRight: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.blue}`,
            borderRadius: '8px', padding: '12px',
          }}>
            <div style={{
              fontFamily: F.inter, fontSize: '14px', fontWeight: 600,
              color: C.text1, marginBottom: '4px',
            }}>
              Партия Апрель 2026 — Mysafar OOO
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
              <span style={{ fontFamily: F.mono, color: C.text2 }}>498</span> карт
              {' | '}
              <span style={{ fontFamily: F.mono, color: C.text2 }}>230</span> продано
              {' | '}
              <span style={{ fontFamily: F.mono, color: C.text2 }}>45</span> KPI 3 выполнено
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '13px', color: C.text3,
              marginBottom: '8px',
            }}>
              После архивирования:
            </div>
            <ul style={{
              margin: 0, padding: 0, listStyle: 'none',
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              {[
                'Партия будет скрыта из основных списков',
                'Данные сохранятся и будут доступны в разделе "Архив"',
                'Продавцы не смогут фиксировать новые продажи по этой партии',
              ].map((txt, i) => (
                <li key={i} style={{
                  display: 'flex', gap: '8px',
                  fontFamily: F.inter, fontSize: '12px', color: C.text2, lineHeight: 1.5,
                }}>
                  <span style={{ color: C.text4, flexShrink: 0 }}>•</span>
                  <span>{txt}</span>
                </li>
              ))}
            </ul>
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
            <Archive size={14} strokeWidth={2} />
            Архивировать
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DELETE CONFIRMATION MODAL (destructive)
═══════════════════════════════════════════════════════════════════════════ */

function DeleteModal({ open, onClose, onConfirm }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
}) {
  const [confirmText, setConfirmText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  const isValid = confirmText === 'DELETE';

  useEffect(() => {
    if (!open) { setConfirmText(''); return; }
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

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
          padding: '18px 20px',
          borderBottom: `1px solid ${C.border}`,
        }}>
          <AlertTriangle size={24} color={C.error} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.error,
          }}>
            Удалить партию
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
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
          <p style={{
            margin: 0, fontFamily: F.inter, fontSize: '14px',
            color: C.text1, lineHeight: 1.5,
          }}>
            Это действие нельзя отменить. Все данные партии будут безвозвратно удалены.
          </p>

          {/* Warning card */}
          <div style={{
            background: C.errorBg,
            borderTop: `1px solid #FECACA`,
            borderRight: `1px solid #FECACA`,
            borderBottom: `1px solid #FECACA`,
            borderLeft: `3px solid ${C.error}`,
            borderRadius: '8px', padding: '12px',
          }}>
            <div style={{
              fontFamily: F.inter, fontSize: '14px', fontWeight: 600,
              color: C.text1, marginBottom: '4px',
            }}>
              Партия Тест — CardPlus
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
              <span style={{ fontFamily: F.mono, color: C.text2 }}>50</span> карт
              {' | '}
              <span style={{ fontFamily: F.mono, color: C.text2 }}>0</span> продано
              {' | '}
              <span style={{ fontFamily: F.mono, color: C.text2 }}>0</span> KPI выполнено
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.error, marginBottom: '8px',
            }}>
              Будут удалены:
            </div>
            <ul style={{
              margin: 0, padding: 0, listStyle: 'none',
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              {[
                'Все карты этой партии (50)',
                'KPI конфигурации',
                'История событий',
              ].map((txt, i) => (
                <li key={i} style={{
                  display: 'flex', gap: '8px',
                  fontFamily: F.inter, fontSize: '12px', color: C.text2, lineHeight: 1.5,
                }}>
                  <span style={{ color: C.text4, flexShrink: 0 }}>•</span>
                  <span>{txt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{
            fontFamily: F.inter, fontSize: '11px', color: C.text4, lineHeight: 1.4,
          }}>
            Удаление возможно только для партий без продаж
          </div>

          {/* Confirm input */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Введите <span style={{ fontFamily: F.mono, color: C.error, fontWeight: 600 }}>DELETE</span> для подтверждения
            </label>
            <input
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="DELETE"
              style={{
                width: '100%', height: '40px', padding: '0 12px',
                border: `1px solid ${inputFocused ? C.error : C.inputBorder}`,
                borderRadius: '8px', background: C.surface,
                fontFamily: F.mono, fontSize: '14px', color: C.text1,
                outline: 'none', boxSizing: 'border-box',
                boxShadow: inputFocused ? `0 0 0 3px rgba(239,68,68,0.14)` : 'none',
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
            />
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
            onClick={() => { if (isValid) onConfirm(); }}
            disabled={!isValid}
            style={{
              height: '38px', padding: '0 18px',
              border: 'none', borderRadius: '8px',
              background: !isValid ? '#FCA5A5' : confirmHov ? '#DC2626' : C.error,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF',
              cursor: isValid ? 'pointer' : 'not-allowed',
              opacity: isValid ? 1 : 0.85,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: isValid && confirmHov ? '0 2px 8px rgba(239,68,68,0.32)' : isValid ? '0 1px 3px rgba(239,68,68,0.20)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <Trash2 size={14} strokeWidth={2} />
            Удалить навсегда
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, danger, onClick }: {
  icon: React.ElementType; label: string; danger?: boolean; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: '9px',
        padding: '8px 10px', borderRadius: '7px', border: 'none',
        background: hov ? (danger ? '#FEF2F2' : '#F9FAFB') : 'none',
        cursor: 'pointer',
        fontFamily: F.inter, fontSize: '13px',
        color: hov ? (danger ? '#DC2626' : C.text1) : (danger ? C.text3 : C.text2),
        transition: 'all 0.1s',
      }}
    >
      <Icon size={14} strokeWidth={1.75} />
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DUPLICATE BATCH MODAL
═══════════════════════════════════════════════════════════════════════════ */

const DUP_ORGS = ['Mysafar OOO', 'Unired Marketing', 'Express Finance', 'Digital Pay', 'SmartCard Group', 'CardPlus'];

function DuplicateBatchModal({ open, onClose, onConfirm }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
}) {
  const [name, setName] = useState('');
  const [org, setOrg] = useState('Mysafar OOO');
  const [nameFocus, setNameFocus] = useState(false);
  const [orgFocus, setOrgFocus] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!open) { setName(''); setOrg('Mysafar OOO'); return; }
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const canConfirm = name.trim().length > 0;

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
          <Copy size={22} color={C.blue} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Дублировать партию
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
          {/* Source batch card */}
          <div style={{
            background: '#F9FAFB', borderRadius: '8px', padding: '12px',
          }}>
            <div style={{
              fontFamily: F.inter, fontSize: '14px', fontWeight: 600,
              color: C.text1, marginBottom: '4px',
            }}>
              Партия Апрель 2026 — Mysafar OOO
            </div>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: C.text3,
            }}>
              VISA SUM{' | '}
              <span style={{ fontFamily: F.mono, color: C.text2 }}>498</span> карт{' | '}
              <span style={{ fontFamily: F.mono, color: C.text2 }}>3</span> KPI этапа{' | '}
              Срок <span style={{ fontFamily: F.mono, color: C.text2 }}>30</span> дней
            </div>
          </div>

          {/* Outcome list */}
          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '13px', color: C.text2,
              marginBottom: '8px',
            }}>
              Будет создана новая партия с:
            </div>
            <ul style={{
              margin: 0, padding: 0, listStyle: 'none',
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              {[
                'Такой же KPI конфигурацией (3 этапа)',
                'Без карт (потребуется новый импорт)',
                'Новое название',
              ].map((txt, i) => (
                <li key={i} style={{
                  display: 'flex', gap: '8px',
                  fontFamily: F.inter, fontSize: '12px', color: C.text2, lineHeight: 1.5,
                }}>
                  <span style={{ color: C.text4, flexShrink: 0 }}>•</span>
                  <span>{txt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Name input */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Название новой партии<span style={{ color: C.error, marginLeft: '3px' }}>*</span>
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
              placeholder="Партия Май 2026"
              style={{
                width: '100%', height: '40px', padding: '0 12px',
                border: `1px solid ${nameFocus ? C.blue : C.inputBorder}`,
                borderRadius: '8px', background: C.surface,
                fontFamily: F.inter, fontSize: '14px', color: C.text1,
                outline: 'none', boxSizing: 'border-box',
                boxShadow: nameFocus ? `0 0 0 3px ${C.blueTint}` : 'none',
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
            />
          </div>

          {/* Org select */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Организация
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
                  fontFamily: F.inter, fontSize: '13px', color: C.text1,
                  outline: 'none', appearance: 'none', cursor: 'pointer',
                  boxShadow: orgFocus ? `0 0 0 3px ${C.blueTint}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              >
                {DUP_ORGS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} color={C.text3} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
            </div>
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
            aria-label="Создать копию"
            style={{
              height: '38px', padding: '0 18px',
              border: 'none', borderRadius: '8px',
              background: !canConfirm ? '#93C5FD' : confirmHov ? C.blueHover : C.blue,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              opacity: canConfirm ? 1 : 0.85,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: canConfirm && confirmHov ? '0 2px 8px rgba(37,99,235,0.28)' : canConfirm ? '0 1px 3px rgba(37,99,235,0.16)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <Copy size={14} strokeWidth={2} />
            Создать копию
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD (Row 2)
═══════════════════════════════════════════════════════════════════════════ */

const STAT_VARIANTS = {
  blue:  { color: C.blue,    bg: C.blueLt,  border: C.blueTint },
  green: { color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' },
  cyan:  { color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
  amber: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  rose:  { color: '#E11D48', bg: '#FFF1F2', border: '#FECDD3' },
} as const;

function StatCard({ icon: Icon, variant, label, value }: {
  icon: React.ElementType;
  variant: keyof typeof STAT_VARIANTS;
  label: string;
  value: string;
}) {
  const v = STAT_VARIANTS[variant];
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '18px',
      display: 'flex', flexDirection: 'column', gap: '14px',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '9px',
        background: v.bg, border: `1px solid ${v.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={v.color} strokeWidth={1.75} />
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3, marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, lineHeight: 1.15 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INFO STRIP
═══════════════════════════════════════════════════════════════════════════ */

function InfoStrip() {
  const items: [string, React.ReactNode][] = [
    ['Тип карт', <BadgeOutline>VISA SUM</BadgeOutline>],
    ['Создана', <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text1 }}>01.04.2026</span>],
    ['Срок KPI', <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1 }}>30 дней</span>],
    ['Карт', <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text1 }}>500</span>],
    ['Импортировано', <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text1 }}>498</span>],
    ['Продано', <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text1 }}>230</span>],
  ];
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '16px',
      display: 'flex', alignItems: 'center', gap: '20px',
      flexWrap: 'wrap',
      marginBottom: '20px',
    }}>
      {items.map(([label, val], i) => (
        <React.Fragment key={label}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4 }}>{label}</span>
            {val}
          </div>
          {i < items.length - 1 && (
            <div style={{ width: '1px', height: '20px', background: C.border }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════════════════════════════ */

type TabKey = 'cards' | 'kpi' | 'sellers' | 'finance' | 'history';

function Tabs({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'cards', label: 'Карты' },
    { key: 'kpi', label: 'KPI конфигурация' },
    { key: 'sellers', label: 'Продавцы' },
    { key: 'finance', label: 'Финансы' },
    { key: 'history', label: 'История' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0',
      borderBottom: `1px solid ${C.border}`, marginBottom: '24px',
    }}>
      {tabs.map(t => {
        const isActive = active === t.key;
        return (
          <TabButton key={t.key} active={isActive} onClick={() => onChange(t.key)} label={t.label} />
        );
      })}
    </div>
  );
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: 'none', border: 'none',
        padding: '12px 16px',
        fontFamily: F.inter, fontSize: '14px',
        fontWeight: active ? 600 : 500,
        color: active ? C.blue : hov ? C.text1 : C.text3,
        borderBottom: `2px solid ${active ? C.blue : 'transparent'}`,
        marginBottom: '-1px',
        cursor: 'pointer', transition: 'color 0.12s',
      }}
    >
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI CHECK CELL
═══════════════════════════════════════════════════════════════════════════ */

function KpiCheck({ done }: { done: boolean | null }) {
  if (done === true) return (
    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: C.success, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <Check size={10} color="#fff" strokeWidth={3} />
    </div>
  );
  if (done === false) return <span style={{ color: C.textDisabled, fontSize: '14px' }}>—</span>;
  return <span style={{ color: C.textDisabled, fontSize: '14px' }}>—</span>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: КАРТЫ
═══════════════════════════════════════════════════════════════════════════ */

interface BatchCardRow {
  id: number;
  cardNumber: string;
  seller: string;
  client: string;
  phone: string;
  status: 'Активна' | 'Зарег.' | 'У продавца' | 'На складе' | 'Продана';
  kpi1: boolean | null;
  kpi2: boolean | null;
  kpi3: boolean | null;
  topup: string;
  spent: string;
}

const BATCH_CARDS: BatchCardRow[] = [
  { id: 1,  cardNumber: '8600 1234 5678 1001', seller: 'Абдуллох',  client: 'Алишер Н.',  phone: '+998 90 111 22 01', status: 'Активна',    kpi1: true,  kpi2: true,  kpi3: true,  topup: '800 000',   spent: '520 000' },
  { id: 2,  cardNumber: '8600 1234 5678 1002', seller: 'Абдуллох',  client: 'Дилшод К.',  phone: '+998 90 111 22 02', status: 'Зарег.',     kpi1: true,  kpi2: true,  kpi3: false, topup: '500 000',   spent: '320 000' },
  { id: 3,  cardNumber: '8600 1234 5678 1003', seller: 'Абдуллох',  client: '—',          phone: '—',                 status: 'У продавца', kpi1: null,  kpi2: null,  kpi3: null,  topup: '—',         spent: '—' },
  { id: 4,  cardNumber: '8600 1234 5678 1004', seller: 'Санжар',    client: 'Камол Т.',   phone: '+998 90 111 22 04', status: 'Активна',    kpi1: true,  kpi2: true,  kpi3: true,  topup: '1 200 000', spent: '680 000' },
  { id: 5,  cardNumber: '8600 1234 5678 1005', seller: 'Санжар',    client: 'Лола К.',    phone: '+998 90 111 22 05', status: 'Активна',    kpi1: true,  kpi2: true,  kpi3: false, topup: '620 000',   spent: '410 000' },
  { id: 6,  cardNumber: '8600 1234 5678 1006', seller: 'Нилуфар',   client: 'Дилноза А.', phone: '+998 90 111 22 06', status: 'Зарег.',     kpi1: true,  kpi2: false, kpi3: false, topup: '—',         spent: '—' },
  { id: 7,  cardNumber: '8600 1234 5678 1007', seller: 'Камола',    client: 'Шахзод Р.',  phone: '+998 90 111 22 07', status: 'Активна',    kpi1: true,  kpi2: true,  kpi3: false, topup: '700 000',   spent: '410 000' },
  { id: 8,  cardNumber: '8600 1234 5678 1008', seller: '—',         client: '—',          phone: '—',                 status: 'На складе',  kpi1: null,  kpi2: null,  kpi3: null,  topup: '—',         spent: '—' },
  { id: 9,  cardNumber: '8600 1234 5678 1009', seller: 'Ислом',     client: 'Фарход М.',  phone: '+998 90 111 22 09', status: 'Продана',    kpi1: true,  kpi2: false, kpi3: false, topup: '50 000',    spent: '—' },
  { id: 10, cardNumber: '8600 1234 5678 1010', seller: 'Ислом',     client: 'Ислом С.',   phone: '+998 90 111 22 10', status: 'Активна',    kpi1: true,  kpi2: true,  kpi3: true,  topup: '600 000',   spent: '545 000' },
];

const STATUS_CFG: Record<BatchCardRow['status'], { bg: string; color: string; dot: string }> = {
  'Активна':    { bg: C.successBg,  color: '#15803D', dot: C.success },
  'Зарег.':     { bg: C.infoBg,     color: '#0E7490', dot: C.info },
  'У продавца': { bg: C.blueLt,     color: C.blue,    dot: C.blue },
  'На складе':  { bg: '#F3F4F6',    color: C.text2,   dot: C.text3 },
  'Продана':    { bg: C.warningBg,  color: '#B45309', dot: C.warning },
};

function StatusBadge({ status }: { status: BatchCardRow['status'] }) {
  const s = STATUS_CFG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '2px 9px', borderRadius: '10px',
      background: s.bg, color: s.color, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.dot }} />
      {status}
    </span>
  );
}

function FilterSelect({ label, options, value, onChange, minWidth }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; minWidth?: string;
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
          height: '38px', padding: '0 34px 0 12px',
          border: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderRadius: '8px', background: C.surface,
          fontFamily: F.inter, fontSize: '13px', color: C.text2,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          minWidth: minWidth ?? '150px',
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

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      padding: '7px 14px',
      background: '#F3F4F6', border: `1px solid ${C.border}`,
      borderRadius: '999px',
      fontFamily: F.inter, fontSize: '12px', color: C.text3,
    }}>
      <span>{label}:</span>
      <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 600, color: C.text1 }}>{value}</span>
    </div>
  );
}

function TabCards() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [seller, setSeller] = useState('');
  const [kpi, setKpi] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [hovRow, setHovRow] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const filtered = BATCH_CARDS.filter(c => {
    const q = search.toLowerCase();
    const matchS = !q || c.cardNumber.toLowerCase().includes(q) || c.client.toLowerCase().includes(q) || c.seller.toLowerCase().includes(q);
    const matchStatus = !status || c.status === status;
    const matchSeller = !seller || c.seller === seller;
    return matchS && matchStatus && matchSeller;
  });

  return (
    <div>
      {/* Stat pills */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <StatPill label="На складе" value="138" />
        <StatPill label="У продавцов" value="130" />
        <StatPill label="Продано" value="230" />
        <StatPill label="Активных" value="185" />
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} color={searchFocused ? C.blue : C.text4} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Поиск по карте, клиенту, продавцу..."
            style={{
              width: '100%', height: '38px', paddingLeft: '36px', paddingRight: '12px',
              border: `1px solid ${searchFocused ? C.blue : C.inputBorder}`,
              borderRadius: '8px', background: C.surface,
              fontFamily: F.inter, fontSize: '13px', color: C.text1,
              outline: 'none', boxSizing: 'border-box',
              boxShadow: searchFocused ? `0 0 0 3px ${C.blueTint}` : 'none',
              transition: 'border-color 0.12s, box-shadow 0.12s',
            }}
          />
        </div>
        <FilterSelect label="Статус: Все" options={['Активна', 'Зарег.', 'У продавца', 'На складе', 'Продана']} value={status} onChange={setStatus} />
        <FilterSelect label="Продавец: Все" options={['Абдуллох', 'Санжар', 'Нилуфар', 'Камола', 'Ислом']} value={seller} onChange={setSeller} />
        <FilterSelect label="KPI: Все" options={['KPI 1 ✓', 'KPI 2 ✓', 'KPI 3 ✓']} value={kpi} onChange={setKpi} />
      </div>

      {/* Table */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: `1px solid ${C.border}` }}>
                {['Карта', 'Продавец', 'Клиент', 'Телефон', 'Статус', 'KPI 1', 'KPI 2', 'KPI 3', 'Пополнено', 'Расход'].map(h => (
                  <th key={h} style={{
                    padding: '11px 14px', textAlign: 'left',
                    fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                    color: C.text3, textTransform: 'uppercase', letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const hov = hovRow === c.id;
                return (
                  <tr
                    key={c.id}
                    onMouseEnter={() => setHovRow(c.id)}
                    onMouseLeave={() => setHovRow(null)}
                    onClick={() => navigate(`/card-detail/${c.id}`)}
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      background: hov ? '#F9FAFB' : C.surface,
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                  >
                    <td style={cellMono}>{c.cardNumber}</td>
                    <td style={cell}>{c.seller}</td>
                    <td style={cell}>{c.client}</td>
                    <td style={cellMono}>{c.phone}</td>
                    <td style={cell}><StatusBadge status={c.status} /></td>
                    <td style={cell}><KpiCheck done={c.kpi1} /></td>
                    <td style={cell}><KpiCheck done={c.kpi2} /></td>
                    <td style={cell}><KpiCheck done={c.kpi3} /></td>
                    <td style={cellMono}>{c.topup}</td>
                    <td style={cellMono}>{c.spent}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
            Показано <span style={{ fontFamily: F.mono, color: C.text1 }}>1–{Math.min(pageSize, filtered.length)}</span> из <span style={{ fontFamily: F.mono, color: C.text1 }}>498</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>Строк:</span>
            <PageSizeSelect value={pageSize} onChange={setPageSize} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1, 2, 3, 4, '...', Math.ceil(498 / pageSize)].map((p, i) => (
            <PageBtn key={i} active={p === 1}>{p}</PageBtn>
          ))}
        </div>
      </div>
    </div>
  );
}

const cell: React.CSSProperties = {
  padding: '12px 14px',
  fontFamily: F.inter, fontSize: '13px', color: C.text1,
  whiteSpace: 'nowrap',
};
const cellMono: React.CSSProperties = {
  padding: '12px 14px',
  fontFamily: F.mono, fontSize: '12px', color: C.text1,
  whiteSpace: 'nowrap',
};

function PageSizeSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: '32px', padding: '0 28px 0 10px',
          border: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderRadius: '7px', background: C.surface,
          fontFamily: F.inter, fontSize: '12px', fontWeight: 500, color: C.text1,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
        }}
      >
        {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <ChevronDown size={13} color={C.text3} style={{
        position: 'absolute', right: '8px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
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

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: KPI (read-only stepper)
═══════════════════════════════════════════════════════════════════════════ */

function TabKpi() {
  const navigate = useNavigate();
  const steps = [
    { n: 1, title: 'Регистрация в приложении', reward: '5 000 UZS', desc: 'Клиент регистрируется в мобильном приложении банка' },
    { n: 2, title: 'Пополнение карты на 100 000 UZS', reward: '5 000 UZS', desc: 'Клиент пополняет баланс карты минимум на 100 000 UZS' },
    { n: 3, title: 'Оплата 500 000 UZS', reward: '10 000 UZS', desc: 'Суммарные траты по карте достигают 500 000 UZS за период' },
  ];

  return (
    <div>
      <SectionLabel text="Текущая KPI конфигурация" />
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px',
        padding: '24px',
      }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.n}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: C.success,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Check size={18} color="#fff" strokeWidth={2.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingTop: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                  <div style={{ fontFamily: F.dm, fontSize: '15px', fontWeight: 600, color: C.text1 }}>
                    KPI {s.n}: {s.title}
                  </div>
                  <span style={{
                    fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: C.success,
                    background: C.successBg, padding: '4px 10px', borderRadius: '8px',
                    border: `1px solid #BBF7D0`, whiteSpace: 'nowrap',
                  }}>
                    {s.reward}
                  </span>
                </div>
                <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, lineHeight: 1.45 }}>
                  {s.desc}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                marginLeft: '17px', width: '2px', height: '28px',
                background: C.success, margin: '8px 0 8px 17px',
              }} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ marginTop: '16px' }}>
        <GhostButton icon={Pencil} onClick={() => navigate('/kpi-config')}>
          Редактировать KPI конфигурацию
        </GhostButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: ПРОДАВЦЫ
═══════════════════════════════════════════════════════════════════════════ */

const BATCH_SELLERS = [
  { name: 'Санжар М.',   assigned: 100, sold: 62, pct: 62, k1: 55, k2: 41, k3: 15, earned: '555 000' },
  { name: 'Абдуллох Р.', assigned: 100, sold: 45, pct: 45, k1: 38, k2: 22, k3: 8,  earned: '330 000' },
  { name: 'Нилуфар К.',  assigned: 100, sold: 33, pct: 33, k1: 28, k2: 18, k3: 5,  earned: '255 000' },
  { name: 'Камола Р.',   assigned: 100, sold: 50, pct: 50, k1: 42, k2: 26, k3: 10, earned: '410 000' },
  { name: 'Ислом Т.',    assigned: 98,  sold: 40, pct: 41, k1: 34, k2: 19, k3: 7,  earned: '275 000' },
];

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
}

function Avatar({ name }: { name: string }) {
  return (
    <div style={{
      width: '30px', height: '30px', borderRadius: '50%',
      background: C.blueLt, border: `1px solid ${C.blueTint}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: C.blue,
      flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  );
}

function ProgressCell({ pct }: { pct: number }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: '110px' }}>
      <div style={{ width: '60px', height: '5px', borderRadius: '3px', background: '#F3F4F6', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: C.blue }} />
      </div>
      <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 600, color: C.text1 }}>{pct}%</span>
    </div>
  );
}

function TabSellers() {
  const navigate = useNavigate();
  const [hovRow, setHovRow] = useState<string | null>(null);

  return (
    <div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: `1px solid ${C.border}` }}>
                {['Продавец', 'Карт назначено', 'Продано', '% продано', 'KPI 1', 'KPI 2', 'KPI 3', 'Заработано'].map(h => (
                  <th key={h} style={{
                    padding: '11px 14px', textAlign: 'left',
                    fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                    color: C.text3, textTransform: 'uppercase', letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BATCH_SELLERS.map(s => {
                const hov = hovRow === s.name;
                return (
                  <tr
                    key={s.name}
                    onMouseEnter={() => setHovRow(s.name)}
                    onMouseLeave={() => setHovRow(null)}
                    onClick={() => navigate('/sellers/1')}
                    style={{
                      borderBottom: `1px solid ${C.border}`,
                      background: hov ? '#F9FAFB' : C.surface,
                      cursor: 'pointer', transition: 'background 0.1s',
                    }}
                  >
                    <td style={cell}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar name={s.name} />
                        <span>{s.name}</span>
                      </div>
                    </td>
                    <td style={cellMono}>{s.assigned}</td>
                    <td style={cellMono}>{s.sold}</td>
                    <td style={cell}><ProgressCell pct={s.pct} /></td>
                    <td style={cellMono}>{s.k1}</td>
                    <td style={cellMono}>{s.k2}</td>
                    <td style={cellMono}>{s.k3}</td>
                    <td style={{ ...cellMono, fontWeight: 600 }}>{s.earned}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <GhostButton onClick={() => navigate('/card-assignment')}>
          Назначить карты продавцам →
        </GhostButton>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: ФИНАНСЫ
═══════════════════════════════════════════════════════════════════════════ */

function CompactFinanceCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '10px', padding: '14px 16px',
    }}>
      <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text3, marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 700, color }}>
        {value}
      </div>
    </div>
  );
}

const REWARD_LOG = [
  { date: '12.04.2026 14:23', seller: 'Санжар М.', card: '...1004', kpi: 'KPI 3', amount: '10 000', status: 'Выплачено' },
  { date: '12.04.2026 11:08', seller: 'Абдуллох Р.', card: '...1001', kpi: 'KPI 2', amount: '5 000', status: 'Выплачено' },
  { date: '11.04.2026 18:42', seller: 'Нилуфар К.', card: '...1010', kpi: 'KPI 1', amount: '5 000', status: 'Выплачено' },
  { date: '11.04.2026 09:15', seller: 'Камола Р.', card: '...1007', kpi: 'KPI 3', amount: '10 000', status: 'В ожидании' },
  { date: '10.04.2026 16:30', seller: 'Ислом Т.',  card: '...1005', kpi: 'KPI 2', amount: '5 000',  status: 'Выплачено' },
];

function TabFinance() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <CompactFinanceCard label="Начислено" value="1 825 000 UZS" color={C.text1} />
        <CompactFinanceCard label="Выведено"  value="1 200 000 UZS" color={C.success} />
        <CompactFinanceCard label="Баланс"    value="625 000 UZS"   color={C.blue} />
      </div>

      <SectionLabel text="Журнал начислений" />
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: `1px solid ${C.border}` }}>
                {['Дата', 'Продавец', 'Карта', 'KPI', 'Сумма', 'Статус'].map(h => (
                  <th key={h} style={{
                    padding: '11px 14px', textAlign: 'left',
                    fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                    color: C.text3, textTransform: 'uppercase', letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REWARD_LOG.map((r, i) => (
                <tr key={i} style={{ borderBottom: i < REWARD_LOG.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <td style={cellMono}>{r.date}</td>
                  <td style={cell}>{r.seller}</td>
                  <td style={cellMono}>{r.card}</td>
                  <td style={cell}>
                    <span style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '8px',
                      background: C.blueLt, color: C.blue,
                      border: `1px solid ${C.blueTint}`,
                    }}>
                      {r.kpi}
                    </span>
                  </td>
                  <td style={{ ...cellMono, fontWeight: 600 }}>{r.amount} UZS</td>
                  <td style={cell}>
                    {r.status === 'Выплачено' ? (
                      <BadgeSuccess>Выплачено</BadgeSuccess>
                    ) : (
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                        padding: '3px 10px', borderRadius: '10px',
                        background: C.warningBg, color: '#B45309',
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.warning }} />
                        {r.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: ИСТОРИЯ
═══════════════════════════════════════════════════════════════════════════ */

const HISTORY_ITEMS = [
  { dot: C.text4,  text: 'Партия создана',                                           time: '01.04.2026 10:00' },
  { dot: C.blue,   text: '498 карт импортированы',                                   time: '01.04.2026 10:05' },
  { dot: C.blue,   text: '100 карт назначены → Санжар М.',                           time: '01.04.2026 11:00' },
  { dot: C.blue,   text: '100 карт назначены → Абдуллох Р.',                         time: '01.04.2026 11:15' },
  { dot: C.blue,   text: '100 карт назначены → Нилуфар К.',                          time: '01.04.2026 11:30' },
  { dot: C.success,text: 'Первая продажа: карта ...1001 → Алишер Н.',                time: '02.04.2026 09:30' },
  { dot: C.warning,text: 'KPI конфигурация изменена',                                time: '03.04.2026 14:00' },
  { dot: C.success,text: 'KPI 1 выполнен: карта ...1001 → +5 000 UZS',               time: '03.04.2026 16:45' },
  { dot: C.success,text: 'KPI 2 выполнен: карта ...1001 → +5 000 UZS',               time: '05.04.2026 12:20' },
  { dot: C.success,text: 'KPI 3 выполнен: карта ...1001 → +10 000 UZS',              time: '10.04.2026 18:10' },
  { dot: C.blue,   text: '50 дополнительных карт назначены → Камола Р.',             time: '11.04.2026 09:00' },
  { dot: C.success,text: 'Партия достигла 46% продаж',                               time: '12.04.2026 15:30' },
];

function TabHistory() {
  return (
    <div>
      <SectionLabel text="История событий партии" />
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '12px', padding: '20px 24px',
      }}>
        {HISTORY_ITEMS.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.dot, marginTop: '4px' }} />
              {i < HISTORY_ITEMS.length - 1 && (
                <div style={{ width: '1px', flex: 1, background: C.border, minHeight: '20px', margin: '4px 0' }} />
              )}
            </div>
            <div style={{ paddingBottom: i < HISTORY_ITEMS.length - 1 ? '16px' : '0', minWidth: 0 }}>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1, lineHeight: 1.4 }}>
                {item.text}
              </div>
              <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.text4, marginTop: '3px' }}>
                {item.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function CardBatchDetailPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [tab, setTab] = useState<TabKey>('cards');
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <style>{`
        .cbd-sidebar { flex-shrink: 0; }
        @media (max-width: 768px) { .cbd-sidebar { display: none; } }
        .cbd-stats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        @media (max-width: 1280px) {
          .cbd-stats { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 720px) {
          .cbd-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="cbd-sidebar">
        <Sidebar
          role="bank"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(d => !d)}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/card-batches')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Партии карт</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Партия Апрель 2026 — Mysafar OOO</span>
          </div>

          {/* Header row */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
          }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Партия Апрель 2026
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <span
                  onClick={() => navigate('/organizations/1')}
                  style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}
                >
                  Mysafar OOO
                </span>
                <BadgeSuccess>Активна</BadgeSuccess>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <OutlineButton icon={Pencil}   onClick={() => navigate(`/card-batches/${id ?? 1}/edit`)}>Редактировать</OutlineButton>
              <OutlineButton icon={Download} onClick={() => { /* export */ }}>Экспорт</OutlineButton>
              <ActionDropdown
                onArchive={() => setArchiveOpen(true)}
                onDuplicate={() => setDuplicateOpen(true)}
                onDelete={() => setDeleteOpen(true)}
              />
            </div>
          </div>

          {/* Info strip */}
          <InfoStrip />

          {/* Stat cards */}
          <div className="cbd-stats" style={{ marginBottom: '28px' }}>
            <StatCard icon={CreditCard}  variant="blue"  label="Всего карт"         value="498" />
            <StatCard icon={ShoppingBag} variant="green" label="Продано"            value="230 (46.2%)" />
            <StatCard icon={UserCheck}   variant="cyan"  label="KPI 1 Регистрация"  value="185 (80.4%)" />
            <StatCard icon={ArrowUpDown} variant="amber" label="KPI 2 Пополнение"   value="120 (52.2%)" />
            <StatCard icon={CheckCircle} variant="rose"  label="KPI 3 Оплата 500K"  value="45 (19.6%)" />
          </div>

          {/* Tabs */}
          <Tabs active={tab} onChange={setTab} />

          {/* Tab content */}
          {tab === 'cards'   && <TabCards />}
          {tab === 'kpi'     && <TabKpi />}
          {tab === 'sellers' && <TabSellers />}
          {tab === 'finance' && <TabFinance />}
          {tab === 'history' && <TabHistory />}

          <div style={{ height: '48px' }} />
        </div>
      </div>

      <ArchiveModal
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        onConfirm={() => { setArchiveOpen(false); navigate('/card-batches'); }}
      />

      <DeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => { setDeleteOpen(false); navigate('/card-batches'); }}
      />

      <DuplicateBatchModal
        open={duplicateOpen}
        onClose={() => setDuplicateOpen(false)}
        onConfirm={() => { setDuplicateOpen(false); navigate('/card-batches'); }}
      />
    </div>
  );
}
