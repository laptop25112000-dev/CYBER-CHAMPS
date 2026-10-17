import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({
  children,
  animation = 'fade-up', // 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'scale-up', 'zoom-fade'
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = '',
  once = false,
  distance = 32
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          // Allow re-animating when scrolling in and out
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  // Compute transform styles based on animation type
  const getInitialStyle = () => {
    switch (animation) {
      case 'fade-up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'fade-down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'fade-left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'fade-right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'scale-up':
        return 'scale(0.92) translate3d(0, 16px, 0)';
      case 'zoom-fade':
        return 'scale(0.85)';
      default:
        return `translate3d(0, ${distance}px, 0)`;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`will-change-[opacity,transform] ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0) scale(1)' : getInitialStyle(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
      }}
    >
      {children}
    </div>
  );
}
