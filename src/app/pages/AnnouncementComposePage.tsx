import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell, ChevronRight, ChevronLeft, Plus, X, Check, ChevronDown, Search,
  Save, AlertTriangle, Calendar as CalendarIcon, Clock,
  CheckCircle2, Loader2, Trash2,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { usePopoverPosition } from '../components/usePopoverPosition';
import { renderMarkdown, FormatToolbar } from '../components/renderMarkdown';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════════════════════ */

const ORGANIZATIONS = [
  'Mysafar OOO', 'Unired Marketing', 'Express Finance', 'Digital Pay',
  'Fast Payments', 'SmartCard', 'Alif', 'PayMe',
];

const USERS = [
  'Рустам Алиев', 'Лола Каримова', 'Мухаммад Н.', 'Санжар Мирзаев',
  'Нилуфар Расулова', 'Ислом Тошматов', 'Дарья Нам', 'Камола Р.',
  'Фаррух М.', 'Шахзод Р.', 'Азиз Ш.', 'Зилола А.',
];

const TOTAL_ORG_COUNT = ORGANIZATIONS.length;
const TOTAL_USER_COUNT = USERS.length;
const SMS_COST_PER_MSG = 50;

/* ═══════════════════════════════════════════════════════════════════════════
   FORM STATE
═══════════════════════════════════════════════════════════════════════════ */

type RecipientMode = 'all' | 'orgs' | 'users';
type ScheduleMode = 'now' | 'scheduled';

