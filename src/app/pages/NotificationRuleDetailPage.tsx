import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronRight, ChevronLeft, Pencil, Copy, Trash2, MoreVertical,
  Bell, CheckCircle2, Eye, XCircle, Search, RefreshCw, X, ArrowLeft, Check,
  Loader2,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from 'recharts';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { usePopoverPosition } from '../components/usePopoverPosition';
import { DateRangePicker } from '../components/DateRangePicker';
import { INITIAL_RULES, Rule } from './NotificationRulesPage';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & MOCK DATA
═══════════════════════════════════════════════════════════════════════════ */

type ChannelLog = 'Push' | 'In-app' | 'Email' | 'SMS';
type ChannelFilter = 'all' | ChannelLog;

interface FireRow {
  id: number;
  date: string;
  event: string;
  initials: string;
  recipient: string;
  channel: ChannelLog;
  delivered: true | false;
  readAt: string | null;
}

type RetryState = 'idle' | 'confirming' | 'sending' | 'success' | 'failed';

interface ErrorRow {
  id: number;
  date: string;
  initials: string;
  recipient: string;
  channel: ChannelLog;
  reason: string;
  retryState: RetryState;
  retryCount: number;
  deliveredAt: string | null;   // HH:MM after success
  originalReason: string;
}

const FIRE_ROWS: FireRow[] = [
  { id: 1,  date: '13.04 14:32', event: 'KPI 3: карта ...4521 (Абдуллох)', initials: 'АР', recipient: 'Абдуллох Р.',  channel: 'Push',   delivered: true, readAt: '14:35' },
  { id: 2,  date: '13.04 14:32', event: 'KPI 3: карта ...4521 (Абдуллох)', initials: 'АР', recipient: 'Абдуллох Р.',  channel: 'In-app', delivered: true, readAt: '14:33' },
  { id: 3,  date: '13.04 14:32', event: 'KPI 3: карта ...4521 (Абдуллох)', initials: 'РА', recipient: 'Рустам Алиев', channel: 'In-app', delivered: true, readAt: null },
  { id: 4,  date: '13.04 12:10', event: 'KPI 2: карта ...3892 (Санжар)',   initials: 'СМ', recipient: 'Санжар М.',    channel: 'Push',   delivered: true, readAt: '12:15' },
  { id: 5,  date: '13.04 12:10', event: 'KPI 2: карта ...3892 (Санжар)',   initials: 'СМ', recipient: 'Санжар М.',    channel: 'In-app', delivered: true, readAt: '12:12' },
  { id: 6,  date: '12.04 18:45', event: 'KPI 3: карта ...1010 (Нодира)',   initials: 'НУ', recipient: 'Нодира У.',    channel: 'Push',   delivered: false, readAt: null },
  { id: 7,  date: '12.04 18:45', event: 'KPI 3: карта ...1010 (Нодира)',   initials: 'НУ', recipient: 'Нодира У.',    channel: 'In-app', delivered: true, readAt: '18:46' },
  { id: 8,  date: '12.04 16:20', event: 'KPI 1: карта ...7744 (Бобур)',    initials: 'БН', recipient: 'Бобур Н.',     channel: 'Push',   delivered: true, readAt: '16:26' },
  { id: 9,  date: '12.04 16:20', event: 'KPI 1: карта ...7744 (Бобур)',    initials: 'БН', recipient: 'Бобур Н.',     channel: 'In-app', delivered: true, readAt: '16:21' },
  { id: 10, date: '12.04 11:05', event: 'KPI 2: карта ...6611 (Лола)',     initials: 'ЛК', recipient: 'Лола Каримова',channel: 'Push',   delivered: true, readAt: '11:08' },
  { id: 11, date: '12.04 11:05', event: 'KPI 2: карта ...6611 (Лола)',     initials: 'ЛК', recipient: 'Лола Каримова',channel: 'In-app', delivered: true, readAt: '11:06' },
  { id: 12, date: '12.04 09:30', event: 'KPI 3: карта ...5520 (Фаррух)',   initials: 'ФМ', recipient: 'Фаррух М.',    channel: 'Push',   delivered: true, readAt: '09:32' },
  { id: 13, date: '12.04 09:30', event: 'KPI 3: карта ...5520 (Фаррух)',   initials: 'ФМ', recipient: 'Фаррух М.',    channel: 'In-app', delivered: true, readAt: null },
  { id: 14, date: '11.04 20:12', event: 'KPI 1: карта ...8833 (Камола)',   initials: 'КР', recipient: 'Камола Р.',    channel: 'Push',   delivered: true, readAt: '20:15' },
  { id: 15, date: '11.04 20:12', event: 'KPI 1: карта ...8833 (Камола)',   initials: 'КР', recipient: 'Камола Р.',    channel: 'In-app', delivered: true, readAt: '20:13' },
  { id: 16, date: '11.04 14:50', event: 'KPI 2: карта ...2299 (Азиз)',     initials: 'АШ', recipient: 'Азиз Ш.',      channel: 'Push',   delivered: true, readAt: '14:55' },
  { id: 17, date: '11.04 14:50', event: 'KPI 2: карта ...2299 (Азиз)',     initials: 'АШ', recipient: 'Азиз Ш.',      channel: 'In-app', delivered: true, readAt: '14:51' },
  { id: 18, date: '11.04 10:02', event: 'KPI 3: карта ...1137 (Дарья)',    initials: 'ДН', recipient: 'Дарья Н.',     channel: 'Push',   delivered: true, readAt: '10:04' },
  { id: 19, date: '11.04 10:02', event: 'KPI 3: карта ...1137 (Дарья)',    initials: 'ДН', recipient: 'Дарья Н.',     channel: 'In-app', delivered: true, readAt: '10:03' },
  { id: 20, date: '10.04 17:40', event: 'KPI 1: карта ...4488 (Шахзод)',   initials: 'ШР', recipient: 'Шахзод Р.',    channel: 'Push',   delivered: true, readAt: '17:43' },
  { id: 21, date: '10.04 17:40', event: 'KPI 1: карта ...4488 (Шахзод)',   initials: 'ШР', recipient: 'Шахзод Р.',    channel: 'In-app', delivered: true, readAt: '17:41' },
  { id: 22, date: '10.04 13:15', event: 'KPI 2: карта ...9003 (Зилола)',   initials: 'ЗА', recipient: 'Зилола А.',    channel: 'Push',   delivered: true, readAt: '13:20' },
  { id: 23, date: '10.04 13:15', event: 'KPI 2: карта ...9003 (Зилола)',   initials: 'ЗА', recipient: 'Зилола А.',    channel: 'In-app', delivered: true, readAt: null },
  { id: 24, date: '10.04 08:55', event: 'KPI 3: карта ...6612 (Ислом)',    initials: 'ИТ', recipient: 'Ислом Т.',     channel: 'In-app', delivered: true, readAt: '09:00' },
];

