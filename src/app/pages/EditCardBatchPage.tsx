import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Lock, AlertTriangle, Upload, Info } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useNavigate, useParams } from 'react-router';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   ORIGINAL VALUES
═══════════════════════════════════════════════════════════════════════════ */

type BatchStatus = 'Активна' | 'На паузе' | 'Завершена' | 'Архивирована';

const ORIG = {
  name: 'Партия Апрель 2026',
  org: 'Mysafar OOO',
  cardType: 'VISA SUM',
  kpiDays: 30,
  status: 'Активна' as BatchStatus,
};

const SOLD_CARDS = 230;
const IMPORTED = 498;
const EXPECTED = 500;

/* ═══════════════════════════════════════════════════════════════════════════
   FIELD COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

function Label({ text, required, t, dark }: { text: string; required?: boolean; t: T; dark: boolean }) {
  const errColor = dark ? D.error : C.error;
  return (
    <label style={{
      display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
      color: t.text2, marginBottom: '8px',
    }}>
      {text}
      {required && <span style={{ color: errColor, marginLeft: '3px' }}>*</span>}
    </label>
  );
}

function Helper({ text, t }: { text: string; t: T }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      marginTop: '6px',
      fontFamily: F.inter, fontSize: '12px', color: t.text3,
    }}>
      <Info size={12} strokeWidth={1.75} />
      {text}
    </div>
  );
}

function TextInput({ label, required, value, onChange, changed, t, dark }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  changed?: boolean; t: T; dark: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? t.blue : t.inputBorder;
  return (
    <div>
      <Label text={label} required={required} t={t} dark={dark} />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: '40px',
          padding: changed ? '0 12px 0 10px' : '0 12px',
          borderTop:    `1px solid ${borderColor}`,
          borderRight:  `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          borderLeft:   changed ? `3px solid ${t.blue}` : `1px solid ${borderColor}`,
          borderRadius: '8px', background: t.surface,
          fontFamily: F.inter, fontSize: '14px', color: t.text1,
          outline: 'none', boxSizing: 'border-box',
          boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
        }}
      />
    </div>
  );
}

function DisabledSelect({ label, value, helper, t, dark }: {
  label: string; value: string; helper: string; t: T; dark: boolean;
}) {
  const disabledBg = dark ? D.tableAlt : '#F9FAFB';
  return (
    <div>
      <Label text={label} t={t} dark={dark} />
      <div style={{
        position: 'relative', width: '100%', height: '40px',
        border: `1px solid ${t.inputBorder}`, borderRadius: '8px',
        background: disabledBg,
        display: 'flex', alignItems: 'center',
        padding: '0 36px 0 12px',
        fontFamily: F.inter, fontSize: '14px', color: t.text3,
        cursor: 'not-allowed',
      }}>
        {value}
        <Lock size={14} color={t.text4} strokeWidth={1.75} style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
        }} />
      </div>
      <Helper text={helper} t={t} />
    </div>
  );
}

function NumberInput({ label, value, onChange, changed, t, dark }: {
  label: string; value: number; onChange: (v: number) => void; changed?: boolean; t: T; dark: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? t.blue : t.inputBorder;
  const disabledBg = dark ? D.tableAlt : '#F9FAFB';
  return (
    <div>
      <Label text={label} t={t} dark={dark} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          aria-label="Уменьшить"
          style={{
            width: '40px', height: '40px',
            border: `1px solid ${t.inputBorder}`, borderRight: 'none',
            borderRadius: '8px 0 0 8px',
            background: value <= 1 ? disabledBg : t.surface,
            fontFamily: F.inter, fontSize: '16px',
            color: value <= 1 ? t.textDisabled : t.text2,
            cursor: value <= 1 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.12s, background 0.12s',
          }}
        >−</button>
        <input
          type="number" value={value}
          onChange={e => onChange(Math.max(1, parseInt(e.target.value) || 1))}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '120px', height: '40px', padding: '0 12px',
            borderTop:    `1px solid ${borderColor}`,
            borderRight:  `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
            borderLeft:   changed ? `3px solid ${t.blue}` : `1px solid ${borderColor}`,
            borderRadius: '0', background: t.surface,
            fontFamily: F.mono, fontSize: '14px', color: t.text1,
            textAlign: 'center', outline: 'none', boxSizing: 'border-box',
            boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
            transition: 'border-color 0.12s, box-shadow 0.12s',
            MozAppearance: 'textfield', appearance: 'textfield',
          } as React.CSSProperties}
        />
        <button
          onClick={() => onChange(value + 1)}
          style={{
            width: '40px', height: '40px',
            border: `1px solid ${t.inputBorder}`, borderLeft: 'none',
            borderRadius: '0 8px 8px 0', background: t.surface,
            fontFamily: F.inter, fontSize: '16px', color: t.text2,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >+</button>
      </div>
    </div>
  );
}

function StatusSelect({ value, onChange, changed, t }: {
  value: BatchStatus; onChange: (v: BatchStatus) => void; changed?: boolean; t: T;
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? t.blue : t.inputBorder;
  return (
    <div style={{ position: 'relative', minWidth: '220px' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value as BatchStatus)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', height: '40px', padding: '0 36px 0 12px',
          borderTop:    `1px solid ${borderColor}`,
          borderRight:  `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          borderLeft:   changed ? `3px solid ${t.blue}` : `1px solid ${borderColor}`,
          borderRadius: '8px', background: t.surface,
          fontFamily: F.inter, fontSize: '14px', color: t.text1,
          outline: 'none', appearance: 'none', cursor: 'pointer',
          boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
        }}
      >
        <option>Активна</option>
        <option>На паузе</option>
        <option>Завершена</option>
        <option>Архивирована</option>
      </select>
      <ChevronDown size={14} color={t.text3} style={{
        position: 'absolute', right: '12px', top: '50%',
        transform: 'translateY(-50%)', pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BADGES + ATOMS
═══════════════════════════════════════════════════════════════════════════ */

