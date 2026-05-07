import { demoScenarios } from './demoScenarios'

const RAW_PARTS = [
  { slug: 'what-is-coding-agent',       path: '/coding-agent/what-is-coding-agent',       title: 'Claude Code + Codex 是什麼',              time: '5 min',  accent: 'sky',     usage: '核心同步', audience: '共通',             tags: ['基礎'] },
  { slug: 'agentic-loop',               path: '/coding-agent/agentic-loop',               title: '它怎麼想：agentic loop',                  time: '5 min',  accent: 'indigo',  usage: '核心同步', audience: '共通',             tags: ['基礎'] },
  { slug: 'prd-assist',                 path: '/coding-agent/prd-assist',                 title: '文件工作：PRD 可以怎麼輔助',              time: '5 min',  accent: 'rose',    usage: '文件案例', audience: '偏 PM',            tags: ['文件', '中階'], demoCases: ['04', '13'] },
  { slug: 'prd-draft',                  path: '/coding-agent/prd-draft',                  title: '第一次產 PRD 骨架',                       time: '10 min', accent: 'pink',    usage: '文件案例', audience: '偏 PM',            tags: ['文件', '操作'], demoCases: ['04', '13'] },
  { slug: 'rules-and-iteration',        path: '/coding-agent/rules-and-iteration',        title: '規則檔、格式工具與迭代',                  time: '8 min',  accent: 'fuchsia', usage: '文件案例', audience: '偏 PM',            tags: ['模板', '操作'], demoCases: ['04', '13'] },
  { slug: 'limits-cost',                path: '/coding-agent/limits-cost',                title: '限制與成本：Agent 做不到什麼',            time: '5 min',  accent: 'purple',  usage: '文件案例', audience: '共通',             tags: ['限制', '成本'] },
  { slug: 'tooling-basics',             path: '/coding-agent/tooling-basics',             title: '兩套工具上手',                            time: '10 min', accent: 'amber',   usage: '核心同步', audience: '共通',             tags: ['工具', '操作'] },
  { slug: 'token-context-economics',    path: '/coding-agent/token-context-economics',    title: 'Token 與 context 經濟學',                  time: '12 min', accent: 'orange',  usage: '核心同步', audience: '共通',             tags: ['成本'] },
  { slug: 'permissions-approval',       path: '/coding-agent/permissions-approval',       title: 'Permission · Approval：工具邊界',          time: '8 min',  accent: 'emerald', usage: '核心同步', audience: '共通',             tags: ['權限', '安全'] },
  { slug: 'hooks-automation',           path: '/coding-agent/hooks-automation',           title: 'Hooks：工具呼叫前後的流程閘門',           time: '8 min',  accent: 'emerald', usage: '進階參考', audience: '偏 Engineering',   tags: ['Hooks', '安全', '自動化'] },
  { slug: 'scripts-workflow',           path: '/coding-agent/scripts-workflow',           title: 'Scripts：可重跑的工作流',                 time: '8 min',  accent: 'cyan',    usage: '核心同步', audience: '共通',             tags: ['Scripts', '操作'], demoCases: ['13', '14'] },
  { slug: 'cli-tooling',                path: '/coding-agent/cli-tooling',                title: 'CLI：人與 agent 共用的工具介面',           time: '8 min',  accent: 'emerald', usage: '核心同步', audience: '共通',             tags: ['CLI', '工具'], demoCases: ['14', '13'] },
  { slug: 'mcp-integration',            path: '/coding-agent/mcp-integration',            title: 'MCP：穩定外部系統的工具協定',             time: '8 min',  accent: 'violet',  usage: '進階參考', audience: '偏 Engineering',   tags: ['MCP', '整合'], demoCases: ['03', '04'] },
  { slug: 'skills-workflows',           path: '/coding-agent/skills-workflows',           title: 'Skill：可重用的工作方法',                 time: '10 min', accent: 'emerald', usage: '進階參考', audience: '偏 Engineering',   tags: ['Skill', 'Context'], demoCases: ['04', '13'] },
  { slug: 'delegation-subagents',       path: '/coding-agent/delegation-subagents',       title: '委派：Subagent / 背景任務',               time: '8 min',  accent: 'cyan',    usage: '進階參考', audience: '偏 Engineering',   tags: ['進階', '分工'] },
  { slug: 'parallel-agent-team',        path: '/coding-agent/parallel-agent-team',        title: '平行協作：Agent Team / Codex',            time: '8 min',  accent: 'cyan',    usage: '進階參考', audience: '偏 Engineering',   tags: ['進階', '平行'], experimental: true },
  { slug: 'demo-workflow',              path: '/coding-agent/demo-workflow',              title: '演練流程 + 常見坑',                      time: '8 min',  accent: 'violet',  usage: '進階參考', audience: '共通',             tags: ['案例', '收斂'] },
  { slug: 'repo-context',               path: '/coding-agent/repo-context',               title: 'Repo 給 LLM 讀：llms.txt · SDD · CDD',    time: '10 min', accent: 'orange',  usage: '進階參考', audience: '偏 Engineering',   tags: ['Repo', 'Context'], demoCases: ['12', '13'] },
  { slug: 'programmatic-review',        path: '/coding-agent/programmatic-review',        title: 'Programmatic 串接與 Review',              time: '10 min', accent: 'violet',  usage: '進階參考', audience: '偏 Engineering',   tags: ['Automation', 'Review'], demoCases: ['13'] },
  { slug: 'human-in-the-loop',          path: '/coding-agent/human-in-the-loop',          title: 'HITL：人類在 loop 裡做什麼',               time: '8 min',  accent: 'amber',   usage: '核心同步', audience: '共通',             tags: ['HITL', '決策'] },
]