const INITIAL_ERROR_ROWS: ErrorRow[] = [
  { id: 1, date: '12.04 18:45', initials: 'НУ', recipient: 'Нодира У.', channel: 'Push', reason: 'Push token expired',  originalReason: 'Push token expired',  retryState: 'idle', retryCount: 0, deliveredAt: null },
  { id: 2, date: '08.04 09:12', initials: 'КР', recipient: 'Камола Р.', channel: 'Push', reason: 'Device unreachable',  originalReason: 'Device unreachable',  retryState: 'idle', retryCount: 0, deliveredAt: null },
  { id: 3, date: '05.04 14:30', initials: 'ДН', recipient: 'Дарья Н.',  channel: 'Push', reason: 'Push token expired',  originalReason: 'Push token expired',  retryState: 'idle', retryCount: 0, deliveredAt: null },
  { id: 4, date: '02.04 11:00', initials: 'ИТ', recipient: 'Ислом Т.',  channel: 'Push', reason: 'Timeout',              originalReason: 'Timeout',             retryState: 'idle', retryCount: 0, deliveredAt: null },
];

const BAR_DATA = [
  { day: '01.04', count: 8 }, { day: '02.04', count: 12 }, { day: '03.04', count: 14 },
  { day: '04.04', count: 10 }, { day: '05.04', count: 16 }, { day: '06.04', count: 9 },
  { day: '07.04', count: 13 }, { day: '08.04', count: 18 }, { day: '09.04', count: 11 },
  { day: '10.04', count: 15 }, { day: '11.04', count: 20 }, { day: '12.04', count: 17 },
  { day: '13.04', count: 22 }, { day: '14.04', count: 12 },
];

const DONUT_BASE = [
  { name: 'Push',   value: 347, pct: 50 },
  { name: 'In-app', value: 347, pct: 50 },
];

const CHANNEL_OPTIONS: { value: ChannelFilter; label: string }[] = [
  { value: 'all',    label: 'Все каналы' },
  { value: 'Push',   label: 'Push' },
  { value: 'In-app', label: 'In-app' },
];

type TabId = 'log' | 'errors' | 'stats';

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS BADGE TOKEN MAPS (multi-state)
═══════════════════════════════════════════════════════════════════════════ */

const RULE_STATUS_LIGHT = {
  active:   { bg: C.successBg, color: '#15803D', dot: C.success },
  disabled: { bg: '#F3F4F6',   color: C.text3,   dot: C.text4   },
};
const RULE_STATUS_DARK = {
  active:   { bg: D.successBg, color: D.success, dot: D.success },
  disabled: { bg: D.tableAlt,  color: D.text2,   dot: D.text4   },
};

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

const FIRE_PAGE_SIZE = 20;
const TOTAL_FIRES = 347;

