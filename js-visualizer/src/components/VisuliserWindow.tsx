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


const nodeTypes = {
  callStackNode: CallStackNode,
  callStackBase: BaseNode,
};




function VisualizerWindow() {





  
  // Get state from VisualiserStore (centralized node/edge storage)
  const { 
    nodes: visualiserNodes, 
    edges: visualiserEdges, 
  } = useVisualiserStore();

  // Get CallStack state for any additional logic needed (if needed later)
  // const callStackStore = useCallStackStore();

  // Use react-flow state hooks for UI interactions
  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState(visualiserNodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState(visualiserEdges);

  // Sync store state with react-flow state
  useEffect(() => {
    setReactFlowNodes(visualiserNodes);
    setReactFlowEdges(visualiserEdges);
  }, [visualiserNodes, visualiserEdges, setReactFlowNodes, setReactFlowEdges]);

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
