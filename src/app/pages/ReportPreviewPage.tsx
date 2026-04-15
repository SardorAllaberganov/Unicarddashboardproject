import React, { useState } from 'react';
import { ChevronRight, Download, X } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { useExportToast } from '../components/useExportToast';

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

interface PreviewRow {
  org: string;
  issued: number;
  sold: number;
  pct: number;
  k1: number;
  k2: number;
  k3: number;
  credited: number;
  withdrawn: number;
  balance: number;
}

const PREVIEW_ROWS: PreviewRow[] = [
  { org: 'Mysafar OOO',       issued: 500, sold: 230, pct: 46, k1: 185, k2: 120, k3: 45, credited: 1_825_000, withdrawn: 1_200_000, balance: 625_000 },
  { org: 'Unired Marketing',  issued: 500, sold: 310, pct: 62, k1: 280, k2: 190, k3: 78, credited: 2_740_000, withdrawn: 2_100_000, balance: 640_000 },
  { org: 'Express Finance',   issued: 400, sold: 180, pct: 45, k1: 150, k2: 95,  k3: 32, credited: 1_370_000, withdrawn: 980_000,   balance: 390_000 },
  { org: 'Digital Pay',       issued: 300, sold: 120, pct: 40, k1: 98,  k2: 65,  k3: 22, credited: 920_000,   withdrawn: 600_000,   balance: 320_000 },
  { org: 'SmartCard Group',   issued: 500, sold: 290, pct: 58, k1: 250, k2: 170, k3: 68, credited: 2_440_000, withdrawn: 1_800_000, balance: 640_000 },
  { org: 'PayVerse',          issued: 350, sold: 145, pct: 41, k1: 118, k2: 72,  k3: 28, credited: 1_085_000, withdrawn: 750_000,   balance: 335_000 },
  { org: 'FinBridge',         issued: 200, sold: 55,  pct: 28, k1: 42,  k2: 25,  k3: 8,  credited: 395_000,   withdrawn: 280_000,   balance: 115_000 },
  { org: 'CardPlus',          issued: 450, sold: 210, pct: 47, k1: 175, k2: 130, k3: 52, credited: 1_790_000, withdrawn: 1_180_000, balance: 610_000 },
];

const REPORT_TITLES: Record<string, string> = {
  organizations: 'Отчёт по организациям',
  sellers:       'Отчёт по продавцам',
  cards:         'Отчёт по картам',
  kpi:           'Отчёт по KPI',
  rewards:       'Отчёт по начислениям',
  withdrawals:   'Отчёт по выводам',
};

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function fmtNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function fmtDateRu(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

function ProgressInline({ pct, bold }: { pct: number; bold?: boolean }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', minWidth: '105px' }}>
      <div style={{ width: '56px', height: '5px', borderRadius: '3px', background: '#F3F4F6', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: C.blue }} />
      </div>
      <span style={{
        fontFamily: F.mono, fontSize: '12px', color: C.text1,
        fontWeight: bold ? 700 : 500, minWidth: '30px',
      }}>
        {pct}%
      </span>
    </div>
  );
}

