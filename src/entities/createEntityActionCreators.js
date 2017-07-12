import { normalize, schema } from 'normalizr';

import Api from '../Api';

function capitalize(entityName) {
  return entityName.slice(0, 1).toUpperCase() + entityName.slice(1);
}

function createEntityActionCreators(config) {
  const {
    entityName,
    baseUrl,
    itemsKey,
    entityIdField = 'id',
    payloadProcessor = entity => entity,
  } = config;

  const DETAIL_ACTION_TYPE = `@@GATHER_FETCH_${entityName.toUpperCase()}_DETAIL`;
  const LIST_ACTION_TYPE = `@@GATHER_FETCH_${entityName.toUpperCase()}_LIST`;
  const CREATE_ACTION_TYPE = `@@GATHER_CREATE_${entityName.toUpperCase()}`;
  const PATCH_ACTION_TYPE = `@@GATHER_PATCH_${entityName.toUpperCase()}`;

  const entitySchema = new schema.Entity(
    entityName,
    {},
    {
      idAttribute: entityIdField,
    },
  );

  let listSchema = [entitySchema];
  if (itemsKey) {
    listSchema = { [itemsKey]: [entitySchema] };
  }

  const EntityActions = {
    [`create${capitalize(entityName)}`](data) {
      return dispatch =>
        dispatch({
          type: CREATE_ACTION_TYPE,
          payload: Api.post(`${baseUrl}`, data).then(data =>
            payloadProcessor(data),
          ),
          meta: {},
        });
    },

    [`patch${capitalize(entityName)}`](id, entity, options = {}) {
      return dispatch =>
        dispatch({
          type: PATCH_ACTION_TYPE,
          meta: {
            id,
            noSave: options.noSave,
          },
          payload: Api.patch(`${baseUrl}/${id}`, entity).then(data =>
            payloadProcessor(data),
          ),
        });
    },

    [`fetch${capitalize(entityName)}`](id, existingEntity) {
      if (existingEntity) {
        return {
          type: `${DETAIL_ACTION_TYPE}_SUCCESS`,
          meta: {
            id,
          },
          payload: payloadProcessor(existingEntity),
        };
      }

      return dispatch =>
        dispatch({
          type: DETAIL_ACTION_TYPE,
          meta: {
            id,
          },
          payload: Api.get(`${baseUrl}/${id}`).then(data =>
            payloadProcessor(data),
          ),
        });
    },

    [`fetch${capitalize(entityName)}List`]() {
      return dispatch =>
        dispatch({
          type: LIST_ACTION_TYPE,
          meta: {},
          payload: new Promise(async (resolve, reject) => {
            try {
              const data = await Api.get(baseUrl);
              const { entities, result } = normalize(data, listSchema);

              Object.entries(entities[entityName]).forEach(([id, entity]) =>
                dispatch(
                  EntityActions[`fetch${capitalize(entityName)}`](
                    parseInt(id, 10) || id,
                    entity,
                  ),
                ),
              );

              resolve({
                list: result,
              });
            } catch (error) {
              reject(error);
            }
          }),
        });
    },
  };

  return EntityActions;
}

export default createEntityActionCreators;
