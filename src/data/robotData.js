/**
 * Official Verified Engineering & Tournament Dataset for CYBER CHAMPS.
 * Sourced directly from:
 * 1. Onshape CAD Model ("NRL_ROBOT_2026" / "NRL-2026 Robot")
 * 2. Official NRL Game Manual 2026 — HYPERDRIVE (Presented by Amazon)
 */

export const NRL_COMPETITION_DATA = {
  season: "2026",
  gameName: "HYPERDRIVE",
  league: "National Robotics League™ (NRL)",
  presenter: "Amazon",
  division: "Delhi Regional State Championship",
  matchDuration: "2 minutes 30 seconds (150 seconds)",
  fieldDimensions: "144 in. (12 ft.) × 144 in. (12 ft.) bounded by 18mm wooden walls",
  flooring: "36 interlocking soft-foam tiles (24 in. × 24 in. × 20 mm each)",
  
  // Game Phases
  phases: [
    { name: "SETUP & PRE-MATCH", duration: "7–10 min cycle", desc: "Inspection, Wi-Fi pairing on ESP channel, OpMode in INIT (motionless)." },
    { name: "MATCH START", duration: "0:00", desc: "Buzzer sounds; 4WD propulsion enabled." },
    { name: "CORE & PAYLOAD RUN", duration: "0:00 – 2:00", desc: "Collect CORE rings from Spike Marks & Source Zone. Retrieve custom PAYLOAD with Cargo Bay to reduce Starburst threshold from 10 to 4 COREs." },
    { name: "STARBURST MODE", duration: "Active", desc: "Retrieve Golden COREs from Vault, build 3-ring STAR MAP on Star Poles for bonus points." },
    { name: "LEVEL UP (END GAME)", duration: "Final 0:30 (2:00 – 2:30)", desc: "Maneuver onto tilting SPACE STATION to Engage (3 pts), Dock (8 pts), or Balance (15 pts). Score on 365mm APEX POLE (9 pts/core)." }
  ],

  // Official Scoring Table (Table 4.5.1)
  scoringTable: [
    { element: "Squad CORE on High Pole", pts: "3 pts / core", capacity: "Max 4 per pole (130mm high, 1.0\" dia)" },
    { element: "Squad CORE on Star Pole", pts: "5 pts / core", capacity: "Max 3 per pole (100mm high, 1.0\" dia)" },
    { element: "Squad CORE on Apex Pole", pts: "9 pts / core", capacity: "Max 6 per pole (365mm high, stationed on Space Station)" },
    { element: "Squad CORE in Drop Zone", pts: "1 pt / core", capacity: "Contact with foam tile within 25\"×25\" taped zone" },
    { element: "Golden CORE on Star Pole", pts: "7 pts / core", capacity: "Unlocked only during Starburst Mode from Vault" },
    { element: "Golden CORE in Drop Zone", pts: "3 pts / core", capacity: "Scored in Drop Zone during Starburst Mode" },
    { element: "Space Station: ENGAGE", pts: "3 pts", capacity: "In contact with tilting platform without being fully supported" },
    { element: "Space Station: DOCK", pts: "8 pts", capacity: "Fully supported within enclosed volume, but not parallel to ground" },
    { element: "Space Station: BALANCE", pts: "15 pts", capacity: "Fully supported within volume, platform parallel to ground" },
    { element: "STAR MAP Completion Bonus", pts: "10 pts", capacity: "2 Golden COREs + 1 Squad CORE matching Trifron order" },
    { element: "Payload Bonus", pts: "10 pts", capacity: "Both robots in Squad score custom team Payload via Cargo Bay" }
  ],

  // Official Robot Rules (Section 6)
  rulesCompliance: [
    { rule: "R1.1 Starting Configuration", limit: "18\" × 18\" × 10\" volume", actual: "245mm × 165mm × 135mm (9.6\" × 6.5\" × 5.3\") — PASSED" },
    { rule: "R1.2 Robot Weight Limit", limit: "Max 8.0 kg with battery", actual: "1.28 kg with battery installed — PASSED" },
    { rule: "R1.7 Horizontal Expansion", limit: "Fixed 18\" × 18\" (45.7cm) during match", actual: "Claw active aperture max 82mm, within bounds — PASSED" },
    { rule: "R1.8 Vertical Expansion", limit: "No vertical restriction", actual: "Claw elevates for High/Apex Pole placement — PASSED" },
    { rule: "R1.10 Drive Mechanism", limit: "Traction or Omni only (No Mecanum/Holonomic)", actual: "4WD Knobby Traction Rubber & Dish Rims — PASSED" },
    { rule: "R5.1 Propulsion Motors", limit: "Max 4 propulsion motors", actual: "4× TT DC High-Torque Gearmotors (1:48 reduction) — PASSED" },
    { rule: "R5.2 Actuator Motors", limit: "Max 4 active actuator motors", actual: "1× SG90 servo claw + 1× cargo bay actuator — PASSED" },
    { rule: "R6.4 Power Limit", limit: "12V Maximum (No step-up converters)", actual: "7.4V 2S Li-Ion Power Cell (Regulated 6V/5V) — PASSED" },
    { rule: "R6.8 Master Power Switch", limit: "External, clearly labeled, accessible", actual: "Top-deck rocker switch & gold XT60 disconnect — PASSED" },
    { rule: "R7.1 Controller Hub", limit: "Official NRL HEXA Command Hub", actual: "HEXA Dual-Core 240MHz MCU Hub + OLED — PASSED" },
    { rule: "R7.2 Game Controller", limit: "Official NRL Bluetooth Controller", actual: "HEXA handheld dual-joystick gamepad — PASSED" },
    { rule: "R8.9 Wireless Protocol", limit: "Official HexaLINK Only (No public Wi-Fi/BT)", actual: "2.4GHz FHSS Anti-Jamming HexaLINK — PASSED" },
    { rule: "R8.7 Onboard OLED Display", limit: "Must show Link, Name, Num, Channel", actual: "Active 0.96\" I2C OLED on top acrylic deck — PASSED" }
  ]
};

