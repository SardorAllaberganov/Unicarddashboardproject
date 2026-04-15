import React from 'react';
import { ArrowRight, ArrowLeft, Info, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { F, C } from '../components/ds/tokens';
import { useDarkMode } from '../components/useDarkMode';

/* ═══════════════════════════════════════════════════════════════════════════
   DEV-HANDOFF PAGE — M-03 (Compose) ↔ M-04 (History) cross-page flow
   Not a user-facing route. No Sidebar / Navbar — plain reference document.
═══════════════════════════════════════════════════════════════════════════ */

export default function AnnouncementFlowPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: C.pageBg,
      padding: '32px 24px', boxSizing: 'border-box',
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%', maxWidth: '1200px',
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: '20px',
        boxShadow: '0 16px 40px rgba(17,24,39,0.06)',
        padding: '32px',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: '16px', marginBottom: '10px', flexWrap: 'wrap',
        }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{
              fontFamily: F.dm, fontSize: '24px', fontWeight: 700, color: C.text1,
              margin: 0, lineHeight: 1.2,
            }}>
              Flow: M-03 Compose ↔ M-04 History
            </h1>
            <div style={{ fontFamily: F.inter, fontSize: '13px', color: C.text3, marginTop: '6px' }}>
              Cross-page integration reference (dev handoff)
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              height: '34px', padding: '0 12px',
              border: `1px solid ${C.inputBorder}`, borderRadius: '8px',
              background: C.surface,
              fontFamily: F.inter, fontSize: '13px', fontWeight: 500,
              color: C.text2, cursor: 'pointer',
            }}
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            Назад в приложение
          </button>
        </div>

        {/* Info strip */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          padding: '12px 14px',
          background: C.warningBg, borderRadius: '8px',
          borderLeft: `3px solid ${C.warning}`,
          marginTop: '16px', marginBottom: '24px',
        }}>
          <Info size={16} color={C.warning} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{
            fontFamily: F.inter, fontSize: '13px', color: C.text2, lineHeight: 1.5,
          }}>
            Справочный документ для разработчиков — не пользовательский интерфейс.
            Описывает целевую архитектуру общего стора. Текущая реализация использует
            локальные seed-массивы внутри каждой страницы (см. раздел «Current implementation» ниже).
          </div>
        </div>

        {/* Legend */}
        <Legend />

        {/* SECTION — Compose → Store → History */}
        <SectionHeading number="1">Compose → Shared Store → History</SectionHeading>

        <div style={{
          border: `1px solid ${C.border}`, borderRadius: '12px',
          overflow: 'hidden',
        }}>
          <FlowHeaderRow cols={['M-03 Compose Action', 'Store slice', 'M-04 Consumer']} />
          <FlowRow
            action="Сохранить черновик"
            notes={['Toast P-06 (DraftSavedToast)', 'Auto-save indicator (saving → saved HH:MM)']}
            storeSlice="drafts[]"
            consumer="«Черновики» tab"
            consumerNote="renders drafts rows"
          />
          <FlowRow
            action="Отправить"
            notes={['Confirm dialog (SendConfirmDialog)', 'Toast P-07 (SentAnnouncementToast)', 'Redirect → M-04 с highlight + pulse']}
            storeSlice="sent[]"
            consumer="«Отправленные» tab"
            consumerNote="renders rows + delivery/read stats"
          />
          <FlowRow
            action="Запланировать"
            notes={['Confirm dialog', 'Toast success']}
            storeSlice="scheduled[]"
            consumer="«Запланировано» tab"
            consumerNote="renders rows with scheduled date"
            last
          />
        </div>

        {/* SECTION — Row actions */}
        <div style={{ marginTop: '28px' }}>
          <SectionHeading number="2">M-04 Row actions → Store mutations</SectionHeading>
          <div style={{
            border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden',
          }}>
            <RowActionHeader />
            <RowActionRow
              action="Отменить (scheduled)"
              mutation="scheduled.remove(id) + drafts.push(...)"
              modal="P-03 CancelScheduledModal"
            />
            <RowActionRow
              action="Удалить (draft)"
              mutation="drafts.remove(id)"
              modal="P-04 DeleteDraftModal"
            />
            <RowActionRow
              action="Дублировать"
              mutation="drafts.push(copy) → navigate M-03 с state.preFilled"
              modal="—"
            />
            <RowActionRow
              action="Click draft row"
              mutation="navigate M-03 с location.state.draft"
              modal="Q-02 (Draft edit prefill)"
              last
            />
          </div>
        </div>

        {/* SECTION — State model */}
        <div style={{ marginTop: '28px' }}>
          <SectionHeading number="3">State model (целевой shared-store)</SectionHeading>
          <pre style={{
            margin: 0,
            background: '#F9FAFB',
            border: `1px solid ${C.border}`,
            borderRadius: '12px',
            padding: '16px 18px',
            fontFamily: F.mono, fontSize: '12.5px',
            color: C.text1, lineHeight: 1.65,
            overflowX: 'auto',
          }}>{`AnnouncementStore {
  drafts: [
    { id, title, body, recipients, channels, schedule, createdAt, updatedAt }
  ]
  sent: [
    { id, title, body, recipients, channels, sentAt,
      delivery: { total, delivered, read } }
  ]
  scheduled: [
    { id, title, body, recipients, channels, scheduledAt, createdAt }
  ]
}`}</pre>
        </div>

        {/* SECTION — Modal & toast reference */}
        <div style={{ marginTop: '28px' }}>
          <SectionHeading number="4">Modal & toast reference</SectionHeading>
          <div style={{
            display: 'grid', gridTemplateColumns: '120px 1fr',
            rowGap: '8px', columnGap: '16px',
            fontFamily: F.inter, fontSize: '13px',
          }}>
            <RefPair code="P-03" label="CancelScheduledModal — отмена запланированного объявления" />
            <RefPair code="P-04" label="DeleteDraftModal — удаление черновика" />
            <RefPair code="P-06" label="DraftSavedToast — сохранение черновика (success, 3px green, 6s)" />
            <RefPair code="P-07" label="SentAnnouncementToast — после отправки (success, 6s, «Открыть в истории»)" />
            <RefPair code="Q-02" label="Draft edit prefill — hydrate M-03 из location.state.draft" />
          </div>
        </div>

        {/* SECTION — Integration checklist */}
        <div style={{ marginTop: '28px' }}>
          <SectionHeading number="5">Integration checklist</SectionHeading>
          <div style={{
            border: `1px solid ${C.border}`, borderRadius: '12px',
            padding: '8px 4px', background: C.surface,
          }}>
            <ChecklistItem>
              Compose <b>«Отправить»</b> → adds to <Code>sent[]</Code> + navigates to M-04 + highlights row
            </ChecklistItem>
            <ChecklistItem>
              Compose <b>«Сохранить черновик»</b> → adds/updates <Code>drafts[]</Code> + toast
            </ChecklistItem>
            <ChecklistItem>
              Compose <b>«Запланировать»</b> → adds to <Code>scheduled[]</Code> + navigates to M-04
            </ChecklistItem>
            <ChecklistItem>
              M-04 draft row click → opens M-03 prefilled from <Code>drafts[id]</Code>
            </ChecklistItem>
            <ChecklistItem>
              M-04 <b>«Отменить»</b> scheduled → moves <Code>scheduled[id]</Code> to <Code>drafts[]</Code> + confirm P-03
            </ChecklistItem>
            <ChecklistItem>
              M-04 <b>«Удалить»</b> draft → removes <Code>drafts[id]</Code> + confirm P-04
            </ChecklistItem>
            <ChecklistItem>
              M-04 <b>«Дублировать»</b> → copies to <Code>drafts[]</Code> as new + opens M-03
            </ChecklistItem>
            <ChecklistItem>
              Detail page renders by <Code>:id</Code> → fetches from correct array
            </ChecklistItem>
            <ChecklistItem>
              Same pattern for <b>N-01</b> / <b>N-02</b> (Org Admin messages)
            </ChecklistItem>
          </div>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '8px',
            marginTop: '12px',
            fontFamily: F.inter, fontSize: '12px', color: C.text3, lineHeight: 1.5,
          }}>
            <Info size={14} color={C.info} strokeWidth={1.75} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>
              Аналогичная схема для <b style={{ color: C.text2 }}>N-01</b> (Сообщения продавцам){' '}
              → <b style={{ color: C.text2 }}>N-02</b> (История сообщений).
              Store: <Code>SellerMessageStore {'{ drafts, sent }'}</Code>, каналы{' '}
              <Code>'In-app' | 'Push'</Code>.
            </span>
          </div>
        </div>

        {/* SECTION — Current implementation footnote */}
        <div style={{ marginTop: '28px' }}>
          <SectionHeading number="6">Current implementation</SectionHeading>
          <div style={{
            fontFamily: F.inter, fontSize: '13px', color: C.text2, lineHeight: 1.6,
          }}>
            Шина передачи между M-03 и M-04 реализована через <Code>location.state</Code>:
            compose собирает <Code>newRow</Code> + <Code>toast</Code> и вызывает{' '}
            <Code>navigate('/announcements', {'{'} state {'}'})</Code>.
            History на маунте считывает state, добавляет строку с подсветкой (pulse animation)
            и показывает toast. Black-box для каждой страницы — refresh теряет состояние.
            Это осознанное ограничение прототипа; production требует модуль-уровневого стора
            или бэкенда.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION HEADING
