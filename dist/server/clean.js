'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addTasks(gulpConfig) {
  var serverConfig = gulpConfig.getSubmodule('server');

  _gulp2.default.task(serverConfig.addPrefix('clean'), function (cb) {
    return;
  });
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;