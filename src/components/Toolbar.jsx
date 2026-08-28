import React from 'react';

const tools = [
  { id: 'line', label: 'Line' },
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'circle', label: 'Circle' },
  { id: 'select', label: 'Select' },
];

/**
 * Toolbar component allowing user to switch between drawing tools, delete selected shape, and export drawing as JSON.
 * 
 * @param {{
 *   activeTool: string,
 *   setActiveTool: (tool: string) => void,
 *   selectedShapeId: string|null,
 *   onDeleteShape: () => void,
 *   onExportJson: () => void
 * }} props 
 */
export default function Toolbar({
  activeTool,
  setActiveTool,
  selectedShapeId,
  onDeleteShape,
  onExportJson,
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
      <button
        type="button"
        className="toolbar-btn export-btn"
        onClick={onExportJson}
        title="Export drawing as JSON file"
      >
        Export
      </button>
    </div>
  );
}
