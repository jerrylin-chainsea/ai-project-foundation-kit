// reactbits 風格的共用視覺元件（動態文字、背景、卡片互動）。
// 依 reactbits.dev 的 JS-CSS 寫法手刻，本檔沒有外部 UI 套件依賴，只用 framer-motion 做數字動畫。
import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

export function GradientText({ children, colors = ['#f97316', '#2dd4bf', '#f97316'], speed = 6, className = '' }) {
  return (
    <span
      className={`gradient-text ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
        animationDuration: `${speed}s`,
      }}
    >
      {children}
    </span>
  );
}

export function CountUp({ value, duration = 1.2, format }) {
  const ref = useRef(null);
  const formatFn = format || ((n) => Math.round(n).toLocaleString('zh-TW'));

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = formatFn(latest);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>0</span>;
}

export function SpotlightCard({ children, className = '', spotColor = 'rgba(45, 212, 191, 0.28)' }) {
  const divRef = useRef(null);

  function handleMouseMove(event) {
    const div = divRef.current;
    if (!div) return;
    const rect = div.getBoundingClientRect();
    div.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    div.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={divRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      style={{ '--spot-color': spotColor }}
    >
      {children}
    </div>
  );
}

export function TiltedCard({ children, className = '', maxTilt = 8 }) {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  function handleMouseMove(event) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * maxTilt * 2;
    const ry = (px - 0.5) * maxTilt * 2;
    setStyle({ transform: `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)` });
  }

  function handleMouseLeave() {
    setStyle({ transform: 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)' });
  }

  return (
    <div
      ref={ref}
      className={`tilted-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      {children}
    </div>
  );
}

export function GlareHover({ children, className = '' }) {
  return (
    <div className={`glare-hover ${className}`}>
      {children}
      <span className="glare-sweep" aria-hidden="true" />
    </div>
  );
}

export function Aurora({ className = '' }) {
  return (
    <div className={`aurora-bg ${className}`} aria-hidden="true">
      <span className="aurora-blob b1" />
      <span className="aurora-blob b2" />
      <span className="aurora-blob b3" />
    </div>
  );
}
