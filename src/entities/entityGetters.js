export default {
  entity(state, stateKey, id) {
    return state.getIn([stateKey, 'entities', parseInt(id, 10)]);
  },
  list(state, stateKey, slug = 'default') {
    return state.getIn([stateKey, 'lists', slug]);
  },
};
