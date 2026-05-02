import { PageLayout, SectionHeader, Callout, PromptResponse } from '../../components/cc/shared'

export default function Part3() {
  return (
    <PageLayout partIndex={2}>
      <SectionHeader partIndex={2} />

      <p className="text-slate-400 leading-relaxed mb-8">
        這條 track 是寫給 PM 的：教你怎麼用 Claude Code 寫 PRD。
        但在動手之前，先回答一個問題——
        <span className="text-white">為什麼一個「工程師工具」可以幫 PM？</span>
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
            <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      {/* The core insight */}
      <h3 className="text-white font-semibold mb-4 text-base">Claude Code 的特殊能力，剛好打中這 4 件事</h3>
      <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-pink-500/5 p-7 mb-10">
        <p className="text-slate-300 leading-relaxed mb-5">
          它跟一般 AI chatbot 最大的差別是——<span className="text-white font-medium">它能直接看你公司的 code、舊 PRD、設計文件</span>。
          不是空口想像，而是基於你產品的真實狀況回答。
        </p>
        <div className="space-y-3">
          {[
            { ability: '讀完整個 repo 不會累', match: '替你判斷「這個改動會動到哪、複雜度多高」' },
            { ability: '擅長結構化輸出（這是 LLM 強項）', match: '一秒產出 user stories、acceptance criteria、edge case 清單' },
            { ability: '會讀 CLAUDE.md 跟你的舊 PRD', match: '輸出自動對齊你公司的格式跟用詞' },
            { ability: '遵守規則、不會偷懶', match: '你叫它「找 5 個盲點」就真的給你 5 個' },
          ].map(({ ability, match }, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-400/30 text-rose-200 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              <div className="flex-1 min-w-0 text-sm">
                <div className="text-rose-200 font-medium">{ability}</div>
                <div className="text-slate-400">→ {match}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concrete demo */}
      <h3 className="text-white font-semibold mb-4 text-base">差別有多大？同樣一句話，看輸出差距</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">
        假設你想加一個功能：<span className="text-white">「讓使用者可以匯出自己的訂單為 CSV」</span>。
        我們會用這個例子貫穿後面 4 章。先看看「丟給 Claude Code」跟「自己手寫」的對比：
      </p>

      <PromptResponse
        promptLabel="你說（隨手一句）"
        responseLabel="Claude Code 回（結構化的 PRD 草稿）"
        prompt={`幫我寫一個 PRD：讓使用者可以匯出自己的訂單為 CSV。
我們是電商平台。`}
        response={`# 訂單匯出 CSV — PRD 草稿

## 背景
- 用戶研究顯示 28% 的賣家會手動複製訂單到 Excel 對帳，痛點明確
- 競品 (Shopify、Etsy) 已支援，缺此功能會在比較階段流失客戶

## 目標
- 讓賣家在 30 秒內取得近 90 天訂單的 CSV
- 降低客服「能不能下載訂單」類型工單 50%

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
- 主指標：每月匯出次數
- 次指標：客服「下載訂單」工單數量變化
- 觀察：匯出後 7 天內活躍度

(草稿產出，需 PM 補充技術評估與時程)`}
      />

      <p className="text-slate-400 text-sm leading-relaxed mb-10">
        差別不只在於它「寫得快」。重點是它<span className="text-white">會主動帶出你可能漏掉的維度</span>——
        像 UTF-8 BOM 這種 Excel 中文亂碼坑，你不一定第一次就想到。
        這就是後面 3 章要教你怎麼放大這個槓桿。
      </p>

      <Callout type="pm">
        重點不是「Claude 替你寫 PRD」，而是「你跟 Claude 對話的過程中，你的思考被結構化了」。
        最後 PRD 還是你的產出、你的判斷——但起點不是空白頁。
      </Callout>
    </PageLayout>
  )
}
