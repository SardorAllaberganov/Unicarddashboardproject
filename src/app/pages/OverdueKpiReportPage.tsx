import React, { useState } from 'react';
import {
  ChevronRight, ChevronDown, Download,
  Clock, AlertTriangle, XCircle, Check,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useNavigate } from 'react-router';
import { useExportToast } from '../components/useExportToast';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

interface OverdueRow {
  id: number;
  last4: string;
  org: string;
  seller: string;
  client: string;
  soldDate: string;
  dueDate: string;
  overdueDays: number;
  overdueKpi: 'KPI 1' | 'KPI 2' | 'KPI 3';
  lastKpi: string;
  topup: string;
  spent: string;
}

const ROWS: OverdueRow[] = [
  { id: 2105, last4: '2105', org: 'Unired Mkt',    seller: 'Мухаммад', client: 'Фаррух М.', soldDate: '01.03', dueDate: '31.03', overdueDays: 13, overdueKpi: 'KPI 2', lastKpi: 'KPI 1 ✅', topup: '200 000', spent: '80 000' },
  { id: 3078, last4: '3078', org: 'Express',        seller: 'Бобур',    client: 'Шахзод Р.', soldDate: '28.02', dueDate: '30.03', overdueDays: 14, overdueKpi: 'KPI 3', lastKpi: 'KPI 2 ✅', topup: '450 000', spent: '310 000' },
  { id: 4012, last4: '4012', org: 'Mysafar OOO',    seller: 'Абдуллох', client: 'Дилшод К.', soldDate: '25.02', dueDate: '27.03', overdueDays: 17, overdueKpi: 'KPI 2', lastKpi: 'KPI 1 ✅', topup: '180 000', spent: '60 000' },
  { id: 5067, last4: '5067', org: 'Digital Pay',    seller: 'Камол',    client: 'Ислом Т.',  soldDate: '20.02', dueDate: '22.03', overdueDays: 22, overdueKpi: 'KPI 1', lastKpi: '—',         topup: '—',       spent: '—' },
  { id: 6189, last4: '6189', org: 'SmartCard',      seller: 'Нодира',   client: 'Азиза А.',  soldDate: '18.02', dueDate: '20.03', overdueDays: 24, overdueKpi: 'KPI 3', lastKpi: 'KPI 2 ✅', topup: '620 000', spent: '410 000' },
  { id: 7221, last4: '7221', org: 'PayVerse',       seller: 'Сардор',   client: 'Мадина Н.', soldDate: '12.02', dueDate: '14.03', overdueDays: 30, overdueKpi: 'KPI 2', lastKpi: 'KPI 1 ✅', topup: '100 000', spent: '40 000' },
  { id: 8033, last4: '8033', org: 'Mysafar OOO',    seller: 'Санжар',   client: 'Нурбек Ш.', soldDate: '05.02', dueDate: '07.03', overdueDays: 37, overdueKpi: 'KPI 3', lastKpi: 'KPI 2 ✅', topup: '700 000', spent: '490 000' },
  { id: 9147, last4: '9147', org: 'Express',        seller: 'Дарья',    client: '—',          soldDate: '01.02', dueDate: '03.03', overdueDays: 41, overdueKpi: 'KPI 1', lastKpi: '—',         topup: '—',       spent: '—' },
  { id: 1056, last4: '1056', org: 'Unired Mkt',    seller: 'Мухаммад', client: 'Карим Ю.',  soldDate: '10.03', dueDate: '09.04', overdueDays: 5,  overdueKpi: 'KPI 3', lastKpi: 'KPI 2 ✅', topup: '340 000', spent: '220 000' },
  { id: 2289, last4: '2289', org: 'CardPlus',      seller: 'Лола',     client: 'Фарход А.', soldDate: '12.03', dueDate: '11.04', overdueDays: 3,  overdueKpi: 'KPI 2', lastKpi: 'KPI 1 ✅', topup: '150 000', spent: '50 000' },
];

