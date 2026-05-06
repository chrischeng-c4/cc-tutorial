import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'

const scriptUseCases = [
  { title: '資料匯出', detail: '把 JIRA、Sheets、Docs、repo scan 先匯成 JSON / CSV / Markdown。' },
  { title: '格式產生', detail: '用 script 產 payload、frontmatter、PR comment、週報，不讓 agent 手刻固定格式。' },
  { title: 'dry-run', detail: '外部寫入前先產 preview 檔，讓人 review 後再執行真的寫入。' },
  { title: '驗證', detail: 'schema check、欄位檢查、lint、format 都交給可重跑工具。' },
]

export default function Part10() {
  return (
    <PageLayout partIndex={10}>
      <SectionHeader partIndex={10} />

      <p className="text-slate-400 leading-relaxed mb-8">
        Scripts 是最容易被低估的一層。它不一定比 MCP 漂亮，但最適合教學和落地：
        可重跑、可 commit、可在 CI 跑，也能讓 agent 不必憑記憶手寫固定格式。
        當 MCP 來不及做時，script 通常就是最好的替代路徑。
      </p>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 mb-5">
        <div className="text-white text-sm font-semibold mb-3">給非工程同學的直覺版</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="text-cyan-300 text-xs font-semibold uppercase tracking-wide mb-2">Script</div>
            <p className="text-slate-300 text-sm leading-relaxed">
              像一份固定 SOP 或自動化食譜：第一步匯出資料、第二步整理格式、第三步產草稿、第四步檢查。
              重點是把一串容易漏掉的步驟包起來，下次可以重跑。
            </p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="text-emerald-300 text-xs font-semibold uppercase tracking-wide mb-2">CLI</div>
            <p className="text-slate-300 text-sm leading-relaxed">
              像這份 SOP 的遙控器或櫃台窗口：你用一行指令告訴它要跑哪個功能、資料在哪、結果要放哪。
              人可以按，agent 也可以按。
            </p>
          </div>
        </div>
      </div>

      <Callout type="tip">
        先把流程寫成 script，不代表未來不用 MCP。Script 先幫你確認輸入、輸出、錯誤、dry-run、review 流程；
        等流程穩定、多人共用、需要工具 discoverability 時，再產品化成 MCP。
      </Callout>

      <H3>1. Script 解決的是「可重跑」</H3>
      <div className="grid grid-cols-1 gap-3 mb-5 md:grid-cols-2">
        {scriptUseCases.map((item) => (
          <div key={item.title} className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="text-white text-sm font-semibold mb-2">{item.title}</div>
            <p className="text-slate-400 text-sm leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>

      <H3>2. 固定格式不要只靠 prompt</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Prompt、Skill、AGENTS.md 都是指令；agent 多半會遵守，但不能把它當 parser、formatter 或 validator。
        只要輸出會被機器吃進去，就把格式契約做成 script。
      </p>
      <CodeBlock title="格式契約：讓 agent 呼叫 script，不要手刻 JSON">
{`# 反例：要求 agent 手寫完全正確的 JSON payload
> 請產生 Jira bulk create JSON，必須符合 schema，不要漏欄位。

# 較好的做法：格式由 script 保證
scripts/jira-bulk create-draft \
  --source tmp/story-map.md \
  --schema docs/schemas/jira-bulk.schema.json \
  --output tmp/jira-bulk.json

scripts/jira-bulk validate tmp/jira-bulk.json
scripts/jira-bulk dry-run tmp/jira-bulk.json

# Agent prompt
> 請不要手寫 Jira JSON。
> 先整理輸入資料，再呼叫 scripts/jira-bulk create-draft。
> validate 或 dry-run 失敗時，只回報錯誤與需要人工確認的欄位。`}
      </CodeBlock>

      <H3>3. Demo 最穩的 script pattern</H3>
      <CodeBlock title="外部寫入前先停在 reviewable artifact">
{`scripts/weekly-report export --project SHOP --since 2026-05-01 \
  --output tmp/weekly-source.json

scripts/weekly-report render tmp/weekly-source.json \
  --template docs/templates/weekly.md \
  --output tmp/weekly-report.md

scripts/weekly-report validate tmp/weekly-report.md

# 只到這裡就能 demo：人 review tmp/weekly-report.md
# 真正發送 SeaTalk / 寫回 Docs，要另外加 explicit approval。`}
      </CodeBlock>

      <Callout type="warn">
        Script 也有權限風險。命名要清楚區分
        <code className="mx-1 rounded bg-cyan-500/10 px-1 py-0.5 text-cyan-300">render</code>、
        <code className="mx-1 rounded bg-cyan-500/10 px-1 py-0.5 text-cyan-300">validate</code>、
        <code className="mx-1 rounded bg-cyan-500/10 px-1 py-0.5 text-cyan-300">dry-run</code> 和
        <code className="mx-1 rounded bg-cyan-500/10 px-1 py-0.5 text-cyan-300">apply</code>。
        Demo 現場預設停在 dry-run 或 artifact。
      </Callout>
    </PageLayout>
  )
}
