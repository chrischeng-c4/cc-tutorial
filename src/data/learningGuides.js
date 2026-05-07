export const teachingTracks = [
  {
    title: '第一場：共通心智模型',
    audience: '非 dev / dev 都適合',
    goal: '先知道 agent 是什麼、怎麼迭代、HITL 如何幫人做判斷，以及 context 為什麼會爆。',
    parts: ['what-is-coding-agent', 'agentic-loop', 'human-in-the-loop', 'token-context-economics', 'limits-cost'],
  },
  {
    title: '第二場：安全使用與工具上手',
    audience: '所有實際會操作工具的人',
    goal: '看懂規則檔、permission、approval、hooks，以及基本工具邊界。',
    parts: ['tooling-basics', 'permissions-approval', 'hooks-automation'],
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
    title: '第五場：實際演練',
    audience: '要導入到真實工作流的人',
    goal: '從演練 part 挑場景，練 input、dry-run、artifact、HITL 與 optional MCP。',
    parts: ['demo-workflow', 'demo-prd-draft-review', 'demo-prd-codebase-feasibility'],
  },
]

export const questionIndex = [
  {
    question: '我不是工程師，想先知道怎麼安全使用 agent',
    answer: '先看心智模型、HITL、工具上手與 scripts/CLI 的直覺版。',
    parts: ['what-is-coding-agent', 'human-in-the-loop', 'limits-cost', 'tooling-basics', 'scripts-workflow', 'cli-tooling'],
  },
  {
    question: '對話太長、agent 開始忘記重點',
    answer: '回到 context/token 經濟學，再用 Skill 或 Subagent 把探索和實作分開。',
    parts: ['token-context-economics', 'skills-workflows', 'delegation-subagents'],
  },
  {
    question: 'MCP 來不及做，但演練要跑起來',
    answer: '先用 export、script、CLI、dry-run artifact，MCP 放到穩定後。',
    parts: ['scripts-workflow', 'cli-tooling', 'mcp-integration', 'demo-workflow'],
  },
  {
    question: '怕 agent 亂改外部系統',
    answer: '先看 HITL 與 permission / approval，再用 hooks、dry-run、reviewable artifact 擋住外部寫入。',
    parts: ['human-in-the-loop', 'permissions-approval', 'hooks-automation', 'demo-workflow'],
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
