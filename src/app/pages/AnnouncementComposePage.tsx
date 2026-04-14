import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell, ChevronRight, ChevronLeft, Plus, X, Check, ChevronDown, Search,
  Save, AlertTriangle, Calendar as CalendarIcon, Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { usePopoverPosition } from '../components/usePopoverPosition';

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
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const patch = (p: Partial<FormState>) => setForm(s => ({ ...s, ...p }));

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

        <div style={{ padding: '28px 32px 0', boxSizing: 'border-box', width: '100%', flex: 1 }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span onClick={() => navigate('/dashboard')} style={crumbLink}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/notification-rules')} style={crumbLink}>Уведомления</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Новое объявление</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
              Отправить объявление
            </h1>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '6px' }}>
              Отправьте сообщение организациям и пользователям
            </div>
          </div>

          {/* Two-column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', paddingBottom: '96px' }}>
            {/* ── LEFT: compose ── */}
            <div style={cardStyle}>
              {/* § Содержание */}
              <FormSection title="Содержание">
                <FieldLabel required>Заголовок</FieldLabel>
                <TextInput
                  value={form.title}
                  placeholder="Тема объявления..."
                  onChange={v => patch({ title: v })}
                />

                <FieldLabel required style={{ marginTop: '14px' }}>Текст сообщения</FieldLabel>
                <TextArea
                  value={form.body}
                  placeholder="Введите текст объявления..."
                  onChange={v => patch({ body: v })}
                  height={160}
                />
                <Caption>Поддерживается простое форматирование: **жирный**, _курсив_</Caption>
              </FormSection>

              <Divider />

              {/* § Получатели */}
              <FormSection title="Получатели">
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'stretch' }}>
                  <RadioRow
                    label="Все организации"
                    sub="Отправить всем активным администраторам организаций"
                    checked={form.mode === 'all'}
                    onSelect={() => patch({ mode: 'all' })}
                  />
                  <RadioRow
                    label="Выбранные организации"
                    sub="Выбрать конкретные организации из списка"
                    checked={form.mode === 'orgs'}
                    onSelect={() => patch({ mode: 'orgs' })}
                  />
                  <RadioRow
                    label="Конкретные пользователи"
                    sub="Поиск отдельных получателей по имени"
                    checked={form.mode === 'users'}
                    onSelect={() => patch({ mode: 'users' })}
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
                    />
                  </div>
                )}
              </FormSection>

              <Divider />

              {/* § Каналы */}
              <FormSection title="Каналы доставки">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 20px' }}>
                  <CheckboxRow label="In-app уведомление" checked disabled />
                  <CheckboxRow
                    label="Email"
                    checked={form.channels.email}
                    onChange={v => patch({ channels: { ...form.channels, email: v } })}
                  />
                  <CheckboxRow
                    label="SMS"
                    checked={form.channels.sms}
                    onChange={v => patch({ channels: { ...form.channels, sms: v } })}
                  />
                </div>
                {form.channels.sms && (
                  <div style={{
                    marginTop: '10px',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontFamily: F.inter, fontSize: '12px', color: C.warning,
                  }}>
                    <AlertTriangle size={13} strokeWidth={1.75} />
                    SMS будет отправлено на {smsRecipients} номеров. Стоимость: ~{fmtUzs(smsRecipients * SMS_COST_PER_MSG)} UZS
                  </div>
                )}
              </FormSection>

              <Divider />

              {/* § Расписание */}
              <FormSection title="Расписание">
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'stretch' }}>
                  <RadioRow
                    label="Отправить сейчас"
                    sub="Объявление уйдёт сразу после подтверждения"
                    checked={form.schedule === 'now'}
                    onSelect={() => patch({ schedule: 'now' })}
                  />
                  <RadioRow
                    label="Запланировать"
                    sub="Объявление будет отправлено в указанное время"
                    checked={form.schedule === 'scheduled'}
                    onSelect={() => patch({ schedule: 'scheduled' })}
                  >
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{ display: 'flex', gap: '8px', marginTop: '10px' }}
                    >
                      <DatePickerField
                        value={form.scheduleDate}
                        onChange={v => patch({ scheduleDate: v })}
                        disabled={form.schedule !== 'scheduled'}
                      />
                      <TimeField
                        value={form.scheduleTime}
                        onChange={v => patch({ scheduleTime: v })}
                        disabled={form.schedule !== 'scheduled'}
                      />
                    </div>
                  </RadioRow>
                </div>
              </FormSection>
            </div>

            {/* ── RIGHT: preview ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={cardStyle}>
                <SectionTitle>Предпросмотр</SectionTitle>

                <PreviewCard
                  title={form.title || 'Тема объявления'}
                  body={form.body || 'Введите текст объявления...'}
                  placeholder={form.title.trim() === ''}
                />

                <div style={{ height: '1px', background: C.border, margin: '14px 0' }} />

                <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
                  От: <span style={{ color: C.text2 }}>Админ Камолов (Universalbank)</span>
                </div>
              </div>

              <SummaryCard
                recipients={recipientsCount}
                channels={form.channels}
                schedule={form.schedule}
                scheduleDate={form.scheduleDate}
                scheduleTime={form.scheduleTime}
              />
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div style={{
          position: 'sticky', bottom: 0, zIndex: 20,
          background: C.surface, borderTop: `1px solid ${C.border}`,
          padding: '12px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '8px', flexShrink: 0,
        }}>
          <GhostButton icon={Save} onClick={() => {}}>Сохранить как черновик</GhostButton>
          <div style={{ display: 'flex', gap: '8px' }}>
            <OutlineButton onClick={() => navigate('/notification-rules')}>Отмена</OutlineButton>
            <PrimaryButton disabled={!canSend} onClick={() => setConfirmOpen(true)}>
              Отправить объявление
            </PrimaryButton>
          </div>
        </div>
      </div>

      <SendConfirmDialog
        open={confirmOpen}
        userCount={recipientsCount.users}
        channels={form.channels}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); navigate('/notification-rules'); }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PREVIEW + SUMMARY
═══════════════════════════════════════════════════════════════════════════ */

function PreviewCard({ title, body, placeholder }: { title: string; body: string; placeholder: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '12px',
      border: `1px solid ${C.border}`, borderRadius: '8px', background: C.surface,
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        background: C.blueLt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Bell size={18} color={C.blue} strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
          color: placeholder ? C.text4 : C.text1, lineHeight: 1.3,
        }}>
          📢 {title}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '4px',
          lineHeight: 1.45,
          display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2,
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {body}
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4, marginTop: '6px' }}>
          Только что
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ recipients, channels, schedule, scheduleDate, scheduleTime }: {
  recipients: { orgs: number; users: number };
  channels: { inapp: boolean; email: boolean; sms: boolean };
  schedule: ScheduleMode;
  scheduleDate: string;
  scheduleTime: string;
}) {
  const channelList = ['In-app', channels.email ? 'Email' : null, channels.sms ? 'SMS' : null]
    .filter(Boolean).join(', ');

  const recipientsLabel = recipients.orgs > 0
    ? `${recipients.orgs} ${plural(recipients.orgs, 'организация', 'организации', 'организаций')} (${recipients.users} ${plural(recipients.users, 'пользователь', 'пользователя', 'пользователей')})`
    : `${recipients.users} ${plural(recipients.users, 'пользователь', 'пользователя', 'пользователей')}`;

  const scheduleLabel = schedule === 'now' ? 'Сейчас' : `${scheduleDate}, ${scheduleTime}`;

  return (
    <div style={{
      background: '#F9FAFB',
      border: `1px solid ${C.border}`,
      borderRadius: '8px', padding: '12px',
      display: 'flex', flexDirection: 'column', gap: '6px',
    }}>
      <SummaryRow label="Получатели" value={recipientsLabel} />
      <SummaryRow label="Каналы" value={channelList} />
      <SummaryRow label="Расписание" value={scheduleLabel} />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, minWidth: '100px' }}>
        {label}:
      </span>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1, fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MULTI-SELECT
