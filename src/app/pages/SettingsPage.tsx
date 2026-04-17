import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, Download, AlertTriangle, X,
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { F, theme } from '../components/ds/tokens';
import { useDarkMode, useThemePref, type ThemePref } from '../components/useDarkMode';
import { useIsMobile } from '../components/useIsMobile';
import { MobileSettings } from '../components/MobileSettings';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router';

type T = ReturnType<typeof theme>;

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
   TAB NAV
═══════════════════════════════════════════════════════════════════════════ */

function TabNav({
  activeTab, onTabChange, t,
}: { activeTab: TabId; onTabChange: (tab: TabId) => void; t: T }) {
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);

  return (
    <div style={{
      width: '200px',
      background: t.surface,
      border: `1px solid ${t.border}`,
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
              position: 'relative',
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              border: 'none',
              borderRadius: '8px',
              background: isActive ? t.blueLt : isHovered ? t.tableHover : 'transparent',
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: isActive ? 500 : 400,
              color: isActive ? t.blue : t.text2,
              cursor: 'pointer',
              transition: 'all 0.12s',
              display: 'block',
              marginBottom: '2px',
              boxShadow: isActive
                ? `inset 2px 0 0 0 ${t.blue}`
                : undefined,
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

function ProfileTab({ t, dark }: { t: T; dark: boolean }) {
  const [fullName, setFullName] = useState('Админ Камолов');
  const [phone, setPhone] = useState('+998 90 100 00 01');
  const [email, setEmail] = useState('admin@ubank.uz');
  const [language, setLanguage] = useState('Русский');
  const [themePref, , setThemePref] = useThemePref();

  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  const input = inputStyle(t);
  const label = labelStyle(t);

  return (
    <div>
      {/* Personal Data */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: t.text1,
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
            <label style={label}>
              ФИО
            </label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={input}
            />
          </div>

          <div>
            <label style={label}>
              Телефон
            </label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ ...input, fontFamily: F.mono }}
            />
          </div>

          <div>
            <label style={label}>
              Email
            </label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={input}
            />
          </div>

          <div>
            <label style={label}>
              Язык интерфейса
            </label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={input}
            >
              <option>Русский</option>
              <option>O'zbek</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: t.border, margin: '32px 0' }} />

      {/* Theme */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm, fontSize: '16px', fontWeight: 600,
          color: t.text1, margin: '0 0 16px',
        }}>
          Тема оформления
        </h3>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {(['light', 'dark', 'system'] as const).map(v => (
            <ThemeRadioCard
              key={v}
              value={v}
              selected={themePref === v}
              onSelect={() => setThemePref(v)}
              t={t}
              dark={dark}
            />
          ))}
        </div>

        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: t.text3,
          marginTop: '10px',
        }}>
          {themePref === 'system'
            ? 'Определяется настройками ОС'
            : <>Текущая: <span style={{ color: t.text1, fontWeight: 500 }}>{themePref === 'dark' ? 'Тёмная' : 'Светлая'}</span></>}
        </div>

        {/* Dev reference strip */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '8px',
          marginTop: '14px', padding: '10px 12px',
          background: t.tableHeaderBg, border: `1px solid ${t.border}`, borderRadius: '8px',
        }}>
          <div style={{
            fontFamily: F.mono, fontSize: '10px', fontWeight: 700,
            padding: '2px 6px', borderRadius: '4px',
            background: t.blueLt, color: t.blue,
            flexShrink: 0, marginTop: '1px',
          }}>
            DEV
          </div>
          <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, lineHeight: 1.5 }}>
            Theme preference stored in localStorage key{' '}
            <code style={{
              fontFamily: F.mono, fontSize: '11px',
              padding: '1px 6px', borderRadius: '4px',
              background: t.surface, border: `1px solid ${t.border}`,
              color: t.text1,
            }}>moment-kpi-theme</code>. Values:{' '}
            <code style={codeInline(t)}>'light'</code>,{' '}
            <code style={codeInline(t)}>'dark'</code>,{' '}
            <code style={codeInline(t)}>'system'</code>. Applied on page load before first render to prevent flash.
          </div>
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
            border: 'none',
            borderRadius: '8px',
            background: saveHover ? t.blueHover : t.blue,
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
            border: `1px solid ${cancelHover ? t.blue : t.border}`,
            borderRadius: '8px',
            background: cancelHover ? t.blueLt : t.surface,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: cancelHover ? t.blue : t.text2,
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

