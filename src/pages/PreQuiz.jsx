import { useState } from 'react'
import { Link } from 'react-router-dom'

const questions = [
  {
    id: 1,
    type: 'concept',
    label: '觀念題',
    labelColor: 'bg-sky-500/20 text-sky-300',
    q: 'Claude Code 是一個 VS Code 外掛嗎？它是怎麼執行的？',
    hint: '想想它安裝的方式和運作的環境。',
  },
  {
    id: 2,
    type: 'concept',
    label: '觀念題',
    labelColor: 'bg-sky-500/20 text-sky-300',
    q: 'CLAUDE.md 是什麼？應該放在哪裡？它的作用是什麼？',
    hint: '這是 Claude Code 讀取專案規範的方式。',
  },
  {
    id: 3,
    type: 'concept',
    label: '觀念題',
    labelColor: 'bg-sky-500/20 text-sky-300',
    q: 'Claude Code 在執行「刪除檔案」這類高風險操作前，會怎麼做？',
    hint: '它不會默默就做掉，想想它的安全機制。',
  },
  {
    id: 4,
    type: 'hands-on',
    label: '操作題',
    labelColor: 'bg-amber-500/20 text-amber-300',
    q: '安裝 Claude Code 需要什麼前置條件？安裝指令是什麼？',
    hint: '需要特定版本的 Node.js，試著查查看。',
  },
  {
    id: 5,
    type: 'hands-on',
    label: '操作題',
    labelColor: 'bg-amber-500/20 text-amber-300',
    q: '對話中 token 越來越多會發生什麼事？你可以用哪個指令處理？',
    hint: '有兩個 slash 指令可以解決這個問題。',
  },
  {
    id: 6,
    type: 'hands-on',
    label: '操作題',
    labelColor: 'bg-amber-500/20 text-amber-300',
    q: '/compact 和 /clear 差在哪？各自什麼時候用？',
    hint: '一個保留記憶，一個清空記憶。',
  },
  {
    id: 7,
    type: 'scenario',
    label: '情境題',
    labelColor: 'bg-violet-500/20 text-violet-300',
    q: '你叫 Claude Code「幫我重構這個 function」，它改完後測試掛了。你的下一步是什麼？（不是問 Claude，是問你自己該怎麼辦）',
    hint: '想想 git 的基本工作流程。',
  },
  {
    id: 8,
    type: 'scenario',
    label: '情境題',
    labelColor: 'bg-violet-500/20 text-violet-300',
    q: '你的團隊想統一 Claude Code 的行為，例如：永遠用繁體中文回答、不要動 migration 檔案。你會怎麼設定？',
    hint: '答案和第 2 題有關。',
  },
]

export default function PreQuiz() {
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const filled = Object.values(answers).filter(v => v.trim().length > 0).length

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm font-medium mb-6">
            課前預習
          </div>
          <h1 className="text-4xl font-black text-white mb-4 leading-tight">
            Claude Code<br />
            <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">預習題目</span>
          </h1>
          <p className="text-slate-400 leading-relaxed">
            課程開始前，請先試著回答以下 8 題。不確定沒關係——帶著問題進教室，答案都會在課堂中揭曉。
          </p>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-300"
                style={{ width: `${(filled / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-slate-400 text-sm whitespace-nowrap">{filled} / {questions.length} 題</span>
          </div>
        </div>

        {submitted && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 mb-10 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-emerald-300 font-semibold mb-1">已送出！帶著你的答案來上課</div>
            <div className="text-slate-400 text-sm">課堂中我們會逐題討論，看看你的直覺對了幾題。</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-400 text-xs font-bold">
                    {q.id}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${q.labelColor}`}>{q.label}</span>
                    </div>
                    <p className="text-white font-medium leading-relaxed">{q.q}</p>
                  </div>
                </div>

                <textarea
                  rows={3}
                  placeholder="你的想法..."
                  className="w-full rounded-xl bg-black/30 border border-white/10 focus:border-white/30 outline-none text-slate-300 placeholder-slate-600 text-sm p-4 resize-none transition-colors"
                  value={answers[q.id] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                />

                <button
                  type="button"
                  onClick={() => setRevealed(r => ({ ...r, [q.id]: !r[q.id] }))}
                  className="mt-2 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {revealed[q.id] ? '▲ 收起提示' : '▼ 看提示'}
                </button>

                {revealed[q.id] && (
                  <div className="mt-3 rounded-lg bg-white/5 border border-white/5 px-4 py-3 text-slate-400 text-sm">
                    💡 {q.hint}
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-semibold transition-all text-sm shadow-lg shadow-rose-500/20"
            >
              送出預習答案
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors no-underline text-sm">
            ← 回首頁
          </Link>
          <Link to="/claude-code" className="text-slate-400 hover:text-white transition-colors no-underline text-sm">
            直接看課程內容 →
          </Link>
        </div>
      </div>
    </main>
  )
}
