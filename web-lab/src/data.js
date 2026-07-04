// 這個檔案放「網站要顯示的資料」。
// 改這裡的文字,畫面就會跟著變 —— 不用會寫程式,也看得懂。
// (上面那片會動的海灘是 Beach.jsx 畫的,你今天不用改它。)

export const shop = {
  name: 'Codex 驗收小店',
  tagline: '靠海的手作選物 — 把每天的營運,交給看得懂資料的 AI 店員',
  description:
    '這是給 U11 學生練習的一間「會長大的店」。你會改資料、看畫面即時變化、請 AI 小範圍安全修改,最後用 Git 驗收 —— 一步步把它養成你自己的作品。',
  cta: '看看今天要做出的成果',
};

export const products = [
  { id: 1, emoji: '🍪', title: '海鹽手工餅乾', desc: '招牌款。鹹甜微脆,配咖啡剛剛好。', price: 'NT$120' },
  { id: 2, emoji: '☕', title: '手沖耳掛咖啡', desc: '淺中焙,帶點海風般的果酸。', price: 'NT$180' },
  { id: 3, emoji: '🕯️', title: '香氛蠟燭', desc: '海鹽與雪松調,點起來像坐在沙灘。', price: 'NT$260' },
  { id: 4, emoji: '🧺', title: '選物提袋', desc: '帆布材質,裝得下一整個週末。', price: 'NT$320' },
];

export const stats = [
  { value: '4', label: '堂課' },
  { value: '10+', label: '次動手' },
  { value: '1', label: '會長大的店' },
];

export const workflow = [
  '打開專案',
  '跑起網站',
  '請 AI 先讀',
  '看計畫',
  '小範圍修改',
  'git diff 驗收',
];

export const tabs = [
  {
    id: 'web',
    label: '網站成果',
    title: '一眼看起來像一間店,而不是三張空白卡片',
    body:
      '首頁有會動的海灘主視覺、商品卡、流程區與響應式版面。學生主要改 data.js —— 店名、商品、文案,不用先懂 React 細節。',
  },
  {
    id: 'ai',
    label: 'AI 分工',
    title: '網頁版想清楚,專案型工具真的動手',
    body:
      'ChatGPT / Claude 網頁版用來發想、整理、解釋、改寫。Claude Code / Codex 用來讀專案、改檔、跑指令、看 diff、debug。',
  },
  {
    id: 'teacher',
    label: '老師控場',
    title: '每一步都有固定 prompt、固定操作、固定驗收',
    body:
      '學生不自由發想。老師每 10 到 15 分鐘帶一次操作,全班看到同一個結果再往下走。',
  },
];

export const checkpoints = [
  'localhost 首頁打得開,看得到會動的海灘',
  '改 data.js 店名,招牌即時熱更新',
  'AI 修改後 git diff 只看到預期變更',
];
