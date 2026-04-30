import { Link } from 'react-router-dom'

const cards = [
  {
    to: '/llm',
    emoji: '🧠',
    step: '01',
    title: 'LLM 基礎',
    desc: '了解大型語言模型的運作原理，從 Transformer 架構到 Token、Temperature 等核心概念。',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    tag: '入門',
    tagColor: 'bg-blue-500/20 text-blue-300',
  },
  {
    to: '/agent',
    emoji: '🤖',
    step: '02',
    title: 'Agent 概念',
    desc: '深入 Prompt 工程、Context 管理、Harness 架構，學習設計自主運行的智能代理。',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    tag: '中階',
    tagColor: 'bg-emerald-500/20 text-emerald-300',
  },
  {
    to: '/claude-code',
    emoji: '⚡',
    step: '03',
    title: 'Claude Code',
    desc: '掌握 Anthropic 官方 CLI 工具，結合 Agent 架構實現真實場景的 AI 驅動開發工作流。',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
    tag: '進階',
    tagColor: 'bg-violet-500/20 text-violet-300',
  },
]

export default function Home() {
  return (
    <main className="pt-16 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,40,200,0.3),transparent)]" />
        <div className="max-w-6xl mx-auto px-6 py-28 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            繁體中文 · AI 學習資源
          </div>
          <h1 className="text-6xl font-black text-white leading-tight tracking-tight mb-6">
            掌握 AI 時代的<br />
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              核心技術
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl leading-relaxed mb-12">
            從 LLM 基礎到 Claude Code 實戰，再到 Agent 架構設計。<br />
            用繁體中文，系統性地學習現代 AI 開發技術。
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/llm"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all no-underline shadow-lg shadow-violet-500/25"
            >
              開始學習 →
            </Link>
            <Link
              to="/claude-code"
              className="px-6 py-3 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium transition-all no-underline"
            >
              Claude Code 速覽
            </Link>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`group relative rounded-2xl border ${c.border} bg-gradient-to-br ${c.color} p-8 no-underline transition-all hover:scale-[1.02] hover:shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${c.tagColor}`}>
                  {c.tag}
                </div>
                <span className="text-3xl font-black text-white/10">{c.step}</span>
              </div>
              <div className="text-5xl mb-4">{c.emoji}</div>
              <h2 className="text-xl font-bold text-white mb-3">{c.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
              <div className="mt-6 flex items-center gap-1 text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
                深入了解 <span className="translate-x-0 group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pre-quiz CTA */}
        <div className="mt-6 rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-500/10 to-orange-500/10 p-6 flex items-center justify-between gap-6">
          <div>
            <div className="inline-flex px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-medium mb-2">課前預習</div>
            <h3 className="text-white font-bold mb-1">準備好上課了嗎？</h3>
            <p className="text-slate-400 text-sm">先做 8 題 Claude Code 預習測驗，帶著問題進教室效果更好。</p>
          </div>
          <Link
            to="/pre-quiz"
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all no-underline whitespace-nowrap"
          >
            開始預習 →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-3 gap-8 text-center">
          {[
            { n: '3', label: '核心主題' },
            { n: '繁中', label: '教學語言' },
            { n: '免費', label: '完全開放' },
          ].map(({ n, label }) => (
            <div key={label}>
              <div className="text-4xl font-black text-white mb-2">{n}</div>
              <div className="text-slate-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