function SecurityTab({ t, dark }: { t: T; dark: boolean }) {
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

  const input = inputStyle(t);
  const label = labelStyle(t);
  const successText = dark ? t.success : '#15803D';

  return (
    <div>
      {/* Change Password */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: t.text1,
          margin: '0 0 16px',
        }}>
          Смена пароля
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
          <div>
            <label style={label}>Текущий пароль</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              style={input}
            />
          </div>
          <div>
            <label style={label}>Новый пароль</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={input}
            />
          </div>
          <div>
            <label style={label}>Подтвердите пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              style={input}
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
            border: 'none',
            borderRadius: '8px',
            background: updatePwHover ? t.blueHover : t.blue,
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

      <div style={{ height: '1px', background: t.border, margin: '32px 0' }} />

      {/* 2FA */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: t.text1,
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
            <div style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2, marginBottom: '4px' }}>
              2FA через SMS
            </div>
            <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3 }}>
              Код будет отправлен на +998 90 100 00 01
            </div>
          </div>
          <ToggleSwitch checked={twoFAEnabled} onChange={setTwoFAEnabled} t={t} dark={dark} />
        </div>
      </div>

      <div style={{ height: '1px', background: t.border, margin: '32px 0' }} />

      {/* Active Sessions */}
      <div>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: t.text1,
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
                border: `1px solid ${t.border}`,
                borderRadius: '10px',
                background: t.tableHeaderBg,
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text2 }}>
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
                    background: t.successBg,
                    color: successText,
                  }}>
                    Текущая
                  </span>
                )}
                <button
                  style={{
                    padding: '6px 12px',
                    border: `1px solid ${t.border}`,
                    borderRadius: '6px',
                    background: t.errorBg,
                    fontFamily: F.inter,
                    fontSize: '13px',
                    color: t.error,
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
            border: `1px solid ${endAllHover ? t.error : t.border}`,
            borderRadius: '8px',
            background: endAllHover ? t.errorBg : t.surface,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: endAllHover ? t.error : t.text2,
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

function NotificationsTab({ t, dark }: { t: T; dark: boolean }) {
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

  const checkbox = checkboxStyle(t);

  return (
    <div>
      {/* Email Notifications */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: t.text1,
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
              style={checkbox}
            />
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>
              Новая организация добавлена
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={emailNotifs.kpiComplete}
              onChange={e => setEmailNotifs({ ...emailNotifs, kpiComplete: e.target.checked })}
              style={checkbox}
            />
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>
              KPI этап выполнен (массовый)
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={emailNotifs.withdrawRequest}
              onChange={e => setEmailNotifs({ ...emailNotifs, withdrawRequest: e.target.checked })}
              style={checkbox}
            />
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>
              Запрос на вывод средств
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={emailNotifs.dailyReport}
              onChange={e => setEmailNotifs({ ...emailNotifs, dailyReport: e.target.checked })}
              style={checkbox}
            />
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>
              Ежедневный отчёт
            </span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={emailNotifs.weeklyReport}
              onChange={e => setEmailNotifs({ ...emailNotifs, weeklyReport: e.target.checked })}
              style={checkbox}
            />
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>
              Еженедельная сводка
            </span>
          </label>
        </div>
      </div>

      <div style={{ height: '1px', background: t.divider, margin: '32px 0' }} />

      {/* Push Notifications */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: t.text1,
          margin: '0 0 16px',
        }}>
          Push уведомления
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: `1px solid ${t.divider}` }}>
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>
              KPI 3 выполнен
            </span>
            <ToggleSwitch
              checked={pushNotifs.kpi3}
              onChange={v => setPushNotifs({ ...pushNotifs, kpi3: v })}
              t={t}
              dark={dark}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: `1px solid ${t.divider}` }}>
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>
              Новый импорт карт
            </span>
            <ToggleSwitch
              checked={pushNotifs.newImport}
              onChange={v => setPushNotifs({ ...pushNotifs, newImport: v })}
              t={t}
              dark={dark}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: `1px solid ${t.divider}` }}>
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>
              Ошибки системы
            </span>
            <ToggleSwitch
              checked={pushNotifs.systemErrors}
              onChange={v => setPushNotifs({ ...pushNotifs, systemErrors: v })}
              t={t}
              dark={dark}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F.inter, fontSize: '14px', color: t.text2 }}>
              Вход с нового устройства
            </span>
            <ToggleSwitch
              checked={pushNotifs.newDevice}
              onChange={v => setPushNotifs({ ...pushNotifs, newDevice: v })}
              t={t}
              dark={dark}
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
          border: 'none',
          borderRadius: '8px',
          background: saveHover ? t.blueHover : t.blue,
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

