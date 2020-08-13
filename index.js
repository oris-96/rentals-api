const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/database")();
require("./startup/logging")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3000;
app.listen(3000, () => winston.info(`listening on port ${port}...`));
