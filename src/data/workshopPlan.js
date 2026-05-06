export const agenda = [
  {
    block: '基礎',
    minutes: '00-10',
    title: '定位這類工具：不是 chatbot，是 coding agent',
    focus: 'Claude Code 與 Codex 都能讀 repo、改檔、跑指令；差別在操作介面、權限模型與適合委派的工作型態。',
    outcome: '學員知道哪些任務可以交給 agent，哪些產品或技術決策仍要人負責。',
  },
  {
    block: '基礎',
    minutes: '10-25',
    title: 'Agent loop 與安全邊界',
    focus: '感知、規劃、行動、觀察；先 plan 再 edit；用 approval / permission 控制讀檔、改檔、跑 command。',
    outcome: '學員會要求 agent 先列計畫、風險與要讀的檔案，而不是直接開改。',
  },
  {
    block: '操作',
    minutes: '25-45',
    title: '有效使用：prompt、scope、checkpoint',
    focus: '任務描述要包含目標、邊界、參考檔、驗收條件；把 facts、assumptions、HITL questions 分開；條件與輸出結構多用 pseudo-code / schema / 符號表達；開始前保持 git 乾淨。',
    outcome: '學員能寫出可執行、低歧義的任務描述，並知道哪些結論需要人確認。',
  },
  {
    block: '成本',
    minutes: '45-60',
    title: 'Token / context 經濟學',
    focus: '這不是工程師專屬知識。用 bar 表看多輪對話成本如何成長；context 是工作記憶，不是資料庫；不要為了省 token 省略必要 context；可以先讓 agent 探索並整理 artifact，再 /clear 讓下一輪讀 artifact；重要狀態要落到檔案、PR、JIRA、Docs，也要知道 repo map、spec、context packet 怎麼減少重複探索。',
    outcome: '所有學員都知道何時該 /compact、/clear、開新 task，並理解 1M context 的 lost middle、成本累積、source of truth 風險與外部 context 的整理方式。',
  },
  {
    block: '工具',
    minutes: '60-70',
    title: '工具對照：CLI vs MCP、Skill、Claude Code 與 Codex',
    focus: '先分清楚 CLI / script 與 MCP 是同一層工具介面；Skill 本質上是受控 prompt injection / 指令注入；固定格式輸出要交給 script / CLI / MCP 產生與驗證；review 是第一個值得 programmatic 化的 workflow。',
    outcome: '學員知道何時用 CLI 快速跑通，何時才值得把外部系統接成 MCP，如何用 Skill 注入操作規則，以及如何用 codex review / claude -p 做低風險自動化 review。',
  },
  {
    block: '案例',
    minutes: '70-110',
    title: 'Demo case 推演',
    focus: '從 13 個真實情境挑 2-3 個現場推演：需求整理、MCP 權限、script 邊界、輸出格式、風險控管、HITL checkpoint。',
    outcome: '學員看到 agent 如何輔助整理 Google Docs、JIRA、Figma、Calendar、Git repo 等內部常見流程。',
  },
  {
    block: '收斂',
    minutes: '110-120',
    title: '整理清單與 Q&A',
    focus: '整理 demo 準備項、script 項、MCP 權限確認項，以及課後可以先試的低風險 automation。',
    outcome: '輸出一份課後可追蹤的 checklist。',
  },
]

export const tools = [
  {
    name: 'Claude Code',
    surface: '本機 terminal / IDE 整合',
    setup: ['claude 啟動互動 session', 'claude -p 跑 programmatic prompt', 'CLAUDE.md 放專案規範', '/cost、/compact、/clear 管理 context'],
    strengths: ['本機 repo 操作', 'hooks / MCP 權限與流程控制', '適合現場 cowork 與 script / CI review'],
  },
  {
    name: 'Codex',
    surface: 'CLI / IDE / Codex web cloud tasks',
    setup: ['npm i -g @openai/codex', 'codex 啟動本機 CLI', 'codex review 做本機 / PR 前 review', 'AGENTS.md 放專案規範', 'approval modes 控制讀寫與 command 執行'],
    strengths: ['CLI 適合本機 pairing', 'codex review 適合低風險檢查 diff', 'Cloud task 適合背景委派與平行工作', '適合把明確 issue 轉成可 review diff'],
  },
]

