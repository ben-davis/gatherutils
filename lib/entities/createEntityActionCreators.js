'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require('babel-runtime/core-js/object/entries');

var _entries2 = _interopRequireDefault(_entries);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _normalizr = require('normalizr');

var _Api = require('../Api');

var _Api2 = _interopRequireDefault(_Api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createEntityActionCreators(config) {
  var entityName = config.entityName,
      baseUrl = config.baseUrl,
      itemsKey = config.itemsKey;


  var DETAIL_ACTION_TYPE = '@@GATHER_FETCH_' + entityName.toUpperCase() + '_DETAIL';
  var LIST_ACTION_TYPE = '@@GATHER_FETCH_' + entityName.toUpperCase() + '_LIST';

  var entitySchema = new _normalizr.schema.Entity(entityName);

  var listSchema = [entitySchema];
  if (itemsKey) {
    listSchema = (0, _defineProperty3.default)({}, itemsKey, [entitySchema]);
  }

  var EntityActions = {
    fetchEntity: function fetchEntity(id, existingEntity) {
      if (existingEntity) {
        return {
          type: DETAIL_ACTION_TYPE + '_SUCCESS',
          meta: {
            id: id
          },
          payload: existingEntity
        };
      }

      return function (dispatch) {
        return dispatch({
          type: DETAIL_ACTION_TYPE,
          meta: {
            id: id
          },
          payload: _Api2.default.get(baseUrl + '/' + id)
        });
      };
    },
    fetchEntityList: function fetchEntityList() {
      var _this = this;

      return function (dispatch) {
        return dispatch({
          type: LIST_ACTION_TYPE,
          payload: new _promise2.default(function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(resolve, reject) {
              var data, _normalize, entities, result;

              return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;
                      _context.next = 3;
                      return _Api2.default.get(baseUrl);

                    case 3:
                      data = _context.sent;
                      _normalize = (0, _normalizr.normalize)(data, listSchema), entities = _normalize.entities, result = _normalize.result;


                      (0, _entries2.default)(entities[entityName]).forEach(function (_ref2) {
                        var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
                            id = _ref3[0],
                            entity = _ref3[1];

                        return dispatch(EntityActions.fetchEntity(parseInt(id, 10), entity));
                      });

                      resolve({
                        list: result
                      });
                      _context.next = 12;
                      break;

                    case 9:
                      _context.prev = 9;
                      _context.t0 = _context['catch'](0);

                      reject(_context.t0);

                    case 12:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this, [[0, 9]]);
            }));

            return function (_x, _x2) {
              return _ref.apply(this, arguments);
            };
          }())
        });
      };
    }
  };

  return EntityActions;
}

exports.default = createEntityActionCreators;