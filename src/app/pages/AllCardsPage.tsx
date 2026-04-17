import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronRight, ChevronDown, Download, Search, Check,
  ChevronLeft, SlidersHorizontal, X, CreditCard,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useIsMobile } from '../components/useIsMobile';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════════════════════════ */

type CardStatus = 'Активна' | 'Зарег.' | 'У продавца' | 'На складе' | 'Продана';

interface CardRow {
  id: number;
  cardNumber: string;
  type: string;
  organization: string;
  seller: string;
  client: string;
  status: CardStatus;
  kpi1: boolean | null;
  kpi2: boolean | null;
  kpi3: number | boolean | null; // number = progress %, boolean = done, null = not started
  topup: string;
  spent: string;
}

const CARDS: CardRow[] = [
  {
    id: 1,
    cardNumber: '8600 1234 5678 1001',
    type: 'VISA SUM',
    organization: 'Mysafar',
    seller: 'Абдуллох',
    client: 'Алишер Н.',
    status: 'Активна',
    kpi1: true,
    kpi2: true,
    kpi3: true,
    topup: '800 000',
    spent: '520 000',
  },
  {
    id: 2,
    cardNumber: '8600 1234 5678 1002',
    type: 'VISA SUM',
    organization: 'Mysafar',
    seller: 'Абдуллох',
    client: 'Дилшод К.',
    status: 'Зарег.',
    kpi1: true,
    kpi2: true,
    kpi3: 64,
    topup: '500 000',
    spent: '320 000',
  },
  {
    id: 3,
    cardNumber: '8600 1234 5678 1003',
    type: 'VISA SUM',
    organization: 'Mysafar',
    seller: 'Абдуллох',
    client: '—',
    status: 'У продавца',
    kpi1: null,
    kpi2: null,
    kpi3: null,
    topup: '—',
    spent: '—',
  },
  {
    id: 4,
    cardNumber: '8600 1234 5678 1004',
    type: 'VISA USD',
    organization: 'Mysafar',
    seller: 'Санжар',
    client: 'Камол Т.',
    status: 'Активна',
    kpi1: true,
    kpi2: true,
    kpi3: true,
    topup: '1 200 000',
    spent: '680 000',
  },
  {
    id: 5,
    cardNumber: '8600 1234 5678 1005',
    type: 'VISA SUM',
    organization: 'Unired Mkt',
    seller: 'Лола К.',
    client: '—',
    status: 'На складе',
    kpi1: null,
    kpi2: null,
    kpi3: null,
    topup: '—',
    spent: '—',
  },
  {
    id: 6,
    cardNumber: '8600 1234 5678 1006',
    type: 'VISA SUM',
    organization: 'Unired Mkt',
    seller: 'Мухаммад',
    client: 'Дилноза А.',
    status: 'Зарег.',
    kpi1: true,
    kpi2: null,
    kpi3: null,
    topup: '—',
    spent: '—',
  },
  {
    id: 7,
    cardNumber: '8600 1234 5678 1007',
    type: 'VISA SUM',
    organization: 'Express',
    seller: 'Бобур',
    client: 'Шахзод Р.',
    status: 'Активна',
    kpi1: true,
    kpi2: true,
    kpi3: 82,
    topup: '700 000',
    spent: '410 000',
  },
  {
    id: 8,
    cardNumber: '8600 1234 5678 1008',
    type: 'VISA SUM',
    organization: 'Express',
    seller: '—',
    client: '—',
    status: 'На складе',
    kpi1: null,
    kpi2: null,
    kpi3: null,
    topup: '—',
    spent: '—',
  },
  {
    id: 9,
    cardNumber: '8600 1234 5678 1009',
    type: 'VISA USD',
    organization: 'SmartCard',
    seller: 'Нодира',
    client: 'Фарход М.',
    status: 'Продана',
    kpi1: true,
    kpi2: null,
    kpi3: null,
    topup: '50 000',
    spent: '—',
  },
  {
    id: 10,
    cardNumber: '8600 1234 5678 1010',
    type: 'VISA SUM',
    organization: 'SmartCard',
    seller: 'Нодира',
    client: 'Ислом С.',
    status: 'Активна',
    kpi1: true,
    kpi2: true,
    kpi3: true,
    topup: '600 000',
    spent: '545 000',
  },
];

