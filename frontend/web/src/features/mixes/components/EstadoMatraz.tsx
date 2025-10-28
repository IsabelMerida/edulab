import React from 'react';
import { EstadoMatraz as EstadoMatrazType } from '../types';

interface EstadoMatrazProps {
  state: EstadoMatrazType;
}

const EstadoMatraz: React.FC<EstadoMatrazProps> = ({ state }) => {
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
    </div>
  );
};

export default EstadoMatraz;