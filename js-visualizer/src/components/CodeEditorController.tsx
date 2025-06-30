
import { LuChevronRight, LuChevronLeft, LuCirclePlay, LuPlay  } from "react-icons/lu";
import { FaPause } from "react-icons/fa";
import { useCallStackStore } from '@/Store/CallStackStore';
import { useCodeEditorStore } from '@/Store/CodeEditorStore';
import { useASTStore } from "@/Store/ASTStore";







function CodeEditorController() {

    // get states from stores

     const { GenerateAndStoreAst, logAst } = useASTStore();
      const { push, pop } = useCallStackStore();
      const { code, changeMode, currentMode,currentWindowMode,changeWindowMode } = useCodeEditorStore();

      // Handle play/pause functionality
      const handlePlayPause = async () => {

        
        if (currentMode === 'run') {
          // If already running, pause it
          changeMode?.('pause');
        } else {
          // If paused or default, start running
          changeMode?.('run');
          const sourceCode = code;

          try {
            // Generate AST and get operations directly
            const operationLog = GenerateAndStoreAst(sourceCode);
            logAst();
            
            console.log('📋 Operation Log:', operationLog);
            
            // Start the call stack sequence with returned operations
            if (operationLog && operationLog.length > 0) {
              await startCallStackSequence(operationLog);
            } else {
              console.warn('⚠️ No call stack operations found');
            }
          } catch (error) {
            console.error('Error generating AST:', error);
          }
        }
      };

      // ✅ Create proper async function for call stack sequence
      const startCallStackSequence = async (operationLog: any[]) => {
        console.log('🚀 Starting call stack sequence:', operationLog);
        
        for (let i = 0; i < operationLog.length; i++) {
          const operation = operationLog[i];
          
          if (operation.type === 'push') {
            console.log(`⬆️ PUSH: ${operation.functionName}`);
            await push(operation.functionName);
          } else if (operation.type === 'pop') {
            console.log(`⬇️ POP: ${operation.functionName}`);
            await pop();
          }
          
          // ✅ Proper delay between operations
          if (i < operationLog.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      };

  const handleStepBack = () => {
    console.log('Step back');
    changeMode?.('step');

  };

  const handleStepForward = () => {
    console.log('Step forward');
    changeMode?.('step');
 
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
          {/* Step Back Button */}
          <button
            onClick={handleStepBack}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 group"
            title="Step Back"
          >
            <LuChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Play/Pause Button - Conditional Rendering */}
          {currentMode === 'run' ? (
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
              title="Play"
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
