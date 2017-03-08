'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpMocha = require('gulp-mocha');

var _gulpMocha2 = _interopRequireDefault(_gulpMocha);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addTasks(gulpConfig) {
  var testConfig = gulpConfig.getSubmodule('test');

  var outputEnv = testConfig.getOutputDistEnv();
  var files = _yargs2.default.argv.files || outputEnv.joinPathByKeys([]) + '/**/*.js';

  _gulp2.default.task(testConfig.addPrefix('test'), testConfig.addPrefix(['build']), function () {
    _gulp2.default.src(files, { read: false }).pipe((0, _gulpMocha2.default)({ ui: 'bdd' })).once('error', function (e) {
      console.error('test error :', e);
    });
  });
}

var gulpModules = { addTasks: addTasks };
exports.default = gulpModules;