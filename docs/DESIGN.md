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

內文 18px / **1.95**，`letter-spacing: .02em`；≤720px 收到 17px（行高不變）。
規範給的 1.5 是拉丁字的數字，漢字字面率高，1.5 會擠。
行長用 `max-width: 34em` 控制（約 34 個漢字），寫在 em 上所以會跟著字級縮放。

### Type Scale（實作值）

**9 階，每一階都有 token。** `clamp()` 的欄位列 min → max（max 在視窗約 1300px 以上生效）。

只有兩處寫死 px，都是斷點微調而不是新的階：`.nav__links a` 在 ≤900px 的下拉選單放大到 17px
（觸控目標），`.nav__name` 在 ≤400px 收到 14px。內文在 ≤720px 降到 17px 是改 `--fs-body`
這個 token 本身，不是覆寫 `body`——這樣 `.hero__id`、`.about__note` 這些直接吃 token 的元素才會跟著降。

| Token | 角色 / class | 字級 | 字重 | 行高 | 字距 |
|-------|--------------|------|------|------|------|
| `--fs-hero` | hero 問句（兩行同級）`.hero__fixed` / `.hero__rotator` | 26 → 74px | 900 | 1.4 | .01em |
| `--fs-mega` | Contact 大標 `.contact__head`、數字 `.counters__n` | 30 → 62px | 900 / 500 (latin) | 1.45 / 1 | .01em / -.05em |
| `--fs-display` | 論點句 `.care__thesis`、案例提問 `.case__q`、email `.contact__mail` | 23 → 35px | 900 / 700 / 500 | 1.6 / 1.55 / — | .01em / -.035em (latin) |
| `--fs-sub` | 章節小標 `.sub`、引言色塊 `.pull` | 22 → 28px | 700 / 500 | 1.55 / 1.75 | — / .01em |
| `--fs-head` | 所有區塊與項目標題 `.threads h3` / `.card h3` / `.lens h3` / `.sub-card h3` / `.fit__head` / `.cv__what h4` / `.teach h4` / `.talk h4` | 21 → 25px | 700 | 1.55 | — |
| `--fs-body` | 內文 `body`、`.hero__id`、`.about__note`，以及導言 `.lead`、`.services__close`、`.contact__body`（繼承） | 18px（≤720px 降 17px） | 400 / 500 | 1.95 | .02em |
| `--fs-sm` | 次要段落、按鈕、nav `.btn` / `.card p` / `.hero__body` / `.nav__links a` | 16px | 400 / 500 | 1.95 | .02em |
| `--fs-meta` | 漢字小標、tag、年份、註記 | 14px | 400 / 500 | 1.45–1.7 | .02em |
| `--fs-micro` | eyebrow 拉丁全大寫 `.eyebrow > span` / `.lens__en` / `.sub-card__label` | 12px | 500 | — | .19em, uppercase |

三條硬規則：

1. **全部整數 px。** 分數 px（12.5 / 13.5 / 15.5）會讓漢字的橫豎筆在點陣上糊掉——拉丁字看不出來，漢字很明顯。
2. **漢字最小 14px。** 13px 以下開始掉筆畫。只有 `var(--latin)` 的全大寫小標可以更小（12px）。
3. **負字距只給 `var(--latin)` 的元素**——hero 英文、數字、email、nav 站名。漢字沒有左右側邊留白，負值會讓相鄰兩字的筆畫直接相黏，字重 900 的大標最明顯；漢字一律用 `--track-zh` (.02em) 或 `--track-zh-head` (.01em)。

#### 為什麼是 10 階（精簡的四刀）

原本桌機上會出現 14 個不同尺寸，擠在三個分不出來的區間：12/14/15/16、21/23/25、62/68/74。
2px 的差不是層級，是雜訊。刪掉的四個：

- **15px（nav）→ `--fs-sm` 16px。** 差 1px，是重複不是階。
- **23px（h4）→ `--fs-head` 25px。** h3 和 h4 在 HTML 裡從不出現在同一層底下：h4 的上層永遠是 `.sub`，h3 的上層是 eyebrow。不會並排就不必分階。
- **46px（email）→ `--fs-display` 35px。** 唯一用 46px 的元素。收掉之後 contact 區塊是 62 → 21 → 35 的乾淨下降。
- **21px（`.lead`）→ 內文 18px。** 只比內文大 3px，讀者分不出來。導言的身分改由位置（每個 section 的第一段）和下方那道 `margin-bottom` 撐；`.lead` 現在是純粹的間距 class，一個 `font-size` 都不帶。
- **68px（數字）→ `--fs-mega` 62px。** 和 contact 大標同屬「一個巨大的物件」，差 6px 只是沒對齊。手機下限一併從 38px 收到 30px——`1000+` 在 375px 的三欄格線裡放不下 38px。
- **26px（`.teach__no` 的一二三）→ `--fs-head`。** 它的註解本來就寫「級數配 h4」，但寫死成 26px 之後就跟著 h4 的變動脫鉤了。改吃 token，註解才是真的。

