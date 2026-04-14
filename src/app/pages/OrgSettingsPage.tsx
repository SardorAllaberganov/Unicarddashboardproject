import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, C } from '../components/ds/tokens';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED STYLES
═══════════════════════════════════════════════════════════════════════════ */

const inputStyle: React.CSSProperties = {
  width: '100%', height: '40px', padding: '0 12px',
  border: `1px solid ${C.inputBorder}`, borderRadius: '8px',
  background: C.surface, fontFamily: F.inter, fontSize: '14px',
  color: C.text1, outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: F.inter, fontSize: '13px',
  fontWeight: 500, color: C.text2, marginBottom: '8px',
};

const sectionHeading: React.CSSProperties = {
  fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
  color: C.text1, margin: '0 0 16px',
};

const divider: React.CSSProperties = {
  height: '1px', background: C.border, margin: '32px 0',
};

/* ═══════════════════════════════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════════════════════════════ */

type TabId = 'profile' | 'security' | 'notifications' | 'organization';

const TABS: { id: TabId; label: string }[] = [
  { id: 'profile', label: 'Профиль' },
  { id: 'security', label: 'Безопасность' },
  { id: 'notifications', label: 'Уведомления' },
  { id: 'organization', label: 'Организация' },
];

function TabNav({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (tab: TabId) => void }) {
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);

  return (
    <div style={{
      width: '200px', background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: '12px', padding: '8px', flexShrink: 0,
    }}>
      {TABS.map(tab => {
        const isActive = tab.id === activeTab;
        const isHovered = tab.id === hoveredTab;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            style={{
              width: '100%', textAlign: 'left', padding: '10px 12px',
              border: 'none', borderRadius: '8px',
              background: isActive ? C.blueLt : isHovered ? '#F9FAFB' : 'transparent',
              fontFamily: F.inter, fontSize: '14px',
              fontWeight: isActive ? 500 : 400,
              color: isActive ? C.blue : C.text2,
              cursor: 'pointer', transition: 'all 0.12s',
              display: 'block', marginBottom: '2px',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTON HELPERS
═══════════════════════════════════════════════════════════════════════════ */

function PrimaryButton({ label, onClick }: { label: string; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '40px', padding: '0 20px',
        border: 'none',
        borderRadius: '8px', background: hov ? C.blueHover : C.blue,
        fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
        color: '#FFFFFF', cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      {label}
    </button>
  );
}

function OutlineButton({ label, onClick }: { label: string; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        height: '40px', padding: '0 20px',
        border: `1px solid ${hov ? C.blue : C.border}`,
        borderRadius: '8px', background: hov ? C.blueLt : C.surface,
        fontFamily: F.inter, fontSize: '14px', fontWeight: 500,
        color: hov ? C.blue : C.text2,
        cursor: 'pointer', transition: 'all 0.12s',
      }}
    >
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHECKBOX
═══════════════════════════════════════════════════════════════════════════ */

function CheckboxRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 0' }}>
      <div
        onClick={onChange}
        style={{
          width: '16px', height: '16px', borderRadius: '4px',
          border: `1.5px solid ${checked ? C.blue : C.inputBorder}`,
          background: checked ? C.blue : C.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.12s',
        }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4.5 7.5L8 3" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>{label}</span>
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOGGLE
═══════════════════════════════════════════════════════════════════════════ */

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 0', borderBottom: `1px solid ${C.border}`,
    }}>
      <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>{label}</span>
      <button
        onClick={onChange}
        style={{
          width: '44px', height: '24px', borderRadius: '12px',
          background: checked ? C.blue : '#D1D5DB',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s',
        }}
      >
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%',
          background: C.surface, position: 'absolute', top: '3px',
          left: checked ? '23px' : '3px',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: ПРОФИЛЬ
═══════════════════════════════════════════════════════════════════════════ */

function ProfileTab() {
  const [fullName, setFullName] = useState('Рустам Алиев');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [email, setEmail] = useState('r.aliev@mysafar.uz');
  const [language, setLanguage] = useState('Русский');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  return (
    <div>
      <h3 style={sectionHeading}>Личные данные</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div>
          <label style={labelStyle}>ФИО</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Телефон</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} style={{ ...inputStyle, fontFamily: F.mono }} />
        </div>
        <div>
          <label style={labelStyle}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Язык интерфейса</label>
          <select value={language} onChange={e => setLanguage(e.target.value)} style={inputStyle}>
            <option>Русский</option>
            <option>O'zbek</option>
            <option>English</option>
          </select>
        </div>
      </div>

      <div style={divider} />

      <h3 style={sectionHeading}>Тема оформления</h3>
      <div style={{ display: 'flex', gap: '20px' }}>
        {(['light', 'dark', 'system'] as const).map(t => (
          <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div
              onClick={() => setTheme(t)}
              style={{
                width: '16px', height: '16px', borderRadius: '50%',
                border: `2px solid ${theme === t ? C.blue : C.inputBorder}`,
                background: theme === t ? C.blue : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              {theme === t && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff' }} />}
            </div>
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>
              {t === 'light' ? 'Светлая' : t === 'dark' ? 'Тёмная' : 'Системная'}
            </span>
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        <PrimaryButton label="Сохранить" />
        <OutlineButton label="Отмена" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: БЕЗОПАСНОСТЬ
═══════════════════════════════════════════════════════════════════════════ */

function SecurityTab() {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div>
      <h3 style={sectionHeading}>Смена пароля</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
        <div>
          <label style={labelStyle}>Текущий пароль</label>
          <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Новый пароль</label>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Минимум 8 символов" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Подтверждение</label>
          <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Повторите новый пароль" style={inputStyle} />
        </div>
        <PrimaryButton label="Обновить пароль" />
      </div>

      <div style={divider} />

      <h3 style={sectionHeading}>Двухфакторная аутентификация</h3>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderRadius: '10px',
        background: '#F9FAFB', border: `1px solid ${C.border}`, maxWidth: '500px',
      }}>
        <div>
          <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1 }}>
            SMS подтверждение при входе
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4, marginTop: '2px' }}>
            Код будет отправлен на +998 90 123 45 67
          </div>
        </div>
        <button
          onClick={() => setTwoFA(!twoFA)}
          style={{
            width: '44px', height: '24px', borderRadius: '12px',
            background: twoFA ? C.blue : '#D1D5DB',
            border: 'none', cursor: 'pointer', position: 'relative',
            transition: 'background 0.2s',
          }}
        >
          <div style={{
            width: '18px', height: '18px', borderRadius: '50%',
            background: C.surface, position: 'absolute', top: '3px',
            left: twoFA ? '23px' : '3px',
            transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </button>
      </div>

      <div style={divider} />

      <h3 style={sectionHeading}>Активные сеансы</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { device: 'Chrome · Windows', ip: '195.158.12.xx', time: 'Текущий сеанс', current: true },
          { device: 'Safari · iPhone 15', ip: '195.158.12.xx', time: '12.04.2026, 18:30', current: false },
        ].map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderRadius: '10px',
            background: C.surface, border: `1px solid ${s.current ? C.blueTint : C.border}`,
          }}>
            <div>
              <div style={{ fontFamily: F.inter, fontSize: '14px', fontWeight: 500, color: C.text1 }}>
                {s.device}
              </div>
              <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text4, marginTop: '2px' }}>
                {s.ip} · {s.time}
              </div>
            </div>
            {s.current ? (
              <span style={{
                fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
                padding: '3px 10px', borderRadius: '10px',
                background: C.successBg, color: '#15803D',
              }}>
                Текущий
              </span>
            ) : (
              <button style={{
                border: 'none', background: 'none',
                fontFamily: F.inter, fontSize: '13px', color: '#DC2626',
                cursor: 'pointer',
              }}>
                Завершить
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: УВЕДОМЛЕНИЯ
═══════════════════════════════════════════════════════════════════════════ */

function NotificationsTab() {
  const [emailNotifs, setEmailNotifs] = useState({
    kpi3: true,
    withdrawal: true,
    cardsAssigned: true,
    dailyReport: false,
    weeklySummary: false,
  });

  const [pushNotifs, setPushNotifs] = useState({
    kpiDone: true,
    newWithdrawal: true,
    expiredKpi: false,
    newDevice: true,
  });

  return (
    <div>
      <h3 style={sectionHeading}>Email уведомления</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <CheckboxRow label="Продавец выполнил KPI 3" checked={emailNotifs.kpi3} onChange={() => setEmailNotifs(p => ({ ...p, kpi3: !p.kpi3 }))} />
        <CheckboxRow label="Запрос на вывод средств" checked={emailNotifs.withdrawal} onChange={() => setEmailNotifs(p => ({ ...p, withdrawal: !p.withdrawal }))} />
        <CheckboxRow label="Новые карты назначены" checked={emailNotifs.cardsAssigned} onChange={() => setEmailNotifs(p => ({ ...p, cardsAssigned: !p.cardsAssigned }))} />
        <CheckboxRow label="Ежедневный отчёт по продавцам" checked={emailNotifs.dailyReport} onChange={() => setEmailNotifs(p => ({ ...p, dailyReport: !p.dailyReport }))} />
        <CheckboxRow label="Еженедельная сводка" checked={emailNotifs.weeklySummary} onChange={() => setEmailNotifs(p => ({ ...p, weeklySummary: !p.weeklySummary }))} />
      </div>

      <div style={divider} />

      <h3 style={sectionHeading}>Push уведомления</h3>
      <div>
        <ToggleRow label="KPI выполнен" checked={pushNotifs.kpiDone} onChange={() => setPushNotifs(p => ({ ...p, kpiDone: !p.kpiDone }))} />
        <ToggleRow label="Новый вывод средств" checked={pushNotifs.newWithdrawal} onChange={() => setPushNotifs(p => ({ ...p, newWithdrawal: !p.newWithdrawal }))} />
        <ToggleRow label="Просроченный KPI" checked={pushNotifs.expiredKpi} onChange={() => setPushNotifs(p => ({ ...p, expiredKpi: !p.expiredKpi }))} />
        <ToggleRow label="Вход с нового устройства" checked={pushNotifs.newDevice} onChange={() => setPushNotifs(p => ({ ...p, newDevice: !p.newDevice }))} />
      </div>

      <div style={{ marginTop: '32px' }}>
        <PrimaryButton label="Сохранить" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: ОРГАНИЗАЦИЯ
═══════════════════════════════════════════════════════════════════════════ */

function OrganizationTab() {
  const [contact, setContact] = useState('Рустам Алиев');
  const [orgPhone, setOrgPhone] = useState('+998 90 123 45 67');
  const [orgEmail, setOrgEmail] = useState('info@mysafar.uz');
  const [address, setAddress] = useState('г. Ташкент, ул. Навои, 12');

  const kvRows = [
    { label: 'Номер договора', value: 'MC-2026-042', mono: true },
    { label: 'Дата заключения', value: '15.03.2026' },
    { label: 'Срок действия', value: '15.03.2027' },
    { label: 'Лимит карт', value: '500', mono: true },
  ];

  return (
    <div>
      <h3 style={sectionHeading}>Данные организации</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <div>
          <label style={labelStyle}>Название</label>
          <input value="Mysafar OOO" disabled style={{
            ...inputStyle, background: '#F9FAFB', color: C.text3, cursor: 'not-allowed',
          }} />
          <span style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4, marginTop: '4px', display: 'block' }}>
            Изменяется только банком
          </span>
        </div>
        <div>
          <label style={labelStyle}>Контактное лицо</label>
          <input value={contact} onChange={e => setContact(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Телефон организации</label>
          <input value={orgPhone} onChange={e => setOrgPhone(e.target.value)} style={{ ...inputStyle, fontFamily: F.mono }} />
        </div>
        <div>
          <label style={labelStyle}>Email организации</label>
          <input value={orgEmail} onChange={e => setOrgEmail(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>Адрес</label>
          <textarea
            value={address}
            onChange={e => setAddress(e.target.value)}
            style={{
              ...inputStyle, height: '80px', padding: '10px 12px',
              resize: 'vertical',
            }}
          />
        </div>
      </div>

      <div style={divider} />

      <h3 style={sectionHeading}>Договор</h3>
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: '10px', overflow: 'hidden',
      }}>
        {kvRows.map((row, i) => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px',
            borderBottom: i < kvRows.length ? `1px solid ${C.border}` : 'none',
          }}>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>{row.label}</span>
            <span style={{
              fontFamily: row.mono ? F.mono : F.inter,
              fontSize: '14px', fontWeight: 500, color: C.text1,
            }}>
              {row.value}
            </span>
          </div>
        ))}
        {/* Status row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px',
        }}>
          <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Статус</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontFamily: F.inter, fontSize: '12px', fontWeight: 500,
            padding: '3px 10px', borderRadius: '10px',
            background: C.successBg, color: '#15803D',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.success, flexShrink: 0 }} />
            Активен
          </span>
        </div>
      </div>

      <p style={{
        fontFamily: F.inter, fontSize: '12px', color: C.text4,
        marginTop: '12px',
      }}>
        Для изменения условий договора обратитесь в банк.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function OrgSettingsPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('profile');

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/org-dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Настройки</span>
          </div>

          {/* Top Bar */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
              Настройки
            </h1>
            <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
              Настройки профиля и организации
            </p>
          </div>

          {/* Layout: Left tabs + Right content */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

            <div style={{
              flex: 1, background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: '12px', padding: '24px', minWidth: 0,
            }}>
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'security' && <SecurityTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
              {activeTab === 'organization' && <OrganizationTab />}
            </div>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>

      {/* Responsive: tabs go horizontal on tablet */}
      <style>{`
        @media (max-width: 1024px) {
          div[style*="width: '200px'"] {
            width: 100% !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            white-space: nowrap !important;
          }
        }
      `}</style>
    </div>
  );
}
