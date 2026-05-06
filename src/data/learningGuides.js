export const chapterGuides = {
  'what-is-coding-agent': {
    oneLine: '先把 coding agent 當成會讀資料、用工具、產 artifact 的工作夥伴。',
    nonDev: '知道它不是搜尋引擎或聊天機器人，而是能執行一段工作流的助理。',
    dev: '把 agent 當成可驗收的 execution loop，設計清楚 scope、工具邊界與產物。',
    revisitWhen: '你不確定某件事該不該交給 agent 做時。',
  },
  'agentic-loop': {
    oneLine: 'Agent 工作不是一次回答，而是不斷 plan、act、observe、adjust。',
    nonDev: '學會把大任務拆成可檢查的小回合，不期待一次 prompt 完美。',
    dev: '把迭代點設在 test、diff、artifact、log，而不是靠對話感覺。',
    revisitWhen: 'agent 開始亂跑、繞遠路、或不知道下一步時。',
  },
  'prd-assist': {
    oneLine: 'PRD 類工作適合讓 agent 補結構、找缺口，人保留產品判斷。',
    nonDev: '可以用 agent 整理訪談、會議紀錄、需求草稿，但不要讓它替你拍板。',
    dev: '把需求轉成 facts、assumptions、open questions，降低開發前溝通成本。',
    revisitWhen: '要從零散文字整理成產品文件時。',
  },
  'prd-draft': {
    oneLine: 'PRD 草稿先穩住骨架，再逐步補內容與驗收標準。',
    nonDev: '先給模板和範例，讓 agent 產可 review 的初稿。',
    dev: '要求 agent 明確標註 acceptance criteria、edge cases、unknowns。',
    revisitWhen: '文件空白太大，不知道第一版怎麼開始時。',
  },
  'rules-and-iteration': {
    oneLine: '把每次修正沉澱成規則，下一輪才會變穩。',
    nonDev: '常見格式、語氣、欄位要求可以寫成規則，不用每次重講。',
    dev: '把規則放進 AGENTS.md、CLAUDE.md、Skill 或 formatter，讓輸出可重複。',
    revisitWhen: 'agent 一直犯同類錯誤時。',
  },
  'limits-cost-hitl': {
    oneLine: '高風險與高歧義處要停下來問人，不要讓 agent 猜。',
    nonDev: '學會辨認哪些地方需要你決定：產品取捨、資料缺口、外部寫入。',
    dev: '把 HITL checkpoint 做成流程邊界，避免錯誤假設一路傳到實作。',
    revisitWhen: '你想讓 agent 自動完成但又怕它亂決定時。',
  },
  'tooling-basics': {
    oneLine: '先看懂工具、規則檔、權限，再進階到自動化。',
    nonDev: '知道 agent 能讀檔、跑指令、改檔、問你批准；不用先會寫 code。',
    dev: '用規則檔、slash command、approval mode 管住工作環境。',
    revisitWhen: '剛開始用 Claude Code / Codex，或換到新 repo 時。',
  },
  'token-context-economics': {
    oneLine: 'Context 是工作記憶，不是資料庫；探索和實作要分開。',
    nonDev: '可以懶得整理資料，但要讓 agent 先產摘要 artifact，再開乾淨 session 實作。',
    dev: '控制 main thread 的 context 污染，把長 log、搜尋、repo map 外包成 artifact。',
    revisitWhen: '對話變長、模型開始忘記重點或成本變高時。',
  },
  'permissions-approval-hitl': {
    oneLine: 'Permission、approval、HITL 決定 agent 何時能做、何時要問。',
    nonDev: '知道哪些動作需要你批准，尤其是刪除、發送、建立 ticket、改外部文件。',
    dev: '依環境風險調整 permission mode，不把便利性當安全性。',
    revisitWhen: '要開 edit / auto mode，或讓 agent 動到外部系統前。',
  },
  'hooks-automation': {
    oneLine: 'Hooks 是工具呼叫前後的流程閘門。',
    nonDev: '把它理解成自動檢查員：危險動作先擋、改完自動檢查、結束自動提醒。',
    dev: '用 hooks 做 allowlist、lint、audit、notification，但不要拿來繞過 approval。',
    revisitWhen: '想把安全檢查或團隊流程自動掛在 agent 操作上時。',
  },
  'scripts-workflow': {
    oneLine: 'Script 是可重跑的 SOP，先讓流程穩定下來。',
    nonDev: '把 script 想成自動化食譜：匯出資料、整理格式、產草稿、檢查結果。',
    dev: '把資料轉換、schema validation、dry-run 寫成可測試工具，而不是 prompt 約定。',
    revisitWhen: 'MCP 來不及做，但 demo 或工作流程需要先跑通時。',
  },
  'cli-tooling': {
    oneLine: 'CLI 是人和 agent 都能操作的穩定入口。',
    nonDev: '把 CLI 想成遙控器：用一行指令叫工具跑某個固定功能。',
    dev: '設計清楚 args、stdout、exit code、output file，讓 agent 和 CI 都能重跑。',
    revisitWhen: '想把一段流程交給 agent 呼叫，或要做 dry-run / preview 時。',
  },
  'mcp-integration': {
    oneLine: 'MCP 是把穩定外部系統產品化成 agent 工具協定。',
    nonDev: '知道 MCP 不是必備第一步；先用 export / CLI 跑通也可以。',
    dev: '從 read-only、schema、dry-run、audit 開始，最後才開寫入工具。',
    revisitWhen: '同一個外部系統會被多個任務反覆使用時。',
  },
  'skills-workflows': {
    oneLine: 'Skill 是可重用的方法包，會注入 main thread。',
    nonDev: '把 Skill 想成「這類任務的操作手冊」，讓 agent 每次用同一套流程。',
    dev: '用 Skill 放 trigger、routing、output schema、HITL，不放大量資料。',
    revisitWhen: '同一類任務一直重複，想把方法固定下來時。',
  },
  'delegation-subagents': {
    oneLine: 'Subagent 用來隔離 context、工具與權限。',
    nonDev: '把它想成派助理先查資料，只帶摘要回來，不把整個過程塞進主對話。',
    dev: '用 read-only / no-Bash / cheaper model 的 worker 收斂 facts 與 artifact。',
    revisitWhen: '任務需要大量探索、review 或不同權限邊界時。',
  },
  'parallel-agent-team': {
    oneLine: '平行 agent 適合邊界清楚、可獨立驗證的工作。',
    nonDev: '可以把不同資料整理、不同方案比較分派出去，但最後仍要人收斂。',
    dev: '平行化探索、review、測試切片；避免多人同時改同一批檔案。',
    revisitWhen: '工作很多但可以拆成互不干擾的子任務時。',
  },
  'demo-workflow': {
    oneLine: 'Demo 要展示可控流程，不展示權限事故。',
    nonDev: '現場先準備資料、跑 preview、看 artifact，再決定是否真的寫入。',
    dev: '用 fixture、dry-run、git clean state、script validator 控住 demo 風險。',
    revisitWhen: '要設計現場 demo 或內部導入示範時。',
  },
  'repo-context': {
    oneLine: 'Repo context 要 curated，不要讓 LLM 在 repo 海裡亂撈。',
    nonDev: '如果需要讀 codebase，先請 agent 整理技術事實與問題，不要直接產結論。',
    dev: '用 llms.txt、repo map、spec、context packet 讓 agent 快速進入任務。',
    revisitWhen: 'PRD 需要對照 codebase 或新 agent 要接手 repo 時。',
  },
  'programmatic-review': {
    oneLine: 'Programmatic review 先 report-only，再決定是否 gate。',
    nonDev: '把固定檢查變成報告，先讓人 review，不急著讓系統自動擋流程。',
    dev: '把 codex review、schema validator、CI report 串成可追蹤 artifact。',
    revisitWhen: '某類 review 重複發生，想自動化但仍要保留人工判斷時。',
  },
}

