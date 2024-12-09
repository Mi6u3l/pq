import '@testing-library/jest-dom';
/// <reference types="react" />

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
