const fs = require("fs");
const path = require("path");
const routes = new Map();
const Header = require("./utils/header");
const init = (logicDir, dataDir) => {
    this.dir = logicDir;
    this.dataDir = dataDir;
    console.log("Loading routes...");
    const files = fs.readdirSync(this.dir);
    files.forEach((file) => {
        loadRoutes(file);
        console.log("loaded", file);
    });
    return routes;
};

const loadRoutes = (file) => {
    const filePath = path.join(this.dir, file);

    const route = require(filePath);
    route.name = file;
    registerRoute(route);
};

const registerRoute = (routeFile) => {
    //won't create a route if path ot method isn't defined
    if (!(routeFile.request.method && routeFile.request.urlPath)) {
        console.log('urlPath or method is not defined in: ', routeFile.name);
        return;
    };

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

const getRequestTypeToStub = ({ headers, method }, name) => {
    const requestTypeToStubs = {};
    requestTypeToStubs[method] = getMethodToHeader(headers, name);
    return requestTypeToStubs;
};

const constructHeadersObj = (headers) => {
    const ret = [];
    Object.keys(headers).forEach((header) => {
        const logicToValue = headers[header];
        const logicFunc = Object.keys(logicToValue)[0];
        ret.push(new Header(header, logicFunc, logicToValue[logicFunc]));
    });
    return ret;
};

module.exports = init;