export const ROBOT_CORE_INFO = {
  name: "CYBER CHAMPS 4WD Battle Rover",
  league: "National Robotics League™ (NRL) — Delhi Regional",
  game: "HYPERDRIVE (Presented by Amazon)",
  tagline: "Built to move. Designed to compete.",
  shortSummary: "A competition-engineered 4-wheel drive battle rover featuring laser-cut dual-deck chassis plates, high-torque 1:48 gearmotors, articulated servo clamp, dedicated custom Payload Cargo Bay, and the official HEXA Command Hub.",
  dimensions: {
    length: "245 mm (9.65 in.)",
    width: "165 mm (6.50 in.)",
    height: "135 mm (5.31 in.)",
    mass: "1,280 g (Full Match Configuration)",
    groundClearance: "28 mm (Obstacle Climbing Cleared)"
  },
  driveType: "4WD Differential Skid-Steer (Traction Wheels Only, R1.10 Compliant)",
  powerSystem: "7.4V 2S Li-Ion Power Cell (2200 mAh, 25C Discharge, 12V Max Compliant)",
  maxSpeed: "1.8 m/s (Fast Arena Sprint across Soft-Foam Tiles)",
  telemetry: "Official HexaLINK 2.4 GHz FHSS (< 4.2 ms latency, R8.9 Compliant)"
};

