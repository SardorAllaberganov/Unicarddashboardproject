import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, Download, Search,
  Wallet, CheckCircle, ArrowDownToLine, Coins, X, Plus, Minus,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';
import { DateRangePicker } from '../components/DateRangePicker';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════════════════════════ */

interface Transaction {
  date: string;
  seller: string;
  org: string;
  card: string;
  type: 'KPI' | 'Вывод';
  kpiStage?: string;
  amount: number;
  txId: string;
  status: 'Начислено' | 'Выведено';
}

const TRANSACTIONS: Transaction[] = [
  { date: '13.04 14:32', seller: 'Абдуллох', org: 'Mysafar', card: '...4521', type: 'KPI', kpiStage: 'KPI 3', amount: 10000, txId: 'UCN-8834', status: 'Начислено' },
  { date: '13.04 12:10', seller: 'Санжар', org: 'Mysafar', card: '...3892', type: 'KPI', kpiStage: 'KPI 2', amount: 5000, txId: 'UCN-8833', status: 'Начислено' },
  { date: '13.04 09:00', seller: 'Абдуллох', org: 'Mysafar', card: '—', type: 'Вывод', amount: -120000, txId: 'UCN-8832', status: 'Выведено' },
  { date: '12.04 18:45', seller: 'Лола', org: 'Unired', card: '...2105', type: 'KPI', kpiStage: 'KPI 1', amount: 5000, txId: 'UCN-8831', status: 'Начислено' },
  { date: '12.04 15:20', seller: 'Нодира', org: 'SmartCard', card: '...1010', type: 'KPI', kpiStage: 'KPI 3', amount: 10000, txId: 'UCN-8830', status: 'Начислено' },
];

const TOP_SELLERS = [
  { rank: '🥇', name: 'Санжар М.', org: 'Mysafar', amount: '555 000', cards: 62 },
  { rank: '🥈', name: 'Ислом Т.', org: 'Mysafar', amount: '350 000', cards: 42 },
  { rank: '🥉', name: 'Абдуллох Р.', org: 'Mysafar', amount: '330 000', cards: 45 },
  { rank: '4', name: 'Нодира У.', org: 'SmartCard', amount: '310 000', cards: 38 },
  { rank: '5', name: 'Мухаммад', org: 'Unired', amount: '290 000', cards: 35 },
];

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD TONE MAPS (multi-state)
═══════════════════════════════════════════════════════════════════════════ */

const STAT_TONE_LIGHT = {
  blue:   { bg: C.blueLt,   iconColor: C.blue    },
  green:  { bg: C.successBg,iconColor: C.success },
  amber:  { bg: '#FFFBEB',  iconColor: '#D97706' },
  violet: { bg: '#F5F3FF',  iconColor: '#7C3AED' },
};

