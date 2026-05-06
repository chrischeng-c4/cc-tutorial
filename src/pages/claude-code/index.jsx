import { Link } from 'react-router-dom'
import { ACCENT, AUDIENCE_STYLES, LEARNING_PATH, PARTS, USAGE_STYLES } from '../../data/claudeCodeParts'

function PartBadge({ children, className }) {
  return <span className={`rounded-full border px-2.5 py-1 text-xs ${className}`}>{children}</span>
}

export default function ClaudeCodeIndex() {
  const partsByNumber = new Map(PARTS.map(part => [part.number, part]))

  return (
    <main className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">

        <div className="mb-14">
          <div className="inline-flex px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
            補充教材
          </div>
          <h1 className="text-5xl font-black text-white mb-5 leading-tight">
            Claude Code + Codex<br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">概念與操作章節</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            這裡把 Claude Code 與 Codex 放在對等位置。導覽會標出建議閱讀路徑與選讀章節；
            PRD、permission / approval、token/context 都是共通工作法，只是不同情境會偏 PM 或偏 Engineering。
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-4">
          <div className="text-white font-semibold mb-2">這份補充教材怎麼用</div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Part 1-9 是 Workshop 前或同步閱讀的核心材料；Part 10-15 是進階參考，依工作情境選讀。
            編號保留原始章節，但建議先讀工具、token/context、permission，再回頭看 PRD 文件案例。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-8 md:grid-cols-3">
          {LEARNING_PATH.map((group) => (
            <div key={group.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="text-white text-sm font-semibold mb-2">{group.title}</div>
              <p className="text-slate-500 text-xs leading-relaxed mb-3">{group.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.parts.map(number => {
                  const part = partsByNumber.get(number)
                  return (
                    <Link
                      key={number}
                      to={part.path}
                      className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400 no-underline transition-colors hover:border-white/20 hover:text-white"
                    >
                      {part.part}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/workshop"
          className="block rounded-2xl border border-cyan-500/25 bg-cyan-500/[0.06] p-5 mb-4 no-underline hover:border-cyan-400/40 transition-colors"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-cyan-300 text-xs font-semibold uppercase tracking-wide mb-2">Course Order</div>
              <h2 className="text-white font-bold text-lg mb-2">先看兩小時課程安排</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                先講 coding agent 使用方法與 token/context 管理，再進 demo case。
              </p>
            </div>
            <span className="px-4 py-2 rounded-lg bg-cyan-700 text-white text-sm font-semibold flex-shrink-0">
              查看安排 →
            </span>
          </div>
        </Link>

        <Link
          to="/demo-checklist"
          className="block rounded-2xl border border-violet-500/25 bg-violet-500/[0.06] p-5 mb-8 no-underline hover:border-violet-400/40 transition-colors"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-violet-300 text-xs font-semibold uppercase tracking-wide mb-2">Demo Cases</div>
              <h2 className="text-white font-bold text-lg mb-2">13 個 Demo 情境與準備清單</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                這些情境涵蓋 Google Docs、JIRA、Figma、SeaTalk、Calendar 等內部流程。
                這份清單會把資料準備、script、MCP 權限與 HITL 確認拆清楚。
              </p>
            </div>
            <span className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold flex-shrink-0">
              查看清單 →
            </span>
          </div>
        </Link>

        {/* Part cards */}
        <div className="space-y-3 mb-16">
          {PARTS.map((p) => {
            const c = ACCENT[p.accent]
            return (
              <Link
                key={p.path}
                to={p.path}
                className={`group flex items-center gap-5 rounded-2xl border ${c.border} ${c.bg} p-5 no-underline transition-all hover:scale-[1.01] hover:shadow-xl`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${c.bar} flex items-center justify-center text-white font-black text-sm`}>
                  {p.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${c.badge.split(' ')[1]}`}>{p.part}</span>
                    <span className="text-slate-600 text-xs">{p.time}</span>
                    <div className="flex gap-1 ml-1 flex-wrap">
                      <PartBadge className={USAGE_STYLES[p.usage]}>{p.usage}</PartBadge>
                      <PartBadge className={AUDIENCE_STYLES[p.audience]}>{p.audience}</PartBadge>
                      {p.experimental && (
                        <PartBadge className="border-amber-500/25 bg-amber-500/10 text-amber-300">實驗性</PartBadge>
                      )}
                      {p.tags.map(a => (
                        <span key={a} className="px-1.5 py-0.5 rounded text-xs border border-white/10 text-slate-500">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-white font-semibold">{p.title}</div>
                  {p.demoCases?.length > 0 && (
                    <div className="mt-2 text-xs text-slate-600">Demo Case → {p.demoCases.join(' · ')}</div>
                  )}
                </div>
                <span className="text-slate-600 group-hover:text-slate-300 transition-colors text-lg flex-shrink-0">→</span>
              </Link>
            )
          })}
        </div>

        {/* Start button */}
        <div className="text-center">
          <Link
            to="/coding-agent/1"
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
