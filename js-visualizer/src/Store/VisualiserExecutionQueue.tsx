import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Visualiser Execution Queue Store - Command Pattern Implementation
 * 
 * This store handles:
 * - Managing execution commands for all visualization stores
 * - Sequential execution with pause/resume/step capabilities
 * - Command queuing and processing
 * - Execution state management for coordinated visualizations
 */

export interface ExecutionCommand {
  id: string;
  type: string; // e.g., 'CALL_STACK_PUSH', 'CALL_STACK_POP', 'GEC_ADD_VARIABLE'
  execute: () => Promise<void>;
  metadata?: {
    source?: string; // Which store created this command
    description?: string; // Human-readable description
    timestamp?: number;
  };
}

type ExecutionState = "idle" | "running" | "paused" | "stepping";

interface VisualiserExecutionQueueState {
  // State
  executionQueue: ExecutionCommand[];
  currentExecutionIndex: number;
  executionState: ExecutionState;
  executionSpeed: number; // Delay between commands in ms
  
  // Queue Management
  enqueueCommand: (command: ExecutionCommand) => void;
  enqueueBatch: (commands: ExecutionCommand[]) => void;
  clearQueue: () => void;
  removeCommand: (commandId: string) => void;
  
  // Execution Control
  start: () => Promise<void>;
  pause: () => void;
  resume: () => Promise<void>;
  step: () => Promise<void>;
  reset: () => void;
  stop: () => void;
  
  // Execution Settings
  setExecutionSpeed: (speed: number) => void;
  
  // Getters
  getQueueLength: () => number;
  getCurrentCommand: () => ExecutionCommand | null;
  canStepForward: () => boolean;
  getProgress: () => { current: number; total: number };
  isExecuting: () => boolean;
}

