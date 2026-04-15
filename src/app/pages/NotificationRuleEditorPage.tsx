import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronRight, ChevronDown, Check, X, Plus, AlertTriangle, Bell,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { usePopoverPosition } from '../components/usePopoverPosition';
import { INITIAL_RULES, type Rule } from './NotificationRulesPage';

/* ═══════════════════════════════════════════════════════════════════════════
   FORM TYPES
═══════════════════════════════════════════════════════════════════════════ */

const TRIGGER_GROUPS: { group: string; triggers: string[] }[] = [
  { group: 'KPI',     triggers: ['KPI этап выполнен', 'KPI срок истекает', 'KPI просрочен', 'Все 3 KPI выполнены'] },
  { group: 'Финансы', triggers: ['Вознаграждение начислено', 'Запрос на вывод', 'Вывод выполнен', 'Вывод отклонён'] },
  { group: 'Карты',   triggers: ['Карта продана', 'Импорт завершён', 'Карты назначены'] },
  { group: 'Система', triggers: ['Ошибка системы', 'Вход с нового устройства', 'Ежедневная сводка'] },
];

type ScheduleKind = 'instant' | 'digest';

interface FormState {
  trigger: string;
  name: string;
  template: string;
  channels: { inapp: true; push: boolean; email: boolean; sms: boolean };
  recipients: { seller: boolean; orgMgr: boolean; bankAdmin: boolean; allUsers: boolean };
  advanceDays: number[];
  schedule: ScheduleKind;
  digestFreq: string;
  enabled: boolean;
}

const EMPTY_FORM: FormState = {
  trigger: '',
  name: '',
  template: '',
  channels: { inapp: true, push: false, email: false, sms: false },
  recipients: { seller: false, orgMgr: false, bankAdmin: false, allUsers: false },
  advanceDays: [7, 3, 1],
  schedule: 'instant',
  digestFreq: 'Ежедневно в 09:00',
  enabled: true,
};

