import { PageLayout, SectionHeader, Callout, PromptResponse } from '../../components/cc/shared'

export default function Part6() {
  return (
    <PageLayout partIndex={5}>
      <SectionHeader partIndex={5} />

      <p className="text-slate-400 leading-relaxed mb-8">
        前面幾章用 PRD 當例子，走過一次從資料、模板到迭代的流程。這章談兩件事：
        <span className="text-white">它做不到什麼</span>、以及
        <span className="text-white"> 文件與分析工作大概要花多少 token</span>。
        看完後你比較不會踩坑。
      </p>

      {/* What it can't do */}
      <h3 className="text-white font-semibold mb-4 text-base">它做不到的 6 件事</h3>
      <div className="space-y-3 mb-10">
        {[
          {
            title: '它不會替你做產品決策',
            body: '「應該做訂閱制還是買斷制？」這種問題它會給你「比較表」，但答案要你做。它不知道你公司的策略、市場時機、團隊成熟度。',
            mistake: '把 Claude 的選擇當成決策結果，被老闆問為什麼選這方向時答不出來。',
          },
          {
            title: '它不會跨產品「記得」上一份 PRD',
            body: '這份對話結束（或 /clear）後，它就忘了。要它「跟我們上次討論的方向一致」，你得自己貼上一份 PRD 給它讀。',
            mistake: '以為它會自動參考公司過去 3 年所有 PRD，結果寫出來的方向跟舊決策矛盾。',
          },
          {
            title: '它不能只靠 codebase 還原產品原因',
            body: 'Codebase 能描述目前怎麼運作：哪些 API、資料表、流程、限制。但它通常不知道為什麼當初做這個取捨、哪些需求被砍掉、哪個 stakeholder 決定了 scope。',
            mistake: '讓它從 code 直接回推 PRD，結果把現有實作限制誤寫成產品決策。',
          },
          {
            title: '它對「人」的理解很淺',
            body: '寫得出 user persona 模板，但不知道你的賣家「有 60% 是 50 歲以上、不會用英文、習慣紙本」。這要你餵 user research 給它。',
            mistake: '直接讓它生 persona，結果寫出 AI 想像的「30 歲都會 PM」這種空洞虛構人物。',
          },
          {
            title: '它的「最新」資料有時間差',
            body: '它的訓練資料有 cutoff，講外部世界（競品、產業趨勢、新法規）可能過時。重要時請用 WebFetch 抓即時資料。',
            mistake: '直接信任它對「Shopify 現在的訂閱方案」的描述，結果寫進 PRD 的價格資訊已經過期。',
          },
          {
            title: '它不懂你公司的政治',
            body: '哪個 stakeholder 要先拜碼頭、哪個團隊有 capacity、哪個老闆有偏好——這些只能你判斷。',
            mistake: '把 Claude 給的「上線計畫」直接送 review，結果忘了某個關鍵 owner 沒被知會。',
          },
        ].map(({ title, body, mistake }, i) => (
          <div key={i} className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
            <div className="flex items-start gap-3 mb-2">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-rose-400/30 text-rose-200 text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <div className="text-white font-semibold text-sm pt-1">{title}</div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-2 ml-10">{body}</p>
            <div className="ml-10 flex items-start gap-2">
              <span className="text-rose-400 text-xs font-semibold flex-shrink-0 mt-0.5">常見坑</span>
              <span className="text-slate-400 text-sm leading-relaxed">{mistake}</span>
            </div>
          </div>
        ))}
      </div>

      <Callout type="warn">
        最危險的不是它「答錯」，而是它「答得很有條理但偏離真相」。
        對外部資料（競品、法規、市場數字）與 codebase 推論一律保持懷疑——能查證就查證，不能查證就標成 HITL question。
      </Callout>

      <h3 className="text-white font-semibold mt-10 mb-4 text-base">HITL：Human in the Loop</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        HITL 就是<span className="text-white font-medium">把人放在關鍵判斷點</span>。
        不是每一步都要人工批准，而是遇到產品取捨、外部寫入、權限風險、資料不確定、codebase 推論時，
        agent 應該停下來把問題交給對的人確認。
      </p>
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-10">
        <div className="text-amber-300 font-semibold text-sm mb-2">為什麼重要</div>
        <p className="text-slate-300 text-sm leading-relaxed">
          Agent 最容易出事的地方不是「不會寫」，而是它替你補了缺口：假設 PM 想要 A、假設 Legal 沒問題、
          假設某段 code 代表產品決策。HITL 的目的就是把這些假設變成明確問題，讓人用很小的成本阻止後面的大返工。
        </p>
      </div>

      {/* Cost */}
      <h3 className="text-white font-semibold mt-12 mb-4 text-base">一份文件任務要花多少錢</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">
        Claude Code 與 Codex 都是按 token / 模型使用量計費。PRD、訪談整理、技術可行性分析都一樣，token 用量取決於——
        repo 多大（它要讀多少 code）、對話多長（你迭代幾輪）、有沒有貼 user research。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { tier: '輕量 PRD', cost: 'NT$ 5–15', detail: '小功能、一輪對話、不讀 repo', emoji: '🌱', color: 'emerald' },
          { tier: '標準 PRD', cost: 'NT$ 30–80', detail: '完整功能、3–5 輪迭代、讀部分 repo', emoji: '🌿', color: 'amber' },
          { tier: '深度 PRD', cost: 'NT$ 150–400', detail: '跨系統重構、多份參考、多角度 review', emoji: '🌳', color: 'rose' },
        ].map(({ tier, cost, detail, emoji, color }) => (
          <div key={tier} className={`rounded-xl border p-5 ${color === 'emerald' ? 'border-emerald-500/20 bg-emerald-500/5' : color === 'amber' ? 'border-amber-500/20 bg-amber-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
            <div className="text-3xl mb-2">{emoji}</div>
            <div className="text-white font-semibold mb-1">{tier}</div>
            <div className={`font-bold text-lg mb-2 ${color === 'emerald' ? 'text-emerald-400' : color === 'amber' ? 'text-amber-400' : 'text-rose-400'}`}>{cost}</div>
            <div className="text-slate-400 text-xs leading-relaxed">{detail}</div>
          </div>
        ))}
      </div>

      <Callout type="info">
        這是相對級距，實際以工具內建狀態為準：
        Claude Code 可用 <code className="text-emerald-300 bg-emerald-500/10 px-1 rounded">/usage</code>，
        Codex 可用 <code className="text-emerald-300 bg-emerald-500/10 px-1 rounded">/status</code>
        看目前模型、context 與 token 狀態。
      </Callout>

      <p className="text-slate-400 text-sm leading-relaxed mt-6 mb-10">
        Coding agent 不取代人做判斷。比較適合的定位是：協助整理資料、產生骨架、列問題、做多角度 review；
        最後的判斷、取捨與 scope 仍要由人確認。
      </p>

      {/* Cost-saving tips */}
      <h3 className="text-white font-semibold mb-4 text-base">省 token 不是少給資訊</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        不要把「省 token」理解成 prompt 越短越好。若資訊不足，agent 會用更多輪對話、讀更多檔案、
        跑更多工具來補缺口；最後 input history、tool result、修正來回都會變成 token。
        真正要省的是<span className="text-white font-medium">低訊號、重複、無關的 token</span>，不是精準必要的 context。
      </p>
      <div className="space-y-2 mb-10">
        {[
          { tip: '給足高訊號 context', why: '直接給目標、限制、範例、驗收條件、相關檔案；比讓 agent 多輪搜尋便宜。' },
          { tip: '一份 PRD 一個 session', why: '不同主題 /clear 重開。混在一起 token 會線性累積。' },
          { tip: '長 session 中途 /compact', why: '把前面對話壓縮成摘要，降低後續 input token。' },
          { tip: '不要叫它「讀整個 repo」', why: '指定路徑：「讀 src/server/order/」就好，減少不必要的 token。' },
          { tip: '貼大段資料用「先存檔再讀」', why: '不要直接貼 5000 字 user research 進對話；存成檔案可 review、可重用，也方便 agent 按需讀片段。' },
        ].map(({ tip, why }, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
            <span className="text-purple-300 text-sm font-mono flex-shrink-0">0{i + 1}</span>
            <div className="flex-1 min-w-0 text-sm">
              <div className="text-white font-medium">{tip}</div>
              <div className="text-slate-500 text-xs mt-0.5">{why}</div>
            </div>
          </div>
        ))}
      </div>

      <PromptResponse
        promptLabel="實際對話範例"
        responseLabel="Claude 回（含成本提示）"
        prompt={`/usage`}
        response={`對話成本（截至此刻）：

Tokens used:
  Input  (cache miss):  3,200 tokens
  Input  (cache hit):  18,500 tokens   ← 便宜 90%
  Output:               4,100 tokens

Estimated cost: $0.21 USD（約 NT$ 6.7）

提醒：再對話 5 輪左右會接近 NT$ 30，
若任務換主題建議 /clear 重開新 session。`}
      />

      <Callout type="pm">
        到這裡你已經看過一個文件型任務怎麼拆：指定 repo 範圍、產 PRD 骨架、
        用 CLAUDE.md / AGENTS.md 提供格式規則、迭代修改、估 token 成本。下一章會把完整 demo workflow 收斂起來。
      </Callout>
    </PageLayout>
  )
}
