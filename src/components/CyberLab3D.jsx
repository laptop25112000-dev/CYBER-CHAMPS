import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ARSENAL_CATEGORIES } from '../data/team';
import { soundManager } from '../utils/audio';
import { 
  Terminal, Cpu, Key, BrainCircuit, CloudRain, 
  Search, ShieldAlert, Zap 
} from 'lucide-react';

export default function CyberLab3D({ onSelectMemberByName }) {
  const mountRef = useRef(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const iconMap = {
    Terminal: <Terminal className="w-5 h-5 text-red-400" />,
    Cpu: <Cpu className="w-5 h-5 text-amber-400" />,
    Key: <Key className="w-5 h-5 text-emerald-400" />,
    BrainCircuit: <BrainCircuit className="w-5 h-5 text-indigo-400" />,
    CloudRain: <CloudRain className="w-5 h-5 text-pink-400" />,
    Search: <Search className="w-5 h-5 text-violet-400" />
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Defense Core (Wireframe Dodecahedron)
    const coreGeom = new THREE.DodecahedronGeometry(3.5, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    group.add(coreMesh);

    // 2. Orbital Cyber Node Spheres
    const nodeCount = 9; // Represents our 9 champions!
    const nodes = [];
    const colors = [
      0x00f0ff, // Mayank
      0xff0055, // Sayan
      0xffaa00, // Chirag
      0xe024c3, // Mahika
      0x10b981, // Samrat
      0x6366f1, // Divyansh
      0x06b6d4, // Swastik
      0x8b5cf6, // Dakshesh
      0x3b82f6  // Shubh
    ];

    const linesGroup = new THREE.Group();
    group.add(linesGroup);

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 7.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (i % 2 === 0 ? 1 : -1) * 2.5;

      const nodeGeom = new THREE.SphereGeometry(0.55, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: colors[i],
        wireframe: true
      });
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
      nodeMesh.position.set(x, y, z);
      group.add(nodeMesh);

      // Connect node to central core with laser lines
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z)
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.35
      });
      const line = new THREE.Line(lineGeom, lineMat);
      linesGroup.add(line);

      nodes.push({ mesh: nodeMesh, originalPos: new THREE.Vector3(x, y, z), angle, speed: 0.008 + (i * 0.001) });
    }

    // 3. Ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      group.rotation.y += delta * 0.25;
      group.rotation.x += delta * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* 3D Visualization Column */}
      <div className="lg:col-span-6 relative">
        <div className="relative w-full h-[420px] rounded-2xl bg-slate-950/80 border border-cyan-500/30 overflow-hidden flex items-center justify-center">
          <div ref={mountRef} className="w-full h-full cursor-pointer" />
          
          <div className="absolute top-4 left-4 font-mono text-[11px] text-cyan-400 bg-slate-900/80 px-3 py-1.5 rounded border border-cyan-500/20 backdrop-blur-md">
            CYBER_LAB_TOPOLOGY // 9 DEFENSE NODES
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-slate-400 bg-slate-950/80 px-3 py-2 rounded border border-slate-800 backdrop-blur-md">
            <span>ROTATING 3D DEFENSE ENCLAVE</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> ACTIVE MESH
            </span>
          </div>
        </div>
      </div>

      {/* Arsenal Categories Tabbed Breakdown Column */}
      <div className="lg:col-span-6 space-y-4">
        <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
          <ShieldAlert className="w-4 h-4" />
          SYSTEMS & TOOLING RECONNAISSANCE
        </div>
        <h3 className="font-['Orbitron'] text-2xl sm:text-3xl font-bold text-white">
          Our Operational Arsenal
        </h3>
        <p className="text-slate-400 text-sm font-sans leading-relaxed">
          From low-level binary exploitation in custom kernel spaces to post-quantum key encapsulation and autonomous cognitive agents, Cyber Champs commands a cutting-edge technical stack.
        </p>

        {/* Categories selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          {ARSENAL_CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundManager.playClick();
                setActiveCategoryIndex(idx);
              }}
              className={`p-2.5 rounded-lg border text-left font-mono text-xs transition-all duration-200 ${
                activeCategoryIndex === idx
                  ? 'bg-cyan-950/50 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="mb-1">{iconMap[cat.icon]}</div>
              <div className="font-semibold truncate">{cat.title.split('&')[0]}</div>
            </button>
          ))}
        </div>

        {/* Selected Category Details */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md mt-4">
          <div className="flex items-center gap-2 mb-3">
            {iconMap[ARSENAL_CATEGORIES[activeCategoryIndex].icon]}
            <h4 className="font-mono text-sm font-bold text-white">
              {ARSENAL_CATEGORIES[activeCategoryIndex].title}
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {ARSENAL_CATEGORIES[activeCategoryIndex].tools.map((tool, idx) => (
              <span
                key={idx}
                className="font-mono text-xs px-3 py-1.5 rounded-md bg-slate-950 text-cyan-400 border border-cyan-500/20"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
