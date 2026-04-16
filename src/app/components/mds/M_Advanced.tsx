import React from 'react';
import { Check, Lock, Circle } from 'lucide-react';
import { F, theme, MDS, Pair, VariantLabel, T } from './frame';

/* ═══════════════════════════════════════════════════════════════════════════
   §18 KPI STEPPER — MOBILE  +  §19 BADGES
═══════════════════════════════════════════════════════════════════════════ */

/* ─── §18 KPI Stepper (Variant B, mobile) ───────────────────────────── */

type StepState = 'done' | 'active' | 'pending';

function StepCircle({ state, index, dark }: { state: StepState; index: number; dark: boolean }) {
  const t = theme(dark);
  if (state === 'done') {
    return (
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: t.success,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
      </div>
    );
  }
  if (state === 'active') {
    return (
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: t.blue,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: dark ? '0 0 0 3px rgba(59,130,246,0.25)' : '0 0 0 3px rgba(37,99,235,0.18)',
      }}>
        <span style={{ fontFamily: F.dm, fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{index}</span>
      </div>
    );
  }
  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      background: t.surface, border: `2px solid ${t.inputBorder}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span style={{ fontFamily: F.dm, fontSize: '15px', fontWeight: 600, color: t.text4 }}>{index}</span>
    </div>
  );
}

function StepConnector({ done, dark }: { done: boolean; dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{
      width: 2, flex: 1, minHeight: 40, marginTop: 2, marginBottom: 2,
      background: done ? t.success : t.inputBorder,
    }} />
  );
}

function StepCard({
  state, index, title, subtitle, amount, progress, reward, dark,
}: {
  state: StepState;
  index: number;
  title: string;
  subtitle: string;
  amount?: string;
  progress?: number;
  reward?: string;
  dark: boolean;
}) {
  const t = theme(dark);
  const isActive = state === 'active';
  const borderColor = isActive ? t.blue : t.border;
  const cardBg = state === 'done'
    ? (dark ? 'rgba(52,211,153,0.06)' : '#F7FDF9')
    : t.surface;

  return (
    <div style={{
      flex: 1,
      background: cardBg, border: `${isActive ? 2 : 1}px solid ${borderColor}`,
      borderRadius: 16, padding: 16,
      marginBottom: 4,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 4,
      }}>
        <div style={{ fontFamily: F.dm, fontSize: '17px', fontWeight: 600, color: t.text1 }}>
          {title}
        </div>
        {reward && (
          <div style={{
            fontFamily: F.mono, fontSize: '13px', fontWeight: 500,
            color: state === 'done' ? t.success : t.blue,
            padding: '2px 8px', borderRadius: 10,
            background: state === 'done'
              ? (dark ? 'rgba(52,211,153,0.15)' : '#F0FDF4')
              : (dark ? 'rgba(59,130,246,0.15)' : '#EFF6FF'),
          }}>
            +{reward}
          </div>
        )}
      </div>
      <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, lineHeight: 1.4 }}>
        {subtitle}
      </div>
      {amount && (
        <div style={{
          marginTop: 12, fontFamily: F.mono, fontSize: '17px', fontWeight: 500, color: t.text1,
        }}>
          {amount}
        </div>
      )}
      {typeof progress === 'number' && (
        <div style={{ marginTop: 12 }}>
          <div style={{
            height: 10, borderRadius: 5, background: t.progressTrack, overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`, height: '100%', background: t.blue, borderRadius: 5,
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 6,
            fontFamily: F.inter, fontSize: '13px', color: t.text3,
          }}>
            <span>{progress}% выполнено</span>
            <span style={{ fontFamily: F.mono, color: t.text1 }}>18 / 30 дней</span>
          </div>
        </div>
      )}
      {state === 'pending' && !progress && (
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: F.inter, fontSize: '13px', color: t.text4,
        }}>
          <Lock size={13} /> Разблокируется после {index - 1}-го этапа
        </div>
      )}
    </div>
  );
}

function KpiStepperCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.pageBg }}>
      <div style={{ height: MDS.safeTop }} />
      <div style={{
        padding: '16px 16px 8px',
      }}>
        <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, marginBottom: 4 }}>
          Карта •••• 1001 · VISA SUM
        </div>
        <h1 style={{
          fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, margin: '0 0 6px',
        }}>
          KPI прогресс
        </h1>
        <div style={{
          fontFamily: F.inter, fontSize: '15px', color: t.text3,
        }}>
          Завершено 2 из 3 этапов · заработано 35 000 UZS
        </div>
      </div>

      <div style={{ padding: '12px 16px 24px', flex: 1, overflow: 'auto' }}>
        {/* Step 1 — done */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
            <StepCircle state="done" index={1} dark={dark} />
            <StepConnector done dark={dark} />
          </div>
          <StepCard
            dark={dark} state="done" index={1}
            title="Продажа карты"
            subtitle="Карта активирована и передана клиенту"
            amount="45 000 UZS — 01.04.2026"
            reward="10 000"
          />
        </div>

        {/* Step 2 — done */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
            <StepCircle state="done" index={2} dark={dark} />
            <StepConnector done={false} dark={dark} />
          </div>
          <StepCard
            dark={dark} state="done" index={2}
            title="Первая транзакция"
            subtitle="Клиент совершил покупку в течение 30 дней"
            amount="120 000 UZS — 04.04.2026"
            reward="25 000"
          />
        </div>

        {/* Step 3 — active */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
            <StepCircle state="active" index={3} dark={dark} />
          </div>
          <StepCard
            dark={dark} state="active" index={3}
            title="Оборот 500 000 UZS"
            subtitle="Клиент должен провести транзакций на 500 000+ за 30 дней"
            progress={60}
            reward="50 000"
          />
        </div>

        {/* Summary footer */}
        <div style={{
          marginTop: 16, background: t.surface, border: `1px solid ${t.border}`,
          borderRadius: 16, padding: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3 }}>Всего заработано</div>
            <div style={{ fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: t.text1, marginTop: 2 }}>
              35 000 UZS
            </div>
          </div>
          <div style={{
            fontFamily: F.mono, fontSize: '13px', color: t.success,
            background: dark ? 'rgba(52,211,153,0.15)' : '#F0FDF4',
            padding: '4px 10px', borderRadius: 10,
          }}>
            +50 000 в ожидании
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── §19 Badges — Mobile ───────────────────────────────────────────── */

function Badge({ label, bg, fg, border }: { label: string; bg: string; fg: string; border?: string }) {
  return (
    <span style={{
      fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
      padding: '3px 10px', borderRadius: 12,
      background: bg, color: fg,
      border: border || 'none',
      display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function BadgeCol({ dark }: { dark: boolean }) {
  const t = theme(dark);
  const p = (light: { bg: string; fg: string }, darkPal: { bg: string; fg: string }) => dark ? darkPal : light;

  const success = p({ bg: '#F0FDF4', fg: '#15803D' }, { bg: 'rgba(52,211,153,0.15)',  fg: '#34D399' });
  const warning = p({ bg: '#FFFBEB', fg: '#B45309' }, { bg: 'rgba(251,191,36,0.15)',  fg: '#FBBF24' });
  const error   = p({ bg: '#FEF2F2', fg: '#DC2626' }, { bg: 'rgba(248,113,113,0.15)', fg: '#F87171' });
  const info    = p({ bg: '#ECFEFF', fg: '#0E7490' }, { bg: 'rgba(34,211,238,0.15)',  fg: '#22D3EE' });
  const blue    = p({ bg: '#EFF6FF', fg: '#1D4ED8' }, { bg: 'rgba(59,130,246,0.15)',  fg: '#3B82F6' });
  const neutral = p({ bg: '#F3F4F6', fg: '#4B5563' }, { bg: 'rgba(160,165,184,0.15)', fg: '#A0A5B8' });

  const groups: Array<{ title: string; badges: Array<{ label: string; pal: typeof success; border?: string }> }> = [
    { title: 'Success',  badges: [{ label: 'Активна', pal: success }, { label: 'Выполнено', pal: success }, { label: 'Начислено', pal: success }] },
    { title: 'Warning',  badges: [{ label: 'В процессе', pal: warning }, { label: 'На паузе', pal: warning }, { label: 'Ожидание', pal: warning }] },
    { title: 'Error',    badges: [{ label: 'Неактивна', pal: error }, { label: 'Ошибка', pal: error }, { label: 'Просрочено', pal: error }] },
    { title: 'Info',     badges: [{ label: 'Продана', pal: info }, { label: 'Зарег.', pal: info }, { label: 'Новая', pal: info }] },
    { title: 'Blue',     badges: [{ label: 'KPI 1', pal: blue }, { label: 'KPI 2', pal: blue }, { label: 'KPI 3', pal: blue }] },
    { title: 'Neutral',  badges: [{ label: 'На складе', pal: neutral }, { label: 'Черновик', pal: neutral }] },
    { title: 'Outline',  badges: [
      { label: 'VISA SUM', pal: { bg: 'transparent', fg: t.text2 }, border: `1px solid ${t.border}` },
      { label: 'VISA USD', pal: { bg: 'transparent', fg: t.text2 }, border: `1px solid ${t.border}` },
      { label: 'VISA EUR', pal: { bg: 'transparent', fg: t.text2 }, border: `1px solid ${t.border}` },
    ] },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: t.pageBg, padding: '24px 16px', gap: 20 }}>
      <div style={{ fontFamily: F.inter, fontSize: '13px', color: t.text3, lineHeight: 1.5 }}>
        Same palette as desktop §Row2, but text is <strong style={{ color: t.text1 }}>13 px</strong> (vs 12) for mobile legibility. Radius 12 px, padding 3×10.
      </div>
      {groups.map(g => (
        <div key={g.title}>
          <VariantLabel text={g.title} dark={dark} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {g.badges.map(b => (
              <Badge key={b.label} label={b.label} bg={b.pal.bg} fg={b.pal.fg} border={b.border} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PUBLIC
═══════════════════════════════════════════════════════════════════════════ */

export const M_Advanced = {
  KpiStepper: ({ t: _t }: { t: T }) => (
    <Pair height={900} note="Variant B vertical tracker. 40 px circles, active has blue glow ring. Done step uses faint green tint card. Active step shows 10 px progress bar + day counter. Summary card at bottom.">
      {(dark) => <KpiStepperCol dark={dark} />}
    </Pair>
  ),
  Badges: ({ t: _t }: { t: T }) => (
    <Pair height={700} note="All 7 palettes (success / warning / error / info / blue / neutral / outline). 13 px text, 12 px radius. Both themes use dedicated dark palette maps, not naive opacity.">
      {(dark) => <BadgeCol dark={dark} />}
    </Pair>
  ),
};