export const PARTS = RAW_PARTS

const demoSlugById = {
  '01': 'demo-slides-progress-review',
  '02': 'demo-jira-subtasks-draft',
  '03': 'demo-meeting-action-items',
  '04': 'demo-prd-draft-review',
  '05': 'demo-weekly-report-flow',
  '06': 'demo-roadmap-impact-analysis',
  '07': 'demo-figma-mockup',
  '08': 'demo-prd-figma-training-manual',
  '09': 'demo-confluence-research',
  10: 'demo-meeting-scheduling',
  11: 'demo-interview-outline',
  12: 'demo-code-change-prd-update',
  13: 'demo-prd-codebase-feasibility',
  14: 'demo-build-validator-script',
}

const demoAccentByLayer = {
  1: 'cyan',
  2: 'violet',
  3: 'orange',
}

export const DEMO_PARTS = demoScenarios.map((scenario) => {
  const slug = demoSlugById[scenario.id]
  const isLive = scenario.demoMode === 'live'
  return {
    slug,
    path: `/coding-agent/${slug}`,
    title: `${isLive ? '實際演練' : '課後自練'}：${scenario.title}`,
    time: scenario.layer === 2 ? '15 min' : '10 min',
    accent: demoAccentByLayer[scenario.layer] ?? 'violet',
    usage: isLive ? '實際演練' : '課後自練',
    audience: scenario.layer === 1 ? '共通' : '偏 PM',
    tags: [isLive ? '實際演練' : '課後自練', scenario.layerLabel.replace('Layer ', '')],
    demoId: scenario.id,
    demoMode: scenario.demoMode,
    materialsReady: scenario.materialsReady ?? false,
    relatedConcepts: scenario.relatedParts,
  }
})

export const COURSE_PARTS = [...PARTS, ...DEMO_PARTS]

const CONCEPT_PATH = [
  {
    title: '基礎觀念',
    desc: '先建立 coding agent 心智模型：它是什麼、怎麼迭代，何時讓人進入 loop，以及 context/token 為什麼要管理。',
    parts: ['what-is-coding-agent', 'agentic-loop', 'human-in-the-loop', 'token-context-economics'],
  },
  {
    title: '產品用法',
    desc: '再學實際怎麼裝、怎麼啟動、常見指令、規則檔、工具清單與 permission / approval。',
    parts: ['tooling-basics', 'permissions-approval', 'hooks-automation'],
  },
  {
    title: '進階觀念',
    desc: '理解 scripts、CLI、MCP、Skill、委派、平行協作、repo context 與 programmatic review。',
    parts: ['scripts-workflow', 'cli-tooling', 'mcp-integration', 'skills-workflows', 'delegation-subagents', 'parallel-agent-team', 'repo-context', 'programmatic-review'],
  },
  {
    title: '實戰演練',
    desc: '最後用 PRD 文件流程、限制成本與完整演練，把前面的觀念串成可操作工作流。',
    parts: ['prd-assist', 'prd-draft', 'rules-and-iteration', 'limits-cost', 'demo-workflow'],
  },
]