const ORGANIZATIONS = ['Mysafar', 'Unired Mkt', 'Express', 'SmartCard', 'Digital Pay'];
const BATCHES = ['Партия Апрель 2026', 'Партия Март 2026', 'Партия Февраль 2026'];
const STATUSES = ['На складе', 'У продавца', 'Продана', 'Зарегистрирована', 'Активна'];
const KPI_PROGRESS = ['KPI 1 ✅', 'KPI 2 ✅', 'KPI 3 ✅', 'Без KPI'];

/* ═══════════════════════════════════════════════════════════════════════════
   STAT PILL
═══════════════════════════════════════════════════════════════════════════ */

function StatPill({ label, value, variant = 'neutral', t, dark }: {
  label: string;
  value: string | number;
  variant?: 'neutral' | 'success';
  t: T; dark: boolean;
}) {
  const colors = {
    neutral: dark
      ? { bg: 'transparent', color: D.text2, border: D.border }
      : { bg: '#F3F4F6',     color: C.text2, border: C.border },
    success: dark
      ? { bg: 'rgba(52,211,153,0.12)', color: '#34D399', border: 'transparent' }
      : { bg: C.successBg,             color: '#15803D', border: '#BBF7D0' },
  };

  const cfg = colors[variant];

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 14px',
      borderRadius: '10px',
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        fontFamily: F.inter,
        fontSize: '13px',
        color: t.text3,
      }}>
        {label}:
      </span>
      <span style={{
        fontFamily: F.mono,
        fontSize: '14px',
        fontWeight: 600,
        color: cfg.color,
      }}>
        {value}
      </span>
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
   STATUS BADGE
═══════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ status, dark }: { status: CardStatus; dark: boolean }) {
  const configsLight: Record<CardStatus, { bg: string; color: string; dot: string }> = {
    'Активна':    { bg: C.successBg, color: '#15803D', dot: C.success },
    'Зарег.':     { bg: C.infoBg,    color: '#0E7490', dot: C.info },
    'У продавца': { bg: C.warningBg, color: '#B45309', dot: C.warning },
    'На складе':  { bg: '#F3F4F6',   color: '#374151', dot: '#9CA3AF' },
    'Продана':    { bg: C.infoBg,    color: '#0E7490', dot: C.info },
  };
  const configsDark: Record<CardStatus, { bg: string; color: string; dot: string }> = {
    'Активна':    { bg: 'rgba(52,211,153,0.12)',  color: '#34D399', dot: '#34D399' },
    'Зарег.':     { bg: 'rgba(34,211,238,0.12)',  color: '#22D3EE', dot: '#22D3EE' },
    'У продавца': { bg: 'rgba(251,191,36,0.12)',  color: '#FBBF24', dot: '#FBBF24' },
    'На складе':  { bg: D.tableAlt,               color: D.text2,   dot: D.text4 },
    'Продана':    { bg: 'rgba(34,211,238,0.12)',  color: '#22D3EE', dot: '#22D3EE' },
  };

  const cfg = (dark ? configsDark : configsLight)[status];

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
   TYPE BADGE
═══════════════════════════════════════════════════════════════════════════ */

function TypeBadge({ type, t }: { type: string; t: T }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: F.inter,
      fontSize: '11px',
      fontWeight: 500,
      padding: '3px 9px',
      borderRadius: '8px',
      background: 'transparent',
      border: `1px solid ${t.border}`,
      color: t.text2,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      {type}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI CHECK CELL
═══════════════════════════════════════════════════════════════════════════ */

function KPICheckCell({ value, t, dark }: { value: boolean | number | null; t: T; dark: boolean }) {
  if (value === null) {
    return (
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text4 }}>—</span>
    );
  }

  if (value === true) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '4px',
          background: dark ? '#34D399' : C.success,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Check size={10} color="#FFFFFF" strokeWidth={3} />
        </div>
      </div>
    );
  }

  const percentage = value as number;
  const trackBg = dark ? D.progressTrack : '#E5E7EB';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
      <div style={{
        flex: 1,
        height: '6px',
        borderRadius: '3px',
        background: trackBg,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: t.blue,
          borderRadius: '3px',
        }} />
      </div>
      <span style={{
        fontFamily: F.mono,
        fontSize: '11px',
        color: t.text3,
        flexShrink: 0,
      }}>
        {percentage}%
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATA TABLE
═══════════════════════════════════════════════════════════════════════════ */

