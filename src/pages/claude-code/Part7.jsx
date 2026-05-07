import { PageLayout, SectionHeader, CodeBlock, Callout, CmdTable, H3 } from '../../components/cc/shared'

const commonToolRows = [
  {
    task: '讀檔 / 探索 repo',
    claude: 'Read、Glob、Grep、LSP',
    codex: 'CLI shell 裡跑 rg / ls / sed / cat，或讓 Codex 在 sandbox 內讀 workspace',
  },
  {
    task: '修改檔案',
    claude: 'Edit、Write、NotebookEdit',
    codex: '產生 patch / diff，套用到 workspace；CLI 也有 codex apply',
  },
  {
    task: '執行 command',
    claude: 'Bash、PowerShell',
    codex: '在 sandbox / approval policy 控制下執行 shell command',
  },
  {
    task: '背景監看 / 排程',
    claude: 'Monitor、CronCreate / CronList / CronDelete',
    codex: '長命令 session / output polling；排程通常接 shell / CI / 外部 scheduler',
  },
  {
    task: '需求釐清',
    claude: 'AskUserQuestion',
    codex: 'structured clarification、approval prompt、plan review',
  },
  {
    task: '讀外部文件 / 網路',
    claude: 'WebFetch、WebSearch（依環境與設定）',
    codex: '--search 開啟 Responses web_search；或用 MCP / CLI 拉外部資料',
  },
  {
    task: '外部系統工具',
    claude: 'MCP tools、ListMcpResourcesTool、ReadMcpResourceTool',
    codex: 'codex mcp 管理 MCP server；也可用 CLI script 做同一層工具介面',
  },
  {
    task: '任務追蹤 / 委派',
    claude: 'Agent、TaskCreate / TaskList / TaskUpdate、TodoWrite',
    codex: '內部 plan / todo、codex exec、codex review；cloud task 只作補充入口',
  },
  {
    task: '技能 / 協作',
    claude: 'Skill、TeamCreate / TeamDelete、SendMessage',
    codex: 'AGENTS.md、plugin；技能類規則仍是 instruction layer',
  },
]

const claudeToolGroups = [
  {
    cat: '檔案 / 搜尋 / code intelligence',
    tools: ['Read', 'Glob', 'Grep', 'LSP'],
    desc: '讀檔、找檔名 pattern、跨檔搜尋；LSP 可跳定義、找 references、回報型別錯誤。LSP 需要安裝 code intelligence plugin。',
  },
  {
    cat: '編輯',
    tools: ['Edit', 'Write', 'NotebookEdit'],
    desc: 'Edit 精準修改既有檔；Write 建立或覆寫檔案；NotebookEdit 修改 Jupyter notebook cells。這類工具通常需要 permission。',
  },
  {
    cat: 'Shell / 背景監看',
    tools: ['Bash', 'PowerShell', 'Monitor'],
    desc: 'Bash / PowerShell 執行 shell command；Monitor 可在背景追 log、CI、目錄變化或長任務 output，事件出現時回報。Monitor 仍沿用 Bash permission rules。',
  },
  {
    cat: '互動 / 排程',
    tools: ['AskUserQuestion', 'CronCreate', 'CronList', 'CronDelete'],
    desc: 'AskUserQuestion 用 multiple-choice 問題釐清需求；CronCreate 建立 session-scoped 一次性或週期性 prompt，CronList / CronDelete 用來檢視與取消。',
  },
  {
    cat: '外部資料 / MCP',
    tools: ['WebFetch', 'WebSearch', 'ListMcpResourcesTool', 'ReadMcpResourceTool'],
    desc: '讀 URL、搜尋網路、列出或讀取 MCP resources。自訂 MCP server 也會提供額外 tools。',
  },
  {
    cat: '規劃 / 任務 / 委派',
    tools: ['EnterPlanMode', 'ExitPlanMode', 'Agent', 'TaskCreate', 'TaskList', 'TaskUpdate', 'TodoWrite'],
    desc: '進出 plan mode、派 subagent、管理 task list。互動 session 主要用 TaskCreate / TaskList / TaskUpdate；TodoWrite 常見於 non-interactive mode / Agent SDK。',
  },
  {
    cat: 'Skill / Worktree / Agent Team',
    tools: ['Skill', 'EnterWorktree', 'ExitWorktree', 'TeamCreate', 'TeamDelete', 'SendMessage'],
    desc: 'Skill 執行可重用的 prompt-based workflow；Worktree 隔離工作目錄；Agent Team 相關工具需開 experimental 設定。',
  },
]

