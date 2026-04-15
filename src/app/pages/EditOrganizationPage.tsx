import React, { useState } from 'react';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

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

function FormInput({ label, placeholder, required, error, mono, value, onChange, disabled, type = 'text', changed }: {
  label: string; placeholder: string; required?: boolean; error?: string;
  mono?: boolean; value: string; onChange: (v: string) => void;
  disabled?: boolean; type?: string; changed?: boolean;
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
          width: '100%', height: '40px',
          padding: changed ? '0 12px 0 10px' : '0 12px',
          borderTop: `1px solid ${hasError ? C.error : focused ? C.blue : C.inputBorder}`,
          borderRight: `1px solid ${hasError ? C.error : focused ? C.blue : C.inputBorder}`,
          borderBottom: `1px solid ${hasError ? C.error : focused ? C.blue : C.inputBorder}`,
          borderLeft: changed ? `3px solid ${C.blue}` : `1px solid ${hasError ? C.error : focused ? C.blue : C.inputBorder}`,
          borderRadius: '8px',
          background: disabled ? '#F9FAFB' : C.surface,
          fontFamily: mono ? F.mono : F.inter, fontSize: '14px',
          color: disabled ? C.text3 : C.text1,
          outline: 'none', boxSizing: 'border-box',
          boxShadow: hasError ? '0 0 0 3px rgba(239,68,68,0.12)' : focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      {hasError && (
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.error, marginTop: '6px' }}>{error}</div>
      )}
    </div>
  );
}

