'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _lint = require('../utils/lint');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addTasks(gulpConfig) {
  var serverConfig = gulpConfig.getSubmodule('server');
  var jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
  _gulp2.default.task(serverConfig.addPrefix('lint'), (0, _lint.lint)(jsSourceFiles));
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;