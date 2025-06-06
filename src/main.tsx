import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Add detailed error logging
console.log('Environment:', import.meta.env);
console.log('React version:', React.version);

console.log('main.tsx: Script started');

// Add more detailed error handler
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', {
    message,
    source,
    lineno,
    colno,
    error,
    stack: error?.stack,
    type: error?.constructor?.name
  });
  // Make error visible on page
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: red;">Error Occurred</h1>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
${message}
At: ${source}:${lineno}:${colno}
Stack: ${error?.stack || 'No stack trace'}
        </pre>
      </div>
    `;
  }
  document.documentElement.style.visibility = 'visible';
  return false;
};

// Add unhandled rejection handler
window.onunhandledrejection = function(event) {
  console.error('Unhandled promise rejection:', event.reason);
  // Make content visible in case of error
  document.documentElement.style.visibility = 'visible';
};

console.log('main.tsx: Looking for root element');
const root = document.getElementById('root');

if (!root) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

console.log('main.tsx: Root element found');

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('main.tsx: App component wrapped in StrictMode');

// Add error handling for render
try {
  console.log('main.tsx: Starting to create root...');
  const rootInstance = createRoot(root);
  console.log('main.tsx: Root instance created successfully');
  
  console.log('main.tsx: Starting to render app...');
  rootInstance.render(app);
  console.log('main.tsx: Initial render completed');
  
  // Make content visible after successful render
  document.documentElement.style.visibility = 'visible';
} catch (error) {
  console.error('Failed to render app:', error);
  // Make content visible in case of error
  document.documentElement.style.visibility = 'visible';
  // Show a basic error message to user
  root.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Something went wrong</h1>
      <p>The application failed to load. Please try refreshing the page.</p>
      <pre style="color: red; text-align: left; margin-top: 20px; padding: 10px; background: #f8f8f8; border-radius: 4px; overflow: auto;">
Error: ${error instanceof Error ? error.message : 'Unknown error'}

${error instanceof Error && error.stack ? error.stack : ''}
      </pre>
    </div>
  `;
}
