"use client";

import { useEffect, useRef } from "react";
import { courtLines, drawnSegments } from "@/lib/court";

/* The Numbers chapter's WebGL court (opus55). "Talent was never missing. The
   platform was.": while the real figures land, a futsal court draws itself in
   floodlit lines, one pen stroke at a time, and the camera comes down from
   overhead to pitch level. Flat lines only, no lighting or gloss, so it sits
   in the page's print language (antipatterns 2026-09-22).

   The canvas lives in a sticky, full-viewport layer behind the figures. Scroll
   progress through the section drives both the pen and the camera; the
   pointer adds a small parallax. Loads on idle once the section is near,
   renders only while it is on screen. Reduced motion: one still frame, court
   complete, at the pitch-side view. No WebGL: the night canvas alone. */

type V3 = [number, number, number];

// Camera stops through the chapter: overhead, broadcast gantry, pitch level.
const STOPS: { at: number; pos: V3; look: V3 }[] = [
  { at: 0, pos: [0, 46, 0.01], look: [0, 0, 0] },
  { at: 0.45, pos: [-6, 17, 27], look: [2, 0, 0] },
  { at: 1, pos: [-27, 2.4, 13], look: [-6, 0.6, -1] },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

function cameraAt(p: number) {
  let i = 0;
  while (i < STOPS.length - 2 && p > STOPS[i + 1].at) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const t = smooth(Math.max(0, Math.min(1, (p - a.at) / (b.at - a.at))));
  const mix = (u: V3, v: V3) => u.map((x, k) => x + (v[k] - x) * t) as V3;
  return { pos: mix(a.pos, b.pos), look: mix(a.look, b.look) };
}

export function CourtScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    const section = el?.closest("section");
    if (!el || !section) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import("three");
      const { Line2 } = await import("three/addons/lines/Line2.js");
      const { LineGeometry } = await import("three/addons/lines/LineGeometry.js");
      const { LineMaterial } = await import("three/addons/lines/LineMaterial.js");
      if (disposed) return;

      // Phones: capped DPR and no MSAA, the two biggest GPU costs per frame.
      const phone = window.matchMedia("(max-width: 899px)").matches;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !phone });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, phone ? 1.5 : 2));
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
      const court = new THREE.Group();
      scene.add(court);

      // Bone lines at 55%, the halfway line and goals in Frontier yellow.
      const bone = new LineMaterial({ color: 0xefeae0, linewidth: 1.6, transparent: true, opacity: 0.55 });
      const yellow = new LineMaterial({ color: 0xfaba2a, linewidth: 2.4 });
      const lines = courtLines();
      const meshes = lines.map((line) => {
        const geometry = new LineGeometry();
        geometry.setPositions(line.points.flat());
        const mesh = new Line2(geometry, line.accent ? yellow : bone);
        court.add(mesh);
        return mesh;
      });

      // A field of floodlight dust: a sparse dot grid over the playing surface
      // gives the eye depth before the lines exist.
      const dots: number[] = [];
      for (let x = -22; x <= 22; x += 2) for (let z = -12; z <= 12; z += 2) dots.push(x, 0, z);
      const dotGeometry = new THREE.BufferGeometry();
      dotGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dots, 3));
      const dotMaterial = new THREE.PointsMaterial({ color: 0xefeae0, size: 2, sizeAttenuation: false, transparent: true, opacity: 0.22 });
      court.add(new THREE.Points(dotGeometry, dotMaterial));

      const still = window.matchMedia("(prefers-reduced-motion: reduce)");

      const draw = (p: number, px = 0, py = 0) => {
        const counts = drawnSegments(lines, still.matches ? 1 : Math.min(1, p * 1.7));
        meshes.forEach((mesh, i) => {
          mesh.geometry.instanceCount = counts[i];
          mesh.visible = counts[i] > 0;
        });
        const { pos, look } = cameraAt(still.matches ? 0.62 : p);
        camera.position.set(pos[0] + px * 2.5, pos[1] + py * 1.5, pos[2]);
        camera.lookAt(...look);
        // The court turns a quarter under the overhead camera, so the lines
        // start as a plan drawing and end up running away from the viewer.
        court.rotation.y = still.matches ? 0 : (1 - smooth(Math.min(1, p / 0.45))) * -0.5;
        renderer.render(scene, camera);
      };

      const progress = () => {
        // 0 as the section rises into view, 1 as its end reaches the bottom
        // of the screen: the pen is already moving under the headline.
        const r = section.getBoundingClientRect();
        return r.height > 0 ? Math.max(0, Math.min(1, (window.innerHeight - r.top) / r.height)) : 0;
      };

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = el;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        bone.resolution.set(w, h);
        yellow.resolution.set(w, h);
        camera.aspect = w / h;
        // Keep the whole court in frame on a tall phone.
        camera.fov = w / h < 0.8 ? 58 : 38;
        camera.updateProjectionMatrix();
        draw(progress());
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();
      el.dataset.ready = "true";

      let target = { x: 0, y: 0 };
      const pointer = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => {
        target = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let raf = 0;
      let shown = 0;
      let visible = false;
      const tick = () => {
        // Ease the scroll value so a fling reads as the pen speeding up, not
        // a jump cut.
        shown += (progress() - shown) * 0.12;
        pointer.x += (target.x - pointer.x) * 0.05;
        pointer.y += (target.y - pointer.y) * 0.05;
        draw(shown, pointer.x, pointer.y);
        raf = requestAnimationFrame(tick);
      };
      const sync = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (visible && !document.hidden && !still.matches) {
          shown = progress();
          raf = requestAnimationFrame(tick);
        } else draw(progress());
      };
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      io.observe(el);
      document.addEventListener("visibilitychange", sync);
      still.addEventListener("change", sync);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", sync);
        still.removeEventListener("change", sync);
        meshes.forEach((m) => m.geometry.dispose());
        bone.dispose();
        yellow.dispose();
        dotGeometry.dispose();
        dotMaterial.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // Build it once the chapter is within a screen, then on idle.
    let cancelIdle = () => {};
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        near.disconnect();
        if ("requestIdleCallback" in window) {
          const id = window.requestIdleCallback(() => void start(), { timeout: 1500 });
          cancelIdle = () => window.cancelIdleCallback(id);
        } else {
          const id = setTimeout(() => void start(), 200);
          cancelIdle = () => clearTimeout(id);
        }
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(section);

    return () => {
      disposed = true;
      near.disconnect();
      cancelIdle();
      cleanup();
    };
  }, []);

  return (
    <div
      ref={host}
      aria-hidden="true"
      className="absolute inset-0 opacity-0 transition-opacity duration-1000 data-[ready=true]:opacity-100 motion-reduce:transition-none [&>canvas]:block [&>canvas]:size-full"
    />
  );
}
