'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addWatchTasks(testConfig, envConfig) {
  var jsSourceFiles = testConfig.joinPathByKeys(['entry', 'js', 'glob']);
  var watchFiles = _yargs2.default.argv['watch-files'];

  _gulp2.default.task(testConfig.addPrefix('watch' + envConfig.postfix), testConfig.addPrefix(['test' + envConfig.postfix]), function (cb) {
    _gulp2.default.watch(jsSourceFiles, testConfig.addPrefix(['test' + envConfig.postfix]));
    if (watchFiles) {
      _gulp2.default.watch(watchFiles, testConfig.addPrefix(['test' + envConfig.postfix]));
    }
    cb();
  });
}

function addTasks(gulpConfig) {
  var testConfig = gulpConfig.getSubmodule('test');
  var envConfigs = testConfig.getEnvConfigsForDevDist();

  envConfigs.map(function (envConfig) {
    return addWatchTasks(testConfig, envConfig);
  });
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;