function KPIDefaultsTab({ t }: { t: T }) {
  const [kpiDays, setKpiDays] = useState('30');
  const [maxSteps, setMaxSteps] = useState('3');

  const [saveHover, setSaveHover] = useState(false);
  const [resetHover, setResetHover] = useState(false);

  const input = inputStyle(t);
  const label = labelStyle(t);

  return (
    <div>
      <h3 style={{
        fontFamily: F.dm,
        fontSize: '16px',
        fontWeight: 600,
        color: t.text1,
        margin: '0 0 8px',
      }}>
        Шаблон KPI для новых партий
      </h3>
      <p style={{
        fontFamily: F.inter,
        fontSize: '13px',
        color: t.text3,
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
              border: `1px solid ${t.border}`,
              borderRadius: '10px',
              background: t.surface,
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: t.blueTint,
              border: `2px solid ${t.blue}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: F.inter, fontSize: '12px', fontWeight: 700, color: t.blue }}>
                {item.step}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text2 }}>
                {item.action}
              </div>
              <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, marginTop: '2px' }}>
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
          <label style={label}>Срок выполнения KPI (дней)</label>
          <input
            type="number"
            value={kpiDays}
            onChange={e => setKpiDays(e.target.value)}
            style={input}
          />
        </div>
        <div>
          <label style={label}>Максимум этапов</label>
          <input
            type="number"
            value={maxSteps}
            onChange={e => setMaxSteps(e.target.value)}
            style={input}
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
            border: 'none',
            borderRadius: '8px',
            background: saveHover ? t.blueHover : t.blue,
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
            border: `1px solid ${resetHover ? t.blue : t.border}`,
            borderRadius: '8px',
            background: resetHover ? t.blueLt : t.surface,
            fontFamily: F.inter,
            fontSize: '14px',
            fontWeight: 500,
            color: resetHover ? t.blue : t.text2,
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

function IntegrationsTab({ t, dark }: { t: T; dark: boolean }) {
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
  const successText = dark ? t.success : '#15803D';

  return (
    <div>
      <h3 style={{
        fontFamily: F.dm,
        fontSize: '16px',
        fontWeight: 600,
        color: t.text1,
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
              border: `1px solid ${t.border}`,
              borderRadius: '12px',
              background: t.surface,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: t.tableHeaderBg,
                border: `1px solid ${t.blue}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: F.dm, fontSize: '13px', fontWeight: 700, color: t.blue }}>
                  {integration.icon}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.dm, fontSize: '14px', fontWeight: 600, color: t.text1 }}>
                  {integration.name}
                </div>
                <div style={{ fontFamily: F.inter, fontSize: '12px', color: t.text3, marginTop: '2px' }}>
                  {integration.description}
                </div>
              </div>
              <span style={{
                fontFamily: F.inter,
                fontSize: '12px',
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: '10px',
                background: t.successBg,
                color: successText,
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
                t={t}
                dark={dark}
              />
            </div>
            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: t.tableHeaderBg,
              border: `1px solid ${t.border}`,
            }}>
              <div style={{ fontFamily: F.mono, fontSize: '11px', color: t.text3, marginBottom: '6px' }}>
                {integration.webhook}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontFamily: F.inter, fontSize: '11px', color: t.text4 }}>
                  Последний вызов: {integration.lastCall}
                </span>
                <span style={{ fontFamily: F.inter, fontSize: '11px', color: successText }}>
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
          border: `1px solid ${addHover ? t.blue : t.border}`,
          borderRadius: '8px',
          background: addHover ? t.blueLt : t.surface,
          fontFamily: F.inter,
          fontSize: '14px',
          fontWeight: 500,
          color: addHover ? t.blue : t.text2,
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

