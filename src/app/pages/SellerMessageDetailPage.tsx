import React, { useEffect, useState } from 'react';
import {
  Bell, ChevronRight, Copy, Check, Send, MailCheck, Eye,
  Trash2, X,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════════════════════════ */

type Channel = 'In-app' | 'Push';

interface DeliveryRow {
  id: number;
  initials: string;
  name: string;
  channels: Channel[];
  deliveredAt: string | null;
  readAt: string | null;
}

interface MessageDetail {
  id: number;
  title: string;
  body: string;
  sentAt: string;
  sentAtCaption: string;
  from: string;
  stats: { sent: [number, number]; delivered: [number, number]; read: [number, number] };
  rows: DeliveryRow[];
}

const DETAIL: MessageDetail = {
  id: 1,
  title: 'Напоминание о плане продаж',
  body: 'Коллеги, напоминаю о необходимости выполнить план продаж в этом месяце. Проверьте прогресс по вашим KPI, держите связь с клиентами и не забывайте фиксировать продажи в системе. По любым вопросам обращайтесь ко мне напрямую.',
  sentAt: '13.04.2026 11:00',
  sentAtCaption: 'Отправлено: 13.04.2026 11:00',
  from: 'Мухаммад Н. (Mysafar OOO)',
  stats: {
    sent:      [6, 6],
    delivered: [6, 6],
    read:      [4, 6],
  },
  rows: [
    { id: 1, initials: 'СМ', name: 'Санжар Мирзаев',   channels: ['In-app', 'Push'], deliveredAt: '11:01', readAt: '11:05' },
    { id: 2, initials: 'АР', name: 'Абдуллох Рахимов', channels: ['In-app', 'Push'], deliveredAt: '11:01', readAt: '11:30' },
    { id: 3, initials: 'ИТ', name: 'Ислом Тошматов',   channels: ['In-app', 'Push'], deliveredAt: '11:01', readAt: '12:00' },
    { id: 4, initials: 'НК', name: 'Нилуфар Каримова', channels: ['In-app', 'Push'], deliveredAt: '11:01', readAt: '14:20' },
    { id: 5, initials: 'ДН', name: 'Дарья Нам',        channels: ['In-app', 'Push'], deliveredAt: '11:01', readAt: null },
    { id: 6, initials: 'КР', name: 'Камола Расулова',  channels: ['In-app', 'Push'], deliveredAt: '11:01', readAt: null },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function SellerMessageDetailPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const navigate = useNavigate();
  const { id } = useParams();

  const data = DETAIL; // mock: same payload regardless of id
  const [deleteOpen, setDeleteOpen] = useState(false);
  const readPct = pct(data.stats.read);
  const deliveredPct = pct(data.stats.delivered);
  const sentPct = pct(data.stats.sent);

  const crumbLink: React.CSSProperties = {
    fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer',
  };

  const cardStyle: React.CSSProperties = {
    background: t.surface, border: `1px solid ${t.border}`,
    borderRadius: '12px', padding: '20px',
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg }}>
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
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/seller-messages')} style={crumbLink}>Отправленные сообщения</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
              {data.title}
            </span>
          </div>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
          }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                {data.title}
              </h1>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '6px' }}>
                {data.sentAtCaption}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
              <OutlineButton icon={Copy} onClick={() => navigate('/seller-messages/new')} t={t}>
                Дублировать
              </OutlineButton>
              <PageDestructiveButton icon={Trash2} onClick={() => setDeleteOpen(true)} t={t} dark={dark}>
                Удалить
              </PageDestructiveButton>
            </div>
          </div>

          {/* Two-column grid: message left (55%) / stats right (45%) */}
          <div className="smd-grid" style={{
            display: 'grid', gridTemplateColumns: '55fr 45fr', gap: '20px',
            marginBottom: '20px',
          }}>
            {/* Left: message card */}
            <div style={cardStyle}>
              <div style={{
                fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                color: t.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
                marginBottom: '10px',
              }}>
                Сообщение
              </div>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '12px', border: `1px solid ${t.border}`, borderRadius: '8px',
                background: dark ? D.tableHeaderBg : t.surface,
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: t.blueLt, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bell size={18} color={t.blue} strokeWidth={1.75} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1 }}>
                    📢 {data.title}
                  </div>
                  <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2, marginTop: '6px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {data.body}
                  </div>
                  <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, marginTop: '12px' }}>
                    От: <span style={{ color: t.text2 }}>{data.from}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: stats column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <CompactStat
                icon={Send}
                tone={sentPct === 100 ? 'green' : 'amber'}
                label="Отправлено"
                valueTop={`${data.stats.sent[0]}/${data.stats.sent[1]}`}
                valuePct={sentPct}
                t={t}
                dark={dark}
              />
              <CompactStat
                icon={MailCheck}
                tone={deliveredPct === 100 ? 'green' : 'amber'}
                label="Доставлено"
                valueTop={`${data.stats.delivered[0]}/${data.stats.delivered[1]}`}
                valuePct={deliveredPct}
                t={t}
                dark={dark}
              />
              <CompactStat
                icon={Eye}
                tone={readPct === 100 ? 'green' : 'amber'}
                label="Прочитано"
                valueTop={`${data.stats.read[0]}/${data.stats.read[1]}`}
                valuePct={readPct}
                t={t}
                dark={dark}
              />
            </div>
          </div>

          {/* Delivery table */}
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: '14px 18px', borderBottom: `1px solid ${t.border}`,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: t.text1,
            }}>
              Детали доставки · {data.rows.length} продавцов
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.inter }}>
                <thead>
                  <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                    <Th t={t}>Продавец</Th>
                    <Th t={t}>Каналы</Th>
                    <Th width="150px" t={t}>Доставлено</Th>
                    <Th width="150px" t={t}>Прочитано</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map(r => <DeliveryRowView key={r.id} row={r} t={t} />)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .smd-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>

      <DeleteMessageModal
        open={deleteOpen}
        title={data.title}
        sentAt={data.sentAt}
        recipientsLabel={`${data.rows.length} продавцов`}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => { setDeleteOpen(false); navigate('/seller-messages'); }}
        t={t}
        dark={dark}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DELETE MODAL