const ORG_LIST = ['Mysafar OOO', 'Unired Mkt', 'Express', 'Digital Pay', 'SmartCard', 'PayVerse', 'CardPlus'];
const KPI_STAGES = ['KPI 1', 'KPI 2', 'KPI 3'];
const OVERDUE_RANGES = ['1–7 дней', '8–14 дней', '15–30 дней', '> 30 дней'];

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

const STAT_VARIANTS_LIGHT = {
  error: { color: C.error,   bg: C.errorBg,    border: '#FECACA' },
  amber: { color: '#D97706', bg: '#FFFBEB',    border: '#FDE68A' },
  rose:  { color: '#E11D48', bg: '#FFF1F2',    border: '#FECDD3' },
} as const;

const STAT_VARIANTS_DARK = {
  error: { color: '#F87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)' },
  amber: { color: '#FBBF24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)' },
  rose:  { color: '#FB7185', bg: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.25)' },
} as const;

function StatCard({ icon: Icon, variant, label, value, t, dark }: {
  icon: React.ElementType;
  variant: keyof typeof STAT_VARIANTS_LIGHT;
  label: string;
  value: string;
  t: T; dark: boolean;
}) {
  const v = (dark ? STAT_VARIANTS_DARK : STAT_VARIANTS_LIGHT)[variant];
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '14px', flex: 1,
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: v.bg, border: `1px solid ${v.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={v.color} strokeWidth={1.75} />
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '26px', fontWeight: 700, color: t.text1, lineHeight: 1.2 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, value, onChange, minWidth, t }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; minWidth?: string;
  t: T;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          height: '40px', padding: '0 36px 0 12px',
          border: `1px solid ${focused ? t.blue : t.inputBorder}`,
          borderRadius: '8px', background: t.surface,
          fontFamily: F.inter, fontSize: '13px',
          color: value ? t.text1 : t.text3,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          minWidth: minWidth ?? '170px',
        }}
      >
        <option value="">{label}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} color={t.text3} style={{
        position: 'absolute', right: '12px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

function BadgeError({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const bg = dark ? 'rgba(248,113,113,0.12)' : C.errorBg;
  const color = dark ? '#F87171' : '#B91C1C';
  const border = dark ? 'rgba(248,113,113,0.25)' : '#FECACA';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 9px', borderRadius: '8px',
      background: bg, color,
      border: `1px solid ${border}`,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function BadgeSuccess({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const bg = dark ? 'rgba(52,211,153,0.12)' : C.successBg;
  const color = dark ? '#34D399' : '#15803D';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 9px', borderRadius: '8px',
      background: bg, color,
      whiteSpace: 'nowrap',
    }}>
      <Check size={10} strokeWidth={3} />
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function OverdueKpiReportPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const [org, setOrg] = useState('');
  const [kpiStage, setKpiStage] = useState('');
  const [overdueRange, setOverdueRange] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [hovRow, setHovRow] = useState<number | null>(null);
  const [exportHov, setExportHov] = useState(false);
  const navigate = useNavigate();
  const exportToast = useExportToast();

  const th: React.CSSProperties = {
    padding: '11px 14px', textAlign: 'left',
    fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
    color: t.text3, textTransform: 'uppercase', letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
  };
  const td: React.CSSProperties = {
    padding: '12px 14px', whiteSpace: 'nowrap',
    fontFamily: F.inter, fontSize: '13px', color: t.text1,
  };
  const tdMono: React.CSSProperties = {
    padding: '12px 14px', whiteSpace: 'nowrap',
    fontFamily: F.mono, fontSize: '12px', color: t.text2,
  };

  const headerRowBg = dark ? D.tableHeaderBg : '#F9FAFB';
  const rowHoverBg = dark ? D.tableHover : '#F9FAFB';
  const clearHoverBg = dark ? D.tableHover : '#F3F4F6';
  const errorColor = dark ? '#F87171' : C.error;

  const triggerExport = () => {
    exportToast.start({
      subtitle: 'Просроченные KPI за период',
      fileName: 'report_overdue-kpi_2026-04.xlsx',
      fileSize: '188 KB',
    });
  };

  const inRange = (d: number, range: string): boolean => {
    if (range === '1–7 дней')   return d >= 1 && d <= 7;
    if (range === '8–14 дней')  return d >= 8 && d <= 14;
    if (range === '15–30 дней') return d >= 15 && d <= 30;
    if (range === '> 30 дней')  return d > 30;
    return true;
  };

  const orgMap: Record<string, string> = {
    'Mysafar OOO': 'Mysafar OOO',
    'Unired Mkt': 'Unired Mkt',
    'Express': 'Express',
    'Digital Pay': 'Digital Pay',
    'SmartCard': 'SmartCard',
    'PayVerse': 'PayVerse',
    'CardPlus': 'CardPlus',
  };

  const visible = ROWS
    .filter(r => !org || orgMap[r.org] === org)
    .filter(r => !kpiStage || r.overdueKpi === kpiStage)
    .filter(r => !overdueRange || inRange(r.overdueDays, overdueRange))
    .sort((a, b) => sortDesc ? b.overdueDays - a.overdueDays : a.overdueDays - b.overdueDays);

  const clearFilters = () => { setOrg(''); setKpiStage(''); setOverdueRange(''); };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/reports')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Отчёты</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Просроченные KPI</span>
          </div>

          {/* Title + Export */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '22px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Просроченные KPI
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
                Карты с истёкшим сроком выполнения KPI
              </p>
            </div>

            <button
              onMouseEnter={() => setExportHov(true)}
              onMouseLeave={() => setExportHov(false)}
              onClick={triggerExport}
              aria-label="Экспорт"
              style={{
                height: '40px', padding: '0 16px',
                border: `1px solid ${exportHov ? t.blue : t.border}`,
                borderRadius: '8px',
                background: exportHov ? t.blueLt : t.surface,
                fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                color: exportHov ? t.blue : t.text1,
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
              }}
            >
              <Download size={14} strokeWidth={1.75} />
              Экспорт
            </button>
          </div>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <StatCard icon={Clock}          variant="error" label="Всего просрочено"     value="127 карт" t={t} dark={dark} />
            <StatCard icon={AlertTriangle}  variant="amber" label="KPI 1 просрочен"       value="23"       t={t} dark={dark} />
            <StatCard icon={XCircle}        variant="rose"  label="KPI 2–3 просрочены"    value="104"      t={t} dark={dark} />
          </div>

          {/* Filter bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '18px' }}>
            <FilterSelect label="Организация: Все"   options={ORG_LIST}        value={org}          onChange={setOrg}          t={t} />
            <FilterSelect label="KPI этап: Все"       options={KPI_STAGES}      value={kpiStage}     onChange={setKpiStage}     t={t} />
            <FilterSelect label="Дней просрочки: Все" options={OVERDUE_RANGES}  value={overdueRange} onChange={setOverdueRange} t={t} />

            {(org || kpiStage || overdueRange) && (
              <button
                onClick={clearFilters}
                style={{
                  border: 'none', background: 'none',
                  fontFamily: F.inter, fontSize: '13px', color: t.text3,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '4px 8px', borderRadius: '6px',
                  transition: 'color 0.12s, background 0.12s',
                }}
                onMouseEnter={e => { (e.currentTarget.style.color = t.text1); (e.currentTarget.style.background = clearHoverBg); }}
                onMouseLeave={e => { (e.currentTarget.style.color = t.text3); (e.currentTarget.style.background = 'none'); }}
              >
                <span style={{ fontSize: '16px', lineHeight: 1 }}>×</span>
                Сбросить
              </button>
            )}

            <span style={{ marginLeft: 'auto', fontFamily: F.inter, fontSize: '13px', color: t.text4 }}>
              <span style={{ fontFamily: F.mono, color: t.text2 }}>{visible.length}</span> из <span style={{ fontFamily: F.mono, color: t.text2 }}>{ROWS.length}</span>
            </span>
          </div>

          {/* Table */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '12px', overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1300px' }}>
                <thead>
                  <tr style={{ background: headerRowBg, borderBottom: `1px solid ${t.border}` }}>
                    <th style={th}>Карта</th>
                    <th style={th}>Организация</th>
                    <th style={th}>Продавец</th>
                    <th style={th}>Клиент</th>
                    <th style={th}>Продана</th>
                    <th style={th}>Срок истёк</th>
                    <th style={th}>
                      <button
                        onClick={() => setSortDesc(s => !s)}
                        aria-label="Сортировать по дням просрочки"
                        style={{
                          background: 'none', border: 'none', padding: 0,
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                          color: t.text3, textTransform: 'uppercase', letterSpacing: '0.04em',
                          cursor: 'pointer',
                        }}
                      >
                        Дней просрочки
                        <ChevronDown
                          size={13}
                          style={{ transform: sortDesc ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.15s' }}
                        />
                      </button>
                    </th>
                    <th style={th}>Просроченный KPI</th>
                    <th style={th}>Последний KPI</th>
                    <th style={th}>Пополнено</th>
                    <th style={th}>Расход</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map(r => {
                    const hov = hovRow === r.id;
                    return (
                      <tr
                        key={r.id}
                        onMouseEnter={() => setHovRow(r.id)}
                        onMouseLeave={() => setHovRow(null)}
                        onClick={() => navigate(`/card-detail/${r.id}`)}
                        style={{
                          borderBottom: `1px solid ${t.border}`,
                          background: hov ? rowHoverBg : t.surface,
                          cursor: 'pointer', transition: 'background 0.1s',
                        }}
                      >
                        <td style={tdMono}>...{r.last4}</td>
                        <td style={td}>{r.org}</td>
                        <td style={td}>{r.seller}</td>
                        <td style={td}>{r.client}</td>
                        <td style={tdMono}>{r.soldDate}</td>
                        <td style={tdMono}>{r.dueDate}</td>
                        <td style={{ ...td, color: errorColor, fontWeight: 600 }}>
                          {r.overdueDays} {r.overdueDays === 1 ? 'день' : r.overdueDays < 5 ? 'дня' : 'дней'}
                        </td>
                        <td style={td}><BadgeError dark={dark}>{r.overdueKpi}</BadgeError></td>
                        <td style={td}>
                          {r.lastKpi === '—'
                            ? <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>—</span>
                            : <BadgeSuccess dark={dark}>{r.lastKpi.replace(' ✅', '')}</BadgeSuccess>
                          }
                        </td>
                        <td style={tdMono}>{r.topup}</td>
                        <td style={tdMono}>{r.spent}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '14px', flexWrap: 'wrap', gap: '10px',
          }}>
            <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Показано <span style={{ fontFamily: F.mono, color: t.text1 }}>1–{visible.length}</span> из{' '}
              <span style={{ fontFamily: F.mono, color: t.text1 }}>127</span>
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1, 2, 3, '...', 13].map((p, i) => (
                <PageBtn key={i} active={p === 1} t={t} dark={dark}>{p}</PageBtn>
              ))}
            </div>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      {exportToast.node}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGINATION
═══════════════════════════════════════════════════════════════════════════ */

function PageBtn({ children, active, t, dark }: { children: React.ReactNode; active?: boolean; t: T; dark: boolean }) {
  const [hov, setHov] = useState(false);
  const hoverBg = dark ? D.tableHover : '#F9FAFB';
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        minWidth: '32px', height: '32px', padding: '0 8px',
        border: `1px solid ${active ? t.blue : t.border}`,
        background: active ? t.blue : hov ? hoverBg : t.surface,
        color: active ? '#fff' : t.text2,
        fontFamily: F.inter, fontSize: '12px', fontWeight: active ? 600 : 500,
        borderRadius: '7px', cursor: 'pointer',
        transition: 'all 0.12s',
      }}
    >
      {children}
    </button>
  );
}
