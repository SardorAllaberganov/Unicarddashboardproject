import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronRight, ChevronDown, Check, X, Plus, AlertTriangle, Bell,
} from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useIsMobile } from '../components/useIsMobile';
import { usePopoverPosition } from '../components/usePopoverPosition';
import { INITIAL_RULES, type Rule } from './NotificationRulesPage';

type T = ReturnType<typeof theme>;

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

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE — Rule editor (M-02)
═══════════════════════════════════════════════════════════════════════════ */

function MobileInput({
  label, value, onChange, placeholder, t,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; t: T;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const handleFocus = useCallback(() => {
    setFocused(true);
    setTimeout(() => {
      wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }, []);
  return (
    <div ref={wrapRef}>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: 13, fontWeight: 500,
        color: t.text2, marginBottom: 8,
      }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%', height: 48,
          padding: '0 14px',
          border: `1.5px solid ${focused ? t.blue : t.inputBorder}`,
          borderRadius: 12,
          background: t.surface,
          fontFamily: F.inter, fontSize: 15, color: t.text1,
          outline: 'none', boxSizing: 'border-box',
          transition: 'border-color 0.12s',
        }}
      />
    </div>
  );
}

function MobileTextarea({
  label, value, onChange, placeholder, hint, t,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; t: T;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const handleFocus = useCallback(() => {
    setFocused(true);
    setTimeout(() => {
      wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }, []);
  return (
    <div ref={wrapRef}>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: 13, fontWeight: 500,
        color: t.text2, marginBottom: 8,
      }}>{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: '100%', minHeight: 100, padding: '12px 14px',
          border: `1.5px solid ${focused ? t.blue : t.inputBorder}`,
          borderRadius: 12,
          background: t.surface,
          fontFamily: F.inter, fontSize: 15, color: t.text1,
          outline: 'none', boxSizing: 'border-box', resize: 'vertical',
          transition: 'border-color 0.12s', lineHeight: 1.5,
        }}
      />
      {hint && (
        <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 6, lineHeight: 1.4 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

function MobileSectionHeader({ text, t }: { text: string; t: T }) {
  return (
    <div style={{
      fontFamily: F.inter, fontSize: 11, fontWeight: 600,
      color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '24px 0 10px',
    }}>
      {text}
    </div>
  );
}

function MobileCheckboxRow({
  label, checked, onChange, disabled, hint, isLast, t,
}: {
  label: string; checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean;
  hint?: React.ReactNode; isLast?: boolean; t: T;
}) {
  return (
    <div
      onClick={() => !disabled && onChange?.(!checked)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: 15, color: t.text1 }}>{label}</div>
        {hint && <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 3 }}>{hint}</div>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        border: `1.5px solid ${checked ? t.blue : t.inputBorder}`,
        background: checked ? t.blue : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 0.12s',
      }}>
        {checked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
      </div>
    </div>
  );
}

function MobileRadioRow({
  label, sub, selected, onSelect, isLast, t,
}: {
  label: string; sub?: string; selected: boolean; onSelect: () => void; isLast?: boolean; t: T;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
        cursor: 'pointer',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: 15, color: t.text1 }}>{label}</div>
        {sub && <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 3 }}>{sub}</div>}
      </div>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        border: `1.5px solid ${selected ? t.blue : t.inputBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {selected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.blue }} />}
      </div>
    </div>
  );
}

function MobileToggleRow({
  label, sub, checked, onChange, t, dark,
}: {
  label: string; sub?: string; checked: boolean; onChange: () => void; t: T; dark: boolean;
}) {
  const offBg = dark ? '#3A3F50' : '#D1D5DB';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1 }}>{label}</div>
        {sub && <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 3 }}>{sub}</div>}
      </div>
      <button
        onClick={onChange}
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: checked ? t.blue : offBg,
          border: 'none', position: 'relative', cursor: 'pointer',
          transition: 'background 0.2s', flexShrink: 0,
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          background: '#FFFFFF', position: 'absolute', top: 3,
          left: checked ? 23 : 3,
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

function MobileTriggerSheet({
  open, onClose, value, onPick, t, dark,
}: {
  open: boolean; onClose: () => void; value: string; onPick: (v: string) => void; t: T; dark: boolean;
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          maxHeight: '85vh',
          background: t.surface,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          boxShadow: dark ? '0 -4px 24px rgba(0,0,0,0.6)' : '0 -4px 24px rgba(17,24,39,0.15)',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8, flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: t.inputBorder }} />
        </div>
        <div style={{ padding: '4px 20px 12px', fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1, flexShrink: 0 }}>
          Выберите триггер
        </div>
        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
          {TRIGGER_GROUPS.map((g, gi) => (
            <React.Fragment key={g.group}>
              <div style={{
                padding: '12px 20px 6px',
                fontFamily: F.inter, fontSize: 11, fontWeight: 600,
                color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
                background: dark ? 'rgba(160,165,184,0.05)' : '#F9FAFB',
                borderTop: gi > 0 ? `1px solid ${t.border}` : 'none',
              }}>
                {g.group}
              </div>
              {g.triggers.map((tr, ti) => (
                <div
                  key={tr}
                  onClick={() => { onPick(tr); onClose(); }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderBottom: ti < g.triggers.length - 1 ? `1px solid ${t.border}` : 'none',
                    cursor: 'pointer',
                    background: tr === value ? (dark ? 'rgba(59,130,246,0.10)' : '#EFF6FF') : 'transparent',
                  }}
                >
                  <span style={{
                    fontFamily: F.inter, fontSize: 15,
                    color: tr === value ? t.blue : t.text1,
                    fontWeight: tr === value ? 600 : 500,
                  }}>
                    {tr}
                  </span>
                  {tr === value && <Check size={20} color={t.blue} strokeWidth={2.5} />}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileDigestSheet({
  open, onClose, value, onPick, t, dark,
}: {
  open: boolean; onClose: () => void; value: string; onPick: (v: string) => void; t: T; dark: boolean;
}) {
  if (!open) return null;
  const options = ['Ежедневно в 09:00', 'Еженедельно (понедельник)', 'Ежемесячно (1 число)'];
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: t.surface,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          boxShadow: dark ? '0 -4px 24px rgba(0,0,0,0.6)' : '0 -4px 24px rgba(17,24,39,0.15)',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: t.inputBorder }} />
        </div>
        <div style={{ padding: '4px 20px 12px', fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1 }}>
          Частота дайджеста
        </div>
        {options.map((o, i) => (
          <div
            key={o}
            onClick={() => { onPick(o); onClose(); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: i < options.length - 1 ? `1px solid ${t.border}` : 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{
              fontFamily: F.inter, fontSize: 15,
              color: o === value ? t.blue : t.text1,
              fontWeight: o === value ? 600 : 500,
            }}>
              {o}
            </span>
            {o === value && <Check size={20} color={t.blue} strokeWidth={2.5} />}
          </div>
        ))}
        <div style={{ padding: '12px 16px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', height: 48, borderRadius: 12,
              background: dark ? 'rgba(160,165,184,0.12)' : '#F3F4F6',
              border: 'none',
              fontFamily: F.inter, fontSize: 16, fontWeight: 600, color: t.text2,
              cursor: 'pointer',
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

function MobileRuleEditor({
  mode, form, setForm, onSave, goList, t, dark,
}: {
  mode: 'create' | 'edit';
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onSave: () => void;
  goList: () => void;
  t: T;
  dark: boolean;
}) {
  const [triggerOpen, setTriggerOpen] = useState(false);
  const [digestOpen, setDigestOpen] = useState(false);

  const valid = form.trigger.trim() !== '' && form.name.trim() !== '';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: t.pageBg,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header Y-02 V4 */}
      <div style={{
        height: 56, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 8px',
        background: t.surface, borderBottom: `1px solid ${t.border}`,
      }}>
        <button
          onClick={goList}
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={22} color={t.text1} strokeWidth={2} />
        </button>
        <span style={{ fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1 }}>
          {mode === 'edit' ? 'Редактировать' : 'Новое правило'}
        </span>
        <button
          onClick={valid ? onSave : undefined}
          disabled={!valid}
          style={{
            height: 40, padding: '0 12px', borderRadius: 10,
            border: 'none', background: 'transparent',
            fontFamily: F.inter, fontSize: 14, fontWeight: 600,
            color: valid ? t.blue : t.textDisabled,
            cursor: valid ? 'pointer' : 'not-allowed',
          }}
        >
          Сохранить
        </button>
      </div>

      {/* Scrollable form */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '4px 16px calc(24px + env(safe-area-inset-bottom))',
      }}>
        {/* СОБЫТИЕ */}
        <MobileSectionHeader text="Событие" t={t} />
        <div style={{
          background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
          overflow: 'hidden',
        }}>
          <div
            onClick={() => setTriggerOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderBottom: `1px solid ${t.border}`,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontFamily: F.inter, fontSize: 15, color: t.text1 }}>Триггер</span>
            <span style={{
              flex: 1, textAlign: 'right',
              fontFamily: F.inter, fontSize: 14,
              color: form.trigger ? t.text2 : t.text4,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {form.trigger || 'Не выбран'}
            </span>
            <ChevronRight size={18} color={t.textDisabled} strokeWidth={1.75} />
          </div>
          <div style={{ padding: '16px' }}>
            <MobileInput
              label="Название правила"
              value={form.name}
              onChange={v => setForm(p => ({ ...p, name: v }))}
              placeholder="KPI этап выполнен"
              t={t}
            />
          </div>
          <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${t.border}`, paddingTop: 16 }}>
            <MobileTextarea
              label="Текст уведомления"
              value={form.template}
              onChange={v => setForm(p => ({ ...p, template: v }))}
              placeholder="Введите текст уведомления..."
              hint={<>Доступные переменные: <span style={{ fontFamily: F.mono, color: t.text2 }}>{'{seller_name}, {card_number}, {kpi_step}, {amount}, {org_name}'}</span></>}
              t={t}
            />
          </div>
        </div>

        {/* КАНАЛЫ */}
        <MobileSectionHeader text="Каналы доставки" t={t} />
        <div style={{
          background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
          overflow: 'hidden',
        }}>
          <MobileCheckboxRow label="In-app" checked={true} disabled hint="Всегда включено" t={t} />
          <MobileCheckboxRow
            label="Push-уведомление"
            checked={form.channels.push}
            onChange={v => setForm(p => ({ ...p, channels: { ...p.channels, push: v } }))}
            t={t}
          />
          <MobileCheckboxRow
            label="Email"
            checked={form.channels.email}
            onChange={v => setForm(p => ({ ...p, channels: { ...p.channels, email: v } }))}
            t={t}
          />
          <MobileCheckboxRow
            label="SMS"
            checked={form.channels.sms}
            onChange={v => setForm(p => ({ ...p, channels: { ...p.channels, sms: v } }))}
            isLast
            hint={form.channels.sms ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: t.warning }}>
                <AlertTriangle size={12} strokeWidth={1.75} />
                Тарифицируется: ~50 UZS за сообщение
              </span>
            ) : undefined}
            t={t}
          />
        </div>

        {/* ПОЛУЧАТЕЛИ */}
        <MobileSectionHeader text="Получатели" t={t} />
        <div style={{
          background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
          overflow: 'hidden',
        }}>
          <MobileCheckboxRow
            label="Продавец"
            checked={form.recipients.seller}
            onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, seller: v } }))}
            t={t}
          />
          <MobileCheckboxRow
            label="Менеджер организации"
            checked={form.recipients.orgMgr}
            onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, orgMgr: v } }))}
            t={t}
          />
          <MobileCheckboxRow
            label="Банк-администратор"
            checked={form.recipients.bankAdmin}
            onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, bankAdmin: v } }))}
            t={t}
          />
          <MobileCheckboxRow
            label="Все пользователи"
            checked={form.recipients.allUsers}
            onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, allUsers: v } }))}
            isLast
            t={t}
          />
        </div>

        {/* РАСПИСАНИЕ */}
        <MobileSectionHeader text="Расписание" t={t} />
        <div style={{
          background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
          overflow: 'hidden',
        }}>
          <MobileRadioRow
            label="Мгновенно"
            sub="Отправлять сразу при событии"
            selected={form.schedule === 'instant'}
            onSelect={() => setForm(p => ({ ...p, schedule: 'instant' }))}
            t={t}
          />
          <MobileRadioRow
            label="Дайджест"
            sub="Собирать и отправлять пакетом"
            selected={form.schedule === 'digest'}
            onSelect={() => setForm(p => ({ ...p, schedule: 'digest' }))}
            isLast
            t={t}
          />
          {form.schedule === 'digest' && (
            <div
              onClick={() => setDigestOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                borderTop: `1px solid ${t.border}`,
                background: dark ? 'rgba(59,130,246,0.04)' : '#F9FAFB',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>Частота</span>
              <span style={{ flex: 1, textAlign: 'right', fontFamily: F.inter, fontSize: 14, color: t.text1 }}>
                {form.digestFreq}
              </span>
              <ChevronRight size={18} color={t.textDisabled} strokeWidth={1.75} />
            </div>
          )}
        </div>

        {/* АКТИВНО */}
        <MobileSectionHeader text="Активно" t={t} />
        <div style={{
          background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
          overflow: 'hidden',
        }}>
          <MobileToggleRow
            label="Правило активно"
            sub={form.enabled ? 'Уведомления отправляются' : 'Правило создано, но неактивно'}
            checked={form.enabled}
            onChange={() => setForm(p => ({ ...p, enabled: !p.enabled }))}
            t={t}
            dark={dark}
          />
        </div>

        <div style={{ height: 24 }} />
      </div>

      {/* Sticky save footer */}
      <div style={{
        flexShrink: 0,
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
        background: t.surface, borderTop: `1px solid ${t.border}`,
      }}>
        <button
          onClick={valid ? onSave : undefined}
          disabled={!valid}
          style={{
            width: '100%', height: 52, borderRadius: 12,
            border: 'none',
            background: valid ? t.blue : (dark ? '#3A3F50' : '#D1D5DB'),
            fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: '#FFFFFF',
            cursor: valid ? 'pointer' : 'not-allowed',
          }}
        >
          {mode === 'edit' ? 'Сохранить изменения' : 'Создать правило'}
        </button>
      </div>

      {/* Trigger sheet */}
      <MobileTriggerSheet
        open={triggerOpen}
        onClose={() => setTriggerOpen(false)}
        value={form.trigger}
        onPick={tr => setForm(prev => ({
          ...prev,
          trigger: tr,
          name: prev.name.trim() === '' || prev.name === prev.trigger ? tr : prev.name,
        }))}
        t={t} dark={dark}
      />

      {/* Digest sheet */}
      <MobileDigestSheet
        open={digestOpen}
        onClose={() => setDigestOpen(false)}
        value={form.digestFreq}
        onPick={v => setForm(p => ({ ...p, digestFreq: v }))}
        t={t} dark={dark}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function NotificationRuleEditorPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const mobile = useIsMobile();
  const t = theme(darkMode);
  const dark = darkMode;
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

  const pickTrigger = (tr: string) => setForm(prev => ({
    ...prev,
    trigger: tr,
    name: prev.name.trim() === '' || prev.name === prev.trigger ? tr : prev.name,
  }));

  const goList = () => navigate('/notification-rules');

  if (mobile) {
    return (
      <MobileRuleEditor
        mode={mode}
        form={form}
        setForm={setForm}
        onSave={() => valid && goList()}
        goList={goList}
        t={t}
        dark={dark}
      />
    );
  }

  const cardStyle: React.CSSProperties = {
    background: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: '12px',
    padding: '24px',
  };

  const crumbLink: React.CSSProperties = {
    fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer',
  };

  const summaryBg = dark ? D.tableAlt : '#F9FAFB';

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
            <span onClick={goList} style={crumbLink}>Правила уведомлений</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
              {mode === 'edit' ? 'Редактировать правило' : 'Новое правило'}
            </span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
              {mode === 'edit' ? 'Редактировать правило' : 'Новое правило уведомления'}
            </h1>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '6px' }}>
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
            <FormSection title="Событие" t={t}>
              <FieldLabel required t={t}>Триггер события</FieldLabel>
              <TriggerSelect value={form.trigger} onChange={pickTrigger} t={t} dark={dark} />

              <FieldLabel required style={{ marginTop: '14px' }} t={t}>Название правила</FieldLabel>
              <TextInput
                value={form.name}
                placeholder="KPI этап выполнен"
                onChange={v => setForm(p => ({ ...p, name: v }))}
                t={t}
              />

              <FieldLabel style={{ marginTop: '14px' }} t={t}>Текст уведомления</FieldLabel>
              <TemplateField
                value={form.template}
                onChange={v => setForm(p => ({ ...p, template: v }))}
                t={t}
                dark={dark}
              />
              <Caption t={t}>Нажмите на переменную, чтобы вставить её в текст. При отправке они заменятся реальными данными.</Caption>
            </FormSection>

            <Divider t={t} />

            {/* § Каналы */}
            <FormSection title="Каналы доставки" t={t}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 20px' }}>
                <CheckboxRow label="In-app" checked disabled t={t} />
                <CheckboxRow
                  label="Push-уведомление"
                  checked={form.channels.push}
                  onChange={v => setForm(p => ({ ...p, channels: { ...p.channels, push: v } }))}
                  t={t}
                />
                <CheckboxRow
                  label="Email"
                  checked={form.channels.email}
                  onChange={v => setForm(p => ({ ...p, channels: { ...p.channels, email: v } }))}
                  t={t}
                />
                <CheckboxRow
                  label="SMS"
                  checked={form.channels.sms}
                  onChange={v => setForm(p => ({ ...p, channels: { ...p.channels, sms: v } }))}
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
                  SMS тарифицируется отдельно: ~50 UZS за сообщение
                </div>
              )}
            </FormSection>

            <Divider t={t} />

            {/* § Получатели */}
            <FormSection title="Получатели" t={t}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <CheckboxRow
                  label="Продавец (связанный с событием)"
                  checked={form.recipients.seller}
                  onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, seller: v } }))}
                  t={t}
                />
                <CheckboxRow
                  label="Менеджер организации"
                  checked={form.recipients.orgMgr}
                  onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, orgMgr: v } }))}
                  t={t}
                />
                <CheckboxRow
                  label="Банк-администратор"
                  checked={form.recipients.bankAdmin}
                  onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, bankAdmin: v } }))}
                  t={t}
                />
                <CheckboxRow
                  label="Все пользователи"
                  checked={form.recipients.allUsers}
                  onChange={v => setForm(p => ({ ...p, recipients: { ...p.recipients, allUsers: v } }))}
                  t={t}
                />
              </div>

              {showAdvanceDays && (
                <div style={{ marginTop: '16px' }}>
                  <FieldLabel t={t}>Отправить за ... дней до истечения</FieldLabel>
                  <AdvanceDaysChips
                    days={form.advanceDays}
                    onChange={days => setForm(p => ({ ...p, advanceDays: days }))}
                    t={t}
                    dark={dark}
                  />
                </div>
              )}
            </FormSection>

            <Divider t={t} />

            {/* § Расписание */}
            <FormSection title="Расписание" t={t}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'stretch' }}>
                <RadioRow
                  label="Мгновенно"
                  sub="Отправлять сразу при событии"
                  checked={form.schedule === 'instant'}
                  onSelect={() => setForm(p => ({ ...p, schedule: 'instant' }))}
                  t={t}
                />
                <RadioRow
                  label="Дайджест"
                  sub="Собирать и отправлять пакетом"
                  checked={form.schedule === 'digest'}
                  onSelect={() => setForm(p => ({ ...p, schedule: 'digest' }))}
                  t={t}
                >
                  {form.schedule === 'digest' && (
                    <div style={{ marginTop: '10px' }}>
                      <DigestSelect
                        value={form.digestFreq}
                        onChange={v => setForm(p => ({ ...p, digestFreq: v }))}
                        t={t}
                        dark={dark}
                      />
                    </div>
                  )}
                </RadioRow>
              </div>
            </FormSection>

            <Divider t={t} />

            {/* Active switch */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '12px',
            }}>
              <div>
                <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1 }}>
                  Правило активно
                </div>
                <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, marginTop: '2px' }}>
                  {form.enabled ? 'Уведомления отправляются' : 'Правило создано, но уведомления не отправляются'}
                </div>
              </div>
              <Switch
                checked={form.enabled}
                onChange={() => setForm(p => ({ ...p, enabled: !p.enabled }))}
                ariaLabel="Правило активно"
                t={t}
                dark={dark}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: '8px',
            marginTop: '20px',
          }}>
            <OutlineButton onClick={goList} t={t}>Отмена</OutlineButton>
            <PrimaryButton disabled={!valid} onClick={() => valid && goList()} t={t} dark={dark}>
              Сохранить правило
            </PrimaryButton>
          </div>
          </div>
          {/* /left column */}

          {/* Right column — preview + summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '20px' }}>
            <div style={cardStyle}>
              <SectionTitle t={t}>Предпросмотр</SectionTitle>
              <PreviewCard form={form} t={t} />
              <div style={{ height: '1px', background: t.border, margin: '14px 0' }} />
              <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
                Предпросмотр с образцовыми данными. Переменные будут заменены реальными значениями при отправке.
              </div>
            </div>

            <SummaryCard form={form} t={t} summaryBg={summaryBg} />
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

function PreviewCard({ form, t }: { form: FormState; t: T }) {
  const placeholderTitle = !form.name.trim();
  const placeholderBody  = !form.template.trim();
  const title = form.name.trim() || 'Название правила';
  const body  = renderTemplate(form.template.trim()) || 'Текст уведомления появится здесь…';

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
      padding: '12px',
      border: `1px solid ${t.border}`, borderRadius: '8px', background: t.surface,
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
          color: placeholderTitle ? t.text4 : t.text1, lineHeight: 1.3,
        }}>
          🔔 {title}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '13px',
          color: placeholderBody ? t.text4 : t.text2,
          marginTop: '4px', lineHeight: 1.5, whiteSpace: 'pre-wrap',
          display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 4,
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {body}
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, marginTop: '6px' }}>
          Только что
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ form, t, summaryBg }: { form: FormState; t: T; summaryBg: string }) {
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
      background: summaryBg,
      border: `1px solid ${t.border}`,
      borderRadius: '8px', padding: '14px',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      <SummaryRow label="Событие"  value={form.trigger || '—'} emphasize={!!form.trigger} t={t} />
      <SummaryRow label="Каналы"   value={channels.join(', ')} t={t} />
      <SummaryRow
        label="Получатели"
        value={recipients.length ? recipients.join(', ') : '—'}
        dim={recipients.length === 0}
        t={t}
      />
      {advance && <SummaryRow label="Напомнить за" value={advance} t={t} />}
      <SummaryRow label="Расписание" value={schedule} t={t} />
      <SummaryRow
        label="Статус"
        value={form.enabled ? 'Активно' : 'Неактивно'}
        tone={form.enabled ? 'success' : 'muted'}
        t={t}
      />
    </div>
  );
}

function SummaryRow({ label, value, emphasize, dim, tone, t }: {
  label: string; value: string;
  emphasize?: boolean; dim?: boolean;
  tone?: 'success' | 'muted';
  t: T;
}) {
  const color = tone === 'success' ? t.success
              : tone === 'muted'   ? t.text4
              : dim                ? t.text4
              : emphasize          ? t.text1
              : t.text1;
  const weight = emphasize || tone === 'success' ? 500 : 400;
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <span style={{
        fontFamily: F.inter, fontSize: '12px', color: t.text3,
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

function FormSection({ title, children, t }: { title: string; children: React.ReactNode; t: T }) {
  return (
    <div>
      <h3 style={{
        margin: '0 0 12px', fontFamily: F.dm, fontSize: '13px', fontWeight: 600,
        color: t.text1, textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        {title}
      </h3>
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

/* ═══════════════════════════════════════════════════════════════════════════
   TEMPLATE FIELD (textarea + variable chips)
═══════════════════════════════════════════════════════════════════════════ */

const TEMPLATE_VARIABLES = [
  'seller_name', 'card_number', 'kpi_step', 'amount', 'org_name',
] as const;

function TemplateField({ value, onChange, t, dark }: {
  value: string; onChange: (v: string) => void; t: T; dark: boolean;
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
          border: `1px solid ${focus ? t.blue : t.inputBorder}`,
          borderRadius: '8px', outline: 'none', resize: 'vertical',
          fontFamily: F.inter, fontSize: '13px', color: t.text1,
          background: t.surface, boxSizing: 'border-box',
          transition: 'border-color 0.12s', minHeight: '76px', lineHeight: 1.5,
        }}
      />

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center',
        marginTop: '8px',
      }}>
        <span style={{
          fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
          color: t.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
          marginRight: '2px',
        }}>
          Переменные
        </span>
        {TEMPLATE_VARIABLES.map(v => (
          <VariableChip key={v} name={v} onInsert={() => insertToken(v)} t={t} dark={dark} />
        ))}
      </div>
    </div>
  );
}