export const tokenRules = [
  { rule: '先問地圖，再指定路徑', bad: '讀整個 repo 幫我分析', good: '先找訂單匯出相關模組，列出 5 個候選檔案，等我確認後再讀' },
  { rule: '不要省錯 token', bad: '只丟一句「自己看 repo 做好」，讓 agent 多輪亂找', good: '一次給足目標、限制、相關檔、範例與驗收條件，讓 agent 少走冤枉工具呼叫' },
  { rule: '先產 artifact，再重置 session', bad: '同一個長 session 先到處探索、再直接實作、再 review，讓歷史越來越髒', good: '探索 session 只負責找資料並寫 docs/context/*.md；人 review 後 /clear，下一輪讀 artifact 實作' },
  { rule: '日常用 200K，不把 1M 當預設', bad: '開 1M 後同一個 session 一直塞資料、不 compact', good: '一般 task 用 200K；真的要讀大型材料才短時間使用 1M，完成後 /compact 或 /clear' },
  { rule: 'Context 是工作記憶，外部儲存是 source of truth', bad: '把所有訪談、log、決策、review 都留在同一個 session', good: '重要狀態寫進檔案 / issue / PR / JIRA / Docs，agent 需要時再按需讀取' },
  { rule: 'Repo 要有 LLM 可讀地圖', bad: '每次都叫 agent 掃完整個 repo 重新猜架構', good: '用 README、AGENTS.md / CLAUDE.md、docs/repo-map.md、llms.txt、specs/ 和 context packet 指路' },
  { rule: '條件用符號，背景用自然語言', bad: '如果 num 大於 10，就把狀態設成高風險，否則維持普通狀態', good: 'if num > 10: risk = "high" else: risk = "normal"' },
  { rule: '固定格式交給工具保證', bad: '請 agent 一定要輸出完全符合 schema 的 JSON，然後直接送下游系統', good: '做 scripts/cli/mcp 產生 payload、validate schema、dry-run preview，再讓 agent 修資料或回報缺口' },
  { rule: '先 plan，再 edit', bad: '直接幫我改好', good: '先列改動計畫、風險、會動到的檔案與驗收條件' },
  { rule: 'Codebase 只當技術證據', bad: '根據 codebase 反推為什麼產品這樣設計', good: '列出 code facts、推測、需要 PM / Tech Lead 確認的問題' },
  { rule: '把長資料存成檔案', bad: '把 5000 字訪談逐段貼進對話', good: '存到 docs/research/interview.md，請 agent 只引用相關段落與摘要' },
  { rule: '任務切小，避免混 session', bad: '同一個對話同時做 PRD、排程、週報、JIRA', good: '每個 demo case 一個獨立 task；共用規則寫進 CLAUDE.md / AGENTS.md' },
]

export const mcpCliRules = [
  {
    rule: 'CLI 先行',
    use: '一次性、探索期、輸入輸出還在變的流程；需要被人、CI、不同 agent 重複呼叫；需要固定格式 generator / validator',
    avoid: '一開始就寫 MCP server，最後 demo scope 改掉又重做；或只靠 prompt 要 agent 手寫機器格式',
  },
  {
    rule: 'Review 先 programmatic 化',
    use: '用 codex review、codex exec 或 claude -p 把本機 diff、branch diff、PR diff 做成可重跑 review report，先 report-only 再考慮 gate',
    avoid: '把 agent review 當唯一 merge 條件，或讓 review job 擁有不必要的寫入、deploy、production 權限',
  },
  {
    rule: 'Skill 是指令注入層',
    use: 'Skill 放操作手冊、路由規則、輸出格式、HITL checkpoint，提示 main thread 何時選 CLI、選 MCP、派 subagent 或寫外部儲存',
    avoid: '把 Skill 當成工具介面，或把整份外部資料塞進 Skill / prompt',
  },
  {
    rule: 'MCP 產品化',
    use: 'JIRA、Figma、Docs、Calendar、DB 這類會反覆查詢的外部系統；或需要 tool schema、server-side validation、dry-run preview 的寫入流程',
    avoid: '把 MCP 當成繞過權限或省 review 的方式',
  },
  {
    rule: '寫入先 dry-run',
    use: '先讀資料、產草稿、列待確認，再讓人批准寫入',
    avoid: '讓 agent 直接建 issue、發訊息、改資料而沒有 HITL checkpoint',
  },
]
