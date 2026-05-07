import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PARTS } from '../data/claudeCodeParts'
import { demoModeLabels, demoScenarios, integrationChecklist } from '../data/demoScenarios'

const tabs = [
  { id: 'all', label: '全部情境' },
  { id: 'script', label: 'Script 準備' },
  { id: 'data', label: '資料準備' },
  { id: 'integrations', label: 'CLI / MCP' },
]

const layerStyles = {
  1: {
    badge: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    text: 'text-emerald-300',
    border: 'border-emerald-500/20',
  },
  2: {
    badge: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
    text: 'text-amber-300',
    border: 'border-amber-500/20',
  },
  3: {
    badge: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
    text: 'text-violet-300',
    border: 'border-violet-500/20',
  },
}

const demoModeStyles = {
  live: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  'dry-run': 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  optional: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  self: 'border-slate-500/25 bg-slate-500/10 text-slate-400',
}

const qaItems = [
  {
    q: '可以透過 MCP 跟 Shopee Confluence 串在一起嗎？',
    short: '可以。',
    answer: '進階做法是 Skill 搭配 CLI & MCP：Skill 寫清楚可讀範圍、摘要格式、引用格式與 HITL checkpoint；CLI 先做匯出、fixture、dry-run summary；MCP 穩定後負責 live read Confluence page。課堂 demo 不把成功條件綁在 Confluence MCP 權限上。',
  },
  {
    q: '可以透過 MCP 跟 Shopee JIRA 串在一起嗎？',
    short: '可以。',
    answer: '進階做法同樣是 Skill 搭配 CLI & MCP：Skill 定義 issue 分拆規則、欄位對應、寫入前人工確認；CLI 做 would-create preview、schema validation、assignee / project / issue type 檢查；MCP 只在確認後建 issue 或更新欄位。',
  },
  {
    q: '不同實作需求會調整 model effort 嗎？怎麼比較省？',
    short: '會，但高 effort 不保證比較準。',
    answer: 'Reasoning / effort 本質上是 thinking budget 上限，但每家 provider、每個 model 的實際 budget、計費方式與用不用滿都不同，不能跨模型硬比。模型覺得已經夠時，不一定會用滿，也可能帶著錯誤假設提早收斂。整理 meeting notes、固定格式草稿、已知路徑小修改用 low / medium；跨檔實作、未知 codebase 探索、架構取捨或高風險 review 才升 high / max。省錢優先靠縮 scope、給明確檔案、先產 artifact，不是盲目調高 effort。',
  },
]

const partsBySlug = new Map(PARTS.map(part => [part.slug, part]))

function LayerBadge({ scenario }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs whitespace-nowrap ${layerStyles[scenario.layer].badge}`}>
      {scenario.layerLabel}
    </span>
  )
}

function DemoModeBadge({ mode }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs whitespace-nowrap ${demoModeStyles[mode]}`}>
      {demoModeLabels[mode]}
    </span>
  )
}

function Chip({ children }) {
  const text = String(children)
  const isScript = text.includes('Script')
  const isTool = text.includes('Git')
  const isEmpty = text.includes('僅需') || text.includes('這次')
  const classes = isScript
    ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
    : isTool
      ? 'border-slate-500/20 bg-slate-500/10 text-slate-300'
      : isEmpty
        ? 'border-white/10 bg-white/[0.03] text-slate-500 italic'
        : 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300'

  return <span className={`rounded-md border px-2 py-1 text-xs ${classes}`}>{children}</span>
}

function RelatedParts({ slugs = [] }) {
  if (!slugs.length) return null

  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
      <span className="text-slate-600">對應補充教材</span>
      {slugs.map((slug) => {
        const part = partsBySlug.get(slug)
        if (!part) return null
        return (
          <Link
            key={slug}
            to={part.path}
            className="rounded-md border border-white/10 px-2 py-1 font-mono text-slate-500 no-underline transition-colors hover:border-white/20 hover:text-slate-200"
          >
            {part.slug}
          </Link>
        )
      })}
    </div>
  )
}

