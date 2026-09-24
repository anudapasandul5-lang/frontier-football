"use client";

import { useEffect, useRef } from "react";
import { phoneSrc } from "@/lib/phone-image";

/* The hero's 3D centrepiece (opus55): a slowly turning ring of Frontier's
   own photographs (match nights, watch-alongs, champions) with the yellow
   caps overprinted on it.

   - Drag sideways anywhere on the hero to spin it; a fling keeps its momentum.
   - The ring turns toward the pointer (no scroll bow: owner, 2026-09-24, it read as warped).
   - As the hero scrolls away the ring tips up toward the camera.
   - Only the near side is drawn: the ring reads as one curved band, in
     full colour.
   - The band threads the headline: its middle is projected onto the midline
     between the two caps lines, the first line behind it, the second in front.
   - Seen level, not from above (owner, 2026-09-23: "flat band"): the camera
     sits at the ring's own height and the ring has no roll, so the band runs
     straight across the hero instead of as a slanted smile.

   Decoration only: aria-hidden, the hero reads fully without it. three.js and
   the photos load on idle after first paint. Reduced motion: one still frame.
   No WebGL: the bone hero with its type. */

// Full-resolution frames from the "Road to World Cup" Drive folder (owner,
// 2026-09-23): SZN 06, Division 0 and the World Cup watch-alongs, all free of
// burned-in logos. 1200 x 800 WebP (3:2) in public/home/ring/.
const PHOTOS = [
  "/home/ring/trophy-lift.webp",
  "/home/ring/final-screen.webp",
  "/home/ring/through-the-net.webp",
  "/home/ring/spain-flag.webp",
  "/home/ring/keeper-slide.webp",
  "/home/ring/final-cheer.webp",
  "/home/ring/night-ten.webp",
  "/home/ring/division-0.webp",
  "/home/ring/medals.webp",
  "/home/ring/pointing.webp",
];

const RADIUS = 6;
const GAP = 0.1; // fraction of each panel's arc left empty
// Panels share the photos' 3:2 shape, so the cover fit shows the whole frame
// instead of cropping a landscape photo into a portrait slot (owner, 2026-09-23).
const PANEL_H = (RADIUS * ((Math.PI * 2) / PHOTOS.length) * (1 - GAP)) / 1.5;

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uScale;
  uniform vec3 uBone;
  uniform float uFade;
  varying vec2 vUv;
  void main() {
    // Cover-fit the photo in the panel, and read it left to right from outside.
    vec2 uv = vec2(1.0 - vUv.x, vUv.y);
    uv = (uv - 0.5) * uScale + 0.5;
    vec4 c = texture2D(uMap, uv);
    // Full colour on every panel (owner, 2026-09-23: no black and white).
    c.rgb = clamp((c.rgb - 0.5) * 1.1 + 0.5, 0.0, 1.0);
    // Arrival: each photo develops out of the bone canvas.
    c.rgb = mix(c.rgb, uBone, uFade);
    gl_FragColor = vec4(c.rgb, 1.0);
    #include <colorspace_fragment>
  }
