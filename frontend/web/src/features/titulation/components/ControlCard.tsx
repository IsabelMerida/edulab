// src/features/titulation/components/ControlCard.jsx
export default function ControlCard({ title, children }) {
  // Estilos que coinciden con tu HTML original
  const cardStyle = {
    background: 'linear-gradient(180deg,#0b1220, #08101a)',
    padding: '12px',
    borderRadius: '10px',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
    color: '#e6eef8',
    marginBottom: '12px'
  };
  const titleStyle = { margin: '0 0 8px 0', fontSize: '14px', color: '#9fb0d6' };

  return (
    <div style={cardStyle}>
      {title && <h4 style={titleStyle}>{title}</h4>}
      {children}
    </div>
  );
}