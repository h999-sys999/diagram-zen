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
import { Plus, Grid3x3, Maximize2, Trash2, Edit3, X } from 'lucide-react';
import { CustomNode } from './nodes/CustomNode';
import { mermaidToFlow, flowToMermaid } from '@/lib/mermaid-parser';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeShape, setNodeShape] = useState('default');

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

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setNodeLabel(node.data.label || '');
    setNodeShape(node.data.shape || 'default');
  }, []);

  const updateSelectedNode = useCallback(() => {
    if (!selectedNode) return;
    
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id 
          ? { ...n, data: { ...n.data, label: nodeLabel, shape: nodeShape } } 
          : n
      )
    );
    syncToMermaid();
  }, [selectedNode, nodeLabel, nodeShape, setNodes, syncToMermaid]);

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;
    
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    setSelectedNode(null);
    syncToMermaid();
  }, [selectedNode, setNodes, setEdges, syncToMermaid]);

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
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        snapToGrid={snapToGrid}
        snapGrid={[15, 15]}
        fitView
        attributionPosition="bottom-left"
      >
        <Panel position="top-right" className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddNode}
            className="bg-background"
          >
            <Plus className="h-4 w-4 mr-1" />
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
        </Panel>

        {selectedNode && (
          <Panel position="top-left" className="bg-card p-4 rounded-lg shadow-md border border-border min-w-[280px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Edit Node</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedNode(null)}
                  className="h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="node-label" className="text-xs">Label</Label>
                <Input
                  id="node-label"
                  value={nodeLabel}
                  onChange={(e) => setNodeLabel(e.target.value)}
                  placeholder="Node label"
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="node-shape" className="text-xs">Shape</Label>
                <Select value={nodeShape} onValueChange={setNodeShape}>
                  <SelectTrigger id="node-shape" className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Rectangle</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                    <SelectItem value="diamond">Diamond</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={updateSelectedNode}
                  size="sm"
                  className="flex-1 h-8"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Update
                </Button>
                <Button
                  onClick={deleteSelectedNode}
                  variant="destructive"
                  size="sm"
                  className="h-8"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Panel>
        )}
        
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={15} size={1} />
      </ReactFlow>
    </div>
  );
};
