import { PageLayout, SectionHeader, CodeBlock, Callout, PermBadge, H3 } from '../../components/cc/shared'

const claudeModes = [
  {
    label: 'Ask before edits',
    mode: 'default',
    shorthand: '預設模式',
    canDo: '讀資料與提出 tool call；改檔、跑多數 command、網路請求前會問你。',
    useWhen: '不熟 repo、改動高風險、接近 production、或你想逐步看每個動作。',
  },
  {
    label: 'Plan mode',
    mode: 'plan',
    shorthand: '先想清楚',
    canDo: '探索、讀檔、跑允許的只讀檢查、提出 plan；不直接改 source。Permission prompts 仍照預設規則出現。',
    useWhen: '需求還不穩、跨檔重構、架構調整、或你想先 review 路線再讓它動手。',
  },
  {
    label: 'Edit automatically',
    mode: 'acceptEdits',
    shorthand: '口語常叫 edit mode',
    canDo: '自動接受工作目錄內的檔案建立與修改，也會自動接受部分常見 filesystem command；其他 Bash / 外部動作仍會問。',
    useWhen: '方向已確認，想讓它連續改檔，最後再用 git diff / tests review。',
  },
  {
    label: 'Auto mode',
    mode: 'auto',
    shorthand: '研究預覽',
    canDo: '減少 permission prompts，由額外 classifier 在工具執行前判斷是否放行或阻擋高風險動作。',
    useWhen: '任務邊界清楚、環境可回復、你信任方向但仍會做最後 review。不要把它當安全保證。',
  },
]

