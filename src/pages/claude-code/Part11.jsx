import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'

const mainThreadPrinciples = [
  {
    name: 'Main thread',
    role: '控制流程與做最後整合',
    detail: '只保留任務目標、目前決策、驗收條件、下一步。不要把大量搜尋結果、測試 log、文件全文都塞進來。',
  },
  {
    name: 'External storage',
    role: '保存重要狀態',
    detail: '規格、決策、review 結論、測試報告、產出草稿要寫到檔案、PR、issue、JIRA、Docs，作為 source of truth。',
  },
  {
    name: 'Subagent',
    role: '處理隔離工作',
    detail: '負責探索、搜尋、比較、review、跑測試。只把摘要、結論、風險與檔案引用回傳給 main thread。',
  },
]

const lazyExplorationLevels = [
  {
    level: '回顧',
    title: '探索 session 產 artifact',
    desc: 'token-context-economics 先教手動版：讓 agent 找資料、寫 artifact；review 後清空 session，再讀 artifact 實作。',
    risk: '穩定，但需要人記得切 session。',
  },
  {
    level: 'Skill',
    title: '固定探索規則',
    desc: '把搜尋範圍、artifact schema、引用格式、HITL 問題寫成 Skill，讓每次探索都有一致輸出。',
    risk: 'Skill 會進 main thread context；它只適合放規則，不適合承接大量搜尋內容。',
  },
  {
    level: 'Subagent',
    title: '隔離高噪音探索',
    desc: '大範圍搜尋交給 read-only subagent。候選檔案、長 log、grep output 留在 subagent context，只回摘要與 artifact。',
    risk: '探索型 subagent 可以選較快或較便宜的 model；但仍要限制工具、scope 與輸出格式。',
  },
  {
    level: '組合',
    title: 'Skill 提醒 main thread 派 subagent',
    desc: 'Skill 不自己探索，只負責路由：遇到大型未知任務時，叫 main thread 派 subagent 產 artifact。',
    risk: '不用手動 compact，也不讓探索歷史污染 main thread。',
  },
]

