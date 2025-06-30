import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import type { Connection } from "@xyflow/react";
import { useCallback, useEffect } from "react";

import "@xyflow/react/dist/style.css";
import CallStackNode from "./CallStackNode";
import BaseNode from "./BaseNode";
import { useVisualiserStore } from "../Store/VisualiserStore";
import { useCallStackStore } from "../Store/CallStackStore";
import { useGlobalExecutionContextStore } from "../Store/GlobalExecutionContextStore";


const nodeTypes = {
  callStackNode: CallStackNode,
  callStackBase: BaseNode,
};




function VisualizerWindow() {
  
  // Get state from VisualiserStore for nodes and edges
  const { 
    nodes, 
    edges, 
  } = useVisualiserStore();

  // Get actions from stores
  const { initializeStack } = useCallStackStore();
  const { addGECStructure } = useGlobalExecutionContextStore();

  // Use react-flow state hooks for UI interactions
  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState(nodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState(edges);

  // Add base nodes on mount
  useEffect(() => {
    initializeStack();
    addGECStructure();
  }, [initializeStack, addGECStructure]);

  // Sync store state with react-flow state
  useEffect(() => {
    setReactFlowNodes(nodes);
    setReactFlowEdges(edges);
  }, [nodes, edges, setReactFlowNodes, setReactFlowEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setReactFlowEdges((eds) => addEdge(params, eds));
    },
    [setReactFlowEdges]
  );

  return (
    <div style={{ width: "100%", height: "100%" }} className="relative">
      
      
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
      >
        <Background bgColor="#0a0a0a" className="opacity-30" />
      </ReactFlow>
    </div>
  );
}

export default VisualizerWindow;
