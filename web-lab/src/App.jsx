import { useState } from 'react';
import { shop, products, stats, workflow, tabs, checkpoints } from './data.js';
import Beach from './Beach.jsx';
import Dashboard from './Dashboard.jsx';

// 一張商品卡。畫面上有四張,就是用這個做出來的。
function ProductCard({ emoji, title, desc, price }) {
  return (
    <article className="card">
      <div className="card-emoji">{emoji}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-desc">{desc}</p>
      <span className="card-price">{price}</span>
    </article>
  );
}

// 首頁(海風小店)。重要文字都來自 data.js,新手主要改那裡。
function HomePage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="page">
      {/* 上半:會動的海灘主視覺,店招疊在上面 */}
      <header className="hero">
        <Beach />
        <div className="hero-inner">
          <p className="eyebrow">U11 · 養大你自己的 AI 小店</p>
          <div className="sign">
            <span className="sign-emoji">🏖️</span>
            <h1 className="hero-title">{shop.name}</h1>
          </div>
          <p className="hero-tagline">{shop.tagline}</p>
          <a className="hero-button" href="#outcomes">{shop.cta}</a>

          <section className="stats" aria-label="課程數字">
            {stats.map((item) => (
              <div className="stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </section>
        </div>
        <div className="hero-fade" />
      </header>

      <main>
        <section className="intro">
          <p>{shop.description}</p>
        </section>

        <section className="grid" id="outcomes" aria-label="四堂課完成物">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </section>

        <section className="panel">
          <div>
            <p className="eyebrow">fixed flow</p>
            <h2>每次都照同一條路走</h2>
          </div>
          <div className="steps">
            {workflow.map((step, index) => (
              <span className="step" key={step}>
                {index + 1}. {step}
              </span>
            ))}
          </div>
        </section>

        <section className="split">
          <div className="tabs" role="tablist" aria-label="內容切換">
            {tabs.map((tab) => (
              <button
                className={tab.id === activeTab ? 'tab active' : 'tab'}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          <article className="tab-panel">
            <h2>{currentTab.title}</h2>
            <p>{currentTab.body}</p>
          </article>
        </section>

        <section className="checklist">
          <p className="eyebrow">acceptance</p>
          <h2>打開首頁,你應該能驗收這三件事</h2>
          <ul>
            {checkpoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="foot">© 2026 {shop.name}・這是教學用的範例網站</footer>
    </div>
  );
}

// 整個 app:上方兩顆切換鈕,下面是「首頁」或「營運異常 Dashboard」。
export default function App() {
  const [view, setView] = useState('shop');

  return (
    <>
      <nav className="topnav" aria-label="頁面切換">
        <button
          className={view === 'shop' ? 'active' : ''}
          onClick={() => setView('shop')}
          type="button"
        >
          海風小店
        </button>
        <button
          className={view === 'dashboard' ? 'active' : ''}
          onClick={() => setView('dashboard')}
          type="button"
        >
          營運異常 Dashboard
        </button>
      </nav>
      {view === 'shop' ? <HomePage /> : <Dashboard />}
    </>
  );
}
