const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(
  session({
    secret: process.env.SECRET || "cats",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routers
const authRouter = require("./routers/authRouter.js");
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`App listening on: ${PORT}`);
});
