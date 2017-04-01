'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventTypes = require('./EventTypes');

var _EventTypes2 = _interopRequireDefault(_EventTypes);

var _ActionTypes = require('./ActionTypes');

var _ActionTypes2 = _interopRequireDefault(_ActionTypes);

var _MeService = require('./MeService');

var _MeService2 = _interopRequireDefault(_MeService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MeActions = {
  createSession: function createSession(data, backend) {
    return function (dispatch) {
      return dispatch({
        type: _ActionTypes2.default.CREATE_SESSION,
        payload: {
          promise: _MeService2.default.createSession(data, backend),
          data: data
        }
      }).then(function (_ref) {
        var session = _ref.value;

        localStorage.setItem('session', JSON.stringify(session));

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
        return Promise.resolve({ notifications: notifications, nextPage: nextPage });
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