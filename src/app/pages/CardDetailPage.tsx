import React, { useState, useRef, useEffect } from 'react';
import {
  X, ArrowDownLeft, ArrowUpRight, Wallet, Check, Clock, ChevronRight,
  ShieldAlert, ChevronDown, AlertTriangle,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { useNavigate, useSearchParams } from 'react-router';
import { Navbar } from '../components/Navbar';

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

function BadgeOutline({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: F.inter,
      fontSize: '12px',
      fontWeight: 500,
      padding: '4px 12px',
      borderRadius: '8px',
      background: 'transparent',
      border: `1px solid ${C.border}`,
      color: C.text2,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function BadgeSuccess({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontFamily: F.inter,
      fontSize: '12px',
      fontWeight: 500,
      padding: '4px 12px',
      borderRadius: '10px',
      background: C.successBg,
      color: '#15803D',
      border: '1px solid #BBF7D0',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.success, flexShrink: 0 }} />
      {children}
    </span>
  );
}

function BadgeDefault({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: F.inter,
      fontSize: '12px',
      fontWeight: 500,
      padding: '4px 12px',
      borderRadius: '10px',
      background: '#F3F4F6',
      color: C.text2,
      border: `1px solid ${C.border}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI STEPPER VARIANT B (PROGRESS TRACKER)
═══════════════════════════════════════════════════════════════════════════ */

interface KPIStepData {
  num: number;
  status: 'completed' | 'in-progress' | 'pending';
  title: string;
  subtitle: string;
  date?: string;
  reward?: string;
  progress?: number;
  progressText?: string;
  remaining?: string;
}

function StepCircle({ num, status }: { num: number; status: string }) {
  if (status === 'completed') {
    return (
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: C.success,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        zIndex: 1,
      }}>
        <Check size={14} color="#FFFFFF" strokeWidth={3} />
      </div>
    );
  }

  if (status === 'in-progress') {
    return (
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: `2px solid ${C.blue}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        zIndex: 1,
        background: C.blueLt,
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: C.blue,
        }} />
      </div>
    );
  }

  return (
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: `2px solid ${C.inputBorder}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      zIndex: 1,
      background: C.surface,
    }}>
      <span style={{
        fontFamily: F.inter,
        fontSize: '13px',
        fontWeight: 600,
        color: C.inputBorder,
      }}>
        {num}
      </span>
    </div>
  );
}

function KPIProgressStep({ step, isLast }: { step: KPIStepData; isLast: boolean }) {
  const completed = step.status === 'completed';
  const inProgress = step.status === 'in-progress';
  const pending = step.status === 'pending';

  return (
    <div style={{ display: 'flex', gap: '0' }}>
      {/* Left: circle + line */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '32px',
        flexShrink: 0,
        marginRight: '16px',
      }}>
        <StepCircle num={step.num} status={step.status} />
        {!isLast && (
          <div style={{
            width: '2px',
            flex: 1,
            minHeight: '24px',
            marginTop: '4px',
            background: completed ? C.success : 'transparent',
            borderLeft: completed ? 'none' : `2px dashed ${C.inputBorder}`,
          }} />
        )}
      </div>

      {/* Right: content */}
      <div style={{ flex: 1, paddingBottom: isLast ? '0' : '24px' }}>
        <div style={{
          fontFamily: F.inter,
          fontSize: '14px',
          fontWeight: 600,
          color: inProgress ? C.blue : pending ? C.text4 : C.text1,
          marginBottom: '4px',
        }}>
          {step.title}
        </div>

        <div style={{
          fontFamily: F.inter,
          fontSize: '13px',
          color: C.text3,
          marginBottom: completed || inProgress ? '8px' : '0',
        }}>
          {step.subtitle}
        </div>

        {/* Completed state */}
        {completed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              fontFamily: F.inter,
              fontSize: '13px',
              color: C.success,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <Check size={12} strokeWidth={3} /> Выполнено
            </div>
            <div style={{
              fontFamily: F.inter,
              fontSize: '12px',
              color: C.text4,
            }}>
              {step.date}
            </div>
            {step.reward && (
              <div style={{
                fontFamily: F.inter,
                fontSize: '13px',
                color: C.success,
                marginTop: '4px',
              }}>
                💰 {step.reward}
              </div>
            )}
          </div>
        )}

        {/* In progress state */}
        {inProgress && step.progress !== undefined && (
          <div>
            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              background: '#E5E7EB',
              overflow: 'hidden',
              marginBottom: '6px',
            }}>
              <div style={{
                width: `${step.progress}%`,
                height: '100%',
                background: C.blue,
                borderRadius: '4px',
              }} />
            </div>

            {/* Progress text */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}>
              <span style={{
                fontFamily: F.mono,
                fontSize: '13px',
                color: C.text2,
              }}>
                {step.progressText}
              </span>
              <span style={{
                fontFamily: F.inter,
                fontSize: '13px',
                fontWeight: 600,
                color: C.blue,
              }}>
                {step.progress}%
              </span>
            </div>

            {step.remaining && (
              <div style={{
                fontFamily: F.inter,
                fontSize: '13px',
                color: C.text3,
                marginBottom: '8px',
              }}>
                {step.remaining}
              </div>
            )}

            {/* Status */}
            <div style={{
              fontFamily: F.inter,
              fontSize: '13px',
              color: C.warning,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '4px',
            }}>
              <Clock size={12} /> В процессе
            </div>

            {step.reward && (
              <div style={{
                fontFamily: F.inter,
                fontSize: '12px',
                color: C.text4,
              }}>
                {step.reward}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSACTION ROW
═══════════════════════════════════════════════════════════════════════════ */

function TransactionRow({ date, type, amount, merchant, isPositive }: {
  date: string;
  type: string;
  amount: string;
  merchant: string;
  isPositive: boolean;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter,
          fontSize: '13px',
          color: C.text2,
          marginBottom: '2px',
        }}>
          {date} • {type}
        </div>
        <div style={{
          fontFamily: F.inter,
          fontSize: '12px',
          color: C.text4,
        }}>
          {merchant}
        </div>
      </div>
      <div style={{
        fontFamily: F.mono,
        fontSize: '14px',
        fontWeight: 600,
        color: isPositive ? C.success : C.error,
        whiteSpace: 'nowrap',
        marginLeft: '16px',
      }}>
        {isPositive ? '+' : '−'}{amount}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BLOCK CARD MODAL
═══════════════════════════════════════════════════════════════════════════ */

const BLOCK_REASONS = [
  'Подозрительная активность',
  'Запрос клиента',
  'Утеря / кража',
  'Ошибка выдачи',
  'Другое',
];

function BadgeInfo({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: C.infoBg, color: '#0E7490', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.info }} />
      {children}
    </span>
  );
}

function BlockCardModal({ open, onClose, onConfirm }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
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

  if (!open) return null;

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
          <ShieldAlert size={22} color={C.error} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Заблокировать карту
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
          {/* Card info */}
          <div style={{
            background: C.errorBg,
            borderTop: `1px solid #FECACA`,
            borderRight: `1px solid #FECACA`,
            borderBottom: `1px solid #FECACA`,
            borderLeft: `3px solid ${C.error}`,
            borderRadius: '8px', padding: '12px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              flexWrap: 'wrap', marginBottom: '6px',
            }}>
              <span style={{
                fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: C.text1,
              }}>
                Карта •••• 1002
              </span>
              <BadgeInfo>Зарегистрирована</BadgeInfo>
            </div>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: C.text2,
              marginBottom: '3px', lineHeight: 1.5,
            }}>
              Клиент: <span style={{ color: C.text1, fontWeight: 500 }}>Дилшод К.</span>
              {' | '}
              Продавец: <span style={{ color: C.text1, fontWeight: 500 }}>Абдуллох Р.</span>
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text2 }}>
              Баланс: <span style={{ fontFamily: F.mono, color: C.text1, fontWeight: 500 }}>180 000 UZS</span>
            </div>
          </div>

          {/* Reason select */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Причина блокировки<span style={{ color: C.error, marginLeft: '3px' }}>*</span>
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

          {/* Comment textarea */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, marginBottom: '8px',
            }}>
              Комментарий
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              onFocus={() => setCommentFocus(true)}
              onBlur={() => setCommentFocus(false)}
              placeholder="Опишите причину блокировки..."
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
              Уведомить клиента по SMS
            </span>
          </label>

          {/* Warning */}
          <div style={{
            display: 'flex', gap: '8px',
            padding: '12px 14px',
            background: C.warningBg, border: `1px solid #FDE68A`,
            borderRadius: '8px',
          }}>
            <AlertTriangle size={15} color={C.warning} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                color: '#B45309', marginBottom: '6px',
              }}>
                При блокировке:
              </div>
              <ul style={{
                margin: 0, padding: 0, listStyle: 'none',
                display: 'flex', flexDirection: 'column', gap: '4px',
              }}>
                {[
                  'Все операции по карте будут приостановлены',
                  'Незавершённые KPI будут заморожены',
                  'Вознаграждения за незавершённые KPI не начисляются',
                ].map((txt, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: '6px',
                    fontFamily: F.inter, fontSize: '12px', color: '#B45309', lineHeight: 1.5,
                  }}>
                    <span style={{ flexShrink: 0 }}>•</span>
                    <span>{txt}</span>
                  </li>
                ))}
              </ul>
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
            aria-label="Заблокировать карту"
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
            Заблокировать карту
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function CardDetailPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [closeHover, setCloseHover] = useState(false);
  const [blockHov, setBlockHov] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOrg = searchParams.get('from') === 'org';

  const kpiSteps: KPIStepData[] = [
    {
      num: 1,
      status: 'completed',
      title: 'Регистрация в Unired Mobile',
      subtitle: 'Клиент зарегистрировал карту',
      date: '02.04.2026, 14:32',
      reward: 'Начислено: 5 000 UZS → Абдуллох',
    },
    {
      num: 2,
      status: 'completed',
      title: 'P2P пополнение карты',
      subtitle: 'Клиент получил P2P перевод',
      date: '03.04.2026, 09:15',
      reward: 'Начислено: 5 000 UZS → Абдуллох',
    },
    {
      num: 3,
      status: 'in-progress',
      title: 'Оплата в рознице — 500 000 UZS',
      subtitle: 'Клиент тратит по карте (POS + ECOM)',
      progress: 64,
      progressText: '320 000 / 500 000 UZS',
      remaining: 'Осталось: 180 000 UZS',
      reward: 'Вознаграждение: 10 000 UZS (после выполнения)',
    },
  ];

  const transactions = [
    { date: '12.04', type: 'POS оплата', amount: '45 000', merchant: 'Korzinka Go', isPositive: false },
    { date: '11.04', type: 'POS оплата', amount: '32 000', merchant: 'Shro', isPositive: false },
    { date: '10.04', type: 'ECOM', amount: '28 000', merchant: 'Uzum Market', isPositive: false },
    { date: '03.04', type: 'P2P приход', amount: '300 000', merchant: 'Перевод', isPositive: true },
    { date: '01.04', type: 'P2P приход', amount: '500 000', merchant: 'Перевод', isPositive: true },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar role={isOrg ? 'org' : 'bank'}
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
            <span onClick={() => navigate(isOrg ? '/org-dashboard' : '/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span onClick={() => navigate(isOrg ? '/org-cards' : '/all-cards')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>{isOrg ? 'Карты' : 'Все карты'}</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Карта •••• 1001</span>
          </div>

          {/* Card Container */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: '32px',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}>
              <div>
                <h1 style={{
                  fontFamily: F.dm,
                  fontSize: '22px',
                  fontWeight: 700,
                  color: C.text1,
                  margin: 0,
                  marginBottom: '12px',
                }}>
                  Карта •••• 1001
                </h1>

                {/* Badges */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <BadgeOutline>VISA SUM</BadgeOutline>
                  <BadgeSuccess>Активна</BadgeSuccess>
                  <BadgeDefault>Mysafar OOO</BadgeDefault>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onMouseEnter={() => setBlockHov(true)}
                  onMouseLeave={() => setBlockHov(false)}
                  onClick={() => setBlockOpen(true)}
                  aria-label="Заблокировать карту"
                  style={{
                    height: '36px', padding: '0 14px',
                    border: `1px solid ${blockHov ? C.error : C.border}`,
                    borderRadius: '8px',
                    background: blockHov ? C.errorBg : C.surface,
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: blockHov ? '#DC2626' : C.text3,
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                >
                  <ShieldAlert size={14} strokeWidth={1.75} />
                  Заблокировать
                </button>
                <button
                  onMouseEnter={() => setCloseHover(true)}
                  onMouseLeave={() => setCloseHover(false)}
                  onClick={() => navigate(isOrg ? '/org-cards' : '/all-cards')}
                  aria-label="Закрыть"
                  style={{
                    width: '36px',
                    height: '36px',
                    border: `1px solid ${closeHover ? C.error : C.border}`,
                    borderRadius: '8px',
                    background: closeHover ? C.errorBg : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                    flexShrink: 0,
                  }}
                >
                  <X size={18} color={closeHover ? C.error : C.text3} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Client & Seller Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '8px',
            }}>
              {/* Client */}
              <div>
                <div style={{
                  fontFamily: F.inter,
                  fontSize: '12px',
                  color: C.text4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '6px',
                }}>
                  Клиент
                </div>
                <div style={{
                  fontFamily: F.inter,
                  fontSize: '15px',
                  fontWeight: 600,
                  color: C.text1,
                  marginBottom: '4px',
                }}>
                  Алишер Набиев
                </div>
                <div style={{
                  fontFamily: F.inter,
                  fontSize: '13px',
                  color: C.text3,
                }}>
                  +998 90 123 45 67
                </div>
              </div>

              {/* Seller */}
              <div>
                <div style={{
                  fontFamily: F.inter,
                  fontSize: '12px',
                  color: C.text4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '6px',
                }}>
                  Продавец
                </div>
                <div style={{
                  fontFamily: F.inter,
                  fontSize: '15px',
                  fontWeight: 600,
                  color: C.text1,
                  marginBottom: '4px',
                }}>
                  Абдуллох Р.
                </div>
                <div style={{
                  fontFamily: F.inter,
                  fontSize: '13px',
                  color: C.text3,
                }}>
                  Mysafar OOO
                </div>
              </div>
            </div>

            <div style={{
              fontFamily: F.inter,
              fontSize: '12px',
              color: C.text4,
              marginBottom: '24px',
            }}>
              Продана: 01.04.2026
            </div>

            <div style={{ height: '1px', background: C.border, marginBottom: '24px' }} />

            {/* KPI Progress */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}>
                <div style={{
                  fontFamily: F.dm,
                  fontSize: '16px',
                  fontWeight: 600,
                  color: C.text1,
                }}>
                  KPI прогресс
                </div>
                <div style={{
                  fontFamily: F.inter,
                  fontSize: '13px',
                  color: C.warning,
                }}>
                  Срок: 30 дней (осталось 18)
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {kpiSteps.map((step, i) => (
                  <KPIProgressStep
                    key={step.num}
                    step={step}
                    isLast={i === kpiSteps.length - 1}
                  />
                ))}
              </div>
            </div>

            <div style={{ height: '1px', background: C.border, marginBottom: '24px' }} />

            {/* Financial Summary */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontFamily: F.dm,
                fontSize: '16px',
                fontWeight: 600,
                color: C.text1,
                marginBottom: '16px',
              }}>
                Финансы по карте
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Topup */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#FAFBFC',
                  borderRadius: '8px',
                  border: `1px solid ${C.border}`,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: C.successBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <ArrowDownLeft size={16} color={C.success} strokeWidth={2} />
                    </div>
                    <span style={{
                      fontFamily: F.inter,
                      fontSize: '14px',
                      color: C.text2,
                    }}>
                      Пополнено
                    </span>
                  </div>
                  <span style={{
                    fontFamily: F.mono,
                    fontSize: '16px',
                    fontWeight: 600,
                    color: C.text1,
                  }}>
                    800 000 UZS
                  </span>
                </div>

                {/* Spent */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#FAFBFC',
                  borderRadius: '8px',
                  border: `1px solid ${C.border}`,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: C.errorBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <ArrowUpRight size={16} color={C.error} strokeWidth={2} />
                    </div>
                    <span style={{
                      fontFamily: F.inter,
                      fontSize: '14px',
                      color: C.text2,
                    }}>
                      Потрачено
                    </span>
                  </div>
                  <span style={{
                    fontFamily: F.mono,
                    fontSize: '16px',
                    fontWeight: 600,
                    color: C.text1,
                  }}>
                    520 000 UZS
                  </span>
                </div>

                {/* Balance */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: '#FAFBFC',
                  borderRadius: '8px',
                  border: `1px solid ${C.border}`,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: C.blueLt,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Wallet size={16} color={C.blue} strokeWidth={2} />
                    </div>
                    <span style={{
                      fontFamily: F.inter,
                      fontSize: '14px',
                      color: C.text2,
                    }}>
                      Баланс
                    </span>
                  </div>
                  <span style={{
                    fontFamily: F.mono,
                    fontSize: '16px',
                    fontWeight: 600,
                    color: C.text1,
                  }}>
                    280 000 UZS
                  </span>
                </div>
              </div>
            </div>

            <div style={{ height: '1px', background: C.border, marginBottom: '24px' }} />

            {/* Transaction History */}
            <div>
              <div style={{
                fontFamily: F.inter,
                fontSize: '14px',
                fontWeight: 600,
                color: C.text1,
                marginBottom: '16px',
              }}>
                Последние операции
              </div>

              <div>
                {transactions.map((tx, idx) => (
                  <TransactionRow
                    key={idx}
                    date={tx.date}
                    type={tx.type}
                    amount={tx.amount}
                    merchant={tx.merchant}
                    isPositive={tx.isPositive}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      <BlockCardModal
        open={blockOpen}
        onClose={() => setBlockOpen(false)}
        onConfirm={() => setBlockOpen(false)}
      />
    </div>
  );
}