═══════════════════════════════════════════════════════════════════════════ */

function MultiSelect({ options, selected, onChange, placeholder, searchPlaceholder, searchable }: {
  options: string[]; selected: string[];
  onChange: (v: string[]) => void;
  placeholder: string; searchPlaceholder: string; searchable?: boolean;
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

  return (
    <div ref={rootRef}>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
        minHeight: '38px', padding: '6px 8px',
        border: `1px solid ${open ? C.blue : C.inputBorder}`,
        borderRadius: '8px', background: C.surface,
        transition: 'border-color 0.12s',
      }}>
        {selected.map(s => (
          <span
            key={s}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '3px 4px 3px 10px', borderRadius: '16px',
              background: C.blueLt, color: C.blue,
              fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
            }}
          >
            {s}
            <button
              onClick={() => remove(s)}
              aria-label={`Убрать ${s}`}
              style={{
                width: '16px', height: '16px', border: 'none', borderRadius: '50%',
                background: 'rgba(37,99,235,0.15)', color: C.blue,
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
            background: 'transparent', color: C.blue,
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
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '8px', boxShadow: '0 8px 24px rgba(17,24,39,0.12)',
            padding: searchable ? '0' : '4px 0',
          }}
        >
          {searchable && (
            <div style={{
              position: 'sticky', top: 0,
              padding: '8px 10px', background: C.surface,
              borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Search size={14} color={C.text4} strokeWidth={1.75} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontFamily: F.inter, fontSize: '13px', color: C.text1, background: 'transparent',
                }}
              />
            </div>
          )}

          {filtered.length === 0 ? (
            <div style={{ padding: '12px', fontFamily: F.inter, fontSize: '13px', color: C.text3, textAlign: 'center' }}>
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
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function OptionRow({ label, selected, onClick }: {
  label: string; selected: boolean; onClick: () => void;
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
        background: selected ? C.blueLt : hov ? '#F9FAFB' : 'transparent',
        fontFamily: F.inter, fontSize: '13px',
        color: selected ? C.blue : C.text1,
        cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
      }}
    >
      {label}
      {selected && <Check size={14} strokeWidth={2} color={C.blue} />}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DATE / TIME FIELD
═══════════════════════════════════════════════════════════════════════════ */

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

function DatePickerField({ value, onChange, disabled }: {
  value: string; onChange: (v: string) => void; disabled?: boolean;
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

  const borderColor = disabled ? C.border : open ? C.blue : C.inputBorder;
  const isToday = (d: number) => {
    const t = new Date();
    return t.getFullYear() === viewYear && t.getMonth() === viewMonth && t.getDate() === d;
  };
  const isSelected = (d: number) =>
    !!selected && selected.getFullYear() === viewYear &&
    selected.getMonth() === viewMonth && selected.getDate() === d;

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
          background: disabled ? '#F3F4F6' : C.surface,
          transition: 'border-color 0.12s', boxSizing: 'border-box',
          opacity: disabled ? 0.7 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: F.inter, fontSize: '13px',
          color: disabled ? C.text4 : C.text1,
          textAlign: 'left',
        }}
      >
        <CalendarIcon size={14} color={disabled ? C.text4 : C.text3} strokeWidth={1.75} />
        <span style={{ flex: 1 }}>{value || 'Выберите дату'}</span>
        <ChevronDown size={13} color={C.text3} strokeWidth={1.75} />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '280px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '10px', boxShadow: '0 8px 24px rgba(17,24,39,0.12)',
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
            }} ariaLabel="Предыдущий месяц">
              <ChevronLeft size={14} color={C.text2} strokeWidth={2} />
            </NavBtn>
            <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: C.text1 }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>
            <NavBtn onClick={() => {
              if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
              else setViewMonth(m => m + 1);
            }} ariaLabel="Следующий месяц">
              <ChevronRight size={14} color={C.text2} strokeWidth={2} />
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
                color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NavBtn({ children, onClick, ariaLabel }: {
  children: React.ReactNode; onClick: () => void; ariaLabel: string;
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
        background: hov ? '#F3F4F6' : 'transparent', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.12s',
      }}
    >
      {children}
    </button>
  );
}

