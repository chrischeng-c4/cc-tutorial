import { PageLayout, SectionHeader, Callout, PromptResponse } from '../../components/cc/shared'

export default function Part6() {
  return (
    <PageLayout partIndex={5}>
      <SectionHeader partIndex={5} />

      <p className="text-slate-400 leading-relaxed mb-8">
        前 3 章你學會用 Claude Code 寫 PRD 的完整流程。這章談兩件殘酷的事：
        <span className="text-white">它做不到什麼</span>、以及
        <span className="text-white"> 寫一份 PRD 大概要花多少錢</span>。
        看完後你比較不會踩坑。
      </p>

      {/* What it can't do */}
      <h3 className="text-white font-semibold mb-4 text-base">它做不到的 5 件事（PM 最常踩雷）</h3>
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
        對外部資料（競品、法規、市場數字）一律保持懷疑——能查證就查證。
      </Callout>

      {/* Cost */}
      <h3 className="text-white font-semibold mt-12 mb-4 text-base">一份 PRD 要花多少錢</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">
        Claude Code 是按 token 計費。寫 PRD 的 token 用量取決於——
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
        這是相對級距，<span className="font-semibold">實際以 <code className="text-emerald-300 bg-emerald-500/10 px-1 rounded">/cost</code> 為準</span>——
        在對話中隨時輸入 /cost 看當下花了多少。
      </Callout>

      <p className="text-slate-400 text-sm leading-relaxed mt-6 mb-10">
        對比：請一個資深 PM 顧問寫一份標準 PRD，市場行情至少 NT$ 5,000 起跳。
        Claude Code 不取代 PM，但能讓<span className="text-white">你一個人產出多份 PRD 的速度</span>提升幾倍。
      </p>

      {/* Cost-saving tips */}
      <h3 className="text-white font-semibold mb-4 text-base">省 token 的 4 個小撇步</h3>
      <div className="space-y-2 mb-10">
        {[
          { tip: '一份 PRD 一個 session', why: '不同主題 /clear 重開。混在一起 token 會線性累積。' },
          { tip: '長 session 中途 /compact', why: '把前面對話壓縮成摘要，input token 馬上瘦身。' },
          { tip: '不要叫它「讀整個 repo」', why: '指定路徑：「讀 src/server/order/」就好，省幾倍 token。' },
          { tip: '貼大段資料用「先存檔再讀」', why: '不要直接貼 5000 字 user research 進對話，存成檔案叫它讀更便宜（cache 命中）。' },
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
        prompt={`/cost`}
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
        PM track 到這裡結束。你已經能：
        裝 Claude Code、讓它讀公司 repo、產 PRD 草稿、用 CLAUDE.md 鎖格式、迭代修改、估成本。
        想看 Dev 怎麼用，從 Part 7 繼續。想直接看實戰範例，跳到 Part 11。
      </Callout>
    </PageLayout>
  )
}