export const teachingTracks = [
  {
    title: '第一場：共通心智模型',
    audience: '非 dev / dev 都適合',
    goal: '先知道 agent 是什麼、怎麼迭代、context 為什麼會爆、何時要 HITL。',
    parts: ['what-is-coding-agent', 'agentic-loop', 'token-context-economics', 'limits-cost-hitl'],
  },
  {
    title: '第二場：安全使用與工具上手',
    audience: '所有實際會操作工具的人',
    goal: '看懂規則檔、permission、approval、hooks，以及基本工具邊界。',
    parts: ['tooling-basics', 'permissions-approval-hitl', 'hooks-automation'],
  },
  {
    title: '第三場：可重用工作流',
    audience: 'PM / Ops / Dev / Data',
    goal: '用 scripts、CLI、MCP、Skill 把一次性操作變成可重跑流程。',
    parts: ['scripts-workflow', 'cli-tooling', 'mcp-integration', 'skills-workflows'],
  },
  {
    title: '第四場：Agentic coding 進階',
    audience: '偏 dev / tech lead',
    goal: '用 subagent、parallel work、repo context、programmatic review 提升 coding agent 產能。',
    parts: ['delegation-subagents', 'parallel-agent-team', 'repo-context', 'programmatic-review'],
  },
  {
    title: '第五場：Demo lab',
    audience: '要導入到真實工作流的人',
    goal: '從 demo part 挑場景，練 input、dry-run、artifact、HITL 與 optional MCP。',
    parts: ['demo-workflow', 'demo-weekly-report-flow', 'demo-prd-codebase-feasibility'],
  },
]

