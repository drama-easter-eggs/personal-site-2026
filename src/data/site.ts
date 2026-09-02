/**
 * 網站設定與內容資料。
 * 文案一律以 docs/website-plan.md 為準，這裡只做結構化，不改寫語意。
 * TODO 標記處為 website-plan.md 中尚未填寫的欄位，請直接在此檔補上。
 */

export const site = {
  name: "Mei",
  title: "Mei — 獨立研究者 / 體驗策略顧問",
  description:
    "我持續透過實際觀察、研究，理解人們真正重視什麼、實際如何行動，協助產品與服務團隊在複雜模糊的探索階段，找到真正值得投入的方向。",
  url: "https://example.com", // TODO: 換成正式網域
  email: "hello@example.com", // TODO: 換成你的聯絡信箱
  bookingUrl: "", // TODO: 若有 Cal.com / Calendly 預約連結填這裡，留空則不顯示按鈕
  substackUrl: "", // TODO: Substack 電子報連結
  socials: [
    { label: "Facebook", url: "" }, // TODO
    { label: "Instagram", url: "" }, // TODO
    { label: "Threads", url: "" }, // TODO
  ],
};

export const nav = [
  { label: "關心什麼", href: "#care" },
  { label: "案例", href: "#work" },
  { label: "關於我", href: "#about" },
  { label: "合作方式", href: "#services" },
  { label: "觀點", href: "#questions" },
];

/** 02 — 我關心什麼：三個持續追問的方向 */
export const careThreads = [
  {
    title: "顧客行為背後的原因（購買、決策、留下、離開）",
    body: "表面的說法、行為的背後，中間往往藏有那些還沒說出來的動機",
  },
  {
    title: "情感如何影響行為與消費",
    body: "從產品體驗到文化內容，情感如何改變人的投入與選擇",
  },
  {
    title: "在與 AI 共同協作中，自我如何成長",
    body: "在 AI 的協助下，我們交付了看似「很漂亮的產出」，但是，在我們與 AI 互動的過程當中，有哪些是真正留在你腦中的思考資產",
  },
];

/** 03 — Selected Work */
export const works = [
  {
    no: "01",
    title: "從「喜歡」到「真正付費」的距離",
    lines: [
      "人們花錢買漫畫、買周邊，除了收藏之外，背後還有哪些情感支持",
      "現今娛樂的選擇很多，粉絲為何狂熱、又為什麼對特定作品花錢",
    ],
    tags: ["漫畫平台研究", "粉絲文化研究"],
  },
  {
    no: "02",
    title: "人們如何判斷「是否值得」",
    lines: ["台灣人真的只追求 CP 值嗎，為什麼有時候願意高價付費？"],
    tags: ["線上教育", "醫療健康", "收藏品研究"],
  },
  {
    no: "03",
    title: "選擇很多，是什麼讓人願意留下",
    lines: ["真的是因為贈品多、好禮大放送，人們才留下來的嗎？"],
    tags: ["金融產品", "會員經營"],
  },
  {
    no: "04",
    title: "人們怎麼判斷「有效」",
    lines: ["家長說希望孩子快樂長大，但什麼才會讓他們繼續付費？"],
    tags: ["兒童教育"],
  },
  // TODO 05 — website-plan.md 註記「想要加一個公共服務相關」，待你補上標題、提問與 tag 後解除註解
  // {
  //   no: "05",
  //   title: "",
  //   lines: [""],
  //   tags: ["公共服務"],
  // },
];

/** 04 — About：三個數字 */
export const stats = [
  { value: 7, suffix: "+ 年", label: "研究與策略經驗" },
  { value: 30, suffix: "+", label: "研究與策略專案" },
  { value: 1000, suffix: "+", label: "演講、課程與教學影響人次" },
];

/** 04 — 工作經驗 */
export const experience = [
  {
    period: "2024 — Present",
    role: "獨立研究者 / 體驗策略研究顧問",
    body: "研究與策略顧問、自主研究、教學與研究陪跑",
  },
  {
    period: "2019 — 2024",
    role: "UX 研究員 / 研究副總監",
    body: "曾任體驗顧問公司研究副總監，參與並帶領跨產業研究與策略專案",
  },
];

