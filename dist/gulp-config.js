"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GulpConfig = void 0;

var _path = _interopRequireDefault(require("path"));

var _objectPath = _interopRequireDefault(require("object-path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GulpConfig = function () {
  function GulpConfig(config) {
    var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var paths = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    _classCallCheck(this, GulpConfig);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "parent", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "paths", void 0);

    _defineProperty(this, "entry", void 0);

    this.config = config;
    this.parent = parent;
    this.name = name;
    this.paths = paths;
    this.entry = _objectPath["default"].get(this.config, this.paths);
  }

  _createClass(GulpConfig, [{
    key: "getGulpPrefix",
    value: function getGulpPrefix() {
      var delimiter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ':';

      if (!this.parent) {
        var prefix = this.get(['prefix'], null);

        if (prefix) {
          return prefix + delimiter;
        }

        return '';
      }

      return this.get(['prefix'], this.name) + delimiter;
    }
  }, {
    key: "addPrefix",
    value: function addPrefix(names) {
      var _this = this;

      var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ':';

      if (Array.isArray(names)) {
        return names.map(function (name) {
          return _this.addPrefix(name, delimiter);
        });
      }

      return this.getGulpPrefix(delimiter) + names;
    }
  }, {
    key: "getOptions",
    value: function getOptions(envName) {
      if (Array.isArray(envName)) {
        for (var i = 0; i < envName.length; i++) {
          var result = this.getOptions(envName[i]);

          if (result) {
            return result;
          }
        }

        return null;
      }

      return this.get(['options', envName], null);
    }
  }, {
    key: "getOptionsDev",
    value: function getOptionsDev(envName) {
      return this.getOptions(['dev', 'default']);
    }
  }, {
    key: "getOptionsDist",
    value: function getOptionsDist(envName) {
      return this.getOptions(['dist', 'default']);
    }
  }, {
    key: "getOptionsForDevDist",
    value: function getOptionsForDevDist() {
      var optionsDev = this.getOptionsDev();
      var optionsDist = this.getOptionsDist();
      return [optionsDev, optionsDist];
    }
  }, {
    key: "getOutputEnv",
    value: function getOutputEnv(envName) {
      if (Array.isArray(envName)) {
        for (var i = 0; i < envName.length; i++) {
          var result = this.getOutputEnv(envName[i]);

          if (result) {
            return result;
          }
        }

        return null;
      }

      var envData = this.get(['output', envName], null);

      if (envData) {
        var paths = this.paths.concat(['output', envName]);
        return new GulpConfig(this.config, this, envName, paths);
      }

      return null;
    }
  }, {
    key: "getOutputDevEnv",
    value: function getOutputDevEnv() {
      return this.getOutputEnv(['dev', 'default']);
    }
  }, {
    key: "getOutputDistEnv",
    value: function getOutputDistEnv() {
      return this.getOutputEnv(['dist', 'default']);
    }
  }, {
    key: "getEnvConfigsForDevDist",
    value: function getEnvConfigsForDevDist() {
      var outputDevEnv = this.getOutputDevEnv();
      var outputDistEnv = this.getOutputDistEnv();
      return [{
        postfix: ':dev',
        env: outputDevEnv
      }, {
        postfix: '',
        env: outputDistEnv
      }];
    }
  }, {
    key: "getSubmodule",
    value: function getSubmodule(submoduleName) {
      var submoduleData = this.get(['submodules', submoduleName], null);

      if (submoduleData) {
        var paths = this.paths.concat(['submodules', submoduleName]);
        return new GulpConfig(this.config, this, submoduleName, paths);
      }

      return null;
    }
  }, {
    key: "joinPathByKeys",
    value: function joinPathByKeys(_keys) {
      var keys = this.paths.concat(_keys);
      var result = '';
      var iterator = this.config;

      if (iterator.dir) {
        result = _path["default"].join(result, iterator.dir);
      }

      for (var i = 0; i < keys.length; i++) {
        iterator = iterator[keys[i]];

        if (typeof iterator === 'string' && i === keys.length - 1) {
          result = _path["default"].join(result, iterator);
        } else if (iterator) {
          if (iterator.dir) {
            result = _path["default"].join(result, iterator.dir);
          }
        } else {
          return null;
        }
      }

      for (var _len = arguments.length, otherDirs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        otherDirs[_key - 1] = arguments[_key];
      }

      return _path["default"].join.apply(_path["default"], [result].concat(otherDirs)).replace(/\\/g, '/');
    }
  }, {
    key: "coalesce",
    value: function coalesce() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _objectPath["default"].coalesce.apply(_objectPath["default"], [this.entry].concat(args));
    }
  }, {
    key: "get",
    value: function get() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return _objectPath["default"].get.apply(_objectPath["default"], [this.entry].concat(args));
    }
  }]);

  return GulpConfig;
}();

exports.GulpConfig = GulpConfig;