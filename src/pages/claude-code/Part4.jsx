import { PageLayout, SectionHeader, CodeBlock, Callout, PermBadge, H3 } from '../../components/cc/shared'

export default function Part4() {
  return (
    <PageLayout partIndex={3}>
      <SectionHeader partIndex={3} />

      <H3>Permission Model</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Claude Code 依操作風險分三個層級，可在{' '}
        <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">/config</code> 或{' '}
        <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">settings.json</code> 調整。
      </p>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {[
          { op: '讀取檔案',   perm: 'auto',    example: 'Read src/index.ts' },
          { op: '修改檔案',   perm: 'auto',    example: 'Edit src/utils.ts' },
          { op: '執行指令',   perm: 'confirm', example: 'npm run build' },
          { op: 'git commit', perm: 'confirm', example: 'git commit -m "..."' },
          { op: 'git push',   perm: 'confirm', example: 'git push origin main' },
          { op: '刪除檔案',   perm: 'confirm', example: 'rm -rf dist/' },
          { op: '網路請求',   perm: 'deny',    example: 'curl external-api.com' },
        ].map(({ op, perm, example }) => (
          <div key={op} className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0">
            <span className="text-white text-sm w-24 flex-shrink-0">{op}</span>
            <PermBadge level={perm} />
            <code className="text-slate-500 text-xs font-mono ml-auto hidden sm:block">{example}</code>
          </div>
        ))}
      </div>

      <Callout type="warn">
        autoApprove 模式讓所有操作免確認，開發速度快很多——但在不熟悉的 repo 或接近 production 的環境下不建議開啟。
      </Callout>

      <H3>Hooks：在工具呼叫前後插入邏輯</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Hooks 讓你在 Claude Code 執行工具的前後插入自己的 shell script，可以做安全檢查、自動 lint、發送通知。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {[
          { event: 'PreToolUse',  icon: '🔒', desc: '工具執行前。白名單檢查、阻止危險指令、發 Slack 通知。' },
          { event: 'PostToolUse', icon: '✅', desc: '工具執行後。自動跑 lint / 格式化，把結果回饋給 Claude。' },
          { event: 'PreCompact',  icon: '📦', desc: '對話壓縮前。把完整對話歷史存到外部系統留底。' },
          { event: 'Stop',        icon: '🏁', desc: 'Claude 完成任務時觸發。自動開 PR、更新 Jira ticket。' },
        ].map(({ event, icon, desc }) => (
          <div key={event} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span>{icon}</span>
              <code className="text-emerald-300 text-sm">{event}</code>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
      <CodeBlock title="settings.json — Hooks 範例">
{`{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "echo '[HOOK] 即將執行指令' >&2"
      }]
    }],
    "PostToolUse": [{
      "matcher": "Edit",
      "hooks": [{
        "type": "command",
        "command": "npm run lint --silent 2>&1 | head -20"
      }]
    }]
  }
}`}
      </CodeBlock>

      <H3>MCP：擴充 Claude Code 的工具能力</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        MCP（Model Context Protocol）是 Anthropic 制定的開放標準，讓 Claude Code 連接外部服務——
        資料庫、Jira、Slack、內部 API——工具箱不只限於本機檔案系統。
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { icon: '🗄️', name: 'Database', desc: '直接查詢 Postgres / MySQL' },
          { icon: '📋', name: 'Jira',     desc: '讀取 ticket、更新狀態' },
          { icon: '💬', name: 'Slack',    desc: '傳送通知、讀取訊息' },
          { icon: '🔍', name: 'Search',   desc: '呼叫 Brave / Tavily 搜尋' },
        ].map(({ icon, name, desc }) => (
          <div key={name} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <div className="text-2xl mb-2">{icon}</div>
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

      <Callout type="tip">
        MCP server 加好後，你可以直接對 Claude Code 說「查一下 users 表最近 100 筆資料」，它會自動呼叫 MCP 工具，不需要你手動貼查詢結果。
      </Callout>
    </PageLayout>
  )
}
