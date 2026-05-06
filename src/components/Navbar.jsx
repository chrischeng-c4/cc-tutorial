import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const links = [
  { to: '/workshop', label: '課程安排', match: path => path === '/workshop' },
  { to: '/coding-agent', label: '工具教材', match: path => path === '/coding-agent' || path === '/claude-code' || /^\/(coding-agent|claude-code)\/\d+$/.test(path) },
  { to: '/demo-checklist', label: 'Demo 清單', match: path => path === '/demo-checklist' },
  { to: '/pre-quiz', label: '課前測驗', match: path => path === '/pre-quiz' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const linkClass = (active) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all no-underline ${
      active
        ? 'bg-violet-600/20 text-violet-200 border border-violet-500/30'
        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
    }`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#0a0a0f]/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-3 no-underline" onClick={() => setOpen(false)}>
          <span className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-400/30 text-violet-200 text-xs font-black flex items-center justify-center">
            CC
          </span>
          <span className="font-bold text-white text-base sm:text-lg tracking-tight">Coding Agent 內部教學</span>
        </NavLink>
        <div className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/coding-agent'}
              className={({ isActive }) =>
                linkClass(isActive || links.find(link => link.to === to)?.match(location.pathname))
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
        <button
          type="button"
          aria-label="切換導覽選單"
          aria-expanded={open}
          onClick={() => setOpen(value => !value)}
          className="md:hidden w-10 h-10 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 flex items-center justify-center"
        >
          <span className="sr-only">選單</span>
          <span className="flex flex-col gap-1">
            <span className="block w-4 h-0.5 bg-current" />
            <span className="block w-4 h-0.5 bg-current" />
            <span className="block w-4 h-0.5 bg-current" />
          </span>
        </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 grid gap-1">
            {links.map(({ to, label, match }) => {
              const active = match(location.pathname)
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={() => `${linkClass(active)} block`}
                >
                  {label}
                </NavLink>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
