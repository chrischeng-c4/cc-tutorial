import { PageLayout, SectionHeader, Callout } from '../../components/cc/shared'

export default function Part2() {
  return (
    <PageLayout partIndex={1}>
      <SectionHeader partIndex={1} />

      <p className="text-slate-400 leading-relaxed mb-8">
        Part 1 說它是「會自己幹活的 agent」。這一章把它腦袋裡的循環拆給你看——
        看完你會知道它<span className="text-white">不是用魔法在做事</span>，
        只是把人類做事的步驟自動化跑很多次而已。
      </p>

      {/* Agentic loop diagram */}
      <h3 className="text-white font-semibold mb-4 text-base">它的 4 步循環：感知 → 規劃 → 行動 → 觀察</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: '👁️', step: '感知', desc: '讀檔案、看你說的話、看上一步的結果', color: 'sky' },
          { icon: '🧩', step: '規劃', desc: '想下一步要做什麼：再讀一個檔？還是動手改？', color: 'indigo' },
          { icon: '🔧', step: '行動', desc: '呼叫工具：讀寫檔、跑指令、查網路', color: 'violet' },
          { icon: '🔄', step: '觀察', desc: '看結果，判斷做完了沒，沒做完就回到感知', color: 'emerald' },
        ].map(({ icon, step, desc }, i) => (
          <div key={step} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 text-center relative">
            <div className="text-xs text-slate-600 font-mono absolute top-2 right-3">{i + 1}</div>
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-white font-semibold text-sm mb-2">{step}</div>
            <div className="text-slate-400 text-xs leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-sm leading-relaxed mb-10">
        這個循環會持續執行，直到 Claude 判定任務完成、卡住要問你、或你主動介入。
        與其說它在「聊天」，不如說它在<span className="text-white">「迭代執行任務」</span>——
        只是任務的描述語言是自然語言。
      </p>

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
            <span className="text-slate-700 text-xs font-mono w-5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${tagColor} flex-shrink-0 w-12 text-center`}>{tag}</span>
            <span className="text-slate-300 text-sm font-mono">{text}</span>
          </div>
        ))}
      </div>

      <Callout type="tip">
        這就是「agentic」的核心：不是回答你問題就停了，而是不斷感知 → 規劃 → 行動，直到目標達成。
        模型本身做不到——是 Claude Code 這個外殼把它包成 agent。
      </Callout>

      {/* Live screenshot placeholder */}
      <h3 className="text-white font-semibold mb-4 mt-10 text-base">在 Terminal 看到的樣子</h3>
      <div className="rounded-xl border border-dashed border-white/15 bg-black/30 p-8 text-center mb-3">
        <div className="text-4xl mb-3 opacity-40">📺</div>
        <div className="text-slate-400 text-sm mb-1">實機畫面（30 秒錄影 / 截圖）</div>
        <div className="text-slate-600 text-xs leading-relaxed max-w-md mx-auto">
          建議錄一段：啟動 claude → 給上面那個「修登入 bug」任務 → 看它讀檔/呼叫工具/改檔/跑測試的真實過程。
        </div>
        <div className="text-slate-700 text-xs mt-3 font-mono">
          {'<img src="/cc-loop-demo.gif" alt="Claude Code agentic loop" />'}
        </div>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed">
        圖檔放 <code className="text-slate-400">public/cc-loop-demo.gif</code>，再把上面這個 placeholder 換成
        <code className="text-slate-400 ml-1">{'<img src="/cc-loop-demo.gif" />'}</code>。
      </p>
    </PageLayout>
  )
}
