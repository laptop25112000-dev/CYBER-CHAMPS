export const TEAM_MEMBERS = [
  {
    id: 'mayank',
    name: 'Mayank',
    callsign: 'APEX_ZERO',
    role: 'Squad Commander & Systems Architect',
    specialization: 'Low-Level Exploits, Zero-Day Research & Distributed Architectures',
    category: 'leadership',
    clearanceLevel: 'LEVEL 5 - TOP SECRET',
    avatarGradient: 'from-cyan-500 via-blue-600 to-indigo-700',
    accentColor: '#00f0ff',
    badgeType: 'COMMANDER',
    shape: 'icosahedron',
    bio: 'Founding architect of Cyber Champs. Specializes in low-level kernel vulnerability discovery, high-throughput distributed defensive backbones, and tactical command during competitive CTFs.',
    quote: 'True security is not the absence of threats, but total control over the breach perimeter.',
    stats: {
      tactics: 99,
      exploitDev: 96,
      systemsArch: 98,
      kernelInternal: 94,
      leadership: 99
    },
    skills: [
      { name: 'Kernel Exploit Mitigation', level: 96 },
      { name: 'C / C++ / Rust', level: 98 },
      { name: 'Zero-Day Discovery', level: 93 },
      { name: 'Distributed Consensus', level: 92 },
      { name: 'Reverse Engineering', level: 90 }
    ],
    tools: ['Ghidra', 'GDB/GEF', 'Linux Kernel', 'Rust', 'IDA Pro', 'Docker', 'Go'],
    achievements: [
      'Team Captain for 15+ International CTF Top-3 Finishes',
      'Reported 4 High-Severity Zero-Days in Open Source Infrastructure',
      'Architected Cyber Champs Autonomous Defense Mesh'
    ],
    projects: [
      { name: 'Cerberus-Core', desc: 'Kernel-level eBPF intrusion deterrence daemon with zero CPU overhead.', tag: 'Active Ops' },
      { name: 'ZeroTrace', desc: 'Ephemeral sandboxed analysis environment for malicious binaries.', tag: 'R&D' }
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'mayank@cyberchamps.tech'
    }
  },
  {
    id: 'sayan-kakkar',
    name: 'Sayan Kakkar',
    callsign: 'SHADOW_BYTE',
    role: 'Offensive Security & Red Team Lead',
    specialization: 'Network Penetration, Active Directory Exploitation & Stealth Evasion',
    category: 'offensive',
    clearanceLevel: 'LEVEL 4 - RESTRICTED',
    avatarGradient: 'from-red-500 via-rose-600 to-purple-800',
    accentColor: '#ff0055',
    badgeType: 'RED_TEAM',
    shape: 'octahedron',
    bio: 'Offensive security operative with an unrelenting drive to test perimeter limits. Simulates advanced nation-state attacks, bypasses endpoint detection, and uncovers covert lateral movement vectors.',
    quote: 'No firewall can defend against an attacker who thinks in graph theory.',
    stats: {
      tactics: 94,
      exploitDev: 98,
      systemsArch: 89,
      reconnaissance: 99,
      stealth: 97
    },
    skills: [
      { name: 'Active Directory Attacks', level: 98 },
      { name: 'EDR / AV Evasion', level: 95 },
      { name: 'Network Infiltration', level: 97 },
      { name: 'Web App Pentesting', level: 94 },
      { name: 'Social Eng & OSINT', level: 91 }
    ],
    tools: ['Cobalt Strike', 'Metasploit', 'Burp Suite Pro', 'BloodHound', 'Impacket', 'Kali Linux', 'Python'],
    achievements: [
      'Discovered multi-tenant lateral compromise chain in enterprise cloud network',
      'First Blood in 22+ CTF challenges (Pwn & Web categories)',
      'Certified OSCP, CRTO & eWPTX'
    ],
    projects: [
      { name: 'BloodTrace-NG', desc: 'Graph-based automated Active Directory privilege escalation mapper.', tag: 'Offensive' },
      { name: 'Phantasm-Payloads', desc: 'Polymorphic payload generator demonstrating AMSI and heuristic bypasses.', tag: 'Research' }
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'sayan@cyberchamps.tech'
    }
  },
  {
    id: 'chirag-koli',
    name: 'Chirag Koli',
    callsign: 'CIPHER_BLADE',
    role: 'Smart Contract & Binary Reverse Engineer',
    specialization: 'EVM Security, Protocol Audits, Bytecode Analysis & Firmware Reversing',
    category: 'web3-crypto',
    clearanceLevel: 'LEVEL 4 - RESTRICTED',
    avatarGradient: 'from-amber-400 via-orange-600 to-red-700',
    accentColor: '#ffaa00',
    badgeType: 'BYTE_SURGEON',
    shape: 'cube',
    bio: 'Precision analyst who reads disassembled machine instructions and smart contract bytecode like plain English. Neutralizes reentrancy, oracle manipulations, and hardware firmware backdoors.',
    quote: 'The compiler never lies, and the EVM state never forgives.',
    stats: {
      tactics: 92,
      exploitDev: 96,
      systemsArch: 91,
      binaryAnalysis: 99,
      fuzzing: 95
    },
    skills: [
      { name: 'Solidity / EVM Audits', level: 98 },
      { name: 'x86_64 / ARM Assembly', level: 95 },
      { name: 'Symbolic Execution & Fuzzing', level: 93 },
      { name: 'Firmware Extraction', level: 91 },
      { name: 'Decompilation Analysis', level: 96 }
    ],
    tools: ['Foundry', 'Slither', 'Echidna', 'Ghidra', 'Radare2', 'Binary Ninja', 'Rust'],
    achievements: [
      'Audited $120M+ TVL decentralized liquidity protocols with zero post-launch exploits',
      'CVE credits for router memory corruption firmware vulnerabilities',
      'Defeated impossible hardware crackmes in national cyber summits'
    ],
    projects: [
      { name: 'AuditX-Fuzz', desc: 'Stateful invariant fuzzer for complex cross-chain bridging contracts.', tag: 'Web3 Sec' },
      { name: 'MicroDecompile', desc: 'Heuristic decompiler plugin for embedded IoT architectures.', tag: 'Firmware' }
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'chirag@cyberchamps.tech'
    }
  },
  {
    id: 'mahika-singh',
    name: 'Mahika Singh',
    callsign: 'AETHER_VALKYRIE',
    role: 'Cloud Security Architect & Threat Intelligence Lead',
    specialization: 'Multi-Cloud Hardening, SIEM/SOC Automation & APT Campaign Hunting',
    category: 'defensive',
    clearanceLevel: 'LEVEL 5 - TOP SECRET',
    avatarGradient: 'from-purple-500 via-fuchsia-600 to-pink-600',
    accentColor: '#e024c3',
    badgeType: 'THREAT_HUNTER',
    shape: 'torus',
    bio: 'Shield of the squad. Designs zero-trust multi-cloud architectures across AWS, GCP, and Kubernetes clusters while tracking advanced persistent threat actors with real-time telemetry.',
    quote: 'Visibility is our greatest weapon; you cannot breach what is constantly tracked.',
    stats: {
      tactics: 96,
      exploitDev: 88,
      systemsArch: 99,
      threatIntel: 98,
      cloudSecurity: 99
    },
    skills: [
      { name: 'AWS & Multi-Cloud Defense', level: 99 },
      { name: 'Kubernetes Container Security', level: 96 },
      { name: 'MITRE ATT&CK Mapping', level: 95 },
      { name: 'SIEM & Detection Engineering', level: 97 },
      { name: 'Infrastructure as Code (Terraform)', level: 93 }
    ],
    tools: ['Falco', 'Wazuh', 'Splunk', 'Terraform', 'Kubernetes', 'AWS GuardDuty', 'Zeek'],
    achievements: [
      'Published actionable cyber intelligence briefs on 3 emerging ransomware syndicates',
      'Engineered automated cloud remediation pipeline reducing incident dwell time to 42s',
      'Speaker at premier cloud security and DevSecOps conferences'
    ],
    projects: [
      { name: 'CloudAegis', desc: 'Real-time drift detection and automated IAM privilege containment engine.', tag: 'Cloud Def' },
      { name: 'ThreatRadar', desc: 'Threat intelligence aggregator cross-referencing global honeypot feeds.', tag: 'SOC Intel' }
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'mahika@cyberchamps.tech'
    }
  },
  {
    id: 'samrat',
    name: 'Samrat',
    callsign: 'CRYPTIC_MONARCH',
    role: 'Post-Quantum Cryptography & Protocol Engineer',
    specialization: 'Lattice Cryptography, Zero-Knowledge Proofs (ZKP) & Secure Enclaves',
    category: 'web3-crypto',
    clearanceLevel: 'LEVEL 5 - TOP SECRET',
    avatarGradient: 'from-emerald-400 via-teal-600 to-cyan-800',
    accentColor: '#10b981',
    badgeType: 'CRYPTO_WIZARD',
    shape: 'dodecahedron',
    bio: 'The mathematical powerhouse guarding Cyber Champs against post-quantum decrypts. Researches CRYSTALS-Kyber, Dilithium, and zero-knowledge circuit optimization for tamper-proof computation.',
    quote: 'In mathematics we trust; all other assertions require proof of stake and cryptographic verification.',
    stats: {
      tactics: 93,
      exploitDev: 91,
      systemsArch: 95,
      cryptography: 100,
      mathPhysics: 99
    },
    skills: [
      { name: 'Post-Quantum Crypto (ML-KEM/Kyber)', level: 99 },
      { name: 'ZK-SNARKs & Circom Circuits', level: 96 },
      { name: 'Homomorphic Encryption', level: 92 },
      { name: 'Cryptanalysis & Primitives', level: 97 },
      { name: 'Hardware Security Modules (HSM)', level: 94 }
    ],
    tools: ['Circom', 'SnarkJS', 'OpenSSL', 'SageMath', 'Rust Crypto', 'libsodium', 'C++'],
    achievements: [
      'Implemented pure Rust lightweight implementation of post-quantum lattice exchange',
      'Solved 100% of Crypto category flags in 12 consecutive university & national CTFs',
      'Author of research paper on privacy-preserving identity verification'
    ],
    projects: [
      { name: 'QuantumVault', desc: 'Zero-knowledge, post-quantum encrypted decentralized key storage.', tag: 'Crypto' },
      { name: 'ZkShield', desc: 'Microsecond anonymous proof-of-humanity verification primitives.', tag: 'Research' }
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'samrat@cyberchamps.tech'
    }
  },
  {
    id: 'divyansh-mishra',
    name: 'Divyansh Mishra',
    callsign: 'NEURAL_SENTINEL',
    role: 'AI/ML Security & Autonomous Defense Systems',
    specialization: 'Adversarial Machine Learning, LLM Red Teaming & Neural Anomaly Engines',
    category: 'ai-cloud',
    clearanceLevel: 'LEVEL 5 - TOP SECRET',
    avatarGradient: 'from-indigo-500 via-purple-600 to-blue-700',
    accentColor: '#6366f1',
    badgeType: 'AI_SENTINEL',
    shape: 'sphere',
    bio: 'Frontline researcher exploring the frontier of machine learning vulnerabilities and autonomous security agents. Pioneer in training self-healing cyber defense models and mitigating prompt injections.',
    quote: 'The next cyber war will not be fought at human speed, but at neural inference clock cycles.',
    stats: {
      tactics: 97,
      exploitDev: 94,
      systemsArch: 96,
      machineLearning: 99,
      aiRedTeaming: 98
    },
    skills: [
      { name: 'Adversarial ML & Jailbreak Defense', level: 99 },
      { name: 'Deep Learning Model Inversion Defense', level: 95 },
      { name: 'Autonomous Threat Agent Architectures', level: 97 },
      { name: 'PyTorch / Neural Networks', level: 98 },
      { name: 'Real-time Anomaly Clustering', level: 94 }
    ],
    tools: ['PyTorch', 'TensorFlow', 'LangChain', 'HuggingFace', 'FastAPI', 'CUDA', 'Python'],
    achievements: [
      'Developed deep neural network detecting 0-day network anomalies with 99.4% accuracy',
      'Winner of National AI Cyber Defense Hackathon 2025',
      'Discovered model-stealing vulnerability in public enterprise LLM deployment'
    ],
    projects: [
      { name: 'AegisNeural', desc: 'Self-tuning cognitive IDS detecting anomalous API behavior before signature creation.', tag: 'AI/ML' },
      { name: 'PromptGuard', desc: 'Ultra-low latency proxy intercepting malicious prompt injection vectors.', tag: 'OpenSource' }
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'divyansh@cyberchamps.tech'
    }
  },
  {
    id: 'swastik',
    name: 'Swastik',
    callsign: 'VORTEX_CORE',
    role: 'Creative Technologist & 3D Web Architect',
    specialization: 'WebGL, Three.js, Cyber UI/UX & Secure Interactive Systems',
    category: 'systems',
    clearanceLevel: 'LEVEL 4 - RESTRICTED',
    avatarGradient: 'from-teal-400 via-cyan-600 to-blue-800',
    accentColor: '#06b6d4',
    badgeType: '3D_ARCHITECT',
    shape: 'cylinder',
    bio: 'Master of visual fidelity and interactive 3D computing. Transforms complex cyber telemetry, threat vectors, and data pipelines into slick, intuitive, responsive holographic dashboards.',
    quote: 'Interface is the bridge between human intuition and raw computing horsepower.',
    stats: {
      tactics: 91,
      exploitDev: 89,
      systemsArch: 96,
      webglThreejs: 99,
      uiuxDesign: 98
    },
    skills: [
      { name: 'Three.js / WebGL & Shaders (GLSL)', level: 99 },
      { name: 'Interactive UI Architecture (React)', level: 98 },
      { name: 'Tactical Cyber Visualization', level: 96 },
      { name: 'Browser Security & CSP Hardening', level: 93 },
      { name: 'High-Performance 60FPS Animations', level: 97 }
    ],
    tools: ['Three.js', 'React', 'GLSL', 'Vite', 'Tailwind CSS', 'Figma', 'TypeScript'],
    achievements: [
      'Built cinematic cyber HUD dashboards utilized in command centers during live cyber drills',
      'Optimized 3D rendering pipeline delivering 60 FPS on low-power mobile devices',
      'Designed Cyber Champs brand aesthetic and interactive 3D web identity'
    ],
    projects: [
      { name: 'HoloMatrix-UI', desc: 'WebGL 3D cyber grid visualization library for live threat topologies.', tag: 'Graphics' },
      { name: 'CyberDash', desc: 'Secure real-time incident command dashboard with end-to-end encryption.', tag: 'UI/UX' }
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'swastik@cyberchamps.tech'
    }
  },
  {
    id: 'dakshesh',
    name: 'Dakshesh',
    callsign: 'GHOST_TRACE',
    role: 'Digital Forensics & Incident Response Specialist',
    specialization: 'Memory Volatility Analysis, Malware Triage, Network PCAP & Chain-of-Custody',
    category: 'defensive',
    clearanceLevel: 'LEVEL 4 - RESTRICTED',
    avatarGradient: 'from-violet-500 via-purple-700 to-indigo-900',
    accentColor: '#8b5cf6',
    badgeType: 'FORENSIC_EXPERT',
    shape: 'pyramid',
    bio: 'Digital detective who uncovers what happened when darkness fell. Reconstructs attacker movements from fragmented RAM dumps, registry hives, and high-speed packet captures with pinpoint precision.',
    quote: 'Every byte left in volatile RAM tells a story the attacker wanted dead and buried.',
    stats: {
      tactics: 95,
      exploitDev: 91,
      systemsArch: 92,
      memoryForensics: 99,
      malwareAnalysis: 96
    },
    skills: [
      { name: 'Volatility Memory Forensics', level: 99 },
      { name: 'Malware Dissection & Sandboxing', level: 96 },
      { name: 'Wireshark & Deep Packet Forensics', level: 97 },
      { name: 'YARA Rule Engineering', level: 94 },
      { name: 'Disk & File System Artifact Recovery', level: 95 }
    ],
    tools: ['Volatility 3', 'Autopsy', 'Wireshark', 'YARA', 'FTK Imager', 'X-Ways', 'Python'],
    achievements: [
      'Extracted active C2 server IP and crypto key from RAM within 18 minutes of live breach',
      'Author of 40+ curated community YARA rules detecting state-backed trojans',
      'Forensics Track Champion in 8 major cyber security competitions'
    ],
    projects: [
      { name: 'MemSnoop', desc: 'Automated memory extraction tool highlighting injected DLLs and hooks.', tag: 'Forensics' },
      { name: 'PcapRecon', desc: 'High-speed packet parsing CLI identifying covert DNS tunneling.', tag: 'DFIR' }
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'dakshesh@cyberchamps.tech'
    }
  },
  {
    id: 'shubh-shankar',
    name: 'Shubh Shankar',
    callsign: 'TITAN_FORGE',
    role: 'DevSecOps & Zero-Trust Infrastructure Engineer',
    specialization: 'CI/CD Pipeline Security, Infrastructure Hardening & Container Guardrails',
    category: 'systems',
    clearanceLevel: 'LEVEL 4 - RESTRICTED',
    avatarGradient: 'from-blue-500 via-indigo-600 to-cyan-700',
    accentColor: '#3b82f6',
    badgeType: 'FORGE_MASTER',
    shape: 'tetrahedron',
    bio: 'The bedrock of continuous security. Embeds automated SAST, DAST, and container security scanners directly into deployment pipelines while running resilient zero-trust bastion infrastructure.',
    quote: 'Security is not a gate at the end of the sprint; it is the foundation of every git commit.',
    stats: {
      tactics: 94,
      exploitDev: 90,
      systemsArch: 98,
      pipelineSec: 99,
      zeroTrust: 97
    },
    skills: [
      { name: 'CI/CD Hardening & Secret Management', level: 99 },
      { name: 'Container Isolation & Docker Hardening', level: 97 },
      { name: 'Zero-Trust Bastions & WireGuard', level: 96 },
      { name: 'Automated SAST / DAST Integration', level: 95 },
      { name: 'Linux Kernel Sysctl Hardening', level: 94 }
    ],
    tools: ['Docker', 'HashiCorp Vault', 'GitHub Actions', 'Trivy', 'SonarQube', 'Ansible', 'Linux'],
    achievements: [
      'Eliminated 99.8% of secrets leakage in multi-repository organization via git pre-commit hooks',
      'Deployed zero-trust mesh networking linking 20+ secure CTF lab nodes across 3 continents',
      'Maintained 100% infrastructure availability during intensive live stress testing'
    ],
    projects: [
      { name: 'VaultGate', desc: 'Lightweight ephemeral secret injector for CI/CD pipelines.', tag: 'DevSecOps' },
      { name: 'HardenedLinux', desc: 'Ansible playbooks for CIS-benchmark automated kernel hardening.', tag: 'Infra' }
    ],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'shubh@cyberchamps.tech'
    }
  }
];

