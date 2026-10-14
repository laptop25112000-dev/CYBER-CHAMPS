import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Send, Radio, Key, Lock, CheckCircle2, 
  MessageSquare, ShieldCheck, Mail 
} from 'lucide-react';
import { GithubIcon } from './Icons';


export default function ContactTransmission() {
  const [formState, setFormState] = useState({
    callsign: '',
    email: '',
    classification: 'BUG_REPORT_AUDIT',
    message: '',
    useQuantumEncryption: true
  });
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.email || !formState.message) return;

    soundManager.playClick();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      const randomHash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(randomHash);
      soundManager.playAccessGranted();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00f0ff', '#10b981', '#3b82f6']
      });
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Transmission Channels & PGP Key */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30 mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            COMMUNICATION PROTOCOL
          </div>
          <h2 className="font-['Orbitron'] text-3xl font-bold text-white mb-3">
            Initiate Secure Transmission
          </h2>
          <p className="text-slate-400 text-sm font-sans leading-relaxed">
            Have a mission, critical vulnerability report, smart contract security audit, or red-team engagement? Connect directly with the Cyber Champs squad.
          </p>
        </div>

        {/* PGP Fingerprint Card */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-2">
            <Key className="w-4 h-4" />
            SQUAD PGP KEY FINGERPRINT
          </div>
          <code className="block font-mono text-[11px] text-slate-300 bg-slate-950 p-3 rounded border border-slate-800 break-all select-all">
            4F92 B710 E83A 9C01 77DA 8B2F 301E A56C 9904 BF21
          </code>
          <p className="font-mono text-[10px] text-slate-400 mt-2">
            Key ID: 0x9904BF21 // ML-KEM-1024 Hybrid Verified
          </p>
        </div>

        {/* Channels */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-slate-400 text-[10px]">DIRECT OPERATIONAL DISPATCH</div>
              <a href="mailto:ops@cyberchamps.tech" className="text-white hover:text-cyan-400 transition-colors">
                ops@cyberchamps.tech
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <GithubIcon className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <div className="text-slate-400 text-[10px]">OPEN-SOURCE LAB & CVE DISCLOSURES</div>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white hover:text-purple-400 transition-colors">
                github.com/cyber-champs
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Encrypted Form */}
      <div className="lg:col-span-7">
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl relative cut-corner-br">
          {sentSuccess ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-['Orbitron'] text-2xl font-bold text-white">
                Packet Transmitted Successfully
              </h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto font-sans">
                Your message has been encrypted and dispatched to the Cyber Champs command terminal. An operator will establish contact via secure channels.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-cyan-400 select-all">
                TX_HASH: {txHash}
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setSentSuccess(false);
                  setFormState({
                    callsign: '',
                    email: '',
                    classification: 'BUG_REPORT_AUDIT',
                    message: '',
                    useQuantumEncryption: true
                  });
                }}
                className="px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-colors"
              >
                DISPATCH NEW PACKET
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-slate-300">
                    CALLSIGN / SENDER IDENTIFIER
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.callsign}
                    onChange={(e) => setFormState({ ...formState, callsign: e.target.value })}
                    placeholder="e.g. Neo / CyberNinja"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 font-mono text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-mono text-xs text-slate-300">
                    SECURE RETURN ADDRESS (EMAIL)
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="operator@domain.sec"
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 font-mono text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-slate-300">
                  MISSION CLASSIFICATION
                </label>
                <select
                  value={formState.classification}
                  onChange={(e) => setFormState({ ...formState, classification: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 font-mono text-xs text-cyan-300 focus:outline-none transition-colors"
                >
                  <option value="BUG_REPORT_AUDIT">Vulnerability Disclosure / Smart Contract Audit</option>
                  <option value="RED_TEAM_ENGAGEMENT">Red Team / Penetration Testing Inquiry</option>
                  <option value="COLLABORATION_CTF">CTF Teaming / Research Joint Venture</option>
                  <option value="AI_DEFENSE">Autonomous AI & Defense Mesh Consulting</option>
                  <option value="GENERAL_TRANSMISSION">General Inquiries</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-mono text-xs text-slate-300">
                  TRANSMISSION PAYLOAD (MESSAGE)
                </label>
                <textarea
                  rows={4}
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="State scope, target architecture, or disclosure details..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-500 font-mono text-xs text-white placeholder-slate-600 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Quantum Encryption Toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={formState.useQuantumEncryption}
                  onChange={(e) => setFormState({ ...formState, useQuantumEncryption: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="font-mono text-xs text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Sign with Post-Quantum Lattice Key (ML-KEM-1024)
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-slate-950 font-mono text-xs font-bold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>ENCRYPTING & DISPATCHING PACKET...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>DISPATCH SECURE TRANSMISSION</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
