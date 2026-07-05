// 這個檔案放「首頁要顯示的資料」。
// C1 初學者只改這裡，就能看到畫面熱更新，不需要碰 React 元件與 three.js 場景。

export const brand = {
  name: 'NOVA WAREHOUSE｜AI OPERATIONS CONTROL TOWER',
  badge: 'AI OPERATIONS CONTROL TOWER',
  tagline: '把訂單、庫存、異常通知與交付驗收收進同一個控制台。',
  description:
    '這不是一個展示型小網頁，而是一個會一路延伸到後台、API、LINE OA、MCP 與個人技術紀錄的企業程式開發練習包。學生在同一個 repo 裡學會接手、規劃、修改、驗證與說明。 ',
  cta: '查看四堂課主線',
};

export const courseModules = [
  {
    code: 'C1',
    title: '接手專案與 Git 工作流',
    desc: 'VS Code、Git、Gitflow、Claude Code、Codex。學生從老師給的 repo 開始，學會讀專案、跑起來、看 diff、做 commit。',
    output: '可運作 repo + 第一次安全修改',
  },
  {
    code: 'C2',
    title: '倉儲後台與 agent 守則',
    desc: 'AGENTS.md、CLAUDE.md、Plan Mode、規劃 -> 開發 -> 驗證。用小範圍挖洞任務補強後台管理系統。',
    output: '後台功能變更 + reviewer 驗收',
  },
  {
    code: 'C3',
    title: '訂單可視化與 LINE OA',
    desc: '理解 components、CSS、src、API、webhook、token 與前後端邊界。用推播中心產 Flex Message 並 mock/真送。',
    output: '訂單狀態畫面 + Flex payload',
  },
  {
    code: 'C4',
    title: 'MCP / Skills / 技術紀錄',
    desc: 'Context7 查文件、Chrome DevTools 驗收、Codebase Memory 讀專案，最後整理成 Astro 個人 blog 與成果說明。',
    output: 'MCP 驗收截圖 + 技術 blog',
  },
];

export const stats = [
  { value: '16h', label: '四堂實作' },
  { value: '1 repo', label: '同一條主線' },
  { value: '4 outputs', label: '每堂可驗收' },
];

export const workflow = [
  '讀專案',
  '開分支',
  '寫計畫',
  '小範圍改',
  '跑驗證',
  '看 diff',
  '人審',
  'commit',
];

export const tabs = [
  {
    id: 'system',
    label: '系統感',
    title: '畫面要像企業後台，不像 AI 隨手拼的範本',
    body:
      '首頁用倉儲控制塔建立情境，後台用真實營運欄位呈現商品貨號、訂單、區域水位、風險金額與下一步。所有畫面都要能對應到資料與驗收，不用空泛口號填版面。',
  },
  {
    id: 'agent',
    label: 'AI 分工',
    title: 'AI coding agent 被流程管理，而不是自由發揮',
    body:
      'AGENTS.md、CLAUDE.md、Plan Mode、allowed files、reviewer prompt 都是課程核心。學生要學會讓 AI 先讀、先規劃、再改，最後用 build、diff、畫面與人審收斂。',
  },
  {
    id: 'platform',
    label: '平台整合',
    title: 'API 與 token 邊界要講清楚，不能只做漂亮 demo',
    body:
      'C3 的推播按鈕只打本機後端，token 留在 line-lab/.env；LINE Flex 先 mock、再人工審核。這讓學生看得懂前端、後端、payload 與平台安全邊界。',
  },
  {
    id: 'portfolio',
    label: '技術表達',
    title: '最後要能說明自己怎麼拆題、怎麼驗證、怎麼交付',
    body:
      'C4 用 MCP/skills 做小型應用，再把倉儲系統、驗收截圖、技術筆記與踩坑整理成 Astro blog。重點不是炫技，而是讓媒合企業看得出學生有思考過。',
  },
];

export const checkpoints = [
  '首頁、後台、訂單可視化、LINE 推播中心都能在同一個 repo 打開',
  '每堂課都有畫面、輸出、diff、build 或 reviewer 的明確驗收',
  'token 不進前端；真送與自動化都保留人工審核與 mock 保底',
];

// 舊講義若還引用 shop/products，也能暫時運作；正式講義會改成 brand/courseModules。
export const shop = brand;
export const products = courseModules;
