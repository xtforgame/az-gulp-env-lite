'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addCleanTasks(serverConfig, envConfig) {
  var outputDistEnv = serverConfig.getOutputDistEnv();
  var outputDir = envConfig.env.joinPathByKeys([]);

  _gulp2.default.task(serverConfig.addPrefix('clean' + envConfig.postfix), function (cb) {
    return (0, _del2.default)([outputDir]);
  });
}

function addTasks(gulpConfig) {
  var serverConfig = gulpConfig.getSubmodule('server');
  var envConfigs = serverConfig.getEnvConfigsForDevDist();

  envConfigs.map(function (envConfig, i) {
    return addCleanTasks(serverConfig, envConfig);
  });
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;