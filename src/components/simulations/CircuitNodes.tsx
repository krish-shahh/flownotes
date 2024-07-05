import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const nodeStyles = {
  padding: '10px',
  borderRadius: '5px',
  fontSize: '12px',
  color: '#333',
  textAlign: 'center' as const,
  width: '100px',
  height: '80px',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center',
  alignItems: 'center',
};

const selectStyles = {
  marginTop: '5px',
  fontSize: '10px',
  width: '90%',
};

interface BatteryData {
  voltage: number;
}

interface LEDData {
  on: boolean;
}

interface SwitchData {
  on: boolean;
  toggle: () => void;
}

interface ResistorData {
  resistance: number;
}

interface CapacitorData {
  capacitance: number;
}

interface InductorData {
  inductance: number;
}

interface AmMeterData {
  current: number;
}

interface VoltMeterData {
  voltage: number;
}

export const BatteryNode: React.FC<NodeProps<BatteryData>> = ({ data }) => (
  <div style={{
    ...nodeStyles,
    background: 'linear-gradient(to right, #f4f4f4 50%, #e0e0e0 50%)',
    border: '2px solid #666',
  }}>
    <div>{data.voltage}V</div>
    <div style={{ fontSize: '20px' }}>🔋</div>
    <Handle type="source" position={Position.Right} id="positive" style={{ top: '25%', background: 'red' }} />
    <Handle type="source" position={Position.Right} id="negative" style={{ top: '75%', background: 'black' }} />
  </div>
);

export const LEDNode: React.FC<NodeProps<LEDData>> = ({ data }) => (
  <div style={{
    ...nodeStyles,
    background: '#f4f4f4',
    border: '2px solid #666',
    borderRadius: '50%',
  }}>
    <div style={{ 
      fontSize: '30px', 
      color: data.on ? '#ffff00' : '#666',
      textShadow: data.on ? '0 0 5px #ffff00, 0 0 10px #ffff00' : 'none',
      transition: 'all 0.3s ease'
    }}>
      💡
    </div>
    <div style={{ 
      marginTop: '5px',
      fontSize: '10px', 
      fontWeight: 'bold',
      color: data.on ? '#00ff00' : '#ff0000'
    }}>
      {data.on ? 'ON' : 'OFF'}
    </div>
    <Handle type="target" position={Position.Left} id="anode" style={{ background: 'red' }} />
    <Handle type="target" position={Position.Right} id="cathode" style={{ background: 'black' }} />
  </div>
);

export const SwitchNode: React.FC<NodeProps<SwitchData>> = ({ data }) => (
  <div style={{
    ...nodeStyles,
    background: '#f4f4f4',
    border: '2px solid #666',
  }}>
    <div>Switch: {data.on ? '⚡' : '⭕'}</div>
    <Handle type="target" position={Position.Left} id="input" />
    <Handle type="source" position={Position.Right} id="output" />
    <button onClick={data.toggle} style={{ marginTop: '5px', fontSize: '10px' }}>Toggle</button>
  </div>
);

export const ResistorNode: React.FC<NodeProps<ResistorData>> = ({ data }) => {
  const [resistance, setResistance] = useState(data.resistance);
  const resistanceOptions = [10, 100, 220, 330, 1000, 10000];

  return (
    <div style={{
      ...nodeStyles,
      background: '#f4f4f4',
      border: '2px solid #666',
    }}>
      <div>Resistor</div>
      <select 
        value={resistance} 
        onChange={(e) => setResistance(Number(e.target.value))}
        style={selectStyles}
      >
        {resistanceOptions.map((r) => (
          <option key={r} value={r}>{r} Ω</option>
        ))}
      </select>
      <div style={{ fontSize: '20px' }}>〰️</div>
      <Handle type="target" position={Position.Left} id="input" />
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
};

export const CapacitorNode: React.FC<NodeProps<CapacitorData>> = ({ data }) => {
  const [capacitance, setCapacitance] = useState(data.capacitance);
  const capacitanceOptions = [0.000001, 0.00001, 0.0001, 0.001, 0.01, 0.1];

  return (
    <div style={{
      ...nodeStyles,
      background: '#f4f4f4',
      border: '2px solid #666',
    }}>
      <div>Capacitor</div>
      <select 
        value={capacitance} 
        onChange={(e) => setCapacitance(Number(e.target.value))}
        style={selectStyles}
      >
        {capacitanceOptions.map((c) => (
          <option key={c} value={c}>{c} F</option>
        ))}
      </select>
      <div style={{ fontSize: '20px' }}>| |</div>
      <Handle type="target" position={Position.Left} id="input" />
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
};

export const InductorNode: React.FC<NodeProps<InductorData>> = ({ data }) => {
  const [inductance, setInductance] = useState(data.inductance);
  const inductanceOptions = [0.001, 0.01, 0.1, 1, 10, 100];

  return (
    <div style={{
      ...nodeStyles,
      background: '#f4f4f4',
      border: '2px solid #666',
    }}>
      <div>Inductor</div>
      <select 
        value={inductance} 
        onChange={(e) => setInductance(Number(e.target.value))}
        style={selectStyles}
      >
        {inductanceOptions.map((i) => (
          <option key={i} value={i}>{i} H</option>
        ))}
      </select>
      <div style={{ fontSize: '20px' }}>🧲</div>
      <Handle type="target" position={Position.Left} id="input" />
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
};

export const AmMeterNode: React.FC<NodeProps<AmMeterData>> = ({ data }) => (
  <div style={{
    ...nodeStyles,
    background: '#f4f4f4',
    border: '2px solid #666',
  }}>
    <div>Ammeter</div>
    <div>{data.current.toFixed(2)} A</div>
    <div style={{ fontSize: '20px' }}>🔀</div>
    <Handle type="target" position={Position.Left} id="input" />
    <Handle type="source" position={Position.Right} id="output" />
  </div>
);

export const VoltMeterNode: React.FC<NodeProps<VoltMeterData>> = ({ data }) => (
  <div style={{
    ...nodeStyles,
    background: '#f4f4f4',
    border: '2px solid #666',
  }}>
    <div>Voltmeter</div>
    <div>{data.voltage.toFixed(2)} V</div>
    <div style={{ fontSize: '20px' }}>📏</div>
    <Handle type="target" position={Position.Left} id="input" />
    <Handle type="target" position={Position.Right} id="output" />
  </div>
);