═══════════════════════════════════════════════════════════════════════════ */

function SectionHeading({ number, children }: { number: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '6px',
        background: C.blueLt, color: C.blue,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: F.dm, fontSize: '12px', fontWeight: 700,
      }}>
        {number}
      </div>
      <h2 style={{
        margin: 0, fontFamily: F.dm, fontSize: '15px', fontWeight: 600, color: C.text1,
      }}>
        {children}
      </h2>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LEGEND
═══════════════════════════════════════════════════════════════════════════ */

function Legend() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap',
      marginBottom: '24px', padding: '10px 14px',
      background: '#F9FAFB', borderRadius: '8px',
    }}>
      <span style={{
        fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
        color: C.text4, textTransform: 'uppercase', letterSpacing: '0.04em',
      }}>
        Легенда
      </span>
      <LegendItem color={C.blue} icon={ArrowRight} label="write (compose → store)" />
      <LegendItem color={C.success} icon={ArrowLeft} label="read / consume (store → history)" />
      <LegendItem mono label="store slice" monoBg />
    </div>
  );
}

function LegendItem({ color, icon: Icon, label, mono, monoBg }: {
  color?: string;
  icon?: React.ElementType;
  label: string;
  mono?: boolean;
  monoBg?: boolean;
}) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      fontFamily: F.inter, fontSize: '12px', color: C.text2,
    }}>
      {Icon && <Icon size={14} color={color} strokeWidth={2} />}
      {monoBg && (
        <span style={{
          fontFamily: F.mono, fontSize: '12px',
          padding: '2px 8px', borderRadius: '6px',
          background: C.surface, border: `1px solid ${C.border}`,
          color: C.text1,
        }}>
          sliceName[]
        </span>
      )}
      {!mono && <span>{label}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOW ROW — three columns
═══════════════════════════════════════════════════════════════════════════ */

function FlowHeaderRow({ cols }: { cols: [string, string, string] }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1.4fr 40px 0.8fr 40px 1.3fr',
      gap: 0, background: '#F9FAFB',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <HeaderCell>{cols[0]}</HeaderCell>
      <div />
      <HeaderCell center>{cols[1]}</HeaderCell>
      <div />
      <HeaderCell>{cols[2]}</HeaderCell>
    </div>
  );
}

