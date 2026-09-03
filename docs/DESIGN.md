# Mei-Ling Chen — Style Reference

> 暖紙上的安靜編輯系統。深綠負責結構，橄欖負責面積，一支高彩度的黃負責重點——亮度全部存起來，只在關鍵處花掉。

**Theme:** light（含深色模式對照）

這是一套以暖紙色為底的編輯型系統，取代白底作為結構畫布。整體彩度低，唯一的高彩度是螢光筆黃，它不是裝飾，而是內容層級的一部分——被畫起來的句子就是這一頁的論點。深綠是主色，但它做的是結構工作：導覽的 active 狀態、數字、主要按鈕、結尾色帶。橄欖褐承擔大面積的次級區塊與小標籤，把暖度鋪滿整頁而不搶注意力。

色彩在這裡是功能性的，不是裝飾性的。每個顏色只有一個工作，沒有備用的雜色。層次靠表面明度（紙底 → 交替底 → 卡片底）和字級落差建立，不靠陰影。

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Deep Green | `#234B42` | `--color-deep-green` | 主色。導覽 active、主要按鈕、數字、區塊標題、連結、結尾色帶。可用於文字與填色 |
| Deep Green Dark | `#17352F` | `--color-deep-green-dark` | 主色的 hover / active 狀態 |
| Olive | `#857D65` | `--color-olive` | 大面積輔助色。小標籤、編號、圖表底、引言區。**不可作為內文色**（在紙底上對比僅 4.1） |
| Sage | `#8FA79B` | `--color-sage` | 深綠底上的輔助色。深色區塊裡的小標籤、分隔線、次要按鈕描邊 |
| Highlight | `#F5C842` | `--color-highlight` | 螢光筆底色，以及頁尾唯一一顆主要按鈕。**只能當背景，不能當文字或圖示**（對比僅 1.5） |
| Paper | `#EFE9DD` | `--color-paper` | 頁面畫布。取代白底作為結構底色 |
| Paper Alt | `#E8E1D1` | `--color-paper-alt` | 交替段落底。讓卡片有東西可以浮起來 |
| Card | `#F9F6EF` | `--color-card` | 卡片與浮動導覽的表面。**不使用純白** |
| Hairline | `#DED7C8` | `--color-hairline` | 分隔線、標籤描邊、低對比結構線 |
| Ink | `#242721` | `--color-ink` | 主要文字、圖示、高對比框線。偏綠的暖近黑，在暖紙上比純黑柔和 |
| Ink Muted | `#5F5C52` | `--color-ink-muted` | 次要文字、說明文、導覽非 active 項目 |

### 使用比例

- 紙色三階：60% 以上
- Ink / Ink Muted：文字全部
- Olive：15–20%（區塊底、小標籤）
- Deep Green：10%（結構與互動）
- Highlight：5% 以內

### 螢光筆規則

這是整套系統辨識度最高的裝置，效力來自稀有度。

- 一個畫面最多兩處，一個段落最多一處
- 畫在四到十字的片語上，不要畫在完整句子上——畫整句會變成「這段很重要」，太鈍；畫片語才會變成「注意這幾個字」
- 上下 padding 2px、左右 3px，讓它像筆跡而不是色塊
- 深色模式下不反轉：維持黃底深字

---

## Tokens — Dark Mode

| Token | Light | Dark |
|-------|-------|------|
| `--color-paper` | `#EFE9DD` | `#14201D` |
| `--color-paper-alt` | `#E8E1D1` | `#192723` |
| `--color-card` | `#F9F6EF` | `#1F2E29` |
| `--color-hairline` | `#DED7C8` | `#33443E` |
| `--color-ink` | `#242721` | `#EAE6DB` |
| `--color-ink-muted` | `#5F5C52` | `#9BA69F` |
| `--color-deep-green` | `#234B42` | `#7FA79A` |
| `--color-deep-green-dark` | `#17352F` | `#9DBDB0` |
| `--color-olive` | `#857D65` | `#A79C7E` |
| `--color-sage` | `#8FA79B` | `#4E6B62` |
| `--color-highlight` | `#F5C842` | `#F5C842` |

深色模式下橄欖與深綠都要提亮，否則會沉進背景。螢光筆黃不動——整頁都暗、只有一塊亮黃裡面是深字，那個對比比什麼都強。頁尾色帶在深色模式改用 `#1B3A33`，比頁面底亮一階即可，不需要維持淺色模式的反轉幅度。

---

## Tokens — Typography

單一無襯線家族貫穿全站。原參考系統把 Inter 推到 144px 作為簽名手法，這裡不採用——本站內容以長文、研究與資料敘事為主，極端字級會壓縮閱讀節奏，且與低彩度的安靜基調互相抵消。顯示級距收在 81px 以下，權威感改由對比、留白與字級落差承擔。

