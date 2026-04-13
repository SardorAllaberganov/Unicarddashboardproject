import React, { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { F, C } from '../components/ds/tokens';

const dm = F.dm;
const inter = F.inter;

/* ─── Reusable primitives ─── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ fontFamily: inter, fontSize: '14px', fontWeight: 500, color: C.text2, display: 'block', marginBottom: '6px' }}>
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
}: {
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: React.ReactNode;
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
          border: focused ? `1px solid ${C.blue}` : `1px solid ${C.inputBorder}`,
          boxShadow: focused ? `0 0 0 3px ${C.blueTint}` : 'none',
          borderRadius: '8px',
          padding: '0 12px',
          paddingRight: suffix ? '44px' : '12px',
          fontFamily: inter,
          fontSize: '14px',
          color: C.text1,
          background: C.surface,
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

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={onChange}
        style={{
          width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
          border: checked ? 'none' : `1px solid ${C.inputBorder}`,
          background: checked ? C.blue : C.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'background 0.15s',
        }}
      >
        {checked && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
      </div>
      <span style={{ fontFamily: inter, fontSize: '14px', color: C.text2 }}>{label}</span>
    </label>
  );
}

function PrimaryButton({ children, onClick, fullWidth }: { children: React.ReactNode; onClick?: () => void; fullWidth?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: '44px',
        width: fullWidth ? '100%' : 'auto',
        background: hovered ? C.blueHover : C.blue,
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

function OutlineButton({ children, onClick, fullWidth }: { children: React.ReactNode; onClick?: () => void; fullWidth?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: '44px',
        width: fullWidth ? '100%' : 'auto',
        background: hovered ? C.pageBg : C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: '8px',
        fontFamily: inter,
        fontSize: '14px',
        fontWeight: 500,
        color: C.text2,
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

function Divider({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ flex: 1, height: '1px', background: C.border }} />
      <span style={{ fontFamily: inter, fontSize: '13px', color: C.text4, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: '1px', background: C.border }} />
    </div>
  );
}

/* ─── Main Page ─── */

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: inter,
      background: C.surface,
    }}>
      {/* ── Left Panel ── */}
      <div style={{
        flex: 1,
        background: C.pageBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        borderRight: `1px solid ${C.border}`,
      }}
        className="left-panel"
      >
        <div style={{ maxWidth: '440px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>

          {/* Illustration placeholder */}
          <div style={{
            width: '280px',
            height: '200px',
            border: `2px dashed ${C.border}`,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: C.surface,
          }}>
            {/* Mini VISA card illustration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              <div style={{
                width: '120px', height: '76px', borderRadius: '10px',
                background: C.blue,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '10px 12px',
                boxSizing: 'border-box',
                boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
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
                background: '#F1F5F9',
                border: `1px solid ${C.border}`,
                marginTop: '-52px',
                marginLeft: '20px',
                alignSelf: 'flex-end',
                boxSizing: 'border-box',
              }} />
            </div>
            <span style={{ fontFamily: inter, fontSize: '12px', color: C.text4, marginTop: '4px' }}>Illustration</span>
          </div>

          {/* Description text */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: inter,
              fontSize: '14px',
              color: C.text3,
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
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '10px',
                minWidth: '72px',
              }}>
                <div style={{ fontFamily: dm, fontSize: '18px', fontWeight: 700, color: C.blue }}>{stat.value}</div>
                <div style={{ fontFamily: inter, fontSize: '11px', color: C.text4, marginTop: '2px' }}>{stat.label}</div>
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
        background: C.surface,
      }}
        className="right-panel"
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', padding: '0 60px', boxSizing: 'border-box' }}>
          <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>

            {/* 1. Logo placeholder */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: C.blue,
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
              color: C.text1,
              margin: '0 0 4px',
              lineHeight: 1.25,
            }}>
              Вход в систему
            </h1>

            {/* 3. Subtitle */}
            <p style={{
              fontFamily: inter,
              fontSize: '14px',
              color: C.text3,
              margin: '0 0 28px',
            }}>
              Moment Card KPI Platform
            </p>

            {/* 4. Phone/Login field */}
            <div style={{ marginBottom: '16px' }}>
              <Label>Телефон или логин</Label>
              <TextInput
                placeholder="+998 __ ___ __ __"
                value={login}
                onChange={setLogin}
              />
            </div>

            {/* 5. Password field */}
            <div style={{ marginBottom: '16px' }}>
              <Label>Пароль</Label>
              <TextInput
                placeholder="••••••••"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                suffix={
                  <button
                    onClick={() => setShowPass(s => !s)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: C.text4 }}
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            </div>

            {/* 6. Remember me + Forgot password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <Checkbox checked={remember} onChange={() => setRemember(r => !r)} label="Запомнить меня" />
              <button style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: inter, fontSize: '14px', color: C.blue, padding: 0,
                fontWeight: 500,
              }}>
                Забыли пароль?
              </button>
            </div>

            {/* 7. Primary CTA */}
            <div style={{ marginBottom: '20px' }}>
              <PrimaryButton fullWidth>Войти</PrimaryButton>
            </div>

            {/* 8. Divider */}
            <div style={{ marginBottom: '20px' }}>
              <Divider label="или" />
            </div>

            {/* 9. Outline CTA */}
            <OutlineButton fullWidth>Войти через Unired ID</OutlineButton>

          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 60px', width: '100%', boxSizing: 'border-box' }}>
          <p style={{ fontFamily: inter, fontSize: '13px', color: C.text4, margin: '0 0 12px', textAlign: 'center' }}>
            © 2026 Universalbank. Все права защищены.
          </p>
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap',
          }}>
            <span style={{ fontFamily: inter, fontSize: '12px', color: C.text4 }}>
              Bank Admin: <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.text3 }}>admin / admin123</span>
            </span>
            <span style={{ fontFamily: inter, fontSize: '12px', color: C.text4 }}>
              Org Admin: <span style={{ fontFamily: F.mono, fontSize: '11px', color: C.text3 }}>org / org123</span>
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