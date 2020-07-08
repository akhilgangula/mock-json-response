const express = require("express");
const router = express();
const fs = require("fs");
const path = require("path");
const init = (logicDir, dataDir) => {
  this.dir = logicDir;
  this.dataDir = dataDir;
  express.json();
  console.log("Loading routes...");

  fs.readdir(this.dir, (err, files) => {
    files.forEach((file) => {
      loadRoutes(file);
      console.log("loaded", file);
    });
  });
  return router;
};

const loadRoutes = (file) => {
  const filePath = path.join(this.dir, file);

  const { route, logic } = require("./" + filePath);
  registerRoute(route.request, route.response, router, logic);
};

const registerRoute = (
  { method, urlPath },
  { status, bodyFileName, inlineData },
  router,
  logic
) => {
  //won't create a route if path ot method isn't defined
  if (!(method && urlPath)) return;

  //import data, bodyFileName takes the precedence from inlineData
  const data = bodyFileName ? require(this.dataDir + bodyFileName) : inlineData;

  const callback = (req, res) => {
    logic(req, data);
    res.status(status || 200).json(data);
  };

  switch (method) {
    case "GET":
      router.get(urlPath, callback);
      break;
    case "POST":
      router.post(urlPath, callback);
      break;
    case "ALL":
      router.all(urlPath, callback);
      break;
    case "PUT":
      router.put(urlPath, callback);
      break;
    case "DELETE":
      router.delete(urlPath, callback);
      break;
    case "PATCH":
      router.patch(urlPath, callback);
      break;
    case "OPTIONS":
      router.options(urlPath, callback);
      break;
    case "HEAD":
      router.head(urlPath, callback);
      break;
  }
};
module.exports = init;
