import { Link } from 'react-router-dom'

function Section({ title, accent = 'emerald', children }) {
  const bar = {
    emerald: 'from-emerald-400 to-teal-400',
    amber: 'from-amber-400 to-orange-400',
    sky: 'from-sky-400 to-blue-400',
    violet: 'from-violet-400 to-purple-400',
  }[accent]
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className={`w-1 h-7 rounded-full bg-gradient-to-b ${bar} inline-block flex-shrink-0`} />
        {title}
      </h2>
      {children}
    </section>
  )
}

function CodeBlock({ title, children }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 mb-4">
      {title && (
        <div className="px-4 py-2 bg-white/[0.05] border-b border-white/10 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/70" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <span className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="text-slate-400 text-xs ml-2">{title}</span>
        </div>
      )}
      <pre className="bg-[#0d0d1a] p-5 text-sm text-emerald-300 font-mono overflow-x-auto leading-relaxed">
        {children}
      </pre>
    </div>
  )
}

function Callout({ type = 'info', children }) {
  const styles = {
    info: 'border-sky-500/30 bg-sky-500/5 text-sky-300',
    warn: 'border-amber-500/30 bg-amber-500/5 text-amber-300',
    tip: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
  }
  const icons = { info: 'ℹ️', warn: '⚠️', tip: '💡' }
  return (
    <div className={`rounded-xl border p-4 text-sm leading-relaxed mb-4 ${styles[type]}`}>
      <span className="mr-2">{icons[type]}</span>{children}
    </div>
  )
}

