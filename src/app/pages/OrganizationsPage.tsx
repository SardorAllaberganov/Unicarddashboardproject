import React, { useState } from 'react';
import {
  Search, ChevronDown, ChevronUp, ChevronRight,
  Plus, Building2,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

type StatusKey = 'Активна' | 'На паузе' | 'Неактивна';

interface OrgRow {
  id: number;
  name: string;
  contact: string;
  phone: string;
  issued: number;
  sold: number;
  kpiDone: number;
  rewarded: string;
  status: StatusKey;
}

const ORG_DATA: OrgRow[] = [
  { id: 1, name: 'Mysafar OOO',      contact: 'Рустам Алиев',     phone: '+998 90 123 45 67', issued: 500, sold: 230, kpiDone: 45, rewarded: '1 825 000', status: 'Активна' },
  { id: 2, name: 'Unired Marketing', contact: 'Лола Каримова',    phone: '+998 91 234 56 78', issued: 500, sold: 310, kpiDone: 78, rewarded: '2 740 000', status: 'Активна' },
  { id: 3, name: 'Express Finance',  contact: 'Тимур Насыров',    phone: '+998 93 345 67 89', issued: 400, sold: 180, kpiDone: 32, rewarded: '1 370 000', status: 'Активна' },
  { id: 4, name: 'Digital Pay',      contact: 'Азиз Хамидов',     phone: '+998 94 456 78 90', issued: 300, sold: 120, kpiDone: 22, rewarded: '920 000',   status: 'На паузе' },
  { id: 5, name: 'SmartCard Group',  contact: 'Нодира Усманова',  phone: '+998 95 567 89 01', issued: 500, sold: 290, kpiDone: 68, rewarded: '2 440 000', status: 'Активна' },
  { id: 6, name: 'PayVerse',         contact: 'Бахром Шарипов',   phone: '+998 90 678 90 12', issued: 350, sold: 145, kpiDone: 28, rewarded: '1 085 000', status: 'Активна' },
  { id: 7, name: 'FinBridge',        contact: 'Дилноза Ахмедова', phone: '+998 91 789 01 23', issued: 200, sold: 55,  kpiDone: 8,  rewarded: '395 000',   status: 'Неактивна' },
  { id: 8, name: 'CardPlus',         contact: 'Жавлон Турсунов',  phone: '+998 93 890 12 34', issued: 450, sold: 210, kpiDone: 52, rewarded: '1 790 000', status: 'Активна' },
];

const STATUS_STYLE_LIGHT: Record<StatusKey, { bg: string; color: string; dot: string }> = {
  'Активна':    { bg: '#F0FDF4', color: '#15803D', dot: '#16A34A' },
  'На паузе':   { bg: '#FFFBEB', color: '#B45309', dot: '#D97706' },
  'Неактивна':  { bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' },
};
const STATUS_STYLE_DARK: Record<StatusKey, { bg: string; color: string; dot: string }> = {
  'Активна':    { bg: 'rgba(52,211,153,0.12)',  color: '#34D399', dot: '#34D399' },
  'На паузе':   { bg: 'rgba(251,191,36,0.12)',  color: '#FBBF24', dot: '#FBBF24' },
  'Неактивна':  { bg: 'rgba(248,113,113,0.12)', color: '#F87171', dot: '#F87171' },
};

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS BADGE
═══════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ status, dark }: { status: StatusKey; dark: boolean }) {
  const s = (dark ? STATUS_STYLE_DARK : STATUS_STYLE_LIGHT)[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: s.bg, color: s.color, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SELECT COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, value, onChange, t }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; t: T;
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
          height: '40px', padding: '0 36px 0 12px',
          border: `1px solid ${focused ? t.blue : t.inputBorder}`,
          borderRadius: '8px', background: t.surface,
          fontFamily: F.inter, fontSize: '14px', color: t.text2,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${t.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          minWidth: '148px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} color={t.text3} style={{
        position: 'absolute', right: '10px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SORT INDICATOR
═══════════════════════════════════════════════════════════════════════════ */

function SortIcons({ col, sortKey, sortDir, t, dark }: {
  col: string; sortKey: string; sortDir: 'asc' | 'desc'; t: T; dark: boolean;
}) {
  const inactive = dark ? '#3A3F50' : '#D1D5DB';
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: '1px', marginLeft: '3px', verticalAlign: 'middle' }}>
      <ChevronUp size={10} color={sortKey === col && sortDir === 'asc' ? t.blue : inactive} strokeWidth={2} />
      <ChevronDown size={10} color={sortKey === col && sortDir === 'desc' ? t.blue : inactive} strokeWidth={2} />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ORGANIZATIONS TABLE
══════════════════════════════════════════════════════════════════════════ */

function OrgTable({ onRowClick, t, dark }: { onRowClick: (row: OrgRow) => void; t: T; dark: boolean }) {
  const hoverBg = dark ? D.tableHover : '#F9FAFB';
  const chipHoverBg = dark ? D.tableHover : '#F3F4F6';
  const headerBg = dark ? D.tableAlt : C.pageBg;
  const [sortKey, setSortKey]   = useState<string>('id');
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('asc');
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatus] = useState('');
  const [sortFilter, setSortFilter] = useState('');
  const [hovRow, setHovRow]     = useState<number | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filtered = ORG_DATA.filter(row => {
    const q = search.toLowerCase();
    const matchName = row.name.toLowerCase().includes(q) || row.contact.toLowerCase().includes(q);
    const matchStatus = !statusFilter || row.status === statusFilter;
    return matchName && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    let ak: any, bk: any;
    if (sortFilter === 'По названию' || sortKey === 'name') { ak = a.name; bk = b.name; }
    else if (sortFilter === 'По кол-ву карт' || sortKey === 'issued') { ak = a.issued; bk = b.issued; }
    else { ak = a.id; bk = b.id; }
    if (typeof ak === 'string') return sortDir === 'asc' ? ak.localeCompare(bk) : bk.localeCompare(ak);
    return sortDir === 'asc' ? ak - bk : bk - ak;
  });

  const cols: { key: string; label: string; sortable: boolean; align?: 'right'; responsive?: 'tablet' }[] = [
    { key: 'id',       label: '#',               sortable: true  },
    { key: 'name',     label: 'Организация',      sortable: true  },
    { key: 'contact',  label: 'Контактное лицо',  sortable: false, responsive: 'tablet' },
    { key: 'phone',    label: 'Телефон',           sortable: false, responsive: 'tablet' },
    { key: 'issued',   label: 'Карт выдано',       sortable: true,  align: 'right' },
    { key: 'sold',     label: 'Продано',           sortable: true,  align: 'right' },
    { key: 'kpiDone',  label: 'KPI выполнено',     sortable: true,  align: 'right' },
    { key: 'rewarded', label: 'Начислено',         sortable: false, align: 'right' },
    { key: 'status',   label: 'Статус',            sortable: false  },
  ];

  return (
    <div>
      {/* ── Filter bar ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '280px', flexShrink: 0 }}>
          <Search size={16} color={searchFocused ? t.blue : t.text4} style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            transition: 'color 0.12s', pointerEvents: 'none',
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Поиск по названию..."
            style={{
              width: '100%', height: '40px', paddingLeft: '38px', paddingRight: '12px',
              border: `1px solid ${searchFocused ? t.blue : t.inputBorder}`,
              borderRadius: '8px', background: t.surface,
              fontFamily: F.inter, fontSize: '14px', color: t.text1,
              outline: 'none', boxSizing: 'border-box',
              boxShadow: searchFocused ? `0 0 0 3px ${t.blueTint}` : 'none',
              transition: 'border-color 0.12s, box-shadow 0.12s',
            }}
          />
        </div>

        <FilterSelect
          label="Статус: Все"
          options={['Активна', 'Неактивна', 'На паузе']}
          value={statusFilter}
          onChange={setStatus}
          t={t}
        />

        <FilterSelect
          label="Сортировка"
          options={['По названию', 'По дате', 'По кол-ву карт']}
          value={sortFilter}
          onChange={setSortFilter}
          t={t}
        />

        {/* Clear filters */}
        {(search || statusFilter || sortFilter) && (
          <button
            onClick={() => { setSearch(''); setStatus(''); setSortFilter(''); }}
            style={{
              border: 'none', background: 'none',
              fontFamily: F.inter, fontSize: '13px', color: t.text3,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              padding: '4px 8px', borderRadius: '6px',
              transition: 'color 0.12s, background 0.12s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = t.text1; (e.currentTarget as HTMLButtonElement).style.background = chipHoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = t.text3; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <span style={{ fontSize: '16px', lineHeight: 1, marginTop: '-1px' }}>×</span>
            Сбросить
          </button>
        )}
      </div>

      {/* ── Table card ─────────────────────────────────────────── */}
      <div style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <style>{`
          @media (max-width: 1024px) {
            .org-col-tablet { display: none; }
          }
        `}</style>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            {/* ── Head ── */}
            <thead>
              <tr style={{ background: headerBg, borderBottom: `1px solid ${t.border}` }}>
                {cols.map(col => (
                  <th
                    key={col.key}
                    className={col.responsive === 'tablet' ? 'org-col-tablet' : ''}
                    onClick={() => col.sortable && toggleSort(col.key)}
                    style={{
                      padding: col.key === 'id' ? '12px 12px 12px 20px' : '12px 16px',
                      textAlign: col.align === 'right' ? 'right' : 'left',
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                      color: sortKey === col.key ? t.blue : t.text4,
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                      cursor: col.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      width: col.key === 'id' ? '48px' : col.key === 'actions' ? '52px' : undefined,
                    }}
                  >
                    {col.sortable ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        {col.label}
                        <SortIcons col={col.key} sortKey={sortKey} sortDir={sortDir} t={t} dark={dark} />
                      </span>
                    ) : col.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Body ── */}
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={cols.length} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ fontFamily: F.inter, fontSize: '14px', color: t.text4 }}>
                      Ничего не найдено
                    </div>
                  </td>
                </tr>
              ) : sorted.map((row, i) => {
                const hov = hovRow === i;
                return (
                  <tr
                    key={row.id}
                    onMouseEnter={() => setHovRow(i)}
                    onMouseLeave={() => setHovRow(null)}
                    onClick={() => onRowClick(row)}
                    style={{
                      borderBottom: i < sorted.length - 1 ? `1px solid ${t.border}` : 'none',
                      background: hov ? hoverBg : t.surface,
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                  >
                    {/* # */}
                    <td style={{ padding: '14px 12px 14px 20px' }}>
                      <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text4 }}>
                        {row.id}
                      </span>
                    </td>

                    {/* Организация */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '8px',
                          background: t.blueLt, border: `1px solid ${t.blueTint}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <span style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 700, color: t.blue }}>
                            {row.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span style={{
                          fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                          color: hov ? t.blue : t.text1,
                          transition: 'color 0.12s', cursor: 'pointer',
                        }}>
                          {row.name}
                        </span>
                      </div>
                    </td>

                    {/* Контактное лицо */}
                    <td className="org-col-tablet" style={{ padding: '14px 16px' }}>
                      <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>
                        {row.contact}
                      </span>
                    </td>

                    {/* Телефон */}
                    <td className="org-col-tablet" style={{ padding: '14px 16px' }}>
                      <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text3 }}>
                        {row.phone}
                      </span>
                    </td>

                    {/* Карт выдано */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 500, color: t.text1 }}>
                        {row.issued}
                      </span>
                    </td>

                    {/* Продано */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <span style={{ fontFamily: F.mono, fontSize: '14px', color: t.text2 }}>
                        {row.sold}
                      </span>
                    </td>

                    {/* KPI выполнено */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <span style={{
                        fontFamily: F.mono, fontSize: '14px', fontWeight: 600,
                        color: row.kpiDone >= 60 ? (dark ? '#34D399' : '#15803D') : row.kpiDone >= 30 ? t.blue : t.warning,
                      }}>
                        {row.kpiDone}
                      </span>
                    </td>

                    {/* Начислено */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: t.text1 }}>
                        {row.rewarded}
                      </span>
                      <span style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, marginLeft: '4px' }}>
                        UZS
                      </span>
                    </td>

                    {/* Статус */}
                    <td style={{ padding: '14px 16px' }}>
                      <StatusBadge status={row.status} dark={dark} />
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div style={{
          padding: '14px 20px',
          borderTop: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: headerBg,
        }}>
          <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
            Показано{' '}
            <span style={{ fontWeight: 600, color: t.text1 }}>1–{sorted.length}</span>
            {' '}из{' '}
            <span style={{ fontWeight: 600, color: t.text1 }}>{sorted.length}</span>
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PaginationBtn label="←" disabled t={t} dark={dark} />
            <PaginationBtn label="1" active t={t} dark={dark} />
            <PaginationBtn label="→" disabled t={t} dark={dark} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PaginationBtn({ label, active, disabled, t, dark }: {
  label: string; active?: boolean; disabled?: boolean; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const hoverBg = dark ? D.tableHover : '#F3F4F6';
  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        minWidth: '32px', height: '32px', padding: '0 6px',
        borderRadius: '7px',
        border: `1px solid ${active ? t.blue : t.border}`,
        background: active ? t.blueLt : hov && !disabled ? hoverBg : t.surface,
        color: active ? t.blue : disabled ? t.textDisabled : t.text2,
        fontFamily: F.inter, fontSize: '13px', fontWeight: active ? 600 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.12s',
      }}
    >
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function OrganizationsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>

      {/* Responsive sidebar */}
      <style>{`
        .org-sidebar-wrap { flex-shrink: 0; }
        @media (max-width: 768px) { .org-sidebar-wrap { display: none; } }
      `}</style>

      <div className="org-sidebar-wrap">
        <Sidebar role="bank"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(d => !d)}
        />
      </div>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        {/* ── Content ────────────────────────────────────────────── */}
        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>

          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>
              Главная
            </span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
              Организации
            </span>
          </div>

          {/* Page title row */}
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', gap: '16px',
            marginBottom: '28px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Организации
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
                Управление организациями-партнёрами
              </p>
            </div>
            <PrimaryButton t={t} />
          </div>

          {/* Table */}
          <OrgTable onRowClick={row => navigate(`/organizations/${row.id}`)} t={t} dark={dark} />

          <div style={{ height: '40px' }} />
        </div>
      </div>
    </div>
  );
}

function PrimaryButton({ t }: { t: T }) {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => navigate('/organizations/new')}
      style={{
        height: '40px', padding: '0 18px',
        background: hov ? t.blueHover : t.blue,
        border: 'none', borderRadius: '8px',
        fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
        color: '#FFFFFF',
        display: 'flex', alignItems: 'center', gap: '7px',
        cursor: 'pointer', flexShrink: 0,
        boxShadow: hov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
        transition: 'background 0.15s, box-shadow 0.15s',
      }}
    >
      <Plus size={16} strokeWidth={2.25} />
      Добавить организацию
    </button>
  );
}