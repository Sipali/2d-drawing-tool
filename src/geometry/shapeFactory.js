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
 * Normalizes start and end coordinates so x, y is always top-left corner and width, height are positive and rounded to 2 decimal places.
 * @param {string} id 
 * @param {number} startX 
 * @param {number} startY 
 * @param {number} endX 
 * @param {number} endY 
 */
export function createRectangleShape(id, startX, startY, endX, endY) {
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const rawWidth = Math.abs(endX - startX);
  const rawHeight = Math.abs(endY - startY);
  const width = Math.round(rawWidth * 100) / 100;
  const height = Math.round(rawHeight * 100) / 100;

  return {
    id,
    type: 'rectangle',
    x,
    y,
    width,
    height,
  };
}

/**
 * Creates a circle shape data object.
 * Calculates radius from center (cx, cy) to edge (currentX, currentY).
 * @param {string} id 
 * @param {number} cx 
 * @param {number} cy 
 * @param {number} currentX 
 * @param {number} currentY 
 */
export function createCircleShape(id, cx, cy, currentX, currentY) {
  const radius = Math.sqrt((currentX - cx) ** 2 + (currentY - cy) ** 2);
  const r = Math.round(radius * 100) / 100;

  return {
    id,
    type: 'circle',
    cx,
    cy,
    r,
  };
}
