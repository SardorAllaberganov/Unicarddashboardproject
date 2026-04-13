import React from 'react';
import { Row1ColorTypo } from '../components/ds/Row1_ColorTypo';
import { Row2SidebarBtnBadge } from '../components/ds/Row2_SidebarBtnBadge';
import { Row3StatCards } from '../components/ds/Row3_StatCards';
import { Row4Table } from '../components/ds/Row4_Table';
import { Row5KPIStepper } from '../components/ds/Row5_KPIStepper';
import { Row6Charts } from '../components/ds/Row6_Charts';
import { Row7Forms } from '../components/ds/Row7_Forms';
import { Row8DrawerModalToast } from '../components/ds/Row8_DrawerModalToast';
import { Row9Misc } from '../components/ds/Row9_Misc';
import { Row10DateDark } from '../components/ds/Row10_DateDark';

const inter = "'Inter', sans-serif";
const dm = "'DM Sans', sans-serif";

function SectionLabel({ row, title }: { row: string; title: string }) {
  return (
    <div style={{ marginBottom: '24px', marginTop: '48px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '10px' }}>
        <span style={{
          fontFamily: inter,
          fontSize: '11px',
          fontWeight: 600,
          color: '#9CA3AF',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.06em',
          background: '#F3F4F6',
          border: '1px solid #E5E7EB',
          borderRadius: '4px',
          padding: '2px 8px',
        }}>
          {row}
        </span>
        <h2 style={{
          fontFamily: inter,
          fontSize: '16px',
          fontWeight: 600,
          color: '#111827',
          margin: 0,
        }}>
          {title}
        </h2>
      </div>
      <div style={{ height: '1px', background: '#E5E7EB' }} />
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div style={{
      background: '#F3F4F6',
      minHeight: '100vh',
      padding: '48px 40px',
      fontFamily: inter,
    }}>
      <div style={{ maxWidth: '1840px', margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#2563EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: dm, fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>M</span>
            </div>
            <div>
              <h1 style={{
                fontFamily: dm, fontSize: '28px', fontWeight: 700, color: '#111827',
                margin: 0, lineHeight: 1.2,
              }}>
                Moment Card KPI Platform
              </h1>
              <p style={{ fontFamily: inter, fontSize: '14px', color: '#6B7280', margin: '2px 0 0' }}>
                Design System & UI Component Library — v1.0.0 · 1920×1080
              </p>
            </div>
          </div>

          {/* Meta strip */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { label: 'Primary Font', value: 'Inter' },
              { label: 'Heading Font', value: 'DM Sans' },
              { label: 'Mono Font', value: 'JetBrains Mono' },
              { label: 'Base Grid', value: '4px' },
              { label: 'Border Radius', value: '12px' },
              { label: 'Components', value: '22' },
            ].map(item => (
              <div key={item.label} style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '6px 14px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}>
                <span style={{ fontFamily: inter, fontSize: '12px', color: '#9CA3AF' }}>{item.label}:</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 500, color: '#2563EB' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <SectionLabel row="Row 1" title="Color Tokens & Typography Scale" />
        <Row1ColorTypo />

        <SectionLabel row="Row 2" title="Sidebar Navigation · Button Variants · Badge Variants · Stat Pills" />
        <Row2SidebarBtnBadge />

        <SectionLabel row="Row 3" title="Stat Cards (6 variants) · Breadcrumb Navigation" />
        <Row3StatCards />

        <SectionLabel row="Row 4" title="Data Table — All cell types · Filter Bar · Pagination" />
        <Row4Table />

        <SectionLabel row="Row 5" title="KPI Stepper — Variant A (Config Builder) · Variant B (Progress Tracker)" />
        <Row5KPIStepper />

        <SectionLabel row="Row 6" title="Funnel Bar Chart · Donut Chart · Horizontal Bar Chart" />
        <Row6Charts />

        <SectionLabel row="Row 7" title="Form Components — All Variants" />
        <Row7Forms />

        <SectionLabel row="Row 8" title="Detail Drawer · Modal Dialogs (2 variants) · Toast Notifications (4 variants)" />
        <Row8DrawerModalToast />

        <SectionLabel row="Row 9" title="File Upload · Empty State · Card Status Flow · Activity Timeline" />
        <Row9Misc />

        <SectionLabel row="Row 10" title="Date Range Picker · Dark Theme Token Overrides" />
        <Row10DateDark />

        {/* Footer */}
        <div style={{ marginTop: '64px', paddingTop: '24px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: inter, fontSize: '13px', color: '#9CA3AF' }}>
            Moment Card KPI Platform · Design System v1.0.0 · 22 components
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#D1D5DB' }}>
            © 2026 Moment Finance
          </span>
        </div>
      </div>
    </div>
  );
}
