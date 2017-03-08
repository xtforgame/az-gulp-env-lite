'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulpSourcemaps = require('gulp-sourcemaps');

var _gulpSourcemaps2 = _interopRequireDefault(_gulpSourcemaps);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addBuildCommonLibraryTasks(serverConfig, commonLibraryConfig, envConfig) {
  _gulp2.default.task(serverConfig.addPrefix('build:common' + envConfig.postfix), function () {
    var jsSourceFiles = commonLibraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
    var jsOutputDir = envConfig.env.joinPathByKeys(['js']);
    var relativePath = serverConfig.get(['useCommonLibrary', 'relativePath']);

    return _gulp2.default.src(jsSourceFiles).pipe(_gulpSourcemaps2.default.init()).pipe((0, _gulpBabel2.default)({
      moduleIds: false,
      comments: false,
      compact: false,
      'plugins': ['transform-decorators-legacy', 'transform-class-properties']
    })).pipe(_gulpSourcemaps2.default.write('.')).pipe(_gulp2.default.dest(_path2.default.join(jsOutputDir, relativePath)));
  });
}

function addBuildTasks(serverConfig, commonLibraryConfig, envConfig) {
  var waitingTasks = [];
  var useCommonLibrary = serverConfig.get('useCommonLibrary');

  if (useCommonLibrary && commonLibraryConfig) {
    addBuildCommonLibraryTasks(serverConfig, commonLibraryConfig, envConfig);
    waitingTasks.push('build:common' + envConfig.postfix);
  }

  waitingTasks = serverConfig.addPrefix(waitingTasks);

  _gulp2.default.task(serverConfig.addPrefix('build' + envConfig.postfix), waitingTasks, function () {
    var jsSourceFiles = serverConfig.joinPathByKeys(['entry', 'js', 'glob']);
    var jsOutputDir = envConfig.env.joinPathByKeys(['js']);
    return _gulp2.default.src(jsSourceFiles).pipe(_gulpSourcemaps2.default.init()).pipe((0, _gulpBabel2.default)({
      moduleIds: false,
      comments: false,
      compact: false
    })).pipe(_gulpSourcemaps2.default.write('.')).pipe(_gulp2.default.dest(jsOutputDir));
  });

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

  envConfigs.map(function (envConfig) {
    return addBuildTasks(serverConfig, commonLibraryConfig, envConfig);
  });
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;