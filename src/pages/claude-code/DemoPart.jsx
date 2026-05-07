import { Link } from 'react-router-dom'
import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'
import { DEMO_PARTS, PARTS } from '../../data/claudeCodeParts'
import { demoScenarios, integrationChecklist } from '../../data/demoScenarios'

const conceptBySlug = new Map(PARTS.map(part => [part.slug, part]))
const scenarioById = new Map(demoScenarios.map(scenario => [scenario.id, scenario]))
const demoPartBySlug = new Map(DEMO_PARTS.map(part => [part.slug, part]))

function Chip({ children, tone = 'cyan' }) {
  const classes = {
    cyan: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    slate: 'border-white/10 bg-white/[0.03] text-slate-400',
  }[tone]
  return <span className={`rounded-md border px-2 py-1 text-xs ${classes}`}>{children}</span>
}

function findIntegrations(scenarioId) {
  return integrationChecklist.filter(item => item.scenarios.split(' · ').includes(scenarioId))
}

export default function DemoPart({ slug }) {
  const part = demoPartBySlug.get(slug)
  const scenario = part ? scenarioById.get(part.demoId) : null
  const integrations = scenario ? findIntegrations(scenario.id) : []
  const relatedConcepts = scenario?.relatedParts.map(relatedSlug => conceptBySlug.get(relatedSlug)).filter(Boolean) ?? []

  if (!part || !scenario) {
    return (
      <main className="min-h-screen pt-16">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <Callout type="warn">找不到這個 demo。</Callout>
        </div>
      </main>
    )
  }

  return (
    <PageLayout partSlug={part.slug}>
      <SectionHeader partSlug={part.slug} />

      <p className="text-slate-400 leading-relaxed mb-8">
        這是下半部的 demo part。重點不是把所有外部系統一次串完，而是把上半部的觀念落地：
        <span className="text-white">輸入資料清楚</span>、
        <span className="text-white">CLI / export 優先</span>、
        <span className="text-white">外部寫入先 dry-run</span>、
        <span className="text-white">不確定處停下來做 HITL</span>。
      </p>

      <div className="grid grid-cols-1 gap-4 mb-8 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-3 text-sm font-semibold text-slate-300">Demo 範圍</div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            <Chip tone="amber">{scenario.layerLabel}</Chip>
            <Chip>{scenario.devOutput}</Chip>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            {scenario.scriptResult ?? '這個 demo 以現場 cowork 操作流程為主，產出可 review 的草稿或檢查清單。'}
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-3 text-sm font-semibold text-slate-300">工具路徑</div>
          <div className="flex flex-wrap gap-1.5">
            {scenario.tools.map(tool => <Chip key={tool}>{tool}</Chip>)}
          </div>
        </section>
      </div>

      <H3>Demo 前準備</H3>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-sm leading-relaxed text-slate-300 marker:text-amber-300">
        {scenario.pmTodos.map((todo) => (
          <li key={todo} className="pl-1">{todo}</li>
        ))}
      </ul>

      <H3>操作流程</H3>
      <ol className="mb-8 list-decimal space-y-3 pl-6 text-sm leading-relaxed text-slate-300 marker:font-bold marker:text-cyan-300">
        {[
          { title: '輸入資料', body: '先把 demo 所需檔案、template、CSV、repo 範圍或外部連結準備好。不要讓 agent 在現場猜資料位置。' },
          { title: 'CLI first / export first', body: '能用 export 檔、CSV、Markdown、fixture JSON、API dry-run script 跑通就先這樣做。MCP 是 optional 進階版。' },
          { title: '產出 reviewable artifact', body: '讓 agent 產出草稿、JSON preview、Markdown report、問題清單或 diff summary，不直接寫入外部系統。' },
          { title: 'HITL checkpoint', body: '任何產品取捨、資料缺口、外部寫入、codebase 推論，或需要釐清 scope / 找盲點的地方，都要產出問題清單，不要讓 agent 自行補假設。' },
        ].map((step) => (
          <li key={step.title} className="pl-1">
            <div className="font-semibold text-white">{step.title}</div>
            <p className="mt-1 text-slate-300">{step.body}</p>
          </li>
        ))}
      </ol>

      <CodeBlock title="Demo prompt skeleton">
{`goal: ${scenario.title}
mode:
  - CLI/export first
  - MCP optional
  - dry-run before write

inputs:
${scenario.pmTodos.map(todo => `  - ${todo}`).join('\n')}

tools_or_files:
${scenario.tools.map(tool => `  - ${tool}`).join('\n')}

output:
  - draft or reviewable artifact
  - risks
  - HITL questions

rules:
  - Do not write to external systems without approval.
  - Separate facts, assumptions, and questions.
  - If required data is missing, ask before guessing.`}
      </CodeBlock>

      {integrations.length > 0 && (
        <>
          <H3>系統替代路徑</H3>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-8">
            {integrations.map((item) => (
              <div key={item.name} className="grid grid-cols-1 gap-2 border-b border-white/5 px-4 py-3 text-sm last:border-0 md:grid-cols-[10rem_1fr_8rem]">
                <span className="text-white font-medium">{item.name}</span>
                <span className="text-slate-400 leading-relaxed">{item.fallback}</span>
                <span className={`text-xs ${item.ok ? 'text-emerald-300' : 'text-amber-300'}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {scenario.caution && (
        <Callout type="warn">
          {scenario.caution.join(' ')}
        </Callout>
      )}

      <H3>對應觀念章節</H3>
      <div className="flex flex-wrap gap-2">
        {relatedConcepts.map(concept => (
          <Link
            key={concept.slug}
            to={concept.path}
            className="rounded-md border border-white/10 px-2 py-1 font-mono text-xs text-slate-400 no-underline transition-colors hover:border-white/20 hover:text-white"
          >
            {concept.slug}
          </Link>
        ))}
      </div>
    </PageLayout>
  )
}
