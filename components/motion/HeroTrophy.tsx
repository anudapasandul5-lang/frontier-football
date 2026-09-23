"use client";

import { useEffect, useRef } from "react";

/* The 4 x 4 Series trophy floating behind the hero copy (owner, 2026-09-23).
   Decoration only: aria-hidden, no pointer events, and the hero reads fully
   without it. three.js and the model load after first paint, on idle, so they
   never compete with the headline for LCP; the canvas fades in once the
   first frame is drawn. No WebGL or a failed load leaves the hero text-only.

   The model is trophy-frontier.web.glb: the Blender export
   (scripts/build-frontier-trophy.py) with Meshopt geometry compression and
   the official crest texture embedded. Re-run that script after model edits.

   Motion: a slow turn and a gentle bob, paused whenever the hero is off
   screen or the tab is hidden. Reduced motion gets one still three-quarter
   frame. */
export function HeroTrophy() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
      const { MeshoptDecoder } = await import("three/addons/libs/meshopt_decoder.module.js");
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return; // no WebGL: the hero stays text-only
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envTarget.texture;
      scene.environmentIntensity = 1.2;
      pmrem.dispose();

      // Broad warm key, neutral fill, and amber rim create moving specular
      // reflections across the polished gold as the trophy turns.
      const addStudioLight = (color: number, intensity: number, position: [number, number, number]) => {
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(...position);
        scene.add(light);
      };
      addStudioLight(0xffe8c2, 2.6, [-4, 5, 5]);
      addStudioLight(0xc8dcff, 1.1, [4, 3, 2]);
      addStudioLight(0xffb943, 1.8, [1, 3, -4]);

      // Fine surface breakup keeps the gold from reading like a flat mirror,
      // and the repeating normal pattern gives the colored ribbons a woven nap.
      const makeGrain = () => {
        const size = 128;
        const data = new Uint8Array(size * size * 4);
        let seed = 73421;
        for (let i = 0; i < size * size; i++) {
          seed = (seed * 16807) % 2147483647;
          const value = 205 + (seed % 51);
          data.set([value, value, value, 255], i * 4);
        }
        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(10, 10);
        texture.needsUpdate = true;
        return texture;
      };
      const makeWeave = () => {
        const size = 128;
        const data = new Uint8Array(size * size * 4);
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const u = (x / size) * Math.PI * 16;
            const v = (y / size) * Math.PI * 16;
            const nx = Math.cos(u) * 8;
            const ny = Math.cos(v) * 8;
            const i = (y * size + x) * 4;
            data.set([128 + nx, 128 + ny, 250, 255], i);
          }
        }
        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 18);
        texture.needsUpdate = true;
        return texture;
      };
      const goldGrain = makeGrain();
      const fabricWeave = makeWeave();

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      const pivot = new THREE.Group();
      scene.add(pivot);

      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      let gltf;
      try {
        gltf = await loader.loadAsync("/objects/trophy-frontier.web.glb");
      } catch {
        gltf = null;
      }
      if (!gltf || disposed) {
        envTarget.dispose();
        goldGrain.dispose();
        fabricWeave.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        return;
      }

      // Centre the trophy on the pivot and frame its full height.
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      model.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        const needsSurfaceUvs = materials.some((material) =>
          material instanceof THREE.MeshStandardMaterial &&
          (material.metalness > 0.5 || /tassel/i.test(material.name)),
        );
        if (needsSurfaceUvs && !object.geometry.getAttribute("uv")) {
          const positions = object.geometry.getAttribute("position");
          const uvs = new Float32Array(positions.count * 2);
          for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);
            uvs[i * 2] = (x + y * 0.37) * 8;
            uvs[i * 2 + 1] = (z + y * 0.23) * 8;
          }
          object.geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
        }
        for (const material of materials) {
          if (material instanceof THREE.MeshStandardMaterial && material.metalness > 0.5) {
            material.envMapIntensity = 1.05;
            material.roughness = Math.max(material.roughness, 0.26);
            material.roughnessMap = goldGrain;
            material.needsUpdate = true;
          } else if (material instanceof THREE.MeshStandardMaterial && /tassel/i.test(material.name)) {
            material.roughness = 0.62;
            material.normalMap = fabricWeave;
            material.normalScale.set(0.07, 0.07);
            if (material instanceof THREE.MeshPhysicalMaterial) {
              material.sheen = 0.35;
              material.sheenRoughness = 0.6;
              material.sheenColor.set(0.9, 0.86, 0.76);
            }
            material.needsUpdate = true;
          }
        }
      });
      model.position.sub(box.getCenter(new THREE.Vector3()));
      pivot.add(model);
      const distance = (size.y * 0.62) / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.set(0, size.y * 0.12, distance);
      camera.lookAt(0, 0, 0);
      pivot.rotation.y = -Math.PI / 5; // three-quarter view, the still frame under reduced motion

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = el;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();
      el.dataset.ready = "true";

      const still = window.matchMedia("(prefers-reduced-motion: reduce)");
      let visible = true;
      let raf = 0;
      let last = performance.now();
      const bob = size.y * 0.025;
      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.1);
        last = now;
        pivot.rotation.y += dt * 0.35;
        pivot.position.y = Math.sin(now / 1000) * bob;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      const sync = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (visible && !document.hidden && !still.matches) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      };
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      io.observe(el);
      document.addEventListener("visibilitychange", sync);
      still.addEventListener("change", sync);
      sync();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", sync);
        still.removeEventListener("change", sync);
        model.traverse((o) => {
          if (o instanceof THREE.Mesh) {
            o.geometry.dispose();
            (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
          }
        });
        envTarget.dispose();
        goldGrain.dispose();
        fabricWeave.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    // After first paint: idle where supported, a short timeout elsewhere (Safari).
    let cancel: () => void;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => void start(), { timeout: 2000 });
      cancel = () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => void start(), 300);
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
      aria-hidden
      className="hero-trophy pointer-events-none absolute inset-x-0 top-[calc(50%-24svh)] mx-auto h-[34svh] w-full max-w-[min(100%,34svh)] md:top-[calc(50%-30svh)] md:h-[50svh] md:max-w-[min(100%,50svh)] opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100 motion-reduce:transition-none [&>canvas]:block [&>canvas]:size-full [&>canvas]:drop-shadow-[0_16px_16px_rgba(0,0,0,0.16)]"
    />
  );
}
