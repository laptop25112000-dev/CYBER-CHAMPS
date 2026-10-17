import React, { useEffect, useRef, useState } from 'react';

export default function ScrollCountUp({
  end,
  duration = 1400,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounting();
        } else {
          // Reset so it re-animates on subsequent scrolls
          hasAnimatedRef.current = false;
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  const startCounting = () => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const numericEnd = typeof end === 'number' ? end : parseFloat(end);
    if (isNaN(numericEnd)) {
      setDisplayValue(end);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out expo for snappy modern counting
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = numericEnd * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(numericEnd);
      }
    };

    requestAnimationFrame(animate);
  };

  const formatted = typeof displayValue === 'number'
    ? displayValue.toFixed(decimals)
    : displayValue;

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
