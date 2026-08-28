import React, { useRef, useEffect, useCallback } from 'react'
import { useDrawing } from './hooks/useDrawing'
import Toolbar from './components/Toolbar'
import DrawingCanvas from './components/DrawingCanvas'
import { exportShapesAsJson } from './export/exportJson'
import { exportCanvasAsPng } from './export/exportPng'
import './App.css'

function App() {
  const drawingState = useDrawing()
  const {
    shapes,
    selectedShapeId,
    setSelectedShapeId,
    commitShapes,
    undo,
    redo,
    canUndo,
    canRedo,
  } = drawingState

  const canvasRef = useRef(null)

  const deleteSelectedShape = useCallback(() => {
    if (!selectedShapeId) return
    commitShapes((prevShapes) => prevShapes.filter((shape) => shape.id !== selectedShapeId))
    setSelectedShapeId(null)
  }, [selectedShapeId, commitShapes, setSelectedShapeId])

  const handleExportJson = useCallback(() => {
    exportShapesAsJson(shapes)
  }, [shapes])

  const handleExportPng = useCallback(() => {
    exportCanvasAsPng(canvasRef, shapes, selectedShapeId)
  }, [shapes, selectedShapeId])

  // Ref that always points to the latest action handlers, avoiding stale closures in keydown listener
  const actionsRef = useRef({ undo, redo, deleteSelectedShape })
  useEffect(() => {
    actionsRef.current = { undo, redo, deleteSelectedShape }
  })

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const tagName = target?.tagName?.toUpperCase()
      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || target?.isContentEditable) {
        return
      }

      const isCtrlOrCmd = event.ctrlKey || event.metaKey
      const key = event.key.toLowerCase()

      if (isCtrlOrCmd && key === 'z' && !event.shiftKey) {
        event.preventDefault()
        actionsRef.current.undo()
      } else if ((isCtrlOrCmd && key === 'y') || (isCtrlOrCmd && key === 'z' && event.shiftKey)) {
        event.preventDefault()
        actionsRef.current.redo()
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        actionsRef.current.deleteSelectedShape()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="app-container">
      <Toolbar
        activeTool={drawingState.activeTool}
        setActiveTool={drawingState.setActiveTool}
        selectedShapeId={drawingState.selectedShapeId}
        onDeleteShape={deleteSelectedShape}
        onExportJson={handleExportJson}
        onExportPng={handleExportPng}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
      />
      <div className="canvas-container">
        <DrawingCanvas canvasRef={canvasRef} {...drawingState} />
      </div>
    </div>
  )
}

export default App
