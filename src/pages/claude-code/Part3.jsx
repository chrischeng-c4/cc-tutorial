import { PageLayout, SectionHeader, CodeBlock, Callout, CmdTable, H3 } from '../../components/cc/shared'

export default function Part3() {
  return (
    <PageLayout partIndex={2}>
      <SectionHeader partIndex={2} />

      <H3>安裝與啟動</H3>
      <CodeBlock title="Terminal">
{`# 安裝（需要 Node.js 18+）
npm install -g @anthropic-ai/claude-code

# 啟動
claude

# 直接帶任務啟動（非互動模式）
claude "幫我解釋這個 repo 的架構"

# 查看版本
claude --version`}
      </CodeBlock>

      <Callout type="info">
        登入方式有兩種：Anthropic API Key（按量計費），或 claude.ai Max 訂閱帳號（月費制）。團隊使用建議申請 API Key，方便統一管控費用。
      </Callout>

      <H3>互動模式基本操作</H3>
      <CodeBlock title="對話範例">
{`$ claude
> 幫我解釋 src/auth/middleware.ts 做了什麼

# Claude 會自己讀檔案，不需要你貼程式碼

> 它有什麼安全疑慮嗎？

# 可以追問，它記得上文

> 幫我修掉你說的第二個問題

# 直接叫它動手改

> 現在跑一下測試看有沒有壞掉

# 它可以執行 npm test，根據結果繼續調整`}
      </CodeBlock>

      <H3>Slash 指令速查</H3>
      <CmdTable rows={[
        { cmd: '/help',    desc: '列出所有可用指令' },
        { cmd: '/clear',   desc: '清空對話記憶，從零開始。切換不相關任務時用' },
        { cmd: '/compact', desc: '壓縮對話成摘要，保留脈絡但節省 token。長任務中途用' },
        { cmd: '/cost',    desc: '顯示這次對話累積的 token 用量與估算費用' },
        { cmd: '/config',  desc: '開啟設定，調整 permission、預設行為' },
        { cmd: '/init',    desc: '在當前專案自動生成 CLAUDE.md 草稿' },
        { cmd: '/doctor',  desc: '診斷環境問題（Node 版本、API 連線等）' },
      ]} />

      <H3>CLAUDE.md：給 Claude 的工作說明書</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        放在專案根目錄，commit 進 repo，整個團隊共用。Claude Code 每次啟動都會讀取。
      </p>
      <CodeBlock title="CLAUDE.md 範例">
{`# 專案說明
這是一個 Next.js 14 + TypeScript 的電商後台管理系統。

# 常用指令
- npm run dev        開發伺服器
- npm test           單元測試（Vitest）
- npm run typecheck  TypeScript 型別檢查
- npm run lint       ESLint

# 程式碼規範
- 所有回答請使用繁體中文
- 使用 TypeScript strict mode，不允許 any
- API response 統一格式：{ data, error, meta }
- 元件用 function component + hooks，不用 class component

# 重要限制
- 不要修改 /migrations 目錄下的任何檔案
- 不要直接操作 production 的環境變數
- 送出 commit 前確認沒有遺留 console.log`}
      </CodeBlock>

      <Callout type="tip">
        用 /init 讓 Claude 自動分析你的 repo 生成初版 CLAUDE.md，再人工微調，比從頭寫快很多。
      </Callout>

      {/* ── Deep dive ── */}
      <div className="rounded-2xl border border-slate-500/20 bg-slate-500/5 p-6 mt-6">
        <div className="flex items-center gap-2 mb-7">
          <span className="text-lg">🔬</span>
          <h3 className="text-white font-bold">技術底層：多輪對話 · 計費模型 · Context 管理</h3>
        </div>

        {/* 1. Multi-turn */}
        <div className="mb-8">
          <h4 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-sky-500/30 text-sky-300 text-xs flex items-center justify-center font-bold flex-shrink-0">1</span>
            多輪對話技術上是怎麼進行的
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            很多人以為模型有「記憶」。實際上完全沒有——模型本身是無狀態的。
            每一輪對話，<span className="text-white font-medium">client 都必須把完整的對話歷史重新打包傳給 API</span>，
            模型從頭讀一次才能「知道」之前說了什麼。
          </p>
          <div className="rounded-xl bg-black/40 border border-white/10 p-5 font-mono text-xs leading-relaxed mb-4">
            <div className="text-slate-500 mb-2">{'// 第 1 輪 API 請求'}</div>
            <div className="text-sky-300">{'messages: ['}</div>
            <div className="text-emerald-300 ml-4">{'{ role: "user", content: "幫我看這個 function" }'}</div>
            <div className="text-sky-300">{']'}</div>
            <div className="text-slate-500 mt-3 mb-2">{'// 第 2 輪 API 請求（完整歷史全部重送）'}</div>
            <div className="text-sky-300">{'messages: ['}</div>
            <div className="text-slate-400 ml-4">{'{ role: "user",      content: "幫我看這個 function" },'}</div>
            <div className="text-slate-400 ml-4">{'{ role: "assistant", content: "這個 function 有以下問題..." },'}</div>
            <div className="text-emerald-300 ml-4">{'{ role: "user",      content: "好，幫我修掉第二個問題" }'}</div>
            <div className="text-sky-300">{']'}</div>
            <div className="text-slate-500 mt-3">{'// 第 N 輪：歷史 × N 條訊息全部重送，input token 持續累積'}</div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            對話越長，<span className="text-amber-300 font-medium">每一輪的 input token 就越多</span>。
            Claude Code 幫你管理這個歷史，但底層原理就是如此——沒有魔法，只有打包重送。
          </p>
        </div>

        {/* 2. Token billing */}
        <div className="mb-8">
          <h4 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/30 text-amber-300 text-xs flex items-center justify-center font-bold flex-shrink-0">2</span>
            計費模型：Input / Output / Thinking Token
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Anthropic 按三種 token 分別計費，價格不同：
          </p>
          <div className="rounded-xl border border-white/10 overflow-hidden mb-4">
            <div className="grid grid-cols-3 text-xs text-slate-500 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
              <span>類型</span><span>內容</span><span className="text-right">相對費率</span>
            </div>
            {[
              { type: 'Input Token',   color: 'text-sky-300',    dot: 'bg-sky-400',    rate: '1×',  rateColor: 'text-emerald-400', content: '你送出的所有內容：system prompt、完整對話歷史、工具定義、當前訊息' },
              { type: 'Output Token',  color: 'text-violet-300', dot: 'bg-violet-400', rate: '5×',  rateColor: 'text-amber-400',   content: '模型生成的回覆，包含工具呼叫的參數' },
              { type: 'Thinking Token',color: 'text-rose-300',   dot: 'bg-rose-400',   rate: '5×',  rateColor: 'text-amber-400',   content: '開啟 Extended Thinking 時，模型的內部推理過程（你看不到全部，但要付錢）' },
            ].map(({ type, color, dot, rate, rateColor, content }) => (
              <div key={type} className="flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <span className={`w-2 h-2 rounded-full ${dot} mt-1.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <span className={`font-mono text-xs font-semibold ${color}`}>{type}</span>
                  <p className="text-slate-400 text-xs leading-relaxed mt-0.5">{content}</p>
                </div>
                <span className={`text-sm font-bold flex-shrink-0 ${rateColor}`}>{rate}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-black/40 border border-white/10 p-4 text-xs font-mono">
            <div className="text-slate-500 mb-2">{'// 一次典型「修 bug」任務的 token 分佈'}</div>
            <div className="flex gap-6 flex-wrap">
              <div><span className="text-sky-300">input:</span><span className="text-slate-300 ml-2">~8,000 tokens</span><span className="text-slate-600 ml-2">(歷史 + 相關程式碼)</span></div>
              <div><span className="text-violet-300">output:</span><span className="text-slate-300 ml-2">~500 tokens</span></div>
              <div><span className="text-rose-300">thinking:</span><span className="text-slate-300 ml-2">~2,000 tokens</span><span className="text-slate-600 ml-2">(若開啟)</span></div>
            </div>
          </div>
        </div>

        {/* 3. Why clear session */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center font-bold flex-shrink-0">3</span>
            為什麼要定時清 Session：1M Context 的陷阱
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Claude 支援到 200K token 的 context window，但大不代表好用。有兩個根本問題：
          </p>
          <div className="space-y-3 mb-4">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="text-amber-300 font-semibold text-sm mb-2">問題一：成本線性累積</div>
              <p className="text-slate-400 text-sm leading-relaxed">
                每輪對話的 input token = 所有歷史訊息的總和。對話進行 10 輪、每輪輸出 1,000 token，
                到第 10 輪光是 input 就要付前 9 輪輸出的費用。工具呼叫越多，歷史膨脹越快。
              </p>
            </div>
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
              <div className="text-rose-300 font-semibold text-sm mb-2">問題二：Attention 注意力稀釋</div>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">
                Transformer 的 Self-Attention 讓每個 token 都要跟 context 裡的所有其他 token 計算相關性。
                Context 越長，注意力越分散——出現 <span className="text-white font-medium">「Lost in the Middle」</span> 現象：
                頭尾記得清楚，中間的重要資訊容易被忽略。
              </p>
              <div className="rounded-lg bg-black/40 border border-white/5 p-3 font-mono text-xs">
                <div className="text-slate-500 mb-1">{'// Attention 計算複雜度'}</div>
                <div><span className="text-rose-300">O(n²)</span><span className="text-slate-400 ml-2">← context 長度 n 的平方</span></div>
                <div className="text-slate-600 mt-1">{'// 1K tokens → 1M 次計算'}</div>
                <div className="text-slate-600">{'// 10K tokens → 100M 次計算'}</div>
                <div className="text-slate-600">{'// 100K tokens → 10B 次計算  ← 費用與延遲爆炸'}</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="text-emerald-300 font-semibold text-sm mb-2">實務建議</div>
            <div className="space-y-1.5 text-sm text-slate-300">
              {[
                '完成一個獨立任務後 → /clear，開新 session 做下一件事',
                '同一任務進行到一半但對話變長 → /compact 壓縮，保留摘要繼續',
                '用 /cost 監控費用，超過 $0.1 就評估是否該清掉重來',
                '把任務結果（git diff、測試報告）存到檔案，不要留在對話裡',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 flex-shrink-0 mt-0.5">→</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
