export const conceptVisuals = {
  'what-is-coding-agent': {
    kind: 'flow',
    title: 'Agent 工作單元',
    caption: '把 coding agent 當成可驗收工作流，不是單純聊天視窗。',
    nodes: ['目標', 'Context', '工具', 'Artifact', 'Human review'],
    takeaway: '輸出要能被人檢查、重跑或交接。',
  },
  'agentic-loop': {
    kind: 'loop',
    title: 'Agentic loop',
    caption: '每一輪都在縮小不確定性：先想、再做、看結果、調整下一步。',
    nodes: ['Plan', 'Act', 'Observe', 'Adjust'],
    takeaway: '不要期待一次 prompt 完成複雜工作。',
  },
  'prd-assist': {
    kind: 'flow',
    title: 'PRD 輔助位置',
    caption: 'Agent 最適合把零散資訊變成結構，再暴露缺口給 PM 判斷。',
    nodes: ['訪談/筆記', '結構化', '缺口問題', 'PRD 草稿', 'PM review'],
    takeaway: 'Agent 補結構，人補產品判斷。',
  },
  'prd-draft': {
    kind: 'stack',
    title: 'PRD 骨架分層',
    caption: '先固定章節與欄位，再逐層補需求、限制、驗收與風險。',
    nodes: ['模板', '需求摘要', '流程/邊界', '驗收標準', '風險問題'],
    takeaway: '骨架穩，後續迭代才不會散。',
  },
  'rules-and-iteration': {
    kind: 'loop',
    title: '規則檔迭代',
    caption: '規則檔讓格式與偏好可重用；每次 diff 都是在更新工作契約。',
    nodes: ['Rules', 'Generate', 'Diff', 'Fix', 'Update rules'],
    takeaway: '把重複糾正變成明確規則。',
  },
  'limits-cost-hitl': {
    kind: 'decision',
    title: '何時停下來問人',
    caption: '高風險、高歧義、外部寫入和產品取捨，都不該讓 agent 自己猜。',
    nodes: ['不確定', '成本/風險', 'HITL 問題', '人類決策', '繼續執行'],
    takeaway: '問一次通常比返工三次便宜。',
  },
  'tooling-basics': {
    kind: 'flow',
    title: '工具使用路徑',
    caption: '先理解本機工具、規則檔、權限與輸出檔，再談更進階的 MCP。',
    nodes: ['安裝啟動', 'Rules file', 'Tool list', 'Approval', 'Artifact'],
    takeaway: '工具透明，工作才可控。',
  },
  'token-context-economics': {
    kind: 'flow',
    title: 'Context 經濟工作流',
    caption: '可以懶得整理資料，但不要把探索和實作塞在同一個長 session。',
    nodes: ['探索資料', '整理 artifact', 'Review', 'Reset session', '實作'],
    takeaway: '把探索成本結晶成可重用 artifact。',
  },
  'permissions-approval-hitl': {
    kind: 'decision',
    title: '人類決策閘門',
    caption: 'Permission、approval mode 和 HITL 決定 agent 何時能做、何時要停下來問人。',
    nodes: ['Tool request', 'Permission', 'Approval', 'Ask user', 'Action'],
    takeaway: '不確定和高風險動作先問人。',
  },
  'hooks-automation': {
    kind: 'flow',
    title: 'Hooks 執行鏈',
    caption: 'Hooks 把工具呼叫前後的安全檢查、格式化、通知與稽核變成可重用流程。',
    nodes: ['Event', 'Matcher', 'Script', 'Decision', 'Feedback'],
    takeaway: 'Hook 是流程閘門，不是 permission 的替代品。',
  },
  'scripts-workflow': {
    kind: 'flow',
    title: 'Script 工作流',
    caption: '把人工步驟包成可重跑的 script，讓人、agent、CI 都跑同一條路徑。',
    nodes: ['Input', 'Script', 'Validate', 'Artifact', 'Review'],
    takeaway: 'Script 先讓流程可重跑。',
  },
  'cli-tooling': {
    kind: 'flow',
    title: 'CLI 工具介面',
    caption: 'CLI 是人與 agent 都能呼叫的穩定入口，適合 demo、dry-run、批次與 CI。',
    nodes: ['Command', 'Args', 'Stdout', 'Exit code', 'File output'],
    takeaway: 'CLI 讓工具行為透明。',
  },
  'mcp-integration': {
    kind: 'stack',
    title: 'MCP 產品化階梯',
    caption: '外部系統流程穩定後，才值得用 MCP 做成可發現、可授權、可驗證的工具協定。',
    nodes: ['Read-only', 'Schema', 'Dry-run', 'Write tool', 'Audit'],
    takeaway: 'MCP 是穩定流程的產品化。',
  },
  'skills-workflows': {
    kind: 'decision',
    title: 'Skill 路由規則',
    caption: 'Skill 把工作方法注入 main thread，負責選工具、輸出格式與 HITL 邊界。',
    nodes: ['Trigger', 'Rules', 'Tool choice', 'Artifact', 'HITL'],
    takeaway: 'Skill 是方法包，不是隔離沙箱。',
  },
  'delegation-subagents': {
    kind: 'flow',
    title: 'Context 外包',
    caption: 'Main thread 保留決策；探索、盤點與資料整理交給 subagent 產 artifact。',
    nodes: ['Main goal', 'Subagent explore', 'Artifact', 'New session', 'Implement'],
    takeaway: '把雜訊留在 side context。',
  },
  'parallel-agent-team': {
    kind: 'matrix',
    title: '平行協作圖',
    caption: '把可獨立驗證的問題拆出去，最後回到同一個 review 點收斂。',
    nodes: ['拆任務', 'Agent A', 'Agent B', 'Agent C', 'Merge review'],
    takeaway: '能平行的是調查與驗證，不是無限制亂改。',
  },
  'demo-workflow': {
    kind: 'flow',
    title: 'Demo 安全路徑',
    caption: '真實 demo 先走 dry-run 和可 review 產物，不把現場風險推給外部系統。',
    nodes: ['準備資料', 'Dry-run', 'Live demo', 'Artifact', 'Follow-up'],
    takeaway: '現場要展示方法，不展示權限事故。',
  },
  'repo-context': {
    kind: 'stack',
    title: 'Repo context packet',
    caption: '讓 LLM 先讀 curated index、規格與必要檔案，不要從 repo 海裡亂撈。',
    nodes: ['llms.txt', 'Specs', 'Repo map', 'Context packet', 'Task files'],
    takeaway: 'Context packet 是 repo 的導航圖。',
  },
  'programmatic-review': {
    kind: 'flow',
    title: 'Review pipeline',
    caption: 'Programmatic 串接先 report-only，等品質穩定後再考慮 gate。',
    nodes: ['Input artifact', 'Review command', 'Report', 'Human review', 'Gate later'],
    takeaway: '先產報告，再決定要不要擋流程。',
  },
}

export function buildDemoVisual(scenario) {
  const execution = scenario.layer === 2
    ? 'CLI dry-run'
    : scenario.layer === 3
      ? 'First slice'
      : 'Cowork run'

  return {
    kind: 'flow',
    title: `${scenario.id} Demo 路徑`,
    caption: '每個 demo 都先把輸入、替代工具、可 review 產出和 HITL 檢查點拆清楚。',
    nodes: ['輸入資料', execution, 'Artifact', 'HITL', 'Optional MCP'],
    takeaway: scenario.scriptResult ?? '現場先跑可控流程，再視情況展示 MCP。',
  }
}
