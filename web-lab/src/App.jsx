import { useState } from 'react';
import { brand, courseModules, stats, workflow, tabs, checkpoints } from './data.js';
import WarehouseScene from './WarehouseScene.jsx';
import WarehouseAdmin from './WarehouseAdmin.jsx';
import OrderFlow from './OrderFlow.jsx';
import Dashboard from './Dashboard.jsx';

function ModuleCard({ code, title, desc, output }) {
  return (
    <article className="module-card">
      <span className="module-code">{code}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
      <strong>{output}</strong>
    </article>
  );
}

function HomePage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="site-page">
      <header className="site-hero">
        <WarehouseScene />
        <div className="hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow solid">AI Project Foundation Kit</p>
          <p className="brand-kicker">{brand.badge}</p>
          <h1>{brand.name}</h1>
          <p className="hero-copy">{brand.tagline}</p>
          <a className="primary-link" href="#course-map">
            {brand.cta}
          </a>
        </div>
        <section className="hero-metrics" aria-label="課程與系統數字">
          {stats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>
      </header>

      <main className="site-main">
        <section className="mission-band">
          <p>{brand.description}</p>
        </section>

        <section className="module-grid" id="course-map" aria-label="四堂課主線">
          {courseModules.map((module) => (
            <ModuleCard key={module.code} {...module} />
          ))}
        </section>

        <section className="flow-band">
          <div>
            <p className="eyebrow solid">delivery loop</p>
            <h2>這門課只練一條可交付流程</h2>
          </div>
          <div className="flow-steps">
            {workflow.map((step, index) => (
              <span key={step}>
                {String(index + 1).padStart(2, '0')} / {step}
              </span>
            ))}
          </div>
        </section>

        <section className="insight-section">
          <div className="side-tabs" role="tablist" aria-label="技術主軸">
            {tabs.map((tab) => (
              <button
                className={tab.id === activeTab ? 'active' : ''}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          <article className="insight-panel">
            <span>{currentTab.label}</span>
            <h2>{currentTab.title}</h2>
            <p>{currentTab.body}</p>
          </article>
        </section>

        <section className="acceptance-band">
          <p className="eyebrow solid">acceptance</p>
          <h2>學生不是交一張漂亮圖，而是交可驗證證據</h2>
          <ul>
            {checkpoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

const views = {
  home: { label: '品牌入口', component: <HomePage /> },
  admin: { label: '倉儲後台', component: <WarehouseAdmin /> },
  orders: { label: '訂單可視化', component: <OrderFlow /> },
  line: { label: 'LINE 推播中心', component: <Dashboard /> },
};

export default function App() {
  const [view, setView] = useState('home');

  return (
    <>
      <nav className="topnav" aria-label="頁面切換">
        {Object.entries(views).map(([key, item]) => (
          <button
            className={view === key ? 'active' : ''}
            key={key}
            onClick={() => setView(key)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
      {views[view].component}
    </>
  );
}
