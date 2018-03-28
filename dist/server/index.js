'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _clean = require('./clean');

var _clean2 = _interopRequireDefault(_clean);

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

var _serve = require('./serve');

var _serve2 = _interopRequireDefault(_serve);

var _watch = require('./watch');

var _watch2 = _interopRequireDefault(_watch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gulpModules = null;

exports.default = {
  childList: ['clean', 'build', 'serve', 'watch'],
  children: {
    clean: _clean2.default,
    build: _build2.default,
    serve: _serve2.default,
    watch: _watch2.default
  },
  addTasks: function addTasks(gulpConfig) {
    var _this = this;

    this.childList.map(function (key) {
      return _this.children[key].addTasks && _this.children[key].addTasks(gulpConfig);
    });
  }
};