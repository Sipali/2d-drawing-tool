/**
 * Exports the array of shape objects as a formatted JSON file download.
 * 
 * @param {Array} shapes 
 * @param {string} [filename='drawing.json'] 
 */
export function exportShapesAsJson(shapes = [], filename = 'drawing.json') {
  const data = { shapes };
  const jsonString = JSON.stringify(data, null, 2);

  // Create a Blob with application/json MIME type
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Generate temporary Object URL for the blob
  const url = URL.createObjectURL(blob);

  // Create anchor element for programmatic download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Append, click, and clean up anchor element
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke object URL to free browser memory
  URL.revokeObjectURL(url);
}

export default exportShapesAsJson;