function ruleToForm(r: Rule): FormState {
  const channelSet = new Set(r.channels);
  const recipSet = new Set(r.recipients);
  return {
    trigger: r.title,
    name: r.title,
    template: '',
    channels: {
      inapp: true,
      push: channelSet.has('Push'),
      email: channelSet.has('Email'),
      sms: channelSet.has('SMS'),
    },
    recipients: {
      seller: recipSet.has('Продавец'),
      orgMgr: recipSet.has('Менеджер орг.'),
      bankAdmin: recipSet.has('Банк-админ'),
      allUsers: recipSet.has('Все пользователи'),
    },
    advanceDays: [7, 3, 1],
    schedule: 'instant',
    digestFreq: 'Ежедневно в 09:00',
    enabled: r.enabled,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function NotificationRuleEditorPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const mode: 'create' | 'edit' = id ? 'edit' : 'create';

  const initial = useMemo<FormState>(() => {
    const preFilled = (location.state as { preFilled?: Rule } | null)?.preFilled;
    if (preFilled) return ruleToForm(preFilled);
    if (id) {
      const found = INITIAL_RULES.find(r => r.id === id);
      if (found) return ruleToForm(found);
    }
    return EMPTY_FORM;
  }, [id, location.state]);

  const [form, setForm] = useState<FormState>(initial);

  useEffect(() => { setForm(initial); }, [initial]);

  const valid = form.trigger.trim() !== '' && form.name.trim() !== '';
  const showAdvanceDays = form.trigger === 'KPI срок истекает';

  const pickTrigger = (t: string) => setForm(prev => ({
    ...prev,
    trigger: t,
    name: prev.name.trim() === '' || prev.name === prev.trigger ? t : prev.name,
  }));

  const goList = () => navigate('/notification-rules');

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
            <span onClick={goList} style={crumbLink}>Правила уведомлений</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>
              {mode === 'edit' ? 'Редактировать правило' : 'Новое правило'}
            </span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
              {mode === 'edit' ? 'Редактировать правило' : 'Новое правило уведомления'}
            </h1>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '6px' }}>
              {mode === 'edit'
                ? 'Измените параметры триггера, каналов, получателей и расписания.'
                : 'Настройте триггер, каналы, получателей и расписание отправки.'}
            </div>
          </div>

          {/* Two-column grid: form + preview */}
          <div className="nre-grid" style={{
            display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px',
            alignItems: 'start',
          }}>
          {/* Form card */}
          <div>
          <div style={cardStyle}>
            {/* § Событие */}
            <FormSection title="Событие">
              <FieldLabel required>Триггер события</FieldLabel>
              <TriggerSelect value={form.trigger} onChange={pickTrigger} />

              <FieldLabel required style={{ marginTop: '14px' }}>Название правила</FieldLabel>
              <TextInput
                value={form.name}
                placeholder="KPI этап выполнен"
                onChange={v => setForm(p => ({ ...p, name: v }))}
              />

              <FieldLabel style={{ marginTop: '14px' }}>Текст уведомления</FieldLabel>
              <TemplateField
                value={form.template}
                onChange={v => setForm(p => ({ ...p, template: v }))}
              />
              <Caption>Нажмите на переменную, чтобы вставить её в текст. При отправке они заменятся реальными данными.</Caption>
            </FormSection>

            <Divider />

            {/* § Каналы */}
            <FormSection title="Каналы доставки">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 20px' }}>
                <CheckboxRow label="In-app" checked disabled />
                <CheckboxRow
                  label="Push-уведомление"
                  checked={form.channels.push}
                  onChange={v => setForm(p => ({ ...p, channels: { ...p.channels, push: v } }))}
                />
                <CheckboxRow
                  label="Email"
                  checked={form.channels.email}
                  onChange={v => setForm(p => ({ ...p, channels: { ...p.channels, email: v } }))}
                />
                <CheckboxRow
                  label="SMS"
                  checked={form.channels.sms}
                  onChange={v => setForm(p => ({ ...p, channels: { ...p.channels, sms: v } }))}
                />
              </div>
              {form.channels.sms && (
                <div style={{
                  marginTop: '10px',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontFamily: F.inter, fontSize: '12px', color: C.warning,
                }}>
                  <AlertTriangle size={13} strokeWidth={1.75} />
                  SMS тарифицируется отдельно: ~50 UZS за сообщение
                </div>
              )}
            </FormSection>

            <Divider />

            {/* § Получатели */}
            <FormSection title="Получатели">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <CheckboxRow
                  label="Продавец (связанный с событием)"
                  checked={form.recipients.seller}
                  onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, seller: v } }))}
                />
                <CheckboxRow
                  label="Менеджер организации"
                  checked={form.recipients.orgMgr}
                  onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, orgMgr: v } }))}
                />
                <CheckboxRow
                  label="Банк-администратор"
                  checked={form.recipients.bankAdmin}
                  onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, bankAdmin: v } }))}
                />
                <CheckboxRow
                  label="Все пользователи"
                  checked={form.recipients.allUsers}
                  onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, allUsers: v } }))}
                />
              </div>

              {showAdvanceDays && (
                <div style={{ marginTop: '16px' }}>
                  <FieldLabel>Отправить за ... дней до истечения</FieldLabel>
                  <AdvanceDaysChips
                    days={form.advanceDays}
                    onChange={days => setForm(p => ({ ...p, advanceDays: days }))}
                  />
                </div>
              )}
            </FormSection>

            <Divider />

            {/* § Расписание */}
            <FormSection title="Расписание">
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'stretch' }}>
                <RadioRow
                  label="Мгновенно"
                  sub="Отправлять сразу при событии"
                  checked={form.schedule === 'instant'}
                  onSelect={() => setForm(p => ({ ...p, schedule: 'instant' }))}
                />
                <RadioRow
                  label="Дайджест"
                  sub="Собирать и отправлять пакетом"
                  checked={form.schedule === 'digest'}
                  onSelect={() => setForm(p => ({ ...p, schedule: 'digest' }))}
                >
                  {form.schedule === 'digest' && (
                    <div style={{ marginTop: '10px' }}>
                      <DigestSelect
                        value={form.digestFreq}
                        onChange={v => setForm(p => ({ ...p, digestFreq: v }))}
                      />
                    </div>
                  )}
                </RadioRow>
              </div>
            </FormSection>

            <Divider />

            {/* Active switch */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '12px',
            }}>
              <div>
                <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1 }}>
                  Правило активно
                </div>
                <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3, marginTop: '2px' }}>
                  {form.enabled ? 'Уведомления отправляются' : 'Правило создано, но уведомления не отправляются'}
                </div>
              </div>
              <Switch
                checked={form.enabled}
                onChange={() => setForm(p => ({ ...p, enabled: !p.enabled }))}
                ariaLabel="Правило активно"
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: '8px',
            marginTop: '20px',
          }}>
            <OutlineButton onClick={goList}>Отмена</OutlineButton>
            <PrimaryButton disabled={!valid} onClick={() => valid && goList()}>
              Сохранить правило
            </PrimaryButton>
          </div>
          </div>
          {/* /left column */}

          {/* Right column — preview + summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '20px' }}>
            <div style={cardStyle}>
              <SectionTitle>Предпросмотр</SectionTitle>
              <PreviewCard form={form} />
              <div style={{ height: '1px', background: C.border, margin: '14px 0' }} />
              <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
                Предпросмотр с образцовыми данными. Переменные будут заменены реальными значениями при отправке.
              </div>
            </div>

            <SummaryCard form={form} />
          </div>
          {/* /right column */}
          </div>
          {/* /grid */}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .nre-grid { grid-template-columns: 1fr !important; }
          .nre-grid > div:last-child { position: static !important; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PREVIEW + SUMMARY
═══════════════════════════════════════════════════════════════════════════ */

const SAMPLE_VARS: Record<string, string> = {
  seller_name: 'Санжар М.',
  card_number: '8600 •••• 4521',
  kpi_step:    'KPI 3',
  amount:      '10 000 UZS',
  org_name:    'Mysafar OOO',
};

function renderTemplate(tpl: string): string {
  if (!tpl) return '';
  return tpl.replace(/\{(\w+)\}/g, (_, key) => SAMPLE_VARS[key] ?? `{${key}}`);
}

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

function PreviewCard({ form }: { form: FormState }) {
  const placeholderTitle = !form.name.trim();
  const placeholderBody  = !form.template.trim();
  const title = form.name.trim() || 'Название правила';
  const body  = renderTemplate(form.template.trim()) || 'Текст уведомления появится здесь…';

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
          color: placeholderTitle ? C.text4 : C.text1, lineHeight: 1.3,
        }}>
          🔔 {title}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '13px',
          color: placeholderBody ? C.text4 : C.text2,
          marginTop: '4px', lineHeight: 1.5, whiteSpace: 'pre-wrap',
          display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 4,
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

