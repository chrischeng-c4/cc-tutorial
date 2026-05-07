import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import { PARTS } from '../data/claudeCodeParts'
import { demoScenarios } from '../data/demoScenarios'
import { agenda } from '../data/workshopPlan'

const summary = [
  { label: '課程型態', value: '多場可複習' },
  { label: '上半部', value: `${PARTS.length} 觀念章` },
  { label: '下半部', value: `${demoScenarios.length} demos` },
]

const methodFlow = agenda.slice(0, 5)
const caseFlow = agenda.slice(5)

export default function Home() {
  return (
    <main className="pt-16 min-h-screen">
      <section className="border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 text-sm mb-6">
              內部教學 · Claude Code + Codex
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
              Coding Agent<br />
              <span className="text-cyan-300">可複習教學路線</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed mb-8">
              課程不走角色分流，改成上下兩半：上半部把觀念、產品用法與進階技巧拆成可單獨回看的章節；
              下半部每一個 part 都是一個 demo。非 dev 能理解怎麼安全使用，dev 能學會怎麼善用 agentic coding。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/coding-agent"
                className="px-5 py-3 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-semibold transition-colors no-underline"
              >
                開始工具教材
              </Link>
            </div>
          </div>

          <div className="relative min-h-[280px]">
            <img
              src={heroImage}
              alt="內部教學視覺"
              className="absolute right-0 top-0 w-[56%] max-w-[260px] opacity-70"
            />
            <div className="absolute left-0 bottom-0 w-full max-w-md rounded-xl border border-white/10 bg-[#101018] p-4">
              <div className="text-slate-500 text-xs font-mono mb-3">course order</div>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-300">上半部</span>
                  <span className="text-slate-400">單章觀念與操作框架</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-300">下半部</span>
                  <span className="text-slate-400">每個 part 是一個 demo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-3 gap-3 mb-10">
          {summary.map((item) => (
            <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="text-2xl font-black text-white">{item.value}</div>
              <div className="text-slate-500 text-sm mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <section className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
            <div className="text-cyan-300 text-sm font-semibold mb-2">上半部</div>
            <h2 className="text-white text-2xl font-black mb-4">觀念教導</h2>
            <div className="space-y-3">
              {methodFlow.map((item) => (
                <div key={item.minutes} className="grid grid-cols-[4.5rem_1fr] gap-3">
                  <span className="text-slate-500 text-sm font-mono">{item.minutes}</span>
                  <div>
                    <div className="text-white text-sm font-semibold">{item.title}</div>
                    <p className="text-slate-400 text-xs leading-relaxed mt-1">{item.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
            <div className="text-violet-300 text-sm font-semibold mb-2">下半部</div>
            <h2 className="text-white text-2xl font-black mb-4">Demo part</h2>
            <div className="space-y-3">
              {caseFlow.map((item) => (
                <div key={item.minutes} className="grid grid-cols-[4.5rem_1fr] gap-3">
                  <span className="text-slate-500 text-sm font-mono">{item.minutes}</span>
                  <div>
                    <div className="text-white text-sm font-semibold">{item.title}</div>
                    <p className="text-slate-400 text-xs leading-relaxed mt-1">{item.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-center">
          <div>
            <h2 className="text-white text-xl font-bold mb-2">補充教材</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Claude Code 與 Codex 的章節整理成同一套補充教材，閱讀順序改成：
              上半部觀念教導 → 下半部 Demo 實作。每章都可獨立回看，也可拆成多場教學。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/coding-agent" className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-sm no-underline">
              工具教材
            </Link>
            <Link to="/llm" className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-sm no-underline">
              LLM 附錄
            </Link>
            <Link to="/agent" className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 text-sm no-underline">
              Agent 附錄
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
