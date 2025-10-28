import React, { useState} from "react";
import type { ChangeEvent } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { elements } from "../data/elements";

interface Elemento {
  simbolo: string;
  nombre: string;
  numero: number;
}

const ElectronConfigPanel: React.FC = () => {
  const [symbol, setSymbol] = useState<string>("");
  const [config, setConfig] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [elementName, setElementName] = useState<string>("");

  const handleGetConfig = () => {
    const el: Elemento | undefined = elements.find(
      (e) => e.simbolo.toLowerCase() === symbol.trim().toLowerCase()
    );

    if (!el) {
      setError("Elemento no encontrado. Intenta con símbolos como H, O, Na...");
      setConfig("");
      setElementName("");
      return;
    }

    setElementName(el.nombre);
    setError("");
    setConfig(generateElectronConfig(el.numero));
  };

  const handleClear = () => {
    setSymbol("");
    setConfig("");
    setError("");
    setElementName("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value.toUpperCase());
  };

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Header
        className="fw-semibold text-white"
        style={{
          background: "linear-gradient(90deg, #7e5bef, #c084fc)",
        }}
      >
        ⚛ Configuración electrónica
      </Card.Header>

      <Card.Body style={{ backgroundColor: "#f5f0ff" }}>
        <Form.Control
          type="text"
          placeholder="Ingresa un símbolo (ej. O)"
          value={symbol}
          onChange={handleChange}
          className="mb-3 border-primary"
        />

        <div className="d-flex gap-2 mb-2">
          <Button
            onClick={handleGetConfig}
            style={{
              background: "linear-gradient(90deg, #7e5bef, #c084fc)",
              border: "none",
            }}
          >
            Obtener configuración
          </Button>
          <Button variant="outline-secondary" onClick={handleClear}>
            Limpiar
          </Button>
        </div>

        {elementName && <p className="fw-semibold">Elemento: {elementName} ({symbol})</p>}

        {error && <Alert variant="danger">{error}</Alert>}

        {config && (
          <pre
            className="mt-3 p-3 bg-white border rounded shadow-sm text-dark"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {config}
          </pre>
        )}
      </Card.Body>
    </Card>
  );
};

function generateElectronConfig(atomicNumber: number): string {
  const orbitalOrder = [
    { orbital: "1s", max: 2 },
    { orbital: "2s", max: 2 },
    { orbital: "2p", max: 6 },
    { orbital: "3s", max: 2 },
    { orbital: "3p", max: 6 },
    { orbital: "4s", max: 2 },
    { orbital: "3d", max: 10 },
    { orbital: "4p", max: 6 },
    { orbital: "5s", max: 2 },
    { orbital: "4d", max: 10 },
    { orbital: "5p", max: 6 },
    { orbital: "6s", max: 2 },
    { orbital: "4f", max: 14 },
    { orbital: "5d", max: 10 },
    { orbital: "6p", max: 6 },
    { orbital: "7s", max: 2 },
    { orbital: "5f", max: 14 },
    { orbital: "6d", max: 10 },
    { orbital: "7p", max: 6 },
  ];

  let remaining = atomicNumber;
  let result = `Número atómico (Z) = ${atomicNumber}\n\nOrden de llenado de orbitales:\n`;

  for (const { orbital, max } of orbitalOrder) {
    if (remaining <= 0) break;
    const electrons = Math.min(remaining, max);
    result += `• ${orbital} → ${electrons} electron${electrons > 1 ? "es" : ""}\n`;
    remaining -= electrons;
  }

  return result.trim();
}

export default ElectronConfigPanel;