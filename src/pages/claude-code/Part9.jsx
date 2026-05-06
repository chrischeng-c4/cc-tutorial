import { PageLayout, SectionHeader, CodeBlock, Callout, PermBadge, H3 } from '../../components/cc/shared'

export default function Part9() {
  return (
    <PageLayout partIndex={8}>
      <SectionHeader partIndex={8} />

      <H3>Permission Model</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Claude Code 與 Codex 都有權限邊界：讀檔、改檔、執行指令、網路請求、寫入外部系統的風險不同。
        Claude Code 依操作風險分層，可在{' '}
        <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">/config</code> 或{' '}
        <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">settings.json</code> 調整；
        Codex 則用 approval modes 控制讀寫與 command 執行。
      </p>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {[
          { op: '讀取檔案',   perm: 'auto',    example: 'Read src/index.ts' },
          { op: '修改檔案',   perm: 'confirm', example: 'Edit src/utils.ts' },
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
        表格是保守預設；實際行為會依 permission / approval mode 改變。
        autoApprove / 寬鬆 approval 模式會跳過確認步驟，但風險也會上升；在不熟悉的 repo 或接近 production 的環境下不建議開啟。
      </Callout>

      <H3>Hooks：在工具呼叫前後插入邏輯</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Hooks 是 Claude Code 的流程擴充點，讓你在工具呼叫前後插入自己的 shell script，可以做安全檢查、自動 lint、發送通知。
        Codex 這一側的對等概念是 approval mode + AGENTS.md + 可重跑的 CLI / CI gate。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {[
          { event: 'PreToolUse',  icon: '🔒', desc: '工具執行前。白名單檢查、阻止危險指令、發 Slack 通知。' },
          { event: 'PostToolUse', icon: '✅', desc: '工具執行後。可跑 lint / 格式化，把結果回饋給 Claude。' },
          { event: 'PreCompact',  icon: '📦', desc: '對話壓縮前。把完整對話歷史存到外部系統留底。' },
          { event: 'Stop',        icon: '🏁', desc: 'Claude 完成任務時觸發。可串接開 PR、更新 Jira ticket 等流程。' },
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

      <Callout type="info">
        這章只處理「工具呼叫邊界」。下一章再談 CLI vs MCP、Skill 作為指令注入，以及如何把外部資料按需拉進來，
        不把整份外部資料塞進 context。
      </Callout>
    </PageLayout>
  )
}
