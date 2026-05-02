import { PageLayout, SectionHeader, CodeBlock, Callout, PermBadge, H3 } from '../../components/cc/shared'

export default function Part9() {
  return (
    <PageLayout partIndex={8}>
      <SectionHeader partIndex={8} />

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
        "command": ".claude/hooks/block-rm-rf.sh"
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

      <p className="text-slate-400 text-sm leading-relaxed mb-3">
        Hook 不是只能 echo——它接受 stdin 拿到工具參數，回 exit code 決定要不要放行。
        下面是實際攔截 <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">rm -rf</code> 的樣子：
      </p>
      <CodeBlock title=".claude/hooks/block-rm-rf.sh">
{`#!/bin/bash
# Hook 從 stdin 收到 JSON：{ "tool_input": { "command": "..." } }
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command')

if echo "$CMD" | grep -qE 'rm\\s+-rf?\\s+/'; then
  echo "[BLOCKED] 拒絕執行：$CMD" >&2
  exit 2   # exit 2 = 阻擋，把 stderr 訊息回給 Claude
fi
exit 0`}
      </CodeBlock>
      <div className="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs leading-relaxed mb-5">
        <div className="text-slate-500 mb-2">{'// 實際對話中看到的樣子'}</div>
        <div className="text-emerald-300">{'> 幫我清掉 /tmp 下所有舊檔案'}</div>
        <div className="text-slate-400 mt-2">{'⏺ Bash(rm -rf /tmp/*)'}</div>
        <div className="text-rose-300 ml-4">{'⎿  [BLOCKED] 拒絕執行：rm -rf /tmp/*'}</div>
        <div className="text-slate-400 mt-2">{'我被 PreToolUse hook 擋下來了。改用更安全的寫法：'}</div>
        <div className="text-slate-400">{'⏺ Bash(find /tmp -mtime +30 -type f -delete)'}</div>
        <div className="text-emerald-300 ml-4">{'⎿  ✓'}</div>
      </div>
      <Callout type="warn">
        <span className="font-semibold">權限升級風險</span>：autoApprove + 自訂 hook 的組合會放大盲點。
        Hook 是 Claude Code 用你的身份執行的 shell script——惡意或寫壞的 hook 可以做任何 shell 能做的事，
        而且 Claude 看不到 hook 內部行為。記住 Agent 概念講過的 minimum permission：
        hook 寫好白名單再開 autoApprove，不要反過來。
      </Callout>

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

      <p className="text-slate-400 text-sm leading-relaxed mb-3">
        加好 MCP server 後，Claude 把它當成多了一組 tool，自然語言就能呼叫：
      </p>
      <div className="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs leading-relaxed mb-5">
        <div className="text-emerald-300">{'> 查一下 users 表最近 100 筆註冊資料，看有沒有異常 email'}</div>
        <div className="text-slate-400 mt-2">{'⏺ postgres:query(SELECT id, email, created_at FROM users'}</div>
        <div className="text-slate-400 ml-12">{'             ORDER BY created_at DESC LIMIT 100)'}</div>
        <div className="text-emerald-300 ml-4 mt-1">{'⎿  100 rows · 0.12s'}</div>
        <div className="text-slate-400 mt-2">{'看到 12 筆 email 都來自 @tempmail.io 這個 disposable domain，'}</div>
        <div className="text-slate-400">{'集中在過去 6 小時內註冊。要幫你寫一個 migration 把這批標記為 suspicious 嗎？'}</div>
      </div>
      <Callout type="tip">
        重點不在「Claude 會 SQL」——而是 MCP 把外部資料當成第一級 tool。Claude 自己選工具、執行、引用結果繼續推理，
        不需要你手動 copy-paste。<span className="font-semibold">「為什麼選 MCP 而不是自寫 tool」</span>：
        MCP server 跨 Claude Code / Claude Desktop / 其他 client 都能用，且權限與生命週期由 client 統一管理。
      </Callout>
    </PageLayout>
  )
}
