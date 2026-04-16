import React, { useState } from 'react';
import { Search, QrCode, ChevronDown, Plus, Minus, AlertCircle, Check } from 'lucide-react';
import { F, C, theme } from './tokens';
import { useDarkMode } from '../useDarkMode';

type T = ReturnType<typeof theme>;

function Label({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <label style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.text2, display: 'block', marginBottom: '6px' }}>
      {children}
    </label>
  );
}

function FieldGroup({ label, children, helper, error, t }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <Label t={t}>{label}</Label>}
      {children}
      {error && (
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.error, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={12} />
          {error}
        </div>
      )}
      {helper && !error && (
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: '4px' }}>{helper}</div>
      )}
    </div>
  );
}

function makeInputBase(t: T): React.CSSProperties {
  return {
    height: '40px',
    border: `1px solid ${t.inputBorder}`,
    borderRadius: '8px',
    padding: '0 12px',
    fontFamily: F.inter,
    fontSize: '14px',
    color: t.text1,
    background: t.surface,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };
}

function TextInput({ placeholder, value, suffix, iconLeft, error, disabled, t }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      {iconLeft && (
        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
          {iconLeft}
        </div>
      )}
      <input
        placeholder={placeholder || 'Введите значение'}
        defaultValue={value}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...makeInputBase(t),
          paddingLeft: iconLeft ? '36px' : '12px',
          paddingRight: suffix ? '52px' : '12px',
          border: error ? `1px solid ${t.error}` : focused ? `1px solid ${t.blue}` : `1px solid ${t.inputBorder}`,
          boxShadow: focused && !error ? `0 0 0 2px ${t.focusRing}` : 'none',
          background: disabled ? t.pageBg : t.surface,
          color: disabled ? t.textDisabled : t.text1,
        }}
      />
      {suffix && (
        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontFamily: F.inter, fontSize: '13px', color: t.text4 }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

function SelectInput({ placeholder, options = [], disabled, t }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <select
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...makeInputBase(t),
          appearance: 'none',
          paddingRight: '36px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: focused ? `1px solid ${t.blue}` : `1px solid ${t.inputBorder}`,
          boxShadow: focused ? `0 0 0 2px ${t.focusRing}` : 'none',
          background: disabled ? t.pageBg : t.surface,
          color: disabled ? t.textDisabled : t.text2,
        }}
      >
        <option value="">{placeholder || 'Выберите...'}</option>
        {options.map((o: string) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} color={disabled ? t.textDisabled : t.text3} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
    </div>
  );
}

