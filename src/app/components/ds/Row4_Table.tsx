import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, MoreHorizontal, Check, Minus, Calendar, X, SlidersHorizontal } from 'lucide-react';
import { F, C, D, theme } from './tokens';
import { useDarkMode } from '../useDarkMode';

type T = ReturnType<typeof theme>;

/* ─── Status pill palettes ────────────────────────────────────────────── */

type StatusKey = 'Активна' | 'Продана' | 'На паузе' | 'Неактивна';

const STATUS_STYLE_LIGHT: Record<StatusKey, { bg: string; color: string }> = {
  'Активна':   { bg: '#F0FDF4', color: '#15803D' },
  'Продана':   { bg: '#ECFEFF', color: '#0E7490' },
  'На паузе':  { bg: '#FFFBEB', color: '#B45309' },
  'Неактивна': { bg: '#FEF2F2', color: '#DC2626' },
};
const STATUS_STYLE_DARK: Record<StatusKey, { bg: string; color: string }> = {
  'Активна':   { bg: 'rgba(52,211,153,0.12)',  color: '#34D399' },
  'Продана':   { bg: 'rgba(34,211,238,0.12)',  color: '#22D3EE' },
  'На паузе':  { bg: 'rgba(251,191,36,0.12)',  color: '#FBBF24' },
  'Неактивна': { bg: 'rgba(248,113,113,0.12)', color: '#F87171' },
};

function StatusBadge({ label, dark }: { label: StatusKey; dark: boolean }) {
  const s = (dark ? STATUS_STYLE_DARK : STATUS_STYLE_LIGHT)[label];
  return (
    <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500, padding: '2px 10px', borderRadius: '10px', background: s.bg, color: s.color, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function Avatar({ initials, t }: { initials: string; t: T }) {
  return (
    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: t.blueLt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: F.inter, fontSize: '10px', fontWeight: 600, color: t.blue }}>{initials}</span>
    </div>
  );
}

function KpiCell({ status, progress, t }: { status: 'done' | 'in-progress' | 'none'; progress?: number; t: T }) {
  if (status === 'done') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: t.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Check size={10} color="#FFFFFF" strokeWidth={3} />
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.success }}>Выполнено</span>
    </div>
  );
  if (status === 'in-progress') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ width: '48px', height: '4px', borderRadius: '2px', background: t.progressTrack, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: t.blue, borderRadius: '2px' }} />
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text2 }}>{progress}%</span>
    </div>
  );
  return <Minus size={14} color={t.textDisabled} />;
}

const tableData: Array<{
  id: number;
  cardNumber: string;
  seller: { name: string; initials: string };
  org: string;
  status: StatusKey;
  kpi1: any;
  kpi2: any;
  kpi3: any;
  amount: string;
  date: string;
}> = [
  {
    id: 1, cardNumber: '•••• 1001', seller: { name: 'Абдуллох Рашидов', initials: 'АР' },
    org: 'Mysafar OOO', status: 'Активна',
    kpi1: 'done', kpi2: 'done', kpi3: { status: 'in-progress', progress: 64 },
    amount: '1 825 000', date: '02.04.2026',
  },
  {
    id: 2, cardNumber: '•••• 1002', seller: { name: 'Камола Юсупова', initials: 'КЮ' },
    org: 'Alif Group', status: 'Продана',
    kpi1: 'done', kpi2: { status: 'in-progress', progress: 38 }, kpi3: 'none',
    amount: '950 000', date: '04.04.2026',
  },
  {
    id: 3, cardNumber: '•••• 1003', seller: { name: 'Бобур Назаров', initials: 'БН' },
    org: 'TechCom LLC', status: 'Активна',
    kpi1: 'done', kpi2: 'done', kpi3: 'done',
    amount: '2 500 000', date: '01.04.2026',
  },
  {
    id: 4, cardNumber: '•••• 1004', seller: { name: 'Дилноза Алиева', initials: 'ДА' },
    org: 'Mysafar OOO', status: 'На паузе',
    kpi1: { status: 'in-progress', progress: 12 }, kpi2: 'none', kpi3: 'none',
    amount: '0', date: '07.04.2026',
  },
  {
    id: 5, cardNumber: '•••• 1005', seller: { name: 'Санжар Холматов', initials: 'СХ' },
    org: 'Alif Group', status: 'Неактивна',
    kpi1: 'none', kpi2: 'none', kpi3: 'none',
    amount: '0', date: '09.04.2026',
  },
];

const columns = [
  { key: 'cardNumber', label: 'КАРТА', sortable: true },
  { key: 'seller', label: 'ПРОДАВЕЦ', sortable: true },
  { key: 'org', label: 'ОРГАНИЗАЦИЯ', sortable: true },
  { key: 'status', label: 'СТАТУС', sortable: false },
  { key: 'kpi1', label: 'KPI 1', sortable: false },
  { key: 'kpi2', label: 'KPI 2', sortable: false },
  { key: 'kpi3', label: 'KPI 3', sortable: false },
  { key: 'amount', label: 'СУММА', sortable: true },
  { key: 'date', label: 'ДАТА', sortable: true },
  { key: 'actions', label: '', sortable: false },
];

