import React, { useMemo, useState } from 'react';
import {
  ChevronRight, ChevronLeft, ChevronDown, Search, Download, Check,
  Bell, CheckCircle2, Clock, XCircle, Inbox, AlertTriangle,
  RefreshCw, Info,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { usePopoverPosition } from '../components/usePopoverPosition';
import { DateRangePicker } from '../components/DateRangePicker';
import { EmptyState } from '../components/EmptyState';
import { useExportToast } from '../components/useExportToast';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════════════════════════ */

type EventType = 'KPI' | 'Финансы' | 'Карты' | 'Система' | 'Объявление';
type Channel = 'In-app' | 'Push' | 'Email' | 'SMS';
type Delivery = 'delivered' | 'queued' | 'error';

type TypeFilter = 'all' | EventType;
type ChannelFilter = 'all' | Channel;
type StatusFilter = 'all' | Delivery;

interface ErrorDetail {
  title: string;
  device?: string;
  lastPushAt?: string;
  attempts: [number, number];
  nextAttempt: string;
  recommendation?: string;
}

interface LogRow {
  id: number;
  date: string;
  type: EventType;
  event: string;
  recipient: string;
  initials: string;
  channel: Channel;
  status: Delivery;
  readAt: string | null;
  error?: string;
  errorDetail?: ErrorDetail;
}

const SEED_ROWS: LogRow[] = [
  { id: 1,  date: '13.04 14:32', type: 'KPI',        event: 'KPI 3 выполнен: ...4521',             recipient: 'Абдуллох Р.',           initials: 'АР', channel: 'Push',   status: 'delivered', readAt: '14:35' },
  { id: 2,  date: '13.04 14:32', type: 'KPI',        event: 'KPI 3 выполнен: ...4521',             recipient: 'Абдуллох Р.',           initials: 'АР', channel: 'In-app', status: 'delivered', readAt: '14:33' },
  { id: 3,  date: '13.04 14:32', type: 'KPI',        event: 'KPI 3 выполнен: ...4521',             recipient: 'Рустам Алиев (менеджер)', initials: 'РА', channel: 'In-app', status: 'delivered', readAt: null },
  { id: 4,  date: '13.04 12:10', type: 'KPI',        event: 'KPI 2 выполнен: ...3892',             recipient: 'Санжар М.',             initials: 'СМ', channel: 'Push',   status: 'delivered', readAt: '12:15' },
  { id: 5,  date: '13.04 10:00', type: 'Объявление', event: 'Обновление KPI политики',             recipient: 'Рустам Алиев',          initials: 'РА', channel: 'Email',  status: 'delivered', readAt: '10:15' },
  { id: 6,  date: '13.04 10:00', type: 'Объявление', event: 'Обновление KPI политики',             recipient: 'Лола Каримова',         initials: 'ЛК', channel: 'Email',  status: 'delivered', readAt: '11:30' },
  { id: 7,  date: '13.04 09:00', type: 'Финансы',    event: 'Вывод 120 000 UZS',                    recipient: 'Абдуллох Р.',           initials: 'АР', channel: 'SMS',    status: 'delivered', readAt: null },
  { id: 8,  date: '13.04 09:00', type: 'Финансы',    event: 'Запрос на вывод 50 000',               recipient: 'Рустам Алиев',          initials: 'РА', channel: 'In-app', status: 'delivered', readAt: null },
  { id: 9,  date: '12.04 18:45', type: 'KPI',        event: 'KPI 3 выполнен: ...1010',             recipient: 'Нодира У.',             initials: 'НУ', channel: 'Push',   status: 'error',     readAt: null,
    error: 'Push token expired',
    errorDetail: {
      title: 'Push token expired',
      device: 'iPhone 13',
      lastPushAt: '10.04.2026',
      attempts: [1, 3],
      nextAttempt: 'Не запланирована (макс. попыток)',
      recommendation: 'Пользователь должен повторно авторизоваться в приложении для обновления push-токена.',
    },
  },
  { id: 10, date: '12.04 18:45', type: 'KPI',        event: 'KPI 3 выполнен: ...1010',             recipient: 'Нодира У.',             initials: 'НУ', channel: 'In-app', status: 'delivered', readAt: '19:00' },
  { id: 11, date: '12.04 16:20', type: 'Карты',      event: 'Карта продана: ...2105',              recipient: 'Мухаммад Н.',           initials: 'МН', channel: 'In-app', status: 'delivered', readAt: '16:42' },
  { id: 12, date: '12.04 15:10', type: 'Система',    event: 'Вход с нового устройства',             recipient: 'Админ Камолов',         initials: 'АК', channel: 'Email',  status: 'queued',    readAt: null },
  { id: 13, date: '12.04 14:08', type: 'Финансы',    event: 'Вознаграждение начислено: 10 000',     recipient: 'Санжар М.',             initials: 'СМ', channel: 'Push',   status: 'delivered', readAt: '14:10' },
  { id: 14, date: '12.04 11:55', type: 'Система',    event: 'Ошибка интеграции: UCOIN timeout',     recipient: 'Админ Камолов',         initials: 'АК', channel: 'Email',  status: 'error',     readAt: null,
    error: 'SMTP 554: Relay access denied',
    errorDetail: {
      title: 'SMTP 554: Relay access denied',
      lastPushAt: '12.04.2026',
      attempts: [2, 3],
      nextAttempt: 'Через 30 минут',
      recommendation: 'Проверить настройки SPF/DKIM домена ubank.uz.',
    },
  },
  { id: 15, date: '12.04 10:30', type: 'KPI',        event: 'KPI срок истекает через 3 дня',         recipient: 'Дарья Нам',             initials: 'ДН', channel: 'Push',   status: 'delivered', readAt: null },
];

const TOTAL_COUNT = 1284;
const DELIVERED_COUNT = 1270;
const QUEUED_COUNT = 8;
const ERROR_COUNT = 6;
const PAGE_SIZE = 15;

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all',         label: 'Все' },
  { value: 'KPI',         label: 'KPI' },
  { value: 'Финансы',     label: 'Финансы' },
  { value: 'Карты',       label: 'Карты' },
  { value: 'Система',     label: 'Система' },
  { value: 'Объявление',  label: 'Объявление' },
];

