import React, { useRef, useEffect } from 'react';
import { EstadoMatraz, Particle, Flash } from './hooks/useSimuladorMatraz';

interface MatrazDisplayProps {
  state: EstadoMatraz;
  particles: Particle[];
  flashes: Flash[];
}

const MatrazDisplay: React.FC<MatrazDisplayProps> = ({ state, particles, flashes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flask = { x: 420, y: 350, width: 260, height: 220, neckH: 70 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, W, H);

    // Fondo espacial
const bg = ctx.createLinearGradient(0, 0, 0, H);
bg.addColorStop(0, '#1a1f35');
bg.addColorStop(1, '#2d3748');
ctx.fillStyle = bg;
ctx.fillRect(0, 0, W, H);

// Estrellas titilantes
ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
for (let i = 0; i < 50; i++) {
  const x = Math.random() * W;
  const y = Math.random() * (H - 100);
  const size = Math.random() * 2 + 1;
  const alpha = 0.5 + Math.random() * 0.5;
  ctx.globalAlpha = alpha * Math.abs(Math.sin(state.time * 2 + i));
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}
ctx.globalAlpha = 1;

// Planetas
ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
ctx.beginPath();
ctx.arc(100, 100, 40, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = 'rgba(252, 165, 165, 0.3)';
ctx.beginPath();
ctx.arc(600, 200, 30, 0, Math.PI * 2);
ctx.fill();

// Mesa futurista
const tableGradient = ctx.createLinearGradient(0, H - 40, 0, H);
tableGradient.addColorStop(0, '#2d3748');
tableGradient.addColorStop(1, '#4a5568');
ctx.fillStyle = tableGradient;
ctx.fillRect(0, H - 40, W, 40);

// Líneas de luz en la mesa
ctx.strokeStyle = 'rgba(96, 165, 250, 0.5)';
ctx.lineWidth = 2;
for (let i = 0; i < W; i += 50) {
  ctx.beginPath();
  ctx.moveTo(i, H - 40);
  ctx.lineTo(i, H);
  ctx.stroke();
}

    // Mesa
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, H - 40, W, 40);

    // Dibujar matraz
    drawFlask(ctx, state, flask, W, H);

    // Dibujar humo si hay reacción
    if (state.reactionStage === 'smoke' || state.reactionStage === 'ignition') {
      drawSmoke(ctx, state, flask);
    }

    // Dibujar llama durante la ignición
    if (state.reactionStage === 'ignition') {
      drawFlame(ctx, state, flask);
    }

    // Dibujar partículas
    particles.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.02, p.life / 100);
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Dibujar flashes
    flashes.forEach(f => {
      const alpha = f.life / f.max;
      const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size);
      grd.addColorStop(0, `rgba(255,250,200,${0.6 * alpha})`);
      grd.addColorStop(1, `rgba(255, 200, 0, ${0 * alpha})`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * (1 - alpha * 0.1), 0, Math.PI * 2);
      ctx.fill();
    });

    // Dibujar HUD
    drawHUD(ctx, state);

  }, [state, particles, flashes]);

  const drawFlask = (ctx: CanvasRenderingContext2D, state: EstadoMatraz, flask: any, W: number, H: number) => {
    ctx.save();
    ctx.translate(flask.x, flask.y);

    // Cuello
    ctx.fillStyle = '#0b1220';
    ctx.beginPath();
    ctx.rect(-30, -flask.height - flask.neckH, 60, flask.neckH);
    ctx.fill();

    // Cuerpo
    ctx.beginPath();
    ctx.moveTo(-flask.width / 2 + 40, -flask.height - flask.neckH + 40);
    ctx.quadraticCurveTo(-flask.width / 2, -flask.height / 2, -flask.width / 2 + 40, 40);
    ctx.lineTo(flask.width / 2 - 40, 40);
    ctx.quadraticCurveTo(flask.width / 2, -flask.height / 2, flask.width / 2 - 40, -flask.height - flask.neckH + 40);
    ctx.closePath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#9fb0d6';
    ctx.stroke();

    // Líquido (o residuo si la reacción está completa)
    const liquidHeight = (state.level / 100) * (flask.height - 40);
    const topY = 40 - liquidHeight;
    
    let fillStyle;
    if (state.reactionStage === 'complete') {
      // Residuo marrón esponjoso
      const gradient = ctx.createLinearGradient(-flask.width / 2, topY, flask.width / 2, 40);
      gradient.addColorStop(0, `rgba(101, 67, 33, 0.9)`);
      gradient.addColorStop(1, `rgba(80, 50, 20, 0.8)`);
      fillStyle = gradient;
    } else {
      // Mezcla normal de reactivos
      const gradient = ctx.createLinearGradient(-flask.width / 2, topY, flask.width / 2, 40);
      const r = Math.round(state.color.r), g = Math.round(state.color.g), b = Math.round(state.color.b);
      gradient.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
      gradient.addColorStop(1, `rgba(${Math.min(255,r+20)},${Math.min(255,g+10)},${Math.min(255,b+10)},0.8)`);
      fillStyle = gradient;
    }

    ctx.beginPath();
    ctx.moveTo(-flask.width / 2 + 42, 40);
    ctx.lineTo(-flask.width / 2 + 42, topY);
    
    // Superficie ondulada
    const waveAmp = Math.min(8, state.bubbles * 0.05 + state.agitate * 2);
    const segments = 20;
    for (let i = 0; i <= segments; i++) {
      const x = -flask.width / 2 + 42 + (i * (flask.width - 84) / segments);
      const y = topY + Math.sin((i + state.time * 2) * 0.6) * waveAmp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(flask.width / 2 - 42, 40);
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();

    if (state.reactionStage !== 'complete') {
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath();
      ctx.ellipse(-flask.width / 4, -20, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Burbujas (solo si no es residuo y hay efervescencia)
    if (state.reactionStage !== 'complete' && state.bubbles > 0) {
      drawBubbles(ctx, state, flask, liquidHeight, topY);
    }

    ctx.restore();
  };

  const drawBubbles = (ctx: CanvasRenderingContext2D, state: EstadoMatraz, flask: any, liquidHeight: number, topY: number) => {
    ctx.save();
    ctx.translate(flask.x, flask.y);
    
    const bubbleCount = Math.min(200, Math.round(state.bubbles / 5));
    for (let i = 0; i < bubbleCount; i++) {
      const px = (Math.random() * (flask.width - 100)) - (flask.width - 100) / 2;
      const py = topY - Math.random() * 80 - (i % 5) * 6 - (state.time * 20 % 50);
      const size = Math.random() * 6 + 1;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  const drawSmoke = (ctx: CanvasRenderingContext2D, state: EstadoMatraz, flask: any) => {
    ctx.save();
    ctx.translate(flask.x, flask.y - flask.height / 2);
    
    const smokeCount = Math.round(40 * state.smokeIntensity);
    
    for (let i = 0; i < smokeCount; i++) {
      const alpha = 0.4 * state.smokeIntensity;
      const size = 8 + Math.random() * 20;
      const x = (Math.random() - 0.5) * 100;
      const y = -Math.random() * 120 - (state.time * 8 % 80);
      
      // Humo gris con variaciones
      const grayValue = 80 + Math.random() * 40;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${alpha})`;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  const drawFlame = (ctx: CanvasRenderingContext2D, state: EstadoMatraz, flask: any) => {
    ctx.save();
    ctx.translate(flask.x, flask.y - flask.height / 2);
    
    const flameHeight = 80 * state.flameIntensity;
    const flameWidth = 50 * state.flameIntensity;
    
    // Llama de color lila característica del manganeso
    const gradient = ctx.createRadialGradient(0, -flameHeight/3, 0, 0, -flameHeight/3, flameHeight);
    gradient.addColorStop(0, `rgba(200, 100, 255, ${0.9 * state.flameIntensity})`);
    gradient.addColorStop(0.3, `rgba(150, 50, 200, ${0.7 * state.flameIntensity})`);
    gradient.addColorStop(0.7, `rgba(100, 0, 150, ${0.5 * state.flameIntensity})`);
    gradient.addColorStop(1, `rgba(50, 0, 80, ${0.2 * state.flameIntensity})`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(-flameWidth / 2, 0);
    ctx.quadraticCurveTo(-flameWidth / 4, -flameHeight / 2, 0, -flameHeight);
    ctx.quadraticCurveTo(flameWidth / 4, -flameHeight / 2, flameWidth / 2, 0);
    ctx.closePath();
    ctx.fill();
    
    // Nucleo de la llama más brillante
    const coreGradient = ctx.createRadialGradient(0, -flameHeight/4, 0, 0, -flameHeight/4, flameHeight/3);
    coreGradient.addColorStop(0, `rgba(255, 200, 255, ${0.8 * state.flameIntensity})`);
    coreGradient.addColorStop(1, `rgba(200, 100, 255, ${0 * state.flameIntensity})`);
    
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.ellipse(0, -flameHeight/4, flameWidth/4, flameHeight/3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawHUD = (ctx: CanvasRenderingContext2D, state: EstadoMatraz) => {
    // Panel de estado
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(14, 14, 250, 120);
    ctx.fillStyle = '#cfe6ff';
    ctx.font = '14px Inter, Arial';
    ctx.fillText('Estado del matraz', 22, 34);
    ctx.fillStyle = '#9fb0d6';
    ctx.font = '13px Inter, Arial';
    ctx.fillText(`Nivel: ${state.level.toFixed(0)}%`, 22, 56);
    
    // Estado de la reacción con colores
    let reactionText = '';
    let reactionColor = '#9fb0d6';
    
    if (state.reactionStage === 'inactive') {
      reactionText = 'Inactiva';
      reactionColor = '#9fb0d6';
    } else if (state.reactionStage === 'smoke') {
      reactionText = '🗲 Generando humo...';
      reactionColor = '#ffa500';
    } else if (state.reactionStage === 'ignition') {
      reactionText = '🔥 ¡IGNICIÓN! Llama lila';
      reactionColor = '#ff00ff';
    } else if (state.reactionStage === 'complete') {
      reactionText = '◇ Residuo marrón (K₂CO₃ + Mn₂O₃)';
      reactionColor = '#8B4513';
    }
    
    ctx.fillStyle = reactionColor;
    ctx.fillText(`Reacción: ${reactionText}`, 22, 78);
    
    ctx.fillStyle = '#9fb0d6';
    const hex = `rgb(${Math.round(state.color.r)},${Math.round(state.color.g)},${Math.round(state.color.b)})`;
    ctx.fillText(`Color: ${hex}`, 22, 100);
    ctx.fillText(`Burbujas: ${state.bubbles.toFixed(0)}`, 22, 122);

    // Muestra de color
    ctx.fillStyle = hex;
    ctx.fillRect(210, 88, 36, 20);
  };

  return (
    <canvas 
      ref={canvasRef} 
      width={700} 
      height={480}
      className="matraz-canvas"
    />
  );
};

export default MatrazDisplay;