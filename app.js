const express = require("express");
const passport = require("passport");
const session = require("express-session");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: process.env.SECRET || "cats",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// Routers
const authRouter = require("./routers/authRouter.js");
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`App listening on: ${PORT}`);
});
