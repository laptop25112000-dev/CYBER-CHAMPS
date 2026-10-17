import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { buildRoboCar3DGroup } from '../utils/roboCar3DBuilder';
import { 
  RotateCw, ZoomIn, Eye, Sparkles, Zap, Shield, 
  Cpu, Activity, Radio, Play, Pause, Layers, Info, Crosshair 
} from 'lucide-react';

export default function RoboCar3DModel({ autoRotate = false }) {
  const mountRef = useRef(null);
  const { activeThemeObj } = useTheme();
  const [wireframeMode, setWireframeMode] = useState(false);
  const [isDriving, setIsDriving] = useState(false);
  const [isDonutTumbling, setIsDonutTumbling] = useState(true);
  const [hoveredPart, setHoveredPart] = useState(null);

  // WASD Drive Simulator State
  const [isSimulatorActive, setIsSimulatorActive] = useState(false);
  const [simSpeed, setSimSpeed] = useState(0);
  const [simClawClosed, setSimClawClosed] = useState(false);
  const simControlsRef = useRef({ fwd: false, bwd: false, left: false, right: false, claw: false });

  // References
  const wheelsRef = useRef([]);
  const armRef = useRef(null);
  const carGroupRef = useRef(null);
  const ledRef = useRef(null);
  const groundShadowRef = useRef(null);
  const interactiveObjectsRef = useRef([]);

  // Drive Simulator Key Listeners
  useEffect(() => {
    if (!isSimulatorActive) return;

    const handleKeyDown = (e) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') simControlsRef.current.fwd = true;
      if (code === 'KeyS' || code === 'ArrowDown') simControlsRef.current.bwd = true;
      if (code === 'KeyA' || code === 'ArrowLeft') simControlsRef.current.left = true;
      if (code === 'KeyD' || code === 'ArrowRight') simControlsRef.current.right = true;
      if (code === 'Space') {
        e.preventDefault();
        simControlsRef.current.claw = !simControlsRef.current.claw;
        setSimClawClosed(simControlsRef.current.claw);
        soundManager.playClick();
      }
    };

    const handleKeyUp = (e) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') simControlsRef.current.fwd = false;
      if (code === 'KeyS' || code === 'ArrowDown') simControlsRef.current.bwd = false;
      if (code === 'KeyA' || code === 'ArrowLeft') simControlsRef.current.left = false;
      if (code === 'KeyD' || code === 'ArrowRight') simControlsRef.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isSimulatorActive]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.2, 3.2, 6.8);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const themeColor = new THREE.Color(activeThemeObj.hex);
    interactiveObjectsRef.current = [];

    // Build hyperrealistic robo car using shared builder
    const { carGroup, wheels, armGroup, led } = buildRoboCar3DGroup({
      themeHex: activeThemeObj.hex,
      wireframe: wireframeMode,
      onRegisterPart: (mesh, info) => {
        interactiveObjectsRef.current.push(mesh);
      }
    });

    carGroupRef.current = carGroup;
    wheelsRef.current = wheels;
    armRef.current = armGroup;
    ledRef.current = led;
    scene.add(carGroup);

    // Studio Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 10, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Soft Rim Light with theme color accent
    const rimLight = new THREE.DirectionalLight(themeColor, 2.0);
    rimLight.position.set(-8, 5, -6);
    scene.add(rimLight);

    // Soft Ambient Studio Fill
    const ambLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambLight);

    // Ground Contact Shadow
    const shadowGeom = new THREE.PlaneGeometry(4.0, 5.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.16
    });
    const groundShadow = new THREE.Mesh(shadowGeom, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.01;
    scene.add(groundShadow);

    // Raycaster for hover telemetry
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

    // Drag Rotation
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
      carGroup.rotation.x = Math.max(-0.45, Math.min(0.75, carGroup.rotation.x + dy * 0.006));
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
      carGroup.rotation.x = Math.max(-0.45, Math.min(0.75, carGroup.rotation.x + dy * 0.007));
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
    let currentSimSpeed = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // 1. WASD REAL-TIME DRIVE SIMULATOR
      if (isSimulatorActive) {
        const ctrl = simControlsRef.current;
        let targetSpeed = 0;
        if (ctrl.fwd) targetSpeed = 14.5;
        else if (ctrl.bwd) targetSpeed = -7.2;

        currentSimSpeed += (targetSpeed - currentSimSpeed) * Math.min(1, delta * 5);
        setSimSpeed(currentSimSpeed);

        // Steering Yaw
        if (ctrl.left) carGroup.rotation.y += delta * 2.4;
        if (ctrl.right) carGroup.rotation.y -= delta * 2.4;

        // Pitch with acceleration
        carGroup.rotation.x = (currentSimSpeed / 14.5) * 0.08;

        // Spin wheels based on speed
        wheelsRef.current.forEach((w) => {
          w.rotation.x += currentSimSpeed * delta * 2.8;
        });

        // Articulated claw clamp
        if (armRef.current) {
          const targetArmAngle = ctrl.claw ? -0.45 : 0.08;
          armRef.current.rotation.y += (targetArmAngle - armRef.current.rotation.y) * 0.15;
        }

        // Slight road vibration
        carGroup.position.y = Math.sin(time * 30) * Math.abs(currentSimSpeed) * 0.001;
      } 
      // 2. DONUT TUMBLE ANIMATION STYLE
      else if (isDonutTumbling && !isDragging) {
        carGroup.rotation.y += delta * 0.42;
        carGroup.rotation.x = Math.sin(time * 0.85) * 0.24 + 0.16;
        carGroup.rotation.z = Math.cos(time * 0.7) * 0.12;
        carGroup.position.y = Math.sin(time * 1.6) * 0.12;

        const s = 1.0 - carGroup.position.y * 0.4;
        groundShadow.scale.set(s, s, s);
        groundShadow.material.opacity = Math.max(0.08, 0.18 - carGroup.position.y * 0.1);

        wheelsRef.current.forEach((w) => {
          w.rotation.x += delta * 3.5;
        });

        if (armRef.current) {
          armRef.current.rotation.y = Math.sin(time * 2.2) * 0.14;
        }
      } else if (autoRotate && !isDragging) {
        carGroup.rotation.y += delta * 0.35;
      }

      // Wheels spin in driving test
      if (isDriving && !isSimulatorActive) {
        wheelsRef.current.forEach((w) => {
          w.rotation.x += delta * 12;
        });
        carGroup.position.y = Math.sin(time * 24) * 0.015;
      }

      // Status LED blink
      if (ledRef.current) {
        ledRef.current.visible = Math.sin(time * 8) > 0;
      }

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
  }, [activeThemeObj.hex, wireframeMode, isDriving, isDonutTumbling, autoRotate]);

  return (
    <div className="relative w-full h-full rounded-2xl neo-box-lg overflow-hidden flex flex-col justify-between select-none bg-[#FFF9EB] border-3 border-black shadow-[6px_6px_0px_0px_#000]">
      {/* 3D WebGL Canvas */}
      <div 
        ref={mountRef} 
        className="w-full h-[460px] sm:h-[540px] cursor-grab active:cursor-grabbing flex-1 relative bg-[#FAF5E6]"
        title="Hover over parts to inspect specifications. Drag to rotate 360°"
      />

      {/* NEOBRUTALIST FLOATING HOVER INFORMATION HUD */}
      {hoveredPart && (
        <div 
          className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-sm z-30 p-4 rounded-xl neo-box animate-in fade-in slide-in-from-top-2 duration-150 bg-[#FFF9EB] border-3 border-black shadow-[5px_5px_0px_0px_#000]"
          style={{
            borderLeft: `6px solid ${activeThemeObj.hex}`
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-2 mb-2">
            <span className="font-mono text-[10px] tracking-wider font-black uppercase text-black">
              // {hoveredPart.category}
            </span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-black bg-emerald-300 text-black font-black">
              100% OPERATIONAL
            </span>
          </div>

          <h4 className="font-['Orbitron'] text-sm sm:text-base font-black text-black mb-1 flex items-center gap-2">
            <Crosshair className="w-4 h-4 shrink-0 text-black" />
            {hoveredPart.name}
          </h4>

          <p className="text-slate-800 text-xs font-sans font-medium leading-relaxed">
            {hoveredPart.desc}
          </p>

          <div className="mt-2.5 pt-2 border-t border-black/20 flex items-center justify-between font-mono text-[10px] text-slate-700 font-bold">
            <span>OFFICIAL NRL KIT COMPONENT</span>
            <span className="font-mono font-black" style={{ color: activeThemeObj.hex }}>NRL_2026</span>
          </div>
        </div>
      )}

      {/* Top Left Status Badge */}
      {!hoveredPart && (
        <div className="absolute top-4 left-4 pointer-events-none font-mono text-[11px] font-black text-black bg-[#FEF08A] px-3 py-1.5 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeThemeObj.hex }} />
          <span>{isDonutTumbling ? 'DONUT 3D TUMBLE ACTIVE' : 'HOVER TO INSPECT'}</span>
        </div>
      )}

      {/* Top Right Controls HUD */}
      <div className="absolute top-4 right-4 flex flex-wrap items-center gap-2 z-20">
        {/* WASD DRIVE SIMULATOR TOGGLE */}
        <button
          onClick={() => {
            soundManager.playClick();
            const next = !isSimulatorActive;
            setIsSimulatorActive(next);
            if (next) {
              setIsDonutTumbling(false);
              setIsDriving(false);
            }
          }}
          className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-black border-2 border-black transition-all flex items-center gap-1.5 ${
            isSimulatorActive 
              ? 'bg-[#BBF7D0] text-black shadow-[3px_3px_0px_0px_#000] animate-pulse' 
              : 'bg-[#FFF9EB] text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#BBF7D0]'
          }`}
          title="Drive Robo Car with Keyboard (W, A, S, D, Space) or On-Screen Controls"
        >
          <Zap className="w-3.5 h-3.5 text-black" />
          <span>{isSimulatorActive ? 'DRIVE MODE ACTIVE' : 'TEST DRIVE (WASD)'}</span>
        </button>

        {/* DONUT ANIMATION STYLE TOGGLE */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsSimulatorActive(false);
            setIsDonutTumbling(!isDonutTumbling);
          }}
          className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-black border-2 border-black transition-all flex items-center gap-1.5 ${
            isDonutTumbling && !isSimulatorActive
              ? 'bg-[#FEF08A] text-black shadow-[3px_3px_0px_0px_#000]' 
              : 'bg-[#FFF9EB] text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FEF08A]'
          }`}
          title="Toggle Donut-Style Multi-Axis 3D Tumbling Animation"
        >
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>DONUT TUMBLE</span>
        </button>

        {/* CAD Wireframe Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            setWireframeMode(!wireframeMode);
          }}
          className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-black border-2 border-black transition-all ${
            wireframeMode 
              ? 'bg-[#FEF08A] text-black shadow-[3px_3px_0px_0px_#000]' 
              : 'bg-[#FFF9EB] text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FEF08A]'
          }`}
        >
          {wireframeMode ? 'SOLID' : 'CAD WIREFRAME'}
        </button>

        {/* 4WD Wheels Drive Test */}
        <button
          onClick={() => {
            soundManager.playClick();
            setIsDriving(!isDriving);
          }}
          className={`p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all ${
            isDriving ? 'bg-emerald-300 text-black' : 'bg-[#FFF9EB] text-black hover:bg-[#FEF08A]'
          }`}
          title={isDriving ? 'Stop Motors' : 'Spin 4WD Wheels'}
        >
          {isDriving ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
        </button>
      </div>

      {/* WASD TELEMETRY & ON-SCREEN GAMEPAD OVERLAY */}
      {isSimulatorActive && (
        <>
          {/* Live Telemetry Speedometer Gauge (Bottom-Left) */}
          <div className="absolute bottom-14 left-4 z-20 p-3 rounded-xl border-3 border-black bg-[#FEF08A] shadow-[4px_4px_0px_0px_#000] font-mono text-black space-y-1">
            <div className="text-[10px] font-black flex items-center justify-between gap-4 border-b border-black pb-1">
              <span>REAL-TIME 4WD TELEMETRY</span>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-['Orbitron'] text-2xl font-black">
                {Math.abs(simSpeed).toFixed(1)}
              </span>
              <span className="text-xs font-bold">KM/H</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-black text-[#FEF08A] ml-auto">
                {simSpeed > 0.5 ? 'FORWARD' : simSpeed < -0.5 ? 'REVERSE' : 'IDLE'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-800 pt-1">
              <div>RPM: {Math.round(Math.abs(simSpeed) * 85)}</div>
              <div>BATT: 12.4V</div>
            </div>
          </div>

          {/* On-Screen Tactile D-Pad Controls (Bottom-Right) */}
          <div className="absolute bottom-14 right-4 z-20 flex flex-col items-center gap-1.5 p-3 rounded-2xl border-3 border-black bg-[#FFF9EB] shadow-[4px_4px_0px_0px_#000]">
            <span className="font-mono text-[9px] font-black uppercase text-black">
              WASD / ON-SCREEN CONTROLS
            </span>
            <button
              onMouseDown={() => { simControlsRef.current.fwd = true; }}
              onMouseUp={() => { simControlsRef.current.fwd = false; }}
              onTouchStart={() => { simControlsRef.current.fwd = true; }}
              onTouchEnd={() => { simControlsRef.current.fwd = false; }}
              className="w-10 h-10 rounded-lg border-2 border-black bg-[#FEF08A] font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5"
            >
              W
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onMouseDown={() => { simControlsRef.current.left = true; }}
                onMouseUp={() => { simControlsRef.current.left = false; }}
                onTouchStart={() => { simControlsRef.current.left = true; }}
                onTouchEnd={() => { simControlsRef.current.left = false; }}
                className="w-10 h-10 rounded-lg border-2 border-black bg-[#FEF08A] font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5"
              >
                A
              </button>
              <button
                onMouseDown={() => { simControlsRef.current.bwd = true; }}
                onMouseUp={() => { simControlsRef.current.bwd = false; }}
                onTouchStart={() => { simControlsRef.current.bwd = true; }}
                onTouchEnd={() => { simControlsRef.current.bwd = false; }}
                className="w-10 h-10 rounded-lg border-2 border-black bg-[#FEF08A] font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5"
              >
                S
              </button>
              <button
                onMouseDown={() => { simControlsRef.current.right = true; }}
                onMouseUp={() => { simControlsRef.current.right = false; }}
                onTouchStart={() => { simControlsRef.current.right = true; }}
                onTouchEnd={() => { simControlsRef.current.right = false; }}
                className="w-10 h-10 rounded-lg border-2 border-black bg-[#FEF08A] font-black text-xs shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5"
              >
                D
              </button>
            </div>
            <button
              onClick={() => {
                simControlsRef.current.claw = !simControlsRef.current.claw;
                setSimClawClosed(simControlsRef.current.claw);
                soundManager.playClick();
              }}
              className={`w-full py-1 px-2 rounded-lg border-2 border-black font-mono text-[10px] font-black shadow-[2px_2px_0px_0px_#000] transition-colors ${
                simClawClosed ? 'bg-[#FECDD3] text-black' : 'bg-[#BAE6FD] text-black'
              }`}
            >
              {simClawClosed ? 'CLAW: CLAMPED' : 'CLAW: OPEN (SPACE)'}
            </button>
          </div>
        </>
      )}

      {/* Bottom Bar Instruction */}
      <div className="p-3 bg-[#FFF9EB] border-t-2 border-black flex items-center justify-between font-mono text-xs text-black">
        <div className="flex items-center gap-2 font-bold">
          <Info className="w-4 h-4 text-black" />
          <span>
            {isSimulatorActive
              ? 'Use W, A, S, D keys to steer & accelerate; Space to actuate gripper claw.'
              : 'Multi-axis 3D tumble, levitation floating & telemetry inspection.'}
          </span>
        </div>
        <div className="text-[11px] hidden sm:flex items-center gap-1.5 font-black text-black">
          <RotateCw className="w-3.5 h-3.5" />
          <span>DRAG 360° TO ROTATE CAMERA</span>
        </div>
      </div>
    </div>
  );
}