const codexToolGroups = [
  {
    cat: 'Shell + sandbox',
    tools: ['shell command', 'sandbox', 'approval policy'],
    desc: '用 sandbox 與 approval policy 控制 command 能不能讀寫檔案、要不要先問人。',
  },
  {
    cat: 'Patch / diff',
    tools: ['apply_patch', 'codex apply', 'reviewable diff'],
    desc: 'Codex 的修改通常以 patch / diff 形式落地，方便 review、套用與回滾。',
  },
  {
    cat: '非互動任務',
    tools: ['codex exec', 'codex review'],
    desc: '把明確任務或 code review 交給 Codex 非互動執行，適合 CI 或明確 ticket。',
  },
  {
    cat: '互動確認 / 提問',
    tools: ['request_user_input', 'approval prompt', 'plan review'],
    desc: 'Codex 也可以先問人、請批准、或在 plan review 階段收斂方向；課堂以 CLI 互動模式示範。',
  },
  {
    cat: '長任務 / 監看',
    tools: ['exec session', 'output polling', 'CI / cron handoff'],
    desc: 'Codex 可讓 shell command 維持執行並持續讀 output。若要固定時間排程，通常接 CI、GitHub Actions、cron 或外部 scheduler；課堂示範以 CLI path 為主。',
  },
  {
    cat: '外部工具',
    tools: ['codex mcp', 'codex plugin', 'CLI script'],
    desc: 'MCP 與 plugin 提供可重用工具；探索期也可以先用 repo 裡的 CLI script。',
  },
  {
    cat: '補充入口 / 多模態 / 搜尋',
    tools: ['desktop / cloud', '--image', '--search'],
    desc: 'Desktop、cloud task、圖片輸入與 web_search 都屬補充入口或進階能力；是否可用取決於版本、帳號與環境設定。',
  },
]

