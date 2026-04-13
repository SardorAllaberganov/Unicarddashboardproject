import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { F, C } from './tokens';

// ─── DATE RANGE PICKER ────────────────────────────────────────────────────

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function CalendarMonth({ year, month, startDay, endDay, onSelect }: any) {
  const monthName = new Date(year, month - 1, 1).toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
  const firstDow = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function isInRange(d: number | null): boolean {
    if (!d || !startDay || !endDay) return false;
    const cur = new Date(year, month - 1, d);
    const s = new Date(2026, 2, startDay);
    const e = new Date(2026, 3, endDay);
    return cur >= s && cur <= e;
  }

  function isStart(d: number | null): boolean {
    return !!(d && month === 3 && d === startDay);
  }

  function isEnd(d: number | null): boolean {
    return !!(d && month === 4 && d === endDay);
  }

  return (
    <div style={{ minWidth: '240px' }}>
      <div style={{ textAlign: 'center', fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '12px', textTransform: 'capitalize' }}>
        {monthName}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: '#9CA3AF', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((d, i) => {
          const start = isStart(d);
          const end = isEnd(d);
          const inRange = isInRange(d);
          return (
            <div
              key={i}
              style={{
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: (start || end) ? '50%' : inRange ? '0' : '50%',
                background: (start || end) ? '#2563EB' : inRange ? '#EFF6FF' : 'transparent',
                color: (start || end) ? '#FFFFFF' : d ? '#374151' : 'transparent',
                fontFamily: F.inter,
                fontSize: '13px',
                cursor: d ? 'pointer' : 'default',
              }}
            >
              {d || ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DateRangePicker() {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          height: '40px',
          padding: '0 16px',
          border: `1px solid #D1D5DB`,
          borderRadius: '8px',
          background: '#FFFFFF',
          fontFamily: F.inter,
          fontSize: '14px',
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
      >
        <Calendar size={16} color="#6B7280" />
        01.04.2026 — 13.04.2026
      </button>

      {/* Popover */}
      {open && (
        <div style={{
          position: 'relative',
          top: '100%',
          left: '0',
          zIndex: 50,
          background: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: `1px solid #E5E7EB`,
          padding: '20px',
          display: 'flex',
          gap: '20px',
          marginTop: '8px',
        }}>
          {/* Presets */}
          <div style={{ width: '140px', borderRight: `1px solid #E5E7EB`, paddingRight: '20px' }}>
            <div style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Быстрый выбор
            </div>
            {['Сегодня', 'Вчера', '7 дней', '30 дней', 'Этот месяц', 'Прошлый месяц'].map(preset => (
              <button
                key={preset}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '7px 10px',
                  border: 'none',
                  background: preset === 'Этот месяц' ? '#EFF6FF' : 'transparent',
                  color: preset === 'Этот месяц' ? '#2563EB' : '#374151',
                  fontFamily: F.inter,
                  fontSize: '13px',
                  fontWeight: preset === 'Этот месяц' ? 500 : 400,
                  cursor: 'pointer',
                  borderRadius: '6px',
                  textAlign: 'left',
                  marginBottom: '2px',
                }}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Calendars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              <CalendarMonth year={2026} month={3} startDay={1} endDay={null} />
              <CalendarMonth year={2026} month={4} startDay={null} endDay={13} />
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid #E5E7EB`, paddingTop: '12px' }}>
              <div style={{ fontFamily: F.mono, fontSize: '13px', color: '#6B7280' }}>
                01.04.2026 — 13.04.2026
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ height: '36px', padding: '0 14px', border: `1px solid #D1D5DB`, borderRadius: '8px', background: '#FFFFFF', fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
                  Отмена
                </button>
                <button style={{ height: '36px', padding: '0 14px', border: 'none', borderRadius: '8px', background: '#2563EB', fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: '#FFFFFF', cursor: 'pointer' }}>
                  Применить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DARK THEME SWATCH STRIP ─────────────────────────────────────────────

const lightTokens = [
  { name: 'Page BG', hex: '#F9FAFB' },
  { name: 'Card', hex: '#FFFFFF' },
  { name: 'Card Border', hex: '#E5E7EB' },
  { name: 'Text Primary', hex: '#111827' },
  { name: 'Text Secondary', hex: '#374151' },
  { name: 'Sidebar', hex: '#FFFFFF' },
  { name: 'Primary Blue', hex: '#2563EB' },
  { name: 'Input BG', hex: '#FFFFFF' },
  { name: 'Row Hover', hex: '#F9FAFB' },
  { name: 'Success', hex: '#10B981' },
  { name: 'Error', hex: '#EF4444' },
  { name: 'Warning', hex: '#D97706' },
];

const darkTokens = [
  { name: 'Page BG', hex: '#0F1117' },
  { name: 'Card', hex: '#1A1D27' },
  { name: 'Card Border', hex: '#2D3148' },
  { name: 'Text Primary', hex: '#F1F2F6' },
  { name: 'Text Secondary', hex: '#A0A5B8' },
  { name: 'Sidebar', hex: '#12141C' },
  { name: 'Primary Blue', hex: '#3B82F6' },
  { name: 'Input BG', hex: '#1A1D27' },
  { name: 'Row Hover', hex: '#1E2130' },
  { name: 'Success', hex: '#34D399' },
  { name: 'Error', hex: '#F87171' },
  { name: 'Warning', hex: '#FBBF24' },
];

function SwatchPair({ light, dark }: { light: typeof lightTokens[0]; dark: typeof darkTokens[0] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
      {/* Light */}
      <div style={{
        width: '60px', height: '60px', borderRadius: '10px',
        background: light.hex,
        border: light.hex === '#FFFFFF' || light.hex === '#F9FAFB' ? `1px solid #D1D5DB` : 'none',
      }} />
      <div style={{ fontFamily: F.mono, fontSize: '10px', color: '#6B7280' }}>{light.hex}</div>

      <div style={{ width: '60px', height: '1px', background: '#E5E7EB', margin: '2px 0' }} />

      {/* Dark */}
      <div style={{
        width: '60px', height: '60px', borderRadius: '10px',
        background: dark.hex,
        border: `1px solid #374151`,
      }} />
      <div style={{ fontFamily: F.mono, fontSize: '10px', color: '#6B7280' }}>{dark.hex}</div>
      <div style={{ fontFamily: F.inter, fontSize: '11px', color: '#9CA3AF', textAlign: 'center', marginTop: '2px' }}>
        {light.name}
      </div>
    </div>
  );
}

export function Row10DateDark() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Date Range Picker */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>
          Date Range Picker
        </div>
        <DateRangePicker />
      </div>

      {/* Dark Theme Swatch Strip */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>
        <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
          Dark Theme Token Overrides
        </div>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
          Light (top) → Dark (bottom) equivalents
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', padding: '8px 16px', background: '#F9FAFB', borderRadius: '8px', border: `1px solid #E5E7EB`, width: 'fit-content' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F9FAFB', border: `1px solid #D1D5DB` }} />
          <span style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: '#374151' }}>Light Mode</span>
          <span style={{ fontFamily: F.inter, fontSize: '13px', color: '#9CA3AF' }}>→</span>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0F1117' }} />
          <span style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: '#374151' }}>Dark Mode</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {lightTokens.map((light, i) => (
            <SwatchPair key={light.name} light={light} dark={darkTokens[i]} />
          ))}
        </div>
      </div>
    </div>
  );
}
