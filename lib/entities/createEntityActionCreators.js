'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _normalizr = require('normalizr');

var _Api = require('../Api');

var _Api2 = _interopRequireDefault(_Api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createEntityActionCreators(config) {
  var entityName = config.entityName,
      baseUrl = config.baseUrl,
      itemsKey = config.itemsKey;


  var DETAIL_ACTION_TYPE = '__GATHER_FETCH_' + entityName.toUpperCase() + '_DETAIL';
  var LIST_ACTION_TYPE = '__GATHER_FETCH_' + entityName.toUpperCase() + '_LIST';

  var entitySchema = new _normalizr.schema.Entity(entityName);

  var listSchema = [entitySchema];
  if (itemsKey) {
    listSchema = _defineProperty({}, itemsKey, [entitySchema]);
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
          payload: new Promise(function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(resolve, reject) {
              var data, _normalize, entities, result;

              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;
                      _context.next = 3;
                      return _Api2.default.get(baseUrl);

                    case 3:
                      data = _context.sent;
                      _normalize = (0, _normalizr.normalize)(data, listSchema), entities = _normalize.entities, result = _normalize.result;


                      Object.entries(entities[entityName]).forEach(function (_ref2) {
                        var _ref3 = _slicedToArray(_ref2, 2),
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