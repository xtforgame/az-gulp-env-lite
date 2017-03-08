'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

var _clean = require('./clean');

var _clean2 = _interopRequireDefault(_clean);

var _test = require('./test');

var _test2 = _interopRequireDefault(_test);

var _watch = require('./watch');

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gulpModules = null;

function addTasks(gulpConfig) {
  var children = gulpModules.children;
  Object.keys(children).map(function (key) {
    return children[key].addTasks && children[key].addTasks(gulpConfig);
  });
}

gulpModules = {
  children: {
    build: _build2.default,
    clean: _clean2.default,
    test: _test2.default,
    watch: _watch2.default
  },
  addTasks: addTasks
};

exports.default = gulpModules;