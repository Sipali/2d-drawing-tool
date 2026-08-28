# 2D Canvas Drawing Tool

A lightweight, web-based 2D vector drawing application built with React, Vite, and the native HTML5 Canvas 2D API. It allows users to draw lines, rectangles, and circles, select and drag shapes, delete items, undo/redo actions, and export drawings to JSON or PNG.

## Features

- **Drawing Tools**: Interactive line, rectangle, and circle creation.
- **Live Dimension Readouts**: Shows real-time measurement labels while drawing (pixel length for lines, width x height for rectangles, and radius for circles).
- **Selection & Editing**: Switch to the Select tool to click any shape. Selected shapes are highlighted with a blue border and can be dragged around the canvas.
- **Deletion**: Delete the selected shape using the Delete toolbar button or the `Delete` / `Backspace` keyboard keys.
- **Undo / Redo**: Step backward (`Ctrl+Z`) or forward (`Ctrl+Y` / `Ctrl+Shift+Z`) through shape creation, movement, and deletion history.
- **JSON Export**: Export the current drawing canvas as a structured JSON file.
- **PNG Export**: Export the canvas drawing as a clean PNG image, automatically hiding selection highlights during capture.
- **Responsive Layout**: Flexbox container that fills 100% of the browser window and automatically resizes canvas dimensions without distorting coordinate accuracy.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: JavaScript (ES6+)
- **Graphics Engine**: Native HTML5 Canvas 2D Context API (`CanvasRenderingContext2D`)
- **Styling**: Vanilla CSS (no CSS frameworks used)

No external drawing libraries (such as Fabric.js, Konva, or Paper.js) or utility libraries (like lodash or file-saver) were used. All geometry calculations, hit-testing, coordinate conversions, and rendering loops are written from scratch.

## Local Setup

Make sure you have Node.js installed (v18+ recommended).

1. Clone the repository and navigate into the project directory:
   ```bash
   cd 2d-drawing-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

Vite will start a server, typically running at `http://localhost:5173` (or `http://localhost:5174` if 5173 is in use). Open the URL in your browser to run the app.

To test a production build locally:
```bash
npm run build
```

## Architecture & Code Structure

The project is structured around a clear separation of concerns between state management, math/geometry calculations, rendering, and UI controls:

```
src/
├── components/
│   ├── DrawingCanvas.jsx  # Canvas element, ResizeObserver, mouse event listeners
│   └── Toolbar.jsx        # Tool buttons, action triggers, responsive styling
├── export/
│   ├── exportJson.js      # JSON serializing and blob download trigger
│   └── exportPng.js       # PNG data URL capture with highlight suppression
├── geometry/
│   ├── dimensions.js      # Line length, rectangle size, circle radius math
│   ├── hitTest.js         # Distance-to-segment, box, and circle intersection math
│   └── shapeFactory.js    # Data object creators for lines, rects, and circles
├── hooks/
│   └── useDrawing.js      # Custom React hook for unified history stack & shapes state
├── rendering/
│   └── renderShapes.js    # Immediate-mode canvas clearing, shape drawing, draft preview
├── App.jsx                # Top-level layout container & global keyboard shortcut listener
├── App.css                # App-level flexbox layout and toolbar CSS
├── index.css              # Global root reset and typography
└── main.jsx               # React DOM entry point
```

### Why it's split this way:
- **`src/geometry`** contains pure, stateless functions for math and coordinate detection. This makes geometry unit-testable and independent of React or DOM code.
- **`src/rendering`** houses the Canvas 2D immediate-mode rendering functions. It only receives a canvas context, a list of shapes, and an active draft preview to draw.
- **`src/hooks`** maintains state via a single `drawingState` object containing `{ past, present, future }` history stacks, ensuring atomic state updates and avoiding stale React closure bugs.
- **`src/components`** contains UI elements (`Toolbar`) and canvas event integration (`DrawingCanvas`).

## Shape Data Format & JSON Export

Drawings are exported as a JSON object containing a top-level `shapes` array:

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

### Internal `id` Property
Each shape object includes a unique string `id` (generated via timestamp at creation time). Although the basic shape properties match standard 2D vector schemas, the `id` field is added so the selection tool, dragging engine, deletion logic, and React key properties can uniquely identify individual shapes even if two shapes share identical coordinates.

## Geometry & Math Notes

1. **Line Length**: Calculated using the Euclidean distance formula $\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$ between start and end points, rounded to 2 decimal places.
2. **Rectangle Normalization**: Canvas `strokeRect(x, y, width, height)` requires top-left origin `(x, y)` and non-negative dimensions. When dragging in reverse directions (e.g., bottom-right to top-left), `Math.min(startX, endX)` and `Math.min(startY, endY)` determine the top-left corner, while `Math.abs(endX - startX)` and `Math.abs(endY - startY)` compute positive width and height.
3. **Circle Radius**: Distance formula between circle center $(c_x, c_y)$ and current cursor position $(currentX, currentY)$.
4. **Line Hit Testing**: Uses vector projection clamped to the $[0, 1]$ parameter range to compute the exact perpendicular distance from a mouse click to the nearest point on the line segment. A click registers as a hit if the distance is within 5 pixels. This avoids the inaccuracy of axis-aligned bounding boxes for thin diagonal lines.

## Known Limitations

- **No Post-Creation Resizing**: Shapes can be created, moved, and deleted, but individual control handles for resizing shapes after creation are not implemented.
- **Undo/Redo Scope**: History snapshots track shape modifications (add, move, delete). Tool selection changes and mouse cursor movement during active dragging are not recorded in the undo stack.
- **Pointer/Touch Events**: The application targets mouse events (`onMouseDown`, `onMouseMove`, `onMouseUp`). Touch events on mobile devices are not explicitly mapped.
- **Z-Index Layering**: Shapes are drawn in array order (first created at the back, newest at the front). There are no controls to send shapes backward or bring them forward.

## Future Improvements

If I had more time to expand the project, I would implement:

1. **Resize Handles**: Interactive corner and edge bounding-box handles when a shape is selected to allow scaling and resizing.
2. **JSON Import**: A file loader to import previously exported `drawing.json` files back onto the canvas.
3. **Touch Support**: Mapping Pointer Events (`onPointerDown`, `onPointerMove`, `onPointerUp`) for mobile touch screen drawing.
4. **Color & Stroke Customization**: A color picker and stroke width slider in the toolbar.
5. **Snap to Grid**: An optional background grid overlay with coordinate snapping for precise technical drawing.
