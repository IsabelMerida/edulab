// src/features/titulation/TitulacionView.tsx (ASUMIMOS EL CAMBIO DE EXTENSIÓN)
'use client';
import React, { useState, useEffect } from 'react';
import CanvasArea from './components/CanvasArea'; // Se pueden omitir las extensiones .tsx en la importación
import ControlPanel from './components/ControlPanel'; // Se pueden omitir las extensiones .tsx en la importación

// 1. DEFINICIÓN DE INTERFAZ (Tipado de las Props)
interface TitulacionViewProps {
    onClose: () => void; // onClose es una función que no acepta argumentos y no devuelve nada
}

// (Constantes fijas para el juego)
const VOLUMEN_INICIAL_ANALITO = 10.0;
const MAX_VOLUME_DISPLAY = 50.0;
const DROP_SIZE_ML = 1.0;
const TARGET_VOLUME = 4.0;
const VOLUME_DEACTIVATION_LIMIT = 7.0;

// 2. USO DE React.FC (React Functional Component) para tipar el componente
const TitulacionView: React.FC<TitulacionViewProps> = ({ onClose }) => {
    // --- Estados de React ---
    // TypeScript infiere correctamente el tipo (number, number, string, boolean, etc.)
    const [level, setLevel] = useState((VOLUMEN_INICIAL_ANALITO / MAX_VOLUME_DISPLAY) * 100);
    const [currentVolume, setCurrentVolume] = useState(0.0);
    const [mode, setMode] = useState<'drop' | 'stream'>('drop'); // Tipo string literal para mayor seguridad
    const [pouring, setPouring] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("Selecciona un experimento");
    const [staticStateMsg, setStaticStateMsg] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [gameStarted, setGameStarted] = useState(false);

    // --- Funciones de Lógica ---
    
    function handleStart(tipo: string) { // Tipado del argumento 'tipo'
        setGameStarted(true);
        console.log(`SIMULACIÓN INICIADA: ${tipo}`);
        resetVisuals(`Titulación iniciada. ¡Comienza a gotear!`);
    }

    // Usamos useCallback para estabilizar handleAddDrop ya que se usa en useEffect
    const handleAddDrop = React.useCallback(() => {
        if (!gameStarted || isLoading) return; 

        //... (El resto de la lógica de handleAddDrop es la misma)
        const newVolume = Math.round((currentVolume + DROP_SIZE_ML) * 10) / 10;
        
        if (newVolume > 15.0) {
            setPouring(false);
            setMessage("Volumen máximo visual alcanzado (15.0 mL).");
            return;
        }

        const totalVisualVolume = VOLUMEN_INICIAL_ANALITO + newVolume;
        setLevel(Math.min(100, (totalVisualVolume / MAX_VOLUME_DISPLAY) * 100));
        setCurrentVolume(newVolume);

        // Lógica de mensajes (4.0 mL es el punto clave)
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

        // Lógica de detención
        if (newVolume >= VOLUME_DEACTIVATION_LIMIT) {
            setGameStarted(false);
            setMessage(`Simulación terminada. Usaste ${newVolume.toFixed(1)} mL.`);
        }
    }, [currentVolume, gameStarted, isLoading]); // Dependencias del estado para useCallback


    async function handleAskAI() {
        if (isLoading) return;
        setIsLoading(true); setAiResponse("Consultando..."); setStaticStateMsg("");
        try {
            const response = await fetch('http://localhost:5000/api/ia/explain_titulacion');
            if (!response.ok) throw new Error(`Error del servidor de IA (${response.status})`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            setAiResponse(data.explicacion);
        } catch (error: unknown) {
            console.error("Error con IA:", error);
            const errMsg = error instanceof Error ? error.message : String(error);
            setAiResponse(`Error al conectar con la IA. (${errMsg})`);
        }
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

    function resetVisuals(msg: string) { // Tipado del argumento 'msg'
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
        let intervalId: NodeJS.Timeout | null = null; // Tipado para clearInterval
        if (pouring && mode === 'stream' && !isLoading && gameStarted) { 
            // handleAddDrop(); // No es necesario llamar inmediatamente si setInterval es rápido
            intervalId = setInterval(handleAddDrop, 200);
        }
        return () => {
            if (intervalId) clearInterval(intervalId); 
        };
    // handleAddDrop está estable gracias a useCallback
    }, [pouring, mode, isLoading, gameStarted, handleAddDrop]); 

    // --- RENDERIZADO (Usa los componentes) ---
    return (
        // ... (El resto del renderizado es el mismo)
        <div className="absolute top-0 left-0 w-full h-full p-4 md:p-10 bg-blue-950 bg-opacity-90 z-40 flex justify-center items-center backdrop-blur-sm">
            {/* Contenedor que agrupa las dos columnas */}
            <div className="flex flex-col md:flex-row gap-8 p-8 w-full max-w-6xl bg-transparent">

                {/* 1. Componente CanvasArea */}
                <CanvasArea
                    level={level}
                    currentVolume={currentVolume}
                />

                {/* 2. Componente ControlPanel */}
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
}; // 3. El componente se define como una constante
// 4. La exportación por defecto funciona correctamente
export default TitulacionView;