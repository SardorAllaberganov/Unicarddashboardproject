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
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useIsMobile } from '../components/useIsMobile';
import { ChevronLeft } from 'lucide-react';
import { usePopoverPosition } from '../components/usePopoverPosition';

type T = ReturnType<typeof theme>;

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

const TONE_COLOR_LIGHT: Record<IconTone, { fg: string; bg: string }> = {
  green: { fg: C.success, bg: C.successBg },
  amber: { fg: C.warning, bg: C.warningBg },
  red:   { fg: C.error,   bg: C.errorBg },
  blue:  { fg: C.blue,    bg: C.blueLt },
  gray:  { fg: C.text4,   bg: '#F3F4F6' },
};

const TONE_COLOR_DARK: Record<IconTone, { fg: string; bg: string }> = {
  green: { fg: '#34D399', bg: 'rgba(52,211,153,0.12)' },
  amber: { fg: '#FBBF24', bg: 'rgba(251,191,36,0.12)' },
  red:   { fg: '#F87171', bg: 'rgba(248,113,133,0.12)' },
  blue:  { fg: D.blue,    bg: D.blueLt },
  gray:  { fg: D.text4,   bg: D.tableAlt },
};

function IconCircle({ Icon, tone, enabled, t, dark }: {
  Icon: React.ElementType; tone: IconTone; enabled: boolean; t: T; dark: boolean;
}) {
  const { fg, bg } = (dark ? TONE_COLOR_DARK : TONE_COLOR_LIGHT)[tone];
  const disabledBg = dark ? D.tableAlt : '#F3F4F6';

  return (
    <div style={{
      width: '36px', height: '36px', borderRadius: '50%',
      background: enabled ? bg : disabledBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={18} color={enabled ? fg : t.text4} strokeWidth={1.75} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES
═══════════════════════════════════════════════════════════════════════════ */

function ChannelBadge({ label, active, t, dark }: { label: string; active: boolean; t: T; dark: boolean }) {
  const inactiveBg = dark ? D.tableAlt : '#F3F4F6';
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 9px', borderRadius: '6px',
      background: active ? t.blueLt : inactiveBg,
      color: active ? t.blue : t.text3,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function RecipientBadge({ label, t, dark }: { label: string; t: T; dark: boolean }) {
  const bg = dark ? D.tableAlt : '#F3F4F6';
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 9px', borderRadius: '6px',
      background: bg, color: t.text2,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SWITCH
═══════════════════════════════════════════════════════════════════════════ */

function Switch({ checked, onChange, ariaLabel, t, dark }: {
  checked: boolean; onChange: () => void; ariaLabel: string; t: T; dark: boolean;
}) {
  const offTrack = dark ? '#2D3148' : '#D1D5DB';
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      style={{
        width: '44px', height: '24px', borderRadius: '12px',
        background: checked ? t.blue : offTrack,
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%',
        background: '#FFFFFF', position: 'absolute', top: '3px',
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

function RuleActionMenu({ onDetail, onEdit, onDuplicate, onDelete, t, dark }: {
  onDetail: () => void; onEdit: () => void; onDuplicate: () => void; onDelete: () => void; t: T; dark: boolean;
}) {
  const { open, toggle, close, triggerRef, menuRef, rootRef, menuStyle } = usePopoverPosition();
  const [hov, setHov] = useState<string | null>(null);

  const triggerHoverBg = dark ? D.tableHover : '#F3F4F6';
  const destructiveHoverBg = dark ? 'rgba(248,113,113,0.12)' : C.errorBg;
  const safeHoverBg = dark ? D.tableHover : t.blueLt;

  const item = (label: string, Icon: React.ElementType, onClick: () => void, destructive = false) => (
    <button
      onMouseEnter={() => setHov(label)}
      onMouseLeave={() => setHov(null)}
      onClick={() => { close(); onClick(); }}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        width: '100%', padding: '9px 12px',
        background: hov === label ? (destructive ? destructiveHoverBg : safeHoverBg) : 'transparent',
        border: 'none', cursor: 'pointer',
        fontFamily: F.inter, fontSize: '13px',
        color: destructive ? t.error : t.text2, textAlign: 'left',
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
          border: 'none', background: open ? triggerHoverBg : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.12s',
        }}
      >
        <MoreVertical size={16} color={t.text3} />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            minWidth: '180px',
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: '8px',
            boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(17,24,39,0.08)',
            padding: '4px 0',
            overflow: 'hidden',
          }}
        >
          {item('Подробнее', Eye, onDetail)}
          {item('Редактировать', Pencil, onEdit)}
          {item('Дублировать', Copy, onDuplicate)}
          <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />
          {item('Удалить', Trash2, onDelete, true)}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RULE CARD
═══════════════════════════════════════════════════════════════════════════ */

function RuleCard({ rule, onToggle, onDetail, onEdit, onDuplicate, onDelete, onConfigure, t, dark }: {
  rule: Rule;
  onToggle: () => void;
  onDetail: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onConfigure?: () => void;
  t: T;
  dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const disabledOpacity = dark ? 0.6 : 0.65;
  return (
    <div
      onClick={onDetail}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: t.surface,
        border: `1px solid ${hov ? t.text4 : t.border}`,
        borderRadius: '12px',
        padding: '16px',
        display: 'flex', alignItems: 'flex-start', gap: '14px',
        opacity: rule.enabled ? 1 : disabledOpacity,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <IconCircle Icon={rule.icon} tone={rule.iconTone} enabled={rule.enabled} t={t} dark={dark} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
          color: t.text1, lineHeight: 1.3,
        }}>
          {rule.title}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', color: t.text3,
          marginTop: '4px', lineHeight: 1.45,
        }}>
          {rule.description}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Каналы
            </span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {rule.channels.map(c => <ChannelBadge key={c} label={c} active={rule.enabled} t={t} dark={dark} />)}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Получатели
            </span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {rule.recipients.map(r => <RecipientBadge key={r} label={r} t={t} dark={dark} />)}
            </div>
          </div>
        </div>

        {(rule.timing || rule.configLabel) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            marginTop: '10px', flexWrap: 'wrap',
          }}>
            {rule.timing && (
              <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
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
                  color: t.blue, cursor: 'pointer',
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
        <Switch checked={rule.enabled} onChange={onToggle} ariaLabel={`Переключить правило "${rule.title}"`} t={t} dark={dark} />
        <RuleActionMenu
          onDetail={onDetail}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          t={t}
          dark={dark}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABS BAR
═══════════════════════════════════════════════════════════════════════════ */

function TabsBar({ active, onChange, t }: { active: RuleTab; onChange: (k: RuleTab) => void; t: T }) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex', alignItems: 'center', gap: '0',
        borderBottom: `1px solid ${t.border}`, marginBottom: '20px',
      }}
    >
      {TABS.map(tb => {
        const isActive = active === tb.key;
        return <TabButton key={tb.key} active={isActive} label={tb.label} onClick={() => onChange(tb.key)} t={t} />;
      })}
    </div>
  );
}

function TabButton({ active, label, onClick, t }: { active: boolean; label: string; onClick: () => void; t: T }) {
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
        color: active ? t.blue : hov ? t.text1 : t.text3,
        borderBottom: `2px solid ${active ? t.blue : 'transparent'}`,
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
  open, mode, initialRule, onClose, onSave, t, dark,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  initialRule: Rule | null;
  onClose: () => void;
  onSave: (form: FormState) => void;
  t: T;
  dark: boolean;
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

  const pickTrigger = (tr: string) => setForm(prev => ({
    ...prev,
    trigger: tr,
    name: prev.name.trim() === '' || prev.name === prev.trigger ? tr : prev.name,
  }));

  const overlay = dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(17, 24, 39, 0.50)';
  const modalShadow = dark ? '0 24px 48px rgba(0,0,0,0.5)' : '0 24px 48px rgba(0,0,0,0.18)';
  const closeHovBg = dark ? D.tableHover : '#F3F4F6';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: overlay,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '600px',
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '12px',
          boxShadow: modalShadow,
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '18px 20px', borderBottom: `1px solid ${t.border}`, flexShrink: 0,
        }}>
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1,
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
              background: closeHov ? closeHovBg : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={t.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {/* Section 1 — Событие */}
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
            />
            <Caption t={t}>Нажмите на переменную, чтобы вставить её в текст. При отправке они заменятся реальными данными.</Caption>
          </FormSection>

          <Divider t={t} />

          {/* Section 2 — Каналы */}
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

          {/* Section 3 — Получатели */}
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
                />
              </div>
            )}
          </FormSection>

          <Divider t={t} />

          {/* Section 4 — Расписание */}
          <FormSection title="Расписание" t={t}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          padding: '16px 20px', borderTop: `1px solid ${t.border}`, flexShrink: 0,
        }}>
          <OutlineButton onClick={onClose} t={t}>Отмена</OutlineButton>
          <PrimaryButton onClick={() => valid && onSave(form)} disabled={!valid} t={t} dark={dark}>
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
  return <div style={{ height: '1px', background: t.border }} />;
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

