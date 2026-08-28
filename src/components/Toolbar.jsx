import React from 'react';

const tools = [
  { id: 'line', label: 'Line' },
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'circle', label: 'Circle' },
  { id: 'select', label: 'Select' },
];

/**
 * Toolbar component allowing user to switch tools, undo/redo actions, delete shapes, and export drawing.
 * 
 * @param {{
 *   activeTool: string,
 *   setActiveTool: (tool: string) => void,
 *   selectedShapeId: string|null,
 *   onDeleteShape: () => void,
 *   onExportJson: () => void,
 *   onExportPng: () => void,
 *   canUndo: boolean,
 *   canRedo: boolean,
 *   onUndo: () => void,
 *   onRedo: () => void
 * }} props 
 */
export default function Toolbar({
  activeTool,
  setActiveTool,
  selectedShapeId,
  onDeleteShape,
  onExportJson,
  onExportPng,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
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
        className="toolbar-btn"
        disabled={!canUndo}
        onClick={onUndo}
        title={canUndo ? 'Undo last action (Ctrl+Z)' : 'Nothing to undo'}
      >
        Undo
      </button>
      <button
        type="button"
        className="toolbar-btn"
        disabled={!canRedo}
        onClick={onRedo}
        title={canRedo ? 'Redo last undone action (Ctrl+Y / Ctrl+Shift+Z)' : 'Nothing to redo'}
      >
        Redo
      </button>
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
        Export JSON
      </button>
      <button
        type="button"
        className="toolbar-btn export-btn"
        onClick={onExportPng}
        title="Export drawing as PNG image"
      >
        Export PNG
      </button>
    </div>
  );
}
