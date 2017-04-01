import Immutable from 'immutable';
import createReducer from 'type-to-reducer';

import Status from '../Status';

import ActionTypes from './ActionTypes';


const initialState = new Immutable.Map({
  sessionState: new Immutable.Map({
    session: new Immutable.Map(),
    status: Status.INITIAL,
    error: null,
  }),
  notificationState: new Immutable.Map({
    error: null,
    notifications: new Immutable.List(),
    status: Status.INITIAL,
  }),
});


const _handleSession = {
  PENDING: state => state.mergeIn(['sessionState'], Immutable.Map({
    status: Status.PENDING,
    error: null,
  })),
  SUCCESS: (state, action) => state.mergeIn(['sessionState'], Immutable.Map({
    session: Immutable.fromJS(action.payload),
    status: Status.SUCCESS,
    error: null,
  })),
  ERROR: (state, action) => state.mergeIn(['sessionState'], Immutable.Map({
    status: Status.ERROR,
    error: action.payload,
  })),
};

const meReducer = createReducer({
  [ActionTypes.CREATE_SESSION]: _handleSession,
  [ActionTypes.GET_SESSION]: _handleSession,
  [ActionTypes.MODIFY_ME]: _handleSession,

  [ActionTypes.DELETE_SESSION]: {
    SUCCESS: () => initialState,
  },

  [ActionTypes.FETCH_NOTIFICATIONS]: {
    PENDING: state => {
      const currentStatus = state.getIn(['notificationState', 'status']);

      return state.mergeIn(['notificationState'], {
        status: currentStatus === Status.INITIAL ? Status.PENDING : Status.RELOADING,
        error: null,
      });
    },
    SUCCESS: (state, action) => {
      let newNotifications = Immutable.fromJS(action.notifications);

      // Action was a a new page
      if (action.nextPage) {
        const existingNotificationItems = state.getIn([
          'notificationState',
          'notifications',
          'items',
        ]);

        newNotifications = newNotifications.update('items', newItems => (
          existingNotificationItems.concat(newItems)
        ));
      }

      return state.mergeIn(['notificationState'], {
        status: Status.SUCCESS,
        notifications: newNotifications,
        error: null,
      });
    },
    ERROR: state => state.mergeIn(['notificationState'], {
      status: Status.ERROR,
      error: null,
    }),
  },
}, initialState);

export default meReducer;
