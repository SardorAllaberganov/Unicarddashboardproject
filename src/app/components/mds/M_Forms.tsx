import React from 'react';
import { ChevronDown, ChevronLeft, Search, X, Check, AlertCircle, Info } from 'lucide-react';
import { F, theme, MDS, Pair, VariantLabel, T } from './frame';

/* ═══════════════════════════════════════════════════════════════════════════
   §10 FORM LAYOUT  +  §12 STICKY ACTION BAR  +  §17 SEARCH BAR
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Shared field primitives ───────────────────────────────────────── */

function Label({ text, dark, required }: { text: string; dark: boolean; required?: boolean }) {
  const t = theme(dark);
  return (
    <label style={{
      fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
      color: t.text2, display: 'block', marginBottom: 6,
    }}>
      {text} {required && <span style={{ color: t.error }}>*</span>}
    </label>
  );
}

function TextInput({
  value, placeholder, suffix, state = 'default', dark,
}: {
  value?: string; placeholder?: string; suffix?: string;
  state?: 'default' | 'focus' | 'error' | 'disabled';
  dark: boolean;
}) {
  const t = theme(dark);
  const isFocus = state === 'focus';
  const isError = state === 'error';
  const isDisabled = state === 'disabled';
  const border = isError ? t.error : isFocus ? t.blue : t.inputBorder;
  const borderWidth = isFocus || isError ? 2 : 1;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        height: 48, borderRadius: 12,
        border: `${borderWidth}px solid ${border}`,
        background: isDisabled ? t.pageBg : t.surface,
        padding: '0 16px', display: 'flex', alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        <span style={{
          flex: 1, fontFamily: F.inter, fontSize: '15px',
          color: isDisabled ? t.textDisabled : (value ? t.text1 : t.text4),
        }}>
          {value || placeholder}
        </span>
        {suffix && <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text4 }}>{suffix}</span>}
      </div>
    </div>
  );
}

function Helper({ text, kind = 'hint', dark }: { text: string; kind?: 'hint' | 'error'; dark: boolean }) {
  const t = theme(dark);
  const color = kind === 'error' ? t.error : t.text3;
  return (
    <div style={{
      marginTop: 6, display: 'flex', gap: 4, alignItems: 'center',
      fontFamily: F.inter, fontSize: '13px', color,
    }}>
      {kind === 'error' ? <AlertCircle size={13} /> : <Info size={13} />}
      <span>{text}</span>
    </div>
  );
}

function SelectField({ value, dark }: { value: string; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      height: 48, borderRadius: 12, border: `1px solid ${t.inputBorder}`,
      background: t.surface, padding: '0 16px',
      display: 'flex', alignItems: 'center', gap: 8, boxSizing: 'border-box',
    }}>
      <span style={{ flex: 1, fontFamily: F.inter, fontSize: '15px', color: t.text1 }}>{value}</span>
      <ChevronDown size={18} color={t.text3} />
    </div>
  );
}

function ToggleRow({ label, sub, on, dark }: { label: string; sub?: string; on: boolean; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      minHeight: 52, display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', background: t.surface,
      borderBottom: `1px solid ${t.border}`,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.inter, fontSize: '15px', fontWeight: 500, color: t.text1 }}>{label}</div>
        {sub && <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        width: 52, height: 32, borderRadius: 16,
        background: on ? t.blue : t.border,
        position: 'relative', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 22 : 2,
          width: 28, height: 28, borderRadius: '50%',
          background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  );
}

function SectionLabel({ text, dark }: { text: string; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
      color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '24px 16px 8px',
    }}>
      {text}
    </div>
  );
}

/* ─── §10 Form layout ───────────────────────────────────────────────── */

function FormLayoutCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <div style={{ height: MDS.safeTop }} />
      <div style={{
        height: MDS.headerH, display: 'flex', alignItems: 'center', padding: '0 8px',
        borderBottom: `1px solid ${t.border}`, background: t.surface,
      }}>
        <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={22} color={t.text1} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: F.inter, fontSize: '17px', fontWeight: 600, color: t.text1 }}>
          Новый продавец
        </div>
        <div style={{ width: 72 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <SectionLabel text="Личные данные" dark={dark} />
        <div style={{ background: t.surface, padding: '16px' }}>
          <Label text="Полное имя" dark={dark} required />
          <TextInput value="Абдуллох Рашидов" state="default" dark={dark} />
          <Helper text="Как указано в паспорте" dark={dark} />
        </div>
        <div style={{ background: t.surface, padding: '16px', borderTop: `1px solid ${t.border}` }}>
          <Label text="Телефон" dark={dark} required />
          <TextInput value="+998 90 123 45 67" state="focus" dark={dark} />
        </div>
        <div style={{ background: t.surface, padding: '16px', borderTop: `1px solid ${t.border}` }}>
          <Label text="Email" dark={dark} />
          <TextInput value="not-an-email" state="error" dark={dark} />
          <Helper text="Неверный формат email" kind="error" dark={dark} />
        </div>

        <SectionLabel text="Рабочие данные" dark={dark} />
        <div style={{ background: t.surface, padding: '16px' }}>
          <Label text="Организация" dark={dark} />
          <SelectField value="Mysafar OOO" dark={dark} />
        </div>
        <div style={{ background: t.surface, padding: '16px', borderTop: `1px solid ${t.border}` }}>
          <Label text="UCOIN кошелёк" dark={dark} />
          <TextInput value="UCOIN-ABD-20240115" suffix="Скан" state="disabled" dark={dark} />
          <Helper text="Заполняется автоматически после сканирования" dark={dark} />
        </div>

        <SectionLabel text="Уведомления" dark={dark} />
        <ToggleRow label="Email при KPI начислении"  sub="Стандартно включено" on={true}  dark={dark} />
        <ToggleRow label="Push в приложении"                                   on={true}  dark={dark} />
        <ToggleRow label="SMS рассылка"                 sub="Платно"           on={false} dark={dark} />

        <div style={{ height: 120 }} />
      </div>

      {/* Sticky action */}
      <div style={{
        padding: '12px 16px', background: t.surface,
        borderTop: `1px solid ${t.border}`,
        boxShadow: dark ? '0 -2px 12px rgba(0,0,0,0.4)' : '0 -2px 12px rgba(0,0,0,0.05)',
      }}>
        <button style={{
          width: '100%', height: 48, borderRadius: 12,
          background: t.blue, border: 'none',
          fontFamily: F.inter, fontSize: '16px', fontWeight: 600, color: '#FFFFFF',
        }}>
          Создать продавца
        </button>
      </div>
      <div style={{ height: MDS.safeBottom, background: t.surface }} />
    </div>
  );
}

/* ─── §12 Sticky action bar (isolation demo) ────────────────────────── */

function StickyActionCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <div style={{ height: MDS.safeTop }} />
      <div style={{
        height: MDS.headerH, display: 'flex', alignItems: 'center', padding: '0 8px',
        borderBottom: `1px solid ${t.border}`, background: t.surface,
      }}>
        <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} color={t.blue} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: F.inter, fontSize: '17px', fontWeight: 600, color: t.text1 }}>
          Оплата
        </div>
        <div style={{ width: 48 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <div style={{
          background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 16,
        }}>
          <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: 4 }}>
            Получатель
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '17px', fontWeight: 500, color: t.text1 }}>
            Камола Юсупова
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', color: t.text3, marginTop: 2 }}>
            UCOIN-KAM-20240312
          </div>
        </div>
        <div style={{ height: 12 }} />
        <div style={{
          background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 16,
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        }}>
          <span style={{ fontFamily: F.inter, fontSize: '15px', color: t.text2 }}>Сумма</span>
          <span style={{ fontFamily: F.mono, fontSize: '22px', fontWeight: 600, color: t.text1 }}>
            150 000 UZS
          </span>
        </div>
        <VariantLabel text="Scroll further — more content above bar" dark={dark} />
        <div style={{ height: 280, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16 }} />
      </div>

      {/* Sticky action — blurred when scrolled */}
      <div style={{
        padding: '12px 16px',
        background: dark ? 'rgba(26,29,39,0.92)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        borderTop: `1px solid ${t.border}`,
        boxShadow: dark ? '0 -2px 12px rgba(0,0,0,0.4)' : '0 -2px 12px rgba(0,0,0,0.05)',
      }}>
        <button style={{
          width: '100%', height: 48, borderRadius: 12,
          background: t.blue, border: 'none',
          fontFamily: F.inter, fontSize: '16px', fontWeight: 600, color: '#FFFFFF',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Check size={18} strokeWidth={2.5} /> Подтвердить 150 000 UZS
        </button>
      </div>
      <div style={{ height: MDS.safeBottom, background: dark ? 'rgba(26,29,39,0.92)' : 'rgba(255,255,255,0.92)' }} />
    </div>
  );
}

