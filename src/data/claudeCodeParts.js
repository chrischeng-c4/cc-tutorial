export const PARTS = [
  { number: 1,  path: '/coding-agent/1',  part: 'Part 1',  title: 'Claude Code + Codex 是什麼',       time: '5 min',  accent: 'sky',     usage: '核心同步', audience: '共通',             tags: ['基礎'] },
  { number: 2,  path: '/coding-agent/2',  part: 'Part 2',  title: '它怎麼想：agentic loop',           time: '5 min',  accent: 'indigo',  usage: '核心同步', audience: '共通',             tags: ['基礎'] },
  { number: 3,  path: '/coding-agent/3',  part: 'Part 3',  title: '文件工作：PRD 可以怎麼輔助',       time: '5 min',  accent: 'rose',    usage: '文件案例', audience: '偏 PM',            tags: ['文件', '中階'], demoCases: ['04', '13'] },
  { number: 4,  path: '/coding-agent/4',  part: 'Part 4',  title: '第一次產 PRD 骨架',                time: '10 min', accent: 'pink',    usage: '文件案例', audience: '偏 PM',            tags: ['文件', '操作'], demoCases: ['04', '13'] },
  { number: 5,  path: '/coding-agent/5',  part: 'Part 5',  title: '規則檔、格式工具與迭代',            time: '8 min',  accent: 'fuchsia', usage: '文件案例', audience: '偏 PM',            tags: ['模板', '操作'], demoCases: ['04', '13'] },
  { number: 6,  path: '/coding-agent/6',  part: 'Part 6',  title: '限制、成本與 HITL',                time: '5 min',  accent: 'purple',  usage: '文件案例', audience: '共通',             tags: ['限制', '成本'] },
  { number: 7,  path: '/coding-agent/7',  part: 'Part 7',  title: '兩套工具上手',                     time: '10 min', accent: 'amber',   usage: '核心同步', audience: '共通',             tags: ['工具', '操作'] },
  { number: 8,  path: '/coding-agent/8',  part: 'Part 8',  title: 'Token 與 context 經濟學',           time: '12 min', accent: 'orange',  usage: '核心同步', audience: '共通',             tags: ['成本'] },
  { number: 9,  path: '/coding-agent/9',  part: 'Part 9',  title: 'Permission · Approval · Hooks',    time: '8 min',  accent: 'emerald', usage: '核心同步', audience: '共通',             tags: ['權限', '安全'] },
  { number: 10, path: '/coding-agent/10', part: 'Part 10', title: 'CLI vs MCP · Skill',               time: '10 min', accent: 'emerald', usage: '進階參考', audience: '偏 Engineering',   tags: ['工具', '進階'], demoCases: ['02', '05', '06', '10'] },
  { number: 11, path: '/coding-agent/11', part: 'Part 11', title: '委派：Subagent / Cloud Task',      time: '8 min',  accent: 'cyan',    usage: '進階參考', audience: '偏 Engineering',   tags: ['進階', '分工'] },
  { number: 12, path: '/coding-agent/12', part: 'Part 12', title: '平行協作：Agent Team / Codex',     time: '8 min',  accent: 'cyan',    usage: '進階參考', audience: '偏 Engineering',   tags: ['進階', '平行'], experimental: true },
  { number: 13, path: '/coding-agent/13', part: 'Part 13', title: 'Demo 流程 + 常見坑',               time: '8 min',  accent: 'violet',  usage: '進階參考', audience: '共通',             tags: ['案例', '收斂'] },
  { number: 14, path: '/coding-agent/14', part: 'Part 14', title: 'Repo 給 LLM 讀：llms.txt · SDD · CDD', time: '10 min', accent: 'orange', usage: '進階參考', audience: '偏 Engineering', tags: ['Repo', 'Context'], demoCases: ['12', '13'] },
  { number: 15, path: '/coding-agent/15', part: 'Part 15', title: 'Programmatic 串接與 Review',       time: '10 min', accent: 'violet',  usage: '進階參考', audience: '偏 Engineering',   tags: ['Automation', 'Review'], demoCases: ['02', '05', '06', '10', '13'] },
]

export const LEARNING_PATH = [
  {
    title: '先建立操作底盤',
    desc: 'Workshop 前或同步閱讀；先理解 agent loop、工具、token/context 與權限邊界。',
    parts: [1, 2, 7, 8, 9],
  },
  {
    title: '再看文件工作案例',
    desc: '用 PRD 當範例練 scope、context、HITL 與 review，不代表課程只給 PM。',
    parts: [3, 4, 5, 6],
  },
  {
    title: '最後依情境選讀',
    desc: '進階工具、委派、repo context、programmatic review 與 demo 收斂。',
    parts: [10, 11, 12, 13, 14, 15],
  },
]

export const USAGE_STYLES = {
  核心同步: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  文件案例: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
  進階參考: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
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