function NumberInput({ t }: { t: T }) {
  const [val, setVal] = useState(5);
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${t.inputBorder}`, borderRadius: '8px', overflow: 'hidden', height: '40px', background: t.surface }}>
      <button onClick={() => setVal(v => Math.max(0, v - 1))} style={{ width: '40px', height: '100%', border: 'none', borderRight: `1px solid ${t.border}`, background: t.pageBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Minus size={14} color={t.text3} />
      </button>
      <input
        value={val}
        onChange={e => setVal(Number(e.target.value))}
        style={{ flex: 1, border: 'none', outline: 'none', fontFamily: F.inter, fontSize: '14px', color: t.text1, textAlign: 'center', background: 'transparent' }}
      />
      <button onClick={() => setVal(v => v + 1)} style={{ width: '40px', height: '100%', border: 'none', borderLeft: `1px solid ${t.border}`, background: t.pageBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Plus size={14} color={t.text3} />
      </button>
    </div>
  );
}

function Textarea({ placeholder, t }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      placeholder={placeholder || 'Введите описание...'}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', height: '80px',
        border: focused ? `1px solid ${t.blue}` : `1px solid ${t.inputBorder}`,
        boxShadow: focused ? `0 0 0 2px ${t.focusRing}` : 'none',
        borderRadius: '8px', padding: '10px 12px',
        fontFamily: F.inter, fontSize: '14px', color: t.text1,
        background: t.surface, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
      }}
    />
  );
}

function CheckboxComp({ label, checked: initialChecked = false, t }: any) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
      <div
        onClick={() => setChecked(!checked)}
        style={{
          width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
          border: checked ? 'none' : `1px solid ${t.inputBorder}`,
          background: checked ? t.blue : t.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {checked && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>{label}</span>
    </label>
  );
}

function ToggleSwitch({ label, initialOn = false, t }: any) {
  const [on, setOn] = useState(initialOn);
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <div
        onClick={() => setOn(!on)}
        style={{
          width: '36px', height: '20px', borderRadius: '10px',
          background: on ? t.blue : t.border,
          position: 'relative', cursor: 'pointer', flexShrink: 0,
          transition: 'background 0.2s',
        }}
      >
        <div style={{
          position: 'absolute', top: '2px',
          left: on ? '18px' : '2px',
          width: '16px', height: '16px', borderRadius: '50%',
          background: '#FFFFFF', boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
          transition: 'left 0.2s',
        }} />
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>{label}</span>
    </label>
  );
}

function RadioGroupComp({ t }: { t: T }) {
  const [selected, setSelected] = useState('visa_sum');
  const options = [
    { value: 'visa_sum', label: 'VISA SUM' },
    { value: 'visa_usd', label: 'VISA USD' },
    { value: 'visa_eur', label: 'VISA EUR' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {options.map(opt => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <div
            onClick={() => setSelected(opt.value)}
            style={{
              width: '16px', height: '16px', borderRadius: '50%',
              border: selected === opt.value ? `none` : `1px solid ${t.inputBorder}`,
              background: selected === opt.value ? t.blue : t.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: selected === opt.value ? `0 0 0 2px ${t.blue}, 0 0 0 4px ${t.blueLt}` : 'none',
            }}
          >
            {selected === opt.value && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFFFFF' }} />}
          </div>
          <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export function Row7Forms() {
  const [darkMode] = useDarkMode();
  const t = theme(darkMode);

  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>
      <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '24px' }}>
        Form Components — All Variants
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>

        {/* Plain input */}
        <FieldGroup label="Имя продавца" helper="Полное официальное имя" t={t}>
          <TextInput placeholder="Введите имя..." t={t} />
        </FieldGroup>

        {/* Input with suffix */}
        <FieldGroup label="Сумма вознаграждения" t={t}>
          <TextInput value="15 000" suffix="UZS" t={t} />
        </FieldGroup>

        {/* Input with search icon */}
        <FieldGroup label="Поиск по карте" t={t}>
          <TextInput placeholder="Поиск..." iconLeft={<Search size={16} color={t.text4} />} t={t} />
        </FieldGroup>

        {/* Input with QR icon */}
        <FieldGroup label="Номер карты" t={t}>
          <TextInput placeholder="Сканировать или ввести..." iconLeft={<QrCode size={16} color={t.text4} />} t={t} />
        </FieldGroup>

        {/* Select */}
        <FieldGroup label="Организация" t={t}>
          <SelectInput placeholder="Выберите организацию" options={['Mysafar OOO', 'Alif Group', 'TechCom LLC', 'UzInvest']} t={t} />
        </FieldGroup>

        {/* Number input */}
        <FieldGroup label="Количество карт в партии" t={t}>
          <NumberInput t={t} />
        </FieldGroup>

        {/* Textarea */}
        <FieldGroup label="Описание KPI шага" t={t}>
          <Textarea placeholder="Опишите условия выполнения..." t={t} />
        </FieldGroup>

        {/* Error state */}
        <FieldGroup label="Email адрес" error="Неверный формат email" t={t}>
          <TextInput value="not-an-email" error t={t} />
        </FieldGroup>

        {/* Disabled state */}
        <FieldGroup label="ID карты (системное)" t={t}>
          <TextInput value="CARD-20260401-001" disabled t={t} />
        </FieldGroup>

        {/* Disabled select */}
        <FieldGroup label="Тип валюты (заблокировано)" t={t}>
          <SelectInput placeholder="VISA SUM" disabled t={t} />
        </FieldGroup>

        {/* Checkboxes */}
        <div>
          <Label t={t}>Уведомления</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <CheckboxComp label="Email уведомления" checked={true} t={t} />
            <CheckboxComp label="SMS при начислении" checked={false} t={t} />
            <CheckboxComp label="Push в приложении" checked={true} t={t} />
          </div>
        </div>

        {/* Toggles */}
        <div>
          <Label t={t}>Настройки системы</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ToggleSwitch label="Автоматические начисления" initialOn={true} t={t} />
            <ToggleSwitch label="KPI уведомления" initialOn={false} t={t} />
            <ToggleSwitch label="Экспорт данных" initialOn={true} t={t} />
          </div>
        </div>

        {/* Radio group */}
        <div>
          <Label t={t}>Тип карты</Label>
          <RadioGroupComp t={t} />
        </div>

      </div>
    </div>
  );
}
