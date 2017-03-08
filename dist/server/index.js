'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _serve = require('./serve');

var _serve2 = _interopRequireDefault(_serve);

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

var _clean = require('./clean');

var _clean2 = _interopRequireDefault(_clean);

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
    serve: _serve2.default,
    build: _build2.default,
    clean: _clean2.default,
    watch: _watch2.default
  },
  addTasks: addTasks
};

exports.default = gulpModules;