import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════════════════ */

interface SellerOption {
  id: number;
  name: string;
  assigned: number;
  sold: number;
  onHand: number;
}

const SELLERS: SellerOption[] = [
  { id: 1, name: 'Санжар Мирзаев',  assigned: 100, sold: 62, onHand: 38 },
  { id: 2, name: 'Абдуллох Рахимов', assigned: 100, sold: 45, onHand: 55 },
  { id: 3, name: 'Ислом Тошматов',   assigned: 80,  sold: 42, onHand: 38 },
  { id: 4, name: 'Нилуфар Каримова', assigned: 100, sold: 33, onHand: 67 },
  { id: 5, name: 'Дарья Нам',        assigned: 70,  sold: 30, onHand: 40 },
  { id: 6, name: 'Камола Расулова',  assigned: 50,  sold: 18, onHand: 32 },
];

interface CardItem {
  id: number;
  number: string;
  type: string;
}

const AVAILABLE_CARDS: CardItem[] = [
  { id: 1,  number: '8600 1234 5678 3001', type: 'VISA SUM' },
  { id: 2,  number: '8600 1234 5678 3002', type: 'VISA SUM' },
  { id: 3,  number: '8600 1234 5678 3003', type: 'VISA USD' },
  { id: 4,  number: '8600 1234 5678 3004', type: 'VISA SUM' },
  { id: 5,  number: '8600 1234 5678 3005', type: 'VISA SUM' },
  { id: 6,  number: '8600 1234 5678 3006', type: 'VISA USD' },
  { id: 7,  number: '8600 1234 5678 3007', type: 'VISA SUM' },
  { id: 8,  number: '8600 1234 5678 3008', type: 'VISA SUM' },
  { id: 9,  number: '8600 1234 5678 3009', type: 'VISA SUM' },
  { id: 10, number: '8600 1234 5678 3010', type: 'VISA USD' },
  { id: 11, number: '8600 1234 5678 3011', type: 'VISA SUM' },
  { id: 12, number: '8600 1234 5678 3012', type: 'VISA SUM' },
  { id: 13, number: '8600 1234 5678 3013', type: 'VISA SUM' },
  { id: 14, number: '8600 1234 5678 3014', type: 'VISA USD' },
  { id: 15, number: '8600 1234 5678 3015', type: 'VISA SUM' },
  { id: 16, number: '8600 1234 5678 3016', type: 'VISA SUM' },
  { id: 17, number: '8600 1234 5678 3017', type: 'VISA SUM' },
  { id: 18, number: '8600 1234 5678 3018', type: 'VISA USD' },
  { id: 19, number: '8600 1234 5678 3019', type: 'VISA SUM' },
  { id: 20, number: '8600 1234 5678 3020', type: 'VISA SUM' },
  { id: 21, number: '8600 1234 5678 3021', type: 'VISA SUM' },
  { id: 22, number: '8600 1234 5678 3022', type: 'VISA USD' },
  { id: 23, number: '8600 1234 5678 3023', type: 'VISA SUM' },
  { id: 24, number: '8600 1234 5678 3024', type: 'VISA SUM' },
  { id: 25, number: '8600 1234 5678 3025', type: 'VISA SUM' },
  { id: 26, number: '8600 1234 5678 3026', type: 'VISA USD' },
  { id: 27, number: '8600 1234 5678 3027', type: 'VISA SUM' },
  { id: 28, number: '8600 1234 5678 3028', type: 'VISA SUM' },
  { id: 29, number: '8600 1234 5678 3029', type: 'VISA SUM' },
  { id: 30, number: '8600 1234 5678 3030', type: 'VISA SUM' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   BADGE OUTLINE
═══════════════════════════════════════════════════════════════════════════ */

function BadgeOutline({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 500,
      padding: '3px 9px', borderRadius: '8px',
      background: 'transparent', border: `1px solid ${t.border}`,
      color: t.text2, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHECKBOX
═══════════════════════════════════════════════════════════════════════════ */

function Checkbox({ checked, onChange, t }: { checked: boolean; onChange: () => void; t: T }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: '16px', height: '16px', borderRadius: '4px',
        border: `1.5px solid ${checked ? t.blue : t.inputBorder}`,
        background: checked ? t.blue : t.surface,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: 'all 0.12s',
      }}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5L4.5 7.5L8 3" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RADIO
═══════════════════════════════════════════════════════════════════════════ */

function Radio({ checked, onClick, t }: { checked: boolean; onClick: () => void; t: T }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '16px', height: '16px', borderRadius: '50%',
        border: `2px solid ${checked ? t.blue : t.inputBorder}`,
        background: checked ? t.blue : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: 'all 0.12s',
      }}
    >
      {checked && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function CardAssignmentPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [sellerSelectFocused, setSellerSelectFocused] = useState(false);

  const [assignMode, setAssignMode] = useState<'count' | 'manual'>('count');
  const [cardCount, setCardCount] = useState(25);
  const [selectedCardIds, setSelectedCardIds] = useState<Set<number>>(() => new Set([1, 2]));

  const [cancelHov, setCancelHov] = useState(false);
  const [submitHov, setSubmitHov] = useState(false);
  const [toggleAllHov, setToggleAllHov] = useState(false);

  const selectedSeller = SELLERS.find(s => s.id === selectedSellerId) ?? null;

  const totalSelected = assignMode === 'count' ? cardCount : selectedCardIds.size;
  const canSubmit = selectedSeller && totalSelected > 0;

  const toggleCard = (id: number) => {
    setSelectedCardIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedCardIds(new Set(AVAILABLE_CARDS.map(c => c.id)));
  const deselectAll = () => setSelectedCardIds(new Set());

  const rowSelectedBg = dark ? 'rgba(59,130,246,0.15)' : t.blueLt;
  const disabledSubmitBg = dark ? t.border : C.border;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/org-dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Назначение карт</span>
          </div>

          {/* Top Bar */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
              Назначение карт
            </h1>
            <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
              Назначьте карты со склада продавцам
            </p>
          </div>

          {/* ── Step 1: Select Seller ── */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '12px', padding: '24px', marginBottom: '16px',
          }}>
            <div style={{
              fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
              color: t.text4, textTransform: 'uppercase', letterSpacing: '0.07em',
              marginBottom: '16px',
            }}>
              Шаг 1 — Выберите продавца
            </div>

            <label style={{
              display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: t.text2, marginBottom: '8px',
            }}>
              Выберите продавца
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedSellerId ?? ''}
                onChange={e => setSelectedSellerId(e.target.value ? Number(e.target.value) : null)}
                onFocus={() => setSellerSelectFocused(true)}
                onBlur={() => setSellerSelectFocused(false)}
                style={{
                  width: '100%', height: '40px', padding: '0 36px 0 12px',
                  border: `1px solid ${sellerSelectFocused ? t.blue : t.inputBorder}`,
                  borderRadius: '8px', background: t.surface,
                  fontFamily: F.inter, fontSize: '14px', color: t.text1,
                  outline: 'none', appearance: 'none', cursor: 'pointer',
                  boxSizing: 'border-box',
                  boxShadow: sellerSelectFocused ? `0 0 0 3px ${t.focusRing}` : 'none',
                  transition: 'border-color 0.12s, box-shadow 0.12s',
                }}
              >
                <option value="">Выберите продавца...</option>
                {SELLERS.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.assigned} карт)
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color={t.text3} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none',
              }} />
            </div>

            {/* Selected seller info */}
            {selectedSeller && (
              <div style={{
                marginTop: '16px', padding: '16px',
                background: t.pageBg, border: `1px solid ${t.border}`,
                borderRadius: '10px',
              }}>
                <div style={{
                  fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
                  color: t.text1, marginBottom: '8px',
                }}>
                  {selectedSeller.name}
                </div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
                    Назначено: <span style={{ fontFamily: F.mono, fontWeight: 500, color: t.text2 }}>{selectedSeller.assigned}</span>
                  </span>
                  <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
                    Продано: <span style={{ fontFamily: F.mono, fontWeight: 500, color: t.text2 }}>{selectedSeller.sold}</span>
                  </span>
                  <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
                    На руках: <span style={{ fontFamily: F.mono, fontWeight: 500, color: t.text2 }}>{selectedSeller.onHand}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Step 2: Select Cards ── */}
          <div style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: '12px', padding: '24px', marginBottom: '16px',
          }}>
            <div style={{
              fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
              color: t.text4, textTransform: 'uppercase', letterSpacing: '0.07em',
              marginBottom: '16px',
            }}>
              Шаг 2 — Выберите карты для назначения
            </div>

            {/* Radio: count mode */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div
                  onClick={() => setAssignMode('count')}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}
                >
                  <Radio checked={assignMode === 'count'} onClick={() => setAssignMode('count')} t={t} />
                  <span style={{
                    fontFamily: F.inter, fontSize: '14px',
                    fontWeight: assignMode === 'count' ? 500 : 400,
                    color: assignMode === 'count' ? t.text1 : t.text2,
                  }}>
                    Назначить количество
                  </span>
                </div>

                {assignMode === 'count' && (
                  <div style={{ marginLeft: '26px' }}>
                    <input
                      type="number"
                      min={1}
                      max={AVAILABLE_CARDS.length}
                      value={cardCount}
                      onChange={e => setCardCount(Math.max(1, Math.min(AVAILABLE_CARDS.length, parseInt(e.target.value) || 1)))}
                      style={{
                        width: '120px', height: '40px', padding: '0 12px',
                        border: `1px solid ${t.inputBorder}`, borderRadius: '8px',
                        background: t.surface, fontFamily: F.mono, fontSize: '14px',
                        color: t.text1, outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                    <div style={{
                      fontFamily: F.inter, fontSize: '12px', color: t.text4, marginTop: '6px',
                    }}>
                      Система выберет карты автоматически
                    </div>
                  </div>
                )}
              </div>

              {/* Radio: manual mode */}
              <div>
                <div
                  onClick={() => setAssignMode('manual')}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}
                >
                  <Radio checked={assignMode === 'manual'} onClick={() => setAssignMode('manual')} t={t} />
                  <span style={{
                    fontFamily: F.inter, fontSize: '14px',
                    fontWeight: assignMode === 'manual' ? 500 : 400,
                    color: assignMode === 'manual' ? t.text1 : t.text2,
                  }}>
                    Выбрать конкретные карты
                  </span>
                </div>

                {assignMode === 'manual' && (
                  <div style={{ marginLeft: '26px' }}>
                    {/* Scrollable card list */}
                    <div style={{
                      maxHeight: '300px', overflowY: 'auto',
                      border: `1px solid ${t.border}`, borderRadius: '10px',
                      scrollbarWidth: 'thin', scrollbarColor: `${t.border} transparent`,
                    }}>
                      {AVAILABLE_CARDS.map((card, i) => {
                        const isSelected = selectedCardIds.has(card.id);
                        return (
                          <div
                            key={card.id}
                            onClick={() => toggleCard(card.id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '12px',
                              padding: '10px 14px',
                              borderBottom: i < AVAILABLE_CARDS.length - 1 ? `1px solid ${t.border}` : 'none',
                              cursor: 'pointer',
                              background: isSelected ? rowSelectedBg : t.surface,
                              transition: 'background 0.1s',
                            }}
                          >
                            <Checkbox checked={isSelected} onChange={() => toggleCard(card.id)} t={t} />
                            <span style={{ fontFamily: F.mono, fontSize: '13px', color: t.text1, flex: 1 }}>
                              {card.number}
                            </span>
                            <BadgeOutline t={t}>{card.type}</BadgeOutline>
                          </div>
                        );
                      })}
                    </div>

                    {/* Selected count + toggle all */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginTop: '12px',
                    }}>
                      <span style={{
                        fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: t.blue,
                      }}>
                        Выбрано: {selectedCardIds.size} карт
                      </span>
                      <button
                        onClick={selectedCardIds.size === AVAILABLE_CARDS.length ? deselectAll : selectAll}
                        onMouseEnter={() => setToggleAllHov(true)}
                        onMouseLeave={() => setToggleAllHov(false)}
                        style={{
                          border: 'none',
                          background: toggleAllHov ? t.tableHover : 'none',
                          fontFamily: F.inter, fontSize: '13px',
                          color: toggleAllHov ? t.text1 : t.text3,
                          cursor: 'pointer', padding: '4px 8px', borderRadius: '6px',
                          transition: 'color 0.12s, background 0.12s',
                        }}
                      >
                        {selectedCardIds.size === AVAILABLE_CARDS.length ? 'Снять все' : 'Выбрать все'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Summary Card ── */}
          {canSubmit && (
            <div style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderLeft: `4px solid ${t.blue}`,
              borderRadius: '12px', padding: '20px 24px', marginBottom: '24px',
            }}>
              <div style={{
                fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1,
                marginBottom: '4px',
              }}>
                Назначить {totalSelected} карт → {selectedSeller!.name}
              </div>
              <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
                После назначения карты перейдут в статус «У продавца»
              </div>
            </div>
          )}

          {/* ── Footer Buttons ── */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onMouseEnter={() => setCancelHov(true)}
              onMouseLeave={() => setCancelHov(false)}
              onClick={() => navigate('/org-dashboard')}
              style={{
                height: '40px', padding: '0 20px',
                border: `1px solid ${cancelHov ? t.blue : t.border}`,
                borderRadius: '8px',
                background: cancelHov ? t.blueLt : t.surface,
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: cancelHov ? t.blue : t.text2,
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              Отмена
            </button>
            <button
              onMouseEnter={() => setSubmitHov(true)}
              onMouseLeave={() => setSubmitHov(false)}
              disabled={!canSubmit}
              onClick={() => {
                console.log('Assigning', totalSelected, 'cards to seller', selectedSeller?.name);
              }}
              style={{
                height: '40px', padding: '0 20px',
                border: 'none',
                borderRadius: '8px',
                background: canSubmit ? (submitHov ? t.blueHover : t.blue) : disabledSubmitBg,
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: '#FFFFFF',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'all 0.12s',
              }}
            >
              Назначить карты
            </button>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}
