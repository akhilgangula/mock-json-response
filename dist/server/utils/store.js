"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var State = require('./state');

var Store = /*#__PURE__*/function () {
  function Store() {
    _classCallCheck(this, Store);

    this.stubs = {};
    this.functionDirectory = "";
    this.dataDirectory = "";
    this.scenarioMap = {};
    this.routes = {};
  }

  _createClass(Store, [{
    key: "addStubs",
    value: function addStubs(name, stub) {
      //adding stubs in memory for easier access
      this.stubs[name] = stub;
    }
  }]);

  return Store;
}();

module.exports = new Store();