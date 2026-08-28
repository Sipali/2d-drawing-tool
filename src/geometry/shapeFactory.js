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
