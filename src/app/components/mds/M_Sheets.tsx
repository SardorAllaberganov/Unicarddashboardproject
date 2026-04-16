import React from 'react';
import { X, Check, ChevronRight, Copy, Pencil, Share2, Trash2 } from 'lucide-react';
import { F, theme, MDS, Pair, T } from './frame';

/* ═══════════════════════════════════════════════════════════════════════════
   §7 FILTER SHEET  +  §11 BOTTOM SHEET
═══════════════════════════════════════════════════════════════════════════ */

function SheetHeader({
  left, title, right, dark, showHandle = false,
}: {
  left?: React.ReactNode;
  title: string;
  right?: React.ReactNode;
  dark: boolean;
  showHandle?: boolean;
}) {
  const t = theme(dark);
  return (
    <div>
      {showHandle && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: t.inputBorder }} />
        </div>
      )}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center',
        padding: '0 8px', borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{ minWidth: 56, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>{left}</div>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: F.inter, fontSize: '17px', fontWeight: 600, color: t.text1 }}>
          {title}
        </div>
        <div style={{ minWidth: 72, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
          {right}
        </div>
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

/* ─── §7 Filter Sheet ────────────────────────────────────────────────── */

function FilterRow({
  label, value, selected, dark,
}: { label: string; value?: string; selected?: boolean; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      minHeight: 52, background: t.surface,
      borderBottom: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', boxSizing: 'border-box',
    }}>
      <div style={{ flex: 1, fontFamily: F.inter, fontSize: '15px', color: t.text1 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {value && <span style={{ fontFamily: F.inter, fontSize: '15px', color: t.text3 }}>{value}</span>}
        {selected ? <Check size={20} color={t.blue} strokeWidth={2.5} /> : <ChevronRight size={20} color={t.textDisabled} />}
      </div>
    </div>
  );
}

function DateChip({ label, active, dark }: { label: string; active?: boolean; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      padding: '8px 14px', borderRadius: 20,
      background: active ? t.blue : t.surface,
      border: active ? `1px solid ${t.blue}` : `1px solid ${t.inputBorder}`,
      color: active ? '#FFFFFF' : t.text2,
      fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </div>
  );
}

function FilterSheetCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <div style={{ height: MDS.safeTop }} />
      <SheetHeader
        dark={dark}
        left={<div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={22} color={t.text1} />
        </div>}
        title="Фильтры"
        right={<span style={{ fontFamily: F.inter, fontSize: '15px', color: t.text3 }}>Сбросить</span>}
      />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <SectionLabel text="Период" dark={dark} />
        <div style={{ background: t.surface, padding: '12px 16px', borderBottom: `1px solid ${t.border}`, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Сегодня', 'Вчера', '7 дней', '30 дней', 'Этот месяц'].map((c, i) => (
            <DateChip key={c} label={c} active={i === 2} dark={dark} />
          ))}
        </div>

        <SectionLabel text="Организация" dark={dark} />
        <FilterRow label="Mysafar OOO"  selected dark={dark} />
        <FilterRow label="Alif Group"   selected dark={dark} />
        <FilterRow label="TechCom LLC"          dark={dark} />
        <FilterRow label="UzInvest"             dark={dark} />

        <SectionLabel text="Статус карты" dark={dark} />
        <FilterRow label="Активна"  selected dark={dark} />
        <FilterRow label="Продана"           dark={dark} />
        <FilterRow label="На паузе"          dark={dark} />

        <SectionLabel text="Тип карты" dark={dark} />
        <FilterRow label="Тип валюты"   value="VISA SUM" dark={dark} />
        <FilterRow label="KPI прогресс" value="2 / 3"    dark={dark} />

        <div style={{ height: 24 }} />
      </div>

      {/* Sticky footer */}
      <div style={{
        padding: '12px 16px', borderTop: `1px solid ${t.border}`,
        background: t.surface, display: 'flex', gap: 10,
        boxShadow: dark ? '0 -2px 12px rgba(0,0,0,0.4)' : '0 -2px 12px rgba(0,0,0,0.05)',
      }}>
        <button style={{
          flex: 1, height: 48, borderRadius: 12,
          background: t.surface, border: `1px solid ${t.inputBorder}`,
          fontFamily: F.inter, fontSize: '16px', fontWeight: 600, color: t.text2,
        }}>
          Сбросить
        </button>
        <button style={{
          flex: 1.4, height: 48, borderRadius: 12,
          background: t.blue, border: 'none',
          fontFamily: F.inter, fontSize: '16px', fontWeight: 600, color: '#FFFFFF',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          Применить <span style={{ opacity: 0.85, fontWeight: 500 }}>(3)</span>
        </button>
      </div>
      <div style={{ height: MDS.safeBottom, background: t.surface }} />
    </div>
  );
}

/* ─── §11 Bottom Sheet ───────────────────────────────────────────────── */

function SheetAction({
  icon: Icon, label, destructive, dark,
}: { icon: React.ElementType; label: string; destructive?: boolean; dark: boolean }) {
  const t = theme(dark);
  const color = destructive ? t.error : t.text1;
  const iconBg = destructive
    ? (dark ? 'rgba(248,113,113,0.15)' : '#FEF2F2')
    : t.blueLt;
  const iconColor = destructive ? t.error : t.blue;
  return (
    <div style={{
      minHeight: 56, display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 20px', borderBottom: `1px solid ${t.border}`,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={iconColor} strokeWidth={2} />
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '16px', fontWeight: 500, color }}>
        {label}
      </span>
    </div>
  );
}

function BottomSheetCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ position: 'relative', height: '100%', background: t.pageBg }}>
      {/* Dimmed "page" behind the sheet */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ height: MDS.safeTop, background: t.pageBg }} />
        <div style={{ padding: 16 }}>
          <div style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, marginBottom: 8, opacity: 0.4 }}>
            Mysafar OOO
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '15px', color: t.text3, opacity: 0.4 }}>
            28 продавцов · 498 карт · KPI 3 — 45
          </div>
        </div>
      </div>
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: dark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)' }} />

      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: t.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        boxShadow: dark ? '0 -4px 24px rgba(0,0,0,0.6)' : '0 -4px 24px rgba(17,24,39,0.15)',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: t.inputBorder }} />
        </div>
        <div style={{ padding: '8px 20px 16px', fontFamily: F.dm, fontSize: '17px', fontWeight: 600, color: t.text1 }}>
          Действия с организацией
        </div>
        <SheetAction icon={Pencil} label="Редактировать"     dark={dark} />
        <SheetAction icon={Copy}   label="Дублировать"       dark={dark} />
        <SheetAction icon={Share2} label="Поделиться ссылкой" dark={dark} />
        <SheetAction icon={Trash2} label="Удалить" destructive dark={dark} />
        <div style={{ padding: '12px 16px' }}>
          <button style={{
            width: '100%', height: 48, borderRadius: 12,
            background: dark ? 'rgba(160,165,184,0.12)' : '#F3F4F6',
            border: 'none',
            fontFamily: F.inter, fontSize: '16px', fontWeight: 600, color: t.text2,
          }}>
            Отмена
          </button>
        </div>
        <div style={{ height: MDS.safeBottom }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC
═══════════════════════════════════════════════════════════════════════════ */

export const M_Sheets = {
  FilterSheet: ({ t: _t }: { t: T }) => (
    <Pair height={820} note="Full-screen filter. Header with X/title/Сбросить, 4 filter groups, sticky footer with count of active filters on the primary button.">
      {(dark) => <FilterSheetCol dark={dark} />}
    </Pair>
  ),
  BottomSheet: ({ t: _t }: { t: T }) => (
    <Pair height={720} note="Slide-up action sheet over dimmed page. Handle bar, 4 list actions + destructive ‘Удалить’ in error color, Cancel button below.">
      {(dark) => <BottomSheetCol dark={dark} />}
    </Pair>
  ),
};
