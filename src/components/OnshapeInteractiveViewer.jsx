import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { soundManager } from '../utils/audio';
import { buildRoboCar3DGroup } from '../utils/roboCar3DBuilder';
import { ROBOT_COMPONENTS } from '../data/robotData';
import { 
  Box, RotateCcw, Maximize2, ExternalLink, Copy, Check,
  RotateCw, Layers, Play, Pause, ZoomIn, ZoomOut,
  Compass, ShieldCheck, Wrench, Sparkles
} from 'lucide-react';

export default function OnshapeInteractiveViewer({
  selectedCompId = null,
  onSelectComponent = null,
  onReset = null
}) {
  const containerRef = useRef(null);
  const mountRef = useRef(null);
  
  const [wireframeMode, setWireframeMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isSpinningMotors, setIsSpinningMotors] = useState(false);
  const [hoveredPart, setHoveredPart] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const directOnshapeUrl = "https://cad.onshape.com/documents/b9775324604f1e712d8677c5/w/42798f7711b0b207da9310d3/e/2e8391d232133dd053e4cffb";

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
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Build the 3D Robot CAD Model
    const interactiveMeshes = [];
    const { carGroup, wheels, armGroup } = buildRoboCar3DGroup({
      themeHex: '#F04438',
      wireframe: wireframeMode,
      onRegisterPart: (mesh) => {
        interactiveMeshes.push(mesh);
      }
    });

    scene.add(carGroup);

    // Clean High-Contrast Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 12, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Accent Red Rim Light
    const rimLight = new THREE.DirectionalLight(0xF04438, 1.8);
    rimLight.position.set(-8, 6, -6);
    scene.add(rimLight);

    // Ambient Fill Light
    const ambLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambLight);

    // Ground Contact Shadow
    const shadowGeom = new THREE.PlaneGeometry(5.0, 6.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x06080C,
      transparent: true,
      opacity: 0.35
    });
    const groundShadow = new THREE.Mesh(shadowGeom, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.01;
    scene.add(groundShadow);

    // Futuristic Engineering CAD Grid
    const gridHelper = new THREE.GridHelper(12, 24, 0x404040, 0x222222);
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

        if (topObj && topObj.userData?.id) {
          const comp = ROBOT_COMPONENTS.find(c => c.id === topObj.userData.id);
          if (comp && onSelectComponent) {
            onSelectComponent(comp);
          }
        }
      }
    };

    // Drag Orbit Controls
    const onMouseDown = (e) => {
      t.isDragging = true;
      t.prevPointer = { x: e.clientX, y: e.clientY };
      container.style.cursor = 'grabbing';
    };

    const onMouseMove = (e) => {
      handlePointerMove(e);
      if (!t.isDragging) return;

      const dx = e.clientX - t.prevPointer.x;
      const dy = e.clientY - t.prevPointer.y;
      t.prevPointer = { x: e.clientX, y: e.clientY };

      t.spherical.theta -= dx * 0.007;
      t.spherical.phi -= dy * 0.007;

      // Constrain polar angle so camera stays above ground
      t.spherical.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, t.spherical.phi));
    };

    const onMouseUp = () => {
      t.isDragging = false;
      container.style.cursor = 'grab';
    };

    // Mouse Wheel Zoom
    const onWheel = (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.003;
      t.spherical.radius = Math.max(2.8, Math.min(11.0, t.spherical.radius + zoomFactor));
      setZoomLevel(Math.round((7.2 / t.spherical.radius) * 100));
    };

    // Touch Controls for Mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        t.isDragging = true;
        t.prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!t.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - t.prevPointer.x;
      const dy = e.touches[0].clientY - t.prevPointer.y;
      t.prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      t.spherical.theta -= dx * 0.008;
      t.spherical.phi -= dy * 0.008;
      t.spherical.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, t.spherical.phi));
    };

    const onTouchEnd = () => {
      t.isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', handleCanvasClick);
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Turntable auto-rotation
      if (autoRotate && !t.isDragging) {
        t.spherical.theta += 0.45 * delta;
      }

      // Test drive motor simulation
      if (isSpinningMotors && wheels.length > 0) {
        wheels.forEach(w => {
          w.rotation.x += 10.0 * delta;
        });
        if (armGroup) {
          armGroup.rotation.z = Math.sin(now * 0.003) * 0.35 + 0.35;
        }
      }

      // Smooth camera position interpolation
      t.currentLookAt.lerp(t.targetLookAt, 0.08);

      const sinPhiRadius = t.spherical.radius * Math.sin(t.spherical.phi);
      camera.position.x = t.currentLookAt.x + sinPhiRadius * Math.sin(t.spherical.theta);
      camera.position.y = t.currentLookAt.y + t.spherical.radius * Math.cos(t.spherical.phi);
      camera.position.z = t.currentLookAt.z + sinPhiRadius * Math.cos(t.spherical.theta);

      camera.lookAt(t.currentLookAt);

      renderer.render(scene, camera);
      t.animId = requestAnimationFrame(animate);
    };

    t.animId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(t.animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', handleCanvasClick);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [wireframeMode, autoRotate, isSpinningMotors, onSelectComponent]);

  // Zoom buttons
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

  const toggleFullscreen = () => {
    soundManager.playClick();
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleCopy = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(directOnshapeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenExactOnshape = () => {
    soundManager.playClick();
    window.open(directOnshapeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      ref={containerRef}
      id="onshape-cad-container"
      className="w-full bg-[#171717] border-2 border-[#171717] rounded-3xl overflow-hidden shadow-2xl flex flex-col text-left transition-all select-none"
    >
      {/* Top CAD Control Bar (Matches Hyperdrive Simulator Layout) */}
      <div className="px-5 py-4 bg-[#1F1F1F] border-b border-[#2C2C2C] flex flex-wrap items-center justify-between gap-4">
        
        {/* Title & Live Status */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F04438] text-white rounded-lg shadow-sm">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-white tracking-wide uppercase">
                PTC ONSHAPE™ Interactive 3D Model
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#059669]/20 border border-[#059669]/60 text-[#10B981] font-mono text-[15px] font-bold">
                LIVE 3D MODEL ACTIVE
              </span>
            </div>
            <div className="font-mono text-[15px] text-[#A3A3A3] hidden sm:block">
              Official Production Assembly · 1:1 Parametric Rig · Document b9775324604f
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              soundManager.playClick();
              setAutoRotate(!autoRotate);
            }}
            className={`px-3.5 py-2 rounded-lg border font-mono text-[15px] font-bold transition-all flex items-center gap-2 shadow-sm ${
              autoRotate 
                ? 'bg-[#F04438] text-white border-[#F04438]' 
                : 'bg-[#2C2C2C] text-[#F7F7F4] border-[#404040] hover:bg-[#383838]'
            }`}
            title="Toggle 360° Turntable Auto-Rotation"
          >
            <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{autoRotate ? 'ROTATING' : 'AUTO-ROTATE'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setWireframeMode(!wireframeMode);
            }}
            className={`px-3.5 py-2 rounded-lg border font-mono text-[15px] font-bold transition-all flex items-center gap-2 shadow-sm ${
              wireframeMode 
                ? 'bg-[#F04438] text-white border-[#F04438]' 
                : 'bg-[#2C2C2C] text-[#F7F7F4] border-[#404040] hover:bg-[#383838]'
            }`}
            title="Toggle CAD Wireframe Mesh View"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{wireframeMode ? 'WIREFRAME' : 'SOLID CAD'}</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setIsSpinningMotors(!isSpinningMotors);
            }}
            className={`px-3.5 py-2 rounded-lg border font-mono text-[15px] font-bold transition-all flex items-center gap-2 shadow-sm ${
              isSpinningMotors 
                ? 'bg-[#10B981] text-white border-[#10B981]' 
                : 'bg-[#2C2C2C] text-[#F7F7F4] border-[#404040] hover:bg-[#383838]'
            }`}
            title="Test 4WD Drivetrain Motors & Claw Articulation"
          >
            {isSpinningMotors ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden md:inline">{isSpinningMotors ? 'STOP MOTORS' : 'TEST DRIVE'}</span>
          </button>

          <button
            onClick={handleResetCamera}
            className="px-3.5 py-2 bg-[#2C2C2C] hover:bg-[#383838] text-white border border-[#404040] font-mono text-[15px] font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
            title="Reset Camera to Default Angle"
          >
            <RotateCcw className="w-4 h-4 text-[#F04438]" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-2 bg-[#2C2C2C] hover:bg-[#383838] text-white border border-[#404040] font-mono text-[15px] font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden md:inline">FULLSCREEN</span>
          </button>

          <button
            onClick={handleOpenExactOnshape}
            className="px-4 py-2 bg-[#F04438] hover:bg-[#D9382C] text-white font-mono text-[15px] font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
          >
            <span>OPEN IN ONSHAPE</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive WebGL 3D Model Viewport */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] min-h-[500px] sm:min-h-[580px] bg-gradient-to-b from-[#0E1117] to-[#06080C] overflow-hidden">
        
        {/* 3D WebGL Canvas Mount */}
        <div 
          ref={mountRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        />

        {/* Floating Controls Bar */}
        <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06080C]/85 backdrop-blur-md border border-[#2C2C2C] text-[#F7F7F4] font-mono text-[15px] shadow-lg pointer-events-none">
          <span className="text-[#F04438] font-bold">🖱️ CONTROLS:</span>
          <span>Left-Click Drag (Orbit 360°)</span>
          <span className="text-[#595959]">·</span>
          <span>Scroll Wheel (Zoom)</span>
          <span className="text-[#595959]">·</span>
          <span>Click Parts to Inspect</span>
        </div>

        {/* Hovered Part Telemetry Pill */}
        {hoveredPart && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-4 py-2.5 rounded-xl bg-[#171717]/95 text-white backdrop-blur-md border border-[#F04438]/50 shadow-2xl pointer-events-none flex items-center gap-3 animate-in fade-in zoom-in-95">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F04438] animate-ping" />
            <div className="text-left font-mono">
              <div className="text-[15px] font-bold text-white tracking-wide">
                {hoveredPart.name}
              </div>
              <div className="text-[15px] text-[#F04438] font-semibold">
                {hoveredPart.category} · Click to isolate & inspect
              </div>
            </div>
          </div>
        )}

        {/* Bottom Zoom & Scale Indicator */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1 bg-[#1F1F1F]/90 backdrop-blur-md border border-[#333333] p-1 rounded-lg shadow-lg">
            <button
              onClick={() => handleZoom('out')}
              className="p-2 text-white hover:bg-[#333333] rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[15px] font-bold text-white px-2 min-w-[56px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom('in')}
              className="p-2 text-white hover:bg-[#333333] rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom CAD Details & Quick Tips Strip (Matches Simulator 3-Column Layout) */}
      <div className="p-5 sm:p-6 bg-[#1A1A1A] border-t border-[#2C2C2C] grid grid-cols-1 md:grid-cols-3 gap-5 text-left font-mono">
        
        <div className="space-y-1">
          <div className="text-[15px] font-bold text-[#F04438] uppercase flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            <span>Production Assembly Details</span>
          </div>
          <p className="text-[15px] text-[#D4D4D4] leading-relaxed">
            Document <strong className="text-white">b9775324604f</strong> · Workspace <strong className="text-white">42798f77</strong> · Element <strong className="text-white">2e8391d2</strong>. Built at 1:1 scale with parametric engineering constraints.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-[15px] font-bold text-[#10B981] uppercase flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Interactive Inspection Tools</span>
          </div>
          <p className="text-[15px] text-[#D4D4D4] leading-relaxed">
            Orbit in 3D to inspect the dual-stage spur gearboxes, hexagonal PCB bracket, and battery harness. Toggle wireframe to inspect internal geometry.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-[15px] font-bold text-[#3B82F6] uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>NRL Scrutineering Match</span>
          </div>
          <p className="text-[15px] text-[#D4D4D4] leading-relaxed">
            Every millimeter and bolt hole corresponds to the physically fabricated machine. Pre-match verified for 450 × 450 mm sizing cube compliance.
          </p>
        </div>

      </div>
    </div>
  );
}
