import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatbotService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // usa variable de entorno
    });
  }

  async getResponse(userMessage: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
Eres un asistente educativo para un laboratorio virtual de química llamado EDULAB.
Explica de forma simple qué ocurre en los experimentos, da consejos de seguridad,
y sugiere experimentos caseros parecidos que se puedan hacer con materiales comunes.
`,
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      return completion.choices[0].message.content || 'No tengo una respuesta en este momento.';
    } catch (error) {
      console.error(error);
      return 'Ocurrió un error al procesar la respuesta.';
    }
  }
}
