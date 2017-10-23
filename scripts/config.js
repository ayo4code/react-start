const path = require('path');
const ip = require('ip');
exports.ROOT_PATH = path.join(__dirname, '..');
exports.DEVELOPMENT_IP = ip.address();
exports.DEVELOPMENT_PORT = '3001';
exports.RELEASE_PATH = 'dist';
exports.MOCK_SERVER_BASE = 'mock-server';