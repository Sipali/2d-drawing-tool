# 2D Canvas Drawing Tool

A lightweight 2D vector drawing application built with React, Vite, and the native HTML5 Canvas API. It supports interactive shape creation, live dimension previews, selection, dragging, deletion, undo/redo, and JSON/PNG exports.

## Features

- **Drawing Tools**: Line, Rectangle, and Circle creation.
- **Live Dimensions**: Real-time length, width/height, and radius readouts while drawing.
- **Select & Move**: Click any shape to select and drag it across the canvas.
- **Delete**: Remove selected shapes using the Delete button or `Delete` / `Backspace` keys.
- **Undo / Redo**: Step backward and forward through shape modifications (`Ctrl+Z`, `Ctrl+Y`, `Ctrl+Shift+Z`).
- **Export**: Save drawings as JSON files or clean PNG images.
- **Responsive Canvas**: Flexbox layout that fills the browser viewport and resizes the canvas without distorting drawings.

## Tech Stack

- React 18
- JavaScript (ES6+)
- Vite
- HTML5 Canvas 2D API
- Vanilla CSS

Per the assignment requirements, no external canvas libraries (like Fabric.js or Konva) were used. All drawing, hit testing, and geometry logic are implemented using standard Canvas 2D context methods.

## Getting Started

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

By default, Vite runs the app at `http://localhost:5173`.

## Architecture

The codebase is split into five main directories inside `src/`:

- `components/`: UI layout (`Toolbar.jsx`) and canvas event integration (`DrawingCanvas.jsx`).
- `geometry/`: Pure math functions for shape creation, dimension calculations, and point-in-shape hit testing.
- `rendering/`: Immediate-mode canvas rendering and live draft previews.
- `hooks/`: Custom `useDrawing` hook managing shapes and history state.
- `export/`: Utility functions for JSON serialization and PNG image downloads.

Separating geometry and rendering from React component state keeps math testable and prevents canvas drawing logic from polluting the UI layer. The hook uses a unified `{ past, present, future }` state structure to handle undo/redo history cleanly.

## Shape Data Format

Exported drawings follow a structured JSON format:

```json
{
  "shapes": [
    {
      "id": "1724859000001",
      "type": "line",
      "x1": 100,
      "y1": 150,
      "x2": 350,
      "y2": 250
    },
    {
      "id": "1724859000002",
      "type": "rectangle",
      "x": 200,
      "y": 100,
      "width": 150,
      "height": 100
    },
    {
      "id": "1724859000003",
      "type": "circle",
      "cx": 450,
      "cy": 300,
      "r": 75.5
    }
  ]
}
```

*Note: Each shape includes an internal `id` string used for tracking selection, dragging, and deletion.*

## Geometry Math

- **Line Length**: Calculated using the standard Euclidean distance formula $\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.
- **Rectangle Normalization**: Dragging in any direction (including reverse bottom-right to top-left) uses `Math.min` for the origin coordinates and `Math.abs` for width and height to guarantee valid top-left positioning.
- **Circle Radius**: Distance from the center point $(c_x, c_y)$ to the current mouse cursor position.

## Known Limitations

- **No Shape Resizing**: Created shapes can be moved or deleted, but cannot be resized via corner handles.
- **Mouse-Only Controls**: Events are wired to standard mouse handlers (`mousedown`, `mousemove`, `mouseup`), so touch screens are not supported out of the box.
- **No Z-Index Controls**: Shapes render in creation order without options to send forward or backward.
- **Undo Scope**: History tracks shape data changes (additions, moves, deletions) but does not track tool switching or selection highlights.

## Future Improvements

- Add corner resize handles for selected shapes.
- Implement JSON file import to load saved drawings back onto the canvas.
- Add touch event support (`pointerdown`, `pointermove`, `pointerup`) for mobile devices.
- Support stroke color and line thickness customization in the toolbar.
- Add optional grid snapping for precise technical drawing.
