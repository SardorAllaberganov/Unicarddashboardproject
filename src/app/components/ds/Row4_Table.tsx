import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight, Check, Minus, Calendar, X, Filter, SlidersHorizontal } from 'lucide-react';
import { F, C } from './tokens';

function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500, padding: '2px 10px', borderRadius: '10px', background: bg, color, display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function Avatar({ initials, color = '#2563EB', bg = '#EFF6FF' }: any) {
  return (
    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: F.inter, fontSize: '10px', fontWeight: 600, color }}>{initials}</span>
    </div>
  );
}

function KpiCell({ status, progress }: { status: 'done' | 'in-progress' | 'none'; progress?: number }) {
  if (status === 'done') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Check size={10} color="#FFFFFF" strokeWidth={3} />
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '12px', color: '#10B981' }}>Выполнено</span>
    </div>
  );
  if (status === 'in-progress') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <div style={{ width: '48px', height: '4px', borderRadius: '2px', background: '#E5E7EB', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#3B82F6', borderRadius: '2px' }} />
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '12px', color: '#374151' }}>{progress}%</span>
    </div>
  );
  return <Minus size={14} color="#D1D5DB" />;
}

const tableData = [
  {
    id: 1, cardNumber: '•••• 1001', seller: { name: 'Абдуллох Рашидов', initials: 'АР' },
    org: 'Mysafar OOO', status: { label: 'Активна', bg: '#F0FDF4', color: '#15803D' },
    kpi1: 'done', kpi2: 'done', kpi3: { status: 'in-progress', progress: 64 },
    amount: '1 825 000', date: '02.04.2026',
  },
  {
    id: 2, cardNumber: '•••• 1002', seller: { name: 'Камола Юсупова', initials: 'КЮ' },
    org: 'Alif Group', status: { label: 'Продана', bg: '#ECFEFF', color: '#0E7490' },
    kpi1: 'done', kpi2: { status: 'in-progress', progress: 38 }, kpi3: 'none',
    amount: '950 000', date: '04.04.2026',
  },
  {
    id: 3, cardNumber: '•••• 1003', seller: { name: 'Бобур Назаров', initials: 'БН' },
    org: 'TechCom LLC', status: { label: 'Активна', bg: '#F0FDF4', color: '#15803D' },
    kpi1: 'done', kpi2: 'done', kpi3: 'done',
    amount: '2 500 000', date: '01.04.2026',
  },
  {
    id: 4, cardNumber: '•••• 1004', seller: { name: 'Дилноза Алиева', initials: 'ДА' },
    org: 'Mysafar OOO', status: { label: 'На паузе', bg: '#FFFBEB', color: '#B45309' },
    kpi1: { status: 'in-progress', progress: 12 }, kpi2: 'none', kpi3: 'none',
    amount: '0', date: '07.04.2026',
  },
  {
    id: 5, cardNumber: '•••• 1005', seller: { name: 'Санжар Холматов', initials: 'СХ' },
    org: 'Alif Group', status: { label: 'Неактивна', bg: '#FEF2F2', color: '#DC2626' },
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

function FilterBar() {
  const [search, setSearch] = useState('');
  const [filtersActive] = useState(true);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '0' }}>
      {/* Search */}
      <div style={{ position: 'relative', width: '280px' }}>
        <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          placeholder="Поиск по карте или продавцу..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', height: '40px', paddingLeft: '36px', paddingRight: '12px',
            border: `1px solid #D1D5DB`, borderRadius: '8px', background: '#FFFFFF',
            fontFamily: F.inter, fontSize: '14px', color: '#111827', outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Status Filter */}
      <div style={{ position: 'relative' }}>
        <select style={{ height: '40px', padding: '0 36px 0 12px', border: `1px solid #D1D5DB`, borderRadius: '8px', background: '#FFFFFF', fontFamily: F.inter, fontSize: '14px', color: '#374151', outline: 'none', appearance: 'none', cursor: 'pointer', minWidth: '140px' }}>
          <option>Статус</option>
          <option>Активна</option>
          <option>Неактивна</option>
        </select>
        <ChevronDown size={14} color="#6B7280" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>

      {/* Org Filter */}
      <div style={{ position: 'relative' }}>
        <select style={{ height: '40px', padding: '0 36px 0 12px', border: `1px solid #D1D5DB`, borderRadius: '8px', background: '#FFFFFF', fontFamily: F.inter, fontSize: '14px', color: '#374151', outline: 'none', appearance: 'none', cursor: 'pointer', minWidth: '160px' }}>
          <option>Организация</option>
          <option>Mysafar OOO</option>
          <option>Alif Group</option>
        </select>
        <ChevronDown size={14} color="#6B7280" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      </div>

      {/* Date Range */}
      <button style={{ height: '40px', padding: '0 14px', border: `1px solid #D1D5DB`, borderRadius: '8px', background: '#FFFFFF', fontFamily: F.inter, fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
        <Calendar size={16} color="#6B7280" />
        01.04 — 13.04.2026
      </button>

      {/* KPI Progress */}
      <div style={{ position: 'relative' }}>
        <button style={{ height: '40px', padding: '0 14px', border: `1px solid #D1D5DB`, borderRadius: '8px', background: '#FFFFFF', fontFamily: F.inter, fontSize: '14px', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', position: 'relative' }}>
          <SlidersHorizontal size={16} color="#6B7280" />
          KPI прогресс
          {filtersActive && (
            <span style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: '#2563EB', color: '#FFFFFF', fontFamily: F.inter, fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
          )}
        </button>
      </div>

      {/* Clear filters */}
      {filtersActive && (
        <button style={{ border: 'none', background: 'none', fontFamily: F.inter, fontSize: '13px', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <X size={14} />
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}

function DataTable() {
  const [sortCol, setSortCol] = useState('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  function renderKpi(val: any) {
    if (val === 'done') return <KpiCell status="done" />;
    if (val === 'none') return <KpiCell status="none" />;
    if (typeof val === 'object') return <KpiCell status="in-progress" progress={val.progress} />;
    return null;
  }

  return (
    <div>
      {/* Table */}
      <div style={{ background: '#FFFFFF', border: `1px solid #E5E7EB`, borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: `1px solid #E5E7EB` }}>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && setSortCol(col.key)}
                    style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                      color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em',
                      whiteSpace: 'nowrap', cursor: col.sortable ? 'pointer' : 'default',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {col.label}
                      {col.sortable && (
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <ChevronUp size={10} color={sortCol === col.key && sortDir === 'asc' ? '#111827' : '#D1D5DB'} />
                          <ChevronDown size={10} color={sortCol === col.key && sortDir === 'desc' ? '#111827' : '#D1D5DB'} />
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: `1px solid #E5E7EB`,
                    background: i % 2 === 1 ? '#FAFBFC' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                  onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 1 ? '#FAFBFC' : '#FFFFFF')}
                >
                  {/* Card Number - Mono */}
                  <td style={{ padding: '12px 16px', height: '48px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 500, color: '#111827' }}>{row.cardNumber}</span>
                  </td>
                  {/* Seller - Avatar + Name */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Avatar initials={row.seller.initials} />
                      <span style={{ fontFamily: F.inter, fontSize: '14px', color: '#374151' }}>{row.seller.name}</span>
                    </div>
                  </td>
                  {/* Org - Plain text */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: F.inter, fontSize: '14px', color: '#374151' }}>{row.org}</span>
                  </td>
                  {/* Status - Badge */}
                  <td style={{ padding: '12px 16px' }}>
                    <Badge label={row.status.label} bg={row.status.bg} color={row.status.color} />
                  </td>
                  {/* KPI Cells */}
                  <td style={{ padding: '12px 16px' }}>{renderKpi(row.kpi1)}</td>
                  <td style={{ padding: '12px 16px' }}>{renderKpi(row.kpi2)}</td>
                  <td style={{ padding: '12px 16px' }}>{renderKpi(row.kpi3)}</td>
                  {/* Amount - Mono */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 500, color: '#111827' }}>{row.amount}</span>
                  </td>
                  {/* Date */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontFamily: F.inter, fontSize: '14px', color: '#374151' }}>{row.date}</span>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}>
                      <MoreHorizontal size={16} color="#9CA3AF" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid #E5E7EB`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF' }}>
          <span style={{ fontFamily: F.inter, fontSize: '13px', color: '#6B7280' }}>
            Показано 1–10 из 5 000
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PageBtn label="←" onClick={() => setPage(p => Math.max(1, p - 1))} />
            {[1, 2, 3].map(p => (
              <PageBtn key={p} label={String(p)} active={page === p} onClick={() => setPage(p)} />
            ))}
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: '#9CA3AF', padding: '0 4px' }}>...</span>
            <PageBtn label="500" onClick={() => setPage(500)} />
            <PageBtn label="→" onClick={() => setPage(p => p + 1)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PageBtn({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '32px', height: '32px', borderRadius: '6px',
        border: active ? `1px solid #2563EB` : `1px solid #E5E7EB`,
        background: active ? '#EFF6FF' : '#FFFFFF',
        color: active ? '#2563EB' : '#374151',
        fontFamily: F.inter, fontSize: '13px', fontWeight: active ? 600 : 400,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {label}
    </button>
  );
}

export function Row4Table() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827' }}>
            Data Table — All cell types + Filter bar + Pagination
          </div>
        </div>
        <FilterBar />
        <DataTable />
      </div>
    </div>
  );
}
