# 2026 個人官網 — 工作慣例

Astro 7 + Tailwind v4，純靜態輸出。詳細說明見 `README.md`。

## 內容來源的優先順序

1. `docs/website-plan.md` — 首頁文案與區段順序的唯一依據。**不要改寫、不要腦補、不要自行擴寫**。
   有缺漏的地方就標 TODO 留給作者填，不要生成替代文案。
2. `docs/content-architecture.md` — 長期內容架構（Work / Writing 兩種 model、三個 lens）。
   首頁 07 區段的三個 lens 文字取自這裡，也是原文照錄。
3. `docs/design-reference_Burnt.md` — 視覺方向。

## 改內容

文案全部集中在 `src/data/site.ts`。改字請動那個檔，不要直接寫死在 `.astro` 裡。

## 設計約束（來自 design-reference）

- 只用 Ink / Paper / Ash 三色 + 兩個推導中性色。**不要加彩色 accent**。
- 標題只用 Fraunces weight 300，不要加粗。
- 按鈕與 tag 一律全圓 pill，卡片一律 6px。
- 不用 drop shadow，分層靠細線與留白。

## 中文排版

`.zh` class 是給含中文的標題用的，有自己一套字級與行高 —
參考文件的 62–72px 是為拉丁字設計的，中文全形字套上去會爆版。
新增標題時記得掛 `.zh`。內文用 `.prose-zh`（行高 1.9）。
