import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { F, C } from './ds/tokens';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

export interface DateRange {
  from: string; // YYYY-MM-DD
  to: string;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════════════ */

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const PRESETS = [
  'Сегодня',
  'Вчера',
  'Последние 7 дней',
  'Последние 30 дней',
  'Этот месяц',
  'Прошлый месяц',
  'Этот квартал',
  'Этот год',
] as const;

type Preset = typeof PRESETS[number];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function fmtDisplay(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

function parseDate(s: string): Date {
  return new Date(s + 'T00:00:00');
}

function resolvePreset(preset: Preset): DateRange {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = (offset: number) => { const x = new Date(today); x.setDate(x.getDate() + offset); return x; };

  switch (preset) {
    case 'Сегодня': return { from: fmt(today), to: fmt(today) };
    case 'Вчера': { const y = d(-1); return { from: fmt(y), to: fmt(y) }; }
    case 'Последние 7 дней': return { from: fmt(d(-6)), to: fmt(today) };
    case 'Последние 30 дней': return { from: fmt(d(-29)), to: fmt(today) };
    case 'Этот месяц': {
      const s = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: fmt(s), to: fmt(today) };
    }
    case 'Прошлый месяц': {
      const s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const e = new Date(today.getFullYear(), today.getMonth(), 0);
      return { from: fmt(s), to: fmt(e) };
    }
    case 'Этот квартал': {
      const q = Math.floor(today.getMonth() / 3) * 3;
      const s = new Date(today.getFullYear(), q, 1);
      return { from: fmt(s), to: fmt(today) };
    }
    case 'Этот год': {
      const s = new Date(today.getFullYear(), 0, 1);
      return { from: fmt(s), to: fmt(today) };
    }
  }
}

function matchPreset(range: DateRange): Preset | null {
  for (const p of PRESETS) {
    const r = resolvePreset(p);
    if (r.from === range.from && r.to === range.to) return p;
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CALENDAR MONTH
═══════════════════════════════════════════════════════════════════════════ */

function CalendarMonth({ year, month, from, to, onDayClick, onDayHover }: {
  year: number; month: number;
  from: string | null; to: string | null;
  onDayClick: (date: string) => void;
  onDayHover: (date: string | null) => void;
}) {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const today = fmt(new Date());

  return (
    <div>
      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '4px' }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
            color: C.text4, padding: '4px 0',
          }}>
            {d}
          </div>
        ))}
      </div>
      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} style={{ height: '32px' }} />;

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const isFrom = dateStr === from;
          const isTo = dateStr === to;
          const isSelected = isFrom || isTo;
          const inRange = from && to && dateStr > from && dateStr < to;
          const isToday = dateStr === today;

          let bg = 'transparent';
          let color = C.text1;
          let radius = '50%';
          let fontWeight = 400;

          if (isSelected) {
            bg = C.blue;
            color = '#FFFFFF';
            fontWeight = 600;
          } else if (inRange) {
            bg = C.blueLt;
            color = C.blue;
            radius = '0';
          }

          if (isFrom && to) radius = '50% 0 0 50%';
          if (isTo && from) radius = '0 50% 50% 0';
          if (isFrom && isTo) radius = '50%';

          return (
            <div
              key={i}
              onClick={() => onDayClick(dateStr)}
              onMouseEnter={() => onDayHover(dateStr)}
              onMouseLeave={() => onDayHover(null)}
              style={{
                height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: radius,
                background: bg,
                cursor: 'pointer',
                transition: 'background 0.1s',
                position: 'relative',
              }}
            >
              <span style={{
                fontFamily: F.inter, fontSize: '13px', fontWeight,
                color, lineHeight: 1,
              }}>
                {d}
              </span>
              {isToday && !isSelected && (
                <div style={{
                  position: 'absolute', bottom: '3px',
                  width: '4px', height: '4px', borderRadius: '50%',
                  background: C.blue,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<'start' | 'end'>('start');
  const [draftFrom, setDraftFrom] = useState<string | null>(value.from);
  const [draftTo, setDraftTo] = useState<string | null>(value.to);
  const [hoverDay, setHoverDay] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(() => matchPreset(value));
  const [appliedPreset, setAppliedPreset] = useState<Preset | null>(() => matchPreset(value));

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [popAlign, setPopAlign] = useState<'left' | 'right'>('left');

  // Calendar navigation: left month
  const initDate = parseDate(value.from);
  const [leftYear, setLeftYear] = useState(initDate.getFullYear());
  const [leftMonth, setLeftMonth] = useState(initDate.getMonth());

  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;
  const rightMonth = (leftMonth + 1) % 12;

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Align popover
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopAlign(rect.left + 700 > window.innerWidth ? 'right' : 'left');
    }
  }, [open]);

  const handleTriggerClick = () => {
    if (!open) {
      setDraftFrom(value.from);
      setDraftTo(value.to);
      setSelectedPreset(matchPreset(value));
      setPhase('start');
      const d = parseDate(value.from);
      setLeftYear(d.getFullYear());
      setLeftMonth(d.getMonth());
    }
    setOpen(o => !o);
  };

  const handlePresetClick = (preset: Preset) => {
    const r = resolvePreset(preset);
    setDraftFrom(r.from);
    setDraftTo(r.to);
    setSelectedPreset(preset);
    setPhase('start');
    const d = parseDate(r.from);
    setLeftYear(d.getFullYear());
    setLeftMonth(d.getMonth());
  };

  const handleDayClick = useCallback((dateStr: string) => {
    if (phase === 'start') {
      setDraftFrom(dateStr);
      setDraftTo(null);
      setSelectedPreset(null);
      setPhase('end');
    } else {
      if (draftFrom && dateStr < draftFrom) {
        setDraftFrom(dateStr);
        setDraftTo(draftFrom);
      } else {
        setDraftTo(dateStr);
      }
      setPhase('start');
    }
  }, [phase, draftFrom]);

  const navBack = () => {
    if (leftMonth === 0) { setLeftYear(y => y - 1); setLeftMonth(11); }
    else setLeftMonth(m => m - 1);
  };

  const navForward = () => {
    if (leftMonth === 11) { setLeftYear(y => y + 1); setLeftMonth(0); }
    else setLeftMonth(m => m + 1);
  };

  const canApply = !!(draftFrom && draftTo);

  const handleApply = () => {
    if (draftFrom && draftTo) {
      onChange({ from: draftFrom, to: draftTo });
      setAppliedPreset(selectedPreset);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Display range for hover
  const dispFrom = draftFrom;
  const dispTo = phase === 'end' && hoverDay && draftFrom
    ? (hoverDay < draftFrom ? hoverDay : hoverDay)
    : draftTo;

  // Bottom bar text
  const bottomText = draftFrom && draftTo
    ? `${fmtDisplay(parseDate(draftFrom))} – ${fmtDisplay(parseDate(draftTo))}`
    : draftFrom
    ? `${fmtDisplay(parseDate(draftFrom))} – ...`
    : 'Выберите дату';

  const hasApplied = !!(value.from && value.to);

  const NAV_BTN: React.CSSProperties = {
    width: '28px', height: '28px', borderRadius: '8px',
    border: `1px solid ${C.border}`, background: C.surface,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0,
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>

      {/* ── Trigger button ── */}
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        style={{
          height: '40px', padding: '0 14px', borderRadius: '8px', cursor: 'pointer',
          border: `1px solid ${open ? C.blue : C.inputBorder}`,
          background: C.surface,
          display: 'flex', alignItems: 'center', gap: '8px',
          boxShadow: open ? `0 0 0 3px ${C.blueTint}` : 'none',
          outline: 'none', whiteSpace: 'nowrap',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        <Calendar size={14} color={open ? C.blue : C.text3} style={{ flexShrink: 0 }} />
        {hasApplied ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {appliedPreset && (
              <>
                <span style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text1 }}>{appliedPreset}</span>
                <span style={{ color: C.border, fontSize: '13px' }}>·</span>
              </>
            )}
            <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.text3 }}>
              {fmtDisplay(parseDate(value.from))} – {fmtDisplay(parseDate(value.to))}
            </span>
          </span>
        ) : (
          <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text4 }}>Выберите период</span>
        )}
        <ChevronDown size={12} color={C.text3} style={{
          marginLeft: '2px', flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s',
        }} />
      </button>

      {/* ── Popover ── */}
      {open && (
        <div
          ref={popRef}
          style={{
            position: 'absolute', top: 'calc(100% + 8px)',
            ...(popAlign === 'left' ? { left: 0 } : { right: 0 }),
            zIndex: 9999, width: '700px',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '16px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.07)',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', minHeight: '340px' }}>

            {/* ── LEFT: Preset list ── */}
            <div style={{
              flexShrink: 0,
              borderRight: `1px solid ${C.border}`,
              padding: '14px 8px',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                fontFamily: F.inter, fontSize: '10px', fontWeight: 700,
                color: C.text4, letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '0 10px 10px',
              }}>
                Быстрый выбор
              </div>
              {PRESETS.map(preset => {
                const isActive = selectedPreset === preset;
                return (
                  <button
                    key={preset}
                    onClick={() => handlePresetClick(preset)}
                    style={{
                      width: '100%', height: '36px', padding: '0 10px',
                      borderRadius: '8px', border: 'none', cursor: 'pointer',
                      textAlign: 'left', display: 'flex', alignItems: 'center', gap: '9px',
                      background: isActive ? C.blueLt : 'transparent',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F9FAFB'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? C.blueLt : 'transparent'; }}
                  >
                    <div style={{
                      width: '15px', height: '15px', borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${isActive ? C.blue : C.border}`,
                      background: isActive ? C.blue : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.1s',
                    }}>
                      {isActive && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    <span style={{
                      fontFamily: F.inter, fontSize: '13px',
                      color: isActive ? C.blue : C.text2,
                      fontWeight: isActive ? 500 : 400,
                    }}>
                      {preset}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── RIGHT: Dual calendar ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              {/* Nav header */}
              <div style={{
                display: 'flex', alignItems: 'center',
                padding: '12px 16px 10px',
                borderBottom: `1px solid ${C.border}`, gap: '8px',
              }}>
                <button onClick={navBack} style={NAV_BTN}>
                  <ChevronLeft size={14} color={C.text3} />
                </button>
                <div style={{
                  flex: 1, textAlign: 'center',
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: C.text2,
                }}>
                  {MONTH_NAMES[leftMonth]} {leftYear}
                </div>
                <div style={{ width: '1px', height: '16px', background: C.border, flexShrink: 0 }} />
                <div style={{
                  flex: 1, textAlign: 'center',
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: C.text2,
                }}>
                  {MONTH_NAMES[rightMonth]} {rightYear}
                </div>
                <button onClick={navForward} style={NAV_BTN}>
                  <ChevronRight size={14} color={C.text3} />
                </button>
              </div>

              {/* Two calendars */}
              <div style={{ display: 'flex', flex: 1, padding: '12px 14px 14px', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <CalendarMonth
                    year={leftYear} month={leftMonth}
                    from={dispFrom} to={dispTo}
                    onDayClick={handleDayClick} onDayHover={setHoverDay}
                  />
                </div>
                <div style={{ width: '1px', background: C.border, flexShrink: 0, margin: '28px 0 0' }} />
                <div style={{ flex: 1 }}>
                  <CalendarMonth
                    year={rightYear} month={rightMonth}
                    from={dispFrom} to={dispTo}
                    onDayClick={handleDayClick} onDayHover={setHoverDay}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div style={{
            borderTop: `1px solid ${C.border}`,
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: C.pageBg,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={13} color={C.text4} />
              <span style={{ fontFamily: F.mono, fontSize: '12.5px', color: C.text1, fontWeight: 500 }}>
                {bottomText}
              </span>
              {phase === 'end' && (
                <span style={{
                  padding: '1px 7px', borderRadius: '4px',
                  background: '#FEF3C7', border: '1px solid #FDE68A',
                  fontFamily: F.inter, fontSize: '11px', color: '#B45309', fontWeight: 500,
                }}>
                  Выберите конечную дату
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCancel}
                style={{
                  height: '34px', padding: '0 16px', borderRadius: '8px',
                  border: `1px solid ${C.border}`, background: C.surface,
                  cursor: 'pointer', fontFamily: F.inter, fontSize: '13px',
                  color: C.text2, fontWeight: 500,
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleApply}
                disabled={!canApply}
                style={{
                  height: '34px', padding: '0 18px', borderRadius: '8px',
                  border: 'none',
                  background: canApply ? C.blue : C.border,
                  cursor: canApply ? 'pointer' : 'not-allowed',
                  fontFamily: F.inter, fontSize: '13px', color: '#fff', fontWeight: 600,
                  transition: 'background 0.15s',
                }}
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