const CHANNEL_OPTIONS: { value: ChannelFilter; label: string }[] = [
  { value: 'all',    label: 'Все' },
  { value: 'In-app', label: 'In-app' },
  { value: 'Push',   label: 'Push' },
  { value: 'Email',  label: 'Email' },
  { value: 'SMS',    label: 'SMS' },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all',       label: 'Все' },
  { value: 'delivered', label: 'Доставлено' },
  { value: 'queued',    label: 'В очереди' },
  { value: 'error',     label: 'Ошибка' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

const TYPE_STYLES: Record<EventType, { bg: string; fg: string; outline?: boolean }> = {
  'KPI':         { bg: C.blueLt,     fg: C.blue },
  'Финансы':     { bg: C.warningBg,  fg: '#B45309' },
  'Карты':       { bg: C.infoBg,     fg: '#0E7490' },
  'Система':     { bg: '#F3F4F6',    fg: C.text2 },
  'Объявление':  { bg: 'transparent', fg: C.text2, outline: true },
};

function TypeBadge({ type }: { type: EventType }) {
  const s = TYPE_STYLES[type];
  const short = type === 'Объявление' ? 'Объявл.' : type;
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 8px', borderRadius: '6px',
      background: s.bg, color: s.fg, whiteSpace: 'nowrap',
      border: s.outline ? `1px solid ${C.inputBorder}` : 'none',
    }}>
      {short}
    </span>
  );
}

