import React, { useEffect, useState } from 'react';
import {
  Bell, ChevronRight, Copy, Check, XCircle, Send, MailCheck, Eye,
  Pencil, Trash2, X, Clock,
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

type Channel = 'In-app' | 'Email' | 'SMS';
type Status = 'sent' | 'scheduled' | 'draft';

interface DeliveryRow {
  id: number;
  initials: string;
  name: string;
  org: string;
  channels: Channel[];
  deliveredAt: string | null;
  readAt: string | null;
}

interface AnnouncementDetail {
  id: number;
  title: string;
  body: string;
  sentAt: string;
  from: string;
  recipientsLabel: string;
  channels: Channel[];
  stats: {
    sent: [number, number];
    delivered: [number, number];
    read: [number, number];
  };
  rows: DeliveryRow[];
}

interface ScheduledDetail {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  author: string;
  scheduledAt: string;
  scheduledRelative: string;
  orgs: string[];
  channels: Channel[];
  recipients: { id: number; initials: string; name: string; org: string; channels: Channel[] }[];
}

const SCHEDULED_DETAIL: ScheduledDetail = {
  id: 4,
  title: 'Акция: бонус за KPI 3',
  body:
    'Уважаемые партнёры!\n\n' +
    'С 15 апреля запускаем акцию: каждая карта, прошедшая все три этапа KPI, принесёт продавцу дополнительный бонус +10 000 UZS к стандартному вознаграждению. Акция действует до конца апреля и распространяется на все активные партии.\n\n' +
    'Подробные условия и пример расчёта опубликованы в личном кабинете. Просим ознакомить продавцов с условиями до старта акции.',
  createdAt: '13.04.2026 16:00',
  author: 'Админ Камолов',
  scheduledAt: '15.04.2026 09:00',
  scheduledRelative: 'Через 2 дня, 19 часов',
  orgs: ['Mysafar OOO', 'Unired Marketing'],
  channels: ['In-app'],
  recipients: [
    { id: 1, initials: 'РА', name: 'Рустам Алиев',       org: 'Mysafar OOO', channels: ['In-app'] },
    { id: 2, initials: 'СМ', name: 'Санжар (менеджер 2)', org: 'Mysafar OOO', channels: ['In-app'] },
    { id: 3, initials: 'ЛК', name: 'Лола Каримова',       org: 'Unired Mkt',  channels: ['In-app'] },
    { id: 4, initials: 'БН', name: 'Бобур Н.',            org: 'Unired Mkt',  channels: ['In-app'] },
  ],
};

const DETAIL: AnnouncementDetail = {
  id: 1,
  title: 'Обновление KPI политики',
  body: 'С 01 мая вступают в силу обновлённые условия KPI 3 цикла. Подробности и полный текст политики доступны в личном кабинете. Рекомендуем ознакомить продавцов до конца апреля.',
  sentAt: '13.04.2026, 10:00',
  from: 'Админ Камолов (Universalbank)',
  recipientsLabel: 'Все организации (12 чел.)',
  channels: ['In-app', 'Email'],
  stats: {
    sent:      [12, 12],
    delivered: [12, 12],
    read:      [8, 12],
  },
  rows: [
    { id: 1,  initials: 'РА', name: 'Рустам Алиев',    org: 'Mysafar OOO',      channels: ['In-app', 'Email'], deliveredAt: '13.04 10:01', readAt: '13.04 10:15' },
    { id: 2,  initials: 'ЛК', name: 'Лола Каримова',   org: 'Unired Mkt',       channels: ['In-app', 'Email'], deliveredAt: '13.04 10:01', readAt: '13.04 11:30' },
    { id: 3,  initials: 'АХ', name: 'Азиз Хамидов',    org: 'Digital Pay',      channels: ['In-app', 'Email'], deliveredAt: '13.04 10:01', readAt: null },
    { id: 4,  initials: 'МН', name: 'Мухаммад Н.',     org: 'Mysafar OOO',      channels: ['In-app', 'Email'], deliveredAt: '13.04 10:02', readAt: '13.04 10:45' },
    { id: 5,  initials: 'СМ', name: 'Санжар Мирзаев',  org: 'Express Finance',  channels: ['In-app', 'Email'], deliveredAt: '13.04 10:02', readAt: null },
    { id: 6,  initials: 'НК', name: 'Нилуфар Каримова', org: 'Mysafar OOO',     channels: ['In-app', 'Email'], deliveredAt: '13.04 10:02', readAt: '13.04 12:08' },
    { id: 7,  initials: 'ИТ', name: 'Ислом Тошматов',  org: 'Fast Payments',    channels: ['In-app', 'Email'], deliveredAt: '13.04 10:02', readAt: '13.04 14:02' },
    { id: 8,  initials: 'ДН', name: 'Дарья Нам',       org: 'SmartCard',        channels: ['In-app', 'Email'], deliveredAt: '13.04 10:03', readAt: null },
    { id: 9,  initials: 'КР', name: 'Камола Расулова', org: 'Alif',             channels: ['In-app', 'Email'], deliveredAt: '13.04 10:03', readAt: '13.04 15:40' },
    { id: 10, initials: 'ФМ', name: 'Фаррух М.',       org: 'PayMe',            channels: ['In-app', 'Email'], deliveredAt: '13.04 10:03', readAt: null },
    { id: 11, initials: 'ШР', name: 'Шахзод Р.',       org: 'Digital Pay',      channels: ['In-app', 'Email'], deliveredAt: '13.04 10:04', readAt: '13.04 16:12' },
    { id: 12, initials: 'АШ', name: 'Азиз Ш.',         org: 'Unired Mkt',       channels: ['In-app', 'Email'], deliveredAt: '13.04 10:04', readAt: '13.04 18:25' },
  ],
};

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
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function AnnouncementDetailPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const navigate = useNavigate();
  const { id } = useParams();

  const data = DETAIL;
  const status: Status =
    id === '4' ? 'scheduled' : id === '5' ? 'draft' : 'sent';

  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sendNowOpen, setSendNowOpen] = useState(false);

  const readPct = Math.round((data.stats.read[0] / data.stats.read[1]) * 100);
  const deliveredPct = Math.round((data.stats.delivered[0] / data.stats.delivered[1]) * 100);
  const sentPct = Math.round((data.stats.sent[0] / data.stats.sent[1]) * 100);

  const goList = () => navigate('/announcements');

  const crumbLink: React.CSSProperties = {
    fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer',
  };
  const crumbBackLink: React.CSSProperties = {
    fontFamily: F.inter, fontSize: '13px', color: t.text3, cursor: 'pointer',
    transition: 'color 0.12s',
  };
  const cardStyle: React.CSSProperties = {
    background: t.surface, border: `1px solid ${t.border}`,
    borderRadius: '12px', padding: '20px',
  };

  const scheduledInfoBg = dark ? 'rgba(251,191,36,0.08)' : '#FFFBEB';
  const scheduledRelColor = dark ? '#FBBF24' : '#B45309';
  const recipientAltBg = dark ? D.tableAlt : '#F9FAFB';
  const draftInfoBg = dark ? D.tableAlt : '#F9FAFB';
  const deliveryHeaderBg = dark ? D.tableHeaderBg : '#F9FAFB';

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
            <span onClick={() => navigate('/dashboard')} style={crumbLink}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span
              onClick={goList}
              style={crumbBackLink}
              onMouseEnter={e => (e.currentTarget.style.color = t.text2)}
              onMouseLeave={e => (e.currentTarget.style.color = t.text3)}
            >
              История объявлений
            </span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
              {status === 'scheduled' ? SCHEDULED_DETAIL.title : data.title}
            </span>
          </div>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                  {status === 'scheduled' ? SCHEDULED_DETAIL.title : data.title}
                </h1>
                <StatusBadgePill status={status} dark={dark} />
              </div>
              {status === 'scheduled' ? (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontFamily: F.inter, fontSize: '13px', color: scheduledRelColor,
                  marginTop: '8px',
                }}>
                  <Clock size={14} strokeWidth={1.75} />
                  <span>
                    Отправка:{' '}
                    <span style={{ fontFamily: F.mono }}>{SCHEDULED_DETAIL.scheduledAt}</span>
                    {' '}(через 2 дня)
                  </span>
                </div>
              ) : (
                <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '6px' }}>
                  {status === 'sent' && (
                    <>
                      <span style={{ fontFamily: F.mono, color: t.text2 }}>{data.sentAt}</span> · {data.recipientsLabel} · {data.channels.join(', ')}
                    </>
                  )}
                  {status === 'draft' && (
                    <>Черновик не отправлен · {data.channels.join(', ') || 'Каналы не выбраны'}</>
                  )}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
              {status === 'scheduled' && (
                <>
                  <PrimaryButton icon={Send} onClick={() => setSendNowOpen(true)} t={t}>
                    Отправить сейчас
                  </PrimaryButton>
                  <OutlineButton icon={Pencil} onClick={() => navigate('/announcements/new')} t={t}>
                    Редактировать
                  </OutlineButton>
                  <OutlineButton icon={XCircle} danger onClick={() => setCancelOpen(true)} t={t} dark={dark}>
                    Отменить отправку
                  </OutlineButton>
                </>
              )}
              {status === 'draft' && (
                <PrimaryButton icon={Pencil} onClick={() => navigate('/announcements/new')} t={t}>
                  Редактировать
                </PrimaryButton>
              )}
              {status !== 'scheduled' && (
                <OutlineButton icon={Copy} onClick={() => navigate('/announcements/new')} t={t}>
                  Дублировать
                </OutlineButton>
              )}
              {status === 'draft' && (
                <DestructiveButton icon={Trash2} onClick={() => setDeleteOpen(true)} t={t} dark={dark}>
                  Удалить
                </DestructiveButton>
              )}
            </div>
          </div>

          {/* Stat cards — sent only */}
          {status === 'sent' && (
            <div className="an-stats" style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
              marginBottom: '20px',
            }}>
              <StatCard
                icon={Send}
                tone={sentPct === 100 ? 'green' : 'amber'}
                label="Отправлено"
                valueTop={`${data.stats.sent[0]}/${data.stats.sent[1]}`}
                valuePct={sentPct}
                t={t}
                dark={dark}
              />
              <StatCard
                icon={MailCheck}
                tone={deliveredPct === 100 ? 'green' : 'amber'}
                label="Доставлено"
                valueTop={`${data.stats.delivered[0]}/${data.stats.delivered[1]}`}
                valuePct={deliveredPct}
                t={t}
                dark={dark}
              />
              <StatCard
                icon={Eye}
                tone={readPct === 100 ? 'green' : 'amber'}
                label="Прочитано"
                valueTop={`${data.stats.read[0]}/${data.stats.read[1]}`}
                valuePct={readPct}
                t={t}
                dark={dark}
              />
            </div>
          )}

          {/* Message card — sent + draft only */}
          {status !== 'scheduled' && (
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
          )}

          {/* Scheduled: two-column content + delivery info */}
          {status === 'scheduled' && (
            <div className="sched-grid" style={{
              display: 'grid', gridTemplateColumns: '55fr 45fr', gap: '16px',
            }}>
              {/* LEFT — Content */}
              <div style={cardStyle}>
                <SectionHeading t={t}>Содержание</SectionHeading>
                <div style={{
                  fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                  color: t.text1, lineHeight: 1.4,
                }}>
                  <span style={{ color: t.text3, fontWeight: 400 }}>Заголовок: </span>
                  {SCHEDULED_DETAIL.title}
                </div>

                <HDivider t={t} />

                <div style={{
                  fontFamily: F.inter, fontSize: '13px', color: t.text2,
                  lineHeight: 1.6, whiteSpace: 'pre-wrap',
                }}>
                  {SCHEDULED_DETAIL.body}
                </div>

                <HDivider t={t} />

                <div style={{
                  display: 'flex', gap: '18px', flexWrap: 'wrap',
                  fontFamily: F.inter, fontSize: '12px', color: t.text3,
                }}>
                  <span>
                    Создано:{' '}
                    <span style={{ fontFamily: F.mono, color: t.text2 }}>
                      {SCHEDULED_DETAIL.createdAt}
                    </span>
                  </span>
                  <span>
                    Автор: <span style={{ color: t.text2 }}>{SCHEDULED_DETAIL.author}</span>
                  </span>
                </div>
              </div>

              {/* RIGHT — Schedule + recipients */}
              <div style={cardStyle}>
                <SectionHeading t={t}>Расписание доставки</SectionHeading>

                {/* Info card */}
                <div style={{
                  background: scheduledInfoBg,
                  borderTop: `1px solid ${t.border}`,
                  borderRight: `1px solid ${t.border}`,
                  borderBottom: `1px solid ${t.border}`,
                  borderLeft: `3px solid ${t.warning}`,
                  borderRadius: '8px', padding: '16px',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                }}>
                  <Clock size={20} color={t.warning} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1,
                      lineHeight: 1.4,
                    }}>
                      Запланировано на{' '}
                      <span style={{ fontFamily: F.mono }}>{SCHEDULED_DETAIL.scheduledAt}</span>
                    </div>
                    <div style={{
                      fontFamily: F.inter, fontSize: '12px', color: t.text3,
                      marginTop: '3px', lineHeight: 1.45,
                    }}>
                      {SCHEDULED_DETAIL.scheduledRelative}
                    </div>
                  </div>
                </div>

                <HDivider t={t} />

                <SectionHeading t={t}>Получатели</SectionHeading>

                <div style={{
                  fontFamily: F.inter, fontSize: '13px', color: t.text2,
                  lineHeight: 1.6,
                }}>
                  <div>
                    <span style={{ color: t.text3 }}>Организации: </span>
                    {SCHEDULED_DETAIL.orgs.join(', ')}
                  </div>
                  <div>
                    <span style={{ color: t.text3 }}>Пользователей: </span>
                    {SCHEDULED_DETAIL.recipients.length}
                  </div>
                </div>

                {/* Recipient list */}
                <div style={{
                  marginTop: '12px',
                  border: `1px solid ${t.border}`, borderRadius: '8px',
                  overflow: 'hidden',
                }}>
                  {SCHEDULED_DETAIL.recipients.map((r, i) => (
                    <div
                      key={r.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 140px 80px',
                        alignItems: 'center', gap: '10px',
                        padding: '10px 12px',
                        borderTop: i === 0 ? 'none' : `1px solid ${t.border}`,
                        background: i % 2 === 0 ? t.surface : recipientAltBg,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: t.blueLt, color: t.blue,
                          fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {r.initials}
                        </div>
                        <span style={{
                          fontFamily: F.inter, fontSize: '13px', color: t.text1, fontWeight: 500,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {r.name}
                        </span>
                      </div>
                      <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text2 }}>
                        {r.org}
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {r.channels.map(c => (
                          <span key={c} style={{
                            fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                            padding: '3px 8px', borderRadius: '6px',
                            background: t.blueLt, color: t.blue, whiteSpace: 'nowrap',
                          }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  fontFamily: F.inter, fontSize: '12px', color: t.text3,
                  marginTop: '10px', lineHeight: 1.45,
                }}>
                  Все столбцы «Доставлено» и «Прочитано» будут доступны после отправки.
                </div>
              </div>
            </div>
          )}

          {/* Delivery table — sent only */}
          {status === 'sent' && (
            <div style={{ ...cardStyle, marginTop: '20px', padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '14px 18px', borderBottom: `1px solid ${t.border}`,
                fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: t.text1,
              }}>
                Детали доставки · {data.rows.length} получателей
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: F.inter }}>
                  <thead>
                    <tr style={{ background: deliveryHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                      <Th t={t}>Получатель</Th>
                      <Th t={t}>Организация</Th>
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
          )}

          {/* Draft info strip */}
          {status === 'draft' && (
            <div style={{
              ...cardStyle, marginTop: '20px',
              background: draftInfoBg, borderColor: t.border,
              borderLeft: `3px solid ${t.text4}`,
            }}>
              <div style={{
                fontFamily: F.inter, fontSize: '13px', color: t.text2, lineHeight: 1.5,
              }}>
                Это черновик. Отправка ещё не была запланирована. Нажмите «Редактировать», чтобы
                дополнить его, или «Удалить», если черновик больше не нужен.
              </div>
            </div>
          )}
        </div>

        <style>{`
          @media (max-width: 900px) {
            .an-stats { grid-template-columns: 1fr !important; }
            .sched-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>

      <CancelScheduledModal
        open={cancelOpen}
        title={data.title}
        recipients={data.recipientsLabel}
        scheduledAt="15.04.2026 09:00"
        channels={data.channels}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => { setCancelOpen(false); goList(); }}
        t={t}
        dark={dark}
      />

      <DeleteDraftModal
        open={deleteOpen}
        title={data.title}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => { setDeleteOpen(false); goList(); }}
        t={t}
        dark={dark}
      />

      <SendNowModal
        open={sendNowOpen}
        scheduledAt={SCHEDULED_DETAIL.scheduledAt}
        recipientCount={SCHEDULED_DETAIL.recipients.length}
        channels={SCHEDULED_DETAIL.channels}
        onClose={() => setSendNowOpen(false)}
        onConfirm={() => { setSendNowOpen(false); goList(); }}
        t={t}
        dark={dark}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATUS BADGE PILL
═══════════════════════════════════════════════════════════════════════════ */

function StatusBadgePill({ status, dark }: { status: Status; dark: boolean }) {
  const cfg = (dark ? STATUS_STYLE_DARK : STATUS_STYLE_LIGHT)[status];
  return <StatusBadge label={cfg.label} bg={cfg.bg} color={cfg.color} dot={cfg.dot} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCHEDULED LAYOUT HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function SectionHeading({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <h3 style={{
      margin: '0 0 12px',
      fontFamily: F.dm, fontSize: '13px', fontWeight: 600,
      color: t.text1, textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {children}
    </h3>
  );
}

function HDivider({ t }: { t: T }) {
  return <div style={{ height: '1px', background: t.border, margin: '16px 0' }} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SEND-NOW MODAL
═══════════════════════════════════════════════════════════════════════════ */

function SendNowModal({ open, scheduledAt, recipientCount, channels, onClose, onConfirm, t, dark }: {
  open: boolean;
  scheduledAt: string;
  recipientCount: number;
  channels: Channel[];
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
          width: '100%', maxWidth: '460px',
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
          <Send size={20} color={t.blue} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1,
          }}>
            Отправить объявление сейчас
          </h2>
          <button
            type="button"
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

        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            fontFamily: F.inter, fontSize: '13px', color: t.text1, lineHeight: 1.5,
          }}>
            Отправить объявление сейчас вместо запланированного времени (
            <span style={{ fontFamily: F.mono }}>{scheduledAt}</span>)?
          </div>
          <div style={{
            fontFamily: F.inter, fontSize: '12px', color: t.text3, lineHeight: 1.45,
          }}>
            {recipientCount} получателя · {channels.join(', ')}
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '14px 20px', borderTop: `1px solid ${t.border}`,
        }}>
          <OutlineButton onClick={onClose} t={t}>Отмена</OutlineButton>
          <PrimaryButton icon={Send} onClick={onConfirm} t={t}>Отправить сейчас</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CANCEL / DELETE MODALS
═══════════════════════════════════════════════════════════════════════════ */

function CancelScheduledModal({ open, title, recipients, scheduledAt, channels, onClose, onConfirm, t, dark }: {
  open: boolean;
  title: string;
  recipients: string;
  scheduledAt: string;
  channels: string[];
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
  const warnBg = dark ? 'rgba(251,191,36,0.08)' : C.warningBg;

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
          padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
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
                {title}
              </span>
              <StatusBadgePill status="scheduled" dark={dark} />
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Получатели: <span style={{ color: t.text2 }}>{recipients}</span>
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Запланировано на: <span style={{ fontFamily: F.mono, color: t.text2 }}>{scheduledAt}</span>
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Каналы: <span style={{ color: t.text2 }}>{channels.join(', ')}</span>
            </div>
          </div>

          <p style={{ margin: 0, fontFamily: F.inter, fontSize: '14px', color: t.text1, lineHeight: 1.5 }}>
            Объявление будет отменено и перемещено в черновики. Вы сможете отредактировать
            и отправить его позже.
          </p>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '16px 20px', borderTop: `1px solid ${t.border}`,
        }}>
          <OutlineButton onClick={onClose} t={t}>Назад</OutlineButton>
          <PrimaryButton icon={XCircle} onClick={onConfirm} t={t}>Отменить отправку</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function DeleteDraftModal({ open, title, onClose, onConfirm, t, dark }: {
  open: boolean; title: string;
  onClose: () => void; onConfirm: () => void;
  t: T; dark: boolean;
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

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ margin: 0, fontFamily: F.inter, fontSize: '14px', color: t.text1, lineHeight: 1.5 }}>
            Удалить черновик «<span style={{ fontWeight: 500 }}>{title}</span>»?
          </p>
          <p style={{ margin: 0, fontFamily: F.inter, fontSize: '12px', color: t.text3, lineHeight: 1.5 }}>
            Черновик будет удалён навсегда. Это действие нельзя отменить.
          </p>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '16px 20px', borderTop: `1px solid ${t.border}`,
        }}>
          <OutlineButton onClick={onClose} t={t}>Отмена</OutlineButton>
          <DestructiveButton icon={Trash2} onClick={onConfirm} t={t} dark={dark}>Удалить</DestructiveButton>
        </div>
      </div>
    </div>
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
      <Td t={t}><span style={{ color: t.text2 }}>{row.org}</span></Td>
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
      <Td t={t}><TimestampCell at={row.readAt} t={t} /></Td>
    </tr>
  );
}

function TimestampCell({ at, t }: { at: string | null; t: T }) {
  if (!at) return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontFamily: F.inter, fontSize: '12px', color: t.text4,
    }}>
      <XCircle size={13} strokeWidth={1.75} />
      Не прочитано
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
   STAT CARD
═══════════════════════════════════════════════════════════════════════════ */

function StatCard({ icon: Icon, tone, label, valueTop, valuePct, t, dark }: {
  icon: React.ElementType;
  tone: 'green' | 'amber';
  label: string;
  valueTop: string;
  valuePct: number;
  t: T;
  dark: boolean;
}) {
  const tonesLight = {
    green: { bg: C.successBg, fg: C.success, text: '#15803D' },
    amber: { bg: C.warningBg, fg: C.warning, text: '#B45309' },
  };
  const tonesDark = {
    green: { bg: 'rgba(52,211,153,0.12)', fg: '#34D399', text: '#34D399' },
    amber: { bg: 'rgba(251,191,36,0.12)', fg: '#FBBF24', text: '#FBBF24' },
  };
  const cfg = (dark ? tonesDark : tonesLight)[tone];
  const trackBg = dark ? D.progressTrack : '#F3F4F6';
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: '12px', padding: '18px',
      display: 'flex', gap: '14px', alignItems: 'flex-start',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: cfg.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={20} color={cfg.fg} strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500, color: t.text3 }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1 }}>
            {valueTop}
          </span>
          <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 600, color: cfg.text }}>
            {valuePct}%
          </span>
        </div>
        <div style={{ marginTop: '10px', height: '4px', background: trackBg, borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${valuePct}%`, height: '100%', background: cfg.fg, transition: 'width 0.2s' }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════════════════ */

function StatusBadge({ label, bg, color, dot }: { label: string; bg: string; color: string; dot: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: bg, color,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot }} />
      {label}
    </span>
  );
}

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

function OutlineButton({ children, onClick, icon: Icon, danger, t, dark }: {
  children: React.ReactNode; onClick?: () => void; icon?: React.ElementType; danger?: boolean;
  t: T; dark?: boolean;
}) {
  const [hov, setHov] = useState(false);
  const borderIdle = t.inputBorder;
  const borderHov  = danger ? t.warning : t.text3;
  const textColor  = danger ? (hov ? (dark ? '#FBBF24' : '#B45309') : t.text1) : t.text1;
  const warnBg = dark ? 'rgba(251,191,36,0.08)' : C.warningBg;
  const bgHov      = danger ? warnBg : t.surface;
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 16px',
        border: `1px solid ${hov ? borderHov : borderIdle}`,
        borderRadius: '8px', background: hov ? bgHov : t.surface,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: textColor, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {Icon && <Icon size={14} strokeWidth={1.75} />}
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick, icon: Icon, t }: {
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
        border: 'none', borderRadius: '8px',
        background: hov ? t.blueHover : t.blue,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: '#FFFFFF', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: hov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {Icon && <Icon size={14} strokeWidth={1.75} />}
      {children}
    </button>
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
