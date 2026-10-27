import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { soundManager } from '../utils/audio';
import { buildRoboCar3DGroup } from '../utils/roboCar3DBuilder';
import { ROBOT_COMPONENTS } from '../data/robotData';
import { 
  RotateCw, ZoomIn, ZoomOut, Layers, 
  RotateCcw, ExternalLink, Download
} from 'lucide-react';

export default function Interactive3DCadViewer({
  selectedCompId = null,
  onSelectComponent = null,
  onReset = null
}) {
  const mountRef = useRef(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(25);

  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  // Three.js instances ref
  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    robotRoot: null,
    animId: null,
    isDragging: false,
    prevPointer: { x: 0, y: 0 },
    spherical: { radius: 7.2, theta: 0.8, phi: 1.15 },
    targetLookAt: new THREE.Vector3(0, 0.45, 0),
    currentLookAt: new THREE.Vector3(0, 0.45, 0),
    defaultLookAt: new THREE.Vector3(0, 0.45, 0)
  });

  // Mapping component IDs to 3D focus targets
  const getComponentTarget = useCallback((compId) => {
    switch (compId) {
      case 'claw-linkage':
        return { lookAt: new THREE.Vector3(0, 0.85, 1.4), theta: 0.35, phi: 1.25, radius: 4.5 };
      case 'cargo-bay':
        return { lookAt: new THREE.Vector3(0, 0.7, -1.2), theta: 2.8, phi: 1.2, radius: 4.8 };
      case 'hexa-pcb':
        return { lookAt: new THREE.Vector3(0, 1.0, -0.1), theta: 0.6, phi: 0.75, radius: 4.2 };
      case 'drivetrain-wheels':
      case 'gearmotors':
        return { lookAt: new THREE.Vector3(1.3, 0.5, 0.0), theta: 1.55, phi: 1.35, radius: 4.8 };
      case 'battery-system':
        return { lookAt: new THREE.Vector3(0, 0.5, -0.6), theta: 2.4, phi: 1.35, radius: 4.6 };
      case 'chassis-plates':
      default:
        return { lookAt: new THREE.Vector3(0, 0.45, 0), theta: 0.8, phi: 1.15, radius: 7.2 };
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

  // Handle wireframe changes dynamically without re-creating scene
  useEffect(() => {
    const t = threeRef.current;
    if (t.robotRoot) {
      t.robotRoot.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => { m.wireframe = wireframeMode; });
          } else {
            child.material.wireframe = wireframeMode;
          }
        }
      });
    }
  }, [wireframeMode]);

  // Main Three.js Scene Setup (Runs ONCE on mount)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    
    // Optimized WebGL Renderer (No heavy dynamic shadow maps, capped DPR)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.shadowMap.enabled = false; // Fast grounded shadow plane used instead
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Clean Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(6, 12, 7);
    scene.add(keyLight);

    const ambLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambLight);

    const fillLight = new THREE.DirectionalLight(0xE2E8F0, 1.1);
    fillLight.position.set(-8, 8, -6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xF04438, 1.0);
    rimLight.position.set(-6, 4, 6);
    scene.add(rimLight);

    // Fast Ground Shadow Plane (Zero GPU depth overhead)
    const shadowGeom = new THREE.PlaneGeometry(6.0, 6.0);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x171717,
      transparent: true,
      opacity: 0.12
    });
    const groundShadow = new THREE.Mesh(shadowGeom, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = 0.005;
    scene.add(groundShadow);

    // Subtle CAD Grid
    const gridHelper = new THREE.GridHelper(10, 20, 0xD8D8D3, 0xECECE7);
    gridHelper.position.y = 0.001;
    scene.add(gridHelper);

    // Root container for robot model
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    const t = threeRef.current;
    t.scene = scene;
    t.camera = camera;
    t.renderer = renderer;
    t.robotRoot = robotRoot;

    // Load Official NRL 2026 Robot GLB Model
    const gltfUrl = `${import.meta.env.BASE_URL}models/nrl-robot-2026.glb`;
    const dracoPath = `${import.meta.env.BASE_URL}draco/gltf/`;

    const dracoLoader = new DRACOLoader();
    try {
      dracoLoader.setDecoderPath(dracoPath);
    } catch {
      // Fallback
    }

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    if (MeshoptDecoder) {
      gltfLoader.setMeshoptDecoder(MeshoptDecoder);
    }

    setLoading(true);
    setLoadProgress(30);

    let isMounted = true;

    gltfLoader.load(
      gltfUrl,
      (gltf) => {
        if (!isMounted) return;
        const cadModel = gltf.scene;

        // Onshape Z-up -> Three.js Y-up
        cadModel.rotation.x = -Math.PI / 2;

        // Center and ground
        const box = new THREE.Box3().setFromObject(cadModel);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4.2 / (maxDim || 1);
        cadModel.scale.setScalar(scale);

        const postBox = new THREE.Box3().setFromObject(cadModel);
        const postCenter = postBox.getCenter(new THREE.Vector3());
        cadModel.position.x -= postCenter.x;
        cadModel.position.y -= postBox.min.y;
        cadModel.position.z -= postCenter.z;

        // Front-side materials for high framerate
        cadModel.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.side = THREE.FrontSide;
            if (child.material.isMeshStandardMaterial) {
              child.material.roughness = Math.max(0.32, child.material.roughness || 0.4);
              child.material.metalness = Math.min(0.85, (child.material.metalness || 0.2) + 0.1);
            }
          }
        });

        robotRoot.add(cadModel);
        setLoadProgress(100);
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, 150);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const pct = Math.min(99, Math.round((xhr.loaded / xhr.total) * 100));
          setLoadProgress(pct);
        }
      },
      (err) => {
        console.warn('CAD GLB load fallback to procedural rig:', err);
        if (!isMounted) return;
        const { carGroup } = buildRoboCar3DGroup({
          themeHex: '#F04438',
          wireframe: false
        });
        robotRoot.add(carGroup);
        setLoading(false);
      }
    );

    // Orbit Drag Controls (Lightweight & Smooth)
    const onPointerDown = (e) => {
      t.isDragging = true;
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

      t.spherical.theta -= dx * 0.007;
      t.spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, t.spherical.phi - dy * 0.007));

      t.prevPointer.x = curX;
      t.prevPointer.y = curY;
    };

    const onPointerUp = () => {
      t.isDragging = false;
      container.style.cursor = 'grab';
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Mouse Wheel Zoom
    const handleWheel = (e) => {
      e.preventDefault();
      t.spherical.radius = Math.max(2.8, Math.min(11.0, t.spherical.radius + e.deltaY * 0.005));
      setZoomLevel(Math.round((7.2 / t.spherical.radius) * 100));
    };
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Window Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Pause rendering when scrolled out of view
    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(container);

    // 60 FPS Render Loop (Zero CPU burn when off-screen)
    const animate = () => {
      t.animId = requestAnimationFrame(animate);

      if (!isVisible) return; // Sleep when user is not viewing 3D model

      // Auto-Rotate turntable
      if (autoRotateRef.current && !t.isDragging && t.robotRoot) {
        t.robotRoot.rotation.y += 0.007;
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

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isMounted = false;
      if (t.animId) cancelAnimationFrame(t.animId);
      observer.disconnect();
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      dracoLoader.dispose();
      renderer.dispose();
    };
  }, []);

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
    if (t.robotRoot) {
      t.robotRoot.rotation.y = 0;
    }
    t.targetLookAt.copy(t.defaultLookAt);
    t.spherical.theta = 0.8;
    t.spherical.phi = 1.15;
    t.spherical.radius = 7.2;
    setZoomLevel(100);
    if (onReset) onReset();
  };

  const glbDownloadUrl = `${import.meta.env.BASE_URL}models/nrl-robot-2026.glb`;

  return (
    <div className="relative w-full h-full min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] border border-[#D8D8D3] bg-[#ECECE7] rounded-2xl overflow-hidden select-none flex flex-col justify-between shadow-sm">
      
      {/* 3D WebGL Canvas Mount Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#ECECE7]/90 backdrop-blur-sm font-mono space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-[#D8D8D3] rounded-full" />
            <div className="w-12 h-12 border-3 border-[#F04438] border-t-transparent rounded-full animate-spin absolute inset-0" />
          </div>
          <div className="text-center space-y-1.5">
            <div className="text-[15px] font-bold text-[#171717] tracking-wider uppercase">
              Loading Official NRL 2026 Robot (.GLB)
            </div>
            <div className="text-xs text-[#595959]">
              PTC Onshape Verified 3D Assembly · {loadProgress}%
            </div>
          </div>
          <div className="w-56 h-1.5 bg-[#D8D8D3] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#F04438] transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Top Floating Telemetry & CAD Status Bar */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Badge: Live Interactive 3D */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-[#F7F7F4]/95 backdrop-blur-md border border-[#D8D8D3] shadow-sm pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
          <span className="font-mono text-[15px] font-bold text-[#171717] tracking-tight">
            NRL-2026 ROBOT.GLB
          </span>
          <span className="px-2 py-0.5 rounded bg-[#171717] text-white font-mono text-[11px] font-bold">
            3.6 MB CAD
          </span>
        </div>

        {/* Right Actions: Download GLB & Onshape Link */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <a
            href={glbDownloadUrl}
            download="NRL-2026-Robot.glb"
            className="px-3.5 py-2 bg-[#F04438] hover:bg-[#D9382C] text-white font-mono text-[14px] font-bold transition-all rounded-lg flex items-center gap-2 shadow-sm"
            title="Download the official NRL-2026 3D Robot GLB file"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">DOWNLOAD GLB</span>
          </a>

          <a
            href="https://cad.onshape.com/documents/b9775324604f1e712d8677c5/w/42798f7711b0b207da9310d3/e/2e8391d232133dd053e4cffb"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-[#171717] text-[#F7F7F4] hover:bg-black font-mono text-[14px] font-semibold transition-all rounded-lg flex items-center gap-2 shadow-sm"
          >
            <span className="hidden sm:inline">Onshape CAD</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Controls: Auto-Rotate & Wireframe */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setAutoRotate(!autoRotate);
            }}
            className={`px-3.5 py-2 rounded-lg border font-mono text-[14px] font-bold transition-all flex items-center gap-2 shadow-sm ${
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
            className={`px-3.5 py-2 rounded-lg border font-mono text-[14px] font-bold transition-all flex items-center gap-2 shadow-sm ${
              wireframeMode 
                ? 'bg-[#F04438] text-white border-[#F04438]' 
                : 'bg-[#F7F7F4]/95 text-[#171717] border-[#D8D8D3] hover:bg-white'
            }`}
            title="Toggle CAD Wireframe Mesh View"
          >
            <Layers className="w-4 h-4" />
            <span>{wireframeMode ? 'WIREFRAME' : 'SOLID CAD'}</span>
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
            <span className="font-mono text-[14px] font-bold text-[#171717] px-2 min-w-[52px] text-center">
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
            className="px-3.5 py-2 bg-[#F7F7F4]/95 hover:bg-white text-[#171717] border border-[#D8D8D3] font-mono text-[14px] font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            title="Reset Camera to Default Angle"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">RESET</span>
          </button>
        </div>

      </div>

      {/* Helper Navigation Hint on Bottom Bar */}
      <div className="relative z-10 px-5 py-2.5 bg-[#F7F7F4]/90 backdrop-blur-sm border-t border-[#D8D8D3] flex items-center justify-between font-mono text-[14px] text-[#595959]">
        <div className="flex items-center gap-2">
          <span>🖱️ Click & Drag to Orbit 360°</span>
          <span className="hidden md:inline">· Scroll to Zoom</span>
          <span className="hidden lg:inline">· 60 FPS Three.js WebGL</span>
        </div>
        <div className="font-semibold text-[#171717] hidden sm:block">
          SCALE: 1:1 NRL TOURNAMENT RIG
        </div>
      </div>

    </div>
  );
}
