// Hit testing functions to detect point intersection with drawn shapes.

/**
 * Checks if a point (px, py) is within a specified pixel tolerance of a line segment (x1,y1)-(x2,y2).
 * Uses vector projection clamped to [0, 1] to calculate exact distance to the line segment.
 * 
 * @param {number} px 
 * @param {number} py 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} tolerance 
 * @returns {boolean}
 */
export function isPointOnLine(px, py, x1, y1, x2, y2, tolerance = 5) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    const dist = Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    return dist <= tolerance;
  }

  // Calculate projection scalar t of point onto line segment
  const t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
  // Clamp t to segment bounds [0, 1]
  const clampedT = Math.max(0, Math.min(1, t));

  // Find nearest point on line segment
  const projX = x1 + clampedT * dx;
  const projY = y1 + clampedT * dy;

  // Calculate distance from point to nearest point on segment
  const distance = Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);

  return distance <= tolerance;
}

/**
 * Checks if a point (px, py) is inside a rectangle.
 * 
 * @param {number} px 
 * @param {number} py 
 * @param {number} x 
 * @param {number} y 
 * @param {number} width 
 * @param {number} height 
 * @returns {boolean}
 */
export function isPointInRectangle(px, py, x, y, width, height) {
  return (
    px >= x &&
    px <= x + width &&
    py >= y &&
    py <= y + height
  );
}

/**
 * Checks if a point (px, py) is inside a circle.
 * 
 * @param {number} px 
 * @param {number} py 
 * @param {number} cx 
 * @param {number} cy 
 * @param {number} r 
 * @returns {boolean}
 */
export function isPointInCircle(px, py, cx, cy, r) {
  const distanceSq = (px - cx) ** 2 + (py - cy) ** 2;
  return distanceSq <= r * r;
}

/**
 * Searches reverse-chronologically (topmost first) for the first shape intersecting (px, py).
 * 
 * @param {Array} shapes 
 * @param {number} px 
 * @param {number} py 
 * @returns {Object|null}
 */
export function findShapeAtPoint(shapes = [], px, py) {
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    if (shape.type === 'line') {
      if (isPointOnLine(px, py, shape.x1, shape.y1, shape.x2, shape.y2)) {
        return shape;
      }
    } else if (shape.type === 'rectangle') {
      if (isPointInRectangle(px, py, shape.x, shape.y, shape.width, shape.height)) {
        return shape;
      }
    } else if (shape.type === 'circle') {
      if (isPointInCircle(px, py, shape.cx, shape.cy, shape.r)) {
        return shape;
      }
    }
  }
  return null;
}
