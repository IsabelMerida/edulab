
import React, { useEffect, useRef } from 'react';

// --- Logica y constantes de dibujo ---
const flask = { x: 700 / 2, y: 320, width: 220, height: 200 };

// CAMBIO: La gama de colores va de AZUL (0) a ROSA (8)
const GAMA_DE_COLORES_RGB = [
  'rgb(30, 100, 200)',   // 0: Azul Oscuro (Analito inicial)
  'rgb(60, 130, 220)',   // 1: Azul Medio
  'rgb(120, 180, 240)',  // 2: Azul Claro
  'rgb(200, 200, 250)',  // 3: Azul muy pálido / Lavanda
  'rgb(249, 168, 212)',  // 4: Rosa Claro (VIRAJJE IDEAL 4.0mL)
  'rgb(244, 114, 182)',  // 5: Rosa Medio
  'rgb(236, 72, 153)',   // 6: Rosa Fuerte (Pasado)
  'rgb(220, 60, 150)',   // 7: Rosa muy fuerte
  'rgb(190, 24, 93)'     // 8: Rojo/Rosa (Pasado extremo)
];

function getTitrationColor(volume) {
  // Lógica de color (va de azul a rosa)
  if (volume < 3.0) return GAMA_DE_COLORES_RGB[0]; // Azul Oscuro
  if (volume < 4.0) return GAMA_DE_COLORES_RGB[2]; // Azul Claro
  if (volume < 5.0) return GAMA_DE_COLORES_RGB[4]; // Rosa Claro (Viraje ideal)
  if (volume < 6.0) return GAMA_DE_COLORES_RGB[5]; // Rosa Medio
  if (volume < 7.0) return GAMA_DE_COLORES_RGB[6]; // Rosa Fuerte (Pasado)
  if (volume < 8.0) return GAMA_DE_COLORES_RGB[7];
  return GAMA_DE_COLORES_RGB[8]; 
}

function drawFlask(ctx, level, current_volume) {
    if (!ctx) return;
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    
    // Fondo del CANVAS (área de simulación)
    ctx.clearRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#f0f0f0');
    bg.addColorStop(1, '#ffffff');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    
    // Dibuja mesa (gris oscuro)
    ctx.fillStyle = '#475569'; ctx.fillRect(0, H - 40, W, 40);

    // Matraz Contorno
    ctx.save();
    ctx.translate(flask.x, flask.y);
    ctx.beginPath();
    ctx.moveTo(-flask.width / 2 + 40, -flask.height + 40);
    ctx.quadraticCurveTo(-flask.width / 2, -flask.height / 2, -flask.width / 2 + 40, 40);
    ctx.lineTo(flask.width / 2 - 40, 40);
    ctx.quadraticCurveTo(flask.width / 2, -flask.height / 2, flask.width / 2 - 40, -flask.height + 40);
    ctx.closePath();
    ctx.lineWidth = 4; ctx.strokeStyle = '#9fb0d6'; ctx.stroke();

    // Líquido
    const liquidHeight = (level / 100) * (flask.height - 40);
    const topY = 40 - liquidHeight;
    ctx.beginPath();
    ctx.moveTo(-flask.width / 2 + 42, 40); ctx.lineTo(-flask.width / 2 + 42, topY);
    ctx.lineTo(flask.width / 2 - 42, topY); ctx.lineTo(flask.width / 2 - 42, 40);
    ctx.closePath();
    ctx.fillStyle = getTitrationColor(current_volume);
    ctx.fill();

    ctx.restore();
}

export default function CanvasArea({ level, currentVolume }) {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const renderLoop = () => {
        drawFlask(context, level, currentVolume);
        animationFrameId.current = requestAnimationFrame(renderLoop);
    };
    renderLoop();
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [level, currentVolume]);

  const containerStyle = {
    background: '#ffffff', padding: '12px', borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)', 
    color: '#333333', 
    width: '720px', flexShrink: 0
  };
  const canvasStyle = {
    background: '#ffffff', 
    borderRadius: '8px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)', display: 'block',
    maxWidth: '100%'
  };
  const textStyle = { fontSize: '14px', color: '#666' };

  return (
    <div style={containerStyle}>
      <h2 style={{marginTop: 0, color: '#333'}}>Simulador de Titulación</h2>
      <p style={textStyle}>El punto de equivalencia es fijo en 4.0 mL. Usa la bureta para ver el cambio de color.</p>
      <canvas ref={canvasRef} width="700" height="480" style={canvasStyle}></canvas>
    </div>
  );
}