import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
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
  const grid: (Elemento | null | undefined)[][] = Array.from(
    { length: 9 },
    () => Array(18).fill(null)
  );

  elements.sort((a, b) => a.numero - b.numero);

  //Mapeo automático de los Periodos 1 al 5 (índices de fila 0 a 4)
  elements.forEach((el) => {
    const { grupo, periodo } = el;
    if (periodo <= 5) {
      // Columna y Fila normales para los primeros 5 Periodos
      const row = periodo - 1;
      const col = grupo - 1;
      grid[row][col] = el;
    }
  });

  // Colocación manual de los elementos del Periodo 6 y 7
  //Función de utilidad para encontrar un elemento por su número atómico (Z)
  const findEl = (Z: number) => elements.find((e) => e.numero === Z);

  const placeholderLantanido = {
    numero: 0,
    simbolo: "57-71",
    nombre: "Lantánidos",
    masa: 0,
    tipo: "Lantánido",
    electrones: "",
    grupo: 0,
    periodo: 0,
  } as Elemento;
  const placeholderActinido = {
    numero: 0,
    simbolo: "89-103",
    nombre: "Actínidos",
    masa: 0,
    tipo: "Actínido",
    electrones: "",
    grupo: 0,
    periodo: 0,
  } as Elemento;

  // Marcadores:
  grid[5][2] = placeholderLantanido; // Periodo 6, Grupo 3 (Fila 5, Col 2)
  grid[6][2] = placeholderActinido; // Periodo 7, Grupo 3 (Fila 6, Col 2)

  grid[4][7] = findEl(44); // Kr
  grid[4][8] = findEl(45); // Kr
  grid[4][9] = findEl(46); // Kr
  grid[4][10] = findEl(47); // Kr
  grid[4][11] = findEl(48); // Kr

  // Periodo 6 (Fila 5):
  grid[5][0] = findEl(55); // La
  grid[5][1] = findEl(56); // La
  grid[5][2] = findEl(57); // Ce
  grid[5][3] = findEl(72); // Hf
  grid[5][4] = findEl(73); // Ta
  grid[5][5] = findEl(74); // W
  grid[5][6] = findEl(75); // Re
  grid[5][7] = findEl(76); // Os
  grid[5][8] = findEl(77); // Ir
  grid[5][9] = findEl(78); // Pt
  grid[5][10] = findEl(79); // Au
  grid[5][11] = findEl(80); // Hg
  grid[5][12] = findEl(81); // Tl
  grid[5][13] = findEl(82); // Pb
  grid[5][14] = findEl(83); // Bi
  grid[5][15] = findEl(84); // Po
  grid[5][16] = findEl(85); // At
  grid[5][17] = findEl(86); // Rn

  // Periodo 7 (Fila 6):
  grid[6][0] = findEl(87); // Fr
  grid[6][1] = findEl(88); // Ra
  grid[6][2] = findEl(89); // Ac
  grid[6][3] = findEl(104); // Rf
  grid[6][4] = findEl(105); // Db
  grid[6][5] = findEl(106); // Sg
  grid[6][6] = findEl(107); // Bh
  grid[6][7] = findEl(108); // Hs
  grid[6][8] = findEl(109); // Mt
  grid[6][9] = findEl(110); // Ds
  grid[6][10] = findEl(111); // Rg
  grid[6][11] = findEl(112); // Cn
  grid[6][12] = findEl(113); // Nh
  grid[6][13] = findEl(114); // Fl
  grid[6][14] = findEl(115); // Mc
  grid[6][15] = findEl(116); // Lv
  grid[6][16] = findEl(117); // Ts
  grid[6][17] = findEl(118); // Og

  // Bloques F (Fila 7 y 8)
  // Z=58 a Z=71 (Lantánidos) - Fila 7 (índice 7)
  for (let z = 58; z <= 71; z++) {
    grid[7][z - 58] = findEl(z);
  }
  // Z=90 a Z=103 (Actínidos) - Fila 8 (índice 8)
  for (let z = 90; z <= 103; z++) {
    grid[8][z - 90] = findEl(z);
  }

  return (
    <div className="bg-white text-black min-vh-100 py-4 w-100">
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
              Propiedades del elemento
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
    </div>
  );
};

export default PeriodicTableView;
