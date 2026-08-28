import { useState } from 'react';

/**
 * Custom hook to manage 2D drawing tool state.
 * 
 * State:
 * - shapes: Array of finalized drawn shapes (e.g. lines, rectangles, circles)
 * - activeTool: Currently active tool ('line' | 'rectangle' | 'circle' | 'select'), defaults to 'line'
 * - selectedShapeId: ID of the currently selected shape, or null
 * - draft: Shape currently being drawn interactively before completion, or null
 */
export function useDrawing() {
  const [shapes, setShapes] = useState([]);
  const [activeTool, setActiveTool] = useState('line');
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [draft, setDraft] = useState(null);

  return {
    shapes,
    setShapes,
    activeTool,
    setActiveTool,
    selectedShapeId,
    setSelectedShapeId,
    draft,
    setDraft,
  };
}

export default useDrawing;
