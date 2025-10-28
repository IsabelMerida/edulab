import React from 'react';
import { EstadoPastaDientes } from './hooks/usePastaDientesElefante';

interface ControlsPastaDientesProps {
  state: EstadoPastaDientes;
  onStartPour: (reagent: 'A' | 'B' | 'C') => void;
  onStopPour: () => void;
  onAddReagent: (reagent: 'A' | 'B' | 'C') => void;
  onSetMode: (mode: 'drop' | 'stream') => void;
  onSetAmount: (amount: number) => void;
  onSetTemp: (temp: number) => void;
  onSetAgitate: (agitate: number) => void;
  onReset: () => void;
}

const ControlsPastaDientes: React.FC<ControlsPastaDientesProps> = ({
  state,
  onStartPour,
  onStopPour,
  onAddReagent,
  onSetMode,
  onSetAmount,
  onSetTemp,
  onSetAgitate,
  onReset
}) => {
  return (
    <div className="card">
      <div className="row">
        <button 
          className="reagent rA"
          onMouseDown={() => onStartPour('A')}
          onMouseUp={onStopPour}
          onTouchStart={() => onStartPour('A')}
          onTouchEnd={onStopPour}
          onClick={() => state.mode === 'drop' && onAddReagent('A')}
        >
          🧪 Peróxido (A)
        </button>
        <button 
          className="reagent rB"
          onMouseDown={() => onStartPour('B')}
          onMouseUp={onStopPour}
          onTouchStart={() => onStartPour('B')}
          onTouchEnd={onStopPour}
          onClick={() => state.mode === 'drop' && onAddReagent('B')}
        >
          🫧 Jabón + KI (B)
        </button>
        <button 
          className="reagent rC"
          onMouseDown={() => onStartPour('C')}
          onMouseUp={onStopPour}
          onTouchStart={() => onStartPour('C')}
          onTouchEnd={onStopPour}
          onClick={() => state.mode === 'drop' && onAddReagent('C')}
        >
          🎨 Colorante (C)
        </button>
      </div>

      <div className="row" style={{ marginTop: '12px' }}>
        <label className="small" style={{ width: '90px' }}>Modo:</label>
        <button 
          className="reagent"
          onClick={() => onSetMode('drop')}
          style={{ 
            opacity: state.mode === 'drop' ? 1 : 0.6,
            background: state.mode === 'drop' ? 'linear-gradient(135deg, #ffd93d, #ff6b6b)' : ''
          }}
        >
          💧 Agregar gota
        </button>
        <button 
          className="reagent"
          onClick={() => onSetMode('stream')}
          style={{ 
            opacity: state.mode === 'stream' ? 1 : 0.6,
            background: state.mode === 'stream' ? 'linear-gradient(135deg, #4d96ff, #6bcf7f)' : ''
          }}
        >
          🌊 Vertido continuo
        </button>
      </div>

      <div style={{ marginTop: '15px' }}>
        <label className="small">
          Cantidad por acción: <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>{state.amount}</span>
        </label>
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={state.amount}
          onChange={(e) => onSetAmount(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: '15px' }}>
        <label className="small">
          🌡️ Temperatura: <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>{state.temp} °C</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={state.temp}
          onChange={(e) => onSetTemp(Number(e.target.value))}
        />
        <div className="small" style={{ marginTop: '6px', color: state.temp >= 30 ? '#6bcf7f' : '#4d96ff' }}>
          {state.temp >= 30 ? '🔥 Temperatura óptima para reacción rápida' : '❄️ Aumenta temperatura para reacción más rápida'}
        </div>
      </div>

      <div style={{ marginTop: '15px' }}>
        <label className="small">
          🌀 Agitación: <span style={{ fontWeight: 'bold', color: '#ff6b6b' }}>{state.agitate.toFixed(1)}</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="5" 
          step="0.1" 
          value={state.agitate}
          onChange={(e) => onSetAgitate(Number(e.target.value))}
        />
        <div className="small" style={{ marginTop: '6px', color: '#9d4edd' }}>
          {state.agitate > 2 ? '🌀 ¡Mucha agitación = más espuma!' : '💤 Agita para mejor mezcla'}
        </div>
      </div>

      <div className="row" style={{ marginTop: '20px', justifyContent: 'center' }}>
        <button 
          className="reagent danger" 
          onClick={onReset}
          style={{ 
            background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          🗑️ Reiniciar Experimento
        </button>
      </div>

      {/* Indicador de reacción lista */}
      {state.reagents.A >= 25 && state.reagents.B >= 15 && state.reactionStage === 'inactive' && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          background: 'linear-gradient(135deg, #ffd93d, #ff6b6b)',
          borderRadius: '10px',
          textAlign: 'center',
          color: 'white',
          fontWeight: 'bold',
          animation: 'pulse 2s infinite'
        }}>
          🐘 ¡LISTO! La pasta de dientes comenzará en segundos...
        </div>
      )}
    </div>
  );
};

export default ControlsPastaDientes;