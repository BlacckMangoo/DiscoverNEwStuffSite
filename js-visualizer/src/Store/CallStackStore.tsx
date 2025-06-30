import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { VisualiserNode, VisualiserEdge } from './VisualiserStore';
import { useVisualiserStore } from './VisualiserStore';

/**
 * Call Stack Store - Global State Management
 * 
 * This store handles:
 * - Pure call stack logic and operations (push/pop)  
 * - Function call tracking and stack state
 * - Stack size and emptiness validation
 * - Call stack execution flow control
 * - Function name and call order management
 * 
 * Note: Uses VisualiserStore interfaces for consistency
 */

// Extend VisualiserNode with call stack specific data
interface CallStackNodeData {
  functionName?: string;
  isTop?: boolean;
  isBottom?: boolean;
  isConnectable?: boolean;
  title?: string;
}

interface CallStackNode extends Omit<VisualiserNode, 'type' | 'data'> {
  type: 'callStackNode' | 'callStackBase';
  data: CallStackNodeData;
}

// CallStackEdge is the same as VisualiserEdge
interface CallStackEdge extends VisualiserEdge {}

interface CallStackState {
  // State
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
  data: { isConnectable: false, title: "Call Stack" },
  zIndex: 10,
  draggable: true,
  connectable: false,
};

export const useCallStackStore = create<CallStackState>()(
  devtools(
    (set, get) => ({
      // Initial state
      noOfElementsInStack: 0,
      nodeBelow: "base",

      // Actions
      push: (functionName = "Function") => {
        const { noOfElementsInStack, nodeBelow } = get();
        const newCount = noOfElementsInStack + 1;
        const newNodeId = `node-${newCount}`;
        
        // Get visualiser store instance
        const visualiserStore = useVisualiserStore.getState();
        
        // Find base node position
        const baseNode = visualiserStore.getNode("base");
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

        // Update previous top node (set previous top to not top)
        if (nodeBelow !== "base") {
          visualiserStore.updateNodeData(nodeBelow, {
            isTop: false,
            isBottom: true,
          });
        }

        // Add new node to visualiser
        visualiserStore.addNode(newNode);

        // Create new edge
        const newEdge: CallStackEdge = {
          id: `edge-${newNodeId}-to-${nodeBelow}`,
          source: newNodeId,
          target: nodeBelow,
          type: "smoothstep",
          animated: true,
        };

        // Add edge to visualiser
        visualiserStore.addEdge(newEdge);

        set({
          noOfElementsInStack: newCount,
          nodeBelow: newNodeId,
        });
      },

      pop: () => {
        const { noOfElementsInStack } = get();
        
        if (noOfElementsInStack <= 0) {
          console.warn("Cannot pop from empty stack");
          return;
        }

        const newCount = noOfElementsInStack - 1;
        const nodeToRemove = `node-${noOfElementsInStack}`;
        const newTopNodeId = newCount > 0 ? `node-${newCount}` : "base";

        // Get visualiser store instance
        const visualiserStore = useVisualiserStore.getState();

        // Remove the top node from visualiser
        visualiserStore.removeNode(nodeToRemove);
        
        // Update the new top node
        if (newTopNodeId !== "base") {
          visualiserStore.updateNodeData(newTopNodeId, {
            isTop: true,
            isBottom: false,
          });
        }

        set({
          noOfElementsInStack: newCount,
          nodeBelow: newTopNodeId,
        });
      },

      clearStack: () => {
        // Get visualiser store instance
        const visualiserStore = useVisualiserStore.getState();
        
        // Clear all nodes except base
        visualiserStore.clearAll();
        
        // Re-add base node
        visualiserStore.addNode(initialBaseNode);

        set({
          noOfElementsInStack: 0,
          nodeBelow: "base",
        });
      },

      initializeStack: () => {
        // Get visualiser store instance
        const visualiserStore = useVisualiserStore.getState();
        
        // Clear all and add base node
        visualiserStore.clearAll();
        visualiserStore.addNode(initialBaseNode);

        set({
          noOfElementsInStack: 0,
          nodeBelow: "base",
        });
      },

      // Getters
      getTopNode: () => {
        const { noOfElementsInStack } = get();
        if (noOfElementsInStack === 0) return null;
        
        const visualiserStore = useVisualiserStore.getState();
        return visualiserStore.getNode(`node-${noOfElementsInStack}`) as CallStackNode || null;
      },

      getBottomNode: () => {
        const visualiserStore = useVisualiserStore.getState();
        return visualiserStore.getNode("base") as CallStackNode || null;
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
