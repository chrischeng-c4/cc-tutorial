import { Link } from 'react-router-dom'
import { ACCENT, AUDIENCE_STYLES, COURSE_PARTS, COURSE_SECTIONS, PARTS, USAGE_STYLES } from '../../data/claudeCodeParts'
import { questionIndex, teachingTracks } from '../../data/learningGuides'

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
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
            整份教材分成上下兩半：上半部先教 coding agent 的觀念、產品用法與進階技巧；
            下半部每一個 part 都是一個實際演練，把方法套到真實工作情境。
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-4">
          <div className="text-white font-semibold mb-2">這份補充教材怎麼用</div>
          <p className="text-slate-300 text-sm leading-relaxed">
            每個章節都可以單獨回看。先看上半部建立共通語言與風險邊界；
            再進下半部，逐個演練輸入資料、CLI first、HITL 與可 review 產出。
            非 dev 可以從「什麼時候用、怎麼安全用」切入；dev 可以從「怎麼把流程工程化」切入。
          </p>
        </div>

        <section className="mb-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-5">
          <div className="mb-4">
            <div className="mb-2 text-sm font-semibold text-cyan-300">教學路徑</div>
            <h2 className="text-white text-lg font-bold">可以拆成多場教學，不必一次講完</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {teachingTracks.map((track) => (
              <div key={track.title} className="rounded-xl border border-white/10 bg-black/15 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <div className="text-white text-sm font-semibold">{track.title}</div>
                  <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300">{track.audience}</span>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-slate-300">{track.goal}</p>
                <div className="flex flex-wrap gap-1.5">
                  {track.parts.map((slug) => {
                    const part = partsBySlug.get(slug)
                    return part ? (
                      <Link
                        key={slug}
                        to={part.path}
                        className="rounded-md border border-white/10 px-2 py-1 font-mono text-xs text-slate-300 no-underline transition-colors hover:border-white/20 hover:text-white"
                      >
                        {slug}
                      </Link>
                    ) : null
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
          <div className="mb-4">
            <div className="mb-2 text-sm font-semibold text-amber-300">問題索引</div>
            <h2 className="text-white text-lg font-bold">用問題回查教材</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {questionIndex.map((item) => (
              <div key={item.question} className="rounded-xl border border-white/10 bg-black/15 p-4">
                <div className="text-white text-sm font-semibold mb-2">{item.question}</div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">{item.answer}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.parts.map((slug) => {
                    const part = partsBySlug.get(slug)
                    return part ? (
                      <Link
                        key={slug}
                        to={part.path}
                        className="rounded-md border border-white/10 px-2 py-1 font-mono text-xs text-slate-300 no-underline transition-colors hover:border-white/20 hover:text-white"
                      >
                        {slug}
                      </Link>
                    ) : null
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Course cards */}
        <div className="space-y-8 mb-16">
          {COURSE_SECTIONS.map((section) => (
            <section key={section.title} className="space-y-8">
              <div className="border-b border-white/10 pb-3">
                <h2 className="text-white text-2xl font-black">{section.title}</h2>
                <p className="text-slate-300 text-sm leading-relaxed mt-1">{section.desc}</p>
              </div>
              {section.groups.map((group) => (
                <div key={group.title}>
                  <div className="mb-3">
                    <h3 className="text-white text-lg font-bold">{group.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mt-1">{group.desc}</p>
                  </div>
                  <div className="space-y-3">
                    {group.parts.map((slug) => {
                      const p = partsBySlug.get(slug)
                      const c = ACCENT[p.accent]
                      return (
                        <Link
                          key={p.path}
                          to={p.path}
                          className={`group flex gap-4 rounded-2xl border ${c.border} ${c.bg} p-5 no-underline transition-colors hover:border-white/30`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold font-mono ${c.badge.split(' ')[1]}`}>{p.slug}</span>
                              <span className="text-slate-300 text-xs">{p.time}</span>
                              <div className="flex gap-1 ml-1 flex-wrap">
                                <PartBadge className={USAGE_STYLES[p.usage]}>{p.usage}</PartBadge>
                                <PartBadge className={AUDIENCE_STYLES[p.audience]}>{p.audience}</PartBadge>
                                {p.experimental && (
                                  <PartBadge className="border-amber-500/25 bg-amber-500/10 text-amber-300">實驗性</PartBadge>
                                )}
                                {p.tags.map(a => (
                                  <span key={a} className="px-1.5 py-0.5 rounded text-xs border border-white/10 text-slate-300">{a}</span>
                                ))}
                              </div>
                            </div>
                            <div className="text-white font-semibold">{p.title}</div>
                            {p.demoCases?.length > 0 && (
                              <div className="mt-2 text-sm text-slate-300">對應下半部 Demo → {p.demoCases.join(' · ')}</div>
                            )}
                            {p.relatedConcepts?.length > 0 && (
                              <div className="mt-2 text-sm text-slate-300">對應觀念 → {p.relatedConcepts.join(' · ')}</div>
                            )}
                          </div>
                          <span className="text-slate-500 group-hover:text-white transition-colors text-lg flex-shrink-0">→</span>
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
          <Link to="/agent" className="text-slate-300 hover:text-white transition-colors no-underline text-sm">
            ← Agent 概念
          </Link>
        </div>
      </div>
    </main>
  )
}
