import React from 'react';
import { ChevronLeft, MoreHorizontal, Check, CreditCard, Wallet, Users, TrendingUp } from 'lucide-react';
import { F, theme, MDS, Pair, VariantLabel, T } from './frame';

/* ═══════════════════════════════════════════════════════════════════════════
   §8 DETAIL PAGE LAYOUT  +  §9 SEGMENTED CONTROL
═══════════════════════════════════════════════════════════════════════════ */

/* ─── §9 Segmented Control (iOS-style) ──────────────────────────────── */

function Segmented({
  options, activeIndex, dark, size = 'md',
}: { options: string[]; activeIndex: number; dark: boolean; size?: 'sm' | 'md' }) {
  const t = theme(dark);
  const trackBg = dark ? '#2D3148' : '#F3F4F6';
  const h = size === 'sm' ? 32 : 36;
  return (
    <div style={{
      display: 'flex', padding: 4, borderRadius: 999,
      background: trackBg, height: h, alignItems: 'stretch', boxSizing: 'border-box',
    }}>
      {options.map((opt, i) => {
        const active = i === activeIndex;
        return (
          <div key={opt} style={{
            flex: 1, borderRadius: 999,
            background: active ? t.surface : 'transparent',
            boxShadow: active ? (dark ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 2px rgba(17,24,39,0.08)') : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F.inter, fontSize: size === 'sm' ? '13px' : '14px', fontWeight: 500,
            color: active ? t.text1 : t.text3,
          }}>
            {opt}
          </div>
        );
      })}
    </div>
  );
}

function SegmentedCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ background: t.pageBg, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <VariantLabel text="Default · 4 segments" dark={dark} />
        <Segmented options={['Сводка', 'Карты', 'Продавцы', 'Финансы']} activeIndex={0} dark={dark} />
      </div>
      <div>
        <VariantLabel text="Active tab 2" dark={dark} />
        <Segmented options={['Сводка', 'Карты', 'Продавцы', 'Финансы']} activeIndex={2} dark={dark} />
      </div>
      <div>
        <VariantLabel text="2 segments" dark={dark} />
        <Segmented options={['Активные', 'Архив']} activeIndex={0} dark={dark} />
      </div>
      <div>
        <VariantLabel text="3 segments · Small" dark={dark} />
        <Segmented options={['День', 'Неделя', 'Месяц']} activeIndex={1} dark={dark} size="sm" />
      </div>
      <div style={{
        border: `1px dashed ${t.inputBorder}`, borderRadius: 12, padding: 12,
        fontFamily: F.mono, fontSize: '11px', color: t.text3, lineHeight: 1.5,
      }}>
        Track bg: {dark ? 'D.border #2D3148' : 'C.#F3F4F6'}<br />
        Active pill bg: {dark ? 'D.surface #1A1D27' : 'C.#FFFFFF'}<br />
        Active text: {dark ? 'D.text1 #F1F2F6' : 'C.#111827'}<br />
        Inactive text: C/D.text3 #6B7280<br />
        Anim: slide 200 ms (visual only in this showcase)
      </div>
    </div>
  );
}

/* ─── §8 Detail page layout ─────────────────────────────────────────── */

