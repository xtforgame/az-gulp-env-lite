'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function addWatchTasks(serverConfig, envConfig) {
  var jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
  _gulp2.default.task(serverConfig.addPrefix('watch' + envConfig.postfix), _gulp2.default.series(_gulp2.default.parallel.apply(_gulp2.default, _toConsumableArray(serverConfig.addPrefix(['serve' + envConfig.postfix]))), function (cb) {
    cb();
  }));
}

function addTasks(gulpConfig) {
  var serverConfig = gulpConfig.getSubmodule('server');
  var envConfigs = serverConfig.getEnvConfigsForDevDist();

  envConfigs.map(function (envConfig) {
    return addWatchTasks(serverConfig, envConfig);
  });
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;