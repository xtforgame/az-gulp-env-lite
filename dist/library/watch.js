"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gulp = _interopRequireDefault(require("gulp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function addWatchTasks(libraryConfig, envConfig) {
  var jsSourceFiles = libraryConfig.joinPathByKeys(['entry', 'js', 'glob']);

  var mainFunc = function mainFunc(cb) {
    _gulp["default"].watch(jsSourceFiles, _gulp["default"].series(libraryConfig.addPrefix('build' + envConfig.postfix)));

    cb();
  };

  mainFunc.displayName = libraryConfig.addPrefix('watch:<main>' + envConfig.postfix);

  _gulp["default"].task(libraryConfig.addPrefix('watch' + envConfig.postfix), _gulp["default"].series(libraryConfig.addPrefix('build' + envConfig.postfix), mainFunc));
}

function addTasks(gulpConfig) {
  var libraryConfig = gulpConfig.getSubmodule('library');
  var envConfigs = libraryConfig.getEnvConfigsForDevDist();
  envConfigs.map(function (envConfig) {
    return addWatchTasks(libraryConfig, envConfig);
  });
}

var gulpModules = {
  addTasks: addTasks
};
var _default = gulpModules;
exports["default"] = _default;