export const ROBOT_COMPONENTS = [
  {
    id: "claw-linkage",
    name: "Articulated CORE Grabber & Servo Claw",
    shortTag: "CORE CLAW",
    category: "Actuation & Manipulation",
    systemId: "manipulation",
    meshNames: ["ArmBase", "ClawLeft", "ClawRight", "ServoMotor"],
    badgeColor: "#245DFF",
    normalizedPos: { x: 0.68, y: 0.38 },
    cropBox: { x: 0.55, y: 0.25, width: 0.30, height: 0.30 },
    
    whatIsIt: "A motorized mechanical grabber located at the front of the robot, driven by an SG90 micro-servo through a dual-scissor mechanical linkage.",
    whatDoesItDo: "Picks up 95mm outer-diameter ring CORE elements (Red, Blue, or Golden) from Field Spike Marks and Sources, elevating them to thread onto 130mm High Poles or 100mm Star Poles.",
    whyDoesItMatter: "Threading COREs on High Poles scores 3 pts, Star Poles 5 pts, and Apex Poles 9 pts. The claw's 82mm aperture matches the 55mm inner hole of official 3D-printed PLA COREs.",
    howItWorksWithOtherParts: "Receives PWM angle signals from the HEXA Command Hub, coordinated with 4WD chassis turns to align onto poles without knocking over field elements.",
    howItWorksSteps: [
      "1. Driver triggers grab command on the wireless gamepad.",
      "2. HEXA Hub sends a 5V PWM signal to the SG90 servo, rotating its horn 0°–180°.",
      "3. Symmetrical dual-scissor arms widen to 82mm to encircle the ring, then clamp with 8.5N force using Shore 40A silicone pads.",
      "4. The robot lifts and threads the ring cleanly down over a 130mm High Pole or 100mm Star Pole."
    ],
    
    technicalDetails: {
      "Actuator Model": "TowerPro SG90 Micro-Servo (9g, Original Unmodified R5.3)",
      "Operating Voltage": "4.8V – 6.0V DC (Regulated 5V Rail)",
      "Stall Torque": "1.80 kg·cm @ 4.8V | 2.20 kg·cm @ 6.0V",
      "Claw Aperture": "15mm to 82mm (Optimized for 55mm Inner Diameter COREs)",
      "Compatible Scoring Element": "95mm OD × 55mm ID × 30mm thick PLA CORE (40g ± 5g)",
      "Pole Clearance": "Calibrated for 1.0\" dia High Poles (130mm) & Star Poles (100mm)",
      "Rule Compliance": "R1.7 Horizontal < 18\" Limit Met; R5.2 Actuator Limit Met (1 of 4)"
    },
    keyFeatures: [
      "Dual-scissor linkage multiplies servo torque by 2.4x for slip-free grip",
      "High-friction silicone pads ensure zero slippage on smooth 3D printed PLA",
      "Elevation clearance enables stacking up to 4 COREs on High Poles",
      "Non-launching pickup compliant with Rule G4.15 (Strict anti-launch enforcement)"
    ],
    relatedComponentIds: ["hexa-pcb", "chassis-plates"],
    teamMemberIds: ["samrat", "mahika-singh", "divyansh-mishra"],
    verified: true
  },
  {
    id: "cargo-bay",
    name: "Custom PAYLOAD Cargo Bay Mechanism",
    shortTag: "CARGO BAY",
    category: "Payload & Scoring",
    systemId: "manipulation",
    meshNames: ["CargoBay", "PayloadLatch", "CargoActuator"],
    badgeColor: "#F59E0B",
    normalizedPos: { x: 0.50, y: 0.42 },
    cropBox: { x: 0.40, y: 0.32, width: 0.24, height: 0.24 },

    whatIsIt: "A dedicated rear cargo compartment designed specifically to transport and deposit the team's custom 3D-printed team PAYLOAD cube into the Drop Zone.",
    whatDoesItDo: "Transports the 3\" × 3\" × 3\" team PAYLOAD from the Source Zone and deposits it cleanly into the 25\" × 25\" Drop Zone, triggering early Starburst threshold reduction.",
    whyDoesItMatter: "Rule R9.4 prohibits using the CORE claw to handle PAYLOAD. Scoring this PAYLOAD cuts the Starburst activation threshold from 10 COREs down to 4 COREs (a 6-CORE reduction factor)!",
    howItWorksWithOtherParts: "Loaded in the Source Zone by the Human Player (R9.2), locked during transit, and actuated by a dedicated servo latch inside the Drop Zone.",
    howItWorksSteps: [
      "1. Human player loads the 3\" team cube into the rear 18° inclined cradle before match start or in the Source Zone.",
      "2. A micro-servo sear latch pin holds the 380g cube locked in place during high-speed arena sprints.",
      "3. Driver positions the rover inside the 25\" × 25\" Drop Zone and presses the release button.",
      "4. The sear pin retracts, allowing the cube to roll out smoothly onto the mat by gravity with zero bounce."
    ],

    technicalDetails: {
      "Mechanism Type": "Gravity-Assisted Tilt Cradle with Micro-Servo Latch",
      "Supported Payload Dimensions": "Fits inside 4\" cube, larger than 2\" cube (Complies with R-Payload)",
      "Maximum Payload Mass": "Tested up to 380 g (Rule limit: Max 400 g)",
      "Team Number Display": "Embossed '100' Team Number visible from 12+ inches (R4.1 / R4.2)",
      "Strategic Impact": "Reduces Starburst threshold from 10 COREs to 4 COREs (Table 4.5.2)",
      "Rule Compliance": "R9.4 (Separate from CORE mechanism); R9.6 (Actuator count ≤ 2)"
    },
    keyFeatures: [
      "Strict separation from CORE claw fully satisfies Rule R9.4",
      "Red & Blue reversible squad color plates for instant match readiness",
      "Unlocks early Starburst Mode so the team can access Golden Vault COREs early",
      "Smooth roll-out prevents PAYLOAD from bouncing out of the 25\" Drop Zone"
    ],
    relatedComponentIds: ["chassis-plates", "hexa-pcb"],
    teamMemberIds: ["samrat", "swastik", "mayank"],
    verified: true
  },
  {
    id: "hexa-pcb",
    name: "Official NRL HEXA Command Hub & Telemetry Core",
    shortTag: "HEXA HUB",
    category: "Electronics & Control",
    systemId: "electronics",
    meshNames: ["PCBMain", "MCUChip", "RadioAntenna", "MotorDriverIC", "OLEDDisplay"],
    badgeColor: "#0284C7",
    normalizedPos: { x: 0.48, y: 0.28 },
    cropBox: { x: 0.38, y: 0.18, width: 0.25, height: 0.25 },

    whatIsIt: "The official competition-mandated brain board (R7.1) featuring a 32-bit dual-core processor, onboard OLED screen, status LED, and HexaLINK wireless radio.",
    whatDoesItDo: "Runs our custom team OpMode inside the official NRL Engine runtime (R8.1/R8.2), interpreting Bluetooth game controller inputs and governing drive motor H-bridges.",
    whyDoesItMatter: "The Hub enforces tournament safety (watchdog loop, instant driver stop button, brownout detection) while providing sub-5ms control response on the match carpet.",
    howItWorksWithOtherParts: "Directly powers the 4 drive motors through high-current MOSFETs, drives both servos on 5V rails, and displays Team Name, Num, and Wi-Fi Channel on its OLED (R8.7).",
    howItWorksSteps: [
      "1. Wireless 2.4GHz FHSS radio receives driver controller packets with sub-4.2ms round-trip latency.",
      "2. Dual-core 240MHz MCU runs team OpMode logic to calculate motor speeds and check watchdog timers.",
      "3. Integrated H-bridge MOSFETs dispatch 7.4V PWM drive current to the 4 gearmotors and 5V power to the servos.",
      "4. The 0.96\" I2C OLED screen continuously displays link quality, Team Name, Number 100, and frequency channel."
    ],

    technicalDetails: {
      "Processor": "32-Bit Dual-Core 240MHz RISC Microcontroller",
      "Firmware Runtime": "Official NRL Engine Library with OpModes Architecture (R8.1/R8.2)",
      "Wireless Interface": "Official HexaLINK 2.4GHz FHSS Dedicated Radio Channel (R8.9)",
      "Telemetry Latency": "< 4.2 milliseconds packet round-trip time",
      "Onboard Display": "0.96\" I2C OLED (Displays Link, Name, Num 100, Channel R8.7)",
      "Motor Drivers": "Dual Integrated H-Bridges (3.2A continuous / channel)",
      "Safety Features": "Hardware watchdog, instant R8.13 driver stop, status LED (R8.15)",
      "Rule Compliance": "R7.1 (Official Hub); R8.3 (Controller Firmware); R8.6 (Stamped Identity)"
    },
    keyFeatures: [
      "Strictly runs team code inside the opmodes folder per Rule R8.2",
      "Dual-core design ensures wireless telemetry never lags motor control loops",
      "Accessible top-deck mounting ensures OLED is visible to Referees without tilting (R8.7)",
      "Built-in overcurrent and brownout protection during 4-motor full stalls"
    ],
    relatedComponentIds: ["battery-pack", "gearmotors-4wd", "claw-linkage", "cargo-bay"],
    teamMemberIds: ["chirag-koli", "divyansh-mishra", "dakshesh"],
    verified: true
  },
  {
    id: "gearmotors-4wd",
    name: "4WD High-Torque TT DC Gearmotors (1:48)",
    shortTag: "4WD MOTORS",
    category: "Movement & Powertrain",
    systemId: "powertrain",
    meshNames: ["MotorFL", "MotorFR", "MotorRL", "MotorRR", "GearboxFL", "GearboxFR", "GearboxRL", "GearboxRR"],
    badgeColor: "#059669",
    normalizedPos: { x: 0.28, y: 0.54 },
    cropBox: { x: 0.18, y: 0.42, width: 0.28, height: 0.28 },

    whatIsIt: "Four independent dual-shaft high-torque DC gearmotors with 1:48 metal & composite spur gearboxes (strictly limited to 4 propulsion motors under Rule R5.1).",
    whatDoesItDo: "Powers the 4-wheel skid-steer drive, enabling rapid acceleration across soft-foam tiles, zero-radius 360° spot turns, and climbing the 15° inclined Space Station ramp.",
    whyDoesItMatter: "During the final 30-second LEVEL UP phase, climbing the Space Station to DOCK (8 pts) or BALANCE (15 pts) requires heavy low-end torque without stalling.",
    howItWorksWithOtherParts: "Clamped to the lower 6061 aluminum motor plate, wired directly to the HEXA Hub H-bridges with 100nF EMC suppression capacitors to eliminate radio interference.",
    howItWorksSteps: [
      "1. Driver tilts joystick on controller; HEXA Hub outputs directional PWM voltage.",
      "2. 7.4V DC current flows into internal motor brushes, spinning armature coils at high RPM.",
      "3. 1:48 spur gearboxes reduce motor speed while multiplying torque to 800 g·cm per motor (3.2 kg·cm combined).",
      "4. Independent left and right motor banks enable zero-radius 360° spot turns and ramp climbing."
    ],

    technicalDetails: {
      "Motor Count": "Exactly 4 Propulsion Motors (Strictly complies with Rule R5.1)",
      "Gearbox Ratio": "1:48 Precision Spur Reduction",
      "Operating Voltage": "6.0V Nominal (Operating under R6.4 12V Max Limit)",
      "Stall Torque": "800 g·cm (0.8 kg·cm) per motor (3.2 kg·cm combined)",
      "Speed Rating": "200 RPM ± 10% @ 6.0V (1.8 m/s field sprint)",
      "Incline Capability": "Climbs 15° Space Station ramp in Balanced & Unbalanced states",
      "EMC Filtering": "Dual ceramic varistors + 100nF bypass caps (Prevents RF link drops)",
      "Rule Compliance": "R5.1 (Only 4 Propulsion Motors); R5.3 (Unmodified internals)"
    },
    keyFeatures: [
      "Exactly 4 motors meets Rule R5.1 without unnecessary weight",
      "1:48 gearing produces instant launch torque on 20mm soft-foam tiles",
      "Zero-radius skid turning allows fast positioning inside the 26\" Source Zone",
      "Thermal protection prevents brush burnout during continuous 2:30 heats"
    ],
    relatedComponentIds: ["dish-wheels", "hexa-pcb", "chassis-plates"],
    teamMemberIds: ["sayan-kakkar", "mayank", "swastik"],
    verified: true
  },
  {
    id: "chassis-plates",
    name: "Dual-Deck Polycarbonate & 6061-T6 Chassis",
    shortTag: "IMPACT CHASSIS",
    category: "Structure & Frame",
    systemId: "structure",
    meshNames: ["UpperPlate", "LowerPlate", "StandoffPillars", "NoseBumper"],
    badgeColor: "#E11D48",
    normalizedPos: { x: 0.52, y: 0.58 },
    cropBox: { x: 0.38, y: 0.45, width: 0.30, height: 0.30 },

    whatIsIt: "A precision laser-cut dual-deck chassis consisting of a 4mm optical polycarbonate upper plate and a 2mm 6061-T6 aluminum belly pan joined by M3 brass standoffs.",
    whatDoesItDo: "Creates an ultra-rigid 'torsion box' that supports all electronics, motors, and battery while withstanding high-impact arena interactions (Game Manual p. 27: 'high-contact competition').",
    whyDoesItMatter: "Rule R1.3 mandates safe rounded frame edges and R1.2 limits weight to 8kg. Our chassis weighs only 340g while protecting wires from being pinched or damaged.",
    howItWorksWithOtherParts: "The lower deck mounts motors and battery low to the carpet for a 28mm ground clearance, while the top deck provides clear visibility for inspecting referees (R6.9).",
    howItWorksSteps: [
      "1. 2mm 6061-T6 aluminum belly pan anchors all 4 motors and battery below wheel axle height.",
      "2. 4mm optical polycarbonate upper deck supports the HEXA Hub, OLED, and master power switch.",
      "3. M3 brass standoff pillars fasten the plates together into a rigid high-strength torsion box.",
      "4. Rounded 1.5mm edge fillets protect arena foam tiles and prevent snagging during close encounters."
    ],

    technicalDetails: {
      "Deck Dimensions": "245mm L × 165mm W × 135mm H (Starting volume: 9.6\" × 6.5\" × 5.3\")",
      "Starting Volume Rule": "Fully inside 18\" × 18\" × 10\" limit (Rule R1.1 — PASSED)",
      "Total Robot Weight": "1,280 grams (Rule R1.2 Max 8.0 kg limit — PASSED)",
      "Ground Clearance": "28mm (Clears field spike marks & floor seams)",
      "Upper Deck Material": "4.0mm CNC Laser-Cut Polycarbonate with modular rails",
      "Lower Deck Material": "2.0mm Aircraft-Grade 6061-T6 Aluminum Plate",
      "Edge Safety": "Chamfered 1.5mm radii on all outer edges (Complies with Rule R1.3)",
      "Mounting Hardware": "M3 Aluminum & Brass Standoffs with Blue Loctite 242"
    },
    keyFeatures: [
      "Rigid torsion box protects internal battery during accidental collisions",
      "Completely rounded edges pass Scrutineering Safety Inspection R1.3",
      "Transparent deck ensures all wiring and battery connections are inspectable (R6.9)",
      "Beveled nose deflects obstacles upward when driving toward the Space Station"
    ],
    relatedComponentIds: ["gearmotors-4wd", "hexa-pcb", "battery-pack", "cargo-bay"],
    teamMemberIds: ["mayank", "shubh-shankar", "samrat"],
    verified: true
  },
  {
    id: "dish-wheels",
    name: "65mm All-Terrain White Dish Rims & Spiked Tires",
    shortTag: "DISH WHEELS",
    category: "Traction & Handling",
    systemId: "powertrain",
    meshNames: ["WheelFL", "WheelFR", "WheelRL", "WheelRR", "TireFL", "TireFR", "TireRL", "TireRR"],
    badgeColor: "#7C3AED",
    normalizedPos: { x: 0.78, y: 0.68 },
    cropBox: { x: 0.65, y: 0.55, width: 0.28, height: 0.28 },

    whatIsIt: "Four 65mm injection-molded solid dish rims paired with knobby synthetic rubber tires (strictly compliant with Rule R1.10 'No Holonomic Drive').",
    whatDoesItDo: "Delivers high static and kinetic friction on the 20mm interlocking soft-foam floor tiles, preventing wheel spin when pushing opponent robots or carrying COREs.",
    whyDoesItMatter: "Rule R1.10 specifically bans Mecanum wheels, casters, and omni holonomic setups. High-traction rubber is essential for climbing the Space Station ramp.",
    howItWorksWithOtherParts: "Fastened to the TT motor shafts via 12mm brass hex couplers and M4 set screws, eliminating shaft slippage during sudden forward-reverse transitions.",
    howItWorksSteps: [
      "1. Motor shafts drive 12mm brass hex couplers clamped with M4 set screws.",
      "2. High-grip knobby chevron tire lugs bite deeply into 20mm soft-foam tiles without slip.",
      "3. Differential rotational speed between left and right pairs pivots the robot on the spot.",
      "4. Solid dish wheel faces prevent stray field cords or dropped rings from tangling around axles."
    ],

    technicalDetails: {
      "Wheel Diameter": "65 mm (2.56 inches)",
      "Tread Width": "26 mm High-Contact Width",
      "Hub Attachment": "Solid Brass 12mm Hex Hub with M4 Grub Screw",
      "Tire Compound": "High-Friction Synthetic Thermoplastic Rubber",
      "Tread Pattern": "Knobby Chevron Lug (High bite on soft-foam flooring)",
      "Traction Rule": "R1.10 Compliant: Traction wheels only (Zero Mecanum / Casters)",
      "Floor Safety": "Non-marking rubber approved for tournament mats"
    },
    keyFeatures: [
      "Knobby chevron tread locks into 20mm soft-foam tiles for maximum launch traction",
      "Solid dish face prevents rogue wires or dropped COREs from tangling axles",
      "Brass hex couplers prevent the motor flat-spots from stripping out",
      "Low rotational inertia allows instant braking inside the Drop Zone"
    ],
    relatedComponentIds: ["gearmotors-4wd", "chassis-plates"],
    teamMemberIds: ["sayan-kakkar", "shubh-shankar", "mayank"],
    verified: true
  },
  {
    id: "battery-pack",
    name: "Standard-Issue 7.4V Li-Ion Cell & Safety Harness",
    shortTag: "POWER PACK",
    category: "Power & Energy",
    systemId: "power",
    meshNames: ["BatteryCylinder1", "BatteryCylinder2", "XT60Connector", "PowerSwitch"],
    badgeColor: "#F59E0B",
    normalizedPos: { x: 0.32, y: 0.72 },
    cropBox: { x: 0.22, y: 0.60, width: 0.26, height: 0.26 },

    whatIsIt: "Standard-issue competition-approved 7.4V 2S 2200mAh Lithium-Ion battery pack (R6.1) fitted with a standardized master switch harness (R6.2).",
    whatDoesItDo: "Delivers reliable, high-discharge electrical current to all four gearmotors and onboard electronics throughout the full 2:30 match duration.",
    whyDoesItMatter: "Rules R6.1–R6.4 mandate: 1 battery per robot, standard main switch harness, maximum 12V power limit, and strict insulation on all terminals.",
    howItWorksWithOtherParts: "Firmly secured to the lower chassis plate with velcro straps (R2.3), wired through a 15A inline blade fuse to the master power switch (R6.8) and HEXA Hub.",
    howItWorksSteps: [
      "1. High-discharge 2S Lithium-Ion cells supply 7.4V DC current (up to 55A continuous).",
      "2. 16 AWG silicone wire routes power through a 15A inline blade fuse for overcurrent protection.",
      "3. Top-mounted rocker switch and gold XT60 disconnect provide referee-accessible emergency shutoff.",
      "4. Clean filtered power is delivered directly to the HEXA Hub, which steps down to 5V for servos."
    ],

    technicalDetails: {
      "Battery Chemistry": "Standard-Issue 2S Lithium-Ion (Rule R6.1 strictly compliant)",
      "Nominal Voltage": "7.4V DC (Max 8.4V fully charged, well below R6.4 12V ceiling)",
      "Pack Capacity": "2200 mAh (16.28 Watt-hours)",
      "Discharge Capability": "25C Continuous (55A) | 40C Peak Burst (88A)",
      "Main Switch": "Standard-issue competition power switch & harness (Rule R6.2)",
      "Main Connector": "Gold-Plated XT60 Low-Resistance High-Amp Socket",
      "Mounting Method": "Heavy-duty dual velcro straps (Prevents detach on flip R2.3)",
      "Wiring Standard": "16 AWG high-flex silicone wire with heat-shrink insulation (R6.6/R6.11)"
    },
    keyFeatures: [
      "Strict compliance with Rules R6.1, R6.2, R6.3, R6.4, R6.6, and R6.8",
      "High continuous 55A capability eliminates voltage brownouts during 4-motor pushes",
      "Accessible master rocker switch allows instant shut-off without removing plates (R6.8)",
      "Quick-swap battery bay enables 30-second turnaround in the pit between matches"
    ],
    relatedComponentIds: ["hexa-pcb", "chassis-plates"],
    teamMemberIds: ["dakshesh", "chirag-koli", "mahika-singh"],
    verified: true
  }
];

