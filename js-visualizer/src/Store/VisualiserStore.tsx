import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { Node, Edge, Connection } from '@xyflow/react';

export interface VisualiserNode extends Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
  draggable: boolean;
  connectable: boolean;
  zIndex: number;
}

export interface VisualiserEdge extends Edge {
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
  addNodes: (nodes: VisualiserNode[]) => void;
  updateNode: (nodeId: string, updates: Partial<VisualiserNode>) => void;
  updateNodeData: (nodeId: string, dataUpdates: any) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  removeNode: (nodeId: string) => void;
  removeNodes: (nodeIds: string[]) => void;
  
  // Edge operations
  addEdge: (edge: VisualiserEdge) => void;
  addEdges: (edges: VisualiserEdge[]) => void;
  updateEdge: (edgeId: string, updates: Partial<VisualiserEdge>) => void;
  removeEdge: (edgeId: string) => void;
  removeEdges: (edgeIds: string[]) => void;
  removeEdgesConnectedToNode: (nodeId: string) => void;
  
  // Selection operations
  selectNode: (nodeId: string) => void;
  selectNodes: (nodeIds: string[]) => void;
  selectEdge: (edgeId: string) => void;
  selectEdges: (edgeIds: string[]) => void;
  clearSelection: () => void;
  
  // Bulk operations
  clearAll: () => void;
  setNodesAndEdges: (nodes: VisualiserNode[], edges: VisualiserEdge[]) => void;
  
  // Utility operations
  getNode: (nodeId: string) => VisualiserNode | undefined;
  getEdge: (edgeId: string) => VisualiserEdge | undefined;
  getConnectedEdges: (nodeId: string) => VisualiserEdge[];
  getNodesByType: (type: string) => VisualiserNode[];
  
  // Connection handling
  onConnect: (connection: Connection) => void;
}

export const useVisualiserStore = create<VisualiserState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      nodes: [],
      edges: [],
      selectedNodes: [],
      selectedEdges: [],
      
      // Node operations
      addNode: (node) => set((state) => ({ 
        nodes: [...state.nodes, node] 
      })),
      
      addNodes: (nodes) => set((state) => ({ 
        nodes: [...state.nodes, ...nodes] 
      })),
      
      updateNode: (nodeId, updates) => set((state) => ({
        nodes: state.nodes.map(node => 
          node.id === nodeId ? { ...node, ...updates } : node
        )
      })),
      
      updateNodeData: (nodeId, dataUpdates) => set((state) => ({
        nodes: state.nodes.map(node => 
          node.id === nodeId 
            ? { ...node, data: { ...node.data, ...dataUpdates } }
            : node
        )
      })),
      
      updateNodePosition: (nodeId, position) => set((state) => ({
        nodes: state.nodes.map(node => 
          node.id === nodeId ? { ...node, position } : node
        )
      })),
      
      removeNode: (nodeId) => set((state) => ({
        nodes: state.nodes.filter(node => node.id !== nodeId),
        edges: state.edges.filter(edge => 
          edge.source !== nodeId && edge.target !== nodeId
        ),
        selectedNodes: state.selectedNodes.filter(id => id !== nodeId)
      })),
      
      removeNodes: (nodeIds) => set((state) => ({
        nodes: state.nodes.filter(node => !nodeIds.includes(node.id)),
        edges: state.edges.filter(edge => 
          !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
        ),
        selectedNodes: state.selectedNodes.filter(id => !nodeIds.includes(id))
      })),
      
      // Edge operations
      addEdge: (edge) => set((state) => ({ 
        edges: [...state.edges, edge] 
      })),
      
      addEdges: (edges) => set((state) => ({ 
        edges: [...state.edges, ...edges] 
      })),
      
      updateEdge: (edgeId, updates) => set((state) => ({
        edges: state.edges.map(edge => 
          edge.id === edgeId ? { ...edge, ...updates } : edge
        )
      })),
      
      removeEdge: (edgeId) => set((state) => ({
        edges: state.edges.filter(edge => edge.id !== edgeId),
        selectedEdges: state.selectedEdges.filter(id => id !== edgeId)
      })),
      
      removeEdges: (edgeIds) => set((state) => ({
        edges: state.edges.filter(edge => !edgeIds.includes(edge.id)),
        selectedEdges: state.selectedEdges.filter(id => !edgeIds.includes(id))
      })),
      
      removeEdgesConnectedToNode: (nodeId) => set((state) => ({
        edges: state.edges.filter(edge => 
          edge.source !== nodeId && edge.target !== nodeId
        )
      })),
      
      // Selection operations
      selectNode: (nodeId) => set((state) => ({
        selectedNodes: state.selectedNodes.includes(nodeId) 
          ? state.selectedNodes 
          : [...state.selectedNodes, nodeId]
      })),
      
      selectNodes: (nodeIds) => set({ selectedNodes: nodeIds }),
      
      selectEdge: (edgeId) => set((state) => ({
        selectedEdges: state.selectedEdges.includes(edgeId)
          ? state.selectedEdges
          : [...state.selectedEdges, edgeId]
      })),
      
      selectEdges: (edgeIds) => set({ selectedEdges: edgeIds }),
      
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
      
      // Utility operations
      getNode: (nodeId) => {
        const { nodes } = get();
        return nodes.find(node => node.id === nodeId);
      },
      
      getEdge: (edgeId) => {
        const { edges } = get();
        return edges.find(edge => edge.id === edgeId);
      },
      
      getConnectedEdges: (nodeId) => {
        const { edges } = get();
        return edges.filter(edge => 
          edge.source === nodeId || edge.target === nodeId
        );
      },
      
      getNodesByType: (type) => {
        const { nodes } = get();
        return nodes.filter(node => node.type === type);
      },
      
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
    })),
    {
      name: 'visualiser-store',
    }
  )
);