**中文行高必須拉開。** 原系統的 1.5 是為拉丁字設計，中文字面率高，內文行高需要 1.8–1.9 才不擁擠。

### 字體堆疊：全站不出現明體

中文一律使用黑體（sans-serif）。明體、宋體、細明體不得出現在任何文字上，包含引言、標題、頁尾與圖表標籤。

堆疊裡不使用 `ui-sans-serif` 與 `system-ui`——這兩個通用字族在不同系統上對中文的解析結果不一致，Windows 上若 `lang` 標記缺失或錯誤，可能落到新細明體。全部改為具名字體，最後才接 `sans-serif`。

實作時要檢查三件事：

- `<html lang="zh-Hant">` 必須正確設定。標記錯誤時瀏覽器會用簡體或日文的預設字體遞補，明體就是從這裡進來的
- Google Fonts 匯入確認是 **Noto Sans TC**，不是 Noto Serif TC。兩者名稱只差一個字
- Noto Sans TC 的 500 必須一併載入。系統只指定 400 與 500 兩個字重，若匯入時漏掉 500，瀏覽器會用合成粗體或直接跳到 700，中文會糊
- 中文不使用斜體。CJK 沒有真正的斜體字形，瀏覽器只會做傾斜變形

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| micro | 11px | 1.4 | 0.08em | `--text-micro` |
| body-sm | 13px | 1.8 | — | `--text-body-sm` |
| body | 16px | 1.85 | — | `--text-body` |
| body-lg | 18px | 1.85 | — | `--text-body-lg` |
| subheading | 20px | 1.5 | — | `--text-subheading` |
| heading-sm | 24px | 1.45 | — | `--text-heading-sm` |
| heading | 36px | 1.3 | -0.02em | `--text-heading` |
| heading-lg | 53px | 1.2 | -0.03em | `--text-heading-lg` |
| display | 81px | 1.05 | -0.04em | `--text-display` |

- Weights：400、500。不使用 600 以上——在暖紙上會過重
- 英文顯示字使用負字距，中文顯示字不加負字距（中文字面已經緊）
- 內文行長控制在 40 字以內（中文）／80 字元以內（英文）

---

## Tokens — Spacing & Shapes

**Base unit:** 4px　**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| xs | 4px | `--spacing-xs` |
| sm | 12px | `--spacing-sm` |
| md | 20px | `--spacing-md` |
| lg | 40px | `--spacing-lg` |
| xl | 80px | `--spacing-xl` |
| 2xl | 120px | `--spacing-2xl` |

### Border Radius

| Element | Value | Token |
|---------|-------|-------|
| cards | 16px | `--radius-card` |
| inputs | 8px | `--radius-input` |
| small | 8px | `--radius-small` |
| buttons / pills | 999px | `--radius-pill` |
| nav | 999px | `--radius-nav` |

原系統所有元件一律 50px 圓角，讀起來是貼紙感。這裡把卡片收到 16px，只保留按鈕、標籤和導覽的膠囊形——柔軟度留在小元件上，內容容器維持編輯感。

### Layout

- Page max-width：1200px
- Reading column：640–720px
- Section gap：80–120px
- Card padding：20–24px
- Element gap：16–20px

---

## Surfaces

| Level | Name | Light | Dark | Purpose |
|-------|------|-------|------|---------|
| 0 | Paper | `#EFE9DD` | `#14201D` | 頁面畫布 |
| 1 | Paper Alt | `#E8E1D1` | `#192723` | 交替段落底 |
| 2 | Card | `#F9F6EF` | `#1F2E29` | 卡片、浮動導覽 |
| — | Deep Green | `#234B42` | `#1B3A33` | 結尾色帶、深色區塊 |

三階紙色是這套系統的骨架。卡片浮起來靠的是比背景更亮，不是陰影。因此卡片必須放在 Paper Alt 上——放在 Paper 上明度差不夠，會貼平。

---

## Elevation

不使用陰影與漸層。層次全部由表面明度階梯與圓角承擔，維持印刷般的平面感。深色模式下同樣邏輯：卡片比頁面底亮一階，而不是加光暈。

---

## Imagery

無插畫系統。視覺由字級、留白與色帶承擔。若使用圖像，以研究現場照片、圖表、資料視覺化為主，不使用向量角色插畫或 3D 算圖——那類插畫需要一組裝飾用的雜色，會破壞這套色票「每個顏色只有一個工作」的前提。

### 資料視覺化

品牌色只有三個有彩色，多類別圖表不夠用。兩種做法擇一：

1. 補中間階：`#234B42` → `#4E7367` → `#857D65` → `#B8AE95` → `#F5C842`。五階可分辨，但同溫度帶，超過三類建議加網點或虛線作為第二層編碼
2. 接受圖表用色是獨立系統。品牌色負責頁面，圖表色負責資訊，兩套不必相同——這在資料敘事裡是常見做法

