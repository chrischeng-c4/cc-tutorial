import { useState } from 'react'
import { Link } from 'react-router-dom'

const questions = [
  {
    id: 1,
    label: '觀念題',
    labelColor: 'bg-sky-500/20 text-sky-300',
    q: 'Claude Code / Codex 是一般 chatbot 嗎？它們是怎麼執行的？',
    answer: '不是。它們是 coding agent，可以在授權範圍內讀 repo、改檔、跑指令，並把結果交給你 review。Claude Code 偏本機 terminal cowork；Codex 可用 CLI / IDE，也可把工作委派到 Codex cloud 背景任務。',
  },
  {
    id: 2,
    label: '觀念題',
    labelColor: 'bg-sky-500/20 text-sky-300',
    q: 'CLAUDE.md / AGENTS.md 是什麼？應該放在哪裡？它的作用是什麼？',
    answer: '放在專案根目錄（或 home 目錄做全域設定）的 Markdown 規則檔。Claude Code 常用 CLAUDE.md，Codex 常用 AGENTS.md，用來定義專案規範、常用指令、注意事項。',
  },
  {
    id: 3,
    label: '觀念題',
    labelColor: 'bg-sky-500/20 text-sky-300',
    q: 'Coding agent 在執行「刪除檔案」這類高風險操作前，應該怎麼控管？',
    answer: '用 permission / approval 模式要求確認。高風險操作要暫停給人 review；可以用設定、hooks、approval modes 或 CI gate 控制哪些操作能自動執行。',
  },
  {
    id: 4,
    label: '操作題',
    labelColor: 'bg-amber-500/20 text-amber-300',
    q: '課前要確認哪兩套工具？',
    answer: 'Claude Code 與 Codex 都要確認帳號、repo 權限、CLI / IDE 是否可用、外部系統權限，以及允許的 approval / permission 模式。本機可用 claude --version / codex --version 檢查。',
  },
  {
    id: 5,
    label: '操作題',
    labelColor: 'bg-amber-500/20 text-amber-300',
    q: '對話中 token 越來越多會發生什麼事？你可以用哪個指令處理？',
    answer: '每一輪都會帶著前面歷史一起算 input token，所以單輪成本會變高，也可能出現 lost in the middle。即使有 1M context，日常仍建議用 200K 並定期 /compact 或 /clear。',
  },
  {
    id: 6,
    label: '操作題',
    labelColor: 'bg-amber-500/20 text-amber-300',
    q: '/compact 和 /clear 差在哪？各自什麼時候用？',
    answer: '/compact 讓 Claude 把對話歷史壓縮成摘要，保留關鍵脈絡繼續工作，適合長任務中途節省 token。/clear 清空目前對話脈絡重新開始，適合切換到不相關的新任務。',
  },
  {
    id: 7,
    label: '情境題',
    labelColor: 'bg-violet-500/20 text-violet-300',
    q: '你叫 agent「幫我重構這個 function」，它改完後測試掛了。你的下一步是什麼？',
    answer: '先用 git diff 看它改了什麼，再決定是回滾單一檔案、還是繼續叫 agent 修。重點是：讓 agent 動手前，確保你的工作目錄是乾淨的 git 狀態，這樣任何改動都可以 review / 還原。',
  },
  {
    id: 8,
    label: '情境題',
    labelColor: 'bg-violet-500/20 text-violet-300',
    q: '你的團隊想統一 agent 行為，例如：預設用繁體中文回答、不要動 migration 檔案。你會怎麼設定？',
    answer: '寫進專案規則檔：Claude Code 用 CLAUDE.md，Codex 用 AGENTS.md。檔案 commit 進 repo，團隊共用相同規則，但重要操作仍要 review。',
  },
]

export default function PreQuiz() {
  const [revealed, setRevealed] = useState({})

  function toggle(id) {
    setRevealed(r => ({ ...r, [id]: !r[id] }))
  }

  function revealAll() {
    const all = {}
    questions.forEach(q => { all[q.id] = true })
    setRevealed(all)
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
            Claude Code + Codex<br />
            <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">預習題目</span>
          </h1>
          <p className="text-slate-400 leading-relaxed mb-6">
            這不是計分測驗，也不是入門門檻。題目刻意放了一些課程後面才會講到的名詞；
            現在不會很正常，先看題目建立問題感，上完課再回來對照一次。
          </p>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm leading-relaxed text-rose-100 mb-6">
            建議用法：課前先想一次，不確定就留白；課後再展開答案，檢查自己對工具、context、permission 與 HITL 的理解是否改變。
          </div>
          <button
            onClick={revealAll}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg"
          >
            全部展開答案
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <button
                className="w-full text-left p-6 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
                onClick={() => toggle(q.id)}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-400 text-xs font-bold mt-0.5">
                  {q.id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${q.labelColor}`}>{q.label}</span>
                  </div>
                  <p className="text-white font-medium leading-relaxed">{q.q}</p>
                </div>
                <span className="flex-shrink-0 text-slate-500 text-sm mt-1">
                  {revealed[q.id] ? '▲' : '▼'}
                </span>
              </button>

              {revealed[q.id] && (
                <div className="px-6 pb-6">
                  <div className="rounded-xl bg-black/30 border border-emerald-500/20 p-5">
                    <div className="flex items-center gap-2 mb-3 text-emerald-400 text-xs font-semibold uppercase tracking-wide">
                      <span>✓</span> 參考答案
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{q.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors no-underline text-sm">
            ← 回首頁
          </Link>
          <Link to="/coding-agent" className="text-slate-400 hover:text-white transition-colors no-underline text-sm">
            直接看課程內容 →
          </Link>
        </div>
      </div>
    </main>
  )
}