const STAT_TONE_DARK = {
  blue:   { bg: 'rgba(59,130,246,0.12)', iconColor: D.blue    },
  green:  { bg: 'rgba(52,211,153,0.12)', iconColor: D.success },
  amber:  { bg: 'rgba(251,191,36,0.12)', iconColor: '#FBBF24' },
  violet: { bg: 'rgba(167,139,250,0.14)',iconColor: '#A78BFA' },
};

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
  t,
  dark,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  color: 'blue' | 'green' | 'amber' | 'violet';
  t: T;
  dark: boolean;
}) {
  const cfg = (dark ? STAT_TONE_DARK : STAT_TONE_LIGHT)[color];

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
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
          color: t.text3,
          marginBottom: '4px',
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: F.mono,
          fontSize: '22px',
          fontWeight: 700,
          color: t.text1,
          lineHeight: 1.2,
        }}>
          {value}
        </div>
      </div>

      {trend && (
        <div style={{
          fontFamily: F.inter,
          fontSize: '12px',
          color: t.success,
        }}>
          {trend}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DONUT CHART
═══════════════════════════════════════════════════════════════════════════ */

function DonutChart({ t, dark }: { t: T; dark: boolean }) {
  const data = [
    { label: 'KPI 1', value: 9450000, percent: 38.5, color: dark ? '#60A5FA' : '#3B82F6' },
    { label: 'KPI 2', value: 6050000, percent: 24.6, color: dark ? '#3B82F6' : '#60A5FA' },
    { label: 'KPI 3', value: 5670000, percent: 23.1, color: dark ? '#1D4ED8' : '#93C5FD' },
  ];

  // Simple SVG donut
  let currentAngle = -90;
  const radius = 70;
  const strokeWidth = 24;
  const center = 90;

  const segments = data.map((d, idx) => {
    const angle = (d.percent / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      color: d.color,
    };
  });

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: '12px',
      padding: '24px',
    }}>
      <div style={{
        fontFamily: F.dm,
        fontSize: '16px',
        fontWeight: 600,
        color: t.text1,
        marginBottom: '24px',
      }}>
        Начисления по KPI этапам
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
      }}>
        {/* Chart */}
        <div style={{ position: 'relative' }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            {segments.map((seg, idx) => (
              <path
                key={idx}
                d={seg.path}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            ))}
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: F.mono,
              fontSize: '18px',
              fontWeight: 700,
              color: t.text1,
            }}>
              21 170 000
            </div>
            <div style={{
              fontFamily: F.inter,
              fontSize: '12px',
              color: t.text3,
            }}>
              UZS
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100%',
        }}>
          {data.map((d, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  background: d.color,
                  flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: F.inter,
                  fontSize: '13px',
                  color: t.text2,
                }}>
                  {d.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: F.mono,
                  fontSize: '13px',
                  fontWeight: 600,
                  color: t.text1,
                }}>
                  {d.value.toLocaleString('ru-RU')}
                </span>
                <span style={{
                  fontFamily: F.inter,
                  fontSize: '12px',
                  color: t.text4,
                }}>
                  {d.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOP SELLERS
═══════════════════════════════════════════════════════════════════════════ */

function TopSellers({ t, dark }: { t: T; dark: boolean }) {
  const rankBg   = dark ? 'rgba(251,191,36,0.14)' : '#FEF3C7';
  const otherBg  = dark ? D.tableAlt : '#F3F4F6';
  const rowBg    = dark ? D.tableAlt : '#FAFBFC';
  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: '12px',
      padding: '24px',
    }}>
      <div style={{
        fontFamily: F.dm,
        fontSize: '16px',
        fontWeight: 600,
        color: t.text1,
        marginBottom: '20px',
      }}>
        Топ продавцов по заработку
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {TOP_SELLERS.map((seller, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: rowBg,
              borderRadius: '8px',
              border: `1px solid ${t.border}`,
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: idx < 3 ? rankBg : otherBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: F.inter,
              fontSize: '16px',
              flexShrink: 0,
            }}>
              {seller.rank}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: F.inter,
                fontSize: '14px',
                fontWeight: 500,
                color: t.text1,
                marginBottom: '2px',
              }}>
                {seller.name}
              </div>
              <div style={{
                fontFamily: F.inter,
                fontSize: '12px',
                color: t.text3,
              }}>
                {seller.org}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: F.mono,
                fontSize: '14px',
                fontWeight: 600,
                color: t.text1,
                marginBottom: '2px',
              }}>
                {seller.amount} UZS
              </div>
              <div style={{
                fontFamily: F.inter,
                fontSize: '11px',
                color: t.text4,
              }}>
                {seller.cards} карты
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════════════════════════════ */