function FormTextarea({ label, placeholder, value, onChange, colSpan, changed }: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void; colSpan?: boolean; changed?: boolean;
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
          width: '100%', height: '80px',
          padding: changed ? '10px 12px 10px 10px' : '10px 12px',
          borderTop: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderRight: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderBottom: `1px solid ${focused ? C.blue : C.inputBorder}`,
          borderLeft: changed ? `3px solid ${C.blue}` : `1px solid ${focused ? C.blue : C.inputBorder}`,
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

function FormNumberInput({ label, placeholder, value, onChange, changed }: {
  label: string; placeholder: string; value: number; onChange: (v: number) => void; changed?: boolean;
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
        >−</button>
        <input
          type="number" value={value}
          onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: '100px', height: '40px', padding: '0 12px',
            borderTop: `1px solid ${focused ? C.blue : C.inputBorder}`,
            borderRight: `1px solid ${focused ? C.blue : C.inputBorder}`,
            borderBottom: `1px solid ${focused ? C.blue : C.inputBorder}`,
            borderLeft: changed ? `3px solid ${C.blue}` : `1px solid ${focused ? C.blue : C.inputBorder}`,
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

  // Section 1
  const [orgName, setOrgName] = useState(ORIG.orgName);
  const [inn, setInn] = useState(ORIG.inn);
  const [contactName, setContactName] = useState(ORIG.contactName);
  const [contactPosition, setContactPosition] = useState(ORIG.contactPosition);
  const [phone, setPhone] = useState(ORIG.phone);
  const [email, setEmail] = useState(ORIG.email);
  const [address, setAddress] = useState(ORIG.address);

  // Section 2
  const [contractNum, setContractNum] = useState(ORIG.contractNum);
  const [contractDate, setContractDate] = useState(ORIG.contractDate);
  const [contractExpiry, setContractExpiry] = useState(ORIG.contractExpiry);
  const [cardLimit, setCardLimit] = useState(ORIG.cardLimit);

  // Section 4
  const [status, setStatus] = useState(ORIG.status);
  const [statusFocused, setStatusFocused] = useState(false);

  const [cancelHov, setCancelHov] = useState(false);
  const [saveHov, setSaveHov] = useState(false);
  const [deactivateHov, setDeactivateHov] = useState(false);
  const [changeAdminHov, setChangeAdminHov] = useState(false);

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

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <span onClick={() => navigate('/organizations')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Организации</span>
              <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
              <span onClick={() => navigate('/organizations/1')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Mysafar OOO</span>
              <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
              <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Редактирование</span>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
                Редактирование организации
              </h1>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>Mysafar OOO</p>
            </div>

            {/* Form Card */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px' }}>

              {/* ── Section 1 ── */}
              <h3 style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1, margin: '0 0 20px' }}>
                Основная информация
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="Название организации" required placeholder="ООО «Название»" value={orgName} onChange={setOrgName} changed={orgName !== ORIG.orgName} />
                <FormInput label="ИНН" placeholder="123456789" value={inn} onChange={setInn} mono changed={inn !== ORIG.inn} />
                <FormInput label="Контактное лицо" required placeholder="Фамилия Имя Отчество" value={contactName} onChange={setContactName} changed={contactName !== ORIG.contactName} />
                <FormInput label="Должность контактного лица" placeholder="Директор / Менеджер" value={contactPosition} onChange={setContactPosition} changed={contactPosition !== ORIG.contactPosition} />
                <FormInput label="Телефон" required placeholder="+998 __ ___ __ __" value={phone} onChange={setPhone} mono changed={phone !== ORIG.phone} />
                <FormInput label="Email" placeholder="info@company.uz" value={email} onChange={setEmail} changed={email !== ORIG.email} />
                <FormTextarea label="Юридический адрес" placeholder="г. Ташкент, ул. ..." value={address} onChange={setAddress} colSpan changed={address !== ORIG.address} />
              </div>

              <div style={{ height: '1px', background: C.border, margin: '32px 0' }} />

              {/* ── Section 2 ── */}
              <h3 style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1, margin: '0 0 20px' }}>
                Договор
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="Номер договора" placeholder="MC-2026-___" value={contractNum} onChange={setContractNum} mono changed={contractNum !== ORIG.contractNum} />
                <FormInput label="Дата заключения" placeholder="ДД.ММ.ГГГГ" value={contractDate} onChange={setContractDate} type="date" changed={contractDate !== ORIG.contractDate} />
                <FormInput label="Срок действия до" placeholder="ДД.ММ.ГГГГ" value={contractExpiry} onChange={setContractExpiry} type="date" changed={contractExpiry !== ORIG.contractExpiry} />
                <FormNumberInput label="Лимит карт по договору" placeholder="500" value={cardLimit} onChange={setCardLimit} changed={cardLimit !== ORIG.cardLimit} />
              </div>

              <div style={{ height: '1px', background: C.border, margin: '32px 0' }} />

              {/* ── Section 3: Admin (disabled) ── */}
              <h3 style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1, margin: '0 0 6px' }}>
                Администратор организации
              </h3>
              <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '0 0 20px' }}>
                Администратор уже создан: <span style={{ fontWeight: 500, color: C.text1 }}>Рустам Алиев</span> (<span style={{ fontFamily: F.mono, fontSize: '13px' }}>+998 90 123 45 67</span>)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px 24px' }}>
                <FormInput label="ФИО администратора" placeholder="" value="Рустам Алиев" onChange={() => {}} disabled />
                <FormInput label="Телефон администратора" placeholder="" value="+998 90 123 45 67" onChange={() => {}} disabled mono />
                <FormInput label="Email администратора" placeholder="" value="r.aliev@mysafar.uz" onChange={() => {}} disabled />
              </div>
              <button
                onMouseEnter={() => setChangeAdminHov(true)}
                onMouseLeave={() => setChangeAdminHov(false)}
                style={{
                  marginTop: '12px', border: 'none', background: 'none',
                  fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
                  color: changeAdminHov ? C.blue : C.text3,
                  cursor: 'pointer', padding: '6px 10px', borderRadius: '8px',
                  transition: 'color 0.12s, background 0.12s',
                  ...(changeAdminHov ? { background: C.blueLt } : {}),
                }}
              >
                Сменить администратора →
              </button>

              <div style={{ height: '1px', background: C.border, margin: '32px 0' }} />

              {/* ── Section 4: Status ── */}
              <h3 style={{ fontFamily: F.dm, fontSize: '16px', fontWeight: 600, color: C.text1, margin: '0 0 20px' }}>
                Статус организации
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {/* Current status badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Текущий:</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                    padding: '3px 10px', borderRadius: '10px',
                    background: status === 'Активна' ? C.successBg : status === 'На паузе' ? C.warningBg : C.errorBg,
                    color: status === 'Активна' ? '#15803D' : status === 'На паузе' ? '#B45309' : '#DC2626',
                  }}>
                    <span style={{
                      width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                      background: status === 'Активна' ? C.success : status === 'На паузе' ? C.warning : C.error,
                    }} />
                    {status}
                  </span>
                </div>

                {/* Status select */}
                <div style={{ position: 'relative' }}>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as typeof status)}
                    onFocus={() => setStatusFocused(true)}
                    onBlur={() => setStatusFocused(false)}
                    style={{
                      height: '40px', padding: '0 36px 0 12px',
                      borderTop: `1px solid ${statusFocused ? C.blue : C.inputBorder}`,
                      borderRight: `1px solid ${statusFocused ? C.blue : C.inputBorder}`,
                      borderBottom: `1px solid ${statusFocused ? C.blue : C.inputBorder}`,
                      borderLeft: status !== ORIG.status ? `3px solid ${C.blue}` : `1px solid ${statusFocused ? C.blue : C.inputBorder}`,
                      borderRadius: '8px', background: C.surface,
                      fontFamily: F.inter, fontSize: '14px', color: C.text1,
                      outline: 'none', appearance: 'none', cursor: 'pointer',
                      boxShadow: statusFocused ? `0 0 0 3px ${C.blueTint}` : 'none',
                      transition: 'border-color 0.12s, box-shadow 0.12s', minWidth: '180px',
                    }}
                  >
                    <option value="Активна">Активна</option>
                    <option value="На паузе">На паузе</option>
                    <option value="Неактивна">Неактивна</option>
                  </select>
                  <ChevronRight size={14} color={C.text3} style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%) rotate(90deg)', pointerEvents: 'none',
                  }} />
                </div>
              </div>

              {/* Warning note */}
              {status !== 'Активна' && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                  marginTop: '12px', padding: '10px 14px',
                  background: C.warningBg, border: `1px solid #FDE68A`,
                  borderRadius: '8px',
                }}>
                  <AlertTriangle size={16} color={C.warning} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontFamily: F.inter, fontSize: '13px', color: '#B45309' }}>
                    При деактивации все продавцы организации будут заблокированы
                  </span>
                </div>
              )}
            </div>

            <div style={{ height: '80px' }} />
          </div>
        </div>

        {/* ── Sticky Footer ── */}
        <div style={{
          flexShrink: 0, background: C.surface, borderTop: `1px solid ${C.border}`,
          padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Left: Destructive */}
          <button
            onMouseEnter={() => setDeactivateHov(true)}
            onMouseLeave={() => setDeactivateHov(false)}
            style={{
              height: '40px', padding: '0 18px',
              border: `1px solid ${deactivateHov ? C.error : C.border}`,
              borderRadius: '8px',
              background: deactivateHov ? C.errorBg : C.surface,
              fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
              color: deactivateHov ? '#DC2626' : C.text3,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px',
              transition: 'all 0.12s',
            }}
          >
            <AlertTriangle size={15} strokeWidth={1.75} />
            Деактивировать
          </button>

          {/* Right: Cancel + Save */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onMouseEnter={() => setCancelHov(true)}
              onMouseLeave={() => setCancelHov(false)}
              onClick={() => navigate('/organizations/1')}
              style={{
                height: '40px', padding: '0 20px',
                border: `1px solid ${cancelHov ? C.blue : C.border}`,
                borderRadius: '8px',
                background: cancelHov ? C.blueLt : C.surface,
                fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
                color: cancelHov ? C.blue : C.text2,
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
                background: saveHov ? C.blueHover : C.blue,
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
