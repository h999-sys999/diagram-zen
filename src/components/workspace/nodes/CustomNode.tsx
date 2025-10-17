import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md border-2 bg-background min-w-[120px] ${
        selected ? 'border-primary' : 'border-border'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-primary"
      />
      
      <div className="text-sm font-medium text-foreground text-center">
        {data.label}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-primary"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
