import React from "react";
import { Card } from "react-bootstrap";

export type Elemento = {
  numero: number;
  simbolo: string;
  nombre: string;
  masa: number;
  tipo: string;
  electrones: string;
  grupo: number;
  periodo: number;
};

type Props = {
  element: Elemento;
  selected?: Elemento;
  onSelect: (element: Elemento) => void;
  style?: React.CSSProperties;
};

const ElementCard: React.FC<Props> = ({
  element,
  onSelect,
  selected,
  style,
}) => {
  const tipoColor: Record<string, string> = {
    "no metal": "#FF4C4C",
    "metal alcalino": "#FFA500",
    "metal alcalinotérreo": "#FFD700",
    metaloide: "#00FFFF",
    halogeno: "#00BFFF",
    "gas noble": "#BF00FF",
    "metal de transicion": "#DA70D6",
    lantanido: "#FF7F50",
    actinido: "#FF1493",
    metal: "#A9A9A9",
    "elemento sintetico": "#8A2BE2",
  };

  const tipo = element.tipo
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const bgColor = tipoColor[tipo] ?? "#6C757D";
  const isSelected = selected?.numero === element.numero;

  // Ocultar elementos vacíos
  if (
    !element ||
    !element.numero ||
    !element.simbolo ||
    !element.nombre ||
    element.numero === 0
  )
    return null;

  return (
    <Card
      style={{
        width: "75px",
        height: "70px",
        backgroundColor: bgColor,
        color: "white",
        transform: isSelected ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.2s ease-in-out",
        zIndex: isSelected ? 10 : 1,
        cursor: "pointer",
        borderRadius: "4px",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: isSelected ? "0 0 10px rgba(255,255,255,0.5)" : "none",
        ...style,
      }}
      onClick={() => onSelect(element)}
      className="text-center"
    >
      <Card.Body className="p-1 d-flex flex-column justify-content-center align-items-center">
        <div className="fw-bold" style={{ fontSize: "clamp(9px, 1vw, 11px)" }}>
          {element.numero}
        </div>
        <div style={{ fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 600 }}>
          {element.simbolo}
        </div>
        <div style={{ fontSize: "clamp(8px, 1vw, 10px)", textAlign: "center" }}>
          {element.nombre}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ElementCard;
