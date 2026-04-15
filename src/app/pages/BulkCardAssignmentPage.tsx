import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useNavigate } from 'react-router';

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

interface Row {
  id: number;
  seller: string;
  current: number;
  assign: number;
}

const INITIAL_ROWS: Row[] = [
  { id: 1, seller: 'Санжар Мирзаев',   current: 100, assign: 0 },
  { id: 2, seller: 'Абдуллох Рахимов', current: 100, assign: 20 },
  { id: 3, seller: 'Ислом Тошматов',   current: 80,  assign: 15 },
  { id: 4, seller: 'Нилуфар Каримова', current: 100, assign: 25 },
  { id: 5, seller: 'Дарья Нам',        current: 70,  assign: 10 },
  { id: 6, seller: 'Камола Расулова',  current: 50,  assign: 0 },
];

const EXTRA_SELLERS = [
  'Фарход Султанов',
  'Диёра Рахманова',
  'Шахзод Каримов',
];

const TOTAL_AVAILABLE = 140;
const VISA_SUM_COUNT = 120;
const VISA_USD_COUNT = 20;

/* ═══════════════════════════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════════════════════════ */

function BadgeOutline({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '8px',
      border: `1px solid ${C.border}`, background: C.surface,
      color: C.text2, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NUMBER INPUT (inline table cell)
═══════════════════════════════════════════════════════════════════════════ */

function AssignInput({ value, max, onChange }: {
  value: number; max: number; onChange: (v: number) => void;
}) {
  const [focused, setFocused] = useState(false);
  const edited = value > 0;
  return (
    <input
      type="number"
      value={value}
      min={0}
      max={max}
      onChange={e => {
        const v = parseInt(e.target.value) || 0;
        onChange(Math.max(0, Math.min(max, v)));
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '90px', height: '36px', padding: '0 12px',
        border: `1px solid ${focused ? C.blue : edited ? C.blueTint : C.inputBorder}`,
        borderRadius: '7px',
        background: edited ? C.blueLt : C.surface,
        fontFamily: F.mono, fontSize: '13px',
        color: C.text1, fontWeight: edited ? 600 : 400,
        textAlign: 'center', outline: 'none', boxSizing: 'border-box',
        boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
        transition: 'border-color 0.12s, box-shadow 0.12s, background 0.12s',
      }}
    />
  );
}

function SellerSelect({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', minWidth: '200px' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: '36px', padding: '0 32px 0 10px',
          border: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderRadius: '7px', background: C.surface,
          fontFamily: F.inter, fontSize: '13px',
          color: value ? C.text1 : C.text4,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
        }}
      >
        <option value="">Выберите продавца</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} color={C.text3} style={{
        position: 'absolute', right: '10px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function BulkCardAssignmentPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);
  const [nextId, setNextId] = useState(100);
  const [cancelHov, setCancelHov] = useState(false);
  const [submitHov, setSubmitHov] = useState(false);
  const [addRowHov, setAddRowHov] = useState(false);
  const navigate = useNavigate();

  const totalToAssign = rows.reduce((s, r) => s + (r.assign || 0), 0);
  const remaining = TOTAL_AVAILABLE - totalToAssign;
  const progressPct = Math.min(100, Math.round((totalToAssign / TOTAL_AVAILABLE) * 100));
  const overLimit = totalToAssign > TOTAL_AVAILABLE;
  const canSubmit = totalToAssign > 0 && !overLimit;

  const updateAssign = (id: number, v: number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, assign: v } : r));
  };
  const updateSeller = (id: number, seller: string) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, seller } : r));
  };
  const addRow = () => {
    setRows(prev => [...prev, { id: nextId, seller: '', current: 0, assign: 0 }]);
    setNextId(i => i + 1);
  };
  const removeRow = (id: number) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const usedSellers = new Set(rows.map(r => r.seller).filter(Boolean));

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar role="org"
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
            <span onClick={() => navigate('/org-dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span onClick={() => navigate('/org-cards')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Карты</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Массовое назначение</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1, margin: '0 0 4px', lineHeight: 1.2 }}>
            Массовое назначение карт
          </h1>
          <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '0 0 22px' }}>
            Распределите карты со склада между продавцами
          </p>

          {/* Stock summary card */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', padding: '16px',
            marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
          }}>
            <div style={{
              fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: C.text1,
            }}>
              На складе доступно:{' '}
              <span style={{ fontFamily: F.mono, color: C.blue }}>{TOTAL_AVAILABLE}</span>{' '}
              карт
            </div>
            <div style={{ width: '1px', height: '20px', background: C.border }} />
            <BadgeOutline>VISA SUM: {VISA_SUM_COUNT}</BadgeOutline>
            <BadgeOutline>VISA USD: {VISA_USD_COUNT}</BadgeOutline>
          </div>

          {/* Assignment table card */}
          <div style={{
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '12px', padding: '24px',
            marginBottom: '20px',
          }}>
            <h2 style={{
              fontFamily: F.dm, fontSize: '15px', fontWeight: 700,
              color: C.text1, margin: '0 0 16px', lineHeight: 1.2,
            }}>
              Распределение
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    <th style={th}>Продавец</th>
                    <th style={th}>Текущие карты</th>
                    <th style={th}>Назначить</th>
                    <th style={th}>Итого будет</th>
                    <th style={{ ...th, width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => {
                    const highlight = r.assign > 0;
                    const total = r.current + r.assign;
                    const availableSellers = [
                      r.seller,
                      ...EXTRA_SELLERS.filter(s => !usedSellers.has(s)),
                    ].filter(Boolean);
                    const isCustom = !INITIAL_ROWS.some(ir => ir.id === r.id);
                    // Per-row cap = current value + remaining warehouse capacity
                    const rowMax = r.assign + Math.max(0, TOTAL_AVAILABLE - totalToAssign);

                    return (
                      <tr key={r.id} style={{
                        borderBottom: `1px solid ${C.border}`,
                        background: highlight ? 'rgba(219,234,254,0.30)' : 'transparent',
                        transition: 'background 0.12s',
                      }}>
                        <td style={td}>
                          {isCustom ? (
                            <SellerSelect
                              value={r.seller}
                              onChange={v => updateSeller(r.id, v)}
                              options={availableSellers}
                            />
                          ) : (
                            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text1, fontWeight: 500 }}>
                              {r.seller}
                            </span>
                          )}
                        </td>
                        <td style={td}>
                          <span style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
                            {r.current}
                          </span>
                        </td>
                        <td style={td}>
                          <AssignInput
                            value={r.assign}
                            max={rowMax}
                            onChange={v => updateAssign(r.id, v)}
                          />
                        </td>
                        <td style={td}>
                          <span style={{
                            fontFamily: F.mono, fontSize: '13px',
                            color: highlight ? C.blue : C.text1,
                            fontWeight: highlight ? 600 : 400,
                          }}>
                            {total}
                          </span>
                        </td>
                        <td style={{ ...td, textAlign: 'center' }}>
                          {isCustom && (
                            <button
                              onClick={() => removeRow(r.id)}
                              aria-label="Удалить строку"
                              style={{
                                width: '28px', height: '28px',
                                border: 'none', borderRadius: '6px',
                                background: 'transparent',
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'background 0.12s',
                              }}
                              onMouseEnter={e => { (e.currentTarget.style.background = C.errorBg); }}
                              onMouseLeave={e => { (e.currentTarget.style.background = 'transparent'); }}
                            >
                              <Trash2 size={14} color={C.text4} strokeWidth={1.75} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Add row */}
            <div style={{ marginTop: '14px' }}>
              <button
                onMouseEnter={() => setAddRowHov(true)}
                onMouseLeave={() => setAddRowHov(false)}
                onClick={addRow}
                style={{
                  height: '34px', padding: '0 12px',
                  border: 'none', borderRadius: '7px',
                  background: addRowHov ? C.blueLt : 'transparent',
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                  color: C.blue,
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  cursor: 'pointer', transition: 'background 0.12s',
                }}
              >
                <Plus size={14} strokeWidth={2} />
                Добавить строку
              </button>
            </div>
          </div>

          {/* Summary strip */}
          <div style={{
            background: C.surface,
            borderTop: `2px solid ${overLimit ? C.error : C.blue}`,
            borderRight: `1px solid ${C.border}`,
            borderBottom: `1px solid ${C.border}`,
            borderLeft: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '16px', flexWrap: 'wrap', marginBottom: '12px',
            }}>
              <div>
                <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 600, color: overLimit ? C.error : C.text1 }}>
                  К назначению: <span style={{ fontFamily: F.mono, color: overLimit ? C.error : C.blue }}>{totalToAssign}</span> карт из{' '}
                  <span style={{ fontFamily: F.mono }}>{TOTAL_AVAILABLE}</span> доступных
                </div>
                <div style={{
                  fontFamily: F.inter, fontSize: '12px', color: C.text3,
                  marginTop: '4px',
                }}>
                  {overLimit
                    ? `Превышение на ${Math.abs(remaining)} карт`
                    : <>Останется на складе: <span style={{ fontFamily: F.mono, color: C.text2, fontWeight: 500 }}>{remaining}</span></>
                  }
                </div>
              </div>
              <div style={{
                fontFamily: F.mono, fontSize: '13px', fontWeight: 600,
                color: overLimit ? C.error : C.blue,
              }}>
                {progressPct}%
              </div>
            </div>

            <div style={{
              height: '8px', borderRadius: '4px',
              background: '#F3F4F6', overflow: 'hidden',
            }}>
              <div style={{
                width: `${progressPct}%`, height: '100%',
                background: overLimit ? C.error : C.blue,
                borderRadius: '4px',
                transition: 'width 0.25s ease',
              }} />
            </div>
          </div>

          {/* Footer actions */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: '12px', marginTop: '8px', flexWrap: 'wrap',
          }}>
            <button
              onMouseEnter={() => setCancelHov(true)}
              onMouseLeave={() => setCancelHov(false)}
              onClick={() => navigate('/org-cards')}
              style={{
                height: '40px', padding: '0 20px',
                border: `1px solid ${C.border}`, borderRadius: '8px',
                background: cancelHov ? '#F9FAFB' : C.surface,
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: C.text1, cursor: 'pointer',
                transition: 'background 0.12s',
              }}
            >
              Отмена
            </button>

            <button
              onMouseEnter={() => setSubmitHov(true)}
              onMouseLeave={() => setSubmitHov(false)}
              onClick={() => { if (canSubmit) navigate('/org-cards'); }}
              disabled={!canSubmit}
              aria-label={`Назначить ${totalToAssign} карт`}
              style={{
                height: '40px', padding: '0 22px',
                border: 'none', borderRadius: '8px',
                background: !canSubmit ? '#93C5FD' : submitHov ? C.blueHover : C.blue,
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: '#FFFFFF',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                opacity: canSubmit ? 1 : 0.85,
                boxShadow: canSubmit && submitHov ? '0 2px 8px rgba(37,99,235,0.28)' : canSubmit ? '0 1px 3px rgba(37,99,235,0.16)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              Назначить {totalToAssign} карт
            </button>
          </div>

          <div style={{ height: '40px' }} />
        </div>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: '10px 12px', textAlign: 'left',
  fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
  color: C.text3, textTransform: 'uppercase', letterSpacing: '0.05em',
  whiteSpace: 'nowrap',
};

const td: React.CSSProperties = {
  padding: '10px 12px', verticalAlign: 'middle',
};
