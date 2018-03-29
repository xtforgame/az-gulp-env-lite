'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpSourcemaps = require('gulp-sourcemaps');

var _gulpSourcemaps2 = _interopRequireDefault(_gulpSourcemaps);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addBuildTasks(libraryConfig, envConfig) {
  var libraryOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  _gulp2.default.task(libraryConfig.addPrefix('build' + envConfig.postfix), function () {
    var jsSourceFiles = libraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
    var outputEnv = libraryConfig.getOutputDistEnv();
    var jsOutputDir = outputEnv.joinPathByKeys([]);

    return _gulp2.default.src(jsSourceFiles).pipe((0, _gulpBabel2.default)(_extends({
      moduleIds: false,
      comments: false,
      compact: false
    }, libraryOptions.babel))).pipe(_gulp2.default.dest(jsOutputDir)).once('error', function (e) {
      console.error('build error :', e);
    });
  });
}

function addTasks(gulpConfig) {
  var libraryConfig = gulpConfig.getSubmodule('library');
  var envConfigs = libraryConfig.getEnvConfigsForDevDist();
  var libraryOptionsList = libraryConfig.getOptionsForDevDist() || [];

  envConfigs.map(function (envConfig, i) {
    return addBuildTasks(libraryConfig, envConfig, libraryOptionsList[i] || {});
  });
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;