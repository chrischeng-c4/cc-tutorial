import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'

export default function Part13() {
  return (
    <PageLayout partIndex={12}>
      <SectionHeader partIndex={12} />

      <H3>完整 Workflow Demo</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        從收到需求到開出 PR，一個完整的流程長這樣：
      </p>
      <CodeBlock title="從需求到 PR — 完整流程">
{`# 1. 確保 git 狀態乾淨（重要！有東西要 commit 就先 commit）
git status
git checkout -b feature/add-export-api

# 2. 啟動 Claude Code 或 Codex
claude
# 或
codex

# 3. 描述需求（越清楚越好，給參考範例更好）
> 我需要新增一個 GET /api/reports/export 端點
> 回傳過去 30 天的訂單數據，格式為 CSV
> 需要驗證 JWT，只有 admin role 可以使用
> 參考現有的 /api/reports/summary 的實作風格

# 4. Agent 嘗試：讀程式碼 → 規劃 → 實作 → 跑測試

# 5. Review 它的改動
git diff
codex review --uncommitted "Focus on correctness, missing tests, and regressions."

# 6. 有問題繼續調整
> 欄位順序改成 date, order_id, amount, status
> 幫我補上 edge case 測試：空資料的情況

# 7. 確認沒問題，叫它開 PR
> 幫我 commit 並開一個 PR，標題和描述用繁體中文`}
      </CodeBlock>

      <Callout type="info">
        這個流程適合單一任務、改動範圍可控的情境。要做架構調整、跨多檔重構、或讓 agent 平行探索多個假設，
        請看 <span className="font-mono font-semibold">delegation-subagents</span> 與 <span className="font-mono font-semibold">parallel-agent-team</span>。
      </Callout>

      <H3>跨檔重構範例：Context 管理真正派上用場的場景</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        前面那個 API endpoint 例子是熱身。真正會把 context 燒完的是這種任務——
        把 5 個檔案裡都重複的 fetch 邏輯抽成共用 hook：
      </p>
      <CodeBlock title="Workflow — 跨檔重構">
{`# 1. 先進 plan mode / ask 模式，避免 agent 一頭熱開始改
> [Shift+Tab] 進入 plan mode

# 2. 給目標 + 邊界
> 把 src/pages 下用 fetch + useState + useEffect 的元件
> 統一改用我已經寫好的 src/hooks/useApi.ts
> 不要動測試檔，不要動樣式

# 3. Agent 在 plan mode 裡：
#    - 用 Grep 找出所有候選檔案
#    - 讀每個檔案分析改動風險
#    - 寫出 plan file（哪些該改、哪些不該改、為什麼）
> [Approve plan]

# 4. 執行階段中途用 /compact 防止 context 爆炸
#    （改到第 3 個檔案時下指令）
> /compact 重點保留：useApi 的型別簽名 + 已經改完的檔案清單

# 5. 全部改完後 review
git diff --stat
git diff src/pages/Dashboard.tsx   # 抽查單檔
codex review --uncommitted "Review only the changed files. Ignore style-only comments."

# 6. 跑測試確認沒打破現有行為
> npm test 跑起來，把失敗的 case 列出來

# 7. 一切 OK 才 commit
> 幫我 commit，每個檔案一個 commit，方便之後 review`}
      </CodeBlock>

      <H3>常見坑與解法</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        每個坑都有「事前訊號」——學會看訊號，比事後補救便宜很多。
      </p>
      <div className="space-y-3 mb-10">
        {[
          {
            icon: 'Cost',
            problem: 'Token 用量爆炸',
            signal: 'Claude /usage 每輪 +5K 以上，或 Codex /status 顯示 input token 超過 50K 還在跑。',
            solution: '長任務中途用 /compact 壓縮。不要把整個 repo 或整份訪談都丟給它，用外部檔案承接長資料。',
          },
          {
            icon: 'Loop',
            problem: 'Agent 一直改來改去，沒有收斂',
            signal: '同一個檔案被改了 3 次以上、或 agent 開始說「讓我換個方向試試」。',
            solution: '給更明確的驗收條件：「測試全部過就算完成」。或用 /clear 重新開，這次的 prompt 寫更清楚。',
          },
          {
            icon: 'Diff',
            problem: '它動了你不想讓它動的檔案',
            signal: 'git diff 出現你沒提到的目錄（migrations、config、lockfile）。',
            solution: '還原單一檔案。預防：在 CLAUDE.md / AGENTS.md 列出禁止修改的路徑、或用 hook / approval gate 攔住。',
          },
          {
            icon: 'Style',
            problem: '生成的程式碼風格和現有 code 不一致',
            signal: '出現專案沒在用的 library、import 路徑不對、命名慣例突然變了。',
            solution: '在 CLAUDE.md / AGENTS.md 加上規範。或在 prompt 說「參考 src/xxx.ts 的風格」，給它具體範例。',
          },
          {
            icon: 'Rule',
            problem: '同樣的錯誤修了又出現',
            signal: '你發現自己這週第三次糾正同一件事（例如「不要用 any」）。',
            solution: '把這條規則寫進 CLAUDE.md / AGENTS.md 或 Skill，讓每次 session 都套用，不要只靠對話記憶。',
          },
          {
            icon: 'Slow',
            problem: '越用越慢，回應延遲明顯增加',
            signal: '單輪要等 10 秒以上，或 /usage、/status 顯示 input 已經超過 100K token。',
            solution: 'Context 太長時注意力與延遲都會變差。用 /compact 或 /clear 重置，下一輪通常會比較可控。',
          },
        ].map(({ icon, problem, signal, solution }) => (
          <div key={problem} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex gap-4">
            <span className="flex h-10 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs font-semibold text-violet-300">{icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold text-sm mb-2">{problem}</div>
              <div className="flex items-start gap-2 mb-1.5">
                <span className="text-amber-400 text-xs font-semibold mt-0.5 flex-shrink-0">事前訊號</span>
                <span className="text-slate-400 text-sm leading-relaxed">{signal}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 text-xs font-semibold mt-0.5 flex-shrink-0">解法</span>
                <span className="text-slate-400 text-sm leading-relaxed">{solution}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
        <h3 className="text-white font-semibold mb-4">課程重點回顧</h3>
        <div className="space-y-2 text-sm">
          {[
            { slug: 'what-is-coding-agent', point: 'Claude Code 與 Codex 都是 coding agent，不是只回答問題的 chatbot' },
            { slug: 'agentic-loop', point: 'agentic loop = 感知 → 規劃 → 行動 → 觀察，不斷迭代直到目標達成' },
            { slug: 'prd-workflow', point: '用 PRD 當文件任務範例：餵 context、規則檔搭配工具驗證格式、迭代修改、多角度 review' },
            { slug: 'tooling-basics', point: '工具上手三件事：安裝、CLAUDE.md / AGENTS.md、看懂內建工具' },
            { slug: 'token-context-economics', point: 'Context 是工作記憶，不是資料庫；重要狀態放檔案、PR、JIRA、Docs' },
            { slug: 'permissions-approval-hooks', point: 'Permission 分層，Hooks 在工具呼叫前後加安全與流程檢查' },
            { slug: 'cli-mcp-skill', point: 'CLI first：MCP 可先用 CLI / export / API script 替代；Skill 是受控 prompt injection / 指令注入' },
            { slug: 'delegation-subagents', point: 'Subagent 把 side-quest 隔在獨立 context，只回摘要與引用' },
            { slug: 'parallel-agent-team', point: 'Agent Team 與 Codex cloud task 都可用來平行協作，但協調成本與 token 成本更高' },
            { slug: 'demo-workflow', point: '動手前確保 git 乾淨，完成後 git diff review；大任務先 plan，過程中管理 context' },
            { slug: 'repo-context', point: '把 repo map、llms.txt、spec 與 context packet 做成 agent 可讀、可引用、可 review 的外部 context' },
            { slug: 'programmatic-review', point: '把 review 與固定流程 programmatic 化：codex review、claude -p、CI artifact、schema validator' },
          ].map(({ slug, point }, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-violet-400 text-xs font-mono mt-0.5 w-44 flex-shrink-0">{slug}</span>
              <span className="text-slate-300">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
