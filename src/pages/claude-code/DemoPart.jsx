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
    slate: 'border-white/10 bg-white/[0.03] text-slate-300',
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
          <Callout type="warn">找不到這個演練。</Callout>
        </div>
      </main>
    )
  }

  return (
    <PageLayout partSlug={part.slug}>
      <SectionHeader partSlug={part.slug} />

      <p className="text-slate-300 leading-relaxed mb-6">
        這是下半部的實際演練。重點不是把所有外部系統一次串完，而是把上半部的觀念落地：
        <span className="text-white">輸入資料清楚</span>、
        <span className="text-white">CLI / export 優先</span>、
        <span className="text-white">外部寫入先 dry-run</span>、
        <span className="text-white">不確定處停下來做 HITL</span>。
      </p>

      <div className={`mb-8 flex flex-wrap items-center gap-2 rounded-lg border px-4 py-3 text-sm ${scenario.demoMode === 'live' ? 'border-amber-500/25 bg-amber-500/5' : 'border-slate-500/25 bg-slate-500/5'}`}>
        <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${scenario.demoMode === 'live' ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : 'border-slate-500/30 bg-slate-500/10 text-slate-300'}`}>
          {scenario.demoMode === 'live' ? '課堂示範' : '課後自練'}
        </span>
        <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${scenario.materialsReady ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>
          素材：{scenario.materialsReady ? '✅ 已備好（demo-data/）' : '✗ 尚未準備'}
        </span>
        {scenario.materialsNote && (
          <span className="basis-full text-xs leading-relaxed text-slate-400">{scenario.materialsNote}</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-3 text-sm font-semibold text-slate-300">演練範圍</div>
          <div className="flex flex-wrap gap-1.5 mb-4">
            <Chip tone="amber">{scenario.layerLabel}</Chip>
            <Chip>{scenario.devOutput}</Chip>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            {scenario.scriptResult ?? '這個演練以現場 cowork 操作流程為主，產出可 review 的草稿或檢查清單。'}
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="mb-3 text-sm font-semibold text-slate-300">工具路徑</div>
          <div className="flex flex-wrap gap-1.5">
            {scenario.tools.map(tool => <Chip key={tool}>{tool}</Chip>)}
          </div>
        </section>
      </div>

      {scenario.classroom && (
        <>
          <H3>課堂操作步驟</H3>
          <p className="mb-3 text-sm leading-relaxed text-slate-300">
            照下面的指令做。這裡使用本機 fixture，所以不需要 Google / JIRA / MCP 授權；
            真實工作流若改用公司 CLI 或外部 API，仍可能需要 OAuth、token、SSO 或專案權限。
          </p>
          <Callout type="warn">
            CLI first 不是「不用授權」。它只是讓授權點、輸入輸出、dry-run 與 fallback 更清楚。
            課堂現場優先用 export 檔、fixture 和本機 script，是為了避開 OAuth / VPN / SSO 卡住整段示範。
          </Callout>

          <ol className="mb-6 list-decimal space-y-5 pl-6 text-sm leading-relaxed text-slate-300 marker:font-bold marker:text-amber-300">
            <li className="pl-1">
              <div className="font-semibold text-white">Clone repo，進到教材資料夾</div>
              <p className="mt-1 mb-2 text-slate-300">
                這兩行只是把教材拿到自己電腦，並進入 repo。課堂 demo 的主流程從下一步打開 agent 開始。
              </p>
              <CodeBlock title="terminal">
{scenario.classroom.setup.join('\n')}
              </CodeBlock>
            </li>

            <li className="pl-1">
              <div className="font-semibold text-white">啟動 agent</div>
              <p className="mt-1 mb-2 text-slate-300">
                在 repo 裡直接開互動式 UI。Claude Code 和 Codex 都用同一份 prompt。
              </p>
              <CodeBlock title="terminal">{scenario.classroom.launch}</CodeBlock>
            </li>

            <li className="pl-1">
              <div className="font-semibold text-white">先貼檢查 prompt</div>
              <p className="mt-1 mb-2 text-slate-300">
                先讓 agent 自己確認 prompt 和 fixture 都在，不要先產出結果。這一步可以讓學生看到 agent 讀取 repo 的方式。
              </p>
              <CodeBlock title="prompt（先貼到 agent 對話）">
{`請先不要執行 demo 任務，也不要改檔。
正式 demo prompt 等一下會是：

${scenario.classroom.prompt}

請先檢查這份 repo 是否具備本 demo 所需材料。只檢查下列輸入檔，不要把正式 prompt 裡「要建立的新檔」當成缺檔：

${(scenario.classroom.readFiles ?? []).map(file => `- \`${file}\``).join('\n')}

1. 確認上述檔案是否存在。
2. 用表格列出 will_read 檔案、用途、是否存在。
3. 如果 prompt 檔存在，可以讀它來理解任務，但不要開始產出正式結果。
4. 如果有缺檔，請停止並列出缺少項目。
5. 如果都存在，只回覆 ready，並列出下一步我應該貼哪段 prompt。`}
              </CodeBlock>
            </li>

            <li className="pl-1">
              <div className="font-semibold text-white">貼正式 demo prompt</div>
              <p className="mt-1 mb-2 text-slate-300">確認 ready 後，把下面整段貼進去。</p>
              <div className="mt-3">
                <CodeBlock title="prompt（複製整段貼到 agent 對話）">
{scenario.classroom.prompt}
                </CodeBlock>
              </div>
            </li>

            <li className="pl-1">
              <div className="font-semibold text-white">Fallback：agent 卡住或網路不穩時</div>
              <p className="mt-1 mb-2 text-slate-300">
                這不是學生主流程。CLI 不呼叫 LLM，直接印固定 prompt 與 deterministic 輸出，讓課堂不停下來。
              </p>
              <CodeBlock title="terminal">
{`npm run demo:list
${scenario.classroom.fallback}`}
              </CodeBlock>
            </li>

            <li className="pl-1">
              <div className="font-semibold text-white">Optional：手動看輸入資料</div>
              <p className="mt-1 mb-2 text-slate-300">如果想知道 agent 會讀什麼，可以用 terminal 直接看 fixture。這不是 demo 必要步驟。</p>
              <CodeBlock title="terminal">
{scenario.classroom.inspect.join('\n')}
              </CodeBlock>
            </li>

            <li className="pl-1">
              <div className="font-semibold text-white">看輸出時要檢查的點</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300 marker:text-emerald-300">
                {scenario.classroom.checks.map((check) => (
                  <li key={check} className="pl-1">{check}</li>
                ))}
              </ul>
            </li>
          </ol>
        </>
      )}

      <H3>演練前準備（給講師 / 自己備課用）</H3>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-sm leading-relaxed text-slate-300 marker:text-amber-300">
        {scenario.pmTodos.map((todo) => (
          <li key={todo} className="pl-1">{todo}</li>
        ))}
      </ul>

      <H3>操作流程</H3>
      <ol className="mb-8 list-decimal space-y-3 pl-6 text-sm leading-relaxed text-slate-300 marker:font-bold marker:text-cyan-300">
        {[
          { title: '輸入資料', body: '先把演練所需檔案、template、CSV、repo 範圍或外部連結準備好。不要讓 agent 在現場猜資料位置。' },
          { title: 'CLI first / export first', body: '能用 export 檔、CSV、Markdown、fixture JSON、API dry-run script 跑通就先這樣做。真實 CLI 仍可能需要授權；MCP 是 optional 進階版。' },
          { title: '產出 reviewable artifact', body: '讓 agent 產出草稿、JSON preview、Markdown report、問題清單或 diff summary，不直接寫入外部系統。' },
          { title: 'HITL checkpoint', body: '任何產品取捨、資料缺口、外部寫入、codebase 推論，或需要釐清 scope / 找盲點的地方，都要產出問題清單，不要讓 agent 自行補假設。' },
        ].map((step) => (
          <li key={step.title} className="pl-1">
            <div className="font-semibold text-white">{step.title}</div>
            <p className="mt-1 text-slate-300">{step.body}</p>
          </li>
        ))}
      </ol>

      <CodeBlock title="演練 prompt skeleton">
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
                <span className="text-slate-300 leading-relaxed">{item.fallback}</span>
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
            className="rounded-md border border-white/10 px-2 py-1 font-mono text-xs text-slate-300 no-underline transition-colors hover:border-white/20 hover:text-white"
          >
            {concept.slug}
          </Link>
        ))}
      </div>
    </PageLayout>
  )
}
