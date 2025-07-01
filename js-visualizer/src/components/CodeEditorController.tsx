import { LuChevronRight, LuChevronLeft, LuPlay  } from "react-icons/lu";
import { RiResetLeftFill } from "react-icons/ri";
import { FaPause } from "react-icons/fa";
import { useCallStackStore } from '@/Store/CallStackStore';
import { useCodeEditorStore } from '@/Store/CodeEditorStore';
import { useASTStore } from "@/Store/ASTStore";
import { useGlobalExecutionContextStore } from "@/Store/GlobalExecutionContextStore";
import { useVisualiserExecutionQueueStore } from "@/Store/VisualiserExecutionQueue";
import { useVisualiserStore } from "@/Store/VisualiserStore";






function CodeEditorController() {

    // get states from stores
     const { GenerateAndStoreAst, logAst, clearAst } = useASTStore();
     const { enqueuePush, enqueuePop } = useCallStackStore();
     const { code, changeMode, currentWindowMode, changeWindowMode } = useCodeEditorStore();
     const { addGECStructure } = useGlobalExecutionContextStore();
     const { 
       start, 
       pause, 
       step, 
       reset, 
       clearQueue, 
       executionState, 
       canStepForward
     } = useVisualiserExecutionQueueStore();

      // Handle play/pause functionality
      const handlePlayPause = async () => {
        if (executionState === 'running') {
          // If already running, pause it
          pause();
          changeMode?.('pause');
        } else if (executionState === 'paused') {
          // If paused, resume
          await start();
          changeMode?.('run');
        } else {
          // If idle, start new execution
          changeMode?.('run');
          const sourceCode = code;

          try {
            // Clear previous queue
            clearQueue();
            
            // Generate AST and get operations directly
            const operationLog = GenerateAndStoreAst(sourceCode);
            logAst();
            
            console.log('📋 Operation Log:', operationLog);
            
            // Enqueue all operations
            if (operationLog && operationLog.length > 0) {
              enqueueCallStackOperations(operationLog);
              // Start execution
              await start();
            } else {
              console.warn('⚠️ No call stack operations found');
            }
          } catch (error) {
            console.error('Error generating AST:', error);
          }
        }
      };

      // Convert operations to commands and enqueue them
      const enqueueCallStackOperations = (operationLog: any[]) => {
        console.log('🚀 Enqueuing call stack operations:', operationLog);
        
        for (const operation of operationLog) {
          if (operation.type === 'push') {
            console.log(`⬆️ Enqueuing PUSH: ${operation.functionName}`);
            enqueuePush(operation.functionName);
          } else if (operation.type === 'pop') {
            console.log(`⬇️ Enqueuing POP: ${operation.functionName}`);
            enqueuePop();
          }
        }
      };
  const handleStepBack = () => {
    console.log('Step back - Not implemented yet');
    // TODO: Implement step back functionality
    changeMode?.('step');
  };

  const handleStepForward = async () => {
    console.log('Step forward');
    changeMode?.('step');
    
    if (canStepForward()) {
      await step();
    } else {
      console.warn('No more steps to execute');
    }
  };

  const handleReset = () => {
    changeMode?.('default');
    changeWindowMode?.('codeEditor');
    
    // Reset execution queue
    reset();
    
    // Clear ALL visual nodes and edges first (complete reset)
    const visualiserStore = useVisualiserStore.getState();
    visualiserStore.clearAll();
    
    // Clear AST
    clearAst();
    
    // Re-initialize to default state
    const callStackStore = useCallStackStore.getState();
    callStackStore.initializeStack();  // This will add the base node back
    addGECStructure();  // This will add GEC structure back
    
    console.log('🔄 Complete reset to default state');
  };

    

  return (
    <div>
          <div className="bg-zinc-900/50 border-b border-zinc-800/60 px-4 py-3 flex items-center ">

          {
            currentWindowMode === 'codeEditor' ?
              <button className="p-2 text-white hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 group border-1-rounded-lg border-zinc-800/60 font-medium text-sm tracking-tight" 
              onClick={() => changeWindowMode?.('astViewer')}>
            View AST
         </button>:
               
         <button className="p-2 text-white hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 group border-1-rounded-lg border-zinc-800/60 font-medium text-sm tracking-tight " 
         onClick={() => changeWindowMode?.('codeEditor')  }>
            View Code Editor
         </button>
          }


         



    
 

          <div className='ml-auto flex items-center space-x-2'>

            
          
          {/* Reset button */}
          <button
            onClick={handleReset}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 group"
            title="Reset"
          >
            <RiResetLeftFill className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          {/* Step Back Button */}
          <button
            onClick={handleStepBack}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 group"
            title="Step Back"
          >
            <LuChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Play/Pause Button - Based on execution state */}
          {executionState === 'running' ? (
            <button
              onClick={handlePlayPause}
              className="p-2 text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition-all duration-200 group"
              title="Pause"
            >
              <FaPause className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handlePlayPause}
              className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-all duration-200 group"
              title={executionState === 'paused' ? 'Resume' : 'Play'}
            >
              <LuPlay className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}
        


    
          {/* Step Forward Button */}
          <button
            onClick={handleStepForward}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 group"
            title="Step Forward"
          >
            <LuChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-zinc-700/50 mx-2"></div>
            
        </div>
        
      </div>

      
    </div>
  )
}

export default CodeEditorController
