import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ACCENT, AUDIENCE_STYLES, COURSE_PARTS, CURRICULUM_ORDER, PARTS, USAGE_STYLES } from '../../data/claudeCodeParts'

const partsBySlug = new Map(COURSE_PARTS.map(part => [part.slug, part]))
const curriculumParts = CURRICULUM_ORDER.map(slug => partsBySlug.get(slug)).filter(Boolean)

/* ── Page wrapper with progress bar ── */
export function PageLayout({ partIndex, partSlug, children }) {
  const navigate = useNavigate()
  const current = partSlug ? partsBySlug.get(partSlug) : PARTS[partIndex]
  const orderIndex = CURRICULUM_ORDER.indexOf(current.slug)
  const progressIndex = orderIndex >= 0 ? orderIndex : partIndex
  const orderedParts = curriculumParts.length ? curriculumParts : COURSE_PARTS
  const prev = orderIndex > 0 ? partsBySlug.get(CURRICULUM_ORDER[orderIndex - 1]) : null
  const next = orderIndex >= 0 && orderIndex < CURRICULUM_ORDER.length - 1
    ? partsBySlug.get(CURRICULUM_ORDER[orderIndex + 1])
    : null
  const c       = ACCENT[current.accent]

  useEffect(() => {
    function isTypingTarget(target) {
      if (!(target instanceof HTMLElement)) return false
      const tag = target.tagName.toLowerCase()
      return target.isContentEditable || ['input', 'textarea', 'select', 'button'].includes(tag)
    }

    function onKeyDown(event) {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || isTypingTarget(event.target)) {
        return
      }

      const prevKeys = ['ArrowLeft', 'PageUp', 'Backspace']
      const nextKeys = ['ArrowRight', 'PageDown', ' ', 'Enter']

      if (prevKeys.includes(event.key) && prev) {
        event.preventDefault()
        navigate(prev.path)
      }

      if (nextKeys.includes(event.key) && next) {
        event.preventDefault()
        navigate(next.path)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate, next, prev])

  return (
    <main className="pt-16 min-h-screen">
      {/* Progress strip */}
      <div className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-white/5">
        <div
          className={`h-full bg-gradient-to-r ${c.bar} transition-all`}
          style={{ width: `${((progressIndex + 1) / orderedParts.length) * 100}%` }}
        />
      </div>

      <div className="max-w-[110rem] mx-auto px-10 py-14">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-10">
          <Link to="/" className="hover:text-slate-300 no-underline transition-colors">首頁</Link>
          <span>/</span>
          <Link to="/coding-agent" className="hover:text-slate-300 no-underline transition-colors">Coding Agent</Link>
          <span>/</span>
          <span className="text-slate-400 font-mono">{current.slug}</span>
        </div>

        {children}

        {/* Bottom nav */}
        <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between gap-4">
          {prev ? (
            <Link to={prev.path} className="group flex items-center gap-3 no-underline min-w-0">
              <span className="text-slate-500 group-hover:text-white transition-colors text-lg">←</span>
              <div className="min-w-0">
                <div className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors font-mono">{prev.slug}</div>
                <div className="text-sm text-slate-300 group-hover:text-white transition-colors truncate">{prev.title}</div>
              </div>
            </Link>
          ) : (
            <Link to="/coding-agent" className="group flex items-center gap-3 no-underline">
              <span className="text-slate-500 group-hover:text-white transition-colors text-lg">←</span>
              <div className="text-sm text-slate-400 group-hover:text-white transition-colors">課程總覽</div>
            </Link>
          )}

          {/* Dots */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {orderedParts.map((p) => (
              <Link key={p.path} to={p.path} title={p.title}>
                <span className={`block rounded-full transition-all ${
                  p.slug === current.slug
                    ? `w-6 h-2 bg-gradient-to-r ${c.bar}`
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`} />
              </Link>
            ))}
          </div>

          {next ? (
            <Link to={next.path} className="group flex items-center gap-3 no-underline text-right min-w-0">
              <div className="min-w-0">
                <div className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors font-mono">{next.slug}</div>
                <div className="text-sm text-slate-300 group-hover:text-white transition-colors truncate">{next.title}</div>
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
export function SectionHeader({ partIndex, partSlug }) {
  const p = partSlug ? partsBySlug.get(partSlug) : PARTS[partIndex]
  const c = ACCENT[p.accent]
  const tags = p.tags ?? []
  const badges = [
    p.usage && { label: p.usage, className: USAGE_STYLES[p.usage] },
    p.audience && { label: p.audience, className: AUDIENCE_STYLES[p.audience] },
    p.experimental && { label: '實驗性', className: 'border-amber-500/25 bg-amber-500/10 text-amber-300' },
    ...tags.map(tag => ({ label: tag, className: 'border-white/10 text-slate-400' })),
  ].filter(Boolean)

  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-6 mb-10`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className={`w-1.5 h-12 rounded-full bg-gradient-to-b ${c.bar} inline-block flex-shrink-0`} />
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 rounded-full text-sm font-bold font-mono ${c.badge}`}>{p.slug}</span>
              <span className="text-slate-400 text-sm">{p.time}</span>
            </div>
            <h1 className="text-3xl font-black text-white leading-tight">{p.title}</h1>
            {p.demoCases?.length > 0 && (
              <Link
                to="/demo-checklist"
                className="mt-2 inline-flex text-sm text-slate-300 no-underline transition-colors hover:text-white"
              >
                對應 Demo Case → {p.demoCases.join(' · ')}
              </Link>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {badges.map(({ label, className }) => (
            <span key={label} className={`px-3 py-1 rounded-full text-sm border ${className}`}>{label}</span>
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
            <span className="text-slate-300 text-sm ml-2">{title}</span>
          </div>
          <button onClick={copy} className="text-sm text-slate-400 hover:text-white transition-colors">
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
    pm:    { style: 'border-pink-500/30 bg-pink-500/5',        icon: '📋', label: '文件工作' },
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
          <span className="text-slate-300 text-sm leading-relaxed pt-0.5">{desc}</span>
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

/* ── FullBleed: break out of main column up to 6xl ── */
export function FullBleed({ children, className = '' }) {
  return (
    <div className={`relative left-1/2 -translate-x-1/2 w-screen max-w-6xl px-6 mb-8 ${className}`}>
      {children}
    </div>
  )
}

function renderInlineMarkdown(text) {
  return String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-black/30 px-1 py-0.5 font-mono text-[0.9em] text-emerald-200">
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function flushMarkdownList(blocks, list) {
  if (!list.items.length) return
  const Tag = list.type === 'ol' ? 'ol' : 'ul'
  blocks.push(
    <Tag key={`list-${blocks.length}`} className={`${list.type === 'ol' ? 'list-decimal' : 'list-disc'} space-y-1 pl-5 text-slate-300`}>
      {list.items.map((item, i) => (
        <li key={i} className="pl-1 leading-relaxed">{renderInlineMarkdown(item)}</li>
      ))}
    </Tag>
  )
  list.items = []
  list.type = null
}

/* ── Minimal Markdown renderer for generated docs ── */
export function MarkdownContent({ children }) {
  const blocks = []
  const list = { type: null, items: [] }
  const lines = String(children).trim().split('\n')

  lines.forEach((line, i) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushMarkdownList(blocks, list)
      return
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/)
    if (heading) {
      flushMarkdownList(blocks, list)
      const level = heading[1].length
      const Tag = `h${Math.min(level + 2, 6)}`
      const size = level === 1 ? 'text-lg' : level === 2 ? 'text-base' : 'text-sm'
      blocks.push(
        <Tag key={`h-${i}`} className={`${size} mt-4 first:mt-0 mb-2 font-bold text-white`}>
          {renderInlineMarkdown(heading[2])}
        </Tag>
      )
      return
    }

    const checkbox = trimmed.match(/^[-*]\s+\[( |x)\]\s+(.+)$/i)
    if (checkbox) {
      flushMarkdownList(blocks, list)
      blocks.push(
        <label key={`check-${i}`} className="flex items-start gap-2 text-slate-300 leading-relaxed">
          <input type="checkbox" checked={checkbox[1].toLowerCase() === 'x'} readOnly className="mt-1 h-3.5 w-3.5 rounded border-white/20 bg-black/30" />
          <span>{renderInlineMarkdown(checkbox[2])}</span>
        </label>
      )
      return
    }

    const bullet = trimmed.match(/^[-*•]\s+(.+)$/)
    if (bullet) {
      if (list.type !== 'ul') flushMarkdownList(blocks, list)
      list.type = 'ul'
      list.items.push(bullet[1])
      return
    }

    const numbered = trimmed.match(/^\d+\.\s+(.+)$/)
    if (numbered) {
      if (list.type !== 'ol') flushMarkdownList(blocks, list)
      list.type = 'ol'
      list.items.push(numbered[1])
      return
    }

    flushMarkdownList(blocks, list)
    blocks.push(
      <p key={`p-${i}`} className="leading-relaxed text-slate-300">
        {renderInlineMarkdown(trimmed)}
      </p>
    )
  })

  flushMarkdownList(blocks, list)

  return <div className="space-y-3">{blocks}</div>
}

/* ── PromptResponse: side-by-side "PM says" vs "Claude returns" ── */
export function PromptResponse({ prompt, response, promptLabel = '你輸入', responseLabel = 'Claude 輸出', filename, renderResponseMarkdown = false }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="rounded-xl overflow-hidden border border-sky-500/20 bg-sky-500/5">
        <div className="px-4 py-2 bg-sky-500/10 border-b border-sky-500/20 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="text-sky-300 text-xs font-semibold uppercase tracking-wide">{promptLabel}</span>
        </div>
        <div className="p-4 text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">{prompt}</div>
      </div>
      <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-emerald-500/5">
        <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wide">{responseLabel}</span>
          </div>
          {filename && <span className="text-emerald-400/70 text-xs font-mono">{filename}</span>}
        </div>
        <div className="p-4 text-sm text-slate-300 leading-relaxed">
          {renderResponseMarkdown ? (
            <MarkdownContent>{response}</MarkdownContent>
          ) : (
            <div className="whitespace-pre-wrap">{response}</div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Diff: before / after side-by-side ── */
export function Diff({ before, after, beforeLabel = '迭代前', afterLabel = '迭代後' }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="rounded-xl overflow-hidden border border-rose-500/20 bg-rose-500/5">
        <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/20 flex items-center gap-2">
          <span className="text-rose-300 text-xs font-semibold uppercase tracking-wide">— {beforeLabel}</span>
        </div>
        <div className="p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{before}</div>
      </div>
      <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-emerald-500/5">
        <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2">
          <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wide">+ {afterLabel}</span>
        </div>
        <div className="p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{after}</div>
      </div>
    </div>
  )
}

/* ── Step list: numbered milestones with description ── */
export function Steps({ items }) {
  return (
    <ol className="mb-6 list-decimal space-y-3 pl-6 text-sm leading-relaxed text-slate-300 marker:font-bold marker:text-violet-300">
      {items.map(({ title, desc }, i) => (
        <li key={i} className="pl-1">
          <div className="font-semibold text-white">{title}</div>
          <div className="mt-1 text-slate-300">
            {desc}
          </div>
        </li>
      ))}
    </ol>
  )
}
