

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">JS Visualizer</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Add your navbar items here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
