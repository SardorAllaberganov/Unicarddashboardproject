import React, { useCallback, useRef, useState } from 'react';
import { Eye, EyeOff, Check, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router';
import { F, C, theme } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';
import { useIsMobile } from '../components/useIsMobile';

type T = ReturnType<typeof theme>;

const dm = F.dm;
const inter = F.inter;

/* ─── Reusable primitives ─── */

function Label({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <label style={{ fontFamily: inter, fontSize: '14px', fontWeight: 500, color: t.text2, display: 'block', marginBottom: '6px' }}>
      {children}
    </label>
  );
}

function TextInput({
  placeholder,
  type = 'text',
  value,
  onChange,
  suffix,
  t,
}: {
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
  t: T;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: '40px',
          width: '100%',
          boxSizing: 'border-box',
          border: focused ? `1px solid ${t.blue}` : `1px solid ${t.inputBorder}`,
          boxShadow: focused ? `0 0 0 3px ${t.focusRing}` : 'none',
          borderRadius: '8px',
          padding: '0 12px',
          paddingRight: suffix ? '44px' : '12px',
          fontFamily: inter,
          fontSize: '14px',
          color: t.text1,
          background: t.surface,
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      />
      {suffix && (
        <div style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center',
        }}>
          {suffix}
        </div>
      )}
    </div>
  );
}

function Checkbox({ checked, onChange, label, t }: { checked: boolean; onChange: () => void; label: string; t: T }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={onChange}
        style={{
          width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
          border: checked ? 'none' : `1px solid ${t.inputBorder}`,
          background: checked ? t.blue : t.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'background 0.15s',
        }}
      >
        {checked && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
      </div>
      <span style={{ fontFamily: inter, fontSize: '14px', color: t.text2 }}>{label}</span>
    </label>
  );
}

function PrimaryButton({ children, onClick, fullWidth, t }: { children: React.ReactNode; onClick?: () => void; fullWidth?: boolean; t: T }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: '44px',
        width: fullWidth ? '100%' : 'auto',
        background: hovered ? t.blueHover : t.blue,
        border: 'none',
        borderRadius: '8px',
        fontFamily: inter,
        fontSize: '14px',
        fontWeight: 600,
        color: '#FFFFFF',
        cursor: 'pointer',
        transition: 'background 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </button>
  );
}

function OutlineButton({ children, onClick, fullWidth, t, dark }: { children: React.ReactNode; onClick?: () => void; fullWidth?: boolean; t: T; dark: boolean }) {
  const [hovered, setHovered] = useState(false);
  const hoverBg = dark ? t.tableHover : t.pageBg;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: '44px',
        width: fullWidth ? '100%' : 'auto',
        background: hovered ? hoverBg : t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: '8px',
        fontFamily: inter,
        fontSize: '14px',
        fontWeight: 500,
        color: t.text2,
        cursor: 'pointer',
        transition: 'background 0.15s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </button>
  );
}

function Divider({ label, t }: { label: string; t: T }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ flex: 1, height: '1px', background: t.border }} />
      <span style={{ fontFamily: inter, fontSize: '13px', color: t.text4, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: '1px', background: t.border }} />
    </div>
  );
}

/* ─── Main Page ─── */

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE — Login page
═══════════════════════════════════════════════════════════════════════════ */