function TodoList({ items }) {
  return (
    <div className="grid gap-1.5">
      {items.map((item) => (
        <div key={item} className="flex gap-2 text-sm leading-relaxed text-slate-300">
          <span className="mt-0.5 flex-shrink-0 text-amber-300">□</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}

function ScenarioCard({ scenario, compact = false }) {
  const style = layerStyles[scenario.layer]

  return (
    <article className={`overflow-hidden rounded-xl border ${style.border} bg-white/[0.02]`}>
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex flex-wrap items-start gap-3">
          <span className="pt-1 font-mono text-xs text-slate-600">{scenario.id}</span>
          <h3 className="min-w-0 flex-1 text-base font-semibold leading-relaxed text-white">{scenario.title}</h3>
          <DemoModeBadge mode={scenario.demoMode} />
          <LayerBadge scenario={scenario} />
        </div>
        <RelatedParts slugs={scenario.relatedParts} />
      </div>

      <div className={`grid gap-5 p-5 ${compact ? 'grid-cols-1' : 'lg:grid-cols-[1fr_1fr]'}`}>
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">工具路徑</div>
          <div className="flex flex-wrap gap-1.5">
            {scenario.tools.map((tool) => <Chip key={tool}>{tool}</Chip>)}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Script / 操作產出</div>
          <div className="flex flex-wrap gap-1.5">
            <Chip>{scenario.devOutput}</Chip>
          </div>
          {scenario.scriptResult && <p className="mt-2 text-sm leading-relaxed text-slate-400">{scenario.scriptResult}</p>}
        </div>

        <div className="lg:col-span-2">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Demo 資料準備</div>
          <TodoList items={scenario.pmTodos} />
        </div>

        <div className="lg:col-span-2">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">課前最低準備</div>
          <TodoList items={scenario.prepItems} />
        </div>

        {scenario.fallback && (
          <div className="lg:col-span-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm leading-relaxed text-cyan-100">
            <strong className="mb-1 block text-cyan-200">Fallback</strong>
            {scenario.fallback}
          </div>
        )}
      </div>

      {scenario.caution && (
        <div className="px-5 pb-5">
          <div className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm leading-relaxed text-rose-100">
            <strong className="mb-1 block text-rose-200">Demo 前注意事項</strong>
            <div className="grid gap-1">
              {scenario.caution.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
      <div className="text-3xl font-black text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  )
}

function CliCommand({ children }) {
  return (
    <code className="rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-xs text-emerald-200">
      {children}
    </code>
  )
}

export default function DemoChecklist() {
  const [activeTab, setActiveTab] = useState('all')

  const orderedScenarios = useMemo(
    () => [...demoScenarios].sort((a, b) => a.demoOrder - b.demoOrder),
    [],
  )
  const scriptScenarios = useMemo(() => orderedScenarios.filter(scenario => scenario.layer === 2), [orderedScenarios])
  const liveCount = useMemo(() => orderedScenarios.filter(scenario => scenario.demoMode === 'live').length, [orderedScenarios])
  const assistedCount = useMemo(
    () => orderedScenarios.filter(scenario => ['dry-run', 'optional'].includes(scenario.demoMode)).length,
    [orderedScenarios],
  )
  const selfPracticeCount = useMemo(() => orderedScenarios.filter(scenario => scenario.demoMode === 'self').length, [orderedScenarios])

  return (
    <main className="min-h-screen pt-16">
      <section className="border-b border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 inline-flex rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-300">
            Demo Cases
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="mb-4 text-4xl font-black leading-tight text-white sm:text-5xl">
                講師 Demo 準備清單
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-slate-400">
                學員主路徑已經把 13 個情境拆成下半部 demo part。這頁保留給講師做 backstage 準備：
                前面只放課堂可控 demo；需要多系統權限、資料量或 script 的案例，改成 dry-run、加演或課後自練。
                重點是先確認資料輸入、CLI / script 邊界、MCP 是否 optional，以及 HITL 檢查點。
              </p>
            </div>
            <Link
              to="/workshop"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 no-underline transition-colors hover:border-white/20 hover:text-white"
            >
              回課程安排 →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard value={liveCount} label="課堂 Live Demo" />
          <StatCard value={assistedCount} label="Dry-run / 加演" />
          <StatCard value={selfPracticeCount} label="課後自練" />
        </div>

        <div className="mb-7 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
          <div className="mb-2 text-sm font-semibold text-white">課堂預設走 CLI fixture；MCP 只當 optional adapter。</div>
          <div className="flex flex-wrap gap-2">
            <CliCommand>npm run demo:list</CliCommand>
            <CliCommand>npm run demo:case -- prd-draft</CliCommand>
            <CliCommand>npm run demo:case -- technical-questions</CliCommand>
            <CliCommand>npm run demo:case -- meeting-actions</CliCommand>
            <CliCommand>npm run demo:case -- jira-subtasks</CliCommand>
          </div>
        </div>

        <section className="mb-7 rounded-xl border border-violet-500/20 bg-violet-500/5 px-5 py-4">
          <div className="mb-3 text-sm font-semibold text-white">預收集 Q&A：MCP、Skill、CLI</div>
          <div className="grid gap-3">
            {qaItems.map((item) => (
              <article key={item.q} className="rounded-lg border border-white/10 bg-black/20 px-4 py-3">
                <h3 className="text-sm font-semibold leading-relaxed text-violet-100">{item.q}</h3>
                <p className="mt-1 text-sm font-semibold text-emerald-300">{item.short}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{item.answer}</p>
              </article>
            ))}
          </div>
          <Link to="/coding-agent/skills-workflows" className="mt-3 inline-flex text-xs text-violet-200 no-underline hover:text-white">
            進階範例看 skills-workflows：Skill 搭配 CLI & MCP →
          </Link>
        </section>

        <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              課堂 Live · {liveCount}
            </span>
            <span className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
              Dry-run / 加演 · {assistedCount}
            </span>
            <span className="rounded-full border border-slate-500/25 bg-slate-500/10 px-3 py-1 text-xs text-slate-400">
              課後自練 · {selfPracticeCount}
            </span>
            <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
              CLI / MCP · {integrationChecklist.length}
            </span>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Demo 清單分頁">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'all' && (
          <section className="grid gap-4">
            <div className="grid gap-2 text-sm text-slate-500 lg:grid-cols-4">
              <div><span className="text-emerald-300">課堂 Live</span>：只放資料與權限可控的案例</div>
              <div><span className="text-cyan-300">Dry-run</span>：展示 would-create / 草稿，不寫 production</div>
              <div><span className="text-amber-300">加演</span>：外部 MCP 已驗證才現場跑</div>
              <div><span className="text-slate-400">課後自練</span>：提供準備清單，讓學員回去自己接</div>
            </div>
            {orderedScenarios.map((scenario) => <ScenarioCard key={scenario.id} scenario={scenario} />)}
          </section>
        )}

        {activeTab === 'script' && (
          <section className="grid gap-4">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm leading-relaxed text-slate-300">
              <strong className="mb-1 block text-white">Script 準備只針對 Layer 2。</strong>
              Layer 1 與 Layer 3 主要準備 cowork 操作流程；Layer 2 需事先建好 script，demo 時展示輸入、輸出與人工確認點。
            </div>
            {scriptScenarios.map((scenario) => <ScenarioCard key={scenario.id} scenario={scenario} compact />)}
          </section>
        )}

        {activeTab === 'data' && (
          <section className="grid gap-4">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-5 py-4 text-sm leading-relaxed text-slate-300">
              以下項目是 demo 前要準備好的輸入。資料越明確，agent 越容易產出可 review 的草稿或檢查清單。
            </div>
            {orderedScenarios.map((scenario) => (
              <article key={scenario.id} className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-slate-600">{scenario.id}</span>
                  <h3 className="text-sm font-semibold text-white">{scenario.title}</h3>
                  <DemoModeBadge mode={scenario.demoMode} />
                  <LayerBadge scenario={scenario} />
                </div>
                <TodoList items={scenario.pmTodos} />
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">課前最低準備</div>
                  <TodoList items={scenario.prepItems} />
                </div>
                {scenario.id === '13' && (
                  <div className="mt-4 rounded-lg border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm leading-relaxed text-rose-100">
                    <strong className="mb-1 block text-rose-200">HITL 提醒</strong>
                    此情境適合整理既有系統的技術事實與問題清單，不適合直接從 codebase 回推完整 PRD。
                    Codebase 只能說明目前怎麼運作，為什麼這樣設計需要 PM / Tech Lead HITL 確認。
                  </div>
                )}
              </article>
            ))}
          </section>
        )}

        {activeTab === 'integrations' && (
          <section>
            <div className="mb-4 rounded-xl border border-violet-500/20 bg-violet-500/5 px-5 py-4 text-sm leading-relaxed text-slate-300">
              Demo 準備採 CLI first：先確認 fixture、export、API script、CSV / Markdown 檔案能不能跑通。
              若任一外部權限不穩，改用本機 CLI fixture 與 dry-run output；MCP 有時間再接成進階版本。
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="px-5 py-3 text-left font-semibold text-slate-400">系統</th>
                    <th className="px-5 py-3 text-left font-semibold text-slate-400">使用情境</th>
                    <th className="px-5 py-3 text-left font-semibold text-slate-400">CLI / Export 優先路徑</th>
                    <th className="px-5 py-3 text-left font-semibold text-slate-400">狀態</th>
                  </tr>
                </thead>
                <tbody>
                  {integrationChecklist.map((item) => (
                    <tr key={item.name} className="border-b border-white/5 last:border-0">
                      <td className="px-5 py-4 align-top text-slate-200">{item.name}</td>
                      <td className="px-5 py-4 align-top font-mono text-xs text-slate-500">{item.scenarios}</td>
                      <td className="px-5 py-4 align-top text-slate-400">{item.fallback}</td>
                      <td className="px-5 py-4 align-top">
                        <span className={`rounded-md border px-2 py-1 text-xs ${item.ok ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/25 bg-amber-500/10 text-amber-300'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 text-sm leading-relaxed text-amber-100">
              SeaTalk、會議室系統、Google Workspace 權限仍要確認；但 demo 可先改成 dry-run 檔案、CSV 匯出、webhook script 或人工確認清單。
            </div>
          </section>
        )}
      </section>
    </main>
  )
}
