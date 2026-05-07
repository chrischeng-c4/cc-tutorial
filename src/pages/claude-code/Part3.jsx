import { PageLayout, SectionHeader, Callout, PromptResponse } from '../../components/cc/shared'

export default function Part3() {
  return (
    <PageLayout partIndex={2}>
      <SectionHeader partIndex={2} />

      <p className="text-slate-300 leading-relaxed mb-8">
        這段用 PRD 當例子，示範 coding agent 如何協助整理文件、列問題、對齊模板。
        重點不是角色分流，而是先看一個非純 coding 的工作怎麼被拆成可 review 的步驟。
      </p>

      {/* Pain points first */}
      <h3 className="text-white font-semibold mb-4 text-base">寫 PRD 最累的 4 件事</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
        {[
          {
            icon: '🔍',
            title: '判斷可行性',
            body: '「這個改動工程要多久？會動到哪些系統？」 你得去問 dev、看舊 spec、猜技術細節。',
          },
          {
            icon: '🧱',
            title: '結構化寫作',
            body: 'User stories、acceptance criteria、edge case、metrics——格式對、又不漏項，每次都從零想很煩。',
          },
          {
            icon: '🎨',
            title: '對齊公司模板',
            body: '不同 PM 寫出來的 PRD 風格不一樣，工程師讀起來很痛。你想統一，但每次手動對模板又花時間。',
          },
          {
            icon: '🕵️',
            title: '挑盲點',
            body: '寫完總有種「好像漏了什麼」的感覺，但不知道漏哪。要找 reviewer 又佔別人時間。',
          },
        ].map(({ icon, title, body }) => (
          <div key={title} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{icon}</span>
              <span className="text-white font-semibold text-sm">{title}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* The core insight */}
      <h3 className="text-white font-semibold mb-4 text-base">Claude Code / Codex 能幫上忙的地方</h3>
      <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-pink-500/5 p-7 mb-10">
        <p className="text-slate-300 leading-relaxed mb-5">
          它跟一般 AI chatbot 最大的差別是——<span className="text-white font-medium">在有權限與指定範圍時，它可以讀 code、舊 PRD、設計文件</span>。
          但 codebase 只能說明「現在怎麼運作」，不能保證還原「當初為什麼這樣設計」。
        </p>
        <div className="space-y-3">
          {[
            { ability: '整理 repo 與文件', match: '列出 implementation facts：現有流程、資料欄位、API、相依模組' },
            { ability: '結構化輸出', match: '整理 PRD 骨架、open questions、risk list、review checklist' },
            { ability: '讀規則檔跟舊 PRD', match: '輸出格式可對齊公司模板，但內容仍需人確認' },
            { ability: '反覆追問與修正', match: '把不確定處標成 HITL checkpoint，而不是假裝知道答案' },
          ].map(({ ability, match }, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-400/30 text-rose-200 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <div className="flex-1 min-w-0 text-sm">
                <div className="text-rose-200 font-medium">{ability}</div>
                <div className="text-slate-300">→ {match}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Callout type="warn">
        不要把 codebase 當成產品決策來源。Code 可以證明系統目前如何運作；為什麼做這個流程、
        哪些取捨曾經被討論、哪些 scope 是產品策略，必須由 PM、Tech Lead、Designer 或 stakeholder 補脈絡。
      </Callout>

      {/* Concrete demo */}
      <h3 className="text-white font-semibold mb-4 text-base">差別有多大？同樣一句話，看輸出差距</h3>
      <p className="text-slate-300 text-sm leading-relaxed mb-5">
        假設你想加一個功能：<span className="text-white">「讓使用者可以匯出自己的訂單為 CSV」</span>。
        我們會用這個例子貫穿後面 4 章。先看看「丟給 coding agent」跟「自己手寫」的對比：
      </p>

      <PromptResponse
        promptLabel="你說（隨手一句）"
        responseLabel="Agent 回（PRD 骨架 + 待確認）"
        prompt={`幫我寫一個 PRD：讓使用者可以匯出自己的訂單為 CSV。
我們是電商平台。`}
        response={`# 訂單匯出 CSV — PRD 草稿

## 背景（待 PM 確認）
- 假設：賣家需要訂單資料做對帳
- 待補：實際 user research 數字、客服工單量、競品參考

## 目標
- 待 PM 決定：功能目標是降低客服量、提高留存，還是滿足大型賣家需求？
- 待 PM 決定：第一版支援 30 天、90 天，或自訂區間？

## 用戶 Story
- 作為賣家，我想下載訂單列表，這樣我可以做月結對帳
- 作為財務，我想拿到固定欄位的 CSV，這樣我可以匯入會計系統

## Acceptance Criteria
- [ ] 用戶在「我的訂單」頁有「匯出 CSV」按鈕
- [ ] 預設下載最近 90 天，可調整時間範圍
- [ ] 欄位：訂單號、日期、金額、狀態、商品名稱
- [ ] 大量資料（>1000 筆）需顯示處理中狀態

## Edge Cases
- 用戶沒有任何訂單 → 顯示空 CSV + 提示
- 時間範圍跨年度 → 編碼用 UTF-8 with BOM 避免 Excel 亂碼
- 同時多次點擊 → debounce 防重複請求

## Metrics
- 主指標：待 PM 選擇
- 建議候選：每月匯出次數、相關客服工單量、大型賣家留存

## HITL Checkpoints
- PM：確認為什麼要做、目標指標、第一版 scope
- Dev：確認現有訂單模組與資料量限制
- Legal / Security：確認 CSV 是否含個資欄位

(這是骨架，不是可直接送審的 PRD)`}
        renderResponseMarkdown
      />

      <p className="text-slate-300 text-sm leading-relaxed mb-10">
        差別不只在於它寫得快。比較有用的是：它可以把「已知事實、合理假設、待確認問題」分開，
        讓 PM 不用從空白頁開始，但也不會把 codebase 裡不存在的產品原因硬推成結論。
      </p>

      <Callout type="pm">
        重點不是「Claude 代替你完成 PRD」，而是「你跟 Claude 對話的過程中，你的思考被結構化了」。
        最後 PRD 還是你的產出、你的判斷——但起點不是空白頁。
      </Callout>
    </PageLayout>
  )
}
