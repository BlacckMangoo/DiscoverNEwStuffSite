


function GlobalExecutionContextWindow() {
  return (
    <div 
      className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/60 text-zinc-100 p-6 rounded-xl shadow-2xl w-150 h-100"
    >
      <div className="text-center mb-4">
        <h1 className="font-medium text-base tracking-tight text-zinc-50">
          Global Execution Context
        </h1>
      </div>
      
      {/* Divider */}
      <div className="w-full h-px bg-zinc-800/50 my-4"></div>
      
      {/* Sub-boxes */}
      <div className="flex flex-row gap-4 h-full">
        {/* Variable Environment */}
        <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/40 text-zinc-100 p-4 rounded-lg flex-1">
          <h3 className="font-medium text-sm mb-2 text-zinc-200">Variable Environment</h3>
          <p className="text-xs text-zinc-500">Variables and functions</p>
        </div>
        
        {/* Vertical divider */}
        <div className="w-px bg-zinc-800/40"></div>
        
        {/* Global Object */}
        <div className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/40 text-zinc-100 p-4 rounded-lg flex-1">
          <h3 className="font-medium text-sm mb-2 text-zinc-200">Global Object</h3>
          <p className="text-xs text-zinc-500">Window/Global scope</p>
        </div>
      </div>
    </div>
  )
}

export default GlobalExecutionContextWindow
