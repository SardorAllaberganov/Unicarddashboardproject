import React, { useState } from 'react';
import {
  ChevronRight, Pencil, Users, XCircle, Check, Trash2, Wallet,
  FileSpreadsheet, FileText, Mail, Copy, ChevronDown, X,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { PhoneFrame, MDS, SectionBlock } from '../components/mds/frame';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE BOTTOM SHEETS — references X-00 §11
   6 variants, each shown in PhoneFrame pair (light + dark).
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Shared sheet chrome ─────────────────────────────────────────────── */

function SheetFrame({
  children, dark, title,
}: { children: React.ReactNode; dark: boolean; title?: string }) {
  const t = theme(dark);
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: t.surface,
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      boxShadow: dark ? '0 -4px 24px rgba(0,0,0,0.6)' : '0 -4px 24px rgba(17,24,39,0.15)',
      paddingBottom: 16,
    }}>
      {/* Handle bar */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8 }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: t.inputBorder }} />
      </div>
      {title && (
        <div style={{
          padding: '4px 20px 12px', fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1,
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function DimmedBackdrop({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: t.pageBg,
      backgroundImage: dark
        ? 'repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0 60px, transparent 60px 120px)'
        : 'repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0 60px, transparent 60px 120px)',
    }}>
      {/* Fake page chrome */}
      <div style={{
        height: 56, borderBottom: `1px solid ${t.border}`, background: t.surface,
        display: 'flex', alignItems: 'center', padding: '0 16px',
      }}>
        <span style={{ fontFamily: F.dm, fontSize: 15, fontWeight: 700, color: t.text1 }}>
          Moment KPI
        </span>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            height: 56, borderRadius: 12,
            background: t.surface, border: `1px solid ${t.border}`,
          }} />
        ))}
      </div>
    </div>
  );
}

function SheetScreen({
  children, dark,
}: { children: React.ReactNode; dark: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <DimmedBackdrop dark={dark} />
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
      {children}
    </div>
  );
}

