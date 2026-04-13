import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, CreditCard, ShoppingBag, UserCheck,
  ArrowUpDown, Wallet, Calendar, Moon, Sun, LogOut, Check,
  ArrowRight, Circle, Dot,
} from 'lucide-react';
import { OrgAdminSidebar } from '../components/OrgAdminSidebar';
import { F, C } from '../components/ds/tokens';

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

interface Seller {
  rank: number;
  name: string;
  total: number;
  sold: number;
  kpi1: number;
  kpi2: number;
  kpi3: number;
  earned: string;
}

const SELLERS: Seller[] = [
  { rank: 1, name: 'Санжар М.', total: 100, sold: 62, kpi1: 55, kpi2: 41, kpi3: 15, earned: '555 000' },
  { rank: 2, name: 'Абдуллох Р.', total: 100, sold: 45, kpi1: 38, kpi2: 22, kpi3: 8, earned: '330 000' },
  { rank: 3, name: 'Ислом Т.', total: 80, sold: 42, kpi1: 35, kpi2: 20, kpi3: 10, earned: '350 000' },
  { rank: 4, name: 'Нилуфар К.', total: 100, sold: 33, kpi1: 28, kpi2: 18, kpi3: 5, earned: '255 000' },
  { rank: 5, name: 'Дарья Н.', total: 70, sold: 30, kpi1: 15, kpi2: 10, kpi3: 5, earned: '210 000' },
  { rank: 6, name: 'Камола Р.', total: 50, sold: 18, kpi1: 14, kpi2: 9, kpi3: 2, earned: '125 000' },
];

interface Activity {
  type: 'kpi' | 'withdrawal' | 'assignment';
  color: 'green' | 'blue' | 'amber' | 'gray';
  text: string;
  time: string;
}

const ACTIVITIES: Activity[] = [
  { type: 'kpi', color: 'green', text: 'Карта ...4521 — KPI 3 выполнен (Абдуллох)', time: 'сегодня, 14:32' },
  { type: 'kpi', color: 'blue', text: 'Карта ...3892 — KPI 2 выполнен (Санжар)', time: 'сегодня, 09:15' },
  { type: 'withdrawal', color: 'amber', text: 'Камола Р. — вывод 80 000 UZS', time: 'вчера, 18:00' },
  { type: 'kpi', color: 'green', text: 'Карта ...2204 — KPI 1 выполнен (Нилуфар)', time: 'вчера, 15:30' },
  { type: 'assignment', color: 'gray', text: '5 новых карт назначены Санжару', time: '11.04.2026' },
  { type: 'kpi', color: 'green', text: 'Карта ...1829 — KPI 3 выполнен (Ислом)', time: '11.04.2026' },
  { type: 'kpi', color: 'blue', text: 'Карта ...5103 — KPI 2 выполнен (Дарья)', time: '10.04.2026' },
  { type: 'withdrawal', color: 'amber', text: 'Абдуллох Р. — вывод 120 000 UZS', time: '10.04.2026' },
  { type: 'assignment', color: 'gray', text: '10 новых карт назначены Нилуфар', time: '09.04.2026' },
  { type: 'kpi', color: 'green', text: 'Карта ...6721 — KPI 1 выполнен (Санжар)', time: '09.04.2026' },
];

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
            <span style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 700, color: C.blue }}>МН</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text1, whiteSpace: 'nowrap', lineHeight: 1.3 }}>
              Мухаммад Н.
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4, lineHeight: '16px', whiteSpace: 'nowrap' }}>
              Org Admin
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
   DATE RANGE PICKER
═══════════════════════════════════════════════════════════════════════════ */

