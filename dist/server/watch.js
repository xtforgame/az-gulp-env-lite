"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gulp = _interopRequireDefault(require("gulp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function addWatchTasks(serverConfig, envConfig) {
  var jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);

  var mainFunc = function mainFunc(cb) {
    cb();
  };

  mainFunc.displayName = serverConfig.addPrefix('watch:<main>' + envConfig.postfix);

  _gulp["default"].task(serverConfig.addPrefix('watch' + envConfig.postfix), _gulp["default"].series(_gulp["default"].parallel.apply(_gulp["default"], _toConsumableArray(serverConfig.addPrefix(['serve' + envConfig.postfix]))), mainFunc));
}

function addTasks(gulpConfig) {
  var serverConfig = gulpConfig.getSubmodule('server');
  var envConfigs = serverConfig.getEnvConfigsForDevDist();
  envConfigs.map(function (envConfig) {
    return addWatchTasks(serverConfig, envConfig);
  });
}

var gulpModules = {
  addTasks: addTasks
};
var _default = gulpModules;
exports["default"] = _default;