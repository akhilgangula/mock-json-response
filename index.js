const fs = require("fs");
module.exports = function requireDir(logicDir, dataDir, opts) {
  opts = opts || {};
  if (!fs.existsSync(logicDir)) {
    console.log("logicDir:", logicDir, "path doesn't exist using default path");
    logicDir = undefined;
  }
  if (!fs.existsSync(dataDir)) {
    console.log("dataDir", dataDir, " path doesn't exist using default path");
    dataDir = undefined;
  }
  logicDir = logicDir || "./logic/";
  dataDir = dataDir || "./data/";
  const app = require("./routes")(logicDir, dataDir);
  const port = 3000;
  app.listen(port, () => console.log(`Server started`));
};
