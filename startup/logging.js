require("winston-mongodb");
const winston = require("winston");
//since this also helps log errors of our routehandlers like by pathcing a try catch block
//we should include the express async error here
require("express-async-errors");
module.exports = function () {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(winston.transports.File, { filename: "logfile.log" });
  //log message to the db
  winston.add(winston.transports.MongoDB, {
    db: "mongodb://localhost/vidly",
    level: "info",
  });
};
