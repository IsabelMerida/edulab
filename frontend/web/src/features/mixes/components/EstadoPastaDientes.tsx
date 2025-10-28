import React from 'react';
import { EstadoPastaDientes as EstadoPastaDientesType } from './hooks/usePastaDientesElefante';

interface EstadoPastaDientesProps {
  state: EstadoPastaDientesType;
}

const EstadoPastaDientes: React.FC<EstadoPastaDientesProps> = ({ state }) => {
  const getReactionStatus = () => {
    switch (state.reactionStage) {
      case 'inactive':
        return { 
          text: 'Listo para experimentar!', 
          color: '#4a5568', 
          icon: '⚗️',
          description: 'Añade peróxido y jabón para comenzar'
        };
      case 'foaming':
        return { 
          text: '🎉 ¡ESPUMA GIGANTE!', 
          color: '#ff6b6b', 
          icon: '🐘',
          description: 'La pasta de dientes está creciendo...'
        };
      case 'complete':
        return { 
          text: '✨ Experimento completado', 
          color: '#4d96ff', 
          icon: '✅',
          description: '¡Mira esa pasta de dientes de elefante!'
        };
      default:
        return { 
          text: 'Listo', 
          color: '#4a5568', 
          icon: '⚗️',
          description: 'Preparado para experimentar'
        };
    }
  };

  const reactionStatus = getReactionStatus();

  return (
    <div className="card">
      <h4 style={{ margin: '0 0 12px 0', textAlign: 'center' }}>
        🐘 Estado del Experimento
      </h4>
      
      <div className="small" style={{ marginBottom: '8px' }}>
        <strong>Nivel líquido:</strong> <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>{state.level.toFixed(0)}%</span>
      </div>
      
      <div className="small" style={{ marginBottom: '8px' }}>
        <strong>Altura de espuma:</strong> <span style={{ color: '#4d96ff', fontWeight: 'bold' }}>{state.foamHeight.toFixed(0)}px</span>
      </div>
      
      <div className="small" style={{ marginBottom: '12px' }}>
        <strong>Burbujas activas:</strong> <span style={{ color: '#9d4edd', fontWeight: 'bold' }}>{state.bubbles}</span>
      </div>

      {/* Estado de la reacción */}
      <div style={{ 
        marginTop: '10px', 
        padding: '12px',
        background: `linear-gradient(135deg, ${reactionStatus.color}20, ${reactionStatus.color}40)`,
        borderRadius: '12px',
        border: `2px solid ${reactionStatus.color}30`,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>
          {reactionStatus.icon}
        </div>
        <div style={{ 
          color: reactionStatus.color, 
          fontWeight: 'bold',
          fontSize: '14px',
          marginBottom: '4px'
        }}>
          {reactionStatus.text}
        </div>
        <div style={{ 
          color: '#64748b',
          fontSize: '12px'
        }}>
          {reactionStatus.description}
        </div>
      </div>

      {/* Muestra de color */}
      <div style={{ marginTop: '12px' }}>
        <div className="small" style={{ marginBottom: '6px' }}>
          <strong>Color de la mezcla:</strong>
        </div>
        <div 
          className="color-swatch"
          style={{
            backgroundColor: `rgb(${Math.round(state.color.r)}, ${Math.round(state.color.g)}, ${Math.round(state.color.b)})`,
            width: '100%',
            height: '25px',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        />
      </div>

      {/* Información de reactivos */}
      <div style={{ 
        marginTop: '15px', 
        padding: '12px', 
        background: 'linear-gradient(135deg, rgba(255, 215, 61, 0.1), rgba(107, 207, 127, 0.1))',
        borderRadius: '10px',
        border: '1px solid rgba(255, 215, 61, 0.3)'
      }}>
        <div className="small" style={{ fontWeight: 'bold', marginBottom: '8px', color: '#2d3748' }}>
          📊 Reactivos en el matraz:
        </div>
        <div className="small" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>🧪 Peróxido:</span>
          <span style={{ fontWeight: 'bold', color: '#4d96ff' }}>{state.reagents.A.toFixed(1)}</span>
        </div>
        <div className="small" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>🫧 Jabón + KI:</span>
          <span style={{ fontWeight: 'bold', color: '#9d4edd' }}>{state.reagents.B.toFixed(1)}</span>
        </div>
        <div className="small" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>🎨 Colorante:</span>
          <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>{state.reagents.C.toFixed(1)}</span>
        </div>
      </div>

      {/* Progreso de la reacción */}
      {(state.reactionStage === 'foaming' || state.reactionStage === 'complete') && (
        <div style={{ marginTop: '12px' }}>
          <div className="small" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>Progreso de espuma:</span>
            <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>
              {Math.min(100, Math.round((state.foamHeight / 300) * 100))}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(100, (state.foamHeight / 300) * 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ff6b6b, #ffd93d)',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EstadoPastaDientes;