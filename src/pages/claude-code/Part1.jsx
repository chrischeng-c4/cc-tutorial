import { PageLayout, SectionHeader, Callout } from '../../components/cc/shared'

export default function Part1() {
  return (
    <PageLayout partIndex={0}>
      <SectionHeader partIndex={0} />

      {/* Hero one-liner */}
      <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-blue-500/5 p-8 mb-10">
        <div className="text-sky-300 text-xs font-semibold uppercase tracking-widest mb-3">一句話</div>
        <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
          Claude Code 與 Codex 都是 <span className="bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">coding agent</span>——
          你給它目標，它可以讀 repo、改檔、跑指令，最後把可 review 的結果交給你。
        </p>
        <p className="text-slate-400 text-base leading-relaxed">
          它們不是單純補全工具，也不是只回答問題的聊天介面。比較準確的說法是：它們能執行多步驟任務，
          但人仍要控 scope、看 diff、確認結果。
        </p>
      </div>

      {/* Relatable analogy */}
      <h3 className="text-white font-semibold mb-4 text-base">用一個比喻就懂</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          {
            title: 'GitHub Copilot 像「自動完成」',
            body: '你在 IDE 寫程式，它幫你補下一行。像 Word 的拼字建議——快、無感，但你還是駕駛。',
            tone: 'border-white/10 bg-white/[0.02]',
            tag: '補全',
          },
          {
            title: 'Cursor 像「副駕」',
            body: '在編輯器裡聊天、選一段叫它改。它陪你寫，但決策還是你下、檔案還是你存。',
            tone: 'border-white/10 bg-white/[0.02]',
            tag: 'IDE 增強',
          },
          {
            title: 'Claude Code / Codex 像「實習工程師」',
            body: '你給一個明確 ticket：「幫我加匯出 CSV 功能」。它們可以讀 repo、提出計畫、嘗試修改、跑測試，最後回報結果讓你 review。',
            tone: 'border-sky-500/30 bg-sky-500/10',
            tag: 'Agent',
            highlight: true,
          },
        ].map(({ title, body, tone, tag, highlight }) => (
          <div key={title} className={`rounded-xl border p-5 ${tone}`}>
            <div className={`inline-block text-xs font-semibold mb-3 px-2 py-0.5 rounded-full ${highlight ? 'bg-sky-500/20 text-sky-300' : 'bg-white/5 text-slate-400'}`}>{tag}</div>
            <div className={`font-semibold mb-2 ${highlight ? 'text-white' : 'text-slate-200'}`}>{title}</div>
            <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <h3 className="text-white font-semibold mb-4 text-base">兩套工具在這堂課是對等的</h3>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-10">
        {[
          { k: 'Claude Code', v: '本機 terminal / IDE cowork。常見設定是 CLAUDE.md、slash commands、permission、hooks、MCP。' },
          { k: 'Codex', v: 'CLI / IDE / Codex cloud 背景任務。常見設定是 AGENTS.md、approval modes、本機 pairing 與背景委派。' },
          { k: '共通能力', v: '讀 repo、改檔、跑指令、整理文件、產可 review diff。差別主要在介面、權限模型與委派方式。' },
        ].map(({ k, v }) => (
          <div key={k} className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-2 px-5 py-3 border-b border-white/5 last:border-0">
            <div className="text-sky-300 text-sm font-semibold">{k}</div>
            <div className="text-slate-400 text-sm leading-relaxed">{v}</div>
          </div>
        ))}
      </div>

      {/* What it is NOT */}
      <h3 className="text-white font-semibold mb-4 text-base">這些不是 coding agent</h3>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          {[
            { wrong: '一個 VS Code 外掛',         right: '它是 CLI，跑在 terminal 裡' },
            { wrong: '只會回答問題的 chatbot',     right: '它會主動執行：讀檔、改檔、跑指令' },
            { wrong: '需要把 code 貼給它的工具',   right: '它自己會去讀你的 repo' },
            { wrong: '會自動 push 到 production',  right: '改動仍需你 review、commit、push' },
          ].map(({ wrong, right }, i) => (
            <div key={i} className="flex items-start gap-3 py-1">
              <span className="text-rose-400 font-bold mt-0.5">✗</span>
              <div className="flex-1 min-w-0">
                <div className="text-slate-500 line-through text-xs">{wrong}</div>
                <div className="text-slate-300">{right}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Callout type="info">
        想知道它怎麼執行多步驟任務？下一段 <span className="font-mono font-semibold">agentic-loop</span> 會把循環拆給你看。
        接著會先補 context/token，再進工具操作、permission、進階觀念與實戰演練。
      </Callout>
    </PageLayout>
  )
}