// Helper function to generate unique IDs
const generateCommandId = () => `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Helper function to create a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useVisualiserExecutionQueueStore = create<VisualiserExecutionQueueState>()(
  devtools(
    (set, get) => ({
      // Initial state
      executionQueue: [],
      currentExecutionIndex: 0,
      executionState: "idle",
      executionSpeed: 1000, // 1 second delay by default

      // Queue Management
      enqueueCommand: (command: ExecutionCommand) => {
        const commandWithId = {
          ...command,
          id: command.id || generateCommandId(),
          metadata: {
            timestamp: Date.now(),
            ...command.metadata,
          },
        };

        set((state) => ({
          executionQueue: [...state.executionQueue, commandWithId],
        }));
      },

      enqueueBatch: (commands: ExecutionCommand[]) => {
        const commandsWithIds = commands.map(command => ({
          ...command,
          id: command.id || generateCommandId(),
          metadata: {
            timestamp: Date.now(),
            ...command.metadata,
          },
        }));

        set((state) => ({
          executionQueue: [...state.executionQueue, ...commandsWithIds],
        }));
      },

      clearQueue: () => set({
        executionQueue: [],
        currentExecutionIndex: 0,
        executionState: "idle",
      }),

      removeCommand: (commandId: string) => set((state) => ({
        executionQueue: state.executionQueue.filter(cmd => cmd.id !== commandId),
        currentExecutionIndex: Math.min(state.currentExecutionIndex, state.executionQueue.length - 1),
      })),

      // Execution Control
      start: async () => {
        const { executionQueue, currentExecutionIndex, executionSpeed } = get();
        
        if (executionQueue.length === 0) {
          console.warn("No commands in queue to execute");
          return;
        }

        set({ executionState: "running" });

        try {
          for (let i = currentExecutionIndex; i < executionQueue.length; i++) {
            const { executionState: currentState } = get();
            
            // Check if execution was paused or stopped
            if (currentState === "paused") {
              set({ currentExecutionIndex: i });
              break;
            }
            
            if (currentState === "idle") {
              break;
            }

            const command = executionQueue[i];
            console.log(`Executing command: ${command.type}`, command.metadata?.description);

            set({ currentExecutionIndex: i });
            await command.execute();

            // Add delay between commands (except for the last one)
            if (i < executionQueue.length - 1 && executionSpeed > 0) {
              await delay(executionSpeed);
            }
          }

          // If we completed all commands, reset to idle
          const { currentExecutionIndex: finalIndex } = get();
          if (finalIndex >= executionQueue.length - 1) {
            set({ 
              executionState: "idle",
              currentExecutionIndex: executionQueue.length 
            });
          }
        } catch (error) {
          console.error("Error during command execution:", error);
          set({ executionState: "paused" });
        }
      },

      pause: () => set({ executionState: "paused" }),

      resume: async () => {
        const { executionState } = get();
        if (executionState === "paused") {
          await get().start();
        }
      },

      step: async () => {
        const { executionQueue, currentExecutionIndex } = get();
        
        if (currentExecutionIndex >= executionQueue.length) {
          console.warn("No more commands to step through");
          return;
        }

        set({ executionState: "stepping" });

        try {
          const command = executionQueue[currentExecutionIndex];
          console.log(`Stepping: ${command.type}`, command.metadata?.description);
          
          await command.execute();
          
          const newIndex = currentExecutionIndex + 1;
          set({ 
            currentExecutionIndex: newIndex,
            executionState: newIndex >= executionQueue.length ? "idle" : "paused"
          });
        } catch (error) {
          console.error("Error during step execution:", error);
          set({ executionState: "paused" });
        }
      },

      reset: () => {
        set({
          executionQueue: [],
          currentExecutionIndex: 0,
          executionState: "idle",
        });
        
        console.log('🔄 Execution queue reset to default state');
      },

      stop: () => set({
        executionState: "idle",
        currentExecutionIndex: 0,
      }),

      // Execution Settings
      setExecutionSpeed: (speed: number) => set({ executionSpeed: Math.max(0, speed) }),

      // Getters
      getQueueLength: () => get().executionQueue.length,

      getCurrentCommand: () => {
        const { executionQueue, currentExecutionIndex } = get();
        return executionQueue[currentExecutionIndex] || null;
      },

      canStepForward: () => {
        const { executionQueue, currentExecutionIndex } = get();
        return currentExecutionIndex < executionQueue.length;
      },

      getProgress: () => {
        const { executionQueue, currentExecutionIndex } = get();
        return {
          current: currentExecutionIndex,
          total: executionQueue.length,
        };
      },

      isExecuting: () => {
        const { executionState } = get();
        return executionState === "running" || executionState === "stepping";
      },
    }),
    {
      name: 'visualiser-execution-queue',
    }
  )
);

// Command Factory Functions
export const createCallStackPushCommand = (
  functionName: string,
  callStackStore: any
): ExecutionCommand => ({
  id: generateCommandId(),
  type: 'CALL_STACK_PUSH',
  execute: async () => {
    callStackStore.push(functionName);
  },
  metadata: {
    source: 'CallStackStore',
    description: `Push ${functionName} to call stack`,
    timestamp: Date.now(),
  },
});

export const createCallStackPopCommand = (
  callStackStore: any
): ExecutionCommand => ({
  id: generateCommandId(),
  type: 'CALL_STACK_POP',
  execute: async () => {
    callStackStore.pop();
  },
  metadata: {
    source: 'CallStackStore',
    description: 'Pop from call stack',
    timestamp: Date.now(),
  },
});

export const createCallStackClearCommand = (
  callStackStore: any
): ExecutionCommand => ({
  id: generateCommandId(),
  type: 'CALL_STACK_CLEAR',
  execute: async () => {
    callStackStore.clearStack();
  },
  metadata: {
    source: 'CallStackStore',
    description: 'Clear call stack',
    timestamp: Date.now(),
  },
});

export const createDelayCommand = (
  delayMs: number,
  description?: string
): ExecutionCommand => ({
  id: generateCommandId(),
  type: 'DELAY',
  execute: async () => {
    await delay(delayMs);
  },
  metadata: {
    source: 'System',
    description: description || `Delay for ${delayMs}ms`,
    timestamp: Date.now(),
  },
});


