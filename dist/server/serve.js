'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpNodemon = require('gulp-nodemon');

var _gulpNodemon2 = _interopRequireDefault(_gulpNodemon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function addServeTasks(serverConfig, commonLibraryConfig, envConfig) {
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

  _gulp2.default.task(serverConfig.addPrefix('serve' + envConfig.postfix), _gulp2.default.series(_gulp2.default.parallel.apply(_gulp2.default, _toConsumableArray(reloadTasks)), function (cb) {
    var called = false;
    return (0, _gulpNodemon2.default)({
      script: outputEntryFile,
      watch: watchArray,
      ignore: [serverSourceDir + '/app-doc/', 'gulpfile.babel.js', 'node_modules/', 'doc/'],
      tasks: reloadTasks,
      delay: delay
    }).on('start', function () {
      if (!called) {
        called = true;
        cb();
      }
    }).on('restart', function () {
      setTimeout(function () {}, 1000);
    });
  }));
}

function addTasks(gulpConfig) {
  var serverConfig = gulpConfig.getSubmodule('server');
  var commonLibraryConfig = gulpConfig.getSubmodule('commonLibrary');
  var envConfigs = serverConfig.getEnvConfigsForDevDist();

  envConfigs.map(function (envConfig) {
    return addServeTasks(serverConfig, commonLibraryConfig, envConfig);
  });
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;