import React, { useState } from 'react';
import {
  ChevronRight, ChevronLeft, Menu, Bell, MoreHorizontal, X, Plus,
  SlidersHorizontal, CreditCard, TrendingUp, Wallet,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { PhoneFrame, MDS, SectionBlock } from '../components/mds/frame';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE TOP HEADER — Detailed spec (references X-00 §1)
   4 variants × 2 scroll-states × 2 themes = 16 cells arranged as 8 frames
   (each frame stacks scroll-top + scrolled states vertically).
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Status bar ──────────────────────────────────────────────────────── */

function StatusBar({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const fg = t.text1;
  return (
    <div style={{
      height: MDS.safeTop, display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-between', padding: '0 24px 8px', boxSizing: 'border-box',
    }}>
      <span style={{ fontFamily: F.inter, fontSize: 14, fontWeight: 600, color: fg }}>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          {[4, 6, 8, 10].map(h => (
            <div key={h} style={{ width: 3, height: h, background: fg, borderRadius: 1 }} />
          ))}
        </div>
        <div style={{ width: 22, height: 10, borderRadius: 2, border: `1px solid ${fg}`, position: 'relative', marginLeft: 2 }}>
          <div style={{ position: 'absolute', inset: 1, width: '70%', background: fg, borderRadius: 1 }} />
          <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 4, background: fg, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Shared icon-button primitive ────────────────────────────────────── */

function IcoBtn({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

/* ─── Avatar primitive ─────────────────────────────────────────────────── */

function Avatar({ initials, dark }: { initials: string; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      background: t.blueLt, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 600, color: t.blue }}>
        {initials}
      </span>
    </div>
  );
}

/* ─── Bell with red dot ───────────────────────────────────────────────── */

function BellWithDot({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ position: 'relative', width: 24, height: 24 }}>
      <Bell size={24} color={t.text1} strokeWidth={1.75} />
      <div style={{
        position: 'absolute', top: 1, right: 1,
        width: 8, height: 8, borderRadius: '50%',
        background: '#EF4444',
        border: `1.5px solid ${dark ? D.surface : C.surface}`,
        boxSizing: 'content-box',
      }} />
    </div>
  );
}

/* ─── Logo chip ───────────────────────────────────────────────────────── */

function LogoChip({ dark }: { dark: boolean }) {
  return (
    <div style={{
      width: 20, height: 20, borderRadius: 6,
      background: dark ? '#3B82F6' : '#2563EB',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: F.dm, fontSize: 10, fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>M</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER BAR — the core component being spec'd
═══════════════════════════════════════════════════════════════════════════ */

function HeaderBar({
  left, center, right, dark, scrolled,
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  dark: boolean;
  scrolled: boolean;
}) {
  const t = theme(dark);
  const bg = scrolled ? (dark ? 'rgba(26,29,39,0.92)' : 'rgba(255,255,255,0.92)') : 'transparent';
  const border = scrolled ? `1px solid ${t.border}` : '1px solid transparent';
  return (
    <div style={{
      height: MDS.headerH, width: '100%',
      display: 'flex', alignItems: 'center', padding: '0 4px',
      background: bg,
      backdropFilter: scrolled ? 'blur(16px)' : undefined,
      WebkitBackdropFilter: scrolled ? 'blur(16px)' : undefined,
      borderBottom: border,
      boxSizing: 'border-box',
      transition: 'background 0.15s, border-color 0.15s',
    }}>
      <div style={{ minWidth: 52, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        {left}
      </div>
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', gap: 6,
      }}>
        {center}
      </div>
      <div style={{ minWidth: 52, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0 }}>
        {right}
      </div>
    </div>
  );
}

/* ─── Title text (centered) ───────────────────────────────────────────── */

function HeaderTitle({ text, dark }: { text: string; dark: boolean }) {
  const t = theme(dark);
  return (
    <span style={{
      fontFamily: F.inter, fontSize: 17, fontWeight: 600, color: t.text1,
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      maxWidth: 220,
    }}>
      {text}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTENT FILLERS (behind transparent header, visible on scroll-top)
═══════════════════════════════════════════════════════════════════════════ */

function DashFiller({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const iconBg = dark ? 'rgba(59,130,246,0.15)' : '#EFF6FF';
  const iconFg = t.blue;
  return (
    <div style={{ padding: '8px 16px 20px' }}>
      <div style={{ fontFamily: F.inter, fontSize: 13, color: t.text3, marginBottom: 2 }}>Добрый день,</div>
      <div style={{ fontFamily: F.dm, fontSize: 28, fontWeight: 700, color: t.text1, lineHeight: 1.1, marginBottom: 20 }}>
        Банк Админ
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { icon: CreditCard, label: 'Карт', val: '5 000' },
          { icon: TrendingUp, label: 'KPI 3', val: '567' },
          { icon: Wallet,     label: 'UCOIN', val: '18.25M' },
        ].map((s, i) => (
          <div key={s.label} style={{
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: 14,
            gridColumn: i === 2 ? 'span 2' : undefined,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
            }}>
              <s.icon size={18} color={iconFg} strokeWidth={2} />
            </div>
            <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3 }}>{s.label}</div>
            <div style={{ fontFamily: F.dm, fontSize: 22, fontWeight: 700, color: t.text1, marginTop: 2 }}>{s.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListFiller({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div>
      {['Mysafar OOO', 'Alif Group', 'TechCom LLC', 'UzInvest'].map((name, i) => (
        <div key={name} style={{
          padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${t.border}`, background: t.surface,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: t.blueLt,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: F.inter, fontSize: 11, fontWeight: 600, color: t.blue }}>
              {name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1 }}>{name}</div>
            <div style={{ fontFamily: F.inter, fontSize: 13, color: t.text3, marginTop: 1 }}>
              {12 + i * 4} продавцов · {120 + i * 60} карт
            </div>
          </div>
          <ChevronRight size={20} color={t.textDisabled} />
        </div>
      ))}
    </div>
  );
}

function DetailFiller({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const successBg = dark ? 'rgba(52,211,153,0.15)' : '#F0FDF4';
  const successFg = dark ? '#34D399' : '#15803D';
  return (
    <div style={{ padding: '8px 16px 16px' }}>
      <div style={{ fontFamily: F.dm, fontSize: 24, fontWeight: 700, color: t.text1, lineHeight: 1.15, marginBottom: 10 }}>
        Mysafar OOO
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <span style={{ fontFamily: F.inter, fontSize: 13, fontWeight: 500, padding: '3px 10px', borderRadius: 12, background: successBg, color: successFg }}>Активна</span>
        <span style={{ fontFamily: F.inter, fontSize: 13, fontWeight: 500, padding: '3px 10px', borderRadius: 12, background: t.blueLt, color: t.blue }}>Premium</span>
      </div>
      <div style={{ fontFamily: F.inter, fontSize: 15, color: t.text3, lineHeight: 1.4 }}>
        28 продавцов · 498 карт · партнёр с октября 2024
      </div>
    </div>
  );
}

function ComposeFiller({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ padding: '12px 16px' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: F.inter, fontSize: 14, fontWeight: 500, color: t.text2, marginBottom: 6 }}>Тема</div>
        <div style={{
          height: 48, borderRadius: 12, border: `1px solid ${t.inputBorder}`,
          background: t.surface, padding: '0 16px', display: 'flex', alignItems: 'center',
        }}>
          <span style={{ fontFamily: F.inter, fontSize: 15, color: t.text4 }}>Введите тему…</span>
        </div>
      </div>
      <div>
        <div style={{ fontFamily: F.inter, fontSize: 14, fontWeight: 500, color: t.text2, marginBottom: 6 }}>Текст</div>
        <div style={{
          height: 120, borderRadius: 12, border: `1px solid ${t.inputBorder}`,
          background: t.surface, padding: 16,
        }}>
          <span style={{ fontFamily: F.inter, fontSize: 15, color: t.text4 }}>Напишите объявление…</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   VARIANT FRAMES — each frame stacks scroll-top + scrolled vertically
═══════════════════════════════════════════════════════════════════════════ */

function ScrollLabel({ text, dark }: { text: string; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      position: 'absolute', left: 12, top: MDS.safeTop - 2,
      fontFamily: F.mono, fontSize: 10, fontWeight: 600,
      color: dark ? '#6B7280' : '#9CA3AF',
      padding: '2px 6px', borderRadius: 4,
      background: dark ? 'rgba(45,49,72,0.7)' : 'rgba(243,244,246,0.8)',
      zIndex: 10, letterSpacing: '0.04em',
    }}>
      {text}
    </div>
  );
}

/* ─── Variant 1: Root / Dashboard ─────────────────────────────────────── */

function V1Root({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      {/* ── Scroll-top state (transparent) ── */}
      <div style={{ position: 'relative' }}>
        <ScrollLabel text="SCROLL TOP" dark={dark} />
        <StatusBar dark={dark} />
        <HeaderBar
          dark={dark} scrolled={false}
          left={<IcoBtn><Menu size={24} color={t.text1} strokeWidth={1.75} /></IcoBtn>}
          center={<><LogoChip dark={dark} /><HeaderTitle text="Moment KPI" dark={dark} /></>}
          right={
            <>
              <IcoBtn><BellWithDot dark={dark} /></IcoBtn>
              <Avatar initials="БА" dark={dark} />
              <div style={{ width: 8 }} />
            </>
          }
        />
        <DashFiller dark={dark} />
      </div>

      <div style={{ height: 1, background: t.border, margin: '8px 0' }} />

      {/* ── Scrolled state (blurred bg) ── */}
      <div style={{ position: 'relative' }}>
        <ScrollLabel text="SCROLLED" dark={dark} />
        <StatusBar dark={dark} />
        <HeaderBar
          dark={dark} scrolled={true}
          left={<IcoBtn><Menu size={24} color={t.text1} strokeWidth={1.75} /></IcoBtn>}
          center={<><LogoChip dark={dark} /><HeaderTitle text="Moment KPI" dark={dark} /></>}
          right={
            <>
              <IcoBtn><BellWithDot dark={dark} /></IcoBtn>
              <Avatar initials="БА" dark={dark} />
              <div style={{ width: 8 }} />
            </>
          }
        />
        <div style={{ padding: '12px 16px', fontFamily: F.inter, fontSize: 13, color: t.text3 }}>
          ↑ content scrolled up — header bg frosted, border visible
        </div>
      </div>
    </div>
  );
}

/* ─── Variant 2: List / Index ─────────────────────────────────────────── */

function V2List({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <div style={{ position: 'relative' }}>
        <ScrollLabel text="SCROLL TOP" dark={dark} />
        <StatusBar dark={dark} />
        <HeaderBar
          dark={dark} scrolled={false}
          left={<div style={{ width: 48 }} />}
          center={<HeaderTitle text="Организации" dark={dark} />}
          right={
            <>
              <IcoBtn><Plus size={24} color={t.text1} strokeWidth={1.75} /></IcoBtn>
              <IcoBtn><SlidersHorizontal size={24} color={t.text1} strokeWidth={1.75} /></IcoBtn>
            </>
          }
        />
        <ListFiller dark={dark} />
      </div>

      <div style={{ height: 1, background: t.border, margin: '8px 0' }} />

      <div style={{ position: 'relative' }}>
        <ScrollLabel text="SCROLLED" dark={dark} />
        <StatusBar dark={dark} />
        <HeaderBar
          dark={dark} scrolled={true}
          left={<div style={{ width: 48 }} />}
          center={<HeaderTitle text="Организации" dark={dark} />}
          right={
            <>
              <IcoBtn><Plus size={24} color={t.text1} strokeWidth={1.75} /></IcoBtn>
              <IcoBtn><SlidersHorizontal size={24} color={t.text1} strokeWidth={1.75} /></IcoBtn>
            </>
          }
        />
        <div style={{ padding: '12px 16px', fontFamily: F.inter, fontSize: 13, color: t.text3 }}>
          ↑ frosted header visible after 16 px scroll
        </div>
      </div>
    </div>
  );
}

/* ─── Variant 3: Detail ───────────────────────────────────────────────── */

function V3Detail({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <div style={{ position: 'relative' }}>
        <ScrollLabel text="SCROLL TOP" dark={dark} />
        <StatusBar dark={dark} />
        <HeaderBar
          dark={dark} scrolled={false}
          left={
            <IcoBtn>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ChevronLeft size={24} color={t.blue} strokeWidth={2} />
                <span style={{ fontFamily: F.inter, fontSize: 15, color: t.blue }}>Назад</span>
              </div>
            </IcoBtn>
          }
          center={<HeaderTitle text="Mysafar OOO" dark={dark} />}
          right={<IcoBtn><MoreHorizontal size={24} color={t.text1} strokeWidth={1.75} /></IcoBtn>}
        />
        <DetailFiller dark={dark} />
      </div>

      <div style={{ height: 1, background: t.border, margin: '8px 0' }} />

      <div style={{ position: 'relative' }}>
        <ScrollLabel text="SCROLLED" dark={dark} />
        <StatusBar dark={dark} />
        <HeaderBar
          dark={dark} scrolled={true}
          left={
            <IcoBtn>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ChevronLeft size={24} color={t.blue} strokeWidth={2} />
                <span style={{ fontFamily: F.inter, fontSize: 15, color: t.blue }}>Назад</span>
              </div>
            </IcoBtn>
          }
          center={<HeaderTitle text="Mysafar OOO" dark={dark} />}
          right={<IcoBtn><MoreHorizontal size={24} color={t.text1} strokeWidth={1.75} /></IcoBtn>}
        />
        <div style={{ padding: '12px 16px', fontFamily: F.inter, fontSize: 13, color: t.text3 }}>
          ↑ hero collapsed under frosted bar + title truncated if needed
        </div>
      </div>
    </div>
  );
}

/* ─── Variant 4: Modal / Create ───────────────────────────────────────── */

function V4Modal({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <div style={{ position: 'relative' }}>
        <ScrollLabel text="SCROLL TOP" dark={dark} />
        <StatusBar dark={dark} />
        <HeaderBar
          dark={dark} scrolled={false}
          left={<IcoBtn><X size={24} color={t.text1} strokeWidth={1.75} /></IcoBtn>}
          center={<HeaderTitle text="Новое объявление" dark={dark} />}
          right={
            <div style={{ paddingRight: 12 }}>
              <span style={{ fontFamily: F.inter, fontSize: 16, fontWeight: 600, color: t.blue }}>
                Отправить
              </span>
            </div>
          }
        />
        <ComposeFiller dark={dark} />
      </div>

      <div style={{ height: 1, background: t.border, margin: '8px 0' }} />

      <div style={{ position: 'relative' }}>
        <ScrollLabel text="SCROLLED · button disabled" dark={dark} />
        <StatusBar dark={dark} />
        <HeaderBar
          dark={dark} scrolled={true}
          left={<IcoBtn><X size={24} color={t.text1} strokeWidth={1.75} /></IcoBtn>}
          center={<HeaderTitle text="Новое объявление" dark={dark} />}
          right={
            <div style={{ paddingRight: 12 }}>
              <span style={{ fontFamily: F.inter, fontSize: 16, fontWeight: 600, color: t.textDisabled }}>
                Отправить
              </span>
            </div>
          }
        />
        <div style={{ padding: '12px 16px', fontFamily: F.inter, fontSize: 13, color: t.text3 }}>
          ↑ frosted bar + "Отправить" disabled (form invalid)
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPEC TABLE
═══════════════════════════════════════════════════════════════════════════ */

const SPEC_ROWS = [
  { k: 'Container · height',                  v: '56 px + 44 pt safe-area-top' },
  { k: 'Scroll-top bg',                       v: 'transparent (content visible behind)' },
  { k: 'Scrolled bg (light)',                  v: 'rgba(255,255,255,0.92) · backdrop-blur 16 px' },
  { k: 'Scrolled bg (dark)',                   v: 'rgba(26,29,39,0.92) · backdrop-blur 16 px' },
  { k: 'Bottom border (scrolled)',             v: '1 px · #E5E7EB light / #2D3148 dark' },
  { k: 'Scroll threshold',                     v: '16 px of Y-scroll triggers the transition' },
  { k: 'Title font',                           v: 'Inter 17 px / 600 · center-aligned · ellipsis at 220 px max' },
  { k: 'Logo chip (V1)',                        v: '20 × 20 · rounded 6 · #2563EB / #3B82F6 with white "M"' },
  { k: 'Back button (V3)',                      v: 'ChevronLeft 24 + "Назад" Inter 15 · both C/D.blue' },
  { k: 'Close button (V4)',                     v: 'X 24 px · C/D.text1 · 48 × 48 touch area' },
  { k: 'Right text btn (V4)',                   v: 'Inter 16 / 600 · C/D.blue active / C/D.textDisabled when form invalid' },
  { k: 'Bell icon + dot (V1)',                  v: 'Bell 24 + 8 px red dot · 1.5 px surface ring' },
  { k: 'Avatar (V1)',                           v: '32 × 32 circle · blueLt bg · Inter 11/600 blue initials' },
  { k: 'Plus + Filter (V2)',                    v: '24 px each · 48 × 48 touch areas · C/D.text1' },
  { k: 'Action dots (V3)',                      v: 'MoreHorizontal 24 · opens bottom sheet' },
  { k: 'Safe area spacer',                      v: '44 pt status bar region above header on every frame' },
  { k: 'Touch target',                          v: '≥ 48 × 48 pt on every interactive element' },
  { k: 'Transition',                            v: 'bg + border-color 150 ms ease' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════════════════════════════════════ */

export default function MobileHeaderShowcasePage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);
  const t = theme(darkMode);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar role="bank" collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span onClick={() => navigate('/design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Дизайн-система</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/mobile-design-system')} style={{ fontFamily: F.inter, fontSize: 13, color: t.blue, cursor: 'pointer' }}>Mobile</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: 13, color: t.text3 }}>Top Header</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: F.dm, fontSize: 26, fontWeight: 700, color: t.text1, margin: '4px 0 6px', lineHeight: 1.2 }}>
            Top Header — 4 variants × 2 scroll states
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: 14, color: t.text3, margin: '0 0 8px', maxWidth: 900 }}>
            References <span style={{ fontFamily: F.mono, color: t.text2 }}>X-00 §1</span>. Each variant shows scroll-top (transparent, content visible behind) and scrolled (frosted bg + 1 px border). 8 phone frames total = 4 variants × light/dark.
          </p>

          {/* §01 — V1 Root */}
          <SectionBlock num="1" title="Variant 1 — Root tab page (Dashboard)" subtitle="Left: hamburger 24 px · Center: logo chip + 'Moment KPI' · Right: bell (8 px dot) + avatar 32 px." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <PhoneFrame dark={false} height={680} label="V1 · Light">
                <V1Root dark={false} />
              </PhoneFrame>
              <PhoneFrame dark={true} height={680} label="V1 · Dark">
                <V1Root dark={true} />
              </PhoneFrame>
            </div>
          </SectionBlock>

          {/* §02 — V2 List */}
          <SectionBlock num="2" title="Variant 2 — List / index page (Organizations)" subtitle="Left: empty (root-level list for tab) · Center: 'Организации' · Right: plus + filter icons." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <PhoneFrame dark={false} height={680} label="V2 · Light">
                <V2List dark={false} />
              </PhoneFrame>
              <PhoneFrame dark={true} height={680} label="V2 · Dark">
                <V2List dark={true} />
              </PhoneFrame>
            </div>
          </SectionBlock>

          {/* §03 — V3 Detail */}
          <SectionBlock num="3" title="Variant 3 — Detail page (Organization)" subtitle="Left: back chevron + 'Назад' · Center: 'Mysafar OOO' (ellipsis if > 220 px) · Right: action dots → bottom sheet." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <PhoneFrame dark={false} height={680} label="V3 · Light">
                <V3Detail dark={false} />
              </PhoneFrame>
              <PhoneFrame dark={true} height={680} label="V3 · Dark">
                <V3Detail dark={true} />
              </PhoneFrame>
            </div>
          </SectionBlock>

          {/* §04 — V4 Modal */}
          <SectionBlock num="4" title="Variant 4 — Modal / create page (Compose)" subtitle="Left: X close · Center: 'Новое объявление' · Right: 'Отправить' text btn (blue active, disabled when form invalid)." t={t}>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <PhoneFrame dark={false} height={680} label="V4 · Light">
                <V4Modal dark={false} />
              </PhoneFrame>
              <PhoneFrame dark={true} height={680} label="V4 · Dark">
                <V4Modal dark={true} />
              </PhoneFrame>
            </div>
          </SectionBlock>

          {/* §05 — Spec table */}
          <SectionBlock num="5" title="Design tokens" subtitle="All dimensions, colors, and behavior specs." t={t}>
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
                  {SPEC_ROWS.map((row, i) => (
                    <tr key={row.k} style={{ borderBottom: i < SPEC_ROWS.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                      <td style={{ padding: '12px 20px', fontFamily: F.mono, fontSize: 13, color: t.blue, width: '40%' }}>{row.k}</td>
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
              Mobile Top Header · 4 variants × 2 scroll states × 2 themes · X-00 §1
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
