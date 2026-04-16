import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronRight, ChevronDown, ChevronLeft, Search, Plus, MoreVertical,
  Eye, Copy, XCircle, Trash2, Pencil, Check, Inbox, X, CheckCircle2,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { usePopoverPosition } from '../components/usePopoverPosition';
import { DateRangePicker } from '../components/DateRangePicker';
import { EmptyState } from '../components/EmptyState';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════════════════════════ */

type Status = 'sent' | 'scheduled' | 'draft';
type Channel = 'In-app' | 'Email' | 'SMS';
type StatusFilter = 'all' | Status;
type ChannelFilter = 'all' | Channel;

interface AnnouncementRow {
  id: number;
  date: string | null;
  title: string;
  recipientsLabel: string;
  channels: Channel[];
  delivered: [number, number] | null;
  read: [number, number] | null;
  status: Status;
}

const ROWS: AnnouncementRow[] = [
  { id: 1, date: '13.04 10:00', title: 'Обновление KPI политики',        recipientsLabel: 'Все организации (12 чел.)',        channels: ['In-app', 'Email'],        delivered: [12, 12], read: [8, 12],  status: 'sent' },
  { id: 2, date: '12.04 09:00', title: 'Новые тарифы вывода средств',     recipientsLabel: 'Все организации (12 чел.)',        channels: ['In-app'],                  delivered: [12, 12], read: [10, 12], status: 'sent' },
  { id: 3, date: '10.04 14:30', title: 'Плановое обслуживание 15.04',     recipientsLabel: 'Все пользователи (22 чел.)',       channels: ['In-app', 'Email', 'SMS'],  delivered: [22, 22], read: [18, 22], status: 'sent' },
  { id: 4, date: '15.04 09:00', title: 'Акция: бонус за KPI 3',           recipientsLabel: 'Mysafar OOO, Unired Mkt (4 чел.)', channels: ['In-app'],                  delivered: null,     read: null,     status: 'scheduled' },
  { id: 5, date: null,          title: 'Черновик: итоги марта',           recipientsLabel: '—',                                channels: [],                          delivered: null,     read: null,     status: 'draft' },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all',       label: 'Все' },
  { value: 'sent',      label: 'Отправлено' },
  { value: 'scheduled', label: 'Запланировано' },
  { value: 'draft',     label: 'Черновик' },
];

