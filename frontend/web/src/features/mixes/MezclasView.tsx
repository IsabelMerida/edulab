import React, { useState, useEffect } from 'react';
import MatrazDisplay from './components/MatrazDisplay';
import ControlsMatraz from './components/ControlsMatraz';
import EstadoMatraz from './components/EstadoMatraz';
import { useSimuladorMatraz } from './components/hooks/useSimuladorMatraz';
import Chat from '../../components/ChatModal';
import './styles/Matraz.css';

const MezclasView: React.FC = () => {
  const simulador = useSimuladorMatraz();
  const [eventosAutomaticos, setEventosAutomaticos] = useState<string[]>([]);

  // Detectar cambios en el estado y generar mensajes automáticos
  useEffect(() => {
    const estado = simulador.state;
    let nuevoEvento = '';

    // Detectar cuando se agregan reactivos
    if (estado.reagents.A > 0 && estado.reagents.B === 0 && estado.level > 0) {
      nuevoEvento = `🧪 Se agregó glicerina: ${estado.reagents.A.toFixed(1)} units`;
    }
    else if (estado.reagents.B > 0 && estado.reagents.A === 0 && estado.level > 0) {
      nuevoEvento = `🧪 Se agregó KMnO₄: ${estado.reagents.B.toFixed(1)} units`;
    }
    else if (estado.reagents.A > 0 && estado.reagents.B > 0 && estado.reactionStage === 'inactive') {
      nuevoEvento = `✅ Mezcla preparada! Glicerina: ${estado.reagents.A.toFixed(1)} units, KMnO₄: ${estado.reagents.B.toFixed(1)} units`;
    }

    // Detectar cambios en la etapa de la reacción
    if (estado.reactionStage === 'smoke' && !eventosAutomaticos.some(e => e.includes('humo'))) {
      nuevoEvento = '💨 ¡Comienza a generar humo! La reacción se está iniciando...';
    }
    else if (estado.reactionStage === 'ignition' && !eventosAutomaticos.some(e => e.includes('IGNICIÓN'))) {
      nuevoEvento = '🔥 ¡IGNICIÓN! Llama lila visible - Reacción exotérmica en progreso';
    }
    else if (estado.reactionStage === 'complete' && !eventosAutomaticos.some(e => e.includes('Residuo'))) {
      nuevoEvento = '◇ Reacción completada. Residuo marrón (K₂CO₃ + Mn₂O₃)';
    }

    if (nuevoEvento && !eventosAutomaticos.includes(nuevoEvento)) {
      setEventosAutomaticos(prev => [...prev, nuevoEvento]);
    }
  }, [simulador.state, eventosAutomaticos]);

  const chatContext = {
    eventosAutomaticos,
    state: simulador.state
  };

  return (
    <div className="mezclas-view">
      <div className="mezclas-main-container">
        <div className="left-panel">
          <div className="card">
            <h2>Reacción: Glicerina + Permanganato de Potasio</h2>
            <p className="small">
              <strong>Reactivo A:</strong> Glicerina (C₃H₈O₃) - Líquido incoloro, viscoso y dulce<br />
              <strong>Reactivo B:</strong> Permanganato de Potasio (KMnO₄) - Solución púrpura intenso<br />
              <strong>Reacción:</strong> Mezcla → Retraso (2-5s) → Humo → Ignición espontánea (llama lila) → Residuo marrón
            </p>

            <MatrazDisplay
              state={simulador.state}
              particles={simulador.particles}
              flashes={simulador.flashes}
            />
          </div>

          <div className="chat-left-section">
            <Chat context={JSON.stringify(chatContext)} />
          </div>
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
    </div>
  );
};

export default MezclasView;