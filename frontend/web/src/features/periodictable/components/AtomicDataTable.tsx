import React, { useState } from 'react';
import { Table, Button, Card, Form, Toast, ToastContainer, Alert } from 'react-bootstrap';

const elements = [
  { simbolo: 'He', numero: 2 },
  { simbolo: 'F', numero: 9 },
  { simbolo: 'O', numero: 8 },
  { simbolo: 'Na', numero: 11 },
  { simbolo: 'Cl', numero: 17 },
];

type Valores = {
  protones: number;
  neutrones: number;
  masa: number;
};

const AtomicDataTable: React.FC = () => {
  const [valores, setValores] = useState<Record<string, Valores>>({});
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  const handleChange = (simbolo: string, campo: keyof Valores, valor: number) => {
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
      setToastMessage('¡Perfecto! Todos los valores son correctos. 🎉');
      setShowToast(true);
      return;
    }

    try {
      // IA: 
      const prompt = `Los siguientes elementos tienen un número incorrecto de protones: ${errores.join(', ')}.

Por favor, explica para cada uno:
- Qué está mal en el número de protones ingresado.
- Cuál es su número atómico correcto.
- Cómo se calcula la masa atómica usando protones y neutrones.
- Anima al estudiante a seguir aprendiendo, como lo haría la Fábrica de Átomos de la UNAM.

Usa un tono claro y motivador. Ayuda al estudiante a entender que:
- El símbolo es la abreviatura del elemento químico.
- El número atómico representa la cantidad de protones y define la identidad del elemento.
- Los protones son partículas con carga positiva que se encuentran en el núcleo.
- Los neutrones no tienen carga y se calculan restando los protones a la masa atómica.
- La masa atómica se obtiene sumando protones y neutrones.

Incluye ejemplos si es útil, como: "Si el helio tiene 2 protones y 2 neutrones, su masa atómica es 4."

Termina con una frase de ánimo para que el estudiante siga explorando la estructura de los átomos."`;

      const response = await fetch('http://localhost:3001/explicacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errores, prompt }),
      });

      const data = await response.json();
      setToastMessage(`⚠️ Hay errores en: ${errores.join(', ')}.\n\n${data.respuesta}\n\n¡Sigue adelante, lo estás haciendo muy bien! 💪`);
      setShowToast(true);
    } catch (err) {
      console.error(err);
      setToastMessage('⚠️ Error al conectar con el servidor. Revisa que esté corriendo en localhost:3001.');
      setShowToast(true);
    }
  };

  const handleLimpiar = () => {
    setValores({});
    setToastMessage('');
    setShowToast(false);
  };

  return (
    <Card className="mb-4 shadow-sm border-0 rounded-3">
      <Card.Header
        className="fw-semibold text-white"
        style={{ background: 'linear-gradient(90deg, #7e5bef, #c084fc)', fontSize: '1.2rem' }}
      >
        Tabla de Datos Atómicos
      </Card.Header>

      <Card.Body style={{ backgroundColor: '#f5f0ff' }}>
        {/* Leyenda explicativa IA */}
        <Alert variant="info" className="mb-3">
          Aquí podrás entender cómo se calcula la masa atómica (protones + neutrones) y verificar tus respuestas con la ayuda de inteligencia artificial. ¡Inténtalo!
        </Alert>

        <Table borderless responsive className="text-center align-middle">
          <thead>
            <tr style={{ backgroundColor: '#d8b4fe' }}>
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
                      value={v?.protones ?? ''}
                      onChange={(e) => handleChange(el.simbolo, 'protones', Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={v?.neutrones ?? ''}
                      onChange={(e) => handleChange(el.simbolo, 'neutrones', Number(e.target.value))}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="number"
                      value={v?.masa ?? ''}
                      onChange={(e) => handleChange(el.simbolo, 'masa', Number(e.target.value))}
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
            style={{ background: 'linear-gradient(90deg, #7e5bef, #c084fc)', border: 'none' }}
          >
            Verificar
          </Button>

          <Button
            variant="secondary"
            onClick={handleLimpiar}
            style={{ background: 'linear-gradient(90deg, #c084fc, #7e5bef)', border: 'none' }}
          >
            Limpiar
          </Button>
        </div>

        <ToastContainer position="top-end" className="p-3">
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={7000}
            autohide
            bg="light"
          >
            <Toast.Header>
              <strong className="me-auto">{toastMessage.startsWith('⚠️') ? 'Retroalimentación' : '¡Bien hecho!'}</strong>
            </Toast.Header>
            <Toast.Body style={{ whiteSpace: 'pre-wrap', color: '#333' }}>
              {toastMessage}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Card.Body>
    </Card>
  );
};

export default AtomicDataTable;