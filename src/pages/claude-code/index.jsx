import { Link } from 'react-router-dom'
import { PARTS, ACCENT } from '../../components/cc/shared'

export default function ClaudeCodeIndex() {
  return (
    <main className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <div className="mb-14">
          <div className="inline-flex px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
            進階 · 03
          </div>
          <h1 className="text-5xl font-black text-white mb-5 leading-tight">
            Claude Code<br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">AI 驅動的開發 CLI</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            一小時課程，從「它到底是什麼」到「在生產環境好好用它」。
            共分五個章節，PM 與 Dev 各有側重，可依需求選擇章節閱讀。
          </p>
        </div>

        {/* Part cards */}
        <div className="space-y-3 mb-16">
          {PARTS.map((p, i) => {
            const c = ACCENT[p.accent]
            return (
              <Link
                key={p.path}
                to={p.path}
                className={`group flex items-center gap-5 rounded-2xl border ${c.border} ${c.bg} p-5 no-underline transition-all hover:scale-[1.01] hover:shadow-xl`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${c.bar} flex items-center justify-center text-white font-black text-sm`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${c.badge.split(' ')[1]}`}>{p.part}</span>
                    <span className="text-slate-600 text-xs">{p.time}</span>
                    <div className="flex gap-1 ml-1">
                      {p.audience.map(a => (
                        <span key={a} className="px-1.5 py-0.5 rounded text-xs border border-white/10 text-slate-500">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-white font-semibold">{p.title}</div>
                </div>
                <span className="text-slate-600 group-hover:text-slate-300 transition-colors text-lg flex-shrink-0">→</span>
              </Link>
            )
          })}
        </div>

        {/* Start button */}
        <div className="text-center">
          <Link
            to="/claude-code/1"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg transition-all no-underline shadow-2xl shadow-violet-500/25"
          >
            從第一章開始
            <span>→</span>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-12 mt-12 border-t border-white/10">
          <Link to="/agent" className="text-slate-400 hover:text-white transition-colors no-underline text-sm">
            ← Agent 概念
          </Link>
          <Link to="/pre-quiz" className="text-slate-400 hover:text-white transition-colors no-underline text-sm">
            課前預習測驗 →
          </Link>
        </div>
      </div>
    </main>
  )
}
