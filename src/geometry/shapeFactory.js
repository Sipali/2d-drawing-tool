// Functions to create shape data objects (lines, rectangles, circles) from coordinates.

/**
 * Creates a line shape data object.
 * @param {string} id 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 */
export function createLineShape(id, x1, y1, x2, y2) {
  return {
    id,
    type: 'line',
    x1,
    y1,
    x2,
    y2,
  };
}

/**
 * Creates a normalized rectangle shape data object.
 * Normalizes start and end coordinates so x, y is always top-left corner and width, height are positive.
 * @param {string} id 
 * @param {number} startX 
 * @param {number} startY 
 * @param {number} endX 
 * @param {number} endY 
 */
export function createRectangleShape(id, startX, startY, endX, endY) {
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  return {
    id,
    type: 'rectangle',
    x,
    y,
    width,
    height,
  };
}
