import React from 'react';
import { ChevronRight, Trash2, Pencil, CreditCard } from 'lucide-react';
import { F, theme, MDS, Pair, T } from './frame';

/* ═══════════════════════════════════════════════════════════════════════════
   §4 LIST ROW + §5 SECTION HEADER + §20 SWIPE ACTIONS
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Section header ──────────────────────────────────────────────────── */

function SectionHeader({ text, dark }: { text: string; dark: boolean }) {
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

/* ─── Avatar primitive ─────────────────────────────────────────────────── */

function Avatar({ initials, size = 32, dark }: { initials: string; size?: number; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: t.blueLt, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: F.inter, fontSize: size >= 40 ? '14px' : '11px', fontWeight: 600, color: t.blue }}>
        {initials}
      </span>
    </div>
  );
}

/* ─── Pill badge used in rows ──────────────────────────────────────────── */

type BadgeKey = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const BADGE_LIGHT: Record<BadgeKey, { bg: string; fg: string }> = {
  success: { bg: '#F0FDF4', fg: '#15803D' },
  warning: { bg: '#FFFBEB', fg: '#B45309' },
  error:   { bg: '#FEF2F2', fg: '#DC2626' },
  info:    { bg: '#ECFEFF', fg: '#0E7490' },
  neutral: { bg: '#F3F4F6', fg: '#4B5563' },
};

const BADGE_DARK: Record<BadgeKey, { bg: string; fg: string }> = {
  success: { bg: 'rgba(52,211,153,0.15)',  fg: '#34D399' },
  warning: { bg: 'rgba(251,191,36,0.15)',  fg: '#FBBF24' },
  error:   { bg: 'rgba(248,113,113,0.15)', fg: '#F87171' },
  info:    { bg: 'rgba(34,211,238,0.15)',  fg: '#22D3EE' },
  neutral: { bg: 'rgba(160,165,184,0.15)', fg: '#A0A5B8' },
};

function Badge({ label, kind, dark }: { label: string; kind: BadgeKey; dark: boolean }) {
  const pal = (dark ? BADGE_DARK : BADGE_LIGHT)[kind];
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '12px',
      background: pal.bg, color: pal.fg,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

/* ─── List row ─────────────────────────────────────────────────────────── */

function ListRow({
  avatar, icon, title, subtitle, rightValue, badge, chevron = true, dark, pressed = false,
}: {
  avatar?: { initials: string };
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  rightValue?: string;
  badge?: { label: string; kind: BadgeKey };
  chevron?: boolean;
  dark: boolean;
  pressed?: boolean;
}) {
  const t = theme(dark);
  const rowBg = pressed ? (dark ? MDS.touchIosDark : MDS.touchIosLight) : t.surface;
  return (
    <div style={{
      minHeight: 64, background: rowBg,
      borderBottom: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', boxSizing: 'border-box',
    }}>
      {avatar && <Avatar initials={avatar.initials} dark={dark} />}
      {icon && (
        <div style={{
          width: 40, height: 40, borderRadius: '50%', background: t.blueLt,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: F.inter, fontSize: '15px', fontWeight: 500, color: t.text1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {rightValue && (
          <span style={{ fontFamily: F.mono, fontSize: '15px', fontWeight: 500, color: t.text1 }}>
            {rightValue}
          </span>
        )}
        {badge && <Badge label={badge.label} kind={badge.kind} dark={dark} />}
        {chevron && <ChevronRight size={20} color={t.textDisabled} strokeWidth={2} />}
      </div>
    </div>
  );
}

/* ─── Swipe-revealed row (§20) ─────────────────────────────────────────── */

function SwipeRow({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: t.surface, borderBottom: `1px solid ${t.border}` }}>
      {/* Revealed actions underneath */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'flex-end', pointerEvents: 'none' }}>
        <div style={{
          width: 80, background: t.blue, color: '#FFFFFF',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <Pencil size={22} strokeWidth={2} />
          <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500 }}>Ред.</span>
        </div>
        <div style={{
          width: 80, background: t.error, color: '#FFFFFF',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <Trash2 size={22} strokeWidth={2} />
          <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500 }}>Удалить</span>
        </div>
      </div>
      {/* Front row translated left */}
      <div style={{
        transform: 'translateX(-160px)',
        background: t.surface,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', minHeight: 64, boxSizing: 'border-box',
      }}>
        <Avatar initials="АР" dark={dark} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.inter, fontSize: '15px', fontWeight: 500, color: t.text1 }}>
            Абдуллох Рашидов
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginTop: 2 }}>
            Продавец · Mysafar OOO
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COLUMNS
═══════════════════════════════════════════════════════════════════════════ */

function RowsCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: t.pageBg, height: '100%' }}>
      <SectionHeader text="Default · value + chevron" dark={dark} />
      <ListRow dark={dark} title="Выдано карт" rightValue="5 000" />
      <ListRow dark={dark} title="Продано клиентам" rightValue="2 340" />
      <ListRow dark={dark} title="Активных продавцов" rightValue="342" />

      <SectionHeader text="With avatar + subtitle" dark={dark} />
      <ListRow dark={dark} avatar={{ initials: 'АР' }} title="Абдуллох Рашидов" subtitle="Mysafar OOO · KPI 3" />
      <ListRow dark={dark} avatar={{ initials: 'КЮ' }} title="Камола Юсупова" subtitle="Alif Group · KPI 2" />
      <ListRow dark={dark} avatar={{ initials: 'БН' }} title="Бобур Назаров" subtitle="TechCom · KPI 1" />

      <SectionHeader text="With status badge" dark={dark} />
      <ListRow dark={dark} icon={<CreditCard size={20} color={t.blue} strokeWidth={2} />} title="•••• 1001" subtitle="Mysafar · VISA SUM" badge={{ label: 'Активна', kind: 'success' }} />
      <ListRow dark={dark} icon={<CreditCard size={20} color={t.blue} strokeWidth={2} />} title="•••• 1002" subtitle="Alif · VISA USD"    badge={{ label: 'Продана', kind: 'info' }} />
      <ListRow dark={dark} icon={<CreditCard size={20} color={t.blue} strokeWidth={2} />} title="•••• 1003" subtitle="TechCom · VISA EUR" badge={{ label: 'На паузе', kind: 'warning' }} />
      <ListRow dark={dark} icon={<CreditCard size={20} color={t.blue} strokeWidth={2} />} title="•••• 1004" subtitle="UzInvest · VISA SUM" badge={{ label: 'Неактивна', kind: 'error' }} />

      <SectionHeader text="Pressed state" dark={dark} />
      <ListRow dark={dark} avatar={{ initials: 'ДА' }} title="Дилноза Алиева" subtitle="Mysafar OOO" pressed />
    </div>
  );
}

function SectionHeadersCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: t.pageBg, height: '100%' }}>
      <SectionHeader text="Статистика" dark={dark} />
      <ListRow dark={dark} title="Всего карт" rightValue="5 000" />
      <ListRow dark={dark} title="В работе"   rightValue="2 340" />

      <SectionHeader text="Продавцы по рейтингу" dark={dark} />
      <ListRow dark={dark} avatar={{ initials: 'АР' }} title="Абдуллох Рашидов" rightValue="2.5M" />
      <ListRow dark={dark} avatar={{ initials: 'КЮ' }} title="Камола Юсупова"   rightValue="1.98M" />
      <ListRow dark={dark} avatar={{ initials: 'БН' }} title="Бобур Назаров"    rightValue="1.76M" />

      <SectionHeader text="Последние операции" dark={dark} />
      <ListRow dark={dark} title="Начисление KPI 2" subtitle="Сегодня, 14:32" rightValue="+15 000" />
      <ListRow dark={dark} title="Продажа карты"    subtitle="Сегодня, 12:10" rightValue="+45 000" />
      <ListRow dark={dark} title="Вывод UCOIN"      subtitle="Вчера, 18:22"   rightValue="−120 000" />
    </div>
  );
}

function SwipeActionsCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: t.pageBg, height: '100%' }}>
      <SectionHeader text="Swipe-left to reveal actions" dark={dark} />
      <SwipeRow dark={dark} />
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', color: t.text3, lineHeight: 1.5,
        }}>
          Tap &lsquo;<span style={{ color: t.blue, fontWeight: 500 }}>Ред.</span>&rsquo; → pushes edit page.
          Tap &lsquo;<span style={{ color: t.error, fontWeight: 500 }}>Удалить</span>&rsquo; → opens confirm sheet.
        </div>
      </div>
      <SectionHeader text="Full swipe (destructive)" dark={dark} />
      <div style={{ position: 'relative', overflow: 'hidden', background: t.error, borderBottom: `1px solid ${t.border}` }}>
        <div style={{
          padding: '20px 24px', color: '#FFFFFF',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
          minHeight: 64, boxSizing: 'border-box',
        }}>
          <Trash2 size={22} strokeWidth={2} />
          <span style={{ fontFamily: F.inter, fontSize: '15px', fontWeight: 600 }}>Удалить</span>
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', color: t.text3, lineHeight: 1.5,
        }}>
          When user swipes beyond 50 % width, the destructive action expands full-width and auto-commits on release.
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC EXPORTS
═══════════════════════════════════════════════════════════════════════════ */

export const M_Lists = {
  Rows: ({ t: _t }: { t: T }) => (
    <Pair height={840} note="5 row variants stacked: plain value, avatar + subtitle, status badge, pressed state. Row height 64 min, padding 16.">
      {(dark) => <RowsCol dark={dark} />}
    </Pair>
  ),
  SectionHeaders: ({ t: _t }: { t: T }) => (
    <Pair height={560} note="iOS grouped-list style. Uppercase 11/600 labels at 24/16/8 padding.">
      {(dark) => <SectionHeadersCol dark={dark} />}
    </Pair>
  ),
  SwipeActions: ({ t: _t }: { t: T }) => (
    <Pair height={500} note="Row translated –160 px to reveal 80 px blue ‘Ред.’ + 80 px red ‘Удалить’. Full-swipe variant below auto-commits destructive.">
      {(dark) => <SwipeActionsCol dark={dark} />}
    </Pair>
  ),
};
