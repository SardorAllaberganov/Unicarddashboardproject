import React, { useMemo, useState } from 'react';
import {
  ChevronRight, ChevronLeft, Plus, MoreVertical,
  Eye, Copy, Trash2, Inbox,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { usePopoverPosition } from '../components/usePopoverPosition';
import { EmptyState } from '../components/EmptyState';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════════════════════════ */

type Channel = 'In-app' | 'Push';

interface MessageRow {
  id: number;
  date: string;
  title: string;
  recipientsLabel: string;
  channels: Channel[];
  delivered: [number, number];
  read: [number, number];
}

const ROWS: MessageRow[] = [
  { id: 1, date: '13.04 11:00', title: 'Напоминание о плане продаж',        recipientsLabel: 'Все продавцы (6)',  channels: ['In-app', 'Push'], delivered: [6, 6], read: [4, 6] },
  { id: 2, date: '10.04 09:00', title: 'Новые карты доступны',              recipientsLabel: 'Санжар, Абдуллох (2)', channels: ['In-app'],       delivered: [2, 2], read: [2, 2] },
  { id: 3, date: '05.04 14:00', title: 'Поздравление: Санжар — KPI 3!',     recipientsLabel: 'Санжар (1)',        channels: ['In-app', 'Push'], delivered: [1, 1], read: [1, 1] },
  { id: 4, date: '01.04 10:00', title: 'Старт продаж Партии Апрель',        recipientsLabel: 'Все продавцы (6)',  channels: ['In-app'],         delivered: [6, 6], read: [5, 6] },
];

const PAGE_SIZE = 10;

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES & PROGRESS
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

function ProgressCell({ value }: { value: [number, number] }) {
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

function RowActionMenu({ onDetail, onDuplicate, onDelete }: {
  onDetail: () => void; onDuplicate: () => void; onDelete: () => void;
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
          {item('Подробнее', Eye, onDetail)}
          {item('Дублировать', Copy, onDuplicate)}
          <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
          {item('Удалить', Trash2, onDelete, true)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function SellerMessageHistoryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [rows, setRows] = useState<MessageRow[]>(ROWS);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pageCount);
  const visible = rows.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const remove = (id: number) => setRows(prev => prev.filter(r => r.id !== id));

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar
        role="org"
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
            <span onClick={() => navigate('/org-dashboard')} style={crumbLink}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Отправленные сообщения</span>
          </div>

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Отправленные сообщения
              </h1>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '6px' }}>
                История сообщений продавцам Mysafar OOO
              </div>
            </div>
            <PrimaryButton icon={Plus} onClick={() => navigate('/seller-messages/new')}>
              Новое сообщение
            </PrimaryButton>
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
                    <Th width="130px">Дата</Th>
                    <Th>Заголовок</Th>
                    <Th>Получатели</Th>
                    <Th>Каналы</Th>
                    <Th width="110px">Доставлено</Th>
                    <Th width="110px">Прочитано</Th>
                    <Th width="48px" />
                  </tr>
                </thead>
                <tbody>
                  {visible.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: 0 }}>
                        <EmptyState
                          icon={Inbox}
                          title="Сообщений пока нет"
                          subtitle="Отправьте первое сообщение вашим продавцам."
                          primary={{
                            label: 'Новое сообщение',
                            icon: <Plus size={14} strokeWidth={2} />,
                            onClick: () => navigate('/seller-messages/new'),
                          }}
                        />
                      </td>
                    </tr>
                  ) : visible.map(r => (
                    <Row
                      key={r.id}
                      row={r}
                      onOpen={() => navigate(`/seller-messages/${r.id}`)}
                      onDuplicate={() => navigate('/seller-messages/new')}
                      onDelete={() => remove(r.id)}
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
                {rows.length === 0
                  ? 'Ничего не найдено'
                  : `Показано ${(pageSafe - 1) * PAGE_SIZE + 1}–${Math.min(pageSafe * PAGE_SIZE, rows.length)} из ${rows.length}`}
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

function Row({ row, onOpen, onDuplicate, onDelete }: {
  row: MessageRow;
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
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
      <Td><span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text1 }}>{row.date}</span></Td>
      <Td><span style={{ color: C.text1, fontWeight: 500 }}>{row.title}</span></Td>
      <Td><span style={{ color: C.text2, fontSize: '13px' }}>{row.recipientsLabel}</span></Td>
      <Td>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {row.channels.map(c => <ChannelBadge key={c} label={c} />)}
        </div>
      </Td>
      <Td><ProgressCell value={row.delivered} /></Td>
      <Td><ProgressCell value={row.read} /></Td>
      <Td>
        <RowActionMenu
          onDetail={onOpen}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      </Td>
    </tr>
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

const crumbLink: React.CSSProperties = {
  fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer',
};
