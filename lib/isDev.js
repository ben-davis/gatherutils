'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDev;
function isDev() {
  return process.env.NODE_ENV === 'development';
}