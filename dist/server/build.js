"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gulp = _interopRequireDefault(require("gulp"));

var _path = _interopRequireDefault(require("path"));

var _gulpSourcemaps = _interopRequireDefault(require("gulp-sourcemaps"));

var _gulpBabel = _interopRequireDefault(require("gulp-babel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ts;

function addBuildCommonLibraryDtsTask(serverConfig, commonLibraryConfig, envConfig) {
  var commonLibraryOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!ts) {
    ts = require('gulp-typescript');
  }

  _gulp["default"].task(serverConfig.addPrefix('build:common-dts' + envConfig.postfix), function () {
    var tsconfig = commonLibraryConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);
    var tsOutputDir = envConfig.env.joinPathByKeys(['js']);
    var relativePath = serverConfig.get(['useCommonLibrary', 'relativePath']);
    var tsProject = ts.createProject(tsconfig);
    var tsResult = tsProject.src().pipe(tsProject());
    return tsResult.dts.pipe(_gulp["default"].dest(_path["default"].join(tsOutputDir, relativePath)));
  });
}

function addBuildCommonLibraryTasks(serverConfig, commonLibraryConfig, envConfig) {
  var commonLibraryOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  _gulp["default"].task(serverConfig.addPrefix('build:common' + envConfig.postfix), function () {
    var jsSourceFiles = commonLibraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
    var jsOutputDir = envConfig.env.joinPathByKeys(['js']);
    var relativePath = serverConfig.get(['useCommonLibrary', 'relativePath']);

    var babelOptions = _objectSpread({
      moduleIds: false,
      comments: false,
      compact: false
    }, commonLibraryOptions.babel);

    return _gulp["default"].src(jsSourceFiles).pipe(_gulpSourcemaps["default"].init()).pipe((0, _gulpBabel["default"])(babelOptions)).pipe(_gulpSourcemaps["default"].write('.')).pipe(_gulp["default"].dest(_path["default"].join(jsOutputDir, relativePath)));
  });
}

function addBuildServerDtsTask(serverConfig, envConfig) {
  if (!ts) {
    ts = require('gulp-typescript');
  }

  _gulp["default"].task(serverConfig.addPrefix('build:dts' + envConfig.postfix), function () {
    var tsconfig = serverConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);
    var tsOutputDir = envConfig.env.joinPathByKeys(['js']);
    var tsProject = ts.createProject(tsconfig);
    var tsResult = tsProject.src().pipe(tsProject());
    return tsResult.dts.pipe(_gulp["default"].dest(tsOutputDir));
  });
}

function addBuildTasks(serverConfig, commonLibraryConfig, envConfig) {
  var serverOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var commonLibraryOptions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var waitingTasks = [];
  var useCommonLibrary = serverConfig.get('useCommonLibrary');

  if (useCommonLibrary && commonLibraryConfig) {
    var _tsconfig = commonLibraryConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);

    if (_tsconfig) {
      addBuildCommonLibraryDtsTask(serverConfig, commonLibraryConfig, envConfig, commonLibraryOptions);
      waitingTasks.push('build:common-dts' + envConfig.postfix);
    }

    addBuildCommonLibraryTasks(serverConfig, commonLibraryConfig, envConfig, commonLibraryOptions);
    waitingTasks.push('build:common' + envConfig.postfix);
  }

  var tsconfig = serverConfig.joinPathByKeys(['entry', 'ts', 'tsconfig']);

  if (tsconfig) {
    addBuildServerDtsTask(serverConfig, envConfig);
    waitingTasks.push('build:dts' + envConfig.postfix);
  }

  waitingTasks = serverConfig.addPrefix(waitingTasks);

  var mainFunc = function mainFunc() {
    var jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
    var jsOutputDir = envConfig.env.joinPathByKeys(['js']);
    return _gulp["default"].src(jsSourceFiles).pipe(_gulpSourcemaps["default"].init()).pipe((0, _gulpBabel["default"])(_objectSpread({
      moduleIds: false,
      comments: false,
      compact: false
    }, serverOptions.babel))).pipe(_gulpSourcemaps["default"].write('.')).pipe(_gulp["default"].dest(jsOutputDir));
  };

  mainFunc.displayName = serverConfig.addPrefix('build:<main>' + envConfig.postfix);

  _gulp["default"].task(serverConfig.addPrefix('build' + envConfig.postfix), _gulp["default"].series(_gulp["default"].parallel.apply(_gulp["default"], _toConsumableArray(waitingTasks)), mainFunc));

  _gulp["default"].task(serverConfig.addPrefix('build:extras' + envConfig.postfix), function () {
    var serverSourceDir = serverConfig.joinPathByKeys(['entry']);
    var jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
    var outputDir = envConfig.env.joinPathByKeys([]);
    return _gulp["default"].src(["".concat(serverSourceDir, "/**/*.*"), "!".concat(jsSourceFiles)], {
      dot: true
    }).pipe(_gulp["default"].dest(outputDir));
  });
}

function addTasks(gulpConfig) {
  var serverConfig = gulpConfig.getSubmodule('server');
  var commonLibraryConfig = gulpConfig.getSubmodule('commonLibrary');
  var envConfigs = serverConfig.getEnvConfigsForDevDist();
  var serverOptionsList = serverConfig.getOptionsForDevDist() || [];
  var commonLibraryOptionsList = commonLibraryConfig.getOptionsForDevDist() || [];
  envConfigs.map(function (envConfig, i) {
    return addBuildTasks(serverConfig, commonLibraryConfig, envConfig, serverOptionsList[i] || {}, commonLibraryOptionsList[i] || {});
  });
}

var gulpModules = {
  addTasks: addTasks
};
var _default = gulpModules;
exports["default"] = _default;