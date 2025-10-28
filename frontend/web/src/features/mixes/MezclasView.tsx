import React from 'react';
import MatrazDisplay from './components/MatrazDisplay';
import ControlsMatraz from './components/ControlsMatraz';
import EstadoMatraz from './components/EstadoMatraz';
import { useSimuladorMatraz } from './components/hooks/useSimuladorMatraz';
import './styles/Matraz.css';

const MezclasView: React.FC = () => {
  const simulador = useSimuladorMatraz();

  return (
    <div className="mezclas-view">
      <div className="left-panel card">
        <h2>Reacción: Glicerina + Permanganato de Potasio</h2>
        <p className="small">
          <strong>Reactivo A:</strong> Glicerina (C₃H₈O₃) - Líquido incoloro, viscoso y dulce<br/>
          <strong>Reactivo B:</strong> Permanganato de Potasio (KMnO₄) - Solución púrpura intenso<br/>
          <strong>Reacción:</strong> Mezcla → Retraso (2-5s) → Humo → Ignición espontánea (llama lila) → Residuo marrón
        </p>
        <MatrazDisplay 
          state={simulador.state}
          particles={simulador.particles}
          flashes={simulador.flashes}
        />
      </div>

      <div className="controls-panel">
        <ControlsMatraz 
          state={simulador.state}
          onStartPour={simulador.startPour}
          onStopPour={simulador.stopPour}
          onAddReagent={simulador.addReagent}
          onSetMode={simulador.setMode}
          onSetAmount={simulador.setAmount}
          onSetTemp={simulador.setTemp}
          onSetAgitate={simulador.setAgitate}
          onReset={simulador.resetAll}
          onExplode={simulador.triggerExplosion}
        />

        <EstadoMatraz state={simulador.state} />

        <div className="card help-section">
          <strong>Instrucciones de la reacción química</strong>
          <ul>
            <li>Mezcla Glicerina (A) y Permanganato (B) en proporciones similares</li>
            <li>La temperatura debe ser ≥35°C para la reacción</li>
            <li>Observa el retraso de 2-5 segundos antes de que comience</li>
            <li>Etapas: Humo → Ignición con llama lila → Residuo marrón</li>
            <li>Productos: K₂CO₃ (carbonato de potasio) + Mn₂O₃ (óxido de manganeso)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MezclasView;