export const industries = [
  "金融",
  "數位實體服務串接",
  "電商",
  "文化內容",
  "媒體",
  "教育",
  "公共服務",
  "ESG",
];

/** 04 — 教學經驗 */
export const teaching = [
  {
    no: "一",
    title: "使用者研究與訪談",
    body: "研究問題、訪談技巧、質性研究與洞察形成",
  },
  {
    no: "二",
    title: "AI × Research",
    body: "AI 如何參與研究、資料整理與分析，同時保留身為人類的判斷",
  },
  {
    no: "三",
    title: "從洞察到商業價值",
    body: "如何讓 Findings 不只停在報告，而是進入產品、策略與決策",
  },
];

/**
 * 04 — Selected Talks & Slides
 * website-plan.md 註記「整理三場」但尚未填內容。
 * 請補上 title / venue / note / slidesUrl；留空的項目不會被 render。
 */
export const talks = [
  { title: "", venue: "", note: "", slidesUrl: "" }, // TODO
  { title: "", venue: "", note: "", slidesUrl: "" }, // TODO
  { title: "", venue: "", note: "", slidesUrl: "" }, // TODO
];

/** 05 — 什麼情況適合找我 */
export const reachOutFit = [
  "方向很多，但不知道真正的問題在哪裡",
  "團隊手上有很多資料、有各自不同的觀察與假設，需要重新釐清問題",
  "知道使用者做了什麼，卻不知道為什麼",
  "數據看得到行為，卻看不懂、看不出背後的動機",
  "已經做過不少研究、數據也很多，卻不知道下一步怎麼走",
  "想和顧客建立更深的關係，但不是只有複製市場上的成功公式",
  "甚至，你們開始懷疑，大家正在花大量力氣，處理錯誤的問題",
];

export const reachOutNotFit = [
  "問題與解法都已經非常明確，只需要快速執行",
  "已經決定方向，只需要研究替既有決策背書",
  "目前沒有空間重新檢視問題或調整方向",
];

/** 06 — Work with me */
export const services = [
  {
    no: "01",
    title: "深度研究洞察",
    points: [
      "當你需要真實理解一群人，不想用推測，或純粹用 AI 推敲需求",
      "從研究問題、研究設計、訪談到洞察與策略建議",
    ],
  },
  {
    no: "02",
    title: "策略藍圖諮詢",
    points: [
      "你們手上有很多資訊，但需要有人把它們拼起來",
      "協助團隊整理既有研究、數據、客戶聲音與內部觀點，找出真正的問題與下一步",
    ],
  },
  {
    no: "03",
    title: "短期研究夥伴",
    points: [
      "團隊有研究能力需求，但不需要一位全職的研究者",
      "以階段性顧問、研究夥伴方式加入團隊",
    ],
  },
  {
    no: "04",
    title: "演講、工作坊與企業內訓",
    points: [
      "團隊想要自主學習研究與觀察能力、如何與 AI 共同協作",
      "以講座、互動式工作坊方式，帶領學習活動",
    ],
  },
];

/**
 * 07 — Questions I Explore
 * 三個 lenses 取自 docs/content-architecture.md（原文照錄）。
 */
export const lenses = [
  {
    name: "Systems",
    pair: "People × Systems",
    question: "人如何與我們創造的系統相處？",
    scope: "產品、服務、科技、制度、商業模式、AI、金融、教育、公共服務",
  },
  {
    name: "Culture",
    pair: "People × Culture",
    question: "人如何透過故事與文化產生連結？",
    scope: "故事、角色、作品、BL / GL、IP、粉絲文化、收藏、應援、社群與內容消費",
  },
  {
    name: "Self",
    pair: "People × Self",
    question: "人如何理解自己的經驗與選擇？",
    scope: "工作、閱讀、自由工作、創作、AI 時代的自我、生命經驗與個人反思",
  },
];
