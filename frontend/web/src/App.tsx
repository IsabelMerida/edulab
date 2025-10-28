import React, { useState } from 'react';
import MezclasView from './features/mixes/MezclasView';
import PastaDientesView from './features/mixes/PastaDientesView';
import './App.css';

type ExperimentView = 'glicerina' | 'pasta-dientes';

function App() {
  const [currentView, setCurrentView] = useState<ExperimentView>('glicerina');

  return (
    <div className="App">
      {/* Barra de navegación */}
      <div style={{
        padding: '15px 20px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '3px solid rgba(255, 107, 107, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <button
          onClick={() => setCurrentView('glicerina')}
          style={{
            padding: '12px 24px',
            background: currentView === 'glicerina' 
              ? 'linear-gradient(135deg, #ff6b6b, #ffd93d)' 
              : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
            color: currentView === 'glicerina' ? 'white' : '#4a5568',
            border: 'none',
            borderRadius: '25px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: currentView === 'glicerina' ? '0 4px 15px rgba(255, 107, 107, 0.4)' : 'none'
          }}
        >
          🔥 Glicerina + KMnO₄
        </button>
        <button
          onClick={() => setCurrentView('pasta-dientes')}
          style={{
            padding: '12px 24px',
            background: currentView === 'pasta-dientes' 
              ? 'linear-gradient(135deg, #4d96ff, #6bcf7f)' 
              : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
            color: currentView === 'pasta-dientes' ? 'white' : '#4a5568',
            border: 'none',
            borderRadius: '25px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: currentView === 'pasta-dientes' ? '0 4px 15px rgba(77, 150, 255, 0.4)' : 'none'
          }}
        >
          🐘 Pasta de Dientes de Elefante
        </button>
      </div>

      {/* Vista actual */}
      {currentView === 'glicerina' && <MezclasView />}
      {currentView === 'pasta-dientes' && <PastaDientesView />}
    </div>
  );
}

export default App;