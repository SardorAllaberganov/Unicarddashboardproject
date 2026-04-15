import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2, Clock, XCircle, Trophy, Wallet, ArrowDown,
  CreditCard, Upload, Users, AlertTriangle, ShieldAlert, Calendar,
  Plus, MoreVertical, Pencil, Copy, Trash2, ChevronRight,
  X, Check, ChevronDown, Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { usePopoverPosition } from '../components/usePopoverPosition';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & DATA
═══════════════════════════════════════════════════════════════════════════ */

export type RuleTab = 'kpi' | 'finance' | 'cards' | 'system';
export type IconTone = 'green' | 'amber' | 'red' | 'blue' | 'gray';
export type Channel = 'Push' | 'In-app' | 'Email' | 'SMS';

export interface Rule {
  id: string;
  tab: RuleTab;
  icon: React.ElementType;
  iconTone: IconTone;
  title: string;
  description: string;
  channels: Channel[];
  recipients: string[];
  timing?: string;
  configLabel?: string;
  enabled: boolean;
}

export const INITIAL_RULES: Rule[] = [
  // KPI события
  { id: 'kpi-1', tab: 'kpi', icon: CheckCircle2, iconTone: 'green',
    title: 'KPI этап выполнен',
    description: 'Уведомление при выполнении любого KPI этапа клиентом',
    channels: ['Push', 'In-app'],
    recipients: ['Продавец', 'Менеджер орг.'],
    timing: 'Мгновенно', enabled: true },
  { id: 'kpi-2', tab: 'kpi', icon: Clock, iconTone: 'amber',
    title: 'KPI срок истекает',
    description: 'Предупреждение за N дней до истечения срока KPI',
    channels: ['Push', 'In-app'],
    recipients: ['Продавец', 'Менеджер орг.'],
    timing: 'За 7 дней, за 3 дня, за 1 день',
    configLabel: 'Настроить дни', enabled: true },
  { id: 'kpi-3', tab: 'kpi', icon: XCircle, iconTone: 'red',
    title: 'KPI просрочен',
    description: 'Уведомление при истечении срока KPI без выполнения',
    channels: ['In-app', 'Email'],
    recipients: ['Продавец', 'Менеджер орг.', 'Банк-админ'],
    timing: 'Мгновенно + ежедневный дайджест', enabled: true },
  { id: 'kpi-4', tab: 'kpi', icon: Trophy, iconTone: 'green',
    title: 'Все 3 KPI выполнены',
    description: 'Уведомление о полном завершении KPI цикла по карте',
    channels: ['Push', 'In-app', 'SMS'],
    recipients: ['Продавец', 'Менеджер орг.'],
    timing: 'Мгновенно', enabled: true },

  // Финансы
  { id: 'fin-1', tab: 'finance', icon: Wallet, iconTone: 'amber',
    title: 'Вознаграждение начислено',
    description: 'Уведомление продавцу о начислении KPI вознаграждения',
    channels: ['Push', 'In-app'],
    recipients: ['Продавец'], enabled: true },
  { id: 'fin-2', tab: 'finance', icon: ArrowDown, iconTone: 'amber',
    title: 'Запрос на вывод создан',
    description: 'Уведомление менеджеру о новом запросе на вывод средств',
    channels: ['In-app', 'Email'],
    recipients: ['Менеджер орг.', 'Банк-админ'], enabled: true },
  { id: 'fin-3', tab: 'finance', icon: CheckCircle2, iconTone: 'green',
    title: 'Вывод выполнен',
    description: 'Уведомление продавцу об успешном выводе средств',
    channels: ['Push', 'SMS'],
    recipients: ['Продавец'], enabled: true },
  { id: 'fin-4', tab: 'finance', icon: XCircle, iconTone: 'red',
    title: 'Вывод отклонён',
    description: 'Уведомление продавцу об отклонении запроса на вывод',
    channels: ['Push', 'In-app'],
    recipients: ['Продавец'], enabled: false },

  // Карты и продажи
  { id: 'crd-1', tab: 'cards', icon: CreditCard, iconTone: 'blue',
    title: 'Карта продана',
    description: 'Уведомление при фиксации продажи карты продавцом',
    channels: ['In-app'],
    recipients: ['Менеджер орг.'], enabled: true },
  { id: 'crd-2', tab: 'cards', icon: Upload, iconTone: 'blue',
    title: 'Импорт карт завершён',
    description: 'Уведомление об успешном импорте карт в партию',
    channels: ['In-app'],
    recipients: ['Банк-админ'], enabled: true },
  { id: 'crd-3', tab: 'cards', icon: Users, iconTone: 'gray',
    title: 'Назначение карт продавцу',
    description: 'Уведомление продавцу о назначении новых карт',
    channels: ['Push', 'In-app'],
    recipients: ['Продавец'], enabled: false },

  // Система
  { id: 'sys-1', tab: 'system', icon: AlertTriangle, iconTone: 'red',
    title: 'Ошибка системы',
    description: 'Критические ошибки интеграций (Unired, процессинг, UCOIN)',
    channels: ['In-app', 'Email'],
    recipients: ['Банк-админ'], enabled: true },
  { id: 'sys-2', tab: 'system', icon: ShieldAlert, iconTone: 'amber',
    title: 'Вход с нового устройства',
    description: 'Уведомление пользователю при входе с незнакомого устройства',
    channels: ['Push', 'SMS'],
    recipients: ['Все пользователи'], enabled: true },
  { id: 'sys-3', tab: 'system', icon: Calendar, iconTone: 'gray',
    title: 'Ежедневная сводка',
    description: 'Ежедневный email-дайджест: продажи, KPI, финансы за день',
    channels: ['Email'],
    recipients: ['Банк-админ', 'Менеджер орг.'], enabled: false },
];

