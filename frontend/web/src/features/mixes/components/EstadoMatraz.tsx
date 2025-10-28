import React from 'react';
import { EstadoMatraz as EstadoMatrazType } from './hooks/useSimuladorMatraz';

interface EstadoMatrazProps {
  state: EstadoMatrazType;
}

const EstadoMatraz: React.FC<EstadoMatrazProps> = ({ state }) => {
  const getReactionStatus = () => {
    switch (state.reactionStage) {
      case 'inactive':
        return { text: 'Inactiva', color: '#9fb0d6', icon: '○' };
      case 'smoke':
        return { text: 'Generando humo...', color: '#ffa500', icon: '🗲' };
      case 'ignition':
        return { text: '¡IGNICIÓN! Llama lila', color: '#ff00ff', icon: '🔥' };
      case 'complete':
        return { text: 'Residuo marrón (K₂CO₃ + Mn₂O₃)', color: '#8B4513', icon: '◇' };
      default:
        return { text: 'Inactiva', color: '#9fb0d6', icon: '○' };
    }
  };

  const reactionStatus = getReactionStatus();

  return (
    <div className="card">
      <h4 style={{ margin: '0 0 8px 0' }}>Estado del matraz</h4>
      <div className="small">Nivel: <span>{state.level.toFixed(0)}%</span></div>
      <div className="small">
        Color (mezcla): <span>
          rgb({Math.round(state.color.r)},{Math.round(state.color.g)},{Math.round(state.color.b)})
        </span>
      </div>
      <div className="small">Burbujas: <span>{Math.round(state.bubbles)}</span></div>
      
      <div className="small" style={{ marginTop: '6px', color: reactionStatus.color }}>
        <strong>{reactionStatus.icon} {reactionStatus.text}</strong>
      </div>

      {state.reactionStage === 'smoke' && (
        <div className="small" style={{ color: '#ffa500', marginTop: '4px' }}>
          Intensidad de humo: {(state.smokeIntensity * 100).toFixed(0)}%
        </div>
      )}

      {state.reactionStage === 'ignition' && (
        <div className="small" style={{ color: '#ff00ff', marginTop: '4px' }}>
          Intensidad de llama: {(state.flameIntensity * 100).toFixed(0)}%
        </div>
      )}
      
      {/* Muestra de color */}
      <div style={{ marginTop: '8px' }}>
        <div 
          className="color-swatch"
          style={{
            backgroundColor: `rgb(${Math.round(state.color.r)}, ${Math.round(state.color.g)}, ${Math.round(state.color.b)})`,
            width: '100%',
            height: '20px',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Información de reactivos */}
      <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
        <div className="small"><strong>Reactivos actuales:</strong></div>
        <div className="small">Glicerina: {state.reagents.A.toFixed(1)} units</div>
        <div className="small">KMnO₄: {state.reagents.B.toFixed(1)} units</div>
      </div>
    </div>
  );
};

export default EstadoMatraz;