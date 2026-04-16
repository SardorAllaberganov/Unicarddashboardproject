import React, { useState } from 'react';
import {
  ChevronRight, ChevronDown, Download, Search, Check,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
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
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function AllCardsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
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
      </div>
    </div>
  );
}
