import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const getShapeClasses = () => {
    switch (data.shape) {
      case 'rounded':
        return 'rounded-full px-6 py-3 min-w-[140px]';
      case 'circle':
        return 'rounded-full w-28 h-28 flex items-center justify-center p-2';
      case 'diamond':
        return 'rotate-45 w-28 h-28 flex items-center justify-center p-2';
      default:
        return 'rounded-md px-4 py-2 min-w-[120px]';
    }
  };

  const isDiamond = data.shape === 'diamond';
  const isCircle = data.shape === 'circle';

  return (
    <div
      className={`shadow-lg border-2 bg-primary text-primary-foreground transition-all cursor-pointer hover:shadow-xl ${
        selected ? 'border-accent ring-4 ring-accent/30 scale-105' : 'border-primary/80'
      } ${getShapeClasses()}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-accent border-2 border-background"
      />
      
      <div className={`text-sm font-semibold text-center ${isDiamond || isCircle ? '-rotate-45' : ''}`}>
        {data.label}
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-accent border-2 border-background"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
