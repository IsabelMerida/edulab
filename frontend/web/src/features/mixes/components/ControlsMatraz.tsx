import React from 'react';
import { EstadoMatraz } from '../types';

interface ControlsMatrazProps {
  state: EstadoMatraz;
  onStartPour: (reagent: 'A' | 'B' | 'C') => void;
  onStopPour: () => void;
  onAddReagent: (reagent: 'A' | 'B' | 'C') => void;
  onSetMode: (mode: 'drop' | 'stream') => void;
  onSetAmount: (amount: number) => void;
  onSetTemp: (temp: number) => void;
  onSetAgitate: (agitate: number) => void;
  onReset: () => void;
  onExplode: () => void;
}

const ControlsMatraz: React.FC<ControlsMatrazProps> = ({
  state,
  onStartPour,
  onStopPour,
  onAddReagent,
  onSetMode,
  onSetAmount,
  onSetTemp,
  onSetAgitate,
  onReset,
  onExplode
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
          Verter A
        </button>
        <button 
          className="reagent rB"
          onMouseDown={() => onStartPour('B')}
          onMouseUp={onStopPour}
          onTouchStart={() => onStartPour('B')}
          onTouchEnd={onStopPour}
          onClick={() => state.mode === 'drop' && onAddReagent('B')}
        >
          Verter B
        </button>
        <button 
          className="reagent rC"
          onMouseDown={() => onStartPour('C')}
          onMouseUp={onStopPour}
          onTouchStart={() => onStartPour('C')}
          onTouchEnd={onStopPour}
          onClick={() => state.mode === 'drop' && onAddReagent('C')}
        >
          Verter C
        </button>
      </div>

      <div className="row" style={{ marginTop: '8px' }}>
        <label className="small" style={{ width: '90px' }}>Modo:</label>
        <button 
          className="reagent"
          onClick={() => onSetMode('drop')}
          style={{ opacity: state.mode === 'drop' ? 1 : 0.6 }}
        >
          Agregar gota
        </button>
        <button 
          className="reagent"
          onClick={() => onSetMode('stream')}
          style={{ opacity: state.mode === 'stream' ? 1 : 0.6 }}
        >
          Vertido continuo
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label className="small">
          Cantidad por acción: <span>{state.amount}</span>
        </label>
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={state.amount}
          onChange={(e) => onSetAmount(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label className="small">
          Temperatura: <span>{state.temp} °C</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="200" 
          value={state.temp}
          onChange={(e) => onSetTemp(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <label className="small">
          Agitación (velocidad): <span>{state.agitate.toFixed(1)}</span>
        </label>
        <input 
          type="range" 
          min="0" 
          max="5" 
          step="0.1" 
          value={state.agitate}
          onChange={(e) => onSetAgitate(Number(e.target.value))}
        />
      </div>

      <div className="row" style={{ marginTop: '10px' }}>
        <button className="reagent" onClick={onReset}>
          Reiniciar
        </button>
        <button className="reagent danger" onClick={onExplode}>
          Forzar reacción
        </button>
      </div>
    </div>
  );
};

export default ControlsMatraz;