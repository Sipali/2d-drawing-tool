// Geometry helper functions for computing shape dimensions and bounding boxes.

/**
 * Calculates the length of a line segment between (x1, y1) and (x2, y2), rounded to 2 decimal places.
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 */
export function getLineLength(x1, y1, x2, y2) {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return Math.round(length * 100) / 100;
}

/**
 * Calculates normalized width and height of a rectangle between (startX, startY) and (endX, endY),
 * rounded to 2 decimal places.
 * @param {number} startX 
 * @param {number} startY 
 * @param {number} endX 
 * @param {number} endY 
 */
export function getRectangleDimensions(startX, startY, endX, endY) {
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);
  return {
    width: Math.round(width * 100) / 100,
    height: Math.round(height * 100) / 100,
  };
}

/**
 * Calculates the radius of a circle from center (cx, cy) to edge (currentX, currentY), rounded to 2 decimal places.
 * @param {number} cx 
 * @param {number} cy 
 * @param {number} currentX 
 * @param {number} currentY 
 */
export function getCircleRadius(cx, cy, currentX, currentY) {
  const radius = Math.sqrt((currentX - cx) ** 2 + (currentY - cy) ** 2);
  return Math.round(radius * 100) / 100;
}
