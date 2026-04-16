import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { F, C, theme } from './tokens';
import { useDarkMode } from '../useDarkMode';

type T = ReturnType<typeof theme>;

// ─── FUNNEL BAR CHART ────────────────────────────────────────────────────

const FUNNEL_LIGHT = ['#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'];
const FUNNEL_DARK  = ['#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF'];

const funnelRows = [
  { label: 'Выдано карт',      count: 5000, pct: null   },
  { label: 'Продано клиентам', count: 2340, pct: '46.8%' },
  { label: 'KPI 1 выполнено',  count: 1890, pct: '37.8%' },
  { label: 'KPI 2 выполнено',  count: 1210, pct: '24.2%' },
  { label: 'KPI 3 выполнено',  count: 567,  pct: '11.3%' },
];

const maxFunnel = 5000;

function FunnelChart({ t, dark }: { t: T; dark: boolean }) {
  const palette = dark ? FUNNEL_DARK : FUNNEL_LIGHT;
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px', flex: 1 }}>
      <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '4px' }}>
        Воронка KPI
      </div>
      <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '24px' }}>
        Апрель 2026 — Все организации
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {funnelRows.map((row, i) => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '160px', flexShrink: 0, fontFamily: F.inter, fontSize: '14px', color: t.text2, textAlign: 'right' }}>
              {row.label}
            </div>
            <div style={{ flex: 1, height: '10px', borderRadius: '5px', background: t.progressTrack, overflow: 'hidden' }}>
              <div style={{ width: `${(row.count / maxFunnel) * 100}%`, height: '100%', background: palette[i], borderRadius: '5px' }} />
            </div>
            <div style={{ width: '140px', flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontFamily: F.dm, fontSize: '14px', fontWeight: 600, color: t.text1 }}>
                {row.count.toLocaleString()}
              </span>
              {row.pct && (
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>({row.pct})</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DONUT CHART ─────────────────────────────────────────────────────────

const DONUT_LIGHT = ['#3B82F6', '#60A5FA', '#93C5FD'];
const DONUT_DARK  = ['#3B82F6', '#2563EB', '#1D4ED8'];

const donutData = [
  { name: 'KPI 1 — Начисления', value: 9450000, pct: '51.8%' },
  { name: 'KPI 2 — Начисления', value: 5680000, pct: '31.1%' },
  { name: 'KPI 3 — Начисления', value: 3120000, pct: '17.1%' },
];

function DonutChart({ t, dark }: { t: T; dark: boolean }) {
  const palette = dark ? DONUT_DARK : DONUT_LIGHT;
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px', flex: 1 }}>
      <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '4px' }}>
        Начисления по KPI
      </div>
      <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '20px' }}>
        Распределение вознаграждений
      </div>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Chart */}
        <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                dataKey="value"
                strokeWidth={2}
                stroke={t.surface}
              >
                {donutData.map((_, i) => (
                  <Cell key={i} fill={palette[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => `${Number(v).toLocaleString()} UZS`}
                contentStyle={{ fontFamily: F.inter, fontSize: '12px', borderRadius: '8px', border: `1px solid ${t.border}`, background: t.surface, color: t.text1 }}
                itemStyle={{ color: t.text1 }}
                labelStyle={{ color: t.text1 }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
            <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, lineHeight: 1.1 }}>
              18.25M
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: t.text3 }}>UZS</div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {donutData.map((item, i) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: palette[i], flexShrink: 0 }} />
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>{item.name}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontFamily: F.mono, fontSize: '13px', fontWeight: 500, color: t.text1 }}>
                  {(item.value / 1000000).toFixed(2)}M
                </span>
                <span style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>{item.pct}</span>
              </div>
            </div>
          ))}
          <div style={{ height: '1px', background: t.border, margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text2 }}>Итого начислено</span>
            <span style={{ fontFamily: F.mono, fontSize: '14px', fontWeight: 600, color: t.text1 }}>18,250,000 UZS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HORIZONTAL BAR CHART ─────────────────────────────────────────────────

const sellerData = [
  { name: 'Абдуллох Рашидов', org: 'Mysafar',    value: 2500000 },
  { name: 'Камола Юсупова',   org: 'Alif Group', value: 1980000 },
  { name: 'Бобур Назаров',    org: 'TechCom',    value: 1760000 },
  { name: 'Дилноза Алиева',   org: 'Mysafar',    value: 1420000 },
  { name: 'Санжар Холматов',  org: 'Alif Group', value: 1250000 },
  { name: 'Нилуфар Каримова', org: 'UzInvest',   value: 980000  },
];

const maxSeller = Math.max(...sellerData.map(d => d.value));

function HorizontalBarChart({ t }: { t: T }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px', flex: 1 }}>
      <div style={{ fontFamily: F.dm, fontSize: '18px', fontWeight: 600, color: t.text1, marginBottom: '4px' }}>
        Топ продавцов
      </div>
      <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: '24px' }}>
        По сумме начислений (UZS)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {sellerData.map((seller, i) => (
          <div key={seller.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '28px', flexShrink: 0, fontFamily: F.inter, fontSize: '12px', color: t.text4, textAlign: 'right' }}>
              {i + 1}.
            </div>
            <div style={{ width: '140px', flexShrink: 0 }}>
              <div style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{seller.name}</div>
              <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text4 }}>{seller.org}</div>
            </div>
            <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: t.progressTrack, overflow: 'hidden' }}>
              <div style={{ width: `${(seller.value / maxSeller) * 100}%`, height: '100%', background: t.blue, borderRadius: '4px' }} />
            </div>
            <div style={{ width: '110px', flexShrink: 0, textAlign: 'right', fontFamily: F.mono, fontSize: '14px', fontWeight: 500, color: t.text1 }}>
              {seller.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Row6Charts() {
  const [darkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'stretch', flexWrap: 'wrap' }}>
      <FunnelChart t={t} dark={dark} />
      <DonutChart t={t} dark={dark} />
      <HorizontalBarChart t={t} />
    </div>
  );
}
