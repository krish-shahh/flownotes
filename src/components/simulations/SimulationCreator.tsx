'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  Node,
  Edge,
  Connection,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  EdgeTypes,
  SmoothStepEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { 
  BatteryNode, 
  LEDNode, 
  SwitchNode, 
  ResistorNode, 
  CapacitorNode, 
  InductorNode, 
  AmMeterNode, 
  VoltMeterNode 
} from './CircuitNodes';
import { Sidebar } from './Sidebar';

const nodeTypes = {
  battery: BatteryNode,
  led: LEDNode,
  switch: SwitchNode,
  resistor: ResistorNode,
  capacitor: CapacitorNode,
  inductor: InductorNode,
  ammeter: AmMeterNode,
  voltmeter: VoltMeterNode,
};

const customEdgeStyle = {
  stroke: '#555',
  strokeWidth: 2,
};

const CustomEdge = (props) => (
  <SmoothStepEdge {...props} style={customEdgeStyle} />
);

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

let id = 0;
const getId = () => `${id++}`;

const SimulationCreatorInner = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { setViewport } = useReactFlow();
  const circuitStateRef = useRef({ isClosed: false });

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'custom',
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const position = { x: event.clientX, y: event.clientY };
      
      let newNode;
      const newId = getId();
      switch (type) {
        case 'battery':
          newNode = { id: newId, type, position, data: { voltage: 5 } };
          break;
        case 'led':
          newNode = { id: newId, type, position, data: { on: false } };
          break;
        case 'switch':
          newNode = { 
            id: newId, 
            type, 
            position, 
            data: { 
              on: false,
              toggle: () => {
                setNodes((nds) =>
                  nds.map((node) =>
                    node.id === newId ? { ...node, data: { ...node.data, on: !node.data.on } } : node
                  )
                );
              }
            } 
          };
          break;
        case 'resistor':
          newNode = { id: newId, type, position, data: { resistance: 100 } };
          break;
        case 'capacitor':
          newNode = { id: newId, type, position, data: { capacitance: 0.000001 } };
          break;
        case 'inductor':
          newNode = { id: newId, type, position, data: { inductance: 0.1 } };
          break;
        case 'ammeter':
          newNode = { id: newId, type, position, data: { current: 0 } };
          break;
        case 'voltmeter':
          newNode = { id: newId, type, position, data: { voltage: 0 } };
          break;
        default:
          return;
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  useEffect(() => {
    setViewport({ x: 0, y: 0, zoom: 1.5 }, { duration: 800 });
  }, [setViewport]);

  useEffect(() => {
    const battery = nodes.find((node) => node.type === 'battery');
    const led = nodes.find((node) => node.type === 'led');
    const switchNode = nodes.find((node) => node.type === 'switch');

    console.log('Nodes:', nodes);
    console.log('Edges:', edges);

    if (battery && led) {
      let isCorrectlyConnected = false;
      const batteryPositiveEdge = edges.find(edge => edge.source === battery.id && edge.sourceHandle === 'positive');
      const batteryNegativeEdge = edges.find(edge => edge.source === battery.id && edge.sourceHandle === 'negative');

      console.log('Battery positive edge:', batteryPositiveEdge);
      console.log('Battery negative edge:', batteryNegativeEdge);

      if (batteryPositiveEdge && batteryNegativeEdge) {
        if (switchNode) {
          // Circuit with switch
          const switchInputEdge = edges.find(edge => edge.target === switchNode.id && edge.targetHandle === 'input');
          const switchOutputEdge = edges.find(edge => edge.source === switchNode.id && edge.sourceHandle === 'output');
          
          console.log('Switch input edge:', switchInputEdge);
          console.log('Switch output edge:', switchOutputEdge);
          console.log('Switch state:', switchNode.data.on);

          isCorrectlyConnected = 
            switchInputEdge && 
            switchOutputEdge && 
            switchNode.data.on &&
            switchInputEdge.source === battery.id &&
            switchOutputEdge.target === led.id &&
            batteryNegativeEdge.target === led.id;
        } else {
          // Direct circuit without switch
          isCorrectlyConnected = 
            batteryPositiveEdge.target === led.id &&
            batteryNegativeEdge.target === led.id;
        }
      }

      console.log('Is correctly connected:', isCorrectlyConnected);

      if (isCorrectlyConnected !== circuitStateRef.current.isClosed) {
        circuitStateRef.current.isClosed = isCorrectlyConnected;
        setNodes((nds) =>
          nds.map((node) =>
            node.type === 'led' ? { ...node, data: { ...node.data, on: isCorrectlyConnected } } : node
          )
        );
      }
    }
  }, [nodes, edges]);

  return (
    <div style={{ width: '100vw', height: '93vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: 'custom' }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <Sidebar />
    </div>
  );
};

const SimulationCreator = () => (
  <ReactFlowProvider>
    <SimulationCreatorInner />
  </ReactFlowProvider>
);

export default SimulationCreator;