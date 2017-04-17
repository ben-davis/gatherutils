import { normalize, schema } from 'normalizr';

import Api from '../Api';


function createEntityActionCreators(config) {
  const {entityName, baseUrl, itemsKey} = config;

  const DETAIL_ACTION_TYPE = `@@GATHER_FETCH_${entityName.toUpperCase()}_DETAIL`;
  const LIST_ACTION_TYPE = `@@GATHER_FETCH_${entityName.toUpperCase()}_LIST`;

  const entitySchema = new schema.Entity(entityName);

  let listSchema = [entitySchema];
  if (itemsKey) {
    listSchema = { [itemsKey]: [entitySchema] };
  }

  const EntityActions = {
    fetchEntity(id, existingEntity) {
      if (existingEntity) {
        return {
          type: `${DETAIL_ACTION_TYPE}_SUCCESS`,
          meta: {
            id,
          },
          payload: existingEntity,
        };
      }

      return dispatch => dispatch({
        type: DETAIL_ACTION_TYPE,
        meta: {
          id,
        },
        payload: Api.get(`${baseUrl}/${id}`),
      });
    },

    fetchEntityList() {
      return dispatch => dispatch({
        type: LIST_ACTION_TYPE,
        payload: new Promise(async (resolve, reject) => {
          try {
            const data = await Api.get(baseUrl);
            const {entities, result} = normalize(data, listSchema);

            Object.entries(entities[entityName]).forEach(([id, entity]) => dispatch(
              EntityActions.fetchEntity(parseInt(id, 10), entity),
            ));

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
