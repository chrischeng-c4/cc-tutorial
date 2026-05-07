import { PageLayout, SectionHeader, Callout } from '../../components/cc/shared'

function AgentLoopChart() {
  const steps = [
    { label: '感知', title: '讀目前狀態', body: '使用者訊息、檔案、上一輪工具結果' },
    { label: '規劃', title: '決定下一步', body: '補 context、列計畫、修改，或先問人' },
    { label: '行動', title: '呼叫工具', body: 'Read、Grep、Edit、Bash、WebFetch' },
    { label: '觀察', title: '看結果收斂', body: '判斷完成、重試、修正方向，或停下來' },
  ]

  return (
    <figure className="mb-8 rounded-xl border border-sky-500/20 bg-sky-500/[0.04] p-5">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-stretch">
        {steps.map((step, i) => (
          <div key={step.label} className="contents">
            <div className="rounded-lg border border-sky-500/20 bg-black/20 p-4">
              <div className="mb-2 text-sm font-bold text-sky-300">{step.label}</div>
              <div className="text-sm font-semibold text-white">{step.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.body}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex items-center justify-center text-slate-300">
                <span className="md:hidden">↓</span>
                <span className="hidden md:inline">→</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-lg border border-sky-500/20 bg-black/20 px-4 py-3 text-sm leading-relaxed text-slate-300">
        <span className="font-semibold text-sky-300">未完成時</span>
        <span>觀察</span>
        <span className="text-sky-300">↺</span>
        <span>回到感知，進入下一輪</span>
      </div>
      <figcaption className="mt-4 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-slate-300">
        觀察後如果還沒完成，就回到「感知」進入下一輪；如果完成、卡住、或碰到高風險判斷，就回報或問人。
      </figcaption>
    </figure>
  )
}

function ToolCallSequence() {
  const messages = [
    { role: 'user', label: '人類提出目標', text: '幫我找登入 bug', tone: 'text-emerald-300', border: 'border-emerald-500/20' },
    { role: 'assistant', label: '模型提出工具呼叫', text: 'tool_call: Read({ file: "src/auth.ts" })', tone: 'text-violet-300', border: 'border-violet-500/20' },
    { role: 'tool', label: '工具回傳結果', text: 'tool_result: auth.ts 的內容...', tone: 'text-cyan-300', border: 'border-cyan-500/20' },
    { role: 'assistant', label: '模型讀結果後回應', text: '我看到 token 過期時沒有 refresh 流程，下一步建議...', tone: 'text-slate-300', border: 'border-white/10' },
  ]

  return (
    <figure className="mb-10 rounded-xl border border-white/10 bg-black/30 p-5">
      <div className="space-y-3">
        {messages.map(({ role, label, text, tone, border }, i) => (
          <div key={`${role}-${i}`}>
            <div className={`grid gap-3 rounded-lg border ${border} bg-white/[0.02] p-3 text-sm md:grid-cols-[8rem_1fr]`}>
              <div>
                <div className="font-mono text-sm text-slate-300">{role}</div>
                <div className="mt-1 text-xs text-slate-300">{label}</div>
              </div>
              <div className={`font-mono text-sm leading-relaxed ${tone}`}>{text}</div>
            </div>
            {i < messages.length - 1 && (
              <div className="pl-4 text-slate-500">↓</div>
            )}
          </div>
        ))}
      </div>
    </figure>
  )
}

export default function Part2() {
  return (
    <PageLayout partIndex={1}>
      <SectionHeader partIndex={1} />

      <p className="text-slate-300 leading-relaxed mb-8">
        <span className="font-mono text-slate-300">what-is-coding-agent</span> 說它是能執行多步驟任務的 agent。這一章把背後的循環拆給你看——
        看完你會知道它<span className="text-white">不是用魔法在做事</span>，
        只是把人類做事的步驟重複執行很多次而已。
      </p>

      <h3 className="text-white font-semibold mb-4 text-base">它的 4 步循環：感知 → 規劃 → 行動 → 觀察</h3>
      <AgentLoopChart />

      <p className="text-slate-300 text-sm leading-relaxed mb-10">
        這個循環會持續執行，直到 Claude 判定任務完成、卡住要問你、或你主動介入。
        與其說它在「聊天」，不如說它在<span className="text-white">「迭代執行任務」</span>——
        只是任務的描述語言是自然語言。
      </p>

      <h3 className="text-white font-semibold mb-4 text-base">Tool call 也是一次對話</h3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        看到畫面上出現 Read / Grep / Bash，不代表模型跳到對話外面做事。
        技術上比較像這樣：assistant 先說「我要呼叫哪個工具、帶什麼參數」，
        工具執行完再把結果回成一則 tool result，下一輪模型呼叫會把這些內容一起讀進 context。
      </p>
      <ToolCallSequence />
      <Callout type="warn">
        所以工具不是「免費附加動作」。每次讀檔、搜尋、跑測試，都會把 tool call 與 tool result 留進對話歷史；
        後續模型要參考它們時，這些內容就會變成 input context。這也是〈Token 與 context 經濟學〉要展開談成本的原因。
      </Callout>

      {/* Concrete example walking through the loop */}
      <h3 className="text-white font-semibold mb-4 text-base">舉例：你說「修一個登入 bug」實際發生什麼</h3>
      <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden mb-10">
        {[
          { tag: '感知', tagColor: 'bg-sky-500/20 text-sky-300', text: '讀 README、找登入相關檔案 (auth.ts, login.tsx)' },
          { tag: '規劃', tagColor: 'bg-indigo-500/20 text-indigo-300', text: '決定先看 auth.ts 的 token 驗證邏輯' },
          { tag: '行動', tagColor: 'bg-violet-500/20 text-violet-300', text: '呼叫 Read 工具讀 src/auth.ts' },
          { tag: '觀察', tagColor: 'bg-emerald-500/20 text-emerald-300', text: '看到 token 過期沒處理 → 找到 bug 了' },
          { tag: '規劃', tagColor: 'bg-indigo-500/20 text-indigo-300', text: '想：要在 catch 裡加 refresh token 流程' },
          { tag: '行動', tagColor: 'bg-violet-500/20 text-violet-300', text: '呼叫 Edit 工具改 auth.ts' },
          { tag: '行動', tagColor: 'bg-violet-500/20 text-violet-300', text: '呼叫 Bash 工具跑 npm test' },
          { tag: '觀察', tagColor: 'bg-emerald-500/20 text-emerald-300', text: '測試全綠 → 任務完成，回報給你' },
        ].map(({ tag, tagColor, text }, i, arr) => (
          <div key={i} className={`flex items-center gap-3 px-5 py-2.5 ${i < arr.length - 1 ? 'border-b border-white/5' : ''}`}>
            <span className="text-slate-300 text-xs font-mono w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${tagColor} flex-shrink-0 w-12 text-center`}>{tag}</span>
            <span className="text-slate-300 text-sm">{text}</span>
          </div>
        ))}
      </div>

      <Callout type="tip">
        這就是「agentic」的核心：不是回答你問題就停了，而是不斷感知 → 規劃 → 行動，直到目標達成。
        模型本身做不到——是 Claude Code / Codex 這類外殼把模型包成 agent。
      </Callout>

      <h3 className="text-white font-semibold mb-4 mt-10 text-base">演練時在 Terminal 要讓觀眾看到什麼</h3>
      <ol className="list-none m-0 p-0 rounded-xl border border-indigo-500/20 bg-indigo-500/5 overflow-hidden">
        {[
          { step: '01', title: '先問 repo 結構', detail: '> 簡介這個 repo 的主要模組，以及訂單相關程式在哪裡' },
          { step: '02', title: '讓它規劃，不要直接改', detail: '> 我想新增訂單匯出 CSV，先列出你會讀哪些檔案與風險' },
          { step: '03', title: '觀察工具呼叫', detail: '畫面上要出現 Read / Grep / Bash 這類工具動作；提醒大家 tool call 也是對話歷史的一部分。' },
          { step: '04', title: '用結果收斂', detail: '> 根據剛剛讀到的 code，列出技術事實、推測與需要 HITL 確認的問題' },
        ].map(({ step, title, detail }) => (
          <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-3 px-5 py-3 border-b border-white/5 last:border-0">
            <span className="text-indigo-300 text-xs font-mono pt-0.5">{step}</span>
            <div>
              <div className="text-white text-sm font-semibold mb-1">{title}</div>
              <div className="text-slate-300 text-sm leading-relaxed font-mono">{detail}</div>
            </div>
          </li>
        ))}
      </ol>
    </PageLayout>
  )
}
