"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _gulp = _interopRequireDefault(require("gulp"));

var _gulpNodemon = _interopRequireDefault(require("gulp-nodemon"));

var _yargs = _interopRequireDefault(require("yargs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function addServeTasks(serverConfig) {
  var commonLibraryConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var envConfig = arguments.length > 2 ? arguments[2] : undefined;
  var serverOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var serverSourceDir = serverConfig.joinPathByKeys(['entry']);
  var delay = serverConfig.get('reloadDelay') || 1000;
  var watchArray = [serverSourceDir];
  var useCommonLibrary = serverConfig.get('useCommonLibrary');

  if (commonLibraryConfig && useCommonLibrary) {
    var commonLibrarySourceDir = commonLibraryConfig.joinPathByKeys(['entry']);
    watchArray.push(commonLibrarySourceDir);
  }

  var outputEntryFile = envConfig.env.joinPathByKeys(['js', 'filename']);
  var reloadTasks = serverConfig.addPrefix(['build' + envConfig.postfix, 'build:extras' + envConfig.postfix]);

  var mainFunc = function mainFunc(cb) {
    var nodemonConfig = _objectSpread({
      script: outputEntryFile,
      watch: watchArray,
      ignore: [serverSourceDir + '/app-doc/', 'gulpfile.babel.js', 'node_modules/', 'doc/'],
      tasks: reloadTasks,
      delay: delay
    }, serverOptions.nodemon);

    if (_yargs["default"].argv.inspect) {
      nodemonConfig.exec = 'node --inspect';
    }

    var called = false;
    return (0, _gulpNodemon["default"])(nodemonConfig).on('start', function () {
      if (!called) {
        called = true;
        cb();
      }
    }).on('restart', function () {
      setTimeout(function () {}, 1000);
    });
  };

  mainFunc.displayName = serverConfig.addPrefix('serve:<main>' + envConfig.postfix);

  _gulp["default"].task(serverConfig.addPrefix('serve' + envConfig.postfix), _gulp["default"].series(serverConfig.addPrefix('clean' + envConfig.postfix), _gulp["default"].parallel.apply(_gulp["default"], _toConsumableArray(reloadTasks)), mainFunc));
}

function addTasks(gulpConfig) {
  var serverConfig = gulpConfig.getSubmodule('server');
  var commonLibraryConfig = gulpConfig.getSubmodule('commonLibrary');
  var envConfigs = serverConfig.getEnvConfigsForDevDist();
  var serverOptionsList = serverConfig.getOptionsForDevDist() || [];
  envConfigs.map(function (envConfig, i) {
    return addServeTasks(serverConfig, commonLibraryConfig, envConfig, serverOptionsList[i] || {});
  });
}

var gulpModules = {
  addTasks: addTasks
};
var _default = gulpModules;
exports["default"] = _default;