export default function NotificationRuleDetailPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const [tab, setTab] = useState<TabId>('log');
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all');
  const [query, setQuery] = useState('');
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-15' });
  const [errorDateRange, setErrorDateRange] = useState({ from: '2026-04-01', to: '2026-04-15' });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Error rows + retry state
  const [errorRows, setErrorRows] = useState<ErrorRow[]>(INITIAL_ERROR_ROWS);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkState, setBulkState] = useState<'idle' | 'running' | 'done'>('idle');
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [bulkResult, setBulkResult] = useState<{ success: number; failed: number } | null>(null);

  const navigate = useNavigate();
  const { id } = useParams();

  const baseRule = INITIAL_RULES.find(r => r.id === id) ?? INITIAL_RULES[0];
  const [enabled, setEnabled] = useState(baseRule.enabled);

  const donutData = useMemo(() => [
    { ...DONUT_BASE[0], color: t.blue },
    { ...DONUT_BASE[1], color: dark ? '#93C5FD' : '#60A5FA' },
  ], [t.blue, dark]);

  const filteredFires = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FIRE_ROWS.filter(r => {
      if (channelFilter !== 'all' && r.channel !== channelFilter) return false;
      if (q && !r.event.toLowerCase().includes(q) && !r.recipient.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [channelFilter, query]);

  const pageSafe = Math.max(1, page);
  const pageStart = (pageSafe - 1) * FIRE_PAGE_SIZE;
  const visibleFires = filteredFires.slice(pageStart, pageStart + FIRE_PAGE_SIZE);
  const visibleEnd = Math.min(pageStart + FIRE_PAGE_SIZE, TOTAL_FIRES);

  const patchRow = (id: number, p: Partial<ErrorRow>) =>
    setErrorRows(prev => prev.map(r => r.id === id ? { ...r, ...p } : r));

  const nowHHMM = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const executeRetry = (id: number): Promise<boolean> =>
    new Promise(resolve => {
      patchRow(id, { retryState: 'sending' });
      window.setTimeout(() => {
        const success = Math.random() < 0.75;
        if (success) {
          patchRow(id, { retryState: 'success', deliveredAt: nowHHMM() });
        } else {
          setErrorRows(prev => prev.map(r => r.id === id ? {
            ...r,
            retryState: 'failed',
            retryCount: r.retryCount + 1,
            reason: `Повтор также не удался · ${r.originalReason}`,
          } : r));
        }
        resolve(success);
      }, 1500);
    });

  const onRowRetryStart = (id: number) => patchRow(id, { retryState: 'confirming' });
  const onRowRetryCancel = (id: number) => patchRow(id, { retryState: 'idle' });
  const onRowRetryConfirm = (id: number) => { executeRetry(id); };

  const countRetriableErrors = () => errorRows.filter(r =>
    r.retryState === 'idle' || r.retryState === 'failed'
  ).length;

  const startBulkRetry = async () => {
    setBulkModalOpen(false);
    const targets = errorRows.filter(r => r.retryState === 'idle' || r.retryState === 'failed');
    if (targets.length === 0) return;

    setBulkState('running');
    setBulkProgress({ current: 0, total: targets.length });
    setBulkResult(null);

    let success = 0;
    let failed = 0;
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (i > 0) await new Promise(r => window.setTimeout(r, 600));
      const ok = await executeRetry(target.id);
      if (ok) success++; else failed++;
      setBulkProgress({ current: i + 1, total: targets.length });
    }

    setBulkResult({ success, failed });
    setBulkState('done');
  };

  const resetBulk = () => {
    setBulkState('idle');
    setBulkProgress({ current: 0, total: 0 });
    setBulkResult(null);
  };

  const crumbLink: React.CSSProperties = {
    fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer',
  };

  const cardStyle: React.CSSProperties = {
    background: t.surface, border: `1px solid ${t.border}`,
    borderRadius: '12px', padding: '20px',
  };

  const statusCfg = enabled
    ? (dark ? RULE_STATUS_DARK.active : RULE_STATUS_LIGHT.active)
    : (dark ? RULE_STATUS_DARK.disabled : RULE_STATUS_LIGHT.disabled);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg }}>
      <Sidebar
        role="bank"
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
            <span onClick={() => navigate('/dashboard')} style={crumbLink}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/notification-rules')} style={crumbLink}>Правила уведомлений</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>{baseRule.title}</span>
          </div>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
          }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                {baseRule.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
                <StatusBadge
                  label={enabled ? 'Активно' : 'Отключено'}
                  bg={statusCfg.bg} color={statusCfg.color} dot={statusCfg.dot}
                />
                <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
                  Создано: <span style={{ fontFamily: F.mono, color: t.text2 }}>01.04.2026</span>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, flexWrap: 'wrap' }}>
              <LargeSwitch checked={enabled} onChange={() => setEnabled(e => !e)} t={t} dark={dark} />
              <OutlineButton icon={Pencil} onClick={() => navigate(`/notification-rules/${baseRule.id}/edit`)} t={t} dark={dark}>
                Редактировать
              </OutlineButton>
              <ActionMenu
                onDuplicate={() => navigate('/notification-rules')}
                onDelete={() => setDeleteOpen(true)}
                t={t} dark={dark}
              />
            </div>
          </div>

          {/* Config summary card */}
          <div className="rd-config" style={{
            background: t.tableHeaderBg, border: `1px solid ${t.border}`, borderRadius: '12px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px 24px',
            marginBottom: '20px',
          }}>
            <ConfigCell label="Триггер" t={t}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text1, fontWeight: 500 }}>
                {baseRule.title}
              </span>
            </ConfigCell>
            <ConfigCell label="Каналы" t={t}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {baseRule.channels.map(c => <BlueBadge key={c} label={c} t={t} />)}
              </div>
            </ConfigCell>
            <ConfigCell label="Получатели" t={t}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {baseRule.recipients.map(r => <DefaultBadge key={r} label={r} t={t} dark={dark} />)}
              </div>
            </ConfigCell>
            <ConfigCell label="Расписание" t={t}>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text1 }}>
                {baseRule.timing ?? 'Мгновенно'}
              </span>
            </ConfigCell>
          </div>

          {/* Stat cards */}
          <div className="rd-stats" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
            marginBottom: '20px',
          }}>
            <StatCard tone="blue"  icon={Bell}         label="Всего сработало" value="347"                 t={t} dark={dark} />
            <StatCard tone="green" icon={CheckCircle2} label="Доставлено"       value="694" hint="347 × 2 канала" t={t} dark={dark} />
            <StatCard tone="amber" icon={Eye}          label="Прочитано"        value="612" hint="88.2%"    t={t} dark={dark} />
            <StatCard tone="red"   icon={XCircle}      label="Ошибки"           value="4"   hint="0.6%"     t={t} dark={dark} />
          </div>

          {/* Tabs */}
          <TabsBar active={tab} onChange={setTab} errorCount={countRetriableErrors()} t={t} dark={dark} />

          {/* Tab content */}
          {tab === 'log' && (
            <div>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center',
                marginBottom: '14px',
              }}>
                <DateRangePicker value={dateRange} onChange={setDateRange} />
                <FilterSelect
                  label="Канал" value={channelFilter} options={CHANNEL_OPTIONS}
                  onChange={v => { setChannelFilter(v); setPage(1); }}
                  t={t} dark={dark}
                />
                <SearchInput value={query} onChange={v => { setQuery(v); setPage(1); }} t={t} dark={dark} />
              </div>

              <div style={{
                background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.inter }}>
                    <thead>
                      <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                        <Th width="112px" t={t}>Дата</Th>
                        <Th t={t}>Событие-триггер</Th>
                        <Th t={t}>Получатель</Th>
                        <Th width="90px" t={t}>Канал</Th>
                        <Th width="130px" t={t}>Статус</Th>
                        <Th width="110px" t={t}>Прочитано</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleFires.map(r => <FireRowView key={r.id} row={r} t={t} dark={dark} />)}
                    </tbody>
                  </table>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderTop: `1px solid ${t.border}`,
                  fontFamily: F.inter, fontSize: '13px', color: t.text3,
                }}>
                  <div>Показано {pageStart + 1}–{visibleEnd} из {TOTAL_FIRES}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <PageBtn disabled={pageSafe <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} t={t} dark={dark}>
                      <ChevronLeft size={14} strokeWidth={1.75} />
                    </PageBtn>
                    <span style={{ padding: '0 10px', color: t.text1 }}>
                      {pageSafe} / {Math.ceil(TOTAL_FIRES / FIRE_PAGE_SIZE)}
                    </span>
                    <PageBtn
                      disabled={pageSafe >= Math.ceil(TOTAL_FIRES / FIRE_PAGE_SIZE)}
                      onClick={() => setPage(p => p + 1)}
                      t={t} dark={dark}
                    >
                      <ChevronRight size={14} strokeWidth={1.75} />
                    </PageBtn>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'errors' && (
            <div>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '14px',
              }}>
                <DateRangePicker value={errorDateRange} onChange={setErrorDateRange} />
                <BulkHeaderControl
                  bulkState={bulkState}
                  progress={bulkProgress}
                  result={bulkResult}
                  errorCount={countRetriableErrors()}
                  onOpen={() => setBulkModalOpen(true)}
                  onReset={resetBulk}
                  t={t} dark={dark}
                />
              </div>

              <div style={{
                background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.inter }}>
                    <thead>
                      <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                        <Th width="112px" t={t}>Дата</Th>
                        <Th t={t}>Получатель</Th>
                        <Th width="90px" t={t}>Канал</Th>
                        <Th t={t}>Ошибка / статус</Th>
                        <Th width="220px" t={t} />
                      </tr>
                    </thead>
                    <tbody>
                      {errorRows.map(r => (
                        <ErrorRowStateful
                          key={r.id}
                          row={r}
                          onStart={() => onRowRetryStart(r.id)}
                          onCancel={() => onRowRetryCancel(r.id)}
                          onConfirm={() => onRowRetryConfirm(r.id)}
                          t={t} dark={dark}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tab === 'stats' && (
            <div className="rd-stats-grid" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
            }}>
              {/* Bar chart */}
              <div style={cardStyle}>
                <SectionHeading t={t}>Срабатывания за 30 дней</SectionHeading>
                <div style={{ width: '100%', height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BAR_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke={t.border} />
                      <XAxis
                        dataKey="day"
                        tick={{ fontFamily: F.inter, fontSize: 11, fill: t.text3 }}
                        tickLine={false} axisLine={{ stroke: t.border }}
                      />
                      <YAxis
                        tick={{ fontFamily: F.inter, fontSize: 11, fill: t.text3 }}
                        tickLine={false} axisLine={{ stroke: t.border }}
                      />
                      <Tooltip
                        cursor={{ fill: dark ? 'rgba(59,130,246,0.12)' : 'rgba(37,99,235,0.06)' }}
                        contentStyle={{
                          fontFamily: F.inter, fontSize: '12px',
                          borderRadius: '8px', border: `1px solid ${t.border}`,
                          background: t.surface, color: t.text1,
                        }}
                      />
                      <Bar dataKey="count" fill={t.blue} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Donut */}
              <div style={cardStyle}>
                <SectionHeading t={t}>По каналам</SectionHeading>
                <div style={{
                  display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap',
                }}>
                  <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
                    <ResponsiveContainer width={180} height={180}>
                      <PieChart>
                        <Pie
                          data={donutData} cx="50%" cy="50%"
                          innerRadius={58} outerRadius={82}
                          dataKey="value" strokeWidth={2} stroke={t.surface}
                        >
                          {donutData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v: any) => `${Number(v).toLocaleString()} срабатываний`}
                          contentStyle={{
                            fontFamily: F.inter, fontSize: '12px',
                            borderRadius: '8px', border: `1px solid ${t.border}`,
                            background: t.surface, color: t.text1,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none',
                    }}>
                      <div style={{ fontFamily: F.dm, fontSize: '20px', fontWeight: 600, color: t.text1, lineHeight: 1.1 }}>
                        694
                      </div>
                      <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text3 }}>всего</div>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '160px' }}>
                    {donutData.map(item => (
                      <div key={item.name} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                          <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{item.name}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: t.text1 }}>
                            {item.value}
                          </span>
                          <span style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4 }}>{item.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: '1px', background: t.border, margin: '16px 0' }} />
                <div style={{
                  fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1,
                }}>
                  Средняя скорость прочтения: <span style={{ fontFamily: F.mono }}>3 мин 22 сек</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @media (max-width: 1100px) {
            .rd-config { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 900px) {
            .rd-stats { grid-template-columns: repeat(2, 1fr) !important; }
            .rd-stats-grid { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 640px) {
            .rd-config { grid-template-columns: 1fr !important; }
            .rd-stats { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>

      <DeleteConfirm
        open={deleteOpen}
        title={baseRule.title}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => { setDeleteOpen(false); navigate('/notification-rules'); }}
        t={t} dark={dark}
      />

      <BulkRetryModal
        open={bulkModalOpen}
        count={countRetriableErrors()}
        recipientCount={new Set(errorRows
          .filter(r => r.retryState === 'idle' || r.retryState === 'failed')
          .map(r => r.recipient)).size}
        onClose={() => setBulkModalOpen(false)}
        onConfirm={() => { startBulkRetry(); }}
        t={t} dark={dark}
      />

      <style>{`
        @keyframes retrySpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes retryRowPulse {
          from { background-color: rgba(16,185,129,0.12); }
          to   { background-color: transparent; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIG SUMMARY
═══════════════════════════════════════════════════════════════════════════ */

function ConfigCell({ label, children, t }: { label: string; children: React.ReactNode; t: T }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
      <span style={{
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: t.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

const STAT_PALETTE_LIGHT = {
  blue:  { bg: C.blueLt,    ring: '#BFDBFE', fg: C.blue    },
  green: { bg: C.successBg, ring: '#A7F3D0', fg: C.success },
  amber: { bg: C.warningBg, ring: '#FDE68A', fg: C.warning },
  red:   { bg: C.errorBg,   ring: '#FECACA', fg: C.error   },
};
const STAT_PALETTE_DARK = {
  blue:  { bg: D.blueLt,    ring: 'rgba(59,130,246,0.30)',  fg: D.blue    },
  green: { bg: D.successBg, ring: 'rgba(52,211,153,0.30)',  fg: D.success },
  amber: { bg: D.warningBg, ring: 'rgba(251,191,36,0.30)',  fg: D.warning },
  red:   { bg: D.errorBg,   ring: 'rgba(248,113,113,0.30)', fg: D.error   },
};

function StatCard({ tone, icon: Icon, label, value, hint, t, dark }: {
  tone: 'blue' | 'green' | 'amber' | 'red';
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
  t: T;
  dark: boolean;
}) {
  const palette = (dark ? STAT_PALETTE_DARK : STAT_PALETTE_LIGHT)[tone];

  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px',
      padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: palette.bg, border: `1px solid ${palette.ring}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={18} color={palette.fg} strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
          {label}
        </div>
        <div style={{
          fontFamily: F.dm, fontSize: '22px', fontWeight: 700,
          color: t.text1, lineHeight: 1.1, marginTop: '4px',
        }}>
          {value}
        </div>
        {hint && (
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, marginTop: '3px' }}>
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════════════════════════════ */

function TabsBar({ active, onChange, errorCount, t, dark }: {
  active: TabId; onChange: (v: TabId) => void; errorCount: number; t: T; dark: boolean;
}) {
  const items: { id: TabId; label: string; badge?: string }[] = [
    { id: 'log',    label: 'Лог срабатываний' },
    { id: 'errors', label: 'Ошибки', badge: String(errorCount) },
    { id: 'stats',  label: 'Статистика' },
  ];
  return (
    <div style={{
      display: 'flex', gap: '4px', borderBottom: `1px solid ${t.border}`,
      marginBottom: '20px',
    }}>
      {items.map(item => {
        const is = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            style={{
              position: 'relative',
              padding: '10px 14px',
              background: is ? t.blueLt : 'transparent',
              border: 'none',
              fontFamily: F.inter, fontSize: '13px', fontWeight: is ? 600 : 500,
              color: is ? t.blue : t.text3, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              marginBottom: '-1px',
              borderBottom: `2px solid ${is ? t.blue : 'transparent'}`,
              borderTopLeftRadius: '6px', borderTopRightRadius: '6px',
              transition: 'all 0.12s',
            }}
          >
            {item.label}
            {item.badge && (
              <span style={{
                fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                padding: '1px 6px', borderRadius: '10px',
                background: is ? t.errorBg : (dark ? D.tableAlt : '#F3F4F6'),
                color: is ? t.error : t.text3,
              }}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABLE ROWS
═══════════════════════════════════════════════════════════════════════════ */

function FireRowView({ row, t, dark }: { row: FireRow; t: T; dark: boolean }) {
  return (
    <tr style={{ borderBottom: `1px solid ${t.border}` }}>
      <Td t={t}><span style={{ fontFamily: F.mono, fontSize: '12px', color: t.text1 }}>{row.date}</span></Td>
      <Td t={t}><span style={{ color: t.text2, fontSize: '13px' }}>{row.event}</span></Td>
      <Td t={t}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar initials={row.initials} t={t} />
          <span style={{ color: t.text1, fontWeight: 500 }}>{row.recipient}</span>
        </div>
      </Td>
      <Td t={t}><BlueBadge label={row.channel} t={t} /></Td>
      <Td t={t}>
        {row.delivered
          ? <SuccessBadge label="Доставлено" t={t} dark={dark} />
          : <ErrorRedBadge label="Ошибка" t={t} />}
      </Td>
      <Td t={t}>
        {row.readAt ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: F.inter, fontSize: '12px', color: t.text1,
          }}>
            <Check size={13} strokeWidth={2.25} color={t.success} />
            <span style={{ fontFamily: F.mono }}>{row.readAt}</span>
          </span>
        ) : (
          <span style={{ color: t.text4 }}>—</span>
        )}
      </Td>
    </tr>
  );
}

function ErrorRowStateful({ row, onStart, onCancel, onConfirm, t, dark }: {
  row: ErrorRow;
  onStart: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  t: T;
  dark: boolean;
}) {
  const isSuccess = row.retryState === 'success';
  const isConfirming = row.retryState === 'confirming';
  const isSending = row.retryState === 'sending';
  const isFailed = row.retryState === 'failed';
  const isIdle = row.retryState === 'idle';

  const successRowBg = dark ? 'rgba(52,211,153,0.07)' : 'rgba(16,185,129,0.04)';
  const errorLeftColor = dark ? '#F87171' : C.error;
  const showErrorLeft = isIdle || isFailed;

  return (
    <tr style={{
      borderBottom: `1px solid ${t.border}`,
      background: isSuccess ? successRowBg : isConfirming ? t.blueLt : t.surface,
      boxShadow: isConfirming
        ? `inset 3px 0 0 ${t.blue}`
        : showErrorLeft
          ? `inset 3px 0 0 ${errorLeftColor}`
          : undefined,
      transition: 'background 0.2s, box-shadow 0.2s',
    }}>
      <Td t={t}><span style={{ fontFamily: F.mono, fontSize: '12px', color: t.text1 }}>{row.date}</span></Td>
      <Td t={t}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Avatar initials={row.initials} t={t} />
          <span style={{ color: t.text1, fontWeight: 500 }}>{row.recipient}</span>
        </div>
      </Td>
      <Td t={t}><BlueBadge label={row.channel} t={t} /></Td>
      <Td t={t}>
        {isSuccess ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}>
            <SuccessBadge label="Доставлено" t={t} dark={dark} />
            {row.deliveredAt && (
              <span style={{ fontFamily: F.mono, fontSize: '12px', color: t.text3 }}>
                {row.deliveredAt}
              </span>
            )}
          </span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
              padding: '3px 8px', borderRadius: '10px',
              background: t.errorBg, color: t.error,
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.error }} />
              Ошибка{row.retryCount > 0 ? ` (${row.retryCount + 1})` : ''}
            </span>
            <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              {row.reason}
            </span>
          </div>
        )}
      </Td>
      <Td t={t}>
        {isIdle && (
          <OutlineButton size="sm" icon={RefreshCw} onClick={onStart} t={t} dark={dark}>Повторить</OutlineButton>
        )}
        {isFailed && (
          <OutlineButton size="sm" icon={RefreshCw} onClick={onStart} t={t} dark={dark}>Повторить</OutlineButton>
        )}
        {isConfirming && (
          <div style={{ display: 'inline-flex', gap: '6px' }}>
            <GhostSmButton onClick={onCancel} t={t} dark={dark}>Отмена</GhostSmButton>
            <PrimarySmButton onClick={onConfirm} t={t} dark={dark}>Да, повторить</PrimarySmButton>
          </div>
        )}
        {isSending && (
          <PrimarySmButton disabled icon={Loader2} spinning t={t} dark={dark}>Отправка…</PrimarySmButton>
        )}
        {isSuccess && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
            color: t.success,
          }}>
            <Check size={14} strokeWidth={2.25} />
            Повторено{row.deliveredAt ? ` · ${row.deliveredAt}` : ''}
          </span>
        )}
      </Td>
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABLE PRIMITIVES
═══════════════════════════════════════════════════════════════════════════ */

function Th({ children, width, t }: { children?: React.ReactNode; width?: string; t: T }) {
  return (
    <th style={{
      textAlign: 'left', padding: '10px 14px', width,
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
      color: t.text3, textTransform: 'uppercase', letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </th>
  );
}

function Td({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <td style={{
      padding: '12px 14px', fontFamily: F.inter, fontSize: '13px',
      color: t.text1, verticalAlign: 'middle',
    }}>
      {children}
    </td>
  );
}

function Avatar({ initials, t }: { initials: string; t: T }) {
  return (
    <div style={{
      width: '28px', height: '28px', borderRadius: '50%',
      background: t.blueLt, color: t.blue,
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ label, bg, color, dot }: {
  label: string; bg: string; color: string; dot: string;
}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: bg, color,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot }} />
      {label}
    </span>
  );
}

function BlueBadge({ label, t }: { label: string; t: T }) {
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 8px', borderRadius: '6px',
      background: t.blueLt, color: t.blue, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function DefaultBadge({ label, t, dark }: { label: string; t: T; dark: boolean }) {
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 8px', borderRadius: '6px',
      background: dark ? D.tableAlt : '#F3F4F6',
      color: t.text2, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function SuccessBadge({ label, t, dark }: { label: string; t: T; dark: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 8px', borderRadius: '10px',
      background: t.successBg, color: dark ? D.success : '#15803D',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.success }} />
      {label}
    </span>
  );
}

function ErrorRedBadge({ label, t }: { label: string; t: T }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 8px', borderRadius: '10px',
      background: t.errorBg, color: t.error,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.error }} />
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SWITCH (LARGE)
═══════════════════════════════════════════════════════════════════════════ */

function LargeSwitch({ checked, onChange, t, dark }: { checked: boolean; onChange: () => void; t: T; dark: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label="Включить или отключить правило"
      onClick={onChange}
      style={{
        width: '52px', height: '28px', borderRadius: '14px',
        background: checked ? t.blue : (dark ? D.tableHover : '#D1D5DB'),
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%',
        background: dark ? '#F1F2F6' : C.surface,
        position: 'absolute', top: '3px',
        left: checked ? '27px' : '3px',
        transition: 'left 0.2s',
        boxShadow: dark ? '0 1px 3px rgba(0,0,0,0.5)' : '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION MENU
═══════════════════════════════════════════════════════════════════════════ */

function ActionMenu({ onDuplicate, onDelete, t, dark }: {
  onDuplicate: () => void; onDelete: () => void; t: T; dark: boolean;
}) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } = usePopoverPosition();
  const [hov, setHov] = useState<string | null>(null);

  const item = (label: string, Icon: React.ElementType, onClick: () => void, destructive = false) => (
    <button
      key={label}
      type="button"
      onMouseEnter={() => setHov(label)}
      onMouseLeave={() => setHov(null)}
      onClick={() => { close(); onClick(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        width: '100%', padding: '9px 12px',
        background: hov === label ? (destructive ? t.errorBg : t.blueLt) : 'transparent',
        border: 'none', cursor: 'pointer',
        fontFamily: F.inter, fontSize: '13px',
        color: destructive ? t.error : t.text2, textAlign: 'left',
        transition: 'background 0.1s',
      }}
    >
      <Icon size={14} strokeWidth={1.75} />
      {label}
    </button>
  );

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        onClick={toggle}
        aria-label="Действия"
        style={{
          width: '38px', height: '38px', borderRadius: '8px',
          border: `1px solid ${open ? t.text3 : t.inputBorder}`,
          background: open ? (dark ? D.tableHover : '#F3F4F6') : t.surface,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.12s',
        }}
      >
        <MoreVertical size={16} color={t.text3} />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '180px',
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '8px',
            boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 8px 24px rgba(17,24,39,0.08)',
            padding: '4px 0',
          }}
        >
          {item('Дублировать', Copy, onDuplicate)}
          <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />
          {item('Удалить', Trash2, onDelete, true)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect({ label, value, options, onChange, t, dark }: {
  label: string;
  value: ChannelFilter;
  options: { value: ChannelFilter; label: string }[];
  onChange: (v: ChannelFilter) => void;
  t: T;
  dark: boolean;
}) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } =
    usePopoverPosition({ alignRight: false });
  const current = options.find(o => o.value === value)?.label ?? '';
  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={toggle}
        style={{
          height: '36px', padding: '0 12px',
          border: `1px solid ${open ? t.blue : t.inputBorder}`,
          borderRadius: '8px', background: t.surface,
          fontFamily: F.inter, fontSize: '13px', color: t.text1,
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          transition: 'border-color 0.12s',
        }}
      >
        <span style={{ color: t.text3 }}>{label}:</span>
        <span style={{ fontWeight: 500 }}>{current}</span>
        <ChevronRight size={13} style={{ transform: 'rotate(90deg)', marginLeft: '2px' }} color={t.text3} />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '180px',
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '8px',
            boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 8px 24px rgba(17,24,39,0.08)',
            padding: '4px 0',
          }}
        >
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); close(); }}
              style={{
                display: 'flex', width: '100%', padding: '8px 12px', gap: '10px',
                background: value === o.value ? t.blueLt : 'transparent',
                border: 'none', cursor: 'pointer',
                fontFamily: F.inter, fontSize: '13px',
                color: value === o.value ? t.blue : t.text2, textAlign: 'left',
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SEARCH INPUT
═══════════════════════════════════════════════════════════════════════════ */

function SearchInput({ value, onChange, t, dark }: { value: string; onChange: (v: string) => void; t: T; dark: boolean }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      height: '36px', width: '260px', padding: '0 12px',
      border: `1px solid ${focus ? t.blue : t.inputBorder}`,
      borderRadius: '8px', background: t.surface,
      transition: 'border-color 0.12s',
    }}>
      <Search size={14} color={t.text3} strokeWidth={1.75} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="Поиск по событию или получателю…"
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: F.inter, fontSize: '13px', color: t.text1, minWidth: 0,
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTONS
═══════════════════════════════════════════════════════════════════════════ */

function OutlineButton({ children, onClick, icon: Icon, size = 'md', disabled, spinning, t, dark }: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ElementType;
  size?: 'sm' | 'md';
  disabled?: boolean;
  spinning?: boolean;
  t: T;
  dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const h = size === 'sm' ? '30px' : '38px';
  const px = size === 'sm' ? '10px' : '16px';
  const fs = size === 'sm' ? '12px' : '13px';
  const disabledBg = dark ? D.tableAlt : '#F9FAFB';
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: h, padding: `0 ${px}`,
        border: `1px solid ${disabled ? t.border : (hov ? t.text3 : t.inputBorder)}`,
        borderRadius: '8px',
        background: disabled ? disabledBg : (hov ? t.tableHover : t.surface),
        fontFamily: F.inter, fontSize: fs, fontWeight: 500,
        color: disabled ? t.text3 : t.text2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {Icon && (
        <span style={{ display: 'inline-flex', animation: spinning ? 'retrySpin 0.9s linear infinite' : undefined }}>
          <Icon size={size === 'sm' ? 12 : 14} strokeWidth={1.75} />
        </span>
      )}
      {children}
    </button>
  );
}

