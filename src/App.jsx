import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LLMBasics from './pages/LLMBasics'
import AgentConcept from './pages/AgentConcept'
import PreQuiz from './pages/PreQuiz'
import ClaudeCodeIndex from './pages/claude-code/index'
import Part1 from './pages/claude-code/Part1'
import Part2 from './pages/claude-code/Part2'
import Part3 from './pages/claude-code/Part3'
import Part4 from './pages/claude-code/Part4'
import Part5 from './pages/claude-code/Part5'

export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/llm"           element={<LLMBasics />} />
        <Route path="/agent"         element={<AgentConcept />} />
        <Route path="/claude-code"   element={<ClaudeCodeIndex />} />
        <Route path="/claude-code/1" element={<Part1 />} />
        <Route path="/claude-code/2" element={<Part2 />} />
        <Route path="/claude-code/3" element={<Part3 />} />
        <Route path="/claude-code/4" element={<Part4 />} />
        <Route path="/claude-code/5" element={<Part5 />} />
        <Route path="/pre-quiz"      element={<PreQuiz />} />
      </Routes>
    </HashRouter>
  )
}
