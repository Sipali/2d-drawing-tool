import { renderShapes } from '../rendering/renderShapes';

/**
 * Exports the HTML5 canvas as a PNG image download.
 * Temporarily redraws canvas without selection highlight before image capture to ensure clean PNG output.
 * 
 * @param {React.RefObject<HTMLCanvasElement>|HTMLCanvasElement} canvasRef 
 * @param {Array} shapes 
 * @param {string|null} selectedShapeId 
 * @param {string} [filename='drawing.png'] 
 */
export function exportCanvasAsPng(canvasRef, shapes = [], selectedShapeId = null, filename = 'drawing.png') {
  const canvas = canvasRef?.current ?? canvasRef;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Temporarily render canvas without selection highlights or draft preview
  renderShapes(ctx, shapes, null, null);

  // Capture canvas image as base64 PNG data URL
  const dataUrl = canvas.toDataURL('image/png');

  // Restore selection highlight in UI immediately
  renderShapes(ctx, shapes, null, selectedShapeId);

  // Create temporary anchor tag for download
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default exportCanvasAsPng;