function DataTable({ cards, onRowClick, t, dark }: { cards: CardRow[]; onRowClick: (id: number) => void; t: T; dark: boolean }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const headerBg  = dark ? D.tableHeaderBg : '#FAFBFC';
  const rowHoverBg = dark ? D.tableHover : '#FAFBFC';

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

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: '12px',
      overflowX: 'auto',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '1400px',
      }}>
        <thead>
          <tr style={{
            background: headerBg,
            borderBottom: `1px solid ${t.border}`,
          }}>
            <th style={headerCellStyle}>Карта</th>
            <th style={headerCellStyle}>Тип</th>
            <th style={headerCellStyle}>Организация</th>
            <th style={headerCellStyle}>Продавец</th>
            <th style={headerCellStyle}>Клиент</th>
            <th style={headerCellStyle}>Статус</th>
            <th style={headerCellStyle}>KPI 1</th>
            <th style={headerCellStyle}>KPI 2</th>
            <th style={headerCellStyle}>KPI 3</th>
            <th style={headerCellStyle}>Пополнено</th>
            <th style={headerCellStyle}>Расход</th>
          </tr>
        </thead>
        <tbody>
          {cards.map(card => (
            <tr
              key={card.id}
              onMouseEnter={() => setHoveredRow(card.id)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={() => onRowClick(card.id)}
              style={{
                borderBottom: `1px solid ${t.border}`,
                background: hoveredRow === card.id ? rowHoverBg : t.surface,
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
            >
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text1 }}>
                  ...{card.cardNumber.slice(-4)}
                </span>
              </td>
              <td style={dataCellStyle}>
                <TypeBadge type={card.type} t={t} />
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                  {card.organization}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                  {card.seller}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
                  {card.client}
                </span>
              </td>
              <td style={dataCellStyle}>
                <StatusBadge status={card.status} dark={dark} />
              </td>
              <td style={dataCellStyle}>
                <KPICheckCell value={card.kpi1} t={t} dark={dark} />
              </td>
              <td style={dataCellStyle}>
                <KPICheckCell value={card.kpi2} t={t} dark={dark} />
              </td>
              <td style={dataCellStyle}>
                <KPICheckCell value={card.kpi3} t={t} dark={dark} />
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>
                  {card.topup}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text2 }}>
                  {card.spent}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE — All Cards list + FilterSheet
═══════════════════════════════════════════════════════════════════════════ */

type MobileFilters = {
  orgs: Set<string>;
  batches: Set<string>;
  status: string; // '' = Все
  kpi: string;    // '' = Все
};

const EMPTY_FILTERS: MobileFilters = { orgs: new Set(), batches: new Set(), status: '', kpi: '' };

function filtersCount(f: MobileFilters): number {
  return f.orgs.size + f.batches.size + (f.status ? 1 : 0) + (f.kpi ? 1 : 0);
}

/* ─── KPI dots row ─────────────────────────────────────────────────────── */

function KpiDots({ card, t, dark }: { card: CardRow; t: T; dark: boolean }) {
  const green = dark ? '#34D399' : '#16A34A';
  const blue  = t.blue;
  const empty = dark ? 'rgba(255,255,255,0.10)' : '#E5E7EB';

  const dot = (state: 'done' | 'progress' | 'none') => {
    const bg = state === 'done' ? green : state === 'progress' ? blue : empty;
    return <span style={{ width: 8, height: 8, borderRadius: '50%', background: bg, flexShrink: 0 }} />;
  };

  const k1: 'done' | 'progress' | 'none' = card.kpi1 === true ? 'done' : 'none';
  const k2: 'done' | 'progress' | 'none' = card.kpi2 === true ? 'done' : 'none';
  const k3: 'done' | 'progress' | 'none' =
    card.kpi3 === true ? 'done' :
    typeof card.kpi3 === 'number' ? 'progress' : 'none';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {dot(k1)}
      {dot(k2)}
      {dot(k3)}
    </div>
  );
}

/* ─── Card list row ────────────────────────────────────────────────────── */

function CardListRow({
  card, isLast, t, dark, onTap,
}: { card: CardRow; isLast: boolean; t: T; dark: boolean; onTap: () => void }) {
  const last4 = card.cardNumber.slice(-4);
  const sellerName = card.seller === '—' ? null : card.seller;
  const clientName = card.client === '—' ? null : card.client;
  const statusLine = sellerName && clientName
    ? `${sellerName} → ${clientName}`
    : sellerName
      ? `${sellerName} → —`
      : '—';

  const showStatusBadge = card.status === 'На складе' || card.status === 'У продавца';
  const statusPalette = dark
    ? {
        'На складе':  { bg: 'rgba(160,165,184,0.15)', fg: '#A0A5B8' },
        'У продавца': { bg: 'rgba(251,191,36,0.15)',  fg: '#FBBF24' },
      }
    : {
        'На складе':  { bg: '#F3F4F6', fg: '#4B5563' },
        'У продавца': { bg: '#FFFBEB', fg: '#B45309' },
      };

  const isKpi3Done = card.kpi3 === true;
  const isKpi3InProgress = typeof card.kpi3 === 'number';

  return (
    <div
      onClick={onTap}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
        cursor: 'pointer',
      }}
    >
      {/* Card icon 40×40 rounded */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: t.blueLt,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <CreditCard size={20} color={t.blue} strokeWidth={2} />
      </div>

      {/* Middle: number + status line */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.mono, fontSize: 14, fontWeight: 500, color: t.text1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          •••• {last4}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {statusLine}
        </div>
      </div>

      {/* Right: KPI dots + status or KPI3 value */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <KpiDots card={card} t={t} dark={dark} />
        {showStatusBadge ? (
          <span style={{
            fontFamily: F.inter, fontSize: 10, fontWeight: 500,
            padding: '2px 7px', borderRadius: 8,
            background: statusPalette[card.status as 'На складе' | 'У продавца'].bg,
            color: statusPalette[card.status as 'На складе' | 'У продавца'].fg,
            whiteSpace: 'nowrap',
          }}>
            {card.status}
          </span>
        ) : isKpi3Done ? (
          <span style={{
            fontFamily: F.mono, fontSize: 11, fontWeight: 500,
            color: dark ? '#34D399' : '#16A34A',
          }}>
            ✅ {card.spent !== '—' ? card.spent.split(' ').slice(0, -1).join(' ') + 'K' : ''}
          </span>
        ) : isKpi3InProgress ? (
          <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 600, color: t.blue }}>
            {card.kpi3 as number}%
          </span>
        ) : null}
      </div>

      <ChevronRight size={18} color={t.textDisabled} strokeWidth={1.75} style={{ flexShrink: 0 }} />
    </div>
  );
}

