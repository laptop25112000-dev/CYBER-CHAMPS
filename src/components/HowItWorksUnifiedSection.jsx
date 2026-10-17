import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { Radio, Cpu, Code2, Zap, Cog, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

export default function HowItWorksUnifiedSection() {
  const [selectedStep, setSelectedStep] = useState(0);
  const [showTechnical, setShowTechnical] = useState(false);

  // Mechanical action states
  const [clawState, setClawState] = useState('hold'); // 'pickup' | 'hold' | 'lift' | 'release'
  const [cargoState, setCargoState] = useState('carry'); // 'load' | 'carry' | 'deposit'

  // The 5-stage verified pipeline
  const pipelineSteps = [
    {
      id: 'driver',
      stage: '01',
      name: 'DRIVER COMMAND',
      hardware: 'Official NRL Game Controller',
      icon: Radio,
      simple: 'The student driver in the Alliance Station pushes a joystick or pulls a trigger on the official wireless game controller.',
      technical: 'The controller samples analog stick potentiometers (0–4095 ADC) and tactile buttons every 2ms, packing them into an encrypted telemetry frame.',
      connectsTo: 'Broadcasts via 2.4GHz FHSS radio to the robot\'s antenna.',
      example: 'Driver pushes the right joystick 100% forward to accelerate toward the High Pole.'
    },
    {
      id: 'radio',
      stage: '02',
      name: 'CONTROL SYSTEM',
      hardware: 'HexaLINK 2.4GHz Radio Receiver',
      icon: Zap,
      simple: 'The antenna on the robot receives the wireless radio signal almost instantly (less than 4.2 milliseconds delay).',
      technical: 'Frequency-Hopping Spread Spectrum (FHSS) on the official HexaLINK channel filters background interference and checks the packet checksum.',
      connectsTo: 'Transfers decoded command bytes into the microcontroller\'s memory.',
      example: 'HexaLINK packet [Throttle: 255] is validated and ready for processing.'
    },
    {
      id: 'program',
      stage: '03',
      name: 'ROBOT PROGRAM',
      hardware: 'NRL Engine & Team OpMode',
      icon: Code2,
      simple: 'Our custom software checks safety rules, calculates which wheels need to speed up or slow down, and decides how far the claw should open.',
      technical: 'Running on the 240MHz dual-core MCU, the OpMode loop executes every 10ms, calculating differential skid-steer kinematics and clamping angles.',
      connectsTo: 'Dispatches Pulse Width Modulation (PWM) duty cycles to the motor drivers.',
      example: 'OpMode assigns 100% forward PWM duty cycle to both left and right motor banks.'
    },
    {
      id: 'motor',
      stage: '04',
      name: 'MOTOR COMMAND',
      hardware: 'Integrated H-Bridges & 5V Rail',
      icon: Cpu,
      simple: 'Electrical power switches direct battery power to the 4 drive motors and regulated 5V power to the front claw servo.',
      technical: 'MOSFET H-bridges supply up to 3.2A continuous at 7.4V to the TT gearmotors, while a linear regulator supplies 5.0V to the SG90 micro-servo.',
      connectsTo: 'Drives magnetic armatures and spur gearboxes into physical rotation.',
      example: 'H-Bridges switch 7.4V DC across 4 spur gearmotors; current rises to 1.8A.'
    },
    {
      id: 'movement',
      stage: '05',
      name: 'PHYSICAL MOVEMENT',
      hardware: 'Wheels, Linkages & Claws',
      icon: Cog,
      simple: 'The knobby tires bite into the soft-foam mat to sprint forward, or the scissor clamp closes tightly around a scoring ring.',
      technical: '1:48 gearboxes output 3.2 kg·cm combined stall torque to accelerate the 1.28kg rover at 1.8 m/s, or clamp the ring with 8.5N static grip force.',
      connectsTo: 'Executes match scoring actions (High Poles, Star Poles, Space Station).',
      example: 'Four knobby tires bite into the 20mm soft-foam tiles, rocketing the rover forward at 1.8 m/s.'
    }
  ];

  const currentStep = pipelineSteps[selectedStep];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-[#ECECE7]/40 border-b border-[#D8D8D3] scroll-mt-16">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D8D8D3] text-left">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[15px] sm:text-base uppercase tracking-widest text-[#F04438] block font-bold">
              03 / HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] uppercase">
              From Command to Movement.
            </h2>
            <p className="text-lg sm:text-xl text-[#595959] leading-relaxed">
              Discover how a pilot's touch on the controller transforms into agile arena motion and mechanical manipulation.
            </p>
          </div>

          <div className="font-mono text-[15px] sm:text-base text-[#595959] self-start md:self-auto font-semibold">
            TELEMETRY LATENCY: &lt; 4.2 MS
          </div>
        </div>

        {/* 1. Large Readable Sequence Diagram */}
        <div className="space-y-6">
          <div className="font-mono text-[15px] sm:text-base uppercase tracking-wider text-[#595959] text-left font-semibold">
            SELECT ANY STAGE IN THE 5-STEP PIPELINE:
          </div>

          {/* Pipeline Horizontal Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {pipelineSteps.map((step, idx) => {
              const isSelected = selectedStep === idx;
              const IconComp = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedStep(idx);
                  }}
                  className={`p-4 text-left border rounded-xl transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#171717] ring-2 ring-[#171717] shadow-md'
                      : 'bg-white/80 border-[#D8D8D3] hover:bg-white hover:border-[#595959]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-mono text-[15px] sm:text-base font-bold ${isSelected ? 'text-[#F04438]' : 'text-[#595959]'}`}>
                        STAGE {step.stage}
                      </span>
                      <IconComp className={`w-4 h-4 ${isSelected ? 'text-[#F04438]' : 'text-[#595959]'}`} />
                    </div>
                    <div className="text-base sm:text-lg font-bold text-[#171717] leading-tight">
                      {step.name}
                    </div>
                  </div>

                  <div className="font-mono text-[15px] text-[#595959] mt-3 truncate font-medium">
                    {step.hardware}
                  </div>

                  {/* Directional arrow between stages (desktop) */}
                  {idx < pipelineSteps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#D8D8D3] font-mono text-lg">
                      →
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Step Explanation Display */}
          <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-10 space-y-6 text-left shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3]">
              <div>
                <span className="font-mono text-[15px] sm:text-base text-[#F04438] font-bold tracking-wider">
                  STAGE {currentStep.stage} OVERVIEW
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717] mt-0.5">
                  {currentStep.name} · <span className="text-[#595959] font-normal text-xl">{currentStep.hardware}</span>
                </h3>
              </div>

              {/* Simple vs Technical Details Toggle */}
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowTechnical(!showTechnical);
                }}
                className="self-start sm:self-auto px-4 py-2 rounded border border-[#D8D8D3] bg-[#ECECE7] font-mono text-[15px] sm:text-base font-bold text-[#171717] hover:border-[#171717] transition-all flex items-center gap-2"
              >
                <span>{showTechnical ? 'Show Simple View' : 'See Technical Specs'}</span>
                {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Explanation Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-5">
                <div>
                  <span className="font-mono text-[15px] sm:text-base uppercase font-bold text-[#595959] tracking-wider block mb-1.5">
                    OPERATIONAL PROCESS
                  </span>
                  <p className="text-lg sm:text-xl text-[#171717] leading-relaxed">
                    {currentStep.simple}
                  </p>
                </div>

                {/* Connects to next step with larger text */}
                <div className="p-4 rounded-xl bg-[#ECECE7]/60 border border-[#D8D8D3] text-base sm:text-[17px] font-mono text-[#171717] flex items-center gap-2.5">
                  <span className="text-[#F04438] font-bold">NEXT IN CHAIN:</span>
                  <span>{currentStep.connectsTo}</span>
                </div>

                {/* Collapsible Technical Explanation */}
                {showTechnical && (
                  <div className="p-5 rounded-xl bg-[#FAFAFA] border border-[#D8D8D3] space-y-2 mt-4">
                    <span className="font-mono text-[15px] sm:text-base uppercase font-bold text-[#F04438] tracking-wider block">
                      ENGINEERING SPECIFICATION & LATENCY
                    </span>
                    <p className="text-base sm:text-[17px] font-mono text-[#171717] leading-relaxed">
                      {currentStep.technical}
                    </p>
                  </div>
                )}
              </div>

              {/* Real World Action Example for this step */}
              <div className="lg:col-span-4 bg-[#FAFAFA] border border-[#D8D8D3] rounded-xl p-6 space-y-3">
                <span className="font-mono text-[15px] sm:text-base uppercase font-bold text-[#F04438] tracking-wider block">
                  ACTION DEMONSTRATION
                </span>
                <p className="text-base sm:text-lg text-[#171717] leading-relaxed">
                  {currentStep.example}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Mechanical Actions in Motion (CORE Claw & PAYLOAD Bay) */}
        <div className="pt-10 border-t border-[#D8D8D3] space-y-8 text-left">
          <div className="max-w-3xl space-y-2">
            <span className="font-mono text-[15px] sm:text-base uppercase tracking-widest text-[#F04438] font-bold">
              MECHANICAL EXECUTION
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#171717]">
              How the installed mechanisms move.
            </h3>
            <p className="text-base sm:text-lg text-[#595959]">
              Test the physical sequence for our two verified tournament mechanisms.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Mechanism 1: CORE Claw */}
            <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438]">MECHANISM A</span>
                  <h4 className="text-xl sm:text-2xl font-bold text-[#171717]">Articulated Scissor CORE Claw</h4>
                </div>
                <span className="text-[15px] font-mono px-3 py-1 rounded bg-[#ECECE7] text-[#171717] font-semibold">
                  Rule R5.2 Compliant
                </span>
              </div>

              <p className="text-base sm:text-lg text-[#595959] leading-relaxed">
                Picks up 95mm rings and threads them onto 130mm High Poles (3 pts) and 100mm Star Poles (5 pts).
              </p>

              {/* Action Buttons */}
              <div className="space-y-2">
                <span className="font-mono text-[15px] sm:text-base text-[#595959] uppercase font-bold block">CYCLE STATE:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'pickup', label: '1. Pick Up' },
                    { id: 'hold', label: '2. Hold' },
                    { id: 'lift', label: '3. Lift' },
                    { id: 'release', label: '4. Release' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setClawState(s.id)}
                      className={`py-2.5 px-1 text-center font-mono text-[15px] sm:text-base rounded border transition-all ${
                        clawState === s.id
                          ? 'bg-[#171717] text-white border-[#171717] font-bold'
                          : 'bg-[#FAFAFA] text-[#595959] border-[#D8D8D3] hover:text-[#171717]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Explanation */}
              <div className="p-4 rounded-xl bg-[#ECECE7]/60 border border-[#D8D8D3] text-base sm:text-[17px] font-mono text-[#171717]">
                <strong className="text-[#F04438]">ACTION: </strong>
                {clawState === 'pickup' && 'Claw widens to 82mm to encircle the 95mm outer ring.'}
                {clawState === 'hold' && 'Servo clamps 8.5N force; silicone pads lock onto the ring wall.'}
                {clawState === 'lift' && 'Claw elevates to clear 130mm High Pole clearance height.'}
                {clawState === 'release' && 'Jaws open to 82mm; ring drops cleanly over pole ring stop.'}
              </div>
            </div>

            {/* Mechanism 2: PAYLOAD Cargo Bay */}
            <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438]">MECHANISM B</span>
                  <h4 className="text-xl sm:text-2xl font-bold text-[#171717]">Gravity PAYLOAD Cargo Bay</h4>
                </div>
                <span className="text-[15px] font-mono px-3 py-1 rounded bg-[#ECECE7] text-[#171717] font-semibold">
                  Rule R9.4 Compliant
                </span>
              </div>

              <p className="text-base sm:text-lg text-[#595959] leading-relaxed">
                Transports team 3" cube and deposits into Drop Zone, slashing Starburst threshold from 10 to 4 rings.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2">
                <span className="font-mono text-[15px] sm:text-base text-[#595959] uppercase font-bold block">CYCLE STATE:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'load', label: '1. Load' },
                    { id: 'carry', label: '2. Transport' },
                    { id: 'deposit', label: '3. Deposit' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCargoState(s.id)}
                      className={`py-2.5 px-1 text-center font-mono text-[15px] sm:text-base rounded border transition-all ${
                        cargoState === s.id
                          ? 'bg-[#171717] text-white border-[#171717] font-bold'
                          : 'bg-[#FAFAFA] text-[#595959] border-[#D8D8D3] hover:text-[#171717]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Explanation */}
              <div className="p-4 rounded-xl bg-[#ECECE7]/60 border border-[#D8D8D3] text-base sm:text-[17px] font-mono text-[#171717]">
                <strong className="text-[#F04438]">ACTION: </strong>
                {cargoState === 'load' && 'Cube placed into 18° inclined bay during pre-match or in Source Zone.'}
                {cargoState === 'carry' && 'Micro-servo sear pin holds cube locked during 1.8 m/s arena sprint.'}
                {cargoState === 'deposit' && 'Sear pin retracts; 380g cube rolls smoothly into 25" Drop Zone with zero bounce.'}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
