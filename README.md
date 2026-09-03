# 個人官網 2026

純 HTML / CSS / 原生 JS，沒有框架、沒有 build step。

## 檔案

```
index.html            首頁（01–08 全部區塊）
assets/css/style.css  全站樣式
assets/js/main.js     螢光筆標記、行動版選單、年份
assets/favicon.svg
docs/                 規劃與規範（不會部署）
  DESIGN.md             實作後的樣式規範，以這份為準
  design-reference_v3.md 外部視覺參考（MindMarket）
  website-plan.md        首頁文案與 section 順序
  content-architecture.md 長期內容邏輯與三個 lenses
```

## 本機預覽

直接用瀏覽器打開 `index.html` 就可以，或：

```bash
python3 -m http.server 4000
```

然後開 http://localhost:4000

## 部署

任何靜態空間都可以：Netlify、Cloudflare Pages、GitHub Pages、Vercel。
不需要設定 build command，publish directory 填專案根目錄即可。

## 設計系統

| 用途 | 值 |
| --- | --- |
| 頁面底色 | `#f6f2e8` 米色紙 |
| 內縮區塊底色 | `#e3dcd0` Sandstone（`.section--tint`） |
| 內文 | `#2c2e2a` |
| 次要文字 | `#5f615d`（v2 寫 `#80827f`，但那個灰在 Sandstone 上只有 2.85:1，讀不了） |
| 細線 | `#b7b0a2`（v2 寫 `#d5d5d4`，冷灰，在 Sandstone 上 1.08:1 等於看不見） |
| 重點色 | `#5cb2a0` Teal（螢光筆、結構線、按鈕圓點、logo）— 不做大面積填色 |
| 大面積色 | `#2e9a82` Deep Teal（Contact 收尾帶）— 上面放白字 |
| 淺色底 | `#d3e6df` Teal Tint（電子報卡片這類閱讀面） |
| 動作色 | `#e9c64e` Ochre — 只用在要讀者動作的地方，一個畫面最多一顆實心 CTA |
| 強調底 | `#f8eec9` Ochre Tint — 全頁一塊（02 的引言），不放段落、不畫線 |
| 拉丁字 | Inter 400 / 500 |
| 漢字 | Noto Sans TC — 單一家族，**不使用明體** |
| 漢字層級 | 內文 400 → 標題 700 → 大標 900 |

色彩是兩個色相：teal 三階負責結構，ochre 只負責動作，全頁佔比壓在 5–8%（tag 外框刻意不染黃，tag 不是動作）。沒有第三個彩色，也不用顏色表達成功／錯誤狀態。實作後的完整規範見 `docs/DESIGN.md`（含對比實測與偏離理由），外部視覺參考見 `docs/design-reference_v3.md`。

**簽名元素：螢光筆標記。** 在 HTML 裡把要標記的字包起來就好：

```html
<mark class="mark" data-mark>要畫線的字</mark>
<mark class="mark mark--b" data-mark>另一種筆觸</mark>
```

`mark--b` 是第二種手繪筆觸，交錯使用可以避免每一道線長得一模一樣。
捲動到畫面上時會由左往右畫出來；使用者若開啟「減少動態效果」則直接顯示。

## 還沒補的內容（搜尋 `TODO` 可以找到）

1. `index.html` — Selected Work **案例 05**（公共服務相關），整塊已寫好註解起來，補完文案取消註解即可。
2. `index.html` — **Selected Talks & Slides** 三場講題，元件已備好註解起來。
3. `index.html` — **Substack 訂閱連結**（目前是 `#`）。
4. `index.html` — **Email**（目前是 `hello@example.com`，我沒有直接放上你的私人信箱）。
5. `index.html` — **Facebook / Instagram / Threads 連結**（目前是 `#`）。
6. `index.html` — `og:url` 與 `og:image`，等網域確定後再補。