/* ─── Filter sheet ─────────────────────────────────────────────────────── */

function CheckboxRow({ label, checked, onToggle, isLast, t }: {
  label: string; checked: boolean; onToggle: () => void; isLast: boolean; t: T;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
        cursor: 'pointer',
      }}
    >
      <span style={{ fontFamily: F.inter, fontSize: 15, color: t.text1 }}>{label}</span>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        border: `1.5px solid ${checked ? t.blue : t.inputBorder}`,
        background: checked ? t.blue : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.12s', flexShrink: 0,
      }}>
        {checked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
      </div>
    </div>
  );
}

function RadioRow({ label, selected, onSelect, isLast, t }: {
  label: string; selected: boolean; onSelect: () => void; isLast: boolean; t: T;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
        cursor: 'pointer',
      }}
    >
      <span style={{ fontFamily: F.inter, fontSize: 15, color: t.text1 }}>{label}</span>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        border: `1.5px solid ${selected ? t.blue : t.inputBorder}`,
        background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.12s', flexShrink: 0,
      }}>
        {selected && (
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.blue }} />
        )}
      </div>
    </div>
  );
}

function FilterSection({ title, children, t }: { title: string; children: React.ReactNode; t: T }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontFamily: F.inter, fontSize: 11, fontWeight: 600, color: t.text3,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        padding: '12px 16px 8px',
      }}>
        {title}
      </div>
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
        margin: '0 16px', overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function MobileFilterSheet({
  open, initial, t, dark, onClose, onApply,
}: {
  open: boolean;
  initial: MobileFilters;
  t: T;
  dark: boolean;
  onClose: () => void;
  onApply: (f: MobileFilters) => void;
}) {
  const [draft, setDraft] = useState<MobileFilters>(initial);

  useEffect(() => {
    if (open) setDraft({ ...initial, orgs: new Set(initial.orgs), batches: new Set(initial.batches) });
  }, [open, initial]);

  if (!open) return null;

  const toggleOrg = (org: string) => {
    const next = new Set(draft.orgs);
    next.has(org) ? next.delete(org) : next.add(org);
    setDraft({ ...draft, orgs: next });
  };
  const toggleBatch = (b: string) => {
    const next = new Set(draft.batches);
    next.has(b) ? next.delete(b) : next.add(b);
    setDraft({ ...draft, batches: next });
  };

  const statusOpts = ['Все', 'На складе', 'У продавца', 'Продана', 'Зарег.', 'Активна'];
  const kpiOpts    = ['Все', 'Без KPI', 'KPI 1 ✅', 'KPI 2 ✅', 'KPI 3 ✅'];

  const activeCount = filtersCount(draft);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: t.pageBg,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header Y-02 V4 — X close + title + Сбросить */}
      <div style={{
        height: 56, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 8px',
        background: t.surface, borderBottom: `1px solid ${t.border}`,
      }}>
        <button
          onClick={onClose}
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={22} color={t.text1} strokeWidth={2} />
        </button>
        <span style={{ fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1 }}>
          Фильтры
        </span>
        <button
          onClick={() => setDraft(EMPTY_FILTERS)}
          style={{
            height: 40, padding: '0 12px', borderRadius: 10,
            border: 'none', background: 'transparent',
            fontFamily: F.inter, fontSize: 14, fontWeight: 500, color: t.blue,
            cursor: 'pointer',
          }}
        >
          Сбросить
        </button>
      </div>

      {/* Scrollable sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0 16px' }}>
        <FilterSection title="Организация" t={t}>
          {ORGANIZATIONS.map((org, i) => (
            <CheckboxRow
              key={org}
              label={org}
              checked={draft.orgs.has(org)}
              onToggle={() => toggleOrg(org)}
              isLast={i === ORGANIZATIONS.length - 1}
              t={t}
            />
          ))}
        </FilterSection>

        <FilterSection title="Партия" t={t}>
          {BATCHES.map((b, i) => (
            <CheckboxRow
              key={b}
              label={b}
              checked={draft.batches.has(b)}
              onToggle={() => toggleBatch(b)}
              isLast={i === BATCHES.length - 1}
              t={t}
            />
          ))}
        </FilterSection>

        <FilterSection title="Статус" t={t}>
          {statusOpts.map((s, i) => (
            <RadioRow
              key={s}
              label={s}
              selected={(s === 'Все' && !draft.status) || draft.status === s}
              onSelect={() => setDraft({ ...draft, status: s === 'Все' ? '' : s })}
              isLast={i === statusOpts.length - 1}
              t={t}
            />
          ))}
        </FilterSection>

        <FilterSection title="KPI прогресс" t={t}>
          {kpiOpts.map((k, i) => (
            <RadioRow
              key={k}
              label={k}
              selected={(k === 'Все' && !draft.kpi) || draft.kpi === k}
              onSelect={() => setDraft({ ...draft, kpi: k === 'Все' ? '' : k })}
              isLast={i === kpiOpts.length - 1}
              t={t}
            />
          ))}
        </FilterSection>
      </div>

      {/* Sticky footer */}
      <div style={{
        flexShrink: 0, padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
        background: t.surface, borderTop: `1px solid ${t.border}`,
        display: 'flex', gap: 10,
      }}>
        <button
          onClick={() => setDraft(EMPTY_FILTERS)}
          style={{
            flex: 1, height: 48, borderRadius: 12,
            border: `1px solid ${t.inputBorder}`, background: 'transparent',
            fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1,
            cursor: 'pointer',
          }}
        >
          Сбросить
        </button>
        <button
          onClick={() => onApply(draft)}
          style={{
            flex: 2, height: 48, borderRadius: 12,
            border: 'none', background: t.blue,
            fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: '#FFFFFF',
            cursor: 'pointer',
          }}
        >
          {activeCount > 0 ? `Применить (${activeCount})` : 'Применить'}
        </button>
      </div>
    </div>
  );
}