const CHANNEL_OPTIONS: { value: ChannelFilter; label: string }[] = [
  { value: 'all',    label: 'Все' },
  { value: 'In-app', label: 'In-app' },
  { value: 'Email',  label: 'Email' },
  { value: 'SMS',    label: 'SMS' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS STYLE MAPS (multi-state)
═══════════════════════════════════════════════════════════════════════════ */

const STATUS_STYLE_LIGHT: Record<Status, { bg: string; color: string; dot: string; label: string }> = {
  sent:      { bg: C.successBg, color: '#15803D', dot: C.success, label: 'Отправлено' },
  scheduled: { bg: C.warningBg, color: '#B45309', dot: C.warning, label: 'Запланировано' },
  draft:     { bg: '#F3F4F6',   color: C.text3,   dot: C.text4,   label: 'Черновик' },
};

const STATUS_STYLE_DARK: Record<Status, { bg: string; color: string; dot: string; label: string }> = {
  sent:      { bg: 'rgba(52,211,153,0.12)', color: '#34D399', dot: '#34D399', label: 'Отправлено' },
  scheduled: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24', dot: '#FBBF24', label: 'Запланировано' },
  draft:     { bg: D.tableAlt,              color: D.text2,   dot: D.text4,   label: 'Черновик' },
};

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

function ChannelBadge({ label, t }: { label: Channel; t: T }) {
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

function StatusBadge({ status, dark }: { status: Status; dark: boolean }) {
  const c = (dark ? STATUS_STYLE_DARK : STATUS_STYLE_LIGHT)[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: c.bg, color: c.color, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROGRESS CELL
═══════════════════════════════════════════════════════════════════════════ */

function ProgressCell({ value, t, dark }: { value: [number, number] | null; t: T; dark: boolean }) {
  if (!value) return <span style={{ color: t.text4 }}>—</span>;
  const [done, total] = value;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const complete = done === total;
  const trackBg = dark ? D.progressTrack : '#F3F4F6';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '56px' }}>
      <span style={{ fontFamily: F.mono, fontSize: '12px', color: t.text1 }}>
        {done}/{total}
      </span>
      <div style={{
        width: '100%', height: '4px', borderRadius: '2px',
        background: trackBg, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: complete ? t.success : t.warning,
          transition: 'width 0.2s',
        }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION MENU
═══════════════════════════════════════════════════════════════════════════ */

function RowActionMenu({ status, onDetail, onDuplicate, onEdit, onCancel, onDelete, t, dark }: {
  status: Status;
  onDetail: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  t: T;
  dark: boolean;
}) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } = usePopoverPosition();
  const [hov, setHov] = useState<string | null>(null);
  const triggerBg = dark ? D.tableHover : '#F3F4F6';

  const item = (label: string, Icon: React.ElementType, onClick: () => void, destructive = false) => (
    <button
      onMouseEnter={() => setHov(label)}
      onMouseLeave={() => setHov(null)}
      onClick={e => { e.stopPropagation(); close(); onClick(); }}
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
    <div ref={rootRef} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        onClick={toggle}
        aria-label="Действия"
        style={{
          width: '32px', height: '32px', borderRadius: '8px',
          border: 'none', background: open ? triggerBg : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.12s',
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
          {status === 'draft'
            ? item('Редактировать', Pencil, onEdit)
            : item('Подробнее', Eye, onDetail)}
          {item('Дублировать', Copy, onDuplicate)}
          {status === 'scheduled' && item('Отменить', XCircle, onCancel, true)}
          {status === 'draft' && (
            <>
              <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />
              {item('Удалить', Trash2, onDelete, true)}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FILTER SELECT
═══════════════════════════════════════════════════════════════════════════ */

function FilterSelect<V extends string>({ label, value, options, onChange, t, dark }: {
  label: string;
  value: V;
  options: { value: V; label: string }[];
  onChange: (v: V) => void;
  t: T;
  dark: boolean;
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
          border: `1px solid ${open ? t.blue : t.inputBorder}`,
          borderRadius: '8px', background: t.surface,
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontFamily: F.inter, fontSize: '13px', color: t.text1,
          cursor: 'pointer', transition: 'border-color 0.12s',
        }}
      >
        <span style={{ color: t.text3 }}>{label}:</span>
        <span style={{ fontWeight: 500 }}>{current?.label}</span>
        <ChevronDown size={14} color={t.text3} strokeWidth={1.75} />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '160px',
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '8px',
            boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 8px 24px rgba(17,24,39,0.12)',
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
                  background: sel ? t.blueLt : 'transparent',
                  fontFamily: F.inter, fontSize: '13px',
                  color: sel ? t.blue : t.text1,
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                {o.label}
                {sel && <Check size={14} strokeWidth={2} color={t.blue} />}
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

const PAGE_SIZE = 10;

export default function AnnouncementHistoryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const [rows, setRows] = useState<AnnouncementRow[]>(ROWS);
  const [cancellingRow, setCancellingRow] = useState<AnnouncementRow | null>(null);
  const [deletingRow, setDeletingRow] = useState<AnnouncementRow | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [channel, setChannel] = useState<ChannelFilter>('all');
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-15' });
  const [page, setPage] = useState(1);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [sentToast, setSentToast] = useState<{ title: string; summary: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const consumedRef = useRef(false);
  useEffect(() => {
    if (consumedRef.current) return;
    const s = location.state as
      | { newRow?: AnnouncementRow; toast?: { title: string; summary: string } }
      | null;
    if (!s?.newRow) return;
    consumedRef.current = true;

    setRows(prev => [s.newRow!, ...prev]);
    setHighlightId(s.newRow.id);
    if (s.toast) setSentToast(s.toast);
    setPage(1);
    setStatus('all');
    setChannel('all');
    setQuery('');

    navigate(location.pathname, { replace: true, state: null });

    const to = window.setTimeout(() => setHighlightId(null), 2500);
    return () => window.clearTimeout(to);
  }, [location, navigate]);

  const scrollToHighlighted = () => {
    if (highlightId == null) return;
    const el = document.getElementById(`anno-row-${highlightId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const confirmCancel = () => {
    if (!cancellingRow) return;
    setRows(prev => prev.map(r =>
      r.id === cancellingRow.id ? { ...r, status: 'draft' as const, date: null } : r
    ));
    setCancellingRow(null);
  };

  const confirmDelete = () => {
    if (!deletingRow) return;
    setRows(prev => prev.filter(r => r.id !== deletingRow.id));
    setDeletingRow(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      if (status !== 'all' && r.status !== status) return false;
      if (channel !== 'all' && !r.channels.includes(channel)) return false;
      if (q && !r.title.toLowerCase().includes(q) && !r.recipientsLabel.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, query, status, channel]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount);
  const visible = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const resetFilters = () => { setQuery(''); setStatus('all'); setChannel('all'); };

  const pulseBg = dark ? 'rgba(59,130,246,0.15)' : C.blueLt;
  const tableHeaderBg = dark ? D.tableHeaderBg : '#F9FAFB';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
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
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>История объявлений</span>
          </div>

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                История объявлений
              </h1>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '6px' }}>
                Все отправленные и запланированные объявления
              </div>
            </div>
            <PrimaryButton icon={Plus} onClick={() => navigate('/announcements/new')} t={t}>
              Новое объявление
            </PrimaryButton>
          </div>

          {/* Filter bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center',
            marginBottom: '16px',
          }}>
            <SearchInput value={query} onChange={setQuery} t={t} />
            <FilterSelect label="Статус" value={status} options={STATUS_OPTIONS} onChange={setStatus} t={t} dark={dark} />
            <FilterSelect label="Канал" value={channel} options={CHANNEL_OPTIONS} onChange={setChannel} t={t} dark={dark} />
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* Table card */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.inter }}>
                <thead>
                  <tr style={{ background: tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                    <Th width="44px" t={t}>#</Th>
                    <Th width="130px" t={t}>Дата отправки</Th>
                    <Th t={t}>Заголовок</Th>
                    <Th t={t}>Получатели</Th>
                    <Th t={t}>Каналы</Th>
                    <Th width="110px" t={t}>Доставлено</Th>
                    <Th width="110px" t={t}>Прочитано</Th>
                    <Th width="150px" t={t}>Статус</Th>
                    <Th width="48px" t={t} />
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ padding: 0 }}>
                        <EmptyState
                          icon={Inbox}
                          title="Ничего не найдено"
                          subtitle="Попробуйте изменить фильтры или очистить поиск."
                          outline={{ label: 'Сбросить фильтры', onClick: resetFilters }}
                        />
                      </td>
                    </tr>
                  ) : visible.map(r => (
                    <Row
                      key={r.id}
                      row={r}
                      highlight={r.id === highlightId}
                      onOpen={() => {
                        if (r.status === 'draft') {
                          navigate('/announcements/new', { state: { draft: r } });
                        } else {
                          navigate(`/announcements/${r.id}`);
                        }
                      }}
                      onDuplicate={() => navigate('/announcements/new')}
                      onEdit={() => navigate('/announcements/new', { state: { draft: r } })}
                      onCancel={() => setCancellingRow(r)}
                      onDelete={() => setDeletingRow(r)}
                      t={t}
                      dark={dark}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderTop: `1px solid ${t.border}`,
              fontFamily: F.inter, fontSize: '13px', color: t.text3,
            }}>
              <div>
                {filtered.length === 0
                  ? 'Ничего не найдено'
                  : `Показано ${(pageSafe - 1) * PAGE_SIZE + 1}–${Math.min(pageSafe * PAGE_SIZE, filtered.length)} из ${filtered.length}`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <PageBtn disabled={pageSafe <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} t={t}>
                  <ChevronLeft size={14} strokeWidth={1.75} />
                </PageBtn>
                <span style={{ padding: '0 10px', fontFamily: F.inter, fontSize: '13px', color: t.text1 }}>
                  {pageSafe} / {pageCount}
                </span>
                <PageBtn disabled={pageSafe >= pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))} t={t}>
                  <ChevronRight size={14} strokeWidth={1.75} />
                </PageBtn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CancelScheduledModal
        row={cancellingRow}
        onClose={() => setCancellingRow(null)}
        onConfirm={confirmCancel}
        t={t}
        dark={dark}
      />

      <DeleteDraftModal
        row={deletingRow}
        onClose={() => setDeletingRow(null)}
        onConfirm={confirmDelete}
        t={t}
        dark={dark}
      />

      {sentToast && (
        <SentAnnouncementToast
          title={sentToast.title}
          summary={sentToast.summary}
          onOpen={() => { scrollToHighlighted(); setSentToast(null); }}
          onClose={() => setSentToast(null)}
          t={t}
          dark={dark}
        />
      )}

      <style>{`
        @keyframes annoRowPulseBg {
          0%   { background-color: ${pulseBg}; }
          60%  { background-color: ${pulseBg}; }
          100% { background-color: transparent; }
        }
        @keyframes annoRowPulseBorder {
          0%   { box-shadow: inset 3px 0 0 ${t.blue}; }
          60%  { box-shadow: inset 3px 0 0 ${t.blue}; }
          100% { box-shadow: inset 3px 0 0 transparent; }
        }
        .anno-row-pulse { animation: annoRowPulseBg 2s ease-out 1; }
        .anno-row-pulse > td:first-child { animation: annoRowPulseBorder 2s ease-out 1; }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CANCEL SCHEDULED MODAL
═══════════════════════════════════════════════════════════════════════════ */

function CancelScheduledModal({ row, onClose, onConfirm, t, dark }: {
  row: AnnouncementRow | null;
  onClose: () => void;
  onConfirm: () => void;
  t: T;
  dark: boolean;
}) {
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!row) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [row, onClose]);

  if (!row) return null;

  const overlayBg = dark ? 'rgba(0,0,0,0.6)' : 'rgba(17, 24, 39, 0.50)';
  const closeHovBg = dark ? D.tableHover : '#F3F4F6';
  const warnBg = dark ? 'rgba(251,191,36,0.08)' : C.warningBg;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: overlayBg,
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
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '18px 20px', borderBottom: `1px solid ${t.border}`, flexShrink: 0,
        }}>
          <XCircle size={20} color={t.warning} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1,
          }}>
            Отменить отправку
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '28px', height: '28px', border: 'none', borderRadius: '7px',
              background: closeHov ? closeHovBg : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={t.text3} strokeWidth={1.75} />
          </button>
        </div>

        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <div style={{
            background: warnBg,
            borderTop: `1px solid ${t.border}`,
            borderRight: `1px solid ${t.border}`,
            borderBottom: `1px solid ${t.border}`,
            borderLeft: `3px solid ${t.warning}`,
            borderRadius: '8px', padding: '12px',
            display: 'flex', flexDirection: 'column', gap: '6px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '10px', flexWrap: 'wrap',
            }}>
              <span style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1,
              }}>
                {row.title}
              </span>
              <StatusBadge status="scheduled" dark={dark} />
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Получатели: <span style={{ color: t.text2 }}>{row.recipientsLabel}</span>
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Запланировано на: <span style={{ fontFamily: F.mono, color: t.text2 }}>
                {row.date ?? '—'}
              </span>
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Каналы: <span style={{ color: t.text2 }}>
                {row.channels.length ? row.channels.join(', ') : '—'}
              </span>
            </div>
          </div>

          <p style={{
            margin: 0, fontFamily: F.inter, fontSize: '14px',
            color: t.text1, lineHeight: 1.5,
          }}>
            Объявление будет отменено и перемещено в черновики.
            Вы сможете отредактировать и отправить его позже.
          </p>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '16px 20px', borderTop: `1px solid ${t.border}`, flexShrink: 0,
        }}>
          <OutlineButton onClick={onClose} t={t}>Назад</OutlineButton>
          <PrimaryButtonDialog onClick={onConfirm} icon={XCircle} t={t} dark={dark}>
            Отменить отправку
          </PrimaryButtonDialog>
        </div>
      </div>
    </div>
  );
}

function OutlineButton({ children, onClick, t }: {
  children: React.ReactNode; onClick?: () => void; t: T;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: `1px solid ${hov ? t.text3 : t.inputBorder}`,
        borderRadius: '8px', background: t.surface,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.text1, cursor: 'pointer',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function PrimaryButtonDialog({ children, onClick, icon: Icon, t, dark }: {
  children: React.ReactNode; onClick?: () => void; icon?: React.ElementType; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: 'none', borderRadius: '8px',
        background: hov ? t.blueHover : t.blue,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: '#FFFFFF', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: dark ? 'none' : (hov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)'),
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {Icon && <Icon size={14} strokeWidth={1.75} />}
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DELETE DRAFT MODAL
═══════════════════════════════════════════════════════════════════════════ */

function DeleteDraftModal({ row, onClose, onConfirm, t, dark }: {
  row: AnnouncementRow | null;
  onClose: () => void;
  onConfirm: () => void;
  t: T;
  dark: boolean;
}) {
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!row) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [row, onClose]);

  if (!row) return null;

  const overlayBg = dark ? 'rgba(0,0,0,0.6)' : 'rgba(17, 24, 39, 0.50)';
  const closeHovBg = dark ? D.tableHover : '#F3F4F6';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: overlayBg,
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
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1,
          }}>
            Удалить черновик
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '28px', height: '28px', border: 'none', borderRadius: '7px',
              background: closeHov ? closeHovBg : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={t.text3} strokeWidth={1.75} />
          </button>
        </div>

        <div style={{
          padding: '20px',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          <p style={{
            margin: 0, fontFamily: F.inter, fontSize: '14px',
            color: t.text1, lineHeight: 1.5,
          }}>
            Удалить черновик «<span style={{ fontWeight: 500 }}>{row.title}</span>»?
          </p>
          <p style={{
            margin: 0, fontFamily: F.inter, fontSize: '12px',
            color: t.text3, lineHeight: 1.5,
          }}>
            Черновик будет удалён навсегда. Это действие нельзя отменить.
          </p>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '16px 20px', borderTop: `1px solid ${t.border}`,
        }}>
          <OutlineButton onClick={onClose} t={t}>Отмена</OutlineButton>
          <DestructiveButton onClick={onConfirm} icon={Trash2} t={t} dark={dark}>Удалить</DestructiveButton>
        </div>
      </div>
    </div>
  );
}

