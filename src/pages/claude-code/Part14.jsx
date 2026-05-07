import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'

const repoReadinessRows = [
  {
    file: 'README.md',
    purpose: '給人與 agent 的第一層地圖',
    include: '產品一句話、主要目錄、啟動方式、測試方式、常見任務入口',
  },
  {
    file: 'AGENTS.md / CLAUDE.md',
    purpose: '注入專案規則',
    include: '回答語言、禁止修改路徑、常用 command、review checklist、風格規範',
  },
  {
    file: 'docs/architecture.md',
    purpose: '說明系統形狀',
    include: '核心模組、資料流、外部依賴、重要 tradeoff、哪些地方不能只靠 code 推論',
  },
  {
    file: 'docs/decisions/*.md',
    purpose: '保存決策歷史',
    include: '為什麼選這個方案、替代方案、決策人、日期、後續限制',
  },
  {
    file: 'specs/<feature>/',
    purpose: '保存開發任務的 source of truth',
    include: 'requirements、design、tasks、acceptance criteria、open questions',
  },
  {
    file: 'llms.txt',
    purpose: '給 LLM 的 curated index',
    include: '專案摘要、重要文件連結、可略過資料、如何讀這個 repo',
  },
]

const sddSteps = [
  '先寫 requirements：使用者目標、非目標、acceptance criteria、edge cases',
  '再寫 design：資料流、API / component 邊界、相依系統、風險',
  '拆成 tasks：每個 task 都要能 review、能測、能回滾',
  'Agent 實作時只讀 specs + 必要程式碼，不把整段訪談或所有歷史塞進 context',
  '完成後把 diff、測試結果、open questions 回寫到 spec 或 PR',
]

const cddSteps = [
  '先整理 repo map：模組、owner、入口檔、常用 command、測試策略',
  '整理 context packet：任務相關文件、範例、限制、已知坑、不要讀的資料；高訊號 context 要精準且足量',
  '如果一開始不知道要讀什麼，先開探索 session，讓 agent 找資料並寫成 artifact，不要直接改碼',
  'Review artifact 後 /clear，下一輪 session 只讀 artifact、必要檔案與驗收條件',
  '讓 agent 先讀 context packet，再要求它列 plan 和缺口',
  '探索結果只回摘要；可重用結論寫回 docs / issue / PR',
  '每次任務後更新外部文件，讓下個 session 不必重走探索',
]

