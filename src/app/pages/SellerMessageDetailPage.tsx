import React, { useEffect, useState } from 'react';
import {
  Bell, ChevronRight, Copy, Check, Send, MailCheck, Eye,
  Trash2, X,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';

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
  const navigate = useNavigate();
  const { id } = useParams();

  const data = DETAIL; // mock: same payload regardless of id
  const [deleteOpen, setDeleteOpen] = useState(false);
  const readPct = pct(data.stats.read);
  const deliveredPct = pct(data.stats.delivered);
  const sentPct = pct(data.stats.sent);

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
            <span onClick={() => navigate('/seller-messages')} style={crumbLink}>Отправленные сообщения</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>
              {data.title}
            </span>
          </div>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
          }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                {data.title}
              </h1>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '6px' }}>
                {data.sentAtCaption}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
              <OutlineButton icon={Copy} onClick={() => navigate('/seller-messages/new')}>
                Дублировать
              </OutlineButton>
              <DestructiveButton icon={Trash2} onClick={() => setDeleteOpen(true)}>
                Удалить
              </DestructiveButton>
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
                color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
                marginBottom: '10px',
              }}>
                Сообщение
              </div>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '12px', border: `1px solid ${C.border}`, borderRadius: '8px',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: C.blueLt, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bell size={18} color={C.blue} strokeWidth={1.75} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1 }}>
                    📢 {data.title}
                  </div>
                  <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2, marginTop: '6px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {data.body}
                  </div>
                  <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3, marginTop: '12px' }}>
                    От: <span style={{ color: C.text2 }}>{data.from}</span>
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
              />
              <CompactStat
                icon={MailCheck}
                tone={deliveredPct === 100 ? 'green' : 'amber'}
                label="Доставлено"
                valueTop={`${data.stats.delivered[0]}/${data.stats.delivered[1]}`}
                valuePct={deliveredPct}
              />
              <CompactStat
                icon={Eye}
                tone={readPct === 100 ? 'green' : 'amber'}
                label="Прочитано"
                valueTop={`${data.stats.read[0]}/${data.stats.read[1]}`}
                valuePct={readPct}
              />
            </div>
          </div>

          {/* Delivery table */}
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
            <div style={{
              padding: '14px 18px', borderBottom: `1px solid ${C.border}`,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: C.text1,
            }}>
              Детали доставки · {data.rows.length} продавцов
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.inter }}>
                <thead>
                  <tr style={{ background: '#F9FAFB', borderBottom: `1px solid ${C.border}` }}>
                    <Th>Продавец</Th>
                    <Th>Каналы</Th>
                    <Th width="150px">Доставлено</Th>
                    <Th width="150px">Прочитано</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map(r => <DeliveryRowView key={r.id} row={r} />)}
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
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DELETE MODAL
═══════════════════════════════════════════════════════════════════════════ */

function DeleteMessageModal({ open, title, sentAt, recipientsLabel, onClose, onConfirm }: {
  open: boolean;
  title: string;
  sentAt: string;
  recipientsLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

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
        }}
      >
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

        <div style={{
          padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          <div style={{
            background: C.errorBg,
            borderTop: `1px solid ${C.border}`,
            borderRight: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.error}`,
            borderRadius: '8px', padding: '12px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1 }}>
              {title}
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
              Отправлено: <span style={{ fontFamily: F.mono, color: C.text2 }}>{sentAt}</span>
              <span style={{ margin: '0 6px', color: C.text4 }}>|</span>
              Получатели: <span style={{ color: C.text2 }}>{recipientsLabel}</span>
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

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '16px 20px', borderTop: `1px solid ${C.border}`,
        }}>
          <OutlineButton onClick={onClose}>Отмена</OutlineButton>
          <DestructiveButton onClick={onConfirm} icon={Trash2}>Удалить сообщение</DestructiveButton>
        </div>
      </div>
    </div>
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
        height: '38px', padding: '0 16px',
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
   DELIVERY ROW
═══════════════════════════════════════════════════════════════════════════ */

function DeliveryRowView({ row }: { row: DeliveryRow }) {
  return (
    <tr style={{ borderBottom: `1px solid ${C.border}` }}>
      <Td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: C.blueLt, color: C.blue,
            fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {row.initials}
          </div>
          <span style={{ color: C.text1, fontWeight: 500 }}>{row.name}</span>
        </div>
      </Td>
      <Td>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {row.channels.map(c => (
            <span key={c} style={{
              fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
              padding: '3px 8px', borderRadius: '6px',
              background: C.blueLt, color: C.blue, whiteSpace: 'nowrap',
            }}>{c}</span>
          ))}
        </div>
      </Td>
      <Td><TimestampCell at={row.deliveredAt} /></Td>
      <Td><TimestampCell at={row.readAt} emptyLabel="Не прочитано" /></Td>
    </tr>
  );
}

function TimestampCell({ at, emptyLabel }: { at: string | null; emptyLabel?: string }) {
  if (!at) return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontFamily: F.inter, fontSize: '12px', color: C.text4,
    }}>
      —
      {emptyLabel && <span>{emptyLabel}</span>}
    </span>
  );
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontFamily: F.inter, fontSize: '12px', color: C.text1,
    }}>
      <Check size={13} strokeWidth={2.25} color={C.success} />
      <span style={{ fontFamily: F.mono }}>{at}</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPACT STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

function CompactStat({ icon: Icon, tone, label, valueTop, valuePct }: {
  icon: React.ElementType;
  tone: 'green' | 'amber';
  label: string;
  valueTop: string;
  valuePct: number;
}) {
  const tones = {
    green: { bg: C.successBg, fg: C.success, text: '#15803D' },
    amber: { bg: C.warningBg, fg: C.warning, text: '#B45309' },
  };
  const t = tones[tone];
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '14px 16px',
      display: 'flex', gap: '12px', alignItems: 'center',
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: t.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} color={t.fg} strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500, color: C.text3 }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
          <span style={{ fontFamily: F.dm, fontSize: '20px', fontWeight: 700, color: C.text1 }}>
            {valueTop}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 600, color: t.text }}>
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

const cardStyle: React.CSSProperties = {
  background: C.surface, border: `1px solid ${C.border}`,
  borderRadius: '12px', padding: '20px',
};

function pct(v: [number, number]) {
  const [a, b] = v;
  if (b === 0) return 0;
  return Math.round((a / b) * 100);
}
