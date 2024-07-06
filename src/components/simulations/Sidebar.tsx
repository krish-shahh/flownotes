import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, GripHorizontal } from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 220, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const startDragging = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const drag = (e: MouseEvent) => {
    if (isDragging && dragRef.current) {
      setPosition({
        x: e.clientX - dragRef.current.offsetWidth / 2,
        y: e.clientY - 10
      });
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', stopDragging);
    return () => {
      window.removeEventListener('mousemove', drag);
      window.removeEventListener('mouseup', stopDragging);
    };
  }, [isDragging]);

  const sidebarStyle: React.CSSProperties = {
    position: 'fixed',
    top: `${position.y}px`,
    left: `${position.x}px`,
    padding: '15px',
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    transition: 'height 0.3s ease',
    width: '200px',
    height: collapsed ? '40px' : 'auto',
    overflow: 'hidden',
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

  return (
    <aside style={sidebarStyle} ref={dragRef}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: '10px'
      }}>
        <div 
          style={{ 
            cursor: 'move', 
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%', 
            marginBottom: '5px'
          }} 
          onMouseDown={startDragging}
        >
          <GripHorizontal size={16} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', textAlign: 'center' }}>
          <span>Circuit Components</span>
        </div>
      </div>
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

export default Sidebar;