function DestructiveButton({ children, onClick, icon: Icon, t, dark }: {
  children: React.ReactNode; onClick?: () => void; icon?: React.ElementType; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: 'none', borderRadius: '8px',
        background: hov ? '#DC2626' : t.error,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: '#FFFFFF', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: dark ? 'none' : (hov ? '0 2px 8px rgba(239,68,68,0.32)' : '0 1px 3px rgba(239,68,68,0.18)'),
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {Icon && <Icon size={14} strokeWidth={1.75} />}
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROW
═══════════════════════════════════════════════════════════════════════════ */

function Row({ row, highlight, onOpen, onDuplicate, onEdit, onCancel, onDelete, t, dark }: {
  row: AnnouncementRow;
  highlight?: boolean;
  onOpen: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  t: T;
  dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const isFresh = row.date === 'Только что';
  const hoverBg = dark ? D.tableHover : '#F9FAFB';
  return (
    <tr
      id={`anno-row-${row.id}`}
      className={highlight ? 'anno-row-pulse' : undefined}
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${t.border}`,
        cursor: 'pointer',
        background: hov && !highlight ? hoverBg : undefined,
        transition: 'background 0.1s',
      }}
    >
      <Td t={t}><span style={{ fontFamily: F.mono, fontSize: '12px', color: t.text3 }}>{row.id}</span></Td>
      <Td t={t}>
        {row.date
          ? isFresh
            ? <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.blue, fontWeight: 500 }}>{row.date}</span>
            : <span style={{ fontFamily: F.mono, fontSize: '12px', color: t.text1 }}>{row.date}</span>
          : <span style={{ color: t.text4 }}>—</span>}
      </Td>
      <Td t={t}><span style={{ color: t.text1, fontWeight: 500 }}>{row.title}</span></Td>
      <Td t={t}><span style={{ color: t.text2, fontSize: '13px' }}>{row.recipientsLabel}</span></Td>
      <Td t={t}>
        {row.channels.length === 0
          ? <span style={{ color: t.text4 }}>—</span>
          : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {row.channels.map(c => <ChannelBadge key={c} label={c} t={t} />)}
            </div>
          )}
      </Td>
      <Td t={t}><ProgressCell value={row.delivered} t={t} dark={dark} /></Td>
      <Td t={t}><ProgressCell value={row.read} t={t} dark={dark} /></Td>
      <Td t={t}><StatusBadge status={row.status} dark={dark} /></Td>
      <Td t={t}>
        <RowActionMenu
          status={row.status}
          onDetail={onOpen}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
          onCancel={onCancel}
          onDelete={onDelete}
          t={t}
          dark={dark}
        />
      </Td>
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SENT TOAST (post-send handoff)
═══════════════════════════════════════════════════════════════════════════ */

function SentAnnouncementToast({ title, summary, onOpen, onClose, t, dark }: {
  title: string;
  summary: string;
  onOpen: () => void;
  onClose: () => void;
  t: T;
  dark: boolean;
}) {
  useEffect(() => {
    const to = window.setTimeout(onClose, 6000);
    return () => window.clearTimeout(to);
  }, [onClose]);

  const successBorder = dark ? 'rgba(52,211,153,0.35)' : '#A7F3D0';

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed', top: '24px', right: '24px',
        width: '400px', maxWidth: 'calc(100vw - 48px)',
        background: t.surface,
        borderTop: `1px solid ${t.border}`,
        borderRight: `1px solid ${t.border}`,
        borderBottom: `1px solid ${t.border}`,
        borderLeft: `3px solid ${t.success}`,
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 12px 32px rgba(0,0,0,0.12)',
        zIndex: 300,
        animation: 'sentToastIn 0.2s ease-out',
      }}
    >
      <style>{`
        @keyframes sentToastIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        background: t.successBg, border: `1px solid ${successBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
      }}>
        <CheckCircle2 size={14} color={t.success} strokeWidth={2} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 600,
          color: t.text1, lineHeight: 1.4,
        }}>
          Объявление отправлено
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: t.text3,
          marginTop: '3px', lineHeight: 1.45,
        }}>
          «{title}» → {summary}
        </div>
        <button
          type="button"
          onClick={onOpen}
          style={{
            marginTop: '8px',
            background: 'transparent', border: 'none', padding: 0,
            fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
            color: t.blue, cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = t.blueHover)}
          onMouseLeave={e => (e.currentTarget.style.color = t.blue)}
        >
          Открыть в истории →
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        style={{
          background: 'transparent', border: 'none', padding: '2px',
          color: t.text3, cursor: 'pointer', flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <X size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CELLS & HELPERS
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

function SearchInput({ value, onChange, t }: { value: string; onChange: (v: string) => void; t: T }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      height: '36px', width: '320px', padding: '0 12px',
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
        placeholder="Поиск по теме или тексту..."
        style={{
          flex: 1, border: 'none', outline: 'none',
          fontFamily: F.inter, fontSize: '13px', color: t.text1, background: 'transparent',
        }}
      />
    </div>
  );
}

function PageBtn({ children, disabled, onClick, t }: {
  children: React.ReactNode; disabled?: boolean; onClick: () => void; t: T;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '32px', height: '32px', border: `1px solid ${t.border}`, borderRadius: '6px',
        background: t.surface, color: disabled ? t.text4 : t.text2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, icon: Icon, onClick, t }: {
  children: React.ReactNode; icon?: React.ElementType; onClick?: () => void; t: T;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: 'none', borderRadius: '8px',
        background: hov ? t.blueHover : t.blue,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: '#FFFFFF', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: hov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {Icon && <Icon size={15} strokeWidth={2} />}
      {children}
    </button>
  );
}