const TABS: { key: RuleTab; label: string }[] = [
  { key: 'kpi',     label: 'KPI события' },
  { key: 'finance', label: 'Финансы' },
  { key: 'cards',   label: 'Карты и продажи' },
  { key: 'system',  label: 'Система' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ICON CIRCLE
═══════════════════════════════════════════════════════════════════════════ */

const TONE_COLOR: Record<IconTone, { fg: string; bg: string }> = {
  green: { fg: C.success, bg: C.successBg },
  amber: { fg: C.warning, bg: C.warningBg },
  red:   { fg: C.error,   bg: C.errorBg },
  blue:  { fg: C.blue,    bg: C.blueLt },
  gray:  { fg: C.text4,   bg: '#F3F4F6' },
};

function IconCircle({ Icon, tone, enabled }: { Icon: React.ElementType; tone: IconTone; enabled: boolean }) {
  const { fg, bg } = TONE_COLOR[tone];
  return (
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      background: enabled ? bg : '#F3F4F6',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={18} color={enabled ? fg : C.text4} strokeWidth={1.75} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

function ChannelBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 9px', borderRadius: '6px',
      background: active ? C.blueLt : '#F3F4F6',
      color: active ? C.blue : C.text3,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function RecipientBadge({ label }: { label: string }) {
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 9px', borderRadius: '6px',
      background: '#F3F4F6', color: C.text2,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SWITCH
═══════════════════════════════════════════════════════════════════════════ */

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
   ACTION MENU
═══════════════════════════════════════════════════════════════════════════ */

function RuleActionMenu({ onDetail, onEdit, onDuplicate, onDelete }: {
  onDetail: () => void; onEdit: () => void; onDuplicate: () => void; onDelete: () => void;
}) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } = usePopoverPosition();
  const [hov, setHov] = useState<string | null>(null);

  const item = (label: string, Icon: React.ElementType, onClick: () => void, destructive = false) => (
    <button
      onMouseEnter={() => setHov(label)}
      onMouseLeave={() => setHov(null)}
      onClick={() => { close(); onClick(); }}
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
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        ref={triggerRef as React.Ref<HTMLButtonElement>}
        onClick={toggle}
        aria-label="Действия с правилом"
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
            overflow: 'hidden',
          }}
        >
          {item('Подробнее', Eye, onDetail)}
          {item('Редактировать', Pencil, onEdit)}
          {item('Дублировать', Copy, onDuplicate)}
          <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
          {item('Удалить', Trash2, onDelete, true)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RULE CARD
═══════════════════════════════════════════════════════════════════════════ */

function RuleCard({ rule, onToggle, onDetail, onEdit, onDuplicate, onDelete, onConfigure }: {
  rule: Rule;
  onToggle: () => void;
  onDetail: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onConfigure?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onDetail}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.surface,
        border: `1px solid ${hov ? C.text4 : C.border}`,
        borderRadius: '12px',
        padding: '16px',
        display: 'flex', alignItems: 'flex-start', gap: '14px',
        opacity: rule.enabled ? 1 : 0.65,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <IconCircle Icon={rule.icon} tone={rule.iconTone} enabled={rule.enabled} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
          color: C.text1, lineHeight: 1.3,
        }}>
          {rule.title}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', color: C.text3,
          marginTop: '4px', lineHeight: 1.45,
        }}>
          {rule.description}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Каналы
            </span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {rule.channels.map(c => <ChannelBadge key={c} label={c} active={rule.enabled} />)}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Получатели
            </span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {rule.recipients.map(r => <RecipientBadge key={r} label={r} />)}
            </div>
          </div>
        </div>

        {(rule.timing || rule.configLabel) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            marginTop: '10px', flexWrap: 'wrap',
          }}>
            {rule.timing && (
              <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
                {rule.timing}
              </span>
            )}
            {rule.configLabel && (
              <button
                onClick={e => { e.stopPropagation(); onConfigure?.(); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '4px 0', border: 'none', background: 'transparent',
                  fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                  color: C.blue, cursor: 'pointer',
                }}
              >
                {rule.configLabel}
                <ChevronRight size={13} strokeWidth={1.75} />
              </button>
            )}
          </div>
        )}
      </div>

      <div
        onClick={e => e.stopPropagation()}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}
      >
        <Switch checked={rule.enabled} onChange={onToggle} ariaLabel={`Переключить правило "${rule.title}"`} />
        <RuleActionMenu
          onDetail={onDetail}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABS BAR
