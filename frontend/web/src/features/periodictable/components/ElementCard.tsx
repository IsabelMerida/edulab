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
    metaloide: "#2D882D",
    halogeno: "#00BFFF",
    "gas noble": "#BF00FF",
    "metal de transicion": "#DA70D6",
    lantanido: "#FF7F50",
    actinido: "#FF1493",
    metal: "#182CC5",
    "elemento sintetico": "#8A2BE2",
  };

  const tipo = element.tipo
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const bgColor = tipoColor[tipo] ?? "#6C757D";
  const isSelected = selected?.numero === element.numero;

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
        borderRadius: "6px",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: isSelected ? "0 0 10px rgba(255,255,255,0.6)" : "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        ...style,
      }}
      onClick={() => onSelect(element)}
    >
      <Card.Body
        className="p-0 d-flex flex-column justify-content-center align-items-center"
        style={{
          lineHeight: 1.1,
        }}
      >
        {/* Número atómico */}
        <div
          className="fw-bold"
          style={{
            fontSize: "11px",
            marginBottom: "2px",
            textShadow: "0 0 2px rgba(0,0,0,0.3)",
          }}
        >
          {element.numero}
        </div>

        {/* Símbolo */}
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            lineHeight: 1,
            textShadow: "0 0 3px rgba(0,0,0,0.4)",
          }}
        >
          {element.simbolo}
        </div>

        {/* Nombre */}
        <div
          style={{
            fontSize: "9px",
            marginTop: "2px",
            textAlign: "center",
            opacity: 0.9,
            lineHeight: 1,
          }}
        >
          {element.nombre}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ElementCard;