function MiniStatCard({
  icon: Icon, label, value, trend, dark, iconBg, iconFg,
}: {
  icon: React.ElementType; label: string; value: string;
  trend?: { up: boolean; value: string };
  dark: boolean; iconBg: string; iconFg: string;
}) {
  const t = theme(dark);
  const trendPal = trend
    ? (dark
        ? (trend.up ? { bg: 'rgba(52,211,153,0.15)', fg: '#34D399' } : { bg: 'rgba(248,113,113,0.15)', fg: '#F87171' })
        : (trend.up ? { bg: '#F0FDF4', fg: '#15803D' } : { bg: '#FEF2F2', fg: '#DC2626' }))
    : null;
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: 16, padding: 14,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={iconFg} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 500, color: t.text3, marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, lineHeight: 1 }}>
            {value}
          </span>
          {trend && trendPal && (
            <span style={{
              fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
              color: trendPal.fg, background: trendPal.bg,
              padding: '1px 6px', borderRadius: 8,
            }}>
              {trend.up ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
      padding: '3px 10px', borderRadius: 12, background: bg, color: fg,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function DetailPageCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const successBg = dark ? 'rgba(52,211,153,0.15)' : '#F0FDF4';
  const successFg = dark ? '#34D399' : '#15803D';
  const infoBg    = dark ? 'rgba(34,211,238,0.15)' : '#ECFEFF';
  const infoFg    = dark ? '#22D3EE' : '#0E7490';
  const blueBg    = dark ? 'rgba(59,130,246,0.15)' : '#EFF6FF';
  const blueFg    = t.blue;
  const violetBg  = dark ? 'rgba(167,139,250,0.15)' : '#F3F0FF';
  const violetFg  = dark ? '#A78BFA' : '#7C3AED';
  const amberBg   = dark ? 'rgba(251,191,36,0.15)' : '#FFFBEB';
  const amberFg   = dark ? '#FBBF24' : '#D97706';
  const greenBg   = dark ? 'rgba(52,211,153,0.15)' : '#F0FDF4';
  const greenFg   = dark ? '#34D399' : '#16A34A';

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
          Mysafar OOO
        </div>
        <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MoreHorizontal size={24} color={t.text1} />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Hero */}
        <div style={{ padding: '16px 16px 20px' }}>
          <h1 style={{ fontFamily: F.dm, fontSize: '28px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.15 }}>
            Mysafar OOO
          </h1>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            <Badge label="Активна"    bg={successBg} fg={successFg} />
            <Badge label="Premium"    bg={blueBg}    fg={blueFg} />
            <Badge label="28 продавцов" bg={infoBg}  fg={infoFg} />
          </div>
          <div style={{
            marginTop: 14, fontFamily: F.inter, fontSize: '15px', color: t.text3, lineHeight: 1.4,
          }}>
            Партнёр с октября 2024 · Ташкент, Узбекистан
          </div>
        </div>

        {/* 2×2 stats */}
        <div style={{ padding: '0 16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <MiniStatCard dark={dark} icon={CreditCard} iconBg={blueBg}   iconFg={blueFg}   label="Карт выдано"    value="498"    trend={{ up: true,  value: '+24' }} />
          <MiniStatCard dark={dark} icon={TrendingUp} iconBg={greenBg}  iconFg={greenFg}  label="KPI 3"          value="45"     trend={{ up: true,  value: '+9%' }} />
          <MiniStatCard dark={dark} icon={Wallet}     iconBg={amberBg}  iconFg={amberFg}  label="UCOIN"          value="8.2M"   trend={{ up: true,  value: '+12%' }} />
          <MiniStatCard dark={dark} icon={Users}      iconBg={violetBg} iconFg={violetFg} label="Продавцы"       value="28"     trend={{ up: false, value: '−1' }} />
        </div>

        {/* Segmented */}
        <div style={{ padding: '0 16px 16px' }}>
          <Segmented options={['Сводка', 'Карты', 'Продавцы', 'Финансы']} activeIndex={0} dark={dark} />
        </div>

        {/* Stacked content */}
        <div style={{ padding: '4px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 16, padding: 16,
          }}>
            <div style={{ fontFamily: F.dm, fontSize: '17px', fontWeight: 600, color: t.text1, marginBottom: 12 }}>
              Ключевые показатели
            </div>
            {[
              ['Конверсия KPI 3', '9.1 %'],
              ['Ср. сумма активации', '3.2M UZS'],
              ['Активных карт', '452 / 498'],
              ['Продавцов выше среднего', '12'],
            ].map(([k, v], i, arr) => (
              <div key={k} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.border}` : 'none',
              }}>
                <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text3 }}>{k}</span>
                <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 500, color: t.text1 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 16, padding: 16,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8,
            }}>
              <div style={{ fontFamily: F.dm, fontSize: '17px', fontWeight: 600, color: t.text1 }}>
                Последняя активность
              </div>
              <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.blue }}>Все</span>
            </div>
            {[
              { c: successFg, title: 'KPI 2 выполнен — Камола Ю.',      time: '14:32' },
              { c: blueFg,    title: 'Партия «Апрель 2026» обновлена',    time: '12:01' },
              { c: amberFg,   title: 'KPI 1 в процессе — Дилноза А.',    time: '10:45' },
            ].map((row) => (
              <div key={row.title} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.c, flexShrink: 0 }} />
                <div style={{ flex: 1, fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>{row.title}</div>
                <div style={{ fontFamily: F.mono, fontSize: '12px', color: t.text4 }}>{row.time}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: MDS.safeBottom }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC
═══════════════════════════════════════════════════════════════════════════ */

export const M_Detail = {
  Page: ({ t: _t }: { t: T }) => (
    <Pair height={900} note="Full detail screen: back/title/⋯ header → hero (name, badges, caption) → 2×2 stat grid → segmented tabs → stacked content cards.">
      {(dark) => <DetailPageCol dark={dark} />}
    </Pair>
  ),
  Segmented: ({ t: _t }: { t: T }) => (
    <Pair height={560} note="Four variants stacked: default (4 seg), different active index, 2 segments, 3 segments small. Token callout at bottom.">
      {(dark) => <SegmentedCol dark={dark} />}
    </Pair>
  ),
};