interface FormState {
  title: string;
  body: string;
  mode: RecipientMode;
  selectedOrgs: string[];
  selectedUsers: string[];
  channels: { inapp: true; email: boolean; sms: boolean };
  schedule: ScheduleMode;
  scheduleDate: string;
  scheduleTime: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  body: '',
  mode: 'all',
  selectedOrgs: ['Mysafar OOO', 'Unired Marketing'],
  selectedUsers: ['Рустам Алиев', 'Лола Каримова'],
  channels: { inapp: true, email: false, sms: false },
  schedule: 'now',
  scheduleDate: '14.04.2026',
  scheduleTime: '10:00',
};

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function AnnouncementComposePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [draftState, setDraftState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [draftToastOpen, setDraftToastOpen] = useState(false);
  const [draftMeta, setDraftMeta] = useState<{ id: number; savedAt: string; savedAtShort: string } | null>(null);
  const [deleteDraftOpen, setDeleteDraftOpen] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const patch = (p: Partial<FormState>) => setForm(s => ({ ...s, ...p }));

  const draftConsumedRef = useRef(false);
  useEffect(() => {
    if (draftConsumedRef.current) return;
    const s = location.state as { draft?: { id: number; title: string } } | null;
    if (!s?.draft) return;
    draftConsumedRef.current = true;

    setForm({
      title: s.draft.title,
      body:
        'Коротко по итогам марта: общий объём продаж, число новых продавцов, топ-3 организации, средний процент KPI 3. Подробный отчёт прикрепим ближе к публикации.\n\n' +
        'Пока собираю цифры — не отправляйте, пока не проверю с аналитикой.',
      mode: 'all',
      selectedOrgs: EMPTY_FORM.selectedOrgs,
      selectedUsers: EMPTY_FORM.selectedUsers,
      channels: { inapp: true, email: true, sms: false },
      schedule: 'now',
      scheduleDate: EMPTY_FORM.scheduleDate,
      scheduleTime: EMPTY_FORM.scheduleTime,
    });
    setDraftState('saved');
    setLastSavedAt('12.04 15:30');
    setDraftMeta({ id: s.draft.id, savedAt: '12.04.2026 15:30', savedAtShort: '12.04 15:30' });
    didMountRef.current = true;

    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);

  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) { didMountRef.current = true; return; }
    if (form.title.trim() === '' && form.body.trim() === '') return;

    const idleTimer = window.setTimeout(() => {
      setDraftState('saving');
      window.setTimeout(() => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        setLastSavedAt(`${hh}:${mm}`);
        setDraftState('saved');
      }, 800);
    }, 3000);

    return () => window.clearTimeout(idleTimer);
  }, [form.title, form.body]);

  const saveDraftNow = () => {
    setDraftState('saving');
    window.setTimeout(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      setLastSavedAt(`${hh}:${mm}`);
      setDraftState('saved');
      setDraftToastOpen(true);
    }, 600);
  };

  const handleSendConfirm = () => {
    const orgCount = form.mode === 'orgs' ? form.selectedOrgs.length : (form.mode === 'all' ? TOTAL_ORG_COUNT : 0);
    const userCount = recipientsCount.users;

    const recipientsLabel = form.mode === 'all'
      ? `Все организации (${userCount} чел.)`
      : form.mode === 'orgs'
        ? `${form.selectedOrgs.slice(0, 2).join(', ')}${form.selectedOrgs.length > 2 ? ` и ещё ${form.selectedOrgs.length - 2}` : ''} (${userCount} чел.)`
        : `${form.selectedUsers.slice(0, 2).join(', ')}${form.selectedUsers.length > 2 ? ` и ещё ${form.selectedUsers.length - 2}` : ''} (${userCount} чел.)`;

    const channels: ('In-app' | 'Email' | 'SMS')[] = [
      'In-app',
      ...(form.channels.email ? (['Email'] as const) : []),
      ...(form.channels.sms ? (['SMS'] as const) : []),
    ];

    const newRow = {
      id: Date.now(),
      date: 'Только что',
      title: form.title.trim() || 'Без заголовка',
      recipientsLabel,
      channels,
      delivered: [0, userCount] as [number, number],
      read: [0, userCount] as [number, number],
      status: 'sent' as const,
    };

    const summary = orgCount > 0
      ? `${orgCount} ${plural(orgCount, 'организация', 'организации', 'организаций')} (${userCount} ${plural(userCount, 'получатель', 'получателя', 'получателей')})`
      : `${userCount} ${plural(userCount, 'получатель', 'получателя', 'получателей')}`;

    setConfirmOpen(false);
    navigate('/announcements', {
      state: { newRow, toast: { title: newRow.title, summary } },
    });
  };

  const recipientsCount = useMemo(() => {
    if (form.mode === 'all') return { orgs: TOTAL_ORG_COUNT, users: TOTAL_USER_COUNT };
    if (form.mode === 'orgs') return { orgs: form.selectedOrgs.length, users: form.selectedOrgs.length * 1 };
    return { orgs: 0, users: form.selectedUsers.length };
  }, [form.mode, form.selectedOrgs, form.selectedUsers]);

  const smsRecipients = recipientsCount.users;
  const canSend = form.title.trim() !== '' && form.body.trim() !== '' && (
    form.mode === 'all' ||
    (form.mode === 'orgs' && form.selectedOrgs.length > 0) ||
    (form.mode === 'users' && form.selectedUsers.length > 0)
  );

  const cardStyle: React.CSSProperties = {
    background: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: '12px',
    padding: '24px',
  };

  const crumbLink: React.CSSProperties = {
    fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer',
  };

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

        <div style={{ padding: '28px 32px 0', boxSizing: 'border-box', width: '100%', flex: 1 }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span onClick={() => navigate('/dashboard')} style={crumbLink}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            {draftMeta ? (
              <>
                <span onClick={() => navigate('/announcements')} style={crumbLink}>История объявлений</span>
                <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Редактирование черновика</span>
              </>
            ) : (
              <>
                <span onClick={() => navigate('/notification-rules')} style={crumbLink}>Уведомления</span>
                <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Новое объявление</span>
              </>
            )}
          </div>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
              {draftMeta ? 'Редактирование черновика' : 'Отправить объявление'}
            </h1>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '6px' }}>
              {draftMeta
                ? <>Черновик сохранён: <span style={{ fontFamily: F.mono, color: t.text2 }}>{draftMeta.savedAt}</span></>
                : 'Отправьте сообщение организациям и пользователям'}
            </div>
          </div>

          {/* Draft-edit banner (warning when entering via history → edit) */}
          {draftMeta && (
            <div style={{
              marginBottom: '16px',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '10px 14px',
              background: t.warningBg,
              border: `1px solid ${t.border}`,
              borderLeft: `3px solid ${t.warning}`,
              borderRadius: '8px',
            }}>
              <AlertTriangle size={16} color={t.warning} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2, lineHeight: 1.45 }}>
                Вы редактируете черновик. Изменения сохраняются автоматически; отправьте или удалите, когда закончите.
              </div>
            </div>
          )}

          {/* Two-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', paddingBottom: '96px' }}>
            {/* ── LEFT: compose ── */}
            <div style={{ ...cardStyle, position: 'relative' }}>
              <div style={{
                position: 'absolute', top: '14px', right: '16px',
                display: 'flex', alignItems: 'center', gap: '10px',
                minHeight: '18px',
              }}>
                {draftMeta && (
                  <>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '3px 8px', borderRadius: '10px',
                      background: dark ? D.tableAlt : '#F3F4F6', color: t.text3,
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.text4 }} />
                      Черновик
                    </span>
                    <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
                      Сохранён {draftMeta.savedAtShort}
                    </span>
                  </>
                )}
                {(!draftMeta || draftState === 'saving') && (
                  <AutoSaveIndicator state={draftState} savedAt={lastSavedAt} t={t} />
                )}
              </div>

              {/* § Содержание */}
              <FormSection title="Содержание" t={t}>
                <FieldLabel required t={t}>Заголовок</FieldLabel>
                <TextInput
                  value={form.title}
                  placeholder="Тема объявления..."
                  onChange={v => patch({ title: v })}
                  t={t}
                />

                <FieldLabel required style={{ marginTop: '14px' }} t={t}>Текст сообщения</FieldLabel>
                <FormatToolbar
                  textareaRef={bodyRef}
                  value={form.body}
                  onChange={v => patch({ body: v })}
                />
                <TextArea
                  ref={bodyRef}
                  value={form.body}
                  placeholder="Введите текст объявления..."
                  onChange={v => patch({ body: v })}
                  height={160}
                  t={t}
                />
                <Caption t={t}>Поддерживается простое форматирование: **жирный**, _курсив_, • списки</Caption>
              </FormSection>

              <Divider t={t} />

              {/* § Получатели */}
              <FormSection title="Получатели" t={t}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'stretch' }}>
                  <RadioRow
                    label="Все организации"
                    sub="Отправить всем активным администраторам организаций"
                    checked={form.mode === 'all'}
                    onSelect={() => patch({ mode: 'all' })}
                    t={t}
                  />
                  <RadioRow
                    label="Выбранные организации"
                    sub="Выбрать конкретные организации из списка"
                    checked={form.mode === 'orgs'}
                    onSelect={() => patch({ mode: 'orgs' })}
                    t={t}
                  />
                  <RadioRow
                    label="Конкретные пользователи"
                    sub="Поиск отдельных получателей по имени"
                    checked={form.mode === 'users'}
                    onSelect={() => patch({ mode: 'users' })}
                    t={t}
                  />
                </div>

                {form.mode === 'orgs' && (
                  <div style={{ marginTop: '12px' }}>
                    <MultiSelect
                      options={ORGANIZATIONS}
                      selected={form.selectedOrgs}
                      onChange={v => patch({ selectedOrgs: v })}
                      placeholder="Выберите организации"
                      searchPlaceholder="Поиск организаций…"
                      t={t} dark={dark}
                    />
                  </div>
                )}
                {form.mode === 'users' && (
                  <div style={{ marginTop: '12px' }}>
                    <MultiSelect
                      options={USERS}
                      selected={form.selectedUsers}
                      onChange={v => patch({ selectedUsers: v })}
                      placeholder="Выберите пользователей"
                      searchPlaceholder="Поиск по имени…"
                      searchable
                      t={t} dark={dark}
                    />
                  </div>
                )}
              </FormSection>

              <Divider t={t} />

              {/* § Каналы */}
              <FormSection title="Каналы доставки" t={t}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 20px' }}>
                  <CheckboxRow label="In-app уведомление" checked disabled t={t} />
                  <CheckboxRow
                    label="Email"
                    checked={form.channels.email}
                    onChange={v => patch({ channels: { ...form.channels, email: v } })}
                    t={t}
                  />
                  <CheckboxRow
                    label="SMS"
                    checked={form.channels.sms}
                    onChange={v => patch({ channels: { ...form.channels, sms: v } })}
                    t={t}
                  />
                </div>
                {form.channels.sms && (
                  <div style={{
                    marginTop: '10px',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontFamily: F.inter, fontSize: '12px', color: t.warning,
                  }}>
                    <AlertTriangle size={13} strokeWidth={1.75} />
                    SMS будет отправлено на {smsRecipients} номеров. Стоимость: ~{fmtUzs(smsRecipients * SMS_COST_PER_MSG)} UZS
                  </div>
                )}
              </FormSection>

              <Divider t={t} />

              {/* § Расписание */}
              <FormSection title="Расписание" t={t}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'stretch' }}>
                  <RadioRow
                    label="Отправить сейчас"
                    sub="Объявление уйдёт сразу после подтверждения"
                    checked={form.schedule === 'now'}
                    onSelect={() => patch({ schedule: 'now' })}
                    t={t}
                  />
                  <RadioRow
                    label="Запланировать"
                    sub="Объявление будет отправлено в указанное время"
                    checked={form.schedule === 'scheduled'}
                    onSelect={() => patch({ schedule: 'scheduled' })}
                    t={t}
                  >
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{ display: 'flex', gap: '8px', marginTop: '10px' }}
                    >
                      <DatePickerField
                        value={form.scheduleDate}
                        onChange={v => patch({ scheduleDate: v })}
                        disabled={form.schedule !== 'scheduled'}
                        t={t} dark={dark}
                      />
                      <TimeField
                        value={form.scheduleTime}
                        onChange={v => patch({ scheduleTime: v })}
                        disabled={form.schedule !== 'scheduled'}
                        t={t} dark={dark}
                      />
                    </div>
                  </RadioRow>
                </div>
              </FormSection>
            </div>

            {/* ── RIGHT: preview ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={cardStyle}>
                <SectionTitle t={t}>Предпросмотр</SectionTitle>

                <PreviewCard
                  title={form.title || 'Тема объявления'}
                  body={form.body || 'Введите текст объявления...'}
                  placeholder={form.title.trim() === ''}
                  dark={darkMode}
                  t={t}
                />

                <div style={{ height: '1px', background: t.border, margin: '14px 0' }} />

                <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
                  От: <span style={{ color: t.text2 }}>Админ Камолов (Universalbank)</span>
                </div>
              </div>

              <SummaryCard
                recipients={recipientsCount}
                channels={form.channels}
                schedule={form.schedule}
                scheduleDate={form.scheduleDate}
                scheduleTime={form.scheduleTime}
                t={t}
              />
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div style={{
          position: 'sticky', bottom: 0, zIndex: 20,
          background: t.surface, borderTop: `1px solid ${t.border}`,
          padding: '12px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '8px', flexShrink: 0,
        }}>
          {draftMeta ? (
            <>
              <DestructiveOutlineButton icon={Trash2} onClick={() => setDeleteDraftOpen(true)} t={t} dark={dark}>
                Удалить черновик
              </DestructiveOutlineButton>
              <GhostButton icon={Save} onClick={saveDraftNow} t={t} dark={dark}>Сохранить черновик</GhostButton>
              <PrimaryButton disabled={!canSend} onClick={() => setConfirmOpen(true)} t={t} dark={dark}>
                Отправить объявление
              </PrimaryButton>
            </>
          ) : (
            <>
              <GhostButton icon={Save} onClick={saveDraftNow} t={t} dark={dark}>Сохранить как черновик</GhostButton>
              <div style={{ display: 'flex', gap: '8px' }}>
                <OutlineButton onClick={() => navigate('/notification-rules')} t={t} dark={dark}>Отмена</OutlineButton>
                <PrimaryButton disabled={!canSend} onClick={() => setConfirmOpen(true)} t={t} dark={dark}>
                  Отправить объявление
                </PrimaryButton>
              </div>
            </>
          )}
        </div>
      </div>

      <SendConfirmDialog
        open={confirmOpen}
        userCount={recipientsCount.users}
        channels={form.channels}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleSendConfirm}
        t={t} dark={dark}
      />

      {draftToastOpen && (
        <DraftSavedToast
          title={form.title}
          onClose={() => setDraftToastOpen(false)}
          onOpenDrafts={() => { setDraftToastOpen(false); navigate('/announcements'); }}
          t={t} dark={dark}
        />
      )}

      <DeleteDraftModal
        open={deleteDraftOpen}
        title={form.title}
        onClose={() => setDeleteDraftOpen(false)}
        onConfirm={() => { setDeleteDraftOpen(false); navigate('/announcements'); }}
        t={t} dark={dark}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DRAFT AUTO-SAVE INDICATOR + SUCCESS TOAST
═══════════════════════════════════════════════════════════════════════════ */

function AutoSaveIndicator({ state, savedAt, t }: {
  state: 'idle' | 'saving' | 'saved';
  savedAt: string | null;
  t: T;
}) {
  if (state === 'idle') return null;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontFamily: F.inter, fontSize: '12px', color: t.text3,
      lineHeight: 1.2,
    }}>
      <style>{`
        @keyframes draftSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
      {state === 'saving' ? (
        <>
          <span style={{ display: 'inline-flex', animation: 'draftSpin 0.9s linear infinite' }}>
            <Loader2 size={16} color={t.blue} strokeWidth={1.75} />
          </span>
          <span>Сохранение…</span>
        </>
      ) : (
        <>
          <CheckCircle2 size={16} color={t.success} strokeWidth={1.75} />
          <span>Черновик сохранён{savedAt ? ` ${savedAt}` : ''}</span>
        </>
      )}
    </div>
  );
}

function DraftSavedToast({ title, onClose, onOpenDrafts, t, dark }: {
  title: string;
  onClose: () => void;
  onOpenDrafts: () => void;
  t: T;
  dark: boolean;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 6000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  const [linkHov, setLinkHov] = useState(false);

  const subtitle = title.trim() !== ''
    ? `«${title.trim()}» — вы можете продолжить редактирование позже`
    : 'Вы можете продолжить редактирование позже';

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed', top: '24px', right: '24px',
        width: '380px', maxWidth: 'calc(100vw - 48px)',
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
        animation: 'draftToastIn 0.2s ease-out',
      }}
    >
      <style>{`
        @keyframes draftToastIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        background: t.successBg, border: `1px solid ${dark ? 'rgba(52,211,153,0.30)' : '#A7F3D0'}`,
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
          Черновик сохранён
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: t.text3,
          marginTop: '3px', lineHeight: 1.45,
        }}>
          {subtitle}
        </div>
        <button
          type="button"
          onClick={onOpenDrafts}
          onMouseEnter={() => setLinkHov(true)}
          onMouseLeave={() => setLinkHov(false)}
          style={{
            marginTop: '8px',
            background: 'transparent', border: 'none', padding: 0,
            fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
            color: linkHov ? t.blueHover : t.blue, cursor: 'pointer',
          }}
        >
          Перейти к черновикам →
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
   PREVIEW + SUMMARY
