'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testTasks = exports.libraryTasks = exports.serverTasks = exports.GulpConfig = undefined;

var _gulpConfig = require('./gulp-config');

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _library = require('./library');

var _library2 = _interopRequireDefault(_library);

var _test = require('./test');

var _test2 = _interopRequireDefault(_test);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.GulpConfig = _gulpConfig.GulpConfig;
exports.serverTasks = _server2.default;
exports.libraryTasks = _library2.default;
exports.testTasks = _test2.default;