function Tabs({ active, onChange, t }: { active: string; onChange: (tab: string) => void; t: T }) {
  const tabs = ['Все', 'KPI вознаграждения', 'Выводы средств'];

  return (
    <div style={{
      display: 'flex',
      gap: '2px',
      borderBottom: `1px solid ${t.border}`,
    }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: '10px 16px',
            border: 'none',
            background: 'transparent',
            borderBottom: active === tab ? `2px solid ${t.blue}` : '2px solid transparent',
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: active === tab ? 600 : 400,
            color: active === tab ? t.blue : t.text3,
            cursor: 'pointer',
            transition: 'all 0.12s',
            marginBottom: '-1px',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, value, onChange, t }: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  t: T;
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
          border: `1px solid ${focused ? t.blue : t.inputBorder}`,
          borderRadius: '8px',
          background: t.surface,
          fontFamily: F.inter,
          fontSize: '14px',
          color: t.text2,
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          minWidth: '160px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} color={t.text3} style={{
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
   TRANSACTION TABLE TOKEN MAPS (multi-state)
═══════════════════════════════════════════════════════════════════════════ */

const TX_TYPE_LIGHT = {
  KPI:   { bg: '#F3F4F6',    color: C.text2,  border: C.border },
  Вывод: { bg: C.warningBg,  color: '#B45309',border: '#FDE68A' },
};
const TX_TYPE_DARK = {
  KPI:   { bg: D.tableAlt,                 color: D.text2,   border: D.border },
  Вывод: { bg: 'rgba(251,191,36,0.12)',    color: '#FBBF24', border: 'rgba(251,191,36,0.35)' },
};

const TX_STATUS_LIGHT = {
  Начислено: { bg: C.successBg, color: '#15803D', border: '#BBF7D0', dot: C.success },
  Выведено:  { bg: C.infoBg,    color: '#0E7490', border: '#A5F3FC', dot: C.info    },
};
const TX_STATUS_DARK = {
  Начислено: { bg: 'rgba(52,211,153,0.12)', color: '#34D399', border: 'transparent', dot: '#34D399' },
  Выведено:  { bg: 'rgba(34,211,238,0.12)', color: '#22D3EE', border: 'transparent', dot: '#22D3EE' },
};

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSACTION TABLE
═══════════════════════════════════════════════════════════════════════════ */

function TransactionTable({ transactions, t, dark }: { transactions: Transaction[]; t: T; dark: boolean }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const headerCellStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    fontFamily: F.inter,
    fontSize: '12px',
    fontWeight: 600,
    color: t.text3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
  };

  const dataCellStyle: React.CSSProperties = {
    padding: '14px 16px',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  };

  const typeMap = dark ? TX_TYPE_DARK : TX_TYPE_LIGHT;
  const statusMap = dark ? TX_STATUS_DARK : TX_STATUS_LIGHT;

  return (
    <div style={{
      border: `1px solid ${t.border}`,
      borderRadius: '8px',
      overflowX: 'auto',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '1200px',
      }}>
        <thead>
          <tr style={{
            background: t.tableHeaderBg,
            borderBottom: `1px solid ${t.border}`,
          }}>
            <th style={headerCellStyle}>Дата</th>
            <th style={headerCellStyle}>Продавец</th>
            <th style={headerCellStyle}>Организация</th>
            <th style={headerCellStyle}>Карта</th>
            <th style={headerCellStyle}>Тип</th>
            <th style={headerCellStyle}>KPI этап</th>
            <th style={headerCellStyle}>Сумма</th>
            <th style={headerCellStyle}>UCOIN TX</th>
            <th style={headerCellStyle}>Статус</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, idx) => {
            const typeCfg = typeMap[tx.type];
            const statusCfg = statusMap[tx.status];
            return (
            <tr
              key={idx}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                borderBottom: idx < transactions.length - 1 ? `1px solid ${t.border}` : 'none',
                background: hoveredRow === idx ? t.tableHover : t.surface,
                transition: 'background 0.12s',
              }}
            >
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                  {tx.date}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                  {tx.seller}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                  {tx.org}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>
                  {tx.card}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontFamily: F.inter,
                  fontSize: '12px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '10px',
                  background: typeCfg.bg,
                  color: typeCfg.color,
                  border: `1px solid ${typeCfg.border}`,
                }}>
                  {tx.type}
                </span>
              </td>
              <td style={dataCellStyle}>
                {tx.kpiStage ? (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontFamily: F.inter,
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '3px 9px',
                    borderRadius: '8px',
                    background: t.blueLt,
                    color: t.blue,
                    border: `1px solid ${t.blueTint}`,
                  }}>
                    {tx.kpiStage}
                  </span>
                ) : (
                  <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text4 }}>—</span>
                )}
              </td>
              <td style={dataCellStyle}>
                <span style={{
                  fontFamily: F.mono,
                  fontSize: '14px',
                  fontWeight: 600,
                  color: tx.amount < 0 ? t.error : t.text1,
                }}>
                  {tx.amount < 0 ? '−' : ''}{Math.abs(tx.amount).toLocaleString('ru-RU')}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{
                  fontFamily: F.mono,
                  fontSize: '11px',
                  color: t.text3,
                }}>
                  {tx.txId}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontFamily: F.inter,
                  fontSize: '12px',
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: '10px',
                  background: statusCfg.bg,
                  color: statusCfg.color,
                  border: statusCfg.border !== 'transparent' ? `1px solid ${statusCfg.border}` : '1px solid transparent',
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: statusCfg.dot,
                    flexShrink: 0,
                  }} />
                  {tx.status}
                </span>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MANUAL ADJUSTMENT MODAL
