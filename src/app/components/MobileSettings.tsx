import React, { useState } from 'react';
import {
  ChevronRight, KeyRound, Bell, Globe, Sun, Moon, Smartphone,
  HelpCircle, Info, FileText, LogOut, Check, Building2, FileSignature,
  Target, Plug, BellRing, Megaphone, ListChecks, Download, Share, Plus,
  CheckCircle2,
} from 'lucide-react';
import { F, theme } from './ds/tokens';
import { useThemePref, type ThemePref } from './useDarkMode';
import { useInstallPrompt } from './useInstallPrompt';

type T = ReturnType<typeof theme>;

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE — Settings (shared between Bank Admin and Org Admin)
═══════════════════════════════════════════════════════════════════════════ */

export type SettingsRole = 'bank' | 'org';

type RowProps = {
  leftIcon?: React.ElementType;
  iconTintBg?: string;
  iconTintFg?: string;
  primary: string;
  secondary?: React.ReactNode;
  rightValue?: string;
  rightBadge?: { label: string; variant: 'success' | 'warning' | 'error' | 'neutral' };
  isLast?: boolean;
  onTap?: () => void;
  t: T;
  dark: boolean;
};

function SettingsRow({
  leftIcon: Icon,
  iconTintBg,
  iconTintFg,
  primary, secondary, rightValue, rightBadge, isLast, onTap, t, dark,
}: RowProps) {
  const badgePalette = dark
    ? {
        success: { bg: 'rgba(52,211,153,0.15)',  fg: '#34D399' },
        warning: { bg: 'rgba(251,191,36,0.15)',  fg: '#FBBF24' },
        error:   { bg: 'rgba(248,113,113,0.15)', fg: '#F87171' },
        neutral: { bg: 'rgba(160,165,184,0.15)', fg: '#A0A5B8' },
      }
    : {
        success: { bg: '#F0FDF4', fg: '#15803D' },
        warning: { bg: '#FFFBEB', fg: '#B45309' },
        error:   { bg: '#FEF2F2', fg: '#DC2626' },
        neutral: { bg: '#F3F4F6', fg: '#4B5563' },
      };
  const badge = rightBadge ? badgePalette[rightBadge.variant] : null;

  return (
    <div
      onClick={onTap}
      style={{
        minHeight: 56, display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        borderBottom: isLast ? 'none' : `1px solid ${t.border}`,
        cursor: onTap ? 'pointer' : 'default',
      }}
    >
      {Icon && (
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: iconTintBg ?? t.blueLt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={18} color={iconTintFg ?? t.blue} strokeWidth={2} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: F.inter, fontSize: 15, color: t.text1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {primary}
        </div>
        {secondary && (
          <div style={{
            fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {secondary}
          </div>
        )}
      </div>
      {rightValue && (
        <span style={{ fontFamily: F.inter, fontSize: 14, color: t.text3, flexShrink: 0 }}>
          {rightValue}
        </span>
      )}
      {badge && rightBadge && (
        <span style={{
          fontFamily: F.inter, fontSize: 11, fontWeight: 500,
          padding: '3px 8px', borderRadius: 8,
          background: badge.bg, color: badge.fg,
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {rightBadge.label}
        </span>
      )}
      {onTap && (
        <ChevronRight size={18} color={t.textDisabled} strokeWidth={1.75} style={{ flexShrink: 0 }} />
      )}
    </div>
  );
}

function SectionHeader({ text, t }: { text: string; t: T }) {
  return (
    <div style={{
      fontFamily: F.inter, fontSize: 11, fontWeight: 600,
      color: t.text3, textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '20px 20px 8px',
    }}>
      {text}
    </div>
  );
}

function SectionCard({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <div style={{
      margin: '0 16px',
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

/* ─── Theme bottom sheet ──────────────────────────────────────────────── */

function ThemeSheet({
  open, onClose, pref, onChange, t, dark,
}: {
  open: boolean;
  onClose: () => void;
  pref: ThemePref;
  onChange: (p: ThemePref) => void;
  t: T;
  dark: boolean;
}) {
  if (!open) return null;

  const options: Array<{ id: ThemePref; label: string; icon: React.ElementType; sub: string }> = [
    { id: 'light',  label: 'Светлая',   icon: Sun,        sub: 'Всегда светлая тема' },
    { id: 'dark',   label: 'Тёмная',    icon: Moon,       sub: 'Всегда тёмная тема' },
    { id: 'system', label: 'Системная', icon: Smartphone, sub: 'Как в настройках устройства' },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.4)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: t.surface,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          boxShadow: dark ? '0 -4px 24px rgba(0,0,0,0.6)' : '0 -4px 24px rgba(17,24,39,0.15)',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: t.inputBorder }} />
        </div>
        <div style={{
          padding: '4px 20px 12px',
          fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1,
        }}>
          Тема
        </div>
        {options.map((opt, i) => {
          const Icon = opt.icon;
          const selected = opt.id === pref;
          return (
            <div
              key={opt.id}
              onClick={() => { onChange(opt.id); onClose(); }}
              style={{
                minHeight: 56, display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 20px',
                borderBottom: i < options.length - 1 ? `1px solid ${t.border}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: t.blueLt,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={18} color={t.blue} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.inter, fontSize: 16, fontWeight: 500, color: t.text1 }}>
                  {opt.label}
                </div>
                <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 2 }}>
                  {opt.sub}
                </div>
              </div>
              {selected && <Check size={22} color={t.blue} strokeWidth={2.5} />}
            </div>
          );
        })}
        <div style={{ padding: '12px 16px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', height: 48, borderRadius: 12,
              background: dark ? 'rgba(160,165,184,0.12)' : '#F3F4F6',
              border: 'none',
              fontFamily: F.inter, fontSize: 16, fontWeight: 600, color: t.text2,
              cursor: 'pointer',
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── iOS install-instructions bottom sheet ──────────────────────────── */

function IosInstallSheet({
  open, onClose, t, dark,
}: { open: boolean; onClose: () => void; t: T; dark: boolean }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: t.surface,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          boxShadow: dark ? '0 -4px 24px rgba(0,0,0,0.6)' : '0 -4px 24px rgba(17,24,39,0.15)',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: t.inputBorder }} />
        </div>
        <div style={{ padding: '4px 20px 8px', fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1 }}>
          Установка на iOS
        </div>
        <div style={{ padding: '0 20px 8px', fontFamily: F.inter, fontSize: 14, color: t.text3, lineHeight: 1.5 }}>
          Safari не поддерживает автоматическую установку. Выполните следующие шаги:
        </div>
        <div style={{ padding: '4px 0' }}>
          {[
            { n: 1, icon: Share, text: 'Нажмите кнопку «Поделиться» в нижней панели Safari' },
            { n: 2, icon: Plus,  text: 'Выберите пункт «На экран «Домой»» в списке' },
            { n: 3, icon: Check, text: 'Нажмите «Добавить» в правом верхнем углу' },
          ].map(step => {
            const Icon = step.icon;
            return (
              <div key={step.n} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 20px',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: t.blueLt,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontFamily: F.inter, fontSize: 13, fontWeight: 700, color: t.blue,
                }}>
                  {step.n}
                </div>
                <Icon size={18} color={t.text3} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontFamily: F.inter, fontSize: 14, color: t.text1, lineHeight: 1.4 }}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '12px 16px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%', height: 48, borderRadius: 12,
              background: dark ? 'rgba(160,165,184,0.12)' : '#F3F4F6',
              border: 'none',
              fontFamily: F.inter, fontSize: 16, fontWeight: 600, color: t.text2,
              cursor: 'pointer',
            }}
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────── */

export function MobileSettings({
  role, t, dark, navigate,
}: {
  role: SettingsRole;
  t: T;
  dark: boolean;
  navigate: (p: string) => void;
}) {
  const [themePref, , setPref] = useThemePref();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [iosHelpOpen, setIosHelpOpen] = useState(false);
  const { canInstall, isInstalled, isIos, promptInstall } = useInstallPrompt();

  const handleInstall = async () => {
    if (canInstall) {
      await promptInstall();
    } else if (isIos) {
      setIosHelpOpen(true);
    }
  };

  const profile = role === 'bank'
    ? { name: 'Админ Камолов', email: 'admin@ubank.uz', initials: 'АК' }
    : { name: 'Рустам Алиев',  email: 'rustam@mysafar.uz', initials: 'РА' };

  const themeLabel: Record<ThemePref, string> = {
    light: 'Светлая',
    dark: 'Тёмная',
    system: 'Системная',
  };

  const orangeTint = {
    bg: dark ? 'rgba(251,191,36,0.15)' : '#FFFBEB',
    fg: dark ? '#FBBF24' : '#D97706',
  };
  const greenTint = {
    bg: dark ? 'rgba(52,211,153,0.15)' : '#F0FDF4',
    fg: dark ? '#34D399' : '#16A34A',
  };
  const violetTint = {
    bg: dark ? 'rgba(167,139,250,0.15)' : '#F3F0FF',
    fg: dark ? '#A78BFA' : '#7C3AED',
  };
  const grayTint = {
    bg: dark ? 'rgba(160,165,184,0.15)' : '#F3F4F6',
    fg: dark ? '#A0A5B8' : '#4B5563',
  };

  return (
    <>
      {/* Sticky header — "Настройки" */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        height: 52, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: t.surface, borderBottom: `1px solid ${t.border}`,
      }}>
        <span style={{ fontFamily: F.dm, fontSize: 17, fontWeight: 600, color: t.text1 }}>
          Настройки
        </span>
      </div>

      <div style={{ padding: '4px 0 96px', boxSizing: 'border-box', width: '100%' }}>
        {/* ПРОФИЛЬ */}
        <SectionHeader text="Профиль" t={t} />
        <SectionCard t={t}>
          <div
            onClick={() => navigate(role === 'bank' ? '/settings' : '/org-settings')}
            style={{
              minHeight: 72, display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', cursor: 'pointer',
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: t.blueLt, border: `1.5px solid ${t.blue}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: F.inter, fontSize: 14, fontWeight: 700, color: t.blue }}>
                {profile.initials}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.text1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {profile.name}
              </div>
              <div style={{
                fontFamily: F.inter, fontSize: 13, color: t.text3, marginTop: 2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {profile.email}
              </div>
            </div>
            <ChevronRight size={18} color={t.textDisabled} strokeWidth={1.75} />
          </div>
        </SectionCard>

        {/* ПРИЛОЖЕНИЕ — PWA install (always visible, state-dependent) */}
        <SectionHeader text="Приложение" t={t} />
        <SectionCard t={t}>
          {isInstalled ? (
            <SettingsRow
              leftIcon={CheckCircle2}
              iconTintBg={greenTint.bg}
              iconTintFg={greenTint.fg}
              primary="Установлено"
              secondary="Moment KPI запущен как приложение"
              isLast
              t={t}
              dark={dark}
            />
          ) : canInstall ? (
            <div
              onClick={handleInstall}
              style={{
                minHeight: 56, display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', cursor: 'pointer',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: t.blueLt,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Download size={18} color={t.blue} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.blue }}>
                  Установить приложение
                </div>
                <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 2 }}>
                  Добавить на главный экран
                </div>
              </div>
              <ChevronRight size={18} color={t.textDisabled} strokeWidth={1.75} />
            </div>
          ) : isIos ? (
            <div
              onClick={handleInstall}
              style={{
                minHeight: 56, display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', cursor: 'pointer',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: t.blueLt,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Share size={18} color={t.blue} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.inter, fontSize: 15, fontWeight: 500, color: t.blue }}>
                  Установить приложение
                </div>
                <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text3, marginTop: 2 }}>
                  Инструкция для Safari
                </div>
              </div>
              <ChevronRight size={18} color={t.textDisabled} strokeWidth={1.75} />
            </div>
          ) : (
            <div
              style={{
                minHeight: 56, display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: grayTint.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Download size={18} color={grayTint.fg} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.inter, fontSize: 15, color: t.text2 }}>
                  Установить приложение
                </div>
                <div style={{ fontFamily: F.inter, fontSize: 12, color: t.text4, marginTop: 2, lineHeight: 1.4 }}>
                  Ожидание браузера… Откройте в Chrome/Edge или Safari на телефоне
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* АККАУНТ */}
        <SectionHeader text="Аккаунт" t={t} />
        <SectionCard t={t}>
          <SettingsRow
            leftIcon={KeyRound}
            iconTintBg={t.blueLt}
            iconTintFg={t.blue}
            primary="Безопасность"
            onTap={() => {}}
            t={t}
            dark={dark}
          />
          <SettingsRow
            leftIcon={Bell}
            iconTintBg={orangeTint.bg}
            iconTintFg={orangeTint.fg}
            primary="Уведомления"
            onTap={() => navigate('/notifications')}
            t={t}
            dark={dark}
          />
          <SettingsRow
            leftIcon={Globe}
            iconTintBg={greenTint.bg}
            iconTintFg={greenTint.fg}
            primary="Язык"
            rightValue="Русский"
            isLast
            onTap={() => {}}
            t={t}
            dark={dark}
          />
        </SectionCard>

        {/* ОРГАНИЗАЦИЯ — Org admin only */}
        {role === 'org' && (
          <>
            <SectionHeader text="Организация" t={t} />
            <SectionCard t={t}>
              <SettingsRow
                leftIcon={Building2}
                iconTintBg={t.blueLt}
                iconTintFg={t.blue}
                primary="Данные организации"
                onTap={() => {}}
                t={t}
                dark={dark}
              />
              <SettingsRow
                leftIcon={FileSignature}
                iconTintBg={violetTint.bg}
                iconTintFg={violetTint.fg}
                primary="Договор"
                isLast
                onTap={() => {}}
                t={t}
                dark={dark}
              />
            </SectionCard>
          </>
        )}

        {/* KPI ПО УМОЛЧАНИЮ — Bank admin only */}
        {role === 'bank' && (
          <>
            <SectionHeader text="KPI по умолчанию" t={t} />
            <SectionCard t={t}>
              <SettingsRow
                leftIcon={Target}
                iconTintBg={t.blueLt}
                iconTintFg={t.blue}
                primary="Шаблоны KPI"
                isLast
                onTap={() => navigate('/kpi-config')}
                t={t}
                dark={dark}
              />
            </SectionCard>
          </>
        )}

        {/* ИНТЕГРАЦИИ — Bank admin only */}
        {role === 'bank' && (
          <>
            <SectionHeader text="Интеграции" t={t} />
            <SectionCard t={t}>
              <SettingsRow
                leftIcon={Plug}
                iconTintBg={greenTint.bg}
                iconTintFg={greenTint.fg}
                primary="UCOIN Wallet"
                rightBadge={{ label: 'Подключено', variant: 'success' }}
                onTap={() => {}}
                t={t}
                dark={dark}
              />
              <SettingsRow
                leftIcon={Plug}
                iconTintBg={t.blueLt}
                iconTintFg={t.blue}
                primary="VISA API"
                rightBadge={{ label: 'Подключено', variant: 'success' }}
                onTap={() => {}}
                t={t}
                dark={dark}
              />
              <SettingsRow
                leftIcon={Plug}
                iconTintBg={orangeTint.bg}
                iconTintFg={orangeTint.fg}
                primary="SMS-шлюз"
                rightBadge={{ label: 'Ошибка', variant: 'error' }}
                isLast
                onTap={() => {}}
                t={t}
                dark={dark}
              />
            </SectionCard>
          </>
        )}

        {/* СИСТЕМА УВЕДОМЛЕНИЙ — Bank admin only */}
        {role === 'bank' && (
          <>
            <SectionHeader text="Система уведомлений" t={t} />
            <SectionCard t={t}>
              <SettingsRow
                leftIcon={BellRing}
                iconTintBg={t.blueLt}
                iconTintFg={t.blue}
                primary="Правила уведомлений"
                onTap={() => navigate('/notification-rules')}
                t={t}
                dark={dark}
              />
              <SettingsRow
                leftIcon={Megaphone}
                iconTintBg={violetTint.bg}
                iconTintFg={violetTint.fg}
                primary="Объявления"
                onTap={() => navigate('/announcements')}
                t={t}
                dark={dark}
              />
              <SettingsRow
                leftIcon={ListChecks}
                iconTintBg={grayTint.bg}
                iconTintFg={grayTint.fg}
                primary="Лог доставки"
                isLast
                onTap={() => navigate('/notification-log')}
                t={t}
                dark={dark}
              />
            </SectionCard>
          </>
        )}

        {/* ВНЕШНИЙ ВИД */}
        <SectionHeader text="Внешний вид" t={t} />
        <SectionCard t={t}>
          <SettingsRow
            leftIcon={themePref === 'dark' ? Moon : themePref === 'system' ? Smartphone : Sun}
            iconTintBg={violetTint.bg}
            iconTintFg={violetTint.fg}
            primary="Тема"
            rightValue={themeLabel[themePref]}
            isLast
            onTap={() => setSheetOpen(true)}
            t={t}
            dark={dark}
          />
        </SectionCard>

        {/* ПОДДЕРЖКА */}
        <SectionHeader text="Поддержка" t={t} />
        <SectionCard t={t}>
          <SettingsRow
            leftIcon={HelpCircle}
            iconTintBg={t.blueLt}
            iconTintFg={t.blue}
            primary="Помощь"
            onTap={() => {}}
            t={t}
            dark={dark}
          />
          <SettingsRow
            leftIcon={Info}
            iconTintBg={grayTint.bg}
            iconTintFg={grayTint.fg}
            primary="О приложении"
            onTap={() => {}}
            t={t}
            dark={dark}
          />
          <SettingsRow
            leftIcon={FileText}
            iconTintBg={grayTint.bg}
            iconTintFg={grayTint.fg}
            primary="Условия использования"
            isLast
            onTap={() => {}}
            t={t}
            dark={dark}
          />
        </SectionCard>

        {/* Выйти */}
        <div style={{ padding: '28px 16px 0' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%', height: 48, borderRadius: 12,
              border: 'none', background: 'transparent',
              fontFamily: F.inter, fontSize: 15, fontWeight: 600, color: t.error,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <LogOut size={18} color={t.error} strokeWidth={2} />
            Выйти
          </button>
        </div>

        {/* Version */}
        <div style={{
          textAlign: 'center', paddingTop: 12,
          fontFamily: F.inter, fontSize: 12, color: t.text4,
        }}>
          v1.0.0
        </div>
      </div>

      {/* Theme sheet */}
      <ThemeSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        pref={themePref}
        onChange={setPref}
        t={t}
        dark={dark}
      />

      {/* iOS install instructions */}
      <IosInstallSheet
        open={iosHelpOpen}
        onClose={() => setIosHelpOpen(false)}
        t={t}
        dark={dark}
      />
    </>
  );
}
