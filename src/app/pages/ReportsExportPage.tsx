import React, { useState } from 'react';
import {
  ChevronRight, ChevronDown, FileSpreadsheet, Eye, Building2, Users,
  CreditCard, Wallet, TrendingUp, Clock,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';
import { DateRangePicker } from '../components/DateRangePicker';
import { useExportToast } from '../components/useExportToast';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

interface ReportCard {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'blue' | 'violet' | 'green' | 'amber' | 'cyan' | 'rose';
  filters: Array<'dateRange' | 'organization' | 'status' | 'kpiStep'>;
}

const REPORTS: ReportCard[] = [
  {
    id: 'organizations',
    icon: Building2,
    title: 'Отчёт по организациям',
    description: 'Сводка по всем организациям: карты, продажи, KPI, начисления.',
    color: 'blue',
    filters: ['dateRange'],
  },
  {
    id: 'sellers',
    icon: Users,
    title: 'Отчёт по продавцам',
    description: 'Детализация по каждому продавцу: карты, KPI прогресс, заработок.',
    color: 'violet',
    filters: ['dateRange', 'organization'],
  },
  {
    id: 'cards',
    icon: CreditCard,
    title: 'Отчёт по картам',
    description: 'Полный реестр карт со статусами, KPI прогрессом, финансами.',
    color: 'green',
    filters: ['dateRange', 'organization', 'status'],
  },
  {
    id: 'rewards',
    icon: Wallet,
    title: 'Отчёт по вознаграждениям',
    description: 'Все начисления и выводы средств по продавцам.',
    color: 'amber',
    filters: ['dateRange', 'organization', 'kpiStep'],
  },
  {
    id: 'funnel',
    icon: TrendingUp,
    title: 'KPI воронка конверсии',
    description: 'Воронка от выдачи до выполнения KPI 3 по организациям.',
    color: 'cyan',
    filters: ['dateRange', 'organization'],
  },
  {
    id: 'overdue',
    icon: Clock,
    title: 'Просроченные KPI',
    description: 'Карты с истёкшим сроком выполнения KPI (30 дней).',
    color: 'rose',
    filters: ['dateRange', 'organization', 'kpiStep'],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, options, t }: { label: string; options: string[]; t: T }) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');

  return (
    <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
      <select
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
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
   REPORT CARD
═══════════════════════════════════════════════════════════════════════════ */

const COLOR_MAP_LIGHT = {
  blue:   { bg: '#EFF6FF', iconColor: '#2563EB' },
  violet: { bg: '#F5F3FF', iconColor: '#7C3AED' },
  green:  { bg: '#F0FDF4', iconColor: '#16A34A' },
  amber:  { bg: '#FFFBEB', iconColor: '#D97706' },
  cyan:   { bg: '#ECFEFF', iconColor: '#0891B2' },
  rose:   { bg: '#FFF1F2', iconColor: '#E11D48' },
} as const;

const COLOR_MAP_DARK = {
  blue:   { bg: 'rgba(59,130,246,0.15)',  iconColor: '#3B82F6' },
  violet: { bg: 'rgba(167,139,250,0.15)', iconColor: '#A78BFA' },
  green:  { bg: 'rgba(52,211,153,0.15)',  iconColor: '#34D399' },
  amber:  { bg: 'rgba(251,191,36,0.15)',  iconColor: '#FBBF24' },
  cyan:   { bg: 'rgba(34,211,238,0.15)',  iconColor: '#22D3EE' },
  rose:   { bg: 'rgba(251,113,133,0.15)', iconColor: '#FB7185' },
} as const;

function ReportCardComponent({ report, onExport, t, dark }: {
  report: ReportCard;
  onExport: (reportId: string, title: string, range: { from: string; to: string }) => void;
  t: T;
  dark: boolean;
}) {
  const [filtersExpanded] = useState(true);
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-13' });
  const [downloadHover, setDownloadHover] = useState(false);
  const [previewHover, setPreviewHover] = useState(false);
  const navigate = useNavigate();

  const cfg = (dark ? COLOR_MAP_DARK : COLOR_MAP_LIGHT)[report.color];
  const Icon = report.icon;
  const previewHoverBg = dark ? D.tableHover : '#F3F4F6';

  const filterLabels = {
    dateRange: null,
    organization: { label: 'Организация: Все', options: ['Mysafar', 'Unired', 'Express', 'SmartCard'] },
    status:       { label: 'Статус: Все',       options: ['Активна', 'На складе', 'У продавца', 'Продана'] },
    kpiStep:      { label: 'KPI этап: Все',     options: ['KPI 1', 'KPI 2', 'KPI 3'] },
  };

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: cfg.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={22} color={cfg.iconColor} strokeWidth={2} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: F.dm,
            fontSize: '16px',
            fontWeight: 600,
            color: t.text1,
            marginBottom: '4px',
          }}>
            {report.title}
          </div>
          <div style={{
            fontFamily: F.inter,
            fontSize: '13px',
            color: t.text3,
            lineHeight: 1.5,
          }}>
            {report.description}
          </div>
        </div>
      </div>

      {filtersExpanded && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {report.filters.includes('dateRange') && <DateRangePicker value={dateRange} onChange={setDateRange} />}
          {report.filters.filter(f => f !== 'dateRange').map(filterType => {
            const filterConfig = filterLabels[filterType];
            if (!filterConfig) return null;
            return (
              <FilterSelect
                key={filterType}
                label={filterConfig.label}
                options={filterConfig.options}
                t={t}
              />
            );
          })}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
      }}>
        <button
          onMouseEnter={() => setDownloadHover(true)}
          onMouseLeave={() => setDownloadHover(false)}
          onClick={() => onExport(report.id, report.title, dateRange)}
          style={{
            height: '40px',
            padding: '0 18px',
            border: `1px solid ${downloadHover ? t.blue : t.border}`,
            borderRadius: '8px',
            background: downloadHover ? t.blueLt : 'transparent',
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: downloadHover ? t.blue : t.text2,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            transition: 'all 0.12s',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <FileSpreadsheet size={16} strokeWidth={1.75} />
          Скачать Excel
        </button>

        <button
          onMouseEnter={() => setPreviewHover(true)}
          onMouseLeave={() => setPreviewHover(false)}
          onClick={() => {
            if (report.id === 'overdue') navigate('/reports/overdue-kpi');
            else navigate(`/reports/preview/${report.id}?from=${dateRange.from}&to=${dateRange.to}`);
          }}
          style={{
            height: '40px',
            padding: '0 18px',
            border: 'none',
            borderRadius: '8px',
            background: previewHover ? previewHoverBg : 'transparent',
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: previewHover ? t.text1 : t.text3,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            transition: 'all 0.12s',
            flexShrink: 0,
          }}
        >
          <Eye size={16} strokeWidth={1.75} />
          Предпросмотр
        </button>
      </div>

    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function ReportsExportPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const navigate = useNavigate();
  const exportToast = useExportToast();

  const handleExport = (reportId: string, title: string, range: { from: string; to: string }) => {
    exportToast.start({
      subtitle: `${title} за ${range.from.slice(5).replace('-', '.')}–${range.to.slice(5).replace('-', '.')}.2026`,
      fileName: `report_${reportId}_${range.from.slice(0, 7)}.xlsx`,
      fileSize: '245 KB',
    });
  };

  const captionBg = dark ? D.tableAlt : '#FAFBFC';

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
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Отчёты и экспорт</span>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
              Отчёты и экспорт
            </h1>
            <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
              Формирование и скачивание отчётов по продажам и KPI
            </p>
          </div>

          <style>{`
            .reports-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              margin-bottom: 24px;
            }
            @media (max-width: 768px) {
              .reports-grid {
                grid-template-columns: 1fr;
              }
            }
          `}</style>

          <div className="reports-grid">
            {REPORTS.map(report => (
              <ReportCardComponent key={report.id} report={report} onExport={handleExport} t={t} dark={dark} />
            ))}
          </div>

          <div style={{
            fontFamily: F.inter,
            fontSize: '13px',
            color: t.text3,
            textAlign: 'center',
            padding: '16px',
            background: captionBg,
            border: `1px solid ${t.border}`,
            borderRadius: '8px',
          }}>
            📋 Все отчёты экспортируются в формате .xlsx с форматированием и автофильтрами.
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      {exportToast.node}
    </div>
  );
}