`--fs-sub`（22 → 28px）留著的理由：它是 `--fs-head` 那些項目標題的**上層**（`.sub` → `.cv__what h4`），
併進 `--fs-head` 會變成父子同級。但兩者在手機端只差 1px（22 vs 21），那個「上層」的關係在小螢幕上讀不出來——
真要再收一次，該做的是把 `--fs-sub` 的下限抬到 24px，不是合併。

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

全部走一條曲線 `--ease`。**進場語氣只有一種：上浮 14px。**
這個數字跟 hero 載入一樣，所以整頁從頭到尾是同一個手勢，不另外加淡出、縮放、
左右滑入或方向變化。

> **2026-09-04：scroll reveal 是 Mei 指定的方向。**
> 當天先做過另一版——把區塊的開場細線做成「由左往右畫出來」（呼應螢光筆，
> 內容完全不動），Mei 看過後說「不需要畫線的動態，其實更偏好 scroll reveal 動態」，
> 整版退回重做。**不要再把 scroll reveal 換成畫線，也不要因為它「常見」就拿掉。**

### Tokens

| 變數 | 值 | 用途 |
|---|---|---|
| `--ease` | `cubic-bezier(.22,.61,.36,1)` | 全站唯一一條曲線 |
| `--dur-tap` | `.16s` | 按下去的即時回饋 |
| `--dur-ui` | `.26s` | 元件狀態切換（hover、選單、導覽指示） |
| `--dur-rise` | `.62s` | scroll reveal |
| `--rise-y` | `14px` | 進場位移，與 hero 載入同值 |

### Scroll reveal

規則只有兩條：

1. **一個區塊是一個手勢。** 段落、引言、卡片、newsletter 卡各自整塊進場，不逐字逐行拆
2. **列表交給每一列自己。** `.threads` `.cases` `.counters` `.cv` `.teach` `.talks`
   `.cards` `.lenses` `.fit__list` 這幾個容器**自己不進場**（CSS 裡用 `:not()` 排掉），
   由裡面的每一列進場；容器與列都動會疊成兩次

錯開量**不寫死在 `nth-child`**，而是由 JS 看「這一批同時進到畫面的有幾個」決定
（55ms 一階，最多六階）。四張卡片一起進來就依序錯開；慢慢捲的時候每一列都是第一個，
不會出現「明明已經看到了卻還在等」的假延遲。

- 觸發：`threshold: 0`、`rootMargin` 底部 `-12%`
- 進場一次就 `unobserve`，捲回去不重播——重播會讓頁面顯得不安分
- Hero 不吃這套（它有自己的載入動畫，而且不在 `.col` 裡）
- 選擇器同時寫在 `style.css` 的 MOTION 區塊與 `main.js` 的 `REVEAL`，**兩邊要一起改**

### Hero 問句輪播

> **2026-09-04：Mei 指定拿掉 hero 的英文句，改成輪播問句。**

「人們為什麼」是固定的大標，只有後半句在換，六句寫死在 `index.html` 裡：

1. 會被某些產品打動？　2. 表面說的，和實際行為不同？　3. 願意投入大量時間？
4. 喜歡某個故事、品牌？　5. 願意為某些東西付更多錢？　6. 會因為一件事，突然改變想法？

- **順序：** 每進一次頁面洗一次牌，照洗完的順序播完六句（一輪之內不重複），
  播完再洗下一輪，並確保新的第一句 ≠ 上一輪的最後一句
- **節奏：** 一句停 4.6 秒，換句是「舊的原地淡出 → 新的上浮 14px 淡入」，
  共用 `--dur-rise` / `--ease`。**退場刻意不位移**——兩句都在動就變成跑馬燈了
- **兩行同級：** Mei 指定兩行一樣粗、一樣大。字級上限因此由**最長那句**決定
  （14 個字 = 14.14em，必須停成一行）。

  > **2026-09-04：Mei 說「不夠震撼，想盡量接近第一版英文字的大小」。**
  > 第一版的 `What moves people?` 是 `clamp(48px, 9.1vw, 124px)`；漢字這一句有 14 個字，
  > 擠在只剩 445px 的 col 1 裡最多就是 48px。所以把問句改成**跨滿整幅**
  > （`.hero__display { grid-column: 1 / -1 }`），右欄的自我介紹掉到第二列，
  > 左下的留白是換來字級的代價，刻意留著。

  可用寬 = `min(1200px, 100vw) − 2×--pad-x`，除以 14.14 之後，1600 / 1440 / 1280 / 1200 /
  1120 / 1024 / 960 / 901 / 900 / 834 / 768 / 600px 換算出來的 vw 上限都落在 6.35–6.47，
  取 **6.05vw** 留 3.5–7% 餘裕；上限 `1104 ÷ 14.14 ≈ 78px`，取 **74px**。
  所以 `--fs-hero` 取 `clamp(26px, 6.05vw, 74px)`。實測十七個寬度都是一行、都沒有橫向溢位，
  只有 414px 以下（下限 26px 接手）最長那句折兩行——列高由最高那句決定，所以照樣不跳。
  **改 vw 或改右欄寬度之前，先把這串寬度重量一次。**
