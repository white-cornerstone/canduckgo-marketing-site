/* CanDuckGo voxel props — direct JS port of the game's VoxelGrid / VoxelDuck /
   VoxelStickerProps (client/Assets/Scripts). Same per-face fake lighting, same
   colours, same coordinates: what you see is what the game builds. */
(function () {

  // ---------------- VoxelGrid (port of VoxelGrid.cs) ----------------
  const DIRS = [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];
  const SHADES = [1, 0.52, 0.8, 0.66, 0.72, 0.88];
  const FACE_CORNERS = [
    [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]],
    [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]],
    [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]],
    [[0, 0, 0], [0, 1, 0], [0, 1, 1], [0, 0, 1]],
    [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]],
    [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]],
  ];

  class VGrid {
    constructor(voxelSize) { this.s = voxelSize; this.cells = new Map(); }
    k(x, y, z) { return x + ',' + y + ',' + z; }
    fill(x, y, z, c) { this.cells.set(this.k(x, y, z), c); }
    fillBox(x0, y0, z0, x1, y1, z1, c) {
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++)
        this.cells.set(this.k(x, y, z), c);
    }
    fillEllipsoid(cx, cy, cz, rx, ry, rz, c) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
        for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
          for (let z = Math.floor(cz - rz); z <= Math.ceil(cz + rz); z++) {
            const dx = (x - cx) / rx, dy = (y - cy) / ry, dz = (z - cz) / rz;
            if (dx * dx + dy * dy + dz * dz <= 1.02) this.cells.set(this.k(x, y, z), c);
          }
    }
    removeBox(x0, y0, z0, x1, y1, z1) {
      for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) for (let z = z0; z <= z1; z++)
        this.cells.delete(this.k(x, y, z));
    }
    build(THREE) {
      const pos = [], col = [], idx = [];
      for (const [key, c] of this.cells) {
        const [x, y, z] = key.split(',').map(Number);
        for (let d = 0; d < 6; d++) {
          if (this.cells.has(this.k(x + DIRS[d][0], y + DIRS[d][1], z + DIRS[d][2]))) continue;
          const sh = SHADES[d];
          const r = Math.min(1, c[0] * sh), g = Math.min(1, c[1] * sh), b = Math.min(1, c[2] * sh);
          const base = pos.length / 3;
          for (const corner of FACE_CORNERS[d]) {
            pos.push((x + corner[0]) * this.s, (y + corner[1]) * this.s, (z + corner[2]) * this.s);
            col.push(r, g, b);
          }
          idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      geo.setIndex(idx);
      return geo;
    }
  }

  function mesh(THREE, grid, mat) { return new THREE.Mesh(grid.build(THREE), mat); }

  // ---------------- shared props ----------------
  const GOLD = [1, 0.78, 0.2];
  const GOLD_GLOW = [1, 0.88, 0.42];

  function insidePoly(poly, px, py) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      if ((poly[i][1] > py) !== (poly[j][1] > py) &&
          px < (poly[j][0] - poly[i][0]) * (py - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
        inside = !inside;
    }
    return inside;
  }

  // VoxelProps.Star — chunky bevelled five-pointed star.
  function starMesh(THREE, mat, size, color) {
    const R = 12;
    const g = new VGrid(size / (R * 2));
    const poly = [];
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? R : R * 0.45;
      const a = (90 + i * 36) * Math.PI / 180;
      poly.push([Math.cos(a) * radius, Math.sin(a) * radius]);
    }
    for (let z = -2; z <= 2; z++) {
      const bevel = 1 - 0.11 * Math.abs(z);
      for (let x = -R; x <= R; x++) for (let y = -R; y <= R; y++)
        if (insidePoly(poly, x / bevel, y / bevel)) g.fill(x, y, z, color);
    }
    return mesh(THREE, g, mat);
  }

  function plusStar(g, x, y, z, c) {
    g.fill(x, y, z, c); g.fill(x - 1, y, z, c); g.fill(x + 1, y, z, c);
    g.fill(x, y - 1, z, c); g.fill(x, y + 1, z, c);
  }

  // ---------------- models (ports of VoxelDuck.cs / VoxelStickerProps.cs) ----------------
  function buildDuck(THREE, mat, group) {
    const V = 0.07;
    const Y = [1, 0.85, 0.25], WY = [0.93, 0.76, 0.18];
    const O = [1, 0.55, 0.15], OD = [0.88, 0.44, 0.1];
    const CR = [0.85, 0.25, 0.25], CRD = [0.7, 0.18, 0.18];
    const ED = [0.12, 0.12, 0.12], EG = [0.98, 0.98, 0.98];
    const body = new VGrid(V);
    body.fillEllipsoid(0, 6, 0, 6.5, 4, 4.3, Y);       // body
    body.fillEllipsoid(-7, 8, 0, 2.2, 1.8, 2.2, Y);    // tail bump
    body.fillEllipsoid(4, 12, 0, 3.4, 3.2, 3.2, Y);    // head
    body.fillBox(7, 11, -1, 10, 12, 1, O);             // beak
    body.fillBox(7, 10, -1, 9, 10, 1, OD);             // lower beak
    body.fill(5, 12, 3, ED); body.fill(5, 12, -3, ED); // eyes
    body.fill(5, 13, 2, EG); body.fill(5, 13, -2, EG); // glints
    body.fillEllipsoid(4, 15.6, 0, 4, 0.9, 4, CR);     // cap brim
    body.fillBox(2, 16, -2, 6, 18, 2, CR);             // cap crown
    body.fillBox(3, 19, -1, 5, 19, 1, CRD);            // cap button
    body.fillBox(0, 0, 1, 4, 1, 4, O);                 // feet
    body.fillBox(0, 0, -4, 4, 1, -1, O);
    group.add(mesh(THREE, body, mat));

    const wings = [0.33, -0.33].map((z) => {
      const pivot = new THREE.Group();
      pivot.position.set(-0.02, 0.62, z);
      const w = new VGrid(V);
      w.fillEllipsoid(0, -2.5, 0, 3.2, 2.6, 1.1, WY);
      pivot.add(mesh(THREE, w, mat));
      group.add(pivot);
      return pivot;
    });
    return { leftWing: wings[0], rightWing: wings[1] };
  }

  function buildTrophy(THREE, mat, group) {
    const g = new VGrid(1 / 14);
    const goldDark = [0.85, 0.62, 0.12];
    g.fillEllipsoid(0, 0.8, 0, 5, 1.2, 5, [0.45, 0.7, 0.95]);
    g.fillBox(-1, 2, -1, 1, 4, 1, goldDark);
    g.fillBox(-2, 4, -2, 2, 5, 2, GOLD);
    g.fillBox(-3, 6, -3, 3, 10, 3, GOLD);
    g.fillBox(-4, 10, -3, 4, 11, 3, GOLD);
    g.fillBox(-6, 8, -1, -4, 9, 1, GOLD);
    g.fillBox(4, 8, -1, 6, 9, 1, GOLD);
    g.fillBox(-6, 7, 0, -5, 7, 0, goldDark);
    g.fillBox(5, 7, 0, 6, 7, 0, goldDark);
    g.fillBox(-1, 3, -2, 1, 3, -2, [0.9, 0.3, 0.3]);
    group.add(mesh(THREE, g, mat));
  }

  function buildShootingStar(THREE, mat, group) {
    const g = new VGrid(1 / 14);
    const stripes = [[0.95, 0.35, 0.35], [1, 0.72, 0.25], [0.45, 0.78, 0.45], [0.4, 0.6, 0.95]];
    for (let t = 0; t < 10; t++) {
      const x = -7 + t;
      const yTop = 4 + Math.floor((t * 2) / 3);
      for (let s = 0; s < stripes.length; s++) g.fillBox(x, yTop - s, -1, x, yTop - s, 0, stripes[s]);
    }
    g.fill(-6, 8, 0, [1, 1, 1]); g.fill(-3, 10, -1, [1, 1, 1]); g.fill(0, 13, 0, [1, 1, 1]);
    group.add(mesh(THREE, g, mat));
    const star = starMesh(THREE, mat, 0.52, GOLD);
    star.position.set(0.3, 0.74, 0);
    group.add(star);
  }

  function buildHeadphones(THREE, mat, group) {
    const g = new VGrid(1 / 14);
    const band = [1, 0.6, 0.2], pad = [0.35, 0.6, 0.95];
    g.fillBox(-6, 8, -1, 6, 9, 1, band);
    g.fillBox(-7, 4, -1, -6, 8, 1, band);
    g.fillBox(6, 4, -1, 7, 8, 1, band);
    g.fillBox(-8, 1, -2, -5, 4, 2, pad);
    g.fillBox(5, 1, -2, 8, 4, 2, pad);
    g.fillBox(-7, 2, -3, -6, 3, -3, [0.9, 0.92, 0.95]);
    g.fillBox(6, 2, -3, 7, 3, -3, [0.9, 0.92, 0.95]);
    group.add(mesh(THREE, g, mat));
  }

  function buildCards(THREE, mat, group) {
    const g = new VGrid(1 / 14);
    const cardA = [0.95, 0.4, 0.35], cardB = [0.35, 0.75, 0.7];
    g.fillBox(-7, 0, 0, 1, 11, 1, cardA);
    g.fillBox(-5, 3, -1, -1, 7, -1, [1, 1, 1]);
    g.fillBox(-1, 0, -2, 7, 11, -1, cardB);
    g.fillBox(1, 3, -3, 5, 7, -3, [1, 1, 1]);
    g.fill(3, 6, -4, GOLD); g.fillBox(2, 5, -4, 4, 5, -4, GOLD); g.fill(3, 4, -4, GOLD);
    g.fill(-4, 6, 1, cardA); g.fill(-2, 6, 1, cardA);
    g.fillBox(-4, 5, 1, -2, 5, 1, cardA);
    g.fill(-3, 4, 1, cardA);
    group.add(mesh(THREE, g, mat));
  }

  function buildAlbum(THREE, mat, group) {
    const g = new VGrid(1 / 14);
    g.fillBox(-5, 0, -1, 5, 12, 2, [0.6, 0.45, 0.9]);
    g.fillBox(-5, 0, 2, 5, 12, 2, [0.45, 0.32, 0.7]);
    g.fillBox(-4, 1, -2, 4, 11, -2, [1, 1, 1]);
    group.add(mesh(THREE, g, mat));
    const star = starMesh(THREE, mat, 0.42, GOLD);
    star.position.set(0, 0.45, -0.18);
    group.add(star);
  }

  function buildBrush(THREE, mat, group) {
    const g = new VGrid(1 / 14);
    g.fillBox(-4, 0, -4, 4, 3, 4, [0.25, 0.25, 0.28]);
    g.fillBox(-3, 3, -3, 3, 3, 3, [0.12, 0.12, 0.14]);
    g.fillBox(-1, 3, -1, 1, 5, 1, [1, 1, 1]);
    g.fillBox(0, 6, 0, 0, 12, 0, [0.62, 0.42, 0.24]);
    g.fill(0, 13, 0, [0.4, 0.26, 0.14]);
    group.add(mesh(THREE, g, mat));
  }

  function buildStarJar(THREE, mat, group) {
    const g = new VGrid(1 / 14);
    const glass = [0.8, 0.9, 0.97], wood = [0.85, 0.68, 0.42];
    g.fillBox(-4, 0, -4, 4, 0, 4, glass);
    for (let x = -4; x <= 4; x += 8) for (let z = -4; z <= 4; z += 8) g.fillBox(x, 1, z, x, 7, z, glass);
    g.fillBox(-4, 8, -4, 4, 8, 4, glass);
    g.removeBox(-3, 8, -3, 3, 8, 3);
    g.fillBox(-4, 9, -4, 4, 10, 4, wood);
    g.fillBox(-1, 11, -1, 1, 11, 1, wood);
    plusStar(g, 0, 2, 0, GOLD_GLOW); plusStar(g, -2, 4, 2, GOLD); plusStar(g, 2, 5, -1, GOLD_GLOW);
    plusStar(g, -1, 6, -2, GOLD); plusStar(g, 2, 2, 2, GOLD); plusStar(g, -2, 2, -2, GOLD_GLOW);
    group.add(mesh(THREE, g, mat));
  }

  function buildMedal(THREE, mat, group, stage) {
    const g = new VGrid(1 / 15);
    const metals = [[0.85, 0.55, 0.3], [0.8, 0.82, 0.86], GOLD, [0.75, 0.85, 0.95]];
    const metal = metals[Math.max(0, Math.min(stage - 1, 3))];
    g.fillBox(-2, 10, -1, -1, 13, 0, [0.9, 0.3, 0.3]);
    g.fillBox(1, 10, -1, 2, 13, 0, [0.3, 0.45, 0.85]);
    g.fillEllipsoid(0, 5.5, 0, 5, 5, 1.6, metal);
    group.add(mesh(THREE, g, mat));
    for (let i = 0; i < stage; i++) {
      const star = starMesh(THREE, mat, 0.16, [1, 1, 1]);
      star.position.set((i - (stage - 1) * 0.5) * 0.18, 0.37, -0.13);
      group.add(star);
    }
  }

  function buildStar(THREE, mat, group) {
    const star = starMesh(THREE, mat, 0.95, GOLD);
    star.position.set(0, 0.5, 0);
    group.add(star);
  }

  // model registry: builder + camera framing (target height, distance, initial yaw)
  const MODELS = {
    duck:         { build: buildDuck,                          cy: 0.68, r: 3.7,  yaw0: -0.62 },
    trophy:       { build: buildTrophy,                        cy: 0.42, r: 2.55, yaw0: -0.35 },
    shootingstar: { build: buildShootingStar,                  cy: 0.5,  r: 3.0,  yaw0: Math.PI + 0.35 },
    headphones:   { build: buildHeadphones,                    cy: 0.36, r: 2.8,  yaw0: Math.PI - 0.35 },
    cards:        { build: buildCards,                         cy: 0.42, r: 2.9,  yaw0: Math.PI - 0.3 },
    album:        { build: buildAlbum,                         cy: 0.45, r: 2.75, yaw0: Math.PI - 0.3 },
    brush:        { build: buildBrush,                         cy: 0.42, r: 2.8,  yaw0: -0.3 },
    starjar:      { build: buildStarJar,                       cy: 0.42, r: 2.7,  yaw0: -0.35 },
    star:         { build: buildStar,                          cy: 0.5,  r: 2.5,  yaw0: Math.PI - 0.2 },
    medal1:       { build: (T, m, g) => buildMedal(T, m, g, 1), cy: 0.45, r: 2.6, yaw0: Math.PI - 0.25 },
    medal2:       { build: (T, m, g) => buildMedal(T, m, g, 2), cy: 0.45, r: 2.6, yaw0: Math.PI - 0.25 },
    medal3:       { build: (T, m, g) => buildMedal(T, m, g, 3), cy: 0.45, r: 2.6, yaw0: Math.PI - 0.25 },
    medal4:       { build: (T, m, g) => buildMedal(T, m, g, 4), cy: 0.45, r: 2.6, yaw0: Math.PI - 0.25 },
  };

  // ---------------- <voxel-prop> element ----------------
  import('three').then((THREE) => {
    const MAT = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });

    class VoxelProp extends HTMLElement {
      connectedCallback() {
        if (this._init) return;
        this._init = true;
        this.style.display = this.style.display || 'block';
        this.style.touchAction = 'pan-y';
        this.style.cursor = 'grab';
        // Custom elements have no intrinsic size: without this the canvas's default
        // 300×150 aspect dictates a half-height element. All props frame square.
        if (!this.style.height || this.style.height === 'auto') this.style.aspectRatio = '1 / 1';
        this.style.aspectRatio = this.style.aspectRatio || '1 / 1';

        const cfg = MODELS[this.getAttribute('model')] || MODELS.star;
        this._cfg = cfg;
        const zoom = parseFloat(this.getAttribute('zoom') || '1');

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
        const r = cfg.r / zoom, az = 0.56, el = 0.38;
        camera.position.set(r * Math.cos(el) * Math.sin(az), cfg.cy + r * Math.sin(el), r * Math.cos(el) * Math.cos(az));
        camera.lookAt(0, cfg.cy, 0);

        const pivot = new THREE.Group();      // yaw spin (drag + auto)
        const lift = new THREE.Group();       // hop / breathing offsets
        pivot.add(lift);
        scene.add(pivot);
        pivot.rotation.y = parseFloat(this.getAttribute('yaw') || cfg.yaw0);

        this._wings = cfg.build(THREE, MAT, lift) || null;

        // centre the model so it spins about its own middle
        const box = new THREE.Box3().setFromObject(lift);
        const cx = (box.min.x + box.max.x) / 2, cz = (box.min.z + box.max.z) / 2;
        lift.children.forEach((c) => { c.position.x -= cx; c.position.z -= cz; });

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        this.appendChild(renderer.domElement);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';

        const resize = () => {
          const w = this.clientWidth || 100, h = this.clientHeight || 100;
          renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        resize();
        new ResizeObserver(resize).observe(this);

        // interaction: drag to spin (inertia), tap to hop
        let dragging = false, lastX = 0, moved = 0;
        this._vel = 0;
        this.addEventListener('pointerdown', (e) => {
          dragging = true; lastX = e.clientX; moved = 0;
          this.style.cursor = 'grabbing';
          this.setPointerCapture(e.pointerId);
        });
        this.addEventListener('pointermove', (e) => {
          if (!dragging) return;
          const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
          pivot.rotation.y += dx * 0.013;
          this._vel = dx * 0.013;
        });
        const release = () => {
          if (!dragging) return;
          dragging = false;
          this.style.cursor = 'grab';
          if (moved < 6) this._hopT = 0; // tap → hop
        };
        this.addEventListener('pointerup', release);
        this.addEventListener('pointercancel', release);

        // visibility-gated render loop
        this._visible = false;
        new IntersectionObserver((entries) => { this._visible = entries[0].isIntersecting; }, { rootMargin: '80px' }).observe(this);

        const anim = this.getAttribute('anim') || (this.getAttribute('model') === 'duck' ? 'idle' : 'spin');
        this._hopT = 999;
        let nextAction = 2 + Math.random() * 2.5, action = null, actionT = 0;
        let lastFrame = performance.now();
        let t = 0;

        const loop = () => {
          requestAnimationFrame(loop);
          const now = performance.now();
          const dt = Math.min((now - lastFrame) / 1000, 0.05);
          lastFrame = now;
          if (!this._visible) return;
          t += dt;

          if (!dragging) {
            if (Math.abs(this._vel) > 0.0004) { pivot.rotation.y += this._vel; this._vel *= 0.94; }
            else if (anim === 'spin') pivot.rotation.y += dt * 0.45;
          }

          let hop = 0, flap = 0, pitch = 0;

          // tap hop
          if (this._hopT < 0.4) {
            this._hopT += dt;
            const k = Math.sin(Math.min(this._hopT / 0.38, 1) * Math.PI);
            hop += k * 0.12; flap += k * 30;
          }

          if (anim === 'idle') {
            hop += Math.sin(t * 2.2) * 0.015; // breathing (DuckIdle)
            if (!action && (t > nextAction)) {
              action = Math.random() < 0.5 ? 'flap' : 'hop';
              actionT = 0;
            }
            if (action === 'flap') {
              actionT += dt;
              const dur = 0.78;
              flap += Math.abs(Math.sin((actionT / dur) * Math.PI * 3)) * 45;
              if (actionT >= dur) { action = null; nextAction = t + 2 + Math.random() * 2.5; }
            } else if (action === 'hop') {
              actionT += dt;
              const k = Math.sin(Math.min(actionT / 0.35, 1) * Math.PI);
              hop += k * 0.14; flap += k * 28;
              if (actionT >= 0.35) { action = null; nextAction = t + 2 + Math.random() * 2.5; }
            }
          } else if (anim === 'cheer') {
            const cyc = (t % 0.95) / 0.6; // DuckCheer: HopTime .6 + Rest .35
            const u = Math.min(cyc, 1);
            hop += Math.sin(u * Math.PI) * 0.3;
            flap += Math.sin(u * Math.PI * 3) * 55;
          }

          lift.position.y = hop;
          lift.rotation.z = -pitch;
          if (this._wings && this._wings.leftWing) {
            this._wings.leftWing.rotation.x = flap * Math.PI / 180;
            this._wings.rightWing.rotation.x = -flap * Math.PI / 180;
          }
          renderer.render(scene, camera);
        };
        loop();
      }
    }

    if (!customElements.get('voxel-prop')) customElements.define('voxel-prop', VoxelProp);
  });
})();