const tdBase: React.CSSProperties = {
  padding: '10px 12px', whiteSpace: 'nowrap',
  fontFamily: F.inter, fontSize: '13px', color: C.text1,
};
const tdMono: React.CSSProperties = {
  padding: '10px 12px', whiteSpace: 'nowrap',
  fontFamily: F.mono, fontSize: '12px', color: C.text1,
};

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function ReportPreviewPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [closeHov, setCloseHov] = useState(false);
  const [cancelHov, setCancelHov] = useState(false);
  const [dlPrimaryHov, setDlPrimaryHov] = useState(false);
  const navigate = useNavigate();
  const { reportId } = useParams();
  const [params] = useSearchParams();
  const exportToast = useExportToast();

  const title = REPORT_TITLES[reportId ?? ''] ?? 'Отчёт';
  const from = params.get('from') ?? '2026-04-01';
  const to = params.get('to') ?? '2026-04-13';

  const triggerExport = () => {
    exportToast.start({
      subtitle: `${title} за ${fmtDateRu(from)}–${fmtDateRu(to)}`,
      fileName: `report_${reportId ?? 'all'}_${from.slice(0, 7)}.xlsx`,
      fileSize: '245 KB',
    });
  };

  const totals = PREVIEW_ROWS.reduce((t, r) => ({
    issued: t.issued + r.issued,
    sold: t.sold + r.sold,
    k1: t.k1 + r.k1,
    k2: t.k2 + r.k2,
    k3: t.k3 + r.k3,
    credited: t.credited + r.credited,
    withdrawn: t.withdrawn + r.withdrawn,
    balance: t.balance + r.balance,
  }), { issued: 0, sold: 0, k1: 0, k2: 0, k3: 0, credited: 0, withdrawn: 0, balance: 0 });
  const totalPct = Math.round((totals.sold / totals.issued) * 100);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/reports')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Отчёты</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Предпросмотр</span>
          </div>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: '16px', marginBottom: '18px', flexWrap: 'wrap',
          }}>
            <h1 style={{
              fontFamily: F.dm, fontSize: '22px', fontWeight: 700,
              color: C.text1, margin: 0, lineHeight: 1.2,
            }}>
              Предпросмотр: {title}
            </h1>

            <button
              onMouseEnter={() => setCloseHov(true)}
              onMouseLeave={() => setCloseHov(false)}
              onClick={() => navigate('/reports')}
              aria-label="Закрыть"
              style={{
                width: '36px', height: '36px',
                border: `1px solid ${closeHov ? '#D1D5DB' : C.border}`,
                borderRadius: '8px',
                background: closeHov ? '#F9FAFB' : C.surface,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
              }}
            >
              <X size={16} color={C.text3} strokeWidth={1.75} />
            </button>
          </div>

          {/* Content card */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', overflow: 'hidden',
          }}>
            {/* Subheader row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '14px 20px',
              borderBottom: `1px solid ${C.border}`,
              flexWrap: 'wrap',
            }}>
              <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
                Период:{' '}
                <span style={{ fontFamily: F.mono, color: C.text1 }}>
                  {fmtDateRu(from)} — {fmtDateRu(to)}
                </span>
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
                padding: '3px 10px', borderRadius: '10px',
                background: '#F3F4F6', color: C.text2,
                border: `1px solid ${C.border}`,
              }}>
                Предварительный
              </span>
            </div>

            {/* Table */}
            <div style={{ overflow: 'auto', maxHeight: '500px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '960px' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr style={{ background: '#F9FAFB', borderBottom: `1px solid ${C.border}` }}>
                    {['#', 'Организация', 'Карт выдано', 'Продано', '% продано', 'KPI 1', 'KPI 2', 'KPI 3', 'Начислено', 'Выведено', 'Баланс'].map(h => (
                      <th key={h} style={{
                        padding: '10px 12px', textAlign: 'left',
                        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
                        color: C.text3, textTransform: 'uppercase', letterSpacing: '0.04em',
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PREVIEW_ROWS.map((r, i) => (
                    <tr key={r.org} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={tdBase}><span style={{ fontFamily: F.mono, color: C.text3 }}>{i + 1}</span></td>
                      <td style={tdBase}>
                        <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1, fontWeight: 500 }}>{r.org}</span>
                      </td>
                      <td style={tdMono}>{r.issued}</td>
                      <td style={tdMono}>{r.sold}</td>
                      <td style={tdBase}>
                        <ProgressInline pct={r.pct} />
                      </td>
                      <td style={tdMono}>{r.k1}</td>
                      <td style={tdMono}>{r.k2}</td>
                      <td style={tdMono}>{r.k3}</td>
                      <td style={tdMono}>{fmtNum(r.credited)}</td>
                      <td style={tdMono}>{fmtNum(r.withdrawn)}</td>
                      <td style={{ ...tdMono, fontWeight: 600, color: C.blue }}>{fmtNum(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot style={{ position: 'sticky', bottom: 0 }}>
                  <tr style={{ background: '#F9FAFB', borderTop: `2px solid ${C.border}` }}>
                    <td style={{ ...tdBase, fontWeight: 700 }}></td>
                    <td style={{ ...tdBase, fontFamily: F.dm, fontSize: '13px', fontWeight: 700, color: C.text1 }}>ИТОГО</td>
                    <td style={{ ...tdMono, fontWeight: 700 }}>{totals.issued}</td>
                    <td style={{ ...tdMono, fontWeight: 700 }}>{totals.sold}</td>
                    <td style={tdBase}>
                      <ProgressInline pct={totalPct} bold />
                    </td>
                    <td style={{ ...tdMono, fontWeight: 700 }}>{totals.k1}</td>
                    <td style={{ ...tdMono, fontWeight: 700 }}>{totals.k2}</td>
                    <td style={{ ...tdMono, fontWeight: 700 }}>{totals.k3}</td>
                    <td style={{ ...tdMono, fontWeight: 700 }}>{fmtNum(totals.credited)}</td>
                    <td style={{ ...tdMono, fontWeight: 700 }}>{fmtNum(totals.withdrawn)}</td>
                    <td style={{ ...tdMono, fontWeight: 700, color: C.blue }}>{fmtNum(totals.balance)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '12px', padding: '14px 20px',
              borderTop: `1px solid ${C.border}`,
              flexWrap: 'wrap',
            }}>
              <span style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4 }}>
                <span style={{ fontFamily: F.mono, color: C.text2 }}>{PREVIEW_ROWS.length}</span> организаций,{' '}
                <span style={{ fontFamily: F.mono, color: C.text2 }}>{fmtNum(totals.issued)}</span> карт
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onMouseEnter={() => setCancelHov(true)}
                  onMouseLeave={() => setCancelHov(false)}
                  onClick={() => navigate('/reports')}
                  style={{
                    height: '38px', padding: '0 18px',
                    border: `1px solid ${C.border}`, borderRadius: '8px',
                    background: cancelHov ? '#F9FAFB' : C.surface,
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: C.text1, cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                >
                  Закрыть
                </button>
                <button
                  onMouseEnter={() => setDlPrimaryHov(true)}
                  onMouseLeave={() => setDlPrimaryHov(false)}
                  onClick={triggerExport}
                  aria-label="Скачать Excel"
                  style={{
                    height: '38px', padding: '0 18px',
                    border: 'none', borderRadius: '8px',
                    background: dlPrimaryHov ? C.blueHover : C.blue,
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: '#FFFFFF', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    boxShadow: dlPrimaryHov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
                    transition: 'all 0.15s',
                  }}
                >
                  <Download size={14} strokeWidth={2} />
                  Скачать Excel
                </button>
              </div>
            </div>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      {exportToast.node}
    </div>
  );
}
