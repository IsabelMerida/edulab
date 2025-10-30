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
  imagen?: string;
};

const PeriodicTableView: React.FC = () => {
  const [selected, setSelected] = useState<Elemento | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false); // Modal imagen
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false); // Modal info elemento
  const { generateAIInfo } = useElementInfo();

  const handleSelect = (el: Elemento): void => {
    setSelected(el);
    generateAIInfo(el);
    setShowInfoModal(true); // Abre modal de propiedades
  };

  const handleClose = (): void => setShowModal(false);
  const handleCloseInfo = (): void => setShowInfoModal(false);

  const grid: (Elemento | null | undefined)[][] = Array.from(
    { length: 9 },
    () => Array(18).fill(null)
  );

  elements.sort((a, b) => a.numero - b.numero);

  elements.forEach((el) => {
    const { grupo, periodo } = el;
    if (periodo <= 5) {
      const row = periodo - 1;
      const col = grupo - 1;
      grid[row][col] = el;
    }
  });

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

  const marcadorImagen = {
    numero: -1,
    simbolo: "👆",
    nombre: "Color interactivo",
    tipo: "Especial",
    masa: 0,
    electrones: "",
    grupo: 5,
    periodo: 2,
    imagen: "/assets/image.png",
  } as Elemento;

  // Marcadores
  grid[5][2] = placeholderLantanido;
  grid[6][2] = placeholderActinido;
  grid[1][4] = marcadorImagen;

  grid[4][7] = findEl(44);
  grid[4][8] = findEl(45);
  grid[4][9] = findEl(46);
  grid[4][10] = findEl(47);
  grid[4][11] = findEl(48);

  grid[5][0] = findEl(55);
  grid[5][1] = findEl(56);
  grid[5][2] = findEl(57);
  grid[5][3] = findEl(72);
  grid[5][4] = findEl(73);
  grid[5][5] = findEl(74);
  grid[5][6] = findEl(75);
  grid[5][7] = findEl(76);
  grid[5][8] = findEl(77);
  grid[5][9] = findEl(78);
  grid[5][10] = findEl(79);
  grid[5][11] = findEl(80);
  grid[5][12] = findEl(81);
  grid[5][13] = findEl(82);
  grid[5][14] = findEl(83);
  grid[5][15] = findEl(84);
  grid[5][16] = findEl(85);
  grid[5][17] = findEl(86);

  grid[6][0] = findEl(87);
  grid[6][1] = findEl(88);
  grid[6][2] = findEl(89);
  grid[6][3] = findEl(104);
  grid[6][4] = findEl(105);
  grid[6][5] = findEl(106);
  grid[6][6] = findEl(107);
  grid[6][7] = findEl(108);
  grid[6][8] = findEl(109);
  grid[6][9] = findEl(110);
  grid[6][10] = findEl(111);
  grid[6][11] = findEl(112);
  grid[6][12] = findEl(113);
  grid[6][13] = findEl(114);
  grid[6][14] = findEl(115);
  grid[6][15] = findEl(116);
  grid[6][16] = findEl(117);
  grid[6][17] = findEl(118);

  for (let z = 58; z <= 71; z++) grid[7][z - 58] = findEl(z);
  for (let z = 90; z <= 103; z++) grid[8][z - 90] = findEl(z);

  return (
    <div className="bg-white text-black min-vh-100 py-4 w-100">
      
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
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {el ? (
                  el.numero === -1 ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#FF1493",
                        borderRadius: "6px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelected(el);
                        setShowModal(true);
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>👆</span>
                      <span style={{ fontSize: "0.8rem" }}>Da click</span>
                    </div>
                  ) : (
                    <ElementCard
                      element={el}
                      onSelect={handleSelect}
                      selected={selected}
                    />
                  )
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal imagen */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Body
          className="bg-white d-flex justify-content-center align-items-center"
          style={{ padding: 0, minHeight: "70vh" }}
        >
          {selected?.imagen && (
            <img
              src={selected.imagen}
              alt="Vista especial"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "12px",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              }}
            />
          )}
        </Modal.Body>
        <Modal.Footer
          className="bg-light border-0 d-flex justify-content-center"
        >
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal info elemento */}
      <Modal show={showInfoModal} onHide={handleCloseInfo} centered>
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
              <strong>Número atómico:</strong> {selected?.numero}
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
        </Modal.Body>

        <Modal.Footer className="bg-light border-0">
          <Button variant="primary" onClick={handleCloseInfo}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PeriodicTableView;
