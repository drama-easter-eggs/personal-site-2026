# 2026 個人官網

Mei 的個人網站 — 獨立研究者 / 體驗策略顧問。

## 執行

```bash
npm install
npm run dev      # 開發，http://localhost:4321
npm run build    # 產生靜態網站到 dist/
npm run preview  # 預覽 build 結果
```

`npm run build` 的輸出是純靜態檔案，可直接丟到 Netlify / Vercel / Cloudflare Pages。

## 結構

```
docs/                        參考文件（website-plan / content-architecture / design-reference）
src/
├── data/site.ts             ★ 所有文案與設定都在這裡，改內容只需要動這個檔
├── styles/global.css        設計 token 與共用 typography
├── layouts/Layout.astro     <head>、字型、scroll reveal
├── components/
│   ├── Nav.astro            靜態 masthead + 捲動後浮現的 pill nav
│   ├── Footer.astro
│   └── sections/            首頁 01–08，一個區段一個檔
└── pages/index.astro        把八個區段串起來
```

文案一律以 `docs/website-plan.md` 為準，`site.ts` 只做結構化，沒有改寫語意。

## 設計系統

改編自 `docs/design-reference_Burnt.md`：

- **色彩**：只有三色 — Ink `#1a1a17` / Paper `#ffffff` / Ash `#5f5f5d`，
  外加兩個推導出的中性色（暖白底色 `#f7f6f3`、細線 `#e4e2dc`）。不加任何彩色。
- **字型**：英文標題 Fraunces 300（Nyght Serif 是付費字型的替代品），
  中文一律 Noto Sans TC，內文用 Inter + Noto Sans TC。
- **圓角**：按鈕與 tag 是全圓 pill，卡片一律 6px。不用陰影，靠細線和留白分層。
- **中文字級是刻意偏離參考文件的**：Burnt 的標題是 62–72px，但中文字是全形全高，
  同樣尺寸會撞在一起。所以 `.zh` 標題有自己一套字級與行高（見 `global.css`），
  內文行高也拉到 1.9 而不是 1.5。

## 待補內容（TODO）

以下都在 `src/data/site.ts` 裡，填好就會自動出現在頁面上：

| 項目 | 位置 | 目前狀態 |
|---|---|---|
| 聯絡信箱 | `site.email` | `hello@example.com`，**上線前一定要換** |
| 正式網域 | `site.url` | `https://example.com`，影響 canonical / OG |
| 預約連結 | `site.bookingUrl` | 空的，填了才會出現「預約時間聊聊」按鈕 |
| Substack | `site.substackUrl` | 空的，目前顯示為「電子報連結待補」灰字 |
| FB / IG / Threads | `site.socials` | 網址都是空的，整區暫時不顯示 |
| Selected Work 05 | `works` 陣列末端 | 已註解，`website-plan.md` 註記「想要加一個公共服務相關」 |
| Selected Talks | `talks` | 三筆空白，`website-plan.md` 註記「整理三場」，有填才會渲染 |
| 大頭照 | `public/portrait.jpg` | 放進去就會自動取代 hero 右側的預設版面 |

另外：`website-plan.md` 05 區段第二點原文是「需要重新釐清問」（句尾缺字），
這裡補成「需要重新釐清問題」，如果原意不是這樣請直接改 `site.ts`。

## 之後要長內頁時

`docs/content-architecture.md` 定義了 Work 與 Writing 兩種 content model。
目前首頁的 `works` 是寫在 `site.ts` 的陣列，之後要加 `/work/[slug]` 與 `/writing`
時，把它搬到 Astro Content Collections（`src/content/`）即可，
資料形狀已經對齊那份文件裡的欄位。
