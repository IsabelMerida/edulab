import { useState, useRef, useCallback, useEffect } from 'react';

// Tipos
export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface Reagents {
  A: number;
  B: number;
  C: number;
}

export interface EstadoMatraz {
  level: number;
  color: ColorRGB;
  totalVolume: number;
  reagents: Reagents;
  bubbles: number;
  pouring: string | null;
  mode: 'drop' | 'stream';
  amount: number;
  temp: number;
  agitate: number;
  time: number;
  exploded: boolean;
  explosionCooldown: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
}

export interface Flash {
  x: number;
  y: number;
  life: number;
  max: number;
  size: number;
}

// Constantes
const MAX_VOLUME = 100;
const REACTION_RULES = [
  { cond: (s: EstadoMatraz) => s.reagents.A >= 20 && s.reagents.B >= 20 && s.temp >= 60, intensity: 1.0 },
  { cond: (s: EstadoMatraz) => s.reagents.B >= 30 && s.reagents.C >= 15 && s.temp >= 40, intensity: 0.7 },
  { cond: (s: EstadoMatraz) => s.reagents.A >= 40, intensity: 0.4 },
];

const REAGENT_COLORS = {
  A: { r: 96, g: 165, b: 250 },
  B: { r: 252, g: 165, b: 165 },
  C: { r: 253, g: 230, b: 138 }
};

