const fs = require("fs");
const path = require("path");
const routes = new Map();
const Header = require("./utils/header");
const scenarioMap = {};
const store = require('./utils/store');
const logger = require('./utils/log');
const init = () => {
    // store.functionDirectory = logicDir;
    // this.dataDir = dataDir;
    logger.info({message: "Loading routes..."});
    const files = fs.readdirSync(store.functionDirectory);
    files.length === 0 && logger.warn({message: "No routes found"});
    files.forEach((file) => {
        loadRoutes(file);
        logger.info({message: "loaded", stub: file});
    });
    store.routes = routes;
    store.scenarioMap = scenarioMap;
};

const loadRoutes = (file) => {
    const filePath = path.join(store.functionDirectory, file);

    const route = require(filePath);
    route.name = file;
    try {
        registerRoute(route);
        store.addStubs(route.name, route);
    } catch (err) {
        logger.error({message: 'Failed to load', filePath, err});
    }
};

const registerRoute = (routeFile) => {
    //won't create a route if path ot method isn't defined
    if (!(routeFile.request.method && routeFile.request.urlPath)) {
        logger.warn({message:'urlPath or method is not defined', stub: routeFile.name});
        return;
    };
    constructScenarioMap(routeFile.request, routeFile.name);
    if (routes[routeFile.request.urlPath]) {
        //if route is already defined, add it to the map
        const requestTypeToStubs = routes[routeFile.request.urlPath];
        if (requestTypeToStubs[routeFile.request.method]) {
            //if stubs for requested method is defined
            requestTypeToStubs[routeFile.request.method][
                routeFile.name
            ] = constructHeadersObj(routeFile.request.headers);
        } else {
            requestTypeToStubs[routeFile.request.method] = getMethodToHeader(
                routeFile.request.headers,
                routeFile.name
            );
        }
    } else {
        routes[routeFile.request.urlPath] = getRequestTypeToStub(
            routeFile.request,
            routeFile.name
        );
    }
};

const getMethodToHeader = (headers, name) => {
    const stubToHeaders = {};
    stubToHeaders[name] = constructHeadersObj(headers);
    return stubToHeaders;
};

const constructScenarioMap = ({ scenario, state }, name) => {
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
}

const getRequestTypeToStub = ({ headers, method }, name) => {
    const requestTypeToStubs = {};
    requestTypeToStubs[method] = getMethodToHeader(headers, name);
    return requestTypeToStubs;
};

const constructHeadersObj = (headers) => {
    const ret = [];
    headers && Object.keys(headers).forEach((header) => {
        const logicToValue = headers[header];
        const logicFunc = Object.keys(logicToValue)[0];
        ret.push(new Header(header, logicFunc, logicToValue[logicFunc]));
    });
    return ret;
};

module.exports = init;
