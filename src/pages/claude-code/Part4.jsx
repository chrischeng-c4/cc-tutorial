import { PageLayout, SectionHeader, Callout, CodeBlock, PromptResponse, Steps } from '../../components/cc/shared'

export default function Part4() {
  return (
    <PageLayout partIndex={3}>
      <SectionHeader partIndex={3} />

      <p className="text-slate-400 leading-relaxed mb-8">
        這一章你會跟著做完<span className="text-white">第一份 PRD 草稿</span>。
        延續上一章的例子：「讓使用者匯出訂單為 CSV」。
        我們會走 4 步：安裝 → 進入專案 → 餵 context → 產草稿。
      </p>

      {/* Quick install */}
      <h3 className="text-white font-semibold mb-4 text-base">第 1 步：安裝（5 分鐘）</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        PM 也是要安裝在自己電腦上。一次安裝、之後每天用。
      </p>
      <CodeBlock title="Terminal">
{`# 先確認有 Node.js（Mac 用 brew install node，Windows 用 nodejs.org）
node --version    # 要 18 以上

# 裝 Claude Code
npm install -g @anthropic-ai/claude-code

# 第一次啟動（會引導你登入）
claude`}
      </CodeBlock>

      <Callout type="info">
        登入用公司給你的 Anthropic API Key 或 claude.ai Max 訂閱帳號。
        如果公司還沒給，跟你的 IT / Engineering Lead 申請就好——這跟 Dev 的權限是同一套。
      </Callout>

      {/* Step 2: enter project */}
      <h3 className="text-white font-semibold mt-10 mb-4 text-base">第 2 步：進到專案資料夾再啟動</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        關鍵——<span className="text-white">cd 進你公司的專案 repo 再啟動 claude</span>，它才能讀你產品的 code。
        如果你電腦沒有 repo，請 Dev 幫你 clone 一份就好（read-only 也可以）。
      </p>
      <CodeBlock title="Terminal">
{`cd ~/projects/our-ecommerce-app
claude

# 啟動後，先讓它認識專案
> 簡介一下這個 repo 在做什麼，主要的目錄結構是什麼？`}
      </CodeBlock>

      <PromptResponse
        promptLabel="你問"
        responseLabel="Claude 回"
        prompt={`簡介一下這個 repo 在做什麼，主要的目錄結構是什麼？`}
        response={`這是一個 Next.js 14 的多賣家電商平台。

主要目錄：
• src/app/(seller)/  — 賣家後台（訂單、商品、結算）
• src/app/(buyer)/   — 買家前台（瀏覽、購物車、結帳）
• src/app/api/       — 後端 API routes
• prisma/schema.prisma — 資料庫 schema（PostgreSQL）

技術棧：Next.js 14 + tRPC + Prisma + Tailwind
登入：NextAuth (JWT)
付款：Stripe Connect

訂單相關的核心檔案在 src/server/order/ 目錄下，
主要 model 是 Order、OrderItem、Shipment。`}
      />

      <p className="text-slate-400 text-sm leading-relaxed mb-10">
        這一步很重要：<span className="text-white">它已經自己讀完 repo 了</span>。
        後面所有 PRD 對話都會基於這個真實 context，不是憑空亂猜。
      </p>

      {/* Step 3: feed PRD context */}
      <h3 className="text-white font-semibold mb-4 text-base">第 3 步：餵 PRD 需要的 context</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        寫 PRD 不只靠 code，還需要<span className="text-white">市場 / 用戶 / 競品 / 過往決策</span>等資訊。
        這些 Claude 不會自動知道，要你餵給它。常見的餵法有 3 種：
      </p>

      <Steps items={[
        {
          title: '直接貼進對話',
          desc: '把用戶訪談摘要、競品截圖描述、Slack 上的需求討論直接貼。最快、適合短內容。',
        },
        {
          title: '指向專案內的檔案',
          desc: '如果公司在 docs/ 目錄下放過去 PRD 或 user research，叫 Claude「先讀 docs/research/2025-q3-seller-survey.md 再回答」。',
        },
        {
          title: '貼一個 URL',
          desc: '競品的部落格、產品文件、HelpScout 工單範例——直接貼網址，它會用 WebFetch 抓內容。',
        },
      ]} />

      <PromptResponse
        promptLabel="你輸入（餵 context）"
        responseLabel="Claude 回（吸收後重述）"
        prompt={`先讀 docs/research/2025-q4-seller-survey.md，
然後我貼一個競品連結：
https://www.shopify.com/admin/orders/export

我要做的功能：讓賣家可以匯出自己的訂單為 CSV。
你先別寫 PRD，先告訴我：
1. 我們的賣家對這功能的痛點是什麼？
2. Shopify 的版本有哪幾個關鍵設計可以參考？
3. 我們目前 src/server/order/ 的程式碼，做這個功能要動到哪些地方？`}
        response={`(已讀取 user research + 抓取 Shopify 文件 + 掃描 src/server/order/)

1. 我們賣家的痛點（user research 摘要）：
  - 73% 的受訪者每月手動下載訂單做對帳
  - 主要抱怨「要一筆一筆複製」、「日期格式跟會計系統不合」
  - 12% 提到「想要排程匯出每天自動寄到信箱」（進階需求）

2. Shopify 版本的關鍵設計：
  - 支援多種時間範圍預設（7 天 / 30 天 / 自訂）
  - 可選欄位（讓不同會計系統用戶各自取需）
  - 大量訂單用 email 寄連結，不要在瀏覽器等

3. 我們的 codebase 影響範圍：
  - 後端：要在 src/server/order/router.ts 加 export procedure
  - 資料庫：可重用既有 Order model，不需 migration
  - 前端：src/app/(seller)/orders/page.tsx 加按鈕
  - 風險：訂單超過 5000 筆時要走背景 job (src/jobs/ 已有現成範本)

要我接著產 PRD 草稿嗎？還是你想先補充什麼？`}
      />

      {/* Step 4: produce draft */}
      <h3 className="text-white font-semibold mt-10 mb-4 text-base">第 4 步：請它產 PRD 草稿</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Context 餵夠了，現在開口要 PRD。<span className="text-white">越具體越好</span>——
        指定章節、指定深度、指定語氣。
      </p>

      <PromptResponse
        promptLabel="你說"
        responseLabel="Claude 回"
        prompt={`好，產 PRD 草稿。
要包含：背景、目標、用戶 story、acceptance criteria、edge cases、metrics、上線計畫。
語氣寫給工程師看的，不要太行銷腔。
邊角案例至少寫 5 個。`}
        response={`# 訂單匯出 CSV
作者：[你的名字]  狀態：草稿  最後更新：今天

## 1. 背景
73% 賣家每月手動下載訂單對帳，user research 顯示這是流失點。
Shopify、Etsy 已支援，我們缺此功能會在賣家比較階段被淘汰。

## 2. 目標
- 主要：讓賣家在 30 秒內取得近 90 天訂單的 CSV
- 次要：降低「能不能下載訂單」客服工單 50%
- 不在範圍：訂單匯入、跨平台同步（v2 再做）

## 3. 用戶 Story
- 作為賣家，我想下載訂單列表，做月結對帳
- 作為財務，我想拿固定欄位的 CSV 匯入會計系統
- 作為小型賣家，我想用 email 收結果（避免瀏覽器卡住）

## 4. Acceptance Criteria
- [ ] 「我的訂單」頁右上有「匯出 CSV」按鈕
- [ ] 時間範圍：7 天 / 30 天 / 90 天 / 自訂
- [ ] 欄位：訂單號、日期、買家、金額、狀態、商品名稱、運費
- [ ] <1000 筆：直接下載；>=1000 筆：背景處理 + email
- [ ] CSV 編碼 UTF-8 with BOM（解 Excel 中文亂碼）

## 5. Edge Cases
1. 用戶無訂單 → 顯示「目前沒有可匯出的訂單」
2. 時間範圍包含未結帳訂單 → 預設排除，但提供 toggle
3. 用戶在處理中再次點擊 → 顯示處理中狀態，禁止重複觸發
4. 訂單金額有退款 → CSV 加「退款金額」欄位
5. 賣家被停權 → 仍可匯出歷史訂單（合規要求）

## 6. Metrics
- 主指標：月匯出次數 / 月活賣家數
- 次指標：相關客服工單數量
- 異常監控：匯出失敗率（目標 <1%）

## 7. 上線計畫
- Week 1: 開發 + 內測（PM/Eng/QA）
- Week 2: 灰度 5% 賣家
- Week 3: 全量 + email Top 100 賣家通知

## 8. 風險與限制
- 大型賣家（10K+ 訂單）背景 job 可能延遲，需監控
- 個資合規：訂單含買家姓名/地址，需加水印「請勿外流」`}
        filename="prd-order-export.md"
      />

      <Callout type="tip">
        產出後 Claude 預設只是顯示在對話裡。要存檔，叫它「把這份 PRD 存到 docs/prd/order-export.md」就會幫你寫進專案。
      </Callout>

      <Callout type="info">
        到這裡你已經有一份完整草稿。但這只是<span className="font-semibold">第一版</span>——
        下一章 Part 5 教你怎麼用 CLAUDE.md 鎖公司格式、怎麼迭代修改補欄位。
      </Callout>
    </PageLayout>
  )
}