function HeaderCell({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div style={{
      padding: '10px 16px',
      fontFamily: F.inter, fontSize: '11px', fontWeight: 600,
      color: C.text3, textTransform: 'uppercase', letterSpacing: '0.04em',
      textAlign: center ? 'center' : 'left',
    }}>
      {children}
    </div>
  );
}

function FlowRow({ action, notes, storeSlice, consumer, consumerNote, last }: {
  action: string;
  notes: string[];
  storeSlice: string;
  consumer: string;
  consumerNote: string;
  last?: boolean;
}) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1.4fr 40px 0.8fr 40px 1.3fr',
      alignItems: 'center',
      borderBottom: last ? 'none' : `1px solid ${C.border}`,
    }}>
      {/* Action */}
      <div style={{ padding: '16px' }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: C.text1,
        }}>
          {action}
        </div>
        <ul style={{
          margin: '6px 0 0', paddingLeft: '16px',
          fontFamily: F.inter, fontSize: '12px', color: C.text3, lineHeight: 1.5,
        }}>
          {notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </div>

      {/* Arrow write */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ArrowRight size={18} color={C.blue} strokeWidth={2} />
      </div>

      {/* Store slice */}
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <span style={{
          display: 'inline-block',
          fontFamily: F.mono, fontSize: '13px', fontWeight: 500,
          padding: '4px 12px', borderRadius: '8px',
          background: C.blueLt, color: C.blue,
          border: `1px solid ${C.blueTint}`,
        }}>
          {storeSlice}
        </span>
      </div>

      {/* Arrow read */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ArrowLeft size={18} color={C.success} strokeWidth={2} />
      </div>

      {/* Consumer */}
      <div style={{ padding: '16px' }}>
        <div style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 600, color: C.text1,
        }}>
          {consumer}
        </div>
        <div style={{
          fontFamily: F.inter, fontSize: '12px', color: C.text3,
          marginTop: '4px', lineHeight: 1.45,
        }}>
          {consumerNote}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROW-ACTION TABLE (bottom half)
═══════════════════════════════════════════════════════════════════════════ */

function RowActionHeader() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 40px 1.4fr 1fr',
      gap: 0, background: '#F9FAFB',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <HeaderCell>Row action (M-04)</HeaderCell>
      <div />
      <HeaderCell>Store mutation</HeaderCell>
      <HeaderCell>Modal / toast</HeaderCell>
    </div>
  );
}

