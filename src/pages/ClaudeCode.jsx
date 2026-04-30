import { Link } from 'react-router-dom'

function Section({ title, children }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-1 h-7 rounded-full bg-gradient-to-b from-violet-400 to-purple-400 inline-block" />
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

function CmdRow({ cmd, desc }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-white/5 last:border-0">
      <code className="text-violet-300 text-sm font-mono whitespace-nowrap flex-shrink-0 bg-violet-500/10 px-2 py-1 rounded">{cmd}</code>
      <span className="text-slate-400 text-sm leading-relaxed">{desc}</span>
    </div>
  )
}

export default function ClaudeCode() {
  return (
    <main className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium mb-6">
            工具實戰
          </div>
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">
            Claude Code<br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">AI 驅動的開發 CLI</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
            Anthropic 官方出品的命令列工具，讓 Claude 直接在你的終端機協助開發、理解程式碼、執行任務。
          </p>
        </div>

        {/* Install */}
        <Section title="安裝與啟動">
          <CodeBlock title="Terminal">
{`# 安裝（需要 Node.js 18+）
npm install -g @anthropic-ai/claude-code

# 啟動
claude

# 或在特定專案目錄啟動
cd ~/my-project && claude`}
          </CodeBlock>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-sm">
            <span className="text-amber-300 font-semibold">注意：</span>
            <span className="text-slate-400 ml-1">
              首次使用需要 Anthropic API Key，或透過 claude.ai 帳號登入（Max 方案）。
            </span>
          </div>
        </Section>

        {/* Core concepts */}
        <Section title="核心概念">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              {
                emoji: '📂',
                title: '專案感知',
                desc: 'Claude Code 會自動讀取當前目錄的檔案結構，理解你的專案脈絡，不需要手動貼程式碼。',
              },
              {
                emoji: '🔧',
                title: '工具呼叫',
                desc: '內建 Read、Edit、Bash、Write 等工具，Claude 可以直接讀寫檔案、執行指令、搜尋程式碼。',
              },
              {
                emoji: '🔄',
                title: '互動模式',
                desc: '支援多輪對話，你可以持續追問、修正、要求重做，Claude 會保留上下文記憶。',
              },
              {
                emoji: '🔒',
                title: '權限控制',
                desc: '敏感操作（如 git push、刪除檔案）會在執行前詢問確認，確保安全。',
              },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-2xl mb-3">{emoji}</div>
                <h3 className="text-white font-semibold mb-2 text-sm">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Slash commands */}
        <Section title="Slash 指令速查">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-1">
            <CmdRow cmd="/help" desc="顯示所有可用指令清單" />
            <CmdRow cmd="/clear" desc="清除目前對話記憶，重新開始" />
            <CmdRow cmd="/compact" desc="壓縮對話脈絡，節省 token 用量" />
            <CmdRow cmd="/cost" desc="顯示本次對話累積的 token 費用" />
            <CmdRow cmd="/config" desc="開啟設定檔，調整行為與權限" />
            <CmdRow cmd="/review" desc="啟動多 Agent 程式碼審查（Ultra Review）" />
            <CmdRow cmd="/init" desc="在當前專案建立 CLAUDE.md 設定檔" />
          </div>
        </Section>

        {/* Example workflow */}
        <Section title="實際使用場景">
          <div className="space-y-4">
            <CodeBlock title="場景 1：理解陌生程式碼">
{`# 進入一個不熟悉的專案
$ claude

> 幫我解釋這個 repo 的架構，主要的 entry point 在哪裡？

# Claude 會自動讀取檔案結構，給出清晰的說明`}
            </CodeBlock>
            <CodeBlock title="場景 2：修 Bug">
{`> 執行 npm test 後有個測試失敗了，幫我找出原因並修復

# Claude 會：
# 1. 執行 npm test 查看錯誤
# 2. 讀取相關原始碼
# 3. 定位問題
# 4. 直接修改檔案
# 5. 再次執行測試確認`}
            </CodeBlock>
            <CodeBlock title="場景 3：新增功能">
{`> 幫我在 users API 新增一個 GET /users/:id/profile 端點，
> 需要驗證 JWT token，回傳用戶的基本資料

# Claude 會：
# 1. 讀取現有 API 結構
# 2. 理解使用的框架和慣例
# 3. 新增 route、controller、middleware
# 4. 確保風格與現有程式碼一致`}
            </CodeBlock>
          </div>
        </Section>

        {/* CLAUDE.md */}
        <Section title="CLAUDE.md：專案設定檔">
          <p className="text-slate-400 leading-relaxed mb-4">
            在專案根目錄建立 <code className="text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded text-sm">CLAUDE.md</code>，
            讓 Claude Code 了解你的專案規範、指令、注意事項。
          </p>
          <CodeBlock title="CLAUDE.md 範例">
{`# 專案說明
這是一個 Next.js + TypeScript 的電商平台後台。

# 開發指令
- npm run dev：啟動開發伺服器
- npm test：執行測試
- npm run build：打包

# 程式碼規範
- 使用 TypeScript strict mode
- API 回傳統一用 { data, error } 格式
- 不要在 PR 中加入 console.log

# 注意事項
- 資料庫 migration 需要先建立備份
- 不要直接修改 production 環境的設定`}
          </CodeBlock>
        </Section>

        {/* Next */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10">
          <Link to="/agent" className="text-slate-400 hover:text-white transition-colors no-underline text-sm">
            ← Agent 概念
          </Link>
          <Link to="/" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium transition-all no-underline text-sm">
            回到首頁
          </Link>
        </div>
      </div>
    </main>
  )
}
