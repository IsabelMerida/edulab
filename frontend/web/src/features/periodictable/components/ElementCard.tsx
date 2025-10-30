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

const tipoColor: Record<string, string> = {
  "no metal": "#ff9b28",
  "metal alcalino": "#5170ff",
  "metal alcalinoterreo": "#ff3131",
  "metaloide": "#9f7cef",
  "halogeno": "#009cde",
  "gas noble": "#1E4D8F",
  "metal de transicion": "#7B1FA2",
  "lantanido": "#52d0df",
  "actinido": "#FF1493",
  "metal": "#308065",
  "elemento sintetico": "#5FAF89",
};

const ElementCard: React.FC<Props> = ({
  element,
  onSelect,
  selected,
  style,
}) => {
  
  const tipoNormalizado = element.tipo
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const bgColor = tipoColor[tipoNormalizado] ?? "#6C757D"; // Gris si no se encuentra
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
        style={{ lineHeight: 1.1 }}
      >
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