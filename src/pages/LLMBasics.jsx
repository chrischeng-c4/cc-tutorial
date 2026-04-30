import { Link } from 'react-router-dom'

function Section({ title, children }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-400 to-cyan-400 inline-block" />
        {title}
      </h2>
      {children}
    </section>
  )
}

function InfoCard({ emoji, title, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{children}</p>
    </div>
  )
}

function CodeBlock({ children }) {
  return (
    <pre className="rounded-xl bg-[#0d0d1a] border border-white/10 p-5 text-sm text-emerald-300 font-mono overflow-x-auto leading-relaxed">
      {children}
    </pre>
  )
}

export default function LLMBasics() {
  return (
    <main className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6">
            入門必讀
          </div>
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">
            大型語言模型<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">LLM 基礎</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            了解 GPT、Claude、Gemini 背後的核心技術，從 Transformer 架構到現代 LLM 的訓練流程。
          </p>
        </div>

        {/* What is LLM */}
        <Section title="什麼是大型語言模型？">
          <p className="text-slate-400 leading-relaxed mb-6">
            大型語言模型（Large Language Model，LLM）是一種基於深度學習的 AI 模型，
            透過學習海量文字資料，習得對語言的理解與生成能力。
            簡單來說，它是一個「預測下一個詞」的系統，但規模極大、能力極強。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard emoji="📚" title="預訓練">
              在數兆個 token 的文字資料上，學習語言的統計規律與知識。
            </InfoCard>
            <InfoCard emoji="🎯" title="微調">
              透過 RLHF 等技術，讓模型對齊人類偏好，變得更有用且安全。
            </InfoCard>
            <InfoCard emoji="💬" title="推理">
              接收 Prompt，以 Autoregressive 方式逐 token 生成回應。
            </InfoCard>
          </div>
        </Section>

        {/* Transformer */}
        <Section title="Transformer 架構">
          <p className="text-slate-400 leading-relaxed mb-6">
            2017 年 Google 發表的論文《Attention Is All You Need》提出了 Transformer 架構，
            徹底革新了 NLP 領域。其核心機制是 <span className="text-white font-medium">Self-Attention</span>，
            讓模型能夠同時關注序列中所有位置的資訊。
          </p>
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 mb-6">
            <h3 className="text-white font-semibold mb-4">核心組成</h3>
            <div className="space-y-3">
              {[
                { name: 'Token Embedding', desc: '將文字切割成 token，映射為高維向量' },
                { name: 'Positional Encoding', desc: '加入位置資訊，讓模型理解詞序' },
                { name: 'Multi-Head Attention', desc: '從多個角度分析 token 之間的關係' },
                { name: 'Feed-Forward Network', desc: '對每個 token 獨立進行非線性變換' },
                { name: 'Layer Normalization', desc: '穩定訓練過程，加速收斂' },
              ].map(({ name, desc }) => (
                <div key={name} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium text-sm">{name}</span>
                    <span className="text-slate-400 text-sm"> — {desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Token */}
        <Section title="Token 是什麼？">
          <p className="text-slate-400 leading-relaxed mb-6">
            Token 是 LLM 處理文字的基本單位。不是字，也不完全是詞，而是介於兩者之間的子詞（subword）單元。
          </p>
          <CodeBlock>{`# 範例：tokenization
"Hello, world!" → ["Hello", ",", " world", "!"]  # 4 tokens

"你好世界"       → ["你好", "世界"]                # 2 tokens（中文壓縮較好）

# 為什麼重要？
# - 模型有 Context Window 限制（例如 200K tokens）
# - API 費用通常按 token 計費
# - 中文約 1.5~2 個字 ≈ 1 token`}</CodeBlock>
        </Section>

        {/* Key concepts */}
        <Section title="關鍵概念速查">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { term: 'Context Window', zh: '上下文視窗', desc: '模型一次能處理的最大 token 數量，決定記憶長度。' },
              { term: 'Temperature', zh: '溫度', desc: '控制輸出隨機性。0 = 確定性高，1+ = 更有創意。' },
              { term: 'Prompt Engineering', zh: '提示詞工程', desc: '設計輸入 Prompt 的技巧，影響輸出品質的關鍵。' },
              { term: 'Hallucination', zh: '幻覺', desc: '模型生成看似合理但實際錯誤資訊的現象。' },
              { term: 'Fine-tuning', zh: '微調', desc: '在預訓練模型上使用特定資料進一步訓練，強化特定能力。' },
              { term: 'RAG', zh: '檢索增強生成', desc: '結合向量搜尋，讓模型能引用外部知識庫回答問題。' },
            ].map(({ term, zh, desc }) => (
              <div key={term} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-start justify-between mb-2">
                  <code className="text-cyan-400 text-sm">{term}</code>
                  <span className="text-slate-500 text-xs">{zh}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Next */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors no-underline text-sm">
            ← 返回首頁
          </Link>
          <Link to="/agent" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all no-underline text-sm">
            下一章：Agent 概念 →
          </Link>
        </div>
      </div>
    </main>
  )
}
