import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronRight, ChevronLeft, Plus, MoreVertical,
  Eye, Copy, Trash2, Inbox, X, CheckCircle2,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
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
  const [darkMode, setDarkMode] = useDarkMode();
  const [rows, setRows] = useState<MessageRow[]>(ROWS);
  const [deletingRow, setDeletingRow] = useState<MessageRow | null>(null);
  const [page, setPage] = useState(1);
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [sentToast, setSentToast] = useState<{ title: string; summary: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const consumedRef = useRef(false);
  useEffect(() => {
    if (consumedRef.current) return;
    const s = location.state as
      | { newRow?: MessageRow; toast?: { title: string; summary: string } }
      | null;
    if (!s?.newRow) return;
    consumedRef.current = true;

    setRows(prev => [s.newRow!, ...prev]);
    setHighlightId(s.newRow.id);
    if (s.toast) setSentToast(s.toast);
    setPage(1);

    navigate(location.pathname, { replace: true, state: null });

    const t = window.setTimeout(() => setHighlightId(null), 2500);
    return () => window.clearTimeout(t);
  }, [location, navigate]);

  const scrollToHighlighted = () => {
    if (highlightId == null) return;
    const el = document.getElementById(`msg-row-${highlightId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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
                      highlight={r.id === highlightId}
                      onOpen={() => navigate(`/seller-messages/${r.id}`)}
                      onDuplicate={() => navigate('/seller-messages/new')}
                      onDelete={() => setDeletingRow(r)}
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

      <DeleteMessageModal
        row={deletingRow}
        onClose={() => setDeletingRow(null)}
        onConfirm={() => {
          if (deletingRow) remove(deletingRow.id);
          setDeletingRow(null);
        }}
      />

      {sentToast && (
        <SentMessageToast
          title={sentToast.title}
          summary={sentToast.summary}
          onOpen={() => { scrollToHighlighted(); setSentToast(null); }}
          onClose={() => setSentToast(null)}
        />
      )}

      <style>{`
        @keyframes msgRowPulseBg {
          0%   { background-color: ${C.blueLt}; }
          60%  { background-color: ${C.blueLt}; }
          100% { background-color: transparent; }
        }
        @keyframes msgRowPulseBorder {
          0%   { box-shadow: inset 3px 0 0 ${C.blue}; }
          60%  { box-shadow: inset 3px 0 0 ${C.blue}; }
          100% { box-shadow: inset 3px 0 0 transparent; }
        }
        .msg-row-pulse { animation: msgRowPulseBg 2s ease-out 1; }
        .msg-row-pulse > td:first-child { animation: msgRowPulseBorder 2s ease-out 1; }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DELETE MESSAGE MODAL
═══════════════════════════════════════════════════════════════════════════ */

function DeleteMessageModal({ row, onClose, onConfirm }: {
  row: MessageRow | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!row) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [row, onClose]);

  if (!row) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`,
        }}>
          <Trash2 size={20} color={C.error} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Удалить сообщение
          </h2>
          <button
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            onClick={onClose}
            aria-label="Закрыть"
            style={{
              width: '28px', height: '28px', border: 'none', borderRadius: '7px',
              background: closeHov ? '#F3F4F6' : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={C.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          {/* Message card */}
          <div style={{
            background: C.errorBg,
            borderTop: `1px solid ${C.border}`,
            borderRight: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.error}`,
            borderRadius: '8px', padding: '12px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <div style={{
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1,
            }}>
              {row.title}
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
              Отправлено: <span style={{ fontFamily: F.mono, color: C.text2 }}>{row.date}</span>
              <span style={{ margin: '0 6px', color: C.text4 }}>|</span>
              Получатели: <span style={{ color: C.text2 }}>{row.recipientsLabel}</span>
            </div>
          </div>

          <p style={{
            margin: 0, fontFamily: F.inter, fontSize: '14px',
            color: C.text1, lineHeight: 1.5,
          }}>
            Сообщение будет удалено из вашей истории. Уже доставленные уведомления
            у продавцов сохранятся.
          </p>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '16px 20px', borderTop: `1px solid ${C.border}`,
        }}>
          <OutlineButton onClick={onClose}>Отмена</OutlineButton>
          <DestructiveButton onClick={onConfirm} icon={Trash2}>
            Удалить сообщение
          </DestructiveButton>
        </div>
      </div>
    </div>
  );
}

function OutlineButton({ children, onClick }: {
  children: React.ReactNode; onClick?: () => void;
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
        border: `1px solid ${hov ? C.text3 : C.inputBorder}`,
        borderRadius: '8px', background: C.surface,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: C.text1, cursor: 'pointer',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function DestructiveButton({ children, onClick, icon: Icon }: {
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
        height: '38px', padding: '0 18px',
        border: 'none', borderRadius: '8px',
        background: hov ? '#DC2626' : C.error,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: '#FFFFFF', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: hov ? '0 2px 8px rgba(239,68,68,0.32)' : '0 1px 3px rgba(239,68,68,0.18)',
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

function Row({ row, highlight, onOpen, onDuplicate, onDelete }: {
  row: MessageRow;
  highlight?: boolean;
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [hov, setHov] = useState(false);
  const isFresh = row.date === 'Только что';
  return (
    <tr
      id={`msg-row-${row.id}`}
      className={highlight ? 'msg-row-pulse' : undefined}
      onClick={onOpen}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${C.border}`,
        cursor: 'pointer',
        background: hov && !highlight ? '#F9FAFB' : undefined,
        transition: 'background 0.1s',
      }}
    >
      <Td><span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text3 }}>{row.id}</span></Td>
      <Td>
        {isFresh
          ? <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.blue, fontWeight: 500 }}>{row.date}</span>
          : <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text1 }}>{row.date}</span>}
      </Td>
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
   SENT TOAST (post-send handoff)
═══════════════════════════════════════════════════════════════════════════ */

function SentMessageToast({ title, summary, onOpen, onClose }: {
  title: string;
  summary: string;
  onOpen: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onClose, 6000);
    return () => window.clearTimeout(t);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed', top: '24px', right: '24px',
        width: '380px', maxWidth: 'calc(100vw - 48px)',
        background: C.surface,
        borderTop: `1px solid ${C.border}`,
        borderRight: `1px solid ${C.border}`,
        borderBottom: `1px solid ${C.border}`,
        borderLeft: `3px solid ${C.success}`,
        borderRadius: '10px',
        padding: '12px 14px',
        display: 'flex', alignItems: 'flex-start', gap: '10px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
        zIndex: 300,
        animation: 'msgSentToastIn 0.2s ease-out',
      }}
    >
      <style>{`
        @keyframes msgSentToastIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        background: C.successBg, border: '1px solid #A7F3D0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
      }}>
        <CheckCircle2 size={14} color={C.success} strokeWidth={2} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 600,
          color: C.text1, lineHeight: 1.4,
        }}>
          Сообщение отправлено
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: C.text3,
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
            color: C.blue, cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = C.blueHover)}
          onMouseLeave={e => (e.currentTarget.style.color = C.blue)}
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
          color: C.text3, cursor: 'pointer', flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <X size={14} strokeWidth={1.75} />
      </button>
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
