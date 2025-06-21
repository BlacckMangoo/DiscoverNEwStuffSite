
import './App.css'
import Navbar from './components/Navbar'
import CodeEditor from './components/CodeEditor'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable'
import VisualizerWindow from './components/VisuliserWindow'
function App() {
  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Resizable split screen below navbar */}
      <div className="flex-1">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left panel */}
          <ResizablePanel defaultSize={60} minSize={30} className='bg-zinc-950'>
            <VisualizerWindow />
          </ResizablePanel>
          
          {/* Resizable handle */}
          <ResizableHandle />
          
          {/* Right panel */}
          <ResizablePanel defaultSize={40} minSize={30} className='bg-zinc-950'>
            <CodeEditor />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

export default App
