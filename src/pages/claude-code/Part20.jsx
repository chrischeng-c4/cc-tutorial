import { PageLayout, SectionHeader, Callout, CodeBlock, PromptResponse, H3 } from '../../components/cc/shared'

const hitlJobs = [
  {
    job: '補真相',
    agent: '列 facts、assumptions、open questions。',
    human: '提供 source of truth、owner、歷史決策脈絡。',
    output: '待確認問題清單與可追溯來源。',
  },
  {
    job: '釐清思緒',
    agent: '把模糊需求拆成 scope、選項、trade-off。',
    human: '選方向、補限制、說明偏好與不可踩的線。',
    output: 'decision memo 或 v1 / v2 scope。',
  },
  {
    job: '解除盲點',
    agent: '用不同角色 review：工程、QA、Legal、Security、Data、Ops。',
    human: '判斷哪些盲點真的重要，哪些只是過度設計。',
    output: 'risk list、edge cases、follow-up owners。',
  },
  {
    job: '承擔決策',
    agent: '產 dry-run、diff、preview、rollback plan。',
    human: '批准或拒絕外部寫入、高風險修改與 scope 取捨。',
    output: '被確認過的行動與 audit trail。',
  },
]

const hitlTriggers = [
  { trigger: '產品取捨', action: '請 agent 列選項、成本、風險，再由 PM / owner 選。' },
  { trigger: '資料不確定', action: '請 agent 標出缺口，不要補看似合理的假資料。' },
  { trigger: 'codebase 推論', action: '請 agent 分清楚 code facts、assumptions、需要問人的問題。' },
  { trigger: '外部寫入', action: '先產 dry-run preview；人確認後才建 JIRA、改文件、發訊息或 push。' },
  { trigger: '高風險或不可逆', action: '把 rollback、測試、reviewer、approval 都寫清楚。' },
  { trigger: '你自己也不確定', action: '讓 agent 先問你問題、挑盲點、重組你的思路。' },
]