- **行高 `--lh-hero: 1.4`：** 這一級是全站最大的漢字，全站的 `--lh-display: 1.45` 在
  74px 會鬆到讀不成一句；但**低於 1.4 螢光筆就會壓到下一行的字頭**——`mark.mark` 的
  筆觸靠 `padding-bottom: .16em` 往下探，行距一縮就直接蓋在下一行的字上。1.4 是這兩
  個限制之間的落點。
- **高度不跳：** 六句全部在 DOM 裡，`.hero__rotator` 是 grid、六句都放 `grid-area: 1 / 1`，
  列高等於最高那一句。不靠 JS 量測、不用 `position: absolute`。
  實測 1440 / 1280 / 1120 / 1024 / 980 / 940 / 901 / 900 / 768 / 414 / 390 / 360px
  六句都是一行、六句同高；只有 320px 時最長那句折兩行，列高仍然一致
- **看不到就停：** 捲離 hero 或切到別的分頁就停在當下這一句，回來才繼續
- **`prefers-reduced-motion`：** 取消位移（`.hero__line { transform: none }`），
  全站的 reduce 區塊會把 transition 歸零，變成最單純的文字切換
- **沒有 JS：** `html:not(.js)` 直接顯示第一句，其餘 `display: none`

---

#### ⚠️ 特異性：初始狀態不能贏過 `.is-in`

這是這個做法唯一會出事的地方，實作時踩到兩次，兩次的症狀都是
**元素明明掛上了 `.is-in`，畫面上還是空白**：

| 寫法 | 特異性 | 結果 |
|---|---|---|
| `.js .col > *:not(.a):not(.b)…` | `(0,10,0)` | ❌ 每個 `:not()` 都累加 |
| `.js .col > *:where(:not(.a, .b, …))` | `(0,2,0)` | ✅ `:where()` 是 0 |
| `.js .cases > li` | `(0,2,1)` | ❌ 元素選擇器多 `(0,0,1)` |
| `.js .cases > *` | `(0,2,0)` | ✅ |

規則：**初始狀態一律維持 `(0,2,0)`**——容器用 `> *` 不用 `> li`，排除清單用
`:where(:not(…))` 不用連續 `:not()`。顯示狀態再用 `:root.js .is-in` 墊到 `(0,3,0)`
當保險，日後有人加了帶元素名的選擇器也不會整段消失。

### 微互動

**只給真正能按的東西。** 案例、經歷、lenses 這些列不是連結，所以不給 hover 狀態——
對不能點的東西回應滑鼠，等於教使用者一個不存在的功能。
會動的部分全部包在 `@media (hover: hover)` 裡，觸控裝置點完不會卡住 hover 樣式。

| 元件 | 行為 |
|---|---|
| `.btn` | hover 上移 1px；右端那顆點 `scale(1.32)`（點本來就是可點性提示，回應手勢的是它）。`:active` 回到平面、點縮到 `.92` |
| `.nav__brand` | hover 時筆頭 `scale(1.08) rotate(-5deg)` |
| `.nav__links a` | hover 鋪 cream；**目前所在區塊**底下一道 teal 短線（`::after` `scaleX`，字不會跳動） |
| `.nav__cta` | 桌機版 `.nav__links-cta` 是收起來的，所以捲到 Contact 時由它換成 sand 底接手指示 |
| `.nav__toggle` | 三條線變 X 補間 `--dur-ui` |
| 手機選單 | 開合都補間（`display` 走 `allow-discrete` + `@starting-style`，不支援就瞬間開關） |
| `.contact__mail` | hover 時 ochre 底線 3 → 6px，`padding-bottom` 同步減掉所以總高不變、不會推動下面的社群連結。**不淡出**——ochre 是全站唯一的暖色標記 |
| `.contact__social a` | hover 反白 + 上移 1px |

導覽的區塊指示由 IntersectionObserver 判斷（視窗中線附近 5% 那一帶），
命中的連結掛 `aria-current="location"`，讀屏軟體也讀得到。

### 降級（這兩條是硬要求）

- **沒有 JS**：`<head>` 的 inline script 掛不上 `.js`，所有 reveal 的初始狀態就不成立，
  整頁正常顯示。initial state 絕對不能寫在沒有 `.js` 前綴的選擇器上，
  否則沒有 JS 的人會看到一頁空白
- **`prefers-reduced-motion: reduce`**：`transition-duration` 與 `animation-duration` 全部壓到
  `.001ms`、`transition-delay` 歸零、`scroll-behavior` 轉 auto。JS 直接把 `.is-in` 補上，
  不建 observer

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
  （**scroll reveal 不在這張清單上**，見 Motion 的 2026-09-04 註記）
- 不要給不能點的東西 hover 狀態
- reveal 的初始狀態不要寫在沒有 `.js` 前綴的選擇器上

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

1. *Hero：* cream 底。一句問題斷成兩行，**兩行同一級、同一重、同一行高**
   （Noto Sans TC 900、clamp(21px, 3.4vw, 48px)、行高 1.45），中間不加 margin——
   它讀起來要是「一句話換行」，不是「大標＋副標」。第一行「人們為什麼」是固定的，
   整句包 `<mark class="mark">`；第二行輪播（`max-width: 15em`）。
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
