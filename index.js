const fs = require("fs");
const express = require("express");
const app = express();
const processor = require('./utils/responseProcessor');
const { exit } = require("process");
const store = require('./utils/store');

express.json();

module.exports = (logicDir, dataDir, opts) => {
    opts = opts || {};
    if (!fs.existsSync(logicDir)) {
        console.log("logicDir:", logicDir, "path doesn't exist");
        logicDir = undefined;
    }
    if (!fs.existsSync(dataDir)) {
        console.log("dataDir", dataDir, " path doesn't exist");
        dataDir = undefined;
    }

    //if dir path isn't valid exit the process
    if (!(logicDir && dataDir)) exit();

    //store the directories
    store.functionDirectory = logicDir;
    store.dataDirectory = dataDir;

    //routes need directory abs path
    require("./routes")();


    app.use((req, res, next) => {
        if (RegExp('/__admin/(.*)/reset').test(req.url)) {
            let response, status;
            if (req.method !== "POST") {
                status = 400;
                response = {
                    error: "You have reached an invalid admin route",
                    tip: "check request method"
                }
            } else {
                const scenario = RegExp('/__admin/(.*)/reset').exec(req.url)[1];
                console.log("Received an admin request to reset scenario: ", scenario);

                if (store.scenarioMap[decodeURI(scenario)]) {

                    store.scenarioMap[decodeURI(scenario)].presentState = 'init';
                    status = 200;
                    response = { message: "Succefully reset state of scenario: " + decodeURI(scenario) }
                }
                else if (scenario === 'all') {
                    response = { message: "All scenarios are succefully reset" }
                    status = 200;
                } else {
                    status = 404;
                    response = {
                        message: "Error while resetting state",
                        tip: decodeURI(scenario) + " scenario was not found"
                    }
                }
            }
            res.status(status ? status : 200).send(response);
            return;
        }
        const response = processor.processData(processor.getTemplatedResponse(req), req);
        res.status(response.status ? response.status : 200).set(response.headers ? { ...response.headers } : {}).json(response.data);
    });


    const port = 3000;
    app.listen(port, () => console.log(`Server started`));
};