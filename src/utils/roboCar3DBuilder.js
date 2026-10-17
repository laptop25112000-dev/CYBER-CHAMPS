import * as THREE from 'three';

/**
 * Builds the hyperrealistic 4WD NRL Battle Robo Car 3D mesh group.
 * Matches the official NRL Robot Kit and hardware specifications.
 * 
 * @param {Object} options
 * @param {string} options.themeHex - Hex color for accent lights & anodized nuts
 * @param {boolean} options.wireframe - Toggle wireframe mode
 * @param {Function} options.onRegisterPart - Callback for raycasting telemetry (optional)
 * @returns {Object} { carGroup, wheels, armGroup, led, ringGroup }
 */
export function buildRoboCar3DGroup({ themeHex = '#06b6d4', wireframe = false, onRegisterPart = null }) {
  const carGroup = new THREE.Group();
  const themeColor = new THREE.Color(themeHex);
  const wheels = [];

  const registerPart = (mesh, info) => {
    mesh.userData = info;
    if (onRegisterPart) onRegisterPart(mesh, info);
  };

  // ==========================================
  // 1. HYPERREALISTIC CLEAR OPTICAL ACRYLIC DECK
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
    wireframe: wireframe
  });

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
    wireframe: wireframe
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

  // 4 Brass Standoff Pillars
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
  // 2. HEXA COMMAND HUB CONTROLLER (PCB)
  // ==========================================
  const hubGroup = new THREE.Group();
  hubGroup.position.set(0, 1.02, -0.3);

  const pcbGeom = new THREE.BoxGeometry(1.5, 0.06, 1.6);
  const pcbMat = new THREE.MeshStandardMaterial({
    color: 0x064e3b,
    roughness: 0.45,
    metalness: 0.15,
    wireframe: wireframe
  });
  const pcb = new THREE.Mesh(pcbGeom, pcbMat);
  hubGroup.add(pcb);

  // Microcontroller Chip
  const mcuGeom = new THREE.BoxGeometry(0.48, 0.08, 0.48);
  const mcuMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3 });
  const mcu = new THREE.Mesh(mcuGeom, mcuMat);
  mcu.position.set(-0.35, 0.06, 0.1);
  hubGroup.add(mcu);

  // Aluminum Heat Sink
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
  const led = new THREE.Mesh(ledGeom, ledMat);
  led.position.set(0.2, 0.08, 0.6);
  hubGroup.add(led);

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

  // Servo Spline
  const splineGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16);
  const splineMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95 });
  const spline = new THREE.Mesh(splineGeom, splineMat);
  spline.position.set(0, 0.42, 0.08);
  spline.rotation.x = Math.PI / 2;
  armGroup.add(spline);

  // Aluminum Claw Fingers
  const armBracketMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.2 });
  const clawGeom = new THREE.BoxGeometry(0.09, 0.16, 1.05);
  const clawLeft = new THREE.Mesh(clawGeom, armBracketMat);
  clawLeft.position.set(-0.6, 0.12, 0.65);
  clawLeft.rotation.y = 0.22;
  armGroup.add(clawLeft);

  const clawRight = new THREE.Mesh(clawGeom, armBracketMat);
  clawRight.position.set(0.6, 0.12, 0.65);
  clawRight.rotation.y = -0.22;
  armGroup.add(clawRight);

  // Black Rubber Gripper Pads
  const padMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.95 });
  const padL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.38), padMat);
  padL.position.set(-0.51, 0.12, 0.98);
  armGroup.add(padL);

  const padR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.38), padMat);
  padR.position.set(0.51, 0.12, 0.98);
  armGroup.add(padR);

  carGroup.add(armGroup);
  registerPart(servo, {
    name: "Robotic Gripper & Actuator Claw",
    category: "ACTIVE MANIPULATOR",
    desc: "Micro-servo powered kinetic claw designed to scoop, grip, and transport NRL arena rings."
  });

  // ==========================================
  // 4. FOUR ALL-TERRAIN WHITE-DISH WHEELS
  // ==========================================
  const wheelPositions = [
    { x: -1.55, y: 0.72, z: 1.25 },
    { x: 1.55, y: 0.72, z: 1.25 },
    { x: -1.55, y: 0.72, z: -1.25 },
    { x: 1.55, y: 0.72, z: -1.25 }
  ];

  wheelPositions.forEach((pos) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(pos.x, pos.y, pos.z);

    // Matte Black Rubber Tire
    const tireGeom = new THREE.CylinderGeometry(0.72, 0.72, 0.58, 32);
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x111318,
      roughness: 0.92,
      metalness: 0.04,
      wireframe: wireframe
    });
    const tire = new THREE.Mesh(tireGeom, tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelGroup.add(tire);

    // Deep White Dish Rim
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
    const dishInMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.28 });
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

    // Motor Gearbox
    const motorGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.92, roughness: 0.25 });
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
    wheels.push(wheelGroup);
  });

  // ==========================================
  // 5. RED LATERAL IMPACT SHIELDS
  // ==========================================
  const bumperGeom = new THREE.BoxGeometry(0.12, 0.65, 1.5);
  const bumperMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
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
  const battMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.2, roughness: 0.65 });
  const batt = new THREE.Mesh(battGeom, battMat);
  batt.position.set(0, 0.56, -0.65);
  batt.castShadow = true;
  carGroup.add(batt);

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
  ringGroup.position.set(1.6, 0.2, 2.6);

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

  return {
    carGroup,
    wheels,
    armGroup,
    led,
    ringGroup
  };
}
