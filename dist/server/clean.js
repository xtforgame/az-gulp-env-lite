"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gulp = _interopRequireDefault(require("gulp"));

var _del = _interopRequireDefault(require("del"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function addCleanTasks(serverConfig, envConfig) {
  var outputDistEnv = serverConfig.getOutputDistEnv();
  var outputDir = envConfig.env.joinPathByKeys([]);

  _gulp["default"].task(serverConfig.addPrefix('clean' + envConfig.postfix), function (cb) {
    return (0, _del["default"])([outputDir]);
  });
}

function addTasks(gulpConfig) {
  var serverConfig = gulpConfig.getSubmodule('server');
  var envConfigs = serverConfig.getEnvConfigsForDevDist();
  envConfigs.map(function (envConfig, i) {
    return addCleanTasks(serverConfig, envConfig);
  });
}

var gulpModules = {
  addTasks: addTasks
};
var _default = gulpModules;
exports["default"] = _default;