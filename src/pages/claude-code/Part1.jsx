import { PageLayout, SectionHeader, Callout } from '../../components/cc/shared'

export default function Part1() {
  return (
    <PageLayout partIndex={0}>
      <SectionHeader partIndex={0} />

      {/* Hero one-liner */}
      <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 to-blue-500/5 p-8 mb-10">
        <div className="text-sky-300 text-xs font-semibold uppercase tracking-widest mb-3">一句話</div>
        <p className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
          Claude Code 是一個跑在你終端機裡的 <span className="bg-gradient-to-r from-sky-300 to-blue-300 bg-clip-text text-transparent">AI 工程師</span>——
          你給它目標，它自己看檔案、寫程式、跑測試、開 PR。
        </p>
        <p className="text-slate-400 text-base leading-relaxed">
          不是補全工具、不是聊天機器人，而是會「自己幹活」的 agent。你的角色從駕駛員變成監督者。
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
            title: 'Claude Code 像「實習工程師」',
            body: '你在 Slack 丟一個 ticket：「幫我加匯出 CSV 功能」。它讀 repo、寫程式、跑測試、改到綠燈，回報結果讓你 review。',
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

      {/* What it is NOT */}
      <h3 className="text-white font-semibold mb-4 text-base">這些不是 Claude Code</h3>
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
        想知道它怎麼「自己幹活」？下一章 <span className="font-semibold">Part 2 — 它怎麼想</span> 會把它腦袋裡的循環拆給你看。
        如果你是 PM，看完 Part 2 之後直接跳到 <span className="font-semibold">Part 3 PM 為什麼能寫 PRD</span> 開始實戰。
      </Callout>
    </PageLayout>
  )
}
