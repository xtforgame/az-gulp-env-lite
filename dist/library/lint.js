'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _lint = require('../utils/lint');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addTasks(gulpConfig) {
  var libraryConfig = gulpConfig.getSubmodule('library');
  var jsSourceFiles = libraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
  _gulp2.default.task(libraryConfig.addPrefix('lint'), (0, _lint.lint)(jsSourceFiles));
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;