import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

export default function ScrollAnimated3DScene() {
  const mountRef = useRef(null);
  const { activeThemeObj } = useTheme();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 11);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const themeColor = new THREE.Color(activeThemeObj.hex);

    // Root Group for Scroll Transformations
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // 1. ROBO CAR MINI COMBAT MODEL (Hyperdrive Edition)
    const carGroup = new THREE.Group();
    sceneGroup.add(carGroup);

    // Chassis
    const chassisGeom = new THREE.BoxGeometry(2.8, 0.45, 4.2);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.9
    });
    const chassis = new THREE.Mesh(chassisGeom, chassisMat);
    chassis.position.y = 0.45;
    carGroup.add(chassis);

    // Sloped Front Wedge Armor
    const wedgeGeom = new THREE.ConeGeometry(1.6, 1.4, 4);
    const wedgeMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.95,
      roughness: 0.2
    });
    const wedge = new THREE.Mesh(wedgeGeom, wedgeMat);
    wedge.rotation.y = Math.PI / 4;
    wedge.rotation.x = -Math.PI / 2.3;
    wedge.position.set(0, 0.35, 2.1);
    wedge.scale.set(1.2, 0.4, 1.4);
    carGroup.add(wedge);

    // Front Neon Bumper Blade (Theme Accent)
    const bladeGeom = new THREE.BoxGeometry(2.4, 0.08, 0.3);
    const bladeMat = new THREE.MeshBasicMaterial({ color: themeColor });
    const blade = new THREE.Mesh(bladeGeom, bladeMat);
    blade.position.set(0, 0.1, 2.6);
    carGroup.add(blade);

    // Top LiDAR Sensor
    const lidarGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
    const lidarMat = new THREE.MeshBasicMaterial({ color: themeColor, wireframe: true });
    const lidar = new THREE.Mesh(lidarGeom, lidarMat);
    lidar.position.set(0, 1.0, 0);
    carGroup.add(lidar);

    // 4 Wheels
    const wheels = [];
    const wheelPositions = [
      { x: -1.55, y: 0.45, z: 1.3 },
      { x: 1.55, y: 0.45, z: 1.3 },
      { x: -1.55, y: 0.45, z: -1.3 },
      { x: 1.55, y: 0.45, z: -1.3 }
    ];

    wheelPositions.forEach((pos) => {
      const wheelGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.42, 16);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x05070c, roughness: 0.9 });
      const wheel = new THREE.Mesh(wheelGeom, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos.x, pos.y, pos.z);

      const hubGeom = new THREE.TorusGeometry(0.2, 0.03, 8, 16);
      const hubMat = new THREE.MeshBasicMaterial({ color: themeColor });
      const hub = new THREE.Mesh(hubGeom, hubMat);
      hub.position.x = pos.x > 0 ? 0.22 : -0.22;
      hub.rotation.y = Math.PI / 2;
      wheel.add(hub);

      carGroup.add(wheel);
      wheels.push(wheel);
    });

    // Dual Forward Spotlights
    const spotLeft = new THREE.SpotLight(0xffffff, 3.5, 12, Math.PI / 6, 0.4);
    spotLeft.position.set(-0.8, 0.5, 2.0);
    spotLeft.target.position.set(-0.8, 0, 7);
    carGroup.add(spotLeft);
    carGroup.add(spotLeft.target);

    const spotRight = new THREE.SpotLight(0xffffff, 3.5, 12, Math.PI / 6, 0.4);
    spotRight.position.set(0.8, 0.5, 2.0);
    spotRight.target.position.set(0.8, 0, 7);
    carGroup.add(spotRight);
    carGroup.add(spotRight.target);

    // Underglow Neon Sheet
    const underglowGeom = new THREE.PlaneGeometry(2.4, 3.6);
    const underglowMat = new THREE.MeshBasicMaterial({
      color: themeColor,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const underglow = new THREE.Mesh(underglowGeom, underglowMat);
    underglow.rotation.x = Math.PI / 2;
    underglow.position.y = 0.05;
    carGroup.add(underglow);

    // 2. CONCENTRIC HYPERDRIVE ENERGY RINGS (Fly past on scroll)
    const rings = [];
    for (let i = 0; i < 6; i++) {
      const ringGeom = new THREE.TorusGeometry(4.5 + (i % 2) * 1.5, 0.04, 8, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? themeColor : 0x9333ea,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.z = -12 + i * 5;
      sceneGroup.add(ring);
      rings.push(ring);
    }

    // 3. CYBER PARTICLES / WARP DUST
    const particleCount = 600;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 24;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: themeColor,
      size: 0.09,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 2);
    dir.position.set(4, 8, 6);
    scene.add(dir);

    // SCROLL ANIMATION STATE
    let scrollY = 0;
    let targetScrollY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // MOUSE PARALLAX
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    container.addEventListener('mousemove', handleMouseMove);

    // RESIZE
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth scroll lerp
      scrollY += (targetScrollY - scrollY) * 0.08;
      const scrollFactor = Math.min(scrollY / 1200, 1.5);

      // 3D SCROLL ANIMATION:
      // Rotate the car from diagonal angle to full forward attack stance as you scroll!
      carGroup.rotation.y = -0.55 + scrollFactor * 2.2 + (mouseX * 0.3);
      carGroup.rotation.x = 0.15 + (mouseY * 0.2) + Math.sin(time * 3) * 0.03;
      carGroup.rotation.z = Math.sin(scrollFactor * Math.PI) * 0.15;

      // Position shifts forward as you scroll down
      carGroup.position.z = Math.sin(scrollFactor * 1.5) * 1.5;
      carGroup.position.y = Math.sin(time * 8) * 0.03;

      // Wheels spin faster with scroll or base idle
      const wheelSpeed = 6 + scrollFactor * 18;
      wheels.forEach((w) => {
        w.rotation.x += delta * wheelSpeed;
      });

      // LiDAR spin
      lidar.rotation.y += delta * 7;

      // Warp rings move forward
      rings.forEach((ring, idx) => {
        ring.position.z += delta * (4 + scrollFactor * 15);
        if (ring.position.z > 10) {
          ring.position.z = -18;
        }
        ring.rotation.z += delta * 0.3;
      });

      // Particles drift backward to create hyperdrive forward motion
      particles.position.z = (time * (2 + scrollFactor * 8)) % 8;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [activeThemeObj.hex]);

  return (
    <div className="relative w-full h-[450px] sm:h-[520px] md:h-[600px] flex items-center justify-center">
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-pointer"
        title="Scroll down to animate the 3D NRL Robo Car"
      />

      {/* 3D Scroll Indicator Badge */}
      <div className="absolute bottom-4 left-4 pointer-events-none font-mono text-[10px] text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-md flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activeThemeObj.hex }} />
        <span>3D SCROLL ANIMATION // HYPERDRIVE DRIFT</span>
      </div>

      <div className="absolute top-4 right-4 pointer-events-none font-mono text-[10px] text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 backdrop-blur-md">
        NRL 2026 // CHASSIS AR500
      </div>
    </div>
  );
}
