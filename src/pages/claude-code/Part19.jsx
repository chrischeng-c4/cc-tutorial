import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'

const skillLayers = [
  { layer: 'Trigger', detail: '什麼情境該載入這個 skill。' },
  { layer: 'Rules', detail: '固定工作方法、輸出格式、HITL checkpoint。' },
  { layer: 'Routing', detail: '什麼時候用 script、CLI、MCP、subagent 或外部 artifact。' },
  { layer: 'Limits', detail: '明確說哪些事不能猜、不能寫入、不能留在 main thread。' },
]

const skillVsSubagent = [
  {
    question: '只是想固定工作方法',
    skill: '適合。Skill 把流程規則注入 main thread。',
    subagent: '通常太重，除非這個方法還需要隔離探索或不同權限。',
  },
  {
    question: '怕污染 main thread context',
    skill: '不夠。Skill 本身會進 main thread context。',
    subagent: '適合。搜尋、長 log、候選檔案留在 subagent context。',
  },
  {
    question: '需要不同權限',
    skill: '不適合。Skill 是 prompt injection，不能動態調整 main thread 權限。',
    subagent: '適合。可以給 read-only、禁用 Bash、限制寫入，或使用不同 permission mode。',
  },
  {
    question: '要讓任務更容易成功',
    skill: '適合提供規則，但會繼承主線工具與權限。',
    subagent: '很多時候更好：不給某些權限，反而能讓 worker 專心產 facts / artifact。',
  },
]

export default function Part19() {
  return (
    <PageLayout partIndex={13}>
      <SectionHeader partIndex={13} />

      <p className="text-slate-300 leading-relaxed mb-8">
        Skill 值得獨立講，因為它不是 CLI、不是 MCP，也不是 subagent。
        Skill 是一個可重用的工作方法包：在需要時把規則、輸出格式、工具路由與風險邊界注入 main thread。
        它讓人可以更懶，但仍然有一致流程。
      </p>

      <H3>1. Skill 是受控 prompt injection</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        這裡的 prompt injection 不是攻擊，而是你授權的指令注入。
        好 skill 不塞大量資料，只放穩定規則：怎麼找資料、怎麼產 artifact、什麼情況要問人、什麼情況要派 subagent。
      </p>
      <div className="grid grid-cols-1 gap-3 mb-5 md:grid-cols-4">
        {skillLayers.map((item) => (
          <div key={item.layer} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="text-emerald-300 text-xs font-semibold uppercase tracking-wide mb-2">{item.layer}</div>
            <p className="text-slate-300 text-sm leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>

      <H3>2. Skill 範例</H3>
      <CodeBlock title=".claude/skills/weekly-report/SKILL.md">
{`---
name: weekly-report
description: Produce an internal weekly report from Jira and Sheets exports.
---

# Weekly Report

1. Treat context as working memory, not storage.
2. Prefer scripts/CLI for export, render, validate, and dry-run.
3. Use MCP only when current external data is needed and the server is available.
4. Write source data and drafts to tmp/ artifacts before external writeback.
5. If broad repo or document exploration is needed, ask main thread to spawn a read-only subagent.
6. Mark missing data and HITL questions.
7. Do not send messages or update tickets without explicit approval.`}
      </CodeBlock>

      <H3>3. 進階範例：Skill 搭配 CLI & MCP 接 Confluence / JIRA</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        Confluence 與 JIRA 都可以接 MCP。比較穩的做法不是一開始就讓 agent 直接寫外部系統，
        而是把三層拆開：Skill 定義工作規則；CLI 產 dry-run artifact；MCP 在權限穩定後負責 live read 或受控寫入。
      </p>
      <CodeBlock title="進階流程：Skill + CLI + MCP">
{`# 1. Skill 注入規則
# .claude/skills/shopee-delivery-sync/SKILL.md
Rules:
- Confluence is source of truth for product context.
- JIRA is source of truth for execution status.
- Use CLI first when the workflow needs dry-run, schema validation, or class demo fallback.
- Use MCP when live Confluence / JIRA data is required and credentials are available.
- Never write JIRA without would-create preview and human approval.

# 2. CLI 產可 review artifact，不依賴 MCP 成功
scripts/shopee-context confluence-export \
  --space SHOP \
  --page "Order Export PRD" \
  --output tmp/confluence-order-export.md

scripts/shopee-jira create-preview \
  --source tmp/confluence-order-export.md \
  --schema docs/schemas/jira-subtasks.schema.json \
  --output tmp/jira-preview.json

scripts/shopee-jira validate tmp/jira-preview.json

# 3. MCP 可用時才做 live read / write adapter
> Use the Shopee Confluence MCP to refresh the page summary.
> Compare it with tmp/confluence-order-export.md and list deltas.
> If I approve tmp/jira-preview.json, use Shopee JIRA MCP to create the issues.`}
      </CodeBlock>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {[
          { layer: 'Skill', body: '保存操作規則、欄位對應、HITL checkpoint、何時選 CLI 或 MCP。' },
          { layer: 'CLI', body: '產 fixture、preview、schema validation、dry-run output；課堂與 CI 都能重跑。' },
          { layer: 'MCP', body: '在 OAuth / 權限穩定後做 live read；寫入型 tool 一律先 read-only / dry-run。' },
        ].map((item) => (
          <div key={item.layer} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-violet-300 text-xs font-semibold uppercase tracking-wide mb-2">{item.layer}</div>
            <p className="text-slate-300 text-sm leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
      <Callout type="warn">
        Confluence 主要風險是讀到過多或敏感內容；JIRA 主要風險是寫錯 project、issue type、assignee 或狀態。
        所以 Confluence MCP 先限制讀取 scope；JIRA MCP 先做 preview，人工確認後才寫入。
      </Callout>

      <H3>4. Skill vs Subagent</H3>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] mb-5">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="px-4 py-3 text-left font-semibold text-slate-300">任務條件</th>
              <th className="px-4 py-3 text-left font-semibold text-emerald-300">Skill</th>
              <th className="px-4 py-3 text-left font-semibold text-cyan-300">Subagent</th>
            </tr>
          </thead>
          <tbody>
            {skillVsSubagent.map((row) => (
              <tr key={row.question} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 align-top text-white">{row.question}</td>
                <td className="px-4 py-3 align-top text-slate-300 leading-relaxed">{row.skill}</td>
                <td className="px-4 py-3 align-top text-slate-300 leading-relaxed">{row.subagent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="tip">
        一句話：Skill 用來固定「怎麼做」；Subagent 用來隔離「誰去做、帶什麼 context、有哪些權限」。
        如果任務只需要一套工作規則，用 skill 就好；如果任務需要隔離 context、限制工具、換 model 或縮小權限，就派 subagent。
      </Callout>
    </PageLayout>
  )
}
