'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GulpConfig = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GulpConfig = exports.GulpConfig = function () {
  function GulpConfig(config) {
    var parent = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var name = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
    var paths = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

    _classCallCheck(this, GulpConfig);

    this.config = config;
    this.parent = parent;
    this.name = name;
    this.paths = paths;
    this.entry = _objectPath2.default.get(this.config, this.paths);
  }

  _createClass(GulpConfig, [{
    key: 'getGulpPrefix',
    value: function getGulpPrefix() {
      var delimiter = arguments.length <= 0 || arguments[0] === undefined ? ':' : arguments[0];

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
    key: 'addPrefix',
    value: function addPrefix(names) {
      var _this = this;

      var delimiter = arguments.length <= 1 || arguments[1] === undefined ? ':' : arguments[1];

      if (Array.isArray(names)) {
        return names.map(function (name) {
          return _this.addPrefix(name, delimiter);
        });
      }
      return this.getGulpPrefix(delimiter) + names;
    }
  }, {
    key: 'getOutputEnv',
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
    key: 'getOutputDevEnv',
    value: function getOutputDevEnv() {
      return this.getOutputEnv(['dev', 'default']);
    }
  }, {
    key: 'getOutputDistEnv',
    value: function getOutputDistEnv() {
      return this.getOutputEnv(['dist', 'default']);
    }
  }, {
    key: 'getEnvConfigsForDevDist',
    value: function getEnvConfigsForDevDist() {
      var outputDistEnv = this.getOutputDistEnv();
      var outputDevEnv = this.getOutputDistEnv();

      return [{
        postfix: ':dev',
        env: outputDevEnv
      }, {
        postfix: '',
        env: outputDistEnv
      }];
    }
  }, {
    key: 'getSubmodule',
    value: function getSubmodule(submoduleName) {
      var submoduleData = this.get(['submodules', submoduleName], null);
      if (submoduleData) {
        var paths = this.paths.concat(['submodules', submoduleName]);
        return new GulpConfig(this.config, this, submoduleName, paths);
      }
      return null;
    }
  }, {
    key: 'joinPathByKeys',
    value: function joinPathByKeys(_keys) {
      var keys = this.paths.concat(_keys);
      var result = '';
      var iterator = this.config;
      if (iterator.dir) {
        result = _path2.default.join(result, iterator.dir);
      }
      for (var i = 0; i < keys.length; i++) {
        iterator = iterator[keys[i]];
        if (typeof iterator === 'string' && i === keys.length - 1) {
          result = _path2.default.join(result, iterator);
        } else if (iterator) {
          if (iterator.dir) {
            result = _path2.default.join(result, iterator.dir);
          }
        } else {
          return null;
        }
      }

      for (var _len = arguments.length, otherDirs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        otherDirs[_key - 1] = arguments[_key];
      }

      return _path2.default.join.apply(_path2.default, [result].concat(otherDirs)).replace(/\\/g, '/');
    }
  }, {
    key: 'coalesce',
    value: function coalesce() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _objectPath2.default.coalesce.apply(_objectPath2.default, [this.entry].concat(args));
    }
  }, {
    key: 'get',
    value: function get() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return _objectPath2.default.get.apply(_objectPath2.default, [this.entry].concat(args));
    }
  }]);

  return GulpConfig;
}();