import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LLMBasics from './pages/LLMBasics'
import AgentConcept from './pages/AgentConcept'
import PreQuiz from './pages/PreQuiz'
import DemoChecklist from './pages/DemoChecklist'
import WorkshopPlan from './pages/WorkshopPlan'
import ClaudeCodeIndex from './pages/claude-code/index'
import Part1  from './pages/claude-code/Part1'
import Part2  from './pages/claude-code/Part2'
import Part3  from './pages/claude-code/Part3'
import Part4  from './pages/claude-code/Part4'
import Part5  from './pages/claude-code/Part5'
import Part6  from './pages/claude-code/Part6'
import Part7  from './pages/claude-code/Part7'
import Part8  from './pages/claude-code/Part8'
import Part9  from './pages/claude-code/Part9'
import Part10 from './pages/claude-code/Part10'
import Part11 from './pages/claude-code/Part11'
import Part12 from './pages/claude-code/Part12'
import Part13 from './pages/claude-code/Part13'
import Part14 from './pages/claude-code/Part14'
import Part15 from './pages/claude-code/Part15'
import { PARTS } from './data/claudeCodeParts'

const partComponents = [
  Part1,
  Part2,
  Part3,
  Part4,
  Part5,
  Part6,
  Part7,
  Part8,
  Part9,
  Part10,
  Part11,
  Part12,
  Part13,
  Part14,
  Part15,
]

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/llm"           element={<LLMBasics />} />
        <Route path="/agent"         element={<AgentConcept />} />
        <Route path="/workshop"      element={<WorkshopPlan />} />
        <Route path="/demo-checklist" element={<DemoChecklist />} />
        <Route path="/coding-agent"  element={<ClaudeCodeIndex />} />
        <Route path="/claude-code"   element={<ClaudeCodeIndex />} />
        {PARTS.map((part, index) => {
          const Component = partComponents[index]
          return <Route key={part.slug} path={`/coding-agent/${part.slug}`} element={<Component />} />
        })}
        {PARTS.map((part, index) => {
          const Component = partComponents[index]
          return <Route key={`claude-${part.slug}`} path={`/claude-code/${part.slug}`} element={<Component />} />
        })}
        {PARTS.map((_, index) => {
          const Component = partComponents[index]
          return <Route key={`legacy-coding-${index + 1}`} path={`/coding-agent/${index + 1}`} element={<Component />} />
        })}
        {PARTS.map((_, index) => {
          const Component = partComponents[index]
          return <Route key={`legacy-claude-${index + 1}`} path={`/claude-code/${index + 1}`} element={<Component />} />
        })}
        <Route path="/pre-quiz"       element={<PreQuiz />} />
      </Routes>
    </HashRouter>
  )
}
