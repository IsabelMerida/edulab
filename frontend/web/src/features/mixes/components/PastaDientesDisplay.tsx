import React, { useRef, useEffect } from 'react';
import { EstadoPastaDientes, Particle } from './hooks/usePastaDientesElefante';

interface PastaDientesDisplayProps {
  state: EstadoPastaDientes;
  foamBubbles: Particle[];
}

const PastaDientesDisplay: React.FC<PastaDientesDisplayProps> = ({ state, foamBubbles }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Ajustar posición del matraz para dejar espacio al HUD
  const flask = { 
    x: 440,  // Movido más a la derecha
    y: 380, 
    width: 320, 
    height: 230, 
    neckH: 70 
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Limpiar canvas
    ctx.clearRect(0, 0, W, H);

    // Fondo azul marino - Muy buen contraste
const bg = ctx.createLinearGradient(0, 0, W, H);
bg.addColorStop(0, '#0f1f3d');
bg.addColorStop(0.3, '#1e3a8a');
bg.addColorStop(0.7, '#3b82f6');
bg.addColorStop(1, '#60a5fa');
ctx.fillStyle = bg;
ctx.fillRect(0, 0, W, H);

// Elementos de laboratorio en tonos plateados
ctx.fillStyle = 'rgba(226, 232, 240, 0.3)';
// Frascos y equipos
ctx.beginPath();
ctx.arc(100, 100, 25, 0, Math.PI * 2);
ctx.fill();

    // Dibujar HUD PRIMERO (para que quede detrás)
    drawHUD(ctx, state);

    // Dibujar elementos de laboratorio en el fondo
    ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
    // Tubos de ensayo
    ctx.beginPath();
    ctx.ellipse(100, 100, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(600, 150, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mesa de laboratorio
    const tableGradient = ctx.createLinearGradient(0, H - 40, 0, H);
    tableGradient.addColorStop(0, '#8B4513');
    tableGradient.addColorStop(0.5, '#A0522D');
    tableGradient.addColorStop(1, '#CD853F');
    ctx.fillStyle = tableGradient;
    ctx.fillRect(0, H - 40, W, 40);

    // Textura de madera en la mesa
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let i = 0; i < W; i += 20) {
      ctx.fillRect(i, H - 40, 2, 40);
    }

    // Dibujar matraz (ahora encima del HUD)
    drawFlask(ctx, state, flask, W, H);

    // Dibujar espuma si hay reacción
    if (state.reactionStage === 'foaming' || state.reactionStage === 'complete') {
      drawFoam(ctx, state, flask);
    }

    // Dibujar burbujas de espuma
    foamBubbles.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.1, p.life / 100);
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

  }, [state, foamBubbles]);

  const drawFlask = (ctx: CanvasRenderingContext2D, state: EstadoPastaDientes, flask: any, W: number, H: number) => {
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
    
    const gradient = ctx.createLinearGradient(-flask.width / 2, topY, flask.width / 2, 40);
    const r = Math.round(state.color.r), g = Math.round(state.color.g), b = Math.round(state.color.b);
    gradient.addColorStop(0, `rgba(${r},${g},${b},0.95)`);
    gradient.addColorStop(1, `rgba(${Math.min(255,r+20)},${Math.min(255,g+10)},${Math.min(255,b+10)},0.8)`);

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
    ctx.fillStyle = gradient;
    ctx.fill();

    // Destellos
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.ellipse(-flask.width / 4, -20, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const drawFoam = (ctx: CanvasRenderingContext2D, state: EstadoPastaDientes, flask: any) => {
    ctx.save();
    ctx.translate(flask.x, flask.y);
    
    const foamHeight = state.foamHeight;
    
    // Espuma principal
    const foamGradient = ctx.createLinearGradient(0, -flask.height - foamHeight, 0, -flask.height);
    foamGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    foamGradient.addColorStop(0.5, 'rgba(245, 245, 255, 0.8)');
    foamGradient.addColorStop(1, 'rgba(235, 235, 245, 0.6)');
    
    ctx.fillStyle = foamGradient;
    ctx.beginPath();
    
    // Forma de pasta de dientes que sale del matraz
    const baseWidth = flask.width / 2.5;
    const topWidth = baseWidth * 0.7;
    
    ctx.moveTo(-baseWidth, -flask.height);
    ctx.lineTo(-topWidth, -flask.height - foamHeight);
    ctx.lineTo(topWidth, -flask.height - foamHeight);
    ctx.lineTo(baseWidth, -flask.height);
    ctx.closePath();
    ctx.fill();

    // Textura de espuma con burbujas grandes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < 15; i++) {
      const x = (Math.random() - 0.5) * baseWidth * 1.5;
      const y = -flask.height - Math.random() * foamHeight;
      const size = 5 + Math.random() * 12;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  const drawHUD = (ctx: CanvasRenderingContext2D, state: EstadoPastaDientes) => {
    // Panel de estado - más compacto y en mejor posición
    const hudWidth = 250;
    const hudHeight = 130;
    const hudX = 20;
    const hudY = 20;
    
    // Fondo del HUD con bordes redondeados
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.strokeStyle = 'rgba(200, 200, 255, 0.6)';
    ctx.lineWidth = 2;
    
    // Dibujar rectángulo con bordes redondeados
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudWidth, hudHeight, 10);
    ctx.fill();
    ctx.stroke();

    // Contenido del HUD
    ctx.fillStyle = '#2d3748';
    ctx.font = 'bold 14px Comic Neue, Arial';
    ctx.fillText('🧪 Pasta de Dientes de Elefante', hudX + 10, hudY + 20);
    
    ctx.fillStyle = '#4a5568';
    ctx.font = '12px Comic Neue, Arial';
    ctx.fillText(`Nivel líquido: ${state.level.toFixed(0)}%`, hudX + 10, hudY + 40);
    
    // Estado de la reacción con colores
    let reactionText = '';
    let reactionColor = '#4a5568';
    let reactionEmoji = '⚗️';
    
    if (state.reactionStage === 'inactive') {
      reactionText = 'Listo para experimentar!';
      reactionColor = '#4a5568';
      reactionEmoji = '⚗️';
    } else if (state.reactionStage === 'foaming') {
      reactionText = '🎉 ¡ESPUMA GIGANTE!';
      reactionColor = '#ff6b6b';
      reactionEmoji = '🐘';
    } else if (state.reactionStage === 'complete') {
      reactionText = '✨ Pasta de dientes completa';
      reactionColor = '#4d96ff';
      reactionEmoji = '✅';
    }
    
    ctx.fillStyle = reactionColor;
    ctx.font = 'bold 12px Comic Neue, Arial';
    ctx.fillText(`${reactionEmoji} ${reactionText}`, hudX + 10, hudY + 60);
    
    ctx.fillStyle = '#4a5568';
    ctx.font = '12px Comic Neue, Arial';
    const hex = `rgb(${Math.round(state.color.r)},${Math.round(state.color.g)},${Math.round(state.color.b)})`;
    ctx.fillText(`Color: ${hex}`, hudX + 10, hudY + 80);
    ctx.fillText(`Altura espuma: ${state.foamHeight.toFixed(0)}px`, hudX + 10, hudY + 100);
    ctx.fillText(`Intensidad: ${(state.foamIntensity * 100).toFixed(0)}%`, hudX + 10, hudY + 120);

    // Muestra de color más pequeña
    ctx.fillStyle = hex;
    ctx.fillRect(hudX + hudWidth - 40, hudY + 75, 30, 15);
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(hudX + hudWidth - 40, hudY + 75, 30, 15);
  };

  return (
    <canvas 
      ref={canvasRef} 
      width={720} 
      height={480}
      className="matraz-canvas"
      style={{ display: 'block' }}
    />
  );
};



export default PastaDientesDisplay;