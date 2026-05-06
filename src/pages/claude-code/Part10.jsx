import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'

const toolInterfaceRows = [
  {
    question: '一次性、臨時查資料',
    cli: '用 CLI / script。直接跑公司既有 command，輸出存檔再讓 agent 讀。',
    mcp: '通常不值得。MCP server 的設定、權限、維護成本會高於收益。',
  },
  {
    question: '會重複使用的外部系統',
    cli: '先用 CLI / export / API script 做 MVP，驗證輸入輸出、權限邊界與 review 流程。',
    mcp: '等流程穩定再產品化。JIRA、Figma、Docs、Calendar、DB 這類常用資料源，接成 MCP 會比長期 copy-paste 穩定。',
  },
  {
    question: '需要團隊共用',
    cli: '把 CLI 放 repo，讓人、CI、Claude Code、Codex 都能跑；demo 時最可靠。',
    mcp: '用 project scope 的 `.mcp.json` 或插件化配置，但 credentials 不要 commit。',
  },
  {
    question: '會寫入或改狀態',
    cli: '先做 dry-run、preview、人工確認，再逐步開寫入；現場 demo 可停在 reviewable 檔案。',
    mcp: '先做 read-only。寫入工具要設明確 permission、audit log 與 HITL checkpoint。',
  },
  {
    question: '嚴格固定輸出格式',
    cli: '適合。用 generator / formatter / validator 保證 JSON、CSV、Markdown frontmatter、payload schema。',
    mcp: '適合產品化。讓 tool schema、server-side validation、dry-run preview 擋掉不合法輸入。',
  },
]

const interfaceModes = [
  {
    name: 'CLI / Script',
    tag: '可重跑的本機介面',
    tone: 'border-cyan-500/20 bg-cyan-500/5',
    tagTone: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
    points: [
      '本機已有 command 可用，例如 gh、jira、gcloud、內部 script',
      '流程還在探索期，輸入輸出格式可能一直改',
      '需要很清楚地看到每一步 command 與 stdout',
      '需要固定格式時，用 script 產生與驗證，不靠 agent 手寫',
      '適合把外部資料匯出成 Markdown / JSON，供 review 與重跑',
    ],
  },
  {
    name: 'MCP',
    tag: '穩定後再產品化',
    tone: 'border-violet-500/20 bg-violet-500/5',
    tagTone: 'bg-violet-500/10 text-violet-300 border-violet-500/25',
    points: [
      '同一個外部系統會被多個 demo / task 反覆查詢',
      '想讓 agent 透過 resources、tools、prompts 使用系統能力',
      '需要工具 schema、server-side validation、dry-run preview 保證格式',
      '需要 OAuth、team scope、工具 discoverability 或跨 client 共用',
      '想減少貼資料進對話，改成按需讀取外部資料',
      '流程已經穩定，值得投資 server 設定、權限與維護成本',
    ],
  },
]

const instructionLayers = [
  {
    layer: 'Tool interface',
    role: 'CLI 或 MCP',
    detail: '真正負責讀資料、跑 command、呼叫外部系統、產生可 review 的輸出。',
  },
  {
    layer: 'Skill',
    role: '受控 prompt injection',
    detail: '把操作規則、路由條件、輸出格式、HITL checkpoint 注入 agent context。Claude Code 會透過 Skill tool 載入它，但它不是 CLI/MCP 那種外部系統介面。',
  },
  {
    layer: 'Main thread',
    role: '整合與決策',
    detail: '讀需求、選用 Skill、決定 CLI 或 MCP，整合必要摘要，最後要求人確認再寫入外部系統。',
  },
]

const skillRoutingRules = [
  {
    route: '選 CLI',
    when: '需要可重跑、可測試、可攜帶的資料處理或 dry-run',
    example: '產週報資料、匯出 JIRA 清單、把 API 回應轉成 Markdown',
  },
  {
    route: '選 MCP',
    when: '需要讀取已授權的外部系統，而且資料應該按需查詢',
    example: '查 Google Docs、JIRA、Figma、Calendar、DB 的最新狀態',
  },
  {
    route: '派 subagent',
    when: '需要大量搜尋、平行 review、或不想污染 main thread context',
    example: '掃 repo 找相關模組、整理測試失敗清單、比較多份文件',
  },
  {
    route: '寫外部儲存',
    when: '產出、決策、review 結果會被後續任務引用',
    example: '寫到 tmp/report.md、PR comment、JIRA ticket、Google Doc',
  },
  {
    route: '呼叫格式工具',
    when: '下游系統要求固定格式，錯一個欄位就會失敗',
    example: '用 scripts/report render + validate，或呼叫 MCP tool 產 dry-run payload',
  },
]

