import React, { useRef, useEffect } from 'react';
import { createLineShape, createRectangleShape, createCircleShape } from '../geometry/shapeFactory';
import { findShapeAtPoint } from '../geometry/hitTest';
import { renderShapes } from '../rendering/renderShapes';

/**
 * Converts a native mouse event's clientX/clientY into canvas-local coordinates.
 * Accounts for canvas bounding rectangle and scale factor between CSS rendered size and canvas HTML attributes.
 * 
 * @param {MouseEvent|React.MouseEvent} event 
 * @param {React.RefObject<HTMLCanvasElement>|HTMLCanvasElement} canvasRef 
 * @returns {{x: number, y: number}}
 */
export function getCanvasCoordinates(event, canvasRef) {
  const canvas = canvasRef?.current ?? canvasRef;
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return { x: 0, y: 0 };
  }

  // Calculate scale factors in case CSS display size differs from internal canvas resolution
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // Convert client coordinates to canvas internal pixel coordinates
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  return { x, y };
}

export default function DrawingCanvas({
  shapes = [],
  setShapes,
  activeTool = 'line',
  draft = null,
  setDraft,
  selectedShapeId = null,
  setSelectedShapeId,
  dragOffset = null,
  setDragOffset,
}) {
  const canvasRef = useRef(null);

  // ResizeObserver updates canvas width/height attributes when container or window resizes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderShapes(ctx, shapes, draft, selectedShapeId);
        }
      }
    };

    // Initial size update
    updateCanvasSize();

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, [shapes, draft, selectedShapeId]);

  // Re-render canvas whenever shapes, draft, or selectedShapeId changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      renderShapes(ctx, shapes, draft, selectedShapeId);
    }
  }, [shapes, draft, selectedShapeId]);

  const handleMouseDown = (event) => {
    const coords = getCanvasCoordinates(event, canvasRef);
    if (activeTool === 'select') {
      const foundShape = findShapeAtPoint(shapes, coords.x, coords.y);
      if (foundShape) {
        setSelectedShapeId?.(foundShape.id);
        // Calculate offset between click position and shape reference point
        let offset = null;
        if (foundShape.type === 'line') {
          offset = { dx: coords.x - foundShape.x1, dy: coords.y - foundShape.y1 };
        } else if (foundShape.type === 'rectangle') {
          offset = { dx: coords.x - foundShape.x, dy: coords.y - foundShape.y };
        } else if (foundShape.type === 'circle') {
          offset = { dx: coords.x - foundShape.cx, dy: coords.y - foundShape.cy };
        }
        setDragOffset?.(offset);
      } else {
        setSelectedShapeId?.(null);
        setDragOffset?.(null);
      }
    } else if (activeTool === 'line') {
      setDraft?.({
        type: 'line',
        x1: coords.x,
        y1: coords.y,
        x2: coords.x,
        y2: coords.y,
      });
    } else if (activeTool === 'rectangle') {
      setDraft?.({
        type: 'rectangle',
        startX: coords.x,
        startY: coords.y,
        endX: coords.x,
        endY: coords.y,
      });
    } else if (activeTool === 'circle') {
      setDraft?.({
        type: 'circle',
        cx: coords.x,
        cy: coords.y,
        currentX: coords.x,
        currentY: coords.y,
      });
    }
  };

  const handleMouseMove = (event) => {
    const coords = getCanvasCoordinates(event, canvasRef);

    if (activeTool === 'select') {
      if (!selectedShapeId || !dragOffset) return;

      const newRefX = coords.x - dragOffset.dx;
      const newRefY = coords.y - dragOffset.dy;

      setShapes?.((prevShapes) =>
        prevShapes.map((shape) => {
          if (shape.id !== selectedShapeId) return shape;

          if (shape.type === 'line') {
            const deltaX = newRefX - shape.x1;
            const deltaY = newRefY - shape.y1;
            return {
              ...shape,
              x1: newRefX,
              y1: newRefY,
              x2: shape.x2 + deltaX,
              y2: shape.y2 + deltaY,
            };
          } else if (shape.type === 'rectangle') {
            return {
              ...shape,
              x: newRefX,
              y: newRefY,
            };
          } else if (shape.type === 'circle') {
            return {
              ...shape,
              cx: newRefX,
              cy: newRefY,
            };
          }
          return shape;
        })
      );
      return;
    }

    if (!draft) return;

    setDraft?.((prevDraft) => {
      if (!prevDraft) return null;
      if (prevDraft.type === 'line') {
        return {
          ...prevDraft,
          x2: coords.x,
          y2: coords.y,
        };
      } else if (prevDraft.type === 'rectangle') {
        return {
          ...prevDraft,
          endX: coords.x,
          endY: coords.y,
        };
      } else if (prevDraft.type === 'circle') {
        return {
          ...prevDraft,
          currentX: coords.x,
          currentY: coords.y,
        };
      }
      return prevDraft;
    });
  };

  const handleMouseUp = (event) => {
    if (activeTool === 'select') {
      setDragOffset?.(null);
      return;
    }

    if (!draft) return;
    const coords = getCanvasCoordinates(event, canvasRef);
    if (draft.type === 'line') {
      const newShape = createLineShape(
        Date.now().toString(),
        draft.x1,
        draft.y1,
        coords.x,
        coords.y
      );
      setShapes?.((prevShapes) => [...prevShapes, newShape]);
    } else if (draft.type === 'rectangle') {
      const newShape = createRectangleShape(
        Date.now().toString(),
        draft.startX,
        draft.startY,
        coords.x,
        coords.y
      );
      setShapes?.((prevShapes) => [...prevShapes, newShape]);
    } else if (draft.type === 'circle') {
      const newShape = createCircleShape(
        Date.now().toString(),
        draft.cx,
        draft.cy,
        coords.x,
        coords.y
      );
      setShapes?.((prevShapes) => [...prevShapes, newShape]);
    }
    setDraft?.(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
