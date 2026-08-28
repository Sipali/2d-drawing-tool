import React, { useEffect, useCallback } from 'react'
import { useDrawing } from './hooks/useDrawing'
import Toolbar from './components/Toolbar'
import DrawingCanvas from './components/DrawingCanvas'
import { exportShapesAsJson } from './export/exportJson'
import './App.css'

function App() {
  const drawingState = useDrawing()
  const { shapes, selectedShapeId, setShapes, setSelectedShapeId } = drawingState

  const deleteSelectedShape = useCallback(() => {
    if (!selectedShapeId) return
    setShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== selectedShapeId))
    setSelectedShapeId(null)
  }, [selectedShapeId, setShapes, setSelectedShapeId])

  const handleExportJson = useCallback(() => {
    exportShapesAsJson(shapes)
  }, [shapes])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const tagName = target?.tagName?.toUpperCase()
      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target?.isContentEditable) {
        return
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        deleteSelectedShape()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [deleteSelectedShape])

  return (
    <div className="app-container">
      <Toolbar
        activeTool={drawingState.activeTool}
        setActiveTool={drawingState.setActiveTool}
        selectedShapeId={drawingState.selectedShapeId}
        onDeleteShape={deleteSelectedShape}
        onExportJson={handleExportJson}
      />
      <div className="canvas-container">
        <DrawingCanvas {...drawingState} />
      </div>
    </div>
  )
}

export default App