---

## Components

### Floating Pill Navigation
`--color-card` 底，膠囊形，浮在紙色畫布上。非 active 項目 13–15px / 500 / `--color-ink-muted`，active 項目為 `--color-deep-green` 填色配 `--color-card` 文字。無陰影，必要時加 `--color-hairline` 描邊。

### Hero Display Block
滿版紙色。標題 53–81px / 500 / `--color-ink`。副標 15–20px / 400 / `--color-ink-muted`。標題本身就是最強的視覺元素，不需要其他競爭物。

### Highlight Mark
`--color-highlight` 底配 `--color-ink` 文字，內距 2px / 3px。遵守上方螢光筆規則。

### Content Card
`--color-card` 底，16px 圓角，20–24px 內距，放在 `--color-paper-alt` 段落上。標題 17–24px / 500 / `--color-ink`，內文 13–16px / 400 / `--color-ink-muted`。無陰影。

### Tag Pill
`--color-hairline` 描邊，不填色，文字 11px / `--color-ink-muted`，膠囊形。標籤是分類資訊，不是強調，所以不給顏色。

### Stat Block
數字 24–36px / 500 / `--color-deep-green`，標籤 11px / `--color-ink-muted`。

### Inline Text Link
`--color-deep-green` 文字加底線。底線必須保留——沒有橘色之後，純靠顏色差異太安靜，可點性會消失。

### Primary Button
`--color-deep-green` 填色配 `--color-card` 文字，膠囊形，hover 轉 `--color-deep-green-dark`。原參考系統刻意不設填色主按鈕，那是因為它的綠太亮；本系統的深綠可以填色，這個限制不繼承。

### Secondary Button
透明底，`--color-deep-green` 描邊與文字，hover 底鋪淡綠。深色區塊上改用 `--color-sage` 描邊配 `--color-card` 文字。

### Contact Band
滿版 `--color-deep-green`，文字 `--color-card`，小標籤與分隔線 `--color-sage`。主按鈕在此處使用 `--color-highlight` 填色配 `--color-ink` 文字——這是黃色在整頁的最後一次出現，也是唯一一次擔任行動。

整頁的節奏因此是：安靜的紙底 → 一路上的黃色重點 → 深色收尾。**不要改成亮色收尾**，那是相反的手法，一個往上打開、一個往下收合，不能混用。

---

## Do's and Don'ts

### Do

- 用 `#EFE9DD` 當頁面畫布，不用純白。卡片用 `#F9F6EF`，白色完全不進系統
- 卡片一定要放在 `--color-paper-alt` 段落上，靠明度差浮起來
- 深綠可以做文字、填色、按鈕底——它的明度夠低，不受原系統「結構色不可做文字」的限制
- 螢光筆一個畫面最多兩處，畫在片語不畫在整句
- 內文行高中文 1.8–1.9，行長控制在 40 字以內
- 深色模式下把橄欖與深綠都提亮一階，螢光筆黃維持不動

### Don't

- 不要把黃色拿去做按鈕、標籤、圖示或大色塊。它的明度跟紙底太近，會糊成一片黃濁；唯一例外是頁尾那顆按鈕，因為它放在深綠底上
- 不要用橄欖當內文色。它在紙底上對比只有 4.1，大字勉強，內文不合格
- 不要把深綠提亮。深綠配亮黃是很強的既定聯想，容易讀成有機、農產、永續品牌；避開它靠的是綠夠深、黃夠小，任一條件失守氣質就會滑走
- 不要用陰影或漸層做層次
- 不要再加第四個有彩色。這套系統的乾淨來自於「每個顏色只有一個工作」，多一個顏色就多一次判斷
- 不要把顯示字級推到 100px 以上。本站內容是長文與研究，極端字級屬於字很少的頁面
- 中文不使用明體、宋體、細明體，任何位置都不行。也不要在字體堆疊裡留 `ui-sans-serif` 或 `system-ui`——明體通常是從這兩個通用字族遞補進來的
- 中文不使用斜體

### 待確認

- 大寫字母的 eyebrow 標籤（`WHAT I CARE ABOUT` 這類）目前貫穿全站。這是很常見的預設裝置，如果希望版面更有個性，可以改成中文小標、編號，或直接拿掉——但這是版面決定，不是色彩決定，可以之後單獨處理
- 編號（01 / 02 / 03）只在內容真的是序列時才用。作品選集如果沒有先後關係，編號會給出不存在的順序暗示
- 子品牌（MEI Thinking、讀劇巧思）尚未分配專屬色。目前色票只剩深綠可分配，若兩個子品牌需要視覺區隔，可能要引入一個系統外的色，或改用字體與版面區隔

