import React from 'react';
import { F, C } from './tokens';

const colorGroups = [
  {
    title: 'Backgrounds',
    colors: [
      { name: 'Page BG', hex: '#F9FAFB', border: true },
      { name: 'Card / Surface', hex: '#FFFFFF', border: true },
      { name: 'Table Header', hex: '#F9FAFB', border: true },
      { name: 'Table Stripe', hex: '#FAFBFC', border: true },
      { name: 'Input BG', hex: '#FFFFFF', border: true },
    ],
  },
  {
    title: 'Text',
    colors: [
      { name: 'Primary', hex: '#111827' },
      { name: 'Secondary', hex: '#374151' },
      { name: 'Muted', hex: '#6B7280' },
      { name: 'Placeholder', hex: '#9CA3AF' },
      { name: 'Disabled', hex: '#D1D5DB' },
    ],
  },
  {
    title: 'Brand & Accent',
    colors: [
      { name: 'Blue-600', hex: '#2563EB' },
      { name: 'Blue-700', hex: '#1D4ED8' },
      { name: 'Blue-50', hex: '#EFF6FF', border: true },
      { name: 'Blue-100', hex: '#DBEAFE', border: true },
    ],
  },
  {
    title: 'Semantic',
    colors: [
      { name: 'Success', hex: '#10B981' },
      { name: 'Success Bg', hex: '#F0FDF4', border: true },
      { name: 'Warning', hex: '#D97706' },
      { name: 'Warning Bg', hex: '#FFFBEB', border: true },
      { name: 'Error', hex: '#EF4444' },
      { name: 'Error Bg', hex: '#FEF2F2', border: true },
      { name: 'Info', hex: '#0891B2' },
      { name: 'Info Bg', hex: '#ECFEFF', border: true },
    ],
  },
  {
    title: 'Icon Tints',
    colors: [
      { name: 'Blue Tint', hex: '#EFF6FF', border: true },
      { name: 'Blue Icon', hex: '#2563EB' },
      { name: 'Violet Tint', hex: '#F3F0FF', border: true },
      { name: 'Violet Icon', hex: '#7C3AED' },
      { name: 'Green Tint', hex: '#F0FDF4', border: true },
      { name: 'Green Icon', hex: '#16A34A' },
      { name: 'Cyan Tint', hex: '#ECFEFF', border: true },
      { name: 'Cyan Icon', hex: '#0891B2' },
      { name: 'Amber Tint', hex: '#FFFBEB', border: true },
      { name: 'Amber Icon', hex: '#D97706' },
      { name: 'Rose Tint', hex: '#FFF1F2', border: true },
      { name: 'Rose Icon', hex: '#E11D48' },
    ],
  },
  {
    title: 'Borders',
    colors: [
      { name: 'Default', hex: '#E5E7EB', border: true },
      { name: 'Input', hex: '#D1D5DB', border: true },
      { name: 'Focus Ring', hex: '#DBEAFE', border: true },
      { name: 'Divider', hex: '#E5E7EB', border: true },
    ],
  },
];

function Swatch({ name, hex, border }: { name: string; hex: string; border?: boolean }) {
  const isDark = parseInt(hex.replace('#', ''), 16) < 0xaaaaaa;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '10px',
          background: hex,
          border: border ? `1px solid #D1D5DB` : 'none',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ fontFamily: F.inter, fontSize: '11px', color: '#6B7280', textAlign: 'center', lineHeight: 1.3 }}>
        {name}
      </div>
      <div style={{ fontFamily: F.mono, fontSize: '10px', color: '#9CA3AF', textAlign: 'center' }}>
        {hex}
      </div>
    </div>
  );
}

const typeScale = [
  { name: 'Page Title', font: F.dm, size: '24px', weight: 600, color: '#111827', sample: 'Moment KPI Platform' },
  { name: 'Section Heading', font: F.dm, size: '18px', weight: 600, color: '#111827', sample: 'Управление картами' },
  { name: 'Card Title', font: F.dm, size: '16px', weight: 600, color: '#111827', sample: 'Статистика продаж' },
  { name: 'Stat Display (28)', font: F.dm, size: '28px', weight: 700, color: '#111827', sample: '1 825 000' },
  { name: 'Large Display (32)', font: F.dm, size: '32px', weight: 700, color: '#111827', sample: '5 000' },
  { name: 'Body', font: F.inter, size: '14px', weight: 400, color: '#374151', sample: 'Показано 1–10 из 5 000 записей' },
  { name: 'Body Medium', font: F.inter, size: '14px', weight: 500, color: '#374151', sample: 'Имя продавца' },
  { name: 'Small Body', font: F.inter, size: '13px', weight: 400, color: '#6B7280', sample: 'Дополнительная информация' },
  { name: 'Caption', font: F.inter, size: '12px', weight: 400, color: '#9CA3AF', sample: '13.04.2026, 14:32' },
  { name: 'Table Header', font: F.inter, size: '11px', weight: 600, color: '#6B7280', sample: 'ПРОДАВЕЦ', letterSpacing: '0.06em', upper: true },
  { name: 'Nav Group Label', font: F.inter, size: '11px', weight: 600, color: '#9CA3AF', sample: 'УПРАВЛЕНИЕ', letterSpacing: '0.06em', upper: true },
  { name: 'Badge Text', font: F.inter, size: '12px', weight: 500, color: '#15803D', sample: 'Активна' },
  { name: 'Button Text', font: F.inter, size: '14px', weight: 500, color: '#374151', sample: 'Сохранить' },
  { name: 'Mono Value', font: F.mono, size: '14px', weight: 500, color: '#111827', sample: '•••• 1001' },
  { name: 'Mono Small', font: F.mono, size: '13px', weight: 400, color: '#374151', sample: '1 825 000 UZS' },
];

export function Row1ColorTypo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Color Tokens */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}>
          Color Tokens
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {colorGroups.map((group) => (
            <div key={group.title}>
              <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                {group.title}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {group.colors.map((c) => (
                  <Swatch key={c.hex + c.name} {...c} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Scale */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}>
          Typography Scale
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {typeScale.map((t, i) => (
            <div
              key={t.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: i < typeScale.length - 1 ? `1px solid #E5E7EB` : 'none',
                gap: '24px',
              }}
            >
              <div style={{ width: '160px', flexShrink: 0 }}>
                <div style={{ fontFamily: F.inter, fontSize: '12px', color: '#6B7280' }}>{t.name}</div>
                <div style={{ fontFamily: F.mono, fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                  {t.size} / {t.weight} / {t.color}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontFamily: t.font,
                    fontSize: t.size,
                    fontWeight: t.weight,
                    color: t.color,
                    letterSpacing: t.letterSpacing,
                    textTransform: t.upper ? 'uppercase' : 'none',
                  }}
                >
                  {t.sample}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