function BadgeSuccess({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const bg    = dark ? 'rgba(52,211,153,0.12)' : C.successBg;
  const text  = dark ? '#34D399' : '#15803D';
  const dot   = dark ? '#34D399' : C.success;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
      padding: '3px 10px', borderRadius: '10px',
      background: bg, color: text, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot }} />
      {children}
    </span>
  );
}

function SectionHeading({ text, t }: { text: string; t: T }) {
  return (
    <h3 style={{
      fontFamily: F.dm, fontSize: '15px', fontWeight: 700,
      color: t.text1, margin: '0 0 16px', lineHeight: 1.2,
    }}>
      {text}
    </h3>
  );
}

function Divider({ t }: { t: T }) {
  return <div style={{ height: '1px', background: t.border, margin: '28px 0' }} />;
}

function WarningBox({ text, dark }: { text: string; dark: boolean }) {
  const bg     = dark ? 'rgba(251,191,36,0.12)' : C.warningBg;
  const border = dark ? 'rgba(251,191,36,0.35)' : '#FDE68A';
  const textCl = dark ? '#FBBF24' : '#B45309';
  const icon   = dark ? '#FBBF24' : C.warning;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '8px',
      marginTop: '12px', padding: '10px 14px',
      background: bg, border: `1px solid ${border}`,
      borderRadius: '8px',
    }}>
      <AlertTriangle size={16} color={icon} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
      <span style={{ fontFamily: F.inter, fontSize: '13px', color: textCl, lineHeight: 1.45 }}>
        {text}
      </span>
    </div>
  );
}

