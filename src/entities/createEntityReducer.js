import createReducer from 'type-to-reducer';
import Immutable from 'immutable';

import Status from '../Status';

function _getListSlug(action) {
  if (action.meta) {
    return action.meta.slug || 'default';
  }

  return 'default';
}

function createEntityReducer(entityName, options = {}) {
  const {
    detailActionType = `@@GATHER_FETCH_${entityName.toUpperCase()}_DETAIL`,
    createActionType = `@@GATHER_CREATE_${entityName.toUpperCase()}`,
    patchActionType = `@@GATHER_PATCH_${entityName.toUpperCase()}`,
    listActionType = `@@GATHER_FETCH_${entityName.toUpperCase()}_LIST`,
    additionalInitialState = Immutable.Map({}),
    additionalActionHandlers = {},
  } = options;

  const ENTITY_KEY = 'entities';
  const ENTITY_LIST_KEY = 'lists';

  const initialState = Immutable.Map({
    [ENTITY_KEY]: new Immutable.Map(),
    [ENTITY_LIST_KEY]: new Immutable.Map(),
    createStatus: Status.INITIAL,
  }).merge(additionalInitialState);

  const handleEntityUpdate = {
    _validateAction(action) {
      const { type, payload: entity, meta = {} } = action;
      let id = meta.id || entity.id;

      const error = entity;
      const { noSave } = meta;

      id = parseInt(id, 10) || id;
      if (!id) {
        throw new Error(
          'Actions must contain an id as part of the action meta when using EntityReducers',
        );
      }

      return {
        id,
        type,
        entity,
        noSave,
        error,
      };
    },

    PENDING(state, action) {
      const { id, entity, noSave } = handleEntityUpdate._validateAction(action);

      if (noSave) {
        return state;
      }

      const existingEntity = state.getIn([ENTITY_KEY, id, entityName]);

      let entityToSave = null;
      if (entity) {
        entityToSave = Immutable.fromJS(entity);
      } else if (existingEntity) {
        entityToSave = existingEntity;
      }

      return state.mergeIn(
        [ENTITY_KEY, id],
        Immutable.Map({
          id,
          [entityName]: entityToSave,
          error: null,
          status: entityToSave ? Status.RELOADING : Status.PENDING,
        }),
      );
    },

    SUCCESS(state, action) {
      const { id, entity, noSave } = handleEntityUpdate._validateAction(action);

      if (noSave) {
        return state;
      }

      return state.mergeIn(
        [ENTITY_KEY, id],
        Immutable.Map({
          status: Status.SUCCESS,
          [entityName]: Immutable.fromJS(entity),
        }),
      );
    },

    ERROR(state, action) {
      const { id, error, noSave } = handleEntityUpdate._validateAction(action);

      if (noSave) {
        return state;
      }

      if (!error) {
        throw new Error(
          'Error actions must contain an error as part of the action when using EntityReducers',
        );
      }

      return state.mergeIn(
        [ENTITY_KEY, id],
        Immutable.Map({
          error,
          status: Status.ERROR,
        }),
      );
    },
  };

  return createReducer(
    {
      [detailActionType]: handleEntityUpdate,
      [patchActionType]: handleEntityUpdate,
      [createActionType]: {
        PENDING(state) {
          return state.set('createStatus', status.PENDING);
        },

        SUCCESS(state, action) {
          return handleEntityUpdate
            .SUCCESS(state, action)
            .set('createStatus', status.SUCCESS);
        },

        ERROR(state, action) {
          const error = action.payload;
          return state.merge('createStatus', {
            error,
            status: status.ERROR,
          });
        },
      },

      [listActionType]: {
        PENDING(state, action) {
          const slug = _getListSlug(action);

          const existingList = state.getIn([ENTITY_LIST_KEY, slug, 'list']);

          return state.mergeIn(
            [ENTITY_LIST_KEY, slug],
            Immutable.Map({
              slug,
              error: null,
              list: existingList || null,
              status: existingList ? Status.RELOADING : Status.PENDING,
            }),
          );
        },

        SUCCESS(state, action) {
          const slug = _getListSlug(action);

          const { list } = action.payload;

          return state.mergeIn(
            [ENTITY_LIST_KEY, slug],
            Immutable.Map({
              list: Immutable.fromJS(list),
              status: Status.SUCCESS,
            }),
          );
        },

        ERROR(state, action) {
          const slug = _getListSlug(action);

          const error = action.payload;

          return state.mergeIn(
            [ENTITY_LIST_KEY, slug],
            Immutable.Map({
              error,
              status: Status.ERROR,
            }),
          );
        },
      },
      ...additionalActionHandlers,
    },
    initialState,
  );
}

export default createEntityReducer;
