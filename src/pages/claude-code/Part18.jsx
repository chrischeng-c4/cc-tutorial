import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'

const mcpReadiness = [
  { item: '流程穩定', desc: '大家已經知道要查哪些資料、輸出什麼格式、錯誤怎麼處理。' },
  { item: '多人共用', desc: '不是單次演練，而是多個任務、多人、跨 client 都會用。' },
  { item: '權限清楚', desc: '知道哪些 tool read-only、哪些 tool 會寫入、誰能批准。' },
  { item: 'schema 明確', desc: 'tool input/output 有結構，server 可以驗證，不靠 prompt 約定。' },
]

export default function Part18() {
  return (
    <PageLayout partIndex={12}>
      <SectionHeader partIndex={12} />

      <p className="text-slate-300 leading-relaxed mb-8">
        MCP 適合把穩定外部系統做成 agent 可發現、可授權、可驗證的工具協定。
        它不是每個演練的第一步。當流程還在摸索，CLI / export / API script 更快；
        當流程已經穩定，MCP 才值得投入設定、權限與維護成本。
      </p>

      <H3>1. 什麼時候值得做 MCP</H3>
      <div className="grid grid-cols-1 gap-3 mb-5 md:grid-cols-2">
        {mcpReadiness.map((item) => (
          <div key={item.item} className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <div className="text-white text-sm font-semibold mb-2">{item.item}</div>
            <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <H3>2. MCP 的安全順序</H3>
      <ol className="list-none m-0 p-0 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {[
          ['Read-only', '先只讀外部資料，確認資料範圍與 token 成本。'],
          ['Schema', '用 tool schema 和 server-side validation 限制輸入輸出。'],
          ['Dry-run', '寫入型 tool 先輸出 preview payload，不直接改外部系統。'],
          ['Write tool', '只有在 HITL 批准後才開寫入。'],
          ['Audit', '記錄誰觸發、輸入、輸出、外部系統回應。'],
        ].map(([step, desc]) => (
          <li key={step} className="grid grid-cols-1 gap-2 border-b border-white/5 px-4 py-3 text-sm last:border-0 md:grid-cols-[8rem_1fr]">
            <span className="font-medium text-violet-300">{step}</span>
            <span className="leading-relaxed text-slate-300">{desc}</span>
          </li>
        ))}
      </ol>

      <H3>3. MCP 設定範例</H3>
      <CodeBlock title=".claude/settings.json — 新增 MCP Server">
{`{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": ["tools/mcp-jira/server.js"],
      "env": {
        "JIRA_BASE_URL": "https://jira.example.com",
        "JIRA_TOKEN": "$JIRA_TOKEN"
      }
    }
  }
}`}
      </CodeBlock>

      <Callout type="warn">
        MCP server 是新的攻擊面。連第三方或內部 MCP 前，要確認資料權限、輸出 token 上限、是否會讀到敏感資料，
        以及工具是否會被不可信內容的 prompt injection 誘導做錯事。寫入型 MCP 一律先從 read-only 或 dry-run 開始。
      </Callout>
    </PageLayout>
  )
}
