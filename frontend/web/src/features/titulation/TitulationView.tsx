'use client'; 
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";
// ¡CORRECCIÓN CRÍTICA DE IMPORTACIÓN DE ICONOS!
import { FaFlask, FaAtom, FaVial } from "react-icons/fa"; // Importa los iconos de FA
import { GiAtom } from "react-icons/gi"; // Importa los iconos de GI
import CanvasArea from './components/CanvasArea';
import ControlPanel from './components/ControlPanel';

// (Constantes fijas para el juego)
const VOLUMEN_INICIAL_ANALITO = 10.0;
const MAX_VOLUME_DISPLAY = 50.0;
const DROP_SIZE_ML = 0.2; // Avance pequeño
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
  
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 

  const handleAddDrop = useCallback(() => {
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
  }, [gameStarted, isLoading, currentVolume]); 

  // handleStart asíncrono para sincronización de botones
  const handleStart = useCallback(async (tipo) => {
    setIsLoading(true); 
    setGameStarted(false); 
    resetVisuals(`Iniciando titulación de ${tipo}...`);

    await delay(100); 

    setGameStarted(true);
    resetVisuals(`Titulación iniciada. ¡Comienza a gotear!`);
    setIsLoading(false); 
  }, [setIsLoading, setGameStarted, resetVisuals]);

  const handleAskAI = useCallback(async () => {
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
  }, [isLoading, setAiResponse, setStaticStateMsg, setIsLoading]);

  function handleCheckState() {
     setStaticStateMsg("Analito: 10.0 mL Acido clorhídrico. Titulante: 0.1M NaOH.");
     setMessage("");
  }

  function resetAll() {
    setGameStarted(false);
    resetVisuals("Selecciona un experimento");
  }

  function resetVisuals(msg: string) {
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
    let intervalId: NodeJS.Timeout | null = null;
    
    // Si el modo es 'stream' y 'pouring' es true, inicia el bucle.
    if (mode === 'stream' && pouring && !isLoading && gameStarted) { 
      // Llamada inicial inmediata
      handleAddDrop(); 
      // El intervalo se encarga del resto
      intervalId = setInterval(handleAddDrop, 100); 
    }
    
    return () => {
      // Limpieza: Detiene el intervalo cuando el usuario suelta el botón o el juego termina
      if (intervalId) clearInterval(intervalId); 
    };
  // Dependencias clave: ahora debe incluir handleAddDrop porque ya no es estable.
  }, [mode, pouring, isLoading, gameStarted, handleAddDrop]); 

  // --- RENDERIZADO (Usa el layout de página completa) ---
  return (
    // CONTENEDOR PRINCIPAL: Flexbox vertical de alto 100vh
    <div
      className="bg-light d-flex flex-column w-100" // Añadimos w-100 para Bootstrap
      style={{
        minHeight: "100vh",
        overflowX: "hidden", 
        // overflowY: "auto", <--- No es necesario aquí, lo manejamos en main
      }}
    >
      {/* 1. Navbar FIJA */}
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow">
        <Container>
          <Navbar.Brand href="/" className="fw-bold d-flex align-items-center">
            <GiAtom size={55} strokeWidth={2} color="#00FFFF" style={{ marginRight: "10px" }} />
            EduLab
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/tabla" className="d-flex align-items-center gap-2"><FaAtom /> Tabla Periódica</Nav.Link>
              <Nav.Link href="/mezclas" className="d-flex align-items-center gap-2"><FaFlask /> Mezclas</Nav.Link>
              <Nav.Link href="/titulation" className="d-flex align-items-center gap-2"><FaVial /> Titulación</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. Contenido principal (Simulador) */}
      <main 
        // CLAVE: El contenido central ocupa el espacio restante (flex-grow-1)
        // Y maneja el scroll interno con overflowY: auto
        className="flex-grow-1 d-flex justify-content-center align-items-start"
        style={{ marginTop: "56px", paddingBottom: "56px", overflowY: "auto" }} 
      >

        {/* Contenedor Grid del Simulador (ya con las dos columnas) */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 360px', 
            gap: '32px', 
            padding: '32px',
            maxWidth: '1150px', 
            width: '100%',
            alignItems: 'start',
            // Aseguramos que este contenedor principal no se estire innecesariamente
            flexShrink: 0 
        }}>

          <CanvasArea level={level} currentVolume={currentVolume} />

          <ControlPanel
            isLoading={isLoading} mode={mode} currentVolume={currentVolume} message={message}
            staticState={staticStateMsg} aiResponse={aiResponse} gameStarted={gameStarted}
            onStart={handleStart} onSetMode={setMode}
            // ¡CORRECCIÓN FINAL DE GOTEOS!
            // Si el modo es 'stream', activa el pouring (chorro).
            // Si el modo es 'drop', llama a handleAddDrop (goteo único).
            onPourMouseDown={() => (mode === 'stream' ? setPouring(true) : handleAddDrop())} 
            onPourMouseUp={() => setPouring(false)}
            onPourMouseLeave={() => setPouring(false)}
            // Ya no es necesario el onPourClick del botón principal
            onReset={resetAll} onAskAI={handleAskAI} onCheckState={handleCheckState}
          />
        </div>
      </main>

      {/* 3. Footer FIJO */}
      <footer 
        // CLAVE: La clase fixed-bottom asegura que se quede abajo
        className="bg-dark text-light text-center py-3 fixed-bottom w-100 shadow-sm"
        style={{ height: '56px' }} // Altura fija del footer
      >
        <Container>
          <small>© {new Date().getFullYear()} The 404s. Todos los derechos reservados.</small>
        </Container>
      </footer>
    </div>
  );
}
// src/features/titulation/components/ControlPanel.jsx (Tarjeta de Bureta)


