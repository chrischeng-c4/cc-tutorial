import { PageLayout, SectionHeader, Callout, CodeBlock, PromptResponse, Diff } from '../../components/cc/shared'

export default function Part5() {
  return (
    <PageLayout partIndex={4}>
      <SectionHeader partIndex={4} />

      <p className="text-slate-400 leading-relaxed mb-8">
        上一章你拿到第一份草稿。但<span className="text-white">PRD 的價值在迭代</span>——
        這章教你三件事：用規則檔讓 agent 盡量依照公司格式寫、用工具保證嚴格格式、以及怎麼透過對話修到可 review。
      </p>

      {/* CLAUDE.md for PM */}
      <h3 className="text-white font-semibold mb-4 text-base">CLAUDE.md / AGENTS.md：你公司的「PRD 模板說明書」</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Claude Code 用 <code className="text-fuchsia-300 bg-fuchsia-500/10 px-1.5 py-0.5 rounded text-xs">CLAUDE.md</code>，
        Codex 用 <code className="text-fuchsia-300 bg-fuchsia-500/10 px-1.5 py-0.5 rounded text-xs">AGENTS.md</code>。
        把它當成<span className="text-white">「給 agent 的工作說明書」</span>——
        寫一次，整個團隊用同一套規則。
      </p>

      <CodeBlock title="CLAUDE.md / AGENTS.md（PM 版本範例）">
{`# 我們公司的 PRD 規範

## 寫作風格
- 一律用繁體中文
- 對工程師為主受眾，避免行銷腔
- Bullet points 為主，段落為輔
- 每個章節結尾留「未決議題」清單

## PRD 必備章節（順序固定）
1. 背景與問題
2. 目標（主要 / 次要 / 不在範圍）
3. 用戶 Story（至少 3 個角色視角）
4. Acceptance Criteria（用 checkbox）
5. Edge Cases（至少 5 個）
6. Metrics（主 / 次 / 異常監控）
7. 上線計畫（按 sprint 拆）
8. 風險與限制
9. 未決議題

## 格式約束
- 檔案名 prd-{feature-slug}.md
- 開頭固定 metadata：作者、狀態、最後更新
- 用詞：是「賣家 / 買家」，不是「商家 / 顧客」
- 金額一律用 NTD，需註明含稅或未稅

## 不做的事
- 不寫具體實作細節（那是 tech spec 的事）
- 不替工程估時間
- 不在 PRD 裡列具體 SQL 或 API schema`}
      </CodeBlock>

      <Callout type="tip">
        這個檔案 commit 到 repo，整個 PM team 共用。每次發現格式或用詞問題，再回頭補規則。
      </Callout>

      <p className="text-slate-400 text-sm leading-relaxed mt-6 mb-10">
        放好之後，下次叫 Claude Code 或 Codex 寫 PRD 時——<span className="text-white">可以少重複一些格式要求</span>。
        它通常會參考規則檔，但重要章節、語氣與待確認欄位仍要人工 review。
      </p>

      <Callout type="warn">
        規則檔只能提高遵循機率，不能保證格式正確。若輸出必須被下游系統吃進去，例如 JSON schema、CSV 欄位順序、
        JIRA issue payload、Google Sheets 欄位，請做 script / CLI / MCP 讓 agent 呼叫，並用 validator 擋掉不合格輸出。
      </Callout>

      <CodeBlock title="固定格式不要只靠 prompt">
{`# 軟約束：可以放在 CLAUDE.md / AGENTS.md
- 週報請依 docs/templates/weekly.md 格式撰寫
- JSON 請符合 docs/schemas/jira-task.schema.json

# 硬約束：做成 agent 可呼叫的工具
scripts/weekly-report render --input tmp/issues.json --output tmp/weekly.md
scripts/weekly-report validate tmp/weekly.md

# Agent 的任務描述
> 不要手寫週報格式。
> 先用 scripts/weekly-report render 產出，再跑 validate。
> validate 失敗就依錯誤修資料或回報缺口。`}
      </CodeBlock>

      {/* Iteration 1: filling missing fields */}
      <h3 className="text-white font-semibold mb-4 text-base">迭代手法 1：補欄位</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">
        看完草稿你發現某個維度寫得淺。直接告訴它，讓它擴寫：
      </p>

      <PromptResponse
        promptLabel="你說"
        responseLabel="Claude 回（只擴寫指定段落）"
        prompt={`Edge Cases 那節太簡單了。
我要你針對「大量訂單」的情境再列 5 個盲點：
資料量、時間、權限、合規、技術限制 各想一條。`}
        response={`Edge Cases — 大量訂單情境補強：

6. [資料量] 賣家匯出 50K 筆訂單
   → 不能在瀏覽器等，必須走背景 job + email 通知
   → CSV 檔案 >100MB 時改用 zip 壓縮

7. [時間] 跨年度匯出（>365 天）
   → 預設拒絕，提示「請分次匯出」
   → 提供 API 給技術型賣家自己批次抓

8. [權限] 子帳號（員工）匯出主帳號訂單
   → 需要主帳號授權「匯出」權限
   → log 記錄誰匯出了什麼，主帳號可查

9. [合規] 用戶要求被遺忘（GDPR）
   → 已匯出的 CSV 我們無法追回
   → PRD 要明寫：用戶下載即離開我們系統，後續責任歸賣家

10. [技術限制] 同時段 100+ 賣家請求匯出
    → 需 rate limit + queue
    → 失敗的 job 要可重試，並通知用戶`}
        renderResponseMarkdown
      />

      {/* Iteration 2: tone & wording */}
      <h3 className="text-white font-semibold mt-12 mb-4 text-base">迭代手法 2：調語氣 / 改用詞</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">
        寫完發現語氣不對。直接 diff 給它看，它會學起來：
      </p>

      <Diff
        beforeLabel="Claude 第一版"
        afterLabel="你想要的樣子"
        before={`本功能讓我們的尊貴用戶能夠輕鬆地將他們的訂單資料以業界標準的 CSV 格式匯出至本地端，
極大地提升了使用體驗，是我們對賣家成功的承諾。`}
        after={`賣家可下載 90 天內訂單為 CSV。
痛點：73% 受訪賣家手動複製訂單做對帳；客服每月接 200+ 「能不能下載」工單。`}
      />

      <PromptResponse
        promptLabel="你說"
        responseLabel="Claude 回"
        prompt={`你寫的「背景」太行銷腔。
我要的風格：直球、用數字、不要形容詞。
看上面那個對比，重寫整份 PRD 的所有段落。`}
        response={`了解，我把整份重寫一次，移除所有形容詞與行銷詞彙，
每個論述都加數字佐證或標明「待補」。

(輸出整份 PRD 修訂版 — 此處省略以節省篇幅...)

風格摘要：
- 「尊貴用戶」→ 「賣家」
- 「極大提升」→ 具體百分比 / 待補
- 「業界標準」→ 直接寫 CSV (UTF-8 with BOM)
- 移除所有「我們致力於 / 承諾 / 願景」等句型

要不要我也順便更新 CLAUDE.md，把「禁止形容詞」加進寫作風格？`}
      />

      <Callout type="tip">
        Agent 有時會建議「把規則寫進 CLAUDE.md / AGENTS.md」。
        說「好」之後，下次你或同事寫 PRD，出現同類語氣問題的機率會降低，但仍要 review。
      </Callout>

      {/* Iteration 3: blind spot review */}
      <h3 className="text-white font-semibold mt-12 mb-4 text-base">迭代手法 3：找盲點 review</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">
        寫完最有用的一招——<span className="text-white">叫它扮演不同角色 review 你的 PRD</span>：
      </p>

      <PromptResponse
        promptLabel="你說"
        responseLabel="Claude 回"
        prompt={`現在你不是 PM，你是這個專案的 staff engineer。
讀完這份 PRD，給我 5 個你會在 design review 上提的疑問。
要尖銳的，不要客氣。`}
        response={`以 staff engineer 視角，我會問：

1. 「90 天訂單」是 created_at 還是 paid_at 還是 shipped_at？
   你 PRD 沒定義，這 3 個欄位定義差很多，會影響財務對帳結果。

2. 大量訂單走背景 job + email——email 寄出後，下載連結有效期多久？
   永久連結是資安風險（任何人拿到就能下載）。
   有效期短又會被客服抱怨「我下班才開信」。要明定。

3. 「子帳號權限」這欄位你說「主帳號授權」——授權 UI 是這個 PRD 範圍嗎？
   如果不是，請寫上 Dependency on 「子帳號權限管理 v2」這份 PRD。
   如果是，AC 應該包含 UI 規格。

4. CSV 欄位有「買家姓名」。我們有沒有客戶要求不揭露？
   日本市場有些賣家用化名，CSV 直接洩露真實姓名是合規風險。
   PRD 沒提到隱碼處理。

5. Metrics 寫「客服工單數量變化」——但你怎麼確定下降是因為這功能？
   同期可能有別的改動。建議加 A/B test 或灰度對照組。`}
        renderResponseMarkdown
      />

      <p className="text-slate-400 text-sm leading-relaxed mt-6 mb-10">
        這是<span className="text-white">最值得學的一招</span>。換不同角色 review：
        資安、法務、客服 lead、QA、財務——每個視角都會看出你想不到的盲點。
      </p>

      <Callout type="pm">
        到這裡，你已經能完整跑「產草稿 → 寫格式規則 → 用工具驗證嚴格格式 → 補欄位 → 調語氣 → 多角度 review」的迭代循環。
        後面的 <span className="font-mono font-semibold">human-in-the-loop</span> 會把「問問題、釐清思緒、找盲點」拆成獨立方法；
        <span className="font-mono font-semibold">limits-cost</span> 則保留限制與成本。
      </Callout>
    </PageLayout>
  )
}
