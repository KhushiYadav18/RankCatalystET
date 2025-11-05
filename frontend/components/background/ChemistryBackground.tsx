"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface MoleculeProps {
  x: number;
  y: number;
  delay: number;
  size: number;
  structure: "benzene" | "atom" | "molecule";
  clickX?: number;
  clickY?: number;
  clickTime?: number;
}

const Molecule = ({ x, y, delay, size, structure, clickX, clickY, clickTime }: MoleculeProps) => {
  const [baseX] = useState(x);
  const [baseY] = useState(y);
  const [movementMultiplier, setMovementMultiplier] = useState(1);
  
  const motionX = useMotionValue(baseX);
  const motionY = useMotionValue(baseY);
  
  const springX = useSpring(motionX, { stiffness: 50, damping: 20 });
  const springY = useSpring(motionY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    if (clickX !== undefined && clickY !== undefined && clickTime) {
      // Calculate distance from click point
      const dx = clickX - baseX;
      const dy = clickY - baseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If click is within 300px, increase movement
      if (distance < 300) {
        const intensity = 1 - (distance / 300);
        setMovementMultiplier(1 + intensity * 3);
        
        // Push molecule away from click point
        const angle = Math.atan2(dy, dx);
        const pushDistance = 50 * intensity;
        motionX.set(baseX + Math.cos(angle) * pushDistance);
        motionY.set(baseY + Math.sin(angle) * pushDistance);
        
        // Reset after animation
        setTimeout(() => {
          motionX.set(baseX);
          motionY.set(baseY);
          setMovementMultiplier(1);
        }, 1000);
      }
    }
  }, [clickX, clickY, clickTime, baseX, baseY, motionX, motionY]);

  const getStructure = () => {
    const opacity = 0.5; // Much more visible
    const strokeColor = "#0ea5e9";
    
    switch (structure) {
      case "benzene":
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            {/* Benzene ring */}
            <circle cx="50" cy="30" r="8" fill="none" stroke={strokeColor} strokeWidth="2.5" opacity={opacity} />
            <circle cx="30" cy="50" r="8" fill="none" stroke={strokeColor} strokeWidth="2.5" opacity={opacity} />
            <circle cx="70" cy="50" r="8" fill="none" stroke={strokeColor} strokeWidth="2.5" opacity={opacity} />
            <circle cx="50" cy="70" r="8" fill="none" stroke={strokeColor} strokeWidth="2.5" opacity={opacity} />
            <circle cx="20" cy="70" r="8" fill="none" stroke={strokeColor} strokeWidth="2.5" opacity={opacity} />
            <circle cx="80" cy="70" r="8" fill="none" stroke={strokeColor} strokeWidth="2.5" opacity={opacity} />
            {/* Bonds */}
            <line x1="50" y1="30" x2="30" y2="50" stroke={strokeColor} strokeWidth="2" opacity={opacity} />
            <line x1="30" y1="50" x2="70" y2="50" stroke={strokeColor} strokeWidth="2" opacity={opacity} />
            <line x1="70" y1="50" x2="50" y2="70" stroke={strokeColor} strokeWidth="2" opacity={opacity} />
            <line x1="50" y1="70" x2="20" y2="70" stroke={strokeColor} strokeWidth="2" opacity={opacity} />
            <line x1="50" y1="70" x2="80" y2="70" stroke={strokeColor} strokeWidth="2" opacity={opacity} />
            <line x1="20" y1="70" x2="30" y2="50" stroke={strokeColor} strokeWidth="2" opacity={opacity} />
            <line x1="80" y1="70" x2="70" y2="50" stroke={strokeColor} strokeWidth="2" opacity={opacity} />
            <line x1="50" y1="30" x2="50" y2="70" stroke={strokeColor} strokeWidth="2" opacity={opacity} />
          </svg>
        );
      case "atom":
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            {/* Nucleus */}
            <circle cx="50" cy="50" r="12" fill={strokeColor} opacity={opacity} />
            {/* Electron orbits */}
            <ellipse cx="50" cy="50" rx="35" ry="20" fill="none" stroke={strokeColor} strokeWidth="2" opacity={opacity} />
            <ellipse cx="50" cy="50" rx="20" ry="35" fill="none" stroke={strokeColor} strokeWidth="2" opacity={opacity} />
            <ellipse cx="50" cy="50" rx="35" ry="20" transform="rotate(60 50 50)" fill="none" stroke={strokeColor} strokeWidth="2" opacity={opacity} />
            {/* Electrons */}
            <circle cx="85" cy="50" r="5" fill={strokeColor} opacity={opacity} />
            <circle cx="15" cy="50" r="5" fill={strokeColor} opacity={opacity} />
            <circle cx="50" cy="15" r="5" fill={strokeColor} opacity={opacity} />
            <circle cx="50" cy="85" r="5" fill={strokeColor} opacity={opacity} />
          </svg>
        );
      case "molecule":
        return (
          <svg width={size} height={size} viewBox="0 0 100 100">
            {/* Water molecule H2O */}
            <circle cx="50" cy="50" r="10" fill={strokeColor} opacity={opacity} />
            <circle cx="30" cy="40" r="6" fill={strokeColor} opacity={opacity} />
            <circle cx="70" cy="40" r="6" fill={strokeColor} opacity={opacity} />
            <line x1="50" y1="50" x2="30" y2="40" stroke={strokeColor} strokeWidth="2.5" opacity={opacity} />
            <line x1="50" y1="50" x2="70" y2="40" stroke={strokeColor} strokeWidth="2.5" opacity={opacity} />
          </svg>
        );
    }
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.4, 0.7, 0.4],
        rotate: [0, 360],
      }}
      transition={{
        opacity: {
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay,
        },
        rotate: {
          duration: (15 + Math.random() * 10) / movementMultiplier,
          repeat: Infinity,
          delay,
          ease: "linear",
        },
      }}
    >
      <motion.div
        animate={{
          x: [0, (Math.random() - 0.5) * 200 * movementMultiplier, 0],
          y: [0, (Math.random() - 0.5) * 200 * movementMultiplier, 0],
        }}
        transition={{
          duration: (8 + Math.random() * 7) / movementMultiplier,
          repeat: Infinity,
          delay,
          ease: "easeInOut",
        }}
      >
        {getStructure()}
      </motion.div>
    </motion.div>
  );
};

export default function ChemistryBackground() {
  const [molecules, setMolecules] = useState<Array<{
    x: number;
    y: number;
    delay: number;
    size: number;
    structure: "benzene" | "atom" | "molecule";
  }>>([]);
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number; time: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create more molecules (25-30) for better coverage
    const newMolecules = [];
    const structures: ("benzene" | "atom" | "molecule")[] = ["benzene", "atom", "molecule"];
    
    // Use viewport dimensions for better distribution
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 1080;
    
    for (let i = 0; i < 28; i++) {
      newMolecules.push({
        x: (Math.random() * viewportWidth) - 100, // Account for molecule size
        y: (Math.random() * viewportHeight) - 100,
        delay: Math.random() * 5,
        size: 50 + Math.random() * 80,
        structure: structures[Math.floor(Math.random() * structures.length)],
      });
    }
    setMolecules(newMolecules);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Check if click is on an interactive element (links, buttons, etc.)
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        return;
      }
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setClickPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          time: Date.now(),
        });
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden z-0"
      style={{ pointerEvents: "none" }}
    >
      {molecules.map((molecule, index) => (
        <Molecule 
          key={index} 
          {...molecule}
          clickX={clickPosition?.x}
          clickY={clickPosition?.y}
          clickTime={clickPosition?.time}
        />
      ))}
    </div>
  );
}

