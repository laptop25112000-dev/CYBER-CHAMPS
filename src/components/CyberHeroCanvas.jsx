import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CyberHeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all 3D cyber objects
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Inner Cyber Nucleus (Icosahedron with wireframe and glowing faces)
    const nucleusGeom = new THREE.IcosahedronGeometry(4.2, 1);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeom, nucleusMat);
    coreGroup.add(nucleusMesh);

    // Inner Solid Core with Emissive Shader-like glow
    const innerGeom = new THREE.OctahedronGeometry(2.4, 0);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x0a1026,
      emissive: 0xbc13fe,
      emissiveIntensity: 0.9,
      shininess: 90,
      flatShading: true,
      wireframe: false
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    coreGroup.add(innerMesh);

    // 2. Cyber Orbital Rings (Torus wireframes)
    const ring1Geom = new THREE.TorusGeometry(6.4, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    coreGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(7.2, 0.035, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xbc13fe,
      transparent: true,
      opacity: 0.5
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    coreGroup.add(ring2);

    const ring3Geom = new THREE.TorusGeometry(8.0, 0.025, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.4
    });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    ring3.rotation.y = Math.PI / 2.5;
    coreGroup.add(ring3);

    // 3. Floating Holographic Nodes (Orbiting satellites on the rings)
    const nodeGeom = new THREE.SphereGeometry(0.18, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const nodes = [];
    for (let i = 0; i < 8; i++) {
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      coreGroup.add(node);
      nodes.push({
        mesh: node,
        radius: 6.4 + (i % 3) * 0.8,
        speed: 0.015 + (i * 0.004),
        angle: (i / 8) * Math.PI * 2,
        inclination: (i % 3) * 0.7
      });
    }

    // 4. Background Cyber Constellation Particles
    const particleCount = 750;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00f0ff);
    const colorPurple = new THREE.Color(0xbc13fe);
    const colorEmerald = new THREE.Color(0x10b981);

    for (let i = 0; i < particleCount; i++) {
      const r = 9 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      const chosenColor = i % 3 === 0 ? colorCyan : (i % 3 === 1 ? colorPurple : colorEmerald);
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x0a1026, 2.5);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00f0ff, 4, 30);
    pointLightCyan.position.set(10, 10, 10);
    scene.add(pointLightCyan);

    const pointLightPurple = new THREE.PointLight(0xbc13fe, 3.5, 30);
    pointLightPurple.position.set(-10, -10, -10);
    scene.add(pointLightPurple);

    // Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;
    let isHovered = false;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.9;
      targetRotationX = -y * 0.9;
    };

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { 
      isHovered = false; 
      targetRotationX = 0; 
      targetRotationY = 0; 
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Resize Observer
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
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      // Base auto rotation + mouse offset
      const spinSpeed = isHovered ? 1.6 : 1.0;
      nucleusMesh.rotation.y = elapsedTime * 0.25 * spinSpeed + currentRotationY;
      nucleusMesh.rotation.x = elapsedTime * 0.15 * spinSpeed + currentRotationX;

      innerMesh.rotation.y = -elapsedTime * 0.45 * spinSpeed;
      innerMesh.rotation.z = elapsedTime * 0.35 * spinSpeed;

      // Rings spin along unique axes
      ring1.rotation.z += 0.005 * spinSpeed;
      ring2.rotation.y += 0.004 * spinSpeed;
      ring3.rotation.x += 0.006 * spinSpeed;

      // Orbiting nodes
      nodes.forEach((n) => {
        n.angle += n.speed * spinSpeed;
        n.mesh.position.x = Math.cos(n.angle) * n.radius;
        n.mesh.position.y = Math.sin(n.angle) * Math.cos(n.inclination) * n.radius;
        n.mesh.position.z = Math.sin(n.angle) * Math.sin(n.inclination) * n.radius;
      });

      // Background particles gentle drift
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

      // Slight floating motion
      coreGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.35;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[480px] sm:h-[540px] md:h-[620px] flex items-center justify-center">
      {/* 3D Canvas Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Interactive 3D Cyber Core - Move mouse to rotate"
      />

      {/* Cyber HUD Badges overlaying the 3D scene */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1 font-mono text-[11px] text-cyan-400/80 bg-slate-950/70 p-2.5 rounded border border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>CYBER_CORE: ONLINE</span>
        </div>
        <div className="text-slate-400">FPS: 60.0 // LATENCY: 0.04ms</div>
        <div className="text-cyan-300">GEO_MESH: ICOSAHEDRON_v2</div>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none font-mono text-[11px] text-purple-400/80 bg-slate-950/70 p-2.5 rounded border border-purple-500/20 backdrop-blur-md text-right">
        <div className="text-purple-300 font-semibold">ENCRYPTION: POST_QUANTUM</div>
        <div className="text-slate-400">STATUS: RECON_SCAN_ACTIVE</div>
      </div>
    </div>
  );
}
