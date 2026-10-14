import React, { useState, useRef, useEffect } from 'react';
import { TEAM_MEMBERS, SQUAD_STATS, MISSIONS } from '../data/team';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Terminal, Copy, Check, CornerDownLeft } from 'lucide-react';

export default function InteractiveTerminal({ onSelectMember }) {
  const [history, setHistory] = useState([
    { type: 'system', text: 'CYBER CHAMPS SECURE TACTICAL TERMINAL v4.2.0 [ONLINE]' },
    { type: 'system', text: 'Type "help" to display available squad commands.' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    soundManager.playClick();
    setCommandHistory(prev => [...prev, trimmed]);
    setCmdIndex(-1);

    const parts = trimmed.split(' ');
    const root = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    const newHistory = [...history, { type: 'user', text: `$ ${trimmed}` }];

    switch (root) {
      case 'help':
        newHistory.push({
          type: 'response',
          text: `AVAILABLE COMMANDS:
  help              - List all available terminal commands
  team / members    - List all 9 Cyber Champs operators
  cat <name>        - Inspect dossier for an operator (e.g., cat mayank, cat sayan)
  stats             - Display squad combat & CTF metrics
  missions          - List flagship cyber defense projects
  matrix            - Run quantum matrix diagnostic
  ping              - Test link latency to Cyber Champs Enclave
  sudo access       - Request root privilege escalation
  win / celebrate   - Trigger team victory protocol
  clear             - Clear terminal window`
        });
        break;

      case 'team':
      case 'members':
        newHistory.push({
          type: 'response',
          text: `CYBER CHAMPS OPERATIONAL ROSTER:
${TEAM_MEMBERS.map((m, i) => `  [0${i+1}] ${m.name.padEnd(16)} | Callsign: ${m.callsign.padEnd(15)} | Role: ${m.role}`).join('\n')}`
        });
        break;

      case 'cat':
      case 'inspect':
      case 'view':
        if (!arg) {
          newHistory.push({ type: 'error', text: 'Error: Provide an operator name. (Example: "cat mayank", "cat sayan", "cat divyansh")' });
        } else {
          const found = TEAM_MEMBERS.find(m => 
            m.name.toLowerCase().includes(arg) || 
            m.id.toLowerCase().includes(arg) || 
            m.callsign.toLowerCase().includes(arg)
          );
          if (found) {
            newHistory.push({
              type: 'response',
              text: `=== [DOSSIER: ${found.name.toUpperCase()} // ${found.callsign}] ===
Role: ${found.role}
Clearance: ${found.clearanceLevel}
Specialization: ${found.specialization}
Top Skills: ${found.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}
Arsenal: ${found.tools.join(', ')}
Bio: ${found.bio}
Quote: "${found.quote}"`
            });
            if (onSelectMember) {
              onSelectMember(found);
            }
          } else {
            newHistory.push({ type: 'error', text: `Operator "${arg}" not found in Cyber Champs active directory.` });
          }
        }
        break;

      case 'stats':
        newHistory.push({
          type: 'response',
          text: `TACTICAL METRICS:
${SQUAD_STATS.map(s => `  * ${s.label.padEnd(24)}: ${s.value} ${s.unit}`).join('\n')}`
        });
        break;

      case 'missions':
        newHistory.push({
          type: 'response',
          text: `DEPLOYED MISSIONS:
${MISSIONS.map(m => `  * ${m.title.padEnd(24)} [${m.status}] - ${m.subtitle}`).join('\n')}`
        });
        break;

      case 'matrix':
        newHistory.push({
          type: 'response',
          text: `[DIAGNOSTIC] Initializing 256-bit entropy stream:
01000011 01011001 01000010 01000101 01010010 
01000011 01001000 01000001 01001101 01010000 01010011 
>> ALL 9 CORE OPERATORS SYNCHRONIZED
>> POST-QUANTUM HARDENING: ACTIVE`
        });
        break;

      case 'ping':
        newHistory.push({
          type: 'response',
          text: `PING cyberchamps.internal (10.0.42.1): 56 data bytes
64 bytes from 10.0.42.1: icmp_seq=0 ttl=64 time=0.032 ms
64 bytes from 10.0.42.1: icmp_seq=1 ttl=64 time=0.028 ms
--- cyberchamps.internal ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
rtt min/avg/max = 0.028/0.030/0.032 ms`
        });
        break;

      case 'sudo':
        newHistory.push({
          type: 'response',
          text: `[ROOT_AUTHENTICATED] Welcome, Operator. Cyber Champs root privileges unlocked. All firewall ports listening.`
        });
        soundManager.playAccessGranted();
        break;

      case 'win':
      case 'celebrate':
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#bc13fe', '#10b981', '#ffaa00']
        });
        newHistory.push({
          type: 'response',
          text: `[VICTORY PROTOCOL] First Blood claimed! Defenses held, flags captured.`
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        newHistory.push({
          type: 'error',
          text: `Command not recognized: "${root}". Type "help" for squad manual.`
        });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    soundManager.playBeep(900, 0.015, 'sine', 0.03);
    if (e.key === 'Enter') {
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = cmdIndex === -1 ? commandHistory.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex !== -1) {
        const nextIdx = cmdIndex + 1;
        if (nextIdx < commandHistory.length) {
          setCmdIndex(nextIdx);
          setInputVal(commandHistory[nextIdx]);
        } else {
          setCmdIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div className="w-full rounded-2xl bg-slate-950/95 border border-cyan-500/30 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="font-mono text-xs text-slate-400 ml-2">
            bash - root@cyber-champs:~ (tty1)
          </span>
        </div>
        <div className="font-mono text-[10px] text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
          CLI_SECURE_TUNNEL
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-slate-300 min-h-[300px] max-h-[420px] overflow-y-auto space-y-2 select-text">
        {history.map((item, idx) => (
          <div 
            key={idx} 
            className={`whitespace-pre-wrap ${
              item.type === 'user' 
                ? 'text-cyan-400 font-bold' 
                : item.type === 'error' 
                ? 'text-rose-400' 
                : item.type === 'system'
                ? 'text-emerald-400/90'
                : 'text-slate-300 leading-relaxed'
            }`}
          >
            {item.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Input Prompt */}
      <div className="flex items-center px-4 py-3 bg-slate-900/60 border-t border-slate-800/80">
        <span className="font-mono text-cyan-400 font-bold mr-2 text-sm">$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command here... (try: team, help, cat mayank, win)"
          className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none"
        />
        <button
          onClick={() => handleCommand(inputVal)}
          className="p-1.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 font-mono text-xs transition-colors flex items-center gap-1"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
          EXEC
        </button>
      </div>
    </div>
  );
}
