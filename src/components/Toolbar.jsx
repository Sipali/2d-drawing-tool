import React from 'react';

const tools = [
  { id: 'line', label: 'Line' },
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'circle', label: 'Circle' },
  { id: 'select', label: 'Select' },
];

/**
 * Toolbar component allowing user to switch between drawing tools and delete selected shape.
 * 
 * @param {{
 *   activeTool: string,
 *   setActiveTool: (tool: string) => void,
 *   selectedShapeId: string|null,
 *   onDeleteShape: () => void
 * }} props 
 */
export default function Toolbar({
  activeTool,
  setActiveTool,
  selectedShapeId,
  onDeleteShape,
}) {
  return (
    <div className="toolbar">
      {tools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          className={`toolbar-btn ${activeTool === tool.id ? 'active' : ''}`}
          onClick={() => setActiveTool(tool.id)}
        >
          {tool.label}
        </button>
      ))}
      <button
        type="button"
        className="toolbar-btn delete-btn"
        disabled={!selectedShapeId}
        onClick={onDeleteShape}
        title={selectedShapeId ? 'Delete selected shape (Del/Backspace)' : 'No shape selected'}
      >
        Delete
      </button>
    </div>
  );
}
