import { PageLayout, SectionHeader, CodeBlock, Callout, H3 } from '../../components/cc/shared'

const cliContract = [
  { name: 'Args', desc: '用明確 flag 表達輸入，不要靠自然語言猜。' },
  { name: 'Stdout', desc: '給人看的摘要；長內容寫檔，避免污染 main thread。' },
  { name: 'Exit code', desc: '0 代表成功，非 0 讓 agent 停下來讀錯誤。' },
  { name: 'Output file', desc: '重要產出寫成 artifact，讓後續任務重用。' },
]

export default function Part17() {
  return (
    <PageLayout partIndex={11}>
      <SectionHeader partIndex={11} />

      <p className="text-slate-300 leading-relaxed mb-8">
        CLI 是人、agent、CI 都能共用的工具介面。Script 是一段可重跑流程；
        CLI 是這段流程對外的穩定入口。對 agent 來說，好 CLI 比長 prompt 更可靠：
        它有參數、有輸出、有 exit code，也能把重要結果寫成檔案。
      </p>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 mb-5">
        <div className="text-white text-sm font-semibold mb-3">Script 跟 CLI 差在哪</div>
        <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="text-slate-300 font-medium mb-2">Script 是流程本體</div>
            <p className="text-slate-300 leading-relaxed">它寫著「要怎麼做」：讀哪些資料、怎麼整理、怎麼檢查、產出什麼檔案。</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="text-slate-300 font-medium mb-2">CLI 是操作入口</div>
            <p className="text-slate-300 leading-relaxed">它定義「怎麼叫它做」：用什麼 command、帶哪些選項、成功失敗怎麼回報。</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="text-slate-300 font-medium mb-2">實務上常在一起</div>
            <p className="text-slate-300 leading-relaxed">很多 script 會包成 CLI；你不需要先懂程式，只要知道 agent 可以呼叫這個穩定入口。</p>
          </div>
        </div>
      </div>

      <H3>1. CLI 的契約</H3>
      <div className="grid grid-cols-1 gap-3 mb-5 md:grid-cols-4">
        {cliContract.map((item) => (
          <div key={item.name} className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="text-emerald-300 text-xs font-semibold uppercase tracking-wide mb-2">{item.name}</div>
            <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <H3>2. 讓 agent 好用的 CLI 形狀</H3>
      <CodeBlock title="CLI 設計範例">
{`# 好：可 dry-run，可寫 artifact，可 validate
project-weekly export --project SHOP --since 2026-05-01 --out tmp/source.json
project-weekly render tmp/source.json --out tmp/report.md
project-weekly validate tmp/report.md
project-weekly send tmp/report.md --dry-run --out tmp/send-preview.json

# 不好：一條 command 同時查資料、生成、發送、無法 review
project-weekly auto-send --project SHOP`}
      </CodeBlock>

      <H3>3. CLI first 不是反 MCP</H3>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">
        CLI first 的意思是：先用最透明、最可重跑的方式跑通流程。
        你可以用既有 CLI、公司內部工具、API script、export 檔先完成演練。
        等流程穩定且多人共用，再把同一套能力做成 MCP server。
      </p>
      <Callout type="warn">
        CLI first 也不是 auth-free。像 JIRA、Confluence、Google Workspace、Figma、SeaTalk 這類外部系統，
        CLI 通常還是要處理 OAuth、token、SSO、VPN 或 project scope。CLI 的優勢是這些失敗比較可見，
        也比較容易先停在 export 檔、dry-run payload 或本機 fixture。
      </Callout>
      <Callout type="tip">
        教學時 CLI 特別有價值，因為學員看得到每一步：輸入在哪、輸出在哪、哪一步需要 HITL。
        這會比現場 debug MCP 權限或 server 設定更容易理解。
      </Callout>
    </PageLayout>
  )
}
