import Api from '../Api';


const MeService = {

  createSession(data, backend) {
    return Api.post(`/auth/${backend}`, data);
  },

  getMe() {
    return Api.get('/me');
  },

  modifyMe(profile) {
    return Api.patch('/me', profile);
  },

  modifyMeImage(uri) {
    return Api.post('/me/image', {
      image: {
        uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      },
    }, true);
  },

  logout() {
    return Api.delete('/auth/');
  },

  registerDevice(token, bundleIdentifier) {
    return Api.post('/me/device', {
      bundle_identifier: bundleIdentifier,
      token,
    });
  },

  fetchNotifications(nextPage = 1) {
    return Api.get('/me/notification', {page_number: nextPage});
  },

  markNotificationsAsRead() {
    return Api.post('/me/notification/read');
  },

  requestInvite(data) {
    return Api.post('/auth/request_invite', data);
  },

};

export default MeService;
