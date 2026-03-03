/**
 * EventSync Server Entry Point
 * Load and start the server with proper error handling
 */

try {
  require('./src/server');
} catch (error) {
  console.error('❌ Failed to boot server from src/server.js');
  console.error('Error:', error.message);
  console.error('\nEnsure that:');
  console.error('1. MongoDB URI is correctly configured in .env');
  console.error('2. Dependencies are installed: npm install');
  console.error('3. Node version is >= 14.0.0');
  process.exit(1);
}