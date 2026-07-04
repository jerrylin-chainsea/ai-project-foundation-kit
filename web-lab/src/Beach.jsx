// 🏖️ 海風小店的「晴天海灘」three.js 場景。
// 這支檔案只管「動畫長相」。畫面上會動的海浪、飄的雲、飛過的海鷗、
// 沙灘上的遮陽傘小店，全都是這裡用程式畫出來的。
//
// 新手看不懂沒關係：改店名、改商品是去 data.js；這裡是「背景動畫」。
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Beach() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || 480;

    // ── 場景 / 相機 / 渲染器 ───────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#afe3ff'); // 晴天藍
    scene.fog = new THREE.Fog('#c7ecff', 34, 78);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
    camera.position.set(0, 6.2, 16);
    camera.lookAt(0, 2.4, -2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';

    // ── 燈光:天空光 + 太陽平行光 ─────────────────────────
    scene.add(new THREE.HemisphereLight('#eaf7ff', '#f4e2b8', 1.05));
    const sun = new THREE.DirectionalLight('#fff4d6', 1.35);
    sun.position.set(-9, 14, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 60;
    Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22 });
    sun.shadow.radius = 5;
    scene.add(sun);

    const mat = (c, r = 0.9, m = 0) =>
      new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });

    // ── 太陽(圓盤 + 光暈)────────────────────────────────
    const sunDisc = new THREE.Mesh(
      new THREE.CircleGeometry(2.1, 40),
      new THREE.MeshBasicMaterial({ color: '#fff2c2' }),
    );
    sunDisc.position.set(-13, 12, -30);
    scene.add(sunDisc);
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = glowCanvas.height = 128;
    const gctx = glowCanvas.getContext('2d');
    const grad = gctx.createRadialGradient(64, 64, 8, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,244,200,0.95)');
    grad.addColorStop(1, 'rgba(255,244,200,0)');
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, 128, 128);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, depthWrite: false }),
    );
    glow.scale.set(11, 11, 1);
    glow.position.copy(sunDisc.position);
    glow.position.z = -29.5;
    scene.add(glow);

    // ── 海洋(頂點正弦波動)────────────────────────────────
    const seaGeo = new THREE.PlaneGeometry(90, 60, 60, 40);
    seaGeo.rotateX(-Math.PI / 2);
    const seaMat = new THREE.MeshStandardMaterial({
      color: '#1f9fd0', roughness: 0.35, metalness: 0.15, flatShading: true,
    });
    const sea = new THREE.Mesh(seaGeo, seaMat);
    sea.position.set(0, -0.2, -14);
    sea.receiveShadow = true;
    scene.add(sea);
    const seaBase = seaGeo.attributes.position.array.slice(); // 記住原始位置

    // ── 沙灘(前景)+ 一條浪花線 ─────────────────────────
    const sand = new THREE.Mesh(new THREE.PlaneGeometry(90, 34), mat('#f6e3b4', 1));
    sand.rotation.x = -Math.PI / 2;
    sand.position.set(0, 0, 11);
    sand.receiveShadow = true;
    scene.add(sand);
    const foam = new THREE.Mesh(new THREE.PlaneGeometry(90, 2.4), new THREE.MeshBasicMaterial({ color: '#eafbff' }));
    foam.rotation.x = -Math.PI / 2;
    foam.position.set(0, 0.02, -5.6);
    scene.add(foam);

    // ── 遮陽傘小店(= 你的店)─────────────────────────────
    const shop = new THREE.Group();
    shop.position.set(2.4, 0, 5.5);
    scene.add(shop);
    // 攤位檯面
    const counter = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.2, 1.6), mat('#e9c98f'));
    counter.position.y = 0.6; counter.castShadow = true; counter.receiveShadow = true; shop.add(counter);
    const counterTop = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.22, 1.9), mat('#c98a4a'));
    counterTop.position.y = 1.3; counterTop.castShadow = true; shop.add(counterTop);
    // 傘柱
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 5.4, 12), mat('#b8895a'));
    pole.position.set(0, 2.7, 0); pole.castShadow = true; shop.add(pole);
    // 條紋傘(橘白相間)
    const canopy = new THREE.Group();
    canopy.position.y = 5.0; shop.add(canopy);
    const petals = 10;
    for (let i = 0; i < petals; i++) {
      const seg = new THREE.Mesh(
        new THREE.CircleGeometry(2.7, 24, (i / petals) * Math.PI * 2, (Math.PI * 2) / petals),
        new THREE.MeshStandardMaterial({ color: i % 2 ? '#e2570d' : '#fff6ee', roughness: 0.85, side: THREE.DoubleSide }),
      );
      seg.rotation.x = -Math.PI / 2;
      canopy.add(seg);
    }
    // 傘的小圓頂
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), mat('#e2570d'));
    knob.position.y = 5.2; shop.add(knob);
    // 商品箱 + 小旗
    const box1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), mat('#7bb661'));
    box1.position.set(-2.2, 0.35, 0.4); box1.rotation.y = 0.3; box1.castShadow = true; shop.add(box1);
    const box2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), mat('#f0b429'));
    box2.position.set(-2.0, 0.3, -0.5); box2.rotation.y = -0.4; box2.castShadow = true; shop.add(box2);

    // ── 沙灘小物:另一支彩色小傘 + 幾顆石頭 ───────────────
    const parasol2 = new THREE.Group(); parasol2.position.set(-6.5, 0, 7);
    const p2pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.2, 10), mat('#b8895a'));
    p2pole.position.y = 1.6; p2pole.rotation.z = 0.16; p2pole.castShadow = true; parasol2.add(p2pole);
    const p2top = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.8, 16), mat('#2f9fd0', 0.8));
    p2top.position.set(0.26, 3.2, 0); p2top.castShadow = true; parasol2.add(p2top);
    scene.add(parasol2);
    for (const [x, z, s, c] of [[-4.5, 8.5, 0.35, '#c9c2b4'], [5.5, 9, 0.4, '#b8b0a0'], [-1, 9.4, 0.28, '#d8d0c0']]) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(s), mat(c, 1));
      rock.position.set(x, s * 0.6, z); rock.castShadow = true; scene.add(rock);
    }

    // ── 雲(扁球群,飄動)──────────────────────────────────
    const clouds = [];
    const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, metalness: 0 });
    function makeCloud(x, y, z, s) {
      const g = new THREE.Group();
      for (const [dx, dy, r] of [[-1.1, 0, 0.9], [0, 0.25, 1.25], [1.15, -0.05, 0.95], [0.2, -0.35, 0.85]]) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 12), cloudMat);
        puff.position.set(dx, dy, 0); puff.scale.y = 0.72; g.add(puff);
      }
      g.position.set(x, y, z); g.scale.setScalar(s);
      scene.add(g); clouds.push(g);
    }
    makeCloud(-8, 11, -24, 1.5);
    makeCloud(7, 13, -30, 2.1);
    makeCloud(15, 10, -20, 1.2);

    // ── 海鷗(飛過天空的 V 形小鳥)────────────────────────
    const gulls = [];
    function makeGull(offset, speed, y, z) {
      const g = new THREE.Group();
      const wingGeo = new THREE.BoxGeometry(1.3, 0.06, 0.28);
      const wingMat = mat('#4a4a52', 1);
      const wl = new THREE.Mesh(wingGeo, wingMat); wl.position.x = -0.65;
      const wr = new THREE.Mesh(wingGeo, wingMat); wr.position.x = 0.65;
      g.add(wl, wr);
      g.position.set(0, y, z);
      scene.add(g);
      gulls.push({ g, wl, wr, offset, speed, y, z });
    }
    makeGull(0, 0.55, 9, -18);
    makeGull(2.1, 0.42, 11.5, -24);
    makeGull(4.3, 0.6, 8, -14);

    // ── 動畫迴圈 ──────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf = 0;
    const seaPos = seaGeo.attributes.position;

    function updateWaves(t) {
      for (let i = 0; i < seaPos.count; i++) {
        const x = seaBase[i * 3];
        const z = seaBase[i * 3 + 2];
        const y = Math.sin(x * 0.35 + t * 1.1) * 0.35 + Math.sin(z * 0.5 + t * 0.9) * 0.28;
        seaPos.setY(i, y);
      }
      seaPos.needsUpdate = true;
      seaGeo.computeVertexNormals();
    }

    function frame() {
      const t = clock.elapsedTime;
      updateWaves(t);
      // 雲橫向飄,飄出畫面就繞回來
      for (const c of clouds) {
        c.position.x += 0.012;
        if (c.position.x > 22) c.position.x = -22;
      }
      // 海鷗繞飛 + 拍翅
      for (const gl of gulls) {
        const a = t * gl.speed + gl.offset;
        gl.g.position.x = Math.sin(a) * 13;
        gl.g.position.y = gl.y + Math.sin(a * 2) * 0.6;
        gl.g.rotation.y = Math.cos(a) > 0 ? -0.5 : Math.PI + 0.5;
        const flap = Math.sin(t * 7 + gl.offset) * 0.5;
        gl.wl.rotation.z = flap; gl.wr.rotation.z = -flap;
      }
      // 相機輕輕左右擺,像海風吹過
      camera.position.x = Math.sin(t * 0.12) * 1.6;
      camera.position.y = 6.2 + Math.sin(t * 0.2) * 0.25;
      camera.lookAt(0, 2.4, -2);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }

    // reduced-motion:只畫一張靜態圖,不跑迴圈
    if (reduceMotion) {
      updateWaves(0.6);
      renderer.render(scene, camera);
    } else {
      clock.start();
      raf = requestAnimationFrame(frame);
    }

    // ── 尺寸自適應 ────────────────────────────────────────
    function onResize() {
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || 480;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);
    const ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(mount);

    // ── 清理(元件卸載時釋放資源)─────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
      renderer.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
        }
      });
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="beach-canvas" ref={mountRef} aria-hidden="true" />;
}