function ChannelBadge({ label }: { label: Channel }) {
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 8px', borderRadius: '6px',
      background: C.blueLt, color: C.blue, whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

const DELIVERY_STYLES: Record<Delivery, { bg: string; fg: string; dot: string; label: string }> = {
  delivered: { bg: C.successBg, fg: '#15803D', dot: C.success, label: 'Доставлено' },
  queued:    { bg: C.warningBg, fg: '#B45309', dot: C.warning, label: 'В очереди' },
  error:     { bg: C.errorBg,   fg: '#DC2626', dot: C.error,   label: 'Ошибка' },
};

function DeliveryBadge({ status }: { status: Delivery }) {
  const s = DELIVERY_STYLES[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: s.bg, color: s.fg, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

type Tone = 'blue' | 'green' | 'amber' | 'red';

const STAT_TONES: Record<Tone, { bg: string; fg: string }> = {
  blue:  { bg: C.blueLt,     fg: C.blue },
  green: { bg: C.successBg,  fg: C.success },
  amber: { bg: C.warningBg,  fg: C.warning },
  red:   { bg: C.errorBg,    fg: C.error },
};

function StatCard({ icon: Icon, tone, label, value }: {
  icon: React.ElementType; tone: Tone; label: string; value: string;
}) {
  const t = STAT_TONES[tone];
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '14px',
      flex: '1 1 0', minWidth: 0,
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: t.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={20} color={t.fg} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginBottom: '6px' }}>
          {label}
        </div>
        <div style={{ fontFamily: F.dm, fontSize: '26px', fontWeight: 700, color: C.text1, lineHeight: 1 }}>
          {value}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } =
    usePopoverPosition({ alignRight: false });
  const current = options.find(o => o.value === value);
  return (
    <div ref={rootRef}>
      <button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={toggle}
        style={{
          height: '36px', padding: '0 12px',
          border: `1px solid ${open ? C.blue : C.inputBorder}`,
          borderRadius: '8px', background: C.surface,
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontFamily: F.inter, fontSize: '13px', color: C.text1,
          cursor: 'pointer', transition: 'border-color 0.12s',
        }}
      >
        <span style={{ color: C.text3 }}>{label}:</span>
        <span style={{ fontWeight: 500 }}>{current?.label}</span>
        <ChevronDown size={14} color={C.text3} strokeWidth={1.75} />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '160px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '8px', boxShadow: '0 8px 24px rgba(17,24,39,0.12)',
            padding: '4px 0',
          }}
        >
          {options.map(o => {
            const sel = o.value === value;
            return (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); close(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', border: 'none',
                  background: sel ? C.blueLt : 'transparent',
                  fontFamily: F.inter, fontSize: '13px',
                  color: sel ? C.blue : C.text1,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                {o.label}
                {sel && <Check size={14} strokeWidth={2} color={C.blue} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function NotificationDeliveryLogPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateRange, setDateRange] = useState({ from: '2026-04-10', to: '2026-04-15' });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<LogRow[]>(SEED_ROWS);
  const navigate = useNavigate();
  const exportToast = useExportToast();

  const retryRow = (id: number) => {
    setRows(prev => prev.map(r => r.id === id
      ? { ...r, status: 'delivered' as const, readAt: nowHHMM(), error: undefined, errorDetail: undefined }
      : r
    ));
    setExpandedId(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (channelFilter !== 'all' && r.channel !== channelFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (q && !r.event.toLowerCase().includes(q) && !r.recipient.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, query, typeFilter, channelFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount);
  const visible = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const resetFilters = () => {
    setQuery(''); setTypeFilter('all'); setChannelFilter('all'); setStatusFilter('all');
  };

  const handleExport = () => {
    exportToast.start({
      subtitle: 'Лог доставки уведомлений за выбранный период',
      fileName: 'notification-delivery-log.xlsx',
      fileSize: '182 KB',
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
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
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Лог доставки</span>
          </div>

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Лог доставки уведомлений
              </h1>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '6px' }}>
                Все уведомления системы с состоянием доставки
              </div>
            </div>
            <OutlineButton icon={Download} onClick={handleExport}>Экспорт</OutlineButton>
          </div>

          {/* Stat cards */}
          <div className="ndl-stats" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
            marginBottom: '20px',
          }}>
            <StatCard icon={Bell}         tone="blue"  label="Всего за период"  value={fmtNum(TOTAL_COUNT)} />
            <StatCard icon={CheckCircle2} tone="green" label="Доставлено"        value={`${fmtNum(DELIVERED_COUNT)} (${pctStr(DELIVERED_COUNT, TOTAL_COUNT)}%)`} />
            <StatCard icon={Clock}        tone="amber" label="В очереди"         value={fmtNum(QUEUED_COUNT)} />
            <StatCard icon={XCircle}      tone="red"   label="Ошибки доставки"   value={`${fmtNum(ERROR_COUNT)} (${pctStr(ERROR_COUNT, TOTAL_COUNT)}%)`} />
          </div>

          {/* Filter bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center',
            marginBottom: '16px',
          }}>
            <SearchInput value={query} onChange={setQuery} />
            <FilterSelect label="Тип"    value={typeFilter}    options={TYPE_OPTIONS}    onChange={setTypeFilter} />
            <FilterSelect label="Канал"  value={channelFilter} options={CHANNEL_OPTIONS} onChange={setChannelFilter} />
            <FilterSelect label="Статус" value={statusFilter}  options={STATUS_OPTIONS}  onChange={setStatusFilter} />
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* Table */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.inter }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: `1px solid ${C.border}` }}>
                    <Th width="130px">Дата</Th>
                    <Th width="100px">Тип</Th>
                    <Th>Событие</Th>
                    <Th>Получатель</Th>
                    <Th width="100px">Канал</Th>
                    <Th width="150px">Статус доставки</Th>
                    <Th width="120px">Прочитано</Th>
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 0 }}>
                        <EmptyState
                          icon={Inbox}
                          title="Записей не найдено"
                          subtitle="Попробуйте изменить фильтры или расширить период."
                          outline={{ label: 'Сбросить фильтры', onClick: resetFilters }}
                        />
                      </td>
                    </tr>
                  ) : visible.map(r => (
                    <React.Fragment key={r.id}>
                      <LogRowView
                        row={r}
                        expanded={expandedId === r.id}
                        onToggle={() => {
                          if (r.status !== 'error') return;
                          setExpandedId(id => id === r.id ? null : r.id);
                        }}
                      />
                      {r.status === 'error' && expandedId === r.id && (
                        <ErrorDetailRow row={r} onRetry={() => retryRow(r.id)} />
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderTop: `1px solid ${C.border}`,
              fontFamily: F.inter, fontSize: '13px', color: C.text3,
            }}>
              <div>
                {filtered.length === 0
                  ? 'Ничего не найдено'
                  : `Показано ${(pageSafe - 1) * PAGE_SIZE + 1}–${Math.min(pageSafe * PAGE_SIZE, filtered.length)} из ${fmtNum(TOTAL_COUNT)}`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <PageBtn disabled={pageSafe <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                  <ChevronLeft size={14} strokeWidth={1.75} />
                </PageBtn>
                <span style={{ padding: '0 10px', fontFamily: F.inter, fontSize: '13px', color: C.text1 }}>
                  {pageSafe} / {pageCount}
                </span>
                <PageBtn disabled={pageSafe >= pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))}>
                  <ChevronRight size={14} strokeWidth={1.75} />
                </PageBtn>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1100px) { .ndl-stats { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 640px)  { .ndl-stats { grid-template-columns: 1fr !important; } }
          @media (max-width: 800px)  { .ndl-detail-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>

      {exportToast.node}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROW
═══════════════════════════════════════════════════════════════════════════ */

function LogRowView({ row, expanded, onToggle }: {
  row: LogRow; expanded: boolean; onToggle: () => void;
}) {
  const [hov, setHov] = useState(false);
  const isError = row.status === 'error';

  return (
    <tr
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${expanded ? 'transparent' : C.border}`,
        cursor: isError ? 'pointer' : 'default',
        background: hov && isError ? C.errorBg : hov ? '#F9FAFB' : 'transparent',
        boxShadow: isError ? `inset 3px 0 0 ${C.error}` : 'none',
        transition: 'background 0.1s',
      }}
    >
      <Td><span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text1 }}>{row.date}</span></Td>
      <Td><TypeBadge type={row.type} /></Td>
      <Td><span style={{ color: C.text1 }}>{row.event}</span></Td>
      <Td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: C.blueLt, color: C.blue,
            fontFamily: F.inter, fontSize: '10px', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {row.initials}
          </div>
          <span style={{ color: C.text1 }}>{row.recipient}</span>
        </div>
      </Td>
      <Td><ChannelBadge label={row.channel} /></Td>
      <Td><DeliveryBadge status={row.status} /></Td>
      <Td>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {row.readAt
            ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontFamily: F.inter, fontSize: '12px', color: C.text1,
              }}>
                <Check size={12} strokeWidth={2.5} color={C.success} />
                <span style={{ fontFamily: F.mono }}>{row.readAt}</span>
              </span>
            )
            : <span style={{ color: C.text4 }}>—</span>}
          {isError && (
            <ChevronDown
              size={14}
              color={C.text3}
              strokeWidth={1.75}
              style={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.18s',
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </Td>
    </tr>
  );
}

function ErrorDetailRow({ row, onRetry }: { row: LogRow; onRetry: () => void }) {
  const d = row.errorDetail;
  const fallbackTitle = row.error ?? 'Не удалось доставить';
  const title = d?.title ?? fallbackTitle;

  return (
    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
      <td colSpan={7} style={{ padding: '0 20px 16px 24px', background: C.surface }}>
        <div style={{
          border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${C.error}`,
          background: '#FEF7F7',
          borderRadius: '10px',
          padding: '16px',
        }}>
          <div className="ndl-detail-grid" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
          }}>
            {/* LEFT — details */}
            <div style={{ minWidth: 0 }}>
              <DetailHeading>Детали ошибки</DetailHeading>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <KVPair label="Ошибка">
                  <span style={{
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: C.error, lineHeight: 1.4,
                  }}>
                    {title}
                  </span>
                </KVPair>
                {d?.device && <KVPair label="Устройство"><PlainValue>{d.device}</PlainValue></KVPair>}
                {d?.lastPushAt && (
                  <KVPair label={row.channel === 'Push' ? 'Последний push' : 'Последняя отправка'}>
                    <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text2 }}>
                      {d.lastPushAt}
                    </span>
                  </KVPair>
                )}
                {d && (
                  <KVPair label="Попыток">
                    <PlainValue>{d.attempts[0]} из {d.attempts[1]}</PlainValue>
                  </KVPair>
                )}
                {d && (
                  <KVPair label="Следующая попытка">
                    <PlainValue>{d.nextAttempt}</PlainValue>
                  </KVPair>
                )}
              </div>
            </div>

            {/* RIGHT — actions */}
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <DetailHeading>Действия</DetailHeading>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <OutlineButton icon={RefreshCw} onClick={onRetry}>
                  Повторить отправку
                </OutlineButton>
                <AltChannelDropdown
                  channel={row.channel}
                  onPick={() => onRetry()}
                />
              </div>

              {d?.recommendation && (
                <>
                  <div style={{ height: '1px', background: '#FECACA', margin: '4px 0' }} />
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    fontFamily: F.inter, fontSize: '12px', color: C.text3, lineHeight: 1.5,
                  }}>
                    <Info size={14} color={C.info} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      <span style={{ fontWeight: 500, color: C.text2 }}>Рекомендация: </span>
                      {d.recommendation}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