═══════════════════════════════════════════════════════════════════════════ */

function TabsBar({ active, onChange }: { active: RuleTab; onChange: (k: RuleTab) => void }) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex', alignItems: 'center', gap: '0',
        borderBottom: `1px solid ${C.border}`, marginBottom: '20px',
      }}
    >
      {TABS.map(t => {
        const isActive = active === t.key;
        return <TabButton key={t.key} active={isActive} label={t.label} onClick={() => onChange(t.key)} />;
      })}
    </div>
  );
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      role="tab"
      aria-selected={active}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        background: 'none', border: 'none',
        padding: '12px 16px',
        fontFamily: F.inter, fontSize: '14px',
        fontWeight: active ? 600 : 500,
        color: active ? C.blue : hov ? C.text1 : C.text3,
        borderBottom: `2px solid ${active ? C.blue : 'transparent'}`,
        marginBottom: '-1px',
        cursor: 'pointer', transition: 'color 0.12s',
      }}
    >
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RULE EDITOR MODAL
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

function RuleEditorModal({
  open, mode, initialRule, onClose, onSave,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  initialRule: Rule | null;
  onClose: () => void;
  onSave: (form: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initialRule ? ruleToForm(initialRule) : EMPTY_FORM);
  }, [open, initialRule]);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;

  const valid = form.trigger.trim() !== '' && form.name.trim() !== '';
  const showAdvanceDays = form.trigger === 'KPI срок истекает';

  const pickTrigger = (t: string) => setForm(prev => ({
    ...prev,
    trigger: t,
    name: prev.name.trim() === '' || prev.name === prev.trigger ? t : prev.name,
  }));

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
          width: '100%', maxWidth: '600px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
        }}>
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            {mode === 'edit' ? 'Редактировать правило' : 'Новое правило уведомления'}
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
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {/* Section 1 — Событие */}
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

          {/* Section 2 — Каналы */}
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

          {/* Section 3 — Получатели */}
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

          {/* Section 4 — Расписание */}
          <FormSection title="Расписание">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          padding: '16px 20px', borderTop: `1px solid ${C.border}`, flexShrink: 0,
        }}>
          <OutlineButton onClick={onClose}>Отмена</OutlineButton>
          <PrimaryButton onClick={() => valid && onSave(form)} disabled={!valid}>
            Сохранить правило
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FORM PRIMITIVES (modal-scoped)
═══════════════════════════════════════════════════════════════════════════ */

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
  return <div style={{ height: '1px', background: C.border }} />;
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

