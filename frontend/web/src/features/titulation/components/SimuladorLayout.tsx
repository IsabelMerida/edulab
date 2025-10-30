import React from 'react';
// Define el componente de Layout para el contenido central
// Define el componente de Layout para el contenido central
export default function SimuladorLayout({ children }) {
    return (
        // Contenedor Grid que define la estructura de dos columnas
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 360px', 
            gap: '32px', 
            padding: '32px',
            maxWidth: '1150px', 
            width: '100%',
            alignItems: 'start',
            flexShrink: 0 
        }}>
            {children}
        </div>
    );
}
    