'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _EventTypes = require('./EventTypes');

var _EventTypes2 = _interopRequireDefault(_EventTypes);

var _ActionTypes = require('./ActionTypes');

var _ActionTypes2 = _interopRequireDefault(_ActionTypes);

var _MeService = require('./MeService');

var _MeService2 = _interopRequireDefault(_MeService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MeActions = {
  createSession: function createSession(data, backend) {
    var _this = this;

    return function (dispatch) {
      return dispatch({
        type: _ActionTypes2.default.CREATE_SESSION,
        payload: {
          promise: new _promise2.default(function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
              var session;
              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;
                      _context.next = 3;
                      return _MeService2.default.createSession(data, backend);

                    case 3:
                      session = _context.sent;

                      localStorage.setItem('session', (0, _stringify2.default)(session));
                      resolve(session);
                      _context.next = 11;
                      break;

                    case 8:
                      _context.prev = 8;
                      _context.t0 = _context['catch'](0);

                      reject(_context.t0);

                    case 11:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this, [[0, 8]]);
            }));

            return function (_x, _x2) {
              return _ref.apply(this, arguments);
            };
          }()),
          data: data
        }
      }).then(function (_ref2) {
        var session = _ref2.value;

        dispatch({
          type: _ActionTypes2.default.ANALYTICS,
          meta: {
            analytics: {
              eventType: _EventTypes2.default.LOG_IN,
              paramaters: {
                name: session.user.username,
                email: session.user.email,
                username: session.user.username,
                id: session.user.id,
                isNew: session.is_new
              }
            }
          }
        });
      });
    };
  },
  getMe: function getMe() {
    return {
      type: _ActionTypes2.default.GET_SESSION,
      payload: _MeService2.default.getMe()
    };
  },
  modifyMe: function modifyMe(profile) {
    return {
      type: _ActionTypes2.default.MODIFY_ME,
      payload: _MeService2.default.modifyMe({ profile: profile }),
      meta: {
        analytics: {
          eventType: _EventTypes2.default.MODIFIED_PROFILE
        }
      }
    };
  },
  modifyMeImage: function modifyMeImage(uri) {
    return {
      type: _ActionTypes2.default.MODIFY_ME,
      payload: {
        promise: _MeService2.default.modifyMeImage(uri),
        data: uri
      },
      meta: {
        analytics: {
          eventType: _EventTypes2.default.MODIFIED_PROFILE_IMAGE
        }
      }
    };
  },
  logout: function logout() {
    return {
      type: _ActionTypes2.default.DELETE_SESSION,
      payload: _MeService2.default.logout(),
      meta: {
        analytics: {
          eventType: _EventTypes2.default.LOG_OUT
        }
      }
    };
  },
  fetchNotifications: function fetchNotifications(nextPage) {
    return {
      type: _ActionTypes2.default.FETCH_NOTIFICATIONS,
      payload: _MeService2.default.fetchNotifications(nextPage).then(function (notifications) {
        return _promise2.default.resolve({ notifications: notifications, nextPage: nextPage });
      })
    };
  },
  markNotificationsAsRead: function markNotificationsAsRead() {
    return {
      type: _ActionTypes2.default.FETCH_NOTIFICATIONS,
      payload: _MeService2.default.markNotificationsAsRead()
    };
  }
};

exports.default = MeActions;