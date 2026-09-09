// Compatibility bridge for the existing local POS HTML.
// The renderer currently uses a few legacy element-id globals (notably catsEl).
// Define them safely before the page's inline application script executes.
Object.defineProperty(window, 'catsEl', {
  configurable: true,
  get: () => document.getElementById('cats')
});
