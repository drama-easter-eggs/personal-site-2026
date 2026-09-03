# Mei-Ling Chen — Style Reference

> 米色紙上的安靜編輯系統。teal 三階負責結構，ochre 只負責動作，螢光筆負責論點。

**Theme:** light only（沒有深色模式，`theme-color` 是 `#f6f2e8`）

這份文件記錄的是**已經上線的實作**，不是提案。來源規範是 `docs/design-reference_v3.md`（MindMarket），
但那份是為插畫導向的品牌站寫的；這個站沒有插畫、內容是長文與研究敘事，所以有幾處刻意偏離，
每一處下面都寫了理由與實測數字。**規範與實作衝突時以這份文件為準**，因為這份是實際跑在瀏覽器裡、
用真實底色驗算過對比的版本。

實作只有三個檔案：`index.html`、`assets/css/style.css`、`assets/js/main.js`。
沒有框架、沒有 build step、沒有 CSS 前處理器。

---

## Tokens — Colors

CSS 變數名以實作為準（短名），右欄是 v3 規範裡的對應名稱。

| 變數 | 值 | v3 名稱 | 工作 |
|------|-----|---------|------|
| `--cream` | `#f6f2e8` | Cream Paper | 頁面畫布。全站底色，不用純白 |
| `--sand` | `#e3dcd0` | Sandstone | 交替區塊底（`.section--tint`）、ghost 按鈕 hover |
| `--white` | `#ffffff` | Pure White | 浮動導覽、服務卡片這類浮起來的表面 |
| `--ink` | `#2c2e2a` | Ink Black | 內文、標題、圖示、重線 |
| `--stone` | `#5f615d` | （偏離 Stone Gray） | 次要文字、說明文、eyebrow 中文 |
| `--hairline` | `#b7b0a2` | （偏離 Hairline Mist） | 分行線、tag 外框、低對比結構線 |
| `--teal` | `#5cb2a0` | Primary Teal | 螢光筆、按鈕圓點、logo、編號、`+` 號。**只做線與小面積** |
| `--teal-deep` | `#2e9a82` | Deep Teal | 唯一的大面積填色：Contact 收尾帶。上面放白字 |
| `--teal-tint` | `#d3e6df` | Teal Tint | 唯一的彩色閱讀面：電子報卡片 |
| `--ochre` | `#e9c64e` | Ochre | 動作色。實心 CTA、Contact 帶上 email 底線 |
| `--ochre-tint` | `#f8eec9` | Ochre Tint | 全頁一塊 highlight block（02 的引言） |

### 兩處偏離規範，都是對比問題

- **`--stone` 不用規範的 `#80827f`。** 那個灰在 Sandstone 上只有 2.85:1、在 cream 上 3.47:1，讀不了。
  壓深到 `#5f615d` 之後，cream 5.6、sandstone 4.6、white 6.26、teal-tint 4.82，四個底色全部過 AA。
  全站次要文字都吃這一個變數，改配色時要用**實際底色**重算，不要照抄規範裡的灰。
- **`--hairline` 不用規範的 `#d5d5d4`。** 那是冷灰，在 Sandstone 上 1.08:1 等於看不見。
  改成同一個暖色系並壓深成 `#b7b0a2`（cream 1.93、sandstone 1.58）。
  這裡的判斷是**改線不改底**——Sandstone 是唯一撐起交替區塊節奏的東西，調淺它等於取消那個節奏，
  而且修不到 cream 區塊上的線；細線在這個版型是結構（案例、經歷、talks、lenses、fit list、tag 都靠它分行），不是裝飾。

### 用色比例

| 群組 | 佔比 | 說明 |
|------|------|------|
| cream / sandstone / white | ~70% | 紙做結構工作 |
| ink 文字與線 | ~10% | |
| teal 三階 | ~15% | 結構、螢光筆，加一條收尾色帶 |
| ochre + ochre-tint | ~5% | 只有動作 |

### ochre 的三個落點（全站就這三處）

1. 06「開始一段對話」實心 CTA — 全站唯一一顆實心按鈕，ink on ochre 8.26:1
2. 02 引言的 ochre-tint 色塊 — 全頁唯一的 highlight block
3. Contact 帶上 email 的底線 — Deep Teal 帶上唯一的暖色標記

導入 ochre 時做的三個判斷，規範沒寫：

- **tag 外框刻意不染黃。** 規範允許 ochre 當 tag 外框，但案例與經歷的 tag 有十幾顆，
  染黃等於把「這裡要動作」的訊號稀釋掉。tag 是分類資訊不是動作，留在 `--hairline`。
