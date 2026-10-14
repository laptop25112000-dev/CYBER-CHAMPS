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
  const [activeComponent, setActiveComponent] = useState('all');
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
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(3.8, 3.6, 6.2);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const carGroup = new THREE.Group();
    carGroupRef.current = carGroup;
    scene.add(carGroup);

    const themeColor = new THREE.Color(activeThemeObj.hex);
    interactiveObjectsRef.current = [];

    // Helper to register interactive part
    const registerPart = (mesh, info) => {
      mesh.userData = info;
      interactiveObjectsRef.current.push(mesh);
    };

    // 1. TRANSPARENT ACRYLIC / POLYCARBONATE MAIN DECK (As in NRL Kit)
    const deckGeom = new THREE.BoxGeometry(2.4, 0.08, 3.6);
    const deckMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.85,
      opacity: 0.9,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      metalness: 0.05,
      wireframe: wireframeMode
    });
    const deck = new THREE.Mesh(deckGeom, deckMat);
    deck.position.y = 0.65;
    carGroup.add(deck);
    registerPart(deck, {
      name: "Polycarbonate Chassis Deck",
      category: "STRUCTURAL AIRFRAME",
      desc: "Laser-cut high-impact clear polycarbonate deck with modular mounting grid and truss cutouts."
    });

    // Lower Sub-Chassis Tray
    const lowerDeckGeom = new THREE.BoxGeometry(2.2, 0.06, 3.4);
    const lowerDeckMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.85,
      roughness: 0.3
    });
    const lowerDeck = new THREE.Mesh(lowerDeckGeom, lowerDeckMat);
    lowerDeck.position.y = 0.32;
    carGroup.add(lowerDeck);
    registerPart(lowerDeck, {
      name: "Lower Aluminum Motor Tray",
      category: "STRUCTURAL BASE",
      desc: "CNC-bent aluminum belly pan securing the drive gearboxes and battery compartment."
    });

    // 2. HEXA COMMAND HUB (PCB, Chips, Status LEDs)
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0, 0.72, -0.3);

    const pcbGeom = new THREE.BoxGeometry(1.3, 0.06, 1.4);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b, // PCB Green
      roughness: 0.4,
      metalness: 0.3
    });
    const pcb = new THREE.Mesh(pcbGeom, pcbMat);
    hubGroup.add(pcb);

    // Microcontroller Chip & Heat Sink
    const chipGeom = new THREE.BoxGeometry(0.4, 0.08, 0.4);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
    const chip = new THREE.Mesh(chipGeom, chipMat);
    chip.position.set(-0.25, 0.06, 0);
    hubGroup.add(chip);

    // Terminal Screw Blocks (Blue / Green wire clamps)
    const termGeom = new THREE.BoxGeometry(0.2, 0.1, 0.8);
    const termMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8 });
    const termL = new THREE.Mesh(termGeom, termMat);
    termL.position.set(0.5, 0.07, 0);
    hubGroup.add(termL);

    // Status Blink LEDs
    const ledGeom = new THREE.SphereGeometry(0.04, 8, 8);
    const ledMat = new THREE.MeshBasicMaterial({ color: themeColor });
    const led1 = new THREE.Mesh(ledGeom, ledMat);
    led1.position.set(0.2, 0.08, 0.4);
    hubGroup.add(led1);

    carGroup.add(hubGroup);
    registerPart(pcb, {
      name: "HEXA Command Hub Controller",
      category: "AVIONICS & MOTOR ESC",
      desc: "Onboard brain featuring dual full-bridge motor drivers, 6-channel servo controller, and 2.4GHz wireless telemetry."
    });

    // 3. FRONT ROBOTIC GRIPPER & ACTUATOR ARM (Blue Servo + Linkage Claw)
    const armGroup = new THREE.Group();
    armGroup.position.set(0, 0.75, 1.7);

    // Micro Servo (Blue translucent casing as in kit image)
    const servoGeom = new THREE.BoxGeometry(0.35, 0.35, 0.3);
    const servoMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.3,
      metalness: 0.2
    });
    const servo = new THREE.Mesh(servoGeom, servoMat);
    servo.position.set(0, 0.15, 0);
    armGroup.add(servo);

    // Aluminum Arm Bracket Horn
    const hornGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 12);
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 });
    const horn = new THREE.Mesh(hornGeom, hornMat);
    horn.rotation.x = Math.PI / 2;
    horn.position.set(0, 0.35, 0.1);
    armGroup.add(horn);

    // Claw Left Tine
    const clawMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2
    });
    const tineGeom = new THREE.BoxGeometry(0.08, 0.15, 0.9);
    
    const tineLeft = new THREE.Mesh(tineGeom, clawMat);
    tineLeft.position.set(-0.55, 0.1, 0.55);
    tineLeft.rotation.y = 0.2;
    armGroup.add(tineLeft);

    const tineRight = new THREE.Mesh(tineGeom, clawMat);
    tineRight.position.set(0.55, 0.1, 0.55);
    tineRight.rotation.y = -0.2;
    armGroup.add(tineRight);

    // Gripper Rubber Pads
    const padMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const padL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.3), padMat);
    padL.position.set(-0.46, 0.1, 0.85);
    armGroup.add(padL);

    const padR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, 0.3), padMat);
    padR.position.set(0.46, 0.1, 0.85);
    armGroup.add(padR);

    carGroup.add(armGroup);
    armRef.current = armGroup;
    registerPart(servo, {
      name: "Robotic Gripper & Actuator Claw",
      category: "ACTIVE MANIPULATOR",
      desc: "Micro-servo powered kinetic claw designed to scoop, grip, and transport NRL arena rings."
    });
    registerPart(tineLeft, {
      name: "Robotic Gripper & Actuator Claw",
      category: "ACTIVE MANIPULATOR",
      desc: "Micro-servo powered kinetic claw designed to scoop, grip, and transport NRL arena rings."
    });

    // 4. FOUR ALL-TERRAIN WHITE-DISH WHEELS & TIRES (Exact Match to Kit Photo)
    const wheelPositions = [
      { x: -1.45, y: 0.65, z: 1.15 },
      { x: 1.45, y: 0.65, z: 1.15 },
      { x: -1.45, y: 0.65, z: -1.15 },
      { x: 1.45, y: 0.65, z: -1.15 }
    ];

    wheelsRef.current = [];
    wheelPositions.forEach((pos, idx) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(pos.x, pos.y, pos.z);

      // Deep Tread Knobby Tire (Black rubber)
      const tireGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.52, 28);
      const tireMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.95,
        metalness: 0.05,
        wireframe: wireframeMode
      });
      const tire = new THREE.Mesh(tireGeom, tireMat);
      tire.rotation.z = Math.PI / 2;
      wheelGroup.add(tire);

      // Large White Dish Rim (Iconic feature of the NRL kit!)
      const rimGeom = new THREE.CylinderGeometry(0.52, 0.52, 0.54, 24);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc, // Clean White Dish
        roughness: 0.3,
        metalness: 0.1
      });
      const rim = new THREE.Mesh(rimGeom, rimMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      // Center Wheel Nut (Anodized theme color)
      const nutGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.57, 6);
      const nutMat = new THREE.MeshStandardMaterial({
        color: themeColor,
        metalness: 0.9,
        roughness: 0.2
      });
      const nut = new THREE.Mesh(nutGeom, nutMat);
      nut.rotation.z = Math.PI / 2;
      wheelGroup.add(nut);

      // Metal Gear Motor Housing link to chassis
      const motorGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.55, 16);
      const motorMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.9,
        roughness: 0.25
      });
      const motor = new THREE.Mesh(motorGeom, motorMat);
      motor.position.x = pos.x > 0 ? -0.35 : 0.35;
      motor.rotation.z = Math.PI / 2;
      carGroup.add(motor);

      registerPart(motor, {
        name: "Metal Gear High-Torque Motor",
        category: "PROPULSION",
        desc: "All-metal planetary gearbox DC motor producing 180 RPM with extreme stall torque."
      });

      registerPart(rim, {
        name: "NRL All-Terrain Dish Wheel",
        category: "TRACTION WHEEL",
        desc: "High-traction knobby rubber tire mounted on lightweight white competition dish rim."
      });

      carGroup.add(wheelGroup);
      wheelsRef.current.push(wheelGroup);
    });

    // 5. RED / NEON ANGLED BUMPER PLATES (As visible in kit image)
    const bColor = new THREE.Color(0xdc2626); // Red bumper plate from kit
    const bumperGeom = new THREE.BoxGeometry(0.1, 0.55, 1.4);
    const bumperMat = new THREE.MeshStandardMaterial({
      color: bColor,
      roughness: 0.4,
      metalness: 0.2
    });

    // Left Bumper Plate
    const bLeft = new THREE.Mesh(bumperGeom, bumperMat);
    bLeft.position.set(-1.22, 0.72, 0.1);
    bLeft.rotation.z = 0.15;
    carGroup.add(bLeft);

    // Right Bumper Plate
    const bRight = new THREE.Mesh(bumperGeom, bumperMat);
    bRight.position.set(1.22, 0.72, 0.1);
    bRight.rotation.z = -0.15;
    carGroup.add(bRight);

    registerPart(bLeft, {
      name: "Lateral Impact Shield",
      category: "CHASSIS ARMOR",
      desc: "Protective side fairing absorbing lateral collisions in high-speed NRL arena encounters."
    });
    registerPart(bRight, {
      name: "Lateral Impact Shield",
      category: "CHASSIS ARMOR",
      desc: "Protective side fairing absorbing lateral collisions in high-speed NRL arena encounters."
    });

    // 6. RECHARGEABLE LIPO BATTERY PACK
    const battGeom = new THREE.BoxGeometry(0.8, 0.35, 1.2);
    const battMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.4,
      roughness: 0.5
    });
    const batt = new THREE.Mesh(battGeom, battMat);
    batt.position.set(0, 0.45, -0.6);
    carGroup.add(batt);

    // XT30 Gold Connector
    const xtGeom = new THREE.BoxGeometry(0.18, 0.12, 0.15);
    const xtMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const xt = new THREE.Mesh(xtGeom, xtMat);
    xt.position.set(0.2, 0.55, -0.1);
    carGroup.add(xt);

    registerPart(batt, {
      name: "Rechargeable Power Pack",
      category: "ENERGY CELL",
      desc: "High-discharge Li-Ion pack providing sustained current to 4 motors and HEXA hub."
    });

    // 7. TOURNAMENT SCORING ELEMENT (Blue, Red, Yellow Rings on ground)
    const ringGroup = new THREE.Group();
    ringGroup.position.set(1.4, 0.12, 2.5);

    const ringGeom = new THREE.TorusGeometry(0.35, 0.08, 12, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.2,
      metalness: 0.5
    });
    const ring1 = new THREE.Mesh(ringGeom, ringMat);
    ring1.rotation.x = Math.PI / 2;
    ringGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeom, new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
    ring2.rotation.x = Math.PI / 2;
    ring2.position.set(-0.8, 0, 0.4);
    ringGroup.add(ring2);

    carGroup.add(ringGroup);
    registerPart(ring1, {
      name: "NRL Scoring Ring Element",
      category: "ARENA GAME OBJECT",
      desc: "Official competition ring picked up by the robot claw for autonomous/teleoperated scoring."
    });

    // 8. NEON UNDERGLOW & DUAL HEADLIGHTS
    const underglowGeom = new THREE.PlaneGeometry(2.2, 3.4);
    const underglowMat = new THREE.MeshBasicMaterial({
      color: themeColor,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const underglow = new THREE.Mesh(underglowGeom, underglowMat);
    underglow.rotation.x = Math.PI / 2;
    underglow.position.y = 0.15;
    carGroup.add(underglow);

    // Front Forward White Headlights
    const hlGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 12);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hl1 = new THREE.Mesh(hlGeom, hlMat);
    hl1.rotation.x = Math.PI / 2;
    hl1.position.set(-0.85, 0.68, 1.82);
    carGroup.add(hl1);

    const hl2 = new THREE.Mesh(hlGeom, hlMat);
    hl2.rotation.x = Math.PI / 2;
    hl2.position.set(0.85, 0.68, 1.82);
    carGroup.add(hl2);

    // Grid Floor
    const grid = new THREE.GridHelper(16, 16, themeColor, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    // Lighting
    const amb = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 2.5);
    dir.position.set(5, 8, 5);
    scene.add(dir);

    const pointLight = new THREE.PointLight(themeColor, 3, 8);
    pointLight.position.set(0, 0.6, 0);
    scene.add(pointLight);

    // RAYCASTER FOR HOVER INFORMATION
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
        // Find topmost object with userData
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

    // ANIMATION
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

      // Wheels rotation when driving
      if (isDriving) {
        wheelsRef.current.forEach((w) => {
          w.rotation.x += delta * 7;
        });
        carGroup.position.y = Math.sin(time * 18) * 0.015;
      }

      // Servo claw breathing animation
      if (armRef.current) {
        armRef.current.rotation.y = Math.sin(time * 2.5) * 0.12;
      }

      // LED blink
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
    <div className="relative w-full h-full rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden flex flex-col justify-between select-none">
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-[420px] sm:h-[480px] cursor-grab active:cursor-grabbing flex-1 relative"
        title="Hover over parts to inspect specifications. Drag to rotate 360°"
      />

      {/* FLOATING HOVER INFORMATION HUD (Triggered when cursor hovers any 3D part) */}
      {hoveredPart && (
        <div 
          className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-sm z-30 p-4 rounded-xl bg-slate-900/95 border shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
          style={{
            borderColor: activeThemeObj.hex,
            boxShadow: `0 0 30px ${activeThemeObj.bgGlow}`
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <span 
              className="font-mono text-[10px] tracking-widest font-bold uppercase"
              style={{ color: activeThemeObj.hex }}
            >
              // {hoveredPart.category}
            </span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-semibold">
              DIAGNOSTIC: 100% OK
            </span>
          </div>

          <h4 className="font-['Orbitron'] text-sm sm:text-base font-bold text-white mb-1 flex items-center gap-2">
            <Crosshair className="w-4 h-4 shrink-0" style={{ color: activeThemeObj.hex }} />
            {hoveredPart.name}
          </h4>

          <p className="text-slate-300 text-xs font-sans leading-relaxed">
            {hoveredPart.desc}
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-[10px] text-slate-400">
            <span>TELEMETRY: ACTIVE LINK</span>
            <span style={{ color: activeThemeObj.hex }}>NRL_KIT_v2</span>
          </div>
        </div>
      )}

      {/* Top HUD Badges */}
      {!hoveredPart && (
        <div className="absolute top-4 left-4 pointer-events-none font-mono text-[11px] text-white bg-slate-900/85 px-3 py-1.5 rounded-lg border border-slate-700/80 backdrop-blur-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activeThemeObj.hex }} />
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
          className={`px-2.5 py-1 rounded-md font-mono text-[10px] border transition-all ${
            wireframeMode 
              ? 'bg-cyan-950 text-cyan-300 border-cyan-400 font-bold' 
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          {wireframeMode ? 'SOLID' : 'WIREFRAME'}
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setIsDriving(!isDriving);
          }}
          className="p-1.5 rounded-md bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800"
          title={isDriving ? 'Halt Motors' : 'Spin 4WD Wheels'}
        >
          {isDriving ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
        </button>
      </div>

      {/* Bottom Bar Instruction */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between font-mono text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" style={{ color: activeThemeObj.hex }} />
          <span>Move cursor over the robot claw, wheels, hub, or chassis to reveal telemetry.</span>
        </div>
        <div className="text-[11px] hidden sm:flex items-center gap-1 text-slate-400">
          <RotateCw className="w-3 h-3 text-cyan-400" />
          <span>DRAG 360°</span>
        </div>
      </div>
    </div>
  );
}
