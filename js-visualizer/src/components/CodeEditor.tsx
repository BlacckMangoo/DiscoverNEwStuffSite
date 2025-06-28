import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';
import { LuChevronRight, LuChevronLeft, LuCirclePlay } from "react-icons/lu";
import { LuPlay } from 'react-icons/lu';






const defaultCode = `function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

function main() {
  const result = fibonacci(5);
  console.log("Result:", result);
  return result;
}

main();`;

function CodeEditor() {
  const [code, setCode] = useState(defaultCode);
  const editorRef = useRef(null);


 

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Define custom zinc theme
    monaco.editor.defineTheme('zinc-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '71717a', fontStyle: 'italic' },
        { token: 'keyword', foreground: '10b981', fontStyle: 'bold' },
        { token: 'string', foreground: 'fbbf24' },
        { token: 'number', foreground: 'f472b6' },
        { token: 'identifier', foreground: 'e4e4e7' },
        { token: 'type', foreground: '06b6d4' },
        { token: 'operator', foreground: 'a78bfa' },
        { token: 'delimiter', foreground: '9ca3af' },
        { token: 'function', foreground: '60a5fa' },
        { token: 'variable', foreground: 'fde047' },
      ],
      colors: {
        'editor.background': '#09090b',
        'editor.foreground': '#e4e4e7',
        'editorLineNumber.foreground': '#52525b',
        'editorLineNumber.activeForeground': '#a1a1aa',
        'editor.selectionBackground': '#27272a80',
        'editor.inactiveSelectionBackground': '#18181b80',
        'editor.lineHighlightBackground': '#18181b40',
        'editorCursor.foreground': '#10b981',
        'editorWhitespace.foreground': '#27272a',
        'editorIndentGuide.background': '#27272a',
        'editorIndentGuide.activeBackground': '#3f3f46',
        'editor.selectionHighlightBackground': '#27272a60',
        'editorBracketMatch.background': '#374151',
        'editorBracketMatch.border': '#10b981',
        'scrollbar.shadow': '#00000000',
        'scrollbarSlider.background': '#52525b40',
        'scrollbarSlider.hoverBackground': '#52525b60',
        'scrollbarSlider.activeBackground': '#52525b80',
        'editorGutter.background': '#09090b',
        'editorSuggestWidget.background': '#18181b',
        'editorSuggestWidget.border': '#3f3f46',
        'editorSuggestWidget.selectedBackground': '#27272a',
        'editorHoverWidget.background': '#18181b',
        'editorHoverWidget.border': '#3f3f46',
      }
    });



    // Set the theme
    monaco.editor.setTheme('zinc-dark');
  };  const handleRunCode = () => {



  };

  const handleStepBack = () => {
    console.log('Step back');

  };

  const handlePlay = () => {
  
  };

  const handleStepForward = () => {
    console.log('Step forward');
 
  };

  return (
    <div className="h-full bg-zinc-950 border-l border-zinc-800/60 flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900/50 border-b border-zinc-800/60 px-4 py-3 flex items-center ">

        <h2 className="text-zinc-200 font-medium text-sm tracking-tight">
          Code Editor
        </h2>
          <div className='ml-auto flex items-center space-x-2'>
          {/* Step Back Button */}
          <button
            onClick={handleStepBack}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200 group"
            title="Step Back"
          >
            <LuChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={handlePlay}
            className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-all duration-200 group"
            title="Play/Pause"
          >
            <LuPlay className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

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
            
          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <LuCirclePlay className="w-4 h-4" />
            Run Code
          </button>
        </div>
        
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
            fontLigatures: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            renderWhitespace: 'selection',
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
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </div>
      
      {/* Footer */}
      <div className="bg-zinc-900/50 border-t border-zinc-800/60 px-4 py-2 flex items-center justify-between">
        <div className="text-zinc-500 text-xs">
          Ready to execute
        </div>
        <div className="text-zinc-600 text-xs">
          JavaScript • {code.split('\n').length} lines
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;