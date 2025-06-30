import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { VisualiserNode, VisualiserEdge } from './VisualiserStore';
import { useVisualiserStore } from './VisualiserStore';

/**
 * Global Execution Context Store - Smart Component
 * 
 * This store handles:
 * - Global Execution Context management
 * - Adding GEC base, Memory, and Code Execution Phase nodes
 * - Managing connections between GEC components
 */

// GEC specific node data
interface GECNodeData {
  title: string;
  isConnectable?: boolean;
  hasTopHandle?: boolean;
  hasBottomHandle?: boolean;
  hasLeftHandle?: boolean;
  hasRightHandle?: boolean;
}

interface GECNode extends Omit<VisualiserNode, 'type' | 'data'> {
  type: 'callStackBase';
  data: GECNodeData;
}

interface GlobalExecutionContextState {
  // Actions
  addGECStructure: () => void;
  removeGECStructure: () => void;
  
  // Getters
  getGECNode: () => GECNode | null;
  getMemoryNode: () => GECNode | null;
  getCodePhaseNode: () => GECNode | null;
}

// GEC Base Node
const gecBaseNode: GECNode = {
  id: "gec-base",
  type: "callStackBase",
  position: { x: 300, y:0 },
  data: { 
    title: "GEC",
    isConnectable: true,
    hasTopHandle: false,
    hasBottomHandle: true,
    hasLeftHandle: false,
    hasRightHandle: false,
  },
  zIndex: 5,
  draggable: true,
  connectable: true,
};

// Memory Node (connected to GEC)
const memoryNode: GECNode = {
  id: "gec-memory",
  type: "callStackBase",
  position: { x: 150, y: 250 },
  data: { 
    title: "Memory",
    isConnectable: true,
    hasTopHandle: true,
    hasBottomHandle: false,
    hasLeftHandle: false,
    hasRightHandle: false,
  },
  zIndex: 5,
  draggable: true,
  connectable: true,
};

// Code Execution Phase Node (connected to GEC)
const codePhaseNode: GECNode = {
  id: "gec-code-phase",
  type: "callStackBase",
  position: { x: 450, y: 250 },
  data: { 
    title: "Code Execution Phase",
    isConnectable: true,
    hasTopHandle: true,
    hasBottomHandle: false,
    hasLeftHandle: false,
    hasRightHandle: false,
  },
  zIndex: 5,
  draggable: true,
  connectable: true,
};

// Edges connecting the nodes
const gecEdges: VisualiserEdge[] = [
  {
    id: "edge-gec-to-memory",
    source: "gec-base",
    target: "gec-memory",
    type: "smoothstep",
    animated: false,
  },
  {
    id: "edge-gec-to-code-phase",
    source: "gec-base", 
    target: "gec-code-phase",
    type: "smoothstep",
    animated: false,
  }
];




export const useGlobalExecutionContextStore = create<GlobalExecutionContextState>()(
  devtools(
    () => ({
      // Actions
      addGECStructure: () => {
        const visualiserStore = useVisualiserStore.getState();
        
        // Add all GEC nodes
        visualiserStore.addNode(gecBaseNode);
        visualiserStore.addNode(memoryNode);
        visualiserStore.addNode(codePhaseNode);
        
        // Add edges connecting them
        gecEdges.forEach(edge => {
          visualiserStore.addEdge(edge);
        });
        
        console.log('🌍 GEC structure added (Base + Memory + Code Phase)');
      },

      removeGECStructure: () => {
        const visualiserStore = useVisualiserStore.getState();
        
        // Remove all GEC nodes (edges will be auto-removed)
        visualiserStore.removeNode("gec-base");
        visualiserStore.removeNode("gec-memory");
        visualiserStore.removeNode("gec-code-phase");
        
        console.log('🗑️ GEC structure removed');
      },

      // Getters
      getGECNode: () => {
        const visualiserStore = useVisualiserStore.getState();
        return visualiserStore.getNode("gec-base") as GECNode || null;
      },

      getMemoryNode: () => {
        const visualiserStore = useVisualiserStore.getState();
        return visualiserStore.getNode("gec-memory") as GECNode || null;
      },

      getCodePhaseNode: () => {
        const visualiserStore = useVisualiserStore.getState();
        return visualiserStore.getNode("gec-code-phase") as GECNode || null;
      },
    }),
    {
      name: 'global-execution-context-store',
    }
  )
);
