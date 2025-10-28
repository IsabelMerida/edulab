import React, { useState } from "react";
import { Container, Modal, Button } from "react-bootstrap";
import { elements } from "./data/elements";
import ElementCard from "./components/ElementCard";
import { useElementInfo } from "./hooks/useElementInfo";

type Elemento = {
  numero: number;
  simbolo: string;
  nombre: string;
  tipo: string;
  grupo: number;
  periodo: number;
  masa: number;
  electrones: string;
};

const PeriodicTableView: React.FC = () => {
  const [selected, setSelected] = useState<Elemento | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { info, generateAIInfo } = useElementInfo();

  const handleSelect = (el: Elemento): void => {
    setSelected(el);
    generateAIInfo(el);
    setShowModal(true);
  };

  const handleClose = (): void => setShowModal(false);

  // Matriz 10x18
  const grid: (Elemento | null)[][] = Array.from({ length: 9 }, () =>
    Array(18).fill(null)
  );

  elements.sort((a, b) => a.numero - b.numero);

  elements.forEach((el) => {
    const { numero, grupo, periodo } = el;

    if (numero >= 57 && numero <= 71) {
      // Lantánidos → fila 7
      grid[7][numero - 57] = el;
    } else if (numero >= 89 && numero <= 103) {
      // Actínidos → fila 8
      grid[8][numero - 89] = el;
    } else {
      const row = periodo - 1;
      const col = grupo - 1;

      const isActinideGap = row === 6 && col >= 2 && col <= 11 && numero < 104;

      if (isActinideGap) return;

      grid[row][col] = el;
    }
  });
  return (
    <Container fluid className="bg-white text-black min-vh-200 py-4">
      <h1
        className="text-center mb-4 fw-bold"
        style={{
          fontFamily: "Arial, sans-serif",
          background: "000000",
          fontSize: "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          letterSpacing: "2px",
        }}
      >
        TABLA PERIÓDICA INTERACTIVA
      </h1>

      <div className="d-flex flex-column align-items-center overflow-auto px-3">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="d-flex mb-2">
            {row.map((el, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: "65px",
                  height: "75px",
                  margin: "2px",
                  backgroundColor: el ? "transparent" : "transparent",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {el && (
                  <ElementCard
                    element={el}
                    onSelect={handleSelect}
                    selected={selected}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-primary text-white border-0">
          <Modal.Title>
            <span className="fs-4 fw-bold">{selected?.simbolo}</span>{" "}
            <span className="fs-6 opacity-75">{selected?.nombre}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-light text-dark px-4 py-3">
          <div className="bg-white border rounded p-3 mb-3 shadow-sm">
            <h5 className="text-primary fw-semibold mb-3">
              🔬 Propiedades del elemento
            </h5>
            <p>
              <strong>Masa atómica:</strong> {selected?.masa}
            </p>
            <p>
              <strong>Número de electrones:</strong> {selected?.numero}
            </p>
            <p>
              <strong>Configuración electrónica:</strong> {selected?.electrones}
            </p>
            <p>
              <strong>Tipo:</strong> {selected?.tipo}
            </p>
            <p>
              <strong>Grupo:</strong> {selected?.grupo}
            </p>
            <p>
              <strong>Período:</strong> {selected?.periodo}
            </p>
          </div>

          <div className="bg-white border rounded p-3 shadow-sm">
            <h5 className="text-success fw-semibold mb-3">🤖 Tutor IA</h5>
            <p>{info}</p>
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-light border-0">
          <Button variant="primary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PeriodicTableView;