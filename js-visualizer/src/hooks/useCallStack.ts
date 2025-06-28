import { useCallStackStore } from '../Store/CallStackStore';
import { useVisualiserStore } from '../Store/VisualiserStore';

/**
 * Custom hook that provides easy access to call stack operations
 * and automatically syncs with the visualizer
 */
export const useCallStack = () => {
  const {
    push: stackPush,
    pop: stackPop,
    clearStack,
    getStackSize,
    isEmpty,
    getTopNode,
    getBottomNode,
    nodes: stackNodes,
    edges: stackEdges,
    noOfElementsInStack,
    nodeBelow
  } = useCallStackStore();

  const {
    setNodesAndEdges
  } = useVisualiserStore();

  // Enhanced push function with auto-sync
  const push = async (functionName?: string) => {
    try {
      stackPush(functionName);
      // Auto-sync happens through useEffect in VisualizerWindow
      return true;
    } catch (error) {
      console.error('Failed to push to call stack:', error);
      return false;
    }
  };

  // Enhanced pop function with auto-sync
  const pop = async () => {
    try {
      if (isEmpty()) {
        console.warn('Cannot pop from empty stack');
        return null;
      }
      stackPop();
      // Auto-sync happens through useEffect in VisualizerWindow
      return true;
    } catch (error) {
      console.error('Failed to pop from call stack:', error);
      return false;
    }
  };

  // Enhanced clear function
  const clear = () => {
    try {
      clearStack();
      // Auto-sync happens through useEffect in VisualizerWindow
      return true;
    } catch (error) {
      console.error('Failed to clear call stack:', error);
      return false;
    }
  };

  // Sync function to manually sync with visualizer
  const syncWithVisualizer = () => {
    setNodesAndEdges(stackNodes, stackEdges);
  };

  // Get stack info
  const getStackInfo = () => ({
    size: getStackSize(),
    isEmpty: isEmpty(),
    topNode: getTopNode(),
    bottomNode: getBottomNode(),
    totalElements: noOfElementsInStack,
    topNodeId: nodeBelow
  });

  return {
    // Core operations
    push,
    pop,
    clear,
    
    // Stack info
    ...getStackInfo(),
    
    // Utility functions
    syncWithVisualizer,
    getStackInfo,
    
    // Raw store access (for advanced usage)
    stackNodes,
    stackEdges,
    noOfElementsInStack,
    nodeBelow
  };
};

export default useCallStack;
