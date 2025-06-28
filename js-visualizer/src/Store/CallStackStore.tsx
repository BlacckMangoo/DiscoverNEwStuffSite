import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CallStackNode {
  id: string;
  type: 'callStackNode' | 'callStackBase';
  position: { x: number; y: number };
  data: {
    functionName?: string;
    isTop?: boolean;
    isBottom?: boolean;
    isConnectable?: boolean;
  };
  zIndex: number;
  draggable: boolean;
  connectable: boolean;
}

interface CallStackEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
}

interface CallStackState {
  // State
  nodes: CallStackNode[];
  edges: CallStackEdge[];
  noOfElementsInStack: number;
  nodeBelow: string;
  
  // Actions
  push: (functionName?: string) => void;
  pop: () => void;
  clearStack: () => void;
  initializeStack: () => void;
  
  // Getters
  getTopNode: () => CallStackNode | null;
  getBottomNode: () => CallStackNode | null;
  isEmpty: () => boolean;
  getStackSize: () => number;
}

const initialBaseNode: CallStackNode = {
  id: "base",
  type: "callStackBase",
  position: { x: 0, y: 0 },
  data: { isConnectable: false },
  zIndex: 10,
  draggable: true,
  connectable: false,
};

export const useCallStackStore = create<CallStackState>()(
  devtools(
    (set, get) => ({
      // Initial state
      nodes: [initialBaseNode],
      edges: [],
      noOfElementsInStack: 0,
      nodeBelow: "base",

      // Actions
      push: (functionName = "Function") => {
        const { noOfElementsInStack, nodeBelow, nodes, edges } = get();
        const newCount = noOfElementsInStack + 1;
        const newNodeId = `node-${newCount}`;
        
        // Find base node position
        const baseNode = nodes.find(node => node.id === "base");
        const basePosition = baseNode ? baseNode.position : { x: 0, y: 0 };
        
        // Create new node
        const newNode: CallStackNode = {
          id: newNodeId,
          type: "callStackNode",
          position: { 
            x: basePosition.x, 
            y: basePosition.y - newCount * 170 
          },
          data: {
            functionName: `${functionName} ${newCount}`,
            isTop: true,
            isBottom: false,
            isConnectable: false,
          },
          zIndex: 10,
          draggable: true,
          connectable: false,
        };

        // Update existing nodes (set previous top to not top)
        const updatedNodes = nodes.map((node) => {
          if (node.id === nodeBelow && nodeBelow !== "base") {
            return {
              ...node,
              data: {
                ...node.data,
                isTop: false,
                isBottom: true,
              },
            };
          }
          return node;
        });

        // Create new edge
        const newEdge: CallStackEdge = {
          id: `edge-${newNodeId}-to-${nodeBelow}`,
          source: newNodeId,
          target: nodeBelow,
          type: "smoothstep",
          animated: true,
        };

        set({
          nodes: [...updatedNodes, newNode],
          edges: [...edges, newEdge],
          noOfElementsInStack: newCount,
          nodeBelow: newNodeId,
        });
      },

      pop: () => {
        const { noOfElementsInStack, nodes, edges } = get();
        
        if (noOfElementsInStack <= 0) {
          console.warn("Cannot pop from empty stack");
          return;
        }

        const newCount = noOfElementsInStack - 1;
        const nodeToRemove = `node-${noOfElementsInStack}`;
        const newTopNodeId = newCount > 0 ? `node-${newCount}` : "base";

        // Remove the top node
        const filteredNodes = nodes.filter(node => node.id !== nodeToRemove);
        
        // Update the new top node
        const updatedNodes = filteredNodes.map(node => {
          if (node.id === newTopNodeId && newTopNodeId !== "base") {
            return {
              ...node,
              data: {
                ...node.data,
                isTop: true,
                isBottom: false,
              },
            };
          }
          return node;
        });

        // Remove edges connected to the removed node
        const filteredEdges = edges.filter(edge => 
          edge.source !== nodeToRemove && edge.target !== nodeToRemove
        );

        set({
          nodes: updatedNodes,
          edges: filteredEdges,
          noOfElementsInStack: newCount,
          nodeBelow: newTopNodeId,
        });
      },

      clearStack: () => {
        set({
          nodes: [initialBaseNode],
          edges: [],
          noOfElementsInStack: 0,
          nodeBelow: "base",
        });
      },

      initializeStack: () => {
        set({
          nodes: [initialBaseNode],
          edges: [],
          noOfElementsInStack: 0,
          nodeBelow: "base",
        });
      },

      // Getters
      getTopNode: () => {
        const { nodes, noOfElementsInStack } = get();
        if (noOfElementsInStack === 0) return null;
        return nodes.find(node => node.id === `node-${noOfElementsInStack}`) || null;
      },

      getBottomNode: () => {
        const { nodes } = get();
        return nodes.find(node => node.id === "base") || null;
      },

      isEmpty: () => {
        const { noOfElementsInStack } = get();
        return noOfElementsInStack === 0;
      },

      getStackSize: () => {
        const { noOfElementsInStack } = get();
        return noOfElementsInStack;
      },
    }),
    {
      name: 'call-stack-store',
    }
  )
);
