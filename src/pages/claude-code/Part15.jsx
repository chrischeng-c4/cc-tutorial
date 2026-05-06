import { PageLayout, SectionHeader, CodeBlock, Callout, H3, MarkdownContent } from '../../components/cc/shared'

const integrationRows = [
  {
    mode: '互動 session',
    fit: '探索、pairing、需求還不穩、需要即時判斷',
    output: '對話摘要、plan、diff、手動 review 結果',
    risk: 'scope 變大、context 越塞越多、結論只留在對話裡',
  },
  {
    mode: 'Non-interactive CLI',
    fit: '固定 task、review、報告、可重跑的資料整理',
    output: 'stdout、Markdown / JSON artifact、exit code',
    risk: 'prompt 太廣、權限太大、輸出格式沒有 validator',
  },
  {
    mode: 'CI / PR workflow',
    fit: 'pre-merge review、測試後補一層語意檢查、固定 checklist',
    output: 'PR comment、CI artifact、review report',
    risk: 'false positive 太多、太早變成 hard gate 阻塞開發',
  },
  {
    mode: '排程 / 背景 task',
    fit: '週期性掃描、issue triage、慢速大型 review',
    output: 'ticket、Slack 摘要、PR comment、檔案',
    risk: '上下文過期、監控權限過大、缺少人工 checkpoint',
  },
]

const reviewLanes = [
  {
    lane: '本機 commit 前',
    command: 'codex review --uncommitted',
    value: '先找 correctness、security、missing tests，再決定要不要繼續改。',
  },
  {
    lane: '開 PR 前',
    command: 'codex review --base main',
    value: '用 branch diff 看整體行為變更，避免只看單檔。',
  },
  {
    lane: '特定 commit',
    command: 'codex review --commit <sha>',
    value: '適合 review cherry-pick、hotfix、或整理 commit history。',
  },
  {
    lane: 'Claude Code 對等',
    command: 'claude -p ... --output-format json',
    value: '用非互動 prompt 跑固定 review，也可搭配 JSON schema 或下游 validator。',
  },
]

const reviewPrinciples = [
  'review agent 不應直接改檔；先輸出 findings 與 evidence',
  '先 report-only，再評估哪些檢查可以變成 CI gate',
  '嚴格格式交給 script、CLI、MCP 或 schema validator，不靠 prompt 保證',
  'review 結果要存到 artifact、PR comment、issue 或文件，不只留在 session context',
  '人負責確認高風險 findings、取捨 false positive、決定是否 merge',
]

const sampleReviewReport = `# Agent Review

## Findings
- **High** \`src/api/export.ts:42\`: admin role check happens after CSV generation. Move authorization before querying order data.
- **Medium** \`src/api/export.test.ts:12\`: missing empty-result case for CSV header-only output.

## Verdict
Do not merge until the authorization ordering issue is fixed.

## Open Questions
- Should exports over \`order_count > 1000\` always use background jobs?`

