import { useState } from 'react';

export type Elemento = {
  numero: number;
  simbolo: string;
  nombre: string;
  tipo: string;
  grupo: number;
  periodo: number;
  masa: number;
  electrones: string;
};

export function useElementInfo() {
  const [info, setInfo] = useState<string>('');

  const generateAIInfo = async (element: Elemento): Promise<void> => {
    // Más adelante se conectará con OpenAI
    const explanation = `El ${element.nombre} (${element.simbolo}) es un ${element.tipo.toLowerCase()} con una masa atómica de ${element.masa}.`;
    setInfo(explanation);
  };

  return { info, generateAIInfo };
}