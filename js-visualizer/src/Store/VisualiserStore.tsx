import { create } from 'zustand';
import type { Node, Edge, Connection } from '@xyflow/react';

interface VisualiserNode extends Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
  draggable: boolean;
  connectable: boolean;
  zIndex: number;
}

interface VisualiserEdge extends Edge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
}

interface VisualiserState {
  // State
  nodes: VisualiserNode[];
  edges: VisualiserEdge[];
  selectedNodes: string[];
  selectedEdges: string[];
  
  // Node operations
  addNode: (node: VisualiserNode) => void;
  updateNode: (nodeId: string, updates: Partial<VisualiserNode>) => void;
  removeNode: (nodeId: string) => void;
  
  // Edge operations
  addEdge: (edge: VisualiserEdge) => void;
  removeEdge: (edgeId: string) => void;
  
  // Selection operations
  selectNode: (nodeId: string) => void;
  clearSelection: () => void;
  
  // Bulk operations
  clearAll: () => void;
  setNodesAndEdges: (nodes: VisualiserNode[], edges: VisualiserEdge[]) => void;
  
  // Connection handling
  onConnect: (connection: Connection) => void;
}

export const useVisualiserStore = create<VisualiserState>((set) => ({
  // Initial state
  nodes: [],
  edges: [],
  selectedNodes: [],
  selectedEdges: [],
  
  // Node operations
  addNode: (node) => set((state) => ({ 
    nodes: [...state.nodes, node] 
  })),
  
  updateNode: (nodeId, updates) => set((state) => ({
    nodes: state.nodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    )
  })),
  
  removeNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter(node => node.id !== nodeId),
    edges: state.edges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ),
    selectedNodes: state.selectedNodes.filter(id => id !== nodeId)
  })),
  
  // Edge operations
  addEdge: (edge) => set((state) => ({ 
    edges: [...state.edges, edge] 
  })),
  
  removeEdge: (edgeId) => set((state) => ({
    edges: state.edges.filter(edge => edge.id !== edgeId),
    selectedEdges: state.selectedEdges.filter(id => id !== edgeId)
  })),
  
  // Selection operations
  selectNode: (nodeId) => set((state) => ({
    selectedNodes: state.selectedNodes.includes(nodeId) 
      ? state.selectedNodes 
      : [...state.selectedNodes, nodeId]
  })),
  
  clearSelection: () => set({ selectedNodes: [], selectedEdges: [] }),
  
  // Bulk operations
  clearAll: () => set({ 
    nodes: [], 
    edges: [], 
    selectedNodes: [], 
    selectedEdges: [] 
  }),
  
  setNodesAndEdges: (nodes, edges) => set({ 
    nodes, 
    edges,
    selectedNodes: [],
    selectedEdges: []
  }),
  
  // Connection handling
  onConnect: (connection) => {
    if (connection.source && connection.target) {
      const newEdge: VisualiserEdge = {
        id: `edge-${connection.source}-to-${connection.target}-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        type: "default",
        animated: false,
      };
      
      set((state) => ({
        edges: [...state.edges, newEdge]
      }));
    }
  },
}));