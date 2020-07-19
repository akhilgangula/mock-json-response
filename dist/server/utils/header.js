"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Header = /*#__PURE__*/function () {
  function Header(header, logicalOp, value) {
    _classCallCheck(this, Header);

    this.header = header;
    this.logicalOp = logicalOp;
    this.value = value;
  }

  _createClass(Header, [{
    key: "match",
    value: function match(matchTo) {
      switch (this.logicalOp) {
        case "equalTo":
          return this.value === matchTo;

        case "matches":
          return RegExp(this.value).test(matchTo);

        case "contains":
          return this.value.includes(matchTo);

        default:
          console.log(this.logicalOp, 'is not defined');
          return false;
      }
    }
  }]);

  return Header;
}();

module.exports = Header;