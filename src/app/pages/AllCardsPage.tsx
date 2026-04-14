import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, Download, Search, Check,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';

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

function StatPill({ label, value, variant = 'neutral' }: {
  label: string;
  value: string | number;
  variant?: 'neutral' | 'success';
}) {
  const colors = {
    neutral: { bg: '#F3F4F6', color: C.text2, border: C.border },
    success: { bg: C.successBg, color: '#15803D', border: '#BBF7D0' },
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
        color: C.text3,
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
   STATUS BADGE
═══════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ status }: { status: CardStatus }) {
  const configs: Record<CardStatus, { bg: string; color: string; dot: string }> = {
    'Активна': { bg: C.successBg, color: '#15803D', dot: C.success },
    'Зарег.': { bg: C.infoBg, color: '#0E7490', dot: C.info },
    'У продавца': { bg: C.warningBg, color: '#B45309', dot: C.warning },
    'На складе': { bg: '#F3F4F6', color: '#374151', dot: '#9CA3AF' },
    'Продана': { bg: C.infoBg, color: '#0E7490', dot: C.info },
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
   TYPE BADGE
═══════════════════════════════════════════════════════════════════════════ */

function TypeBadge({ type }: { type: string }) {
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
      border: `1px solid ${C.border}`,
      color: C.text2,
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

function KPICheckCell({ value }: { value: boolean | number | null }) {
  if (value === null) {
    return (
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text4 }}>—</span>
    );
  }

  if (value === true) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '4px',
          background: C.success,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Check size={10} color="#FFFFFF" strokeWidth={3} />
        </div>
      </div>
    );
  }

  // Progress percentage
  const percentage = value as number;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
      <div style={{
        flex: 1,
        height: '6px',
        borderRadius: '3px',
        background: '#E5E7EB',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: C.blue,
          borderRadius: '3px',
        }} />
      </div>
      <span style={{
        fontFamily: F.mono,
        fontSize: '11px',
        color: C.text3,
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

function DataTable({ cards, onRowClick }: { cards: CardRow[]; onRowClick: (id: number) => void }) {
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
        minWidth: '1400px',
      }}>
        <thead>
          <tr style={{
            background: '#FAFBFC',
            borderBottom: `1px solid ${C.border}`,
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
                borderBottom: `1px solid ${C.border}`,
                background: hoveredRow === card.id ? '#FAFBFC' : C.surface,
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
            >
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text1 }}>
                  ...{card.cardNumber.slice(-4)}
                </span>
              </td>
              <td style={dataCellStyle}>
                <TypeBadge type={card.type} />
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                  {card.organization}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                  {card.seller}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                  {card.client}
                </span>
              </td>
              <td style={dataCellStyle}>
                <StatusBadge status={card.status} />
              </td>
              <td style={dataCellStyle}>
                <KPICheckCell value={card.kpi1} />
              </td>
              <td style={dataCellStyle}>
                <KPICheckCell value={card.kpi2} />
              </td>
              <td style={dataCellStyle}>
                <KPICheckCell value={card.kpi3} />
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
                  {card.topup}
                </span>
              </td>
              <td style={dataCellStyle}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
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
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function AllCardsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Все карты</span>
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
                Все карты
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
                Полный реестр карт в системе
              </p>
            </div>

            <button
              onMouseEnter={() => setExportHover(true)}
              onMouseLeave={() => setExportHover(false)}
              style={{
                height: '40px',
                padding: '0 18px',
                border: `1px solid ${exportHover ? C.blue : C.border}`,
                borderRadius: '8px',
                background: exportHover ? C.blueLt : C.surface,
                fontFamily: F.inter,
                fontSize: '14px',
                fontWeight: 500,
                color: exportHover ? C.blue : C.text2,
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

          {/* Stat Pills */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}>
            <StatPill label="Всего" value="5 000" variant="neutral" />
            <StatPill label="На складе" value="1 260" variant="neutral" />
            <StatPill label="У продавцов" value="1 400" variant="neutral" />
            <StatPill label="Продано" value="2 340" variant="success" />
            <StatPill label="KPI 3 ✅" value="567" variant="neutral" />
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
                placeholder="Поиск по номеру карты или клиенту..."
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
              label="Организация: Все"
              options={ORGANIZATIONS}
              value={orgFilter}
              onChange={setOrgFilter}
            />

            <FilterSelect
              label="Партия: Все"
              options={BATCHES}
              value={batchFilter}
              onChange={setBatchFilter}
            />

            <FilterSelect
              label="Статус: Все"
              options={STATUSES}
              value={statusFilter}
              onChange={setStatusFilter}
            />

            <FilterSelect
              label="KPI прогресс: Все"
              options={KPI_PROGRESS}
              value={kpiFilter}
              onChange={setKpiFilter}
            />

            {/* Clear filters */}
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
          <DataTable cards={CARDS} onRowClick={handleRowClick} />

          {/* Pagination */}
          <div style={{
            marginTop: '16px',
            fontFamily: F.inter,
            fontSize: '13px',
            color: C.text3,
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
