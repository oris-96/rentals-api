const winston = require("winston");
module.exports = function (err, req, res, next) {
  //log err
  winston.error(err.message, err);
  return res.status(500).send("something failed");
};
