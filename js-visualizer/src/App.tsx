
import './App.css'
import Navbar from './components/Navbar'
import CodeEditor from './components/CodeEditor'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable'

function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Resizable split screen below navbar */}
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left panel */}
          <ResizablePanel defaultSize={60} minSize={60} className='bg-gray-900'>
           
          </ResizablePanel>
          
          {/* Resizable handle */}
          <ResizableHandle  />
          
          {/* Right panel */}
          <ResizablePanel defaultSize={40} minSize={40} className='bg-gray-800'>
            <CodeEditor />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default App
