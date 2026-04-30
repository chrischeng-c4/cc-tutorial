import { useState } from 'react'
import { Link } from 'react-router-dom'

function SectionHeader({ part, time, title, subtitle, audience, accent = 'violet' }) {
  const colors = {
    violet: { bar: 'from-violet-400 to-purple-400', badge: 'bg-violet-500/20 text-violet-300', border: 'border-violet-500/20', bg: 'bg-violet-500/5' },
    sky:    { bar: 'from-sky-400 to-blue-400',      badge: 'bg-sky-500/20 text-sky-300',      border: 'border-sky-500/20',    bg: 'bg-sky-500/5' },
    amber:  { bar: 'from-amber-400 to-orange-400',  badge: 'bg-amber-500/20 text-amber-300',  border: 'border-amber-500/20',  bg: 'bg-amber-500/5' },
    emerald:{ bar: 'from-emerald-400 to-teal-400',  badge: 'bg-emerald-500/20 text-emerald-300', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
    rose:   { bar: 'from-rose-400 to-pink-400',     badge: 'bg-rose-500/20 text-rose-300',    border: 'border-rose-500/20',   bg: 'bg-rose-500/5' },
  }
  const c = colors[accent]
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-6 mb-8`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className={`w-1 h-10 rounded-full bg-gradient-to-b ${c.bar} inline-block flex-shrink-0`} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.badge}`}>{part}</span>
              <span className="text-slate-500 text-xs">{time}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {audience.map(a => (
            <span key={a} className="px-2.5 py-1 rounded-full text-xs border border-white/10 text-slate-400">{a}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function CodeBlock({ title, children }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(children.trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 mb-4 group">
      {title && (
        <div className="px-4 py-2 bg-white/[0.05] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="text-slate-400 text-xs ml-2">{title}</span>
          </div>
          <button onClick={copy} className="text-xs text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100">
            {copied ? '已複製 ✓' : '複製'}
          </button>
        </div>
      )}
      <pre className="bg-[#0d0d1a] p-5 text-sm text-emerald-300 font-mono overflow-x-auto leading-relaxed">
        {children}
      </pre>
    </div>
  )
}

function Callout({ type = 'info', children }) {
  const s = {
    info:  { style: 'border-sky-500/30 bg-sky-500/5',    icon: 'ℹ️', label: '說明' },
    warn:  { style: 'border-amber-500/30 bg-amber-500/5', icon: '⚠️', label: '注意' },
    tip:   { style: 'border-emerald-500/30 bg-emerald-500/5', icon: '💡', label: '技巧' },
    pm:    { style: 'border-pink-500/30 bg-pink-500/5',   icon: '📋', label: 'PM 視角' },
  }[type]
  return (
    <div className={`rounded-xl border p-4 text-sm leading-relaxed mb-4 ${s.style}`}>
      <span className="mr-2">{s.icon}</span>
      <span className="font-semibold text-white mr-2">{s.label}：</span>
      <span className="text-slate-300">{children}</span>
    </div>
  )
}

function CmdTable({ rows }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-6">
      {rows.map(({ cmd, desc }, i) => (
        <div key={i} className="flex items-start gap-4 px-5 py-3 border-b border-white/5 last:border-0">
          <code className="text-violet-300 text-sm font-mono whitespace-nowrap flex-shrink-0 bg-violet-500/10 px-2 py-1 rounded">{cmd}</code>
          <span className="text-slate-400 text-sm leading-relaxed pt-1">{desc}</span>
        </div>
      ))}
    </div>
  )
}

function PermBadge({ level }) {
  const s = {
    auto:    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    confirm: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    deny:    'bg-red-500/20 text-red-300 border-red-500/30',
  }[level]
  const label = { auto: '自動執行', confirm: '需要確認', deny: '預設拒絕' }[level]
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${s}`}>{label}</span>
}

export default function ClaudeCode() {
  return (
    <main className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Page header */}
        <div className="mb-16">
          <div className="inline-flex px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
            進階 · 03
          </div>
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">
            Claude Code<br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">AI 驅動的開發 CLI</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            一小時課程，從「它到底是什麼」到「在生產環境好好用它」。PM 看定位與影響，Dev 看操作與架構。
          </p>

          {/* TOC */}
          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">課程大綱</div>
            <div className="space-y-2">
              {[
                { part: 'Part 1', title: '破冰 + 定位', time: '10 min', color: 'text-sky-400' },
                { part: 'Part 2', title: 'PM 視角', time: '15 min', color: 'text-pink-400' },
                { part: 'Part 3', title: 'Dev 上手：基礎操作', time: '15 min', color: 'text-amber-400' },
                { part: 'Part 4', title: 'Dev 進階：Permission / Hooks / MCP', time: '15 min', color: 'text-emerald-400' },
                { part: 'Part 5', title: '實戰 Demo + 常見坑', time: '5 min', color: 'text-violet-400' },
              ].map(({ part, title, time, color }) => (
                <div key={part} className="flex items-center gap-3 text-sm">
                  <span className={`font-mono font-bold text-xs ${color} w-16 flex-shrink-0`}>{part}</span>
                  <span className="text-white">{title}</span>
                  <span className="text-slate-600 text-xs ml-auto">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PART 1 ── */}
        <SectionHeader
          part="Part 1" time="10 分鐘"
          title="破冰 + 定位"
          subtitle="它和你用過的 AI 工具有什麼本質差異？"
          audience={['PM', 'Dev']}
          accent="sky"
        />

        <p className="text-slate-400 leading-relaxed mb-6">
          市場上 AI coding 工具一堆，先搞清楚 Claude Code 站在哪個位置。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              name: 'GitHub Copilot',
              type: '補全工具',
              desc: '在 IDE 裡自動補完程式碼，以行或函式為單位。需要你自己駕駛，它只是副駕。',
              limit: '無法執行指令或讀取整個專案',
            },
            {
              name: 'Cursor',
              type: 'AI IDE',
              desc: 'VS Code 的 AI 強化版，在編輯器內整合 chat 和 inline edit。',
              limit: '綁定特定 IDE，跨工具整合較弱',
            },
            {
              name: 'Claude Code',
              type: 'Agentic CLI',
              desc: '跑在終端機，能讀寫檔案、執行指令、跑測試、操作 git，主動完成整個任務。',
              limit: '需要對 CLI 有基本熟悉度',
              highlight: true,
            },
          ].map(({ name, type, desc, limit, highlight }) => (
            <div key={name} className={`rounded-xl border p-5 ${highlight ? 'border-violet-500/40 bg-violet-500/10' : 'border-white/10 bg-white/[0.02]'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold text-sm">{name}</span>
                <span className="text-xs text-slate-500 border border-white/10 px-2 py-0.5 rounded-full">{type}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">{desc}</p>
              <p className="text-slate-600 text-xs">限制：{limit}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-6 mb-10">
          <h3 className="text-white font-semibold mb-3">一句話定義</h3>
          <p className="text-slate-300 leading-relaxed">
            Claude Code 是一個 <span className="text-sky-300 font-medium">Agentic CLI</span>——
            你給它一個目標，它自己去讀程式碼、規劃步驟、執行工具、觀察結果、反覆迭代，直到完成任務。
            你是 <span className="text-white font-medium">監督者</span>，不是駕駛員。
          </p>
        </div>

        {/* ── PART 2 ── */}
        <SectionHeader
          part="Part 2" time="15 分鐘"
          title="PM 視角：你需要知道什麼"
          subtitle="Dev 用了它之後，你的工作流程會怎麼變？"
          audience={['PM']}
          accent="rose"
        />

        <h3 className="text-white font-semibold mb-4">能做 vs 不能做</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="text-emerald-400 font-semibold text-sm mb-3 flex items-center gap-2">
              <span>✓</span> Claude Code 可以
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              {[
                '讀懂整個 repo 的結構',
                '修 bug、新增功能、重構程式碼',
                '撰寫並執行測試',
                '操作 git（diff、commit、branch）',
                '依照你的指示批次修改大量檔案',
                '解釋任何一段不熟悉的程式碼',
              ].map(t => <div key={t} className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>{t}</div>)}
            </div>
          </div>
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="text-red-400 font-semibold text-sm mb-3 flex items-center gap-2">
              <span>✗</span> Claude Code 不適合
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              {[
                '替代 Dev 的設計判斷與架構決策',
                '保證輸出程式碼 100% 正確（需要 review）',
                '處理沒有文字描述的視覺設計需求',
                '自動 push 到 production（需人工確認）',
                '永久記憶跨 session 的對話內容',
              ].map(t => <div key={t} className="flex items-start gap-2"><span className="text-red-500 mt-0.5 flex-shrink-0">•</span>{t}</div>)}
            </div>
          </div>
        </div>

        <h3 className="text-white font-semibold mb-4">成本概念：token 是什麼？</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          Token 是模型計費的基本單位，大約 1 個英文單字 = 1 token，1 個中文字 ≈ 1–2 tokens。
          Claude Code 的費用取決於你讓它讀了多少程式碼、輸出了多少內容。
        </p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { task: '解釋一個 function', cost: '~$0.001', level: 'low' },
            { task: '修一個中等 bug', cost: '~$0.01–0.05', level: 'mid' },
            { task: '新增一個完整功能', cost: '~$0.1–0.5', level: 'high' },
          ].map(({ task, cost, level }) => (
            <div key={task} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
              <div className={`text-lg font-bold mb-1 ${level === 'low' ? 'text-emerald-400' : level === 'mid' ? 'text-amber-400' : 'text-rose-400'}`}>{cost}</div>
              <div className="text-slate-400 text-xs">{task}</div>
            </div>
          ))}
        </div>

        <Callout type="pm">
          對 PM 來說最重要的影響：Dev 的「理解成本」大幅降低。以前要花 2 小時看懂陌生 code 才能動手，現在 5 分鐘。任務拆分可以更細，sprint 估點也需要重新校準。
        </Callout>

        <h3 className="text-white font-semibold mb-4 mt-8">工作流程的改變</h3>
        <div className="space-y-3 mb-10">
          {[
            { before: '需求文件寫完，等 Dev 理解需求', after: '需求可以直接貼給 Claude Code，它自己去看 code 再問問題' },
            { before: 'Code review 要花半天', after: 'Claude Code 可以先做初步 review，提出具體問題點' },
            { before: 'Bug 修完要等下一個 sprint', after: '簡單 bug 可能 10 分鐘內有 PR' },
          ].map(({ before, after }, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500 text-xs mb-1">以前</div>
                <div className="text-slate-400">{before}</div>
              </div>
              <div>
                <div className="text-emerald-400 text-xs mb-1">現在</div>
                <div className="text-slate-300">{after}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PART 3 ── */}
        <SectionHeader
          part="Part 3" time="15 分鐘"
          title="Dev 上手：基礎操作"
          subtitle="安裝、啟動、日常工作流程"
          audience={['Dev']}
          accent="amber"
        />

        <h3 className="text-white font-semibold mb-3">安裝與啟動</h3>
        <CodeBlock title="Terminal">
{`# 安裝（需要 Node.js 18+）
npm install -g @anthropic-ai/claude-code

# 啟動
claude

# 直接帶任務啟動（非互動模式）
claude "幫我解釋這個 repo 的架構"

# 查看版本
claude --version`}
        </CodeBlock>

        <Callout type="info">
          登入方式有兩種：用 Anthropic API Key（按量計費），或用 claude.ai Max 訂閱帳號登入（月費制）。團隊用建議申請 API Key 方便控管費用。
        </Callout>

        <h3 className="text-white font-semibold mb-3 mt-8">互動模式基本操作</h3>
        <CodeBlock title="對話範例">
{`$ claude
> 幫我解釋 src/auth/middleware.ts 做了什麼

# Claude 會自己讀檔案，不需要你貼程式碼

> 它有什麼安全疑慮嗎？

# 可以追問，它記得上文

> 幫我修掉你說的第二個問題

# 直接叫它動手改

> 現在跑一下測試看有沒有壞掉

# 它可以執行 npm test，並根據結果繼續調整`}
        </CodeBlock>

        <h3 className="text-white font-semibold mb-3 mt-8">Slash 指令速查</h3>
        <CmdTable rows={[
          { cmd: '/help',    desc: '列出所有可用指令' },
          { cmd: '/clear',   desc: '清空對話記憶，從零開始。切換不相關任務時用' },
          { cmd: '/compact', desc: '壓縮對話成摘要，保留脈絡但節省 token。長任務中途用' },
          { cmd: '/cost',    desc: '顯示這次對話累積的 token 用量與估算費用' },
          { cmd: '/config',  desc: '開啟設定，調整 permission、預設行為' },
          { cmd: '/init',    desc: '在當前專案自動生成 CLAUDE.md 草稿' },
          { cmd: '/doctor',  desc: '診斷環境問題（Node 版本、API 連線等）' },
        ]} />

        <h3 className="text-white font-semibold mb-3 mt-8">CLAUDE.md：給 Claude 的工作說明書</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          放在專案根目錄，commit 進 repo，整個團隊共用。Claude Code 每次啟動都會讀取。
        </p>
        <CodeBlock title="CLAUDE.md 範例">
{`# 專案說明
這是一個 Next.js 14 + TypeScript 的電商後台管理系統。

# 常用指令
- npm run dev        開發伺服器
- npm test           單元測試（Vitest）
- npm run typecheck  TypeScript 型別檢查
- npm run lint       ESLint

# 程式碼規範
- 所有回答請使用繁體中文
- 使用 TypeScript strict mode，不允許 any
- API response 統一格式：{ data, error, meta }
- 元件用 function component + hooks，不用 class component

# 重要限制
- 不要修改 /migrations 目錄下的任何檔案
- 不要直接操作 production 的環境變數
- 送出 commit 前請先確認有沒有遺留 console.log`}
        </CodeBlock>

        <Callout type="tip">
          用 /init 讓 Claude 自動分析你的 repo 生成初版 CLAUDE.md，再人工微調，比從頭寫快很多。
        </Callout>

        {/* ── PART 4 ── */}
        <SectionHeader
          part="Part 4" time="15 分鐘"
          title="Dev 進階：Permission · Hooks · MCP"
          subtitle="讓 Claude Code 在生產環境可靠地運作"
          audience={['Dev']}
          accent="emerald"
        />

        <h3 className="text-white font-semibold mb-4">Permission Model</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          Claude Code 依操作風險分三個層級，你可以在 <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">/config</code> 或 <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">settings.json</code> 調整。
        </p>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-6">
          {[
            { op: '讀取檔案', perm: 'auto',    example: 'Read src/index.ts' },
            { op: '修改檔案', perm: 'auto',    example: 'Edit src/utils.ts' },
            { op: '執行指令', perm: 'confirm', example: 'npm run build' },
            { op: 'git commit', perm: 'confirm', example: 'git commit -m "..."' },
            { op: 'git push',  perm: 'confirm', example: 'git push origin main' },
            { op: '刪除檔案', perm: 'confirm', example: 'rm -rf dist/' },
            { op: '網路請求', perm: 'deny',    example: 'curl external-api.com' },
          ].map(({ op, perm, example }) => (
            <div key={op} className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0">
              <span className="text-white text-sm w-28 flex-shrink-0">{op}</span>
              <PermBadge level={perm} />
              <code className="text-slate-500 text-xs font-mono ml-auto">{example}</code>
            </div>
          ))}
        </div>

        <Callout type="warn">
          autoApprove 模式可以讓所有操作免確認，開發速度快很多——但在不熟悉的 repo 或 production 環境不建議開啟。
        </Callout>

        <h3 className="text-white font-semibold mb-4 mt-8">Hooks：在工具呼叫前後插入邏輯</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          Hooks 讓你在 Claude Code 執行工具的前後，插入自己的 shell script。可以用來做安全檢查、通知、日誌記錄。
        </p>
        <CodeBlock title="settings.json — Hooks 設定範例">
{`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "echo '[HOOK] 即將執行指令，請確認安全性' >&2"
        }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [{
          "type": "command",
          "command": "npm run lint --silent 2>&1 | head -20"
        }]
      }
    ]
  }
}`}
        </CodeBlock>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { event: 'PreToolUse',  icon: '🔒', desc: '工具執行前。可以用來做白名單檢查、阻止危險指令、發送 Slack 通知。' },
            { event: 'PostToolUse', icon: '✅', desc: '工具執行後。可以自動跑 lint、格式化、測試，把結果回饋給 Claude。' },
            { event: 'PreCompact',  icon: '📦', desc: '對話被壓縮前。可以把完整對話歷史存到外部系統留底。' },
            { event: 'Stop',        icon: '🏁', desc: 'Claude 完成任務時觸發。可以自動開 PR、發通知、更新 ticket 狀態。' },
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

        <h3 className="text-white font-semibold mb-4">MCP：擴充 Claude Code 的工具能力</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          MCP（Model Context Protocol）是 Anthropic 制定的標準，讓 Claude Code 可以連接外部服務，
          例如 Jira、Slack、資料庫、內部 API——讓它的工具箱不只限於本機檔案系統。
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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
        <CodeBlock title="新增 MCP Server（.claude/settings.json）">
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

        {/* ── PART 5 ── */}
        <SectionHeader
          part="Part 5" time="5 分鐘"
          title="實戰 Demo + 常見坑"
          subtitle="一個完整 workflow，以及你一定會遇到的問題"
          audience={['PM', 'Dev']}
          accent="violet"
        />

        <h3 className="text-white font-semibold mb-4">完整 Workflow Demo</h3>
        <CodeBlock title="從需求到 PR — 完整流程">
{`# 1. 確保 git 狀態乾淨（重要！）
git status          # 確認沒有未提交的改動
git checkout -b feature/add-export-api

# 2. 啟動 Claude Code
claude

# 3. 描述需求（越清楚越好）
> 我需要新增一個 GET /api/reports/export 端點
> 回傳過去 30 天的訂單數據，格式為 CSV
> 需要驗證 JWT，只有 admin role 可以使用
> 參考現有的 /api/reports/summary 的實作風格

# 4. Claude 開始工作：讀程式碼 → 規劃 → 實作 → 跑測試

# 5. Review 它的改動
git diff

# 6. 有問題繼續調整
> 欄位順序改成 date, order_id, amount, status
> 幫我補上 edge case 的測試：空資料的情況

# 7. 確認沒問題，叫它開 PR
> 幫我 commit 並開一個 PR，標題和描述用繁體中文`}
        </CodeBlock>

        <h3 className="text-white font-semibold mb-4 mt-8">常見坑與解法</h3>
        <div className="space-y-3 mb-8">
          {[
            {
              icon: '💸',
              problem: 'Token 用量爆炸',
              solution: '長任務中途用 /compact 壓縮。不要把整個 repo 都丟給它，用明確的路徑縮小範圍。',
            },
            {
              icon: '🌀',
              problem: 'Claude 一直改來改去，沒有收斂',
              solution: '給更明確的驗收條件：「測試全部過就算完成」。或用 /clear 重新開，這次的 prompt 寫更清楚。',
            },
            {
              icon: '😱',
              problem: '它動了你不想讓它動的檔案',
              solution: '用 git diff 確認，git checkout <file> 還原單一檔案。預防方式：在 CLAUDE.md 列出禁止修改的路徑。',
            },
            {
              icon: '🤦',
              problem: '生成的程式碼風格和現有 code 不一致',
              solution: '在 CLAUDE.md 裡加上規範。或在 prompt 裡說「參考 src/xxx.ts 的風格」，給它明確範例。',
            },
            {
              icon: '🔁',
              problem: '同樣的錯誤修了又出現',
              solution: '把這個規則寫進 CLAUDE.md，讓每次 session 都套用，不要只靠對話記憶。',
            },
          ].map(({ icon, problem, solution }) => (
            <div key={problem} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex gap-4">
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div>
                <div className="text-white font-semibold text-sm mb-1">{problem}</div>
                <div className="text-slate-400 text-sm leading-relaxed">{solution}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10">
          <Link to="/agent" className="text-slate-400 hover:text-white transition-colors no-underline text-sm">
            ← Agent 概念
          </Link>
          <Link to="/" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium transition-all no-underline text-sm">
            回到首頁
          </Link>
        </div>
      </div>
    </main>
  )
}
