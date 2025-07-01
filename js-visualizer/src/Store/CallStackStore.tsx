import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useVisualiserExecutionQueueStore, createCallStackPushCommand, createCallStackPopCommand, createCallStackClearCommand } from './VisualiserExecutionQueue';
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
 * Note: Visual representation (nodes/edges) is handled by VisualizerStore
 */






interface CallStackNode {
  id: string;
  type: 'callStackNode' | 'callStackBase';
  position: { x: number; y: number };
  data: {
    functionName?: string;
    title?: string;
    isTop?: boolean;
    isBottom?: boolean;
    isConnectable?: boolean;
    hasTopHandle?: boolean;
    hasBottomHandle?: boolean;
    hasLeftHandle?: boolean;
    hasRightHandle?: boolean;
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
  // State - only logical state, visual state is in VisualiserStore
  noOfElementsInStack: number;
  nodeBelow: string;
  
  // Direct Actions (for immediate execution)
  push: (functionName?: string) => void;
  pop: () => void;
  clearStack: () => void;
  initializeStack: () => void;
  
  // Command-based Actions (for queued execution)
  enqueuePush: (functionName?: string) => void;
  enqueuePop: () => void;
  enqueueClear: () => void;
  
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
  data: { 
    title: "Call Stack",
    isConnectable: false,
    hasTopHandle: true,  // CallStack base should receive connections from above
    hasBottomHandle: false,
    hasLeftHandle: false,
    hasRightHandle: false,
  },
  zIndex: 10,
  draggable: true,
  connectable: false,
};

export const useCallStackStore = create<CallStackState>()(
  devtools(

    






    (set, get) => ({
      // Initial state - only logical state
      noOfElementsInStack: 0,
      nodeBelow: "base",

      // Actions
      push: (functionName = "Function") => {
        const { noOfElementsInStack, nodeBelow } = get();
        const visualiserStore = useVisualiserStore.getState();
        const newCount = noOfElementsInStack + 1;
        const newNodeId = `node-${newCount}`;
        
        // Find base node position from visualiser store
        const baseNode = visualiserStore.nodes.find(node => node.id === "base");
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
        if (nodeBelow !== "base") {
          visualiserStore.updateNodeData(nodeBelow, {
            isTop: false,
            isBottom: true,
          });
        }

        // Add new node to visualiser store
        visualiserStore.addNode(newNode);

        // Create new edge
        const newEdge: CallStackEdge = {
          id: `edge-${newNodeId}-to-${nodeBelow}`,
          source: newNodeId,
          target: nodeBelow,
          type: "smoothstep",
          animated: true,
        };

        // Add edge to visualiser store
        visualiserStore.addEdge(newEdge);

        // Update internal state
        set({
          noOfElementsInStack: newCount,
          nodeBelow: newNodeId,
        });
      },

      pop: () => {
        const { noOfElementsInStack } = get();
        const visualiserStore = useVisualiserStore.getState();
        
        if (noOfElementsInStack <= 0) {
          console.warn("Cannot pop from empty stack");
          return;
        }

        const newCount = noOfElementsInStack - 1;
        const nodeToRemove = `node-${noOfElementsInStack}`;
        const newTopNodeId = newCount > 0 ? `node-${newCount}` : "base";

        // Remove the top node from visualiser store
        visualiserStore.removeNode(nodeToRemove);

        // Update the new top node
        if (newTopNodeId !== "base") {
          visualiserStore.updateNodeData(newTopNodeId, {
            isTop: true,
            isBottom: false,
          });
        }

        // Update internal state
        set({
          noOfElementsInStack: newCount,
          nodeBelow: newTopNodeId,
        });
      },

      clearStack: () => {
        const visualiserStore = useVisualiserStore.getState();
        
        // Remove all call stack nodes except the base
        const { noOfElementsInStack } = get();
        for (let i = 1; i <= noOfElementsInStack; i++) {
          visualiserStore.removeNode(`node-${i}`);
        }
        
        // Ensure base node exists
        const baseExists = visualiserStore.nodes.find(node => node.id === "base");
        if (!baseExists) {
          visualiserStore.addNode(initialBaseNode);
        }
        
        // Update internal state
        set({
          noOfElementsInStack: 0,
          nodeBelow: "base",
        });
      },

      initializeStack: () => {
        const visualiserStore = useVisualiserStore.getState();
        
        // Clear any existing call stack nodes
        const { noOfElementsInStack } = get();
        for (let i = 1; i <= noOfElementsInStack; i++) {
          visualiserStore.removeNode(`node-${i}`);
        }
        
        // Ensure base node exists
        const baseExists = visualiserStore.nodes.find(node => node.id === "base");
        if (!baseExists) {
          visualiserStore.addNode(initialBaseNode);
        }
        
        // Update internal state
        set({
          noOfElementsInStack: 0,
          nodeBelow: "base",
        });
      },

      // Command-based Actions (for queued execution)
      enqueuePush: (functionName = "Function") => {
        const executionQueue = useVisualiserExecutionQueueStore.getState();
        const callStackActions = { push: get().push };
        
        const command = createCallStackPushCommand(functionName, callStackActions);
        executionQueue.enqueueCommand(command);
      },

      enqueuePop: () => {
        const executionQueue = useVisualiserExecutionQueueStore.getState();
        const callStackActions = { pop: get().pop };
        
        const command = createCallStackPopCommand(callStackActions);
        executionQueue.enqueueCommand(command);
      },

      enqueueClear: () => {
        const executionQueue = useVisualiserExecutionQueueStore.getState();
        const callStackActions = { clearStack: get().clearStack };
        
        const command = createCallStackClearCommand(callStackActions);
        executionQueue.enqueueCommand(command);
      },

      // Getters
      getTopNode: () => {
        const { noOfElementsInStack } = get();
        const visualiserStore = useVisualiserStore.getState();
        
        if (noOfElementsInStack === 0) return null;
        return visualiserStore.nodes.find(node => node.id === `node-${noOfElementsInStack}`) as CallStackNode || null;
      },

      getBottomNode: () => {
        const visualiserStore = useVisualiserStore.getState();
        return visualiserStore.nodes.find(node => node.id === "base") as CallStackNode || null;
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

// Initialize CallStack base node on store creation
const initializeCallStackBase = () => {
  const visualiserStore = useVisualiserStore.getState();
  
  // Check if base node already exists
  const baseExists = visualiserStore.nodes.find(node => node.id === "base");
  if (!baseExists) {
    visualiserStore.addNode(initialBaseNode);
    console.log('📚 CallStack base node initialized');
  }
};

// Call initialization
initializeCallStackBase();