═══════════════════════════════════════════════════════════════════════════ */

function DeleteMessageModal({ open, title, sentAt, recipientsLabel, onClose, onConfirm, t, dark }: {
  open: boolean;
  title: string;
  sentAt: string;
  recipientsLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  t: T;
  dark: boolean;
}) {
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const overlayBg = dark ? 'rgba(0,0,0,0.6)' : 'rgba(17, 24, 39, 0.50)';
  const closeHovBg = dark ? D.tableHover : '#F3F4F6';
  const errBg = dark ? 'rgba(248,113,113,0.10)' : C.errorBg;

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
          borderRadius: '16px',
          boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 24px 48px rgba(0,0,0,0.18)',
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
            Удалить сообщение
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
              color: closeHov ? t.text1 : t.text3,
            }}
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        <div style={{
          padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <div style={{
            background: errBg,
            borderTop: `1px solid ${t.border}`,
            borderRight: `1px solid ${t.border}`,
            borderBottom: `1px solid ${t.border}`,
            borderLeft: `3px solid ${t.error}`,
            borderRadius: '8px', padding: '12px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1 }}>
              {title}
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Отправлено: <span style={{ fontFamily: F.mono, color: t.text2 }}>{sentAt}</span>
              <span style={{ margin: '0 6px', color: t.text4 }}>|</span>
              Получатели: <span style={{ color: t.text2 }}>{recipientsLabel}</span>
            </div>
          </div>

          <p style={{
            margin: 0, fontFamily: F.inter, fontSize: '14px',
            color: t.text2, lineHeight: 1.5,
          }}>
            Сообщение будет удалено из вашей истории. Уже доставленные уведомления
            у продавцов сохранятся.
          </p>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '16px 20px', borderTop: `1px solid ${t.border}`,
        }}>
          <DialogOutlineButton onClick={onClose} t={t}>Отмена</DialogOutlineButton>
          <DialogDestructiveButton onClick={onConfirm} icon={Trash2} t={t} dark={dark}>Удалить сообщение</DialogDestructiveButton>
        </div>
      </div>
    </div>
  );
}

