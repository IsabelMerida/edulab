import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

const AIChatPanel: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const handleAsk = async () => {
    // Integración con OpenAI
    setResponse(`Respuesta simulada para: "${question}"`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Header className="bg-primary text-white fw-semibold">
        🤖 IA: Pregúntame algo sobre los elementos
      </Card.Header>

      <Card.Body className="bg-light">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Ej. ¿Qué es el flúor?"
            value={question}
            onChange={handleChange}
            className="border-primary"
          />
        </Form.Group>

        <Button variant="primary" onClick={handleAsk}>
          Preguntar
        </Button>

        {response && (
          <Card className="mt-4 border-0 shadow-sm">
            <Card.Body className="bg-white text-dark">
              <h6 className="fw-bold text-success mb-2">Respuesta IA</h6>
              <p className="mb-0">{response}</p>
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
};

export default AIChatPanel;