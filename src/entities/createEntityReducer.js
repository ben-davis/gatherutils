// @flow

import createReducer from 'type-to-reducer';
import Immutable from 'immutable';

import Status from '../Status';


function _getListSlug(action) {
  if (action.meta) {
    return action.meta.slug && 'default';
  }

  return 'default';
}


function createEntityReducer(entityName, options = {}) {
  const {
    detailActionType = `@@GATHER_FETCH_${entityName.toUpperCase()}_DETAIL`,
    listActionType = `@@GATHER_FETCH_${entityName.toUpperCase()}_LIST`,
  } = options;

  const ENTITY_KEY = 'entities';
  const ENTITY_LIST_KEY = 'lists';

  const initialState = Immutable.Map({
    [ENTITY_KEY]: new Immutable.Map(),
    [ENTITY_LIST_KEY]: new Immutable.Map(),
  });

  return createReducer({

    [detailActionType]: {
      PENDING(state, action) {
        const {id} = action.meta;

        if (!id) {
          throw new Error('Pending actions must contain an id as part of the action meta when using EntityReducers');
        }

        const existingEntity = state.getIn([ENTITY_KEY, id]);

        return state.mergeIn([ENTITY_KEY, id], Immutable.Map({
          id,
          [entityName]: existingEntity || null,
          error: null,
          status: existingEntity ? Status.RELOADING : Status.PENDING,
        }));
      },

      SUCCESS(state, action) {
        const entity = action.payload;
        const {id} = action.meta;

        if (!id) {
          throw new Error('Success actions must contain an id as part of the action meta when using EntityReducers');
        }

        return state.mergeIn([ENTITY_KEY, id], Immutable.Map({
          status: Status.SUCCESS,
          [entityName]: Immutable.fromJS(entity),
        }));
      },

      ERROR(state, action) {
        const {error} = action.payload;
        const {id} = action.meta;

        if (!error) {
          throw new Error('Error actions must contain an error as part of the action when using EntityReducers');
        }

        if (!id) {
          throw new Error('Error actions must contain an id as part of the action meta when using EntityReducers');
        }

        return state.mergeIn([ENTITY_KEY, id], Immutable.Map({
          error,
          status: Status.ERROR,
        }));
      },
    },

    [listActionType]: {
      PENDING(state, action) {
        const slug = _getListSlug(action);

        const existingList = state.getIn([ENTITY_LIST_KEY, slug]);

        return state.mergeIn([ENTITY_LIST_KEY, slug], Immutable.Map({
          slug,
          error: null,
          list: existingList || null,
          status: existingList ? Status.RELOADING : Status.PENDING,
        }));
      },

      SUCCESS(state, action) {
        const slug = _getListSlug(action);

        const {list} = action.payload;

        return state.mergeIn([ENTITY_LIST_KEY, slug], Immutable.Map({
          list: Immutable.fromJS(list),
          status: Status.SUCCESS,
        }));
      },

      ERROR(state, action) {
        const slug = _getListSlug(action);

        const error = action.payload;

        return state.mergeIn([ENTITY_LIST_KEY, slug], Immutable.Map({
          error,
          status: Status.ERROR,
        }));
      },
    },

  }, initialState);
}

export default createEntityReducer;
