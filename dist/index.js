'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.libraryTasks = exports.serverTasks = exports.GulpConfig = undefined;

var _gulpConfig = require('./gulp-config');

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _library = require('./library');

var _library2 = _interopRequireDefault(_library);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.GulpConfig = _gulpConfig.GulpConfig;
exports.serverTasks = _server2.default;
exports.libraryTasks = _library2.default;