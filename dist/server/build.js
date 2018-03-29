'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulpSourcemaps = require('gulp-sourcemaps');

var _gulpSourcemaps2 = _interopRequireDefault(_gulpSourcemaps);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function addBuildCommonLibraryTasks(serverConfig, commonLibraryConfig, envConfig) {
  var commonLibraryOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  _gulp2.default.task(serverConfig.addPrefix('build:common' + envConfig.postfix), function () {
    var jsSourceFiles = commonLibraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
    var jsOutputDir = envConfig.env.joinPathByKeys(['js']);
    var relativePath = serverConfig.get(['useCommonLibrary', 'relativePath']);

    var babelOptions = Object.assign({}, {
      moduleIds: false,
      comments: false,
      compact: false
    }, commonLibraryOptions.babel);
    return _gulp2.default.src(jsSourceFiles).pipe(_gulpSourcemaps2.default.init()).pipe((0, _gulpBabel2.default)(babelOptions)).pipe(_gulpSourcemaps2.default.write('.')).pipe(_gulp2.default.dest(_path2.default.join(jsOutputDir, relativePath)));
  });
}

function addBuildTasks(serverConfig, commonLibraryConfig, envConfig) {
  var serverOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var commonLibraryOptions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  var waitingTasks = [];
  var useCommonLibrary = serverConfig.get('useCommonLibrary');

  if (useCommonLibrary && commonLibraryConfig) {
    addBuildCommonLibraryTasks(serverConfig, commonLibraryConfig, envConfig, commonLibraryOptions);
    waitingTasks.push('build:common' + envConfig.postfix);
  }

  waitingTasks = serverConfig.addPrefix(waitingTasks);

  var mainFunc = function mainFunc() {
    var jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
    var jsOutputDir = envConfig.env.joinPathByKeys(['js']);

    return _gulp2.default.src(jsSourceFiles).pipe(_gulpSourcemaps2.default.init()).pipe((0, _gulpBabel2.default)(_extends({
      moduleIds: false,
      comments: false,
      compact: false
    }, serverOptions.babel))).pipe(_gulpSourcemaps2.default.write('.')).pipe(_gulp2.default.dest(jsOutputDir));
  };
  mainFunc.displayName = serverConfig.addPrefix('build:<main>' + envConfig.postfix);

  _gulp2.default.task(serverConfig.addPrefix('build' + envConfig.postfix), _gulp2.default.series(_gulp2.default.parallel.apply(_gulp2.default, _toConsumableArray(waitingTasks)), mainFunc));

  _gulp2.default.task(serverConfig.addPrefix('build:extras' + envConfig.postfix), function () {
    var serverSourceDir = serverConfig.joinPathByKeys(['entry']);
    var jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
    var outputDir = envConfig.env.joinPathByKeys([]);
    return _gulp2.default.src([serverSourceDir + '/**/*.*', '!' + jsSourceFiles], {
      dot: true
    }).pipe(_gulp2.default.dest(outputDir));
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

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;