/* ─── Mobile header (Y-02 V2) + main content ─────────────────────────── */

function MobileAllCards({
  t, dark, navigate,
}: { t: T; dark: boolean; navigate: (p: string) => void }) {
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [filters, setFilters] = useState<MobileFilters>(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const active = filtersCount(filters);

  const onSearchFocus = () => {
    setSearchFocused(true);
    setTimeout(() => {
      searchWrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  };

  const matchesFilters = (c: CardRow) => {
    if (filters.orgs.size && !filters.orgs.has(c.organization)) return false;
    if (filters.status) {
      if (c.status !== filters.status) return false;
    }
    if (filters.kpi) {
      const k3Done = c.kpi3 === true;
      if (filters.kpi === 'Без KPI' && (c.kpi1 || c.kpi2 || c.kpi3 !== null)) return false;
      if (filters.kpi === 'KPI 1 ✅' && !c.kpi1) return false;
      if (filters.kpi === 'KPI 2 ✅' && !c.kpi2) return false;
      if (filters.kpi === 'KPI 3 ✅' && !k3Done) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!c.cardNumber.includes(search) &&
          !c.client.toLowerCase().includes(q) &&
          !c.seller.toLowerCase().includes(q)) return false;
    }
    return true;
  };

  const visible = CARDS.filter(matchesFilters);
  const today = visible.slice(0, 5);
  const yesterday = visible.slice(5);

  const stickyHeaderBg = t.surface;

  return (
    <>
      {/* Header Y-02 V2 — back + centered title + search/filter icons */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 8px',
        background: stickyHeaderBg, borderBottom: `1px solid ${t.border}`,
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={24} color={t.text1} strokeWidth={2} />
        </button>

        <span style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1,
          whiteSpace: 'nowrap',
        }}>
          Все карты
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => searchWrapRef.current?.querySelector('input')?.focus()}
            style={{
              width: 40, height: 40, borderRadius: 10,
              border: 'none', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Search size={20} color={t.text2} strokeWidth={2} />
          </button>
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              position: 'relative', width: 40, height: 40, borderRadius: 10,
              border: 'none', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={20} color={t.text2} strokeWidth={2} />
            {active > 0 && (
              <span style={{
                position: 'absolute', top: 4, right: 4,
                minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999,
                background: t.blue, border: `2px solid ${t.surface}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: F.inter, fontSize: 10, fontWeight: 700, color: '#FFFFFF', lineHeight: 1,
              }}>
                {active}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ padding: '12px 0 96px', boxSizing: 'border-box', width: '100%' }}>
        {/* Search bar */}
        <div ref={searchWrapRef} style={{ padding: '0 16px 14px' }}>
          <div style={{
            height: 44, borderRadius: 12,
            background: dark ? '#2D3148' : '#F3F4F6',
            padding: '0 14px',
            display: 'flex', alignItems: 'center', gap: 8,
            boxSizing: 'border-box',
            border: searchFocused ? `1.5px solid ${t.blue}` : '1.5px solid transparent',
            transition: 'border-color 0.12s',
          }}>
            <Search size={18} color={t.text3} strokeWidth={2} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={onSearchFocus}
              onBlur={() => setSearchFocused(false)}
              placeholder="Поиск по номеру карты..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                fontFamily: F.inter, fontSize: 15, color: t.text1,
              }}
            />
          </div>
        </div>

        {/* Stat pill row — horizontal scroll */}
        <div style={{
          display: 'flex', gap: 8, overflowX: 'auto',
          padding: '0 16px 4px', scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}>
          {([
            { label: 'Всего',       val: '5 000', variant: 'neutral' as const },
            { label: 'На складе',   val: '1 260', variant: 'neutral' as const },
            { label: 'У продавцов', val: '1 400', variant: 'neutral' as const },
            { label: 'Продано',     val: '2 340', variant: 'success' as const },
            { label: 'KPI 3 ✅',    val: '567',   variant: 'neutral' as const },
          ]).map(p => {
            const cfg = p.variant === 'success'
              ? (dark
                  ? { bg: 'rgba(52,211,153,0.12)', color: '#34D399', border: 'transparent' }
                  : { bg: C.successBg, color: '#15803D', border: '#BBF7D0' })
              : (dark
                  ? { bg: 'transparent', color: D.text2, border: D.border }
                  : { bg: '#F3F4F6', color: C.text2, border: C.border });
            return (
              <div key={p.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 10,
                background: cfg.bg, border: `1px solid ${cfg.border}`,
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                <span style={{ fontFamily: F.inter, fontSize: 12, color: t.text3 }}>{p.label}:</span>
                <span style={{ fontFamily: F.mono, fontSize: 13, fontWeight: 600, color: cfg.color }}>
                  {p.val}
                </span>
              </div>
            );
          })}
        </div>

        {/* СЕГОДНЯ section */}
        {today.length > 0 && (
          <>
            <div style={{
              fontFamily: F.inter, fontSize: 11, fontWeight: 600, color: t.text3,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              padding: '20px 20px 8px',
            }}>
              Сегодня
            </div>
            <div style={{
              background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
              margin: '0 16px', overflow: 'hidden',
            }}>
              {today.map((c, i) => (
                <CardListRow
                  key={c.id}
                  card={c}
                  isLast={i === today.length - 1}
                  t={t}
                  dark={dark}
                  onTap={() => navigate(`/card-detail/${c.id}`)}
                />
              ))}
            </div>
          </>
        )}

        {/* ВЧЕРА section */}
        {yesterday.length > 0 && (
          <>
            <div style={{
              fontFamily: F.inter, fontSize: 11, fontWeight: 600, color: t.text3,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              padding: '20px 20px 8px',
            }}>
              Вчера
            </div>
            <div style={{
              background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
              margin: '0 16px', overflow: 'hidden',
            }}>
              {yesterday.map((c, i) => (
                <CardListRow
                  key={c.id}
                  card={c}
                  isLast={i === yesterday.length - 1}
                  t={t}
                  dark={dark}
                  onTap={() => navigate(`/card-detail/${c.id}`)}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {visible.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text2, marginBottom: 4 }}>
              Ничего не найдено
            </div>
            <div style={{ fontFamily: F.inter, fontSize: 14, color: t.text3 }}>
              Попробуйте изменить фильтры или поиск
            </div>
          </div>
        )}
      </div>

      {/* Filter sheet */}
      <MobileFilterSheet
        open={sheetOpen}
        initial={filters}
        t={t}
        dark={dark}
        onClose={() => setSheetOpen(false)}
        onApply={(f) => { setFilters(f); setSheetOpen(false); }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function AllCardsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const mobile = useIsMobile();
  const t = theme(darkMode);
  const dark = darkMode;

  const [search, setSearch] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kpiFilter, setKpiFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const [exportHover, setExportHover] = useState(false);

  const navigate = useNavigate();

  const handleRowClick = (id: number) => {
    navigate(`/card-detail/${id}`);
  };

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

        {mobile ? (
          <MobileAllCards t={t} dark={dark} navigate={navigate} />
        ) : (
        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Все карты</span>
          </div>

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
                Все карты
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
                Полный реестр карт в системе
              </p>
            </div>

            <button
              onMouseEnter={() => setExportHover(true)}
              onMouseLeave={() => setExportHover(false)}
              style={{
                height: '40px',
                padding: '0 18px',
                border: `1px solid ${exportHover ? t.blue : t.border}`,
                borderRadius: '8px',
                background: exportHover ? t.blueLt : 'transparent',
                fontFamily: F.inter,
                fontSize: '14px',
                fontWeight: 500,
                color: exportHover ? t.blue : t.text2,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                flexShrink: 0,
                transition: 'all 0.12s',
              }}
            >
              <Download size={16} strokeWidth={1.75} />
              Экспорт в Excel
            </button>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}>
            <StatPill label="Всего"      value="5 000" variant="neutral" t={t} dark={dark} />
            <StatPill label="На складе"  value="1 260" variant="neutral" t={t} dark={dark} />
            <StatPill label="У продавцов" value="1 400" variant="neutral" t={t} dark={dark} />
            <StatPill label="Продано"    value="2 340" variant="success" t={t} dark={dark} />
            <StatPill label="KPI 3 ✅"   value="567"   variant="neutral" t={t} dark={dark} />
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '24px',
          }}>
            <div style={{ position: 'relative', width: '300px', flexShrink: 0 }}>
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
                placeholder="Поиск по номеру карты или клиенту..."
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

            <FilterSelect label="Организация: Все" options={ORGANIZATIONS} value={orgFilter}    onChange={setOrgFilter}    t={t} />
            <FilterSelect label="Партия: Все"      options={BATCHES}       value={batchFilter}  onChange={setBatchFilter}  t={t} />
            <FilterSelect label="Статус: Все"      options={STATUSES}      value={statusFilter} onChange={setStatusFilter} t={t} />
            <FilterSelect label="KPI прогресс: Все" options={KPI_PROGRESS} value={kpiFilter}    onChange={setKpiFilter}    t={t} />

            {(search || orgFilter || batchFilter || statusFilter || kpiFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setOrgFilter('');
                  setBatchFilter('');
                  setStatusFilter('');
                  setKpiFilter('');
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontFamily: F.inter,
                  fontSize: '13px',
                  color: t.text3,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'color 0.12s, background 0.12s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget.style.color = t.text1);
                  (e.currentTarget.style.background = dark ? D.tableHover : '#F3F4F6');
                }}
                onMouseLeave={e => {
                  (e.currentTarget.style.color = t.text3);
                  (e.currentTarget.style.background = 'transparent');
                }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1, marginTop: '-1px' }}>×</span>
                Сбросить
              </button>
            )}
          </div>

          <DataTable cards={CARDS} onRowClick={handleRowClick} t={t} dark={dark} />

          <div style={{
            marginTop: '16px',
            fontFamily: F.inter,
            fontSize: '13px',
            color: t.text3,
            textAlign: 'center',
          }}>
            Показано 1–10 из 5 000
          </div>

          <div style={{ height: '48px' }} />
        </div>
        )}
      </div>
    </div>
  );
}
