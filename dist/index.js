"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "GulpConfig", {
  enumerable: true,
  get: function get() {
    return _gulpConfig.GulpConfig;
  }
});
Object.defineProperty(exports, "serverTasks", {
  enumerable: true,
  get: function get() {
    return _server["default"];
  }
});
Object.defineProperty(exports, "libraryTasks", {
  enumerable: true,
  get: function get() {
    return _library["default"];
  }
});

var _gulpConfig = require("./gulp-config");

var _server = _interopRequireDefault(require("./server"));

var _library = _interopRequireDefault(require("./library"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }