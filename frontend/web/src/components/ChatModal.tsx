import React, { useState, useRef, useEffect } from "react";

interface ChatModalProps {
  context?: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ context }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string; auto?: boolean }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ✅ Función optimizada: solo hace scroll si estás cerca del final
  const scrollToBottomIfNeeded = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 80;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottomIfNeeded();
  }, [messages]);

  // Procesar eventos automáticos del contexto
  useEffect(() => {
    if (context) {
      try {
        const data = JSON.parse(context);
        const eventos = data.eventosAutomaticos || [];
        
        eventos.forEach((evento: string) => {
          if (!messages.some(msg => msg.text === evento && msg.auto)) {
            const nuevoMensaje = { 
              sender: "system", 
              text: evento, 
              auto: true 
            };
            setMessages(prev => [...prev, nuevoMensaje]);
          }
        });
      } catch (error) {
        console.error('Error procesando contexto:', error);
      }
    }
  }, [context, messages]);

  // Respuestas estáticas
  const getStaticResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes('qué pasa') || message.includes('estado'))
      return "🔍 **Sistema de monitoreo activo**\nEl chat muestra cada etapa del experimento automáticamente.";
    if (message.includes('reacción') || message.includes('química'))
      return "🧪 **Reacción redox:** Glicerina (reductor) + KMnO₄ (oxidante) → CO₂ + H₂O + K₂CO₃ + Mn₂O₃ + energía.";
    if (message.includes('glicerina'))
      return "💧 **Glicerina (C₃H₈O₃):** Alcohol trihidroxilado, soluble en agua, agente reductor.";
    if (message.includes('permanganato'))
      return "🧪 **KMnO₄:** Oxidante fuerte, color púrpura por el ion MnO₄⁻, se reduce a Mn²⁺ o MnO₂.";
    if (message.includes('temperatura') || message.includes('calor'))
      return "🌡️ **Temperatura crítica:** ≥35°C. Reacción exotérmica que libera calor y luz.";
    if (message.includes('llama') || message.includes('lila'))
      return "🔥 **Llama lila:** Emisión del potasio excitado (K⁺) a 766.5 nm y 769.9 nm.";
    if (message.includes('seguro') || message.includes('peligro'))
      return "⚠️ **Precauciones:**\n• Lentes de seguridad\n• Cantidades pequeñas\n• Área ventilada\n• Guantes químicos.";
    if (message.includes('hola'))
      return "👋 **¡Bienvenido!** Soy tu asistente. Monitoreo el experimento y muestro cada etapa.";
    if (message.includes('etapa') || message.includes('fase'))
      return "📋 **Etapas:**\n1. Mezcla\n2. Calentamiento\n3. Humo\n4. Ignición\n5. Residuo.";

    return "🤔 Pregúntame sobre: reactivos, seguridad, etapas, temperatura o procedimiento.";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botResponse = getStaticResponse(input);
      const aiMessage = { sender: "bot", text: botResponse };
      setMessages((prev) => [...prev, aiMessage]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div
      className="chat-container"
      style={{
        background: "#1e293b",
        borderRadius: "12px",
        padding: "20px",
        color: "white",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // ✅ Evita saltos visuales
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#2563eb",
          color: "white",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "12px",
          flexShrink: 0,
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold" }}>
          🤖 Monitor de Experimento
        </h3>
        <div style={{ fontSize: "12px", opacity: 0.9 }}>
          Mensajes automáticos + Asistente
        </div>
      </div>

      {/* Mensajes */}
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          padding: "12px",
          overflowY: "auto",
          background: "#0f172a",
          borderRadius: "8px",
          marginBottom: "12px",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#94a3b8",
              marginTop: "20px",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
              🧪 Sistema de Monitoreo Activo
            </p>
            <p>El chat mostrará automáticamente:</p>
            <ul
              style={{
                textAlign: "left",
                fontSize: "12px",
                marginTop: "10px",
              }}
            >
              <li>✅ Cuando agregues reactivos</li>
              <li>🌡️ Al alcanzar temperatura crítica</li>
              <li>💨 Cuando comience el humo</li>
              <li>🔥 Durante la ignición</li>
              <li>◇ Al completarse la reacción</li>
            </ul>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                margin: "8px 0",
                padding: "8px 12px",
                borderRadius: "8px",
                maxWidth: "90%",
                background:
                  msg.sender === "user"
                    ? "#2563eb"
                    : msg.sender === "system"
                    ? "#7c3aed"
                    : "#334155",
                color: "white",
                marginLeft: msg.sender === "user" ? "auto" : "0",
                border: msg.sender === "system" ? "1px solid #a78bfa" : "none",
                fontSize: "14px",
                whiteSpace: "pre-line",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  marginBottom: "2px",
                  opacity: 0.8,
                }}
              >
                {msg.sender === "user"
                  ? "👤 Tú"
                  : msg.sender === "system"
                  ? "⚡ SISTEMA"
                  : "🤖 Asistente"}
              </div>
              <div>{msg.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Pregunta sobre el experimento..."
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid #475569",
            borderRadius: "6px",
            fontSize: "14px",
            color: "#1f2937",
            background: "white",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatModal;