export default function AgentConcept() {
  return (
    <main className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium mb-6">
            中階 · 02
          </div>
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">
            Agent 概念<br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Prompt · Context · Harness</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            從 Prompt 工程到 Context 管理，再到 Harness 架構設計。
            這三層能力會影響 AI Agent 是否能穩定放進實際工作流程。
          </p>
        </div>

        {/* What is Agent */}
        <Section title="Agent 是什麼？">
          <p className="text-slate-400 leading-relaxed mb-6">
            Agent 不只是「更長的對話」，而是一個具備 <span className="text-white font-medium">感知 → 規劃 → 行動 → 觀察</span> 循環能力的系統。
            它可以使用工具、分解任務、根據結果調整下一步，但仍需要人定義邊界與確認結果。
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { icon: '👁️', label: '感知', desc: '讀取環境狀態、工具回傳、使用者輸入' },
              { icon: '🧩', label: '規劃', desc: '拆解目標、決定下一步行動' },
              { icon: '🔧', label: '行動', desc: '呼叫工具、執行程式、寫入資料' },
              { icon: '🔄', label: '觀察', desc: '評估結果，更新內部狀態' },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                <div className="text-3xl mb-2">{icon}</div>
                <div className="text-white font-semibold text-sm mb-1">{label}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── PROMPT ENGINEERING ── */}
        <Section title="Prompt 工程" accent="amber">
          <p className="text-slate-400 leading-relaxed mb-6">
            Prompt 是你與模型溝通的唯一介面。好的 Prompt 不是靠「魔法詞語」，
            而是給模型清晰的角色、目標、格式、限制。
          </p>

          <h3 className="text-white font-semibold mb-3 text-base">核心結構</h3>
          <CodeBlock title="基本 Prompt 架構">
{`# 1. 角色設定（System Prompt）
你是一位資深後端工程師，熟悉 Go 和分散式系統。
回答時請使用繁體中文，程式碼附上完整註解。

# 2. 目標明確化
請幫我設計一個支援 10 萬 QPS 的 rate limiter。
需求：
- 使用 Redis 作為儲存後端
- 支援 per-user 和 per-IP 兩種模式
- 需要回傳剩餘配額資訊

# 3. 輸出格式指定
請先說明設計思路，再給出完整實作程式碼。`}
          </CodeBlock>

          <h3 className="text-white font-semibold mb-3 mt-8 text-base">常用技巧</h3>
          <div className="space-y-3 mb-6">
            {[
              {
                name: '推理摘要 / 步驟化',
                badge: '推理',
                badgeColor: 'bg-amber-500/20 text-amber-300',
                desc: '要求模型先列可檢查的分析步驟、假設與證據，再給答案；不要要求它輸出完整內部思考。',
                example: '"請先列 bug 的可能原因、支持證據與排除方式，再給修復方案。"',
              },
              {
                name: 'Few-shot 示範',
                badge: '格式',
                badgeColor: 'bg-sky-500/20 text-sky-300',
                desc: '在 Prompt 中提供 2-5 個輸入輸出範例，讓模型學習你期望的格式與風格。',
                example: '"輸入：[用戶留言]\\n輸出：[情緒標籤]\\n\\n示例1：..."',
              },
              {
                name: 'Role + Constraint',
                badge: '限制',
                badgeColor: 'bg-emerald-500/20 text-emerald-300',
                desc: '明確說明模型「是誰」與「不能做什麼」，能大幅減少幻覺與離題輸出。',
                example: '"你只能根據以下文件回答，若資訊不足請說不知道。"',
              },
              {
                name: 'XML 結構化輸出',
                badge: '解析',
                badgeColor: 'bg-violet-500/20 text-violet-300',
                desc: '要求模型用 XML 或 JSON 格式回覆，方便程式解析，避免依賴正則表達式。',
                example: '"請用 <analysis> 和 <recommendation> 標籤包裝你的回答。"',
              },
            ].map(({ name, badge, badgeColor, desc, example }) => (
              <div key={name} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-semibold text-sm">{name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>{badge}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-2">{desc}</p>
                <code className="text-amber-300/80 text-xs bg-amber-500/5 border border-amber-500/10 rounded px-2 py-1 block">{example}</code>
              </div>
            ))}
          </div>

          <Callout type="tip">
            System Prompt 放「身份與規則」，User Prompt 放「具體任務」。不要把所有東西塞進一個巨大的 System Prompt，這樣模型難以追蹤重點。
          </Callout>
        </Section>

        {/* ── CONTEXT MANAGEMENT ── */}
        <Section title="Context 管理" accent="sky">
          <p className="text-slate-400 leading-relaxed mb-6">
            Context Window 是模型的「工作記憶」，有限且昂貴。
            Agent 架構中如何管理 context，直接影響品質、速度與成本。
          </p>

          <h3 className="text-white font-semibold mb-3 text-base">Context 的組成</h3>
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5 mb-6">
            <div className="space-y-2 text-sm">
              {[
                { label: 'System Prompt', size: '通常固定', color: 'bg-sky-400', width: 'w-1/6', desc: '角色設定、規則、工具清單' },
                { label: '對話歷史', size: '持續增長', color: 'bg-blue-400', width: 'w-2/6', desc: '過去的 user / assistant 訊息' },
                { label: '工具結果', size: '每次行動後新增', color: 'bg-indigo-400', width: 'w-2/6', desc: '搜尋結果、程式輸出、API 回應' },
                { label: '當前任務', size: '本輪輸入', color: 'bg-violet-400', width: 'w-1/6', desc: '使用者最新的指令' },
              ].map(({ label, size, color, width, desc }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`h-6 ${width} ${color} rounded opacity-70 flex-shrink-0`} />
                  <div>
                    <span className="text-white font-medium">{label}</span>
                    <span className="text-slate-500 ml-2 text-xs">({size})</span>
                    <span className="text-slate-400 ml-2">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-white font-semibold mb-3 text-base">常見管理策略</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              {
                icon: '✂️',
                title: 'Sliding Window',
                desc: '只保留最近 N 輪對話，超出的直接截斷。簡單但可能丟失重要早期資訊。',
              },
              {
                icon: '📋',
                title: 'Summary Compression',
                desc: '定期讓模型將舊對話壓縮成摘要，以摘要替換原始訊息節省 token。',
              },
              {
                icon: '🗄️',
                title: 'External Memory（RAG）',
                desc: '把長期知識存入向量資料庫，每次按需檢索相關片段注入 context。',
              },
              {
                icon: '🔖',
                title: 'Structured State',
                desc: '維護一個結構化的「任務狀態物件」（JSON），而不是依賴對話歷史推斷狀態。',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-white font-semibold text-sm mb-2">{title}</div>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <CodeBlock title="結構化狀態範例（Python）">
{`# 不要依賴對話歷史重建狀態，而是維護明確的狀態物件
state = {
    "goal": "分析 Q3 銷售數據並產出報告",
    "steps_completed": ["fetch_data", "clean_data"],
    "current_step": "analyze",
    "artifacts": {
        "raw_csv": "/tmp/q3_sales.csv",
        "cleaned_df": "...已處理 12,453 筆記錄..."
    },
    "findings": []
}

# 每輪只把相關狀態注入 context，不是完整歷史
prompt = f"""
當前任務狀態：{json.dumps(state, ensure_ascii=False)}
請繼續執行 {state['current_step']} 步驟。
"""`}
          </CodeBlock>

          <Callout type="warn">
            context 超出 window 限制時，模型不會報錯，而是靜默截斷最舊的內容。務必監控 token 用量，避免重要資訊被截掉。
          </Callout>
        </Section>

        {/* ── HARNESS ENGINEERING ── */}
        <Section title="Harness 架構設計" accent="violet">
          <p className="text-slate-400 leading-relaxed mb-6">
            Harness（框架/線束）是指包裹 LLM 呼叫的整個執行環境——工具定義、錯誤處理、
            重試機制、觀察性、安全邊界。好的 harness 讓 LLM 的能力可靠地運作在生產環境。
          </p>

          <h3 className="text-white font-semibold mb-3 text-base">ReAct 執行循環</h3>
          <CodeBlock title="Agent 主循環（偽代碼）">
{`async def run_agent(goal: str, tools: list, max_steps=10):
    messages = [{"role": "user", "content": goal}]

    for step in range(max_steps):
        response = await llm.call(
            system=SYSTEM_PROMPT,
            messages=messages,
            tools=tools
        )

        # 模型完成任務
        if response.stop_reason == "end_turn":
            return response.text

        # 模型要求呼叫工具
        if response.stop_reason == "tool_use":
            tool_results = []
            for tool_call in response.tool_calls:
                result = await execute_tool(tool_call)   # 帶逾時、錯誤處理
                tool_results.append(result)

            # 把工具結果追加到 context，繼續下一輪
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})

    raise MaxStepsExceeded(f"未在 {max_steps} 步內完成任務")`}
          </CodeBlock>

          <h3 className="text-white font-semibold mb-3 mt-8 text-base">生產環境關鍵設計</h3>
          <div className="space-y-3 mb-6">
            {[
              {
                icon: '🔒',
                title: '最小權限工具集',
                desc: '依任務動態組裝工具清單，不要把所有工具都塞給每個 Agent。工具越少，模型越不容易亂用。',
              },
              {
                icon: '⏱️',
                title: 'Timeout + 重試',
                desc: '每個工具呼叫必須有 timeout。暫時性失敗（網路錯誤、rate limit）自動重試，永久性錯誤（404、auth 失敗）立即中止。',
              },
              {
                icon: '👁️',
                title: 'Tracing / 可觀察性',
                desc: '記錄每次 LLM 呼叫的輸入輸出、工具呼叫、token 用量。沒有 trace 就無法除錯 Agent。',
              },
              {
                icon: '🧱',
                title: 'Guardrails',
                desc: '在工具執行前加入合法性檢查：路徑是否在允許範圍內？SQL 是否只讀？避免 Agent 意外修改生產資料。',
              },
              {
                icon: '🔀',
                title: 'Multi-Agent Orchestration',
                desc: 'Orchestrator 負責拆解任務、分配子任務給專門的 Subagent，最後整合結果。比單一超大 Agent 更易維護。',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div>
                  <div className="text-white font-semibold text-sm mb-1">{title}</div>
                  <div className="text-slate-400 text-sm leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-white font-semibold mb-3 text-base">多 Agent 架構示意</h3>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-lg bg-violet-500/20 border border-violet-500/30 px-6 py-3 text-center w-full max-w-xs">
                <div className="text-violet-300 font-semibold text-sm">Orchestrator</div>
                <div className="text-slate-400 text-xs mt-0.5">目標拆解 · 任務分配 · 結果整合</div>
              </div>
              <div className="flex items-center gap-2 text-slate-600 text-xs">
                <span>↙</span><span>↓</span><span>↘</span>
              </div>
              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  { name: 'Research Agent', icon: '🔍', desc: '搜尋 · 收集' },
                  { name: 'Code Agent', icon: '💻', desc: '撰寫 · 修改' },
                  { name: 'QA Agent', icon: '✅', desc: '測試 · 驗證' },
                ].map(({ name, icon, desc }) => (
                  <div key={name} className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                    <div className="text-xl mb-1">{icon}</div>
                    <div className="text-emerald-300 font-medium text-xs">{name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Nav */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10">
          <Link to="/llm" className="text-slate-400 hover:text-white transition-colors no-underline text-sm">
            ← LLM 基礎
          </Link>
          <Link to="/coding-agent" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all no-underline text-sm">
            下一章：工具教材 →
          </Link>
        </div>
      </div>
    </main>
  )
}
