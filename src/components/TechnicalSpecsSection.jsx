import React, { useState } from 'react';
import { Table, CheckCircle2, ShieldCheck, Download, Copy, Check } from 'lucide-react';
import { NRL_COMPETITION_DATA, ROBOT_CORE_INFO } from '../data/robotData';

export default function TechnicalSpecsSection() {
  const [copied, setCopied] = useState(false);

  const specRows = [
    {
      parameter: 'Starting Dimensions (L × W × H)',
      robotSpec: '245 × 165 × 135 mm (9.6" × 6.5" × 5.3")',
      ruleLimit: 'Max 18" × 18" × 10" (457 × 457 × 254 mm)',
      ruleCode: 'Rule R1.1',
      status: 'PASS',
      note: 'Ultra-compact envelope allows rapid arena maneuvers'
    },
    {
      parameter: 'Total Match Mass (with battery)',
      robotSpec: '1,280 grams (1.28 kg)',
      ruleLimit: 'Maximum 8.0 kg (8,000 g)',
      ruleCode: 'Rule R1.2',
      status: 'PASS',
      note: '84% lighter than ceiling for instant sprint acceleration'
    },
    {
      parameter: 'Horizontal Expansion',
      robotSpec: 'Claw aperture max 82mm (< 18" total)',
      ruleLimit: 'Must not exceed 18" × 18" (45.7 cm)',
      ruleCode: 'Rule R1.7',
      status: 'PASS',
      note: 'Zero horizontal breach during match maneuvers'
    },
    {
      parameter: 'Propulsion Motors',
      robotSpec: '4× TT DC High-Torque Gearmotors (1:48)',
      ruleLimit: 'Maximum 4 propulsion motors',
      ruleCode: 'Rule R5.1',
      status: 'PASS',
      note: 'Dedicated drive per wheel; zero mechanical differential lag'
    },
    {
      parameter: 'Actuator Motors',
      robotSpec: '2 Actuators (1× Claw Servo + 1× Cargo Pin)',
      ruleLimit: 'Max 4 total / Max 2 for Payload',
      ruleCode: 'Rule R5.2 / R9.6',
      status: 'PASS',
      note: 'Payload mechanism is independently actuated (R9.4)'
    },
    {
      parameter: 'Wheel Drive Type',
      robotSpec: '4WD Knobby Synthetic Rubber Traction Wheels',
      ruleLimit: 'Traction only (No Mecanum / Omni / Casters)',
      ruleCode: 'Rule R1.10',
      status: 'PASS',
      note: 'Chevron treads bite into 20mm soft-foam tiles'
    },
    {
      parameter: 'Battery & Supply Voltage',
      robotSpec: '7.4V 2S Li-Ion Power Cell (2200 mAh, 25C)',
      ruleLimit: 'Maximum 12V DC (Step-up converters banned)',
      ruleCode: 'Rule R6.1 & R6.4',
      status: 'PASS',
      note: 'Operates well below 12V threshold; zero voltage boost'
    },
    {
      parameter: 'Master Power Switch',
      robotSpec: 'Top-deck rocker switch + Gold XT60',
      ruleLimit: 'External, accessible, clearly labeled',
      ruleCode: 'Rule R6.8',
      status: 'PASS',
      note: 'Instant single-motion referee emergency shutoff'
    },
    {
      parameter: 'Microcontroller Brain Hub',
      robotSpec: 'Official NRL HEXA Command Hub (Dual-Core 240MHz)',
      ruleLimit: 'Official HEXA Hub mandated',
      ruleCode: 'Rule R7.1',
      status: 'PASS',
      note: 'Runs custom team OpMode in official NRL Engine'
    },
    {
      parameter: 'Wireless Telemetry Radio',
      robotSpec: 'Official HexaLINK 2.4GHz FHSS (<4.2ms latency)',
      ruleLimit: 'HexaLINK only (Public Wi-Fi/BT banned)',
      ruleCode: 'Rule R8.9',
      status: 'PASS',
      note: 'Frequency-hopping spread spectrum prevents interference'
    },
    {
      parameter: 'Onboard Scrutineering Display',
      robotSpec: '0.96" I2C OLED (Link, Team 100, Channel)',
      ruleLimit: 'Must be clearly visible to referees',
      ruleCode: 'Rule R8.7',
      status: 'PASS',
      note: 'Mounted flat on top transparent acrylic plate'
    },
    {
      parameter: 'Chassis Edge Safety',
      robotSpec: '1.5mm Chamfered Polycarbonate & 6061-T6 Aluminum',
      ruleLimit: 'Rounded edges; no sharp metal burrs',
      ruleCode: 'Rule R1.3',
      status: 'PASS',
      note: 'Smooth deburred profiles protect field tiles & personnel'
    }
  ];

  const handleCopySpecs = () => {
    const text = specRows
      .map(r => `${r.parameter}: ${r.robotSpec} [${r.ruleCode}: Limit ${r.ruleLimit} - ${r.status}]`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="specs" className="py-24 sm:py-32 bg-[#F7F7F4] border-b border-[#D8D8D3] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#D8D8D3]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#F04438] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F04438]"></span>
              SECTION 06 / ENGINEERING DATA
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717]">
              THE NUMBERS THAT MATTER.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#6B6B6B] max-w-2xl font-light">
              Clear, unembellished engineering data verified against the official National Robotics League HYPERDRIVE 2026 Game Manual.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleCopySpecs}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg border border-[#D8D8D3] bg-white text-[#171717] hover:bg-[#ECECE7] transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5 text-[#6B6B6B]" />}
              <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY SPEC SHEET'}</span>
            </button>
            <a
              href={`${import.meta.env.BASE_URL}models/nrl-robot-2026.glb`}
              download="NRL-2026-Robot.glb"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg bg-[#F04438] text-white hover:bg-[#d9382d] transition-all font-bold shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD 3D CAD (.GLB)</span>
            </a>
            <a
              href="https://cad.onshape.com/documents/b9775324604f1e712d8677c5/w/42798f7711b0b207da9310d3/e/2e8391d232133dd053e4cffb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg bg-[#171717] text-white hover:bg-black transition-all"
            >
              <span>VIEW IN ONSHAPE CAD</span>
              <span className="text-[10px] text-[#F04438]">↗</span>
            </a>
          </div>
        </div>

        {/* Highlight Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          <div className="p-5 rounded-xl bg-white border border-[#D8D8D3] shadow-sm">
            <span className="font-mono text-[10px] uppercase text-[#6B6B6B] block">OVERALL MASS</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-1">1,280 g</div>
            <span className="font-mono text-[11px] text-[#059669] mt-0.5 block">Limit: 8,000 g (PASS)</span>
          </div>
          <div className="p-5 rounded-xl bg-white border border-[#D8D8D3] shadow-sm">
            <span className="font-mono text-[10px] uppercase text-[#6B6B6B] block">STARTING BOUNDS</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-1">245 mm L</div>
            <span className="font-mono text-[11px] text-[#059669] mt-0.5 block">Limit: 457 mm (PASS)</span>
          </div>
          <div className="p-5 rounded-xl bg-white border border-[#D8D8D3] shadow-sm">
            <span className="font-mono text-[10px] uppercase text-[#6B6B6B] block">SPRINT SPEED</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-1">1.8 m/s</div>
            <span className="font-mono text-[11px] text-[#6B6B6B] mt-0.5 block">1:48 Spur Reduction</span>
          </div>
          <div className="p-5 rounded-xl bg-white border border-[#D8D8D3] shadow-sm">
            <span className="font-mono text-[10px] uppercase text-[#6B6B6B] block">RADIO LATENCY</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-1">&lt; 4.2 ms</div>
            <span className="font-mono text-[11px] text-[#059669] mt-0.5 block">2.4GHz FHSS HexaLINK</span>
          </div>
        </div>

        {/* Minimal Engineering Table */}
        <div className="bg-white border border-[#D8D8D3] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#D8D8D3] font-mono text-[11px] uppercase tracking-wider text-[#6B6B6B]">
                  <th className="py-4 px-6 font-semibold">PARAMETER</th>
                  <th className="py-4 px-6 font-semibold text-[#171717]">ROBOT MEASURED SPECIFICATION</th>
                  <th className="py-4 px-6 font-semibold">OFFICIAL RULE LIMIT</th>
                  <th className="py-4 px-6 font-semibold">RULE CODE</th>
                  <th className="py-4 px-6 font-semibold text-center">INSPECTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D8D3] font-mono text-xs">
                {specRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#ECECE7]/30 transition-colors">
                    <td className="py-4 px-6 text-[#171717] font-semibold">
                      {row.parameter}
                      <span className="block text-[10px] text-[#6B6B6B] font-normal mt-0.5 font-sans">
                        {row.note}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-[#171717]">
                      {row.robotSpec}
                    </td>
                    <td className="py-4 px-6 text-[#6B6B6B]">
                      {row.ruleLimit}
                    </td>
                    <td className="py-4 px-6 text-[#171717]">
                      <span className="px-2 py-0.5 rounded bg-[#ECECE7] text-[10px]">
                        {row.ruleCode}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#059669]/10 text-[#059669] border border-[#059669]/20">
                        <CheckCircle2 className="w-3 h-3" />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#FAFAFA] border-t border-[#D8D8D3] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B6B6B] font-mono gap-2">
            <span>SCRUTINEERING STATUS: ALL 12 VERIFIED TESTS PASSED</span>
            <span>CYBER CHAMPS — TEAM NUMBER 100</span>
          </div>
        </div>

      </div>
    </section>
  );
}
