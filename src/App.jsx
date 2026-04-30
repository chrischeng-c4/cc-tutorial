import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LLMBasics from './pages/LLMBasics'
import ClaudeCode from './pages/ClaudeCode'
import AgentConcept from './pages/AgentConcept'
import PreQuiz from './pages/PreQuiz'

export default function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/llm" element={<LLMBasics />} />
        <Route path="/claude-code" element={<ClaudeCode />} />
        <Route path="/agent" element={<AgentConcept />} />
        <Route path="/pre-quiz" element={<PreQuiz />} />
      </Routes>
    </HashRouter>
  )
}
