import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { 
  RotateCw, ZoomIn, Eye, Sparkles, Zap, Shield, 
  Cpu, Activity, Radio, Play, Pause, Layers, Info, Crosshair 
} from 'lucide-react';

export default function RoboCar3DModel({ autoRotate = false }) {
  const mountRef = useRef(null);
  const { activeThemeObj } = useTheme();
  const [wireframeMode, setWireframeMode] = useState(false);
  const [isDriving, setIsDriving] = useState(false);
  const [hoveredPart, setHoveredPart] = useState(null);

  // References
  const wheelsRef = useRef([]);
  const armRef = useRef(null);
  const carGroupRef = useRef(null);
  const interactiveObjectsRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.2, 3.8, 6.8);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    const themeColor = new THREE.Color(activeThemeObj.hex);
    interactiveObjectsRef.current = [];

    const registerPart = (mesh, info) => {
      mesh.userData = info;
      interactiveObjectsRef.current.push(mesh);
    };

    // ==========================================
    // 1. HYPERREALISTIC CLEAR ACRYLIC DECK
    // ==========================================
    const acrylicMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 0.95,
      transparent: true,
      roughness: 0.08,
      ior: 1.49,
      metalness: 0.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      wireframe: wireframeMode
    });

    // Top deck plate
    const topDeckGeom = new THREE.BoxGeometry(2.5, 0.08, 3.8);
    const topDeck = new THREE.Mesh(topDeckGeom, acrylicMat);
    topDeck.position.y = 0.95;
    topDeck.castShadow = true;
    carGroup.add(topDeck);
    registerPart(topDeck, {
      name: "Precision Acrylic Deck",
      category: "CHASSIS DECK",
      desc: "CNC laser-machined 4mm optical grade polycarbonate deck with modular sensor rails."
    });

    // Lower aluminum motor chassis plate
    const alumMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.95,
      roughness: 0.22,
      wireframe: wireframeMode
    });
    const lowerDeckGeom = new THREE.BoxGeometry(2.3, 0.06, 3.5);
    const lowerDeck = new THREE.Mesh(lowerDeckGeom, alumMat);
    lowerDeck.position.y = 0.38;
    lowerDeck.castShadow = true;
    carGroup.add(lowerDeck);
    registerPart(lowerDeck, {
      name: "Aluminum Structural Base",
      category: "LOWER TRAY",
      desc: "Aircraft 6061-T6 alloy base plate providing rigidity against high-speed impacts."
    });

    // 4 Brass/Chrome Standoff Pillars connecting top and lower deck
    const standoffMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
    const standoffGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.52, 12);
    const standoffPositions = [
      { x: -1.0, z: 1.5 },
      { x: 1.0, z: 1.5 },
      { x: -1.0, z: -1.5 },
      { x: 1.0, z: -1.5 }
    ];
    standoffPositions.forEach(p => {
      const standoff = new THREE.Mesh(standoffGeom, standoffMat);
      standoff.position.set(p.x, 0.67, p.z);
      carGroup.add(standoff);
    });

    // ==========================================
    // 2. HEXA COMMAND HUB CONTROLLER (HYPERREAL PCB)
    // ==========================================
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0, 1.02, -0.3);

    // Green multi-layer PCB
    const pcbGeom = new THREE.BoxGeometry(1.5, 0.06, 1.6);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.45,
      metalness: 0.15
    });
    const pcb = new THREE.Mesh(pcbGeom, pcbMat);
    hubGroup.add(pcb);

    // Microcontroller Chip (QFP package with lead pins)
    const mcuGeom = new THREE.BoxGeometry(0.48, 0.08, 0.48);
    const mcuMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3 });
    const mcu = new THREE.Mesh(mcuGeom, mcuMat);
    mcu.position.set(-0.35, 0.06, 0.1);
    hubGroup.add(mcu);

    // Aluminum Fin Heat Sink for Motor Driver
    const sinkGeom = new THREE.BoxGeometry(0.45, 0.18, 0.45);
    const sinkMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.15 });
    const sink = new THREE.Mesh(sinkGeom, sinkMat);
    sink.position.set(0.35, 0.11, 0.1);
    hubGroup.add(sink);

    // Blue Screw Terminal Blocks
    const termGeom = new THREE.BoxGeometry(0.24, 0.16, 1.0);
    const termMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 });
    const termBlock = new THREE.Mesh(termGeom, termMat);
    termBlock.position.set(0.6, 0.1, -0.15);
    hubGroup.add(termBlock);

    // Active Status Blink LEDs
    const ledGeom = new THREE.SphereGeometry(0.045, 12, 12);
    const ledMat = new THREE.MeshBasicMaterial({ color: themeColor });
    const led1 = new THREE.Mesh(ledGeom, ledMat);
    led1.position.set(0.2, 0.08, 0.6);
    hubGroup.add(led1);

    carGroup.add(hubGroup);
    registerPart(pcb, {
      name: "HEXA Command Hub Controller",
      category: "AVIONICS & MOTOR ESC",
      desc: "Multi-channel motor driver and ESP32 wireless telemetry processing core."
    });

    // ==========================================
    // 3. FRONT ROBOTIC GRIPPER & ACTUATOR ARM
    // ==========================================
    const armGroup = new THREE.Group();
    armGroup.position.set(0, 1.05, 1.85);

    // Translucent Blue Micro Servo (SG90/MG90 exactly as in photo)
    const servoGeom = new THREE.BoxGeometry(0.42, 0.42, 0.35);
    const servoMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      transmission: 0.7,
      transparent: true,
      roughness: 0.2,
      ior: 1.4
    });
    const servo = new THREE.Mesh(servoGeom, servoMat);
    servo.position.set(0, 0.18, 0);
    armGroup.add(servo);

    // Servo Output Gear Spline
    const splineGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16);
    const splineMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95 });
    const spline = new THREE.Mesh(splineGeom, splineMat);
    spline.position.set(0, 0.42, 0.08);
    spline.rotation.x = Math.PI / 2;
    armGroup.add(spline);

    // Aluminum Arm Linkage Bracket
    const armBracketMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.2 });
    
    // Left Gripper Claw Finger with Knurled Rubber Grip
    const clawGeom = new THREE.BoxGeometry(0.09, 0.16, 1.05);
    const clawLeft = new THREE.Mesh(clawGeom, armBracketMat);
    clawLeft.position.set(-0.6, 0.12, 0.65);
    clawLeft.rotation.y = 0.22;
    armGroup.add(clawLeft);

    const clawRight = new THREE.Mesh(clawGeom, armBracketMat);
    clawRight.position.set(0.6, 0.12, 0.65);
    clawRight.rotation.y = -0.22;
    armGroup.add(clawRight);

    // Black Textured Rubber Pads on Claws
    const padMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.95 });
    const padL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.38), padMat);
    padL.position.set(-0.51, 0.12, 0.98);
    armGroup.add(padL);

    const padR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.38), padMat);
    padR.position.set(0.51, 0.12, 0.98);
    armGroup.add(padR);

    carGroup.add(armGroup);
    armRef.current = armGroup;

    registerPart(servo, {
      name: "Robotic Gripper & Actuator Claw",
      category: "ACTIVE MANIPULATOR",
      desc: "Micro-servo powered kinetic claw designed to scoop, grip, and transport NRL arena rings."
    });
    registerPart(clawLeft, {
      name: "Robotic Gripper & Actuator Claw",
      category: "ACTIVE MANIPULATOR",
      desc: "Micro-servo powered kinetic claw designed to scoop, grip, and transport NRL arena rings."
    });

    // ==========================================
    // 4. FOUR ALL-TERRAIN WHITE-DISH WHEELS (HYPERREALISTIC)
    // ==========================================
    const wheelPositions = [
      { x: -1.55, y: 0.72, z: 1.25 },
      { x: 1.55, y: 0.72, z: 1.25 },
      { x: -1.55, y: 0.72, z: -1.25 },
      { x: 1.55, y: 0.72, z: -1.25 }
    ];

    wheelsRef.current = [];
    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      // Matte Black Rubber Tire with Tread Ridges
      const tireGeom = new THREE.CylinderGeometry(0.72, 0.72, 0.58, 32);
      const tireMat = new THREE.MeshStandardMaterial({
        color: 0x111318,
        roughness: 0.92,
        metalness: 0.04,
        wireframe: wireframeMode
      });
      const tire = new THREE.Mesh(tireGeom, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Deep White Dish Rim (Glossy Plastic as in NRL photo)
      const rimGeom = new THREE.CylinderGeometry(0.58, 0.58, 0.6, 28);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.05
      });
      const rim = new THREE.Mesh(rimGeom, rimMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      // Recessed Center Dish
      const dishInGeom = new THREE.CylinderGeometry(0.42, 0.55, 0.61, 24);
      const dishInMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.28
      });
      const dishIn = new THREE.Mesh(dishInGeom, dishInMat);
      dishIn.rotation.z = Math.PI / 2;
      wheelGroup.add(dishIn);

      // Center Anodized Hex Locking Nut
      const nutGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.65, 6);
      const nutMat = new THREE.MeshStandardMaterial({
        color: themeColor,
        metalness: 0.92,
        roughness: 0.18
      });
      const nut = new THREE.Mesh(nutGeom, nutMat);
      nut.rotation.z = Math.PI / 2;
      wheelGroup.add(nut);

      // Metal Gearbox Housing connecting motor to chassis
      const motorGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
      const motorMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.92,
        roughness: 0.25
      });
      const motor = new THREE.Mesh(motorGeom, motorMat);
      motor.position.x = pos.x > 0 ? -0.4 : 0.4;
      motor.rotation.z = Math.PI / 2;
      carGroup.add(motor);

      registerPart(motor, {
        name: "Metal Gear High-Torque Motor",
        category: "PROPULSION",
        desc: "All-metal planetary gearbox DC motor producing 180 RPM with peak 4.5 kg-cm stall torque."
      });

      registerPart(rim, {
        name: "NRL All-Terrain Dish Wheel",
        category: "TRACTION WHEEL",
        desc: "High-traction knobby rubber tire mounted on lightweight white competition dish rim."
      });

      carGroup.add(wheelGroup);
      wheelsRef.current.push(wheelGroup);
    });

    // ==========================================
    // 5. RED LATERAL IMPACT SHIELDS
    // ==========================================
    const bumperGeom = new THREE.BoxGeometry(0.12, 0.65, 1.5);
    const bumperMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // Vivid Red as in NRL kit
      roughness: 0.35,
      metalness: 0.3
    });

    const bLeft = new THREE.Mesh(bumperGeom, bumperMat);
    bLeft.position.set(-1.3, 0.78, 0.1);
    bLeft.rotation.z = 0.12;
    bLeft.castShadow = true;
    carGroup.add(bLeft);

    const bRight = new THREE.Mesh(bumperGeom, bumperMat);
    bRight.position.set(1.3, 0.78, 0.1);
    bRight.rotation.z = -0.12;
    bRight.castShadow = true;
    carGroup.add(bRight);

    registerPart(bLeft, {
      name: "Lateral Impact Shield",
      category: "CHASSIS ARMOR",
      desc: "Protective side fairing absorbing lateral collisions in high-speed NRL arena encounters."
    });

    // ==========================================
    // 6. LIPO RECHARGEABLE BATTERY PACK
    // ==========================================
    const battGeom = new THREE.BoxGeometry(0.95, 0.42, 1.35);
    const battMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.2,
      roughness: 0.65
    });
    const batt = new THREE.Mesh(battGeom, battMat);
    batt.position.set(0, 0.56, -0.65);
    batt.castShadow = true;
    carGroup.add(batt);

    // Yellow XT30 Connector Plug
    const xtGeom = new THREE.BoxGeometry(0.2, 0.14, 0.18);
    const xtMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 });
    const xt = new THREE.Mesh(xtGeom, xtMat);
    xt.position.set(0.25, 0.68, -0.05);
    carGroup.add(xt);

    registerPart(batt, {
      name: "Rechargeable Power Pack",
      category: "ENERGY CELL",
      desc: "High-discharge Li-Ion pack providing sustained current to 4 motors and HEXA hub via XT30."
    });

    // ==========================================
    // 7. TOURNAMENT SCORING RINGS (BLUE & RED)
    // ==========================================
    const ringGroup = new THREE.Group();
    ringGroup.position.set(1.5, 0.15, 2.7);

    const ringGeom = new THREE.TorusGeometry(0.38, 0.09, 16, 32);
    const ringBlueMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.2, metalness: 0.3 });
    const r1 = new THREE.Mesh(ringGeom, ringBlueMat);
    r1.rotation.x = Math.PI / 2;
    r1.castShadow = true;
    ringGroup.add(r1);

    const ringRedMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2, metalness: 0.3 });
    const r2 = new THREE.Mesh(ringGeom, ringRedMat);
    r2.rotation.x = Math.PI / 2;
    r2.position.set(-0.85, 0, 0.45);
    r2.castShadow = true;
    ringGroup.add(r2);

    carGroup.add(ringGroup);
    registerPart(r1, {
      name: "NRL Scoring Ring Element",
      category: "ARENA GAME OBJECT",
      desc: "Official competition ring picked up by the robot claw for autonomous/teleoperated scoring."
    });

    // ==========================================
    // 8. REALISTIC STUDIO LIGHTING & GROUND CONTACT
    // ==========================================
    // Soft realistic contact shadow disc under the robot
    const shadowGeom = new THREE.PlaneGeometry(3.6, 5.0);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.18
    });
    const groundShadow = new THREE.Mesh(shadowGeom, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.01;
    scene.add(groundShadow);

    // Studio Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 10, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Soft Rim Light with theme color accent
    const rimLight = new THREE.DirectionalLight(themeColor, 1.8);
    rimLight.position.set(-8, 5, -6);
    scene.add(rimLight);

    // Soft Ambient Studio Fill
    const ambLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambLight);

    // ==========================================
    // 9. RAYCASTER HOVER INTERACTION
    // ==========================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.x = x;
      mouse.y = y;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjectsRef.current, true);

      if (intersects.length > 0) {
        let topObj = intersects[0].object;
        while (topObj && !topObj.userData?.name && topObj.parent) {
          topObj = topObj.parent;
        }

        if (topObj && topObj.userData?.name) {
          setHoveredPart({
            ...topObj.userData,
            clientX: e.clientX,
            clientY: e.clientY
          });
          return;
        }
      }
      setHoveredPart(null);
    };

    container.addEventListener('mousemove', handlePointerMove);

    // DRAG ROTATION
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      carGroup.rotation.y += dx * 0.009;
      carGroup.rotation.x = Math.max(-0.35, Math.min(0.65, carGroup.rotation.x + dy * 0.006));
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const handleMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch Support
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevX;
      const dy = e.touches[0].clientY - prevY;
      carGroup.rotation.y += dx * 0.01;
      carGroup.rotation.x = Math.max(-0.35, Math.min(0.65, carGroup.rotation.x + dy * 0.007));
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    };
    const handleTouchEnd = () => { isDragging = false; };

    container.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Resize
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

      // Auto rotation
      if (autoRotate && !isDragging) {
        carGroup.rotation.y += delta * 0.35;
      }

      // Wheels spin
      if (isDriving) {
        wheelsRef.current.forEach((w) => {
          w.rotation.x += delta * 8;
        });
        carGroup.position.y = Math.sin(time * 20) * 0.012;
      }

      // Servo claw breathing animation
      if (armRef.current) {
        armRef.current.rotation.y = Math.sin(time * 2.2) * 0.15;
      }

      // Status LED blink
      led1.visible = Math.sin(time * 8) > 0;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
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

  return (
    <div className="relative w-full h-full rounded-2xl neo-box-lg overflow-hidden flex flex-col justify-between select-none bg-white">
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-[440px] sm:h-[500px] cursor-grab active:cursor-grabbing flex-1 relative bg-gradient-to-b from-slate-50 to-slate-100"
        title="Hover over parts to inspect specifications. Drag to rotate 360°"
      />

      {/* NEOBRUTALIST FLOATING HOVER INFORMATION HUD */}
      {hoveredPart && (
        <div 
          className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-sm z-30 p-4 rounded-xl neo-box animate-in fade-in slide-in-from-top-2 duration-150"
          style={{
            borderLeft: `6px solid ${activeThemeObj.hex}`
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b-2 border-slate-900 pb-2 mb-2">
            <span className="font-mono text-[10px] tracking-wider font-extrabold uppercase text-slate-900">
              // {hoveredPart.category}
            </span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-slate-900 bg-emerald-300 text-slate-950 font-black">
              100% OPERATIONAL
            </span>
          </div>

          <h4 className="font-['Orbitron'] text-sm sm:text-base font-black text-slate-950 mb-1 flex items-center gap-2">
            <Crosshair className="w-4 h-4 shrink-0 text-slate-900" />
            {hoveredPart.name}
          </h4>

          <p className="text-slate-700 text-xs font-sans font-medium leading-relaxed">
            {hoveredPart.desc}
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-300 flex items-center justify-between font-mono text-[10px] text-slate-500 font-bold">
            <span>OFFICIAL NRL KIT COMPONENT</span>
            <span className="font-mono" style={{ color: activeThemeObj.hex }}>NRL_2026</span>
          </div>
        </div>
      )}

      {/* Top Banner Indicator */}
      {!hoveredPart && (
        <div className="absolute top-4 left-4 pointer-events-none font-mono text-[11px] font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeThemeObj.hex }} />
          <span>HOVER OVER ANY PART TO INSPECT</span>
        </div>
      )}

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            setWireframeMode(!wireframeMode);
          }}
          className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-black border-2 border-slate-900 transition-all ${
            wireframeMode 
              ? 'bg-amber-300 text-slate-950 shadow-[3px_3px_0px_0px_#000]' 
              : 'bg-white text-slate-900 shadow-[2px_2px_0px_0px_#000] hover:bg-slate-100'
          }`}
        >
          {wireframeMode ? 'SOLID' : 'CAD WIREFRAME'}
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setIsDriving(!isDriving);
          }}
          className={`p-2 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] transition-all ${
            isDriving ? 'bg-emerald-300 text-slate-950' : 'bg-white text-slate-900 hover:bg-slate-100'
          }`}
          title={isDriving ? 'Stop Motors' : 'Spin 4WD Wheels'}
        >
          {isDriving ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-900" />}
        </button>
      </div>

      {/* Bottom Bar Instruction */}
      <div className="p-3 bg-white border-t-2 border-slate-900 flex items-center justify-between font-mono text-xs text-slate-800">
        <div className="flex items-center gap-2 font-semibold">
          <Info className="w-4 h-4 text-slate-900" />
          <span>Move cursor over the robotic claw, white wheels, HEXA hub, or acrylic deck to inspect.</span>
        </div>
        <div className="text-[11px] hidden sm:flex items-center gap-1.5 font-bold text-slate-900">
          <RotateCw className="w-3.5 h-3.5" />
          <span>DRAG 360°</span>
        </div>
      </div>
    </div>
  );
}
