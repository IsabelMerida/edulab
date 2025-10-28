import React, { useState } from 'react';
import { Table, Button, Card, Alert, Form } from 'react-bootstrap';

type Elemento = {
  simbolo: string;
  numero: number;
};

const elements: Elemento[] = [
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
  const [resultado, setResultado] = useState<string>('');

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

  const handleVerificar = () => {
    let resumen = 'Verificación de datos:\n\n';
    elements.forEach((el) => {
      const v = valores[el.simbolo];
      if (!v) {
        resumen += `• ${el.simbolo}: sin datos\n`;
      } else {
        const correcto = v.protones === el.numero;
        resumen += `• ${el.simbolo}: ${
          correcto ? 'Correcto' : 'Protones incorrectos'
        }\n`;
      }
    });
    setResultado(resumen.trim());
  };

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Header
        className="fw-semibold text-white"
        style={{
          background: 'linear-gradient(90deg, #7e5bef, #c084fc)',
          fontSize: '1.1rem',
        }}
      >
        Tabla de Datos Atómicos
      </Card.Header>

      <Card.Body style={{ backgroundColor: '#f5f0ff' }}>
        <Table
          bordered
          responsive
          className="text-center"
          style={{ backgroundColor: '#ffffff', borderColor: '#c084fc' }}
        >
          <thead style={{ backgroundColor: '#d8b4fe' }}>
            <tr>
              <th>Símbolo</th>
              <th>Núm. atómico</th>
              <th>Protones</th>
              <th>Neutrones</th>
              <th>Masa atómica</th>
            </tr>
          </thead>
          <tbody>
            {elements.map((el) => (
              <tr
                key={el.simbolo}
                style={{ transition: '0.3s', cursor: 'pointer' }}
                className="table-hover"
              >
                <td className="fw-bold">{el.simbolo}</td>
                <td>{el.numero}</td>
                <td>
                  <Form.Control
                    type="number"
                    value={valores[el.simbolo]?.protones ?? ''}
                    onChange={(e) =>
                      handleChange(el.simbolo, 'protones', Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={valores[el.simbolo]?.neutrones ?? ''}
                    onChange={(e) =>
                      handleChange(el.simbolo, 'neutrones', Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={valores[el.simbolo]?.masa ?? ''}
                    onChange={(e) =>
                      handleChange(el.simbolo, 'masa', Number(e.target.value))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button
          onClick={handleVerificar}
          style={{ background: 'linear-gradient(90deg, #7e5bef, #c084fc)', border: 'none' }}
        >
          Verificar
        </Button>

        {resultado && (
          <Alert
            style={{
              backgroundColor: '#ede9fe',
              borderColor: '#c084fc',
              color: '#4c1d95',
              marginTop: '1rem',
              whiteSpace: 'pre-wrap',
            }}
          >
            <pre className="mb-0">{resultado}</pre>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default AtomicDataTable;