export const SQUAD_STATS = [
  { label: 'Elite Operators', value: '09', unit: 'Members', icon: 'Users' },
  { label: 'CTFs & Hackathons Won', value: '38+', unit: 'Victories', icon: 'Trophy' },
  { label: 'CVEs & 0-Days Found', value: '47+', unit: 'Disclosures', icon: 'ShieldAlert' },
  { label: 'Autonomous Uptime', value: '99.99%', unit: 'Reliability', icon: 'Activity' },
  { label: 'Defense Rating', value: '100%', unit: 'Audit Score', icon: 'CheckCircle2' }
];

export const MISSIONS = [
  {
    id: 'cerberus',
    title: 'Project Cerberus',
    subtitle: 'Autonomous eBPF Threat Deterrence & Kernel Sentinel',
    status: 'ACTIVE_DEPLOYMENT',
    category: 'Kernel / Defensive',
    description: 'Kernel-level real-time threat interceptor leveraging extended Berkeley Packet Filters (eBPF) to drop zero-day exploit payloads directly inside network drivers without context-switch latency.',
    metrics: ['0.03ms Latency', '0.001% CPU Overhead', '100k+ Pkts/Sec'],
    tags: ['C', 'Rust', 'eBPF', 'Linux Kernel', 'XDP'],
    codeUrl: 'https://github.com',
    demoUrl: '#demo'
  },
  {
    id: 'quantum-vault',
    title: 'QuantumVault',
    subtitle: 'Post-Quantum Lattice-Based Key Exchange & Enclave',
    status: 'BETA_STABLE',
    category: 'Post-Quantum / Cryptography',
    description: 'Post-quantum secure key management enclave implementing NIST-standardized ML-KEM (Kyber) and ML-DSA (Dilithium) to render communications immune to "harvest now, decrypt later" attacks.',
    metrics: ['NIST FIPS 203 Compliant', 'Zero-Knowledge Proofs', 'Rust Core'],
    tags: ['Rust', 'ML-KEM', 'ZK-SNARKs', 'Cryptography', 'WASM'],
    codeUrl: 'https://github.com',
    demoUrl: '#demo'
  },
  {
    id: 'aegis-neural',
    title: 'AegisNeural IDS',
    subtitle: 'Self-Supervised Cognitive Behavioral Threat Detector',
    status: 'PRODUCTION',
    category: 'AI / Threat Modeling',
    description: 'Transformer-based neural anomaly detection model trained on multi-terabyte network telemetry. Identifies lateral movement, C2 beaconing, and insider exfiltration without static signatures.',
    metrics: ['99.4% Precision', '< 5ms Inference', 'Continuous Learning'],
    tags: ['PyTorch', 'FastAPI', 'CUDA', 'Threat Hunting', 'Python'],
    codeUrl: 'https://github.com',
    demoUrl: '#demo'
  },
  {
    id: 'auditx',
    title: 'AuditX Protocol Analyzer',
    subtitle: 'Symbolic Execution & Invariant Fuzzer for Smart Contracts',
    status: 'PRODUCTION',
    category: 'Web3 / Security Audit',
    description: 'Automated formal verification engine for Ethereum Virtual Machine (EVM) smart contracts that tests millions of permutation states per second to prevent reentrancy and flash loan exploits.',
    metrics: ['$120M+ TVL Audited', '0 Exploits Recorded', '99.8% Code Coverage'],
    tags: ['Solidity', 'Foundry', 'Symbolic Execution', 'Go', 'EVM'],
    codeUrl: 'https://github.com',
    demoUrl: '#demo'
  }
];