function DateRangePicker() {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: '40px',
          padding: '0 14px 0 12px',
          border: `1px solid ${focused ? C.blue : C.border}`,
          borderRadius: '8px',
          background: C.surface,
          fontFamily: F.inter,
          fontSize: '14px',
          color: C.text2,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
        }}
      >
        <Calendar size={16} color={C.text3} strokeWidth={1.75} />
        <span>01.04.2026 — 13.04.2026</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  subtitle,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  subtitle?: string;
  color: 'blue' | 'green' | 'cyan' | 'amber' | 'rose';
}) {
  const colorMap = {
    blue: { bg: C.blueLt, iconColor: C.blue },
    green: { bg: C.successBg, iconColor: C.success },
    cyan: { bg: '#ECFEFF', iconColor: '#0891B2' },
    amber: { bg: '#FFFBEB', iconColor: '#D97706' },
    rose: { bg: '#FFF1F2', iconColor: '#E11D48' },
  };

  const cfg = colorMap[color];

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: cfg.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={20} color={cfg.iconColor} strokeWidth={2} />
      </div>

      <div>
        <div style={{
          fontFamily: F.inter,
          fontSize: '13px',
          color: C.text3,
          marginBottom: '4px',
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: F.mono,
          fontSize: '22px',
          fontWeight: 700,
          color: C.text1,
          lineHeight: 1.2,
          marginBottom: subtitle ? '4px' : '0',
        }}>
          {value}
        </div>
        {subtitle && (
          <div style={{
            fontFamily: F.inter,
            fontSize: '12px',
            color: C.text3,
          }}>
            {subtitle}
          </div>
        )}
      </div>

      {trend && (
        <div style={{
          fontFamily: F.inter,
          fontSize: '12px',
          color: C.success,
        }}>
          {trend}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SELLER TABLE
═══════════════════════════════════════════════════════════════════════════ */

function SellerTable({ sellers }: { sellers: Seller[] }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div style={{
      border: `1px solid ${C.border}`,
      borderRadius: '8px',
      overflowX: 'auto',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '700px',
      }}>
        <thead>
          <tr style={{
            background: '#FAFBFC',
            borderBottom: `1px solid ${C.border}`,
          }}>
            <th style={headerCellStyle}>#</th>
            <th style={headerCellStyle}>Продавец</th>
            <th style={headerCellStyle}>Карт</th>
            <th style={headerCellStyle}>Продано</th>
            <th style={headerCellStyle}>KPI 1</th>
            <th style={headerCellStyle}>KPI 2</th>
            <th style={headerCellStyle}>KPI 3</th>
            <th style={headerCellStyle}>Заработано</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller, idx) => (
            <tr
              key={seller.rank}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                borderBottom: idx < sellers.length - 1 ? `1px solid ${C.border}` : 'none',
                background: seller.rank === 1 ? '#F0FDF4' : hoveredRow === idx ? '#FAFBFC' : C.surface,
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
            >
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>
                  {seller.rank}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{
                  fontFamily: F.inter,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: C.text1,
                }}>
                  {seller.name}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                  {seller.total}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: C.text1 }}>
                  {seller.sold}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                  {seller.kpi1}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                  {seller.kpi2}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                  {seller.kpi3}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{
                  fontFamily: F.mono,
                  fontSize: '13px',
                  fontWeight: 600,
                  color: C.text1,
                }}>
                  {seller.earned}
                </span>
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
  padding: '12px 16px',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

/* ═══════════════════════════════════════════════════════════════════════════
   KPI MINI STEPPER
═══════════════════════════════════════════════════════════════════════════ */

function KPIMiniStepper() {
  const steps = [
    { num: 1, label: 'Регистрация', progress: 80.4, count: '185/230', status: 'completed' },
    { num: 2, label: 'Пополнение', progress: 52.2, count: '120/230', status: 'in-progress' },
    { num: 3, label: 'Оплата 500K', progress: 19.6, count: '45/230', status: 'pending' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {steps.map((step, idx) => (
        <div key={step.num} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Circle */}
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: step.status === 'completed' ? C.success : step.status === 'in-progress' ? C.blueLt : '#F3F4F6',
            border: step.status === 'in-progress' ? `2px solid ${C.blue}` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {step.status === 'completed' ? (
              <Check size={12} color="#FFFFFF" strokeWidth={3} />
            ) : step.status === 'in-progress' ? (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.blue }} />
            ) : (
              <Circle size={12} color={C.text4} strokeWidth={2} />
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: step.status === 'pending' ? C.text4 : C.text1,
              marginBottom: '6px',
            }}>
              {step.label}
            </div>

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
                background: step.status === 'completed' ? C.success : step.status === 'in-progress' ? C.blue : '#D1D5DB',
                borderRadius: '4px',
              }} />
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                fontFamily: F.mono,
                fontSize: '12px',
                color: C.text2,
              }}>
                {step.count}
              </span>
              <span style={{
                fontFamily: F.inter,
                fontSize: '12px',
                fontWeight: 600,
                color: step.status === 'completed' ? C.success : step.status === 'in-progress' ? C.blue : C.text4,
              }}>
                {step.progress}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTIVITY TIMELINE
═══════════════════════════════════════════════════════════════════════════ */

