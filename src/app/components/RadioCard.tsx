import React, { useEffect, useRef, useState } from 'react';
import { F, C, D, theme } from './ds/tokens';
import { useDarkMode } from './useDarkMode';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   RadioCard — Prompt 0 §11

   Accessible radio card group implementing the WAI-ARIA radiogroup pattern:
     • role="radiogroup" on the container with aria-label
     • role="radio" on each card with aria-checked
     • roving tabindex — only the selected card is in the Tab sequence;
       other cards are reached via ↑/↓/←/→ arrow keys
     • Home / End jump to first / last
     • Focus ring rendered only for keyboard focus (:focus-visible)

   Theming: reads global dark mode via useDarkMode(). Pass `dark` prop to
   force a variant (used by showcase pages). Per-option `disabled` is also
   supported.

   Use for M-03 recipients selector, C-05 assignment target, and any place
   where the user picks one option from a small set with descriptive text.
═══════════════════════════════════════════════════════════════════════════ */

export interface RadioOption<T extends string | number> {
  value: T;
  label: string;
  sub?: string;
  disabled?: boolean;
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
  /** Force theme variant. Omit to follow the global useDarkMode() store. */
  dark?: boolean;
}

/* ── Scoped stylesheet for :focus-visible (inline styles can't express it).
   Uses a CSS variable so the ring color can follow the option's theme. ── */

const STYLE_ID = 'rc-focus-styles';

function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .rc-option { outline: none; }
    .rc-option:focus-visible {
      outline: 2px solid var(--rc-focus-ring, ${C.focusRing});
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
  dark: darkProp,
}: RadioGroupProps<T>) {
  const [globalDark] = useDarkMode();
  const dark = darkProp ?? globalDark;
  const t = theme(dark);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => { ensureStyles(); }, []);

  const enabled = options.map((o, i) => ({ o, i })).filter(x => !x.o.disabled);

  const focusIndex = (rawIdx: number) => {
    if (enabled.length === 0) return;
    const n = enabled.length;
    const wrapped = ((rawIdx % n) + n) % n;
    const target = enabled[wrapped];
    onChange(target.o.value);
    requestAnimationFrame(() => {
      refs.current[target.i]?.focus();
    });
  };

  const currentEnabledIdx = Math.max(
    0,
    enabled.findIndex(x => x.o.value === value)
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        focusIndex(currentEnabledIdx + 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        focusIndex(currentEnabledIdx - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusIndex(0);
        break;
      case 'End':
        e.preventDefault();
        focusIndex(enabled.length - 1);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (enabled[currentEnabledIdx]) onChange(enabled[currentEnabledIdx].o.value);
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
        // Scoped CSS variable so :focus-visible ring follows this group's theme.
        ['--rc-focus-ring' as string]: t.focusRing,
      } as React.CSSProperties}
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
            tabIndex={opt.disabled ? -1 : (selected ? 0 : -1)}
            orientation={orientation}
            onSelect={() => !opt.disabled && onChange(opt.value)}
            dark={dark}
            t={t}
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
  dark: boolean;
  t: T;
}

const RadioCardCell = React.forwardRef<HTMLDivElement, RadioCardCellProps<string | number>>(
  function RadioCardCell({ name, option, selected, tabIndex, orientation, onSelect, dark, t }, ref) {
    const [hov, setHov] = useState(false);
    const disabled = !!option.disabled;

    // Resolve border/bg/text colors based on priority: disabled > selected > hover > default.
    let border: string;
    let padding: string;
    let bg: string;
    let titleColor: string;
    let subColor: string;

    if (disabled) {
      border     = `1px solid ${dark ? D.border : C.inputBorder}`;
      padding    = '12px';
      bg         = dark ? D.tableAlt : '#F9FAFB';
      titleColor = dark ? D.text4    : C.text4;
      subColor   = dark ? D.text4    : C.text4;
    } else if (selected) {
      border     = `2px solid ${t.blue}`;
      padding    = '11px';
      bg         = t.blueLt;
      titleColor = dark ? D.text1 : C.text1;
      subColor   = dark ? D.text2 : C.text3;
    } else if (hov) {
      border     = `1px solid ${dark ? D.text4 : '#9CA3AF'}`;
      padding    = '12px';
      bg         = dark ? D.tableHover : '#F9FAFB';
      titleColor = dark ? D.text1 : C.text1;
      subColor   = dark ? D.text2 : C.text3;
    } else {
      border     = `1px solid ${dark ? D.border : C.inputBorder}`;
      padding    = '12px';
      bg         = 'transparent';
      titleColor = dark ? D.text1 : C.text1;
      subColor   = dark ? D.text2 : C.text3;
    }

    return (
      <div
        ref={ref}
        className="rc-option"
        role="radio"
        aria-checked={selected}
        aria-disabled={disabled || undefined}
        tabIndex={tabIndex}
        data-name={name}
        onClick={disabled ? undefined : onSelect}
        onMouseDown={disabled ? undefined : (e => {
          // Prevent the blur/refocus dance that would surface :focus-visible
          // on pure mouse interaction; keyboard focus still works.
          if (e.button === 0) e.currentTarget.focus({ preventScroll: true });
        })}
        onMouseEnter={disabled ? undefined : () => setHov(true)}
        onMouseLeave={disabled ? undefined : () => setHov(false)}
        style={{
          flex: orientation === 'horizontal' ? 1 : undefined,
          minWidth: 0,
          padding,
          border,
          borderRadius: '10px',
          background: bg,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.7 : 1,
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          transition: 'background 0.12s, border-color 0.12s',
        }}
      >
        <RadioIndicator selected={selected} disabled={disabled} dark={dark} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
            color: titleColor, lineHeight: 1.3,
          }}>
            {option.label}
          </div>
          {option.sub && (
            <div style={{
              fontFamily: F.inter, fontSize: '12px', color: subColor,
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

export function RadioIndicator({ selected, disabled, dark: darkProp }: {
  selected: boolean; disabled?: boolean; dark?: boolean;
}) {
  const [globalDark] = useDarkMode();
  const dark = darkProp ?? globalDark;
  const t = theme(dark);

  const ringColor = selected
    ? t.blue
    : disabled
      ? (dark ? D.textDisabled : C.textDisabled)
      : (dark ? D.text4 : C.inputBorder);

  return (
    <span
      aria-hidden="true"
      style={{
        width: '18px', height: '18px', borderRadius: '50%',
        border: selected ? `none` : `2px solid ${ringColor}`,
        background: selected ? t.blue : 'transparent',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
        transition: 'border-color 0.12s, background 0.12s',
      }}
    >
      {selected && (
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%', background: '#FFFFFF',
        }} />
      )}
    </span>
  );
}
