'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createReducer;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _typeToReducer = require('type-to-reducer');

var _typeToReducer2 = _interopRequireDefault(_typeToReducer);

var _Status = require('../Status');

var _Status2 = _interopRequireDefault(_Status);

var _ActionTypes = require('./ActionTypes');

var _ActionTypes2 = _interopRequireDefault(_ActionTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = new _immutable2.default.Map({
  sessionState: new _immutable2.default.Map({
    session: new _immutable2.default.Map(),
    status: _Status2.default.INITIAL,
    error: null
  }),
  notificationState: new _immutable2.default.Map({
    error: null,
    notifications: new _immutable2.default.List(),
    status: _Status2.default.INITIAL
  })
});

var _handleSession = {
  PENDING: function PENDING(state) {
    return state.mergeIn(['sessionState'], _immutable2.default.Map({
      status: _Status2.default.PENDING,
      error: null
    }));
  },
  SUCCESS: function SUCCESS(state, action) {
    return state.mergeIn(['sessionState'], _immutable2.default.Map({
      session: _immutable2.default.fromJS(action.payload),
      status: _Status2.default.SUCCESS,
      error: null
    }));
  },
  ERROR: function ERROR(state, action) {
    return state.mergeIn(['sessionState'], _immutable2.default.Map({
      status: _Status2.default.ERROR,
      error: action.payload
    }));
  }
};

var meReducer = (0, _typeToReducer2.default)((_createReducer = {}, _defineProperty(_createReducer, _ActionTypes2.default.CREATE_SESSION, _handleSession), _defineProperty(_createReducer, _ActionTypes2.default.GET_SESSION, _handleSession), _defineProperty(_createReducer, _ActionTypes2.default.MODIFY_ME, _handleSession), _defineProperty(_createReducer, _ActionTypes2.default.DELETE_SESSION, {
  SUCCESS: function SUCCESS() {
    return initialState;
  }
}), _defineProperty(_createReducer, _ActionTypes2.default.FETCH_NOTIFICATIONS, {
  PENDING: function PENDING(state) {
    var currentStatus = state.getIn(['notificationState', 'status']);

    return state.mergeIn(['notificationState'], {
      status: currentStatus === _Status2.default.INITIAL ? _Status2.default.PENDING : _Status2.default.RELOADING,
      error: null
    });
  },
  SUCCESS: function SUCCESS(state, action) {
    var newNotifications = _immutable2.default.fromJS(action.notifications);

    // Action was a a new page
    if (action.nextPage) {
      var existingNotificationItems = state.getIn(['notificationState', 'notifications', 'items']);

      newNotifications = newNotifications.update('items', function (newItems) {
        return existingNotificationItems.concat(newItems);
      });
    }

    return state.mergeIn(['notificationState'], {
      status: _Status2.default.SUCCESS,
      notifications: newNotifications,
      error: null
    });
  },
  ERROR: function ERROR(state) {
    return state.mergeIn(['notificationState'], {
      status: _Status2.default.ERROR,
      error: null
    });
  }
}), _createReducer), initialState);

exports.default = meReducer;