function PrimarySmButton({ children, onClick, icon: Icon, disabled, spinning, t, dark }: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ElementType;
  disabled?: boolean;
  spinning?: boolean;
  t: T;
  dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const disabledBg = dark ? 'rgba(59,130,246,0.40)' : '#93C5FD';
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '30px', padding: '0 12px',
        border: 'none', borderRadius: '8px',
        background: disabled ? disabledBg : (hov ? t.blueHover : t.blue),
        fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
        color: '#FFFFFF',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: disabled ? 'none' : (dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 1px 3px rgba(37,99,235,0.16)'),
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {Icon && (
        <span style={{ display: 'inline-flex', animation: spinning ? 'retrySpin 0.9s linear infinite' : undefined }}>
          <Icon size={12} strokeWidth={2} />
        </span>
      )}
      {children}
    </button>
  );
}

function GhostSmButton({ children, onClick, t, dark }: {
  children: React.ReactNode;
  onClick?: () => void;
  t: T;
  dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '30px', padding: '0 10px',
        border: 'none', borderRadius: '8px',
        background: hov ? (dark ? D.tableHover : '#F3F4F6') : 'transparent',
        fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
        color: t.text2, cursor: 'pointer',
        transition: 'background 0.12s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function PageBtn({ children, onClick, disabled, t, dark }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const disabledBg = dark ? D.tableAlt : '#F9FAFB';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '32px', height: '32px', borderRadius: '8px',
        border: `1px solid ${t.inputBorder}`,
        background: disabled ? disabledBg : (hov ? (dark ? D.tableHover : '#F3F4F6') : t.surface),
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? t.text4 : t.text2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.12s',
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BULK RETRY — HEADER CONTROL
═══════════════════════════════════════════════════════════════════════════ */

function BulkHeaderControl({ bulkState, progress, result, errorCount, onOpen, onReset, t, dark }: {
  bulkState: 'idle' | 'running' | 'done';
  progress: { current: number; total: number };
  result: { success: number; failed: number } | null;
  errorCount: number;
  onOpen: () => void;
  onReset: () => void;
  t: T;
  dark: boolean;
}) {
  if (bulkState === 'running') {
    return (
      <OutlineButton icon={Loader2} spinning disabled t={t} dark={dark}>
        Повторяем… {progress.current}/{progress.total}
      </OutlineButton>
    );
  }

  if (bulkState === 'done' && result) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text1 }}>
          Повторено:
        </span>
        <SuccessBadge label={`${result.success} успешно`} t={t} dark={dark} />
        {result.failed > 0 && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
            padding: '3px 8px', borderRadius: '10px',
            background: t.errorBg, color: t.error,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.error }} />
            {result.failed} ошибка
          </span>
        )}
        <GhostSmButton onClick={onReset} t={t} dark={dark}>Готово</GhostSmButton>
      </div>
    );
  }

  return (
    <OutlineButton icon={RefreshCw} disabled={errorCount === 0} onClick={onOpen} t={t} dark={dark}>
      Повторить все ошибки ({errorCount})
    </OutlineButton>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BULK RETRY — CONFIRMATION MODAL
═══════════════════════════════════════════════════════════════════════════ */

function BulkRetryModal({ open, count, recipientCount, onClose, onConfirm, t, dark }: {
  open: boolean;
  count: number;
  recipientCount: number;
  onClose: () => void;
  onConfirm: () => void;
  t: T;
  dark: boolean;
}) {
  const [closeHov, setCloseHov] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const overlayBg = dark ? 'rgba(0,0,0,0.6)' : 'rgba(17, 24, 39, 0.50)';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: overlayBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '12px',
          boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '18px 20px', borderBottom: `1px solid ${t.border}`,
        }}>
          <RefreshCw size={20} color={t.blue} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0, fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1,
          }}>
            Повторить отправку
          </h2>
          <button
            type="button"
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '28px', height: '28px', border: 'none', borderRadius: '7px',
              background: closeHov ? (dark ? D.tableHover : '#F3F4F6') : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={t.text3} strokeWidth={1.75} />
          </button>
        </div>

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text1, lineHeight: 1.5 }}>
            Повторить отправку для <span style={{ fontWeight: 500 }}>{count}</span> неудачных уведомлений?
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
            Push: {count} уведомления · {recipientCount} получателя
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>
            Повторная отправка может занять до 30 секунд.
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '14px 20px', borderTop: `1px solid ${t.border}`,
        }}>
          <button
            type="button"
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 16px',
              border: `1px solid ${cancelHov ? t.text3 : t.inputBorder}`,
              borderRadius: '8px', background: t.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text1, cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            type="button"
            onMouseEnter={() => setConfirmHov(true)}
            onMouseLeave={() => setConfirmHov(false)}
            onClick={onConfirm}
            style={{
              height: '38px', padding: '0 16px',
              border: 'none', borderRadius: '8px',
              background: confirmHov ? t.blueHover : t.blue,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: dark
                ? '0 2px 8px rgba(0,0,0,0.3)'
                : (confirmHov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)'),
              transition: 'all 0.15s',
            }}
          >
            <RefreshCw size={14} strokeWidth={1.75} />
            Повторить всё ({count})
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ open, title, onClose, onConfirm, t, dark }: {
  open: boolean; title: string; onClose: () => void; onConfirm: () => void; t: T; dark: boolean;
}) {
  const [closeHov, setCloseHov] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const overlayBg = dark ? 'rgba(0,0,0,0.6)' : 'rgba(17, 24, 39, 0.50)';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: overlayBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '440px',
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '12px',
          boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '18px 20px', borderBottom: `1px solid ${t.border}`,
        }}>
          <Trash2 size={20} color={t.error} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0, fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1,
          }}>
            Удалить правило
          </h2>
          <button
            type="button"
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '28px', height: '28px', border: 'none', borderRadius: '7px',
              background: closeHov ? (dark ? D.tableHover : '#F3F4F6') : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={t.text3} strokeWidth={1.75} />
          </button>
        </div>

        <div style={{ padding: '18px 20px' }}>
          <div style={{
            fontFamily: F.inter, fontSize: '13px', color: t.text1, lineHeight: 1.5,
          }}>
            Удалить правило «<span style={{ fontWeight: 500 }}>{title}</span>»? Срабатывания будут остановлены. Действие нельзя отменить.
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '14px 20px', borderTop: `1px solid ${t.border}`,
        }}>
          <button
            type="button"
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={onClose}
            style={{
              height: '38px', padding: '0 16px',
              border: `1px solid ${cancelHov ? t.text3 : t.inputBorder}`,
              borderRadius: '8px', background: t.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text1, cursor: 'pointer', transition: 'all 0.12s',
            }}
          >
            Отмена
          </button>
          <button
            type="button"
            onMouseEnter={() => setConfirmHov(true)}
            onMouseLeave={() => setConfirmHov(false)}
            onClick={onConfirm}
            style={{
              height: '38px', padding: '0 16px',
              border: 'none', borderRadius: '8px',
              background: confirmHov ? (dark ? '#DC2626' : '#DC2626') : t.error,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: '#FFFFFF', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              boxShadow: dark
                ? '0 2px 8px rgba(0,0,0,0.3)'
                : (confirmHov ? '0 2px 8px rgba(239,68,68,0.32)' : '0 1px 3px rgba(239,68,68,0.18)'),
              transition: 'all 0.15s',
            }}
          >
            <Trash2 size={14} strokeWidth={1.75} />
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function SectionHeading({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <h3 style={{
      margin: '0 0 14px', fontFamily: F.dm, fontSize: '14px', fontWeight: 600,
      color: t.text1,
    }}>
      {children}
    </h3>
  );
}
