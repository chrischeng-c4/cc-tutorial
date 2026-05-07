import { PageLayout, SectionHeader, Callout, CodeBlock, H3 } from '../../components/cc/shared'

const turnCostBars = [
  { turn: '第 1 輪', input: '~5K', note: '任務描述 + 少量檔案', width: '14%' },
  { turn: '第 2 輪', input: '~14K', note: '第 1 輪歷史 + 工具結果 + 新問題', width: '28%' },
  { turn: '第 3 輪', input: '~29K', note: '前兩輪歷史 + diff / log / 回覆', width: '44%' },
  { turn: '第 4 輪', input: '~52K', note: '更多檔案、測試輸出、修正紀錄', width: '64%' },
  { turn: '第 N 輪', input: '100K+', note: '長任務未 compact，歷史持續累積', width: '100%' },
]

const storageRows = [
  {
    place: 'Context',
    bestFor: '短期推理、目前任務目標、正在比較的選項、下一步',
    notFor: '長期決策紀錄、完整訪談、完整 log、review 全文',
    rule: '只放這一輪真的需要推理的材料',
  },
  {
    place: 'File',
    bestFor: '規格草稿、分析輸出、測試報告、可重跑的中間產物',
    notFor: '需要跨團隊審核或狀態流轉的工作',
    rule: '存成 Markdown / JSON，讓 agent 按需讀取片段',
  },
  {
    place: 'GitHub / GitLab',
    bestFor: 'code diff、PR discussion、review 結論、CI 結果',
    notFor: '還沒整理、沒有 owner 的大量 raw notes',
    rule: '把可追蹤的技術結論留在 PR / MR 上',
  },
  {
    place: 'JIRA / Docs',
    bestFor: '需求、決策、產品狀態、跨職能協作紀錄',
    notFor: '暫時性的工具輸出或一次性 debug log',
    rule: '讓 ticket / doc 成為 source of truth，對話只引用摘要',
  },
]

const effortRows = [
  {
    effort: 'low',
    use: '摘要、整理 meeting notes、固定格式草稿、已知路徑的小修改',
    avoid: '跨檔推理、模糊需求、需要找 root cause 的 bug',
  },
  {
    effort: 'medium',
    use: '一般 PRD review、小型 feature、已知模組內的實作與測試修正',
    avoid: '高風險 security / data migration / 架構取捨',
  },
  {
    effort: 'high',
    use: '未知 codebase 探索、跨檔實作、複雜 debug、多角度 review',
    avoid: '只是在補格式、產清單、整理已知資料',
  },
  {
    effort: 'max',
    use: '高風險決策、架構方案比較、需要完整 trade-off 與 failure mode 的 review',
    avoid: '當成日常預設，或拿來彌補缺 context / scope 太大',
  },
]

const longContextEvidenceRows = [
  {
    source: 'OpenAI 長 context eval',
    evidence: 'GPT-5.5 在 MRCR v2 8-needle 從 98.1%（4K-8K）降到 74.0%（512K-1M）；Claude Opus 4.7 在 128K-256K 為 59.2%，512K-1M 降到 32.2%。',
    note: '不是原始 lost-middle 測試，但可作為 frontier model 長 context 仍會退化的公開數字。',
  },
  {
    source: 'Lost in the Middle',
    evidence: 'GPT-3.5-Turbo 在 20/30 documents 情境，答案放中間時最差可掉超過 20%；甚至低於不給文件的 closed-book baseline 56.1%。',
    note: '原始 U-shaped curve 證據；答案在頭尾較準，中間較差。',
  },
  {
    source: 'RULER',
    evidence: '17 個 long-context LMs 中，幾乎全部在 context 變長時明顯掉分；雖然都宣稱 32K+ context，只有約一半能在 32K 維持滿意表現。',
    note: '比 vanilla needle-in-haystack 更難，加入多針、多跳、aggregation。',
  },
  {
    source: 'NoLiMa',
    evidence: '13 個宣稱支援 128K+ 的模型，在 32K 時有 11 個低於短 context baseline 的 50%；GPT-4o 從 99.3% 降到 69.7%。',
    note: '移除字面匹配線索後，長 context 退化更明顯。',
  },
  {
    source: 'BABILong',
    evidence: 'NeurIPS 2024 benchmark 報告 popular LLMs 實際有效利用約 10-20% context，且 reasoning complexity 上升時表現急遽下降。',
    note: '測試分散在長文本中的 fact chaining、deduction、counting 等推理。',
  },
]

