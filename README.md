# 個人官網 2026

純 HTML / CSS / 原生 JS，沒有框架、沒有 build step。

## 檔案

```
index.html            首頁（01–08 全部區塊）
assets/css/style.css  全站樣式
assets/js/main.js     螢光筆標記、行動版選單、年份
assets/favicon.svg
docs/                 文案與內容規劃（不會部署）
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
| 頁面底色 | `#f5f1e4` 米色紙 |
| 內文 | `#2c2e2a` |
| 次要文字 | `#80827f` |
| 主要重點色 | `#8ed462` 綠（螢光筆、結構線） |
| 行動色 | `#ff705d` 珊瑚（只用在 CTA） |
| 收尾色 | `#f5e211` 黃（只用在 Contact） |
| 拉丁字 | Inter 400 / 500 |
| 漢字 | Noto Sans TC — 單一家族，**不使用明體** |
| 漢字層級 | 內文 400 → 標題 700 → 大標 900 |

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