export default function Part20() {
  return (
    <PageLayout partSlug="human-in-the-loop">
      <SectionHeader partSlug="human-in-the-loop" />

      <p className="text-slate-300 leading-relaxed mb-8">
        HITL 常被講成「agent 不確定就問人」，但這只是一小部分。
        更實用的理解是：<span className="text-white">人類要進入 agentic loop，負責真相、判斷、盲點與責任邊界</span>。
        Agent 很適合幫你整理資訊與提出問題；最後哪些方向要做、哪些風險能接受，仍然要由人決定。
      </p>

      <H3>1. HITL 不是人工批准每一步</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        如果每一步都要人批准，agent 會變成慢速 autocomplete。
        如果完全不讓人進 loop，它又會把缺少的脈絡自己補完。
        好的 HITL 是把人放在<span className="text-white font-medium">資訊缺口、決策分歧、盲點暴露與高風險行動</span>這些位置。
      </p>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] mb-5">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-slate-300">
              <th className="px-4 py-3 text-left font-semibold">人類在 loop 裡做什麼</th>
              <th className="px-4 py-3 text-left font-semibold">Agent 先做</th>
              <th className="px-4 py-3 text-left font-semibold">人類補上</th>
              <th className="px-4 py-3 text-left font-semibold">留下的 artifact</th>
            </tr>
          </thead>
          <tbody>
            {hitlJobs.map((row) => (
              <tr key={row.job} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 align-top text-amber-200 font-semibold">{row.job}</td>
                <td className="px-4 py-3 align-top text-slate-300 leading-relaxed">{row.agent}</td>
                <td className="px-4 py-3 align-top text-slate-300 leading-relaxed">{row.human}</td>
                <td className="px-4 py-3 align-top text-slate-300 leading-relaxed">{row.output}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="tip">
        很多時候 HITL 的價值不是「人比 agent 知道答案」，而是 agent 先把問題問清楚，讓人比較容易做決策。
      </Callout>

      <H3>2. 讓 agent 幫你釐清思緒</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        當你只有模糊想法，不要直接叫它產完整 PRD 或實作。
        先讓它把你的想法拆成決策題、scope 題、風險題。這種 HITL 是用 agent 反過來幫人類整理思考。
      </p>
      <CodeBlock title="Prompt：先問問題，不要急著產出">
{`你先不要寫 PRD，也不要給解法。
請把我現在的需求拆成需要人類決策的問題。

輸出格式：
1. facts: 目前已知事實
2. assumptions: 你推測但不能當真的假設
3. questions_for_human:
   - question
   - why_it_matters
   - options
   - risk_if_unanswered
4. recommended_next_step: 下一輪我應該先回答哪 3 題`}
      </CodeBlock>

      <H3>3. 用角色視角解除盲點</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        PRD case 很接地氣：如果你請 agent 扮演工程師，它不只是幫你寫文件，而是會問出實作前必須釐清的問題。
        同一招也可以換成 QA、Legal、Security、Data 或客服 lead。
      </p>
      <PromptResponse
        promptLabel="你問"
        responseLabel="Agent 應該問"
        prompt={`我要寫一份「訂單匯出 CSV」PRD。
你先不要寫 PRD。請你扮演會負責實作這個功能的 senior engineer，
根據目前需求，列出你會問 PM 的問題。

請分成：
1. v1 scope / blocker
2. data model / API / permission
3. edge cases
4. privacy / security / compliance
5. launch / metrics

每題都附上：為什麼要問、如果不問可能造成什麼返工。`}
        response={`## v1 scope / blocker
- 第一版是只支援手動下載，還是也要排程匯出？
  - 為什麼要問：這會決定是同步 API 還是背景 job。
  - 不問的返工：先做同步下載，後面才發現大賣家需要排程，整個架構要重做。

- 匯出範圍是賣家自己的訂單，還是 admin 也要跨店匯出？
  - 為什麼要問：權限模型與 audit log 完全不同。
  - 不問的返工：API 做完後才補 admin 權限，容易漏資料隔離。

## data model / API / permission
- CSV 欄位是固定，還是允許賣家自選欄位？
  - 為什麼要問：前端 UI、後端 schema、測試案例都會不同。
  - 不問的返工：先硬編固定欄位，之後加欄位設定會拆很多 code。

- 大量訂單的門檻是多少？1000、5000，還是依檔案大小？
  - 為什麼要問：門檻會影響 timeout、queue、email notification。
  - 不問的返工：上線後遇到大型賣家 timeout，才補背景處理。

## edge cases
- 沒有訂單時要下載空 CSV、顯示訊息，還是禁止下載？
- 退款、取消、部分出貨、跨時區訂單要怎麼呈現？

## privacy / security / compliance
- CSV 是否包含買家姓名、電話、地址？
- 匯出檔案連結有效多久？是否需要登入後才能下載？

## launch / metrics
- 成功標準是匯出使用率、客服工單下降，還是大型賣家 retention？
- 要不要先灰度給部分賣家，避免背景 job 壓垮系統？`}
        renderResponseMarkdown
      />

      <Callout type="pm">
        這不是只適用 PRD。任何模糊任務都可以問：「如果你是會接手這件事的人，你會先問我什麼？」
        這句話會把 agent 從產生答案，切到幫你建立決策地圖。
      </Callout>

      <H3>4. 什麼時候一定要 HITL</H3>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {hitlTriggers.map((item) => (
          <div key={item.trigger} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <span className="md:col-span-3 text-white font-medium">{item.trigger}</span>
            <span className="md:col-span-9 text-slate-300 leading-relaxed">{item.action}</span>
          </div>
        ))}
      </div>

      <H3>5. 好的 HITL output 長什麼樣</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        問題不要只是一串問號。要讓人能快速回答，就要附上背景、選項、風險與建議下一步。
      </p>
      <CodeBlock title="HITL questions schema">
{`hitl_questions:
  - owner: PM
    question: "v1 是否需要排程匯出？"
    why_it_matters: "決定同步下載或背景 job 架構"
    options:
      - "v1 只做手動下載"
      - "v1 做手動下載 + 背景 job"
      - "v1 同時做排程匯出"
    recommended_default: "v1 只做手動下載 + 大量資料走背景 job"
    risk_if_unanswered: "實作可能先選錯架構，之後重做 queue / email flow"

  - owner: Legal / Security
    question: "CSV 可以包含買家電話與地址嗎？"
    why_it_matters: "這是個資與資料外洩風險"
    options:
      - "完整匯出"
      - "預設遮罩，需要額外權限才完整匯出"
      - "v1 不匯出敏感欄位"
    recommended_default: "預設遮罩，需要額外權限才完整匯出"
    risk_if_unanswered: "上線後可能違反資料政策或被要求緊急下架"`}
      </CodeBlock>

      <Callout type="warn">
        HITL 不是拖慢 agent，而是避免它在錯的前提上跑太遠。
        當問題本身還不清楚，先讓 agent 問出好問題，通常比產生完整但錯方向的 artifact 更省時間。
      </Callout>
    </PageLayout>
  )
}
