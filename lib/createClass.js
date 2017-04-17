'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createReactClass = _react2.default.createClass;

function createClass(funcOrObject) {
  if (typeof funcOrObject === 'function') {
    return funcOrObject;
  }

  return createReactClass(funcOrObject);
}

exports.default = createClass;