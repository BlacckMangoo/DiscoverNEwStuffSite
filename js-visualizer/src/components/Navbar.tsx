function Navbar() {
  return (
    <nav className="bg-zinc-950 border-b border-zinc-800/60 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded-md"></div>
          <h1 className="text-zinc-100 font-medium text-lg tracking-tight">
            JS Visualizer
          </h1>
        </div>
        <div className="text-zinc-500 text-sm">
          JavaScript Execution Visualizer
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
