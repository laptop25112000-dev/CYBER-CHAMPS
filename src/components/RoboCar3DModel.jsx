import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { 
  RotateCw, ZoomIn, Eye, Sparkles, Zap, Shield, 
  Cpu, Activity, Radio, Play, Pause 
} from 'lucide-react';

export default function RoboCar3DModel({ autoRotate = true, scrollProgress = 0, isHeroMode = false }) {
  const mountRef = useRef(null);
  const { activeThemeObj } = useTheme();
  const [wireframeMode, setWireframeMode] = useState(false);
  const [isDriving, setIsDriving] = useState(true);
  const [activeComponent, setActiveComponent] = useState('all');

  // References to animate dynamically
  const wheelsRef = useRef([]);
  const lidarRef = useRef(null);
  const lightsRef = useRef([]);
  const carGroupRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 9);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Main Car Container Group
    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    const themeColor = new THREE.Color(activeThemeObj.hex);

    // 1. CHASSIS BASE (Aerospace Grade Titanium Alloy)
    const chassisGeom = new THREE.BoxGeometry(3.6, 0.55, 5.2);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x111625,
      roughness: 0.35,
      metalness: 0.85,
      wireframe: wireframeMode
    });
    const chassis = new THREE.Mesh(chassisGeom, chassisMat);
    chassis.position.y = 0.55;
    carGroup.add(chassis);

    // 2. SLOPED FRONT WEDGE / DEFLECTION ARMOR (NRL Hyperdrive Spec)
    const wedgeGeom = new THREE.ConeGeometry(2.1, 1.8, 4);
    const wedgeMat = new THREE.MeshStandardMaterial({
      color: 0x1a233a,
      roughness: 0.25,
      metalness: 0.9,
      wireframe: wireframeMode
    });
    const wedge = new THREE.Mesh(wedgeGeom, wedgeMat);
    wedge.rotation.y = Math.PI / 4;
    wedge.rotation.x = -Math.PI / 2.3;
    wedge.position.set(0, 0.38, 2.7);
    wedge.scale.set(1.2, 0.45, 1.6);
    carGroup.add(wedge);

    // Front Bumper / Titanium Scoop Lip
    const lipGeom = new THREE.BoxGeometry(3.2, 0.1, 0.5);
    const lipMat = new THREE.MeshStandardMaterial({
      color: themeColor,
      emissive: themeColor,
      emissiveIntensity: 0.4,
      metalness: 0.95
    });
    const lip = new THREE.Mesh(lipGeom, lipMat);
    lip.position.set(0, 0.1, 3.2);
    carGroup.add(lip);

    // 3. TOP CABIN / ELECTRONICS BAY COCKPIT
    const cabinGeom = new THREE.BoxGeometry(2.2, 0.5, 2.8);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: wireframeMode
    });
    const cabin = new THREE.Mesh(cabinGeom, cabinMat);
    cabin.position.set(0, 1.0, -0.2);
    carGroup.add(cabin);

    // Cabin Armor Bevels (Carbon Fiber Insets)
    const bevelGeom = new THREE.BoxGeometry(1.9, 0.25, 2.2);
    const bevelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.5
    });
    const bevel = new THREE.Mesh(bevelGeom, bevelMat);
    bevel.position.set(0, 1.35, -0.2);
    carGroup.add(bevel);

    // 4. TOP ROTATING LIDAR TURRET (Autonomous Edge Guidance)
    const lidarBaseGeom = new THREE.CylinderGeometry(0.35, 0.4, 0.3, 16);
    const lidarBaseMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const lidarBase = new THREE.Mesh(lidarBaseGeom, lidarBaseMat);
    lidarBase.position.set(0, 1.55, -0.2);
    carGroup.add(lidarBase);

    const lidarHeadGeom = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 16);
    const lidarHeadMat = new THREE.MeshBasicMaterial({
      color: themeColor,
      wireframe: true
    });
    const lidarHead = new THREE.Mesh(lidarHeadGeom, lidarHeadMat);
    lidarHead.position.set(0, 1.75, -0.2);
    carGroup.add(lidarHead);
    lidarRef.current = lidarHead;

    // 5. WHEELS & BRUSHLESS DRIVE MOTORS (4-Wheel High Torque)
    const wheelPositions = [
      { x: -1.95, y: 0.55, z: 1.6 },   // Front Left
      { x: 1.95, y: 0.55, z: 1.6 },    // Front Right
      { x: -1.95, y: 0.55, z: -1.6 },  // Rear Left
      { x: 1.95, y: 0.55, z: -1.6 }    // Rear Right
    ];

    wheelsRef.current = [];
    wheelPositions.forEach((pos, idx) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      // Tire (Rubber)
      const tireGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.55, 24);
      const tireMat = new THREE.MeshStandardMaterial({
        color: 0x05070c,
        roughness: 0.9,
        metalness: 0.1,
        wireframe: wireframeMode
      });
      const tire = new THREE.Mesh(tireGeom, tireMat);
      tire.rotation.z = Math.PI / 2;
      wheelGroup.add(tire);

      // Rim Spoke (Alloy with Theme Accent)
      const rimGeom = new THREE.CylinderGeometry(0.42, 0.42, 0.57, 12);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0x222a3d,
        metalness: 0.95,
        roughness: 0.2
      });
      const rim = new THREE.Mesh(rimGeom, rimMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      // Rim Center Hub glowing ring
      const hubGeom = new THREE.TorusGeometry(0.25, 0.04, 8, 16);
      const hubMat = new THREE.MeshBasicMaterial({ color: themeColor });
      const hub = new THREE.Mesh(hubGeom, hubMat);
      hub.rotation.y = Math.PI / 2;
      hub.position.x = pos.x > 0 ? 0.29 : -0.29;
      wheelGroup.add(hub);

      // Motor Canister Linkage
      const motorGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 12);
      const motorMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });
      const motor = new THREE.Mesh(motorGeom, motorMat);
      motor.position.x = pos.x > 0 ? -0.3 : 0.3;
      motor.rotation.z = Math.PI / 2;
      carGroup.add(motor);

      carGroup.add(wheelGroup);
      wheelsRef.current.push(wheelGroup);
    });

    // 6. DUAL HIGH-BEAM LED HEADLIGHTS
    lightsRef.current = [];
    const headlightGeom = new THREE.BoxGeometry(0.5, 0.15, 0.1);
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const hlLeft = new THREE.Mesh(headlightGeom, headlightMat);
    hlLeft.position.set(-1.1, 0.65, 2.65);
    carGroup.add(hlLeft);

    const hlRight = new THREE.Mesh(headlightGeom, headlightMat);
    hlRight.position.set(1.1, 0.65, 2.65);
    carGroup.add(hlRight);

    // Spotlights casting forward light
    const spotLeft = new THREE.SpotLight(0xffffff, 4, 15, Math.PI / 6, 0.4);
    spotLeft.position.set(-1.1, 0.65, 2.65);
    spotLeft.target.position.set(-1.1, 0, 8);
    carGroup.add(spotLeft);
    carGroup.add(spotLeft.target);

    const spotRight = new THREE.SpotLight(0xffffff, 4, 15, Math.PI / 6, 0.4);
    spotRight.position.set(1.1, 0.65, 2.65);
    spotRight.target.position.set(1.1, 0, 8);
    carGroup.add(spotRight);
    carGroup.add(spotRight.target);

    // 7. NEON UNDERGLOW ACCENT STRIPS (matches theme color!)
    const underglowGeom = new THREE.PlaneGeometry(3.0, 4.4);
    const underglowMat = new THREE.MeshBasicMaterial({
      color: themeColor,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });
    const underglow = new THREE.Mesh(underglowGeom, underglowMat);
    underglow.rotation.x = Math.PI / 2;
    underglow.position.y = 0.08;
    carGroup.add(underglow);

    // 8. REAR RACING SPOILER / AERODYNAMIC WING (Hyperdrive edition)
    const wingGeom = new THREE.BoxGeometry(3.2, 0.1, 0.7);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.9
    });
    const wing = new THREE.Mesh(wingGeom, wingMat);
    wing.position.set(0, 1.45, -2.4);
    carGroup.add(wing);

    // Wing Struts
    const strutLeft = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.3), wingMat);
    strutLeft.position.set(-1.0, 1.15, -2.35);
    carGroup.add(strutLeft);

    const strutRight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.3), wingMat);
    strutRight.position.set(1.0, 1.15, -2.35);
    carGroup.add(strutRight);

    // 9. TELEMETRY ANTENNA WITH BLINKING BEACON
    const antGeom = new THREE.CylinderGeometry(0.02, 0.04, 1.2, 8);
    const antMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 });
    const antenna = new THREE.Mesh(antGeom, antMat);
    antenna.position.set(0.9, 1.8, -1.2);
    antenna.rotation.x = -0.15;
    carGroup.add(antenna);

    const beaconGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: themeColor });
    const beacon = new THREE.Mesh(beaconGeom, beaconMat);
    beacon.position.set(0.9, 2.4, -1.3);
    carGroup.add(beacon);

    // 10. REFLECTIVE CYBER GROUND GRID
    const gridHelper = new THREE.GridHelper(24, 24, themeColor, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // LIGHTING SETUP
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const neonFill = new THREE.PointLight(themeColor, 3, 10);
    neonFill.position.set(0, 0.3, 0);
    scene.add(neonFill);

    // MOUSE DRAG ORBIT INTERACTION
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      carGroup.rotation.y += deltaX * 0.008;
      carGroup.rotation.x = Math.max(-0.4, Math.min(0.6, carGroup.rotation.x + deltaY * 0.005));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support for mobile
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      carGroup.rotation.y += deltaX * 0.01;
      carGroup.rotation.x = Math.max(-0.4, Math.min(0.6, carGroup.rotation.x + deltaY * 0.006));
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };
    const handleTouchEnd = () => { isDragging = false; };

    container.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // RESIZE LISTENER
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

      // Auto rotation if enabled and not being dragged
      if (autoRotate && !isDragging) {
        carGroup.rotation.y += delta * 0.4;
      }

      // Spinning wheels when driving
      if (isDriving) {
        wheelsRef.current.forEach((w) => {
          w.rotation.x += delta * 8;
        });
        // Slight driving vibration
        carGroup.position.y = Math.sin(time * 20) * 0.015;
      }

      // Rotating LiDAR
      if (lidarRef.current) {
        lidarRef.current.rotation.y += delta * 6;
      }

      // Beacon blink
      beacon.visible = Math.sin(time * 6) > 0;

      // Ground grid scroll effect when driving
      if (isDriving) {
        gridHelper.position.z = (time * 4) % 1;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [activeThemeObj.hex, wireframeMode, isDriving, autoRotate]);

  // Handle component focus camera moves
  const focusComponent = (comp) => {
    soundManager.playClick();
    setActiveComponent(comp);
    if (!carGroupRef.current) return;

    if (comp === 'wedge') {
      carGroupRef.current.rotation.set(0.1, -Math.PI / 4, 0);
    } else if (comp === 'lidar') {
      carGroupRef.current.rotation.set(-0.35, 0, 0);
    } else if (comp === 'drive') {
      carGroupRef.current.rotation.set(0.2, Math.PI / 2, 0);
    } else {
      carGroupRef.current.rotation.set(0.15, -0.4, 0);
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden flex flex-col justify-between">
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-[400px] sm:h-[480px] cursor-grab active:cursor-grabbing flex-1"
        title="Click and drag to rotate the 3D Robo Car"
      />

      {/* Floating HUD Badges */}
      <div className="absolute top-4 left-4 font-mono text-[11px] text-white bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/80 backdrop-blur-md flex items-center gap-2">
        <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activeThemeObj.hex }} />
        <span>NRL HYPERDRIVE ROBO CAR v2.6</span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            setWireframeMode(!wireframeMode);
          }}
          className={`px-2.5 py-1 rounded-md font-mono text-[10px] border transition-all ${
            wireframeMode 
              ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold' 
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          {wireframeMode ? 'SOLID MODE' : 'WIREFRAME'}
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setIsDriving(!isDriving);
          }}
          className="p-1.5 rounded-md bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800"
          title={isDriving ? 'Pause Motors' : 'Spin Wheels & Drive'}
        >
          {isDriving ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>

      {/* Bottom Component Inspection Bar */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 text-[11px] mr-1">INSPECT:</span>
          {[
            { id: 'all', label: 'Overview' },
            { id: 'wedge', label: 'Titanium Wedge' },
            { id: 'lidar', label: 'LiDAR Turret' },
            { id: 'drive', label: 'Brushless Drive' }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => focusComponent(c.id)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeComponent === c.id
                  ? 'bg-white text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <RotateCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>DRAG 360° TO ROTATE</span>
        </div>
      </div>
    </div>
  );
}
