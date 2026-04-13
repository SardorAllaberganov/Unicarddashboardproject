import React, { useState } from 'react';
import { Search, QrCode, ChevronDown, Plus, Minus, AlertCircle, Check } from 'lucide-react';
import { F, C } from './tokens';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>
      {children}
    </label>
  );
}

function FieldGroup({ label, children, helper, error }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <Label>{label}</Label>}
      {children}
      {error && (
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: '#EF4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={12} />
          {error}
        </div>
      )}
      {helper && !error && (
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>{helper}</div>
      )}
    </div>
  );
}

const inputBase: React.CSSProperties = {
  height: '40px',
  border: `1px solid #D1D5DB`,
  borderRadius: '8px',
  padding: '0 12px',
  fontFamily: F.inter,
  fontSize: '14px',
  color: '#111827',
  background: '#FFFFFF',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

function TextInput({ placeholder, value, suffix, iconLeft, error, disabled }: any) {
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
          ...inputBase,
          paddingLeft: iconLeft ? '36px' : '12px',
          paddingRight: suffix ? '52px' : '12px',
          border: error ? `1px solid #EF4444` : focused ? `1px solid #2563EB` : `1px solid #D1D5DB`,
          boxShadow: focused && !error ? `0 0 0 2px #DBEAFE` : 'none',
          background: disabled ? '#F9FAFB' : '#FFFFFF',
          color: disabled ? '#D1D5DB' : '#111827',
        }}
      />
      {suffix && (
        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontFamily: F.inter, fontSize: '13px', color: '#9CA3AF' }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

function SelectInput({ placeholder, options = [], disabled }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <select
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputBase,
          appearance: 'none',
          paddingRight: '36px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: focused ? `1px solid #2563EB` : `1px solid #D1D5DB`,
          boxShadow: focused ? `0 0 0 2px #DBEAFE` : 'none',
          background: disabled ? '#F9FAFB' : '#FFFFFF',
          color: disabled ? '#D1D5DB' : '#374151',
        }}
      >
        <option value="">{placeholder || 'Выберите...'}</option>
        {options.map((o: string) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} color={disabled ? '#D1D5DB' : '#6B7280'} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
    </div>
  );
}

function NumberInput() {
  const [val, setVal] = useState(5);
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: `1px solid #D1D5DB`, borderRadius: '8px', overflow: 'hidden', height: '40px', background: '#FFFFFF' }}>
      <button onClick={() => setVal(v => Math.max(0, v - 1))} style={{ width: '40px', height: '100%', border: 'none', borderRight: `1px solid #E5E7EB`, background: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Minus size={14} color="#6B7280" />
      </button>
      <input
        value={val}
        onChange={e => setVal(Number(e.target.value))}
        style={{ flex: 1, border: 'none', outline: 'none', fontFamily: F.inter, fontSize: '14px', color: '#111827', textAlign: 'center', background: 'transparent' }}
      />
      <button onClick={() => setVal(v => v + 1)} style={{ width: '40px', height: '100%', border: 'none', borderLeft: `1px solid #E5E7EB`, background: '#F9FAFB', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Plus size={14} color="#6B7280" />
      </button>
    </div>
  );
}

function Textarea({ placeholder }: any) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      placeholder={placeholder || 'Введите описание...'}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', height: '80px',
        border: focused ? `1px solid #2563EB` : `1px solid #D1D5DB`,
        boxShadow: focused ? `0 0 0 2px #DBEAFE` : 'none',
        borderRadius: '8px', padding: '10px 12px',
        fontFamily: F.inter, fontSize: '14px', color: '#111827',
        background: '#FFFFFF', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
      }}
    />
  );
}

function CheckboxComp({ label, checked: initialChecked = false }: any) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
      <div
        onClick={() => setChecked(!checked)}
        style={{
          width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
          border: checked ? 'none' : `1px solid #D1D5DB`,
          background: checked ? '#2563EB' : '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {checked && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: '#374151' }}>{label}</span>
    </label>
  );
}

function ToggleSwitch({ label, initialOn = false }: any) {
  const [on, setOn] = useState(initialOn);
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <div
        onClick={() => setOn(!on)}
        style={{
          width: '36px', height: '20px', borderRadius: '10px',
          background: on ? '#2563EB' : '#E5E7EB',
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
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: '#374151' }}>{label}</span>
    </label>
  );
}

function RadioGroupComp() {
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
              border: selected === opt.value ? `none` : `1px solid #D1D5DB`,
              background: selected === opt.value ? '#2563EB' : '#FFFFFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: selected === opt.value ? '0 0 0 2px #2563EB, 0 0 0 4px #EFF6FF' : 'none',
            }}
          >
            {selected === opt.value && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFFFFF' }} />}
          </div>
          <span style={{ fontFamily: F.inter, fontSize: '14px', color: '#374151' }}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export function Row7Forms() {
  return (
    <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
      <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}>
        Form Components — All Variants
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>

        {/* Plain input */}
        <FieldGroup label="Имя продавца" helper="Полное официальное имя">
          <TextInput placeholder="Введите имя..." />
        </FieldGroup>

        {/* Input with suffix */}
        <FieldGroup label="Сумма вознаграждения">
          <TextInput value="15 000" suffix="UZS" />
        </FieldGroup>

        {/* Input with search icon */}
        <FieldGroup label="Поиск по карте">
          <TextInput placeholder="Поиск..." iconLeft={<Search size={16} color="#9CA3AF" />} />
        </FieldGroup>

        {/* Input with QR icon */}
        <FieldGroup label="Номер карты">
          <TextInput placeholder="Сканировать или ввести..." iconLeft={<QrCode size={16} color="#9CA3AF" />} />
        </FieldGroup>

        {/* Select */}
        <FieldGroup label="Организация">
          <SelectInput placeholder="Выберите организацию" options={['Mysafar OOO', 'Alif Group', 'TechCom LLC', 'UzInvest']} />
        </FieldGroup>

        {/* Number input */}
        <FieldGroup label="Количество карт в партии">
          <NumberInput />
        </FieldGroup>

        {/* Textarea */}
        <FieldGroup label="Описание KPI шага">
          <Textarea placeholder="Опишите условия выполнения..." />
        </FieldGroup>

        {/* Error state */}
        <FieldGroup label="Email адрес" error="Неверный формат email">
          <TextInput value="not-an-email" error />
        </FieldGroup>

        {/* Disabled state */}
        <FieldGroup label="ID карты (системное)">
          <TextInput value="CARD-20260401-001" disabled />
        </FieldGroup>

        {/* Disabled select */}
        <FieldGroup label="Тип валюты (заблокировано)">
          <SelectInput placeholder="VISA SUM" disabled />
        </FieldGroup>

        {/* Checkboxes */}
        <div>
          <Label>Уведомления</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <CheckboxComp label="Email уведомления" checked={true} />
            <CheckboxComp label="SMS при начислении" checked={false} />
            <CheckboxComp label="Push в приложении" checked={true} />
          </div>
        </div>

        {/* Toggles */}
        <div>
          <Label>Настройки системы</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <ToggleSwitch label="Автоматические начисления" initialOn={true} />
            <ToggleSwitch label="KPI уведомления" initialOn={false} />
            <ToggleSwitch label="Экспорт данных" initialOn={true} />
          </div>
        </div>

        {/* Radio group */}
        <div>
          <Label>Тип карты</Label>
          <RadioGroupComp />
        </div>

      </div>
    </div>
  );
}