export const ARSENAL_CATEGORIES = [
  {
    title: 'Offensive Cyber & Exploitation',
    icon: 'Terminal',
    tools: ['Metasploit Pro', 'Burp Suite Professional', 'Cobalt Strike', 'BloodHound', 'Impacket', 'sqlmap', 'Hashcat']
  },
  {
    title: 'Binary Analysis & Reverse Engineering',
    icon: 'Cpu',
    tools: ['Ghidra SRE', 'IDA Pro', 'Radare2', 'GDB / GEF', 'Binary Ninja', 'Frida Dynamic Hooking', 'x64dbg']
  },
  {
    title: 'Post-Quantum & Cryptography',
    icon: 'Key',
    tools: ['ML-KEM (Kyber)', 'ML-DSA (Dilithium)', 'Circom ZK Circuits', 'SnarkJS', 'SageMath', 'libsodium', 'OpenSSL 3']
  },
  {
    title: 'Autonomous AI & Neural Defense',
    icon: 'BrainCircuit',
    tools: ['PyTorch 2', 'Adversarial Robustness Toolbox', 'LangChain Security', 'CUDA 12', 'HuggingFace', 'FastAPI']
  },
  {
    title: 'Cloud, SIEM & Threat Hunting',
    icon: 'CloudRain',
    tools: ['Kubernetes Security', 'AWS GuardDuty', 'Wazuh SIEM', 'Falco eBPF', 'Terraform', 'Splunk Enterprise', 'Zeek']
  },
  {
    title: 'Digital Forensics & Incident Response',
    icon: 'Search',
    tools: ['Volatility 3', 'Autopsy', 'Wireshark Protocol Analyzer', 'YARA Rule Engine', 'FTK Imager', 'X-Ways', 'KAPE']
  }
];
