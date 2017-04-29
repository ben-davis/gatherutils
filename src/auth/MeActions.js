import EventTypes from './EventTypes';
import ActionTypes from './ActionTypes';
import MeService from './MeService';


const MeActions = {

  createSession(data, backend) {
    return dispatch => dispatch({
      type: ActionTypes.CREATE_SESSION,
      payload: {
        promise: new Promise(async (resolve, reject) => {
          try {
            const session = await MeService.createSession(data, backend);
            localStorage.setItem('session', JSON.stringify(session));
            resolve(session);
          } catch (error) {
            reject(error);
          }
        }),
        data,
      },
    }).then(({ value: session }) => {
      dispatch({
        type: ActionTypes.ANALYTICS,
        meta: {
          analytics: {
            eventType: EventTypes.LOG_IN,
            paramaters: {
              name: session.user.username,
              email: session.user.email,
              username: session.user.username,
              id: session.user.id,
              isNew: session.is_new,
            },
          },
        },
      });
    });
  },

  getMe() {
    return {
      type: ActionTypes.GET_SESSION,
      payload: MeService.getMe(),
    };
  },

  modifyMe(profile) {
    return {
      type: ActionTypes.MODIFY_ME,
      payload: MeService.modifyMe({ profile }),
      meta: {
        analytics: {
          eventType: EventTypes.MODIFIED_PROFILE,
        },
      },
    };
  },

  modifyMeImage(uri) {
    return {
      type: ActionTypes.MODIFY_ME,
      payload: {
        promise: MeService.modifyMeImage(uri),
        data: uri,
      },
      meta: {
        analytics: {
          eventType: EventTypes.MODIFIED_PROFILE_IMAGE,
        },
      },
    };
  },

  logout() {
    return {
      type: ActionTypes.DELETE_SESSION,
      payload: MeService.logout(),
      meta: {
        analytics: {
          eventType: EventTypes.LOG_OUT,
        },
      },
    };
  },

  fetchNotifications(nextPage) {
    return {
      type: ActionTypes.FETCH_NOTIFICATIONS,
      payload: MeService.fetchNotifications(nextPage).then(
        notifications => Promise.resolve({ notifications, nextPage }),
      ),
    };
  },

  markNotificationsAsRead() {
    return {
      type: ActionTypes.FETCH_NOTIFICATIONS,
      payload: MeService.markNotificationsAsRead(),
    };
  },

  requestInvite(data) {
    return {
      type: ActionTypes.REQUEST_INVITE,
      payload: MeService.requestInvite(data),
    };
  },

};

export default MeActions;
