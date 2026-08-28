import React, { useRef, useEffect } from 'react';
import { useDrawing } from '../hooks/useDrawing';
import { createLineShape, createRectangleShape } from '../geometry/shapeFactory';
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

export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const { shapes, setShapes, activeTool, draft, setDraft } = useDrawing();

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
          renderShapes(ctx, shapes, draft);
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
  }, [shapes, draft]);

  // Re-render canvas whenever shapes or draft state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      renderShapes(ctx, shapes, draft);
    }
  }, [shapes, draft]);

  const handleMouseDown = (event) => {
    const coords = getCanvasCoordinates(event, canvasRef);
    if (activeTool === 'line') {
      setDraft({
        type: 'line',
        x1: coords.x,
        y1: coords.y,
        x2: coords.x,
        y2: coords.y,
      });
    } else if (activeTool === 'rectangle') {
      setDraft({
        type: 'rectangle',
        startX: coords.x,
        startY: coords.y,
        endX: coords.x,
        endY: coords.y,
      });
    }
  };

  const handleMouseMove = (event) => {
    if (!draft) return;
    const coords = getCanvasCoordinates(event, canvasRef);
    setDraft((prevDraft) => {
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
      }
      return prevDraft;
    });
  };

  const handleMouseUp = (event) => {
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
      setShapes((prevShapes) => [...prevShapes, newShape]);
    } else if (draft.type === 'rectangle') {
      const newShape = createRectangleShape(
        Date.now().toString(),
        draft.startX,
        draft.startY,
        coords.x,
        coords.y
      );
      setShapes((prevShapes) => [...prevShapes, newShape]);
    }
    setDraft(null);
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
