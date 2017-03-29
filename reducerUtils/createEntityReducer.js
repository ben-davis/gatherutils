import createReducer from 'type-to-reducer';
import Immutable from 'immutable';

import Status from '../constants/Status';


function createEntityReducer(actionType) {
  return createReducer({

    [actionType]: {
      PENDING(action, state) {
        const {id} = action.payload;

        if (!id) {
          throw new Error('Pending actions must contain an id as part of the action payload when using EntityStore');
        }

        let newEntity = {};
        const existingEntity = state.get(this._getNormalizer()(id));

        if (existingEntity) {
          newEntity = existingEntity.set('status', Status.RELOADING);
        } else {
          newEntity = Immutable.Map({
            id,
            status: Status.PENDING,
            [this.getStoreId()]: Immutable.Map(),
          });
        }

        return state.set(this._getNormalizer()(id), newEntity);
      },

      SUCCESS(action, state) {
        const {entity, id} = action.payload;

        if (!id) {
          throw new Error('Success actions must contain an id as part of the action payload when using EntityStore');
        }

        return state.set(this._getNormalizer()(id), Immutable.Map({
          id,
          status: Status.SUCCESS,
          [this.getStoreId()]: Immutable.fromJS(entity),
        }));
      },

      ERROR(action, state) {
        const {error, id} = action.payload;

        if (!error) {
          throw new Error('Error actions must contain an error as part of the action payload when using EntityStore');
        }

        if (!id) {
          throw new Error('Error actions must contain an id as part of the action payload when using EntityStore');
        }

        return state.set(this._getNormalizer()(id), Immutable.Map({
          id,
          error,
          status: Status.ERROR,
          [this.getStoreId()]: Immutable.Map(),
        }));
      },
    },

  }, Immutable.Map());
}

export default createEntityReducer;