function SystemTab({ t, dark }: { t: T; dark: boolean }) {
  const [cacheHover, setCacheHover] = useState(false);
  const [logsHover, setLogsHover] = useState(false);
  const [maintenanceHover, setMaintenanceHover] = useState(false);
  const successText = dark ? t.success : '#15803D';

  return (
    <div>
      {/* System Info */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: t.text1,
          margin: '0 0 16px',
        }}>
          Информация о системе
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          gap: '0',
        }}>
          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text3, padding: '12px 0', borderBottom: `1px solid ${t.divider}` }}>
            Версия
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', color: t.text1, padding: '12px 0', borderBottom: `1px solid ${t.divider}` }}>
            1.0.0
          </div>

          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text3, padding: '12px 0', borderBottom: `1px solid ${t.divider}` }}>
            Среда
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', color: t.text1, padding: '12px 0', borderBottom: `1px solid ${t.divider}` }}>
            Production
          </div>

          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text3, padding: '12px 0', borderBottom: `1px solid ${t.divider}` }}>
            База данных
          </div>
          <div style={{ padding: '12px 0', borderBottom: `1px solid ${t.divider}` }}>
            <span style={{
              fontFamily: F.inter,
              fontSize: '12px',
              fontWeight: 500,
              padding: '3px 10px',
              borderRadius: '10px',
              background: t.successBg,
              color: successText,
            }}>
              Подключена
            </span>
          </div>

          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text3, padding: '12px 0', borderBottom: `1px solid ${t.divider}` }}>
            Redis
          </div>
          <div style={{ padding: '12px 0', borderBottom: `1px solid ${t.divider}` }}>
            <span style={{
              fontFamily: F.inter,
              fontSize: '12px',
              fontWeight: 500,
              padding: '3px 10px',
              borderRadius: '10px',
              background: t.successBg,
              color: successText,
            }}>
              Подключён
            </span>
          </div>

          <div style={{ fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: t.text3, padding: '12px 0' }}>
            Последний деплой
          </div>
          <div style={{ fontFamily: F.mono, fontSize: '13px', color: t.text1, padding: '12px 0' }}>
            12.04.2026 03:00
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: t.border, margin: '32px 0' }} />

      {/* Maintenance */}
      <div>
        <h3 style={{
          fontFamily: F.dm,
          fontSize: '16px',
          fontWeight: 600,
          color: t.text1,
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
              border: `1px solid ${cacheHover ? t.blue : t.border}`,
              borderRadius: '8px',
              background: cacheHover ? t.blueLt : t.surface,
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: cacheHover ? t.blue : t.text2,
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
              border: `1px solid ${logsHover ? t.blue : t.border}`,
              borderRadius: '8px',
              background: logsHover ? t.blueLt : t.surface,
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: logsHover ? t.blue : t.text2,
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
              border: `1px solid ${maintenanceHover ? t.error : t.border}`,
              borderRadius: '8px',
              background: maintenanceHover ? t.errorBg : t.surface,
              fontFamily: F.inter,
              fontSize: '14px',
              fontWeight: 500,
              color: maintenanceHover ? t.error : t.text2,
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

function ToggleSwitch({
  checked, onChange, t, dark,
}: { checked: boolean; onChange: (v: boolean) => void; t: T; dark: boolean }) {
  const offTrack = dark ? '#2D3148' : '#D1D5DB';
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: checked ? t.blue : offTrack,
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
        background: '#FFFFFF',
        position: 'absolute',
        top: '3px',
        left: checked ? '23px' : '3px',
        transition: 'left 0.2s',
        boxShadow: dark ? 'none' : '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STYLES (theme-aware factories)
═══════════════════════════════════════════════════════════════════════════ */

const inputStyle = (t: T): React.CSSProperties => ({
  width: '100%',
  height: '40px',
  padding: '0 12px',
  border: `1px solid ${t.inputBorder}`,
  borderRadius: '8px',
  background: t.surface,
  fontFamily: F.inter,
  fontSize: '14px',
  color: t.text1,
  outline: 'none',
  boxSizing: 'border-box',
});

const codeInline = (t: T): React.CSSProperties => ({
  fontFamily: F.mono, fontSize: '11px',
  padding: '1px 6px', borderRadius: '4px',
  background: t.surface, border: `1px solid ${t.border}`,
  color: t.text1,
});

const labelStyle = (t: T): React.CSSProperties => ({
  display: 'block',
  fontFamily: F.inter,
  fontSize: '13px',
  fontWeight: 500,
  color: t.text2,
  marginBottom: '8px',
});

const checkboxStyle = (t: T): React.CSSProperties => ({
  width: '16px',
  height: '16px',
  accentColor: t.blue,
  cursor: 'pointer',
});

/* ═══════════════════════════════════════════════════════════════════════════
   THEME RADIO CARD (profile tab)
═══════════════════════════════════════════════════════════════════════════ */

function ThemeRadioCard({
  value, selected, onSelect, t, dark,
}: {
  value: ThemePref;
  selected: boolean;
  onSelect: () => void;
  t: T;
  dark: boolean;
}) {
  const [hov, setHov] = useState(false);
  const label = value === 'light' ? 'Светлая' : value === 'dark' ? 'Тёмная' : 'Системная';

  const thumbBorderColor = selected ? t.blue : t.border;

  return (
    <label
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '10px', padding: '12px 14px',
        border: `1px solid ${selected ? t.blue : (hov ? t.text3 : t.inputBorder)}`,
        borderRadius: '10px',
        background: selected ? t.blueLt : t.surface,
        cursor: 'pointer', minWidth: '128px',
        transition: 'all 0.12s',
      }}
    >
      <div style={{
        borderRadius: '4px',
        border: `1px solid ${thumbBorderColor}`,
        padding: '2px',
        lineHeight: 0,
      }}>
        <ThemeThumbnail variant={value} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="radio"
          name="theme"
          checked={selected}
          onChange={onSelect}
          style={{
            width: '16px', height: '16px',
            accentColor: t.blue, cursor: 'pointer',
          }}
        />
        <span style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: selected ? 600 : 500,
          color: selected ? t.blue : t.text1,
        }}>
          {label}
        </span>
      </div>
    </label>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THEME THUMBNAIL (48×32 mini preview)
═══════════════════════════════════════════════════════════════════════════ */

function ThemeThumbnail({ variant }: { variant: ThemePref }) {
  if (variant === 'light') {
    return (
      <svg width="48" height="32" viewBox="0 0 48 32" style={{ display: 'block' }}>
        <rect width="48" height="32" rx="3" fill="#FFFFFF" stroke="#E5E7EB" />
        <rect x="0" y="0" width="14" height="32" fill="#F9FAFB" />
        <rect x="2" y="4"  width="10" height="2" rx="1" fill="#D1D5DB" />
        <rect x="2" y="8"  width="10" height="2" rx="1" fill="#E5E7EB" />
        <rect x="2" y="12" width="10" height="2" rx="1" fill="#E5E7EB" />
        <rect x="18" y="4" width="26" height="3" rx="1" fill="#D1D5DB" />
        <rect x="18" y="10" width="26" height="18" rx="2" fill="#F3F4F6" />
      </svg>
    );
  }
  if (variant === 'dark') {
    return (
      <svg width="48" height="32" viewBox="0 0 48 32" style={{ display: 'block' }}>
        <rect width="48" height="32" rx="3" fill="#0B1220" stroke="#1F2937" />
        <rect x="0" y="0" width="14" height="32" fill="#111827" />
        <rect x="2" y="4"  width="10" height="2" rx="1" fill="#374151" />
        <rect x="2" y="8"  width="10" height="2" rx="1" fill="#1F2937" />
        <rect x="2" y="12" width="10" height="2" rx="1" fill="#1F2937" />
        <rect x="18" y="4"  width="26" height="3"  rx="1" fill="#374151" />
        <rect x="18" y="10" width="26" height="18" rx="2" fill="#1F2937" />
      </svg>
    );
  }
  // system — diagonal split
  return (
    <svg width="48" height="32" viewBox="0 0 48 32" style={{ display: 'block' }}>
      <defs>
        <clipPath id="systemSplitLight">
          <polygon points="0,0 48,0 0,32" />
        </clipPath>
        <clipPath id="systemSplitDark">
          <polygon points="48,0 48,32 0,32" />
        </clipPath>
      </defs>
      <rect width="48" height="32" rx="3" fill="#0B1220" stroke="#1F2937" />
      {/* Light half — upper-left triangle */}
      <g clipPath="url(#systemSplitLight)">
        <rect width="48" height="32" fill="#FFFFFF" />
        <rect x="0" y="0" width="14" height="32" fill="#F9FAFB" />
        <rect x="2" y="4"  width="10" height="2" rx="1" fill="#D1D5DB" />
        <rect x="2" y="8"  width="10" height="2" rx="1" fill="#E5E7EB" />
        <rect x="18" y="4" width="26" height="3" rx="1" fill="#D1D5DB" />
      </g>
      {/* Dark half — lower-right triangle */}
      <g clipPath="url(#systemSplitDark)">
        <rect x="0" y="0" width="14" height="32" fill="#111827" />
        <rect x="2" y="12" width="10" height="2" rx="1" fill="#1F2937" />
        <rect x="18" y="10" width="26" height="18" rx="2" fill="#1F2937" />
      </g>
      <line x1="0" y1="32" x2="48" y2="0" stroke="#E5E7EB" strokeWidth="0.5" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */

export default function SettingsPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const mobile = useIsMobile();
  const t = theme(darkMode);
  const dark = darkMode;
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: t.pageBg, transition: 'background 0.2s' }}>
      <Sidebar role="bank"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Navbar darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />

        {mobile ? (
          <MobileSettings role="bank" t={t} dark={dark} navigate={navigate} />
        ) : (
        <div style={{ padding: '28px 32px', boxSizing: 'border-box', width: '100%' }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span onClick={() => navigate('/dashboard')} style={{ fontFamily: F.inter, fontSize: '13px', color: t.blue, cursor: 'pointer' }}>Главная</span>
            <ChevronRight size={13} color={t.text4} strokeWidth={1.75} />
            <span style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Настройки</span>
          </div>

          {/* Top Bar */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: F.dm, fontSize: '22px', fontWeight: 700, color: t.text1, margin: 0, lineHeight: 1.2 }}>
              Настройки
            </h1>
            <p style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, margin: '4px 0 0' }}>
              Настройки платформы и профиля
            </p>
          </div>

          {/* Layout: Tabs + Content */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} t={t} />

            <div style={{
              flex: 1,
              background: t.surface,
              border: `1px solid ${t.border}`,
              borderRadius: '12px',
              padding: '24px',
            }}>
              {activeTab === 'profile' && <ProfileTab t={t} dark={dark} />}
              {activeTab === 'security' && <SecurityTab t={t} dark={dark} />}
              {activeTab === 'notifications' && <NotificationsTab t={t} dark={dark} />}
              {activeTab === 'kpi-defaults' && <KPIDefaultsTab t={t} />}
              {activeTab === 'integrations' && <IntegrationsTab t={t} dark={dark} />}
              {activeTab === 'system' && <SystemTab t={t} dark={dark} />}
            </div>
          </div>

          <div style={{ height: '48px' }} />
        </div>
        )}
      </div>
    </div>
  );
}
