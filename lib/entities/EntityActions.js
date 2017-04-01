'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _normalizr = require('normalizr');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createEntityActionCreators(config) {
  var _fetchEntity = config.fetchEntity,
      _fetchEntityList = config.fetchEntityList,
      entityName = config.entityName,
      _config$itemsKey = config.itemsKey,
      itemsKey = _config$itemsKey === undefined ? 'items' : _config$itemsKey;


  var DETAIL_ACTION_TYPE = '__GATHER_FETCH_' + entityName + '_DETAIL';
  var LIST_ACTION_TYPE = '__GATHER_FETCH_' + entityName + '_LIST';

  var entitySchema = new _normalizr.schema.Entity(entityName);
  var listSchema = _defineProperty({}, itemsKey, [entitySchema]);

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
          payload: _fetchEntity(id)
        });
      };
    },
    fetchEntityList: function fetchEntityList() {
      var _this = this;

      return function (dispatch) {
        return {
          type: LIST_ACTION_TYPE,
          payload: new Promise(function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(resolve, reject) {
              var data, _normalize, entities, result;

              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;
                      _context.next = 3;
                      return _fetchEntityList();

                    case 3:
                      data = _context.sent;
                      _normalize = (0, _normalizr.normalize)(data, listSchema), entities = _normalize.entities, result = _normalize.result;


                      entities[entityName].forEach(function (entity) {
                        return dispatch(EntityActions.fetchEntity(null, entity));
                      });

                      resolve({
                        list: result[entityName]
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
        };
      };
    }
  };

  return EntityActions;
}

exports.default = createEntityActionCreators;