import { Link } from 'react-router-dom'
import { COURSE_PARTS } from '../data/claudeCodeParts'
import { teachingTracks } from '../data/learningGuides'
import { agenda, mcpCliRules, tokenRules, tools } from '../data/workshopPlan'

export default function WorkshopPlan() {
  return (
    <main className="pt-16 min-h-screen">
      <section className="border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="inline-flex px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 text-sm font-medium mb-6">
            可拆多場教學 · Claude Code + Codex
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
            Coding Agent<br />
            <span className="text-cyan-300">課程設計</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
            不用把課切成兩條角色路線。這堂課分成上下兩半：
            上半部把觀念、產品用法與進階技巧拆成可單獨回看的章節；下半部每一個 part 都是一個 demo。
            第一輪可以挑重點講，後續場次再深入 hooks、MCP、Skill、Subagent 與 agentic coding。
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-cyan-300 text-sm font-semibold mb-2">多場路線</p>
              <h2 className="text-white text-2xl font-black">完整教材庫，第一輪只挑主線</h2>
            </div>
            <span className="text-sm text-slate-500">{COURSE_PARTS.length} 個可回看 part</span>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {teachingTracks.map((track) => (
              <div key={track.title} className="rounded-lg border border-white/10 bg-black/15 p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <div className="text-white text-sm font-semibold">{track.title}</div>
                  <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-300">{track.audience}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{track.goal}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5 mb-12">
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
            <div className="text-cyan-300 text-sm font-bold mb-2">上半部</div>
            <h2 className="text-white text-2xl font-black mb-3">觀念教導：先建立共通語言</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              重點是「如何使用這類工具」：先講 agent loop、context、permission，再進 prompt、工具指令與進階介面。
              這些不是工程師專屬知識，PM 在寫 PRD、整理訪談或跑 demo 時一樣會用到。
            </p>
          </div>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
            <div className="text-violet-300 text-sm font-bold mb-2">下半部</div>
            <h2 className="text-white text-2xl font-black mb-3">Demo Part：一章一個情境</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              每個 demo 都是一個獨立 part，可照時間挑 2-3 個現場推演。每個 demo 都先用 CLI / script 或 export 檔跑通；
              MCP 只當 optional 進階路徑，避免現場被權限與 server 開發卡住。
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-12">
          {agenda.map((item) => (
            <div key={`${item.minutes}-${item.title}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 grid grid-cols-1 md:grid-cols-[7rem_1fr_1fr] gap-4">
              <div>
                <div className="text-slate-600 text-xs">{item.block}</div>
                <div className="text-white font-mono text-sm mt-1">{item.minutes}</div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.focus}</p>
              </div>
              <div className="text-sm leading-relaxed text-slate-300 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-4">
                {item.outcome}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-12">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-cyan-300 text-sm font-semibold mb-2">工具準備</p>
              <h2 className="text-white text-2xl font-black">兩套工具都要準備</h2>
            </div>
            <Link to="/demo-checklist" className="text-sm text-slate-500 hover:text-slate-300 no-underline">
              看講師準備清單 →
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {tools.map((tool) => (
              <div key={tool.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="text-white text-xl font-bold mb-1">{tool.name}</h3>
                <div className="text-slate-500 text-sm mb-5">{tool.surface}</div>
                <div className="grid gap-4">
                  <div>
                    <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">課前準備</div>
                    <ul className="space-y-2">
                      {tool.setup.map((item) => <li key={item} className="text-slate-300 text-sm">□ {item}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">適合練習</div>
                    <ul className="space-y-2">
                      {tool.strengths.map((item) => <li key={item} className="text-slate-400 text-sm">→ {item}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12 rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-violet-300 text-sm font-semibold mb-2">工具抉擇</p>
              <h2 className="text-white text-2xl font-black">CLI vs MCP</h2>
            </div>
            <Link to="/coding-agent/cli-tooling" className="text-sm text-slate-500 hover:text-slate-300 no-underline">
              看詳細章節 →
            </Link>
          </div>
          <div className="grid gap-3">
            {mcpCliRules.map((item) => (
              <div key={item.rule} className="rounded-lg border border-white/10 bg-black/15 p-4">
                <div className="text-violet-300 font-semibold text-sm mb-3">{item.rule}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="text-sm text-slate-300">
                    <span className="text-emerald-300 font-semibold">適合：</span>{item.use}
                  </div>
                  <div className="text-sm text-slate-500">
                    <span className="text-rose-300 font-semibold">避免：</span>{item.avoid}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="text-white text-2xl font-black mb-5">Token 不浪費原則</h2>
          <div className="grid gap-3">
            {tokenRules.map((item) => (
              <div key={item.rule} className="rounded-lg border border-white/10 bg-black/15 p-4">
                <div className="text-amber-300 font-semibold text-sm mb-3">{item.rule}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="text-sm text-slate-500">
                    <span className="text-rose-300 font-semibold">避免：</span>{item.bad}
                  </div>
                  <div className="text-sm text-slate-300">
                    <span className="text-emerald-300 font-semibold">改成：</span>{item.good}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
