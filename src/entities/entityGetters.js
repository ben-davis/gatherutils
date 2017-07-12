const Getters = {
  entity(state, stateKey, id) {
    return state.getIn([stateKey, 'entities', parseInt(id, 10) || id]);
  },
  list(state, stateKey, options = {}) {
    const { slug = 'default', denormalize = false, itemsKey = '' } = options;
    let list = state.getIn([stateKey, 'lists', slug]);

    if (denormalize) {
      list = list.updateIn(['list', itemsKey], items =>
        items.map(id => Getters.entity(state, stateKey, id)),
      );
    }

    return list;
  },
};

export default Getters;
