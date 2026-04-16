import React, { useState } from 'react';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   ORIGINAL VALUES (for change detection)
═══════════════════════════════════════════════════════════════════════════ */

const ORIG = {
  orgName: 'Mysafar OOO',
  inn: '302456789',
  contactName: 'Рустам Алиев',
  contactPosition: 'Директор',
  phone: '+998 90 123 45 67',
  email: 'info@mysafar.uz',
  address: 'г. Ташкент, ул. Навои, 12',
  contractNum: 'MC-2026-042',
  contractDate: '2026-03-15',
  contractExpiry: '2027-03-15',
  cardLimit: 500,
  status: 'Активна' as const,
};

/* ═══════════════════════════════════════════════════════════════════════════
   FORM FIELD COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

function FormInput({ label, placeholder, required, error, mono, value, onChange, disabled, type = 'text', changed, t, dark }: {
  label: string; placeholder: string; required?: boolean; error?: string;
  mono?: boolean; value: string; onChange: (v: string) => void;
  disabled?: boolean; type?: string; changed?: boolean; t: T; dark: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;
  const errorColor = dark ? D.error : C.error;
  const disabledBg = dark ? D.tableAlt : '#F9FAFB';

  const borderDefault = hasError ? errorColor : focused ? t.blue : t.inputBorder;

  return (
    <div>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.text2, marginBottom: '8px',
      }}>
        {label}
        {required && <span style={{ color: errorColor, marginLeft: '3px' }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%', height: '40px',
          padding: changed ? '0 12px 0 10px' : '0 12px',
          borderTop:    `1px solid ${borderDefault}`,
          borderRight:  `1px solid ${borderDefault}`,
          borderBottom: `1px solid ${borderDefault}`,
          borderLeft:   changed ? `3px solid ${t.blue}` : `1px solid ${borderDefault}`,
          borderRadius: '8px',
          background: disabled ? disabledBg : t.surface,
          fontFamily: mono ? F.mono : F.inter, fontSize: '14px',
          color: disabled ? t.text3 : t.text1,
          outline: 'none', boxSizing: 'border-box',
          boxShadow: hasError ? '0 0 0 3px rgba(239,68,68,0.12)' : focused ? `0 0 0 3px ${t.focusRing}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      {hasError && (
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: errorColor, marginTop: '6px' }}>{error}</div>
      )}
    </div>
  );
}

function FormTextarea({ label, placeholder, value, onChange, colSpan, changed, t }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
  colSpan?: boolean; changed?: boolean; t: T;
}) {
  const [focused, setFocused] = useState(false);
  const borderDefault = focused ? t.blue : t.inputBorder;
  return (
    <div style={colSpan ? { gridColumn: 'span 2' } : undefined}>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.text2, marginBottom: '8px',
      }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%', height: '80px',
          padding: changed ? '10px 12px 10px 10px' : '10px 12px',
          borderTop:    `1px solid ${borderDefault}`,
          borderRight:  `1px solid ${borderDefault}`,
          borderBottom: `1px solid ${borderDefault}`,
          borderLeft:   changed ? `3px solid ${t.blue}` : `1px solid ${borderDefault}`,
          borderRadius: '8px', background: t.surface,
          fontFamily: F.inter, fontSize: '14px', color: t.text1,
          outline: 'none', boxSizing: 'border-box', resize: 'vertical',
          boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
        }}
      />
    </div>
  );
}

function FormNumberInput({ label, placeholder, value, onChange, changed, t }: {
  label: string; placeholder: string; value: number; onChange: (v: number) => void;
  changed?: boolean; t: T;
}) {
  const [focused, setFocused] = useState(false);
  const borderDefault = focused ? t.blue : t.inputBorder;
  return (
    <div>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: t.text2, marginBottom: '8px',
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => onChange(Math.max(0, value - 50))}
          style={{
            width: '40px', height: '40px',
            border: `1px solid ${t.inputBorder}`, borderRight: 'none',
            borderRadius: '8px 0 0 8px', background: t.surface,
            fontFamily: F.inter, fontSize: '16px', color: t.text2,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >−</button>
        <input
          type="number" value={value}
          onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: '100px', height: '40px', padding: '0 12px',
            borderTop:    `1px solid ${borderDefault}`,
            borderRight:  `1px solid ${borderDefault}`,
            borderBottom: `1px solid ${borderDefault}`,
            borderLeft:   changed ? `3px solid ${t.blue}` : `1px solid ${borderDefault}`,
            borderRadius: '0', background: t.surface,
            fontFamily: F.mono, fontSize: '14px', color: t.text1,
            outline: 'none', boxSizing: 'border-box', textAlign: 'center',
            boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
            transition: 'border-color 0.12s, box-shadow 0.12s',
          }}
        />
        <button
          onClick={() => onChange(value + 50)}
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

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function EditOrganizationPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  const [orgName, setOrgName] = useState(ORIG.orgName);
  const [inn, setInn] = useState(ORIG.inn);
  const [contactName, setContactName] = useState(ORIG.contactName);
  const [contactPosition, setContactPosition] = useState(ORIG.contactPosition);
  const [phone, setPhone] = useState(ORIG.phone);
  const [email, setEmail] = useState(ORIG.email);
  const [address, setAddress] = useState(ORIG.address);

  const [contractNum, setContractNum] = useState(ORIG.contractNum);
  const [contractDate, setContractDate] = useState(ORIG.contractDate);
  const [contractExpiry, setContractExpiry] = useState(ORIG.contractExpiry);
  const [cardLimit, setCardLimit] = useState(ORIG.cardLimit);

  const [status, setStatus] = useState(ORIG.status);
  const [statusFocused, setStatusFocused] = useState(false);

  const [cancelHov, setCancelHov] = useState(false);
  const [saveHov, setSaveHov] = useState(false);
  const [deactivateHov, setDeactivateHov] = useState(false);
  const [changeAdminHov, setChangeAdminHov] = useState(false);

  // Status pill colors (dark-aware)
  const statusPillBg =
    status === 'Активна' ? (dark ? 'rgba(52,211,153,0.12)' : C.successBg)
    : status === 'На паузе' ? (dark ? 'rgba(251,191,36,0.12)' : C.warningBg)
    : (dark ? 'rgba(248,113,113,0.12)' : C.errorBg);
  const statusPillText =
    status === 'Активна' ? (dark ? '#34D399' : '#15803D')
    : status === 'На паузе' ? (dark ? '#FBBF24' : '#B45309')
    : (dark ? '#F87171' : '#DC2626');
  const statusPillDot =
    status === 'Активна' ? (dark ? '#34D399' : C.success)
    : status === 'На паузе' ? (dark ? '#FBBF24' : C.warning)
    : (dark ? '#F87171' : C.error);

  const warnBg     = dark ? 'rgba(251,191,36,0.12)' : C.warningBg;
  const warnBorder = dark ? 'rgba(251,191,36,0.35)' : '#FDE68A';
  const warnText   = dark ? '#FBBF24' : '#B45309';
  const warnIcon   = dark ? '#FBBF24' : C.warning;

  const statusSelectBorder = statusFocused ? t.blue : t.inputBorder;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar role="bank"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span onClick={() => navigate('/organizations')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Организации</span>
              <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
              <span onClick={() => navigate('/organizations/1')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Mysafar OOO</span>
              <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Редактирование</span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Редактирование организации
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>Mysafar OOO</p>
            </div>

            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px' }}>

              <h3 style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1, margin: '0 0 20px' }}>
                Основная информация
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="Название организации" required placeholder="ООО «Название»" value={orgName} onChange={setOrgName} changed={orgName !== ORIG.orgName} t={t} dark={dark} />
                <FormInput label="ИНН" placeholder="123456789" value={inn} onChange={setInn} mono changed={inn !== ORIG.inn} t={t} dark={dark} />
                <FormInput label="Контактное лицо" required placeholder="Фамилия Имя Отчество" value={contactName} onChange={setContactName} changed={contactName !== ORIG.contactName} t={t} dark={dark} />
                <FormInput label="Должность контактного лица" placeholder="Директор / Менеджер" value={contactPosition} onChange={setContactPosition} changed={contactPosition !== ORIG.contactPosition} t={t} dark={dark} />
                <FormInput label="Телефон" required placeholder="+998 __ ___ __ __" value={phone} onChange={setPhone} mono changed={phone !== ORIG.phone} t={t} dark={dark} />
                <FormInput label="Email" placeholder="info@company.uz" value={email} onChange={setEmail} changed={email !== ORIG.email} t={t} dark={dark} />
                <FormTextarea label="Юридический адрес" placeholder="г. Ташкент, ул. ..." value={address} onChange={setAddress} colSpan changed={address !== ORIG.address} t={t} />
              </div>

              <div style={{ height: '1px', background: t.border, margin: '32px 0' }} />

              <h3 style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1, margin: '0 0 20px' }}>
                Договор
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="Номер договора" placeholder="MC-2026-___" value={contractNum} onChange={setContractNum} mono changed={contractNum !== ORIG.contractNum} t={t} dark={dark} />
                <FormInput label="Дата заключения" placeholder="ДД.ММ.ГГГГ" value={contractDate} onChange={setContractDate} type="date" changed={contractDate !== ORIG.contractDate} t={t} dark={dark} />
                <FormInput label="Срок действия до" placeholder="ДД.ММ.ГГГГ" value={contractExpiry} onChange={setContractExpiry} type="date" changed={contractExpiry !== ORIG.contractExpiry} t={t} dark={dark} />
                <FormNumberInput label="Лимит карт по договору" placeholder="500" value={cardLimit} onChange={setCardLimit} changed={cardLimit !== ORIG.cardLimit} t={t} />
              </div>

              <div style={{ height: '1px', background: t.border, margin: '32px 0' }} />

              <h3 style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1, margin: '0 0 6px' }}>
                Администратор организации
              </h3>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '0 0 20px' }}>
                Администратор уже создан: <span style={{ fontWeight: 500, color: t.text1 }}>Рустам Алиев</span> (<span style={{ fontFamily: F.mono, fontSize: '13px' }}>+998 90 123 45 67</span>)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="ФИО администратора" placeholder="" value="Рустам Алиев" onChange={() => {}} disabled t={t} dark={dark} />
                <FormInput label="Телефон администратора" placeholder="" value="+998 90 123 45 67" onChange={() => {}} disabled mono t={t} dark={dark} />
                <FormInput label="Email администратора" placeholder="" value="r.aliev@mysafar.uz" onChange={() => {}} disabled t={t} dark={dark} />
              </div>
              <button
                onMouseEnter={() => setChangeAdminHov(true)}
                onMouseLeave={() => setChangeAdminHov(false)}
                style={{
                  marginTop: '12px', border: 'none',
                  background: changeAdminHov ? t.blueLt : 'transparent',
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                  color: changeAdminHov ? t.blue : t.text3,
                  cursor: 'pointer', padding: '6px 10px', borderRadius: '8px',
                  transition: 'color 0.12s, background 0.12s',
                }}
              >
                Сменить администратора →
              </button>

              <div style={{ height: '1px', background: t.border, margin: '32px 0' }} />

              <h3 style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: t.text1, margin: '0 0 20px' }}>
                Статус организации
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Текущий:</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                    padding: '3px 10px', borderRadius: '10px',
                    background: statusPillBg, color: statusPillText,
                  }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                      background: statusPillDot,
                    }} />
                    {status}
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as typeof status)}
                    onFocus={() => setStatusFocused(true)}
                    onBlur={() => setStatusFocused(false)}
                    style={{
                      height: '40px', padding: '0 36px 0 12px',
                      borderTop:    `1px solid ${statusSelectBorder}`,
                      borderRight:  `1px solid ${statusSelectBorder}`,
                      borderBottom: `1px solid ${statusSelectBorder}`,
                      borderLeft:   status !== ORIG.status ? `3px solid ${t.blue}` : `1px solid ${statusSelectBorder}`,
                      borderRadius: '8px', background: t.surface,
                      fontFamily: F.inter, fontSize: '14px', color: t.text1,
                      outline: 'none', appearance: 'none', cursor: 'pointer',
                      boxShadow: statusFocused ? `0 0 0 3px ${t.focusRing}` : 'none',
                      transition: 'border-color 0.12s, box-shadow 0.12s', minWidth: '180px',
                    }}
                  >
                    <option value="Активна">Активна</option>
                    <option value="На паузе">На паузе</option>
                    <option value="Неактивна">Неактивна</option>
                  </select>
                  <ChevronRight size={14} color={t.text3} style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none',
                  }} />
                </div>
              </div>

              {status !== 'Активна' && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  marginTop: '12px', padding: '10px 14px',
                  background: warnBg, border: `1px solid ${warnBorder}`,
                  borderRadius: '8px',
                }}>
                  <AlertTriangle size={16} color={warnIcon} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontFamily: F.inter, fontSize: '13px', color: warnText }}>
                    При деактивации все продавцы организации будут заблокированы
                  </span>
                </div>
              )}
            </div>

            <div style={{ height: '80px' }} />
          </div>
        </div>

        <div style={{
          flexShrink: 0, background: t.surface, borderTop: `1px solid ${t.border}`,
          padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onMouseEnter={() => setDeactivateHov(true)}
            onMouseLeave={() => setDeactivateHov(false)}
            style={{
              height: '40px', padding: '0 18px',
              border: `1px solid ${deactivateHov ? (dark ? D.error : C.error) : t.border}`,
              borderRadius: '8px',
              background: deactivateHov ? (dark ? 'rgba(248,113,113,0.12)' : C.errorBg) : 'transparent',
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
              color: deactivateHov ? (dark ? '#F87171' : '#DC2626') : t.text3,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
              transition: 'all 0.12s',
            }}
          >
            <AlertTriangle size={15} strokeWidth={1.75} />
            Деактивировать
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onMouseEnter={() => setCancelHov(true)}
              onMouseLeave={() => setCancelHov(false)}
              onClick={() => navigate('/organizations/1')}
              style={{
                height: '40px', padding: '0 20px',
                border: `1px solid ${cancelHov ? t.blue : t.border}`,
                borderRadius: '8px',
                background: cancelHov ? t.blueLt : 'transparent',
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: cancelHov ? t.blue : t.text2,
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              Отмена
            </button>
            <button
              onMouseEnter={() => setSaveHov(true)}
              onMouseLeave={() => setSaveHov(false)}
              style={{
                height: '40px', padding: '0 20px',
                border: 'none', borderRadius: '8px',
                background: saveHov ? t.blueHover : t.blue,
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: '#FFFFFF', cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
