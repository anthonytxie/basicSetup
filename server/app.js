require("dotenv").config();
require("./services/passport");
const passport = require("passport");
const express = require("express");
const cookieSession = require("cookie-session");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const winston = require("winston");
const serializeError = require("serialize-error");

const app = express();


//Middleware

app.use(
	cookieSession({
		maxAge: 60 * 60 * 1000,
		keys: [process.env.cookieSecret]
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(authRoutes);



module.exports = app;
