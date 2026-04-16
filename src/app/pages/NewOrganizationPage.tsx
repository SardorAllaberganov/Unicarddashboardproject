import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C, D, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   FORM FIELD COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

function FormInput({ label, placeholder, required, error, mono, value, onChange, disabled, type = 'text', t, dark }: {
  label: string; placeholder: string; required?: boolean; error?: string;
  mono?: boolean; value: string; onChange: (v: string) => void;
  disabled?: boolean; type?: string; t: T; dark: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;
  const errorColor = dark ? D.error : C.error;
  const disabledBg = dark ? D.tableAlt : '#F9FAFB';

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
          width: '100%', height: '40px', padding: '0 12px',
          border: `1px solid ${hasError ? errorColor : focused ? t.blue : t.inputBorder}`,
          borderRadius: '8px',
          background: disabled ? disabledBg : t.surface,
          fontFamily: mono ? F.mono : F.inter, fontSize: '14px',
          color: disabled ? t.text3 : t.text1,
          outline: 'none', boxSizing: 'border-box',
          boxShadow: hasError
            ? `0 0 0 3px rgba(239,68,68,0.12)`
            : focused ? `0 0 0 3px ${t.focusRing}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      {hasError && (
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: errorColor, marginTop: '6px' }}>
          {error}
        </div>
      )}
    </div>
  );
}

function FormTextarea({ label, placeholder, value, onChange, colSpan, t }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
  colSpan?: boolean; t: T;
}) {
  const [focused, setFocused] = useState(false);

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
          width: '100%', height: '80px', padding: '10px 12px',
          border: `1px solid ${focused ? t.blue : t.inputBorder}`,
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

function FormNumberInput({ label, placeholder, value, onChange, t }: {
  label: string; placeholder: string; value: number; onChange: (v: number) => void; t: T;
}) {
  const [focused, setFocused] = useState(false);

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
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: '100px', height: '40px', padding: '0 12px',
            border: `1px solid ${focused ? t.blue : t.inputBorder}`,
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
        >
          +
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function NewOrganizationPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const t = theme(darkMode);
  const dark = darkMode;

  const [orgName, setOrgName] = useState('');
  const [inn, setInn] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPosition, setContactPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const [contractNum, setContractNum] = useState('');
  const [contractDate, setContractDate] = useState('');
  const [contractExpiry, setContractExpiry] = useState('');
  const [cardLimit, setCardLimit] = useState(500);

  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [sendSMS, setSendSMS] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const nameError = submitted && !orgName ? 'Это поле обязательно' : undefined;

  const [cancelHov, setCancelHov] = useState(false);
  const [draftHov, setDraftHov] = useState(false);
  const [createHov, setCreateHov] = useState(false);

  const cancelHoverBg = dark ? D.tableHover : '#F3F4F6';
  const toggleOffBg = dark ? '#4A4F63' : '#D1D5DB';
  const smsRowBg = dark ? D.tableAlt : '#F9FAFB';

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
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Новая организация</span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
                Добавить организацию
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
                Заполните данные организации-партнёра
              </p>
            </div>

            <div style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: '12px', padding: '24px',
            }}>

              <h3 style={{
                fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
                color: t.text1, margin: '0 0 20px',
              }}>
                Основная информация
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="Название организации" required placeholder="ООО «Название»" value={orgName} onChange={setOrgName} error={nameError} t={t} dark={dark} />
                <FormInput label="ИНН" placeholder="123456789" value={inn} onChange={setInn} mono t={t} dark={dark} />
                <FormInput label="Контактное лицо" required placeholder="Фамилия Имя Отчество" value={contactName} onChange={setContactName} t={t} dark={dark} />
                <FormInput label="Должность контактного лица" placeholder="Директор / Менеджер" value={contactPosition} onChange={setContactPosition} t={t} dark={dark} />
                <FormInput label="Телефон" required placeholder="+998 __ ___ __ __" value={phone} onChange={setPhone} mono t={t} dark={dark} />
                <FormInput label="Email" placeholder="info@company.uz" value={email} onChange={setEmail} t={t} dark={dark} />
                <FormTextarea label="Юридический адрес" placeholder="г. Ташкент, ул. ..." value={address} onChange={setAddress} colSpan t={t} />
              </div>

              <div style={{ height: '1px', background: t.border, margin: '32px 0' }} />

              <h3 style={{
                fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
                color: t.text1, margin: '0 0 20px',
              }}>
                Договор
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="Номер договора" placeholder="MC-2026-___" value={contractNum} onChange={setContractNum} mono t={t} dark={dark} />
                <FormInput label="Дата заключения" placeholder="ДД.ММ.ГГГГ" value={contractDate} onChange={setContractDate} type="date" t={t} dark={dark} />
                <FormInput label="Срок действия до" placeholder="ДД.ММ.ГГГГ" value={contractExpiry} onChange={setContractExpiry} type="date" t={t} dark={dark} />
                <FormNumberInput label="Лимит карт по договору" placeholder="500" value={cardLimit} onChange={setCardLimit} t={t} />
              </div>

              <div style={{ height: '1px', background: t.border, margin: '32px 0' }} />

              <h3 style={{
                fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
                color: t.text1, margin: '0 0 6px',
              }}>
                Администратор организации
              </h3>
              <p style={{
                fontFamily: F.inter, fontSize: '13px', color: t.text3,
                margin: '0 0 20px',
              }}>
                Будет создан пользователь с ролью «Менеджер организации»
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="ФИО администратора" required placeholder="Фамилия Имя Отчество" value={adminName} onChange={setAdminName} t={t} dark={dark} />
                <FormInput label="Телефон администратора" required placeholder="+998 __ ___ __ __" value={adminPhone} onChange={setAdminPhone} mono t={t} dark={dark} />
                <FormInput label="Email администратора" placeholder="admin@company.uz" value={adminEmail} onChange={setAdminEmail} t={t} dark={dark} />

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderRadius: '10px',
                    background: smsRowBg, border: `1px solid ${t.border}`,
                    width: '100%',
                  }}>
                    <label style={{
                      fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                      color: t.text2, cursor: 'pointer',
                    }}>
                      Отправить приглашение по SMS
                    </label>
                    <button
                      onClick={() => setSendSMS(!sendSMS)}
                      style={{
                        width: '44px', height: '24px', borderRadius: '12px',
                        background: sendSMS ? t.blue : toggleOffBg,
                        border: 'none', cursor: 'pointer', position: 'relative',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: dark ? '#F1F2F6' : C.surface, position: 'absolute', top: '3px',
                        left: sendSMS ? '23px' : '3px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: '80px' }} />
          </div>
        </div>

        <div style={{
          flexShrink: 0,
          background: t.surface, borderTop: `1px solid ${t.border}`,
          padding: '16px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={() => navigate('/organizations')}
            style={{
              border: 'none', background: cancelHov ? cancelHoverBg : 'transparent',
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
              color: cancelHov ? t.text1 : t.text3,
              cursor: 'pointer', padding: '8px 12px', borderRadius: '8px',
              transition: 'color 0.12s, background 0.12s',
            }}
          >
            Отмена
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onMouseEnter={() => setDraftHov(true)}
              onMouseLeave={() => setDraftHov(false)}
              style={{
                height: '40px', padding: '0 20px',
                border: `1px solid ${draftHov ? t.blue : t.border}`,
                borderRadius: '8px',
                background: draftHov ? t.blueLt : 'transparent',
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: draftHov ? t.blue : t.text2,
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              Сохранить как черновик
            </button>
            <button
              onMouseEnter={() => setCreateHov(true)}
              onMouseLeave={() => setCreateHov(false)}
              onClick={() => setSubmitted(true)}
              style={{
                height: '40px', padding: '0 20px',
                border: 'none',
                borderRadius: '8px',
                background: createHov ? t.blueHover : t.blue,
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: '#FFFFFF',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              Создать организацию
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          div[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="gridColumn: 'span 2'"] {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
