function CodeEditor() {
  return (
    <div className="h-full bg-zinc-950 border-l border-zinc-800/60 flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900/50 border-b border-zinc-800/60 px-4 py-3">
        <h2 className="text-zinc-200 font-medium text-sm tracking-tight">
          Code Editor
        </h2>
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 p-4">
        <div className="h-full bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/40 rounded-lg p-4">
          <pre className="text-zinc-300 text-sm font-mono leading-relaxed">
            <code>{`function main() {
  let x = 5;
  let y = helper(x);
  return y;
}

function helper(num) {
  return calculate(num * 2);
}

function calculate(value) {
  return value + 10;
}

// Call the main function
main();`}</code>
          </pre>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-zinc-900/50 border-t border-zinc-800/60 px-4 py-2">
        <div className="text-zinc-500 text-xs">
          Ready to execute
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;