import { PageLayout, SectionHeader } from '../../components/cc/shared'

export default function Part1() {
  return (
    <PageLayout partIndex={0}>
      <SectionHeader partIndex={0} />

      <p className="text-slate-400 leading-relaxed mb-8">
        市場上 AI coding 工具一堆，先搞清楚 Claude Code 站在哪個位置，再談怎麼用。
      </p>

      {/* Comparison */}
      <h3 className="text-white font-semibold mb-4 text-base">三種工具的本質差異</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            name: 'GitHub Copilot',
            type: '補全工具',
            desc: '在 IDE 裡自動補完程式碼，以行或函式為單位。你自己駕駛，它只是副駕座。',
            limit: '無法執行指令或讀取整個專案',
          },
          {
            name: 'Cursor',
            type: 'AI IDE',
            desc: 'VS Code 的 AI 強化版，在編輯器內整合 chat 和 inline edit，體驗流暢。',
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

      {/* One-line definition */}
      <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-6 mb-10">
        <h3 className="text-white font-semibold mb-3">一句話定義</h3>
        <p className="text-slate-300 leading-relaxed">
          Claude Code 是一個 <span className="text-sky-300 font-medium">Agentic CLI</span>——
          你給它一個目標，它自己去讀程式碼、規劃步驟、執行工具、觀察結果、反覆迭代，直到完成任務。
          你是 <span className="text-white font-medium">監督者</span>，不是駕駛員。
        </p>
      </div>

      {/* Agentic loop */}
      <h3 className="text-white font-semibold mb-4 text-base">它實際上在做什麼：Agentic 循環</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: '👁️', step: '感知',  desc: '讀取檔案、指令輸出、對話歷史' },
          { icon: '🧩', step: '規劃',  desc: '決定下一步要用哪個工具' },
          { icon: '🔧', step: '行動',  desc: '執行工具：讀寫檔案、跑指令' },
          { icon: '🔄', step: '觀察',  desc: '評估結果，決定繼續或完成' },
        ].map(({ icon, step, desc }) => (
          <div key={step} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <div className="text-white font-semibold text-sm mb-1">{step}</div>
            <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>

      <p className="text-slate-400 text-sm leading-relaxed">
        這個循環會持續執行，直到 Claude 判定任務完成，或你在中途介入調整方向。
        與其說它在「聊天」，不如說它在「執行任務」——只是任務的描述語言是自然語言。
      </p>
    </PageLayout>
  )
}
