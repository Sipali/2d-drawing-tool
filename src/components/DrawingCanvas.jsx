import React, { useRef, useEffect } from 'react';

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
      }
    };

    // Initial size update
    updateCanvasSize();

    // ResizeObserver updates canvas width/height attributes when container or window resizes
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleMouseDown = (event) => {
    const coords = getCanvasCoordinates(event, canvasRef);
    // Temporary console.log to verify coordinate mapping; will be replaced with real drawing state logic in the next step.
    console.log('onMouseDown:', coords);
  };

  const handleMouseMove = (event) => {
    const coords = getCanvasCoordinates(event, canvasRef);
    // Temporary console.log to verify coordinate mapping; will be replaced with real drawing state logic in the next step.
    console.log('onMouseMove:', coords);
  };

  const handleMouseUp = (event) => {
    const coords = getCanvasCoordinates(event, canvasRef);
    // Temporary console.log to verify coordinate mapping; will be replaced with real drawing state logic in the next step.
    console.log('onMouseUp:', coords);
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
