"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fs = require("fs");

var express = require("express");

var app = express();

var processor = require('./server/utils/responseProcessor');

var _require = require("process"),
    exit = _require.exit;

var store = require('./server/utils/store');

var logger = require('./server/utils/log');

express.json();

module.exports = function (logicDir, dataDir, opts) {
  opts = opts || {};

  if (!fs.existsSync(logicDir)) {
    logger.info({
      message: "logicDir: " + logicDir + " path doesn't exist"
    });
    logicDir = undefined;
  }

  if (!fs.existsSync(dataDir)) {
    logger.info({
      message: "dataDir " + dataDir + " path doesn't exist"
    });
    dataDir = undefined;
  } //if dir path isn't valid exit the process


  if (!(logicDir && dataDir)) exit(); //store the directories

  store.functionDirectory = logicDir;
  store.dataDirectory = dataDir; //routes need directory abs path

  require("./server/routes")();

  app.use(function (req, res, next) {
    if (RegExp('/__admin/(.*)/reset').test(req.url)) {
      var _response, status;

      if (req.method !== "POST") {
        status = 400;
        _response = {
          error: "You have reached an invalid admin route",
          tip: "check request method"
        };
      } else {
        var scenario = RegExp('/__admin/(.*)/reset').exec(req.url)[1];
        logger.info({
          message: "Received an admin request to reset scenario",
          scenario: scenario
        });

        if (store.scenarioMap[decodeURI(scenario)]) {
          store.scenarioMap[decodeURI(scenario)].presentState = 'init';
          status = 200;
          _response = {
            message: "Succefully reset state of scenario: " + decodeURI(scenario)
          };
        } else if (scenario === 'all') {
          _response = {
            message: "All scenarios are succefully reset"
          };
          status = 200;
        } else {
          status = 404;
          _response = {
            message: "Error while resetting state",
            tip: decodeURI(scenario) + " scenario was not found"
          };
        }
      }

      res.status(status ? status : 200).send(_response);
      return;
    }

    var response = processor.processData(processor.getTemplatedResponse(req), req);
    res.status(response.status ? response.status : 200).set(response.headers ? _objectSpread({}, response.headers) : {}).json(response.data);
  });
  var port = opts.port ? opts.port : 3000;
  app.listen(port, function () {
    return logger.info({
      message: "Server started at ".concat(port)
    });
  });
};