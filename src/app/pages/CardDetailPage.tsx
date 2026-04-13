import React, { useState, useRef, useEffect } from 'react';
import {
  X, ArrowDownLeft, ArrowUpRight, Wallet, Check, Clock, ChevronRight,
  Moon, Sun, LogOut, ChevronDown,
} from 'lucide-react';
import { BankAdminSidebar } from '../components/BankAdminSidebar';
import { F, C } from '../components/ds/tokens';
import { useNavigate } from 'react-router';

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR USER SECTION
═══════════════════════════════════════════════════════════════════════════ */

function NavbarUserSection({ darkMode, onDarkModeToggle }: { darkMode: boolean; onDarkModeToggle: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeHov, setThemeHov] = useState(false);
  const [logoutHov, setLogoutHov] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <button
        onClick={onDarkModeToggle}
        onMouseEnter={() => setThemeHov(true)}
        onMouseLeave={() => setThemeHov(false)}
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

      <div style={{ width: '1px', height: '24px', background: C.border, margin: '0 6px', flexShrink: 0 }} />

      <div ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '5px 10px 5px 6px',
            border: `1px solid ${menuOpen ? C.blue : C.border}`,
            borderRadius: '10px',
            background: menuOpen ? C.blueLt : C.surface,
            cursor: 'pointer', transition: 'all 0.12s',
            boxShadow: menuOpen ? `0 0 0 3px ${C.blueTint}` : 'none',
          }}
        >
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: C.blueTint, border: `1.5px solid ${C.blue}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 700, color: C.blue }}>АК</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text1, whiteSpace: 'nowrap', lineHeight: 1.3 }}>
              Админ Камолов
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4, lineHeight: '16px', whiteSpace: 'nowrap' }}>
              Bank Admin
            </div>
          </div>
          <ChevronDown size={14} color={C.text4} strokeWidth={1.75}
            style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s', flexShrink: 0 }}
          />
        </button>

        {menuOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '10px', padding: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.09)', zIndex: 60, minWidth: '180px',
          }}>
            <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
            <button
              onMouseEnter={() => setLogoutHov(true)}
              onMouseLeave={() => setLogoutHov(false)}
              style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px',
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
  );
}

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
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function CardDetailPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [closeHover, setCloseHover] = useState(false);
  const navigate = useNavigate();

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
      <BankAdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: C.surface, borderBottom: `1px solid ${C.border}`,
          height: '60px', display: 'flex', alignItems: 'center',
          padding: '0 32px', flexShrink: 0,
        }}>
          <div style={{ flex: 1 }} />
          <NavbarUserSection darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />
        </div>

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span
              onClick={() => navigate('/all-cards')}
              style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}
            >
              Все карты
            </span>
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

              <button
                onMouseEnter={() => setCloseHover(true)}
                onMouseLeave={() => setCloseHover(false)}
                onClick={() => navigate('/all-cards')}
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
    </div>
  );
}
