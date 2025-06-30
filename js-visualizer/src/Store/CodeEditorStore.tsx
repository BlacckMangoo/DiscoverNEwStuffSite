import { create } from "zustand";

/**
 * Code Editor Store - Global State Management
 * 
 * This store handles:
 * - Storing the current code being written in the editor
 * - Updating code when user types
 */

const defaultCode = `function a() {
  b();
}
function b() {
  c();
}
function c() {
  console.log("hi");
}
a();`;

type CodeExecutionMode = 'step' | 'run' | 'pause' | 'stop'| 'default';
type windowMode = "astViewer" | "codeEditor";
interface CodeEditorState {


  code: string;
  currentWindowMode?: windowMode;
  currentMode?: CodeExecutionMode;
  setCode: (newCode: string) => void;
  clearCode: () => void;
  changeMode?: (newMode: CodeExecutionMode) => void;
  changeWindowMode?: (newWindowMode: windowMode) => void;

}

export const useCodeEditorStore = create<CodeEditorState>((set) => ({
  // State
  code: defaultCode,
  currentMode: 'default',
  currentWindowMode: 'codeEditor',

  // Actions
  setCode: (newCode: string) => set({ code: newCode }),
  
  clearCode: () => set({ code: '' }),
changeMode: (newMode: CodeExecutionMode) => set({ currentMode: newMode }),
changeWindowMode: (newWindowMode: windowMode) => set({ currentWindowMode: newWindowMode})

}));



