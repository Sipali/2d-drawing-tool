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
