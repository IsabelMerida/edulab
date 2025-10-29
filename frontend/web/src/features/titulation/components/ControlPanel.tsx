// src/features/titulation/components/ControlPanel.jsx
import React from 'react';
import ControlCard from './ControlCard';

// Estilos específicos para este componente
const reagentStyle = { padding: '8px 10px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', color: '#071021', transition: 'background 0.2s, opacity 0.2s' };
const rowStyle = { display: 'flex', gap: '8px', alignItems: 'center' };
const smallTextStyle = { fontSize: '14px', color: '#444' }; // CAMBIO: Texto oscuro
const disabledStyle = { background: '#ccc', cursor: 'not-allowed', opacity: 0.7, color: '#666' }; // Estilo para botones deshabilitados
const cardBgStyle = { background: '#ffffff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', color: '#333' }; // CAMBIO: Fondo de tarjeta BLANCO

// Estilos de botones (se mantienen oscuros para contraste)
const btnAcidStyle = { background: '#fca5a5' };
const btnBaseStyle = { background: '#60a5fa' };
const btnActionStyle = { background: '#fde68a' };
const btnAiStyle = { background: '#a78bfa' };
const btnDefaultStyle = { background: '#CBD5E1' };


export default function ControlPanel({
  isLoading, mode, currentVolume, message, staticState, aiResponse, gameStarted,
  onStart, onSetMode, onPourMouseDown, onPourMouseUp, onPourMouseLeave, onPourClick, onReset, onAskAI, onCheckState
}) {
  
  const isInteractionDisabled = isLoading || !gameStarted;

  // Renderiza una Tarjeta de Control personalizada para el fondo BLANCO
  const CustomControlCard = ({ title, children }) => (
      <div style={{ ...cardBgStyle, padding: '12px', borderRadius: '10px', marginBottom: '12px' }}>
          {title && <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333' }}>{title}</h4>}
          {children}
      </div>
  );

  return (
    // Contenedor principal de controles (TEXTO OSCURO)
    <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '12px', color: '#333' }}>

      {/* Tarjeta de Inicio */}
      <CustomControlCard>
        <label style={smallTextStyle}>Iniciar nuevo experimento:</label>
        <div style={{ ...rowStyle, marginTop: '8px' }}>
          <button onClick={() => onStart('acido')} disabled={isLoading} style={{ ...reagentStyle, ...btnAcidStyle, ...(isLoading ? disabledStyle : {}) }}>
            Iniciar Ácido/Base
          </button>
        </div>
      </CustomControlCard>

      {/* Tarjeta de Bureta */}
      <CustomControlCard>
        <label style={smallTextStyle}>Control de la Bureta (Fijo: 1mL por acción)</label>
        <div style={{ ...rowStyle, marginTop: '8px' }}>
          <button onClick={() => onSetMode('drop')} disabled={isInteractionDisabled} style={{ ...reagentStyle, ...btnDefaultStyle, opacity: mode === 'drop' ? 1 : 0.6, ...(isInteractionDisabled ? disabledStyle : {}) }}>
            Goteo (1 clic)
          </button>
          <button onClick={() => onSetMode('stream')} disabled={isInteractionDisabled} style={{ ...reagentStyle, ...btnDefaultStyle, opacity: mode === 'stream' ? 1 : 0.6, ...(isInteractionDisabled ? disabledStyle : {}) }}>
            Chorro (sostener)
          </button>
        </div>
        <div style={{ marginTop: '10px' }}>
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
        <button onClick={onCheckState} disabled={isLoading} style={{ ...reagentStyle, ...btnDefaultStyle, width: '100%', marginTop: '8px', ...(isLoading ? disabledStyle : {}) }}>
          Comprobar estado
        </button>
        <p style={{ ...smallTextStyle, color: '#000', marginTop: '4px', fontWeight: 'bold', minHeight: '20px' }}>{staticState}</p> {/* Texto negro para mensaje estático */}
        <p style={{ ...smallTextStyle, color: '#333', marginTop: '4px', fontWeight: 'bold', minHeight: '20px' }}>{message}</p>
        <div style={{ height: '8px' }}></div>
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
        <p style={{ ...smallTextStyle, marginTop: '10px', minHeight: '40px', maxHeight: '120px', overflowY: 'auto', color: '#666' }}>
          {aiResponse}
        </p>
      </CustomControlCard>
    </div>
  );
}