- **ochre-tint 只能做大色塊。** `#f8eec9` 對 cream 的明度差只有 1.04:1——靠色相不靠明度。
  做成大面積引言色塊看得出來，拿去畫線、做小 chip 或當描邊會直接消失。全頁只用一塊。
- **email 底線 3px 不是 2px。** ochre 對 deep teal 只有 2.09:1，2px 在那條帶上撐不住。

### 組合規則

- 一個元件只吃一個色相。引言色塊是 ochre-tint 就不再加 teal 直線；卡片有 teal 描邊就不放實心 CTA
- 一個畫面裡 Deep Teal 填色與 ochre 填色各最多出現一次
- 內文只落在 cream / white / sandstone / teal-tint 上，不落在 ochre-tint 以外的彩色上
- 不用顏色表達成功／錯誤／警告。`fit__list` 的「適合／不適合」用 ink 與 hairline 的短線區分，不用紅綠
- 不要再引入第三個色相

---

## Tokens — Typography

### 兩支字體，一個層級系統

拉丁字 **Inter**，漢字 **Noto Sans TC**，全站只有這兩支。層級靠字重與字級落差（400 → 500 → 700 → 900），
不靠第二支字體。規範說「單一家族 Inter」，但 Inter 沒有漢字，所以這裡必然是兩支——重點是漢字端只有一支。

```css
--sans:   'Inter', 'Noto Sans TC', 'PingFang TC', 'Heiti TC', 'Microsoft JhengHei', sans-serif;
--latin:  'Inter', 'Helvetica Neue', Arial, sans-serif;   /* 純拉丁：編號、年份、email、eyebrow */
```

**全站不得出現明體。** 明體、宋體、細明體，任何位置都不行。三個要檢查的地方：

- 字體堆疊裡 `system-ui` / `ui-sans-serif` / `-apple-system` **絕對不能排在 Noto Sans TC 之前**。
  PingFang 會搶走所有漢字，而 Windows 上從這兩個通用字族遞補進來的常常就是新細明體
- `<html lang="zh-Hant-TW">` 要正確。標記錯誤時瀏覽器會用簡體或日文的預設字體遞補，明體從這裡進來
- Google Fonts 匯入的是 **Noto Sans TC**，不是 Noto Serif TC；400/500/700/900 四個字重要一起載，
  漏載會變成合成粗體，漢字會糊
- 漢字不用斜體。CJK 沒有真正的斜體字形，瀏覽器只會做傾斜變形

### 中文行高拉開

內文 17px / **1.95**，`letter-spacing: .015em`；≤720px 收到 16px / 1.9。
規範給的 1.5 是拉丁字的數字，漢字字面率高，1.5 會擠。
行長用 `max-width: 34em` 控制（約 34 個漢字），寫在 em 上所以會跟著字級縮放。

### Type Scale（實作值）

字級全部是 `clamp()`，下面列 min → max。

| 角色 | 字級 | 字重 | 行高 | 字距 |
|------|------|------|------|------|
| hero 拉丁大標 `.hero__en` | 48 → 124px | 500 | .93 | -.055em |
| hero 漢字題 `.hero__zh` | 21 → 40px | 900 | 1.5 | -.015em |
| Contact 大標 `.contact__head` | 30 → 68px | 900 | 1.38 | -.025em |
| email `.contact__mail` | 22 → 46px | 500 (latin) | — | -.035em |
| 數字 `.counters__n` | 38 → 68px | 500 (latin) | 1 | -.05em |
| 論點句 `.care__thesis` | 22 → 34px | 900 | 1.58 | -.012em |
| 案例提問 `.case__q` | 23 → 38px | 700 | 1.5 | -.012em |
| 區塊小標 `.sub` | 21 → 27px | 700 | 1.5 | — |
| 引言 `.pull` | 19 → 25px | 500 | 1.72 | -.005em |
| 小節標題 `h3 / h4` | 17 → 25px | 700 | 1.5–1.6 | — |
| 導言 `.lead` | 18 → 21px | 400 | 1.85 | — |
| 內文 | 16 → 17px | 400 | 1.9–1.95 | .015em |
| 說明文 / tag | 12.5 → 15px | 400 | 1.55–1.8 | — |
| eyebrow 拉丁 | 11px | 500 | 1.6 | .19em, uppercase |

拉丁大字用負字距，漢字大標只給很小的負值（-.012 ～ -.025em）——漢字字面本來就緊，收太多會黏。

---

## Tokens — Spacing & Shapes

**Base unit:** 4px　**Density:** comfortable（長文閱讀，留白偏寬）

