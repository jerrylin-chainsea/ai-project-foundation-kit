import { useEffect, useRef } from 'react';

export default function OpsParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let points = [];
    let raf = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * window.devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(height * window.devicePixelRatio));
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      const gap = width < 720 ? 58 : 72;
      points = [];
      for (let y = 24; y < height; y += gap) {
        for (let x = 20; x < width; x += gap) {
          points.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.12)';
      ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';

      points.forEach((point, index) => {
        if (!reduceMotion) {
          const dx = point.x - pointer.x;
          const dy = point.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 120) {
            const force = (120 - distance) / 120;
            point.vx += (dx / (distance || 1)) * force * 1.8;
            point.vy += (dy / (distance || 1)) * force * 1.8;
          }
          point.vx += (point.ox - point.x) * 0.018;
          point.vy += (point.oy - point.y) * 0.018;
          point.vx *= 0.86;
          point.vy *= 0.86;
          point.x += point.vx;
          point.y += point.vy;
        }

        const right = points[index + 1];
        if (right && Math.abs(right.oy - point.oy) < 2) {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(right.x, right.y);
          ctx.stroke();
        }
        ctx.fillRect(point.x - 1.5, point.y - 1.5, 3, 3);
      });

      raf = requestAnimationFrame(draw);
    }

    function handlePointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    }

    function handlePointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return <canvas className="ops-particle-field" ref={canvasRef} aria-hidden="true" />;
}
