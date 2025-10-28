import { useState, useRef, useCallback, useEffect } from 'react';

// Tipos actualizados
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
  reactionStage: 'inactive' | 'smoke' | 'ignition' | 'complete';
  smokeIntensity: number;
  flameIntensity: number;
  reactionDelay: number;
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

// Constantes para la reacción Glicerina + Permanganato
const MAX_VOLUME = 100;
const REACTION_RULES = [
  { 
    cond: (s: EstadoMatraz) => s.reagents.A >= 30 && s.reagents.B >= 25 && s.temp >= 35, 
    intensity: 1.0,
    type: 'ignition'
  },
  { 
    cond: (s: EstadoMatraz) => s.reagents.A >= 20 && s.reagents.B >= 15, 
    intensity: 0.6,
    type: 'smoke'
  },
];

const REAGENT_COLORS = {
  A: { r: 220, g: 220, b: 220 }, // Glicerina - incoloro/ligeramente blanco
  B: { r: 75, g: 0, b: 130 },    // Permanganato - púrpura intenso
  C: { r: 253, g: 230, b: 138 }  // Reactivo adicional - amarillo
};

const REACTION_PRODUCT_COLOR = { r: 101, g: 67, b: 33 }; // Marrón oscuro del residuo

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
    explosionCooldown: 0,
    reactionStage: 'inactive',
    smokeIntensity: 0,
    flameIntensity: 0,
    reactionDelay: 0
  });

  const [particles, setParticles] = useState<Particle[]>([]);
  const [flashes, setFlashes] = useState<Flash[]>([]);
  
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const streamIntervalRef = useRef<number | null>(null);
  const reactionTimeoutRef = useRef<number | null>(null);

  const addReagent = useCallback((r: 'A' | 'B' | 'C', amount?: number) => {
    setState(prev => {
      const actualAmount = amount ?? prev.amount;
      if (prev.totalVolume >= MAX_VOLUME) return prev;

      const actual = Math.min(actualAmount, MAX_VOLUME - prev.totalVolume);
      const newTotalVolume = prev.totalVolume + actual;
      const newLevel = (newTotalVolume / MAX_VOLUME) * 100;

      const col = REAGENT_COLORS[r];
      
      // Mezcla de colores realista para Glicerina + Permanganato
      let newColor;
      const totalReagents = prev.reagents.A + prev.reagents.B + actual;
      
      if (totalReagents > 0) {
        if (r === 'A' && prev.reagents.B > 0) {
          // Glicerina añadida a Permanganato - se oscurece
          const kmno4Ratio = prev.reagents.B / totalReagents;
          const glycerinRatio = (prev.reagents.A + actual) / totalReagents;
          
          newColor = {
            r: Math.round(75 * kmno4Ratio + 220 * glycerinRatio),
            g: Math.round(0 * kmno4Ratio + 220 * glycerinRatio),
            b: Math.round(130 * kmno4Ratio + 220 * glycerinRatio)
          };
        } else if (r === 'B' && prev.reagents.A > 0) {
          // Permanganato añadido a Glicerina - se vuelve púrpura
          const kmno4Ratio = (prev.reagents.B + actual) / totalReagents;
          const glycerinRatio = prev.reagents.A / totalReagents;
          
          newColor = {
            r: Math.round(75 * kmno4Ratio + 220 * glycerinRatio),
            g: Math.round(0 * kmno4Ratio + 220 * glycerinRatio),
            b: Math.round(130 * kmno4Ratio + 220 * glycerinRatio)
          };
        } else if (r === 'C') {
          // Reactivo C - mezcla normal
          newColor = {
            r: (prev.color.r * prev.totalVolume + col.r * actual) / Math.max(newTotalVolume, 1),
            g: (prev.color.g * prev.totalVolume + col.g * actual) / Math.max(newTotalVolume, 1),
            b: (prev.color.b * prev.totalVolume + col.b * actual) / Math.max(newTotalVolume, 1)
          };
        } else {
          // Mezcla normal
          newColor = {
            r: (prev.color.r * prev.totalVolume + col.r * actual) / Math.max(newTotalVolume, 1),
            g: (prev.color.g * prev.totalVolume + col.g * actual) / Math.max(newTotalVolume, 1),
            b: (prev.color.b * prev.totalVolume + col.b * actual) / Math.max(newTotalVolume, 1)
          };
        }
      } else {
        newColor = col;
      }

      const newReagents = { ...prev.reagents };
      newReagents[r] += actual;

      // Iniciar reacción después de un retraso si hay suficientes reactivos
      if (newReagents.A >= 20 && newReagents.B >= 15 && prev.reactionStage === 'inactive') {
        // Limpiar timeout anterior si existe
        if (reactionTimeoutRef.current) {
          clearTimeout(reactionTimeoutRef.current);
        }
        
        // Retraso de 2-5 segundos antes de la reacción
        const delay = 2000 + Math.random() * 3000; // 2-5 segundos
        reactionTimeoutRef.current = window.setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            reactionStage: 'smoke',
            smokeIntensity: 0.1,
            reactionDelay: delay
          }));
        }, delay);
      }

      return {
        ...prev,
        totalVolume: newTotalVolume,
        level: newLevel,
        color: newColor,
        reagents: newReagents,
        bubbles: prev.bubbles
      };
    });
  }, []);

  const evaluateReactions = useCallback((dt: number) => {
    setState(prev => {
      let newReactionStage = prev.reactionStage;
      let newSmokeIntensity = prev.smokeIntensity;
      let newFlameIntensity = prev.flameIntensity;
      let newBubbles = prev.bubbles;

      // Progresión de la reacción
      if (prev.reactionStage === 'smoke') {
        newSmokeIntensity = Math.min(1.0, prev.smokeIntensity + 0.008 * dt);
        
        // Transición a ignición después de acumular humo
        if (prev.smokeIntensity > 0.4 && prev.reagents.A >= 25 && prev.reagents.B >= 20) {
          newReactionStage = 'ignition';
          newFlameIntensity = 0.1;
          createLilaFlame(); // Llama característica lila
        }
      }

      if (prev.reactionStage === 'ignition') {
        newFlameIntensity = Math.min(1.0, prev.flameIntensity + 0.015 * dt);
        newBubbles += Math.round(30 * dt); // Efervescencia por el calor
        
        // La reacción se completa, produciendo el residuo marrón
        if (prev.flameIntensity > 0.7) {
          setTimeout(() => {
            setState(prevState => ({
              ...prevState,
              reactionStage: 'complete',
              color: REACTION_PRODUCT_COLOR,
              bubbles: 0,
              reagents: { A: 0, B: 0, C: prevState.reagents.C } // Solo consumir A y B
            }));
          }, 1500);
        }
      }

      // Reacción completa - residuo marrón
      if (prev.reactionStage === 'complete') {
        newBubbles = 0;
      }

      return {
        ...prev,
        reactionStage: newReactionStage,
        smokeIntensity: newSmokeIntensity,
        flameIntensity: newFlameIntensity,
        bubbles: newBubbles,
        explosionCooldown: prev.explosionCooldown > 0 ? prev.explosionCooldown - dt : 0
      };
    });
  }, []);

  const createLilaFlame = useCallback(() => {
    const count = 25;
    const newParticles: Particle[] = [];
    
    const lilaColors = [
      'rgba(200, 100, 255, 1)',    // Lila claro
      'rgba(150, 50, 200, 1)',     // Lila medio
      'rgba(100, 0, 150, 1)',      // Lila oscuro
      'rgba(255, 150, 255, 1)'     // Rosa lila
    ];

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() - 0.5) * Math.PI; // Dirección principalmente hacia arriba
      const speed = 1 + Math.random() * 3;
      newParticles.push({
        x: 350 + (Math.random() - 0.5) * 40,
        y: 210,
        vx: Math.cos(angle) * speed * 0.3,
        vy: Math.sin(angle) * speed - 1,
        life: 40 + Math.random() * 30,
        size: 2 + Math.random() * 4,
        color: lilaColors[Math.floor(Math.random() * lilaColors.length)]
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
    
    // Flash de ignición
    setFlashes(prev => [...prev, { 
      x: 350, 
      y: 210, 
      life: 20, 
      max: 20, 
      size: 120 
    }]);
  }, []);

  const triggerExplosion = useCallback((power: number = 1.0) => {
    const count = Math.round(30 * power);
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

    setParticles(prev => [...prev, ...newParticles]);
    setFlashes(prev => [...prev, { x: 350, y: 210, life: 30, max: 30, size: 240 }]);

    setState(prev => ({
      ...prev,
      exploded: true,
      explosionCooldown: 220,
      totalVolume: prev.totalVolume * 0.15,
      level: (prev.totalVolume * 0.15 / MAX_VOLUME) * 100,
      reagents: { A: 0, B: 0, C: prev.reagents.C },
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
          vy: p.vy + 0.08, // Gravedad más suave para humo y llama
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1,
          size: p.size * 0.99
        }))
        .filter(p => p.life > 0 && p.size >= 0.2)
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
    // Limpiar timeouts
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current);
      reactionTimeoutRef.current = null;
    }
    
    setState({
      level: 0,
      color: { r: 0, g: 0, b: 0 },
      totalVolume: 0,
      reagents: { A: 0, B: 0, C: 0 },
      bubbles: 0,
      pouring: null,
      mode: 'drop',
      amount: state.amount,
      temp: 20,
      agitate: 0,
      time: 0,
      exploded: false,
      explosionCooldown: 0,
      reactionStage: 'inactive',
      smokeIntensity: 0,
      flameIntensity: 0,
      reactionDelay: 0
    });
    setParticles([]);
    setFlashes([]);
    
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
  }, [state.amount]);

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
      if (reactionTimeoutRef.current) {
        clearTimeout(reactionTimeoutRef.current);
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