import { PageLayout, SectionHeader, Callout, H3 } from '../../components/cc/shared'

export default function Part8() {
  return (
    <PageLayout partIndex={7}>
      <SectionHeader partIndex={7} />

      <p className="text-slate-400 leading-relaxed mb-8">
        Part 7 你學會操作。這一章講<span className="text-white">為什麼某些操作貴、某些便宜</span>——
        為什麼 <code className="text-emerald-300 bg-emerald-500/10 px-1 rounded">/compact</code> 跟
        <code className="text-emerald-300 bg-emerald-500/10 px-1 rounded ml-1">/clear</code> 存在、什麼時候該用、什麼時候是反模式。
        讀完你才知道怎麼把 token 帳單壓低 5–10 倍。
      </p>

      {/* 1. Multi-turn */}
      <H3>1. 多輪對話技術上是怎麼進行的</H3>
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
      <p className="text-slate-400 text-sm leading-relaxed mb-10">
        對話越長，<span className="text-amber-300 font-medium">每一輪的 input token 就越多</span>。
        Claude Code 幫你管理這個歷史，但底層原理就是如此——沒有魔法，只有打包重送。
      </p>

      {/* 2. Token billing */}
      <H3>2. 計費模型：Input / Output / Thinking Token</H3>
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
      <div className="rounded-xl bg-black/40 border border-white/10 p-4 text-xs font-mono mb-10">
        <div className="text-slate-500 mb-2">{'// 一次典型「修 bug」任務的 token 分佈'}</div>
        <div className="flex gap-6 flex-wrap">
          <div><span className="text-sky-300">input:</span><span className="text-slate-300 ml-2">~8,000 tokens</span><span className="text-slate-600 ml-2">(歷史 + 相關程式碼)</span></div>
          <div><span className="text-violet-300">output:</span><span className="text-slate-300 ml-2">~500 tokens</span></div>
          <div><span className="text-rose-300">thinking:</span><span className="text-slate-300 ml-2">~2,000 tokens</span><span className="text-slate-600 ml-2">(若開啟)</span></div>
        </div>
      </div>

      {/* 3. Prompt caching */}
      <H3>3. Prompt Caching：把 input token 殺到 1/10</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        既然多輪對話每次都要重送歷史，Anthropic 提供了 <span className="text-white font-medium">prompt caching</span>：
        重複出現的前綴（system prompt、CLAUDE.md、已讀過的檔案）會被緩存，
        下一次請求只算 <span className="text-emerald-300 font-mono">0.1×</span> 的價錢。
      </p>
      <div className="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs leading-relaxed mb-4">
        <div className="flex gap-6 flex-wrap">
          <div><span className="text-slate-500">cache write:</span><span className="text-amber-300 ml-2">1.25×</span></div>
          <div><span className="text-slate-500">cache read:</span><span className="text-emerald-300 ml-2">0.1×</span><span className="text-slate-600 ml-2">← 命中後超便宜</span></div>
          <div><span className="text-slate-500">TTL:</span><span className="text-slate-300 ml-2">5 min</span><span className="text-slate-600 ml-2">(每次命中會續期)</span></div>
        </div>
      </div>
      <Callout type="warn">
        Claude Code 已自動幫你 cache 大塊前綴——但你需要知道：
        <span className="font-semibold">同一 session 連續對話最划算</span>。
        中間離開超過 5 分鐘 cache 就過期，下一輪重新從 cache write 開始算錢。所以「邊喝咖啡邊想下一個 prompt」其實在浪費錢。
      </Callout>

      {/* 4. Why context too long is bad */}
      <H3>4. 為什麼要定時清 Session：Context 越長越慘</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Claude 支援到 200K token 的 context window，但大不代表好用。有兩個根本問題：
      </p>
      <div className="space-y-3 mb-6">
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

      {/* 5. Practical guidance */}
      <H3>5. 實務建議</H3>
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="space-y-2 text-sm text-slate-300">
          {[
            '完成一個獨立任務後 → /clear，開新 session 做下一件事',
            '同一任務進行到一半但對話變長 → /compact 壓縮，保留摘要繼續',
            '用 /cost 監控費用，超過 $0.1 就評估是否該清掉重來',
            '把任務結果（git diff、測試報告）存到檔案，不要留在對話裡',
            '大範圍探查（搜整個 repo）派 subagent，不要污染主 session — 詳見 Part 10',
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-emerald-500 flex-shrink-0 mt-0.5">→</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
