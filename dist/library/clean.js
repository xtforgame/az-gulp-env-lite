"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gulp = _interopRequireDefault(require("gulp"));

var _del = _interopRequireDefault(require("del"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function addCleanTasks(libraryConfig, envConfig) {
  var outputDistEnv = libraryConfig.getOutputDistEnv();
  var outputDir = envConfig.env.joinPathByKeys([]);

  _gulp["default"].task(libraryConfig.addPrefix('clean' + envConfig.postfix), function (cb) {
    return (0, _del["default"])([outputDir]);
  });
}

function addTasks(gulpConfig) {
  var libraryConfig = gulpConfig.getSubmodule('library');
  var envConfigs = libraryConfig.getEnvConfigsForDevDist();
  envConfigs.map(function (envConfig, i) {
    return addCleanTasks(libraryConfig, envConfig);
  });
}

var gulpModules = {
  addTasks: addTasks
};
var _default = gulpModules;
exports["default"] = _default;