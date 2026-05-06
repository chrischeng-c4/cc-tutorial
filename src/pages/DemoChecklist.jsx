import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PARTS } from '../data/claudeCodeParts'
import { demoScenarios, integrationChecklist } from '../data/demoScenarios'

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

const partsBySlug = new Map(PARTS.map(part => [part.slug, part]))

function LayerBadge({ scenario }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs whitespace-nowrap ${layerStyles[scenario.layer].badge}`}>
      {scenario.layerLabel}
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

export default function DemoChecklist() {
  const [activeTab, setActiveTab] = useState('all')

  const scriptScenarios = useMemo(() => demoScenarios.filter(scenario => scenario.layer === 2), [])
  const dataItemCount = useMemo(
    () => demoScenarios.reduce((total, scenario) => total + scenario.pmTodos.length, 0),
    [],
  )
  const layerOneCount = useMemo(() => demoScenarios.filter(scenario => scenario.layer === 1).length, [])

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
                Demo 準備清單
              </h1>
              <p className="max-w-3xl text-base leading-relaxed text-slate-400">
                這頁保留原始 13 個 demo 情境內容，但改成課程網站一致的檢視方式。
                重點是確認每個 case 的資料輸入、CLI / script 邊界、MCP 是否 optional，以及 HITL 檢查點。
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
          <StatCard value={demoScenarios.length} label="總情境數" />
          <StatCard value={scriptScenarios.length} label="需先建 Script" />
          <StatCard value={dataItemCount} label="資料準備項目" />
        </div>

        <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              Layer 1 · Cowork · {layerOneCount}
            </span>
            <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
              Layer 2 · Script · {scriptScenarios.length}
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
            <div className="grid gap-2 text-sm text-slate-500 sm:grid-cols-3">
              <div><span className="text-emerald-300">Layer 1</span>：cowork 操作，不需事先建 script</div>
              <div><span className="text-amber-300">Layer 2</span>：需先建 script，demo 展示結果</div>
              <div><span className="text-violet-300">Layer 3</span>：未來 agent 方向，這次只 demo 可控片段</div>
            </div>
            {demoScenarios.map((scenario) => <ScenarioCard key={scenario.id} scenario={scenario} />)}
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
            {demoScenarios.map((scenario) => (
              <article key={scenario.id} className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-slate-600">{scenario.id}</span>
                  <h3 className="text-sm font-semibold text-white">{scenario.title}</h3>
                  <LayerBadge scenario={scenario} />
                </div>
                <TodoList items={scenario.pmTodos} />
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
              Demo 準備採 CLI first：先確認 export、API script、CSV / Markdown 檔案能不能跑通；MCP 有時間再接成進階版本。
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