function DayCell({ day, selected, today, onClick }: {
  day: number; selected: boolean; today: boolean; onClick: () => void;
}) {
  const [hov, setHov] = useState(false);
  const bg = selected ? C.blue : hov ? C.blueLt : today ? '#F3F4F6' : 'transparent';
  const color = selected ? '#FFFFFF' : today ? C.blue : C.text1;
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

function TimeField({ value, onChange, disabled }: {
  value: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const borderColor = disabled ? C.border : focus ? C.blue : C.inputBorder;
  return (
    <div style={{
      flex: 1, minWidth: 0,
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      height: '38px', padding: '0 10px 0 12px',
      border: `1px solid ${borderColor}`,
      borderRadius: '8px',
      background: disabled ? '#F3F4F6' : C.surface,
      transition: 'border-color 0.12s', boxSizing: 'border-box',
      opacity: disabled ? 0.7 : 1,
      cursor: disabled ? 'not-allowed' : 'text',
    }}>
      <Clock size={14} color={disabled ? C.text4 : C.text3} strokeWidth={1.75} />
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
          color: disabled ? C.text4 : C.text1,
          background: 'transparent',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
    </div>
  );
}

function DateTimeField({ icon: Icon, value, onChange, width, flex, disabled }: {
  icon: React.ElementType; value: string; onChange: (v: string) => void;
  width?: number; flex?: boolean; disabled?: boolean;
}) {
  const [focus, setFocus] = useState(false);
  const borderColor = disabled ? C.border : focus ? C.blue : C.inputBorder;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      height: '38px', padding: '0 10px 0 12px',
      ...(flex ? { flex: 1, minWidth: 0 } : { width }),
      border: `1px solid ${borderColor}`,
      borderRadius: '8px',
      background: disabled ? '#F3F4F6' : C.surface,
      transition: 'border-color 0.12s', boxSizing: 'border-box',
      opacity: disabled ? 0.7 : 1,
      cursor: disabled ? 'not-allowed' : 'text',
    }}>
      <Icon size={14} color={disabled ? C.text4 : C.text3} strokeWidth={1.75} />
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          flex: 1, width: '100%', border: 'none', outline: 'none',
          fontFamily: F.inter, fontSize: '13px',
          color: disabled ? C.text4 : C.text1,
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

function SendConfirmDialog({ open, userCount, channels, onClose, onConfirm }: {
  open: boolean; userCount: number;
  channels: { inapp: boolean; email: boolean; sms: boolean };
  onClose: () => void; onConfirm: () => void;
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

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(17, 24, 39, 0.50)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '440px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px', boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          padding: '22px',
        }}
      >
        <div style={{
          fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
          color: C.text1, marginBottom: '6px',
        }}>
          Отправить объявление {userCount} {plural(userCount, 'пользователю', 'пользователям', 'пользователям')}?
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginBottom: '20px' }}>
          Каналы: {channelList}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <OutlineButton onClick={onClose}>Отмена</OutlineButton>
          <PrimaryButton onClick={onConfirm}>Отправить</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORM PRIMITIVES