═══════════════════════════════════════════════════════════════════════════ */

interface SellerOption {
  name: string;
  org: string;
  balance: number;
  earned: number;
}

const SELLER_OPTIONS: SellerOption[] = [
  { name: 'Санжар Мирзаев',   org: 'Mysafar OOO',      balance: 155_000, earned: 555_000 },
  { name: 'Абдуллох Рахимов', org: 'Mysafar OOO',      balance: 220_000, earned: 780_000 },
  { name: 'Нилуфар Каримова', org: 'Mysafar OOO',      balance: 90_000,  earned: 410_000 },
  { name: 'Ислом Тошматов',   org: 'Unired Marketing', balance: 60_000,  earned: 275_000 },
  { name: 'Камола Расулова',  org: 'Express Finance',  balance: 45_000,  earned: 210_000 },
  { name: 'Дарья Нам',        org: 'Digital Pay',      balance: 80_000,  earned: 330_000 },
];

const CREDIT_REASONS = ['Бонус за перевыполнение', 'Компенсация ошибки', 'Промо-акция', 'Другое'];
const DEBIT_REASONS  = ['Корректировка ошибки',    'Штраф',              'Возврат начисления', 'Другое'];

function fmtUzs(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function AdjRadio({ selected, onClick, label, danger, t, dark }: {
  selected: boolean; onClick: () => void; label: string; danger?: boolean; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const activeColor = danger ? t.error : t.blue;
  const activeBg = danger ? t.errorBg : t.blueLt;
  const hovBg = dark ? t.tableHover : '#F9FAFB';
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 12px',
        border: `1px solid ${selected ? activeColor : hov ? t.inputBorder : t.border}`,
        borderRadius: '8px',
        background: selected ? activeBg : hov ? hovBg : t.surface,
        cursor: 'pointer', transition: 'all 0.12s',
        flex: 1,
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        border: `2px solid ${selected ? activeColor : t.inputBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        transition: 'border-color 0.12s',
      }}>
        {selected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeColor }} />}
      </div>
      <span style={{
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.text1,
      }}>
        {label}
      </span>
    </div>
  );
}

function ManualAdjustmentModal({ open, onClose, onConfirm, t, dark }: {
  open: boolean; onClose: () => void; onConfirm: () => void; t: T; dark: boolean;
}) {
  const [sellerName, setSellerName] = useState('');
  const [op, setOp] = useState<'credit' | 'debit'>('credit');
  const [amountStr, setAmountStr] = useState('');
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [sellerFocus, setSellerFocus] = useState(false);
  const [amountFocus, setAmountFocus] = useState(false);
  const [reasonFocus, setReasonFocus] = useState(false);
  const [commentFocus, setCommentFocus] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!open) {
      setSellerName(''); setOp('credit'); setAmountStr('');
      setReason(''); setComment(''); return;
    }
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  // Reset reason when op changes
  useEffect(() => { setReason(''); }, [op]);

  if (!open) return null;

  const seller = SELLER_OPTIONS.find(s => s.name === sellerName) ?? null;
  const amount = parseInt(amountStr.replace(/\s/g, '')) || 0;
  const newBalance = seller
    ? op === 'credit' ? seller.balance + amount : seller.balance - amount
    : 0;
  const canConfirm = !!seller && amount > 0 && !!reason && comment.trim().length > 0
    && (op !== 'debit' || newBalance >= 0);

  const reasons = op === 'credit' ? CREDIT_REASONS : DEBIT_REASONS;
  const accentColor = op === 'credit' ? t.blue : t.error;

  const closeHovBg = dark ? t.tableAlt : '#F3F4F6';
  const cancelHovBg = dark ? t.tableHover : '#F9FAFB';
  const sellerInfoBg = dark ? t.tableAlt : '#F9FAFB';
  const previewErrBorder = dark ? 'rgba(248,113,113,0.35)' : '#FECACA';
  const disabledBgCredit = dark ? 'rgba(59,130,246,0.35)' : '#93C5FD';
  const disabledBgDebit = dark ? 'rgba(248,113,113,0.35)' : '#FCA5A5';
  const debitHoverBg = dark ? '#EF4444' : '#DC2626';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: dark ? 'rgba(0,0,0,0.6)' : 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px',
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '16px',
          boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: `1px solid ${t.border}`,
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: F.dm, fontSize: '17px', fontWeight: 700, color: t.text1,
          }}>
            Ручная корректировка вознаграждения
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '28px', height: '28px',
              border: 'none', borderRadius: '7px',
              background: closeHov ? closeHovBg : 'transparent',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={closeHov ? t.text1 : t.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {/* Seller select */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, marginBottom: '8px',
            }}>
              Продавец<span style={{ color: t.error, marginLeft: '3px' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={sellerName}
                onChange={e => setSellerName(e.target.value)}
                onFocus={() => setSellerFocus(true)}
                onBlur={() => setSellerFocus(false)}
                style={{
                  width: '100%', height: '40px', padding: '0 36px 0 12px',
                  border: `1px solid ${sellerFocus ? t.blue : t.inputBorder}`,
                  borderRadius: '8px', background: t.surface,
                  fontFamily: F.inter, fontSize: '13px',
                  color: sellerName ? t.text1 : t.text4,
                  outline: 'none', appearance: 'none', cursor: 'pointer',
                  boxShadow: sellerFocus ? `0 0 0 3px ${t.blueTint}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              >
                <option value="">Выберите продавца</option>
                {SELLER_OPTIONS.map(s => (
                  <option key={s.name} value={s.name}>{s.name} ({s.org})</option>
                ))}
              </select>
              <ChevronDown size={14} color={t.text3} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
            </div>
          </div>

          {/* Seller info */}
          {seller && (
            <div style={{
              background: sellerInfoBg, borderRadius: '8px', padding: '10px 12px',
              border: dark ? `1px solid ${t.border}` : 'none',
            }}>
              <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text1 }}>
                Текущий баланс:{' '}
                <span style={{ fontFamily: F.mono, color: t.blue, fontWeight: 600 }}>
                  {fmtUzs(seller.balance)} UZS
                </span>
              </div>
              <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, marginTop: '2px' }}>
                Всего заработано:{' '}
                <span style={{ fontFamily: F.mono, color: t.text2 }}>
                  {fmtUzs(seller.earned)} UZS
                </span>
              </div>
            </div>
          )}

          <div style={{ height: '1px', background: t.border }} />

          {/* Operation radio group */}
          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, marginBottom: '8px',
            }}>
              Тип операции
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <AdjRadio
                selected={op === 'credit'}
                onClick={() => setOp('credit')}
                label="Начисление"
                t={t}
                dark={dark}
              />
              <AdjRadio
                selected={op === 'debit'}
                onClick={() => setOp('debit')}
                label="Списание"
                danger
                t={t}
                dark={dark}
              />
            </div>
          </div>

          {/* Amount + UZS suffix */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, marginBottom: '8px',
            }}>
              Сумма<span style={{ color: t.error, marginLeft: '3px' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                inputMode="numeric"
                value={amountStr}
                onChange={e => {
                  const digits = e.target.value.replace(/\D/g, '');
                  setAmountStr(digits ? fmtUzs(parseInt(digits)) : '');
                }}
                onFocus={() => setAmountFocus(true)}
                onBlur={() => setAmountFocus(false)}
                placeholder="10 000"
                style={{
                  width: '100%', height: '40px', padding: '0 52px 0 12px',
                  border: `1px solid ${amountFocus ? t.blue : t.inputBorder}`,
                  borderRadius: '8px', background: t.surface,
                  fontFamily: F.mono, fontSize: '14px', color: t.text1,
                  outline: 'none', boxSizing: 'border-box',
                  boxShadow: amountFocus ? `0 0 0 3px ${t.blueTint}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              />
              <span style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                fontFamily: F.inter, fontSize: '12px', fontWeight: 500, color: t.text4,
                pointerEvents: 'none',
              }}>
                UZS
              </span>
            </div>
          </div>

          {/* Reason select */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, marginBottom: '8px',
            }}>
              Причина<span style={{ color: t.error, marginLeft: '3px' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                onFocus={() => setReasonFocus(true)}
                onBlur={() => setReasonFocus(false)}
                style={{
                  width: '100%', height: '40px', padding: '0 36px 0 12px',
                  border: `1px solid ${reasonFocus ? t.blue : t.inputBorder}`,
                  borderRadius: '8px', background: t.surface,
                  fontFamily: F.inter, fontSize: '13px',
                  color: reason ? t.text1 : t.text4,
                  outline: 'none', appearance: 'none', cursor: 'pointer',
                  boxShadow: reasonFocus ? `0 0 0 3px ${t.blueTint}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              >
                <option value="">Выберите причину</option>
                {reasons.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={14} color={t.text3} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, marginBottom: '8px',
            }}>
              Комментарий<span style={{ color: t.error, marginLeft: '3px' }}>*</span>
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              onFocus={() => setCommentFocus(true)}
              onBlur={() => setCommentFocus(false)}
              placeholder="Опишите причину корректировки..."
              style={{
                width: '100%', minHeight: '72px', padding: '10px 12px',
                border: `1px solid ${commentFocus ? t.blue : t.inputBorder}`,
                borderRadius: '8px', background: t.surface,
                fontFamily: F.inter, fontSize: '13px', color: t.text1,
                outline: 'none', boxSizing: 'border-box', resize: 'vertical',
                boxShadow: commentFocus ? `0 0 0 3px ${t.blueTint}` : 'none',
                transition: 'border-color 0.12s, box-shadow 0.12s',
              }}
            />
          </div>

          {/* Preview card */}
          {seller && amount > 0 && (
            <div style={{
              background: op === 'credit' ? t.blueLt : t.errorBg,
              borderTop: `1px solid ${op === 'credit' ? t.blueTint : previewErrBorder}`,
              borderRight: `1px solid ${op === 'credit' ? t.blueTint : previewErrBorder}`,
              borderBottom: `1px solid ${op === 'credit' ? t.blueTint : previewErrBorder}`,
              borderLeft: `3px solid ${accentColor}`,
              borderRadius: '8px', padding: '12px',
            }}>
              <div style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 600,
                color: t.text1, marginBottom: '4px',
              }}>
                {seller.name}
              </div>
              <div style={{
                fontFamily: F.inter, fontSize: '12px', color: t.text2, lineHeight: 1.5,
              }}>
                Баланс:{' '}
                <span style={{ fontFamily: F.mono, color: t.text3 }}>{fmtUzs(seller.balance)}</span>
                <span style={{ color: t.text4, margin: '0 6px' }}>→</span>
                <span style={{ fontFamily: F.mono, fontWeight: 600, color: newBalance < 0 ? t.error : t.text1 }}>
                  {fmtUzs(newBalance)}
                </span>{' '}
                UZS{' '}
                <span style={{ fontFamily: F.mono, color: accentColor, fontWeight: 600 }}>
                  ({op === 'credit' ? '+' : '−'}{fmtUzs(amount)})
                </span>
              </div>
              {op === 'debit' && newBalance < 0 && (
                <div style={{
                  fontFamily: F.inter, fontSize: '11px', color: t.error,
                  marginTop: '6px', fontWeight: 500,
                }}>
                  Списание превышает текущий баланс
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '10px', justifyContent: 'flex-end',
          padding: '14px 20px',
          borderTop: `1px solid ${t.border}`,
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 18px',
              border: `1px solid ${t.border}`, borderRadius: '8px',
              background: cancelHov ? cancelHovBg : 'transparent',
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, cursor: 'pointer',
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
            aria-label={op === 'credit' ? `Начислить ${fmtUzs(amount)} UZS` : `Списать ${fmtUzs(amount)} UZS`}
            style={{
              height: '38px', padding: '0 18px',
              border: 'none', borderRadius: '8px',
              background: !canConfirm
                ? (op === 'credit' ? disabledBgCredit : disabledBgDebit)
                : confirmHov
                  ? (op === 'credit' ? t.blueHover : debitHoverBg)
                  : accentColor,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF',
              cursor: canConfirm ? 'pointer' : 'not-allowed',
              opacity: canConfirm ? 1 : 0.5,
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: dark
                ? 'none'
                : canConfirm && confirmHov
                  ? (op === 'credit' ? '0 2px 8px rgba(37,99,235,0.28)' : '0 2px 8px rgba(239,68,68,0.32)')
                  : canConfirm
                    ? (op === 'credit' ? '0 1px 3px rgba(37,99,235,0.16)' : '0 1px 3px rgba(239,68,68,0.20)')
                    : 'none',
              transition: 'all 0.15s',
            }}
          >
            {op === 'credit' ? <Plus size={14} strokeWidth={2} /> : <Minus size={14} strokeWidth={2} />}
            {op === 'credit' ? 'Начислить' : 'Списать'} {amount > 0 ? `${fmtUzs(amount)} UZS` : 'UZS'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function RewardsFinancePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-13' });
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Все');
  const [search, setSearch] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [kpiFilter, setKpiFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const [exportHover, setExportHover] = useState(false);
  const [adjustHov, setAdjustHov] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
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
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Вознаграждения</span>
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
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Вознаграждения
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
                Все начисления KPI и выводы средств
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
              <DateRangePicker value={dateRange} onChange={setDateRange} />
              <button
                onMouseEnter={() => setAdjustHov(true)}
                onMouseLeave={() => setAdjustHov(false)}
                onClick={() => setAdjustOpen(true)}
                style={{
                  height: '40px',
                  padding: '0 18px',
                  border: `1px solid ${adjustHov ? t.blue : t.border}`,
                  borderRadius: '8px',
                  background: adjustHov ? t.blueLt : t.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: adjustHov ? t.blue : t.text2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'all 0.12s',
                }}
              >
                <Plus size={16} strokeWidth={1.75} />
                Ручная корректировка
              </button>
              <button
                onMouseEnter={() => setExportHover(true)}
                onMouseLeave={() => setExportHover(false)}
                style={{
                  height: '40px',
                  padding: '0 18px',
                  border: `1px solid ${exportHover ? t.blue : t.border}`,
                  borderRadius: '8px',
                  background: exportHover ? t.blueLt : t.surface,
                  fontFamily: F.inter,
                  fontSize: '14px',
                  fontWeight: 500,
                  color: exportHover ? t.blue : t.text2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'all 0.12s',
                }}
              >
                <Download size={16} strokeWidth={1.75} />
                Экспорт
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <StatCard
              icon={Wallet}
              label="Всего начислено"
              value="24 565 000 UZS"
              trend="+18% vs прошлый месяц"
              color="blue"
              t={t}
              dark={dark}
            />
            <StatCard
              icon={CheckCircle}
              label="KPI выплаты"
              value="21 170 000 UZS"
              color="green"
              t={t}
              dark={dark}
            />
            <StatCard
              icon={ArrowDownToLine}
              label="Выведено продавцами"
              value="14 890 000 UZS"
              color="amber"
              t={t}
              dark={dark}
            />
            <StatCard
              icon={Coins}
              label="Остаток в кошельках"
              value="6 280 000 UZS"
              color="violet"
              t={t}
              dark={dark}
            />
          </div>

          {/* Row 2: Chart + Top Sellers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '55fr 45fr',
            gap: '16px',
            marginBottom: '24px',
          }}>
            <DonutChart t={t} dark={dark} />
            <TopSellers t={t} dark={dark} />
          </div>

          {/* Row 3: Transaction Log */}
          <div style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{
              fontFamily: F.dm,
              fontSize: '16px',
              fontWeight: 600,
              color: t.text1,
              marginBottom: '20px',
            }}>
              Лог начислений
            </div>

            {/* Tabs */}
            <Tabs active={activeTab} onChange={setActiveTab} t={t} />

            {/* Filter Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              marginTop: '20px',
              marginBottom: '20px',
            }}>
              {/* Search */}
              <div style={{ position: 'relative', width: '280px', flexShrink: 0 }}>
                <Search
                  size={16}
                  color={searchFocused ? t.blue : t.text4}
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
                  placeholder="Поиск..."
                  style={{
                    width: '100%',
                    height: '40px',
                    paddingLeft: '38px',
                    paddingRight: '12px',
                    border: `1px solid ${searchFocused ? t.blue : t.inputBorder}`,
                    borderRadius: '8px',
                    background: t.surface,
                    fontFamily: F.inter,
                    fontSize: '14px',
                    color: t.text1,
                    outline: 'none',
                    boxSizing: 'border-box',
                    boxShadow: searchFocused ? `0 0 0 3px ${t.focusRing}` : 'none',
                    transition: 'border-color 0.12s, box-shadow 0.12s',
                  }}
                />
              </div>

              <FilterSelect
                label="Организация: Все"
                options={['Mysafar', 'Unired', 'SmartCard', 'Express']}
                value={orgFilter}
                onChange={setOrgFilter}
                t={t}
              />

              <FilterSelect
                label="KPI этап: Все"
                options={['KPI 1', 'KPI 2', 'KPI 3']}
                value={kpiFilter}
                onChange={setKpiFilter}
                t={t}
              />
            </div>

            {/* Table */}
            <TransactionTable transactions={TRANSACTIONS} t={t} dark={dark} />

            {/* Pagination */}
            <div style={{
              marginTop: '16px',
              fontFamily: F.inter,
              fontSize: '13px',
              color: t.text3,
              textAlign: 'center',
            }}>
              Показано 1–5 из 1 234
            </div>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      <ManualAdjustmentModal
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
        onConfirm={() => setAdjustOpen(false)}
        t={t}
        dark={dark}
      />
    </div>
  );
}
