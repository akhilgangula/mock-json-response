"use strict";

var _require = require('winston'),
    createLogger = _require.createLogger,
    format = _require.format,
    transports = _require.transports;

var logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }), format.errors({
    stack: true
  }), format.splat(), format.json())
});
logger.add(new transports.Console({
  format: format.combine(format.colorize(), format.simple())
}));
module.exports = logger;