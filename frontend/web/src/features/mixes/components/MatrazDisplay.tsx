import React, { useRef, useEffect } from 'react';
import { EstadoMatraz, Particle, Flash } from '../types';

interface MatrazDisplayProps {
  state: EstadoMatraz;
  particles: Particle[];
  flashes: Flash[];
}

const MatrazDisplay: React.FC<MatrazDisplayProps> = ({ state, particles, flashes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flask = { x: 350, y: 320, width: 260, height: 220, neckH: 70 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, W, H);

    // Fondo
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#041022');
    bg.addColorStop(1, '#071021');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Mesa
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, H - 40, W, 40);

    // Dibujar matraz
    drawFlask(ctx, state, flask, W, H);

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

    // Líquido
    const liquidHeight = (state.level / 100) * (flask.height - 40);
    const topY = 40 - liquidHeight;
    const grad = ctx.createLinearGradient(-flask.width / 2, topY, flask.width / 2, 40);
    const r = Math.round(state.color.r), g = Math.round(state.color.g), b = Math.round(state.color.b);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
    grad.addColorStop(1, `rgba(${Math.min(255, r + 20)},${Math.min(255, g + 10)},${Math.min(255, b + 10)},0.8)`);

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
    ctx.fillStyle = grad;
    ctx.fill();

    // Destellos
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.ellipse(-flask.width / 4, -20, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Burbujas
    drawBubbles(ctx, state, flask, liquidHeight, topY);

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

  const drawHUD = (ctx: CanvasRenderingContext2D, state: EstadoMatraz) => {
    // Panel de estado
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(14, 14, 230, 96);
    ctx.fillStyle = '#cfe6ff';
    ctx.font = '14px Inter, Arial';
    ctx.fillText('Estado del matraz', 22, 34);
    ctx.fillStyle = '#9fb0d6';
    ctx.font = '13px Inter, Arial';
    ctx.fillText(`Nivel: ${state.level.toFixed(0)}%`, 22, 56);
    const hex = `rgb(${Math.round(state.color.r)},${Math.round(state.color.g)},${Math.round(state.color.b)})`;
    ctx.fillText(`Color: ${hex}`, 22, 76);
    ctx.fillText(`Burbujas: ${state.bubbles.toFixed(0)}`, 22, 96);

    // Muestra de color
    ctx.fillStyle = hex;
    ctx.fillRect(190, 64, 36, 20);
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