export default function Part15() {
  return (
    <PageLayout partIndex={14}>
      <SectionHeader partIndex={14} />

      <p className="text-slate-400 leading-relaxed mb-8">
        到這裡，你已經會在互動 session 裡跟 coding agent 協作。下一步是把它接進固定流程：
        script、CI、PR review、排程或背景任務。Programmatic 的重點不是讓 agent 自動亂跑，
        而是把 <span className="text-white font-medium">輸入、權限、輸出、驗收與人工 checkpoint</span> 固定。
      </p>

      <H3>1. 先分清楚：互動使用 vs programmatic 串接</H3>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02] mb-5">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="px-4 py-3 text-left font-semibold text-slate-400">模式</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-400">適合</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-400">輸出</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-400">主要風險</th>
            </tr>
          </thead>
          <tbody>
            {integrationRows.map((row) => (
              <tr key={row.mode} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3 align-top text-white font-semibold">{row.mode}</td>
                <td className="px-4 py-3 align-top text-slate-400 leading-relaxed">{row.fit}</td>
                <td className="px-4 py-3 align-top text-slate-400 leading-relaxed">{row.output}</td>
                <td className="px-4 py-3 align-top text-slate-400 leading-relaxed">{row.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout type="tip">
        第一個最值得 programmatic 化的流程通常是 review。它不需要 agent 直接寫入生產系統，
        風險低，但很容易補到人類 reviewer 忙碌時漏掉的 correctness、edge case、測試缺口。
      </Callout>

      <H3>2. Codex review：低風險、高價值的第一條 automation</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Codex 有互動式 <code className="text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded text-xs">/review</code>，
        也可以用 CLI 版本提供的 <code className="text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded text-xs">codex review</code>
        跑非互動 review。實務上請先用 <code className="text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded text-xs">codex review --help</code>
        確認團隊安裝版本支援哪些 flag。
      </p>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {reviewLanes.map((item) => (
          <div key={item.lane} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <span className="md:col-span-3 text-white font-semibold">{item.lane}</span>
            <code className="md:col-span-4 text-violet-300 font-mono text-xs break-words">{item.command}</code>
            <span className="md:col-span-5 text-slate-400 leading-relaxed">{item.value}</span>
          </div>
        ))}
      </div>
      <CodeBlock title="codex review 常用法">
{`# Review current working tree
codex review --uncommitted \
  "Focus on correctness, security, regressions, and missing tests.
   Return only concrete findings with file and line evidence."

# Review branch diff against main
codex review --base main \
  "Focus on behavior changes and tests. Ignore style-only comments."

# Review a specific commit
codex review --commit abc123 --title "order export backend"

# Longer review prompt from stdin
codex review --uncommitted - < docs/review-prompts/backend.md`}
      </CodeBlock>
      <Callout type="warn">
        把 review finding 當 signal，不要當唯一真相。高風險 finding 要回到 diff、測試與 domain owner 判斷；
        低信心或沒有具體檔案行號的 finding，不應該直接阻擋 merge。
      </Callout>

      <H3>3. Claude Code 的 programmatic 對等：claude -p</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Claude Code 的對等做法是用 Agent SDK / CLI 的非互動模式：
        <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">claude -p</code>。
        它適合接 scripts、CI/CD，並可用 <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">--output-format json</code>
        或 JSON schema 產出較容易被下游程式處理的結果。
      </p>
      <CodeBlock title="claude -p review lane">
{`# Read diff from stdin and run a fixed review prompt
git diff --no-ext-diff origin/main...HEAD | claude -p \
  "Review this diff for correctness, security, and missing tests.
   Return high-confidence findings only.
   Do not suggest broad refactors." \
  --allowedTools "Read,Grep" \
  --output-format json

# If the output is machine-consumed, validate it outside the model
node scripts/agent-review/validate-report.mjs tmp/claude-review.json`}
      </CodeBlock>
      <Callout type="info">
        嚴格要求固定格式時，問題不是「prompt 寫得不夠兇」。正確做法是用 CLI、script、MCP tool schema、
        JSON schema、formatter 或 validator 讓 agent 呼叫，而不是相信 agent 每次都會手寫出完全正確的 payload。
      </Callout>

      <H3>4. Review pipeline：把輸入與輸出都變成 artifact</H3>
      <CodeBlock title="review pipeline pseudo-code">
{`collect_context:
  diff = git diff origin/main...HEAD
  files = git diff --name-only origin/main...HEAD
  rules = read AGENTS.md / CLAUDE.md

run_agent_review:
  tool = codex review --base main
  focus = [correctness, security, missing_tests, regressions]
  exclude = [style_only, broad_refactor, speculation]

save_artifact:
  path = tmp/agent-review/codex-review.md

human_gate:
  if finding.severity in ["high", "critical"]:
    require_owner_review = true
  else:
    treat_as_signal = true`}
      </CodeBlock>
      <CodeBlock title="把 review 結果落成外部 artifact">
{`mkdir -p tmp/agent-review
git diff --name-only origin/main...HEAD > tmp/agent-review/files.txt
git diff --no-ext-diff origin/main...HEAD > tmp/agent-review/diff.patch

codex review --base main \
  "Use AGENTS.md. Focus only on correctness, security, missing tests, and regressions.
   Do not modify files. Write concrete findings as Markdown." \
  > tmp/agent-review/codex-review.md`}
      </CodeBlock>
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 mb-5">
        <div className="text-emerald-300 text-xs font-semibold uppercase tracking-wide mb-3">Rendered Markdown Artifact</div>
        <MarkdownContent>{sampleReviewReport}</MarkdownContent>
      </div>

      <H3>5. CI / PR：先 report-only，再決定 gate</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        CI 裡的 agent review 最好一開始只產報告，不要直接 fail build。等團隊累積幾週 findings，
        看 false positive、漏報、耗時與成本，再決定哪些檢查值得變成必擋 gate。
      </p>
      <CodeBlock title=".github/workflows/agent-review.yml">
{`name: agent-review

on:
  pull_request:

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - run: npm ci
      - run: npm test

      - name: Codex review
        run: |
          codex review --base origin/main \
            "Focus on correctness, security, regressions, and missing tests.
             Return actionable findings only." \
            > agent-review.md

      - uses: actions/upload-artifact@v4
        with:
          name: agent-review
          path: agent-review.md`}
      </CodeBlock>
      <Callout type="warn">
        CI runner 要用最小權限。review job 通常只需要讀 repo、讀 PR diff、寫 artifact 或 comment。
        不要把 production credentials、deploy 權限、或任意外部寫入權限交給 review 流程。
      </Callout>

      <H3>6. Review prompt template：用語言類型表達，少一點歧義</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Prompt 不必全部寫成自然語言。模型看過大量 code、pseudo-code、YAML、JSON schema 與 checklist。
        條件用符號會更省 token，也更精準：例如 <code className="text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded text-xs">order_count &gt; 1000</code>
        通常比「訂單數大於一千」更不容易被誤解。
      </p>
      <CodeBlock title="review-prompt.yml">
{`review_scope:
  target: current_branch_vs_main
  include:
    - correctness
    - security
    - missing_tests
    - regressions
  exclude:
    - style_only
    - broad_refactors
    - speculation_without_evidence

domain_rules:
  - if order_count > 1000: export_mode = "background_job"
  - if user.role != "admin": export_allowed = false
  - pii_fields require PM + Legal confirmation

output:
  format: markdown
  fields:
    - severity
    - file
    - line
    - issue
    - why_it_matters
    - suggested_fix

rules:
  - no findings without concrete evidence
  - mark uncertainty explicitly
  - do not modify files
  - do not comment on unrelated code`}
      </CodeBlock>

      <H3>7. 一句話原則</H3>
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 mb-5">
        <div className="space-y-2 text-sm text-slate-300">
          {reviewPrinciples.map((point, i) => (
            <div key={point} className="flex items-start gap-3">
              <span className="text-violet-300 text-xs font-mono mt-0.5">{String(i + 1).padStart(2, '0')}</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
      <Callout type="pm">
        Programmatic 串接的成熟度不是看 agent 有多自動，而是看流程是否可重跑、可 review、可追溯、可回滾。
        先從 <code className="text-violet-300 bg-violet-500/10 px-1 rounded">codex review</code> 這種 review-only lane 開始，通常最划算。
      </Callout>
    </PageLayout>
  )
}
