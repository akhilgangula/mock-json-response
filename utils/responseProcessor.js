const path = require('path');
let logicFolder, dataFolder;

const init = (logicDir, dataDir) => {
    logicFolder = logicDir;
    dataFolder = dataDir;
}

const getAllMatches = (reqHeaders, stubs) => {
    const incomingHeaders = Object.keys(reqHeaders);
    const files = Object.keys(stubs);
    const ret = [];

    files.forEach((file) => {
        const headers = stubs[file];
        const matchedHeaders = headers
            .filter((header) => incomingHeaders.includes(header.header))
            .filter((header) => header.match(reqHeaders[header.header]))
            .map((header) => header.header);
        if (matchedHeaders.length === headers.length) {
            ret.push(file);
        }
    });
    return ret;
};


const processData = (file, req) => {
    if (typeof "String" !== typeof file) {
        return { data: file, status: 200 };
    }
    const logicFile = require(path.join(logicFolder, file));
    const responseObj = logicFile.response;
    let data;
    if (responseObj.inlineData) {
        data = responseObj.inlineData;
    } else {
        data = require(path.join(dataFolder, responseObj.bodyFileName));
    }
    logicFile.logic(req, data);
    return { data, status: responseObj.status, headers: responseObj.headers };
}

const urlMatcher = (URLpattern, incomingURL) => {
    const regex = RegExp(URLpattern);
    return regex.test(incomingURL)
}

const getTemplatedResponse = (routes, { url, headers, method }) => {
    let stubs = {}, urlsWithMethods;
    const matchedURLs = Object.keys(routes).filter(route => urlMatcher(route, url)).map(route => route);
    if (matchedURLs.length === 0) {
        return { error: "No matched URL" };
    } else {
        urlsWithMethods = matchedURLs.filter(url => routes[url][method]).map(url => url);
        if (urlsWithMethods.length === 0) return { error: "No Matched Request method" };
    }
    urlsWithMethods.forEach(route => {
        const multipleStubs = routes[route][method];
        Object.keys(multipleStubs).forEach(stubName => {
            stubs[stubName] = multipleStubs[stubName];
        })
    })
    const allMatchedMappings = getAllMatches(headers, stubs);
    if (allMatchedMappings.length === 0) {
        return { warning: "No perfect headers match" }
    }
    if (allMatchedMappings.length === 1) {
        return allMatchedMappings[0];
    } else {
        return { warning: "There multiple matches for this request", values: allMatchedMappings }
    }
};

exports.init = init;
exports.processData = processData;
exports.getTemplatedResponse = getTemplatedResponse