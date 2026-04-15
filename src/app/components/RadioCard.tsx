import React, { useEffect, useRef } from 'react';
import { F, C } from './ds/tokens';

/* ═══════════════════════════════════════════════════════════════════════════
   RadioCard — Prompt 0 §11

   Accessible radio card group implementing the WAI-ARIA radiogroup pattern:
     • role="radiogroup" on the container with aria-label
     • role="radio" on each card with aria-checked
     • roving tabindex — only the selected card is in the Tab sequence;
       other cards are reached via ↑/↓/←/→ arrow keys
     • Home / End jump to first / last
     • Focus ring rendered only for keyboard focus (:focus-visible)

   Use for M-03 recipients selector, C-05 assignment target, and any place
   where the user picks one option from a small set with descriptive text.
═══════════════════════════════════════════════════════════════════════════ */

export interface RadioOption<T extends string | number> {
  value: T;
  label: string;
  sub?: string;
  /** Extra inline content (e.g. date pickers) rendered below when selected. */
  children?: React.ReactNode;
}

export interface RadioGroupProps<T extends string | number> {
  label: string;
  name: string;
  value: T;
  options: RadioOption<T>[];
  onChange: (next: T) => void;
  orientation?: 'horizontal' | 'vertical';
}

/* ── Scoped stylesheet for :focus-visible (inline styles can't express it) ── */

const STYLE_ID = 'rc-focus-styles';

function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .rc-option { outline: none; }
    .rc-option:focus-visible {
      outline: 2px solid ${C.blue};
      outline-offset: 2px;
      border-radius: 10px;
    }
  `;
  document.head.appendChild(style);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RadioGroup
═══════════════════════════════════════════════════════════════════════════ */

export function RadioGroup<T extends string | number>({
  label,
  name,
  value,
  options,
  onChange,
  orientation = 'vertical',
}: RadioGroupProps<T>) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => { ensureStyles(); }, []);

  const focusIndex = (idx: number) => {
    const n = options.length;
    if (n === 0) return;
    const wrapped = ((idx % n) + n) % n;
    onChange(options[wrapped].value);
    // Move DOM focus after the state update has re-rendered tabindex=0 onto it
    requestAnimationFrame(() => {
      refs.current[wrapped]?.focus();
    });
  };

  const currentIndex = Math.max(0, options.findIndex(o => o.value === value));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        focusIndex(currentIndex + 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        focusIndex(currentIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusIndex(0);
        break;
      case 'End':
        e.preventDefault();
        focusIndex(options.length - 1);
        break;
      case ' ':
      case 'Enter':
        // When a radio has focus, Space/Enter should (re)select it;
        // since it's already focused, this is a no-op but we still
        // swallow the event.
        e.preventDefault();
        onChange(options[currentIndex].value);
        break;
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: '10px',
        alignItems: 'stretch',
      }}
    >
      {options.map((opt, i) => {
        const selected = opt.value === value;
        return (
          <RadioCardCell
            key={String(opt.value)}
            ref={el => { refs.current[i] = el; }}
            name={name}
            option={opt}
            selected={selected}
            tabIndex={selected ? 0 : -1}
            orientation={orientation}
            onSelect={() => onChange(opt.value)}
          />
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RadioCardCell — one option
═══════════════════════════════════════════════════════════════════════════ */

interface RadioCardCellProps<T extends string | number> {
  name: string;
  option: RadioOption<T>;
  selected: boolean;
  tabIndex: 0 | -1;
  orientation: 'horizontal' | 'vertical';
  onSelect: () => void;
}

const RadioCardCell = React.forwardRef<HTMLDivElement, RadioCardCellProps<string | number>>(
  function RadioCardCell({ name, option, selected, tabIndex, orientation, onSelect }, ref) {
    const border = selected ? `2px solid ${C.blue}` : `1px solid ${C.inputBorder}`;
    const padding = selected ? '11px' : '12px'; // compensates the 1px thicker border
    const bg = selected ? '#EFF6FF' : C.surface;

    return (
      <div
        ref={ref}
        className="rc-option"
        role="radio"
        aria-checked={selected}
        tabIndex={tabIndex}
        data-name={name}
        onClick={onSelect}
        onMouseDown={e => {
          // Prevent the blur/refocus dance that would surface :focus-visible
          // on pure mouse interaction; keyboard focus still works.
          if (e.button === 0) e.currentTarget.focus({ preventScroll: true });
        }}
        style={{
          flex: orientation === 'horizontal' ? 1 : undefined,
          minWidth: 0,
          padding,
          border,
          borderRadius: '10px',
          background: bg,
          cursor: 'pointer',
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          transition: 'background 0.12s, border-color 0.12s',
        }}
      >
        <RadioIndicator selected={selected} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
            color: C.text1, lineHeight: 1.3,
          }}>
            {option.label}
          </div>
          {option.sub && (
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: C.text3,
              marginTop: '3px', lineHeight: 1.4,
            }}>
              {option.sub}
            </div>
          )}
          {selected && option.children && (
            <div
              onClick={e => e.stopPropagation()}
              style={{ marginTop: '10px' }}
            >
              {option.children}
            </div>
          )}
        </div>
      </div>
    );
  }
) as <T extends string | number>(props: RadioCardCellProps<T> & { ref?: React.Ref<HTMLDivElement> }) => React.ReactElement;

/* ═══════════════════════════════════════════════════════════════════════════
   RadioIndicator — 18×18 circle (hollow / filled)
═══════════════════════════════════════════════════════════════════════════ */

export function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: '18px', height: '18px', borderRadius: '50%',
        border: `1.5px solid ${selected ? C.blue : C.inputBorder}`,
        background: C.surface,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
        transition: 'border-color 0.12s',
      }}
    >
      {selected && (
        <span style={{
          width: '9px', height: '9px', borderRadius: '50%', background: C.blue,
        }} />
      )}
    </span>
  );
}
