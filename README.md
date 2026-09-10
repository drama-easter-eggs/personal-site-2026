# 個人官網 2026

純 HTML / CSS / 原生 JS，沒有框架、沒有 build step。

## 檔案

```
index.html            首頁（01–08 全部區塊）
assets/css/style.css  全站樣式
assets/js/main.js     螢光筆標記、scroll reveal、hero 問句輪播、案例翻卡與 modal、行動版選單、年份
assets/img/hero-figure.svg      hero 右側的手繪人物（原檔在 reference/hero.svg）
assets/img/about-portrait.jpg   我的經歷那一節的作者像（原檔在 reference/半身截圖.jpg）
assets/favicon.svg
docs/                 規劃與規範（不會部署）
  DESIGN.md             實作後的樣式規範，以這份為準
  design-reference_v3.md 外部視覺參考（MindMarket）
  website-plan.md        首頁文案與 section 順序
  content-architecture.md 長期內容邏輯與三個 lenses
reference/            外部素材原檔（不會部署）
  hero.svg              hero 那張插圖的原檔（未裁切、未改色）
  半身截圖.jpg           作者像的原檔（3998×4318；站上那張是 800×800 方裁）
  Loader cat.json       前一版 hero 那隻貓的 lottie 原檔，已不使用
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

最新易讀性調整：主要內文 17px、補充說明 16px、資訊標籤 15px，長段落上限 36em；窄／矮視窗的研究領域使用直列，首頁問句自動輪播。詳見 `docs/DESIGN.md` 的「桌面與手機易讀性優化」。

| 用途 | 值 |
| --- | --- |
| 頁面底色 | `#f6f2e8` 米色紙 |
| 內縮區塊底色 | `#e3dcd0` Sandstone（`.section--tint`） |
| 內文 | `#2c2e2a` |
| 次要文字 | `#5f615d`（v2 寫 `#80827f`，但那個灰在 Sandstone 上只有 2.85:1，讀不了） |
| 細線 | `#b7b0a2`（v2 寫 `#d5d5d4`，冷灰，在 Sandstone 上 1.08:1 等於看不見） |
| 重點色 | `#5cb2a0` Teal（螢光筆、結構線、按鈕圓點、logo）— 不做大面積填色 |
| 大面積色 | `#267563` Deep Teal（Contact 收尾帶）— 上面放白字 |
| 淺色底 | `#d3e6df` Teal Tint（電子報卡片這類閱讀面） |
| 動作色 | `#e9c64e` Ochre — 只用在要讀者動作的地方，一個畫面最多一顆實心 CTA |
| 拉丁字 | Inter 400 / 500 |
| 漢字 | Noto Sans TC — 單一家族，**不使用明體** |
| 漢字層級 | 內文 400 → 標題 700 → 大標 900 |

色彩是兩個色相：teal 三階負責結構，ochre 只負責動作，全頁佔比壓在 5–8%（tag 外框刻意不染黃，tag 不是動作）。沒有第三個彩色，也不用顏色表達成功／錯誤狀態。實作後的完整規範見 `docs/DESIGN.md`（含對比實測與偏離理由），外部視覺參考見 `docs/design-reference_v3.md`。

**簽名元素：螢光筆標記。** 在 HTML 裡把要標記的字包起來就好：

```html
<mark class="mark">要畫線的字</mark>
<mark class="mark mark--b">另一種筆觸</mark>
```

`mark--b` 是第二種手繪筆觸，交錯使用可以避免每一道線長得一模一樣。

**案例故事共有四張收藏卡。** 第一張「解碼 BL 與百合的情感經濟」為 featured card，
桌面橫跨一列，使用報告原插畫，另開分頁連至 https://bl-gl-unboxing.netlify.app/，不開 modal。
其餘三張為跨研究現場的 Research Stories：CONTENT × VALUE、DIGITAL × HUMAN、PUBLIC SERVICE × SYSTEM。正面呈現主題、原有 SVG 插圖、問句、簡短說明與 tags，插圖置於主題與問句之間；沿用米色紙張、細框與螢光筆標記，桌面並列、手機單欄。hover 時卡片輕抬，點擊經過翻面轉場打開原生 `<dialog>`。
展開依序呈現原先預設、研究現場、重新理解與核心結語，研究方法／產業／產出置底。三種圖解分別是付費理由關係圖、數位與真人服務匯流圖，以及公共服務層次圖；使用 HTML/CSS 與真實文字，窄螢幕轉直列，沒有新增動畫、照片、受訪者引言或數據。
案例內容只保留一份，由 JS 從 `<details>` 移入 dialog；不支援 dialog 或沒有 JS 時仍可原地展開。
Escape、背景或右上角圓形「×」都能關閉，焦點回到原卡片，背景閱讀位置保持不變。
每一則保留自己的網址（例如 `index.html#case-fandom`），直接進入會打開對應 modal。
尊重「減少動態效果」設定，停用翻面與 hover 位移。

**首頁有一處會把畫面停住（pin）的場。** 「研究走過的領域 → 精選案例」在
至少 75em × 48em（預設字級下為 1200 × 768px）、啟用 JavaScript 且允許動態時，
使用原本 `height: 500svh` 跑道與 `position: sticky` 舞台，捲動位置由 `main.js` 換算為 `--p`。
五個研究領域環形收斂後，中央結語與人物插圖出現；八個有機色紙需求依序浮現，
接著原位淡出需求、淡入對應策略，並將中央螢光筆重點由需求移至策略。反向捲動可還原。
窄／矮視窗、無 JS 或「減少動態效果」時保留規律對照表：完整版寬、兩欄四列，
720px 以下單欄，以細線分列，需求與策略同時可讀。結語與小幅插圖共用對照表的版心。

**整頁只換一次紙。**「什麼情況適合找我」那一節是唯一一片深色（`.section--ink`），
它代表敘事主體從「我」換成「你」，所以不能為了視覺變化再加第二片。
深底的層級色在 `.section--ink > .wrap` 一次換算完（`--ink` 變成 cream、
`--stone` 與 `--hairline` 變成 cream 的透明度階），所以裡面的元件不需要
各自寫一份深色樣式。

## 還沒補的內容（搜尋 `TODO` 可以找到）

1. `index.html` — Selected Work **案例 05**（公共服務相關），整塊已寫好註解起來，補完文案取消註解即可。
2. `index.html` — **Selected Talks & Slides** 三場講題，元件已備好註解起來。
3. `index.html` — **Substack 訂閱連結**（目前是 `#`）。
4. `index.html` — **Email**（目前是 `hello@example.com`，我沒有直接放上你的私人信箱）。
5. `index.html` — **Facebook / Instagram / Threads 連結**（目前是 `#`）。
6. `index.html` — `og:url` 與 `og:image`，等網域確定後再補。
7. `index.html` — 插圖：hero 那張與作者像都已就位，其餘還沒補的都已經拿掉版位，
   要加的時候再開一格，不留鷹架在頁面上。

Featured card 插畫來源：`https://bl-gl-unboxing.netlify.app/img/hero-sketch.webp?v=2`，本機存放於 `assets/img/cases/bl-gl-report.webp`。摘要與樣本數依完整報告內容。
