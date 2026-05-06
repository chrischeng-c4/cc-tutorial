import { Link } from 'react-router-dom'
import { MiniVisualAid } from '../../components/cc/shared'
import { ACCENT, AUDIENCE_STYLES, COURSE_PARTS, COURSE_SECTIONS, PARTS, USAGE_STYLES } from '../../data/claudeCodeParts'

function PartBadge({ children, className }) {
  return <span className={`rounded-full border px-2.5 py-1 text-xs ${className}`}>{children}</span>
}

export default function ClaudeCodeIndex() {
  const partsBySlug = new Map(COURSE_PARTS.map(part => [part.slug, part]))

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
            整份教材分成上下兩半：上半部先教 coding agent 的觀念、產品用法與進階技巧；
            下半部每一個 part 都是一個 demo，把方法套到真實工作情境。
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-4">
          <div className="text-white font-semibold mb-2">這份補充教材怎麼用</div>
          <p className="text-slate-400 text-sm leading-relaxed">
            每個章節都用穩定 slug 當識別與網址。先看上半部，建立共通語言與風險邊界；
            再進下半部，逐個 demo 練輸入資料、CLI first、HITL 與可 review 產出。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2">
          {COURSE_SECTIONS.map((section) => (
            <div key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="text-white text-base font-bold mb-2">{section.title}</div>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{section.desc}</p>
              <div className="grid gap-3">
                {section.groups.map(group => (
                  <div key={group.title}>
                    <div className="mb-1.5 text-xs font-semibold text-slate-400">{group.title}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.parts.slice(0, 8).map(slug => {
                        const part = partsBySlug.get(slug)
                        return (
                          <Link
                            key={slug}
                            to={part.path}
                            className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400 no-underline transition-colors hover:border-white/20 hover:text-white font-mono"
                          >
                            {part.slug}
                          </Link>
                        )
                      })}
                      {group.parts.length > 8 && (
                        <span className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-600">
                          +{group.parts.length - 8}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
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
                先講 coding agent 使用方法與 token/context 管理，再逐個進 demo part。
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
              <h2 className="text-white font-bold text-lg mb-2">講師 Demo 準備清單</h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                學員主路徑已經在下半部 demo part。這頁保留給講師檢查資料準備、CLI / export 優先路徑、
                MCP optional 項與 HITL 確認。
              </p>
            </div>
            <span className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold flex-shrink-0">
              查看清單 →
            </span>
          </div>
        </Link>

        {/* Course cards */}
        <div className="space-y-8 mb-16">
          {COURSE_SECTIONS.map((section) => (
            <section key={section.title} className="space-y-8">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-white text-2xl font-black">{section.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">{section.desc}</p>
              </div>
              {section.groups.map((group) => (
                <div key={group.title}>
                  <div className="mb-3">
                    <h3 className="text-white text-lg font-bold">{group.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mt-1">{group.desc}</p>
                  </div>
                  <div className="space-y-3">
                    {group.parts.map((slug) => {
                      const p = partsBySlug.get(slug)
                      const c = ACCENT[p.accent]
                      return (
                        <Link
                          key={p.path}
                          to={p.path}
                          className={`group flex flex-col gap-4 rounded-2xl border ${c.border} ${c.bg} p-5 no-underline transition-all hover:scale-[1.01] hover:shadow-xl md:flex-row md:items-center`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold font-mono ${c.badge.split(' ')[1]}`}>{p.slug}</span>
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
                              <div className="mt-2 text-xs text-slate-600">對應下半部 Demo → {p.demoCases.join(' · ')}</div>
                            )}
                            {p.relatedConcepts?.length > 0 && (
                              <div className="mt-2 text-xs text-slate-600">對應觀念 → {p.relatedConcepts.join(' · ')}</div>
                            )}
                          </div>
                          <MiniVisualAid visual={p.visual} accent={p.accent} className="w-full md:w-56 md:flex-shrink-0" />
                          <span className="text-slate-600 group-hover:text-slate-300 transition-colors text-lg flex-shrink-0">→</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>

        {/* Start button */}
        <div className="text-center">
          <Link
            to={PARTS[0].path}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg transition-all no-underline shadow-2xl shadow-violet-500/25"
          >
            從基礎觀念開始
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