function RowActionRow({ action, mutation, modal, last }: {
  action: string;
  mutation: string;
  modal: string;
  last?: boolean;
}) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 40px 1.4fr 1fr',
      alignItems: 'center',
      borderBottom: last ? 'none' : `1px solid ${C.border}`,
    }}>
      <div style={{ padding: '14px 16px' }}>
        <span style={{
          fontFamily: F.inter, fontSize: '13px', fontWeight: 500, color: C.text1,
        }}>
          {action}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ArrowRight size={18} color={C.blue} strokeWidth={2} />
      </div>
      <div style={{ padding: '14px 16px' }}>
        <span style={{
          fontFamily: F.mono, fontSize: '12.5px',
          padding: '3px 8px', borderRadius: '6px',
          background: '#F9FAFB', border: `1px solid ${C.border}`,
          color: C.text1,
        }}>
          {mutation}
        </span>
      </div>
      <div style={{
        padding: '14px 16px',
        fontFamily: F.inter, fontSize: '12.5px', color: C.text3,
      }}>
        {modal}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REFERENCE PAIR + CODE
═══════════════════════════════════════════════════════════════════════════ */

function RefPair({ code, label }: { code: string; label: string }) {
  return (
    <>
      <span style={{
        fontFamily: F.mono, fontSize: '12px', fontWeight: 600,
        color: C.blue, padding: '2px 8px', borderRadius: '6px',
        background: C.blueLt, border: `1px solid ${C.blueTint}`,
        display: 'inline-block', width: 'fit-content', justifySelf: 'start',
      }}>
        {code}
      </span>
      <span style={{ color: C.text2 }}>{label}</span>
    </>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: F.mono, fontSize: '12px',
      padding: '1px 6px', borderRadius: '4px',
      background: '#F3F4F6', color: C.text1,
    }}>
      {children}
    </code>
  );
}

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      padding: '8px 12px',
      fontFamily: F.inter, fontSize: '13px', color: C.text2, lineHeight: 1.55,
    }}>
      <div style={{
        width: '18px', height: '18px', borderRadius: '5px',
        background: C.success, border: `1px solid ${C.success}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '1px',
      }}>
        <Check size={12} color="#FFFFFF" strokeWidth={3} />
      </div>
      <span>{children}</span>
    </div>
  );
}