function DialogOutlineButton({ children, onClick, t }: {
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
        border: `1px solid ${t.border}`,
        borderRadius: '8px', background: hov ? t.tableHover : 'transparent',
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.text2, cursor: 'pointer',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function DialogDestructiveButton({ children, onClick, icon: Icon, t, dark }: {
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
        height: '38px', padding: '0 16px',
        border: 'none', borderRadius: '8px',
        background: hov ? '#EF4444' : t.error,
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

function PageDestructiveButton({ children, onClick, icon: Icon, t, dark }: {
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
        height: '38px', padding: '0 16px',
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
   DELIVERY ROW
═══════════════════════════════════════════════════════════════════════════ */

function DeliveryRowView({ row, t }: { row: DeliveryRow; t: T }) {
  return (
    <tr style={{ borderBottom: `1px solid ${t.border}` }}>
      <Td t={t}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: t.blueLt, color: t.blue,
            fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {row.initials}
          </div>
          <span style={{ color: t.text1, fontWeight: 500 }}>{row.name}</span>
        </div>
      </Td>
      <Td t={t}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {row.channels.map(c => (
            <span key={c} style={{
              fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
              padding: '3px 8px', borderRadius: '6px',
              background: t.blueLt, color: t.blue, whiteSpace: 'nowrap',
            }}>{c}</span>
          ))}
        </div>
      </Td>
      <Td t={t}><TimestampCell at={row.deliveredAt} t={t} /></Td>
      <Td t={t}><TimestampCell at={row.readAt} emptyLabel="Не прочитано" t={t} /></Td>
    </tr>
  );
}

function TimestampCell({ at, emptyLabel, t }: { at: string | null; emptyLabel?: string; t: T }) {
  if (!at) return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontFamily: F.inter, fontSize: '12px', color: t.text4,
    }}>
      —
      {emptyLabel && <span>{emptyLabel}</span>}
    </span>
  );
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontFamily: F.inter, fontSize: '12px', color: t.text1,
    }}>
      <Check size={13} strokeWidth={2.25} color={t.success} />
      <span style={{ fontFamily: F.mono }}>{at}</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPACT STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

function CompactStat({ icon: Icon, tone, label, valueTop, valuePct, t, dark }: {
  icon: React.ElementType;
  tone: 'green' | 'amber';
  label: string;
  valueTop: string;
  valuePct: number;
  t: T;
  dark: boolean;
}) {
  const tones = {
    green: { bg: t.successBg, fg: t.success, text: dark ? t.success : '#15803D' },
    amber: { bg: t.warningBg, fg: t.warning, text: dark ? t.warning : '#B45309' },
  };
  const tone1 = tones[tone];
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: '12px', padding: '14px 16px',
      display: 'flex', gap: '12px', alignItems: 'center',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: tone1.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} color={tone1.fg} strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500, color: t.text3 }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
          <span style={{ fontFamily: F.dm, fontSize: '20px', fontWeight: 700, color: t.text1 }}>
            {valueTop}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 600, color: tone1.text }}>
            {valuePct}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMITIVES
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

function OutlineButton({ children, onClick, icon: Icon, t }: {
  children: React.ReactNode; onClick?: () => void; icon?: React.ElementType; t: T;
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
        border: `1px solid ${hov ? t.text3 : t.inputBorder}`,
        borderRadius: '8px', background: t.surface,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.text1, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {Icon && <Icon size={14} strokeWidth={1.75} />}
      {children}
    </button>
  );
}

function pct(v: [number, number]) {
  const [a, b] = v;
  if (b === 0) return 0;
  return Math.round((a / b) * 100);
}
