import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Member3DAvatar({ shape = 'icosahedron', accentColor = '#00f0ff', isHovered = false }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 160;
    const height = container.clientHeight || 160;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Group
    const group = new THREE.Group();
    scene.add(group);

    // Geometry selection based on member profile
    let geometry;
    switch (shape) {
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(1.5, 0);
        break;
      case 'cube':
        geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(1.3, 0.45, 16, 32);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(1.4, 0);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(1.4, 16, 16);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(1.1, 1.1, 1.8, 12);
        break;
      case 'pyramid':
        geometry = new THREE.ConeGeometry(1.5, 2.0, 4);
        break;
      case 'tetrahedron':
        geometry = new THREE.TetrahedronGeometry(1.6, 0);
        break;
      case 'icosahedron':
      default:
        geometry = new THREE.IcosahedronGeometry(1.5, 0);
        break;
    }

    const color = new THREE.Color(accentColor);

    // Wireframe Mesh
    const wireMat = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    const wireMesh = new THREE.Mesh(geometry, wireMat);
    group.add(wireMesh);

    // Inner Glowing Core
    const innerGeom = new THREE.SphereGeometry(0.65, 8, 8);
    const innerMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    group.add(innerMesh);

    // Points at vertices
    const pointsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.9
    });
    const points = new THREE.Points(geometry, pointsMat);
    group.add(points);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const speed = isHovered ? 2.5 : 1.0;

      group.rotation.y += delta * 0.8 * speed;
      group.rotation.x += delta * 0.5 * speed;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      wireMat.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      pointsMat.dispose();
      renderer.dispose();
    };
  }, [shape, accentColor, isHovered]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full flex items-center justify-center transition-transform duration-300" 
    />
  );
}
