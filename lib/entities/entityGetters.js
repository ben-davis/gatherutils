'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  entity: function entity(state, stateKey, id) {
    return state.getIn([stateKey, 'entities', id]);
  },
  list: function list(state, stateKey) {
    var slug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'default';

    return state.getIn([stateKey, 'lists', slug]);
  }
};