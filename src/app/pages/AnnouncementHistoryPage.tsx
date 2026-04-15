import React, { useMemo, useState } from 'react';
import {
  ChevronRight, ChevronDown, ChevronLeft, Search, Plus, MoreVertical,
  Eye, Copy, XCircle, Trash2, Pencil, Check, Inbox,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { usePopoverPosition } from '../components/usePopoverPosition';
import { DateRangePicker } from '../components/DateRangePicker';
import { EmptyState } from '../components/EmptyState';

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
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

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

function StatusBadge({ status }: { status: Status }) {
  const cfg: Record<Status, { bg: string; color: string; dot: string; label: string }> = {
    sent:      { bg: C.successBg, color: '#15803D', dot: C.success, label: 'Отправлено' },
    scheduled: { bg: C.warningBg, color: '#B45309', dot: C.warning, label: 'Запланировано' },
    draft:     { bg: '#F3F4F6',   color: C.text3,   dot: C.text4,   label: 'Черновик' },
  };
  const c = cfg[status];
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

function ProgressCell({ value }: { value: [number, number] | null }) {
  if (!value) return <span style={{ color: C.text4 }}>—</span>;
  const [done, total] = value;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const complete = done === total;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '56px' }}>
      <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text1 }}>
        {done}/{total}
      </span>
      <div style={{
        width: '100%', height: '4px', borderRadius: '2px',
        background: '#F3F4F6', overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: complete ? C.success : C.warning,
          transition: 'width 0.2s',
        }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION MENU
═══════════════════════════════════════════════════════════════════════════ */

function RowActionMenu({ status, onDetail, onDuplicate, onEdit, onCancel, onDelete }: {
  status: Status;
  onDetail: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } = usePopoverPosition();
  const [hov, setHov] = useState<string | null>(null);

  const item = (label: string, Icon: React.ElementType, onClick: () => void, destructive = false) => (
    <button
      onMouseEnter={() => setHov(label)}
      onMouseLeave={() => setHov(null)}
      onClick={e => { e.stopPropagation(); close(); onClick(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        width: '100%', padding: '9px 12px',
        background: hov === label ? (destructive ? C.errorBg : C.blueLt) : 'transparent',
        border: 'none', cursor: 'pointer',
        fontFamily: F.inter, fontSize: '13px',
        color: destructive ? C.error : C.text2, textAlign: 'left',
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
          border: 'none', background: open ? '#F3F4F6' : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.12s',
        }}
      >
        <MoreVertical size={16} color={C.text3} />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '180px',
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(17,24,39,0.08)',
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
              <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
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

const PAGE_SIZE = 10;

export default function AnnouncementHistoryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [channel, setChannel] = useState<ChannelFilter>('all');
  const [dateRange, setDateRange] = useState({ from: '2026-04-01', to: '2026-04-15' });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROWS.filter(r => {
      if (status !== 'all' && r.status !== status) return false;
      if (channel !== 'all' && !r.channels.includes(channel)) return false;
      if (q && !r.title.toLowerCase().includes(q) && !r.recipientsLabel.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, status, channel]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount);
  const visible = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const resetFilters = () => { setQuery(''); setStatus('all'); setChannel('all'); };

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
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>История объявлений</span>
          </div>

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                История объявлений
              </h1>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '6px' }}>
                Все отправленные и запланированные объявления
              </div>
            </div>
            <PrimaryButton icon={Plus} onClick={() => navigate('/announcements/new')}>
              Новое объявление
            </PrimaryButton>
          </div>

          {/* Filter bar */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center',
            marginBottom: '16px',
          }}>
            <SearchInput value={query} onChange={setQuery} />
            <FilterSelect label="Статус" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
            <FilterSelect label="Канал" value={channel} options={CHANNEL_OPTIONS} onChange={setChannel} />
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          {/* Table card */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.inter }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: `1px solid ${C.border}` }}>
                    <Th width="44px">#</Th>
                    <Th width="130px">Дата отправки</Th>
                    <Th>Заголовок</Th>
                    <Th>Получатели</Th>
                    <Th>Каналы</Th>
                    <Th width="110px">Доставлено</Th>
                    <Th width="110px">Прочитано</Th>
                    <Th width="150px">Статус</Th>
                    <Th width="48px" />
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
                      onOpen={() => navigate(`/announcements/${r.id}`)}
                      onDuplicate={() => navigate('/announcements/new')}
                      onEdit={() => navigate('/announcements/new')}
                    />
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
                  : `Показано ${(pageSafe - 1) * PAGE_SIZE + 1}–${Math.min(pageSafe * PAGE_SIZE, filtered.length)} из ${filtered.length}`}
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
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROW
═══════════════════════════════════════════════════════════════════════════ */

function Row({ row, onOpen, onDuplicate, onEdit }: {
  row: AnnouncementRow;
  onOpen: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <tr
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${C.border}`,
        cursor: 'pointer',
        background: hov ? '#F9FAFB' : 'transparent',
        transition: 'background 0.1s',
      }}
    >
      <Td><span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text3 }}>{row.id}</span></Td>
      <Td>
        {row.date
          ? <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text1 }}>{row.date}</span>
          : <span style={{ color: C.text4 }}>—</span>}
      </Td>
      <Td><span style={{ color: C.text1, fontWeight: 500 }}>{row.title}</span></Td>
      <Td><span style={{ color: C.text2, fontSize: '13px' }}>{row.recipientsLabel}</span></Td>
      <Td>
        {row.channels.length === 0
          ? <span style={{ color: C.text4 }}>—</span>
          : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {row.channels.map(c => <ChannelBadge key={c} label={c} />)}
            </div>
          )}
      </Td>
      <Td><ProgressCell value={row.delivered} /></Td>
      <Td><ProgressCell value={row.read} /></Td>
      <Td><StatusBadge status={row.status} /></Td>
      <Td>
        <RowActionMenu
          status={row.status}
          onDetail={onOpen}
          onDuplicate={onDuplicate}
          onEdit={onEdit}
          onCancel={() => {}}
          onDelete={() => {}}
        />
      </Td>
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CELLS & HELPERS
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
        placeholder="Поиск по теме или тексту..."
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

const crumbLink: React.CSSProperties = {
  fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer',
};

function PrimaryButton({ children, icon: Icon, onClick }: {
  children: React.ReactNode; icon?: React.ElementType; onClick?: () => void;
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
        background: hov ? C.blueHover : C.blue,
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
