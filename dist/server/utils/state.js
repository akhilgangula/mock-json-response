"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var State = /*#__PURE__*/function () {
  function State(stateName, stubName) {
    _classCallCheck(this, State);

    this.stubNames = [];
    this.stateName = stateName;
    this.stubNames.push(stubName);
    this.presentState = 'init';
  }

  _createClass(State, [{
    key: "addStub",
    value: function addStub(stubName) {
      this.stubNames.push(stubName);
    }
  }]);

  return State;
}();