export const useSimuladorMatraz = () => {
  const [state, setState] = useState<EstadoMatraz>({
    level: 0,
    color: { r: 0, g: 0, b: 0 },
    totalVolume: 0,
    reagents: { A: 0, B: 0, C: 0 },
    bubbles: 0,
    pouring: null,
    mode: 'drop',
    amount: 5,
    temp: 20,
    agitate: 0,
    time: 0,
    exploded: false,
    explosionCooldown: 0
  });

  const [particles, setParticles] = useState<Particle[]>([]);
  const [flashes, setFlashes] = useState<Flash[]>([]);
  
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const streamIntervalRef = useRef<number | null>(null);

  const addReagent = useCallback((r: 'A' | 'B' | 'C', amount?: number) => {
    setState(prev => {
      const actualAmount = amount ?? prev.amount;
      if (prev.totalVolume >= MAX_VOLUME) return prev;

      const actual = Math.min(actualAmount, MAX_VOLUME - prev.totalVolume);
      const newTotalVolume = prev.totalVolume + actual;
      const newLevel = (newTotalVolume / MAX_VOLUME) * 100;

      const col = REAGENT_COLORS[r];
      const newColor = {
        r: (prev.color.r * prev.totalVolume + col.r * actual) / Math.max(newTotalVolume, 1),
        g: (prev.color.g * prev.totalVolume + col.g * actual) / Math.max(newTotalVolume, 1),
        b: (prev.color.b * prev.totalVolume + col.b * actual) / Math.max(newTotalVolume, 1)
      };

      const newReagents = { ...prev.reagents };
      newReagents[r] += actual;

      const bubbleIncrement = Math.round(actual * (r === 'A' ? 0.25 : r === 'B' ? 0.15 : 0.05));

      return {
        ...prev,
        totalVolume: newTotalVolume,
        level: newLevel,
        color: newColor,
        reagents: newReagents,
        bubbles: prev.bubbles + bubbleIncrement
      };
    });
  }, []);

  const evaluateReactions = useCallback((dt: number) => {
    setState(prev => {
      const extraBubbles = Math.floor((prev.agitate * 0.5 + Math.max(0, prev.temp - 20) * 0.05) * dt);
      let newBubbles = Math.max(0, prev.bubbles - Math.round(0.2 * dt) + extraBubbles);

      for (const rule of REACTION_RULES) {
        if (rule.cond(prev)) {
          const intensity = rule.intensity * (1 + (prev.agitate * 0.2)) * (1 + (prev.temp / 200));
          newBubbles += Math.round(80 * intensity * dt);
          
          if (intensity > 1.0 && prev.explosionCooldown <= 0) {
            setTimeout(() => triggerExplosion(intensity), 0);
          }
          break;
        }
      }

      return {
        ...prev,
        bubbles: newBubbles,
        explosionCooldown: prev.explosionCooldown > 0 ? prev.explosionCooldown - dt : 0
      };
    });
  }, []);

  const triggerExplosion = useCallback((power: number = 1.0) => {
    const count = Math.round(40 * power);
    const newParticles: Particle[] = [];
    
    const brightColors = [
      'rgba(255,99,71,1)', 'rgba(255,165,0,1)', 'rgba(255,215,0,1)',
      'rgba(255,99,132,1)', 'rgba(255,150,200,1)', 'rgba(240,128,128,1)'
    ];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6 * power;
      newParticles.push({
        x: 350,
        y: 210,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * 0.7 - 2,
        life: 60 + Math.random() * 40,
        size: 3 + Math.random() * 6,
        color: brightColors[Math.floor(Math.random() * brightColors.length)]
      });
    }

    setParticles(newParticles);
    setFlashes(prev => [...prev, { x: 350, y: 210, life: 30, max: 30, size: 240 }]);

    setState(prev => ({
      ...prev,
      exploded: true,
      explosionCooldown: 220,
      totalVolume: prev.totalVolume * 0.15,
      level: (prev.totalVolume * 0.15 / MAX_VOLUME) * 100,
      reagents: { A: 0, B: 0, C: 0 },
      bubbles: 0
    }));
  }, []);

  const createFlash = useCallback((large: boolean = false) => {
    setFlashes(prev => [...prev, { 
      x: 350, y: 210, life: large ? 30 : 12, max: large ? 30 : 12, size: large ? 240 : 120 
    }]);
  }, []);

  const updateParticles = useCallback(() => {
    setParticles(prev => 
      prev
        .map(p => ({
          ...p,
          vy: p.vy + 0.12,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1,
          size: p.size * 0.98
        }))
        .filter(p => p.life > 0 && p.size >= 0.3)
    );

    setFlashes(prev => prev.filter(f => f.life > 0).map(f => ({ ...f, life: f.life - 1 })));
  }, []);

  const loop = useCallback((now: number) => {
    const dt = Math.min(60, (now - lastTimeRef.current) / 16.666);
    lastTimeRef.current = now;

    setState(prev => ({ ...prev, time: prev.time + 0.016 * dt }));
    evaluateReactions(dt);
    updateParticles();
    animationRef.current = requestAnimationFrame(loop);
  }, [evaluateReactions, updateParticles]);

  const startPour = useCallback((r: 'A' | 'B' | 'C') => {
    setState(prev => ({ ...prev, pouring: r }));
    
    if (state.mode === 'stream') {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
      
      streamIntervalRef.current = window.setInterval(() => {
        setState(prev => {
          if (!prev.pouring) {
            if (streamIntervalRef.current) {
              clearInterval(streamIntervalRef.current);
              streamIntervalRef.current = null;
            }
            return prev;
          }
          return prev;
        });
        addReagent(r, state.amount);
      }, 150);
    }
  }, [state.mode, state.amount, addReagent]);

  const stopPour = useCallback(() => {
    setState(prev => ({ ...prev, pouring: null }));
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
  }, []);

  const setMode = useCallback((mode: 'drop' | 'stream') => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const setAmount = useCallback((amount: number) => {
    setState(prev => ({ ...prev, amount }));
  }, []);

  const setTemp = useCallback((temp: number) => {
    setState(prev => ({ ...prev, temp }));
  }, []);

  const setAgitate = useCallback((agitate: number) => {
    setState(prev => ({ ...prev, agitate }));
  }, []);

  const resetAll = useCallback(() => {
    setState(prev => ({
      level: 0,
      color: { r: 0, g: 0, b: 0 },
      totalVolume: 0,
      reagents: { A: 0, B: 0, C: 0 },
      bubbles: 0,
      pouring: null,
      mode: 'drop',
      amount: prev.amount,
      temp: 20,
      agitate: 0,
      time: 0,
      exploded: false,
      explosionCooldown: 0
    }));
    setParticles([]);
    setFlashes([]);
    
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(loop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, [loop]);

  return {
    state,
    particles,
    flashes,
    addReagent,
    startPour,
    stopPour,
    setMode,
    setAmount,
    setTemp,
    setAgitate,
    resetAll,
    triggerExplosion,
    createFlash
  };
};