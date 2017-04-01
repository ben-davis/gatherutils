'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeToReducer = require('type-to-reducer');

var _typeToReducer2 = _interopRequireDefault(_typeToReducer);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Status = require('../constants/Status');

var _Status2 = _interopRequireDefault(_Status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createEntityReducer(actionType) {
  return (0, _typeToReducer2.default)(_defineProperty({}, actionType, {
    PENDING: function PENDING(action, state) {
      var id = action.payload.id;


      if (!id) {
        throw new Error('Pending actions must contain an id as part of the action payload when using EntityStore');
      }

      var newEntity = {};
      var existingEntity = state.get(this._getNormalizer()(id));

      if (existingEntity) {
        newEntity = existingEntity.set('status', _Status2.default.RELOADING);
      } else {
        newEntity = _immutable2.default.Map(_defineProperty({
          id: id,
          status: _Status2.default.PENDING
        }, this.getStoreId(), _immutable2.default.Map()));
      }

      return state.set(this._getNormalizer()(id), newEntity);
    },
    SUCCESS: function SUCCESS(action, state) {
      var _action$payload = action.payload,
          entity = _action$payload.entity,
          id = _action$payload.id;


      if (!id) {
        throw new Error('Success actions must contain an id as part of the action payload when using EntityStore');
      }

      return state.set(this._getNormalizer()(id), _immutable2.default.Map(_defineProperty({
        id: id,
        status: _Status2.default.SUCCESS
      }, this.getStoreId(), _immutable2.default.fromJS(entity))));
    },
    ERROR: function ERROR(action, state) {
      var _action$payload2 = action.payload,
          error = _action$payload2.error,
          id = _action$payload2.id;


      if (!error) {
        throw new Error('Error actions must contain an error as part of the action payload when using EntityStore');
      }

      if (!id) {
        throw new Error('Error actions must contain an id as part of the action payload when using EntityStore');
      }

      return state.set(this._getNormalizer()(id), _immutable2.default.Map(_defineProperty({
        id: id,
        error: error,
        status: _Status2.default.ERROR
      }, this.getStoreId(), _immutable2.default.Map())));
    }
  }), _immutable2.default.Map());
}

exports.default = createEntityReducer;