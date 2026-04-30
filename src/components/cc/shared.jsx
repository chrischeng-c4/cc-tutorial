import { useState } from 'react'
import { Link } from 'react-router-dom'

export const PARTS = [
  { path: '/claude-code/1', part: 'Part 1', title: '破冰 + 定位',                     time: '10 min', accent: 'sky',     audience: ['PM', 'Dev'] },
  { path: '/claude-code/2', part: 'Part 2', title: 'PM 視角',                          time: '15 min', accent: 'rose',    audience: ['PM'] },
  { path: '/claude-code/3', part: 'Part 3', title: 'Dev 上手：基礎操作',               time: '15 min', accent: 'amber',   audience: ['Dev'] },
  { path: '/claude-code/4', part: 'Part 4', title: 'Dev 進階：Permission · Hooks · MCP', time: '15 min', accent: 'emerald', audience: ['Dev'] },
  { path: '/claude-code/5', part: 'Part 5', title: '實戰 Demo + 常見坑',               time: '5 min',  accent: 'violet',  audience: ['PM', 'Dev'] },
]

export const ACCENT = {
  sky:     { bar: 'from-sky-400 to-blue-400',       badge: 'bg-sky-500/20 text-sky-300',         border: 'border-sky-500/20',     bg: 'bg-sky-500/5',     ring: 'ring-sky-500/30' },
  rose:    { bar: 'from-rose-400 to-pink-400',       badge: 'bg-rose-500/20 text-rose-300',        border: 'border-rose-500/20',    bg: 'bg-rose-500/5',    ring: 'ring-rose-500/30' },
  amber:   { bar: 'from-amber-400 to-orange-400',    badge: 'bg-amber-500/20 text-amber-300',      border: 'border-amber-500/20',   bg: 'bg-amber-500/5',   ring: 'ring-amber-500/30' },
  emerald: { bar: 'from-emerald-400 to-teal-400',    badge: 'bg-emerald-500/20 text-emerald-300',  border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', ring: 'ring-emerald-500/30' },
  violet:  { bar: 'from-violet-400 to-purple-400',   badge: 'bg-violet-500/20 text-violet-300',    border: 'border-violet-500/20',  bg: 'bg-violet-500/5',  ring: 'ring-violet-500/30' },
}

/* ── Page wrapper with progress bar ── */
export function PageLayout({ partIndex, children }) {
  const current = PARTS[partIndex]
  const prev    = PARTS[partIndex - 1]
  const next    = PARTS[partIndex + 1]
  const c       = ACCENT[current.accent]

  return (
    <main className="pt-16 min-h-screen">
      {/* Progress strip */}
      <div className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-white/5">
        <div
          className={`h-full bg-gradient-to-r ${c.bar} transition-all`}
          style={{ width: `${((partIndex + 1) / PARTS.length) * 100}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-10">
          <Link to="/" className="hover:text-slate-300 no-underline transition-colors">首頁</Link>
          <span>/</span>
          <Link to="/claude-code" className="hover:text-slate-300 no-underline transition-colors">Claude Code</Link>
          <span>/</span>
          <span className="text-slate-400">{current.part}</span>
        </div>

        {children}

        {/* Bottom nav */}
        <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between gap-4">
          {prev ? (
            <Link to={prev.path} className="group flex items-center gap-3 no-underline min-w-0">
              <span className="text-slate-500 group-hover:text-white transition-colors text-lg">←</span>
              <div className="min-w-0">
                <div className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">{prev.part}</div>
                <div className="text-sm text-slate-400 group-hover:text-white transition-colors truncate">{prev.title}</div>
              </div>
            </Link>
          ) : (
            <Link to="/claude-code" className="group flex items-center gap-3 no-underline">
              <span className="text-slate-500 group-hover:text-white transition-colors text-lg">←</span>
              <div className="text-sm text-slate-400 group-hover:text-white transition-colors">課程總覽</div>
            </Link>
          )}

          {/* Dots */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {PARTS.map((p, i) => (
              <Link key={p.path} to={p.path} title={p.title}>
                <span className={`block rounded-full transition-all ${
                  i === partIndex
                    ? `w-6 h-2 bg-gradient-to-r ${c.bar}`
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`} />
              </Link>
            ))}
          </div>

          {next ? (
            <Link to={next.path} className="group flex items-center gap-3 no-underline text-right min-w-0">
              <div className="min-w-0">
                <div className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">{next.part}</div>
                <div className="text-sm text-slate-400 group-hover:text-white transition-colors truncate">{next.title}</div>
              </div>
              <span className="text-slate-500 group-hover:text-white transition-colors text-lg">→</span>
            </Link>
          ) : (
            <Link to="/" className="group flex items-center gap-3 no-underline">
              <div className="text-sm text-slate-400 group-hover:text-white transition-colors">回到首頁</div>
              <span className="text-slate-500 group-hover:text-white transition-colors text-lg">→</span>
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}

/* ── Section header ── */
export function SectionHeader({ partIndex }) {
  const p = PARTS[partIndex]
  const c = ACCENT[p.accent]
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-6 mb-10`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className={`w-1.5 h-12 rounded-full bg-gradient-to-b ${c.bar} inline-block flex-shrink-0`} />
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${c.badge}`}>{p.part}</span>
              <span className="text-slate-500 text-xs">{p.time}</span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight">{p.title}</h1>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {p.audience.map(a => (
            <span key={a} className="px-3 py-1 rounded-full text-xs border border-white/10 text-slate-400">{a}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Code block with copy ── */
export function CodeBlock({ title, children }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(String(children).trim())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 mb-5 group">
      {title && (
        <div className="px-4 py-2 bg-white/[0.05] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="text-slate-400 text-xs ml-2">{title}</span>
          </div>
          <button onClick={copy} className="text-xs text-slate-600 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100">
            {copied ? '已複製 ✓' : '複製'}
          </button>
        </div>
      )}
      <pre className="bg-[#0d0d1a] p-5 text-sm text-emerald-300 font-mono overflow-x-auto leading-relaxed">
        {children}
      </pre>
    </div>
  )
}

/* ── Callout box ── */
export function Callout({ type = 'info', children }) {
  const s = {
    info:  { style: 'border-sky-500/30 bg-sky-500/5',         icon: 'ℹ️', label: '說明' },
    warn:  { style: 'border-amber-500/30 bg-amber-500/5',      icon: '⚠️', label: '注意' },
    tip:   { style: 'border-emerald-500/30 bg-emerald-500/5',  icon: '💡', label: '技巧' },
    pm:    { style: 'border-pink-500/30 bg-pink-500/5',        icon: '📋', label: 'PM 視角' },
  }[type]
  return (
    <div className={`rounded-xl border p-4 text-sm leading-relaxed mb-5 ${s.style}`}>
      <span className="mr-2">{s.icon}</span>
      <span className="font-semibold text-white mr-2">{s.label}：</span>
      <span className="text-slate-300">{children}</span>
    </div>
  )
}

/* ── Command table ── */
export function CmdTable({ rows }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden mb-6">
      {rows.map(({ cmd, desc }, i) => (
        <div key={i} className="flex items-start gap-4 px-5 py-3 border-b border-white/5 last:border-0">
          <code className="text-violet-300 text-sm font-mono whitespace-nowrap flex-shrink-0 bg-violet-500/10 px-2 py-1 rounded">{cmd}</code>
          <span className="text-slate-400 text-sm leading-relaxed pt-0.5">{desc}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Permission badge ── */
export function PermBadge({ level }) {
  const s = {
    auto:    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    confirm: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    deny:    'bg-red-500/20 text-red-300 border-red-500/30',
  }[level]
  const label = { auto: '自動執行', confirm: '需要確認', deny: '預設拒絕' }[level]
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${s}`}>{label}</span>
}

/* ── H3 ── */
export function H3({ children }) {
  return <h3 className="text-white font-semibold mb-3 mt-8 text-base first:mt-0">{children}</h3>
}
