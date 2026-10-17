import React, { useState, useRef, useEffect } from 'react';
import { TEAM_MEMBERS, SQUAD_STATS } from '../data/team';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Terminal, Copy, Check, CornerDownLeft } from 'lucide-react';

export default function InteractiveTerminal({ onSelectMember }) {
  const [history, setHistory] = useState([
    { type: 'system', text: 'CYBER CHAMPS // DELHI REGIONAL ROBOTICS TEAM PORTFOLIO [ONLINE]' },
    { type: 'system', text: 'Type "help" to display available commands.' }
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
  team / members    - List all 9 Cyber Champs team members
  car / nrl         - Inspect Delhi Regional Battle Robo Car specs
  view <name>       - View profile of a team member (e.g., view mayank, view sayan)
  stats             - Display competition & robo car stats
  win / celebrate   - Trigger team celebration protocol
  clear             - Clear terminal window`
        });
        break;

      case 'car':
      case 'nrl':
      case 'hyperdrive':
        newHistory.push({
          type: 'response',
          text: `=== [NRL 2026 DELHI REGIONAL BATTLE ROBO CAR] ===
Competition: National Robotics League (NRL) - Delhi Regional State Level
Kit: Official NRL Hyperdrive Robot Kit (Presented by Amazon)
Chassis: Polycarbonate / Acrylic Upper Deck with Laser-Cut Slots & Aluminum Brackets
Drivetrain: 4WD Independent High-Torque DC Motors with White Dish Wheels & Knobby Rubber Tires
Grabber: Front Articulated Clamp Linkage Powered by SG90 Micro-Servo
Electronics: HEXA Wireless Command Hub + 2.4GHz Dual-Joystick Remote
Status: 100% ASSEMBLED & READY FOR DELHI REGIONAL ARENA ROUNDS`
        });
        break;

      case 'team':
      case 'members':
        newHistory.push({
          type: 'response',
          text: `CYBER CHAMPS TEAM MEMBERS (DELHI REGIONAL):
${TEAM_MEMBERS.map((m, i) => `  [0${i+1}] ${m.name.padEnd(20)} | Focus: ${m.skills[0]?.name || 'Robotics Engineering'}`).join('\n')}`
        });
        break;

      case 'cat':
      case 'inspect':
      case 'view':
        if (!arg) {
          newHistory.push({ type: 'error', text: 'Error: Provide a team member name. (Example: "view mayank", "view sayan", "view divyansh")' });
        } else {
          const found = TEAM_MEMBERS.find(m => 
            m.name.toLowerCase().includes(arg) || 
            m.id.toLowerCase().includes(arg)
          );
          if (found) {
            newHistory.push({
              type: 'response',
              text: `=== [TEAM MEMBER: ${found.name.toUpperCase()}] ===
Competition: NRL Delhi Regional State Level
Bio: ${found.bio}
Skills: ${found.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}
Tools: ${found.tools.join(', ')}
Quote: "${found.quote}"`
            });
            if (onSelectMember) {
              onSelectMember(found);
            }
          } else {
            newHistory.push({ type: 'error', text: `Team member "${arg}" not found. Type "team" to list all 9 members.` });
          }
        }
        break;

      case 'stats':
        newHistory.push({
          type: 'response',
          text: `DELHI REGIONAL COMPETITION STATS:
${SQUAD_STATS.map(s => `  * ${s.label.padEnd(20)}: ${s.value} ${s.unit}`).join('\n')}`
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
    <div className="w-full rounded-2xl bg-slate-950 border-3 sm:border-4 border-black overflow-hidden shadow-[8px_8px_0px_0px_#000]">
      {/* Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black border-b-2 sm:border-b-3 border-black">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-black" />
          <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-black" />
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-black" />
          <span className="font-mono text-xs font-bold text-slate-200 ml-2">
            bash - team@cyber-champs:delhi-regional (tty1)
          </span>
        </div>
        <div className="font-mono text-[10px] font-black text-black bg-cyan-400 px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
          DELHI_REGIONAL_TERMINAL
        </div>
      </div>

      {/* Terminal Output */}
      <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-slate-200 min-h-[300px] max-h-[420px] overflow-y-auto space-y-2 select-text">
        {history.map((item, idx) => (
          <div 
            key={idx} 
            className={`whitespace-pre-wrap ${
              item.type === 'user' 
                ? 'text-cyan-400 font-bold' 
                : item.type === 'error' 
                ? 'text-rose-400 font-bold' 
                : item.type === 'system'
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-300 leading-relaxed font-normal'
            }`}
          >
            {item.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Input Prompt */}
      <div className="flex items-center px-4 py-3 bg-black border-t-2 sm:border-t-3 border-black">
        <span className="font-mono text-cyan-400 font-black mr-2 text-sm">$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command here... (try: team, help, car, win)"
          className="flex-1 bg-transparent font-mono text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleCommand(inputVal)}
          className="px-3 py-1.5 rounded-lg bg-cyan-400 text-black font-mono text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-cyan-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
          EXEC
        </button>
      </div>
    </div>
  );
}
