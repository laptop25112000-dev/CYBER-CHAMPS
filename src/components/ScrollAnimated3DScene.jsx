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
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 9.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const themeColor = new THREE.Color(activeThemeObj.hex);

    // Root Group for Scroll Transformations
    const sceneGroup = new THREE.Group();
    scene.add(sceneGroup);

    // 1. HYPERREALISTIC ROBO CAR MINI COMBAT MODEL
    const carGroup = new THREE.Group();
    sceneGroup.add(carGroup);

    // Polycarbonate Clear Deck
    const acrylicMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      transparent: true,
      roughness: 0.1,
      ior: 1.49,
      metalness: 0.05
    });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 3.6), acrylicMat);
    deck.position.y = 0.85;
    carGroup.add(deck);

    // Aluminum Lower Base
    const alumMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.25 });
    const lowerDeck = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.06, 3.4), alumMat);
    lowerDeck.position.y = 0.35;
    carGroup.add(lowerDeck);

    // HEXA Command Hub PCB
    const pcbMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.4 });
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 1.4), pcbMat);
    pcb.position.set(0, 0.92, -0.2);
    carGroup.add(pcb);

    // Blue Servo & Gripper Claw
    const servoMat = new THREE.MeshPhysicalMaterial({ color: 0x2563eb, transmission: 0.6, transparent: true });
    const servo = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.3), servoMat);
    servo.position.set(0, 1.05, 1.75);
    carGroup.add(servo);

    const clawMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9 });
    const clawL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.9), clawMat);
    clawL.position.set(-0.55, 1.15, 2.3);
    clawL.rotation.y = 0.2;
    carGroup.add(clawL);

    const clawR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.9), clawMat);
    clawR.position.set(0.55, 1.15, 2.3);
    clawR.rotation.y = -0.2;
    carGroup.add(clawR);

    // Red Lateral Bumpers
    const bumperMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.35 });
    const bL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 1.4), bumperMat);
    bL.position.set(-1.25, 0.75, 0.1);
    bL.rotation.z = 0.12;
    carGroup.add(bL);

    const bR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.55, 1.4), bumperMat);
    bR.position.set(1.25, 0.75, 0.1);
    bR.rotation.z = -0.12;
    carGroup.add(bR);

    // 4 White Dish Wheels with Deep Knobby Rubber Tires
    const wheels = [];
    const wheelPositions = [
      { x: -1.5, y: 0.65, z: 1.2 },
      { x: 1.5, y: 0.65, z: 1.2 },
      { x: -1.5, y: 0.65, z: -1.2 },
      { x: 1.5, y: 0.65, z: -1.2 }
    ];

    wheelPositions.forEach((pos) => {
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.92 });
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.55, 24), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(pos.x, pos.y, pos.z);

      // White Dish Rim
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.57, 20), rimMat);
      rim.rotation.z = Math.PI / 2;
      tire.add(rim);

      // Center Hex Nut
      const nutMat = new THREE.MeshStandardMaterial({ color: themeColor, metalness: 0.9 });
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.6, 6), nutMat);
      nut.rotation.z = Math.PI / 2;
      tire.add(nut);

      carGroup.add(tire);
      wheels.push(tire);
    });

    // 2. CONCENTRIC RINGS (Fly past on scroll)
    const rings = [];
    for (let i = 0; i < 5; i++) {
      const ringGeom = new THREE.TorusGeometry(4.2 + (i % 2) * 1.4, 0.05, 8, 40);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? themeColor : 0x0f172a,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.z = -12 + i * 5.5;
      sceneGroup.add(ring);
      rings.push(ring);
    }

    // 3. STUDIO LIGHTING
    const amb = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 2.5);
    dir.position.set(5, 9, 6);
    scene.add(dir);

    const rim = new THREE.DirectionalLight(themeColor, 1.5);
    rim.position.set(-6, 4, -5);
    scene.add(rim);

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
      carGroup.rotation.y = -0.55 + scrollFactor * 2.2 + (mouseX * 0.3);
      carGroup.rotation.x = 0.15 + (mouseY * 0.2) + Math.sin(time * 3) * 0.03;
      carGroup.rotation.z = Math.sin(scrollFactor * Math.PI) * 0.15;

      carGroup.position.z = Math.sin(scrollFactor * 1.5) * 1.5;
      carGroup.position.y = Math.sin(time * 8) * 0.03;

      const wheelSpeed = 6 + scrollFactor * 18;
      wheels.forEach((w) => {
        w.rotation.x += delta * wheelSpeed;
      });

      rings.forEach((ring) => {
        ring.position.z += delta * (4 + scrollFactor * 15);
        if (ring.position.z > 10) {
          ring.position.z = -18;
        }
        ring.rotation.z += delta * 0.3;
      });

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

      {/* Neobrutalist 3D Scroll Badge */}
      <div className="absolute bottom-4 left-4 pointer-events-none font-mono text-[11px] font-black text-black bg-[#FEF08A] px-3 py-1.5 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full border border-black animate-ping" style={{ backgroundColor: activeThemeObj.hex }} />
        <span>3D SCROLL ANIMATION // DELHI REGIONAL</span>
      </div>

      <div className="absolute top-4 right-4 pointer-events-none font-mono text-[10px] font-black text-black bg-[#FEF08A] px-2.5 py-1 rounded border-2 border-black shadow-[2px_2px_0px_0px_#000]">
        NRL 2026 // DELHI REGIONAL CAR
      </div>
    </div>
  );
}
