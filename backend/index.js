const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const morgan = require("morgan");
const bluebird = require("bluebird");
const cors = require("cors");
const config = require("./config");
const routes = require("./routes");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const app = express();

app.use(cors({ credentials: true, origin: true }));

mongoose.Promise = bluebird;
mongoose.connect(
  config.mongo.url,
  { useNewUrlParser: true }
);

app.use(
  session({
    secret: config.session.secret,
    store: new MongoStore({ url: config.mongo.url }),
    resave: false,
    saveUninitialized: true
  })
);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use("/", routes);

// error handling
app.use(function(error, req, res, next) {
  res.status(500);
  res.json({ error: error.message });
});

app.listen(config.server.port, () => {
  console.log(`Magic happens on port ${config.server.port}`);
});

module.exports = app;
