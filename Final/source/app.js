const express = require("express");
const dotenv = require("dotenv").config(); // config dot env
const hbs = require("express-handlebars");
const handlebars = require("handlebars");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const toastr = require("express-toastr");

// const isAdmin = require("./config/auth");

//require routers
const authRoute = require("./routers/auth");
const adminRoute = require("./routers/admin");
const movieRoute = require("./routers/Movie");

const app = express();

//Express session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

//Passport config
require("./config/passport");

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//confif flash
app.use(flash());
app.use(toastr());
app.use(function (req, res, next) {
  res.locals.toastr = req.toastr.render();
  if (req.user) {
    res.locals.user = req.user;
    if (req.user.admin === true) {
      res.locals.admin = req.user;
    }
  }
  next();
});

//connect mongoose
mongoose
  .connect(process.env.MONGOOSEDB_URL)
  .then(() => console.log("Connected to mongoose DB"));

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use(cookieParser());
app.use(express.json());

//build express-handlebars
app.engine(
  "hbs",
  hbs.engine({
    defaultLayout: "main",
    helpers: {
      check: function (value, test) {
        return value !== test ? "Season " + value : "";
      },
    },
    extname: ".hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  })
);

// app.engine('hbs', hbs.engine({ defaultLayout: 'main' }));
app.set("view engine", "hbs");
// app.set('views', './views');

// register file static files
app.use(express.static(path.join(__dirname, "/public")));

const { isAuth, isAdmin } = require("./config/auth");

//Routers
app.use("/", authRoute);
app.use("/movie", movieRoute);
app.use("/admin", isAdmin, adminRoute);

app.use("*", (req, res) => {
  res.render("404", {
    layout: false,
  });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port http://localhost:" + process.env.PORT);
});
