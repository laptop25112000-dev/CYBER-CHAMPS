import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { Compass, Target, Award, Shield, ChevronDown, ChevronUp, CheckCircle, ArrowRight, ExternalLink, Gamepad2, Sparkles } from 'lucide-react';
import { NRL_COMPETITION_DATA } from '../data/robotData';
import HyperdrivePracticeSimulator from './HyperdrivePracticeSimulator';

export default function GameplaySection() {
  const [currentStep, setCurrentStep] = useState(1); // 1 | 2 | 3 | 4
  const [selectedFieldZone, setSelectedFieldZone] = useState('station');
  const [expandedRule, setExpandedRule] = useState(null);

  const steps = [
    { num: 1, label: 'Step 1: The Field', icon: Compass },
    { num: 2, label: 'Step 2: The Objective', icon: Target },
    { num: 3, label: 'Step 3: Robot\'s Role', icon: Award },
    { num: 4, label: 'Step 4: Official Rules', icon: Shield }
  ];

  const fieldZones = [
    {
      id: 'station',
      name: 'Central Space Station Platform',
      location: 'Arena Center',
      desc: 'A large tilting platform on a central pivot with an inclined ramp. Robots can Engage (3 pts), Dock (8 pts), or Balance parallel to the ground (15 pts) in the final 30 seconds. Hosts the 365mm Apex Pole (9 pts/ring).',
      scoringImpact: 'Up to 15 pts for Balance + 9 pts/core on Apex Pole'
    },
    {
      id: 'highpoles',
      name: 'High Poles (130mm)',
      location: 'Mid-Field Scoring Grid',
      desc: '1.0" diameter vertical poles where robots thread 95mm outer-diameter PLA CORE rings. Each pole holds up to 4 rings.',
      scoringImpact: '3 pts per ring scored'
    },
    {
      id: 'starpoles',
      name: 'Star Poles (100mm)',
      location: 'Alliance Territory',
      desc: 'Precision scoring poles designed for normal and Golden CORE rings. Completing a 3-ring pattern awards a STAR MAP squad bonus.',
      scoringImpact: '5 pts / Squad CORE | 7 pts / Golden CORE | +10 pt STAR MAP'
    },
    {
      id: 'dropzone',
      name: '25" × 25" Drop Zone',
      location: 'Alliance Corner',
      desc: 'A taped square on the foam floor where teams must cleanly deposit their custom 3D-printed PAYLOAD cube.',
      scoringImpact: '10 pt Payload Bonus & slashes Starburst threshold from 10 to 4 rings'
    },
    {
      id: 'sourcezone',
      name: 'Human Player Source Zone',
      location: 'Arena Perimeter (26" boundary)',
      desc: 'Where the human player loads rings and the team payload into the robot according to strict safety rules.',
      scoringImpact: 'Supply staging area'
    },
    {
      id: 'vault',
      name: 'The Golden Vault',
      location: 'Opposite Wall',
      desc: 'Locked at match start. Unlocks during Starburst Mode once the required ring/payload threshold is reached, releasing high-value Golden rings.',
      scoringImpact: 'Golden COREs worth 7 pts each'
    }
  ];

  const activeZone = fieldZones.find(z => z.id === selectedFieldZone) || fieldZones[0];

  return (
    <section id="gameplay" className="py-24 sm:py-32 bg-[#F7F7F4] border-b border-[#D8D8D3] scroll-mt-16">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-12">
        
        {/* Section Header with Larger, Comfortable Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D8D8D3] text-left">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[15px] sm:text-base uppercase tracking-widest text-[#F04438] block font-bold">
              04 / TOURNAMENT GAMEPLAY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] uppercase">
              Understanding HYPERDRIVE.
            </h2>
            <p className="text-lg sm:text-xl text-[#595959] leading-relaxed">
              National Robotics League (NRL) matches are fast, high-contact, and strategic. Practice driving on the official field and learn how matches are won.
            </p>
          </div>

          <div className="font-mono text-[15px] sm:text-base font-bold text-[#171717] self-start md:self-auto">
            MATCH DURATION: 2 MIN 30 SEC
          </div>
        </div>

        {/* Interactive HYPERDRIVE Arena Simulator (Practice Mode) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div>
              <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438] uppercase tracking-wider block">
                LIVE INTERACTIVE TEST DRIVE
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                Official Match Simulator · Practice Mode
              </h3>
            </div>
            <p className="text-base sm:text-lg text-[#595959] max-w-xl text-left sm:text-right">
              Drive on the 12×12 ft field right in your browser. Practice ring handling, high pole scoring, and space station balance with zero install.
            </p>
          </div>

          <HyperdrivePracticeSimulator />
        </div>

        {/* Divider & Stepper Header */}
        <div className="pt-6 border-t border-[#D8D8D3] text-left space-y-2">
          <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438] uppercase tracking-wider block">
            STRATEGY & FIELD WALKTHROUGH
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
            4-Step Tournament Gameplay Breakdown
          </h3>
        </div>

        {/* 4-Step Stepper Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const Icon = s.icon;
            return (
              <button
                key={s.num}
                onClick={() => {
                  soundManager.playClick();
                  setCurrentStep(s.num);
                }}
                className={`p-5 text-left border rounded-xl transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-white border-[#171717] ring-2 ring-[#171717] shadow-sm'
                    : 'bg-[#ECECE7]/60 border-[#D8D8D3] hover:bg-white text-[#595959]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#F04438]' : 'text-[#595959]'}`} />
                  <span className={`text-base font-bold ${isActive ? 'text-[#171717]' : 'text-[#595959]'}`}>
                    {s.label}
                  </span>
                </div>
                <span className={`font-mono text-[15px] font-bold ${isActive ? 'text-[#F04438]' : 'text-[#595959]'}`}>
                  0{s.num}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step 1: The Field */}
        {currentStep === 1 && (
          <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-10 space-y-8 text-left shadow-sm">
            <div>
              <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438] uppercase tracking-wider block mb-1">
                STEP 1 OF 4: THE ARENA
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#171717]">
                The 12' × 12' HYPERDRIVE Arena
              </h3>
              <p className="text-base sm:text-lg text-[#595959] mt-2 max-w-3xl leading-relaxed">
                The game takes place on 36 interlocking soft-foam floor tiles enclosed by 18mm wooden walls. Click any zone below to inspect what happens there.
              </p>
            </div>

            {/* Interactive Field Zone Map / Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
              
              {/* Field Layout Zones List */}
              <div className="lg:col-span-5 space-y-2.5">
                <span className="font-mono text-[15px] sm:text-base uppercase font-bold text-[#595959] tracking-wider block mb-2">
                  ARENA ZONES & KEY APPARATUS:
                </span>
                {fieldZones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedFieldZone(zone.id);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      selectedFieldZone === zone.id
                        ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                        : 'bg-[#FAFAFA] text-[#171717] border-[#D8D8D3] hover:bg-[#ECECE7]'
                    }`}
                  >
                    <div>
                      <div className="text-base font-bold">{zone.name}</div>
                      <div className={`text-[15px] font-mono mt-0.5 ${selectedFieldZone === zone.id ? 'text-[#D8D8D3]' : 'text-[#595959]'}`}>
                        {zone.location}
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${selectedFieldZone === zone.id ? 'text-[#F04438]' : 'text-[#595959]'}`} />
                  </button>
                ))}
              </div>

              {/* Active Zone Detail Card */}
              <div className="lg:col-span-7 bg-[#FAFAFA] border border-[#D8D8D3] rounded-2xl p-6 sm:p-10 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#D8D8D3]">
                  <span className="font-mono text-[15px] sm:text-base uppercase text-[#F04438] font-bold tracking-wider">
                    SELECTED ARENA FEATURE
                  </span>
                  <span className="font-mono text-[15px] px-3 py-1 rounded bg-[#ECECE7] text-[#171717] font-semibold">
                    {activeZone.location}
                  </span>
                </div>

                <h4 className="text-2xl sm:text-3xl font-bold text-[#171717]">
                  {activeZone.name}
                </h4>

                <p className="text-base sm:text-lg text-[#171717] leading-relaxed">
                  {activeZone.desc}
                </p>

                <div className="p-5 rounded-xl bg-white border border-[#D8D8D3] space-y-1.5">
                  <span className="font-mono text-[15px] uppercase text-[#595959] font-bold tracking-wider block">
                    SCORING VALUE AT THIS ZONE:
                  </span>
                  <div className="font-mono text-base sm:text-lg font-bold text-[#171717]">
                    {activeZone.scoringImpact}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Step 2: The Objectives */}
        {currentStep === 2 && (
          <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-10 space-y-8 text-left shadow-sm">
            <div>
              <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438] uppercase tracking-wider block mb-1">
                STEP 2 OF 4: SCORING GOALS
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#171717]">
                How to Score in HYPERDRIVE
              </h3>
              <p className="text-base sm:text-lg text-[#595959] mt-2 max-w-3xl leading-relaxed">
                Matches are won by collecting and scoring three types of items across different phases of the 2-minute 30-second heat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl border border-[#D8D8D3] bg-[#FAFAFA] space-y-3">
                <div className="font-mono text-[15px] sm:text-base font-bold text-[#F04438]">01 · RING SCORING</div>
                <h4 className="text-xl font-bold text-[#171717]">CORE Rings</h4>
                <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                  95mm rings made of 3D-printed PLA. Threading onto 130mm High Poles scores <strong>3 pts</strong>, Star Poles score <strong>5 pts</strong>, and Golden Vault rings score <strong>7 pts</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#D8D8D3] bg-[#FAFAFA] space-y-3">
                <div className="font-mono text-[15px] sm:text-base font-bold text-[#F04438]">02 · TEAM PAYLOAD</div>
                <h4 className="text-xl font-bold text-[#171717]">Payload Delivery</h4>
                <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                  Each squad designs a custom 3" cube. Depositing it cleanly into the 25" Drop Zone cuts the Starburst unlock threshold from 10 down to 4 rings, plus earns a <strong>10 pt squad bonus</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-[#D8D8D3] bg-[#FAFAFA] space-y-3">
                <div className="font-mono text-[15px] sm:text-base font-bold text-[#F04438]">03 · ENDGAME LEVEL UP</div>
                <h4 className="text-xl font-bold text-[#171717]">Space Station Balance</h4>
                <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                  In the final 30 seconds, driving onto the tilting Space Station platform and balancing it horizontally earns <strong>15 pts</strong>. Scoring on the 365mm Apex Pole adds <strong>9 pts/ring</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Robot's Role */}
        {currentStep === 3 && (
          <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-10 space-y-8 text-left shadow-sm">
            <div>
              <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438] uppercase tracking-wider block mb-1">
                STEP 3 OF 4: OUR ROBOT'S CAPABILITIES
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#171717]">
                What CYBER CHAMPS Rover Does on the Field
              </h3>
              <p className="text-base sm:text-lg text-[#595959] mt-2 max-w-3xl leading-relaxed">
                We distinguish clearly between verified bench capabilities and intended match strategies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              
              {/* Verified Capabilities */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-[15px] sm:text-base font-bold text-[#059669]">
                  <CheckCircle className="w-4 h-4" />
                  <span>VERIFIED CAD & BENCH DEMONSTRATED</span>
                </div>

                <div className="space-y-3">
                  <div className="p-5 rounded-xl border border-[#D8D8D3] bg-[#FAFAFA]">
                    <div className="font-bold text-[#171717] text-lg">4WD Skid-Steer Traction Drive</div>
                    <p className="text-base sm:text-[17px] text-[#595959] mt-1 leading-relaxed">
                      1:48 gearboxes deliver 3.2 kg·cm torque and 1.8 m/s speed across 20mm soft-foam tiles, with zero-radius 360° turning.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-[#D8D8D3] bg-[#FAFAFA]">
                    <div className="font-bold text-[#171717] text-lg">Front Scissor CORE Claw</div>
                    <p className="text-base sm:text-[17px] text-[#595959] mt-1 leading-relaxed">
                      TowerPro SG90 servo powers symmetrical scissor linkage opening from 15mm to 82mm to clamp 95mm rings with 8.5N force.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-[#D8D8D3] bg-[#FAFAFA]">
                    <div className="font-bold text-[#171717] text-lg">Independent Rear Payload Bay</div>
                    <p className="text-base sm:text-[17px] text-[#595959] mt-1 leading-relaxed">
                      18° gravity ramp with micro-servo sear release deposits 380g Payload cube cleanly into Drop Zone (Rule R9.4 compliant).
                    </p>
                  </div>
                </div>
              </div>

              {/* Intended Match Strategy */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-mono text-[15px] sm:text-base font-bold text-[#F04438]">
                  <Target className="w-4 h-4" />
                  <span>INTENDED MATCH STRATEGY</span>
                </div>

                <div className="space-y-3">
                  <div className="p-5 rounded-xl border border-[#D8D8D3] bg-[#FAFAFA]">
                    <div className="font-bold text-[#171717] text-lg">Cycle 1: Early Payload Run</div>
                    <p className="text-base sm:text-[17px] text-[#595959] mt-1 leading-relaxed">
                      Deliver custom team cube in the first 45 seconds to immediately cut the Starburst unlock requirement from 10 down to 4 rings.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-[#D8D8D3] bg-[#FAFAFA]">
                    <div className="font-bold text-[#171717] text-lg">Cycle 2: High Pole & Vault Rings</div>
                    <p className="text-base sm:text-[17px] text-[#595959] mt-1 leading-relaxed">
                      Collect rings from Spike Marks and High Poles (3 pts/ring), then access Golden Vault rings (7 pts/ring) once Starburst unlocks.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-[#D8D8D3] bg-[#FAFAFA]">
                    <div className="font-bold text-[#171717] text-lg">Cycle 3: Space Station Balancing</div>
                    <p className="text-base sm:text-[17px] text-[#595959] mt-1 leading-relaxed">
                      At 2:00, drive up the 15° ramp of the Space Station to achieve full 15-point horizontal BALANCE with partner squad robot.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Step 4: Official Rules */}
        {currentStep === 4 && (
          <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-10 space-y-8 text-left shadow-sm">
            <div>
              <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438] uppercase tracking-wider block mb-1">
                STEP 4 OF 4: SCRUTINEERING & RULES
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#171717]">
                Official National Robotics League Rules
              </h3>
              <p className="text-base sm:text-lg text-[#595959] mt-2 max-w-3xl leading-relaxed">
                Every competition robot must pass rigorous pre-match scrutineering. Expand each rule to see the requirement and how our robot complies.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {NRL_COMPETITION_DATA.rulesCompliance.map((item, idx) => (
                <div key={idx} className="border border-[#D8D8D3] rounded-xl overflow-hidden bg-[#FAFAFA]">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setExpandedRule(expandedRule === idx ? null : idx);
                    }}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-[#ECECE7]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438]">{item.rule.split(' ')[0]}</span>
                      <span className="text-base sm:text-lg font-bold text-[#171717]">{item.rule}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[15px] sm:text-base text-[#059669] font-bold hidden sm:inline">PASSED</span>
                      {expandedRule === idx ? <ChevronUp className="w-4 h-4 text-[#595959]" /> : <ChevronDown className="w-4 h-4 text-[#595959]" />}
                    </div>
                  </button>

                  {expandedRule === idx && (
                    <div className="p-5 pt-0 border-t border-[#D8D8D3] bg-white text-base sm:text-[17px] font-mono space-y-2">
                      <div className="pt-3">
                        <span className="text-[#595959]">RULE LIMIT: </span>
                        <strong className="text-[#171717]">{item.limit}</strong>
                      </div>
                      <div>
                        <span className="text-[#595959]">ROBOT ACTUAL VERIFICATION: </span>
                        <strong className="text-[#059669]">{item.actual}</strong>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