function ActivityTimeline({ activities }: { activities: Activity[] }) {
  const colorMap = {
    green: { bg: C.successBg, dot: C.success },
    blue: { bg: C.blueLt, dot: C.blue },
    amber: { bg: '#FFFBEB', dot: '#D97706' },
    gray: { bg: '#F3F4F6', dot: '#9CA3AF' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {activities.map((activity, idx) => {
        const cfg = colorMap[activity.color];
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '12px',
              paddingBottom: idx < activities.length - 1 ? '16px' : '0',
              position: 'relative',
            }}
          >
            {/* Left: dot + line */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '20px',
              flexShrink: 0,
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: cfg.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: cfg.dot,
                }} />
              </div>

              {idx < activities.length - 1 && (
                <div style={{
                  width: '2px',
                  flex: 1,
                  background: C.border,
                  marginTop: '4px',
                  minHeight: '16px',
                }} />
              )}
            </div>

            {/* Right: content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: F.inter,
                fontSize: '14px',
                color: C.text1,
                marginBottom: '2px',
              }}>
                {activity.text}
              </div>
              <div style={{
                fontFamily: F.inter,
                fontSize: '12px',
                color: C.text4,
              }}>
                {activity.time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function OrgAdminDashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sellersHover, setSellersHover] = useState(false);
  const [activityHover, setActivityHover] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <style>{`
        .org-stat-cards {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        @media (max-width: 1200px) {
          .org-stat-cards {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 768px) {
          .org-stat-cards {
            grid-template-columns: 1fr;
          }
        }
        .org-row2 {
          display: grid;
          grid-template-columns: 60fr 40fr;
          gap: 16px;
        }
        @media (max-width: 968px) {
          .org-row2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <OrgAdminSidebar
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
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Дашборд</span>
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
                Дашборд
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
                Mysafar OOO — обзор продаж и KPI
              </p>
            </div>

            <DateRangePicker />
          </div>

          {/* Row 1: Stat Cards */}
          <div className="org-stat-cards" style={{ marginBottom: '24px' }}>
            <StatCard
              icon={CreditCard}
              label="Карт получено"
              value="500"
              color="blue"
            />
            <StatCard
              icon={ShoppingBag}
              label="Карт продано"
              value="230"
              trend="+12%"
              color="green"
            />
            <StatCard
              icon={UserCheck}
              label="KPI 1 — Регистрация"
              value="185"
              subtitle="80.4% от продано"
              color="cyan"
            />
            <StatCard
              icon={ArrowUpDown}
              label="KPI 2 — Пополнение"
              value="120"
              subtitle="52.2%"
              color="amber"
            />
            <StatCard
              icon={Wallet}
              label="KPI 3 — Оплата 500K"
              value="45"
              subtitle="19.6%"
              color="rose"
            />
          </div>

          {/* Row 2: Seller Table + KPI Stepper */}
          <div className="org-row2" style={{ marginBottom: '24px' }}>
            {/* Left: Seller Table */}
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              padding: '24px',
            }}>
              <div style={{
                fontFamily: F.dm,
                fontSize: '16px',
                fontWeight: 600,
                color: C.text1,
                marginBottom: '20px',
              }}>
                Рейтинг продавцов
              </div>

              <SellerTable sellers={SELLERS} />

              <button
                onMouseEnter={() => setSellersHover(true)}
                onMouseLeave={() => setSellersHover(false)}
                style={{
                  marginTop: '16px',
                  height: '36px',
                  padding: '0 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: sellersHover ? '#F3F4F6' : 'transparent',
                  fontFamily: F.inter,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: sellersHover ? C.text1 : C.text3,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.12s',
                }}
              >
                Управление продавцами
                <ArrowRight size={14} strokeWidth={2} />
              </button>
            </div>

            {/* Right: KPI Conversion */}
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              padding: '24px',
            }}>
              <div style={{
                fontFamily: F.dm,
                fontSize: '16px',
                fontWeight: 600,
                color: C.text1,
                marginBottom: '20px',
              }}>
                KPI конверсия
              </div>

              <KPIMiniStepper />

              <div style={{ height: '1px', background: C.border, margin: '24px 0' }} />

              <div style={{
                fontFamily: F.mono,
                fontSize: '20px',
                fontWeight: 700,
                color: C.text1,
                marginBottom: '4px',
              }}>
                1 825 000 UZS
              </div>
              <div style={{
                fontFamily: F.inter,
                fontSize: '13px',
                color: C.text3,
                marginBottom: '12px',
              }}>
                Общий заработок продавцов
              </div>
              <div style={{
                fontFamily: F.inter,
                fontSize: '13px',
                color: C.text3,
              }}>
                Выведено: 1 200 000 UZS
              </div>
            </div>
          </div>

          {/* Row 3: Activity Timeline */}
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{
              fontFamily: F.dm,
              fontSize: '16px',
              fontWeight: 600,
              color: C.text1,
              marginBottom: '24px',
            }}>
              Последняя активность
            </div>

            <ActivityTimeline activities={ACTIVITIES} />

            <button
              onMouseEnter={() => setActivityHover(true)}
              onMouseLeave={() => setActivityHover(false)}
              style={{
                marginTop: '20px',
                height: '36px',
                padding: '0 16px',
                border: 'none',
                borderRadius: '8px',
                background: activityHover ? '#F3F4F6' : 'transparent',
                fontFamily: F.inter,
                fontSize: '14px',
                fontWeight: 500,
                color: activityHover ? C.text1 : C.text3,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.12s',
              }}
            >
              Показать все
              <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}
