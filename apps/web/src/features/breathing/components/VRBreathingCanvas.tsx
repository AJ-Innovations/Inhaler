"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// Map active soundscape key to ambient image paths
const getAmbientImage = (activeSoundscape: string) => {
  switch (activeSoundscape) {
    case "zen-river":
      return "/image/ambients/river.png";
    case "zen-fountain":
      return "/image/ambients/whaterfalls.png";
    case "winter-rain":
      return "/image/ambients/rain.png";
    case "light-rain":
      return "/image/ambients/rain2.png";
    case "nature-birds":
      return "/image/ambients/nature2.png";
    case "hz-transformation":
      return "/image/ambients/galaxy.png";
    case "white-noise":
      return "/image/ambients/galaxy2.png";
    case "pink-noise":
      return "/image/ambients/galaxy3.png";
    case "brown-noise":
      return "/image/ambients/nature.png";
    case "beach":
      return "/image/ambients/beach.png";
    case "lake":
      return "/image/ambients/lake4.png";
    case "marine":
      return "/image/ambients/marain.png";
    case "desert":
      return "/image/ambients/desert3.png";
    case "ethereal":
      return "/image/ambients/loop.png";
    case "forest":
      return "/image/ambients/forest.png";
    case "leaf":
    default:
      return "/image/ambients/leaf.png";
  }
};

interface VRBreathingCanvasProps {
  phase: string; // Inhale, Hold, Exhale, Rest
  timer: number;
  duration: number;
  isActive: boolean;
  activeSoundscape: string;
  isStereoscopic: boolean;
}

