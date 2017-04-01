export default {
  entity(state, stateKey, id) {
    return state.getIn([stateKey, 'entities', id]);
  },
  list(state, stateKey, slug = 'default') {
    return state.getIn([stateKey, 'lists', slug]);
  },
};
