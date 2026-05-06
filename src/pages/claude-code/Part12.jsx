import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'

export default function Part12() {
  return (
    <PageLayout partIndex={11}>
      <SectionHeader partIndex={11} />

      <p className="text-slate-400 leading-relaxed mb-8">
        <span className="font-mono text-slate-300">delegation-subagents</span> 的 subagent 是單向委派：跑完回報給 main thread。Agent Team 則把多個 Claude session 組成小組，
        讓 lead 與 teammate 可以互相訊息、共享 task list。Codex 的對等場景是 cloud task / 背景委派：
        把明確 issue 丟出去產可 review diff。兩者都適合平行探索，也都需要更明確的邊界與 review。
      </p>

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
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03] text-xs text-slate-500 font-semibold">
          <span className="col-span-3"></span>
          <span className="col-span-4">Subagent</span>
          <span className="col-span-5">Agent Team</span>
        </div>
        {[
          { k: 'Context',       a: '獨立 context，結果回傳呼叫者', b: '每個 teammate 都是獨立 session，彼此分開管理' },
          { k: 'Communication', a: '只能回報給主 agent',          b: 'teammate 之間直接互發訊息' },
          { k: 'Coordination',  a: '主 agent 統一指揮',            b: '共享 task list，可自選任務' },
          { k: 'Best for',      a: '只要結果、不需討論的任務',      b: '需要互相挑戰、跨層協作的任務' },
          { k: 'Token cost',    a: '較低（摘要回傳）',              b: '較高（每個 teammate 都是完整 session）' },
        ].map(({ k, a, b }) => (
          <div key={k} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <span className="md:col-span-3 text-white font-medium text-xs">{k}</span>
            <span className="md:col-span-4 text-slate-400 leading-relaxed">{a}</span>
            <span className="md:col-span-5 text-cyan-200 leading-relaxed">{b}</span>
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
        啟用後，用自然語言告訴 Claude 你想要什麼樣的 team。它會生成成員、分派任務、整合結果：
      </p>
      <CodeBlock title="對話範例 — 平行 PR review">
{`> 開一個 agent team review PR #142，spawn 三個 reviewer：
>   - 一個專看 security implications
>   - 一個盯 performance impact
>   - 一個驗 test coverage
> 各自 review 後回報。
> 請 lead 最後只整理 high-confidence findings，不要貼完整 diff。`}
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
        <span className="font-semibold">序列任務、會改同一檔案、依賴鏈深</span>的工作不適合。協調成本會超過平行的好處，
        而且兩個 teammate 同時改一個檔案會互相覆蓋。這種情境用單一 session 或 subagent 比較好。
      </Callout>

      <h4 className="text-white font-semibold mb-3 mt-6 text-sm">實務建議</h4>
      <div className="space-y-2 mb-5 text-sm text-slate-300">
        {[
          '從 review / research 開始試：邊界清楚、不寫 code，協調風險最低',
          '3-5 個 teammate 通常比較好控，再多協調成本就會明顯上升',
          '每個 teammate 給 5-6 個 task 最順，太少在 idle、太多換來換去',
          '同一檔案只給一個 teammate 動，避免覆蓋',
          '用 hooks（TeammateIdle / TaskCreated / TaskCompleted）強制 quality gate',
          '結束時叫 lead 清理：「Clean up the team」',
          '有 reusable 結論就寫回 PR、issue、JIRA 或 docs，不要只留在 teammate 對話裡',
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

      <H3>Codex 對等場景：Cloud task / 背景委派</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Codex 不一定用 teammate mailbox 這種模型。比較常見的對等做法是把明確、可驗收、可 review 的 issue
        丟成背景 task，讓它在隔離環境產 diff，再由人 review。適合「規格清楚、可以用測試驗收」的工作。
      </p>
      <CodeBlock title="Codex task prompt 範例">
{`Implement the order CSV export described in JIRA-142.

Scope:
- Backend endpoint only.
- Do not change UI.
- Do not change migrations.

Use AGENTS.md for project rules.
Run lint and tests.
Return:
- changed files
- test result
- risks
- open questions`}
      </CodeBlock>

      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5 mt-8">
        <h4 className="text-white font-semibold text-sm mb-2">回到 Agent 概念</h4>
        <p className="text-slate-400 text-sm leading-relaxed">
          Subagent 對應「Orchestrator → Specialist」的單向委派；Agent Team 對應彼此能溝通的協作網。
          本質都是把 <span className="text-cyan-300">context 預算</span>當成稀缺資源在管，
          只是切片方式不同：subagent 切「side-quest 隔離」，agent team 切「平行 + 對話」。
        </p>
      </div>
    </PageLayout>
  )
}
