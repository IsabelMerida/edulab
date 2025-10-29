const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/explicacion', async (req, res) => {
  const { errores, prompt } = req.body;

  const finalPrompt = prompt
    ? prompt
    : `Los siguientes elementos tienen un número incorrecto de protones: ${errores.join(', ')}.
Para cada uno, explica brevemente por qué está mal, cuál es su número atómico correcto y cómo corregirlo.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    const respuesta = completion.choices[0].message.content;
    res.json({ respuesta });
  } catch (err) {
    console.error('Error al generar respuesta IA:', err);
    res.status(500).json({ error: 'Error al conectar con OpenAI' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});