═══════════════════════════════════════════════════════════════════════════ */

const cardStyle: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: '12px',
  padding: '24px',
};

const crumbLink: React.CSSProperties = {
  fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer',
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      margin: '0 0 12px', fontFamily: F.dm, fontSize: '13px', fontWeight: 600,
      color: C.text1, textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {children}
    </h3>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '4px 0' }}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
}

function FieldLabel({ children, required, style }: {
  children: React.ReactNode; required?: boolean; style?: React.CSSProperties;
}) {
  return (
    <label style={{
      display: 'block', marginBottom: '6px',
      fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text2,
      ...style,
    }}>
      {children}{required && <span style={{ color: C.error, marginLeft: '3px' }}>*</span>}
    </label>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3, marginTop: '6px' }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: C.border, margin: '20px 0' }} />;
}

function TextInput({ value, placeholder, onChange }: {
  value: string; placeholder?: string; onChange: (v: string) => void;
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
        border: `1px solid ${focus ? C.blue : C.inputBorder}`,
        borderRadius: '8px', outline: 'none',
        fontFamily: F.inter, fontSize: '14px', color: C.text1,
        background: C.surface, boxSizing: 'border-box',
        transition: 'border-color 0.12s',
      }}
    />
  );
}

function TextArea({ value, placeholder, onChange, height }: {
  value: string; placeholder?: string; onChange: (v: string) => void; height?: number;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: '100%', padding: '10px 12px',
        border: `1px solid ${focus ? C.blue : C.inputBorder}`,
        borderRadius: '8px', outline: 'none', resize: 'vertical',
        fontFamily: F.inter, fontSize: '13px', color: C.text1,
        background: C.surface, boxSizing: 'border-box',
        transition: 'border-color 0.12s',
        height: height ? `${height}px` : '120px',
        minHeight: '80px', lineHeight: 1.5,
      }}
    />
  );
}

function CheckboxRow({ label, checked, onChange, disabled }: {
  label: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean;
}) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1, userSelect: 'none',
    }}>
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: '18px', height: '18px', borderRadius: '4px',
          border: `1.5px solid ${checked ? C.blue : C.inputBorder}`,
          background: checked ? C.blue : C.surface,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.12s', flexShrink: 0,
        }}
      >
        {checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </span>
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1 }}>{label}</span>
    </label>
  );
}

function RadioRow({ label, sub, checked, onSelect, children }: {
  label: string; sub?: string; checked: boolean; onSelect: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        flex: 1, minWidth: 0,
        padding: '12px',
        border: `1px solid ${checked ? C.blue : C.border}`,
        background: checked ? C.blueLt : C.surface,
        borderRadius: '8px', cursor: 'pointer',
        transition: 'all 0.12s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{
          width: '18px', height: '18px', borderRadius: '50%',
          border: `1.5px solid ${checked ? C.blue : C.inputBorder}`,
          background: C.surface, flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginTop: '1px',
        }}>
          {checked && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: C.blue }} />}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text1 }}>
            {label}
          </div>
          {sub && (
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3, marginTop: '2px' }}>
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

function PrimaryButton({ children, onClick, disabled }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
}) {
  const [hov, setHov] = useState(false);
  const bg = disabled ? '#93C5FD' : hov ? C.blueHover : C.blue;
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
        boxShadow: disabled ? 'none' : hov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {children}
    </button>
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

function GhostButton({ children, onClick, icon: Icon }: {
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
        height: '38px', padding: '0 14px',
        border: 'none', borderRadius: '8px',
        background: hov ? C.blueLt : 'transparent',
        fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: C.blue, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'background 0.12s',
      }}
    >
      {Icon && <Icon size={14} strokeWidth={1.75} />}
      {children}
    </button>
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