export const ROBOT_SYSTEMS = [
  {
    id: "structure",
    name: "Structural Frame & Safety",
    subtitle: "R1.1, R1.2, R1.3 Compliant Dual-Deck Torsion Box",
    shortDesc: "Forms the rigid foundation of the robot, built from 4mm polycarbonate and 6061-T6 aluminum to withstand high-impact arena collisions.",
    color: "#E11D48",
    componentIds: ["chassis-plates"],
    points: [
      "Fully self-contained within 245 × 165 × 135 mm (Rule R1.1 limit: 18\" × 18\" × 10\")",
      "Complete match weight 1,280g with battery installed (Rule R1.2 limit: 8.0 kg)",
      "Rounded 1.5mm edge fillets and shielded fasteners satisfy Safe Frame Rule R1.3",
      "Inspectable transparent top deck complies with Scrutineering Rule R6.9"
    ]
  },
  {
    id: "powertrain",
    name: "Movement & Powertrain",
    subtitle: "Rule R1.10 & R5.1 Compliant 4WD Traction Drive",
    shortDesc: "Translates pilot commands into agile movement, zero-radius skid turns, and high-torque climbs onto the tilting Space Station platform.",
    color: "#059669",
    componentIds: ["gearmotors-4wd", "dish-wheels"],
    points: [
      "Exactly 4 propulsion motors with 1:48 gear reduction (Rule R5.1 compliant)",
      "High-traction 65mm knobby rubber tires strictly comply with Rule R1.10 (No Mecanum)",
      "Differential skid-steering allows 360° spot turns inside the 26\" Source Zone",
      "Climbs 15° inclined Space Station ramp during LEVEL UP (End Game)"
    ]
  },
  {
    id: "electronics",
    name: "Avionics, Telemetry & Software",
    subtitle: "Official HEXA Hub, HexaLINK & NRL Engine Runtime",
    shortDesc: "Processes pilot joystick inputs via the official HexaLINK radio and executes real-time control loops within the verified NRL Engine architecture.",
    color: "#0284C7",
    componentIds: ["hexa-pcb"],
    points: [
      "Official NRL HEXA Command Hub running verified OpModes code (Rules R7.1, R8.1, R8.2)",
      "HexaLINK 2.4GHz FHSS anti-jamming dedicated telemetry radio (Rule R8.9)",
      "Top-mounted 0.96\" OLED displays Link, Team Name, Num 100, and Channel (Rule R8.7)",
      "Instant driver stop button and hardware watchdog loop satisfy Safety Rule R8.13"
    ]
  },
  {
    id: "manipulation",
    name: "CORE Claw & Cargo Bay Actuation",
    subtitle: "Rules R5.2, R9.4 & R9.6 Compliant Actuators",
    shortDesc: "Handles scoring rings (COREs) and custom team PAYLOAD cubes using strictly separated mechanisms as mandated by competition rules.",
    color: "#245DFF",
    componentIds: ["claw-linkage", "cargo-bay"],
    points: [
      "Front servo claw handles 95mm PLA COREs for High Pole and Star Pole scoring",
      "Dedicated rear Cargo Bay mechanism retrieves and scores PAYLOAD (Rule R9.4)",
      "Max 2 actuators dedicated to Payload (Rule R9.6 compliant)",
      "Scoring PAYLOAD unlocks early Starburst Mode, reducing threshold from 10 to 4 COREs"
    ]
  },
  {
    id: "power",
    name: "Power Distribution & Safety",
    subtitle: "Rules R6.1–R6.8 Standard-Issue Power Architecture",
    shortDesc: "Provides clean, high-discharge power to all onboard subsystems with certified tournament safety disconnects.",
    color: "#F59E0B",
    componentIds: ["battery-pack"],
    points: [
      "Standard-issue 7.4V 2S Li-Ion competition battery (Rule R6.1 compliant)",
      "Standard main switch harness and top-accessible power toggle (Rules R6.2, R6.8)",
      "Operating at 7.4V, well within the Rule R6.4 12V maximum power ceiling",
      "Fully insulated 16 AWG silicone wiring and inline 15A protection (Rule R6.6)"
    ]
  }
];

