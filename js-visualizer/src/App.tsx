
import './App.css'
import Navbar from './components/Navbar'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable'

function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Resizable split screen below navbar */}
      <div className="flex-1">
        <ResizablePanelGroup direction="vertical" className="h-full">
          {/* Top panel */}
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="p-4 h-full bg-gray-50">
              <h2 className="text-lg font-medium mb-4">Top Panel</h2>
              <p className="text-gray-600">This is the top section of your split screen.</p>
            </div>
          </ResizablePanel>
          
          {/* Resizable handle */}
          <ResizableHandle withHandle />
          
          {/* Bottom panel */}
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="p-4 h-full bg-white">
              <h2 className="text-lg font-medium mb-4">Bottom Panel</h2>
              <p className="text-gray-600">This is the bottom section of your split screen.</p>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default App
