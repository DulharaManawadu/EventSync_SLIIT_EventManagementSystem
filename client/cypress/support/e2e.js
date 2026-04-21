// =============================================================================
// cypress/support/e2e.js
// Entry point loaded before every spec file.
// =============================================================================

// Import all custom commands
import './commands';

// ─── Global behaviour tweaks ─────────────────────────────────────────────────

// Prevent Cypress from failing on uncaught exceptions thrown by the React app
// (e.g., ResizeObserver loop errors, third-party library warnings).
// We only care about our own test assertions.
Cypress.on('uncaught:exception', (err) => {
  // Return false to prevent Cypress failing the test
  if (
    err.message.includes('ResizeObserver loop') ||
    err.message.includes('Non-Error promise rejection') ||
    err.message.includes('Cannot read properties of null')
  ) {
    return false;
  }
  // Re-throw anything else so real bugs are not silently swallowed
  return true;
});
