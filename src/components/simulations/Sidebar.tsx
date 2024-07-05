import React from 'react';

const sidebarStyle = {
  position: 'absolute' as const,
  top: '90px',
  left: '10px',
  padding: '15px',
  background: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const componentStyle = {
  padding: '10px',
  margin: '5px 0',
  background: '#f0f0f0',
  border: '1px solid #ddd',
  borderRadius: '5px',
  cursor: 'move',
  display: 'flex',
  alignItems: 'center',
  fontSize: '14px',
};

const iconStyle = {
  marginRight: '10px',
  fontSize: '20px',
};

export const Sidebar = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <aside style={sidebarStyle}>
        <div>Drag components to create a circuit:</div>
        <div style={componentStyle} onDragStart={(event) => onDragStart(event, 'battery')} draggable>
          <span style={iconStyle}>🔋</span> Battery
        </div>
        <div style={componentStyle} onDragStart={(event) => onDragStart(event, 'led')} draggable>
          <span style={iconStyle}>💡</span> LED
        </div>
        <div style={componentStyle} onDragStart={(event) => onDragStart(event, 'switch')} draggable>
          <span style={iconStyle}>⚡</span> Switch
        </div>
        <div style={componentStyle} onDragStart={(event) => onDragStart(event, 'resistor')} draggable>
          <span style={iconStyle}>〰️</span> Resistor
        </div>
        <div style={componentStyle} onDragStart={(event) => onDragStart(event, 'capacitor')} draggable>
          <span style={iconStyle}>| |</span> Capacitor
        </div>
        <div style={componentStyle} onDragStart={(event) => onDragStart(event, 'inductor')} draggable>
          <span style={iconStyle}>🧲</span> Inductor
        </div>
        <div style={componentStyle} onDragStart={(event) => onDragStart(event, 'ammeter')} draggable>
          <span style={iconStyle}>🔀</span> Ammeter
        </div>
        <div style={componentStyle} onDragStart={(event) => onDragStart(event, 'voltmeter')} draggable>
          <span style={iconStyle}>📏</span> Voltmeter
        </div>
      </aside>
    );
  };