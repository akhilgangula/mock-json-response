const fs = require("fs");
const express = require("express");
const app = express();
const processor = require('./utils/responseProcessor');
const { exit } = require("process");

express.json();

module.exports = function requireDir(logicDir, dataDir, opts) {
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
    
    const routes = require("./routes")(logicDir, dataDir);
    processor.init(logicDir, dataDir);

    app.use((req, res, next) => {
        const dataObj = processor.processData(processor.getTemplatedResponse(routes, req), req);
        res.status(dataObj.status ? dataObj.status : 200).set(dataObj.headers ? { ...dataObj.headers } : {}).json(dataObj.data);
    });

    const port = 3000;
    app.listen(port, () => console.log(`Server started`));
};