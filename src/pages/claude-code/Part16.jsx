import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'

const hookEvents = [
  { event: 'PreToolUse', timing: '工具執行前', use: '白名單檢查、阻止危險指令、外部寫入前通知。' },
  { event: 'PostToolUse', timing: '工具執行後', use: '跑 lint / format / schema check，把結果回饋給 agent。' },
  { event: 'PreCompact', timing: '對話壓縮前', use: '把重要摘要、任務狀態或 audit trail 存到外部 artifact。' },
  { event: 'Stop', timing: '任務結束時', use: '產生交接摘要、更新 ticket、提醒 reviewer 做最後確認。' },
]

const hookBoundaries = [
  { lane: '適合做', detail: '安全白名單、格式檢查、輸出驗證、通知、report-only automation。' },
  { lane: '不適合做', detail: '把產品決策藏進 script、繞過 reviewer、直接替人批准外部寫入。' },
  { lane: '一定要記錄', detail: '被阻擋的 command、hook 產出的錯誤、外部系統 dry-run payload。' },
]

export default function Part16() {
  return (
    <PageLayout partIndex={9}>
      <SectionHeader partIndex={9} />

      <p className="text-slate-300 text-sm leading-relaxed mb-6">
        Hooks 值得獨立講，因為它不是單純的安全設定。它是把「工具呼叫前後應該發生的事」寫成可重用流程：
        檢查、阻擋、格式化、通知、稽核、產出 artifact。Permission / approval 決定 agent 能不能做；
        hooks 決定它做之前和做之後，系統要補上哪些流程閘門。
      </p>

      <H3>1. Hooks 是流程閘門，不是權限替代品</H3>
      <div className="grid grid-cols-1 gap-3 mb-5 md:grid-cols-3">
        {[
          { title: 'Permission', desc: '決定工具能不能執行，屬於權限邊界。' },
          { title: 'HITL', desc: '把資訊缺口、決策、盲點與高風險判斷交回人類。' },
          { title: 'Hooks', desc: '在工具呼叫前後自動跑檢查、記錄或通知。' },
        ].map(({ title, desc }) => (
          <div key={title} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="mb-2 text-sm font-semibold text-white">{title}</div>
            <p className="text-sm leading-relaxed text-slate-300">{desc}</p>
          </div>
        ))}
      </div>
      <Callout type="warn">
        Hook 是用你的環境執行 shell script。它可以降低操作失誤，也可能放大設定錯誤。
        所以 hook 要搭配最小權限、dry-run、log 和 human review，而不是拿來繞過 approval。
      </Callout>

      <H3>2. 常見事件點</H3>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03] text-xs text-slate-300 font-semibold">
          <span className="col-span-3">事件</span>
          <span className="col-span-3">時機</span>
          <span className="col-span-6">用途</span>
        </div>
        {hookEvents.map((item) => (
          <div key={item.event} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <code className="md:col-span-3 text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded font-mono text-xs">{item.event}</code>
            <span className="md:col-span-3 text-white">{item.timing}</span>
            <span className="md:col-span-6 text-slate-300 leading-relaxed">{item.use}</span>
          </div>
        ))}
      </div>

      <H3>3. 最小可用設定</H3>
      <CodeBlock title="settings.json — Hooks 範例">
{`{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": ".claude/hooks/block-dangerous-bash.sh"
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

      <p className="text-slate-300 text-sm leading-relaxed mb-3">
        Hook 會從 stdin 拿到工具參數，再用 exit code 決定結果。阻擋型 hook 要把原因寫到 stderr，
        讓 agent 能看懂為什麼被擋下來，並改用安全路徑。
      </p>
      <CodeBlock title=".claude/hooks/block-dangerous-bash.sh">
{`#!/bin/bash
set -euo pipefail

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

if echo "$CMD" | grep -qE 'rm\\s+-rf?\\s+/'; then
  echo "[BLOCKED] Refuse dangerous command: $CMD" >&2
  exit 2
fi

if echo "$CMD" | grep -qE 'git\\s+push'; then
  echo "[REVIEW] git push requires explicit human approval." >&2
  exit 2
fi

exit 0`}
      </CodeBlock>

      <H3>4. 把 hook 用在可回收的流程</H3>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {hookBoundaries.map((item) => (
          <div key={item.lane} className="grid grid-cols-1 gap-2 border-b border-white/5 px-4 py-3 text-sm last:border-0 md:grid-cols-[8rem_1fr]">
            <span className="font-medium text-white">{item.lane}</span>
            <span className="leading-relaxed text-slate-300">{item.detail}</span>
          </div>
        ))}
      </div>

      <Callout type="tip">
        對演練來說，hook 最有價值的地方不是炫技，而是讓現場流程穩定：
        外部寫入前擋住、Edit 後自動 lint、Stop 時產生 summary，讓學員看到「agent workflow 也可以工程化」。
      </Callout>

      <Callout type="info">
        Codex 沒有完全相同的 Claude Code hooks 設定語法；對等做法是 approval mode、AGENTS.md、可重跑 CLI、CI gate、
        或在任務中明確要求 preview / dry-run / report-only。概念相同：把高風險動作移到可檢查的流程邊界。
      </Callout>
    </PageLayout>
  )
}
