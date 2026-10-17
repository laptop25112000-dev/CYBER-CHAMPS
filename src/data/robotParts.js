export const ROBOT_EXPLODED_PARTS = [
  {
    id: 'claw-linkage',
    name: 'SG90 Micro-Servo Claw & Articulating Linkage',
    tag: 'SERVO CLAW',
    category: 'MANIPULATION & ACTUATION',
    badgeColor: '#FEF08A',
    normalizedPos: { x: 0.68, y: 0.38 }, // position in frame 300
    cropBox: { x: 0.55, y: 0.25, width: 0.30, height: 0.30 }, // Normalized crop area for magnification
    description: 'Precision front grabber mechanism built from laser-cut 3mm acrylic linkages and driven by an SG90 micro-servo. Engineered with custom gear reduction linkages to deliver high mechanical leverage for retrieving regulation arena scoring rings.',
    teamMembers: [
      {
        id: 'samrat',
        name: 'Samrat',
        contribution: 'Designed mechanical claw leverage geometry, assembled servo horn linkages, and eliminated mechanical play under heavy clamping loads.'
      },
      {
        id: 'mahika-singh',
        name: 'Mahika Singh',
        contribution: 'Calibrated payload capture timing, validated optical sensor alignment, and verified NRL Article 4.2 compliance (<150mm extension limit).'
      },
      {
        id: 'divyansh-mishra',
        name: 'Divyansh Mishra',
        contribution: 'Programmed PWM servo position interpolation loops in C++ for smooth 180° sweeps without gear chatter or voltage drops.'
      }
    ],
    specs: [
      { label: 'Actuator Model', value: 'TowerPro SG90 Micro-Servo (9g)' },
      { label: 'Operating Voltage', value: '4.8V – 6.0V DC (Regulated 5V Rail)' },
      { label: 'Stall Torque', value: '1.80 kg·cm @ 4.8V | 2.20 kg·cm @ 6.0V' },
      { label: 'Operating Speed', value: '0.10 sec / 60 degrees @ 4.8V' },
      { label: 'Linkage Material', value: '3.0mm Laser-Cut Acrylic & Brass Bushings' },
      { label: 'Claw Aperture', value: '15mm to 82mm Variable Jaw Opening' },
      { label: 'Gear Composition', value: 'High-Impact Nylon & Carbon-Reinforced Fiber' },
      { label: 'NRL Compliance', value: 'Article 4.2: Maximum Active Extension < 150mm (PASSED)' }
    ],
    keyFeatures: [
      'Dual-scissor linkage multiplies servo torque by 2.4x for slip-free grip',
      'Quick-release M3 brass pivot pins for 60-second pit repairs',
      'Integrated rubber silicone gripper pads for frictionless arena ring pickup',
      'Over-current stall cutoff protection programmed into controller firmware'
    ]
  },
  {
    id: 'hexa-pcb',
    name: 'HEXA 2.4GHz Telemetry & Dual-Core MCU Hub',
    tag: 'HEXA PCB CORE',
    category: 'AVIONICS & TELEMETRY',
    badgeColor: '#BAE6FD',
    normalizedPos: { x: 0.48, y: 0.28 },
    cropBox: { x: 0.38, y: 0.18, width: 0.25, height: 0.25 },
    description: 'The central nervous system of the robot car. Houses the 32-bit dual-core microcontroller, 2.4GHz FHSS wireless transceiver, dual H-bridge motor driver circuits, and high-efficiency buck regulators isolated with optocouplers.',
    teamMembers: [
      {
        id: 'chirag-koli',
        name: 'Chirag Koli',
        contribution: 'Designed dual-deck wiring harness, soldered noise-decoupling capacitors, and routed high-current traces away from telemetry antennas.'
      },
      {
        id: 'divyansh-mishra',
        name: 'Divyansh Mishra',
        contribution: 'Developed real-time firmware architecture, sub-5ms command parsing, and autonomous failsafe routines for instantaneous motor braking.'
      },
      {
        id: 'dakshesh',
        name: 'Dakshesh',
        contribution: 'Performed benchtop oscilloscope diagnostics, mapped 3.3V logic rail stability, and stress-tested wireless transceiver RSSI bounds.'
      }
    ],
    specs: [
      { label: 'Microcontroller', value: '32-Bit Dual-Core 240MHz RISC MCU' },
      { label: 'Wireless Protocol', value: '2.4GHz DSSS / FHSS Anti-Jamming Link' },
      { label: 'Telemetry Latency', value: '< 4.2 milliseconds end-to-end' },
      { label: 'Motor Driver Stage', value: 'Dual H-Bridge MOSFETs (3.2A Peak / Channel)' },
      { label: 'Logic Voltage', value: '3.3V Logic with 5V Tolerant Digital I/O' },
      { label: 'Onboard Sensors', value: '6-Axis IMU (Gyro + Accelerometer) & Voltage Sense' },
      { label: 'Safety Cutoff', value: 'Hardware watchdog with instantaneous RF signal loss brake' },
      { label: 'NRL Scrutineering', value: 'Regulation 2.4GHz Frequency Band Approved (Zero Collisions)' }
    ],
    keyFeatures: [
      'Dual-core processing separates RF communication from motor PWM generation',
      'Optoisolated gate drivers prevent motor back-EMF spikes from resetting logic',
      'Status RGB telemetry beacon visible from the arena spectator gallery',
      'Sub-5ms response rate ensures lightning-fast evasive maneuvers'
    ]
  },
  {
    id: 'gearmotors-4wd',
    name: '4WD High-Torque TT DC Gearmotors & Drivetrain',
    tag: '4WD MOTORS',
    category: 'POWERTRAIN & TRANSMISSION',
    badgeColor: '#BBF7D0',
    normalizedPos: { x: 0.28, y: 0.54 },
    cropBox: { x: 0.18, y: 0.42, width: 0.28, height: 0.28 },
    description: 'Four independent dual-shaft high-torque TT DC gearmotors with 1:48 gear reduction ratio. Calibrated to deliver rapid differential steering, high starting torque for climbing arena obstacles, and zero drift during full-throttle acceleration.',
    teamMembers: [
      {
        id: 'sayan-kakkar',
        name: 'Sayan Kakkar',
        contribution: 'Calibrated independent wheel RPM curves with digital tachometer, dialed in steering differentials, and eliminated traction drift.'
      },
      {
        id: 'mayank',
        name: 'Mayank',
        contribution: 'Mounted reinforced motor brackets, checked gearbox mesh tolerances, and tuned transmission for high-torque obstacle climbing.'
      },
      {
        id: 'swastik',
        name: 'Swastik',
        contribution: 'Rendered CAD motion clearances, verified suspension travel, and mapped wheel-well clearance under 30° arena incline tests.'
      }
    ],
    specs: [
      { label: 'Configuration', value: '4-Wheel Independent Differential Drive' },
      { label: 'Gearbox Ratio', value: '1:48 All-Metal Spur & Composite Reduction' },
      { label: 'Operating Voltage', value: '3.0V – 7.4V DC (Regulated at 6.0V Peak)' },
      { label: 'No-Load Speed', value: '200 RPM ± 10% @ 6.0V' },
      { label: 'Stall Torque', value: '800 g·cm (0.8 kg·cm) per motor' },
      { label: 'Current Consumption', value: '70mA (No Load) | 800mA (Full Stall)' },
      { label: 'EMC Suppression', value: 'Dual ceramic varistors + 100nF filtering caps' },
      { label: 'NRL Compliance', value: 'Article 3.1: 4-Motor Limit Met; Non-Hazardous Voltage (PASSED)' }
    ],
    keyFeatures: [
      '1:48 gearing produces instant off-the-line acceleration in competitive sprints',
      'Independent motor control allows 360° zero-radius skid steering',
      'EMC noise filters prevent electric motor spark interference with 2.4GHz radio',
      'Thermally resilient copper commutator brushes withstand 5-minute continuous heats'
    ]
  },
  {
    id: 'chassis-plates',
    name: 'Polycarbonate Dual-Deck High-Impact Chassis',
    tag: 'IMPACT CHASSIS',
    category: 'STRUCTURAL INTEGRITY',
    badgeColor: '#FECDD3',
    normalizedPos: { x: 0.52, y: 0.58 },
    cropBox: { x: 0.38, y: 0.45, width: 0.30, height: 0.30 },
    description: 'A robust, lightweight dual-deck skeleton crafted from laser-cut 4mm impact-resistant polycarbonate plates. Connected with M3 aluminum standoffs to create an ultra-rigid torsion box that shields internal electronics from high-speed collisions.',
    teamMembers: [
      {
        id: 'mayank',
        name: 'Mayank',
        contribution: 'Fabricated structural deck geometry, aligned motor mount brackets, and led full frame stress-testing against arena barrier impacts.'
      },
      {
        id: 'shubh-shankar',
        name: 'Shubh Shankar',
        contribution: 'Torqued M3 hardware with Blue Loctite 242 threadlocker, installed anti-vibration rubber grommets, and reinforced lateral standoffs.'
      },
      {
        id: 'samrat',
        name: 'Samrat',
        contribution: 'Balanced center of gravity along the chassis longitudinal axis, minimizing wheel lift during violent braking and turning.'
      }
    ],
    specs: [
      { label: 'Plate Material', value: '4.0mm Aerospace-Grade Clear Polycarbonate' },
      { label: 'Tensile Strength', value: '70 MPa (High Impact & Shatter-Proof)' },
      { label: 'Wheelbase Dimensions', value: '245mm (Length) × 165mm (Width)' },
      { label: 'Total Ground Clearance', value: '28mm beneath lower protective belly pan' },
      { label: 'Fastening Hardware', value: 'M3 Aluminum Standoffs with Blue Loctite 242' },
      { label: 'Dry Chassis Weight', value: '340 grams (Reinforced Dual-Plate)' },
      { label: 'Torsional Rigidity', value: '18 Nm/deg measured across diagonal wheel axis' },
      { label: 'NRL Dimensional Check', value: 'Passed: 245×165×135mm (Limit: 300×300×300mm)' }
    ],
    keyFeatures: [
      'Dual-deck isolation separates high-vibration motors from sensitive electronics',
      'Laser-slotted mounting rails allow fast repositioning of weight ballast',
      'Beveled front nosecone deflects head-on impacts into upward kinetic energy',
      'Transparent deck allows instant visual scrutiny of internal battery and wiring'
    ]
  },
  {
    id: 'dish-wheels',
    name: 'All-Terrain White Dish Rims & Spiked Rubber Tires',
    tag: 'DISH WHEELS',
    category: 'TRACTION & HANDLING',
    badgeColor: '#E9D5FF',
    normalizedPos: { x: 0.78, y: 0.68 },
    cropBox: { x: 0.65, y: 0.55, width: 0.28, height: 0.28 },
    description: 'Custom 65mm all-terrain drive wheels featuring solid white injection-molded dish hubs and knobby synthetic rubber tires. Engineered to provide maximum coefficient of friction on the standard NRL tournament carpet tiles.',
    teamMembers: [
      {
        id: 'sayan-kakkar',
        name: 'Sayan Kakkar',
        contribution: 'Tuned wheel toe-in and camber for sharp cornering agility without tire scrubbing or parasitic motor drag.'
      },
      {
        id: 'shubh-shankar',
        name: 'Shubh Shankar',
        contribution: 'Developed rapid 45-second pit-change procedure using magnetic hex drivers and color-coded wheel nuts.'
      },
      {
        id: 'mayank',
        name: 'Mayank',
        contribution: 'Fitted solid brass 12mm hex couplers to prevent shaft slippage during sudden reversals.'
      }
    ],
    specs: [
      { label: 'Rim Diameter', value: '65mm (2.56 inches) Outer Diameter' },
      { label: 'Tread Width', value: '26mm High-Contact Surface Area' },
      { label: 'Hub Interface', value: '12mm Hex Brass Coupler with M4 Grub Screw' },
      { label: 'Tread Material', value: 'High-Friction Synthetic Thermoplastic Rubber' },
      { label: 'Grip Coefficient', value: '0.92 on Regulation NRL Arena Carpet' },
      { label: 'Wheel Mass', value: '38 grams per complete wheel assembly' },
      { label: 'Rotation Balance', value: 'Dynamically balanced to eliminate high-speed wobble' },
      { label: 'Floor Safety', value: 'Non-marking tournament approved rubber compound' }
    ],
    keyFeatures: [
      'Deep knobby tread bites into arena turf for maximum launch traction',
      'Dish rim design prevents foreign objects and arena debris from fouling axles',
      'Brass coupler reinforcement eliminates motor flat-spot stripping',
      'Low unsprung weight enables instant directional changes and crisp braking'
    ]
  },
  {
    id: 'battery-pack',
    name: 'High-Discharge Li-Ion Power Cell & XT60 Harness',
    tag: 'POWER PACK',
    category: 'POWER & ENERGY MANAGEMENT',
    badgeColor: '#FDE047',
    normalizedPos: { x: 0.32, y: 0.72 },
    cropBox: { x: 0.22, y: 0.60, width: 0.26, height: 0.26 },
    description: 'High-current 7.4V 2S 2200mAh rechargeable power pack with heavy-duty silicone wiring, gold-plated XT60 quick disconnect, and top-mounted emergency disconnect toggle meeting stringent NRL tournament safety regulations.',
    teamMembers: [
      {
        id: 'dakshesh',
        name: 'Dakshesh',
        contribution: 'Profiled discharge curves to ensure steady motor torque across entire 3-minute rounds; designed pre-match voltage checks.'
      },
      {
        id: 'chirag-koli',
        name: 'Chirag Koli',
        contribution: 'Fabricated 16AWG high-strand silicone harness with inline 15A fuse and gold-plated low-resistance XT60 terminals.'
      },
      {
        id: 'mahika-singh',
        name: 'Mahika Singh',
        contribution: 'Audited NRL safety compliance, secured emergency master toggle, and established tournament pit battery swap checklist.'
      }
    ],
    specs: [
      { label: 'Cell Chemistry', value: 'High-Drain Lithium-Ion 2S Configuration' },
      { label: 'Nominal Voltage', value: '7.4V DC (8.4V Peak Full Charge)' },
      { label: 'Capacity', value: '2200 mAh (16.28 Watt-hours)' },
      { label: 'Discharge Rating', value: '25C Continuous (55A) | 40C Burst (88A)' },
      { label: 'Main Connector', value: 'Gold-Plated XT60 High-Amp Connector' },
      { label: 'Wire Gauge', value: '16 AWG Multi-Strand High-Flex Silicone' },
      { label: 'Circuit Protection', value: '15A Fast-Blow Blade Fuse + Master Safety Switch' },
      { label: 'Safety Scrutiny', value: 'NRL Standard 1.4: Emergency Kill-Switch Top-Accessible (PASSED)' }
    ],
    keyFeatures: [
      'Continuous 55A capability eliminates motor voltage sag during heavy pushing contests',
      'Quick-swap velcro and buckle cradle permits 30-second battery swaps between heats',
      'Integrated balance charging leads for cell-matched charging in the pit',
      'Flame-retardant silicone insulation tested to 200°C'
    ]
  }
];
