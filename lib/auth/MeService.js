'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Api = require('../Api');

var _Api2 = _interopRequireDefault(_Api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MeService = {
  createSession: function createSession(data, backend) {
    return _Api2.default.post('/auth/' + backend, data);
  },
  getMe: function getMe() {
    return _Api2.default.get('/me');
  },
  modifyMe: function modifyMe(profile) {
    return _Api2.default.patch('/me', profile);
  },
  modifyMeImage: function modifyMeImage(uri) {
    return _Api2.default.post('/me/image', {
      image: {
        uri: uri,
        type: 'image/jpeg',
        name: 'image.jpg'
      }
    }, true);
  },
  logout: function logout() {
    return _Api2.default.delete('/auth/');
  },
  registerDevice: function registerDevice(token, bundleIdentifier) {
    return _Api2.default.post('/me/device', {
      bundle_identifier: bundleIdentifier,
      token: token
    });
  },
  fetchNotifications: function fetchNotifications() {
    var nextPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    return _Api2.default.get('/me/notification', { page_number: nextPage });
  },
  markNotificationsAsRead: function markNotificationsAsRead() {
    return _Api2.default.post('/me/notification/read');
  },
  requestInvite: function requestInvite(data) {
    return _Api2.default.post('/auth/request_invite', data);
  }
};

exports.default = MeService;