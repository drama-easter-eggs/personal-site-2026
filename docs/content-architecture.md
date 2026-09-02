# Content Architecture

這份文件定義網站不同內容之間的關係與長期組織方式。

網站實際首頁內容、文案與 section 順序，以 `website-plan.md` 為準。本文件不重新定義首頁 IA，而是作為內容系統的補充。

---

## 1. Core Question

這個網站表面上包含研究顧問工作、商業案例、文化觀察、故事分析與個人書寫，但它們長期都圍繞著相似的問題：

> **What moves people?**
>
> 人為什麼會被某些東西打動？  
> 那些感受，又如何改變人的選擇與行動？

我關心的不只是人「做了什麼」，而是試著往前追：

> **Experience → Feeling → Meaning → Choice**

人如何從一段經驗產生感受、賦予意義，最後形成選擇。

而這些選擇可能進一步形成不同結果，例如：

- **Behavior** — 人實際做了什麼
- **Value** — 人願意投入什麼，包括時間、金錢、注意力與情感
- **Identity** — 一段經驗如何影響人理解自己

這是網站背後的思考框架，不需要在每個頁面直接解釋或視覺化。

---

## 2. Two Types of Practice

網站主要呈現兩種不同、但彼此相關的實踐。

### Selected Work

**我曾經透過專業專案回答過的問題。**

包含使用者研究、體驗策略、商業研究與不同產業的合作案例。

Selected Work 的目的不是展示做過多少產業或研究方法，而是透過案例呈現：

- 我如何理解一個模糊的問題
- 我如何看見表面行為背後的動機
- 我如何把研究轉化成可以採取行動的方向

Selected Work 屬於 **professional / commissioned practice**。

---

### Questions I Explore

**即使沒有客戶委託，我仍然會持續追問的問題。**

這些問題可能來自：

- 產品與服務
- 科技與 AI
- 故事與文化
- BL / GL
- 粉絲文化
- 工作
- 閱讀
- 個人經驗與反思

它們可能以文章、研究、數位敘事或其他形式出現。

Questions I Explore 屬於 **independent inquiry / writing / exploration**。

---

## 3. Ways of Seeing

Questions I Explore 不按照平台或傳統內容分類組織。

Medium、Substack、Instagram 等是 publishing / distribution channels，不是網站的內容架構。

我目前主要透過三個 lenses 觀看不同問題：

### Systems
**People × Systems**

人如何與我們創造的系統相處？

包含產品、服務、科技、制度、商業模式、AI、金融、教育、公共服務等。

可能關心：

- 人如何理解一個系統？
- 為什麼相信、使用、留下或拒絕？
- 系統如何影響人的選擇與行為？
- 人真正需要的，與系統以為他需要的有什麼落差？

---

### Culture
**People × Culture**

人如何透過故事與文化產生連結？

包含故事、角色、作品、BL / GL、IP、粉絲文化、收藏、包場、應援、社群與內容消費等。

可能關心：

- 為什麼一個故事或角色會對人變得重要？
- 喜歡如何形成投入？
- 私人的感動如何形成集體文化？
- 人如何透過作品理解現實與自己？
- 情感如何形成文化與經濟價值？

---

### Self
**People × Self**

人如何理解自己的經驗與選擇？

包含工作、閱讀、自由工作、創作、AI 時代的自我、生命經驗與個人反思等。

可能關心：

- 我為什麼在意一件事情？
- 一段經驗如何改變一個人？
- 人如何理解自己的選擇？
- 工作與創作對一個人意味著什麼？
- 我們如何理解自己正在成為誰？

---

## 4. Lens ≠ Topic

Systems / Culture / Self 是 **lenses（觀看方式）**，不是互斥的文章分類。

一篇內容可以同時透過多個 lens 觀看。

例如：

**AI 與人的協作**

- Topic: AI / Research / Work
- Lens: Systems + Self

**三麗鷗與情感品牌**

- Topic: Brand / IP / Fandom
- Lens: Systems + Culture

**BL 故事如何影響人的自我理解**

- Topic: BL / Story / Identity
- Lens: Culture + Self

因此：

> **Topic = 我在談什麼**
>
> **Lens = 我從什麼角度觀看它**

網站的資料結構應保留這個差異。

不要按照 Systems / Culture / Self 建立互斥的內容資料夾。

---

## 5. Writing

Writing 是 Questions I Explore 最主要的內容載體，但兩者不是兩個平行的首頁 section。

關係是：

**Questions I Explore**
→ 我持續追問什麼

**Systems / Culture / Self**
→ 我如何觀看這些問題

**Writing**
→ 這些探索目前以什麼內容形式存在

因此首頁只有 **Questions I Explore**。

其中可以呈現三個 lenses，以及部分精選或近期 writing。

網站未來可以建立 `/writing` 作為完整文章 archive，但不需要因此在首頁增加獨立的 Writing section。

---

## 6. Content Model

網站長期需要結構化管理的內容主要有兩種：

### Work

用於 Selected Work 與完整案例。

可能包含：

- title
- question
- summary
- industry / context
- year
- topics
- lenses（如果有需要）
- featured
- order
- case study content

---

### Writing

用於 Questions I Explore 相關文章與自主內容。

可能包含：

- title
- description
- published date
- lenses
- topics
- content type
- featured
- original source（如果文章原本發布於 Medium / Substack / 其他平台）
- article content

具體 schema 在實作 Content Collections 時再決定，不需要因為這份文件提前建立所有欄位。

---

## 7. Publishing Channels

個人網站應逐漸成為內容的主要 home / archive。

不同外部平台則扮演不同的 publishing 或 distribution role。

### Personal Website
主要內容所在地。

用來整理、策展與建立不同作品和想法之間的關係。

### Newsletter / Substack
與固定讀者維持持續關係與內容發送。

### Social Media / 讀劇巧思
較短內容、文化觀察、社群互動與 discovery。

### Medium
既有文章與既有 readership 的來源之一。

平台可能改變，因此網站資訊架構不應依賴特定 publishing platform。

---

## 8. Architecture Principles

### Content should be organized by meaning, not platform.

不要按照 Medium / Substack / Instagram 分割網站內容。

### Lenses should remain flexible.

Systems / Culture / Self 是觀看方式，不應成為限制內容只能存在於某一處的 category。

### Crossovers are intentional.

Systems + Culture、Culture + Self、Systems + Self 的交界不是分類失敗，而可能正是最值得探索的地方。

### The worldview should remain mostly invisible.

Experience → Feeling → Meaning → Choice 是底層思考框架，不需要讓每個頁面都變成理論說明。

網站應該讓訪客透過 Selected Work、Writing 與整體內容逐漸感受到這套觀看方式。

### Keep the system open.

未來可能出現新的 topic、內容形式或研究計畫。

只要仍然與核心問題相關，就應該能加入現有架構，而不需要重新建立一個品牌或網站分類。