═══════════════════════════════════════════════════════════════════════════ */

function PreviewCard({ title, body, placeholder, dark = false, t }: {
  title: string; body: string; placeholder: boolean; dark?: boolean; t: T;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '12px',
      border: `1px solid ${t.border}`, borderRadius: '8px',
      background: dark ? D.tableHeaderBg : t.surface,
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: t.blueLt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Bell size={18} color={t.blue} strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
          color: placeholder ? t.text4 : t.text1, lineHeight: 1.3,
        }}>
          📢 {title}
        </div>
        <div style={{ marginTop: '6px' }}>
          {body.trim() === ''
            ? (
              <div style={{
                fontFamily: F.inter, fontSize: '13px', color: t.text4,
                lineHeight: 1.45,
              }}>
                Введите текст объявления...
              </div>
            )
            : renderMarkdown(body, dark)}
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, marginTop: '6px' }}>
          Только что
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ recipients, channels, schedule, scheduleDate, scheduleTime, t }: {
  recipients: { orgs: number; users: number };
  channels: { inapp: boolean; email: boolean; sms: boolean };
  schedule: ScheduleMode;
  scheduleDate: string;
  scheduleTime: string;
  t: T;
}) {
  const channelList = ['In-app', channels.email ? 'Email' : null, channels.sms ? 'SMS' : null]
    .filter(Boolean).join(', ');

  const recipientsLabel = recipients.orgs > 0
    ? `${recipients.orgs} ${plural(recipients.orgs, 'организация', 'организации', 'организаций')} (${recipients.users} ${plural(recipients.users, 'пользователь', 'пользователя', 'пользователей')})`
    : `${recipients.users} ${plural(recipients.users, 'пользователь', 'пользователя', 'пользователей')}`;

  const scheduleLabel = schedule === 'now' ? 'Сейчас' : `${scheduleDate}, ${scheduleTime}`;

  return (
    <div style={{
      background: t.tableHeaderBg,
      border: `1px solid ${t.border}`,
      borderRadius: '8px', padding: '12px',
      display: 'flex', flexDirection: 'column', gap: '6px',
    }}>
      <SummaryRow label="Получатели" value={recipientsLabel} t={t} />
      <SummaryRow label="Каналы" value={channelList} t={t} />
      <SummaryRow label="Расписание" value={scheduleLabel} t={t} />
    </div>
  );
}

