"use strict";

var fs = require("fs");

var path = require("path");

var routes = new Map();

var Header = require("./utils/header");

var scenarioMap = {};

var store = require('./utils/store');

var logger = require('./utils/log');

var init = function init() {
  // store.functionDirectory = logicDir;
  // this.dataDir = dataDir;
  logger.info({
    message: "Loading routes..."
  });
  var files = fs.readdirSync(store.functionDirectory);
  files.length === 0 && logger.warn({
    message: "No routes found"
  });
  files.forEach(function (file) {
    loadRoutes(file);
    logger.info({
      message: "loaded",
      stub: file
    });
  });
  store.routes = routes;
  store.scenarioMap = scenarioMap;
};

var loadRoutes = function loadRoutes(file) {
  var filePath = path.join(store.functionDirectory, file);

  var route = require(filePath);

  route.name = file;

  try {
    registerRoute(route);
    store.addStubs(route.name, route);
  } catch (err) {
    logger.error({
      message: 'Failed to load',
      filePath: filePath,
      err: err
    });
  }
};

var registerRoute = function registerRoute(routeFile) {
  //won't create a route if path ot method isn't defined
  if (!(routeFile.request.method && routeFile.request.urlPath)) {
    logger.warn({
      message: 'urlPath or method is not defined',
      stub: routeFile.name
    });
    return;
  }

  ;
  constructScenarioMap(routeFile.request, routeFile.name);

  if (routes[routeFile.request.urlPath]) {
    //if route is already defined, add it to the map
    var requestTypeToStubs = routes[routeFile.request.urlPath];

    if (requestTypeToStubs[routeFile.request.method]) {
      //if stubs for requested method is defined
      requestTypeToStubs[routeFile.request.method][routeFile.name] = constructHeadersObj(routeFile.request.headers);
    } else {
      requestTypeToStubs[routeFile.request.method] = getMethodToHeader(routeFile.request.headers, routeFile.name);
    }
  } else {
    routes[routeFile.request.urlPath] = getRequestTypeToStub(routeFile.request, routeFile.name);
  }
};

var getMethodToHeader = function getMethodToHeader(headers, name) {
  var stubToHeaders = {};
  stubToHeaders[name] = constructHeadersObj(headers);
  return stubToHeaders;
};

var constructScenarioMap = function constructScenarioMap(_ref, name) {
  var scenario = _ref.scenario,
      state = _ref.state;

  if (scenario) {
    if (!state) throw name + " has defined scenario, but no state was found!";

    if (!scenarioMap[scenario]) {
      scenarioMap[scenario] = {};
    }

    if (!scenarioMap[scenario]['presentState']) {
      scenarioMap[scenario]['presentState'] = 'init';
    }

    if (!scenarioMap[scenario]['stages']) {
      scenarioMap[scenario]['stages'] = {};
    }

    if (!scenarioMap[scenario]['stages'][state]) {
      scenarioMap[scenario]['stages'][state] = [];
    }

    scenarioMap[scenario]['stages'][state].push(name);
  }
};

var getRequestTypeToStub = function getRequestTypeToStub(_ref2, name) {
  var headers = _ref2.headers,
      method = _ref2.method;
  var requestTypeToStubs = {};
  requestTypeToStubs[method] = getMethodToHeader(headers, name);
  return requestTypeToStubs;
};

var constructHeadersObj = function constructHeadersObj(headers) {
  var ret = [];
  headers && Object.keys(headers).forEach(function (header) {
    var logicToValue = headers[header];
    var logicFunc = Object.keys(logicToValue)[0];
    ret.push(new Header(header, logicFunc, logicToValue[logicFunc]));
  });
  return ret;
};

module.exports = init;