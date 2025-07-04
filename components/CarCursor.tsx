'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';

const CarCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const controls = useAnimation();

  // Car cursor using an image from the public folder
  // Replace 'car-cursor.png' with your actual image filename
  const cursorImage = '/cursor/car.png';

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      
      cursorX.set(e.clientX - 16); // Center the car icon
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', moveCursor);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999]"
      style={{
        x: cursorX,
        y: cursorY,
      }}
      animate={controls}
    >
      <img 
        src={cursorImage} 
        alt="Car cursor" 
        className="w-12 h-12 object-contain pointer-events-none"
        onError={(e) => {
          // Fallback to default cursor if image fails to load
          console.error('Failed to load cursor image:', cursorImage);
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </motion.div>
  );
};

export default CarCursor;