function KVPair({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px',
      alignItems: 'baseline',
    }}>
      <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
        {label}
      </span>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

function PlainValue({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text2 }}>
      {children}
    </span>
  );
}

function DetailHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
      color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
      marginBottom: '10px',
    }}>
      {children}
    </div>
  );
}

function AltChannelDropdown({ channel, onPick }: {
  channel: Channel;
  onPick: (alt: Channel) => void;
}) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } =
    usePopoverPosition({ alignRight: false });
  const [hov, setHov] = useState(false);
  const [hovItem, setHovItem] = useState<string | null>(null);

  // Alt channels that make sense based on the failing channel
  const alts: Channel[] = channel === 'Push'
    ? ['Email', 'SMS']
    : channel === 'Email'
      ? ['SMS', 'In-app']
      : ['Email', 'SMS'];

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={toggle}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          height: '38px', padding: '0 14px',
          border: 'none', borderRadius: '8px',
          background: hov || open ? C.blueLt : 'transparent',
          fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
          color: C.blue, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          transition: 'background 0.12s',
        }}
      >
        Отправить через другой канал
        <ChevronDown size={14} strokeWidth={1.75}
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '220px',
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(17,24,39,0.08)',
            padding: '4px 0',
          }}
        >
          {alts.map(alt => {
            const key = `${alt}-vs-${channel}`;
            return (
              <button
                key={alt}
                type="button"
                onMouseEnter={() => setHovItem(key)}
                onMouseLeave={() => setHovItem(null)}
                onClick={() => { close(); onPick(alt); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  width: '100%', padding: '9px 12px',
                  background: hovItem === key ? C.blueLt : 'transparent',
                  border: 'none', cursor: 'pointer',
                  fontFamily: F.inter, fontSize: '13px',
                  color: C.text2, textAlign: 'left',
                  transition: 'background 0.1s',
                }}
              >
                <ChannelBadge label={alt} />
                <span>вместо {channel}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════════════════ */

function Th({ children, width }: { children?: React.ReactNode; width?: string }) {
  return (
    <th style={{
      textAlign: 'left', padding: '10px 14px', width,
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
      color: C.text3, textTransform: 'uppercase', letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{
      padding: '12px 14px', fontFamily: F.inter, fontSize: '13px',
      color: C.text1, verticalAlign: 'middle',
    }}>
      {children}
    </td>
  );
}

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      height: '36px', width: '320px', padding: '0 12px',
      border: `1px solid ${focus ? C.blue : C.inputBorder}`,
      borderRadius: '8px', background: C.surface,
      transition: 'border-color 0.12s',
    }}>
      <Search size={14} color={C.text3} strokeWidth={1.75} />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder="Поиск по получателю или тексту..."
        style={{
          flex: 1, border: 'none', outline: 'none',
          fontFamily: F.inter, fontSize: '13px', color: C.text1, background: 'transparent',
        }}
      />
    </div>
  );
}

function PageBtn({ children, disabled, onClick }: {
  children: React.ReactNode; disabled?: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '32px', height: '32px', border: `1px solid ${C.border}`, borderRadius: '6px',
        background: C.surface, color: disabled ? C.text4 : C.text2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, onClick, icon: Icon }: {
  children: React.ReactNode; onClick?: () => void; icon?: React.ElementType;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 16px',
        border: `1px solid ${hov ? C.text3 : C.inputBorder}`,
        borderRadius: '8px', background: C.surface,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: C.text1, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {Icon && <Icon size={14} strokeWidth={1.75} />}
      {children}
    </button>
  );
}

const crumbLink: React.CSSProperties = {
  fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer',
};

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function fmtNum(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function pctStr(part: number, total: number) {
  if (total === 0) return '0';
  return ((part / total) * 100).toFixed(1).replace(/\.0$/, '');
}
