import { PageLayout, SectionHeader, Callout } from '../../components/cc/shared'

export default function Part2() {
  return (
    <PageLayout partIndex={1}>
      <SectionHeader partIndex={1} />

      <h3 className="text-white font-semibold mb-4 text-base">能做 vs 不能做</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="text-emerald-400 font-semibold text-sm mb-3 flex items-center gap-2">
            <span>✓</span> Claude Code 可以
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            {[
              '讀懂整個 repo 的結構與脈絡',
              '修 bug、新增功能、重構程式碼',
              '撰寫並執行測試',
              '操作 git（diff、commit、branch）',
              '批次修改大量檔案',
              '解釋任何一段不熟悉的程式碼',
              '根據現有 code 風格生成新程式碼',
            ].map(t => <div key={t} className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>{t}</div>)}
          </div>
        </div>
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
          <div className="text-red-400 font-semibold text-sm mb-3 flex items-center gap-2">
            <span>✗</span> 不適合 / 要注意
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            {[
              '替代 Dev 的架構設計判斷',
              '保證輸出 100% 正確（仍需 review）',
              '處理沒有文字描述的視覺設計',
              '自動 push 到 production',
              '永久記憶跨 session 的對話',
              '取代對業務邏輯的理解',
            ].map(t => <div key={t} className="flex items-start gap-2"><span className="text-red-500 mt-0.5 flex-shrink-0">•</span>{t}</div>)}
          </div>
        </div>
      </div>

      <h3 className="text-white font-semibold mb-4 text-base">Token 是什麼？費用怎麼估？</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-5">
        Token 是模型計費的基本單位。1 個英文單字 ≈ 1 token，1 個中文字 ≈ 1–2 tokens。
        費用取決於讓 Claude 讀了多少程式碼、輸出了多少內容。
      </p>
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { task: '解釋一個 function', cost: '~$0.001', level: 'low' },
          { task: '修一個中等 bug',    cost: '~$0.01–0.05', level: 'mid' },
          { task: '新增一個完整功能',  cost: '~$0.1–0.5', level: 'high' },
        ].map(({ task, cost, level }) => (
          <div key={task} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <div className={`text-lg font-bold mb-1 ${level === 'low' ? 'text-emerald-400' : level === 'mid' ? 'text-amber-400' : 'text-rose-400'}`}>{cost}</div>
            <div className="text-slate-400 text-xs leading-relaxed">{task}</div>
          </div>
        ))}
      </div>

      <Callout type="pm">
        對 PM 來說最重要的影響：Dev 的「理解成本」大幅降低。以前要花 2 小時看懂陌生 code 才能動手，現在 5 分鐘。任務可以拆更細，sprint 估點也需要重新校準。
      </Callout>

      <h3 className="text-white font-semibold mb-4 mt-8 text-base">工作流程的改變</h3>
      <div className="space-y-3 mb-10">
        {[
          { before: '需求文件寫完，等 Dev 看懂再動手', after: '需求可以直接貼給 Claude Code，它自己去看 code 再問問題' },
          { before: 'Code review 要花半天逐行看',      after: 'Claude Code 可以先做初步 review，提出具體問題點，人再確認' },
          { before: 'Bug 修完要等下一個 sprint',       after: '簡單 bug 可能 10 分鐘內有 PR，當天就能合併' },
          { before: '新人熟悉 repo 要幾週',            after: '把 repo 丟給 Claude Code，讓它解釋架構，大幅縮短 onboarding' },
        ].map(({ before, after }, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-slate-500 text-xs mb-1.5">以前</div>
              <div className="text-slate-400 leading-relaxed">{before}</div>
            </div>
            <div>
              <div className="text-emerald-400 text-xs mb-1.5">現在</div>
              <div className="text-slate-300 leading-relaxed">{after}</div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