export const questionIndex = [
  {
    question: '我不是工程師，想先知道怎麼安全使用 agent',
    answer: '先看心智模型、HITL、工具上手與 scripts/CLI 的直覺版。',
    parts: ['what-is-coding-agent', 'limits-cost-hitl', 'tooling-basics', 'scripts-workflow', 'cli-tooling'],
  },
  {
    question: '對話太長、agent 開始忘記重點',
    answer: '回到 context/token 經濟學，再用 Skill 或 Subagent 把探索和實作分開。',
    parts: ['token-context-economics', 'skills-workflows', 'delegation-subagents'],
  },
  {
    question: 'MCP 來不及做，但 demo 要跑起來',
    answer: '先用 export、script、CLI、dry-run artifact，MCP 放到穩定後。',
    parts: ['scripts-workflow', 'cli-tooling', 'mcp-integration', 'demo-workflow'],
  },
  {
    question: '怕 agent 亂改外部系統',
    answer: '先看 permission / HITL，再用 hooks、dry-run、reviewable artifact 擋住外部寫入。',
    parts: ['permissions-approval-hitl', 'hooks-automation', 'demo-workflow'],
  },
  {
    question: '同一類任務一直重複，想變成流程',
    answer: '用 script/CLI 保證可重跑，再用 Skill 固定操作規則，必要時接 MCP。',
    parts: ['scripts-workflow', 'cli-tooling', 'skills-workflows', 'mcp-integration'],
  },
  {
    question: '要讓 dev 更會用 agentic coding',
    answer: '重點在 context packet、subagent 權限隔離、parallel review、programmatic review。',
    parts: ['delegation-subagents', 'repo-context', 'parallel-agent-team', 'programmatic-review'],
  },
]

export function buildDemoGuide(scenario) {
  const devNote = scenario.layer === 2
    ? '把這個 demo 做成 CLI dry-run 或 validator，讓輸入輸出可重跑。'
    : scenario.layer === 3
      ? '先切一個 read-only / first-slice worker，不要一次做完整 agent。'
      : '先把輸入資料和輸出 artifact 定義清楚，再視情況補工具。'

  return {
    oneLine: `把「${scenario.title}」拆成輸入、工具路徑、artifact 與 HITL。`,
    nonDev: '看懂這個工作流需要準備哪些資料，以及哪一步要人確認。',
    dev: devNote,
    revisitWhen: '要把這個 demo 轉成真實團隊流程或課後練習時。',
  }
}