function ActionRow({
  icon: Icon, label, destructive, isLast, t, dark,
}: {
  icon: React.ElementType; label: string; destructive?: boolean; isLast?: boolean; t: T; dark: boolean;
}) {
  const color = destructive ? t.error : t.text1;
  const iconBg = destructive ? (dark ? 'rgba(248,113,113,0.15)' : '#FEF2F2') : t.blueLt;
  const iconColor = destructive ? t.error : t.blue;
  return (
    <div style={{
      minHeight: 52, display: 'flex', alignItems: 'center', gap: 14,
      padding: '12px 20px',
      borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={iconColor} strokeWidth={2} />
      </div>
      <span style={{ fontFamily: F.inter, fontSize: 16, fontWeight: 500, color }}>{label}</span>
    </div>
  );
}

function CancelButton({ t, dark }: { t: T; dark: boolean }) {
  return (
    <div style={{ padding: '12px 16px' }}>
      <div style={{
        width: '100%', height: 48, borderRadius: 12,
        background: dark ? 'rgba(160,165,184,0.12)' : '#F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.inter, fontSize: 16, fontWeight: 600, color: t.text2,
      }}>
        Отмена
      </div>
    </div>
  );
}

function PrimaryButton({
  label, t, destructive,
}: { label: string; t: T; destructive?: boolean }) {
  return (
    <div style={{
      width: '100%', height: 52, borderRadius: 12,
      background: destructive ? t.error : t.blue,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: '#FFFFFF',
    }}>
      {label}
    </div>
  );
}

function GhostButton({ label, t }: { label: string; t: T }) {
  return (
    <div style={{
      width: '100%', height: 48, borderRadius: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text2,
    }}>
      {label}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 1 — Action menu
═══════════════════════════════════════════════════════════════════════════ */

function Variant1({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <SheetScreen dark={dark}>
      <SheetFrame dark={dark} title="Действия">
        <ActionRow icon={Pencil} label="Редактировать" t={t} dark={dark} />
        <ActionRow icon={Users}  label="Назначить карты" t={t} dark={dark} />
        <div style={{ height: 8, background: dark ? '#1A1D27' : '#F9FAFB' }} />
        <ActionRow icon={XCircle} label="Деактивировать" destructive isLast t={t} dark={dark} />
        <CancelButton t={t} dark={dark} />
      </SheetFrame>
    </SheetScreen>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 2 — Filter quick pick (single-select)
═══════════════════════════════════════════════════════════════════════════ */

function Variant2({ dark, selected = 'По продажам' }: { dark: boolean; selected?: string }) {
  const t = theme(dark);
  const options = ['По имени', 'По дате', 'По продажам', 'По заработку'];
  return (
    <SheetScreen dark={dark}>
      <SheetFrame dark={dark} title="Сортировка">
        {options.map((opt, i) => {
          const isSelected = opt === selected;
          return (
            <div key={opt} style={{
              minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: i < options.length - 1 ? `1px solid ${t.border}` : 'none',
            }}>
              <span style={{ fontFamily: F.inter, fontSize: 16, color: t.text1 }}>{opt}</span>
              {isSelected && <Check size={22} color={t.blue} strokeWidth={2.5} />}
            </div>
          );
        })}
        <div style={{ paddingTop: 8 }}>
          <CancelButton t={t} dark={dark} />
        </div>
      </SheetFrame>
    </SheetScreen>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 3 — Confirm delete (destructive)
═══════════════════════════════════════════════════════════════════════════ */

function Variant3({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const errorBg = dark ? 'rgba(248,113,133,0.15)' : '#FEF2F2';
  return (
    <SheetScreen dark={dark}>
      <SheetFrame dark={dark}>
        <div style={{ padding: '8px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: errorBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Trash2 size={36} color={t.error} strokeWidth={2} />
          </div>
          <h2 style={{
            fontFamily: F.dm, fontSize: 20, fontWeight: 700, color: t.text1,
            margin: '0 0 8px', lineHeight: 1.3,
          }}>
            Удалить продавца?
          </h2>
          <p style={{
            fontFamily: F.inter, fontSize: 14, color: t.text3,
            margin: 0, lineHeight: 1.5,
          }}>
            <span style={{ fontWeight: 500, color: t.text2 }}>Санжар Мирзаев</span> будет удалён.
            Это действие нельзя отменить.
          </p>
        </div>
        <div style={{ padding: '0 16px 8px' }}>
          <PrimaryButton label="Удалить" t={t} destructive />
        </div>
        <GhostButton label="Отмена" t={t} />
      </SheetFrame>
    </SheetScreen>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 4 — Confirm simple action
═══════════════════════════════════════════════════════════════════════════ */

function Variant4({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const infoBg = dark ? 'rgba(59,130,246,0.10)' : '#F9FAFB';
  return (
    <SheetScreen dark={dark}>
      <SheetFrame dark={dark}>
        <div style={{ padding: '8px 20px 16px' }}>
          <h2 style={{
            fontFamily: F.dm, fontSize: 18, fontWeight: 600, color: t.text1,
            margin: '0 0 14px',
          }}>
            Подтвердить вывод средств?
          </h2>
          <div style={{
            background: infoBg, border: `1px solid ${t.border}`, borderRadius: 12,
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: t.blueLt,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Wallet size={20} color={t.blue} strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: F.mono, fontSize: 17, fontWeight: 700, color: t.text1 }}>
                50 000 UZS
              </div>
              <div style={{ fontFamily: F.inter, fontSize: 13, color: t.text3, marginTop: 2 }}>
                → Санжар Мирзаев
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '0 16px 8px' }}>
          <PrimaryButton label="Подтвердить" t={t} />
        </div>
        <GhostButton label="Отмена" t={t} />
      </SheetFrame>
    </SheetScreen>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 5 — Share / Export options
═══════════════════════════════════════════════════════════════════════════ */

function Variant5({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const rows: Array<{ icon: React.ElementType; label: string; tint: string; tintFg: string }> = [
    { icon: FileSpreadsheet, label: 'Excel файл (.xlsx)',  tint: dark ? 'rgba(52,211,153,0.15)' : '#F0FDF4', tintFg: dark ? '#34D399' : '#16A34A' },
    { icon: FileText,        label: 'PDF документ',         tint: dark ? 'rgba(251,113,133,0.15)' : '#FEF2F2', tintFg: dark ? '#FB7185' : '#DC2626' },
    { icon: Mail,            label: 'Отправить на email',   tint: dark ? 'rgba(59,130,246,0.15)' : '#EFF6FF', tintFg: dark ? '#3B82F6' : '#2563EB' },
    { icon: Copy,            label: 'Копировать ссылку',    tint: dark ? 'rgba(160,165,184,0.15)' : '#F3F4F6', tintFg: dark ? '#A0A5B8' : '#4B5563' },
  ];
  return (
    <SheetScreen dark={dark}>
      <SheetFrame dark={dark} title="Экспорт отчёта">
        {rows.map((row, i) => {
          const Icon = row.icon;
          return (
            <div key={row.label} style={{
              minHeight: 52, display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 20px',
              borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : 'none',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: row.tint,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color={row.tintFg} strokeWidth={2} />
              </div>
              <span style={{ flex: 1, fontFamily: F.inter, fontSize: 16, fontWeight: 500, color: t.text1 }}>
                {row.label}
              </span>
              <ChevronRight size={18} color={t.textDisabled} strokeWidth={1.75} />
            </div>
          );
        })}
        <CancelButton t={t} dark={dark} />
      </SheetFrame>
    </SheetScreen>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT 6 — Approve/reject withdrawal
═══════════════════════════════════════════════════════════════════════════ */

function Variant6({ dark, rejecting = false }: { dark: boolean; rejecting?: boolean }) {
  const t = theme(dark);
  const txBg = dark ? 'rgba(59,130,246,0.08)' : '#F9FAFB';
  const radioRow = (label: string, selected: boolean, variant: 'approve' | 'reject') => {
    const dotColor = variant === 'approve' ? (dark ? '#34D399' : '#16A34A') : t.error;
    return (
      <div style={{
        flex: 1, height: 52,
        border: `1.5px solid ${selected ? dotColor : t.inputBorder}`,
        borderRadius: 12,
        background: selected ? (variant === 'approve'
          ? (dark ? 'rgba(52,211,153,0.10)' : '#F0FDF4')
          : (dark ? 'rgba(248,113,113,0.10)' : '#FEF2F2')) : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: '50%',
          border: `1.5px solid ${selected ? dotColor : t.inputBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {selected && <div style={{ width: 9, height: 9, borderRadius: '50%', background: dotColor }} />}
        </div>
        <span style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: selected ? dotColor : t.text1 }}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <SheetScreen dark={dark}>
      <SheetFrame dark={dark} title="Вывод средств">
        <div style={{ padding: '0 20px 14px' }}>
          {/* Transaction card */}
          <div style={{
            background: txBg, border: `1px solid ${t.border}`, borderRadius: 12,
            padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>Продавец</span>
              <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text1 }}>Санжар Мирзаев</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>Сумма</span>
              <span style={{ fontFamily: F.mono, fontSize: 14, fontWeight: 700, color: t.text1 }}>50 000 UZS</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>UCOIN</span>
              <span style={{ fontFamily: F.mono, fontSize: 13, color: t.text2 }}>UCN-0091</span>
            </div>
          </div>

          {/* Radio row */}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            {radioRow('Подтвердить', !rejecting, 'approve')}
            {radioRow('Отклонить',   rejecting,  'reject')}
          </div>

          {/* Reason select — only when rejecting */}
          {rejecting && (
            <div style={{ marginTop: 14 }}>
              <label style={{
                display: 'block', fontFamily: F.inter, fontSize: 13, fontWeight: 500,
                color: t.text2, marginBottom: 6,
              }}>
                Причина
              </label>
              <div style={{
                height: 48, padding: '0 14px',
                border: `1.5px solid ${t.inputBorder}`, borderRadius: 12,
                background: t.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                fontFamily: F.inter, fontSize: 15, color: t.text3,
              }}>
                Выберите причину
                <ChevronDown size={18} color={t.text3} strokeWidth={1.75} />
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: '0 16px 8px' }}>
          <PrimaryButton label={rejecting ? 'Отклонить' : 'Подтвердить'} t={t} destructive={rejecting} />
        </div>
        <GhostButton label="Отмена" t={t} />
      </SheetFrame>
    </SheetScreen>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPEC TABLE
═══════════════════════════════════════════════════════════════════════════ */

const SPEC = [
  { k: 'Overlay',              v: 'rgba(0,0,0,0.4) — taps close the sheet' },
  { k: 'Sheet radius (top)',   v: '24 px · both corners' },
  { k: 'Sheet background',     v: 't.surface · solid (no gradient)' },
  { k: 'Sheet shadow (L)',     v: '0 -4px 24px rgba(17,24,39,0.15)' },
  { k: 'Sheet shadow (D)',     v: '0 -4px 24px rgba(0,0,0,0.6)' },
  { k: 'Handle bar',           v: '36 × 4 · pad 12 top, 8 bottom · color t.inputBorder' },
  { k: 'Title',                v: 'DM Sans 17/600 · pad 4-20-12 (below handle)' },
  { k: 'Action row height',    v: '52 px min · icon 40 × 40 · gap 14 · pad 12-20' },
  { k: 'Destructive row',      v: 'icon color t.error · label color t.error · bg rgba(error, 0.10-0.15)' },
  { k: 'Cancel button',        v: '48 px · radius 12 · bg #F3F4F6 / rgba(160,165,184,0.12) · 16/600 t.text2' },
  { k: 'Primary action',       v: '52 px · radius 12 · t.blue fill · 15/600 white · full-width' },
  { k: 'Ghost button',         v: '48 px · no bg · 15/500 t.text2 · full-width' },
  { k: 'Safe-area bottom',     v: '16 px default · env(safe-area-inset-bottom) on real device' },
  { k: 'Radio card',           v: '52 px · border 1.5 · pill 18 × 18 · fill 9 × 9 semantic color' },
  { k: 'Conditional field',    v: '"Причина" select appears only when "Отклонить" selected' },
  { k: 'Divider between groups', v: '8 px bg strip (page bg) between action groups' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════════════════════════════════ */

export default function MobileBottomSheetsShowcasePage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);
  const t = theme(darkMode);

  const variants: Array<{
    num: string; title: string; subtitle: string;
    light: React.ReactNode; dark: React.ReactNode;
    height: number;
  }> = [
    {
      num: '1', title: 'Action menu',
      subtitle: '2 rows + divider + destructive row + ghost cancel. Opens from MoreHorizontal or action-dots icons across detail pages.',
      light: <Variant1 dark={false} />, dark: <Variant1 dark={true} />,
      height: 560,
    },
    {
      num: '2', title: 'Filter quick pick',
      subtitle: 'Single-select radio list with checkmark on selected option. Compact variant of filter sheet for one-field choices.',
      light: <Variant2 dark={false} />, dark: <Variant2 dark={true} />,
      height: 560,
    },
    {
      num: '3', title: 'Confirm delete (destructive)',
      subtitle: '48 px destructive icon centered + headline + description + full-width destructive action + ghost cancel. Used for irreversible operations.',
      light: <Variant3 dark={false} />, dark: <Variant3 dark={true} />,
      height: 560,
    },
    {
      num: '4', title: 'Confirm simple action',
      subtitle: 'Inline headline + subtle info card showing subject/amount/target + primary confirm + ghost cancel.',
      light: <Variant4 dark={false} />, dark: <Variant4 dark={true} />,
      height: 500,
    },
    {
      num: '5', title: 'Share / Export options',
      subtitle: 'Titled list of 4 export channels with tinted icon circles + chevron. Tap closes sheet and starts the selected flow.',
      light: <Variant5 dark={false} />, dark: <Variant5 dark={true} />,
      height: 600,
    },
    {
      num: '6', title: 'Approve / reject withdrawal',
      subtitle: 'Transaction info card + 2-up radio cards (Подтвердить / Отклонить). "Причина" select appears when Отклонить is active.',
      light: <Variant6 dark={false} rejecting={true} />, dark: <Variant6 dark={true} rejecting={true} />,
      height: 680,
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar
        role="bank"
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span onClick={() => navigate('/design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Дизайн-система</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/mobile-design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Mobile</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>Bottom Sheets · X-00 §11</span>
          </div>

          <h1 style={{ fontFamily: F.dm, fontSize: 26, fontWeight: 700, color: t.text1, margin: '4px 0 6px', lineHeight: 1.2 }}>
            Mobile Bottom Sheets — X-00 §11
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: 14, color: t.text3, margin: '0 0 8px', maxWidth: 900 }}>
            Six sheet variants covering action menus, single-select, destructive confirm, simple confirm, export, and approve/reject flows.
            All share: handle bar, 24 px top corners, <span style={{ fontFamily: F.mono, color: t.text2 }}>rgba(0,0,0,0.4)</span> overlay, full-width.
          </p>

          {variants.map(v => (
            <SectionBlock key={v.num} num={v.num} title={v.title} subtitle={v.subtitle} t={t}>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <PhoneFrame dark={false} height={v.height} label={`${v.title} · Light`}>
                  {v.light}
                </PhoneFrame>
                <PhoneFrame dark={true} height={v.height} label={`${v.title} · Dark`}>
                  {v.dark}
                </PhoneFrame>
              </div>
            </SectionBlock>
          ))}

          {/* Spec */}
          <SectionBlock num="7" title="Design tokens" subtitle="All shared tokens and behaviors across the 6 variants." t={t}>
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: 'hidden', maxWidth: 920 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: t.tableHeaderBg, borderBottom: `1px solid ${t.border}` }}>
                    {['Token / Property', 'Value'].map(h => (
                      <th key={h} style={{
                        padding: '10px 20px', textAlign: 'left',
                        fontFamily: F.inter, fontSize: 12, fontWeight: 600, color: t.text4,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SPEC.map((row, i) => (
                    <tr key={row.k} style={{ borderBottom: i < SPEC.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                      <td style={{ padding: '12px 20px', fontFamily: F.mono, fontSize: 13, color: t.blue, width: '38%' }}>{row.k}</td>
                      <td style={{ padding: '12px 20px', fontFamily: F.mono, fontSize: 13, color: t.text2 }}>{row.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionBlock>

          {/* Footer */}
          <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text4 }}>
              Mobile Bottom Sheets · 6 variants · X-00 §11
            </span>
            <span style={{ fontFamily: F.mono, fontSize: 12, color: t.textDisabled }}>
              © 2026 Moment Finance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