`;

export function HeroRing() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    const hero = el?.closest("section");
    if (!el || !hero) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(18, 1, 0.1, 200);
      const tilt = new THREE.Group(); // lean + scroll tilt
      const ring = new THREE.Group(); // spin
      tilt.add(ring);
      scene.add(tilt);

      const bone = new THREE.Color(0xefeae0);
      const step = (Math.PI * 2) / PHOTOS.length;
      const arc = step * (1 - GAP);
      const panelW = RADIUS * arc;
      const loader = new THREE.TextureLoader();
      // Phones get the 800px copies: about a third of the bytes, same look at panel size.
      const narrow = window.matchMedia("(max-width: 899px)").matches;
      const materials: InstanceType<typeof THREE.ShaderMaterial>[] = [];
      const geometries: InstanceType<typeof THREE.CylinderGeometry>[] = [];

      const loaded = PHOTOS.map(
        (src, i) =>
          new Promise<void>((resolve) => {
            const geometry = new THREE.CylinderGeometry(RADIUS, RADIUS, PANEL_H, 16, 1, true, i * step, arc);
            const material = new THREE.ShaderMaterial({
              vertexShader: vertex,
              fragmentShader: fragment,
              side: THREE.FrontSide, // the far side is culled: the ring reads as one curved band
              uniforms: {
                uMap: { value: null },
                uScale: { value: new THREE.Vector2(1, 1) },
                uBone: { value: bone },
                uFade: { value: 1 },
              },
            });
            geometries.push(geometry);
            materials.push(material);
            ring.add(new THREE.Mesh(geometry, material));
            loader.load(
              narrow ? phoneSrc(src, 800) : src,
              (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.anisotropy = 4;
                const img = texture.image as HTMLImageElement;
                const photo = img.width / img.height;
                const panel = panelW / PANEL_H;
                // Cover: shrink the sampled window along the photo's long side.
                material.uniforms.uScale.value.set(photo > panel ? panel / photo : 1, photo > panel ? 1 : photo / panel);
                material.uniforms.uMap.value = texture;
                resolve();
              },
              undefined,
              () => resolve(),
            );
          }),
      );
      await Promise.all(loaded);
      if (disposed) return;

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = el;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        measure?.();
      };

      // The ring is a little wider than a desktop screen and well past a
      // phone's, so the band bleeds off both edges and the photos stay big.
      const baseDistance = () => {
        const want = camera.aspect < 0.8 ? 2.3 : 1.0;
        const halfW = (RADIUS * 2) / want / 2;
        return halfW / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect) + RADIUS;
      };

      /* Composition: the camera sits level with the band, so its front runs
         straight across the hero between the headline's two lines. Scrolling
         away tips the ring up toward the camera and lifts the view. */
      const lines = hero.querySelectorAll<HTMLElement>(".hero-line");
      const front = new THREE.Vector3();
      let anchorY = 0.5; // where the band's middle should sit, as a fraction of the canvas
      // Layout offsets, not getBoundingClientRect: HeroMotion's scroll
      // transforms on the lines must not move the anchor.
      const content = hero.querySelector<HTMLElement>("#content");
      const measure = () => {
        if (lines.length < 2 || !content || !el.clientHeight) return;
        const mid = (l: HTMLElement) => content.offsetTop + l.offsetTop + l.offsetHeight / 2;
        anchorY = (mid(lines[0]) + mid(lines[1])) / 2 / el.clientHeight;
      };
      const pose = (l: { x: number; y: number }, away: number) => {
        // No roll and no resting pitch: the band stays level.
        tilt.rotation.set(away * 0.35, l.y * 0.22, 0);
        const d = baseDistance();
        camera.clearViewOffset();
        camera.position.set(0, away * 1.5, d - away * 2);
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld();
        tilt.updateMatrixWorld();
        // Where the front of the band lands now, and how far to slide the view
        // so it lands on the headline's midline instead.
        front.set(0, 0, RADIUS).applyMatrix4(tilt.matrixWorld).project(camera);
        const y = (1 - (front.y + 1) / 2) * el.clientHeight;
        camera.setViewOffset(el.clientWidth, el.clientHeight, 0, y - anchorY * el.clientHeight, el.clientWidth, el.clientHeight);
      };

      resize();
      void document.fonts.ready.then(() => !disposed && measure());

      const still = window.matchMedia("(prefers-reduced-motion: reduce)");
      const bornAt = performance.now();
      let yaw = 0.35;
      let spin = 0.12;
      const lean = { x: 0, y: 0 };
      let leanTo = { x: 0, y: 0 };
      let drag: { id: number; x: number; t: number } | null = null;
      let lastScroll = window.scrollY;

      const onMove = (e: PointerEvent) => {
        leanTo = { x: e.clientY / window.innerHeight - 0.5, y: e.clientX / window.innerWidth - 0.5 };
        if (!drag || e.pointerId !== drag.id) return;
        const dx = e.clientX - drag.x;
        const dt = Math.max(1, e.timeStamp - drag.t);
        yaw += dx * 0.006;
        spin = Math.max(-8, Math.min(8, ((dx * 0.006) / dt) * 1000));
        drag = { id: e.pointerId, x: e.clientX, t: e.timeStamp };
      };
      const onDown = (e: PointerEvent) => {
        if (e.button !== 0 || (e.target as Element).closest("a, button")) return;
        drag = { id: e.pointerId, x: e.clientX, t: e.timeStamp };
        hero.dataset.dragging = "true";
      };
      const onUp = () => {
        drag = null;
        delete hero.dataset.dragging;
      };

      const frame = (now: number, dt: number) => {
        const r = hero.getBoundingClientRect();
        const away = Math.max(0, Math.min(1, -r.top / r.height));
        const dy = window.scrollY - lastScroll;
        lastScroll = window.scrollY;
        if (!drag) {
          spin += (0.12 - spin) * Math.min(1, dt * 1.2);
          yaw += (spin + dy * 0.02) * dt;
        }
        lean.x += (leanTo.x - lean.x) * Math.min(1, dt * 3);
        lean.y += (leanTo.y - lean.y) * Math.min(1, dt * 3);

        // Arrival: the photos develop in one after another around the ring.
        const t = (now - bornAt) / 1000;
        const arrive = Math.min(1, t / 1.8);
        const ease = 1 - (1 - arrive) ** 3;
        ring.rotation.y = yaw - (1 - ease) * 1.2;
        materials.forEach((m, i) => {
          const local = Math.max(0, Math.min(1, (t - i * 0.06) / 0.6));
          m.uniforms.uFade.value = 1 - local * local * (3 - 2 * local);
        });
        pose(lean, away);
        renderer.render(scene, camera);
      };

      let raf = 0;
      let last = performance.now();
      let visible = true;
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        frame(now, dt);
      };
      const sync = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (still.matches) {
          ring.rotation.y = 0.35;
          materials.forEach((m) => (m.uniforms.uFade.value = 0));
          pose({ x: 0, y: 0 }, 0);
          renderer.render(scene, camera);
        } else if (visible && !document.hidden) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      };
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      io.observe(el);
      const ro = new ResizeObserver(() => {
        resize();
        if (still.matches) sync();
      });
      ro.observe(el);
      window.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      document.addEventListener("visibilitychange", sync);
      still.addEventListener("change", sync);
      el.dataset.ready = "true";

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        hero.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        document.removeEventListener("visibilitychange", sync);
        still.removeEventListener("change", sync);
        materials.forEach((m) => {
          (m.uniforms.uMap.value as { dispose?: () => void } | null)?.dispose?.();
          m.dispose();
        });
        geometries.forEach((g) => g.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    let cancel: () => void;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => void start(), { timeout: 1500 });
      cancel = () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => void start(), 200);
      cancel = () => clearTimeout(id);
    }
    return () => {
      disposed = true;
      cancel();
      cleanup();
    };
  }, []);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className="absolute inset-0 z-[2] opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100 motion-reduce:transition-none [&>canvas]:block [&>canvas]:size-full"
    />
  );
}