function SummaryRow({ label, value, t }: { label: string; value: string; t: T }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, minWidth: '100px' }}>
        {label}:
      </span>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text1, fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MULTI-SELECT
═══════════════════════════════════════════════════════════════════════════ */

function MultiSelect({ options, selected, onChange, placeholder, searchPlaceholder, searchable, t, dark }: {
  options: string[]; selected: string[];
  onChange: (v: string[]) => void;
  placeholder: string; searchPlaceholder: string; searchable?: boolean;
  t: T; dark: boolean;
}) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } =
    usePopoverPosition({ alignRight: false });
  const [query, setQuery] = useState('');

  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));
  const remove = (v: string) => onChange(selected.filter(x => x !== v));
  const add = (v: string) => {
    if (selected.includes(v)) return;
    onChange([...selected, v]);
  };

  const chipXBg = dark ? 'rgba(59,130,246,0.25)' : 'rgba(37,99,235,0.15)';

  return (
    <div ref={rootRef}>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
        minHeight: '38px', padding: '6px 8px',
        border: `1px solid ${open ? t.blue : t.inputBorder}`,
        borderRadius: '8px', background: t.surface,
        transition: 'border-color 0.12s',
      }}>
        {selected.map(s => (
          <span
            key={s}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '3px 4px 3px 10px', borderRadius: '16px',
              background: t.blueLt, color: t.blue,
              fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
            }}
          >
            {s}
            <button
              onClick={() => remove(s)}
              aria-label={`Убрать ${s}`}
              style={{
                width: '16px', height: '16px', border: 'none', borderRadius: '50%',
                background: chipXBg, color: t.blue,
                cursor: 'pointer', display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={10} strokeWidth={2.5} />
            </button>
          </span>
        ))}
        <button
          ref={triggerRef as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={toggle}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            padding: '4px 8px', border: 'none', borderRadius: '16px',
            background: 'transparent', color: t.blue,
            fontFamily: F.inter, fontSize: '12px', fontWeight: 500, cursor: 'pointer',
          }}
        >
          <Plus size={12} strokeWidth={2.25} /> Добавить
        </button>
      </div>

      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '280px', maxHeight: '280px', overflowY: 'auto',
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '8px',
            boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 8px 24px rgba(17,24,39,0.12)',
            padding: searchable ? '0' : '4px 0',
          }}
        >
          {searchable && (
            <div style={{
              position: 'sticky', top: 0,
              padding: '8px 10px', background: t.surface,
              borderBottom: `1px solid ${t.border}`,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Search size={14} color={t.text4} strokeWidth={1.75} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontFamily: F.inter, fontSize: '13px', color: t.text1, background: 'transparent',
                }}
              />
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ padding: '12px', fontFamily: F.inter, fontSize: '13px', color: t.text3, textAlign: 'center' }}>
              Ничего не найдено
            </div>
          ) : filtered.map(o => {
            const sel = selected.includes(o);
            return (
              <OptionRow
                key={o}
                label={o}
                selected={sel}
                onClick={() => { sel ? remove(o) : add(o); }}
                t={t} dark={dark}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function OptionRow({ label, selected, onClick, t, dark }: {
  label: string; selected: boolean; onClick: () => void; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', border: 'none',
        background: selected ? t.blueLt : hov ? t.tableHover : 'transparent',
        fontFamily: F.inter, fontSize: '13px',
        color: selected ? t.blue : t.text1,
        cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
      }}
    >
      {label}
      {selected && <Check size={14} strokeWidth={2} color={t.blue} />}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATE PICKER
═══════════════════════════════════════════════════════════════════════════ */

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function parseDDMMYYYY(s: string): Date | null {
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return isNaN(d.getTime()) ? null : d;
}

function formatDDMMYYYY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}.${d.getFullYear()}`;
}

function DatePickerField({ value, onChange, disabled, t, dark }: {
  value: string; onChange: (v: string) => void; disabled?: boolean; t: T; dark: boolean;
}) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } =
    usePopoverPosition({ alignRight: false });

  const selected = parseDDMMYYYY(value);
  const today = new Date();
  const initial = selected ?? today;
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  useEffect(() => {
    if (!open) return;
    const base = parseDDMMYYYY(value) ?? today;
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
  }, [open, value]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = ((new Date(viewYear, viewMonth, 1).getDay() + 6) % 7);
  const blanks = Array.from({ length: firstWeekday });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const pick = (day: number) => {
    onChange(formatDDMMYYYY(new Date(viewYear, viewMonth, day)));
    close();
  };

  const borderColor = disabled ? t.border : open ? t.blue : t.inputBorder;
  const isToday = (d: number) => {
    const today2 = new Date();
    return today2.getFullYear() === viewYear && today2.getMonth() === viewMonth && today2.getDate() === d;
  };
  const isSelected = (d: number) =>
    !!selected && selected.getFullYear() === viewYear &&
    selected.getMonth() === viewMonth && selected.getDate() === d;

  const disabledBg = dark ? D.tableHeaderBg : '#F3F4F6';

  return (
    <div ref={rootRef} style={{ flex: 1, minWidth: 0 }}>
      <button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && toggle()}
        style={{
          width: '100%',
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          height: '38px', padding: '0 10px 0 12px',
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          background: disabled ? disabledBg : t.surface,
          transition: 'border-color 0.12s', boxSizing: 'border-box',
          opacity: disabled ? 0.7 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: F.inter, fontSize: '13px',
          color: disabled ? t.text4 : t.text1,
          textAlign: 'left',
        }}
      >
        <CalendarIcon size={14} color={disabled ? t.text4 : t.text3} strokeWidth={1.75} />
        <span style={{ flex: 1 }}>{value || 'Выберите дату'}</span>
        <ChevronDown size={13} color={t.text3} strokeWidth={1.75} />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '280px',
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '10px',
            boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 8px 24px rgba(17,24,39,0.12)',
            padding: '12px',
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '10px',
          }}>
            <NavBtn onClick={() => {
              if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
              else setViewMonth(m => m - 1);
            }} ariaLabel="Предыдущий месяц" t={t} dark={dark}>
              <ChevronLeft size={14} color={t.text2} strokeWidth={2} />
            </NavBtn>
            <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: t.text1 }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>
            <NavBtn onClick={() => {
              if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
              else setViewMonth(m => m + 1);
            }} ariaLabel="Следующий месяц" t={t} dark={dark}>
              <ChevronRight size={14} color={t.text2} strokeWidth={2} />
            </NavBtn>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px',
            marginBottom: '4px',
          }}>
            {DAY_LABELS.map(l => (
              <div key={l} style={{
                textAlign: 'center', padding: '4px 0',
                fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                color: t.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {l}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {blanks.map((_, i) => <div key={`b-${i}`} />)}
            {days.map(d => (
              <DayCell
                key={d}
                day={d}
                selected={isSelected(d)}
                today={isToday(d)}
                onClick={() => pick(d)}
                t={t} dark={dark}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NavBtn({ children, onClick, ariaLabel, t, dark }: {
  children: React.ReactNode; onClick: () => void; ariaLabel: string; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={ariaLabel}
      style={{
        width: '28px', height: '28px', border: 'none', borderRadius: '6px',
        background: hov ? (dark ? D.tableHover : '#F3F4F6') : 'transparent',
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.12s',
      }}
    >
      {children}
    </button>
  );
}

function DayCell({ day, selected, today, onClick, t, dark }: {
  day: number; selected: boolean; today: boolean; onClick: () => void; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const todayBg = dark ? D.tableHover : '#F3F4F6';
  const bg = selected ? t.blue : hov ? t.blueLt : today ? todayBg : 'transparent';
  const color = selected ? '#FFFFFF' : today ? t.blue : t.text1;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: '32px', border: 'none', borderRadius: '6px',
        background: bg, color, cursor: 'pointer',
        fontFamily: F.inter, fontSize: '13px',
        fontWeight: selected || today ? 600 : 400,
        transition: 'background 0.1s',
      }}
    >
      {day}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TIME FIELD — masked HH:MM input
═══════════════════════════════════════════════════════════════════════════ */

function maskTime(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function clampTime(s: string): string {
  const m = s.match(/^(\d{1,2})(?::(\d{0,2}))?$/);
  if (!m) return s;
  let h = Math.min(23, parseInt(m[1], 10) || 0);
  let mm = Math.min(59, parseInt(m[2] ?? '0', 10) || 0);
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function TimeField({ value, onChange, disabled, t, dark }: {
  value: string; onChange: (v: string) => void; disabled?: boolean; t: T; dark: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const borderColor = disabled ? t.border : focus ? t.blue : t.inputBorder;
  const disabledBg = dark ? D.tableHeaderBg : '#F3F4F6';
  return (
    <div style={{
      flex: 1, minWidth: 0,
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      height: '38px', padding: '0 10px 0 12px',
      border: `1px solid ${borderColor}`,
      borderRadius: '8px',
      background: disabled ? disabledBg : t.surface,
      transition: 'border-color 0.12s', boxSizing: 'border-box',
      opacity: disabled ? 0.7 : 1,
      cursor: disabled ? 'not-allowed' : 'text',
    }}>
      <Clock size={14} color={disabled ? t.text4 : t.text3} strokeWidth={1.75} />
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-2][0-9]:[0-5][0-9]"
        placeholder="чч:мм"
        maxLength={5}
        value={value}
        disabled={disabled}
        onChange={e => onChange(maskTime(e.target.value))}
        onFocus={() => setFocus(true)}
        onBlur={() => { setFocus(false); onChange(clampTime(value)); }}
        style={{
          flex: 1, width: '100%', border: 'none', outline: 'none',
          fontFamily: F.mono, fontSize: '13px',
          letterSpacing: '0.02em',
          color: disabled ? t.text4 : t.text1,
          background: 'transparent',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIRMATION DIALOG
═══════════════════════════════════════════════════════════════════════════ */

function SendConfirmDialog({ open, userCount, channels, onClose, onConfirm, t, dark }: {
  open: boolean; userCount: number;
  channels: { inapp: boolean; email: boolean; sms: boolean };
  onClose: () => void; onConfirm: () => void;
  t: T; dark: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const channelList = ['In-app', channels.email ? 'Email' : null, channels.sms ? 'SMS' : null]
    .filter(Boolean).join(', ');

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
          padding: '22px',
        }}
      >
        <div style={{
          fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
          color: t.text1, marginBottom: '6px',
        }}>
          Отправить объявление {userCount} {plural(userCount, 'пользователю', 'пользователям', 'пользователям')}?
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '20px' }}>
          Каналы: {channelList}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <OutlineButton onClick={onClose} t={t} dark={dark}>Отмена</OutlineButton>
          <PrimaryButton onClick={onConfirm} t={t} dark={dark}>Отправить</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORM PRIMITIVES
═══════════════════════════════════════════════════════════════════════════ */

function SectionTitle({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <h3 style={{
      margin: '0 0 12px', fontFamily: F.dm, fontSize: '13px', fontWeight: 600,
      color: t.text1, textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {children}
    </h3>
  );
}

function FormSection({ title, children, t }: { title: string; children: React.ReactNode; t: T }) {
  return (
    <div style={{ padding: '4px 0' }}>
      <SectionTitle t={t}>{title}</SectionTitle>
      {children}
    </div>
  );
}

function FieldLabel({ children, required, style, t }: {
  children: React.ReactNode; required?: boolean; style?: React.CSSProperties; t: T;
}) {
  return (
    <label style={{
      display: 'block', marginBottom: '6px',
      fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text2,
      ...style,
    }}>
      {children}{required && <span style={{ color: t.error, marginLeft: '3px' }}>*</span>}
    </label>
  );
}

function Caption({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, marginTop: '6px' }}>
      {children}
    </div>
  );
}

function Divider({ t }: { t: T }) {
  return <div style={{ height: '1px', background: t.border, margin: '20px 0' }} />;
}

function TextInput({ value, placeholder, onChange, t }: {
  value: string; placeholder?: string; onChange: (v: string) => void; t: T;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: '100%', height: '38px', padding: '0 12px',
        border: `1px solid ${focus ? t.blue : t.inputBorder}`,
        borderRadius: '8px', outline: 'none',
        fontFamily: F.inter, fontSize: '14px', color: t.text1,
        background: t.surface, boxSizing: 'border-box',
        transition: 'border-color 0.12s',
      }}
    />
  );
}

const TextArea = React.forwardRef<HTMLTextAreaElement, {
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  height?: number;
  t: T;
}>(function TextArea({ value, placeholder, onChange, height, t }, ref) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      ref={ref}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: '100%', padding: '10px 12px',
        border: `1px solid ${focus ? t.blue : t.inputBorder}`,
        borderRadius: '8px', outline: 'none', resize: 'vertical',
        fontFamily: F.inter, fontSize: '13px', color: t.text1,
        background: t.surface, boxSizing: 'border-box',
        transition: 'border-color 0.12s',
        height: height ? `${height}px` : '120px',
        minHeight: '80px', lineHeight: 1.5,
      }}
    />
  );
});

function CheckboxRow({ label, checked, onChange, disabled, t }: {
  label: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean; t: T;
}) {
  const toggle = () => { if (!disabled && onChange) onChange(!checked); };
  return (
    <label
      onClick={toggle}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1, userSelect: 'none',
      }}
    >
      <span style={{
        width: '18px', height: '18px', borderRadius: '4px',
        border: `1.5px solid ${checked ? t.blue : t.inputBorder}`,
        background: checked ? t.blue : t.surface,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.12s', flexShrink: 0,
      }}>
        {checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </span>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text1 }}>{label}</span>
    </label>
  );
}

function RadioRow({ label, sub, checked, onSelect, children, t }: {
  label: string; sub?: string; checked: boolean; onSelect: () => void;
  children?: React.ReactNode; t: T;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        flex: 1, minWidth: 0,
        padding: '12px',
        border: `1px solid ${checked ? t.blue : t.border}`,
        background: checked ? t.blueLt : t.surface,
        borderRadius: '8px', cursor: 'pointer',
        transition: 'all 0.12s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{
          width: '18px', height: '18px', borderRadius: '50%',
          border: `1.5px solid ${checked ? t.blue : t.inputBorder}`,
          background: t.surface, flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginTop: '1px',
        }}>
          {checked && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.blue }} />}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text1 }}>
            {label}
          </div>
          {sub && (
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, marginTop: '2px' }}>
              {sub}
            </div>
          )}
          {children && (
            <div onClick={e => e.stopPropagation()}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTONS
═══════════════════════════════════════════════════════════════════════════ */

function PrimaryButton({ children, onClick, disabled, t, dark }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const disabledBg = dark ? 'rgba(59,130,246,0.40)' : '#93C5FD';
  const bg = disabled ? disabledBg : hov ? t.blueHover : t.blue;
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: 'none', borderRadius: '8px',
        background: bg,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: '#FFFFFF', cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled
          ? 'none'
          : dark
            ? '0 2px 8px rgba(0,0,0,0.3)'
            : (hov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)'),
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, onClick, t, dark }: {
  children: React.ReactNode; onClick?: () => void; t: T; dark: boolean;
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
        borderRadius: '8px',
        background: hov ? t.tableHover : t.surface,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.text1, cursor: 'pointer',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, icon: Icon, t, dark }: {
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
        height: '38px', padding: '0 14px',
        border: 'none', borderRadius: '8px',
        background: hov ? t.blueLt : 'transparent',
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.blue, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'background 0.12s',
      }}
    >
      {Icon && <Icon size={14} strokeWidth={1.75} />}
      {children}
    </button>
  );
}

function DestructiveOutlineButton({ children, onClick, icon: Icon, t, dark }: {
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
        border: `1px solid ${t.error}`, borderRadius: '8px',
        background: hov ? t.errorBg : t.surface,
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.error, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.12s', flexShrink: 0,
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

function DeleteDraftModal({ open, title, onClose, onConfirm, t, dark }: {
  open: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  t: T;
  dark: boolean;
}) {
  const [closeHov, setCloseHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);

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
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1,
          }}>
            Удалить черновик
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
          <div style={{
            fontFamily: F.inter, fontSize: '13px', color: t.text1, lineHeight: 1.5,
          }}>
            Удалить черновик {title.trim() !== '' && <>«<span style={{ fontWeight: 500 }}>{title}</span>»</>}? Действие нельзя отменить.
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
              color: t.text1, cursor: 'pointer',
              transition: 'all 0.12s',
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
              background: confirmHov ? '#DC2626' : t.error,
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
            Удалить черновик
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function fmtUzs(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