---

## Agent Prompt Guide

**Quick Color Reference**

- text: `#242721`
- text muted: `#5F5C52`
- background: `#EFE9DD`（頁面）／`#E8E1D1`（交替段落）
- surface: `#F9F6EF`（卡片、導覽）
- border: `#DED7C8`
- accent: `#234B42`（深綠，可做文字與填色）
- large area: `#857D65`（橄欖，僅大面積與小標籤）
- highlight: `#F5C842`（僅背景，螢光筆與頁尾按鈕）
- primary action: `#234B42` 填色；深色底上改用 `#F5C842` 填色配 `#242721` 文字

**Example Component Prompts**

1. *Hero headline section:* 紙色底 `#EFE9DD`。標題 53–81px weight 500 `#242721`，行高 1.05–1.2。副標 15–20px weight 400 `#5F5C52`。無卡片容器，文字直接坐在畫布上。
2. *Highlighted sentence:* 內文 13–16px `#5F5C52`，行高 1.85，其中四到十字的片語加 `#F5C842` 底色與 `#242721` 文字，內距 2px 3px。
3. *Content card:* `#F9F6EF` 表面，16px 圓角，20–24px 內距，放在 `#E8E1D1` 段落上。無陰影無描邊。
4. *Tag pill:* `#DED7C8` 描邊不填色，11px `#5F5C52`，膠囊形。
5. *Contact band:* 滿版 `#234B42`，標題 24–36px `#F9F6EF`，小標籤 `#8FA79B`，主按鈕 `#F5C842` 填色配 `#242721` 文字，次按鈕 `#8FA79B` 描邊。

---

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-deep-green: #234B42;
  --color-deep-green-dark: #17352F;
  --color-olive: #857D65;
  --color-sage: #8FA79B;
  --color-highlight: #F5C842;
  --color-paper: #EFE9DD;
  --color-paper-alt: #E8E1D1;
  --color-card: #F9F6EF;
  --color-hairline: #DED7C8;
  --color-ink: #242721;
  --color-ink-muted: #5F5C52;

  /* Surfaces */
  --surface-0: var(--color-paper);
  --surface-1: var(--color-paper-alt);
  --surface-2: var(--color-card);
  --surface-band: var(--color-deep-green);

  /* Typography */
  --font-sans: 'Inter', 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', 'Hiragino Sans TC', 'Heiti TC', sans-serif;
  --text-micro: 11px;
  --text-body-sm: 13px;
  --text-body: 16px;
  --text-body-lg: 18px;
  --text-subheading: 20px;
  --text-heading-sm: 24px;
  --text-heading: 36px;
  --text-heading-lg: 53px;
  --text-display: 81px;
  --leading-body: 1.85;
  --leading-heading: 1.3;
  --leading-display: 1.05;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 12px;
  --spacing-md: 20px;
  --spacing-lg: 40px;
  --spacing-xl: 80px;
  --spacing-2xl: 120px;

  /* Radius */
  --radius-card: 16px;
  --radius-input: 8px;
  --radius-small: 8px;
  --radius-pill: 999px;
  --radius-nav: 999px;

  /* Layout */
  --page-max-width: 1200px;
  --reading-column: 680px;
}

[data-theme="dark"] {
  --color-deep-green: #7FA79A;
  --color-deep-green-dark: #9DBDB0;
  --color-olive: #A79C7E;
  --color-sage: #4E6B62;
  --color-highlight: #F5C842;
  --color-paper: #14201D;
  --color-paper-alt: #192723;
  --color-card: #1F2E29;
  --color-hairline: #33443E;
  --color-ink: #EAE6DB;
  --color-ink-muted: #9BA69F;
  --surface-band: #1B3A33;
}
```

### Tailwind v4

```css
@theme {
  --color-deep-green: #234B42;
  --color-deep-green-dark: #17352F;
  --color-olive: #857D65;
  --color-sage: #8FA79B;
  --color-highlight: #F5C842;
  --color-paper: #EFE9DD;
  --color-paper-alt: #E8E1D1;
  --color-card: #F9F6EF;
  --color-hairline: #DED7C8;
  --color-ink: #242721;
  --color-ink-muted: #5F5C52;

  --font-sans: 'Inter', 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', 'Hiragino Sans TC', 'Heiti TC', sans-serif;

  --text-micro: 11px;
  --text-body-sm: 13px;
  --text-body: 16px;
  --text-body-lg: 18px;
  --text-subheading: 20px;
  --text-heading-sm: 24px;
  --text-heading: 36px;
  --text-heading-lg: 53px;
  --text-display: 81px;

  --radius-card: 16px;
  --radius-input: 8px;
  --radius-small: 8px;
  --radius-pill: 999px;
}
```
