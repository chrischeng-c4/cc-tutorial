import { PageLayout, SectionHeader, CodeBlock, Callout, CmdTable, H3 } from '../../components/cc/shared'

export default function Part7() {
  return (
    <PageLayout partIndex={6}>
      <SectionHeader partIndex={6} />

      <p className="text-slate-400 leading-relaxed mb-8">
        從這一章開始進入 Dev track。先把基本三件事學會：
        <span className="text-white">怎麼裝怎麼啟動</span>、
        <span className="text-white"> CLAUDE.md 怎麼寫</span>、
        <span className="text-white">內建有哪些工具</span>。後面 Part 8 再進到 token 與 context 的經濟學。
      </p>

      <H3>1. 安裝與啟動</H3>
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
        登入方式有兩種：Anthropic API Key（按量計費），或 claude.ai Max 訂閱帳號（月費制）。團隊使用建議申請 API Key，方便統一管控費用。
      </Callout>

      <H3>互動模式基本操作</H3>
      <CodeBlock title="對話範例">
{`$ claude
> 幫我解釋 src/auth/middleware.ts 做了什麼

# Claude 會自己讀檔案，不需要你貼程式碼

> 它有什麼安全疑慮嗎？

# 可以追問，它記得上文

> 幫我修掉你說的第二個問題

# 直接叫它動手改

> 現在跑一下測試看有沒有壞掉

# 它可以執行 npm test，根據結果繼續調整`}
      </CodeBlock>

      <H3>Slash 指令速查</H3>
      <CmdTable rows={[
        { cmd: '/help',    desc: '列出所有可用指令' },
        { cmd: '/clear',   desc: '清空對話記憶，從零開始。切換不相關任務時用' },
        { cmd: '/compact', desc: '壓縮對話成摘要，保留脈絡但節省 token。長任務中途用' },
        { cmd: '/cost',    desc: '顯示這次對話累積的 token 用量與估算費用' },
        { cmd: '/config',  desc: '開啟設定，調整 permission、預設行為' },
        { cmd: '/init',    desc: '在當前專案自動生成 CLAUDE.md 草稿' },
        { cmd: '/doctor',  desc: '診斷環境問題（Node 版本、API 連線等）' },
      ]} />

      <H3>2. CLAUDE.md：給 Claude 的工作說明書</H3>
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
- 送出 commit 前確認沒有遺留 console.log`}
      </CodeBlock>

      <Callout type="tip">
        用 /init 讓 Claude 自動分析你的 repo 生成初版 CLAUDE.md，再人工微調，比從頭寫快很多。
      </Callout>

      <H3>3. 內建工具：Claude 在「行動」階段能用的東西</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Part 2 的 agentic loop 講過「規劃 → 行動」，這裡就是行動的底牌。Claude Code 出廠就帶一組內建工具——
        你不用設定，它會自己選。看懂這張清單，你才知道它「不是用魔法」做事，
        以及 Part 9 要設 permission 的對象到底是誰。
      </p>
      <div className="space-y-3 mb-5">
        {[
          {
            cat: '檔案操作',
            label: 'text-sky-300',
            chip: 'text-sky-300 bg-sky-500/10',
            tools: [
              { name: 'Read',   desc: '讀單一檔案。支援大檔分頁、PDF、圖片(多模態)、Jupyter notebook' },
              { name: 'Write',  desc: '建立新檔或整檔覆寫。覆寫前必須先 Read 過' },
              { name: 'Edit',   desc: '精準字串替換或全檔取代。改既有檔案的首選，比 Write 安全' },
            ],
          },
          {
            cat: '搜尋與導航',
            label: 'text-emerald-300',
            chip: 'text-emerald-300 bg-emerald-500/10',
            tools: [
              { name: 'Grep',   desc: '跨檔正則搜尋(ripgrep)。找符號定義、找用法、找模式' },
              { name: 'Glob',   desc: '檔名 pattern 比對(src/**/*.tsx)。比 ls + find 直覺' },
            ],
          },
          {
            cat: '指令執行',
            label: 'text-amber-300',
            chip: 'text-amber-300 bg-amber-500/10',
            tools: [
              { name: 'Bash',   desc: '跑任意 shell 指令。git、npm、跑測試、起 server 都靠這個。可背景執行' },
            ],
          },
          {
            cat: '網路',
            label: 'text-rose-300',
            chip: 'text-rose-300 bg-rose-500/10',
            tools: [
              { name: 'WebFetch',  desc: '抓單一 URL 的內容並摘要。讀文件、看 issue、抓 spec' },
              { name: 'WebSearch', desc: '查網路(功能視帳號方案而定)' },
            ],
          },
          {
            cat: '任務與委派',
            label: 'text-violet-300',
            chip: 'text-violet-300 bg-violet-500/10',
            tools: [
              { name: 'Task',       desc: '派 subagent。獨立 context，跑完只回摘要。大範圍搜尋必備' },
              { name: 'TodoWrite',  desc: '建立 / 更新內部 todo list，多步驟任務追進度用' },
            ],
          },
          {
            cat: '長任務與互動',
            label: 'text-pink-300',
            chip: 'text-pink-300 bg-pink-500/10',
            tools: [
              { name: 'Monitor',         desc: '背景跑 script，每行 stdout = 一則通知。盯 dev server 起來、CI 跑完、log 出現 ERROR' },
              { name: 'AskUserQuestion', desc: '丟結構化選項給你選(單選/多選)，避免 Claude 自己亂猜方向' },
              { name: 'CronCreate',      desc: '把 prompt 排程到未來時間。可一次性(提醒)或週期性(每天 9 點巡 PR)' },
            ],
          },
        ].map(({ cat, label, chip, tools }) => (
          <div key={cat} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className={`${label} text-xs font-semibold mb-2 uppercase tracking-wide`}>{cat}</div>
            <div className="space-y-1.5">
              {tools.map(({ name, desc }) => (
                <div key={name} className="flex items-start gap-3 text-sm">
                  <code className={`${chip} px-2 py-0.5 rounded font-mono text-xs flex-shrink-0 mt-0.5 w-24`}>{name}</code>
                  <span className="text-slate-400 leading-relaxed">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Callout type="tip">
        <span className="font-semibold">什麼時候該手動指定工具？</span>
        九成時候不用——你說自然語言、Claude 自己選。但有兩種情境值得明說：
        (1) 大範圍搜尋丟給 <code className="text-violet-300 bg-violet-500/10 px-1 rounded">Task</code> subagent
        避免炸主 session 的 context；(2) 改既有檔案請 Claude 用
        <code className="text-emerald-300 bg-emerald-500/10 px-1 rounded ml-1">Edit</code> 而不是
        <code className="text-emerald-300 bg-emerald-500/10 px-1 rounded ml-1">Write</code>，避免整檔覆寫風險。
      </Callout>
      <Callout type="info">
        想加自己的工具？看 Part 9 的 <span className="font-semibold">MCP</span>——MCP server 加進來後就跟內建工具一視同仁，
        Claude 自己選自己用。
      </Callout>
    </PageLayout>
  )
}