export default function Part11() {
  return (
    <PageLayout partIndex={14}>
      <SectionHeader partIndex={14} />

      <p className="text-slate-400 leading-relaxed mb-8">
        <span className="font-mono text-slate-300">token-context-economics</span> 講過：context 是工作記憶，不是資料庫。
        <span className="font-mono text-slate-300">skills-workflows</span> 又把 Skill 和 subagent 的分工拆清楚。
        這一章講 main thread、subagent 與 Codex 背景委派的分工：主線對話保留決策；副工作隔離出去；
        重要狀態寫到外部儲存。
      </p>

      <H3>Main thread：保留決策，不保留所有過程</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Main thread 是你跟 agent 的主線對話。它應該保存目標、scope、重要決策、待確認問題與最後產出；
        不應該保存所有中間搜尋、長 log、repo 掃描結果。這些副工作要交給 CLI、MCP 或 subagent。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {mainThreadPrinciples.map((item) => (
          <div key={item.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="text-cyan-300 text-xs font-semibold uppercase tracking-wide mb-2">{item.name}</div>
            <div className="text-white font-semibold text-sm mb-2">{item.role}</div>
            <p className="text-slate-400 text-sm leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>
      <Callout type="tip">
        Main thread 最好像 project lead：知道目標、決策、下一步，也知道去哪裡讀 source of truth。
        它不需要保存每一行 grep output、每一段 JIRA raw export、每一次測試 stdout。
      </Callout>

      <H3>Subagent：把 side-quest 隔在獨立 context</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Subagent 是「主對話派出去的 worker」：獨立的 context window、自己的 system prompt、自己的 tool 限制、自己的 model。
        跑完只把<span className="text-white font-medium">摘要</span>送回主對話，工作過程中讀的檔案、log、搜尋結果留在它自己的 context 裡。
      </p>
      <Callout type="tip">
        什麼時候該用：要做一件「跑完就丟，過程不需要留」的事，例如大範圍 grep、研究某 lib 的 API、
        跑測試只回失敗清單、review code 只回 issue 清單。Codex 這邊先用 codex exec 這類明確任務示範；
        cloud task 只作補充入口。
        主對話要直接實作時，用 main thread 比較直接。
      </Callout>
      <Callout type="info">
        Subagent 不只是省 context，也是在縮小權限。Skill 會注入 main thread，繼承主線能用的工具；
        subagent 可以改成 read-only、禁用 Bash、限制寫入或使用不同 model。很多任務不是「多給 agent 權限」才好做，
        而是明確不給某些權限，讓它只產 facts、artifact、review findings，目標反而更容易達成。
      </Callout>

      <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 mb-5">
        <div className="mb-4">
          <div className="text-cyan-300 text-xs font-semibold uppercase tracking-wide mb-1">Progressive Disclosure</div>
          <div className="text-white font-semibold">把懶得整理資料，變成可控的 context 外包流程</div>
          <p className="text-slate-400 text-sm leading-relaxed mt-2">
            前面先教手動 artifact，這裡才把 Skill 與 subagent 補上。重點不是禁止人偷懶，
            而是把高噪音探索隔離出去，只讓 main thread 接收可 review 的 artifact。
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {lazyExplorationLevels.map((item) => (
            <div key={item.title} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-md border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                  {item.level}
                </span>
                <span className="text-white text-sm font-semibold">{item.title}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
              <p className="text-slate-500 text-xs leading-relaxed mt-2">{item.risk}</p>
            </div>
          ))}
        </div>
      </div>

      <CodeBlock title="最終型：Skill 提示 main thread 派 subagent 產 artifact">
{`# Skill / AGENTS rule: context-scout
When the task requires broad repo exploration or unknown domain discovery:
1. Do not perform broad exploration in the main thread.
2. Ask the main thread to spawn a read-only subagent.
3. The subagent may search broadly, but must write a context artifact.
4. The artifact must include:
   - task_goal
   - facts_with_file_refs
   - relevant_files
   - risky_assumptions
   - open_questions_for_human
   - recommended_next_prompt
5. The subagent returns only:
   - artifact path
   - 5-bullet summary
   - blockers or HITL questions
6. Main thread reads the reviewed artifact before implementation.
7. Do not keep raw exploration logs in main thread context.`}
      </CodeBlock>
      <Callout type="warn">
        Skill 的角色是提醒與路由，不是把整份資料塞進 prompt。Subagent 的角色是隔離高噪音探索。
        Artifact 的角色是把探索結果變成可 review、可重用、可丟給下一輪乾淨 session 的 source of truth。
      </Callout>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">內建 Subagent</h4>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Claude Code 出廠就帶幾個 subagent，用自然語言觸發，Claude 自己挑：
      </p>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {[
          { name: 'Explore',         model: 'Haiku',   tools: 'Read-only',  desc: '快速搜尋與探索 codebase。指定 quick / medium / very thorough 三種深度' },
          { name: 'Plan',            model: 'inherit', tools: 'Read-only',  desc: 'Plan mode 下蒐集 context 用，輸出 plan file 給你 review' },
          { name: 'general-purpose', model: 'inherit', tools: 'All',        desc: '需要邊探索邊修改、多步驟複雜任務時用' },
        ].map(({ name, model, tools, desc }) => (
          <div key={name} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <code className="md:col-span-3 text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded font-mono text-xs break-words">{name}</code>
            <span className="md:col-span-2 text-slate-500 text-xs">{model}</span>
            <span className="md:col-span-2 text-slate-500 text-xs">{tools}</span>
            <span className="md:col-span-5 text-slate-400 leading-relaxed">{desc}</span>
          </div>
        ))}
      </div>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">自訂 Subagent</h4>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        重複用同一種 worker、同一套指示時，把它寫成 markdown 檔。
        YAML frontmatter 是設定，body 是 system prompt：
      </p>
      <CodeBlock title=".claude/agents/code-reviewer.md">
{`---
name: code-reviewer
description: Reviews code for quality and best practices. Use proactively after writing or modifying code.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is clear and readable
- No exposed secrets or API keys
- Proper error handling
- Good test coverage

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Return only:
- findings with file references
- test gaps
- suggested next actions

Do not paste full diff or full logs into the main thread.`}
      </CodeBlock>

      <p className="text-slate-400 text-sm leading-relaxed mb-3">
        重要 frontmatter 欄位：
      </p>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {[
          { field: 'name',           req: true,  desc: '小寫加連字號的識別碼' },
          { field: 'description',    req: true,  desc: 'Claude 用這段判斷何時該委派，寫清楚「什麼情況用我」' },
          { field: 'tools',          req: false, desc: '允許清單。省略則繼承主對話所有工具' },
          { field: 'disallowedTools',req: false, desc: '拒絕清單。從繼承來的工具中扣掉' },
          { field: 'model',          req: false, desc: 'sonnet / opus / haiku / inherit。Haiku 最便宜，適合搜尋類' },
          { field: 'permissionMode', req: false, desc: 'plan / acceptEdits / dontAsk / bypassPermissions 等' },
          { field: 'memory',         req: false, desc: 'user / project / local：跨對話累積知識的目錄' },
          { field: 'isolation',      req: false, desc: 'worktree：在臨時 git worktree 跑，不會弄髒你的工作目錄' },
        ].map(({ field, req, desc }) => (
          <div key={field} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <code className="md:col-span-3 text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded font-mono text-xs break-words">{field}</code>
            <span className={`md:col-span-1 text-xs ${req ? 'text-rose-300' : 'text-slate-600'}`}>{req ? '必填' : '選填'}</span>
            <span className="md:col-span-8 text-slate-400 leading-relaxed">{desc}</span>
          </div>
        ))}
      </div>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">放在哪？優先序</h4>
      <p className="text-slate-400 text-sm leading-relaxed mb-3">
        同名 subagent 以較高優先序覆蓋較低的：
      </p>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {[
          { p: '1', loc: 'Managed settings',           scope: '組織層級',           note: '管理員透過 managed settings 部署' },
          { p: '2', loc: '--agents CLI flag',          scope: '本次 session',       note: 'JSON 傳入，不存檔，適合測試' },
          { p: '3', loc: '.claude/agents/',            scope: '本專案',             note: 'commit 進 repo，團隊共用' },
          { p: '4', loc: '~/.claude/agents/',          scope: '你所有專案',         note: '個人通用 subagent' },
          { p: '5', loc: 'Plugin agents/',             scope: 'plugin 啟用範圍',    note: '透過 plugin 散布' },
        ].map(({ p, loc, scope, note }) => (
          <div key={loc} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <span className="md:col-span-1 text-slate-600 font-mono text-xs">{p}</span>
            <code className="md:col-span-4 text-cyan-300 font-mono text-xs break-words">{loc}</code>
            <span className="md:col-span-3 text-slate-400 text-xs">{scope}</span>
            <span className="md:col-span-4 text-slate-500 text-xs leading-relaxed">{note}</span>
          </div>
        ))}
      </div>
      <Callout type="tip">
        互動式管理：對話中輸入 <code className="text-cyan-300 bg-cyan-500/10 px-1 rounded">/agents</code>，
        進去可以瀏覽、建立、編輯、刪除 subagent，不用手寫 markdown。
      </Callout>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">怎麼觸發</h4>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 mb-5">
        <div className="space-y-3 text-sm">
          <div>
            <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">自然語言</code>
            <span className="text-slate-400 ml-2">「叫 code-reviewer 看一下我剛改的東西」：Claude 看 description 自己判斷要不要委派</span>
          </div>
          <div>
            <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">@-mention</code>
            <span className="text-slate-400 ml-2">輸入 @ 從 typeahead 選，強制由那個 subagent 跑</span>
          </div>
          <div>
            <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">--agent</code>
            <span className="text-slate-400 ml-2"><code className="text-emerald-300">claude --agent code-reviewer</code>：整個 session 都用這個 subagent 的 prompt 與工具</span>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
