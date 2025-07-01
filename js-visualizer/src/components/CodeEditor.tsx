import { useRef } from "react";
import Editor from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import { useCodeEditorStore } from "@/Store/CodeEditorStore";
import CodeEditorController from "./CodeEditorController";

function CodeEditor() {
  const editorRef = useRef(null);

  const { code, setCode,currentWindowMode } = useCodeEditorStore();

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Define custom zinc theme
    monaco.editor.defineTheme("zinc-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "71717a", fontStyle: "italic" },
        { token: "keyword", foreground: "10b981", fontStyle: "bold" },
        { token: "string", foreground: "fbbf24" },
        { token: "number", foreground: "f472b6" },
        { token: "identifier", foreground: "e4e4e7" },
        { token: "type", foreground: "06b6d4" },
        { token: "operator", foreground: "a78bfa" },
        { token: "delimiter", foreground: "9ca3af" },
        { token: "function", foreground: "60a5fa" },
        { token: "variable", foreground: "fde047" },
      ],
      colors: {
        "editor.background": "#09090b",
        "editor.foreground": "#e4e4e7",
        "editorLineNumber.foreground": "#52525b",
        "editorLineNumber.activeForeground": "#a1a1aa",
        "editor.selectionBackground": "#27272a80",
        "editor.inactiveSelectionBackground": "#18181b80",
        "editor.lineHighlightBackground": "#18181b40",
        "editorCursor.foreground": "#10b981",
        "editorWhitespace.foreground": "#27272a",
        "editorIndentGuide.background": "#27272a",
        "editorIndentGuide.activeBackground": "#3f3f46",
        "editor.selectionHighlightBackground": "#27272a60",
        "editorBracketMatch.background": "#374151",
        "editorBracketMatch.border": "#10b981",
        "scrollbar.shadow": "#00000000",
        "scrollbarSlider.background": "#52525b40",
        "scrollbarSlider.hoverBackground": "#52525b60",
        "scrollbarSlider.activeBackground": "#52525b80",
        "editorGutter.background": "#09090b",
        "editorSuggestWidget.background": "#18181b",
        "editorSuggestWidget.border": "#3f3f46",
        "editorSuggestWidget.selectedBackground": "#27272a",
        "editorHoverWidget.background": "#18181b",
        "editorHoverWidget.border": "#3f3f46",
      },
    });

    // Set the theme
    monaco.editor.setTheme("zinc-dark");
  };

  return (
    <div className="h-full bg-zinc-950 border-l border-zinc-800/60 flex flex-col">
      {/* Header */}
      <CodeEditorController></CodeEditorController>
      {/* Editor Area */}

      {
        currentWindowMode == "codeEditor" ?
        <div className="flex-1 relative overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code}
            onChange={(value) => setCode(value || "")}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineHeight: 1.6,
              fontFamily:
                "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
              fontLigatures: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              renderLineHighlight: "line",
              renderWhitespace: "selection",
              bracketPairColorization: { enabled: true },
              guides: {
                indentation: true,
                bracketPairs: true,
              },
              suggest: {
                showKeywords: true,
                showSnippets: true,
              },
              padding: { top: 16, bottom: 16 },
              lineNumbers: "on",
              glyphMargin: false,
              folding: true,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div> :
        <div className="flex-1 flex items-center justify-center">
          <div className="text-zinc-500 text-sm">Code Editor is hidden</div>
        </div>


    
      }

      {/* Footer */}
      <div className="bg-zinc-900/50 border-t border-zinc-800/60 px-4 py-2 flex items-center justify-between">
        <div className="text-zinc-500 text-xs">Ready to execute</div>
        <div className="text-zinc-600 text-xs">
          JavaScript • {code.split("\n").length} lines
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
