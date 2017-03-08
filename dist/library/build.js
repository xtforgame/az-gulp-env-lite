'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpSourcemaps = require('gulp-sourcemaps');

var _gulpSourcemaps2 = _interopRequireDefault(_gulpSourcemaps);

var _gulpBabel = require('gulp-babel');

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addTasks(gulpConfig) {
  var libraryConfig = gulpConfig.getSubmodule('library');

  _gulp2.default.task(libraryConfig.addPrefix('build'), function () {
    var jsSourceFiles = libraryConfig.joinPathByKeys(['entry', 'js', 'glob']);
    var outputEnv = libraryConfig.getOutputDistEnv();
    var jsOutputDir = outputEnv.joinPathByKeys([]);
    return _gulp2.default.src(jsSourceFiles).pipe((0, _gulpBabel2.default)({
      moduleIds: false,
      comments: false,
      compact: false
    })).pipe(_gulp2.default.dest(jsOutputDir)).once('error', function (e) {
      console.error('build error :', e);
    });
  });
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;