export default function Part8() {
  return (
    <PageLayout partIndex={7}>
      <SectionHeader partIndex={7} />

      <p className="text-slate-400 leading-relaxed mb-8">
        前兩章先建立 coding agent 的心智模型。這一章講<span className="text-white">為什麼某些操作貴、某些便宜</span>——
        為什麼 <code className="text-emerald-300 bg-emerald-500/10 px-1 rounded">/compact</code> 跟
        <code className="text-emerald-300 bg-emerald-500/10 px-1 rounded ml-1">/clear</code> 存在、什麼時候該用、什麼時候是反模式。
        讀完你會知道怎麼避免讓每一輪對話越來越貴。
      </p>

      {/* 1. Multi-turn */}
      <H3>1. 多輪對話技術上是怎麼進行的</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        很多人以為模型有長期記憶。就單次 API 呼叫來看，模型本身主要是依賴本輪送進去的 context。
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
        Claude Code 與 Codex 會幫你管理這個歷史，但底層原理就是如此——沒有魔法，只有打包重送。
      </p>

      <H3>2. Tool call 也是對話歷史的一部分</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Coding agent 看起來像「跑了一個工具」，但對模型來說它仍然是訊息流：
        assistant 輸出 tool call，工具回傳 tool result，client 再把 tool result 接回下一輪模型呼叫。
        所以讀檔、grep、跑測試、看 diff 都不是對話外的免費動作。
      </p>
      <div className="rounded-xl bg-black/40 border border-white/10 p-5 font-mono text-xs leading-relaxed mb-4">
        <div className="text-slate-500 mb-2">{'// 同一個「看檔案」動作，在 history 裡會長這樣'}</div>
        <div className="text-sky-300">{'messages: ['}</div>
        <div className="text-slate-400 ml-4">{'{ role: "user",      content: "找出登入失敗的原因" },'}</div>
        <div className="text-violet-300 ml-4">{'{ role: "assistant", tool_call: Read({ file: "src/auth.ts" }) },'}</div>
        <div className="text-cyan-300 ml-4">{'{ role: "tool",      content: "...auth.ts file content..." },'}</div>
        <div className="text-slate-400 ml-4">{'{ role: "assistant", content: "我看到 token expired path..." }'}</div>
        <div className="text-sky-300">{']'}</div>
      </div>
      <Callout type="warn">
        工具用越多，history 裡就越多 tool call / tool result。下一輪若沒有 /compact 或 /clear，
        這些內容會跟人類訊息一樣成為 input context；尤其是長 log、完整檔案、測試輸出，膨脹很快。
      </Callout>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 mb-10">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <div className="text-white font-semibold text-sm">多輪對話的單輪 input 成本</div>
            <p className="text-slate-300 text-sm mt-1">示意圖：不是固定報價，重點是每輪都帶著前面歷史一起算。</p>
          </div>
          <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
            每輪變貴
          </span>
        </div>
        <div className="space-y-3">
          {turnCostBars.map((row) => (
            <div key={row.turn} className="grid grid-cols-[56px_1fr_58px] sm:grid-cols-[64px_1fr_64px] items-center gap-3">
              <span className="text-slate-400 text-xs font-medium">{row.turn}</span>
              <div className="min-w-0">
                <div className="h-8 rounded-md bg-slate-900 border border-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-sky-500/70 via-amber-400/80 to-rose-400/80"
                    style={{ width: row.width }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-1 truncate">{row.note}</div>
              </div>
              <span className="text-right text-xs font-mono text-amber-300">{row.input}</span>
            </div>
          ))}
        </div>
        <p className="text-slate-300 text-sm leading-relaxed mt-4">
          如果每輪都讀新檔、貼 log、看 diff，input 不是只加「這一輪問題」，而是「前面全部歷史 + 這一輪問題」。
          所以長 session 不 compact，累積成本會越來越明顯。
        </p>
      </div>

      {/* 2. Context is not a database */}
      <H3>3. Context 不是資料庫</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        最重要的心法是：<span className="text-white font-medium">context 是工作記憶，不是可靠儲存</span>。
        它適合保留這一輪推理需要的目標、限制、少量事實與目前決策；不適合保存所有訪談、log、review 結果、
        規格全文或長期狀態。重要資訊要落到外部儲存，agent 需要時再讀。
      </p>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] mb-4">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-sm text-slate-300">
              <th className="px-4 py-3 text-left font-semibold">位置</th>
              <th className="px-4 py-3 text-left font-semibold">適合放</th>
              <th className="px-4 py-3 text-left font-semibold">不適合放</th>
              <th className="px-4 py-3 text-left font-semibold">操作原則</th>
            </tr>
          </thead>
          <tbody>
            {storageRows.map((row) => (
              <tr key={row.place} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 align-top text-orange-300 font-semibold">{row.place}</td>
                <td className="px-4 py-3 align-top text-slate-300 leading-relaxed">{row.bestFor}</td>
                <td className="px-4 py-3 align-top text-slate-300 leading-relaxed">{row.notFor}</td>
                <td className="px-4 py-3 align-top text-slate-400 leading-relaxed">{row.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout type="tip">
        外部儲存不是模型的自動記憶，也不保證內容正確；它的價值是可查、可引用、可 review、可 version。
        實務上把檔案、PR、issue、JIRA、Docs 當 source of truth，main thread 只保留必要摘要與下一步。
      </Callout>

      {/* 4. High-signal context */}
      <H3>4. 不要省錯 token：高訊號 context 要給足</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        省 token 的目標不是讓 prompt 變短，而是減少無效 token。若任務描述太省，agent 會用更多 tool calls 補洞：
        找檔案、讀錯範圍、問澄清問題、重跑測試。這些 output 與 tool result 也會留進歷史，
        下一輪繼續變成 input token。
      </p>
      <CodeBlock title="短不等於省；精準且足量才省">
{`# 省錯 token
> 幫我做訂單匯出，自己看 repo。

# 高訊號 context
goal: seller order CSV export
read_first:
  - specs/order-export/requirements.md
  - src/server/order/router.ts
  - src/jobs/export-orders.ts
constraints:
  - no migration in v1
  - order_count > 1000 => background_job + email
  - output must pass scripts/order-export validate
acceptance:
  - npm run lint
  - npm test -- order-export`}
      </CodeBlock>
      <Callout type="warn">
        給精準且大量的 context 不是浪費；浪費是模糊、重複、無關的上下文造成多輪探索。
        該給的目標、限制、範例、相關檔與驗收條件要一次給足。
      </Callout>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        也可以承認一件事：人常常就是懶得先整理資料，想叫 agent 自己去找。這沒問題，但不要讓
        「探索過程」跟「真正實作」混在同一個長 session。比較穩的做法是先讓 agent 找資料、整理成 artifact，
        你 review 後重置 session，下一輪只讀這份 artifact 和必要檔案。
      </p>
      <CodeBlock title="兩輪 workflow：先找資料，再重開實作">
{`# Session A: exploration only
goal: find the information needed for seller order CSV export
rules:
  - read broadly, but do not edit production code
  - write the result to docs/context/order-export.md
artifact_schema:
  - goal
  - facts_with_file_refs
  - relevant_files
  - constraints
  - open_questions
  - recommended_next_prompt
after_done:
  - human reviews the artifact
  - /clear

# Session B: execution
Read docs/context/order-export.md first.
Use only referenced files unless a gap appears.
Implement according to the acceptance criteria.`}
      </CodeBlock>
      <Callout type="tip">
        這份 artifact 不是模型記憶，而是人可 review 的 checkpoint。探索 session 可以髒一點、讀多一點；
        實作 session 要乾淨，只帶 artifact、目標、限制與驗收條件。
      </Callout>
      <Callout type="info">
        這一章先停在手動版：探索 session 產 artifact，review 後重開乾淨 session。
        後面 <span className="font-mono font-semibold">skills-workflows</span> 會把這套規則變成 Skill；
        <span className="font-mono font-semibold">delegation-subagents</span> 會再把探索工作外包給 subagent。
      </Callout>

      {/* 5. Token billing */}
      <H3>5. 計費模型：Input / Output / Thinking Token</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        以 Claude / Anthropic 的計費模型為例，常見會看到三種 token，價格不同。
        Codex / OpenAI 也會區分 input、cached input、output、reasoning 等成本，但實際名稱與費率以當下官方 pricing 為準：
      </p>
      <div className="rounded-xl border border-white/10 overflow-hidden mb-4">
        <div className="grid grid-cols-3 text-sm text-slate-300 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
          <span>類型</span><span>內容</span><span className="text-right">相對費率</span>
        </div>
        {[
          { type: 'Input Token',   color: 'text-sky-300',    dot: 'bg-sky-400',    rate: '1×',  rateColor: 'text-emerald-400', content: '你送出的所有內容：system prompt、完整對話歷史、工具定義、目前訊息、tool result' },
          { type: 'Output Token',  color: 'text-violet-300', dot: 'bg-violet-400', rate: '5×',  rateColor: 'text-amber-400',   content: '模型生成的回覆，包含工具呼叫的參數' },
          { type: 'Thinking Token',color: 'text-rose-300',   dot: 'bg-rose-400',   rate: '5×',  rateColor: 'text-amber-400',   content: '開啟 Extended Thinking 時，模型的內部推理過程（你看不到全部，但要付錢）' },
        ].map(({ type, color, dot, rate, rateColor, content }) => (
          <div key={type} className="flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0">
            <span className={`w-2 h-2 rounded-full ${dot} mt-1.5 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <span className={`font-mono text-sm font-semibold ${color}`}>{type}</span>
              <p className="text-slate-300 text-sm leading-relaxed mt-0.5">{content}</p>
            </div>
            <span className={`text-sm font-bold flex-shrink-0 ${rateColor}`}>{rate}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-black/40 border border-white/10 p-4 text-xs font-mono mb-10">
        <div className="text-slate-400 mb-2">{'// 一次典型「修 bug」任務的 token 分佈'}</div>
        <div className="flex gap-6 flex-wrap">
          <div><span className="text-sky-300">input:</span><span className="text-slate-300 ml-2">~8,000 tokens</span><span className="text-slate-400 ml-2">(歷史 + 相關程式碼)</span></div>
          <div><span className="text-violet-300">output:</span><span className="text-slate-300 ml-2">~500 tokens</span></div>
          <div><span className="text-rose-300">thinking:</span><span className="text-slate-300 ml-2">~2,000 tokens</span><span className="text-slate-400 ml-2">(若開啟)</span></div>
        </div>
      </div>

      <H3>6. Reasoning effort：調整推理深度與成本，不是準確率保證</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Reasoning / effort 現在不適合只講成「thinking budget 上限」。
        比較準確的講法是：它是 <span className="text-white font-medium">推理深度、成本與延遲的控制旋鈕</span>。
        OpenAI 這類 effort label 會影響模型回答前投入多少 reasoning；
        Claude extended thinking 的 <code className="text-emerald-300 bg-emerald-500/10 px-1 rounded">budget_tokens</code> 則更接近 token budget。
      </p>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        可以把它想成演進過程：早期多半是用 prompt 要模型「think step by step」，
        或用外部 budget 限制可見 / 內部 thinking token；現在的 reasoning model 已經把「何時需要多想」
        這件事訓練進模型行為裡。Effort 不是在 prompt 裡提醒它要努力一點，而是 API 層的推理策略設定。
      </p>
      <Callout type="warn">
        同樣叫 effort / thinking budget，不同 provider、不同 model、不同版本的語意不一樣：
        有的是 level，有的是 token budget，有的是 maximum，有的是 target。
        高 effort 通常比較適合複雜推理、重構、規劃與多約束問題，但不會修正錯的前提、缺的 context 或過大的 scope。
      </Callout>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] mb-4">
        <table className="w-full min-w-[780px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-sm text-slate-300">
              <th className="px-4 py-3 text-left font-semibold">Effort</th>
              <th className="px-4 py-3 text-left font-semibold">適合</th>
              <th className="px-4 py-3 text-left font-semibold">避免</th>
            </tr>
          </thead>
          <tbody>
            {effortRows.map((row) => (
              <tr key={row.effort} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 align-top font-mono text-rose-300">{row.effort}</td>
                <td className="px-4 py-3 align-top text-slate-300 leading-relaxed">{row.use}</td>
                <td className="px-4 py-3 align-top text-slate-300 leading-relaxed">{row.avoid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout type="tip">
        省錢的第一步通常不是降 effort，而是縮 scope、指定要讀的檔案、先產 artifact、避免無效 tool call。
        需要更深推理時再升 effort；需要更正確資料時，先補 context 或查 source of truth。
      </Callout>

      {/* 7. Prompt caching */}
      <H3>7. Prompt Caching：降低重複前綴成本</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        既然多輪對話每次都要重送歷史，Anthropic 提供了 <span className="text-white font-medium">prompt caching</span>：
        重複出現的前綴（system prompt、CLAUDE.md、已讀過的檔案）會被緩存，
        下一次請求命中 cache 時，重複前綴的計費會比較低。
      </p>
      <div className="rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-xs leading-relaxed mb-4">
        <div className="flex gap-6 flex-wrap">
          <div><span className="text-slate-400">cache write:</span><span className="text-amber-300 ml-2">1.25×</span></div>
          <div><span className="text-slate-400">cache read:</span><span className="text-emerald-300 ml-2">0.1×</span><span className="text-slate-400 ml-2">← 命中後較便宜</span></div>
          <div><span className="text-slate-400">TTL:</span><span className="text-slate-300 ml-2">5 min</span><span className="text-slate-400 ml-2">(每次命中會續期)</span></div>
        </div>
      </div>
      <Callout type="warn">
        Claude Code / Codex 會處理部分重複前綴的 caching——但你需要知道：
        <span className="font-semibold">同一 session 連續對話通常比較省</span>。
        中間離開超過 5 分鐘 cache 可能過期，下一輪重新從 cache write 開始算錢。
      </Callout>

      <H3>8. 用語言類型壓縮 prompt</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        省 token 不只靠少貼資料，也靠把條件寫得更像程式。模型對符號、pseudo-code、JSON、YAML、regex、
        SQL、TypeScript type 這類語言型態很熟；用它們描述條件與結構，常比口語更短、更精確。
      </p>
      <CodeBlock title="同一個條件，符號更短也更清楚">
{`# 較冗長
如果數量大於十，就把它標記成高風險；如果數量小於或等於十，就保持一般狀態。

# 較精確
if num > 10:
  risk = "high"
else:
  risk = "normal"

# 或直接寫 acceptance rule
num > 10 => risk = high
num <= 10 => risk = normal`}
      </CodeBlock>
      <Callout type="tip">
        自然語言適合講背景、目標、取捨；符號語言適合講條件、schema、欄位、排序、狀態機、驗收規則。
        不需要把整個 prompt 寫成程式碼，但條件式、表格欄位、輸出 schema 優先用符號表達。
      </Callout>

      {/* 9. Why context too long is bad */}
      <H3>9. Context Window：日常預設用 200K，不要把 1M 當預設</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Claude Code 與 Codex 可能遇到不同的 context window（依模型、方案與設定而定）。
        內部日常教學建議：<span className="text-white font-medium">預設用 200K；1M 只留給明確需要一次讀大型材料的情境</span>。
        原因不是 1M 沒用，而是它容易讓人不整理 context。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="text-emerald-300 font-semibold text-sm mb-2">200K：日常預設</div>
          <p className="text-slate-400 text-sm leading-relaxed">
            適合一般 feature、bug fix、PRD review、demo script 推演。它會逼你定期 /compact、/clear、切 task，
            反而比較容易維持可控的成本與品質。
          </p>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="text-rose-300 font-semibold text-sm mb-2">1M：不要當日常預設</div>
          <p className="text-slate-400 text-sm leading-relaxed">
            只在需要一次讀大量文件或大型 repo 片段時考慮。用 1M 但不 compact，會讓後面每一輪都帶著大量歷史繼續計費。
          </p>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="text-amber-300 font-semibold text-sm mb-2">問題一：每輪 input 成本會隨歷史變大</div>
          <p className="text-slate-400 text-sm leading-relaxed">
            每輪對話的 input token = 所有歷史訊息的總和。對話進行 10 輪、每輪輸出 1,000 token，
            到第 10 輪光是 input 就要帶入前 9 輪的輸出與工具結果。工具呼叫越多，歷史膨脹越快。
            1M 會延後你被迫 compact 的時間，但不會讓 token 消耗消失。
          </p>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="text-rose-300 font-semibold text-sm mb-2">問題二：Lost in the Middle，注意力缺失</div>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            Transformer 的 Self-Attention 讓每個 token 都要跟 context 裡的所有其他 token 計算相關性。
            Context 越長，注意力越分散——出現 <span className="text-white font-medium">「Lost in the Middle」</span> 現象：
            頭尾記得清楚，中間的重要資訊容易被忽略。
          </p>
          <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/30 mb-3">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-300">
                  <th className="px-3 py-2 text-left font-semibold">來源</th>
                  <th className="px-3 py-2 text-left font-semibold">數字</th>
                  <th className="px-3 py-2 text-left font-semibold">解讀</th>
                </tr>
              </thead>
              <tbody>
                {longContextEvidenceRows.map((row) => (
                  <tr key={row.source} className="border-b border-white/5 last:border-0">
                    <td className="px-3 py-2 align-top font-semibold text-rose-200">{row.source}</td>
                    <td className="px-3 py-2 align-top leading-relaxed text-slate-300">{row.evidence}</td>
                    <td className="px-3 py-2 align-top leading-relaxed text-slate-300">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            補充：GPT-5.5 / Opus 4.7 這列是長 context retrieval benchmark，不是原始 lost-middle 位置偏差實驗；
            兩者共同提醒：context window 大，不代表中間資訊會被穩定使用。
          </p>
          <div className="rounded-lg bg-black/40 border border-white/5 p-3 font-mono text-xs">
            <div className="text-slate-400 mb-1">{'// Attention 計算複雜度'}</div>
            <div><span className="text-rose-300">O(n²)</span><span className="text-slate-400 ml-2">← context 長度 n 的平方</span></div>
            <div className="text-slate-400 mt-1">{'// 1K tokens → 1M 次計算'}</div>
            <div className="text-slate-400">{'// 10K tokens → 100M 次計算'}</div>
            <div className="text-slate-400">{'// 100K tokens → 10B 次計算  ← 費用與延遲爆炸'}</div>
          </div>
        </div>
      </div>

      {/* 10. Practical guidance */}
      <H3>10. 實務建議</H3>
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="space-y-2 text-sm text-slate-300">
          {[
            '完成一個獨立任務後 → /clear，開新 session 做下一件事',
            '同一任務進行到一半但對話變長 → /compact 壓縮，保留摘要繼續',
            '把 tool call 當成對話歷史：讀檔、grep、跑測試的結果都會回到 context',
            'Reasoning effort 是推理深度、成本與延遲的控制旋鈕，不是準確率保證；缺 context 時先補資料，不要只升 effort',
            '給足高訊號 context：目標、限制、相關檔、範例、驗收條件；不要讓 agent 用多輪工具呼叫補缺口',
            '懶得整理資料時 → 先開探索 session 產 context artifact，review 後 /clear，下一輪只讀 artifact 實作',
            '日常 agent session → 選合理 context；不要因為有大 context 就把所有資料都塞進同一輪',
            '條件、schema、欄位與狀態機 → 用 pseudo-code / JSON / YAML / type，比長句更省 token、更少歧義',
            'Context 是工作記憶；檔案、PR、issue、JIRA、Docs 才是重要狀態的 source of truth',
            '監控成本與 context：Claude Code 用 /usage；Codex 用 /status 看 token / context 狀態',
            '把任務結果（git diff、測試報告、review 結論）存到外部位置，不要只留在對話裡',
            '大範圍探查先產 context artifact，不要和真正實作混在同一個長 session',
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
