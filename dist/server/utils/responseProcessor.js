"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processScenario = exports.getTemplatedResponse = exports.urlMatcher = exports.processData = exports.getAllMatches = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var path = require('path');

var store = require('./store');

var getAllMatches = function getAllMatches(reqHeaders, stubs) {
  var incomingHeaders = Object.keys(reqHeaders);
  var files = Object.keys(stubs);
  var ret = [];
  files.forEach(function (file) {
    var headers = stubs[file];
    var matchedHeaders = headers.filter(function (header) {
      return incomingHeaders.includes(header.header);
    }).filter(function (header) {
      return header.match(reqHeaders[header.header]);
    }).map(function (header) {
      return header.header;
    });

    if (matchedHeaders.length === headers.length) {
      ret.push(file);
    }
  });
  return ret;
};

exports.getAllMatches = getAllMatches;

var processData = function processData(file, req) {
  if (_typeof("String") !== _typeof(file)) {
    return {
      data: file,
      status: 200
    };
  }

  var logicFile = require(path.join(store.functionDirectory, file));

  var res = logicFile.response;

  if (res.inlineData) {
    res.data = res.inlineData;
  } else {
    res.data = require(path.join(store.dataDirectory, res.bodyFileName));
  }

  logicFile.logic && logicFile.logic(req, res);
  return res;
};

exports.processData = processData;

var urlMatcher = function urlMatcher(URLpattern, incomingURL) {
  var regex = RegExp(URLpattern);
  return regex.test(incomingURL);
};

exports.urlMatcher = urlMatcher;

var getTemplatedResponse = function getTemplatedResponse(_ref) {
  var url = _ref.url,
      headers = _ref.headers,
      method = _ref.method;
  var routes = store.routes;
  var scenarioMap = store.scenarioMap;
  var allstubs = store.stubs;
  var stubs = {},
      urlsWithMethods;
  var matchedURLs = Object.keys(routes).filter(function (route) {
    return urlMatcher(route, url);
  }).map(function (route) {
    return route;
  });

  if (matchedURLs.length === 0) {
    return {
      error: "No matched URL"
    };
  } else {
    urlsWithMethods = matchedURLs.filter(function (url) {
      return routes[url][method];
    }).map(function (url) {
      return url;
    });
    if (urlsWithMethods.length === 0) return {
      error: "No Matched Request method"
    };
  }

  urlsWithMethods.forEach(function (route) {
    var multipleStubs = routes[route][method];
    Object.keys(multipleStubs).forEach(function (stubName) {
      stubs[stubName] = multipleStubs[stubName];
    });
  });
  var allMatchedMappings = getAllMatches(headers, stubs);

  if (allMatchedMappings.length === 0) {
    return {
      warning: "No perfect headers match"
    };
  }

  if (allMatchedMappings.length === 1) {
    //perfect match of headers
    var matchedFile = allMatchedMappings[0];
    return processScenario(allstubs, scenarioMap, matchedFile);
  } else {
    //have multiple matches
    var processedScenarios = allMatchedMappings.filter(function (singleFile) {
      return allstubs[singleFile].request.scenario;
    }).map(function (singleFile) {
      return processScenario(allstubs, scenarioMap, singleFile);
    });

    if (processedScenarios.length !== 0) {
      var fileNames = processedScenarios.filter(function (processedScenario) {
        return _typeof(processedScenario) === _typeof("String");
      }).map(function (files) {
        return files;
      });

      if (fileNames.length === 0) {
        return {
          warning: "there was a match, but ignored as it was not fulfilling the state",
          tip: "if you didn't intend that to happen please remove scenario in request",
          possibleMatches: allMatchedMappings
        };
      } else if (fileNames.length === 1) {
        return fileNames[0];
      } else {
        return {
          warning: "There multiple matches for this request after scenarios are applied",
          values: fileNames
        };
      }
    } // .filter(singleFile => allstubs[singleFile].request.state === store.state);


    return {
      warning: "There multiple matches for this request",
      values: allMatchedMappings
    };
  }
};

exports.getTemplatedResponse = getTemplatedResponse;

var processScenario = function processScenario(allstubs, scenarioMap, matchedFile) {
  var presentScenario = allstubs[matchedFile].request.scenario;
  if (!presentScenario) return matchedFile;
  var presentStage = scenarioMap[presentScenario].presentState;
  var targetState = allstubs[matchedFile].request.targetState;

  if (!targetState) {
    //get stub match with the stage
    var stubState = allstubs[matchedFile].request.state;

    if (stubState === presentStage) {
      return matchedFile;
    } else {
      return {
        warning: "there was a match, but ignored as it was not fulfilling the state",
        tip: "if you didn't intend that to happen please remove scenario in request"
      };
    }
  } else {
    //increment the state of files  as present state and return the response
    scenarioMap[presentScenario].presentState = targetState;
    return matchedFile;
  }
};

exports.processScenario = processScenario;