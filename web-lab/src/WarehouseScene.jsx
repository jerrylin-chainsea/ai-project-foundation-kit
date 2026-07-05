// 倉儲控制塔的 three.js 場景。
// C1 學生不需要修改這支檔案；首頁文字與課程卡片集中在 data.js。
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function makeLabelTexture(text, bg = '#111827', fg = '#f8fafc') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = fg;
  ctx.font = '700 44px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  return new THREE.CanvasTexture(canvas);
}

function createLabel(text, position, scale = [3.6, 1.1, 1]) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: makeLabelTexture(text),
      transparent: true,
      depthWrite: false,
    }),
  );
  sprite.position.set(...position);
  sprite.scale.set(...scale);
  return sprite;
}

export default function WarehouseScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0f18');
    scene.fog = new THREE.Fog('#0a0f18', 24, 78);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 160);
    camera.position.set(10, 8, 18);
    camera.lookAt(0, 2.2, -1.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    scene.add(new THREE.HemisphereLight('#b8fff5', '#111827', 0.75));
    const key = new THREE.DirectionalLight('#fff7df', 2.1);
    key.position.set(-8, 14, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, { left: -28, right: 28, top: 28, bottom: -28, near: 1, far: 80 });
    scene.add(key);

    const fill = new THREE.PointLight('#39d7c8', 2.3, 34);
    fill.position.set(8, 5, 8);
    scene.add(fill);

    const mat = (color, roughness = 0.72, metalness = 0.05) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 58),
      new THREE.MeshStandardMaterial({ color: '#101722', roughness: 0.86, metalness: 0.1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(64, 32, '#1f766f', '#263443');
    grid.position.y = 0.015;
    scene.add(grid);

    const rackMat = mat('#162233', 0.56, 0.25);
    const beamMat = mat('#2dd4bf', 0.44, 0.2);
    const cartonMat = mat('#c98b4a', 0.82, 0.02);
    const coldMat = mat('#64d2ff', 0.68, 0.05);
    const alertMat = mat('#f97316', 0.65, 0.02);

    function addRack(x, z, label, accent) {
      const rack = new THREE.Group();
      rack.position.set(x, 0, z);
      for (let level = 0; level < 4; level += 1) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.16, 1.4), rackMat);
        shelf.position.y = 0.7 + level * 1.25;
        shelf.castShadow = true;
        shelf.receiveShadow = true;
        rack.add(shelf);
        for (let i = 0; i < 4; i += 1) {
          const box = new THREE.Mesh(
            new THREE.BoxGeometry(0.82, 0.52, 0.86),
            (i + level) % 5 === 0 ? alertMat : (i + level) % 3 === 0 ? coldMat : cartonMat,
          );
          box.position.set(-2.15 + i * 1.4, 1.04 + level * 1.25, 0.03);
          box.castShadow = true;
          box.receiveShadow = true;
          rack.add(box);
        }
      }
      for (const px of [-2.9, 2.9]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 5.5, 0.18), beamMat);
        post.position.set(px, 2.7, -0.72);
        post.castShadow = true;
        rack.add(post);
      }
      rack.add(createLabel(label, [0, 5.85, -0.9], [2.6, 0.8, 1]));
      const signal = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 14), mat(accent, 0.35, 0.25));
      signal.position.set(2.7, 5.35, -0.85);
      rack.add(signal);
      scene.add(rack);
      return rack;
    }

    const racks = [
      addRack(-8, -7, 'A01', '#22c55e'),
      addRack(0, -7, 'B12', '#f97316'),
      addRack(8, -7, 'C08', '#38bdf8'),
      addRack(-8, 0, 'D04', '#facc15'),
      addRack(0, 0, 'E19', '#22c55e'),
      addRack(8, 0, 'F03', '#f97316'),
    ];

    const conveyor = new THREE.Group();
    scene.add(conveyor);
    const belt = new THREE.Mesh(
      new THREE.BoxGeometry(22, 0.24, 2.4),
      new THREE.MeshStandardMaterial({ color: '#222f3f', roughness: 0.5, metalness: 0.25 }),
    );
    belt.position.set(0, 0.22, 7);
    belt.castShadow = true;
    belt.receiveShadow = true;
    conveyor.add(belt);
    for (let i = 0; i < 11; i += 1) {
      const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 2.55, 16), mat('#73808c', 0.34, 0.35));
      roller.rotation.x = Math.PI / 2;
      roller.position.set(-10 + i * 2, 0.46, 7);
      roller.castShadow = true;
      conveyor.add(roller);
    }

    const parcels = [];
    for (let i = 0; i < 6; i += 1) {
      const parcel = new THREE.Mesh(
        new THREE.BoxGeometry(1.05, 0.72, 1.0),
        i % 2 === 0 ? cartonMat : coldMat,
      );
      parcel.position.set(-9 + i * 3.8, 1, 7);
      parcel.rotation.y = i * 0.24;
      parcel.castShadow = true;
      parcel.receiveShadow = true;
      scene.add(parcel);
      parcels.push(parcel);
    }

    const scanner = new THREE.Group();
    scanner.position.set(4.4, 0, 7);
    scene.add(scanner);
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.4, 0.2), mat('#2dd4bf', 0.38, 0.2));
    const frameRight = frameLeft.clone();
    frameLeft.position.set(-1.2, 1.7, 0);
    frameRight.position.set(1.2, 1.7, 0);
    scanner.add(frameLeft, frameRight);
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.2, 0.2), mat('#2dd4bf', 0.38, 0.2));
    frameTop.position.set(0, 3.35, 0);
    scanner.add(frameTop);
    const scanBeam = new THREE.Mesh(
      new THREE.PlaneGeometry(2.25, 2.8),
      new THREE.MeshBasicMaterial({ color: '#2dd4bf', transparent: true, opacity: 0.26, side: THREE.DoubleSide }),
    );
    scanBeam.position.set(0, 1.75, 0);
    scanBeam.rotation.y = Math.PI / 2;
    scanner.add(scanBeam);

    const agv = new THREE.Group();
    const agvBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.38, 1.25), mat('#e5edf5', 0.46, 0.1));
    agvBase.position.y = 0.33;
    agvBase.castShadow = true;
    agv.add(agvBase);
    const agvLoad = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.7, 0.95), alertMat);
    agvLoad.position.y = 0.94;
    agvLoad.castShadow = true;
    agv.add(agvLoad);
    agv.position.set(-5, 0, 11);
    scene.add(agv);

    const routeMaterial = new THREE.LineBasicMaterial({ color: '#2dd4bf', transparent: true, opacity: 0.75 });
    const routePoints = [
      new THREE.Vector3(-10, 0.05, 11),
      new THREE.Vector3(-5, 0.05, 11),
      new THREE.Vector3(1, 0.05, 9),
      new THREE.Vector3(9, 0.05, 7),
    ];
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(routePoints), routeMaterial));

    const labels = [
      createLabel('128 active orders', [-10.2, 5.3, 7.8], [3.7, 1.0, 1]),
      createLabel('6 SKU at risk', [0.5, 6.7, -11.4], [3.1, 0.9, 1]),
      createLabel('LINE OA ready', [10.5, 4.8, 5.8], [3.2, 0.9, 1]),
    ];
    labels.forEach((label) => scene.add(label));

    const clock = new THREE.Clock();
    let raf = 0;

    function frame() {
      const t = clock.elapsedTime;
      parcels.forEach((parcel, index) => {
        parcel.position.x = ((t * 1.8 + index * 3.8) % 22) - 11;
        parcel.rotation.y += 0.009;
        parcel.position.y = 0.98 + Math.sin(t * 2.2 + index) * 0.035;
      });
      agv.position.x = Math.sin(t * 0.5) * 8.5;
      agv.rotation.y = Math.sin(t * 0.5) > 0 ? 0.08 : -0.08;
      scanBeam.material.opacity = 0.16 + Math.abs(Math.sin(t * 2.5)) * 0.2;
      racks.forEach((rack, index) => {
        rack.rotation.y = Math.sin(t * 0.18 + index) * 0.015;
      });
      labels.forEach((label, index) => {
        label.position.y += Math.sin(t * 1.5 + index) * 0.0009;
      });
      camera.position.x = 10 + Math.sin(t * 0.14) * 1.4;
      camera.position.y = 8 + Math.sin(t * 0.21) * 0.3;
      camera.lookAt(0, 2.2, -1.5);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }

    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      clock.start();
      raf = requestAnimationFrame(frame);
    }

    function onResize() {
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || 560;
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

  return <div className="warehouse-canvas" ref={mountRef} aria-hidden="true" />;
}