const TEMPLATE_VARIABLES = [
  'seller_name', 'card_number', 'kpi_step', 'amount', 'org_name',
] as const;

function TemplateField({ value, onChange, t }: {
  value: string; onChange: (v: string) => void; t: T;
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
          <VariableChip key={v} name={v} onInsert={() => insertToken(v)} t={t} />
        ))}
      </div>
    </div>
  );
}

function VariableChip({ name, onInsert, t }: { name: string; onInsert: () => void; t: T }) {
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
            boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(17,24,39,0.12)',
            padding: '4px 0',
          }}
        >
          {TRIGGER_GROUPS.map(g => (
            <div key={g.group}>
              <div style={{
                padding: '8px 12px 4px',
                fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {g.group}
              </div>
              {g.triggers.map(tr => (
                <TriggerOption
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

function TriggerOption({ label, selected, onClick, t, dark }: {
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
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
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
          {children}
        </div>
      </div>
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
            boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(17,24,39,0.12)',
            padding: '4px 0',
          }}
        >
          {options.map(o => (
            <TriggerOption key={o} label={o} selected={value === o} onClick={() => { onChange(o); close(); }} t={t} dark={dark} />
          ))}
        </div>
      )}
    </div>
  );
}

function AdvanceDaysChips({ days, onChange, t }: {
  days: number[]; onChange: (days: number[]) => void; t: T;
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
              background: 'rgba(37,99,235,0.15)', color: t.blue,
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
   DELETE RULE MODAL
═══════════════════════════════════════════════════════════════════════════ */

function DeleteRuleModal({ rule, onClose, onConfirm, t, dark }: {
  rule: Rule | null;
  onClose: () => void;
  onConfirm: () => void;
  t: T;
  dark: boolean;
}) {
  const [closeHov, setCloseHov] = useState(false);

  useEffect(() => {
    if (!rule) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [rule, onClose]);

  if (!rule) return null;

  const overlay = dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(17, 24, 39, 0.50)';
  const modalShadow = dark ? '0 24px 48px rgba(0,0,0,0.5)' : '0 24px 48px rgba(0,0,0,0.18)';
  const closeHovBg = dark ? D.tableHover : '#F3F4F6';
  const recipientBg = dark ? D.tableAlt : '#F3F4F6';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: overlay,
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
          boxShadow: modalShadow,
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '18px 20px', borderBottom: `1px solid ${t.border}`, flexShrink: 0,
        }}>
          <Trash2 size={20} color={t.error} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1,
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
              background: closeHov ? closeHovBg : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={t.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          {/* Rule info card */}
          <div style={{
            background: t.errorBg,
            borderTop: `1px solid ${t.border}`,
            borderRight: `1px solid ${t.border}`,
            borderBottom: `1px solid ${t.border}`,
            borderLeft: `3px solid ${t.error}`,
            borderRadius: '8px', padding: '12px',
            display: 'flex', flexDirection: 'column', gap: '8px',
          }}>
            <div>
              <div style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: t.text1,
              }}>
                {rule.title}
              </div>
              <div style={{
                fontFamily: F.inter, fontSize: '12px', color: t.text3,
                marginTop: '3px', lineHeight: 1.45,
              }}>
                {rule.description}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  fontFamily: F.inter, fontSize: '10px', fontWeight: 600,
                  color: t.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  Каналы
                </span>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {rule.channels.map(c => (
                    <span key={c} style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 7px', borderRadius: '5px',
                      background: t.blueLt, color: t.blue,
                    }}>{c}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  fontFamily: F.inter, fontSize: '10px', fontWeight: 600,
                  color: t.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  Получатели
                </span>
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                  {rule.recipients.map(r => (
                    <span key={r} style={{
                      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                      padding: '2px 7px', borderRadius: '5px',
                      background: recipientBg, color: t.text2,
                    }}>{r}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              fontFamily: F.inter, fontSize: '11px', color: t.text3,
            }}>
              Последний раз сработало: <span style={{ fontFamily: F.mono, color: t.text2 }}>12.04.2026</span> (23 уведомления)
            </div>
          </div>

          {/* Warning copy */}
          <p style={{
            margin: 0, fontFamily: F.inter, fontSize: '14px',
            color: t.text1, lineHeight: 1.5,
          }}>
            Это действие нельзя отменить. Правило будет удалено навсегда.
          </p>

          {/* Consequences list */}
          <div>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: t.text3, marginBottom: '6px',
            }}>
              При удалении:
            </div>
            <ul style={{
              margin: 0, padding: '0 0 0 18px',
              fontFamily: F.inter, fontSize: '12px', color: t.text2, lineHeight: 1.6,
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
          padding: '16px 20px', borderTop: `1px solid ${t.border}`, flexShrink: 0,
        }}>
          <OutlineButton onClick={onClose} t={t}>Отмена</OutlineButton>
          <DestructiveButton onClick={onConfirm} icon={Trash2} t={t} dark={dark}>Удалить правило</DestructiveButton>
        </div>
      </div>
    </div>
  );
}

function DestructiveButton({ children, onClick, icon: Icon, t, dark }: {
  children: React.ReactNode; onClick?: () => void; icon?: React.ElementType; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const hoverBg = dark ? '#EF4444' : '#DC2626';
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '38px', padding: '0 18px',
        border: 'none', borderRadius: '8px',
        background: hov ? hoverBg : t.error,
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

function DuplicateRuleModal({ rule, onClose, onConfirm, t, dark }: {
  rule: Rule | null;
  onClose: () => void;
  onConfirm: (title: string, inactive: boolean) => void;
  t: T;
  dark: boolean;
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

  const overlay = dark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(17, 24, 39, 0.50)';
  const modalShadow = dark ? '0 24px 48px rgba(0,0,0,0.5)' : '0 24px 48px rgba(0,0,0,0.18)';
  const closeHovBg = dark ? D.tableHover : '#F3F4F6';
  const sourceBg = dark ? D.tableAlt : '#F9FAFB';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: overlay,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '480px',
          background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: '12px', boxShadow: modalShadow,
          display: 'flex', flexDirection: 'column',
          maxHeight: 'calc(100vh - 40px)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '18px 20px', borderBottom: `1px solid ${t.border}`, flexShrink: 0,
        }}>
          <Copy size={20} color={t.blue} strokeWidth={1.75} />
          <h2 style={{
            flex: 1, margin: 0,
            fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1,
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
              background: closeHov ? closeHovBg : 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.12s',
            }}
          >
            <X size={16} color={t.text3} strokeWidth={1.75} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '20px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '14px',
        }}>
          {/* Source rule card */}
          <div style={{
            background: sourceBg,
            borderRadius: '8px', padding: '12px',
            border: `1px solid ${t.border}`,
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '10px',
            }}>
              <span style={{
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1,
              }}>
                {rule.title}
              </span>
              <ReadOnlySwitch checked={rule.enabled} t={t} dark={dark} />
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              {sourceSummary}
            </div>
          </div>

          <p style={{ margin: 0, fontFamily: F.inter, fontSize: '14px', color: t.text1 }}>
            Будет создана копия правила:
          </p>

          {/* Title input */}
          <div>
            <label style={{
              display: 'block', marginBottom: '6px',
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text2,
            }}>
              Название нового правила
              <span style={{ color: t.error, marginLeft: '3px' }}>*</span>
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
                border: `1px solid ${focus ? t.blue : t.inputBorder}`,
                borderRadius: '8px', outline: 'none',
                fontFamily: F.inter, fontSize: '14px', color: t.text1,
                background: t.surface, boxSizing: 'border-box',
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
                  border: `1.5px solid ${inactive ? t.blue : t.inputBorder}`,
                  background: inactive ? t.blue : t.surface,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.12s', flexShrink: 0, marginTop: '1px',
                }}
              >
                {inactive && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </span>
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text1 }}>
                Создать в неактивном состоянии
              </span>
            </label>
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: t.text3,
              marginTop: '4px', marginLeft: '26px',
            }}>
              Вы сможете активировать правило после настройки
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '8px',
          padding: '16px 20px', borderTop: `1px solid ${t.border}`, flexShrink: 0,
        }}>
          <OutlineButton onClick={onClose} t={t}>Отмена</OutlineButton>
          <PrimaryButton
            disabled={!valid}
            onClick={() => valid && onConfirm(title.trim(), inactive)}
            t={t}
            dark={dark}
          >
            Создать копию
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function ReadOnlySwitch({ checked, t, dark }: { checked: boolean; t: T; dark: boolean }) {
  const offTrack = dark ? '#2D3148' : '#D1D5DB';
  return (
    <span
      aria-hidden="true"
      style={{
        width: '36px', height: '20px', borderRadius: '10px',
        background: checked ? t.blue : offTrack,
        position: 'relative', flexShrink: 0,
      }}
    >
      <span style={{
        width: '14px', height: '14px', borderRadius: '50%',
        background: '#FFFFFF', position: 'absolute', top: '3px',
        left: checked ? '19px' : '3px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DUPLICATE SUCCESS TOAST
═══════════════════════════════════════════════════════════════════════════ */

function DuplicateSuccessToast({ toast, onDismiss, onOpen, t, dark }: {
  toast: { title: string; inactive: boolean; openRule: Rule } | null;
  onDismiss: () => void;
  onOpen: () => void;
  t: T;
  dark: boolean;
}) {
  useEffect(() => {
    if (!toast) return;
    const handle = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(handle);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const shadow = dark ? '0 12px 28px rgba(0,0,0,0.5)' : '0 12px 28px rgba(17,24,39,0.14)';
  const successIconBg = dark ? 'rgba(52,211,153,0.12)' : C.successBg;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed', top: '24px', right: '24px', zIndex: 200,
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        maxWidth: '420px',
        padding: '14px 16px',
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderLeft: `3px solid ${t.success}`,
        borderRadius: '10px',
        boxShadow: shadow,
      }}
    >
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%',
        background: successIconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
      }}>
        <CheckCircle2 size={16} color={t.success} strokeWidth={2} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', color: t.text1, lineHeight: 1.5,
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
              color: t.blue, cursor: 'pointer',
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
          flexShrink: 0, color: t.text3,
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

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE — Rules list (M-01)
═══════════════════════════════════════════════════════════════════════════ */

const MOBILE_TABS: { key: RuleTab; label: string }[] = [
  { key: 'kpi',     label: 'KPI' },
  { key: 'finance', label: 'Финансы' },
  { key: 'cards',   label: 'Карты' },
  { key: 'system',  label: 'Система' },
];

function MobileSegmented({
  active, onChange, t, dark,
}: { active: RuleTab; onChange: (k: RuleTab) => void; t: T; dark: boolean }) {
  const trackBg = dark ? '#2D3148' : '#F3F4F6';
  return (
    <div style={{
      display: 'flex', padding: 4, borderRadius: 999, background: trackBg,
      height: 36, boxSizing: 'border-box',
    }}>
      {MOBILE_TABS.map(tb => {
        const isActive = tb.key === active;
        return (
          <div
            key={tb.key}
            onClick={() => onChange(tb.key)}
            style={{
              flex: 1, borderRadius: 999,
              background: isActive ? t.surface : 'transparent',
              boxShadow: isActive ? (dark ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 2px rgba(17,24,39,0.08)') : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: F.inter, fontSize: 13, fontWeight: 500,
              color: isActive ? t.text1 : t.text3,
              cursor: 'pointer',
            }}
          >
            {tb.label}
          </div>
        );
      })}
    </div>
  );
}

function MobileRuleCard({
  rule, t, dark, navigate, onToggle, onDuplicate, onDelete, swipedId, setSwipedId,
}: {
  rule: Rule;
  t: T; dark: boolean;
  navigate: (p: string) => void;
  onToggle: (id: string) => void;
  onDuplicate: (r: Rule) => void;
  onDelete: (r: Rule) => void;
  swipedId: string | null;
  setSwipedId: (id: string | null) => void;
}) {
  const startX = useRef<number | null>(null);
  const movedX = useRef(0);
  const actionsW = 180;
  const revealed = swipedId === rule.id;
  const Icon = rule.icon;
  const tone = (dark ? TONE_COLOR_DARK : TONE_COLOR_LIGHT)[rule.iconTone];

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    movedX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    movedX.current = e.touches[0].clientX - startX.current;
  };
  const onTouchEnd = () => {
    if (movedX.current < -40) setSwipedId(rule.id);
    else if (movedX.current > 40) setSwipedId(null);
    startX.current = null;
    movedX.current = 0;
  };

  const visibleChannels = rule.channels.slice(0, 3);
  const extra = rule.channels.length - 3;

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      borderRadius: 16, marginBottom: 10,
    }}>
      {/* Swipe actions */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: actionsW, display: 'flex',
      }}>
        <button
          onClick={() => { setSwipedId(null); onDuplicate(rule); }}
          style={{
            flex: 1, border: 'none', background: t.blue,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, cursor: 'pointer',
          }}
        >
          <Copy size={18} color="#FFFFFF" strokeWidth={2} />
          <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 500, color: '#FFFFFF' }}>Дублировать</span>
        </button>
        <button
          onClick={() => { setSwipedId(null); onDelete(rule); }}
          style={{
            flex: 1, border: 'none', background: t.error,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, cursor: 'pointer',
          }}
        >
          <Trash2 size={18} color="#FFFFFF" strokeWidth={2} />
          <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 500, color: '#FFFFFF' }}>Удалить</span>
        </button>
      </div>

      {/* Card foreground */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => {
          if (revealed) { setSwipedId(null); return; }
          navigate(`/notification-rules/${rule.id}`);
        }}
        style={{
          position: 'relative',
          background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
          padding: 16,
          display: 'flex', flexDirection: 'column', gap: 10,
          transform: `translateX(${revealed ? -actionsW : 0}px)`,
          transition: 'transform 0.18s ease',
          cursor: 'pointer',
          opacity: rule.enabled ? 1 : 0.65,
        }}
      >
        {/* Row 1 — icon + title + toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: tone.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={18} color={tone.fg} strokeWidth={2} />
          </div>
          <span style={{
            flex: 1, fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {rule.title}
          </span>
          <div onClick={e => { e.stopPropagation(); onToggle(rule.id); }}>
            <Switch
              checked={rule.enabled}
              onChange={() => onToggle(rule.id)}
              ariaLabel={`${rule.title} активно`}
              t={t}
              dark={dark}
            />
          </div>
        </div>

        {/* Row 2 — description */}
        <div style={{
          fontFamily: F.inter, fontSize: 13, color: t.text3, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {rule.description}
        </div>

        {/* Row 3 — channel badges + recipients */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {visibleChannels.map(ch => (
            <span
              key={ch}
              style={{
                fontFamily: F.inter, fontSize: 11, fontWeight: 500,
                padding: '3px 8px', borderRadius: 8,
                background: t.blueLt, color: t.blue,
                whiteSpace: 'nowrap',
              }}
            >
              {ch}
            </span>
          ))}
          {extra > 0 && (
            <span style={{
              fontFamily: F.inter, fontSize: 11, fontWeight: 500,
              padding: '3px 8px', borderRadius: 8,
              background: dark ? 'rgba(160,165,184,0.15)' : '#F3F4F6',
              color: t.text3,
            }}>
              +{extra}
            </span>
          )}
          <div style={{ width: 1, height: 12, background: t.border }} />
          <span style={{
            flex: 1, minWidth: 0,
            fontFamily: F.inter, fontSize: 12, color: t.text3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {rule.recipients.join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
}

function MobileRules({
  t, dark, navigate, rules, setRules, setDeletingRule, setDuplicatingRule,
}: {
  t: T;
  dark: boolean;
  navigate: (p: string) => void;
  rules: Rule[];
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
  setDeletingRule: (r: Rule | null) => void;
  setDuplicatingRule: (r: Rule | null) => void;
}) {
  const [tab, setTab] = useState<RuleTab>('kpi');
  const [swipedId, setSwipedId] = useState<string | null>(null);
  const visible = rules.filter(r => r.tab === tab);

  const toggle = (id: string) =>
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));

  return (
    <>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 4px',
        background: t.surface, borderBottom: `1px solid ${t.border}`,
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            width: 48, height: 48, border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <ChevronLeft size={24} color={t.blue} strokeWidth={2} />
        </button>
        <span style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1,
          whiteSpace: 'nowrap',
        }}>
          Правила уведомлений
        </span>
        <button
          onClick={() => navigate('/notification-rules/new')}
          style={{
            width: 40, height: 40, margin: '0 8px', borderRadius: 10,
            background: t.blue, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2} />
        </button>
      </div>

      <div
        onClick={() => swipedId !== null && setSwipedId(null)}
        style={{ padding: '14px 0 calc(80px + env(safe-area-inset-bottom, 0px))', boxSizing: 'border-box', width: '100%' }}
      >
        {/* Segmented */}
        <div style={{ padding: '0 16px 16px' }}>
          <MobileSegmented active={tab} onChange={setTab} t={t} dark={dark} />
        </div>

        {/* Rule cards */}
        <div style={{ padding: '0 16px' }}>
          {visible.length === 0 ? (
            <div style={{
              padding: '48px 24px', textAlign: 'center',
              background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16,
            }}>
              <div style={{ fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text2, marginBottom: 4 }}>
                Нет правил
              </div>
              <div style={{ fontFamily: F.inter, fontSize: 14, color: t.text3 }}>
                Создайте первое правило уведомлений
              </div>
            </div>
          ) : (
            visible.map(rule => (
              <MobileRuleCard
                key={rule.id}
                rule={rule}
                t={t} dark={dark}
                navigate={navigate}
                onToggle={toggle}
                onDuplicate={r => setDuplicatingRule(r)}
                onDelete={r => setDeletingRule(r)}
                swipedId={swipedId}
                setSwipedId={setSwipedId}
              />
            ))
          )}
        </div>

        <div style={{
          fontFamily: F.inter, fontSize: 12, color: t.text4,
          textAlign: 'center', marginTop: 16, padding: '0 16px',
        }}>
          Проведите карточку влево для действий
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function NotificationRulesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const mobile = useIsMobile();
  const t = theme(darkMode);
  const dark = darkMode;
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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar
        role="bank"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} hideOnMobile />

        {mobile ? (
          <MobileRules
            t={t} dark={dark}
            navigate={navigate}
            rules={rules}
            setRules={setRules}
            setDeletingRule={setDeletingRule}
            setDuplicatingRule={setDuplicatingRule}
          />
        ) : (
        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Правила уведомлений</span>
          </div>

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '24px', flexWrap: 'wrap',
          }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Правила уведомлений
              </h1>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '6px' }}>
                Настройте автоматические уведомления системы
              </div>
            </div>

            <PrimaryButton icon={Plus} onClick={openCreate} t={t} dark={dark}>Создать правило</PrimaryButton>
          </div>

          {/* Tabs */}
          <TabsBar active={tab} onChange={setTab} t={t} />

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
                t={t}
                dark={dark}
              />
            ))}
          </div>

          {/* Footer summary */}
          <div style={{
            marginTop: '24px', padding: '16px 18px',
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '12px', flexWrap: 'wrap',
          }}>
            <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text1 }}>
              Активных правил: <span style={{ color: t.blue }}>{activeCount}</span> из {rules.length}
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Неактивные правила не отправляют уведомления
            </div>
          </div>
        </div>
        )}

        {/* Modals — shared between desktop and mobile */}
        <DeleteRuleModal
          rule={deletingRule}
          onClose={() => setDeletingRule(null)}
          onConfirm={() => {
            if (deletingRule) remove(deletingRule.id);
            setDeletingRule(null);
          }}
          t={t}
          dark={dark}
        />

        <DuplicateRuleModal
          rule={duplicatingRule}
          onClose={() => setDuplicatingRule(null)}
          onConfirm={(title, inactive) => {
            if (duplicatingRule) commitDuplicate(duplicatingRule, title, inactive);
          }}
          t={t}
          dark={dark}
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
          t={t}
          dark={dark}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIMARY BUTTON
═══════════════════════════════════════════════════════════════════════════ */

function PrimaryButton({ children, icon: Icon, onClick, disabled, t, dark }: {
  children: React.ReactNode; icon?: React.ElementType; onClick?: () => void; disabled?: boolean; t: T; dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const disabledBg = dark ? '#1E3A5F' : '#93C5FD';
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
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        transition: 'all 0.12s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
