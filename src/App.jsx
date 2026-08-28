import React from 'react'
import { useDrawing } from './hooks/useDrawing'
import Toolbar from './components/Toolbar'
import DrawingCanvas from './components/DrawingCanvas'
import './App.css'

function App() {
  const drawingState = useDrawing()

  return (
    <div className="app-container">
      <Toolbar
        activeTool={drawingState.activeTool}
        setActiveTool={drawingState.setActiveTool}
      />
      <div className="canvas-container">
        <DrawingCanvas {...drawingState} />
      </div>
    </div>
  )
}

export default App
