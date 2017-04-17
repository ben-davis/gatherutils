'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeToReducer = require('type-to-reducer');

var _typeToReducer2 = _interopRequireDefault(_typeToReducer);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Status = require('../Status');

var _Status2 = _interopRequireDefault(_Status);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getListSlug(action) {
  if (action.meta) {
    return action.meta.slug && 'default';
  }

  return 'default';
}

function createEntityReducer(entityName) {
  var _Immutable$Map, _createReducer;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$detailAction = options.detailActionType,
      detailActionType = _options$detailAction === undefined ? '@@GATHER_FETCH_' + entityName.toUpperCase() + '_DETAIL' : _options$detailAction,
      _options$listActionTy = options.listActionType,
      listActionType = _options$listActionTy === undefined ? '@@GATHER_FETCH_' + entityName.toUpperCase() + '_LIST' : _options$listActionTy;


  var ENTITY_KEY = 'entities';
  var ENTITY_LIST_KEY = 'lists';

  var initialState = _immutable2.default.Map((_Immutable$Map = {}, (0, _defineProperty3.default)(_Immutable$Map, ENTITY_KEY, new _immutable2.default.Map()), (0, _defineProperty3.default)(_Immutable$Map, ENTITY_LIST_KEY, new _immutable2.default.Map()), _Immutable$Map));

  return (0, _typeToReducer2.default)((_createReducer = {}, (0, _defineProperty3.default)(_createReducer, detailActionType, {
    PENDING: function PENDING(state, action) {
      var _Immutable$Map2;

      var id = action.meta.id;


      if (!id) {
        throw new Error('Pending actions must contain an id as part of the action meta when using EntityReducers');
      }

      var existingEntity = state.getIn([ENTITY_KEY, id]);

      return state.mergeIn([ENTITY_KEY, id], _immutable2.default.Map((_Immutable$Map2 = {
        id: id
      }, (0, _defineProperty3.default)(_Immutable$Map2, entityName, existingEntity || null), (0, _defineProperty3.default)(_Immutable$Map2, 'error', null), (0, _defineProperty3.default)(_Immutable$Map2, 'status', existingEntity ? _Status2.default.RELOADING : _Status2.default.PENDING), _Immutable$Map2)));
    },
    SUCCESS: function SUCCESS(state, action) {
      var entity = action.payload;
      var id = action.meta.id;


      if (!id) {
        throw new Error('Success actions must contain an id as part of the action meta when using EntityReducers');
      }

      return state.mergeIn([ENTITY_KEY, id], _immutable2.default.Map((0, _defineProperty3.default)({
        status: _Status2.default.SUCCESS
      }, entityName, _immutable2.default.fromJS(entity))));
    },
    ERROR: function ERROR(state, action) {
      var error = action.payload.error;
      var id = action.meta.id;


      if (!error) {
        throw new Error('Error actions must contain an error as part of the action when using EntityReducers');
      }

      if (!id) {
        throw new Error('Error actions must contain an id as part of the action meta when using EntityReducers');
      }

      return state.mergeIn([ENTITY_KEY, id], _immutable2.default.Map({
        error: error,
        status: _Status2.default.ERROR
      }));
    }
  }), (0, _defineProperty3.default)(_createReducer, listActionType, {
    PENDING: function PENDING(state, action) {
      var slug = _getListSlug(action);

      var existingList = state.getIn([ENTITY_LIST_KEY, slug]);

      return state.mergeIn([ENTITY_LIST_KEY, slug], _immutable2.default.Map({
        slug: slug,
        error: null,
        list: existingList || null,
        status: existingList ? _Status2.default.RELOADING : _Status2.default.PENDING
      }));
    },
    SUCCESS: function SUCCESS(state, action) {
      var slug = _getListSlug(action);

      var list = action.payload.list;


      return state.mergeIn([ENTITY_LIST_KEY, slug], _immutable2.default.Map({
        list: _immutable2.default.fromJS(list),
        status: _Status2.default.SUCCESS
      }));
    },
    ERROR: function ERROR(state, action) {
      var slug = _getListSlug(action);

      var error = action.payload;

      return state.mergeIn([ENTITY_LIST_KEY, slug], _immutable2.default.Map({
        error: error,
        status: _Status2.default.ERROR
      }));
    }
  }), _createReducer), initialState);
}

exports.default = createEntityReducer;