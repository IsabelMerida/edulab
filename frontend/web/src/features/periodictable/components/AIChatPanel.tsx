import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';

const AIChatPanel: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse('');

    const prompt = `Responde esta pregunta de forma clara y motivadora, como si fueras un tutor de química. Explica conceptos como número atómico, masa atómica, configuración electrónica, y anima al estudiante a seguir explorando la tabla periódica.

Pregunta: ${question}`;

    try {
      const res = await fetch('http://localhost:3001/explicacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResponse(data.respuesta);
    } catch (err) {
      console.error(err);
      setResponse('⚠️ No se pudo obtener respuesta de la IA. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleClear = () => {
    setQuestion('');
    setResponse('');
  };

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Header className="bg-primary text-white fw-semibold">
        🤖 IA: Estoy aquí para ayudarte con preguntas sobre la tabla periódica.
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

        <div className="d-flex gap-2">
          <Button variant="primary" onClick={handleAsk} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Preguntar
          </Button>

          <Button variant="secondary" onClick={handleClear}>
            Limpiar
          </Button>
        </div>

        {response && (
          <Card className="mt-4 border-0 shadow-sm">
            <Card.Body className="bg-white text-dark">
              <h6 className="fw-bold text-success mb-2">Respuesta IA</h6>
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
};

export default AIChatPanel;