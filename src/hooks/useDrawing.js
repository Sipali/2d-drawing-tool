import { useState, useCallback } from 'react';

/**
 * Custom hook to manage 2D drawing tool state using a single unified state object:
 * { past: [], present: [], future: [] }
 */
export function useDrawing() {
  const [drawingState, setDrawingState] = useState({
    past: [],       // array of previous "present" shape snapshots
    present: [],    // current shapes array
    future: []      // array of undone shape snapshots for redo
  });

  const [activeTool, setActiveTool] = useState('line');
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [dragOffset, setDragOffset] = useState(null);

  // Directly updates current present shapes (e.g. for real-time drag preview) without modifying history
  const setShapes = useCallback((newShapesOrFn) => {
    setDrawingState((prev) => ({
      ...prev,
      present: typeof newShapesOrFn === 'function' ? newShapesOrFn(prev.present) : newShapesOrFn,
    }));
  }, []);

  // Commits a new finalized action: pushes current present to past, updates present, clears future
  const commitShapes = useCallback((newShapesOrFn) => {
    setDrawingState((prev) => ({
      past: [...prev.past, prev.present],
      present: typeof newShapesOrFn === 'function' ? newShapesOrFn(prev.present) : newShapesOrFn,
      future: [],
    }));
  }, []);

  // Undoes the last action: restores last snapshot from past to present, moves current present to future
  const undo = useCallback(() => {
    setDrawingState((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  // Redoes the last undone action: restores first snapshot from future to present, moves current present to past
  const redo = useCallback(() => {
    setDrawingState((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  return {
    shapes: drawingState.present,
    setShapes,
    activeTool,
    setActiveTool,
    selectedShapeId,
    setSelectedShapeId,
    draft,
    setDraft,
    dragOffset,
    setDragOffset,
    canUndo: drawingState.past.length > 0,
    canRedo: drawingState.future.length > 0,
    commitShapes,
    undo,
    redo,
    history: drawingState.past,
    redoStack: drawingState.future,
    drawingState,
  };
}

export default useDrawing;
