// Canvas drawing functions to render finalized shapes and active draft previews.
import { getLineLength, getRectangleDimensions } from '../geometry/dimensions';

/**
 * Clears the canvas and renders all finalized shapes and the active draft shape.
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Array} shapes 
 * @param {Object|null} draft 
 */
export function renderShapes(ctx, shapes = [], draft = null) {
  if (!ctx) return;

  // Clear entire canvas area
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Set default line styles for finalized shapes
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.setLineDash([]); // Ensure solid lines

  // Render all finalized shapes
  for (const shape of shapes) {
    if (shape.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
    } else if (shape.type === 'rectangle') {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  }

  // Render in-progress draft shape if present
  if (draft) {
    if (draft.type === 'line') {
      ctx.save();
      ctx.setLineDash([5, 5]); // Dashed stroke for draft preview
      ctx.beginPath();
      ctx.moveTo(draft.x1, draft.y1);
      ctx.lineTo(draft.x2, draft.y2);
      ctx.stroke();

      // Render length readout near the midpoint
      const length = getLineLength(draft.x1, draft.y1, draft.x2, draft.y2);
      const midX = (draft.x1 + draft.x2) / 2;
      const midY = (draft.y1 + draft.y2) / 2;

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(`${length}px`, midX + 8, midY - 8);

      ctx.restore();
    } else if (draft.type === 'rectangle') {
      ctx.save();
      ctx.setLineDash([5, 5]); // Dashed stroke for draft preview
      const x = Math.min(draft.startX, draft.endX);
      const y = Math.min(draft.startY, draft.endY);
      const width = Math.abs(draft.endX - draft.startX);
      const height = Math.abs(draft.endY - draft.startY);

      ctx.strokeRect(x, y, width, height);

      // Render width x height readout near cursor
      const { width: w, height: h } = getRectangleDimensions(
        draft.startX,
        draft.startY,
        draft.endX,
        draft.endY
      );
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(`${w} x ${h}`, draft.endX + 8, draft.endY + 16);

      ctx.restore();
    }
  }
}
