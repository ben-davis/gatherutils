'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEntityReducer = exports.Api = undefined;

var _Api = require('./Api');

var _Api2 = _interopRequireDefault(_Api);

var _createEntityReducer = require('./reducers/createEntityReducer');

var _createEntityReducer2 = _interopRequireDefault(_createEntityReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Api: _Api2.default,
  createEntityReducer: _createEntityReducer2.default
};
exports.Api = _Api2.default;
exports.createEntityReducer = _createEntityReducer2.default;