export default function Part10() {
  return (
    <PageLayout partIndex={9}>
      <SectionHeader partIndex={9} />

      <p className="text-slate-400 leading-relaxed mb-8">
        <span className="font-mono text-slate-300">token-context-economics</span> 說 context 不是資料庫。
        要做到「外部儲存優先」，就要分清楚兩個層次：
        <span className="text-white font-medium"> CLI 與 MCP 是對標的工具介面</span>；
        <span className="text-white font-medium"> Skill 是受控 prompt injection / 指令注入</span>，
        負責告訴 agent 什麼時候用哪個介面、輸出要放哪裡、哪些步驟要人確認。
      </p>

      <Callout type="tip">
        時間不夠時，MCP 可以先用 CLI / export / API script 替代。只要能拿資料、產 dry-run payload、
        驗證格式、留下 reviewable 檔案，就足以完成教學 demo。MCP 留給穩定、重複、需要共用工具協定的流程。
      </Callout>

      <H3>1. CLI vs MCP：同一層的工具介面</H3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {interfaceModes.map((mode) => (
          <div key={mode.name} className={`rounded-xl border p-4 ${mode.tone}`}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="text-white font-semibold">{mode.name}</div>
              <span className={`rounded-full border px-2.5 py-1 text-xs ${mode.tagTone}`}>{mode.tag}</span>
            </div>
            <div className="grid gap-2">
              {mode.points.map((point) => (
                <div key={point} className="flex gap-2 text-sm leading-relaxed text-slate-300">
                  <span className="text-slate-500">→</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] mb-5">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="px-4 py-3 text-left font-semibold text-slate-400">情境</th>
              <th className="px-4 py-3 text-left font-semibold text-cyan-300">CLI / Script</th>
              <th className="px-4 py-3 text-left font-semibold text-violet-300">MCP</th>
            </tr>
          </thead>
          <tbody>
            {toolInterfaceRows.map((row) => (
              <tr key={row.question} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 align-top text-white">{row.question}</td>
                <td className="px-4 py-3 align-top text-slate-400 leading-relaxed">{row.cli}</td>
                <td className="px-4 py-3 align-top text-slate-400 leading-relaxed">{row.mcp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="info">
        不要把 Skill 放進 CLI vs MCP 的表格裡。Skill 在 Claude Code 裡是既有的 tool，
        用來執行 prompt-based workflow；但它不負責連外部系統、不負責跑 command。
        它是注入到 agent context 的操作說明，讓 agent 知道該選 CLI、MCP、subagent，或把結果寫回外部儲存。
      </Callout>

      <H3>2. Skill：受控的 prompt injection</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        這裡的 prompt injection 不是惡意攻擊，而是你授權的指令注入：把團隊規則、路由邏輯、輸出格式、
        風險檢查與 HITL checkpoint 放進 agent 的 context。它的好處是跨 session、跨工具重用；限制是仍然佔 context，
        而且不會自動讓外部資料變正確。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {instructionLayers.map((item) => (
          <div key={item.layer} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-emerald-300 text-xs font-semibold uppercase tracking-wide mb-2">{item.layer}</div>
            <div className="text-white font-semibold text-sm mb-2">{item.role}</div>
            <p className="text-slate-400 text-sm leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03] text-xs text-slate-500 font-semibold">
          <span className="col-span-3">Skill 注入的規則</span>
          <span className="col-span-5">何時使用</span>
          <span className="col-span-4">例子</span>
        </div>
        {skillRoutingRules.map((item) => (
          <div key={item.route} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <span className="md:col-span-3 text-emerald-300 font-medium">{item.route}</span>
            <span className="md:col-span-5 text-slate-400 leading-relaxed">{item.when}</span>
            <span className="md:col-span-4 text-slate-500 leading-relaxed">{item.example}</span>
          </div>
        ))}
      </div>

      <H3>3. 固定格式：不要只靠 agent 乖乖照 prompt</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Prompt、Skill、CLAUDE.md / AGENTS.md 都是「指令」；agent 多半會遵守，但不能把它當 parser、formatter 或 validator。
        只要輸出會被機器吃進去，就把格式契約做成工具：script / CLI / MCP 產生 payload、驗證 schema、提供 dry-run preview。
      </p>
      <CodeBlock title="格式契約：讓 agent 呼叫工具，不要手刻 JSON">
{`# 反例：要求 agent 手寫一段完全正確的 JSON payload
> 請產生 Jira bulk create JSON，必須符合 schema，不要漏欄位。

# 較好的做法：格式由 CLI 保證
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
      <Callout type="warn">
        固定格式的正確做法是「agent 負責判斷與修資料，程式負責格式與驗證」。
        例如 CSV 欄位順序、JSON schema、JIRA payload、Google Sheets 欄位、PR comment 模板，都應該有可重跑的 formatter / validator。
      </Callout>

      <H3>4. 外部儲存優先的 Skill 範例</H3>
      <CodeBlock title="CLI 先產可 review 的外部檔案">
{`# 先做一個可 review、可重跑的 script
scripts/jira-weekly-report --project SHOP --since 2026-05-01 --format markdown \
  > tmp/weekly-report.md

# 再讓 agent 讀必要摘要，不把整份 JIRA 匯出塞進 context
claude "讀 tmp/weekly-report.md，依 docs/templates/weekly.md 產出草稿。
請標出資料缺口與需要人工確認的地方。"`}
      </CodeBlock>
      <CodeBlock title="Skill 作為指令注入層">
{`# .claude/skills/weekly-report/SKILL.md
---
name: weekly-report
description: Produce an internal weekly report from Jira and Sheets exports. Use when the user asks for weekly report drafting or status summary.
---

# Weekly Report

1. Treat context as working memory, not storage.
2. If data must be exported, write it to tmp/weekly-report.md or tmp/weekly-report.json.
3. Choose the tool interface:
   - Use CLI when the workflow is still changing or needs dry-run output.
   - Use MCP when current Jira status is needed and Jira MCP is available.
4. For strict output formats, call the project formatter / validator. Do not hand-write machine payloads.
5. Read only the sections needed for the draft.
6. Write the draft to docs/status/weekly-report.md.
7. If repository-wide impact analysis is needed, ask the main thread to spawn a read-only subagent.
8. Mark missing data and HITL questions. Do not send messages or update tickets without approval.`}
      </CodeBlock>
      <Callout type="tip">
        這個 pattern 的重點不是「Skill + CLI 比 MCP 好」，而是把層次分清楚：
        Skill 注入工作規則；CLI 或 MCP 負責拿資料；檔案、PR、JIRA、Docs 承接重要狀態。
        Main thread 只讀必要摘要。
      </Callout>

      <H3>5. MCP：穩定外部系統才產品化</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        MCP（Model Context Protocol）讓支援的 agent client 連接外部服務：資料庫、Jira、Slack、內部 API。
        重點不在「Claude 會 SQL」，而是把外部資料接成有權限、有 schema、有生命週期管理的工具。
        課程準備時不用先追求 MCP 完整度；先用 CLI 替代跑通資料流，確認值得重複使用後再接成 MCP。
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { icon: 'DB', name: 'Database', desc: '直接查詢 Postgres / MySQL' },
          { icon: 'JI', name: 'Jira',     desc: '讀取 ticket、更新狀態' },
          { icon: 'SL', name: 'Slack',    desc: '傳送通知、讀取訊息' },
          { icon: 'SE', name: 'Search',   desc: '呼叫 Brave / Tavily 搜尋' },
        ].map(({ icon, name, desc }) => (
          <div key={name} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs font-bold text-emerald-300">{icon}</div>
            <div className="text-white font-semibold text-sm mb-1">{name}</div>
            <div className="text-slate-500 text-xs">{desc}</div>
          </div>
        ))}
      </div>
      <CodeBlock title=".claude/settings.json — 新增 MCP Server">
{`{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://localhost/mydb"
      }
    }
  }
}`}
      </CodeBlock>

      <Callout type="warn">
        MCP server 是新的攻擊面。連第三方或內部 MCP 前，要確認資料權限、輸出 token 上限、是否會讀到敏感資料、
        以及工具是否會被不可信內容的 prompt injection 誘導做錯事。寫入型 MCP 一律先從 read-only 或 dry-run 開始。
      </Callout>
    </PageLayout>
  )
}
