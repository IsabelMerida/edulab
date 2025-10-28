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
        <h2>Matraz interactivo — Simulación</h2>
        <p className="small">
          Añade reactivos (A, B, C). Ajusta la temperatura y la cantidad. 
          Observa burbujeo, cambio de color y posible reacción fuerte.
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
          <strong>Cómo usar</strong>
          <ul>
            <li>Selecciona <em>Agregar gota</em> o <em>Vertido continuo</em>.</li>
            <li>Pulsa Verter A/B/C para añadir líquido al matraz.</li>
            <li>Sube temperatura o agitación para acelerar reacciones.</li>
            <li>Ciertas combinaciones + temperatura producen una reacción intensa (explosión visual).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MezclasView;