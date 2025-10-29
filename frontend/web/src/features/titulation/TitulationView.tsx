// src/features/titulation/TitulacionView.jsx
'use client'; 
import React, { useState, useEffect } from 'react';
import CanvasArea from './components/CanvasArea';
import ControlPanel from './components/ControlPanel';

// (Constantes que definen la simulación)
const VOLUMEN_INICIAL_ANALITO = 10.0;
const MAX_VOLUME_DISPLAY = 50.0;
const DROP_SIZE_ML = 1.0;
const TARGET_VOLUME = 4.0;
const VOLUME_DEACTIVATION_LIMIT = 7.0;

export default function TitulacionView({ onClose }) {
  // --- Estados de React ---
  const [level, setLevel] = useState((VOLUMEN_INICIAL_ANALITO / MAX_VOLUME_DISPLAY) * 100);
  const [currentVolume, setCurrentVolume] = useState(0.0);
  const [mode, setMode] = useState('drop');
  const [pouring, setPouring] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Selecciona un experimento");
  const [staticStateMsg, setStaticStateMsg] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  // --- Funciones de Lógica ---
  function handleStart(tipo) {
    setGameStarted(true);
    console.log(`SIMULACIÓN INICIADA: ${tipo}`);
    resetVisuals(`Titulación iniciada. ¡Comienza a gotear!`);
  }

  function handleAddDrop() {
      if (!gameStarted || isLoading) return; 
      const newVolume = Math.round((currentVolume + DROP_SIZE_ML) * 10) / 10;
      
      if (newVolume > VOLUME_DEACTIVATION_LIMIT) {
          setPouring(false);
          setMessage(`Simulación terminada. Usaste ${newVolume.toFixed(1)} mL.`);
          setGameStarted(false);
          return;
      }

      const totalVisualVolume = VOLUMEN_INICIAL_ANALITO + newVolume;
      setLevel(Math.min(100, (totalVisualVolume / MAX_VOLUME_DISPLAY) * 100));
      setCurrentVolume(newVolume);

      const TARGET_VOLUME = 4.0;
      if (newVolume === TARGET_VOLUME) {
          setMessage(`¡PUNTO DE VIRAJE! Usaste ${newVolume.toFixed(1)} mL.`);
      } else if (newVolume > TARGET_VOLUME && newVolume <= (TARGET_VOLUME + 1.0)) {
           setMessage(`¡Viraje Ideal! El color es estable.`);
      } else if (newVolume > (TARGET_VOLUME + 1.0)) {
          setMessage(`¡Viraje Pasado! El color es muy fuerte.`);
      } else {
          setMessage(`Volumen: ${newVolume.toFixed(1)} mL`);
      }
      setStaticStateMsg("");
  }

  async function handleAskAI() {
    if (isLoading) return;
    setIsLoading(true); setAiResponse("Consultando..."); setStaticStateMsg("");
    try {
      const response = await fetch('http://localhost:5000/api/ia/explain_titulacion');
      if (!response.ok) throw new Error(`Error del servidor de IA (${response.status})`);
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setAiResponse(data.explicacion);
    } catch (error) { console.error("Error con IA:", error); setAiResponse(`Error al conectar con la IA. (${error.message})`); }
    setIsLoading(false);
  }

  function handleCheckState() {
     setStaticStateMsg("Analito: 10.0 mL (desconocido). Titulante: 0.1M (estándar).");
     setMessage("");
  }

  function resetAll() {
    setGameStarted(false);
    resetVisuals("Selecciona un experimento");
  }

  function resetVisuals(msg) {
    setLevel((VOLUMEN_INICIAL_ANALITO / MAX_VOLUME_DISPLAY) * 100);
    setCurrentVolume(0.0);
    setMessage(msg || "Listo para titular");
    setAiResponse("");
    setStaticStateMsg("");
    setMode('drop');
    setPouring(false);
  }

  // --- useEffect para manejar el modo 'stream' (chorro continuo) ---
  useEffect(() => {
    let intervalId = null;
    if (pouring && mode === 'stream' && !isLoading && gameStarted) { 
      handleAddDrop();
      intervalId = setInterval(handleAddDrop, 200);
    }
    return () => {
      if (intervalId) clearInterval(intervalId); 
    };
  }, [pouring, mode, isLoading, gameStarted]); 

  // --- RENDERIZADO (Usa los sub-componentes) ---
  return (
    <div className="absolute top-0 left-0 w-full h-full p-4 md:p-10 bg-blue-950 bg-opacity-90 z-40 flex justify-center items-center backdrop-blur-sm">
      {/* Contenedor que agrupa las dos columnas: SOLUCIÓN DEL LAYOUT */}
      <div style={{
          display: 'grid',
          // [Canvas (Ocupa el espacio restante) | Controles (Fijo en 360px)]
          gridTemplateColumns: '1fr 360px', 
          gap: '32px', 
          padding: '32px',
          maxWidth: '1150px', // Límite de ancho total
          width: '100%',
          alignItems: 'start', // Alinea los elementos a la parte superior
      }}>

        <CanvasArea
          level={level}
          currentVolume={currentVolume}
        />

        <ControlPanel
          isLoading={isLoading}
          mode={mode}
          currentVolume={currentVolume}
          message={message}
          staticState={staticStateMsg}
          aiResponse={aiResponse}
          gameStarted={gameStarted}
          onStart={handleStart}
          onSetMode={setMode}
          onPourMouseDown={() => setPouring(true)}
          onPourMouseUp={() => setPouring(false)}
          onPourMouseLeave={() => setPouring(false)}
          onPourClick={() => (mode === 'drop' ? handleAddDrop() : null)}
          onReset={resetAll}
          onAskAI={handleAskAI}
          onCheckState={handleCheckState}
        />
      </div>

       <button
         onClick={onClose}
         className="absolute top-4 right-6 text-3xl font-bold text-white hover:text-gray-400 z-50 transition-colors"
         aria-label="Cerrar"
       >
         &times;
       </button>
    </div>
  );
}