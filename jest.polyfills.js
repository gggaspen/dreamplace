// Polyfills for Jest testing environment
import 'whatwg-fetch';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { TextEncoder, TextDecoder } = require('util');

// Add global Response if not available
if (typeof global.Response === 'undefined') {
  global.Response = Response;
}

// Add global Request if not available
if (typeof global.Request === 'undefined') {
  global.Request = Request;
}

// Add TextEncoder/TextDecoder for Node.js
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Mock URL for Node.js
if (typeof URL === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  global.URL = require('url').URL;
}

// Add structuredClone polyfill for Node.js
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = obj => {
    return JSON.parse(JSON.stringify(obj));
  };
}
