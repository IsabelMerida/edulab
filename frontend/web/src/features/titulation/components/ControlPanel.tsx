// src/features/titulation/components/ControlPanel.jsx
import React from 'react';
import ControlCard from './ControlCard';

// Estilos (se mantienen)
const reagentStyle = { padding: '8px 10px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', color: '#070' };
const rowStyle = { display: 'flex', gap: '8px', alignItems: 'center' };
const smallTextStyle = { fontSize: '14px', color: '#000' };
const disabledStyle = { background: '#ccc', cursor: 'not-allowed', opacity: 0.7, color: '#666' }; 

const btnAcidStyle = { background: '#fca5a5' };
const btnDefaultStyle = { background: '#CBD5E1' };
const btnActionStyle = { background: '#fde68a' };
const btnAiStyle = { background: '#a78bfa' };
const cardBgStyle = { background: '#ffffff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', color: '#333' };

export default function ControlPanel({
  isLoading, mode, currentVolume, message, staticState, aiResponse, gameStarted,
  onStart, onSetMode, onPourMouseDown, onPourMouseUp, onPourMouseLeave, onPourClick, onReset, onAskAI, onCheckState
}) {
  
  const isInteractionDisabled = isLoading || !gameStarted;
  
  const CustomControlCard = ({ title, children }) => (
      // CLAVE: Usamos el CustomControlCard simplificado
      <div style={{ ...cardBgStyle, padding: '8px 12px', borderRadius: '10px', marginBottom: '8px' }}> {/* REDUCCIÓN AQUÍ: padding: 8px 12px; marginBottom: 8px */}
          {title && <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#000' }}>{title}</h4>} {/* REDUCCIÓN AQUÍ: margin: 0 0 6px 0 */}
          {children}
      </div>
  );

  return (
    // CLAVE: Reducimos el GAP vertical entre las tarjetas
    <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#333' }}> {/* REDUCCIÓN AQUÍ: gap: 6px */}

      {/* Tarjeta de Inicio */}
      <CustomControlCard>
        <label style={smallTextStyle}>Iniciar nuevo experimento:</label>
        <div style={{ ...rowStyle, marginTop: '4px' }}> {/* REDUCCIÓN AQUÍ: marginTop: 4px */}
          <button onClick={() => onStart('acido')} disabled={isLoading} style={{ ...reagentStyle, ...btnAcidStyle, ...(isLoading ? disabledStyle : {}) }}>
            Iniciar Ácido/Base
          </button>
        </div>
      </CustomControlCard>

      {/* Tarjeta de Bureta */}
      <CustomControlCard>
        <label style={smallTextStyle}>Control de la Bureta (Fijo: 1mL por acción)</label>
        <div style={{ ...rowStyle, marginTop: '4px' }}> {/* REDUCCIÓN AQUÍ: marginTop: 4px */}
          <button onClick={() => onSetMode('drop')} disabled={isInteractionDisabled} style={{ ...reagentStyle, ...btnDefaultStyle, opacity: mode === 'drop' ? 1 : 0.6, ...(isInteractionDisabled ? disabledStyle : {}) }}>
            Goteo (1 clic)
          </button>
          <button onClick={() => onSetMode('stream')} disabled={isInteractionDisabled} style={{ ...reagentStyle, ...btnDefaultStyle, opacity: mode === 'stream' ? 1 : 0.6, ...(isInteractionDisabled ? disabledStyle : {}) }}>
            Chorro (sostener)
          </button>
        </div>
        <div style={{ marginTop: '6px' }}> {/* REDUCCIÓN AQUÍ: marginTop: 6px */}
          <button
            onMouseDown={onPourMouseDown} onMouseUp={onPourMouseUp} onMouseLeave={onPourMouseLeave} onClick={onPourClick}
            disabled={isInteractionDisabled}
            style={{ ...reagentStyle, ...btnActionStyle, width: '100%', ...(isInteractionDisabled ? disabledStyle : {}) }}
          >
            Abrir Bureta
          </button>
        </div>
      </CustomControlCard>

      {/* Tarjeta de Estado */}
      <CustomControlCard title="Estado del Matraz">
        <div style={smallTextStyle}>Volumen añadido: {currentVolume.toFixed(1)} mL</div>
        
        <button onClick={onCheckState} disabled={isLoading} style={{ ...reagentStyle, ...btnDefaultStyle, width: '100%', marginTop: '4px', ...(isLoading ? disabledStyle : {}) }}> {/* REDUCCIÓN AQUÍ: marginTop: 4px */}
          Comprobar estado
        </button>
        
        <p style={{ ...smallTextStyle, color: '#000', marginTop: '3px', fontWeight: 'bold', minHeight: '18px' }}>{staticState}</p> {/* REDUCCIÓN AQUÍ: marginTop: 3px; minHeight: 18px */}
        <p style={{ ...smallTextStyle, color: '#000', marginTop: '3px', fontWeight: 'bold', minHeight: '18px' }}>{message}</p> {/* REDUCCIÓN AQUÍ: marginTop: 3px; minHeight: 18px */}
        
        <div style={{ height: '6px' }}></div> {/* REDUCCIÓN AQUÍ: height: 6px */}
        <div style={rowStyle}>
          <button onClick={onReset} disabled={isLoading} style={{ ...reagentStyle, ...btnDefaultStyle, ...(isLoading ? disabledStyle : {}) }}>
            Reiniciar Simulación
          </button>
        </div>
      </CustomControlCard>

      {/* Tarjeta de IA */}
      <CustomControlCard title="Asistente IA 🧠">
        <button onClick={onAskAI} disabled={isLoading} style={{ ...reagentStyle, ...btnAiStyle, width: '100%', ...(isLoading ? disabledStyle : {}) }}>
          ¿Qué es una titulación?
        </button>
        <p style={{ ...smallTextStyle, marginTop: '6px', minHeight: '30px', maxHeight: '90px', overflowY: 'auto', color: '#000' }}> {/* REDUCCIÓN AQUÍ */}
          {aiResponse}
        </p>
      </CustomControlCard>
    </div>
  );
}