'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addCleanTasks(libraryConfig, envConfig) {
  var outputDistEnv = libraryConfig.getOutputDistEnv();
  var outputDir = envConfig.env.joinPathByKeys([]);

  _gulp2.default.task(libraryConfig.addPrefix('clean' + envConfig.postfix), function (cb) {
    return (0, _del2.default)([outputDir]);
  });
}

function addTasks(gulpConfig) {
  var libraryConfig = gulpConfig.getSubmodule('library');
  var envConfigs = libraryConfig.getEnvConfigsForDevDist();

  envConfigs.map(function (envConfig, i) {
    return addCleanTasks(libraryConfig, envConfig);
  });
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;