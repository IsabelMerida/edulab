import React, { useState } from "react";
import {
  Table,
  Button,
  Card,
  Form,
  Toast,
  ToastContainer,
  Alert,
} from "react-bootstrap";

const elements = [
  { simbolo: "H", numero: 1 },
  { simbolo: "He", numero: 2 },
  { simbolo: "O", numero: 8 },
  { simbolo: "F", numero: 9 },
  { simbolo: "Na", numero: 11 },
  { simbolo: "Cl", numero: 17 },
];

type Valores = {
  protones: number;
  neutrones: number;
  masa: number;
};

const AtomicDataTable: React.FC = () => {
  const [valores, setValores] = useState<Record<string, Valores>>({});
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  const handleChange = (
    simbolo: string,
    campo: keyof Valores,
    valor: number
  ) => {
    setValores((prev) => ({
      ...prev,
      [simbolo]: {
        ...prev[simbolo],
        [campo]: valor,
      },
    }));
  };

  const handleVerificar = async () => {
    const errores: string[] = [];

    for (const el of elements) {
      const v = valores[el.simbolo];
      if (!v || v.protones !== el.numero) {
        errores.push(el.simbolo);
      }
    }

    if (errores.length === 0) {
      setToastMessage(
        "🎉 ¡Excelente! Todos los valores son correctos. Sigue así 💪"
      );
      setShowToast(true);
      return;
    }

    try {
      const prompt = `Los siguientes elementos presentan un número incorrecto de protones: ${errores.join(
        ", "
      )}.

Por favor, explica con claridad y de forma alentadora, como si estuvieras guiando a un estudiante en un laboratorio didáctico. Para cada elemento:

- Explica por qué los protones son fundamentales para identificar un elemento químico. (Únicamente al inicio, no en cada elemento.)
- Describe cómo se calcula la masa atómica (suma de protones y neutrones). Un ejemplo único al inicio es suficiente.
- Indica cuál es su número atómico correcto (equivalente a la cantidad de protones).
- Incluye 1 ejempplo práctico de cómo corregir el error para uno de los elementos.
- Finaliza con un mensaje motivador que anime al estudiante a seguir aprendiendo.

El objetivo es que el estudiante entienda el concepto y se sienta acompañado en su proceso de aprendizaje.`;

      const response = await fetch("http://localhost:3001/explicacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errores, prompt }),
      });

      const data = await response.json();
      setToastMessage(
        `Hay errores en: ${errores.join(", ")}.\n\n${
          data.respuesta
        }\n\nRecuerda: El número atómico = protones.`
      );
      setShowToast(true);
    } catch (err) {
      console.error(err);
      setToastMessage(
        "No se pudo conectar con el servidor. Asegúrate de que esté corriendo en localhost:3001."
      );
      setShowToast(true);
    }
  };

  const handleLimpiar = () => {
    setValores({});
    setToastMessage("");
    setShowToast(false);
  };

  return (
    <Card className="mb-1 shadow-sm border-0 rounded-3">
      <Card.Header
        className="fw-semibold text-white text-center"
        style={{
          background: "linear-gradient(90deg, #7e5bef, #c084fc)",
          fontSize: "1.2rem",
          padding: "0.25rem 0",
          margin: 0,
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        Tabla de Datos Atómicos
      </Card.Header>

      <Card.Body style={{ backgroundColor: "#f5f0ff" }}>
        <Alert variant="info" className="mb-3 text-center">
          Aquí puedes practicar cómo calcular la masa atómica (
          <b>protones + neutrones</b>). Luego, verifica tus respuestas con la
          ayuda de IA.
        </Alert>

        <Table borderless responsive className="text-center align-middle">
          <thead>
            <tr style={{ backgroundColor: "#d8b4fe" }}>
              <th>Símbolo</th>
              <th>Núm. atómico</th>
              <th>Protones</th>
              <th>Neutrones</th>
              <th>Masa atómica</th>
            </tr>
          </thead>
          <tbody>
            {elements.map((el) => {
              const v = valores[el.simbolo];
              return (
                <tr key={el.simbolo}>
                  <td className="fw-bold">{el.simbolo}</td>
                  <td>{el.numero}</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={v?.protones ?? ""}
                      onChange={(e) =>
                        handleChange(
                          el.simbolo,
                          "protones",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={v?.neutrones ?? ""}
                      onChange={(e) =>
                        handleChange(
                          el.simbolo,
                          "neutrones",
                          Number(e.target.value)
                        )
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={v?.masa ?? ""}
                      onChange={(e) =>
                        handleChange(el.simbolo, "masa", Number(e.target.value))
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <div className="d-flex gap-2 mt-3">
          <Button
            onClick={handleVerificar}
            style={{
              background: "linear-gradient(90deg, #7e5bef, #c084fc)",
              border: "none",
            }}
          >
            Verificar
          </Button>

          <Button
            variant="secondary"
            onClick={handleLimpiar}
            style={{
              background: "linear-gradient(90deg, #c084fc, #7e5bef)",
              border: "none",
            }}
          >
            Limpiar
          </Button>
        </div>

        {/* Boton de cierre */}
        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            bg="light"
          >
            <Toast.Header closeButton>
              <strong className="me-auto">
                {toastMessage.startsWith("⚠️")
                  ? "Retroalimentación de la IA"
                  : "¡Bien hecho!"}
              </strong>
            </Toast.Header>
            <Toast.Body style={{ whiteSpace: "pre-wrap", color: "#333" }}>
              {toastMessage}
              <div className="text-center mt-3">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setShowToast(false)}
                >
                  Cerrar mensaje
                </Button>
              </div>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Card.Body>
    </Card>
  );
};

export default AtomicDataTable;
