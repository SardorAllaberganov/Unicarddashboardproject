import React, { useState } from 'react';
import { ChevronRight, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { SectionBlock } from '../components/mds/frame';
import { M_Navigation } from '../components/mds/M_Navigation';
import { M_Lists } from '../components/mds/M_Lists';
import { M_Cards } from '../components/mds/M_Cards';
import { M_Sheets } from '../components/mds/M_Sheets';
import { M_Detail } from '../components/mds/M_Detail';
import { M_Forms } from '../components/mds/M_Forms';
import { M_Feedback } from '../components/mds/M_Feedback';
import { M_Advanced } from '../components/mds/M_Advanced';

export default function MobileDesignSystemPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useDarkMode();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const t = theme(darkMode);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar role="bank"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span
              onClick={() => navigate('/design-system')}
              style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}
            >
              Дизайн-система
            </span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Mobile · 390×844</span>
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: t.blueLt,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Smartphone size={22} color={t.blue} strokeWidth={2} />
            </div>
            <div>
              <h1 style={{ fontFamily: F.dm, fontSize: '26px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Mobile Design System
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
                Master reference for all mobile screens · 390×844 baseline · iOS HIG + Material 3 hybrid
              </p>
            </div>
          </div>

          {/* Meta strip */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {[
              { k: 'Viewport', v: '390 × 844' },
              { k: 'Header', v: '56 + safe-top' },
              { k: 'Tab Bar', v: '64 + safe-bottom' },
              { k: 'Card Radius', v: '16 px' },
              { k: 'Base Grid', v: '4 px' },
              { k: 'Touch Target', v: '48 × 48' },
            ].map(m => (
              <div key={m.k} style={{
                background: t.surface, border: `1px solid ${t.border}`,
                borderRadius: '8px', padding: '6px 12px',
                display: 'flex', gap: '8px', alignItems: 'center',
              }}>
                <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>{m.k}:</span>
                <span style={{ fontFamily: F.mono, fontSize: '12px', fontWeight: 500, color: t.blue }}>{m.v}</span>
              </div>
            ))}
          </div>

          {/* TOC */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px',
            padding: '16px 20px', marginBottom: '32px',
          }}>
            <div style={{
              fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
              color: t.text4, textTransform: 'uppercase', letterSpacing: '0.06em',
              marginBottom: '10px',
            }}>
              Contents
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '6px 20px' }}>
              {TOC.map(e => (
                <div key={e.num} style={{ display: 'flex', gap: '8px', fontFamily: F.inter, fontSize: '13px' }}>
                  <span style={{ fontFamily: F.mono, color: t.text4, minWidth: '28px' }}>§{e.num}</span>
                  <span style={{ color: t.text2 }}>{e.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          <SectionBlock num="1" title="Top Header Variants" subtitle="Root / detail / modal-style / large-title. 56 px + safe-area-top. Shadow + blur appear on scroll." t={t}>
            <M_Navigation.Headers t={t} />
          </SectionBlock>

          <SectionBlock num="2" title="Bottom Tab Bar" subtitle="64 px + safe-area-bottom. 4 tabs, icon 28 + label 11/500. Backdrop-blur bg." t={t}>
            <M_Navigation.TabBars t={t} />
          </SectionBlock>

          <SectionBlock num="3" title="More Menu — App Grid" subtitle="Full-screen page opened from ‘Ещё’ tab. 3-column grid of 100×100 tiles grouped by section." t={t}>
            <M_Navigation.MoreMenu t={t} />
          </SectionBlock>

          <SectionBlock num="4" title="List Row" subtitle="Replaces desktop table rows. 64 px min-height, padding 16 px. Optional avatar / badge / chevron." t={t}>
            <M_Lists.Rows t={t} />
          </SectionBlock>

          <SectionBlock num="5" title="Section Header" subtitle="Grouped-list label. Inter 11/600 uppercase, padding 24-16-8." t={t}>
            <M_Lists.SectionHeaders t={t} />
          </SectionBlock>

          <SectionBlock num="6" title="Stat Cards — Mobile" subtitle="Single-column + 2×2 grid. 48 px icon circle, DM Sans 28/700 value, trend pill." t={t}>
            <M_Cards.Stats t={t} />
          </SectionBlock>

          <SectionBlock num="7" title="Filter Sheet — Full-Screen" subtitle="Slide-up from bottom, X close + title + Сбросить. Sticky footer with apply count." t={t}>
            <M_Sheets.FilterSheet t={t} />
          </SectionBlock>

          <SectionBlock num="8" title="Detail Page Layout" subtitle="Back + title + ⋯. Hero section, 2×2 stats, segmented tabs, stacked content." t={t}>
            <M_Detail.Page t={t} />
          </SectionBlock>

          <SectionBlock num="9" title="Segmented Control" subtitle="iOS-style pill selector. Track bg + elevated active pill. 36 px height." t={t}>
            <M_Detail.Segmented t={t} />
          </SectionBlock>

          <SectionBlock num="10" title="Form Layout" subtitle="Grouped fields, 48 px inputs, focus 2 px blue, sticky action bar at bottom." t={t}>
            <M_Forms.Layout t={t} />
          </SectionBlock>

          <SectionBlock num="11" title="Bottom Sheet" subtitle="Slide-up action sheet. Handle bar, rounded-24 top, swipe-down dismiss." t={t}>
            <M_Sheets.BottomSheet t={t} />
          </SectionBlock>

          <SectionBlock num="12" title="Sticky Action Bar" subtitle="Full-width primary at viewport bottom, above tab bar. Blurred bg when scrolled." t={t}>
            <M_Forms.StickyAction t={t} />
          </SectionBlock>

          <SectionBlock num="13" title="Toast / Snackbar" subtitle="4 variants — success / info / warning / error. Bottom, above tab bar." t={t}>
            <M_Feedback.Toasts t={t} />
          </SectionBlock>

          <SectionBlock num="14" title="Pull-to-Refresh" subtitle="3 states — idle / pulling / refreshing. Circular spinner at top of scroll." t={t}>
            <M_Feedback.PullToRefresh t={t} />
          </SectionBlock>

          <SectionBlock num="15" title="Empty State — Mobile" subtitle="Centered icon 64 + heading 20/600 + subtext + primary CTA." t={t}>
            <M_Feedback.Empty t={t} />
          </SectionBlock>

          <SectionBlock num="16" title="Skeleton Loaders" subtitle="List skeleton (6 rows) + stat-card skeleton. Shimmer 1.5 s gradient." t={t}>
            <M_Feedback.Skeleton t={t} />
          </SectionBlock>

          <SectionBlock num="17" title="Search Bar" subtitle="44 px height, fill #F3F4F6 / #2D3148. Focused state reveals Отмена button." t={t}>
            <M_Forms.Search t={t} />
          </SectionBlock>

          <SectionBlock num="18" title="KPI Stepper — Mobile" subtitle="Variant B vertical. 40 px circles, 10 px progress bar, stacked cards." t={t}>
            <M_Advanced.KpiStepper t={t} />
          </SectionBlock>

          <SectionBlock num="19" title="Badges — Mobile" subtitle="Same palette as desktop but 13 px text instead of 12 for legibility." t={t}>
            <M_Advanced.Badges t={t} />
          </SectionBlock>

          <SectionBlock num="20" title="Swipe Actions" subtitle="Swipe left reveals Редактировать (blue) + Удалить (red). 80 px wide each." t={t}>
            <M_Lists.SwipeActions t={t} />
          </SectionBlock>

          {/* Footer */}
          <div style={{ marginTop: '64px', paddingTop: '24px', borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text4 }}>
              Mobile Design System · v1.0 · 20 sections · 390 × 844 baseline
            </span>
            <span style={{ fontFamily: F.mono, fontSize: '12px', color: t.textDisabled }}>
              © 2026 Moment Finance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const TOC = [
  { num: '1',  title: 'Top Header Variants' },
  { num: '2',  title: 'Bottom Tab Bar' },
  { num: '3',  title: 'More Menu — App Grid' },
  { num: '4',  title: 'List Row' },
  { num: '5',  title: 'Section Header' },
  { num: '6',  title: 'Stat Cards — Mobile' },
  { num: '7',  title: 'Filter Sheet' },
  { num: '8',  title: 'Detail Page Layout' },
  { num: '9',  title: 'Segmented Control' },
  { num: '10', title: 'Form Layout' },
  { num: '11', title: 'Bottom Sheet' },
  { num: '12', title: 'Sticky Action Bar' },
  { num: '13', title: 'Toast / Snackbar' },
  { num: '14', title: 'Pull-to-Refresh' },
  { num: '15', title: 'Empty State' },
  { num: '16', title: 'Skeleton Loaders' },
  { num: '17', title: 'Search Bar' },
  { num: '18', title: 'KPI Stepper — Mobile' },
  { num: '19', title: 'Badges — Mobile' },
  { num: '20', title: 'Swipe Actions' },
];
