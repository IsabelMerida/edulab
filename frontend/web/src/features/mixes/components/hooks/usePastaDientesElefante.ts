import { useState, useRef, useCallback, useEffect } from 'react';

// Tipos (puedes reutilizar los mismos o crear nuevos)
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

export interface EstadoPastaDientes {
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
  reactionStage: 'inactive' | 'foaming' | 'complete';
  foamHeight: number;
  foamIntensity: number;
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

const MAX_VOLUME = 100;
const REAGENT_COLORS = {
  A: { r: 240, g: 240, b: 255 }, // Peróxido de hidrógeno - casi transparente
  B: { r: 255, g: 255, b: 200 }, // Jabón + catalizador - amarillo muy claro
  C: { r: 200, g: 230, b: 255 }  // Colorante opcional - azul claro
};

export const usePastaDientesElefante = () => {
  const [state, setState] = useState<EstadoPastaDientes>({
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
    reactionStage: 'inactive',
    foamHeight: 0,
    foamIntensity: 0
  });

  const [particles, setParticles] = useState<Particle[]>([]);
  const [foamBubbles, setFoamBubbles] = useState<Particle[]>([]);
  
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

      // Iniciar reacción cuando hay suficiente peróxido y jabón
      if (newReagents.A >= 25 && newReagents.B >= 15 && prev.reactionStage === 'inactive') {
        setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            reactionStage: 'foaming',
            foamHeight: 10,
            foamIntensity: 0.1
          }));
        }, 1000);
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
      let newFoamHeight = prev.foamHeight;
      let newFoamIntensity = prev.foamIntensity;
      let newBubbles = prev.bubbles;

      // Progresión de la reacción de espuma
      if (prev.reactionStage === 'foaming') {
        newFoamHeight = Math.min(300, prev.foamHeight + 8 * dt);
        newFoamIntensity = Math.min(1.0, prev.foamIntensity + 0.02 * dt);
        newBubbles += Math.round(50 * dt);
        
        // Crear burbujas de espuma continuamente
        createFoamBubbles();

        // La reacción se completa cuando la espuma alcanza su máximo
        if (prev.foamHeight >= 280) {
          newReactionStage = 'complete';
        }
      }

      // Reacción completa - la espuma se mantiene
      if (prev.reactionStage === 'complete') {
        newBubbles = Math.max(0, prev.bubbles - 1);
      }

      return {
        ...prev,
        reactionStage: newReactionStage,
        foamHeight: newFoamHeight,
        foamIntensity: newFoamIntensity,
        bubbles: newBubbles
      };
    });
  }, []);

  const createFoamBubbles = useCallback(() => {
    const newBubbles: Particle[] = [];
    const bubbleCount = Math.round(10 * state.foamIntensity);
    
    for (let i = 0; i < bubbleCount; i++) {
      newBubbles.push({
        x: 300 + (Math.random() - 0.5) * 100,
        y: 200 - Math.random() * state.foamHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.2,
        life: 30 + Math.random() * 40,
        size: 3 + Math.random() * 8,
        color: `rgba(255, 255, 255, ${0.7 + Math.random() * 0.3})`
      });
    }

    setFoamBubbles(prev => [...prev, ...newBubbles].slice(-200)); // Limitar a 200 burbujas
  }, [state.foamIntensity, state.foamHeight]);

  const updateParticles = useCallback(() => {
    setFoamBubbles(prev => 
      prev
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 1,
          size: p.size * 0.99
        }))
        .filter(p => p.life > 0 && p.size >= 0.5)
    );
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
      reactionStage: 'inactive',
      foamHeight: 0,
      foamIntensity: 0
    });
    setParticles([]);
    setFoamBubbles([]);
    
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
    };
  }, [loop]);

  return {
    state,
    particles: foamBubbles,
    foamBubbles,
    addReagent,
    startPour,
    stopPour,
    setMode,
    setAmount,
    setTemp,
    setAgitate,
    resetAll
  };
};