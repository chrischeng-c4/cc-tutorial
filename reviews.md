# 課程內容 Review

審閱日期：2026-05-05

整體架構是扎實的，核心哲學（HITL、context as working memory、facts vs assumptions 分離、先 plan 再 edit）貫穿全程且一致。Token 經濟學被當成全員知識（非工程師專屬）是好的判斷。

---

## 問題一：補充教材章節順序有邏輯跳躍（優先級：高）

現況：

```
Part 1-2: 工具定位、Agentic Loop
Part 3-5: PRD 工作流（PM use case）   ← 出現太早
Part 6:   限制、成本、HITL
Part 7:   兩套工具上手（安裝、指令）  ← 應比 Part 3-5 先出現
Part 8-9: Token 經濟學、Permission    ← 應比 Part 3-5 先出現
```

學員照順序讀，第 3 章就進 PRD 操作，但此時還不知道怎麼安裝工具、不知道 token 成本結構、也不知道 permission 怎麼設。

建議順序調整：

```
Part 1-2: 不動
Part 3:   ← 移入原 Part 7「兩套工具上手」
Part 4:   ← 移入原 Part 8「Token/context 經濟學」
Part 5:   ← 移入原 Part 9「Permission + Hooks」
Part 6-8: ← 原 Part 3-5 PRD 工作流
```

---

## 問題二：「不分角色」定位與實際內容有落差（優先級：中）

- Part 3-5（3 章 PRD 寫作）事實上是 PM 導向
- Part 14-15（Repo 給 LLM 讀、Programmatic 串接）是工程 lead 導向
- 但首頁和課程說明都強調「不走角色分流」

建議：在 index 頁面或每個 chapter 開頭加 badge，明確標記 `共通` / `偏 PM` / `偏 Engineering`，讓學員知道哪些是核心必讀、哪些是選讀。

---

## 問題三：補充教材與 Workshop 時程的關係不明確（優先級：高）

- 15 chapters 累計約 127 分鐘，Workshop 本身是 120 分鐘
- 沒有說明這些章節是「上課前預習」還是「上完課後的參考」
- 沒有標示哪些是核心必讀、哪些是選讀

建議：在 `/coding-agent` index 頁面加一段說明，例如：

> Part 1-9 是課程同步閱讀教材，建議 Workshop 前或進行中瀏覽；Part 10-15 是進階參考，依工作情境選讀。

---

## 問題四：Part 14（SDD/CDD）位置太後面（優先級：中）

Part 14「Repo 給 LLM 讀：llms.txt · SDD · CDD」是整套課程最有策略價值的章節之一，回答了「為什麼要費心管理 context？」這個核心問題，卻被放在 Part 14，大部分學員可能讀不到。

建議：將 Part 14 的核心框架前移到 Part 5-6 位置，在講 token 經濟學之前或同時建立這個心智模型。

---

## 問題五：Pre-Quiz 測的是課後知識（優先級：中）

目前 Pre-Quiz 題目包含：
- CLAUDE.md 放在哪個目錄（課程中才教）
- `/compact` vs `/clear` 的差別（Part 8 的內容）
- Permission model 細節（Part 9 的內容）

建議：加上說明文字，例如：

> 這份問答是課程後的自我檢驗，不會計分。你現在不會也沒關係，上完課再來看看想法是否改變。

---

## 問題六：Part 11-12 沒有標示難度（優先級：低）

Part 12 提到 Agent Team 是 experimental feature（需要 env var），但視覺呈現上和其他 part 沒有區別，初學者可能以為這是常規功能而被卡住。

建議：在 Part 11-12 加上明顯的「進階 / 實驗性」標籤。

---

## 問題七：Demo Case 與章節之間沒有交叉索引（優先級：低）

13 個 demo scenarios 和 15 個補充章節之間沒有明確的對應關係。例如 Part 3-5 的 PRD 工作流直接對應 Demo Case 13，但學員需要自行推斷。

建議：在相關章節末尾加「對應 Demo Case → Case 13」，或在 DemoChecklist 的每個 case 中標注「對應補充教材 Part X」。

---

## 優先級彙整

| # | 問題 | 優先級 |
|---|---|---|
| 1 | 章節順序：工具/成本應先於 use case | 高 |
| 3 | 補充教材與 Workshop 使用關係說明缺失 | 高 |
| 2 | Role badge（共通/PM/Engineering）缺失 | 中 |
| 4 | Part 14 SDD/CDD 位置太後面 | 中 |
| 5 | Pre-Quiz 說明意圖不清 | 中 |
| 6 | Part 11-12 進階標籤缺失 | 低 |
| 7 | Demo Case ↔ 章節交叉索引缺失 | 低 |