function TextArea({ value, placeholder, onChange }: {
  value: string; placeholder?: string; onChange: (v: string) => void;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      value={value}
      placeholder={placeholder}
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
  );
}

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
                <TriggerOption
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

function TriggerOption({ label, selected, onClick }: {
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
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
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
          {children}
        </div>
      </div>
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
            <TriggerOption key={o} label={o} selected={value === o} onClick={() => { onChange(o); close(); }} />
          ))}
        </div>
      )}
    </div>
  );
}

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
   DELETE RULE MODAL
═══════════════════════════════════════════════════════════════════════════ */

function DeleteRuleModal({ rule, onClose, onConfirm }: {
  rule: Rule | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!rule) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [rule, onClose]);

  if (!rule) return null;

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
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
        }}>
          <Trash2 size={20} color={C.error} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Удалить правило
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
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          {/* Rule info card */}
          <div style={{
            background: C.errorBg,
            borderTop: `1px solid ${C.border}`,
            borderRight: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.error}`,
            borderRadius: '8px', padding: '12px',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div>
              <div style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: C.text1,
              }}>
                {rule.title}
              </div>
              <div style={{
                fontFamily: F.inter, fontSize: '12px', color: C.text3,
                marginTop: '3px', lineHeight: 1.45,
              }}>
                {rule.description}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  fontFamily: F.inter, fontSize: '10px', fontWeight: 600,
                  color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  Каналы
                </span>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {rule.channels.map(c => (
                    <span key={c} style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 7px', borderRadius: '5px',
                      background: C.blueLt, color: C.blue,
                    }}>{c}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  fontFamily: F.inter, fontSize: '10px', fontWeight: 600,
                  color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  Получатели
                </span>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {rule.recipients.map(r => (
                    <span key={r} style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 7px', borderRadius: '5px',
                      background: '#F3F4F6', color: C.text2,
                    }}>{r}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              fontFamily: F.inter, fontSize: '11px', color: C.text3,
            }}>
              Последний раз сработало: <span style={{ fontFamily: F.mono, color: C.text2 }}>12.04.2026</span> (23 уведомления)
            </div>
          </div>

          {/* Warning copy */}
          <p style={{
            margin: 0, fontFamily: F.inter, fontSize: '14px',
            color: C.text1, lineHeight: 1.5,
          }}>
            Это действие нельзя отменить. Правило будет удалено навсегда.
          </p>

          {/* Consequences list */}
          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: C.text3, marginBottom: '6px',
            }}>
              При удалении:
            </div>
            <ul style={{
              margin: 0, padding: '0 0 0 18px',
              fontFamily: F.inter, fontSize: '12px', color: C.text2, lineHeight: 1.6,
            }}>
              <li>Автоматические уведомления по этому триггеру прекратятся</li>
              <li>Ранее отправленные уведомления сохранятся в логе</li>
              <li>Получатели не будут уведомлены об отключении</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '16px 20px', borderTop: `1px solid ${C.border}`, flexShrink: 0,
        }}>
          <OutlineButton onClick={onClose}>Отмена</OutlineButton>
          <DestructiveButton onClick={onConfirm} icon={Trash2}>Удалить правило</DestructiveButton>
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
   DUPLICATE RULE MODAL
═══════════════════════════════════════════════════════════════════════════ */

function DuplicateRuleModal({ rule, onClose, onConfirm }: {
  rule: Rule | null;
  onClose: () => void;
  onConfirm: (title: string, inactive: boolean) => void;
}) {
  const [title, setTitle] = useState('');
  const [inactive, setInactive] = useState(true);
  const [closeHov, setCloseHov] = useState(false);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (!rule) return;
    setTitle(`${rule.title} (копия)`);
    setInactive(true);
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [rule, onClose]);

  if (!rule) return null;

  const valid = title.trim() !== '';
  const sourceSummary = `${rule.channels.join(' + ')} → ${rule.recipients.join(', ')}`;

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
          width: '100%', maxWidth: '480px',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: '12px', boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '18px 20px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
        }}>
          <Copy size={20} color={C.blue} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1,
          }}>
            Дублировать правило
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
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          {/* Source rule card */}
          <div style={{
            background: '#F9FAFB',
            borderRadius: '8px', padding: '12px',
            border: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '10px',
            }}>
              <span style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1,
              }}>
                {rule.title}
              </span>
              <ReadOnlySwitch checked={rule.enabled} />
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
              {sourceSummary}
            </div>
          </div>

          <p style={{ margin: 0, fontFamily: F.inter, fontSize: '14px', color: C.text1 }}>
            Будет создана копия правила:
          </p>

          {/* Title input */}
          <div>
            <label style={{
              display: 'block', marginBottom: '6px',
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text2,
            }}>
              Название нового правила
              <span style={{ color: C.error, marginLeft: '3px' }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              autoFocus
              style={{
                width: '100%', height: '38px', padding: '0 12px',
                border: `1px solid ${focus ? C.blue : C.inputBorder}`,
                borderRadius: '8px', outline: 'none',
                fontFamily: F.inter, fontSize: '14px', color: C.text1,
                background: C.surface, boxSizing: 'border-box',
                transition: 'border-color 0.12s',
              }}
            />
          </div>

          {/* Inactive checkbox */}
          <div>
            <label style={{
              display: 'inline-flex', alignItems: 'flex-start', gap: '8px',
              cursor: 'pointer', userSelect: 'none',
            }}>
              <span
                onClick={() => setInactive(v => !v)}
                style={{
                  width: '18px', height: '18px', borderRadius: '4px',
                  border: `1.5px solid ${inactive ? C.blue : C.inputBorder}`,
                  background: inactive ? C.blue : C.surface,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.12s', flexShrink: 0, marginTop: '1px',
                }}
              >
                {inactive && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </span>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1 }}>
                Создать в неактивном состоянии
              </span>
            </label>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: C.text3,
              marginTop: '4px', marginLeft: '26px',
            }}>
              Вы сможете активировать правило после настройки
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '16px 20px', borderTop: `1px solid ${C.border}`, flexShrink: 0,
        }}>
          <OutlineButton onClick={onClose}>Отмена</OutlineButton>
          <PrimaryButton
            disabled={!valid}
            onClick={() => valid && onConfirm(title.trim(), inactive)}
          >
            Создать копию
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function ReadOnlySwitch({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: '36px', height: '20px', borderRadius: '10px',
        background: checked ? C.blue : '#D1D5DB',
        position: 'relative', flexShrink: 0,
      }}
    >
      <span style={{
        width: '14px', height: '14px', borderRadius: '50%',
        background: C.surface, position: 'absolute', top: '3px',
        left: checked ? '19px' : '3px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DUPLICATE SUCCESS TOAST
═══════════════════════════════════════════════════════════════════════════ */

function DuplicateSuccessToast({ toast, onDismiss, onOpen }: {
  toast: { title: string; inactive: boolean; openRule: Rule } | null;
  onDismiss: () => void;
  onOpen: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(t);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed', top: '24px', right: '24px', zIndex: 200,
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        maxWidth: '420px',
        padding: '14px 16px',
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${C.success}`,
        borderRadius: '10px',
        boxShadow: '0 12px 28px rgba(17,24,39,0.14)',
      }}
    >
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: C.successBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
      }}>
        <CheckCircle2 size={16} color={C.success} strokeWidth={2} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', color: C.text1, lineHeight: 1.5,
        }}>
          Правило продублировано: <span style={{ fontWeight: 500 }}>«{toast.title}»</span>.
          {toast.inactive && ' Правило неактивно.'}
        </div>
        <div style={{ marginTop: '6px' }}>
          <button
            onClick={onOpen}
            style={{
              padding: '2px 0', border: 'none', background: 'transparent',
              fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
              color: C.blue, cursor: 'pointer',
            }}
          >
            Открыть →
          </button>
        </div>
      </div>

      <button
        onClick={onDismiss}
        aria-label="Закрыть"
        style={{
          width: '22px', height: '22px', border: 'none', borderRadius: '6px',
          background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, color: C.text3,
        }}
      >
        <X size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function NotificationRulesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [tab, setTab] = useState<RuleTab>('kpi');
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [deletingRule, setDeletingRule] = useState<Rule | null>(null);
  const [duplicatingRule, setDuplicatingRule] = useState<Rule | null>(null);
  const [toast, setToast] = useState<{ title: string; inactive: boolean; openRule: Rule } | null>(null);
  const navigate = useNavigate();

  const visibleRules = useMemo(() => rules.filter(r => r.tab === tab), [rules, tab]);
  const activeCount = useMemo(() => rules.filter(r => r.enabled).length, [rules]);

  const toggle = (id: string) => setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));

  const openCreate = () => navigate('/notification-rules/new');
  const openEdit = (r: Rule) => navigate(`/notification-rules/${r.id}/edit`, { state: { preFilled: r } });
  const remove = (id: string) => setRules(prev => prev.filter(r => r.id !== id));

  const commitDuplicate = (source: Rule, newTitle: string, startInactive: boolean) => {
    const copy: Rule = {
      ...source,
      id: `${source.id}-copy-${Date.now()}`,
      title: newTitle,
      enabled: !startInactive,
    };
    setRules(prev => [...prev, copy]);
    setDuplicatingRule(null);
    setToast({ title: copy.title, inactive: startInactive, openRule: copy });
  };

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
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Правила уведомлений</span>
          </div>

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
          }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Правила уведомлений
              </h1>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '6px' }}>
                Настройте автоматические уведомления системы
              </div>
            </div>

            <PrimaryButton icon={Plus} onClick={openCreate}>Создать правило</PrimaryButton>
          </div>

          {/* Tabs */}
          <TabsBar active={tab} onChange={setTab} />

          {/* Rule list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {visibleRules.map(r => (
              <RuleCard
                key={r.id}
                rule={r}
                onToggle={() => toggle(r.id)}
                onDetail={() => navigate(`/notification-rules/${r.id}`)}
                onEdit={() => openEdit(r)}
                onDuplicate={() => setDuplicatingRule(r)}
                onDelete={() => setDeletingRule(r)}
                onConfigure={r.configLabel ? () => openEdit(r) : undefined}
              />
            ))}
          </div>

          <DeleteRuleModal
            rule={deletingRule}
            onClose={() => setDeletingRule(null)}
            onConfirm={() => {
              if (deletingRule) remove(deletingRule.id);
              setDeletingRule(null);
            }}
          />

          <DuplicateRuleModal
            rule={duplicatingRule}
            onClose={() => setDuplicatingRule(null)}
            onConfirm={(title, inactive) => {
              if (duplicatingRule) commitDuplicate(duplicatingRule, title, inactive);
            }}
          />

          <DuplicateSuccessToast
            toast={toast}
            onDismiss={() => setToast(null)}
            onOpen={() => {
              if (toast) {
                setToast(null);
                openEdit(toast.openRule);
              }
            }}
          />

          {/* Footer summary */}
          <div style={{
            marginTop: '24px', padding: '16px 18px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '12px', flexWrap: 'wrap',
          }}>
            <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1 }}>
              Активных правил: <span style={{ color: C.blue }}>{activeCount}</span> из {rules.length}
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
              Неактивные правила не отправляют уведомления
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMARY BUTTON
═══════════════════════════════════════════════════════════════════════════ */

function PrimaryButton({ children, icon: Icon, onClick, disabled }: {
  children: React.ReactNode; icon?: React.ElementType; onClick?: () => void; disabled?: boolean;
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
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        boxShadow: disabled ? 'none' : hov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {Icon && <Icon size={15} strokeWidth={2} />}
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
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
