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
        <p className="text-slate-300 text-base leading-relaxed">
          它們不是單純補全工具，也不是只回答問題的聊天介面。比較準確的說法是：它們能執行多步驟任務，
          但人仍要控 scope、看 diff、確認結果。這堂課的操作主線固定在 terminal：
          Claude Code 用 <code className="text-sky-300 bg-sky-500/10 px-1.5 py-0.5 rounded text-sm">claude</code>，
          Codex 用 <code className="text-sky-300 bg-sky-500/10 px-1.5 py-0.5 rounded text-sm">codex</code>。
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
            <div className={`inline-block text-xs font-semibold mb-3 px-2 py-0.5 rounded-full ${highlight ? 'bg-sky-500/20 text-sky-300' : 'bg-white/5 text-slate-300'}`}>{tag}</div>
            <div className={`font-semibold mb-2 ${highlight ? 'text-white' : 'text-slate-200'}`}>{title}</div>
            <p className="text-slate-300 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* Role shift emphasis */}
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-7 mb-10">
        <div className="text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">特別強調</div>
        <h3 className="text-white font-bold text-xl md:text-2xl mb-4 leading-snug">
          新世代工程師的工作：從「寫每一行」變成「定義目標、定義邊界」
        </h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          Agent 會讀 code、改檔、跑指令——但它不知道「這個產品想解什麼問題」「哪些檔案碰不得」「commit 之前該不該先給人看」。
          這些都是工程師的工作，而且份量會變更重，不是更輕。
        </p>
        <ol className="space-y-5">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center">1</span>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold mb-1">定義目標</div>
              <p className="text-slate-300 leading-relaxed">
                把模糊需求轉成可驗收的 ticket：要動哪段流程、輸入輸出長什麼樣、success criteria 是什麼、edge case 怎麼處理。
                模糊輸入 = 模糊產出，agent 不會幫你想清楚產品問題。
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center">2</span>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold mb-1">定義邊界</div>
              <p className="text-slate-300 leading-relaxed">
                哪些檔案可以改、哪些指令需要先問你、commit / push 要不要人 review。
                這些約束寫在 permission、hook、CLAUDE.md 裡——後面 Permission · Approval 與 Hooks 章節會展開。
              </p>
            </div>
          </li>
        </ol>
        <p className="text-slate-300 leading-relaxed mt-6 pt-5 border-t border-amber-500/15">
          至於 review——agent 只為「做完了」負責，「對不對」要你判定。看 diff、跑測試、決定合不合進主線，還是工程師的工作。
        </p>
      </section>

      <h3 className="text-white font-semibold mb-4 text-base">兩套工具在這堂課是對等的</h3>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-10">
        {[
          { k: 'Claude Code', v: '主線：claude CLI，在本機 repo 內 cowork。補充：Claude Code Desktop 整合在 Claude Desktop，另有 VS Code / JetBrains extensions。常見設定是 CLAUDE.md、slash commands、permission、hooks、MCP。' },
          { k: 'Codex', v: '主線：codex CLI，本機 pairing、codex exec、codex review。Desktop / cloud 等其他入口只帶過；課堂演練不以它們為主。常見設定是 AGENTS.md 與 approval modes。' },
          { k: '共通能力', v: '讀 repo、改檔、跑指令、整理文件、產可 review diff。這堂課的 prompt 與演練都以 CLI path 設計，其他平台只用來理解產品全貌。' },
        ].map(({ k, v }) => (
          <div key={k} className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-2 px-5 py-3 border-b border-white/5 last:border-0">
            <div className="text-sky-300 text-sm font-semibold">{k}</div>
            <div className="text-slate-300 text-sm leading-relaxed">{v}</div>
          </div>
        ))}
      </div>

      {/* What it is NOT */}
      <h3 className="text-white font-semibold mb-4 text-base">這些不是 coding agent</h3>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          {[
            { wrong: '只能當 VS Code 外掛或桌面聊天工具', right: '課堂用 CLI 當主線：在 terminal 跑 claude / codex' },
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
