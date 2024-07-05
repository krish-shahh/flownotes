import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const CustomNode = memo(({ data, isConnectable }: NodeProps) => {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';