function VariableChip({ name, onInsert, t }: { name: string; onInsert: () => void; t: T; dark: boolean }) {
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
        border: `1px solid ${hov ? t.blue : t.border}`,
        borderRadius: '6px',
        background: hov ? t.blueLt : t.surface,
        color: hov ? t.blue : t.text2,
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

function TriggerSelect({ value, onChange, t, dark }: { value: string; onChange: (v: string) => void; t: T; dark: boolean }) {
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
          border: `1px solid ${open ? t.blue : t.inputBorder}`,
          borderRadius: '8px', background: t.surface,
          fontFamily: F.inter, fontSize: '14px',
          color: value ? t.text1 : t.text4,
          cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'border-color 0.12s',
        }}
      >
        <span>{value || 'Выберите событие'}</span>
        <ChevronDown size={16} color={t.text3} strokeWidth={1.75} />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '300px',
            maxHeight: '320px', overflowY: 'auto',
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '8px',
            boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 8px 24px rgba(17,24,39,0.12)',
            padding: '4px 0',
          }}
        >
          {TRIGGER_GROUPS.map((g, gi) => (
            <div key={g.group}>
              {gi > 0 && <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />}
              <div style={{
                padding: '8px 12px 4px',
                fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {g.group}
              </div>
              {g.triggers.map(tr => (
                <OptionRow
                  key={tr}
                  label={tr}
                  selected={value === tr}
                  onClick={() => { onChange(tr); close(); }}
                  t={t}
                  dark={dark}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DigestSelect({ value, onChange, t, dark }: { value: string; onChange: (v: string) => void; t: T; dark: boolean }) {
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
          border: `1px solid ${open ? t.blue : t.inputBorder}`,
          borderRadius: '8px', background: t.surface,
          fontFamily: F.inter, fontSize: '13px', color: t.text1,
          cursor: 'pointer', textAlign: 'left',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {value}
        <ChevronDown size={14} color={t.text3} strokeWidth={1.75} />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '240px',
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '8px',
            boxShadow: dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 8px 24px rgba(17,24,39,0.12)',
            padding: '4px 0',
          }}
        >
          {options.map(o => (
            <OptionRow key={o} label={o} selected={value === o} onClick={() => { onChange(o); close(); }} t={t} dark={dark} />
          ))}
        </div>
      )}
    </div>
  );
}

function OptionRow({ label, selected, onClick, t, dark }: {
  label: string; selected: boolean; onClick: () => void; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const hoverBg = dark ? D.tableHover : '#F9FAFB';
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', border: 'none',
        background: selected ? t.blueLt : hov ? hoverBg : 'transparent',
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
   CHECKBOX / RADIO / SWITCH
═══════════════════════════════════════════════════════════════════════════ */

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

function Switch({ checked, onChange, ariaLabel, t, dark }: {
  checked: boolean; onChange: () => void; ariaLabel: string; t: T; dark: boolean;
}) {
  const offBg = dark ? D.inputBorder : '#D1D5DB';
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      style={{
        width: '44px', height: '24px', borderRadius: '12px',
        background: checked ? t.blue : offBg,
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        background: t.surface, position: 'absolute', top: '3px',
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

function AdvanceDaysChips({ days, onChange, t, dark }: {
  days: number[]; onChange: (days: number[]) => void; t: T; dark: boolean;
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

  const removeBtnBg = dark ? 'rgba(59,130,246,0.22)' : 'rgba(37,99,235,0.15)';

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      {days.map(d => (
        <span
          key={d}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '4px 6px 4px 10px', borderRadius: '16px',
            background: t.blueLt, color: t.blue,
            fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
          }}
        >
          {d === 1 ? '1 день' : d < 5 ? `${d} дня` : `${d} дней`}
          <button
            onClick={() => onChange(days.filter(x => x !== d))}
            aria-label={`Убрать ${d}`}
            style={{
              width: '16px', height: '16px', border: 'none', borderRadius: '50%',
              background: removeBtnBg, color: t.blue,
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
            border: `1px solid ${t.blue}`, borderRadius: '16px',
            fontFamily: F.inter, fontSize: '12px', outline: 'none',
            background: t.surface, color: t.text1,
          }}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            padding: '4px 10px', border: 'none', borderRadius: '16px',
            background: 'transparent', color: t.blue,
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

function PrimaryButton({ children, onClick, disabled, t, dark }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const disabledBg = dark ? 'rgba(59,130,246,0.35)' : '#93C5FD';
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
        boxShadow: disabled ? 'none' : dark ? 'none' : (hov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)'),
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {children}
    </button>
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
