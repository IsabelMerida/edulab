import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

// Componentes globales
import AppNavbar from "./components/Navbar";

// Vistas principales
import WelcomeView from "./features/welcome/WelcomeView";
import MezclasView from "./features/mixes/MezclasView";

// Vistas de la tabla periódica
import PeriodicTableView from "./features/periodictable/PeriodicTableView";
import AIChatPanel from "./features/periodictable/components/AIChatPanel";
import ElectronConfigPanel from "./features/periodictable/components/ElectronConfigPanel";
import AtomicDataTable from "./features/periodictable/components/AtomicDataTable";
import DownloadPDFButton from "./features/periodictable/components/DownloadPDF";

function App() {
  return (
    <Routes>
      {/* Pantalla de bienvenida */}
      <Route path="/" element={<WelcomeView />} />

      {/* Página de la tabla periódica completa */}
      <Route
        path="/tabla"
        element={
          <div className="bg-white min-vh-100">
            <AppNavbar />

            <Container fluid className="mt-4">
              {/* Botón descarga */}
              <div className="d-flex justify-content-center mb-3">
                <DownloadPDFButton />
              </div>

              {/* Cuadro visual TP */}
              <Card
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  backgroundColor: "#f8f9fa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  border: "1px solid #dee2e6",
                  width: "100%",
                  margin: "0 auto",
                  overflowX: "auto",
                }}
              >
                <Card.Header
                  className="text-center fw-bold"
                  style={{ backgroundColor: "#e9ecef", fontSize: "16px" }}
                >
                  TABLA PERIÓDICA INTERACTIVA
                </Card.Header>

                <Card.Body>
                  <PeriodicTableView />
                </Card.Body>
              </Card>

              {/* Panel de IA */}
              <div className="mt-4">
                <AIChatPanel />
              </div>

              {/* Paneles de datos y configuración */}
              <Row className="g-4 mt-4">
                <Col xs={12} md={6}>
                  <ElectronConfigPanel />
                </Col>
                <Col xs={12} md={6}>
                  <AtomicDataTable />
                </Col>
              </Row>
            </Container>
          </div>
        }
      />

      {/* Página de mezclas */}
      <Route path="/mezclas" element={<MezclasView />} />
    </Routes>
  );
}

export default App;