/* ─── §17 Search bar ─────────────────────────────────────────────────── */

function SearchBar({
  value, placeholder = 'Поиск...', focused, dark, showCancel,
}: { value?: string; placeholder?: string; focused?: boolean; dark: boolean; showCancel?: boolean }) {
  const t = theme(dark);
  const fillBg = dark ? '#2D3148' : '#F3F4F6';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', height: 44 }}>
      <div style={{
        flex: 1, height: 36, borderRadius: 12,
        background: fillBg, border: focused ? `2px solid ${t.blue}` : '2px solid transparent',
        padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8, boxSizing: 'border-box',
      }}>
        <Search size={18} color={t.text3} strokeWidth={2} />
        <span style={{
          flex: 1, fontFamily: F.inter, fontSize: '15px',
          color: value ? t.text1 : t.text4,
        }}>
          {value || placeholder}
        </span>
        {value && (
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: t.text4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={12} color={t.surface} strokeWidth={3} />
          </div>
        )}
      </div>
      {showCancel && (
        <span style={{ fontFamily: F.inter, fontSize: '15px', color: t.blue, paddingRight: 4 }}>Отмена</span>
      )}
    </div>
  );
}

function SearchCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: t.pageBg, height: '100%' }}>
      <div style={{ height: MDS.safeTop }} />

      <div style={{ padding: '8px 0' }}>
        <VariantLabel text="Default (empty)" dark={dark} />
      </div>
      <SearchBar dark={dark} />

      <div style={{ padding: '16px 0 8px' }}>
        <VariantLabel text="Focused + cancel button" dark={dark} />
      </div>
      <SearchBar dark={dark} focused showCancel />

      <div style={{ padding: '16px 0 8px' }}>
        <VariantLabel text="With value + clear icon" dark={dark} />
      </div>
      <SearchBar dark={dark} value="Абдуллох" focused showCancel />

      <div style={{ padding: '16px 16px 8px' }}>
        <VariantLabel text="Live results preview" dark={dark} />
      </div>
      <div style={{ background: t.surface, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
        {['Абдуллох Рашидов — Mysafar OOO', 'Абдуррахмон К. — TechCom', 'Абдулла Н. — Alif Group'].map((row) => (
          <div key={row} style={{
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
            borderBottom: `1px solid ${t.border}`,
          }}>
            <Search size={16} color={t.text4} />
            <span style={{ fontFamily: F.inter, fontSize: '15px', color: t.text1 }}>{row}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 16px 16px', fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>
        Recent searches · tap to restore
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC
═══════════════════════════════════════════════════════════════════════════ */

export const M_Forms = {
  Layout: ({ t: _t }: { t: T }) => (
    <Pair height={900} note="Modal-style form. Grouped sections, 48 px inputs, focus state shows 2 px blue border + error state shows red border + error caption. Sticky Create button at bottom.">
      {(dark) => <FormLayoutCol dark={dark} />}
    </Pair>
  ),
  StickyAction: ({ t: _t }: { t: T }) => (
    <Pair height={820} note="Sticky primary at viewport bottom. When scrolled, bar bg becomes blurred translucent (rgba with backdrop-blur) so content shows through.">
      {(dark) => <StickyActionCol dark={dark} />}
    </Pair>
  ),
  Search: ({ t: _t }: { t: T }) => (
    <Pair height={620} note="44 px bar with fill (no border). Focused adds 2 px blue border + Отмена text button. With value adds X clear. Below: live results preview.">
      {(dark) => <SearchCol dark={dark} />}
    </Pair>
  ),
};
