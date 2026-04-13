import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, Moon, Sun, LogOut, Download, AlertTriangle, X,
} from 'lucide-react';
import { BankAdminSidebar } from '../components/BankAdminSidebar';
import { F, C } from '../components/ds/tokens';

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════════════════ */

type TabId = 'profile' | 'security' | 'notifications' | 'kpi-defaults' | 'integrations' | 'system';

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: 'profile', label: 'Профиль' },
  { id: 'security', label: 'Безопасность' },
  { id: 'notifications', label: 'Уведомления' },
  { id: 'kpi-defaults', label: 'KPI по умолчанию' },
  { id: 'integrations', label: 'Интеграции' },
  { id: 'system', label: 'Система' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR USER SECTION
═══════════════════════════════════════════════════════════════════════════ */

function NavbarUserSection({ darkMode, onDarkModeToggle }: { darkMode: boolean; onDarkModeToggle: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeHov, setThemeHov] = useState(false);
  const [logoutHov, setLogoutHov] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <button
        onClick={onDarkModeToggle}
        onMouseEnter={() => setThemeHov(true)}
        onMouseLeave={() => setThemeHov(false)}
        style={{
          width: '36px', height: '36px', borderRadius: '8px',
          border: `1px solid ${themeHov ? '#D1D5DB' : C.border}`,
          background: themeHov ? '#F9FAFB' : C.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
        }}
      >
        {darkMode
          ? <Sun size={15} color="#F59E0B" strokeWidth={1.75} />
          : <Moon size={15} color={C.text3} strokeWidth={1.75} />}
      </button>

      <div style={{ width: '1px', height: '24px', background: C.border, margin: '0 6px', flexShrink: 0 }} />

      <div ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '5px 10px 5px 6px',
            border: `1px solid ${menuOpen ? C.blue : C.border}`,
            borderRadius: '10px',
            background: menuOpen ? C.blueLt : C.surface,
            cursor: 'pointer', transition: 'all 0.12s',
            boxShadow: menuOpen ? `0 0 0 3px ${C.blueTint}` : 'none',
          }}
        >
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: C.blueTint, border: `1.5px solid ${C.blue}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontFamily: F.inter, fontSize: '11px', fontWeight: 700, color: C.blue }}>АК</span>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text1, whiteSpace: 'nowrap', lineHeight: 1.3 }}>
              Админ Камолов
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4, lineHeight: '16px', whiteSpace: 'nowrap' }}>
              Bank Admin
            </div>
          </div>
        </button>

        {menuOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0,
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: '10px', padding: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.09)', zIndex: 60, minWidth: '180px',
          }}>
            <div style={{ height: '1px', background: C.border, margin: '4px 0' }} />
            <button
              onMouseEnter={() => setLogoutHov(true)}
              onMouseLeave={() => setLogoutHov(false)}
              style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '7px', border: 'none',
                background: logoutHov ? '#FEF2F2' : 'none', cursor: 'pointer',
                fontFamily: F.inter, fontSize: '13px',
                color: logoutHov ? '#DC2626' : C.text3, transition: 'all 0.1s',
              }}
            >
              <LogOut size={14} strokeWidth={1.75} /> Выйти из системы
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB NAV
═══════════════════════════════════════════════════════════════════════════ */

function TabNav({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (tab: TabId) => void }) {
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);

  return (
    <div style={{
      width: '200px',
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: '12px',
      padding: '8px',
      flexShrink: 0,
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
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              border: 'none',
              borderRadius: '8px',
              background: isActive ? C.blueLt : isHovered ? '#F9FAFB' : 'transparent',
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: isActive ? 500 : 400,
              color: isActive ? C.blue : C.text2,
              cursor: 'pointer',
              transition: 'all 0.12s',
              display: 'block',
              marginBottom: '2px',
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
   TAB: ПРОФИЛЬ
═══════════════════════════════════════════════════════════════════════════ */

function ProfileTab() {
  const [fullName, setFullName] = useState('Админ Камолов');
  const [phone, setPhone] = useState('+998 90 100 00 01');
  const [email, setEmail] = useState('admin@ubank.uz');
  const [language, setLanguage] = useState('Русский');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  return (
    <div>
      {/* Personal Data */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: C.text1,
          margin: '0 0 16px',
        }}>
          Личные данные
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
        }}>
          <div>
            <label style={{
              display: 'block',
              fontFamily: F.inter,
              fontSize: '13px',
              fontWeight: 500,
              color: C.text2,
              marginBottom: '8px',
            }}>
              ФИО
            </label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontFamily: F.inter,
              fontSize: '13px',
              fontWeight: 500,
              color: C.text2,
              marginBottom: '8px',
            }}>
              Телефон
            </label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ ...inputStyle, fontFamily: F.mono }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontFamily: F.inter,
              fontSize: '13px',
              fontWeight: 500,
              color: C.text2,
              marginBottom: '8px',
            }}>
              Email
            </label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontFamily: F.inter,
              fontSize: '13px',
              fontWeight: 500,
              color: C.text2,
              marginBottom: '8px',
            }}>
              Язык интерфейса
            </label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={inputStyle}
            >
              <option>Русский</option>
              <option>O'zbek</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: C.border, margin: '32px 0' }} />

      {/* Theme */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: C.text1,
          margin: '0 0 16px',
        }}>
          Тема оформления
        </h3>

        <div style={{ display: 'flex', gap: '20px' }}>
          {(['light', 'dark', 'system'] as const).map(t => (
            <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="radio"
                name="theme"
                checked={theme === t}
                onChange={() => setTheme(t)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: C.blue,
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>
                {t === 'light' ? 'Светлая' : t === 'dark' ? 'Тёмная' : 'Системная'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onMouseEnter={() => setSaveHover(true)}
          onMouseLeave={() => setSaveHover(false)}
          style={{
            height: '40px',
            padding: '0 20px',
            border: saveHover ? `2px solid ${C.blueHover}` : 'none',
            borderRadius: '8px',
            background: saveHover ? C.blueHover : C.blue,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
        >
          Сохранить изменения
        </button>
        <button
          onMouseEnter={() => setCancelHover(true)}
          onMouseLeave={() => setCancelHover(false)}
          style={{
            height: '40px',
            padding: '0 20px',
            border: `1px solid ${cancelHover ? C.blue : C.border}`,
            borderRadius: '8px',
            background: cancelHover ? C.blueLt : C.surface,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: cancelHover ? C.blue : C.text2,
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
        >
          Отмена
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: БЕЗОПАСНОСТЬ
═══════════════════════════════════════════════════════════════════════════ */

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  const [updatePwHover, setUpdatePwHover] = useState(false);
  const [endAllHover, setEndAllHover] = useState(false);

  const sessions = [
    { device: 'Chrome, Windows', date: '13.04.2026 09:12', location: 'Ташкент', current: true },
    { device: 'Safari, iPhone', date: '12.04.2026 18:30', location: 'Ташкент', current: false },
    { device: 'Chrome, MacOS', date: '10.04.2026 14:00', location: 'Самарканд', current: false },
  ];

  return (
    <div>
      {/* Change Password */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: C.text1,
          margin: '0 0 16px',
        }}>
          Смена пароля
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <div>
            <label style={labelStyle}>Текущий пароль</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Новый пароль</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Подтвердите пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        <button
          onMouseEnter={() => setUpdatePwHover(true)}
          onMouseLeave={() => setUpdatePwHover(false)}
          style={{
            marginTop: '16px',
            height: '40px',
            padding: '0 20px',
            border: updatePwHover ? `2px solid ${C.blueHover}` : 'none',
            borderRadius: '8px',
            background: updatePwHover ? C.blueHover : C.blue,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
        >
          Обновить пароль
        </button>
      </div>

      <div style={{ height: '1px', background: C.border, margin: '32px 0' }} />

      {/* 2FA */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: C.text1,
          margin: '0 0 16px',
        }}>
          Двухфакторная аутентификация
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '500px',
        }}>
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2, marginBottom: '4px' }}>
              2FA через SMS
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3 }}>
              Код будет отправлен на +998 90 100 00 01
            </div>
          </div>
          <ToggleSwitch checked={twoFAEnabled} onChange={setTwoFAEnabled} />
        </div>
      </div>

      <div style={{ height: '1px', background: C.border, margin: '32px 0' }} />

      {/* Active Sessions */}
      <div>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: C.text1,
          margin: '0 0 16px',
        }}>
          Активные сессии
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {sessions.map((session, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                border: `1px solid ${C.border}`,
                borderRadius: '10px',
                background: C.surface,
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text2 }}>
                  {session.device} — {session.date} — {session.location}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {session.current && (
                  <span style={{
                    fontFamily: F.inter,
                    fontSize: '12px',
                    fontWeight: 500,
                    padding: '3px 10px',
                    borderRadius: '10px',
                    background: C.successBg,
                    color: '#15803D',
                  }}>
                    Текущая
                  </span>
                )}
                <button
                  style={{
                    padding: '6px 12px',
                    border: `1px solid ${C.border}`,
                    borderRadius: '6px',
                    background: C.surface,
                    fontFamily: F.inter,
                    fontSize: '13px',
                    color: C.text3,
                    cursor: 'pointer',
                  }}
                >
                  Завершить
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onMouseEnter={() => setEndAllHover(true)}
          onMouseLeave={() => setEndAllHover(false)}
          style={{
            height: '40px',
            padding: '0 20px',
            border: `1px solid ${endAllHover ? C.error : C.border}`,
            borderRadius: '8px',
            background: endAllHover ? C.errorBg : C.surface,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: endAllHover ? C.error : C.text2,
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
        >
          Завершить все сессии
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: УВЕДОМЛЕНИЯ
═══════════════════════════════════════════════════════════════════════════ */

function NotificationsTab() {
  const [emailNotifs, setEmailNotifs] = useState({
    newOrg: true,
    kpiComplete: true,
    withdrawRequest: true,
    dailyReport: false,
    weeklyReport: false,
  });

  const [pushNotifs, setPushNotifs] = useState({
    kpi3: true,
    newImport: true,
    systemErrors: true,
    newDevice: false,
  });

  const [saveHover, setSaveHover] = useState(false);

  return (
    <div>
      {/* Email Notifications */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: C.text1,
          margin: '0 0 16px',
        }}>
          Email уведомления
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={emailNotifs.newOrg}
              onChange={e => setEmailNotifs({ ...emailNotifs, newOrg: e.target.checked })}
              style={checkboxStyle}
            />
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>
              Новая организация добавлена
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={emailNotifs.kpiComplete}
              onChange={e => setEmailNotifs({ ...emailNotifs, kpiComplete: e.target.checked })}
              style={checkboxStyle}
            />
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>
              KPI этап выполнен (массовый)
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={emailNotifs.withdrawRequest}
              onChange={e => setEmailNotifs({ ...emailNotifs, withdrawRequest: e.target.checked })}
              style={checkboxStyle}
            />
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>
              Запрос на вывод средств
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={emailNotifs.dailyReport}
              onChange={e => setEmailNotifs({ ...emailNotifs, dailyReport: e.target.checked })}
              style={checkboxStyle}
            />
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>
              Ежедневный отчёт
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={emailNotifs.weeklyReport}
              onChange={e => setEmailNotifs({ ...emailNotifs, weeklyReport: e.target.checked })}
              style={checkboxStyle}
            />
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>
              Еженедельная сводка
            </span>
          </label>
        </div>
      </div>

      <div style={{ height: '1px', background: C.border, margin: '32px 0' }} />

      {/* Push Notifications */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: C.text1,
          margin: '0 0 16px',
        }}>
          Push уведомления
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>
              KPI 3 выполнен
            </span>
            <ToggleSwitch
              checked={pushNotifs.kpi3}
              onChange={v => setPushNotifs({ ...pushNotifs, kpi3: v })}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>
              Новый импорт карт
            </span>
            <ToggleSwitch
              checked={pushNotifs.newImport}
              onChange={v => setPushNotifs({ ...pushNotifs, newImport: v })}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>
              Ошибки системы
            </span>
            <ToggleSwitch
              checked={pushNotifs.systemErrors}
              onChange={v => setPushNotifs({ ...pushNotifs, systemErrors: v })}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: C.text2 }}>
              Вход с нового устройства
            </span>
            <ToggleSwitch
              checked={pushNotifs.newDevice}
              onChange={v => setPushNotifs({ ...pushNotifs, newDevice: v })}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <button
        onMouseEnter={() => setSaveHover(true)}
        onMouseLeave={() => setSaveHover(false)}
        style={{
          height: '40px',
          padding: '0 20px',
          border: saveHover ? `2px solid ${C.blueHover}` : 'none',
          borderRadius: '8px',
          background: saveHover ? C.blueHover : C.blue,
          fontFamily: F.inter,
          fontSize: '14px',
          fontWeight: 500,
          color: '#FFFFFF',
          cursor: 'pointer',
          transition: 'all 0.12s',
        }}
      >
        Сохранить
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: KPI DEFAULTS
═══════════════════════════════════════════════════════════════════════════ */

function KPIDefaultsTab() {
  const [kpiDays, setKpiDays] = useState('30');
  const [maxSteps, setMaxSteps] = useState('3');

  const [saveHover, setSaveHover] = useState(false);
  const [resetHover, setResetHover] = useState(false);

  return (
    <div>
      <h3 style={{
        fontFamily: F.dm,
        fontSize: '16px',
        fontWeight: 600,
        color: C.text1,
        margin: '0 0 8px',
      }}>
        Шаблон KPI для новых партий
      </h3>
      <p style={{
        fontFamily: F.inter,
        fontSize: '13px',
        color: C.text3,
        margin: '0 0 24px',
      }}>
        Эти значения будут подставлены по умолчанию при создании новой партии карт.
      </p>

      {/* Mini KPI Steps */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {[
          { step: 1, action: 'Регистрация в Unired Mobile', threshold: '0', reward: '5 000 UZS' },
          { step: 2, action: 'P2P пополнение карты', threshold: '0', reward: '5 000 UZS' },
          { step: 3, action: 'Оплата в рознице', threshold: '500 000 UZS', reward: '10 000 UZS' },
        ].map(item => (
          <div
            key={item.step}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              border: `1px solid ${C.border}`,
              borderRadius: '10px',
              background: C.surface,
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: C.blueTint,
              border: `2px solid ${C.blue}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 700, color: C.blue }}>
                {item.step}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text2 }}>
                {item.action}
              </div>
              <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3, marginTop: '2px' }}>
                Порог: {item.threshold} · Вознаграждение: {item.reward}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '24px',
      }}>
        <div>
          <label style={labelStyle}>Срок выполнения KPI (дней)</label>
          <input
            type="number"
            value={kpiDays}
            onChange={e => setKpiDays(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Максимум этапов</label>
          <input
            type="number"
            value={maxSteps}
            onChange={e => setMaxSteps(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onMouseEnter={() => setSaveHover(true)}
          onMouseLeave={() => setSaveHover(false)}
          style={{
            height: '40px',
            padding: '0 20px',
            border: saveHover ? `2px solid ${C.blueHover}` : 'none',
            borderRadius: '8px',
            background: saveHover ? C.blueHover : C.blue,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: '#FFFFFF',
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
        >
          Сохранить шаблон
        </button>
        <button
          onMouseEnter={() => setResetHover(true)}
          onMouseLeave={() => setResetHover(false)}
          style={{
            height: '40px',
            padding: '0 20px',
            border: `1px solid ${resetHover ? C.blue : C.border}`,
            borderRadius: '8px',
            background: resetHover ? C.blueLt : C.surface,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: resetHover ? C.blue : C.text2,
            cursor: 'pointer',
            transition: 'all 0.12s',
          }}
        >
          Сбросить по умолчанию
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: ИНТЕГРАЦИИ
═══════════════════════════════════════════════════════════════════════════ */

function IntegrationsTab() {
  const [integrations, setIntegrations] = useState([
    {
      id: 'unired',
      icon: 'U',
      name: 'Unired Mobile',
      description: 'Webhook: регистрация карт, статусы',
      enabled: true,
      webhook: 'https://api.moment.uz/webhooks/unired',
      lastCall: '13.04.2026 14:32',
      errors: 0,
    },
    {
      id: 'processing',
      icon: 'P',
      name: 'Процессинг',
      description: 'Webhook: P2P переводы, POS/ECOM транзакции',
      enabled: true,
      webhook: 'https://api.moment.uz/webhooks/processing',
      lastCall: '13.04.2026 14:30',
      errors: 0,
    },
    {
      id: 'ucoin',
      icon: 'UC',
      name: 'UCOIN Wallet',
      description: 'API: начисление вознаграждений, вывод средств',
      enabled: true,
      webhook: 'https://api.moment.uz/webhooks/ucoin',
      lastCall: '13.04.2026 14:32',
      errors: 0,
    },
  ]);

  const [addHover, setAddHover] = useState(false);

  return (
    <div>
      <h3 style={{
        fontFamily: F.dm,
        fontSize: '16px',
        fontWeight: 600,
        color: C.text1,
        margin: '0 0 16px',
      }}>
        Подключённые сервисы
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {integrations.map(integration => (
          <div
            key={integration.id}
            style={{
              padding: '16px',
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              background: C.surface,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: C.blueTint,
                border: `1px solid ${C.blue}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: F.dm, fontSize: '13px', fontWeight: 700, color: C.blue }}>
                  {integration.icon}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.dm, fontSize: '14px', fontWeight: 600, color: C.text1 }}>
                  {integration.name}
                </div>
                <div style={{ fontFamily: F.inter, fontSize: '12px', color: C.text3, marginTop: '2px' }}>
                  {integration.description}
                </div>
              </div>
              <span style={{
                fontFamily: F.inter,
                fontSize: '12px',
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: '10px',
                background: C.successBg,
                color: '#15803D',
              }}>
                Подключено
              </span>
              <ToggleSwitch
                checked={integration.enabled}
                onChange={v => {
                  setIntegrations(prev =>
                    prev.map(i => i.id === integration.id ? { ...i, enabled: v } : i)
                  );
                }}
              />
            </div>
            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: '#F9FAFB',
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ fontFamily: F.mono, fontSize: '11px', color: C.text3, marginBottom: '6px' }}>
                {integration.webhook}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontFamily: F.inter, fontSize: '11px', color: C.text4 }}>
                  Последний вызов: {integration.lastCall}
                </span>
                <span style={{ fontFamily: F.inter, fontSize: '11px', color: '#15803D' }}>
                  Ошибок за 24ч: {integration.errors}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onMouseEnter={() => setAddHover(true)}
        onMouseLeave={() => setAddHover(false)}
        style={{
          height: '40px',
          padding: '0 20px',
          border: `1px solid ${addHover ? C.blue : C.border}`,
          borderRadius: '8px',
          background: addHover ? C.blueLt : C.surface,
          fontFamily: F.inter,
          fontSize: '14px',
          fontWeight: 500,
          color: addHover ? C.blue : C.text2,
          cursor: 'pointer',
          transition: 'all 0.12s',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        + Добавить интеграцию
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB: СИСТЕМА
═══════════════════════════════════════════════════════════════════════════ */

function SystemTab() {
  const [cacheHover, setCacheHover] = useState(false);
  const [logsHover, setLogsHover] = useState(false);
  const [maintenanceHover, setMaintenanceHover] = useState(false);

  return (
    <div>
      {/* System Info */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: C.text1,
          margin: '0 0 16px',
        }}>
          Информация о системе
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          gap: '16px 24px',
        }}>
          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text3 }}>
            Версия
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
            1.0.0
          </div>

          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text3 }}>
            Среда
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
            Production
          </div>

          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text3 }}>
            База данных
          </div>
          <div>
            <span style={{
              fontFamily: F.inter,
              fontSize: '12px',
              fontWeight: 500,
              padding: '3px 10px',
              borderRadius: '10px',
              background: C.successBg,
              color: '#15803D',
            }}>
              Подключена
            </span>
          </div>

          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text3 }}>
            Redis
          </div>
          <div>
            <span style={{
              fontFamily: F.inter,
              fontSize: '12px',
              fontWeight: 500,
              padding: '3px 10px',
              borderRadius: '10px',
              background: C.successBg,
              color: '#15803D',
            }}>
              Подключён
            </span>
          </div>

          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text3 }}>
            Последний деплой
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', color: C.text2 }}>
            12.04.2026 03:00
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: C.border, margin: '32px 0' }} />

      {/* Maintenance */}
      <div>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: C.text1,
          margin: '0 0 16px',
        }}>
          Обслуживание
        </h3>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onMouseEnter={() => setCacheHover(true)}
            onMouseLeave={() => setCacheHover(false)}
            style={{
              height: '40px',
              padding: '0 20px',
              border: `1px solid ${cacheHover ? C.blue : C.border}`,
              borderRadius: '8px',
              background: cacheHover ? C.blueLt : C.surface,
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: cacheHover ? C.blue : C.text2,
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            Очистить кеш
          </button>

          <button
            onMouseEnter={() => setLogsHover(true)}
            onMouseLeave={() => setLogsHover(false)}
            style={{
              height: '40px',
              padding: '0 20px',
              border: `1px solid ${logsHover ? C.blue : C.border}`,
              borderRadius: '8px',
              background: logsHover ? C.blueLt : C.surface,
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: logsHover ? C.blue : C.text2,
              cursor: 'pointer',
              transition: 'all 0.12s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Download size={16} strokeWidth={1.75} />
            Скачать логи
          </button>

          <button
            onMouseEnter={() => setMaintenanceHover(true)}
            onMouseLeave={() => setMaintenanceHover(false)}
            style={{
              height: '40px',
              padding: '0 20px',
              border: `1px solid ${maintenanceHover ? C.error : C.border}`,
              borderRadius: '8px',
              background: maintenanceHover ? C.errorBg : C.surface,
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: maintenanceHover ? C.error : C.text2,
              cursor: 'pointer',
              transition: 'all 0.12s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AlertTriangle size={16} strokeWidth={1.75} />
            Режим обслуживания
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOGGLE SWITCH
═══════════════════════════════════════════════════════════════════════════ */

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: checked ? C.blue : '#D1D5DB',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: C.surface,
        position: 'absolute',
        top: '3px',
        left: checked ? '23px' : '3px',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════════════════ */

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '40px',
  padding: '0 12px',
  border: `1px solid ${C.inputBorder}`,
  borderRadius: '8px',
  background: C.surface,
  fontFamily: F.inter,
  fontSize: '14px',
  color: C.text1,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: F.inter,
  fontSize: '13px',
  fontWeight: 500,
  color: C.text2,
  marginBottom: '8px',
};

const checkboxStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  accentColor: C.blue,
  cursor: 'pointer',
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function SettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.pageBg }}>
      <BankAdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: C.surface, borderBottom: `1px solid ${C.border}`,
          height: '60px', display: 'flex', alignItems: 'center',
          padding: '0 32px', flexShrink: 0,
        }}>
          <div style={{ flex: 1 }} />
          <NavbarUserSection darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />
        </div>

        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={C.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3 }}>Настройки</span>
          </div>

          {/* Top Bar */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: C.text1, margin: 0, lineHeight: 1.2 }}>
              Настройки
            </h1>
            <p style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, margin: '4px 0 0' }}>
              Настройки платформы и профиля
            </p>
          </div>

          {/* Layout: Tabs + Content */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

            <div style={{
              flex: 1,
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: '12px',
              padding: '24px',
            }}>
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'security' && <SecurityTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
              {activeTab === 'kpi-defaults' && <KPIDefaultsTab />}
              {activeTab === 'integrations' && <IntegrationsTab />}
              {activeTab === 'system' && <SystemTab />}
            </div>
          </div>

          <div style={{ height: '48px' }} />
        </div>
      </div>
    </div>
  );
}
