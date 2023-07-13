const path = require("path");

const express = require("express");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");
const csrf = require("csurf");

const db = require("./data/database");

//routes
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const sessionConfig = require("./config/sessions");
const authMiddleWare = require("./middlewares/auth-middleware");
const addCSRFTokenMiddleware = require("./middlewares/csrf-tocken-middleware");
const app = express();

const mongoDBSessionStore = sessionConfig.createSessionStore(session);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(session(sessionConfig.createSessionConfig(mongoDBSessionStore)));
app.use(csrf());

//app.use(addCSRFTokenMiddleware);
app.use(authMiddleWare);

app.use(blogRoutes);
app.use(authRoutes);

app.use(function (error, req, res, next) {
  console.error(error.stack);
  res.render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
