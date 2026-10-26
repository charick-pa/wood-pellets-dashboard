/**
 * Green River Panels — Wood Pellets Operations Dashboard
 * Master Components Bundle Wrapper (Backward Compatibility Layer)
 * Loads components from ./components/ directory
 */
window.Components = window.Components || {};

if (typeof module !== "undefined" && module.exports) {
  module.exports = window.Components;
}
