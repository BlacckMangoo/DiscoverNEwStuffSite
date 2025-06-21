
import { ReactFlow, useNodesState, useEdgesState, addEdge, Background } from '@xyflow/react';
import type { Connection } from '@xyflow/react';
import { useCallback } from 'react';
import '@xyflow/react/dist/style.css';
import GlobalExecutionContextWindow from './GlobalExecutionContextWindow';
import CallStackNode from './CallStackNode';
import CallStackBase from './CallStackBase';
const initialNodes = [
  // Global Execution Context - positioned on the right
  { 
    id: '3', 
    type: 'globalExecutionContext', 
    position: { x: 400, y: 150 }, 
    data: { label: 'Global Execution Context' }, 
    zIndex: 1,
    draggable: false
  },
  // Call Stack - positioned on the left in a vertical stack
  { 
    id: '1', 
    type: 'callStackNode', 
    position: { x: 50, y: 50 }, 
    data: { 
      functionName: 'main()',
      isConnectable: true,
      isTop: true,
      isBottom: false 
    }, 
    zIndex: 10,
    draggable: true
  },
  { 
    id: '2', 
    type: 'callStackNode', 
    position: { x: 50, y: 150 }, 
    data: { 
      functionName: 'helper()',
      isConnectable: true,
      isTop: false,
      isBottom: false 
    }, 
    zIndex: 10,
    draggable: true
  },
  { 
    id: '4', 
    type: 'callStackNode', 
    position: { x: 50, y: 250 }, 
    data: { 
      functionName: 'calculate()',
      isConnectable: true,
      isTop: false,
      isBottom: false 
    }, 
    zIndex: 10,
    draggable: true
  },
  // Call Stack Base - at the bottom of the stack
  { 
    id: '5', 
    type: 'callStackBase', 
    position: { x: 50, y: 350 }, 
    data: { isConnectable: true }, 
    zIndex: 10,
    draggable: true
  },
];
const nodeTypes = {
    globalExecutionContext : GlobalExecutionContextWindow,
    callStackNode: CallStackNode,
    callStackBase: CallStackBase
}



const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
];

function VisualizerWindow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);  const onConnect = useCallback(
    (params: Connection) => {
      // Add the edge
      setEdges((eds) => addEdge(params, eds));
      
      // Check if target is CallStackBase and source is CallStackNode
      if (params.target && params.source) {
        const targetNode = nodes.find(node => node.id === params.target);
        const sourceNode = nodes.find(node => node.id === params.source);
        
        if (targetNode?.type === 'callStackBase' && sourceNode?.type === 'callStackNode') {
          // Update the source node to have isBottom = true
          setNodes((nds) => 
            nds.map((node) => {
              if (node.id === params.source && node.type === 'callStackNode') {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    isBottom: true,
                    isTop: false,
                    isConnectable: true
                  }
                } as any;
              }
              return node;
            })
          );
        }
      }
    },
    [setEdges, setNodes, nodes],
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodesDraggable={false}
        nodesConnectable={true}
        elementsSelectable={false}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false
        }}
      >
    
        <Background bgColor='#0a0a0a' />
      </ReactFlow>
    </div>
  );
}

export default VisualizerWindow;