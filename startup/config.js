const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    //throw a new error object cos it gives stack trace and it logs it in our log
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
  }
};
