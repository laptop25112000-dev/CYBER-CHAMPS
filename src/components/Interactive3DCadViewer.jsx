import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { soundManager } from '../utils/audio';
import { buildRoboCar3DGroup } from '../utils/roboCar3DBuilder';
import { ROBOT_COMPONENTS } from '../data/robotData';
import { 
  RotateCw, ZoomIn, ZoomOut, Play, Pause, Layers, 
  RotateCcw, Sparkles, ExternalLink, Compass, Shield
} from 'lucide-react';

export default function Interactive3DCadViewer({
  selectedCompId = null,
  onSelectComponent = null,
  onReset = null
}) {
  const mountRef = useRef(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isSpinningMotors, setIsSpinningMotors] = useState(false);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Three.js instances ref
  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    carGroup: null,
    wheels: [],
    armGroup: null,
    interactiveMeshes: [],
    animId: null,
    isDragging: false,
    prevPointer: { x: 0, y: 0 },
    spherical: { radius: 7.2, theta: 0.8, phi: 1.15 },
    targetLookAt: new THREE.Vector3(0, 0.4, 0),
    currentLookAt: new THREE.Vector3(0, 0.4, 0),
    defaultLookAt: new THREE.Vector3(0, 0.4, 0)
  });

  // Mapping component IDs to 3D focus targets
  const getComponentTarget = useCallback((compId) => {
    switch (compId) {
      case 'claw-linkage':
        return { lookAt: new THREE.Vector3(0, 0.9, 1.6), theta: 0.35, phi: 1.25, radius: 4.5 };
      case 'cargo-bay':
        return { lookAt: new THREE.Vector3(0, 0.7, -1.2), theta: 2.8, phi: 1.2, radius: 4.8 };
      case 'hexa-pcb':
        return { lookAt: new THREE.Vector3(0, 1.1, -0.2), theta: 0.6, phi: 0.75, radius: 4.2 };
      case 'drivetrain-wheels':
      case 'gearmotors':
        return { lookAt: new THREE.Vector3(1.4, 0.6, 0.0), theta: 1.55, phi: 1.35, radius: 4.8 };
      case 'battery-system':
        return { lookAt: new THREE.Vector3(0, 0.5, -0.6), theta: 2.4, phi: 1.35, radius: 4.6 };
      case 'chassis-plates':
      default:
        return { lookAt: new THREE.Vector3(0, 0.4, 0), theta: 0.8, phi: 1.15, radius: 7.2 };
    }
  }, []);

  // Update camera target when selectedCompId changes
  useEffect(() => {
    const t = threeRef.current;
    if (!t.camera) return;

    if (selectedCompId) {
      const target = getComponentTarget(selectedCompId);
      t.targetLookAt.copy(target.lookAt);
      t.spherical.theta = target.theta;
      t.spherical.phi = target.phi;
      t.spherical.radius = target.radius;
      setZoomLevel(Math.round((7.2 / target.radius) * 100));
    } else {
      t.targetLookAt.copy(t.defaultLookAt);
      t.spherical.theta = 0.8;
      t.spherical.phi = 1.15;
      t.spherical.radius = 7.2;
      setZoomLevel(100);
    }
  }, [selectedCompId, getComponentTarget]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    
    // Renderer
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
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Build the 3D Robot CAD Model
    const interactiveMeshes = [];
    const { carGroup, wheels, armGroup, led } = buildRoboCar3DGroup({
      themeHex: '#F04438',
      wireframe: wireframeMode,
      onRegisterPart: (mesh, info) => {
        interactiveMeshes.push(mesh);
      }
    });

    scene.add(carGroup);

    // Clean Studio Lighting (Editorial Light Gray Environment)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(6, 12, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Accent Rim Light (Team Red Theme)
    const rimLight = new THREE.DirectionalLight(0xF04438, 1.4);
    rimLight.position.set(-8, 6, -6);
    scene.add(rimLight);

    // Soft Ambient Fill Light
    const ambLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambLight);

    // Ground Contact Shadow
    const shadowGeom = new THREE.PlaneGeometry(5.0, 6.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x171717,
      transparent: true,
      opacity: 0.12
    });
    const groundShadow = new THREE.Mesh(shadowGeom, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.01;
    scene.add(groundShadow);

    // Subtle Ground Grid (Engineering CAD grid)
    const gridHelper = new THREE.GridHelper(10, 20, 0xD8D8D3, 0xECECE7);
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);

    // Save references
    const t = threeRef.current;
    t.scene = scene;
    t.camera = camera;
    t.renderer = renderer;
    t.carGroup = carGroup;
    t.wheels = wheels;
    t.armGroup = armGroup;
    t.interactiveMeshes = interactiveMeshes;

    // Raycaster for hover & click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, true);

      if (intersects.length > 0) {
        let topObj = intersects[0].object;
        while (topObj && !topObj.userData?.name && topObj.parent) {
          topObj = topObj.parent;
        }

        if (topObj && topObj.userData?.name) {
          setHoveredPart(topObj.userData);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredPart(null);
      container.style.cursor = t.isDragging ? 'grabbing' : 'grab';
    };

    const handleCanvasClick = (e) => {
      if (t.isDragging) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, true);

      if (intersects.length > 0) {
        let topObj = intersects[0].object;
        while (topObj && !topObj.userData?.name && topObj.parent) {
          topObj = topObj.parent;
        }

        if (topObj && topObj.userData?.name) {
          soundManager.playClick();
          // Map to known robot component if possible
          const partName = topObj.userData.name.toLowerCase();
          const matched = ROBOT_COMPONENTS.find(c => 
            partName.includes('claw') || partName.includes('gripper') ? c.id === 'claw-linkage' :
            partName.includes('hexa') || partName.includes('controller') || partName.includes('hub') ? c.id === 'hexa-pcb' :
            partName.includes('wheel') || partName.includes('tire') ? c.id === 'drivetrain-wheels' :
            partName.includes('motor') ? c.id === 'gearmotors' :
            partName.includes('cargo') || partName.includes('payload') ? c.id === 'cargo-bay' :
            partName.includes('power') || partName.includes('battery') ? c.id === 'battery-system' :
            c.id === 'chassis-plates'
          );

          if (matched && onSelectComponent) {
            onSelectComponent(matched);
          }
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleCanvasClick);

    // Orbit Drag Rotation
    let dragDistance = 0;
    const onPointerDown = (e) => {
      t.isDragging = true;
      dragDistance = 0;
      t.prevPointer.x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      t.prevPointer.y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (!t.isDragging) return;
      const curX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const curY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const dx = curX - t.prevPointer.x;
      const dy = curY - t.prevPointer.y;
      dragDistance += Math.abs(dx) + Math.abs(dy);

      t.spherical.theta -= dx * 0.008;
      t.spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, t.spherical.phi - dy * 0.008));

      t.prevPointer.x = curX;
      t.prevPointer.y = curY;
    };

    const onPointerUp = () => {
      t.isDragging = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Mouse Wheel Zoom
    const handleWheel = (e) => {
      e.preventDefault();
      t.spherical.radius = Math.max(2.8, Math.min(11.0, t.spherical.radius + e.deltaY * 0.006));
      setZoomLevel(Math.round((7.2 / t.spherical.radius) * 100));
    };
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render Animation Loop
    let lastTime = performance.now();
    const startTime = performance.now();

    const animate = (now) => {
      t.animId = requestAnimationFrame(animate);
      const currentTime = now || performance.now();
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      const time = (currentTime - startTime) / 1000;

      // Auto-Rotate turntable
      if (autoRotate && !t.isDragging) {
        t.spherical.theta += 0.006;
      }

      // Smooth Camera & Target Lerp
      t.currentLookAt.lerp(t.targetLookAt, 0.08);

      const x = t.spherical.radius * Math.sin(t.spherical.phi) * Math.sin(t.spherical.theta);
      const y = t.spherical.radius * Math.cos(t.spherical.phi);
      const z = t.spherical.radius * Math.sin(t.spherical.phi) * Math.cos(t.spherical.theta);

      camera.position.set(
        t.currentLookAt.x + x,
        t.currentLookAt.y + y,
        t.currentLookAt.z + z
      );
      camera.lookAt(t.currentLookAt);

      // Wheel Spin & Claw Motion on Play
      if (isSpinningMotors) {
        wheels.forEach(w => {
          w.rotation.x += delta * 12;
        });
        if (armGroup) {
          armGroup.rotation.x = Math.sin(time * 3) * 0.15;
        }
      }

      // Subtle Status LED pulsing
      if (led && led.material) {
        led.material.opacity = 0.6 + Math.sin(time * 4) * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (t.animId) cancelAnimationFrame(t.animId);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleCanvasClick);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [wireframeMode, autoRotate, isSpinningMotors, onSelectComponent]);

  // Zoom control buttons
  const handleZoom = (direction) => {
    soundManager.playClick();
    const t = threeRef.current;
    if (direction === 'in') {
      t.spherical.radius = Math.max(2.8, t.spherical.radius - 1.0);
    } else {
      t.spherical.radius = Math.min(11.0, t.spherical.radius + 1.0);
    }
    setZoomLevel(Math.round((7.2 / t.spherical.radius) * 100));
  };

  const handleResetCamera = () => {
    soundManager.playClick();
    const t = threeRef.current;
    t.targetLookAt.copy(t.defaultLookAt);
    t.spherical.theta = 0.8;
    t.spherical.phi = 1.15;
    t.spherical.radius = 7.2;
    setZoomLevel(100);
    if (onReset) onReset();
  };

  return (
    <div className="relative w-full h-full min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] border border-[#D8D8D3] bg-[#ECECE7] rounded-2xl overflow-hidden select-none flex flex-col justify-between">
      
      {/* 3D WebGL Canvas Mount Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top Floating Telemetry & CAD Status Bar */}
      <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Badge: Live Interactive 3D */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#F7F7F4]/95 backdrop-blur-md border border-[#D8D8D3] shadow-sm pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
          <span className="font-mono text-[15px] font-bold text-[#171717] tracking-tight">
            INTERACTIVE 3D CAD
          </span>
          <span className="font-mono text-[15px] text-[#595959] hidden sm:inline">
            · THREE.JS WebGL
          </span>
        </div>

        {/* Right Actions: Onshape Link */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <a
            href="https://cad.onshape.com/documents/b9775324604f1e712d8677c5/w/42798f7711b0b207da9310d3/e/2e8391d232133dd053e4cffb"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#171717] text-[#F7F7F4] hover:bg-[#F04438] font-mono text-[15px] font-semibold transition-all rounded-lg flex items-center gap-2 shadow-sm"
          >
            <span>Onshape Source CAD</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Hovered Part Telemetry Pill (Centered in Canvas) */}
      {hoveredPart && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-[#171717]/95 text-white backdrop-blur-md border border-[#F04438]/50 shadow-xl pointer-events-none flex items-center gap-3 animate-in fade-in zoom-in-95">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F04438] animate-ping" />
          <div className="text-left font-mono">
            <div className="text-[15px] font-bold text-white tracking-wide">
              {hoveredPart.name}
            </div>
            <div className="text-[15px] text-[#F04438] font-semibold">
              {hoveredPart.category} · Click to inspect
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Controls: Auto-Rotate & Wireframe */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setAutoRotate(!autoRotate);
            }}
            className={`px-3.5 py-2 rounded-lg border font-mono text-[15px] font-bold transition-all flex items-center gap-2 shadow-sm ${
              autoRotate 
                ? 'bg-[#171717] text-white border-[#171717]' 
                : 'bg-[#F7F7F4]/95 text-[#171717] border-[#D8D8D3] hover:bg-white'
            }`}
            title="Toggle 360° Turntable Auto-Rotation"
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>{autoRotate ? 'ROTATING' : 'AUTO-ROTATE'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setWireframeMode(!wireframeMode);
            }}
            className={`px-3.5 py-2 rounded-lg border font-mono text-[15px] font-bold transition-all flex items-center gap-2 shadow-sm ${
              wireframeMode 
                ? 'bg-[#F04438] text-white border-[#F04438]' 
                : 'bg-[#F7F7F4]/95 text-[#171717] border-[#D8D8D3] hover:bg-white'
            }`}
            title="Toggle CAD Wireframe Mesh View"
          >
            <Layers className="w-4 h-4" />
            <span>{wireframeMode ? 'WIREFRAME' : 'SOLID CAD'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setIsSpinningMotors(!isSpinningMotors);
            }}
            className={`px-3.5 py-2 rounded-lg border font-mono text-[15px] font-bold transition-all flex items-center gap-2 shadow-sm ${
              isSpinningMotors 
                ? 'bg-[#059669] text-white border-[#059669]' 
                : 'bg-[#F7F7F4]/95 text-[#171717] border-[#D8D8D3] hover:bg-white'
            }`}
            title="Test 4WD Drivetrain Motors & Claw Articulation"
          >
            {isSpinningMotors ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpinningMotors ? 'STOP MOTORS' : 'TEST DRIVE'}</span>
          </button>
        </div>

        {/* Right Controls: Zoom & Reset */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-[#F7F7F4]/95 border border-[#D8D8D3] p-1 rounded-lg shadow-sm">
            <button
              onClick={() => handleZoom('out')}
              className="p-2 text-[#171717] hover:bg-[#ECECE7] rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[15px] font-bold text-[#171717] px-2 min-w-[56px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom('in')}
              className="p-2 text-[#171717] hover:bg-[#ECECE7] rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Reset Camera Button */}
          <button
            onClick={handleResetCamera}
            className="px-3.5 py-2 bg-[#F7F7F4]/95 hover:bg-white text-[#171717] border border-[#D8D8D3] font-mono text-[15px] font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            title="Reset Camera to Default Angle"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>

      </div>

      {/* Helper Navigation Hint on Bottom Bar */}
      <div className="relative z-10 px-5 py-2.5 bg-[#F7F7F4]/90 backdrop-blur-sm border-t border-[#D8D8D3] flex items-center justify-between font-mono text-[15px] text-[#595959]">
        <div className="flex items-center gap-2">
          <span>🖱️ Click & Drag to Orbit 360°</span>
          <span className="hidden md:inline">· Scroll to Zoom</span>
          <span className="hidden lg:inline">· Click any part to inspect</span>
        </div>
        <div className="font-semibold text-[#171717] hidden sm:block">
          SCALE: 1:1 COMPETITION RIG
        </div>
      </div>

    </div>
  );
}