| 變數 | 值 | 用途 |
|------|-----|------|
| `--page` | 1200px | 版心上限 |
| `--gutter-w` | 178px（≤1080px 收成 132px） | 左側 eyebrow 欄 |
| `--gutter-gap` | clamp(28, 4vw, 76) | 兩欄間距 |
| `--pad-x` | clamp(20, 5vw, 48) | 版心左右留白 |
| `--section-y` | clamp(84, 11vw, 156) | 區塊上下留白 |
| `--r` | 50px | 卡片、按鈕、導覽、tag、引言色塊 |
| `--r-sm` | 12px | skip link 這類小元件 |

圓角在 ≤720px 一律收到 34px（`.card` / `.sub-card` / `.pull`），行動版手機寬度下 50px 會吃掉太多內距。
不要用 0–4px 的直角——這套系統的柔軟度靠大圓角，收掉就變成另一套系統。

---

## Layout

版型是**兩欄**：左邊 178px 的 eyebrow 欄，右邊內容欄（`max-width: 800px`，內文再收到 34em）。

- eyebrow 是 `position: sticky`（top: 116px），捲動時停在畫面上，所以任何時候都知道自己在哪一節
- ≤900px 兩欄併成一欄，eyebrow 變成一行「英文標籤＋中文標籤」水平排列
- 區塊底色交替：cream → cream → sandstone → cream → sandstone …（`.section--tint`）。
  這個交替是唯一的區塊節奏，不要用線或標題大小取代
- 沒有側邊欄、沒有三欄圖示卡、沒有價目表。閱讀動線是單欄由上往下
- 頁面順序：浮動導覽 → 01 Hero → 02 我關心什麼 → 03 精選案例 → 04 關於我 →
  05 什麼情況適合找我 → 06 一起工作 → 07 我的觀點 → 08 Contact 收尾帶 → footer

---

## Surfaces & Elevation

| 層級 | 名稱 | 值 | 用途 |
|------|------|-----|------|
| 0 | cream | `#f6f2e8` | 頁面畫布 |
| 1 | sandstone | `#e3dcd0` | 交替區塊 |
| 2 | white | `#ffffff` | 卡片、浮動導覽 |
| 3 | teal-tint | `#d3e6df` | 電子報卡片 |
| 3 | ochre-tint | `#f8eec9` | 引言色塊 |
| — | teal-deep | `#2e9a82` | Contact 收尾帶 |

**不使用陰影與漸層。** 層次全部由表面明度階梯與大圓角承擔，維持印刷般的平面感。
白卡片不要放在白底上——它靠的是白對 cream 的明度差浮起來。

---

## 簽名元素：螢光筆標記

整套系統辨識度最高的裝置，對應 Mei 讀逐字稿劃重點的實際工作方式。效力來自稀有度。

```html
<mark class="mark" data-mark>要畫線的字</mark>
<mark class="mark mark--b" data-mark>另一種筆觸</mark>
```

- 兩個手繪 SVG 筆觸（`.mark` / `.mark--b`），交錯使用，重複時才不會看起來一模一樣
- 顏色是 `--teal`，**不是 ochre**。它一頁出現八次，換成動作色等於讓 ochre 鋪滿整頁
- 一個區塊最多一處，畫在四到十字的**片語**上，不畫整句。畫整句會變成「這段很重要」，太鈍
- 捲到畫面上時由左往右畫出來（`background-size: 0% → 100%`，.75s，IntersectionObserver threshold .6）
- 開啟「減少動態效果」時直接顯示，不動畫

---

## Components

### Floating Pill Navigation
`--white` 底、50px 圓角，`position: fixed` 浮在畫布上，左右留 `--pad-x`。
品牌標是 22px 圓角方塊（teal 底＋ink 橫線）＋ 15px/500 拉丁字。
連結 14px/500，hover 鋪 cream。右端是 ghost CTA「聊聊」。
≤900px 連結收進漢堡選單：40px teal 圓鈕，展開成白色圓角面板，
`aria-expanded` / `aria-label` 由 JS 同步，Esc 與點外面都會關。

### Buttons
一律膠囊形（50px）、15px/500、hover 上移 1px。

- **ghost**（`.btn--ghost`）：cream 底、ink 字、右端一顆 9px teal 圓點作為可點性提示。hover 轉 sandstone。
  在 teal-tint 卡片上改用白底（cream 在那個底色上不夠分）
- **ochre**（`.btn--ochre`）：ochre 底、ink 字、ink 圓點。**全站只有一顆**，在 06 段末
- 沒有 Deep Teal 實心按鈕。Deep Teal 只做 Contact 那條帶——一個大面積色在一頁裡出現一次就夠

