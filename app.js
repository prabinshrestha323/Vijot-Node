const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");

const app = express();
//load routers
const ideas = require("./routes/ideas");
const users = require("./routes/users");

//Passport config
require("./config/passport")(passport);

//map global promise - get rid of warning
mongoose.Promise = global.Promise;
//connected to mongoose
mongoose
  .connect("mongodb://localhost/Vijot", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Monogodb connected......"))
  .catch(err => console.log(err));

//middleware of handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//Method Override middleware
app.use(methodOverride("_method"));
app.get("/", (req, res) => {
  res.render("index");
});

//Express static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.reeor = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
//about route
app.get("/about", (req, res) => {
  res.send("ABOUT");
});

//Use routes
app.use("/ideas", ideas);
app.use("/users", users);

const port = 8000;
app.listen(port, (req, res) => {
  console.log("this is our port number 8000");
});