export const ROBOT_CAPABILITIES = [
  {
    id: "core-pole-scoring",
    title: "High Pole & Star Pole Threading",
    subtitle: "130mm High & 100mm Star Poles",
    description: "The articulated servo claw lifts 95mm outer diameter CORE rings and threads them over 1.0\" diameter poles, earning 3 pts on High Poles and 5 pts on Star Poles.",
    systemId: "manipulation",
    componentId: "claw-linkage",
    tag: "SCORING"
  },
  {
    id: "payload-cargo-bay",
    title: "Dedicated PAYLOAD Cargo Bay",
    subtitle: "Threshold Cut from 10 to 4 COREs",
    description: "A custom tilt cradle transports the team's 3\" cube Payload into the Drop Zone. Scoring it triggers early Starburst Mode, reducing the Golden Vault unlock requirement by 6 COREs.",
    systemId: "manipulation",
    componentId: "cargo-bay",
    tag: "STRATEGY"
  },
  {
    id: "skid-steering",
    title: "Zero-Radius Skid Steering",
    subtitle: "Differential Traction Drive",
    description: "Independent left-right motor drives spin 65mm knobby rubber wheels in opposing directions for 360° spot turns, effortlessly navigating tight 26\" field zones.",
    systemId: "powertrain",
    componentId: "gearmotors-4wd",
    tag: "DRIVETRAIN"
  },
  {
    id: "space-station-level-up",
    title: "Space Station Ramp Climbing",
    subtitle: "DOCK (8 pts) & BALANCE (15 pts)",
    description: "1:48 reduction gearboxes deliver 3.2 kg·cm torque to climb the 15° inclined Space Station ramp during LEVEL UP (final 30s), achieving perfect horizontal balance for 15 pts.",
    systemId: "powertrain",
    componentId: "gearmotors-4wd",
    tag: "ENDGAME"
  },
  {
    id: "hexalink-telemetry",
    title: "HexaLINK 2.4GHz Telemetry & OLED",
    subtitle: "Sub-5ms Protocol & R8.7 Display",
    description: "Official NRL HexaLINK radio ensures zero match interference while the top OLED displays real-time Link, Team Name, Number 100, and Assigned Frequency Channel.",
    systemId: "electronics",
    componentId: "hexa-pcb",
    tag: "TELEMETRY"
  },
  {
    id: "torsion-box-impact",
    title: "High-Contact Torsion Box Defense",
    subtitle: "R1.3 Rounded Safety Frame",
    description: "Polycarbonate upper deck and 6061-T6 aluminum belly pan absorb arena impacts, keeping battery, wiring, and electronics safe during intense competitive heats.",
    systemId: "structure",
    componentId: "chassis-plates",
    tag: "CHASSIS"
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    phase: "INPUT",
    title: "Pilot Command via HexaLINK",
    summary: "The Driver operates the official NRL Bluetooth gamepad controller in the Driver Area.",
    details: "Joystick inputs and trigger commands are processed and broadcast across the assigned 2.4GHz HexaLINK radio channel every 2ms without interfering with opponent squads.",
    componentId: "hexa-pcb",
    systemId: "electronics"
  },
  {
    step: "02",
    phase: "PROCESS",
    title: "HEXA Hub & OpMode Execution",
    summary: "The onboard 32-bit dual-core processor executes team OpMode loops inside the NRL Engine.",
    details: "The processor unpacks radio packets, verifies safety watchdog limits (R8.13), and updates the 0.96\" OLED status screen while calculating differential motor speeds.",
    componentId: "hexa-pcb",
    systemId: "electronics"
  },
  {
    step: "03",
    phase: "ACTION",
    title: "4WD Powertrain & Dual Actuation",
    summary: "Power is dispatched to the four independent DC motors, claw servo, and cargo cradle.",
    details: "Integrated H-bridges direct 7.4V current into the 1:48 gearboxes for traction drive, while regulated 5V power operates the front CORE claw and rear Payload mechanism.",
    componentId: "gearmotors-4wd",
    systemId: "powertrain"
  },
  {
    step: "04",
    phase: "RESULT",
    title: "Poles Scored, Starburst & Level Up",
    summary: "The rover scores COREs on poles, deposits Payload, and balances on the Space Station.",
    details: "Scores 3 pts on High Poles, activates Starburst Mode to retrieve Golden COREs, completes the 10 pt Star Map, and balances on the Space Station for 15 End Game pts.",
    componentId: "claw-linkage",
    systemId: "manipulation"
  }
];
