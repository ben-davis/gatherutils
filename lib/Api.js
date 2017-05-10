'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BASE = process.env.GATHER_API_BASE || 'https://api.gatherdata.co';

var ApiUtils = {
  _getToken: function _getToken() {
    var data = localStorage.getItem('session');

    if (data) {
      var session = JSON.parse(data);

      if (!session.token) {
        return localStorage.removeItem('session');
      }

      return 'Token ' + session.token;
    }

    return null;
  },
  _getVersion: function _getVersion() {
    var data = localStorage.getItem('gatherVersion');

    if (data) {
      var version = JSON.parse(data);

      return version;
    }

    return null;
  },
  _handleResponse: function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(requestData, response) {
      var message;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!response.ok) {
                _context.next = 4;
                break;
              }

              if (!(response.status === 204)) {
                _context.next = 3;
                break;
              }

              return _context.abrupt('return', _promise2.default.resolve());

            case 3:
              return _context.abrupt('return', response.json());

            case 4:
              _context.next = 6;
              return response.json();

            case 6:
              message = _context.sent;
              return _context.abrupt('return', _promise2.default.reject(_immutable2.default.Map({
                name: 'ApiError',
                message: _immutable2.default.Map(message),
                meta: _immutable2.default.fromJS({
                  ok: response.ok,
                  status: response.status,
                  statusText: response.statusText,
                  requestData: _immutable2.default.Map(requestData)
                })
              })));

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function _handleResponse(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return _handleResponse;
  }(),
  _getHeaders: function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
      var contentType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'application/json';
      var token, version, headers;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this._getToken();

            case 2:
              token = _context2.sent;
              _context2.next = 5;
              return this._getVersion();

            case 5:
              version = _context2.sent;
              headers = {
                Accept: 'application/json',
                'Content-Type': contentType
              };

              if (token) {
                headers.Authorization = token;
              }
              if (version) {
                headers.X_GATHER_VERSION = version;
              }

              return _context2.abrupt('return', headers);

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function _getHeaders() {
      return _ref2.apply(this, arguments);
    }

    return _getHeaders;
  }(),
  _getPostBody: function _getPostBody(data) {
    var formData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var body = void 0;
    if (formData) {
      body = new FormData();
      (0, _keys2.default)(data).forEach(function (key) {
        body.append(key, data[key] || '');
      });
    } else {
      body = (0, _stringify2.default)(data);
    }

    return body;
  },
  _fetch: function _fetch(url, data) {
    var _this = this;

    return fetch(url, data).then(function (response) {
      return _this._handleResponse(data, response);
    }).catch(function (error) {
      if (!_immutable2.default.Iterable.isIterable(error)) {
        var newError = { detail: 'Application Error' };
        throw newError;
      }

      throw error;
    });
  },
  get: function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(url, query) {
      var fullUrl, stringifiedQuery, headers;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              fullUrl = '' + BASE + url;
              stringifiedQuery = _querystring2.default.stringify(query);

              if (stringifiedQuery) {
                fullUrl = fullUrl + '?' + stringifiedQuery;
              }

              _context3.next = 5;
              return this._getHeaders();

            case 5:
              headers = _context3.sent;
              return _context3.abrupt('return', this._fetch(fullUrl, {
                method: 'GET',
                headers: headers
              }));

            case 7:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function get(_x5, _x6) {
      return _ref3.apply(this, arguments);
    }

    return get;
  }(),
  post: function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(url, data) {
      var formData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var query = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var fullUrl, stringifiedQuery, headers, body;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              fullUrl = '' + BASE + url;
              stringifiedQuery = _querystring2.default.stringify(query);

              if (stringifiedQuery) {
                fullUrl = fullUrl + '?' + stringifiedQuery;
              }

              _context4.next = 5;
              return this._getHeaders(formData ? 'multipart/FormData' : 'application/json');

            case 5:
              headers = _context4.sent;
              body = this._getPostBody(data, formData);
              return _context4.abrupt('return', this._fetch(fullUrl, {
                method: 'POST',
                headers: headers,
                body: body
              }));

            case 8:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function post(_x9, _x10) {
      return _ref4.apply(this, arguments);
    }

    return post;
  }(),
  delete: function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(url) {
      var fullUrl, headers;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              fullUrl = '' + BASE + url;
              _context5.next = 3;
              return this._getHeaders();

            case 3:
              headers = _context5.sent;
              return _context5.abrupt('return', this._fetch(fullUrl, {
                method: 'DELETE',
                headers: headers
              }));

            case 5:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function _delete(_x11) {
      return _ref5.apply(this, arguments);
    }

    return _delete;
  }(),
  put: function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(url, data) {
      var formData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var fullUrl, headers, body;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              fullUrl = '' + BASE + url;
              _context6.next = 3;
              return this._getHeaders(formData ? 'multipart/FormData' : 'application/json');

            case 3:
              headers = _context6.sent;
              body = this._getPostBody(data, formData);
              return _context6.abrupt('return', this._fetch(fullUrl, {
                method: 'PUT',
                headers: headers,
                body: body
              }));

            case 6:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function put(_x13, _x14) {
      return _ref6.apply(this, arguments);
    }

    return put;
  }(),
  patch: function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(url, data) {
      var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var fullUrl, headers, body;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              fullUrl = '' + BASE + url + '?' + _querystring2.default.stringify(query);
              _context7.next = 3;
              return this._getHeaders();

            case 3:
              headers = _context7.sent;
              body = this._getPostBody(data);
              return _context7.abrupt('return', this._fetch(fullUrl, {
                method: 'PATCH',
                headers: headers,
                body: body
              }));

            case 6:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function patch(_x16, _x17) {
      return _ref7.apply(this, arguments);
    }

    return patch;
  }()
};

exports.default = ApiUtils;