function FilterBar({ t }: { t: T }) {
  const [search, setSearch] = useState('');
  const [filtersActive] = useState(true);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '0' }}>
      {/* Search */}
      <div style={{ position: 'relative', width: '280px' }}>
        <Search size={16} color={t.text4} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          placeholder="Поиск по карте или продавцу..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', height: '40px', paddingLeft: '36px', paddingRight: '12px',
            border: `1px solid ${t.inputBorder}`, borderRadius: '8px', background: t.surface,
            fontFamily: F.inter, fontSize: '14px', color: t.text1, outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Status Filter */}
      <div style={{ position: 'relative' }}>
        <select style={{ height: '40px', padding: '0 36px 0 12px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', background: t.surface, fontFamily: F.inter, fontSize: '14px', color: t.text2, outline: 'none', appearance: 'none', cursor: 'pointer', minWidth: '140px' }}>
          <option>Статус</option>
          <option>Активна</option>
          <option>Неактивна</option>
        </select>
        <ChevronDown size={14} color={t.text3} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>

      {/* Org Filter */}
      <div style={{ position: 'relative' }}>
        <select style={{ height: '40px', padding: '0 36px 0 12px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', background: t.surface, fontFamily: F.inter, fontSize: '14px', color: t.text2, outline: 'none', appearance: 'none', cursor: 'pointer', minWidth: '160px' }}>
          <option>Организация</option>
          <option>Mysafar OOO</option>
          <option>Alif Group</option>
        </select>
        <ChevronDown size={14} color={t.text3} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>

      {/* Date Range */}
      <button style={{ height: '40px', padding: '0 14px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', background: t.surface, fontFamily: F.inter, fontSize: '14px', color: t.text2, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <Calendar size={16} color={t.text3} />
        01.04 — 13.04.2026
      </button>

      {/* KPI Progress */}
      <div style={{ position: 'relative' }}>
        <button style={{ height: '40px', padding: '0 14px', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', background: t.surface, fontFamily: F.inter, fontSize: '14px', color: t.text2, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', position: 'relative' }}>
          <SlidersHorizontal size={16} color={t.text3} />
          KPI прогресс
          {filtersActive && (
            <span style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: t.blue, color: '#FFFFFF', fontFamily: F.inter, fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
          )}
        </button>
      </div>

      {/* Clear filters */}
      {filtersActive && (
        <button style={{ border: 'none', background: 'none', fontFamily: F.inter, fontSize: '13px', color: t.text3, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <X size={14} />
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}

function DataTable({ t, dark }: { t: T; dark: boolean }) {
  const [sortCol, setSortCol] = useState('date');
  const [sortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  function renderKpi(val: any) {
    if (val === 'done') return <KpiCell status="done" t={t} />;
    if (val === 'none') return <KpiCell status="none" t={t} />;
    if (typeof val === 'object') return <KpiCell status="in-progress" progress={val.progress} t={t} />;
    return null;
  }

  return (
    <div>
      {/* Table */}
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && setSortCol(col.key)}
                    style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                      color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em',
                      whiteSpace: 'nowrap', cursor: col.sortable ? 'pointer' : 'default',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {col.label}
                      {col.sortable && (
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <ChevronUp size={10} color={sortCol === col.key && sortDir === 'asc' ? t.text1 : t.textDisabled} />
                          <ChevronDown size={10} color={sortCol === col.key && sortDir === 'desc' ? t.text1 : t.textDisabled} />
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => {
                const baseBg = i % 2 === 1 ? t.tableAlt : t.surface;
                return (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: `1px solid ${t.border}`,
                      background: baseBg,
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = t.tableHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = baseBg)}
                  >
                    {/* Card Number - Mono */}
                    <td style={{ padding: '12px 16px', height: '48px' }}>
                      <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 500, color: t.text1 }}>{row.cardNumber}</span>
                    </td>
                    {/* Seller - Avatar + Name */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar initials={row.seller.initials} t={t} />
                        <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>{row.seller.name}</span>
                      </div>
                    </td>
                    {/* Org - Plain text */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>{row.org}</span>
                    </td>
                    {/* Status - Badge */}
                    <td style={{ padding: '12px 16px' }}>
                      <StatusBadge label={row.status} dark={dark} />
                    </td>
                    {/* KPI Cells */}
                    <td style={{ padding: '12px 16px' }}>{renderKpi(row.kpi1)}</td>
                    <td style={{ padding: '12px 16px' }}>{renderKpi(row.kpi2)}</td>
                    <td style={{ padding: '12px 16px' }}>{renderKpi(row.kpi3)}</td>
                    {/* Amount - Mono */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 500, color: t.text1 }}>{row.amount}</span>
                    </td>
                    {/* Date */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>{row.date}</span>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '12px 16px' }}>
                      <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                        <MoreHorizontal size={16} color={t.text4} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: t.surface }}>
          <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
            Показано 1–10 из 5 000
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PageBtn label="←" onClick={() => setPage(p => Math.max(1, p - 1))} t={t} />
            {[1, 2, 3].map(p => (
              <PageBtn key={p} label={String(p)} active={page === p} onClick={() => setPage(p)} t={t} />
            ))}
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text4, padding: '0 4px' }}>...</span>
            <PageBtn label="500" onClick={() => setPage(500)} t={t} />
            <PageBtn label="→" onClick={() => setPage(p => p + 1)} t={t} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PageBtn({ label, active, onClick, t }: { label: string; active?: boolean; onClick?: () => void; t: T }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '32px', height: '32px', borderRadius: '6px',
        border: active ? `1px solid ${t.blue}` : `1px solid ${t.border}`,
        background: active ? t.blueLt : t.surface,
        color: active ? t.blue : t.text2,
        fontFamily: F.inter, fontSize: '13px', fontWeight: active ? 600 : 400,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {label}
    </button>
  );
}

export function Row4Table() {
  const [dark] = useDarkMode();
  const t = theme(dark);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1 }}>
            Data Table — All cell types + Filter bar + Pagination
          </div>
        </div>
        <FilterBar t={t} />
        <DataTable t={t} dark={dark} />
      </div>
    </div>
  );
}
