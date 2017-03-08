'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addWatchTasks(libraryConfig, envConfig) {
  var jsSourceFiles = libraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
  _gulp2.default.task(libraryConfig.addPrefix('watch' + envConfig.postfix), libraryConfig.addPrefix(['build' + envConfig.postfix]), function (cb) {
    _gulp2.default.watch(jsSourceFiles, libraryConfig.addPrefix(['build' + envConfig.postfix]));
    cb();
  });
}

function addTasks(gulpConfig) {
  var libraryConfig = gulpConfig.getSubmodule('library');
  var envConfigs = libraryConfig.getEnvConfigsForDevDist();

  envConfigs.map(function (envConfig) {
    return addWatchTasks(libraryConfig, envConfig);
  });
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;