import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

/* ═══════════════════════════════════════════════════════════════════════════
   FORM FIELD COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

function FormInput({ label, placeholder, required, error, mono, value, onChange, disabled, type = 'text' }: {
  label: string; placeholder: string; required?: boolean; error?: string;
  mono?: boolean; value: string; onChange: (v: string) => void;
  disabled?: boolean; type?: string;
}) {
  const [focused, setFocused] = useState(false);
  const hasError = !!error;

  return (
    <div>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: C.text2, marginBottom: '8px',
      }}>
        {label}
        {required && <span style={{ color: C.error, marginLeft: '3px' }}>*</span>}
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
          border: `1px solid ${hasError ? C.error : focused ? C.blue : C.inputBorder}`,
          borderRadius: '8px',
          background: disabled ? '#F9FAFB' : C.surface,
          fontFamily: mono ? F.mono : F.inter, fontSize: '14px',
          color: disabled ? C.text3 : C.text1,
          outline: 'none', boxSizing: 'border-box',
          boxShadow: hasError
            ? `0 0 0 3px rgba(239,68,68,0.12)`
            : focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      {hasError && (
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.error, marginTop: '6px' }}>
          {error}
        </div>
      )}
    </div>
  );
}

function FormTextarea({ label, placeholder, value, onChange, colSpan }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; colSpan?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={colSpan ? { gridColumn: 'span 2' } : undefined}>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: C.text2, marginBottom: '8px',
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
          border: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderRadius: '8px', background: C.surface,
          fontFamily: F.inter, fontSize: '14px', color: C.text1,
          outline: 'none', boxSizing: 'border-box', resize: 'vertical',
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
        }}
      />
    </div>
  );
}

function FormNumberInput({ label, placeholder, value, onChange }: {
  label: string; placeholder: string; value: number; onChange: (v: number) => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label style={{
        display: 'block', fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
        color: C.text2, marginBottom: '8px',
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => onChange(Math.max(0, value - 50))}
          style={{
            width: '40px', height: '40px',
            border: `1px solid ${C.inputBorder}`, borderRight: 'none',
            borderRadius: '8px 0 0 8px', background: C.surface,
            fontFamily: F.inter, fontSize: '16px', color: C.text2,
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
            border: `1px solid ${focused ? C.blue : C.inputBorder}`,
            borderRadius: '0', background: C.surface,
            fontFamily: F.mono, fontSize: '14px', color: C.text1,
            outline: 'none', boxSizing: 'border-box', textAlign: 'center',
            boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
            transition: 'border-color 0.12s, box-shadow 0.12s',
          }}
        />
        <button
          onClick={() => onChange(value + 50)}
          style={{
            width: '40px', height: '40px',
            border: `1px solid ${C.inputBorder}`, borderLeft: 'none',
            borderRadius: '0 8px 8px 0', background: C.surface,
            fontFamily: F.inter, fontSize: '16px', color: C.text2,
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

  // Section 1
  const [orgName, setOrgName] = useState('');
  const [inn, setInn] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPosition, setContactPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Section 2
  const [contractNum, setContractNum] = useState('');
  const [contractDate, setContractDate] = useState('');
  const [contractExpiry, setContractExpiry] = useState('');
  const [cardLimit, setCardLimit] = useState(500);

  // Section 3
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [sendSMS, setSendSMS] = useState(true);

  // Validation demo
  const [submitted, setSubmitted] = useState(false);
  const nameError = submitted && !orgName ? 'Это поле обязательно' : undefined;

  const [cancelHov, setCancelHov] = useState(false);
  const [draftHov, setDraftHov] = useState(false);
  const [createHov, setCreateHov] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <Sidebar role="bank"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span onClick={() => navigate('/organizations')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Организации</span>
              <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Новая организация</span>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Добавить организацию
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
                Заполните данные организации-партнёра
              </p>
            </div>

            {/* Form Card */}
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: '12px', padding: '24px',
            }}>

              {/* ── Section 1: Основная информация ── */}
              <h3 style={{
                fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
                color: C.text1, margin: '0 0 20px',
              }}>
                Основная информация
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="Название организации" required placeholder="ООО «Название»" value={orgName} onChange={setOrgName} error={nameError} />
                <FormInput label="ИНН" placeholder="123456789" value={inn} onChange={setInn} mono />
                <FormInput label="Контактное лицо" required placeholder="Фамилия Имя Отчество" value={contactName} onChange={setContactName} />
                <FormInput label="Должность контактного лица" placeholder="Директор / Менеджер" value={contactPosition} onChange={setContactPosition} />
                <FormInput label="Телефон" required placeholder="+998 __ ___ __ __" value={phone} onChange={setPhone} mono />
                <FormInput label="Email" placeholder="info@company.uz" value={email} onChange={setEmail} />
                <FormTextarea label="Юридический адрес" placeholder="г. Ташкент, ул. ..." value={address} onChange={setAddress} colSpan />
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: C.border, margin: '32px 0' }} />

              {/* ── Section 2: Договор ── */}
              <h3 style={{
                fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
                color: C.text1, margin: '0 0 20px',
              }}>
                Договор
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="Номер договора" placeholder="MC-2026-___" value={contractNum} onChange={setContractNum} mono />
                <FormInput label="Дата заключения" placeholder="ДД.ММ.ГГГГ" value={contractDate} onChange={setContractDate} type="date" />
                <FormInput label="Срок действия до" placeholder="ДД.ММ.ГГГГ" value={contractExpiry} onChange={setContractExpiry} type="date" />
                <FormNumberInput label="Лимит карт по договору" placeholder="500" value={cardLimit} onChange={setCardLimit} />
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: C.border, margin: '32px 0' }} />

              {/* ── Section 3: Администратор ── */}
              <h3 style={{
                fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
                color: C.text1, margin: '0 0 6px',
              }}>
                Администратор организации
              </h3>
              <p style={{
                fontFamily: F.inter, fontSize: '13px', color: C.text3,
                margin: '0 0 20px',
              }}>
                Будет создан пользователь с ролью «Менеджер организации»
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="ФИО администратора" required placeholder="Фамилия Имя Отчество" value={adminName} onChange={setAdminName} />
                <FormInput label="Телефон администратора" required placeholder="+998 __ ___ __ __" value={adminPhone} onChange={setAdminPhone} mono />
                <FormInput label="Email администратора" placeholder="admin@company.uz" value={adminEmail} onChange={setAdminEmail} />

                {/* SMS Toggle */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', borderRadius: '10px',
                    background: '#F9FAFB', border: `1px solid ${C.border}`,
                    width: '100%',
                  }}>
                    <label style={{
                      fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                      color: C.text2, cursor: 'pointer',
                    }}>
                      Отправить приглашение по SMS
                    </label>
                    <button
                      onClick={() => setSendSMS(!sendSMS)}
                      style={{
                        width: '44px', height: '24px', borderRadius: '12px',
                        background: sendSMS ? C.blue : '#D1D5DB',
                        border: 'none', cursor: 'pointer', position: 'relative',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        background: C.surface, position: 'absolute', top: '3px',
                        left: sendSMS ? '23px' : '3px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom spacer to account for sticky footer */}
            <div style={{ height: '80px' }} />
          </div>
        </div>

        {/* ── Sticky Footer ── */}
        <div style={{
          flexShrink: 0,
          background: C.surface, borderTop: `1px solid ${C.border}`,
          padding: '16px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Left: Cancel */}
          <button
            onMouseEnter={() => setCancelHov(true)}
            onMouseLeave={() => setCancelHov(false)}
            onClick={() => navigate('/organizations')}
            style={{
              border: 'none', background: 'none',
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
              color: cancelHov ? C.text1 : C.text3,
              cursor: 'pointer', padding: '8px 12px', borderRadius: '8px',
              transition: 'color 0.12s, background 0.12s',
              ...(cancelHov ? { background: '#F3F4F6' } : {}),
            }}
          >
            Отмена
          </button>

          {/* Right: Draft + Create */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onMouseEnter={() => setDraftHov(true)}
              onMouseLeave={() => setDraftHov(false)}
              style={{
                height: '40px', padding: '0 20px',
                border: `1px solid ${draftHov ? C.blue : C.border}`,
                borderRadius: '8px',
                background: draftHov ? C.blueLt : C.surface,
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: draftHov ? C.blue : C.text2,
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
                background: createHov ? C.blueHover : C.blue,
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

      {/* Responsive */}
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
