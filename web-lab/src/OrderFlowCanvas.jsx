import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { orders } from './warehouseData.js';

const statusColor = {
  待揀貨: '#38bdf8',
  已揀貨: '#22c55e',
  待出貨: '#f59e0b',
  缺料等待: '#ef4444',
  已出貨: '#94a3b8',
};

function makeTextSprite(text, color = '#0f172a') {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(248,250,252,0.92)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.font = '800 34px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.scale.set(2.8, 0.9, 1);
  return sprite;
}

export default function OrderFlowCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = mount.clientWidth || 900;
    let height = mount.clientHeight || 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8fafc');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.set(0, 9.5, 16);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight('#ffffff', '#dbeafe', 1.2));
    const key = new THREE.DirectionalLight('#ffffff', 1.7);
    key.position.set(-6, 10, 8);
    key.castShadow = true;
    scene.add(key);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 12),
      new THREE.MeshStandardMaterial({ color: '#eef2f6', roughness: 0.9 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const laneMaterial = new THREE.MeshStandardMaterial({ color: '#d8e2ea', roughness: 0.7 });
    const stations = ['接單', '揀貨', '覆核', '出貨'];
    const stationX = [-8, -2.7, 2.7, 8];
    stationX.forEach((x, index) => {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.08, 5.4), laneMaterial);
      plate.position.set(x, 0.04, 0);
      plate.receiveShadow = true;
      scene.add(plate);
      const label = makeTextSprite(stations[index], '#0f766e');
      label.position.set(x, 0.5, -3.7);
      scene.add(label);
    });

    const parcels = orders.map((order, index) => {
      const color = statusColor[order.status] || '#64748b';
      const group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.8, 1.15),
        new THREE.MeshStandardMaterial({ color, roughness: 0.52, metalness: 0.04 }),
      );
      body.castShadow = true;
      group.add(body);
      const label = makeTextSprite(order.id.slice(-3), '#111827');
      label.position.set(0, 1.05, 0);
      label.scale.set(1.45, 0.5, 1);
      group.add(label);
      group.position.set(-8 + index * 1.2, 0.55, -1.8 + index * 1.2);
      scene.add(group);
      return { group, order, offset: index * 1.7 };
    });

    const routeMaterial = new THREE.LineBasicMaterial({ color: '#0f766e', transparent: true, opacity: 0.6 });
    for (let z = -1.8; z <= 1.8; z += 1.2) {
      const points = stationX.map((x) => new THREE.Vector3(x, 0.16, z));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), routeMaterial));
    }

    const clock = new THREE.Clock();
    let raf = 0;

    function frame() {
      const t = clock.elapsedTime;
      parcels.forEach(({ group, order, offset }, index) => {
        const blocked = order.status === '缺料等待';
        const progress = blocked ? 0.08 : ((Math.sin(t * 0.42 + offset) + 1) / 2) * 0.9;
        group.position.x = -8 + progress * 16;
        group.position.z = -1.8 + index * 1.2;
        group.position.y = 0.55 + Math.sin(t * 2 + offset) * 0.04;
        group.rotation.y = blocked ? Math.sin(t * 3) * 0.08 : Math.sin(t * 0.7 + offset) * 0.18;
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(frame);
    }

    function onResize() {
      width = mount.clientWidth || 900;
      height = mount.clientHeight || 360;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);
    const ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
      renderer.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const materials = Array.isArray(o.material) ? o.material : [o.material];
          materials.forEach((m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="order-canvas" ref={mountRef} aria-label="訂單流動 3D 動畫" />;
}
