import { useState } from 'react'
import { Link } from 'react-router-dom'

const questions = [
  {
    id: 1,
    label: '觀念題',
    labelColor: 'bg-sky-500/20 text-sky-300',
    q: 'Claude Code 是一個 VS Code 外掛嗎？它是怎麼執行的？',
    answer: '不是。Claude Code 是一個跑在終端機的 CLI 工具（npm 安裝），不依附任何 IDE。它在你的本機環境直接讀取檔案、執行指令，有 VS Code / JetBrains 的整合外掛，但本體是 CLI。',
  },
  {
    id: 2,
    label: '觀念題',
    labelColor: 'bg-sky-500/20 text-sky-300',
    q: 'CLAUDE.md 是什麼？應該放在哪裡？它的作用是什麼？',
    answer: '放在專案根目錄（或 home 目錄做全域設定）的 Markdown 檔案。Claude Code 啟動時會自動讀取，讓你定義專案規範、常用指令、注意事項——等於給 Claude 的工作說明書。',
  },
  {
    id: 3,
    label: '觀念題',
    labelColor: 'bg-sky-500/20 text-sky-300',
    q: 'Claude Code 在執行「刪除檔案」這類高風險操作前，會怎麼做？',
    answer: '它會在終端機顯示即將執行的動作並暫停，等你按 Y 確認才繼續。這是內建的 Permission 機制，你也可以在設定裡調整哪些操作需要確認、哪些可以自動執行。',
  },
  {
    id: 4,
    label: '操作題',
    labelColor: 'bg-amber-500/20 text-amber-300',
    q: '安裝 Claude Code 需要什麼前置條件？安裝指令是什麼？',
    answer: '需要 Node.js 18 以上。安裝指令：npm install -g @anthropic-ai/claude-code，然後執行 claude 啟動。首次使用需要 Anthropic API Key 或 claude.ai Max 帳號登入。',
  },
  {
    id: 5,
    label: '操作題',
    labelColor: 'bg-amber-500/20 text-amber-300',
    q: '對話中 token 越來越多會發生什麼事？你可以用哪個指令處理？',
    answer: '對話歷史過長會接近 context window 上限，導致速度變慢、費用增加，最終舊的訊息被截斷。可以用 /compact 壓縮（保留摘要）或 /clear 完全清空重來。',
  },
  {
    id: 6,
    label: '操作題',
    labelColor: 'bg-amber-500/20 text-amber-300',
    q: '/compact 和 /clear 差在哪？各自什麼時候用？',
    answer: '/compact 讓 Claude 把對話歷史壓縮成摘要，保留關鍵脈絡繼續工作，適合長任務中途節省 token。/clear 完全清空記憶重新開始，適合切換到不相關的新任務。',
  },
  {
    id: 7,
    label: '情境題',
    labelColor: 'bg-violet-500/20 text-violet-300',
    q: '你叫 Claude Code「幫我重構這個 function」，它改完後測試掛了。你的下一步是什麼？',
    answer: '先用 git diff 看它改了什麼，再決定是 git checkout 回滾、還是繼續叫 Claude 修。重點是：讓 Claude 動手前，確保你的工作目錄是乾淨的 git 狀態——這樣任何改動都可以還原。',
  },
  {
    id: 8,
    label: '情境題',
    labelColor: 'bg-violet-500/20 text-violet-300',
    q: '你的團隊想統一 Claude Code 的行為，例如：永遠用繁體中文回答、不要動 migration 檔案。你會怎麼設定？',
    answer: '寫進專案的 CLAUDE.md。這個檔案 commit 進 repo，所有人 clone 後啟動 Claude Code 就會自動套用相同規則，不需要每個人自己設定。',
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
            Claude Code<br />
            <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">預習題目</span>
          </h1>
          <p className="text-slate-400 leading-relaxed mb-6">
            課程開始前，請先看題目想一想，再展開參考答案對照。帶著問題進教室，吸收效果會差很多。
          </p>
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
          <Link to="/claude-code" className="text-slate-400 hover:text-white transition-colors no-underline text-sm">
            直接看課程內容 →
          </Link>
        </div>
      </div>
    </main>
  )
}
