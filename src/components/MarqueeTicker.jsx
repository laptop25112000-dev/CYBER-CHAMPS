import React, { useEffect, useRef, useState } from 'react';

export default function MarqueeTicker({ items, speed = 25, reverse = false, className = '' }) {
  const defaultItems = [
    'NATIONAL ROBOTICS LEAGUE 2026',
    'DELHI REGIONAL STATE LEVEL',
    'TEAM CYBER CHAMPS (09)',
    '4WD DUAL-DECK HYPERDRIVE ROBO CAR',
    'OFFICIAL TOURNAMENT KIT BUILD',
    'SCRUTINEERING PASSED: 100% VERIFIED',
    'HEXA 2.4GHz WIRELESS HUB',
    'SERVO CLAW ACTUATION READY',
    'BATTLE ARENA ROUNDS READY'
  ];

  const displayItems = items || defaultItems;
  const repeated = [...displayItems, ...displayItems, ...displayItems];

  const [dynamicSpeed, setDynamicSpeed] = useState(speed);
  const lastScrollY = useRef(0);
  const decayTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.pageYOffset;
      const delta = Math.abs(currentY - lastScrollY.current);
      lastScrollY.current = currentY;

      // Accelerate marquee proportionally to scroll speed
      const boost = Math.min(speed * 0.4, Math.max(speed * 0.25, speed / (1 + delta * 0.05)));
      setDynamicSpeed(boost);

      clearTimeout(decayTimeout.current);
      decayTimeout.current = setTimeout(() => {
        setDynamicSpeed(speed);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(decayTimeout.current);
    };
  }, [speed]);

  return (
    <div className={`w-full overflow-hidden border-y-3 border-black bg-[#FEF08A] py-2.5 select-none ${className}`}>
      <div 
        className="flex items-center gap-8 whitespace-nowrap will-change-transform"
        style={{
          animation: `marquee ${dynamicSpeed}s linear infinite ${reverse ? 'reverse' : 'normal'}`
        }}
      >
        {repeated.map((text, idx) => (
          <span key={idx} className="flex items-center gap-6 font-mono text-xs font-black tracking-widest text-black uppercase">
            <span>{text}</span>
            <span className="text-black text-sm" aria-hidden="true">&#10037;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