### Eyebrow（區塊標籤）
上排 11px 拉丁大寫、字距 .19em、ink 色，下面一條 hairline；下排 13px 中文、stone 色。sticky。

### Highlight Block（`.pull`）
ochre-tint 底、50px 圓角、內距 clamp(24–34) / clamp(26–38)。**兩行以內**，不放段落。
色塊自己就是強調，所以不再加 teal 直線。全頁一塊。

### 分行列表（cases / cv / teach / talks / lenses / fit）
沒有卡片，用 hairline 分行 + 左欄編號或年份的 grid。這是全站的主要內容形式。
左欄 74–148px，≤720px 併成單欄。編號用 `--latin` 或漢字數字，teal 色。

### Stat Block（`.counters`）
三欄，上緣一條 ink 實線，欄與欄之間 hairline。
數字 38–68px 拉丁 500，`+` 號是 teal；說明 13.5px stone。**捲動時不要做數字跳動的 counter 動畫。**

### Tag Pill
hairline 描邊、不填色、12.5px stone、膠囊形。分類資訊不是強調，所以不給顏色。

### Content Card（`.card`）
white 底、50px 圓角、無描邊無陰影，2 欄網格（≤720px 收成 1 欄）。
標題 19–24px/700，內文 16px，最後一行「怎麼做」用 hairline 上線分隔並轉 stone。

### Newsletter Card（`.sub-card`）
teal-tint 底、50px 圓角，左文右按鈕的橫向卡。唯一的彩色閱讀面。

### Contact Band
滿版 `--teal-deep`，白字，上下留白 clamp(76–140)。
大標 30–68px/900，email 22–46px 拉丁 500 配 3px ochre 底線，社群連結是白色描邊膠囊。
**不要改成亮色收尾**——整頁節奏是安靜的紙 → 一路的螢光筆重點 → 深色收合。

### Footer
cream 底，13px stone，左邊版權、右邊 `What moves people?`。年份由 JS 帶入。

---

## Motion

克制到幾乎看不見，全部走 `cubic-bezier(.22,.61,.36,1)`。

- Hero 載入：四個元素依序上浮 14px（.8s，delay .05/.13/.24/.34s）。**只有這一次入場動畫**
- 螢光筆：捲到就畫出來，一次性（`unobserve`）
- 按鈕 hover：上移 1px
- `prefers-reduced-motion: reduce` 時全部關掉，螢光筆直接顯示，`scroll-behavior` 轉 auto

---

## Accessibility

| 前景 / 背景 | 比值 | |
|---|---|---|
| ink / cream | 12.27 | ✅ |
| ink / sandstone | 10.07 | ✅ |
| ink / white | 13.71 | ✅ |
| ink / teal-tint | 10.55 | ✅ |
| ink / ochre-tint | 11.8 | ✅ |
| ink / ochre（CTA） | 8.26 | ✅ |
| stone / cream | 5.6 | ✅ |
| stone / sandstone | 4.6 | ✅ |
| stone / teal-tint | 4.82 | ✅ |
| white / teal-deep | 3.46 | ⚠️ 見下 |

其他已實作的項目：skip link、`:focus-visible` 2px ink 外框 offset 3px、
漢堡選單的 `aria-expanded` / `aria-controls` / 動態 `aria-label`、裝飾元素一律 `aria-hidden`。

### ⚠️ 待處理：Contact 帶上的白字

`#ffffff` 對 `#2e9a82` 只有 **3.46:1**。大標（30–68px/900）與 email 屬於 large text，過 AA（3:1）；
但 `.contact__body`（17–20px/500）與社群連結（14.5px）是一般文字，**沒有到 4.5:1**。
兩個選項：

1. 把帶子壓深到 `#27846f`（白字 4.55:1），色相不變，規範裡的 Deep Teal 角色也不變。改一個變數就好
2. 維持 `#2e9a82`，把那兩段文字放大到 24px 以上或加粗到 700 以上（會改變那一段的語氣）

建議 1。這跟 `--stone` / `--hairline` 是同一類判斷：規範給的值沒有在這個實際底色上驗算過。

---

## Do's and Don'ts

### Do
- 用 `#f6f2e8` 當頁面畫布，純白只留給卡片與導覽
- 卡片、按鈕、導覽一律 50px 圓角（≤720px 收 34px）
- 漢字內文行高 1.9–1.95，行長 34em 以內
- teal 只做線與小面積，大面積填色只有 Contact 那條帶
- ochre 只出現在要讀者動作的地方，一個畫面最多一次實心填色
- 螢光筆畫片語不畫整句，一個區塊最多一處
- 改任何顏色都用**實際底色**重算對比，不要照抄規範裡的數字

