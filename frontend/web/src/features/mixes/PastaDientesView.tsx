import React from 'react';
import PastaDientesDisplay from './components/PastaDientesDisplay';
import ControlsPastaDientes from './components/ControlsPastaDientes';
import EstadoPastaDientes from './components/EstadoPastaDientes';
import { usePastaDientesElefante } from './components/hooks/usePastaDientesElefante';
import './styles/Matraz.css';

const PastaDientesView: React.FC = () => {
  const simulador = usePastaDientesElefante();

  return (
    <div className="mezclas-view">
      <div className="left-panel card">
        <h2>🐘 Pasta de Dientes de Elefante 🐘</h2>
        <p className="small">
          <strong>🧪 Reactivo A:</strong> Peróxido de hidrógeno (H₂O₂) - Líquido transparente<br/>
          <strong>🫧 Reactivo B:</strong> Jabón líquido + Yoduro de potasio (KI) - Catalizador amarillo<br/>
          <strong>🎨 Reactivo C:</strong> Colorante alimentario - Opcional para colores divertidos<br/>
          <strong>🎪 Reacción:</strong> ¡Una ESPUMA GIGANTE sale del matraz como pasta de dientes de elefante!
        </p>
        <PastaDientesDisplay 
          state={simulador.state}
          foamBubbles={simulador.foamBubbles}
        />
      </div>

      <div className="controls-panel">
        <ControlsPastaDientes 
          state={simulador.state}
          onStartPour={simulador.startPour}
          onStopPour={simulador.stopPour}
          onAddReagent={simulador.addReagent}
          onSetMode={simulador.setMode}
          onSetAmount={simulador.setAmount}
          onSetTemp={simulador.setTemp}
          onSetAgitate={simulador.setAgitate}
          onReset={simulador.resetAll}
        />

        <EstadoPastaDientes state={simulador.state} />

        <div className="card help-section">
          <strong>📚 Instrucciones del Experimento</strong>
          <ul>
            <li>🔄 <strong>Mezcla:</strong> Añade Peróxido (A) y Jabón+KI (B) en proporciones similares</li>
            <li>🔥 <strong>Temperatura:</strong> ≥30°C para una reacción más rápida y espectacular</li>
            <li>🌀 <strong>Agitación:</strong> Más agitación = más espuma y burbujas</li>
            <li>⏱️ <strong>Retraso:</strong> La reacción comienza automáticamente después de 1-2 segundos</li>
            <li>🎨 <strong>Colorante:</strong> Añade colorante (C) para pasta de dientes de colores</li>
            <li>⚠️ <strong>Precaución:</strong> ¡La espuma puede crecer mucho! Mantén el matraz en una bandeja</li>
          </ul>
          
          <div style={{ 
            marginTop: '12px', 
            padding: '10px',
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 215, 61, 0.1))',
            borderRadius: '8px',
            border: '1px solid rgba(255, 107, 107, 0.3)'
          }}>
            <strong>🧪 Química divertida:</strong>
            <div className="small" style={{ marginTop: '6px' }}>
              H₂O₂ → H₂O + O₂ (oxígeno gas)<br/>
              El jabón atrapa el oxígeno en burbujas<br/>
              ¡Creando una ESPUMA GIGANTE!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastaDientesView;