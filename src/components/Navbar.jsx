import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: '首頁' },
  { to: '/llm', label: 'LLM 基礎' },
  { to: '/agent', label: 'Agent 概念' },
  { to: '/claude-code', label: 'Claude Code' },
  { to: '/pre-quiz', label: '課前預習' },
]

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-md bg-[#0a0a0f]/80">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">🤖</span>
          <span className="font-bold text-white text-lg tracking-tight">AI 學習指南</span>
        </NavLink>
        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline ${
                  isActive
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