const DEMO_PATH = [
  {
    title: '實際演練（課堂）',
    desc: '課堂會帶這 5 個流程：4 個純文字 / markdown 演練（讀檔→產草稿）+ 1 個讓 agent 寫小 CLI 工具（學「先寫腳本、先 dry-run、再 apply」）。',
    parts: DEMO_PARTS.filter(part => part.demoMode === 'live').map(part => part.slug),
  },
  {
    title: '課後自練（依興趣選做）',
    desc: '課堂不示範，但保留下來當延伸練習。多數情境需要外部系統權限或自備素材；標 ✅ 的有現成 fixture，標 ✗ 的素材還沒備好，可以自行設計。',
    parts: DEMO_PARTS.filter(part => part.demoMode !== 'live').map(part => part.slug),
  },
]

export const COURSE_SECTIONS = [
  {
    title: '上半部：觀念教導',
    desc: '先建立心智模型、產品用法、進階技巧與工作流判斷。',
    groups: CONCEPT_PATH,
  },
  {
    title: '下半部：實際演練',
    desc: '每個 part 對應一個演練，重點是輸入資料、CLI first 路徑、HITL 與可 review 產出。',
    groups: DEMO_PATH,
  },
]

export const LEARNING_PATH = [...CONCEPT_PATH, ...DEMO_PATH]
export const CURRICULUM_ORDER = LEARNING_PATH.flatMap(group => group.parts)

export const USAGE_STYLES = {
  核心同步: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  文件案例: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  進階參考: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
  實際演練: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  課後自練: 'border-slate-500/25 bg-slate-500/10 text-slate-300',
}

export const AUDIENCE_STYLES = {
  共通: 'border-slate-500/25 bg-slate-500/10 text-slate-300',
  '偏 PM': 'border-pink-500/25 bg-pink-500/10 text-pink-300',
  '偏 Engineering': 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
}

export const ACCENT = {
  sky:     { bar: 'from-sky-400 to-blue-400',         badge: 'bg-sky-500/20 text-sky-300',          border: 'border-sky-500/20',     bg: 'bg-sky-500/5',     ring: 'ring-sky-500/30' },
  indigo:  { bar: 'from-indigo-400 to-blue-400',      badge: 'bg-indigo-500/20 text-indigo-300',    border: 'border-indigo-500/20',  bg: 'bg-indigo-500/5',  ring: 'ring-indigo-500/30' },
  rose:    { bar: 'from-rose-400 to-pink-400',        badge: 'bg-rose-500/20 text-rose-300',        border: 'border-rose-500/20',    bg: 'bg-rose-500/5',    ring: 'ring-rose-500/30' },
  pink:    { bar: 'from-pink-400 to-rose-400',        badge: 'bg-pink-500/20 text-pink-300',        border: 'border-pink-500/20',    bg: 'bg-pink-500/5',    ring: 'ring-pink-500/30' },
  fuchsia: { bar: 'from-fuchsia-400 to-pink-400',     badge: 'bg-fuchsia-500/20 text-fuchsia-300',  border: 'border-fuchsia-500/20', bg: 'bg-fuchsia-500/5', ring: 'ring-fuchsia-500/30' },
  purple:  { bar: 'from-purple-400 to-fuchsia-400',   badge: 'bg-purple-500/20 text-purple-300',    border: 'border-purple-500/20',  bg: 'bg-purple-500/5',  ring: 'ring-purple-500/30' },
  amber:   { bar: 'from-amber-400 to-orange-400',     badge: 'bg-amber-500/20 text-amber-300',      border: 'border-amber-500/20',   bg: 'bg-amber-500/5',   ring: 'ring-amber-500/30' },
  orange:  { bar: 'from-orange-400 to-amber-400',     badge: 'bg-orange-500/20 text-orange-300',    border: 'border-orange-500/20',  bg: 'bg-orange-500/5',  ring: 'ring-orange-500/30' },
  emerald: { bar: 'from-emerald-400 to-teal-400',     badge: 'bg-emerald-500/20 text-emerald-300',  border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', ring: 'ring-emerald-500/30' },
  cyan:    { bar: 'from-cyan-400 to-sky-400',         badge: 'bg-cyan-500/20 text-cyan-300',        border: 'border-cyan-500/20',    bg: 'bg-cyan-500/5',    ring: 'ring-cyan-500/30' },
  violet:  { bar: 'from-violet-400 to-purple-400',    badge: 'bg-violet-500/20 text-violet-300',    border: 'border-violet-500/20',  bg: 'bg-violet-500/5',  ring: 'ring-violet-500/30' },
}
