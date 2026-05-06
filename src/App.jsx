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
        <Route path="/coding-agent/1"  element={<Part1 />} />
        <Route path="/coding-agent/2"  element={<Part2 />} />
        <Route path="/coding-agent/3"  element={<Part3 />} />
        <Route path="/coding-agent/4"  element={<Part4 />} />
        <Route path="/coding-agent/5"  element={<Part5 />} />
        <Route path="/coding-agent/6"  element={<Part6 />} />
        <Route path="/coding-agent/7"  element={<Part7 />} />
        <Route path="/coding-agent/8"  element={<Part8 />} />
        <Route path="/coding-agent/9"  element={<Part9 />} />
        <Route path="/coding-agent/10" element={<Part10 />} />
        <Route path="/coding-agent/11" element={<Part11 />} />
        <Route path="/coding-agent/12" element={<Part12 />} />
        <Route path="/coding-agent/13" element={<Part13 />} />
        <Route path="/coding-agent/14" element={<Part14 />} />
        <Route path="/coding-agent/15" element={<Part15 />} />
        <Route path="/claude-code/1"  element={<Part1 />} />
        <Route path="/claude-code/2"  element={<Part2 />} />
        <Route path="/claude-code/3"  element={<Part3 />} />
        <Route path="/claude-code/4"  element={<Part4 />} />
        <Route path="/claude-code/5"  element={<Part5 />} />
        <Route path="/claude-code/6"  element={<Part6 />} />
        <Route path="/claude-code/7"  element={<Part7 />} />
        <Route path="/claude-code/8"  element={<Part8 />} />
        <Route path="/claude-code/9"  element={<Part9 />} />
        <Route path="/claude-code/10" element={<Part10 />} />
        <Route path="/claude-code/11" element={<Part11 />} />
        <Route path="/claude-code/12" element={<Part12 />} />
        <Route path="/claude-code/13" element={<Part13 />} />
        <Route path="/claude-code/14" element={<Part14 />} />
        <Route path="/claude-code/15" element={<Part15 />} />
        <Route path="/pre-quiz"       element={<PreQuiz />} />
      </Routes>
    </HashRouter>
  )
}
