const express =require( 'express');
const dotenv =require( "dotenv");
const indexRouter =require( './routes/index');
const userRouter  =require( './routes/user');
const adminRouter =require( "./routes/admin");
const productManagerRouter=require("./routes/productManager")
const logger =require( 'morgan');
const cookieParser =require('cookie-parser');
const path =require('path');
dotenv.config();
require("./config/db");
const session = require("express-session");



const app = express();
// Log http request status
app.use(logger('dev'));
app.use(cookieParser());

// View Engine
app.set("view engine", "ejs");

// To create req object
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Path
app.use("/public", express.static(path.join(__dirname, "public")));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: "SHOEZONE-session",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:86400000 },
  })
);


// Routes
app.use("/", indexRouter);

app.use("/users", userRouter);

app.use("/admin", adminRouter);

app.use("/productManager", productManagerRouter);


// 404 Rendering
const userCollection=require("./models/user/details")
app.all("*", async (req, res) => {
  const currentUser = await userCollection.findById(req.session.userID);
  res.render("index/404", {
    documentTitle: "404 | Page not found",
    url: req.originalUrl,
    session: req.session.userID,
    currentUser,
  });
});


// Create Server
const PORT = process.env.PORT || 3000 ;
app.listen(PORT, (err) => {
  if (err) {
    console.log("Error starting server: " + err);
  } else {
    console.log(`Listening on https://shoezone.live`);
  }
});