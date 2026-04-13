import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, FileSpreadsheet, Eye, Building2, Users,
  CreditCard, Wallet, TrendingUp, Clock,
} from 'lucide-react';
import { BankAdminSidebar } from '../components/BankAdminSidebar';
import { F, C } from '../components/ds/tokens';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';
import { DateRangePicker } from '../components/DateRangePicker';

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

function FilterSelect({ label, options }: { label: string; options: string[] }) {
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
   REPORT CARD
═══════════════════════════════════════════════════════════════════════════ */

function ReportCardComponent({ report }: { report: ReportCard }) {
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [downloadHover, setDownloadHover] = useState(false);
  const [previewHover, setPreviewHover] = useState(false);

  const colorMap = {
    blue: { bg: C.blueLt, iconColor: C.blue },
    violet: { bg: '#F5F3FF', iconColor: '#7C3AED' },
    green: { bg: C.successBg, iconColor: C.success },
    amber: { bg: '#FFFBEB', iconColor: '#D97706' },
    cyan: { bg: '#ECFEFF', iconColor: '#0891B2' },
    rose: { bg: '#FFF1F2', iconColor: '#E11D48' },
  };

  const cfg = colorMap[report.color];
  const Icon = report.icon;

  const filterLabels = {
    dateRange: null, // Rendered separately
    organization: { label: 'Организация: Все', options: ['Mysafar', 'Unired', 'Express', 'SmartCard'] },
    status: { label: 'Статус: Все', options: ['Активна', 'На складе', 'У продавца', 'Продана'] },
    kpiStep: { label: 'KPI этап: Все', options: ['KPI 1', 'KPI 2', 'KPI 3'] },
  };

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Icon + Title + Description */}
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
            color: C.text1,
            marginBottom: '4px',
          }}>
            {report.title}
          </div>
          <div style={{
            fontFamily: F.inter,
            fontSize: '13px',
            color: C.text3,
            lineHeight: 1.5,
          }}>
            {report.description}
          </div>
        </div>
      </div>

      {/* Filters */}
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
              />
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
      }}>
        <button
          onMouseEnter={() => setDownloadHover(true)}
          onMouseLeave={() => setDownloadHover(false)}
          style={{
            height: '40px',
            padding: '0 18px',
            border: `1px solid ${downloadHover ? C.blue : C.border}`,
            borderRadius: '8px',
            background: downloadHover ? C.blueLt : C.surface,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: downloadHover ? C.blue : C.text2,
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
          style={{
            height: '40px',
            padding: '0 18px',
            border: 'none',
            borderRadius: '8px',
            background: previewHover ? '#F3F4F6' : 'transparent',
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: previewHover ? C.text1 : C.text3,
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
  const [darkMode, setDarkMode] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-13' });
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <BankAdminSidebar
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
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Отчёты и экспорт</span>
          </div>

          {/* Top Bar */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
              Отчёты и экспорт
            </h1>
            <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
              Формирование и скачивание отчётов по продажам и KPI
            </p>
          </div>

          {/* Report Cards Grid */}
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
              <ReportCardComponent key={report.id} report={report} />
            ))}
          </div>

          {/* Caption */}
          <div style={{
            fontFamily: F.inter,
            fontSize: '13px',
            color: C.text3,
            textAlign: 'center',
            padding: '16px',
            background: '#FAFBFC',
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
          }}>
            📋 Все отчёты экспортируются в формате .xlsx с форматированием и автофильтрами.
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}
