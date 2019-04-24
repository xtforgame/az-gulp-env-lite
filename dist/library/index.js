"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _clean = _interopRequireDefault(require("./clean"));

var _build = _interopRequireDefault(require("./build"));

var _watch = _interopRequireDefault(require("./watch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var children = {
  clean: _clean["default"],
  build: _build["default"],
  watch: _watch["default"]
};
var _default = {
  childList: ['clean', 'build', 'watch'],
  children: children,
  addTasks: function addTasks(gulpConfig) {
    var _this = this;

    this.childList.map(function (key) {
      return _this.children[key].addTasks && _this.children[key].addTasks(gulpConfig);
    });
  }
};
exports["default"] = _default;