### Don't
- 不要引入第三個色相，也不要用顏色表達成功／錯誤／警告
- 不要把 ochre 拿去做區塊底色、頁尾色帶或內文底
- 不要用 ochre-tint 畫線、做 tag 或任何小面積——它對 cream 只有 1.04:1，會消失
- 不要在字體堆疊裡把 `system-ui` / `ui-sans-serif` / `-apple-system` 放在 Noto Sans TC 前面
- 不要出現明體、宋體、細明體，任何位置都不行；漢字也不用斜體
- 不要用陰影或漸層做層次
- 不要在一個元件裡混兩個色相
- 不要用直角（0–4px 圓角）
- 不要加常見的 AI 感裝置：全部置中對齊、三欄圖示卡、emoji 圖示、捲動時跳動的數字 counter

---

## 未決

- **子品牌（MEI Thinking、讀劇巧思）還沒分配視覺區隔。** 色票已經滿了，多加一個色相會破壞比例，
  比較可行的方向是用版面與字重區隔，不是加色
- **未填內容**見 README 的 TODO：案例 05、三場 talks、email、社群連結、Substack 訂閱網址
- Contact 帶的白字對比（見上）

---

## Agent Prompt Guide

**Quick Color Reference**

- text: `#2c2e2a`／muted `#5f615d`
- background: `#f6f2e8`（畫布）、`#e3dcd0`（交替區塊）
- surface: `#ffffff`（卡片、導覽）、`#d3e6df`（電子報卡）、`#f8eec9`（引言色塊）
- border: `#b7b0a2`（細線）、`#2c2e2a`（重線）
- accent: `#5cb2a0`（只做線與小面積）
- large area: `#2e9a82`（只有 Contact 收尾帶，白字）
- action: `#e9c64e`（全站一顆實心 CTA，ink 字 ink 圓點）

**Example Component Prompts**

1. *Hero：* cream 底。拉丁大標 Inter 500、clamp(48px, 9.1vw, 124px)、行高 .93、字距 -.055em；
   下面漢字題 Noto Sans TC 900、clamp(21px, 2.9vw, 40px)、行高 1.5，其中四到十字包 `<mark class="mark">`。
   右側 16px 說明文兩段。文字直接坐在畫布上，沒有卡片容器。
2. *Ghost 按鈕：* cream 底膠囊、50px 圓角、11px/20px 內距、15px/500 ink 字，右端 9px `#5cb2a0` 圓點。
3. *實心 CTA（全站一顆）：* `#e9c64e` 底、ink 字、右端 9px ink 圓點，其餘同上。
4. *引言色塊：* `#f8eec9` 底、50px 圓角、內距 24–34px / 26–38px、19–25px weight 500 ink 字、行高 1.72。兩行以內。
5. *分行列表：* 上下 hairline `#b7b0a2` 分行，左欄 74–148px 放編號或年份（13px、stone、拉丁），
   右欄標題 700 加一到兩段內文。沒有卡片、沒有陰影。
6. *Contact 收尾帶：* 滿版 `#2e9a82`，白字，大標 30–68px/900，email 22–46px 拉丁 500 配 3px `#e9c64e` 底線，
   社群連結是白色 55% 透明描邊的膠囊。

---

## Quick Start

實作的 `:root`（節錄，完整版見 `assets/css/style.css`）：

```css
:root {
  /* ink & paper */
  --cream:    #f6f2e8;
  --sand:     #e3dcd0;
  --white:    #ffffff;
  --ink:      #2c2e2a;
  --stone:    #5f615d;   /* 規範是 #80827f，對比不夠 */
  --hairline: #b7b0a2;   /* 規範是 #d5d5d4，冷灰且看不見 */

  /* teal — 結構 */
  --teal:      #5cb2a0;
  --teal-deep: #2e9a82;
  --teal-tint: #d3e6df;

  /* ochre — 動作 */
  --ochre:      #e9c64e;
  --ochre-tint: #f8eec9;

  /* type */
  --sans:    'Inter', 'Noto Sans TC', 'PingFang TC', 'Heiti TC', 'Microsoft JhengHei', sans-serif;
  --display: var(--sans);
  --latin:   'Inter', 'Helvetica Neue', Arial, sans-serif;

  /* rhythm */
  --page: 1200px;
  --gutter-w: 178px;
  --gutter-gap: clamp(28px, 4vw, 76px);
  --pad-x: clamp(20px, 5vw, 48px);
  --section-y: clamp(84px, 11vw, 156px);
  --r: 50px;
  --r-sm: 12px;
}
```

沒有 Tailwind 版本——這個站不使用 Tailwind，也沒有 build step。
