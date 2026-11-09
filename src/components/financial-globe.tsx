import { useEffect, useRef } from "react";
import * as THREE from "three";

export function FinancialGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const revealFallback = () => {
      if (fallbackRef.current) fallbackRef.current.dataset.visible = "true";
    };
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      revealFallback();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    const initialWidth = Math.max(canvas.clientWidth, 1);
    const initialHeight = Math.max(canvas.clientHeight, 1);
    renderer.setSize(initialWidth, initialHeight, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);
    camera.aspect = initialWidth / initialHeight;
    camera.updateProjectionMatrix();
    const universe = new THREE.Group();
    scene.add(universe);

    const colorProbe = document.createElement("canvas");
    colorProbe.width = 1;
    colorProbe.height = 1;
    const colorContext = colorProbe.getContext("2d");
    const designColor = (token: string) => {
      if (!colorContext) return new THREE.Color();
      colorContext.clearRect(0, 0, 1, 1);
      colorContext.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
      colorContext.fillRect(0, 0, 1, 1);
      const [red, green, blue] = colorContext.getImageData(0, 0, 1, 1).data;
      return new THREE.Color((red ?? 0) / 255, (green ?? 0) / 255, (blue ?? 0) / 255);
    };

    const globe = new THREE.Group();
    universe.add(globe);

    const sphereGeometry = new THREE.SphereGeometry(2.05, 48, 36);
    const sphere = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshStandardMaterial({
        color: designColor("--globe-surface"),
        metalness: 0.72,
        roughness: 0.39,
        transparent: true,
        opacity: 0.84,
      }),
    );
    globe.add(sphere);

    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(2.07, 24, 16)),
      new THREE.LineBasicMaterial({ color: designColor("--globe-wire"), transparent: true, opacity: 0.22 }),
    );
    globe.add(wire);

    const pointPositions: number[] = [];
    const pointCount = 380;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < pointCount; i += 1) {
      const y = 1 - (i / (pointCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      pointPositions.push(
        Math.cos(theta) * radius * 2.08,
        y * 2.08,
        Math.sin(theta) * radius * 2.08,
      );
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(pointPositions, 3));
    const points = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({ color: designColor("--globe-points"), size: 0.025, transparent: true, opacity: 0.84 }),
    );
    globe.add(points);

    const orbitalMaterials = ["--globe-wire", "--globe-muted", "--globe-points"];
    const orbits = orbitalMaterials.map((color, index) => {
      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(index === 1 ? 2.6 : 2.45 + index * 0.12, 0.008, 4, 180),
        new THREE.MeshBasicMaterial({ color: designColor(color), transparent: true, opacity: index === 1 ? 0.22 : 0.53 }),
      );
      orbit.rotation.x = [0.74, 1.22, 1.44][index] ?? 0.9;
      orbit.rotation.y = [0.18, 0.58, -0.52][index] ?? 0;
      universe.add(orbit);
      return orbit;
    });

    const starPositions: number[] = [];
    for (let i = 0; i < 300; i += 1) {
      const angle = i * 2.39996;
      const radius = 3.2 + ((i * 37) % 100) / 36;
      starPositions.push(Math.cos(angle) * radius, ((i * 19) % 100) / 22 - 2.2, Math.sin(angle) * radius);
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({ color: designColor("--globe-wire"), size: 0.018, transparent: true, opacity: 0.72 }),
    );
    universe.add(stars);

    scene.add(new THREE.AmbientLight(designColor("--globe-ambient"), 1.4));
    const keyLight = new THREE.PointLight(designColor("--globe-key"), 26, 24);
    keyLight.position.set(2.5, 2.4, 4.8);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(designColor("--globe-rim"), 17, 20);
    rimLight.position.set(-4.5, -1.3, -2.5);
    scene.add(rimLight);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderFailed = false;
    let frame = 0;
    let scrollProgress = 0;
    let scrollFrame = 0;
    const render = () => {
      const isSmall = window.innerWidth < 720;
      universe.scale.setScalar(isSmall ? 0.76 : 1);
      universe.position.x = isSmall ? 0 : 0.9;
      universe.rotation.y = scrollProgress * 0.46;
      universe.rotation.x = scrollProgress * 0.12;
      if (!motionQuery.matches) {
        globe.rotation.y += 0.0013;
        globe.rotation.x = Math.sin(performance.now() * 0.00014) * 0.035;
        orbits.forEach((orbit, index) => {
          orbit.rotation.z += (index === 1 ? -1 : 1) * 0.00045;
        });
      }
      if (!renderFailed) {
        try {
          renderer.render(scene, camera);
        } catch {
          renderFailed = true;
          revealFallback();
        }
      }
      frame = window.requestAnimationFrame(render);
    };
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        scrollProgress = window.scrollY / max;
        scrollFrame = 0;
      });
    };
    const resizeObserver = new ResizeObserver(() => {
      const width = Math.max(canvas.clientWidth, 1);
      const height = Math.max(canvas.clientHeight, 1);
      camera.aspect = width / height;
      camera.position.z = width < 720 ? 9.1 : 8.4;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div className="globe-fallback" ref={fallbackRef} aria-hidden="true">
        <span className="fallback-globe-grid" />
        <span className="fallback-orbit fallback-orbit-one" />
        <span className="fallback-orbit fallback-orbit-two" />
        <span className="fallback-orbit fallback-orbit-three" />
        <span className="fallback-globe-center">F</span>
      </div>
      <canvas ref={canvasRef} className="financial-globe" aria-hidden="true" />
    </>
  );
}