function MobileInput({
  label, value, onChange, placeholder, type = 'text', suffix, t,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  suffix?: React.ReactNode;
  t: T;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const handleFocus = useCallback(() => {
    setFocused(true);
    setTimeout(() => {
      wrapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }, []);
  return (
    <div ref={wrapRef}>
      <label style={{
        display: 'block', fontFamily: inter, fontSize: 13, fontWeight: 500,
        color: t.text2, marginBottom: 8,
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{
            width: '100%', height: 48,
            padding: suffix ? '0 48px 0 14px' : '0 14px',
            border: `1.5px solid ${focused ? t.blue : t.inputBorder}`,
            borderRadius: 12,
            background: t.surface,
            fontFamily: inter, fontSize: 15, color: t.text1,
            outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.12s',
          }}
        />
        {suffix && (
          <div style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center',
          }}>
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileLogin({
  t, dark,
}: { t: T; dark: boolean }) {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const canSubmit = login.trim().length > 0 && password.length > 0;

  const handleLogin = () => {
    const isOrg = /org|mysafar|muhammad/i.test(login);
    navigate(isOrg ? '/org-dashboard' : '/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      background: t.pageBg, color: t.text1,
      display: 'flex', flexDirection: 'column',
      padding: 'max(80px, env(safe-area-inset-top)) 24px calc(24px + env(safe-area-inset-bottom))',
      boxSizing: 'border-box',
      transition: 'background 0.2s',
    }}>
      {/* Top — Logo + brand */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: t.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: dark ? '0 6px 18px rgba(37,99,235,0.35)' : '0 6px 18px rgba(37,99,235,0.25)',
          marginBottom: 20,
        }}>
          <CreditCard size={36} color="#FFFFFF" strokeWidth={2} />
        </div>
        <h1 style={{
          fontFamily: dm, fontSize: 24, fontWeight: 700, color: t.text1,
          margin: 0, lineHeight: 1.2,
        }}>
          Moment KPI
        </h1>
        <p style={{
          fontFamily: inter, fontSize: 13, color: t.text3,
          margin: '6px 0 0', textAlign: 'center', maxWidth: 280,
        }}>
          Платформа управления продажами карт
        </p>
      </div>

      {/* Middle — Form */}
      <div style={{ paddingTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <MobileInput
          label="Телефон или логин"
          value={login}
          onChange={setLogin}
          placeholder="+998 __ ___ __ __"
          type="tel"
          t={t}
        />
        <MobileInput
          label="Пароль"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          type={showPass ? 'text' : 'password'}
          t={t}
          suffix={
            <button
              onClick={() => setShowPass(s => !s)}
              style={{
                width: 32, height: 32, border: 'none', background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {showPass ? <EyeOff size={18} color={t.text3} strokeWidth={1.75} /> : <Eye size={18} color={t.text3} strokeWidth={1.75} />}
            </button>
          }
        />

        {/* Remember + Forgot */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
            <div
              onClick={() => setRemember(r => !r)}
              style={{
                width: 20, height: 20, borderRadius: 6,
                border: `1.5px solid ${remember ? t.blue : t.inputBorder}`,
                background: remember ? t.blue : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.12s', flexShrink: 0,
              }}
            >
              {remember && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
            </div>
            <span style={{ fontFamily: inter, fontSize: 14, color: t.text2 }}>Запомнить меня</span>
          </label>
          <span style={{ fontFamily: inter, fontSize: 14, fontWeight: 500, color: t.blue, cursor: 'pointer' }}>
            Забыли пароль?
          </span>
        </div>

        {/* Primary login */}
        <button
          disabled={!canSubmit}
          onClick={handleLogin}
          style={{
            width: '100%', height: 48, marginTop: 8,
            border: 'none', borderRadius: 12,
            background: canSubmit ? t.blue : (dark ? '#3A3F50' : '#D1D5DB'),
            fontFamily: inter, fontSize: 15, fontWeight: 600, color: '#FFFFFF',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
            transition: 'background 0.12s',
          }}
        >
          Войти
        </button>

        {/* Divider with "или" */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: t.border }} />
          <span style={{ fontFamily: inter, fontSize: 12, color: t.text4 }}>или</span>
          <div style={{ flex: 1, height: 1, background: t.border }} />
        </div>

        {/* Outline Unired ID */}
        <button
          style={{
            width: '100%', height: 48,
            border: `1.5px solid ${t.inputBorder}`, borderRadius: 12,
            background: 'transparent',
            fontFamily: inter, fontSize: 15, fontWeight: 500, color: t.text1,
            cursor: 'pointer',
          }}
        >
          Войти через Unired ID
        </button>
      </div>

      {/* Spacer to push footer */}
      <div style={{ flex: 1 }} />

      {/* Bottom — Copyright */}
      <div style={{
        paddingTop: 24, textAlign: 'center',
        fontFamily: inter, fontSize: 12, color: t.text4,
      }}>
        © 2026 Universalbank
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [darkMode] = useDarkMode();
  const mobile = useIsMobile();
  const t = theme(darkMode);
  const dark = darkMode;

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    const isOrg = /org|mysafar|muhammad/i.test(login);
    navigate(isOrg ? '/org-dashboard' : '/dashboard');
  };

  if (mobile) {
    return <MobileLogin t={t} dark={dark} />;
  }

  const rightPanelBg = dark ? '#0F1117' : C.surface;
  const loginCardBorder = dark ? `1px solid ${t.border}` : 'none';
  const illustrationBorderColor = dark ? '#4A4F63' : C.inputBorder;
  const secondaryCardBg = dark ? t.tableAlt : '#F1F5F9';
  const cardShadow = dark ? '0 2px 8px rgba(0,0,0,0.3)' : '0 4px 12px rgba(37,99,235,0.25)';

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: inter,
      background: rightPanelBg,
      transition: 'background 0.2s',
    }}>
      {/* ── Left Panel ── */}
      <div style={{
        flex: 1,
        background: t.pageBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        borderRight: `1px solid ${t.border}`,
        transition: 'background 0.2s',
      }}
        className="left-panel"
      >
        <div style={{ maxWidth: '440px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>

          {/* Illustration placeholder */}
          <div style={{
            width: '280px',
            height: '200px',
            border: `2px dashed ${illustrationBorderColor}`,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: t.surface,
            boxShadow: loginCardBorder ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
          }}>
            {/* Mini VISA card illustration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <div style={{
                width: '120px', height: '76px', borderRadius: '10px',
                background: t.blue,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '10px 12px',
                boxSizing: 'border-box',
                boxShadow: cardShadow,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '24px', height: '18px', borderRadius: '3px', background: '#F59E0B' }} />
                  <span style={{ fontFamily: F.mono, fontSize: '9px', color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>VISA</span>
                </div>
                <div style={{ fontFamily: F.mono, fontSize: '8px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em' }}>
                  •••• •••• •••• 4242
                </div>
              </div>
              {/* Second card offset */}
              <div style={{
                width: '100px', height: '64px', borderRadius: '8px',
                background: secondaryCardBg,
                border: `1px solid ${t.border}`,
                marginTop: '-52px',
                marginLeft: '20px',
                alignSelf: 'flex-end',
                boxSizing: 'border-box',
              }} />
            </div>
            <span style={{ fontFamily: inter, fontSize: '12px', color: t.text4, marginTop: '4px' }}>Illustration</span>
          </div>

          {/* Description text */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: inter,
              fontSize: '14px',
              color: t.text3,
              margin: 0,
              lineHeight: 1.6,
              maxWidth: '320px',
            }}>
              Управление продажами Moment VISA карт через партнёрские организации
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '20px' }}>
            {[
              { value: '3', label: 'KPI этапа' },
              { value: '10+', label: 'Партнёров' },
              { value: 'UCOIN', label: 'Выплаты' },
            ].map(stat => (
              <div key={stat.label} style={{
                textAlign: 'center',
                padding: '12px 16px',
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: '10px',
                minWidth: '72px',
              }}>
                <div style={{ fontFamily: dm, fontSize: '18px', fontWeight: 700, color: t.blue }}>{stat.value}</div>
                <div style={{ fontFamily: inter, fontSize: '11px', color: t.text4, marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel (Login Card) ── */}
      <div style={{
        width: '520px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '48px 0 32px',
        background: rightPanelBg,
        transition: 'background 0.2s',
      }}
        className="right-panel"
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', padding: '0 60px', boxSizing: 'border-box' }}>
          <div style={{
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            padding: dark ? '32px' : 0,
            background: dark ? t.surface : 'transparent',
            border: loginCardBorder,
            borderRadius: dark ? '12px' : 0,
            boxSizing: 'border-box',
          }}>

            {/* 1. Logo placeholder */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: t.blue,
              border: `1px solid ${t.border}`,
              borderRadius: '6px',
              padding: '0 12px',
              height: '32px',
              marginBottom: '28px',
            }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '4px',
                background: 'rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: dm, fontSize: '11px', fontWeight: 700, color: '#FFFFFF' }}>U</span>
              </div>
              <span style={{ fontFamily: dm, fontSize: '13px', fontWeight: 600, color: '#FFFFFF', letterSpacing: '0.01em' }}>UniCard</span>
            </div>

            {/* 2. Title */}
            <h1 style={{
              fontFamily: dm,
              fontSize: '26px',
              fontWeight: 700,
              color: t.text1,
              margin: '0 0 4px',
              lineHeight: 1.25,
            }}>
              Вход в систему
            </h1>

            {/* 3. Subtitle */}
            <p style={{
              fontFamily: inter,
              fontSize: '14px',
              color: t.text3,
              margin: '0 0 28px',
            }}>
              Moment Card KPI Platform
            </p>

            {/* 4. Phone/Login field */}
            <div style={{ marginBottom: '16px' }}>
              <Label t={t}>Телефон или логин</Label>
              <TextInput
                placeholder="+998 __ ___ __ __"
                value={login}
                onChange={setLogin}
                t={t}
              />
            </div>

            {/* 5. Password field */}
            <div style={{ marginBottom: '16px' }}>
              <Label t={t}>Пароль</Label>
              <TextInput
                placeholder="••••••••"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                t={t}
                suffix={
                  <button
                    onClick={() => setShowPass(s => !s)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: t.text4 }}
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            </div>

            {/* 6. Remember me + Forgot password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <Checkbox checked={remember} onChange={() => setRemember(r => !r)} label="Запомнить меня" t={t} />
              <button style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: inter, fontSize: '14px', color: t.blue, padding: 0,
                fontWeight: 500,
              }}>
                Забыли пароль?
              </button>
            </div>

            {/* 7. Primary CTA */}
            <div style={{ marginBottom: '20px' }}>
              <PrimaryButton fullWidth t={t} onClick={handleLogin}>Войти</PrimaryButton>
            </div>

            {/* 8. Divider */}
            <div style={{ marginBottom: '20px' }}>
              <Divider label="или" t={t} />
            </div>

            {/* 9. Outline CTA */}
            <OutlineButton fullWidth t={t} dark={dark} onClick={handleLogin}>Войти через Unired ID</OutlineButton>

          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 60px', width: '100%', boxSizing: 'border-box' }}>
          <p style={{ fontFamily: inter, fontSize: '13px', color: t.text4, margin: '0 0 12px', textAlign: 'center' }}>
            © 2026 Universalbank. Все права защищены.
          </p>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap',
          }}>
            <span style={{ fontFamily: inter, fontSize: '12px', color: t.text4 }}>
              Bank Admin: <span style={{ fontFamily: F.mono, fontSize: '11px', color: t.text3 }}>admin / admin123</span>
            </span>
            <span style={{ fontFamily: inter, fontSize: '12px', color: t.text4 }}>
              Org Admin: <span style={{ fontFamily: F.mono, fontSize: '11px', color: t.text3 }}>org / org123</span>
            </span>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .left-panel { display: none !important; }
          .right-panel { width: 100% !important; }
        }
        @media (max-width: 480px) {
          .right-panel { padding: 32px 20px 24px !important; }
        }
      `}</style>
    </div>
  );
}
