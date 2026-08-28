import React from 'react';

const tools = [
  { id: 'line', label: 'Line' },
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'circle', label: 'Circle' },
  { id: 'select', label: 'Select' },
];

/**
 * Toolbar component allowing user to switch between drawing tools.
 * 
 * @param {{ activeTool: string, setActiveTool: (tool: string) => void }} props 
 */
export default function Toolbar({ activeTool, setActiveTool }) {
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
    </div>
  );
}
