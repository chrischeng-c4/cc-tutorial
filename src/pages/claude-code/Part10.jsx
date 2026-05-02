import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'

export default function Part10() {
  return (
    <PageLayout partIndex={9}>
      <SectionHeader partIndex={9} />

      <p className="text-slate-400 leading-relaxed mb-8">
        Part 8 講過：context 是稀缺資源，每多一輪對話 input token 就累積一輪。
        當任務需要「順便做點別的事」（搜整個 repo、跑一堆測試、研究某個 library）——
        這些 side-quest 會把主對話 context 灌爆。
        Claude Code 給了兩種把它隔出去的方式：<span className="text-cyan-300 font-medium">Subagent</span> 與
        <span className="text-cyan-300 font-medium"> Agent Team</span>。
      </p>

      {/* ── Section 1: Subagent ── */}
      <H3>Subagent：把 side-quest 隔在獨立 context</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Subagent 是「主對話派出去的工人」——獨立的 context window、自己的 system prompt、自己的 tool 限制、自己的 model。
        跑完只把<span className="text-white font-medium">摘要</span>送回主對話，工作過程中讀的檔案 / log / 搜尋結果通通留在它自己的 context 裡。
      </p>
      <Callout type="tip">
        什麼時候該用：要做一件「跑完就丟，過程不需要留」的事——大範圍 grep、研究某 lib 的 API、跑測試只回失敗清單、
        review code 只回 issue 列表。主對話要你動手實作的時候，就<span className="font-semibold">不要</span>用 subagent，用主對話比較直接。
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
          <div key={name} className="grid grid-cols-12 gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <code className="col-span-3 text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded font-mono text-xs">{name}</code>
            <span className="col-span-2 text-slate-500 text-xs">{model}</span>
            <span className="col-span-2 text-slate-500 text-xs">{tools}</span>
            <span className="col-span-5 text-slate-400 leading-relaxed">{desc}</span>
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
- Suggestions (consider improving)`}
      </CodeBlock>

      <p className="text-slate-400 text-sm leading-relaxed mb-3">
        重要 frontmatter 欄位：
      </p>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {[
          { field: 'name',           req: true,  desc: '小寫加連字號的識別碼' },
          { field: 'description',    req: true,  desc: 'Claude 用這段判斷何時該委派——寫清楚「什麼情況用我」' },
          { field: 'tools',          req: false, desc: '允許清單。省略則繼承主對話所有工具' },
          { field: 'disallowedTools',req: false, desc: '拒絕清單。從繼承來的工具中扣掉' },
          { field: 'model',          req: false, desc: 'sonnet / opus / haiku / inherit。Haiku 最便宜，適合搜尋類' },
          { field: 'permissionMode', req: false, desc: 'plan / acceptEdits / dontAsk / bypassPermissions 等' },
          { field: 'memory',         req: false, desc: 'user / project / local：跨對話累積知識的目錄' },
          { field: 'isolation',      req: false, desc: 'worktree：在臨時 git worktree 跑，不會弄髒你的工作目錄' },
        ].map(({ field, req, desc }) => (
          <div key={field} className="grid grid-cols-12 gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <code className="col-span-3 text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded font-mono text-xs">{field}</code>
            <span className={`col-span-1 text-xs ${req ? 'text-rose-300' : 'text-slate-600'}`}>{req ? '必填' : '選填'}</span>
            <span className="col-span-8 text-slate-400 leading-relaxed">{desc}</span>
          </div>
        ))}
      </div>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">放在哪？四級優先序</h4>
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
          <div key={loc} className="grid grid-cols-12 gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <span className="col-span-1 text-slate-600 font-mono text-xs">{p}</span>
            <code className="col-span-4 text-cyan-300 font-mono text-xs">{loc}</code>
            <span className="col-span-3 text-slate-400 text-xs">{scope}</span>
            <span className="col-span-4 text-slate-500 text-xs leading-relaxed">{note}</span>
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
            <span className="text-slate-400 ml-2">「叫 code-reviewer 看一下我剛改的東西」——Claude 看 description 自己判斷要不要委派</span>
          </div>
          <div>
            <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">@-mention</code>
            <span className="text-slate-400 ml-2">輸入 @ 從 typeahead 選——強制由那個 subagent 跑</span>
          </div>
          <div>
            <code className="text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">--agent</code>
            <span className="text-slate-400 ml-2"><code className="text-emerald-300">claude --agent code-reviewer</code>——整個 session 都用這個 subagent 的 prompt 與工具</span>
          </div>
        </div>
      </div>

      {/* ── Section 2: Agent Team ── */}
      <H3>Agent Team：多個 Claude 平行協作</H3>
      <Callout type="warn">
        Agent Team 目前是 experimental，預設關閉。需要 Claude Code v2.1.32+，並設定環境變數
        {' '}<code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code>
        {' '}才能啟用。
      </Callout>

      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Subagent 只能跑完回報給主對話，彼此之間講不到話。
        Agent Team 把它升級成<span className="text-white font-medium">能互相訊息、共享 task list</span>的小組。
        一個 lead 帶幾個 teammate，每個 teammate 是獨立的 Claude Code session、獨立 context，
        透過 mailbox 互相溝通、claim task。
      </p>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">Subagent vs Agent Team 對照</h4>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03] text-xs text-slate-500 font-semibold">
          <span className="col-span-3"></span>
          <span className="col-span-4">Subagent</span>
          <span className="col-span-5">Agent Team</span>
        </div>
        {[
          { k: 'Context',     a: '獨立 context，結果回傳呼叫者', b: '獨立 context，完全 independent' },
          { k: 'Communication', a: '只能回報給主 agent',           b: 'teammate 之間直接互發訊息' },
          { k: 'Coordination', a: '主 agent 統一指揮',             b: '共享 task list，可自選任務' },
          { k: 'Best for',    a: '只要結果、不需討論的任務',       b: '需要互相挑戰、跨層協作的任務' },
          { k: 'Token cost',  a: '較低（摘要回傳）',                b: '較高（每個 teammate 都是完整 session）' },
        ].map(({ k, a, b }) => (
          <div key={k} className="grid grid-cols-12 gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <span className="col-span-3 text-white font-medium text-xs">{k}</span>
            <span className="col-span-4 text-slate-400 leading-relaxed">{a}</span>
            <span className="col-span-5 text-cyan-200 leading-relaxed">{b}</span>
          </div>
        ))}
      </div>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">啟用</h4>
      <CodeBlock title="settings.json — 啟用 Agent Team">
{`{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}`}
      </CodeBlock>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">怎麼開團</h4>
      <p className="text-slate-400 text-sm leading-relaxed mb-3">
        啟用後，用自然語言告訴 Claude 你想要什麼樣的 team——它會生成成員、分派任務、整合結果：
      </p>
      <CodeBlock title="對話範例 — 平行 PR review">
{`> 開一個 agent team review PR #142，spawn 三個 reviewer：
>   - 一個專看 security implications
>   - 一個盯 performance impact
>   - 一個驗 test coverage
> 各自 review 後回報。`}
      </CodeBlock>

      <Callout type="info">
        在 in-process 模式下，按 <code className="text-cyan-300 bg-cyan-500/10 px-1 rounded">Shift+↓</code> 可以
        在 lead 與 teammate 之間切換、直接對某個 teammate 下指令。Split-pane 模式則需要 tmux 或 iTerm2。
      </Callout>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">真正適合 Agent Team 的場景</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {[
          { t: '多角度 research / review',  d: '同一個問題從不同 lens 同時看，最後整合（security / performance / DX）' },
          { t: '互相挑戰假設',             d: 'debug 找不到原因時，讓 5 個 teammate 各持不同假設互相反駁' },
          { t: '跨 layer 並行',            d: 'frontend / backend / test 各 owner 同時動，避免單一 session 切來切去' },
          { t: '新 feature 模組分工',      d: '可以拆獨立子模組、彼此沒有共改檔案的情況' },
        ].map(({ t, d }) => (
          <div key={t} className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
            <div className="text-cyan-300 font-semibold text-sm mb-1.5">{t}</div>
            <p className="text-slate-400 text-xs leading-relaxed">{d}</p>
          </div>
        ))}
      </div>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">不適合的場景</h4>
      <Callout type="warn">
        <span className="font-semibold">序列任務、會改同一檔案、依賴鏈深</span>的工作不適合——協調成本超過平行的好處，
        而且兩個 teammate 同時改一個檔案會互相覆蓋。這種情境用單一 session 或 subagent 比較好。
      </Callout>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">實務建議</h4>
      <div className="space-y-2 mb-5 text-sm text-slate-300">
        {[
          '從 review / research 開始試 — 邊界清楚、不寫 code，協調風險最低',
          '3–5 個 teammate 是甜蜜點，再多協調成本就吃掉好處了',
          '每個 teammate 給 5–6 個 task 最順，太少在 idle、太多換來換去',
          '同一檔案只給一個 teammate 動，避免覆蓋',
          '用 hooks（TeammateIdle / TaskCreated / TaskCompleted）強制 quality gate',
          '結束時叫 lead 清理：「Clean up the team」',
        ].map((t, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-cyan-400 flex-shrink-0 mt-0.5">→</span>
            <span>{t}</span>
          </div>
        ))}
      </div>

      <Callout type="tip">
        <span className="font-semibold">把 subagent 定義拿來當 teammate 用</span>：
        spawn teammate 時可以指定一個既有 subagent type（例如「用 security-reviewer 角色」），
        teammate 會繼承它的 tools 與 model，body 接在 system prompt 後面。
        定義一次、subagent 與 team 兩種模式共用。
      </Callout>

      {/* ── Bridge back to Agent 概念 ── */}
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 mt-8">
        <div className="flex items-center gap-2 mb-2">
          <span>🔗</span>
          <h4 className="text-white font-semibold text-sm">回到 Agent 概念</h4>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          這就是前面 Agent 概念講過的<span className="text-white font-medium"> Multi-agent Orchestration </span>實際長什麼樣——
          Subagent 對應「Orchestrator → Specialist」的單向委派；Agent Team 對應彼此能溝通的協作網。
          本質都是把 <span className="text-cyan-300">context 預算</span>當成稀缺資源在管，
          只是切片方式不同：subagent 切「side-quest 隔離」，agent team 切「平行 + 對話」。
        </p>
      </div>
    </PageLayout>
  )
}
