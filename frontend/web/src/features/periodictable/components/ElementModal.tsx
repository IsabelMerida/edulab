import React from "react";
import { Modal, Button } from "react-bootstrap";
import type { Elemento } from "./ElementCard";

type Props = {
  show: boolean;
  onHide: () => void;
  element: Elemento | null;
  aiInfo?: string; // opcional con IA
};

const ElementModal: React.FC<Props> = ({ show, onHide, element, aiInfo }) => {
  if (!element) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: "#1e1e2f",
          color: "#fff",
          borderBottom: "1px solid #444",
        }}
      >
        <Modal.Title>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {element.simbolo}
          </span>{" "}
          <span style={{ fontSize: "1rem", opacity: 0.8 }}>
            {element.nombre}
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          backgroundColor: "#2c2c3c",
          color: "#eee",
          padding: "1.5rem",
          fontSize: "0.95rem",
          lineHeight: "1.6",
        }}
      >
        <div
          style={{
            backgroundColor: "#3b3b4f",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
            boxShadow: "0 0 6px rgba(0,0,0,0.3)",
          }}
        >
          <h5 className="text-white mb-3">🔬 Propiedades del elemento</h5>
          <p><strong>Masa atómica:</strong> {element.masa}</p>
          <p><strong>Número de electrones:</strong> {element.numero}</p>
          <p><strong>Configuración electrónica:</strong> {element.electrones}</p>
          <p><strong>Tipo:</strong> {element.tipo}</p>
          <p><strong>Grupo:</strong> {element.grupo}</p>
          <p><strong>Período:</strong> {element.periodo}</p>
        </div>

        {aiInfo && (
          <div
            style={{
              backgroundColor: "#44445a",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 0 6px rgba(0,0,0,0.3)",
            }}
          >
            <h5 className="text-white mb-3">🤖 Tutor IA</h5>
            <p>{aiInfo}</p>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer
        style={{
          backgroundColor: "#1e1e2f",
          borderTop: "1px solid #444",
        }}
      >
        <Button variant="light" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ElementModal;