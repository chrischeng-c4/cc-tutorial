import { PageLayout, SectionHeader, CodeBlock, H3 } from '../../components/cc/shared'

export default function Part5() {
  return (
    <PageLayout partIndex={4}>
      <SectionHeader partIndex={4} />

      <H3>完整 Workflow Demo</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        從收到需求到開出 PR，一個完整的流程長這樣：
      </p>
      <CodeBlock title="從需求到 PR — 完整流程">
{`# 1. 確保 git 狀態乾淨（重要！有東西要 commit 就先 commit）
git status
git checkout -b feature/add-export-api

# 2. 啟動 Claude Code
claude

# 3. 描述需求（越清楚越好，給參考範例更好）
> 我需要新增一個 GET /api/reports/export 端點
> 回傳過去 30 天的訂單數據，格式為 CSV
> 需要驗證 JWT，只有 admin role 可以使用
> 參考現有的 /api/reports/summary 的實作風格

# 4. Claude 自動：讀程式碼 → 規劃 → 實作 → 跑測試

# 5. Review 它的改動
git diff

# 6. 有問題繼續調整
> 欄位順序改成 date, order_id, amount, status
> 幫我補上 edge case 測試：空資料的情況

# 7. 確認沒問題，叫它開 PR
> 幫我 commit 並開一個 PR，標題和描述用繁體中文`}
      </CodeBlock>

      <H3>常見坑與解法</H3>
      <div className="space-y-3 mb-10">
        {[
          {
            icon: '💸',
            problem: 'Token 用量爆炸',
            solution: '長任務中途用 /compact 壓縮。不要把整個 repo 都丟給它，用明確的路徑縮小範圍。用 /cost 定時確認費用。',
          },
          {
            icon: '🌀',
            problem: 'Claude 一直改來改去，沒有收斂',
            solution: '給更明確的驗收條件：「測試全部過就算完成」。或用 /clear 重新開，這次的 prompt 寫更清楚。',
          },
          {
            icon: '😱',
            problem: '它動了你不想讓它動的檔案',
            solution: 'git diff 確認改動，git checkout <file> 還原單一檔案。預防：在 CLAUDE.md 列出禁止修改的路徑。',
          },
          {
            icon: '🤦',
            problem: '生成的程式碼風格和現有 code 不一致',
            solution: '在 CLAUDE.md 加上規範。或在 prompt 說「參考 src/xxx.ts 的風格」，給它具體範例。',
          },
          {
            icon: '🔁',
            problem: '同樣的錯誤修了又出現',
            solution: '把這條規則寫進 CLAUDE.md，讓每次 session 都套用，不要只靠對話記憶。',
          },
          {
            icon: '🐌',
            problem: '越用越慢，回應延遲明顯增加',
            solution: 'Context 太長導致的。用 /compact 或 /clear 重置，通常立即恢復速度。',
          },
        ].map(({ icon, problem, solution }) => (
          <div key={problem} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 flex gap-4">
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div>
              <div className="text-white font-semibold text-sm mb-1.5">{problem}</div>
              <div className="text-slate-400 text-sm leading-relaxed">{solution}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
        <h3 className="text-white font-semibold mb-4">課程重點回顧</h3>
        <div className="space-y-2 text-sm">
          {[
            { part: 'Part 1', point: 'Claude Code 是 Agentic CLI，不是外掛，它主動執行任務' },
            { part: 'Part 2', point: '它降低了 Dev 的理解成本，但不替代架構判斷，輸出仍需 review' },
            { part: 'Part 3', point: 'CLAUDE.md 是最重要的設定，/compact vs /clear 管理 context' },
            { part: 'Part 3', point: '多輪對話是打包重送，input token 線性累積，大 context 貴又慢' },
            { part: 'Part 4', point: 'Permission 分層、Hooks 插入邏輯、MCP 擴充工具能力' },
            { part: 'Part 5', point: '動手前先確保 git 乾淨，完成後 git diff review，再開 PR' },
          ].map(({ part, point }, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-violet-400 text-xs font-mono mt-0.5 w-12 flex-shrink-0">{part}</span>
              <span className="text-slate-300">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}
