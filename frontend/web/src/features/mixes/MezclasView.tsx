import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import { FaFlask, FaAtom, FaVial } from "react-icons/fa";
import { GiAtom } from "react-icons/gi";
import MatrazDisplay from './components/MatrazDisplay';
import ControlsMatraz from './components/ControlsMatraz';
import EstadoMatraz from './components/EstadoMatraz';
import { useSimuladorMatraz } from './components/hooks/useSimuladorMatraz';
import Chat from '../../components/ChatModal';
import './styles/Matraz.css';

const MezclasView: React.FC = () => {
  const simulador = useSimuladorMatraz();
  const [eventosAutomaticos, setEventosAutomaticos] = useState<string[]>([]);
  const [showInstrucciones, setShowInstrucciones] = useState(true); // 👈 Modal visible al inicio

  useEffect(() => {
    const estado = simulador.state;
    let nuevoEvento = '';

    if (estado.reagents.A > 0 && estado.reagents.B === 0 && estado.level > 0) {
      nuevoEvento = `🧪 Se agregó glicerina: ${estado.reagents.A.toFixed(1)} units`;
    } else if (estado.reagents.B > 0 && estado.reagents.A === 0 && estado.level > 0) {
      nuevoEvento = `🧪 Se agregó KMnO₄: ${estado.reagents.B.toFixed(1)} units`;
    } else if (estado.reagents.A > 0 && estado.reagents.B > 0 && estado.reactionStage === 'inactive') {
      nuevoEvento = `✅ Mezcla preparada! Glicerina: ${estado.reagents.A.toFixed(1)} units, KMnO₄: ${estado.reagents.B.toFixed(1)} units`;
    }

    if (estado.reactionStage === 'smoke' && !eventosAutomaticos.some(e => e.includes('humo'))) {
      nuevoEvento = '💨 ¡Comienza a generar humo! La reacción se está iniciando...';
    } else if (estado.reactionStage === 'ignition' && !eventosAutomaticos.some(e => e.includes('IGNICIÓN'))) {
      nuevoEvento = '🔥 ¡IGNICIÓN! Llama lila visible - Reacción exotérmica en progreso';
    } else if (estado.reactionStage === 'complete' && !eventosAutomaticos.some(e => e.includes('Residuo'))) {
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
      {/* Navbar  */}
            <Navbar
              bg="dark"
              variant="dark"
              expand="lg"
              fixed="top"
              className="shadow"
            >
              <Container>
                <Navbar.Brand href="/" className="fw-bold d-flex align-items-center">
                  <GiAtom
                    size={55}
                    strokeWidth={2}
                    color="#00FFFF"
                    style={{ marginRight: "10px" }}
                  />
                  EduLab
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="ms-auto">
                    <Nav.Link
                      href="/tabla"
                      className="d-flex align-items-center gap-2"
                    >
                      <FaAtom /> Tabla Periódica
                    </Nav.Link>
                    <Nav.Link
                      href="/mezclas"
                      className="d-flex align-items-center gap-2"
                    >
                      <FaFlask /> Mezclas
                    </Nav.Link>
                    <Nav.Link
                      href="/titulacion"
                      className="d-flex align-items-center gap-2"
                    >
                      <FaVial /> Titulación
                    </Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>

      {/* Contenido */}
      <div className="mezclas-content">
        <div className="mezclas-layout">
          {/* Izquierda: Matraz */}
          <div className="matraz-section card">
            <h2>Reacción: Glicerina + Permanganato de Potasio</h2>
            <p><strong>Reactivo A:</strong> Glicerina (C₃H₈O₃) — Líquido incoloro, viscoso y dulce</p>
            <p><strong>Reactivo B:</strong> Permanganato de Potasio (KMnO₄) — Solución púrpura intenso</p>
            <p><strong>Reacción:</strong> Mezcla → Retraso (2-5s) → Humo → Ignición → Residuo marrón</p>

            <MatrazDisplay
              state={simulador.state}
              particles={simulador.particles}
              flashes={simulador.flashes}
            />

            <div className="">
              <EstadoMatraz state={simulador.state} />
            </div>
          </div>

          { }
          <div className="side-panel">
            <div className="chat-container card">
              <Chat context={JSON.stringify(chatContext)} />
            </div>

            <div className="controls-container card">
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
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-dark text-light text-center py-3 w-100 shadow-sm">
        <Container>
          <small>
            © {new Date().getFullYear()} The 404s. Todos los derechos reservados.
          </small>
        </Container>
      </footer>


      {/* === MODAL DE INSTRUCCIONES === */}
      <Modal show={showInstrucciones} onHide={() => setShowInstrucciones(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🧪 Instrucciones de la simulación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul style={{ lineHeight: '1.6', marginLeft: '1rem' }}>
            <li>Mezcla Glicerina (A) y KMnO₄ (B) en proporciones similares.</li>
            <li>Asegúrate de que la temperatura sea al menos de 35 °C para iniciar.</li>
            <li>Espera un retraso de 2–5 s antes de la ignición.</li>
            <li>Etapas observables: Humo → Ignición → Residuo marrón.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInstrucciones(false)}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MezclasView;