export default function Part9() {
  return (
    <PageLayout partIndex={8}>
      <SectionHeader partIndex={8} />

      <H3>Permission Model</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Claude Code 與 Codex 都有權限邊界：讀檔、改檔、執行指令、網路請求、寫入外部系統的風險不同。
        Claude Code 依操作風險分層，可在{' '}
        <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">/config</code> 或{' '}
        <code className="text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">settings.json</code> 調整；
        Codex 則用 approval modes 控制讀寫與 command 執行。
      </p>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {[
          { op: '讀取檔案',   perm: 'auto',    example: 'Read src/index.ts' },
          { op: '修改檔案',   perm: 'confirm', example: 'Edit src/utils.ts' },
          { op: '執行指令',   perm: 'confirm', example: 'npm run build' },
          { op: 'git commit', perm: 'confirm', example: 'git commit -m "..."' },
          { op: 'git push',   perm: 'confirm', example: 'git push origin main' },
          { op: '刪除檔案',   perm: 'confirm', example: 'rm -rf dist/' },
          { op: '網路請求',   perm: 'deny',    example: 'curl external-api.com' },
        ].map(({ op, perm, example }) => (
          <div key={op} className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0">
            <span className="text-white text-sm w-24 flex-shrink-0">{op}</span>
            <PermBadge level={perm} />
            <code className="text-slate-500 text-xs font-mono ml-auto hidden sm:block">{example}</code>
          </div>
        ))}
      </div>

      <Callout type="warn">
        表格是保守預設；實際行為會依 permission / approval mode 改變。
        <code className="mx-1 rounded bg-emerald-500/10 px-1 py-0.5 text-emerald-300">acceptEdits</code>、
        <code className="mx-1 rounded bg-emerald-500/10 px-1 py-0.5 text-emerald-300">auto</code> 或
        <code className="mx-1 rounded bg-emerald-500/10 px-1 py-0.5 text-emerald-300">bypassPermissions</code>
        會減少確認步驟，但風險也會上升；在不熟悉的 repo 或接近 production 的環境下不建議開寬。
      </Callout>

      <H3>Claude Code Modes：Plan / Edit / Auto</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        Claude Code 的 mode selector 決定「它需要多常停下來問你」。CLI 互動中可以用
        <code className="mx-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-300">Shift+Tab</code>
        切換常用模式；也可以用
        <code className="mx-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-300">claude --permission-mode plan</code>
        這類 flag 啟動。注意：大家口語說的「edit mode」通常是官方的
        <code className="mx-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-300">acceptEdits</code>
        / UI「Edit automatically」。
      </p>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.03] text-xs text-slate-500 font-semibold">
          <span className="col-span-3">UI / 口語</span>
          <span className="col-span-2">mode</span>
          <span className="col-span-4">行為</span>
          <span className="col-span-3">適合時機</span>
        </div>
        {claudeModes.map((item) => (
          <div key={item.mode} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <div className="md:col-span-3">
              <div className="text-white font-medium">{item.label}</div>
              <div className="text-xs text-slate-600 mt-0.5">{item.shorthand}</div>
            </div>
            <code className="md:col-span-2 text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded font-mono text-xs break-words">{item.mode}</code>
            <span className="md:col-span-4 text-slate-400 leading-relaxed">{item.canDo}</span>
            <span className="md:col-span-3 text-slate-500 leading-relaxed">{item.useWhen}</span>
          </div>
        ))}
      </div>
      <CodeBlock title="Mode 使用節奏">
{`# 不確定 scope：先進 plan mode
Shift+Tab  # default -> acceptEdits -> plan
> 先不要改檔，讀相關檔案後給我 plan、風險、會動到的檔案。

# plan review 後：方向明確才進 acceptEdits / edit automatically
> 依剛剛的 plan 實作。每完成一組檔案就跑對應測試。

# auto mode：只放在可回復、邊界清楚的任務
> 這個 branch 是 disposable worktree。請完成 TODO list，最後只回 git diff summary 和測試結果。`}
      </CodeBlock>
      <Callout type="warn">
        Plan mode 不是「更聰明」，而是把探索與決策停在改檔前；acceptEdits 不是免 review，只是把 review 從每次 edit 改到最後看 diff。
        Auto mode 是研究預覽，會降低中斷，但不能替代 git diff、測試、HITL 與可回復環境。
      </Callout>

      <H3>HITL：用問題取代猜測</H3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        HITL 是 Human in the Loop。重點不是讓人批准每一行，而是讓 agent 在高風險或不確定處停下來問人。
        一個好的問題通常比錯誤實作後再 rollback 便宜很多。
      </p>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-5">
        {[
          { trigger: '產品取捨', bad: '自動選「最常見」流程', good: '問 PM：A/B 哪個是 v1 scope？' },
          { trigger: '資料不確定', bad: '把缺欄位補成看似合理的假資料', good: '問資料 owner：缺欄位要留空、推估、還是阻擋輸出？' },
          { trigger: '外部寫入', bad: '直接建 JIRA、發 SeaTalk、改 Google Doc', good: '先產 dry-run preview，請人批准後再寫入' },
          { trigger: 'codebase 推論', bad: '把現有實作限制寫成產品原因', good: '列 code facts、assumptions、HITL questions' },
        ].map((item) => (
          <div key={item.trigger} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-start px-4 py-3 border-b border-white/5 last:border-0 text-sm">
            <span className="md:col-span-2 text-white font-medium">{item.trigger}</span>
            <span className="md:col-span-5 text-rose-200 leading-relaxed">{item.bad}</span>
            <span className="md:col-span-5 text-emerald-200 leading-relaxed">{item.good}</span>
          </div>
        ))}
      </div>
      <CodeBlock title="Claude Code：AskUserQuestion 降低返工">
{`# 不要猜，先問成可回答的選項
> 如果你需要做產品或資料假設，請用 AskUserQuestion 問我。
> 每次最多問 3 題，每題提供 2-3 個互斥選項。

# 例：agent 應該停下來問
Question: 匯出資料缺少 buyer_phone 時，v1 要怎麼處理？
Options:
- 留空並標記 warning
- 阻擋匯出並列入錯誤報告
- 使用 masked_phone fallback`}
      </CodeBlock>
      <Callout type="tip">
        Codex 這邊不要硬背工具名；不同介面可能呈現成 structured clarification、approval prompt、plan review，
        或其他「先問人」的互動步驟。課程重點是同一個原則：
        <span className="font-semibold">不確定就問成選項，外部寫入先 preview，最後由人確認。</span>
      </Callout>

      <Callout type="info">
        這章只處理「人類決策與權限邊界」。下一章會把 Hooks 獨立拆開：
        它不是 permission 的替代品，而是把工具呼叫前後的安全檢查、格式化、通知與稽核變成可重用流程。
      </Callout>
    </PageLayout>
  )
}