function SummaryCard({ form }: { form: FormState }) {
  const channels: string[] = ['In-app'];
  if (form.channels.push)  channels.push('Push');
  if (form.channels.email) channels.push('Email');
  if (form.channels.sms)   channels.push('SMS');

  const recipients: string[] = [];
  if (form.recipients.seller)    recipients.push('Продавец');
  if (form.recipients.orgMgr)    recipients.push('Менеджер орг.');
  if (form.recipients.bankAdmin) recipients.push('Банк-админ');
  if (form.recipients.allUsers)  recipients.push('Все пользователи');

  const schedule = form.schedule === 'instant'
    ? 'Мгновенно'
    : `Дайджест · ${form.digestFreq}`;

  const advance = form.trigger === 'KPI срок истекает' && form.advanceDays.length
    ? form.advanceDays.map(d => d === 1 ? '1 день' : d < 5 ? `${d} дня` : `${d} дней`).join(', ')
    : null;

  return (
    <div style={{
      background: '#F9FAFB',
      border: `1px solid ${C.border}`,
      borderRadius: '8px', padding: '14px',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      <SummaryRow label="Событие"  value={form.trigger || '—'} emphasize={!!form.trigger} />
      <SummaryRow label="Каналы"   value={channels.join(', ')} />
      <SummaryRow
        label="Получатели"
        value={recipients.length ? recipients.join(', ') : '—'}
        dim={recipients.length === 0}
      />
      {advance && <SummaryRow label="Напомнить за" value={advance} />}
      <SummaryRow label="Расписание" value={schedule} />
      <SummaryRow
        label="Статус"
        value={form.enabled ? 'Активно' : 'Неактивно'}
        tone={form.enabled ? 'success' : 'muted'}
      />
    </div>
  );
}

function SummaryRow({ label, value, emphasize, dim, tone }: {
  label: string; value: string;
  emphasize?: boolean; dim?: boolean;
  tone?: 'success' | 'muted';
}) {
  const color = tone === 'success' ? C.success
              : tone === 'muted'   ? C.text4
              : dim                ? C.text4
              : emphasize          ? C.text1
              : C.text1;
  const weight = emphasize || tone === 'success' ? 500 : 400;
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <span style={{
        fontFamily: F.inter, fontSize: '12px', color: C.text3,
        minWidth: '110px',
      }}>
        {label}:
      </span>
      <span style={{
        flex: 1, minWidth: 0,
        fontFamily: F.inter, fontSize: '13px', color, fontWeight: weight,
      }}>
        {value}
      </span>
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

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{
        margin: '0 0 12px', fontFamily: F.dm, fontSize: '13px', fontWeight: 600,
        color: C.text1, textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        {title}
      </h3>
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

/* ═══════════════════════════════════════════════════════════════════════════
   TEMPLATE FIELD (textarea + variable chips)
═══════════════════════════════════════════════════════════════════════════ */

const TEMPLATE_VARIABLES = [
  'seller_name', 'card_number', 'kpi_step', 'amount', 'org_name',
] as const;

function TemplateField({ value, onChange }: {
  value: string; onChange: (v: string) => void;
}) {
  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const insertToken = (name: string) => {
    const token = `{${name}}`;
    const ta = ref.current;
    if (!ta) { onChange(value + token); return; }
    const start = ta.selectionStart ?? value.length;
    const end = ta.selectionEnd ?? value.length;
    const next = value.slice(0, start) + token + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + token.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  return (
    <div>
      <textarea
        ref={ref}
        value={value}
        placeholder="Введите текст уведомления..."
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        rows={3}
        style={{
          width: '100%', padding: '10px 12px',
          border: `1px solid ${focus ? C.blue : C.inputBorder}`,
          borderRadius: '8px', outline: 'none', resize: 'vertical',
          fontFamily: F.inter, fontSize: '13px', color: C.text1,
          background: C.surface, boxSizing: 'border-box',
          transition: 'border-color 0.12s', minHeight: '76px', lineHeight: 1.5,
        }}
      />

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
        marginTop: '8px',
      }}>
        <span style={{
          fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
          color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
          marginRight: '2px',
        }}>
          Переменные
        </span>
        {TEMPLATE_VARIABLES.map(v => (
          <VariableChip key={v} name={v} onInsert={() => insertToken(v)} />
        ))}
      </div>
    </div>
  );
}

function VariableChip({ name, onInsert }: { name: string; onInsert: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onInsert}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={`Вставить {${name}}`}
      style={{
        padding: '3px 8px',
        border: `1px solid ${hov ? C.blue : C.border}`,
        borderRadius: '6px',
        background: hov ? C.blueLt : C.surface,
        color: hov ? C.blue : C.text2,
        fontFamily: F.mono, fontSize: '11px',
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      {`{${name}}`}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRIGGER + DIGEST SELECTS
═══════════════════════════════════════════════════════════════════════════ */

function TriggerSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } =
    usePopoverPosition({ alignRight: false });
  return (
    <div ref={rootRef}>
      <button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={toggle}
        style={{
          width: '100%', height: '38px', padding: '0 12px',
          border: `1px solid ${open ? C.blue : C.inputBorder}`,
          borderRadius: '8px', background: C.surface,
          fontFamily: F.inter, fontSize: '14px',
          color: value ? C.text1 : C.text4,
          cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'border-color 0.12s',
        }}
      >
        <span>{value || 'Выберите событие'}</span>
        <ChevronDown size={16} color={C.text3} strokeWidth={1.75} />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '300px',
            maxHeight: '320px', overflowY: 'auto',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '8px', boxShadow: '0 8px 24px rgba(17,24,39,0.12)',
            padding: '4px 0',
          }}
        >
          {TRIGGER_GROUPS.map(g => (
            <div key={g.group}>
              <div style={{
                padding: '8px 12px 4px',
                fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                color: C.text4, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {g.group}
              </div>
              {g.triggers.map(t => (
                <OptionRow
                  key={t}
                  label={t}
                  selected={value === t}
                  onClick={() => { onChange(t); close(); }}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DigestSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const options = ['Ежедневно в 09:00', 'Еженедельно (понедельник)', 'Ежемесячно (1 число)'];
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } =
    usePopoverPosition({ alignRight: false });
  return (
    <div ref={rootRef} onClick={e => e.stopPropagation()}>
      <button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={toggle}
        style={{
          width: '100%', height: '34px', padding: '0 10px',
          border: `1px solid ${open ? C.blue : C.inputBorder}`,
          borderRadius: '8px', background: C.surface,
          fontFamily: F.inter, fontSize: '13px', color: C.text1,
          cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {value}
        <ChevronDown size={14} color={C.text3} strokeWidth={1.75} />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '240px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '8px', boxShadow: '0 8px 24px rgba(17,24,39,0.12)',
            padding: '4px 0',
          }}
        >
          {options.map(o => (
            <OptionRow key={o} label={o} selected={value === o} onClick={() => { onChange(o); close(); }} />
          ))}
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
   CHECKBOX / RADIO / SWITCH
═══════════════════════════════════════════════════════════════════════════ */

function CheckboxRow({ label, checked, onChange, disabled }: {
  label: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean;
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
        border: `1.5px solid ${checked ? C.blue : C.inputBorder}`,
        background: checked ? C.blue : C.surface,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.12s', flexShrink: 0,
      }}>
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

function Switch({ checked, onChange, ariaLabel }: {
  checked: boolean; onChange: () => void; ariaLabel: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      style={{
        width: '44px', height: '24px', borderRadius: '12px',
        background: checked ? C.blue : '#D1D5DB',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        background: C.surface, position: 'absolute', top: '3px',
        left: checked ? '23px' : '3px',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADVANCE DAYS CHIPS
═══════════════════════════════════════════════════════════════════════════ */

function AdvanceDaysChips({ days, onChange }: {
  days: number[]; onChange: (days: number[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const commit = () => {
    const n = parseInt(draft, 10);
    if (!isNaN(n) && n > 0 && !days.includes(n)) {
      onChange([...days, n].sort((a, b) => b - a));
    }
    setDraft('');
    setAdding(false);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      {days.map(d => (
        <span
          key={d}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 6px 4px 10px', borderRadius: '16px',
            background: C.blueLt, color: C.blue,
            fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
          }}
        >
          {d === 1 ? '1 день' : d < 5 ? `${d} дня` : `${d} дней`}
          <button
            onClick={() => onChange(days.filter(x => x !== d))}
            aria-label={`Убрать ${d}`}
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
      {adding ? (
        <input
          autoFocus
          type="number"
          min={1}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(''); setAdding(false); } }}
          placeholder="дн."
          style={{
            width: '70px', height: '26px', padding: '0 8px',
            border: `1px solid ${C.blue}`, borderRadius: '16px',
            fontFamily: F.inter, fontSize: '12px', outline: 'none',
          }}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            padding: '4px 10px', border: 'none', borderRadius: '16px',
            background: 'transparent', color: C.blue,
            fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <Plus size={12} strokeWidth={2.25} /> Добавить
        </button>
      )}
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