export function VRBreathingCanvas({
  phase,
  timer,
  duration,
  isActive,
  activeSoundscape,
  isStereoscopic,
}: VRBreathingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Keep references of state to access inside the Three.js loop without re-instantiating the renderer
  const stateRef = useRef({
    phase,
    timer,
    duration,
    isActive,
    activeSoundscape,
  });

  useEffect(() => {
    stateRef.current = { phase, timer, duration, isActive, activeSoundscape };
  }, [phase, timer, duration, isActive, activeSoundscape]);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- 1. Scene & Render Engine Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.008);

    const width = container.clientWidth;
    const height = container.clientHeight;

    // We use a base pivot group to rotate the world or camera based on controls
    const cameraPivot = new THREE.Group();
    scene.add(cameraPivot);

    // Standard camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraPivot.add(camera);

    // Stereoscopic cameras (Left & Right eye for Google Cardboard split-screen)
    const cameraLeft = new THREE.PerspectiveCamera(
      75,
      width / 2 / height,
      0.1,
      1000,
    );
    const cameraRight = new THREE.PerspectiveCamera(
      75,
      width / 2 / height,
      0.1,
      1000,
    );

    // Set interpupillary distance (IPD) to ~0.065 units in virtual coordinates
    cameraLeft.position.set(-0.15, 0, 0);
    cameraRight.position.set(0.15, 0, 0);
    cameraPivot.add(cameraLeft);
    cameraPivot.add(cameraRight);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- 2. Environment (Curved 180° Dome Screen) ---
    const domeRadius = 16;
    const domeAspect = 1.77; // Aspect ratio matching widescreen imagery
    const thetaLength = Math.PI / domeAspect;
    const thetaStart = Math.PI / 2 - thetaLength / 2;

    // A beautiful 180° dome (hemisphere slice) centered in front of the camera
    const domeGeo = new THREE.SphereGeometry(
      domeRadius,
      64,
      64,
      Math.PI, // phiStart (covers from X=-R to X=+R through negative Z)
      Math.PI, // phiLength (180 degrees horizontally)
      thetaStart, // thetaStart (centered vertically around equator)
      thetaLength, // thetaLength (height arc matching aspect ratio)
    );

    const textureLoader = new THREE.TextureLoader();
    let currentTexturePath = getAmbientImage(activeSoundscape);

    const planeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 1.0,
      transparent: false,
      side: THREE.DoubleSide, // Ensure visibility from inside
      fog: false, // Ignore scene fog to keep it bright and crisp
    });

    textureLoader.load(
      currentTexturePath,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        planeMat.map = texture;
        planeMat.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.error("Failed to load plane texture:", currentTexturePath, err);
      },
    );

    const domeMesh = new THREE.Mesh(domeGeo, planeMat);
    domeMesh.position.set(0, 0, 0); // Centered at origin around cameras
    scene.add(domeMesh);

    // --- 3. Lighting System ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 8, 10);
    scene.add(keyLight);

    // Orb and particles removed per user request.

    // --- 6. Camera Interaction & Device Orientation (Gyroscope) ---
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    // Mouse drag handlers for desktop VR simulation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = () => {
      isDragging = true;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;

        // Yaw and pitch adjustment with damping scale
        targetRotationY += deltaX * 0.003;
        targetRotationX += deltaY * 0.003;

        // Clamp orientation targets safely to avoid revealing dome edges
        targetRotationY = Math.max(-1.2, Math.min(1.2, targetRotationY));
        targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX));
      }

      previousMousePosition = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    window.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // Dynamic Gyroscope Binding
    let hasGyroscope = false;
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      hasGyroscope = true;
      let alpha = event.alpha ? event.alpha : 0; // Yaw [0, 360]
      let beta = event.beta ? event.beta : 90; // Pitch [-180, 180]
      let gamma = event.gamma ? event.gamma : 0; // Roll [-90, 90]

      // Standardize coordinates for landscape orientation viewports
      // When screen orientation is rotated landscape-left:
      const screenOrientation = window.orientation || 0;

      if (screenOrientation === 90) {
        // Landscape Left
        targetRotationX = THREE.MathUtils.degToRad(gamma - 45);
        targetRotationY = THREE.MathUtils.degToRad(beta);
      } else if (screenOrientation === -90) {
        // Landscape Right
        targetRotationX = THREE.MathUtils.degToRad(-gamma - 45);
        targetRotationY = THREE.MathUtils.degToRad(-beta);
      } else {
        // Portrait fallback
        targetRotationX = THREE.MathUtils.degToRad(beta - 70);
        targetRotationY = THREE.MathUtils.degToRad(alpha);
      }

      // Clamp orientation targets safely to avoid revealing dome edges
      targetRotationY = Math.max(-1.2, Math.min(1.2, targetRotationY));
      targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX));
    };

    window.addEventListener("deviceorientation", handleDeviceOrientation);

    // --- 7. Real-Time Dynamic Animation Loop ---
    const clock = new THREE.Clock();

    let animationFrameId: number;

    const animateLoop = () => {
      animationFrameId = requestAnimationFrame(animateLoop);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Retrieve state values safely
      const {
        phase: currentPhase,
        isActive: isSessionActive,
        activeSoundscape: currentAmbient,
      } = stateRef.current;

      // Handle environment background transitions
      const targetTexPath = getAmbientImage(currentAmbient);
      if (currentTexturePath !== targetTexPath) {
        currentTexturePath = targetTexPath;
        // Fade out and swap
        textureLoader.load(
          targetTexPath,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.minFilter = THREE.LinearFilter;
            planeMat.map = texture;
            planeMat.needsUpdate = true;
          },
          undefined,
          (err) => {
            console.error(
              "Failed to swap plane texture inside animation loop:",
              targetTexPath,
              err,
            );
          },
        );
      }

      // Smooth camera rotation damping (inertial lerp)
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      cameraPivot.rotation.x = currentRotationX;
      cameraPivot.rotation.y = currentRotationY;

      // Gentle ambient breathing expansion pulse for a premium depth feeling
      domeMesh.scale.setScalar(1.0 + Math.sin(time * 0.8) * 0.015);

      // --- 8. Render Pipeline Execution (Dual Viewport Stereoscopic or Standard Single) ---
      const w = container.clientWidth;
      const h = container.clientHeight;

      if (isStereoscopic) {
        renderer.setScissorTest(true);

        // Render Left Eye Viewport
        renderer.setViewport(0, 0, w / 2, h);
        renderer.setScissor(0, 0, w / 2, h);
        renderer.render(scene, cameraLeft);

        // Render Right Eye Viewport
        renderer.setViewport(w / 2, 0, w / 2, h);
        renderer.setScissor(w / 2, 0, w / 2, h);
        renderer.render(scene, cameraRight);
      } else {
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, w, h);
        renderer.render(scene, camera);
      }
    };

    animateLoop();

    // --- 9. Responsive Resizing Observer ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      cameraLeft.aspect = w / 2 / h;
      cameraLeft.updateProjectionMatrix();

      cameraRight.aspect = w / 2 / h;
      cameraRight.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // --- 10. Memory Cleanups ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);

      window.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);

      window.removeEventListener("deviceorientation", handleDeviceOrientation);

      // Dispose WebGL Geometries and Materials
      domeGeo.dispose();
      planeMat.dispose();
      renderer.dispose();
    };
  }, [isStereoscopic]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full bg-black"
      style={{ touchAction: "none" }}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 h-full w-full" />
    </div>
  );
}