const STATUS_WARNINGS: Partial<Record<BatchStatus, string>> = {
  'На паузе':      'KPI отслеживание будет приостановлено. Продавцы не смогут фиксировать продажи.',
  'Завершена':     'Партия будет закрыта. Незавершённые KPI будут отмечены как просроченные.',
  'Архивирована':  'Партия будет скрыта из основных списков.',
};

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function EditCardBatchPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState(ORIG.name);
  const [kpiDays, setKpiDays] = useState(ORIG.kpiDays);
  const [status, setStatus] = useState<BatchStatus>(ORIG.status);

  const [cancelHov, setCancelHov] = useState(false);
  const [saveHov, setSaveHov] = useState(false);
  const [importHov, setImportHov] = useState(false);

  const nameChanged = name !== ORIG.name;
  const kpiDaysChanged = kpiDays !== ORIG.kpiDays;
  const statusChanged = status !== ORIG.status;

  const backToDetail = () => navigate(`/card-batches/${id ?? 1}`);
  const cancelHoverBg = dark ? D.tableHover : '#F3F4F6';
  const warnAccent = dark ? '#FBBF24' : C.warning;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <style>{`
        .ecb-sidebar { flex-shrink: 0; }
        @media (max-width: 768px) { .ecb-sidebar { display: none; } }
        .ecb-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px 20px;
        }
        @media (max-width: 1024px) {
          .ecb-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ecb-sidebar">
        <Sidebar
          role="bank"
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          darkMode={darkMode}
          onDarkModeToggle={() => setDarkMode(d => !d)}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
              <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
              <span onClick={() => navigate('/card-batches')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Партии карт</span>
              <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
              <span onClick={backToDetail} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Партия Апрель 2026 — Mysafar OOO</span>
              <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Редактирование</span>
            </div>

            <h1 style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: '0 0 24px', lineHeight: 1.2 }}>
              Редактирование партии
            </h1>

            <div style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: '12px', padding: '24px',
            }}>
              <SectionHeading text="Основные данные" t={t} />

              <div className="ecb-grid">
                <TextInput
                  label="Название партии"
                  required
                  value={name}
                  onChange={setName}
                  changed={nameChanged}
                  t={t}
                  dark={dark}
                />
                <DisabledSelect
                  label="Организация"
                  value={ORIG.org}
                  helper="Организацию нельзя изменить после создания"
                  t={t}
                  dark={dark}
                />
                <DisabledSelect
                  label="Тип карт"
                  value={ORIG.cardType}
                  helper="Тип карт нельзя изменить"
                  t={t}
                  dark={dark}
                />
                <div>
                  <NumberInput
                    label="Срок выполнения KPI (дней)"
                    value={kpiDays}
                    onChange={setKpiDays}
                    changed={kpiDaysChanged}
                    t={t}
                    dark={dark}
                  />
                  {kpiDaysChanged && (
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: '6px',
                      marginTop: '8px',
                      fontFamily: F.inter, fontSize: '12px',
                      color: warnAccent, lineHeight: 1.4,
                    }}>
                      <AlertTriangle size={13} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '2px' }} />
                      Изменение срока повлияет на {SOLD_CARDS} уже проданных карт
                    </div>
                  )}
                </div>
              </div>

              <Divider t={t} />

              <SectionHeading text="Статус партии" t={t} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
                  Текущий статус:
                </span>
                <BadgeSuccess dark={dark}>Активна</BadgeSuccess>
                <div style={{ width: '1px', height: '20px', background: t.border, margin: '0 4px' }} />
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>
                  Изменить на:
                </span>
                <StatusSelect value={status} onChange={setStatus} changed={statusChanged} t={t} />
              </div>

              {STATUS_WARNINGS[status] && (
                <WarningBox text={STATUS_WARNINGS[status]!} dark={dark} />
              )}

              <Divider t={t} />

              <SectionHeading text="Дополнительный импорт" t={t} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>
                  В партии: <span style={{ fontFamily: F.mono, fontWeight: 600, color: t.text1 }}>{IMPORTED}</span> карт из <span style={{ fontFamily: F.mono, fontWeight: 600, color: t.text1 }}>{EXPECTED}</span> ожидаемых
                </div>

                <button
                  onMouseEnter={() => setImportHov(true)}
                  onMouseLeave={() => setImportHov(false)}
                  onClick={() => navigate(`/card-import?batchId=${id ?? 1}`)}
                  style={{
                    height: '40px', padding: '0 16px',
                    border: `1px solid ${importHov ? t.blue : t.border}`,
                    borderRadius: '8px',
                    background: importHov ? t.blueLt : 'transparent',
                    fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                    color: importHov ? t.blue : t.text1,
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                >
                  <Upload size={14} strokeWidth={1.75} />
                  Импортировать ещё карт
                </button>
              </div>
            </div>

            <div style={{ height: '80px' }} />
          </div>

          <div style={{
            flexShrink: 0, background: t.surface, borderTop: `1px solid ${t.border}`,
            padding: '16px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <button
              onMouseEnter={() => setCancelHov(true)}
              onMouseLeave={() => setCancelHov(false)}
              onClick={backToDetail}
              style={{
                height: '40px', padding: '0 20px',
                border: 'none', borderRadius: '8px',
                background: cancelHov ? cancelHoverBg : 'transparent',
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: t.text2, cursor: 'pointer', transition: 'background 0.12s',
              }}
            >
              Отмена
            </button>
            <button
              onMouseEnter={() => setSaveHov(true)}
              onMouseLeave={() => setSaveHov(false)}
              onClick={backToDetail}
              style={{
                height: '40px', padding: '0 22px',
                border: 'none', borderRadius: '8px',
                background: saveHov ? t.blueHover : t.blue,
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: '#FFFFFF', cursor: 'pointer',
                boxShadow: saveHov ? '0 2px 8px rgba(37,99,235,0.28)' : '0 1px 3px rgba(37,99,235,0.16)',
                transition: 'all 0.15s',
              }}
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
