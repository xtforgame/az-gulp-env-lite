"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gulp = _interopRequireDefault(require("gulp"));

var _gulpBabel = _interopRequireDefault(require("gulp-babel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ts;

function addBuildDtsTask(libraryConfig, envConfig) {
  var libraryOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (!ts) {
    ts = require('gulp-typescript');
  }

  _gulp["default"].task(libraryConfig.addPrefix('build:dts' + envConfig.postfix), function () {
    var tsconfig = libraryConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);
    var outputEnv = libraryConfig.getOutputDistEnv();
    var tsOutputDir = outputEnv.joinPathByKeys([]);
    var tsProject = ts.createProject(tsconfig, {
      allowJs: false,
      declaration: true
    });
    var tsResult = tsProject.src().pipe(tsProject());
    return tsResult.dts.pipe(_gulp["default"].dest(tsOutputDir));
  });
}

function addBuildTasks(libraryConfig, envConfig) {
  var libraryOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var waitingTasks = [];
  var tsconfig = libraryConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);

  if (tsconfig) {
    addBuildDtsTask(libraryConfig, envConfig, libraryOptions);
    waitingTasks.push('build:dts' + envConfig.postfix);
  }

  waitingTasks = libraryConfig.addPrefix(waitingTasks);

  var mainFunc = function mainFunc() {
    var jsSourceFiles = libraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
    var outputEnv = libraryConfig.getOutputDistEnv();
    var jsOutputDir = outputEnv.joinPathByKeys([]);
    return _gulp["default"].src(jsSourceFiles).pipe((0, _gulpBabel["default"])(_objectSpread({
      moduleIds: false,
      comments: false,
      compact: false
    }, libraryOptions.babel))).pipe(_gulp["default"].dest(jsOutputDir)).once('error', function (e) {
      console.error('build error :', e);
    });
  };

  mainFunc.displayName = libraryConfig.addPrefix('build:<main>' + envConfig.postfix);

  if (waitingTasks.length > 0) {
    _gulp["default"].task(libraryConfig.addPrefix('build' + envConfig.postfix), _gulp["default"].series(_gulp["default"].parallel.apply(_gulp["default"], _toConsumableArray(waitingTasks)), mainFunc));
  } else {
    _gulp["default"].task(libraryConfig.addPrefix('build' + envConfig.postfix), mainFunc);
  }
}

function addTasks(gulpConfig) {
  var libraryConfig = gulpConfig.getSubmodule('library');
  var envConfigs = libraryConfig.getEnvConfigsForDevDist();
  var libraryOptionsList = libraryConfig.getOptionsForDevDist() || [];
  envConfigs.map(function (envConfig, i) {
    return addBuildTasks(libraryConfig, envConfig, libraryOptionsList[i] || {});
  });
}

var gulpModules = {
  addTasks: addTasks
};
var _default = gulpModules;
exports["default"] = _default;