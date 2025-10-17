import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeTypes,
  BackgroundVariant,
  MiniMap,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Download, Grid3x3, Maximize2 } from 'lucide-react';
import { CustomNode } from './nodes/CustomNode';
import { mermaidToFlow, flowToMermaid } from '@/lib/mermaid-parser';

interface VisualCanvasProps {
  mermaidCode: string;
  onCodeChange: (code: string) => void;
  diagramType: string;
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export const VisualCanvas = ({ mermaidCode, onCodeChange, diagramType }: VisualCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Parse Mermaid code to visual representation
  useEffect(() => {
    if (!mermaidCode || isUpdating) return;
    
    try {
      const { nodes: parsedNodes, edges: parsedEdges } = mermaidToFlow(mermaidCode, diagramType);
      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } catch (error) {
      console.error('Failed to parse Mermaid code:', error);
    }
  }, [mermaidCode, diagramType, isUpdating]);

  // Convert visual changes back to Mermaid
  const syncToMermaid = useCallback(() => {
    if (nodes.length === 0) return;
    
    setIsUpdating(true);
    try {
      const mermaid = flowToMermaid(nodes, edges, diagramType);
      onCodeChange(mermaid);
    } catch (error) {
      console.error('Failed to generate Mermaid code:', error);
    } finally {
      // Allow updates after a short delay
      setTimeout(() => setIsUpdating(false), 100);
    }
  }, [nodes, edges, diagramType, onCodeChange]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      syncToMermaid();
    },
    [setEdges, syncToMermaid]
  );

  const onNodeDragStop = useCallback(() => {
    syncToMermaid();
  }, [syncToMermaid]);

  const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
    const newLabel = prompt('Enter new label:', node.data.label);
    if (newLabel) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
        )
      );
      syncToMermaid();
    }
  }, [setNodes, syncToMermaid]);

  const handleAddNode = () => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: 'New Node' },
    };
    setNodes((nds) => [...nds, newNode]);
    syncToMermaid();
  };

  const handleFitView = () => {
    // ReactFlow's fitView is called via ref or viewport controls
  };

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        snapToGrid={snapToGrid}
        snapGrid={[15, 15]}
        fitView
        attributionPosition="bottom-left"
      >
        <Panel position="top-right" className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddNode}
            className="bg-background"
          >
            Add Node
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSnapToGrid(!snapToGrid)}
            className="bg-background"
          >
            <Grid3x3 className={`h-4 w-4 ${snapToGrid ? 'text-primary' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleFitView}
            className="bg-background"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </Panel>
        
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={15} size={1} />
      </ReactFlow>
    </div>
  );
};