export default function Part7() {
  return (
    <PageLayout partIndex={6}>
      <SectionHeader partIndex={6} />

      <p className="text-slate-300 leading-relaxed mb-8">
        前面已經講完 agent loop 與 token/context。接著進到產品操作，先把基本三件事學會：
        <span className="text-white">怎麼裝怎麼啟動</span>、
        <span className="text-white">規則檔怎麼寫</span>、
        <span className="text-white">內建有哪些工具</span>。這堂課只用 claude / codex CLI 示範；
        desktop、IDE extension、cloud 只作補充入口。
      </p>

      <H3>1. 安裝與啟動</H3>
      <CodeBlock title="Terminal">
{`# 官方推薦：macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash

# macOS 也可以用 Homebrew
brew install --cask claude-code

# 舊 npm 安裝仍可能在公司環境看到；新安裝優先用 native / Homebrew
npm install -g @anthropic-ai/claude-code

# Codex CLI
npm i -g @openai/codex

# 啟動
claude
codex

# 直接帶任務啟動（非互動模式）
claude "幫我解釋這個 repo 的架構"
codex "幫我解釋這個 repo 的架構"

# 查看版本
claude --version
codex --version`}
      </CodeBlock>

      <Callout type="info">
        Claude Code 與 Codex 都要先確認公司帳號、可用 repo 範圍、外部系統權限與允許的 approval / permission 模式。
      </Callout>

      <H3>互動模式基本操作</H3>
      <CodeBlock title="對話範例">
{`$ claude
> 幫我解釋 src/auth/middleware.ts 做了什麼

$ codex
> 幫我解釋 src/auth/middleware.ts 做了什麼

# Agent 可以讀 repo 中的檔案，不一定要貼程式碼

> 它有什麼安全疑慮嗎？

# 可以追問，它記得上文

> 幫我修掉你說的第二個問題

# 直接叫它動手改

> 現在跑一下測試看有沒有壞掉

# 它可以執行 npm test，根據結果繼續調整`}
      </CodeBlock>

      <H3>Claude Code 常見 Slash 指令</H3>
      <CmdTable rows={[
        { cmd: '/help',    desc: '列出所有可用指令' },
        { cmd: '/clear',   desc: '清空對話記憶，從零開始。切換不相關任務時用' },
        { cmd: '/compact', desc: '壓縮對話成摘要，保留脈絡但節省 token。長任務中途用' },
        { cmd: '/usage',   desc: '顯示目前 token 使用量與成本資訊；部分舊版本會看到 /cost' },
        { cmd: '/config',  desc: '開啟設定，調整 permission、預設行為' },
        { cmd: '/init',    desc: '根據目前專案產生 CLAUDE.md 草稿' },
        { cmd: '/doctor',  desc: '診斷環境問題（Node 版本、API 連線等）' },
      ]} />

      <H3>Codex 常見 Slash 指令</H3>
      <CmdTable rows={[
        { cmd: '/status',      desc: '顯示目前模型、approval policy、writable roots、context 與 token 狀態' },
        { cmd: '/permissions', desc: '調整 Codex 可以自動做什麼、哪些操作需要先問人' },
        { cmd: '/clear',       desc: '清空畫面並開始新對話；適合切換到不相關任務' },
        { cmd: '/compact',     desc: '把長對話摘要化，釋放 context 但保留關鍵資訊' },
        { cmd: '/diff',        desc: '查看目前 working tree diff，包含未追蹤檔案' },
        { cmd: '/init',        desc: '在目前目錄產生 AGENTS.md scaffold' },
        { cmd: '/mcp',         desc: '列出目前 Codex 可用的 MCP tools' },
        { cmd: '/review',      desc: '請 Codex review 目前 working tree' },
      ]} />

      <H3>2. 規則檔：給 agent 的工作說明書</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        Claude Code 常用 <code className="text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded text-xs">CLAUDE.md</code>；
        Codex 常用 <code className="text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded text-xs">AGENTS.md</code>。
        放在專案根目錄、commit 進 repo，讓整個團隊共用同一套規則。
      </p>
      <CodeBlock title="CLAUDE.md / AGENTS.md 範例">
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
- 送出 commit 前確認沒有遺留 console.log`}
      </CodeBlock>

      <Callout type="tip">
        Claude Code 可以用 /init 產生初版 CLAUDE.md；Codex 可以用 AGENTS.md 承接同一套專案規範。
        兩者都要人工 review，避免把過時或不精準的規則 commit 進 repo。
      </Callout>

      <H3>3. Tool list：Claude Code 跟 Codex</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        <span className="font-mono text-slate-300">agentic-loop</span> 講過「規劃 → 行動」，這裡就是行動的底牌。
        兩套工具的能力很像，但呈現方式不同：Claude Code 會明確暴露一組 tool names；
        Codex 比較常看到的是 shell、patch、sandbox、approval、MCP、exec / review 這些 CLI 操作介面。
        Claude Code 的 tool names 會直接用在 permission rules、subagent tool lists 與 hook matchers；
        不要把 Claude 的 tool name 直接套到 Codex，教學時先講能力，再講各自介面。
      </p>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03] text-xs text-slate-300 font-semibold">
          <span className="col-span-3">共通能力</span>
          <span className="col-span-4">Claude Code 常見工具</span>
          <span className="col-span-5">Codex 對等介面</span>
        </div>
        {commonToolRows.map((row) => (
          <div key={row.task} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <span className="md:col-span-3 text-white font-medium">{row.task}</span>
            <code className="md:col-span-4 text-cyan-300 font-mono text-xs leading-relaxed">{row.claude}</code>
            <span className="md:col-span-5 text-slate-300 leading-relaxed">{row.codex}</span>
          </div>
        ))}
      </div>

      <Callout type="info">
        Tool list 不是背誦清單，而是理解 permission / approval 的邊界：讀檔、改檔、跑 command、
        查外部資料、寫外部系統，風險等級都不同。
        Claude Code 的實際可用工具會依 provider、平台與設定不同；在 session 裡可直接問
        <code className="text-cyan-300 bg-cyan-500/10 px-1 rounded mx-1">What tools do you have access to?</code>
        ，MCP 精確工具名則用 <code className="text-cyan-300 bg-cyan-500/10 px-1 rounded">/mcp</code> 查。
      </Callout>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">Claude Code：常見 tool names</h4>
      <div className="space-y-3 mb-5">
        {claudeToolGroups.map(({ cat, tools, desc }) => (
          <div key={cat} className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="text-cyan-300 text-xs font-semibold mb-2 uppercase tracking-wide">{cat}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tools.map((tool) => (
                <code key={tool} className="text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded font-mono text-xs">{tool}</code>
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <CodeBlock title="Claude Code：限制可用工具">
{`# 只開 Read、Grep、Glob、Bash，適合 read-only exploration
claude --tools Read,Grep,Glob,Bash

# 允許特定 Bash pattern，拒絕高風險工具
claude --allowedTools "Bash(npm test *) Edit" --disallowedTools "Bash(git push *) Write"`}
      </CodeBlock>

      <CodeBlock title="Claude Code：AskUserQuestion / Monitor / Cron 使用情境">
{`# AskUserQuestion
> 需求有 A/B/C 三種可能，請先用選項問我，不要直接猜。

# Monitor
> 幫我 monitor dev server log，如果出現 ERROR 或 build failed 就提醒我。

# CronCreate / CronList / CronDelete
> 明天早上 9 點提醒我檢查這個 PR 的 CI 狀態。
> 列出目前 session 裡的 scheduled tasks。
> 取消剛剛那個 PR CI 提醒。`}
      </CodeBlock>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">Codex：常見操作介面</h4>
      <div className="space-y-3 mb-5">
        {codexToolGroups.map(({ cat, tools, desc }) => (
          <div key={cat} className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <div className="text-violet-300 text-xs font-semibold mb-2 uppercase tracking-wide">{cat}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tools.map((tool) => (
                <code key={tool} className="text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded font-mono text-xs">{tool}</code>
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <CodeBlock title="Codex：approval / sandbox / search">
{`# 在 workspace-write sandbox 內工作，危險 command 先問人
codex --sandbox workspace-write --ask-for-approval on-request

# 非互動執行明確任務
codex exec "review current diff and list high-risk issues"

# 啟用 live web search；是否可用依帳號與環境而定
codex --search "查官方文件，整理這個 migration API 的 breaking changes"`}
      </CodeBlock>

      <CodeBlock title="Codex CLI：提問 / 監看 / 排程的對等寫法">
{`# 需求釐清：讓 Codex 先問，不要猜
> 需求有 A/B/C 三種可能。請先列選項問我，等我確認後再改檔。

# 長任務監看：保持 command session，持續觀察 output
> 啟動 dev server，持續看 output；如果出現 ERROR、build failed 或 port conflict，先回報不要自行重試。

# 固定時間排程：通常交給外部 scheduler，再讓 Codex 處理明確任務
# 例如 GitHub Actions / cron 觸發 codex exec。`}
      </CodeBlock>

      <Callout type="tip">
        <span className="font-semibold">什麼時候該手動指定工具？</span>
        多數時候不用。值得明說的是風險邊界：大範圍搜尋請先只讀；改檔請產 reviewable diff；
        跑 command 要講清楚允許的 script；外部寫入要先 dry-run，再由人批准。
      </Callout>
      <Callout type="info">
        想加自己的工具？先看 <span className="font-mono font-semibold">scripts-workflow</span> 和
        <span className="font-mono font-semibold">cli-tooling</span>，再看 <span className="font-mono font-semibold">mcp-integration</span>。
        Skill / 規則檔則負責告訴 agent 什麼時候選哪個介面。
      </Callout>
    </PageLayout>
  )
}
