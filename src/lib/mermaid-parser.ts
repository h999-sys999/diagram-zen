import { Node, Edge } from 'reactflow';

interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

export const mermaidToFlow = (mermaidCode: string, diagramType: string): FlowData => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  const lines = mermaidCode.split('\n').filter(line => line.trim());
  
  // Skip the first line (diagram type declaration)
  const contentLines = lines.slice(1);
  
  const nodeMap = new Map<string, string>();
  let yOffset = 0;
  
  contentLines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Parse flowchart nodes and edges
    if (diagramType === 'flowchart' || trimmed.startsWith('graph')) {
      // Match patterns like: A[Label] --> B[Another]
      const nodePattern = /([A-Za-z0-9_]+)\[([^\]]+)\]/g;
      const edgePattern = /([A-Za-z0-9_]+)\s*(-->|---)\s*([A-Za-z0-9_]+)/;
      
      let match;
      while ((match = nodePattern.exec(trimmed)) !== null) {
        const [, id, label] = match;
        if (!nodeMap.has(id)) {
          nodeMap.set(id, label);
          nodes.push({
            id,
            type: 'custom',
            position: { 
              x: (nodes.length % 3) * 250, 
              y: yOffset 
            },
            data: { label },
          });
          
          if (nodes.length % 3 === 0) yOffset += 100;
        }
      }
      
      const edgeMatch = trimmed.match(edgePattern);
      if (edgeMatch) {
        const [, source, , target] = edgeMatch;
        edges.push({
          id: `${source}-${target}-${index}`,
          source,
          target,
          type: 'smoothstep',
        });
      }
    }
    
    // Parse sequence diagram
    if (diagramType === 'sequence') {
      const participantPattern = /participant\s+([A-Za-z0-9_]+)(?:\s+as\s+(.+))?/;
      const messagePattern = /([A-Za-z0-9_]+)\s*(->>?|-->>?)\s*([A-Za-z0-9_]+)\s*:\s*(.+)/;
      
      const participantMatch = trimmed.match(participantPattern);
      if (participantMatch) {
        const [, id, label] = participantMatch;
        if (!nodeMap.has(id)) {
          nodeMap.set(id, label || id);
          nodes.push({
            id,
            type: 'custom',
            position: { x: nodes.length * 200, y: 50 },
            data: { label: label || id },
          });
        }
      }
      
      const messageMatch = trimmed.match(messagePattern);
      if (messageMatch) {
        const [, source, , target, message] = messageMatch;
        edges.push({
          id: `${source}-${target}-${index}`,
          source,
          target,
          label: message,
          type: 'smoothstep',
        });
      }
    }
  });
  
  // If no nodes found, create a starter node
  if (nodes.length === 0) {
    nodes.push({
      id: 'start',
      type: 'custom',
      position: { x: 250, y: 100 },
      data: { label: 'Start' },
    });
  }
  
  return { nodes, edges };
};

export const flowToMermaid = (nodes: Node[], edges: Edge[], diagramType: string): string => {
  let mermaid = '';
  
  if (diagramType === 'flowchart') {
    mermaid = 'graph TD\n';
    
    nodes.forEach(node => {
      const label = node.data.label || node.id;
      mermaid += `  ${node.id}[${label}]\n`;
    });
    
    edges.forEach(edge => {
      const label = edge.label ? `|${edge.label}|` : '';
      mermaid += `  ${edge.source} -->${label} ${edge.target}\n`;
    });
  } else if (diagramType === 'sequence') {
    mermaid = 'sequenceDiagram\n';
    
    nodes.forEach(node => {
      const label = node.data.label || node.id;
      mermaid += `  participant ${node.id} as ${label}\n`;
    });
    
    edges.forEach(edge => {
      const label = edge.label || 'message';
      mermaid += `  ${edge.source}->>${edge.target}: ${label}\n`;
    });
  } else {
    // Generic fallback
    mermaid = 'graph TD\n';
    nodes.forEach(node => {
      mermaid += `  ${node.id}[${node.data.label}]\n`;
    });
    edges.forEach(edge => {
      mermaid += `  ${edge.source} --> ${edge.target}\n`;
    });
  }
  
  return mermaid;
};