export default function Part14() {
  return (
    <PageLayout partIndex={17}>
      <SectionHeader partIndex={17} />

      <p className="text-slate-300 leading-relaxed mb-8">
        如果 repo 對人難讀，對 LLM 也會難讀。你不應該期待 agent 每次都掃完整個 codebase，
        再從雜訊裡猜出架構、規則與產品決策。比較好的做法是把 repo 整理成
        <span className="text-white font-medium">可索引、可引用、可 review 的外部 context</span>。
      </p>

      <H3>1. 讓 repo 對 LLM 友善的核心原則</H3>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03] text-xs text-slate-300 font-semibold">
          <span className="col-span-3">檔案 / 目錄</span>
          <span className="col-span-3">用途</span>
          <span className="col-span-6">應該包含</span>
        </div>
        {repoReadinessRows.map((row) => (
          <div key={row.file} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <code className="md:col-span-3 text-orange-300 font-mono text-xs break-words">{row.file}</code>
            <span className="md:col-span-3 text-white font-medium">{row.purpose}</span>
            <span className="md:col-span-6 text-slate-300 leading-relaxed">{row.include}</span>
          </div>
        ))}
      </div>
      <Callout type="tip">
        目標不是「寫更多文件」，而是讓 agent 能快速找到正確入口。每個文件都要回答：
        這是 source of truth 嗎？誰維護？什麼時候更新？哪些內容不能從 code 反推？
      </Callout>

      <H3>2. llms.txt：給 LLM 的 curated index</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        <code className="text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded text-xs">llms.txt</code>
        是一個放在網站或文件根目錄的 Markdown proposal，用來提供 LLM-friendly 的專案摘要與重要連結。
        proposal 建議內容包含專案 H1、短摘要 blockquote、補充說明，以及用 H2 分組的重要連結。
        它不是權限檔，也不是保證 LLM 一定會自動讀；比較務實的用途是：把它當成你可控制的「讀 repo 起點」。
      </p>
      <CodeBlock title="llms.txt 範例">
{`# Merchant Admin

> Multi-tenant commerce admin for sellers. This repo contains seller order management, product catalog, settlement, and reporting workflows.

Read this repo in this order:
- Start with README.md for local setup and commands.
- Read docs/architecture.md for module boundaries and data flow.
- Read AGENTS.md / CLAUDE.md for coding-agent rules.
- For feature work, read specs/<feature>/ before reading implementation files.

## Core docs
- [Repo map](docs/repo-map.md): module ownership, entrypoints, and common commands
- [Architecture](docs/architecture.md): system boundaries, data flow, external services
- [Decisions](docs/decisions/): ADR-style records for product and technical decisions
- [Coding agent rules](AGENTS.md): rules shared by Codex and other agents

## Feature specs
- [Order export](specs/order-export/requirements.md): requirements and acceptance criteria
- [Order export design](specs/order-export/design.md): API boundaries and risks
- [Order export tasks](specs/order-export/tasks.md): implementation checklist

## Optional
- [Legacy migration notes](docs/legacy-migrations.md): only needed when touching migrations
- [Full API reference](docs/api.md): large file; read specific sections only`}
      </CodeBlock>
      <Callout type="warn">
        <code className="text-orange-300 bg-orange-500/10 px-1 rounded">llms.txt</code> 仍是 community proposal，
        不是 W3C / IETF 這種正式標準，也不能取代 README、sitemap、robots.txt、權限設定或人工 review。
        它的價值是 curated map，不是自動記憶。
      </Callout>

      <H3>3. SDD：Spec-Driven Development</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        這裡的 SDD 指 <span className="text-white font-medium">Spec-Driven Development</span>：
        先把需求與設計寫成可 review 的 spec，再讓 agent 按 spec 實作。它適合需求清楚、會跨多人協作、
        需要回溯決策的功能。
      </p>
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 mb-5">
        <ol className="list-none m-0 p-0 space-y-2 text-sm text-slate-300">
          {sddSteps.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="text-emerald-300 text-xs font-mono mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <CodeBlock title="SDD 目錄範例">
{`specs/order-export/
  requirements.md     # user stories, acceptance criteria, edge cases
  design.md           # API boundaries, data model impact, risks
  tasks.md            # small reviewable implementation tasks
  review-notes.md     # reviewer comments, test result, open questions`}
      </CodeBlock>

      <H3>4. CDD：Context-Driven Development</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        這裡的 CDD 指 <span className="text-white font-medium">Context-Driven Development</span>：
        先整理 agent 需要的 context packet，再開始探索或實作。它適合大型既有 repo、模組邊界不清、
        或任務一開始還不知道要改哪裡的情境。
      </p>
      <Callout type="tip">
        CDD 不要求人一開始就把所有 context 整好。人可以先要求 agent 探索 repo、訪談、issue、PR，
        但第一輪產物應該是 artifact，不是直接開改。等 artifact 被 review 過，再 /clear 重開乾淨 session 實作。
      </Callout>
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 mb-5">
        <ol className="list-none m-0 p-0 space-y-2 text-sm text-slate-300">
          {cddSteps.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="text-cyan-300 text-xs font-mono mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <CodeBlock title="Context packet 範例">
{`docs/context/order-export.md

# Order Export Context Packet

## Goal
Build CSV export for seller orders.

## Read first
- specs/order-export/requirements.md
- docs/architecture.md#order-domain
- src/server/order/router.ts
- src/jobs/export-orders.ts

## Do not read unless needed
- docs/api.md full file
- legacy migration notes
- unrelated buyer checkout modules

## Known constraints
- No migration in v1.
- Large exports must use background job.
- order_count > 1000 => background_job + email.
- PII fields require PM / Legal confirmation.

## Commands
- npm run lint
- npm test -- order-export`}
      </CodeBlock>
      <CodeBlock title="探索 session prompt 範例">
{`Find the context needed for order export work.

rules:
  - do not edit production code
  - read broadly enough to avoid missing important constraints
  - every fact must include a file / issue / PR reference
  - mark assumptions explicitly

write_artifact:
  path: docs/context/order-export.md
  sections:
    - goal
    - facts_with_refs
    - relevant_files
    - constraints
    - risks
    - open_questions
    - recommended_next_prompt

After I review this artifact, I will /clear and start a new implementation session.`}
      </CodeBlock>

      <H3>5. SDD vs CDD 怎麼選</H3>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {[
          { k: '需求清楚、要多人 review', v: '用 SDD。先把 spec 寫清楚，再讓 agent 實作。' },
          { k: '大型舊 repo、不知道入口', v: '用 CDD。先整理 context packet 和 repo map，再動手。' },
          { k: '新功能且會長期維護', v: 'SDD + CDD 一起用：specs 保存需求，context packet 指引 agent 讀哪些檔。' },
          { k: '一次性小修', v: '不用上完整流程，但至少要有 AGENTS.md / CLAUDE.md、測試指令與禁止修改路徑。' },
        ].map(({ k, v }) => (
          <div key={k} className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-2 px-5 py-3 border-b border-white/5 last:border-0 text-sm">
            <div className="text-white font-semibold">{k}</div>
            <div className="text-slate-300 leading-relaxed">{v}</div>
          </div>
        ))}
      </div>

      <Callout type="pm">
        最終目標：不要讓每個 session 都從「讀整個 repo」開始。把 repo map、spec、context packet、
        llms.txt、規則檔都放在外部儲存，agent 需要時按需讀，main thread 只保留目標、決策與下一步。
      </Callout>
    </PageLayout>
  )
}
