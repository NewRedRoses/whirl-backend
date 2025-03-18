const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "https://www.whirl.social",
  credentials: true,
};

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET || "cats",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.session());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Allow preflight requests

app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: false }));

// Routers
const authRouter = require("./routers/authRouter.js");
const userRouter = require("./routers/userRouter.js");
const postRouter = require("./routers/postRouter.js");
const friendRouter = require("./routers/friendRouter.js");

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/posts?", postRouter);
app.use("/api/friends?", friendRouter);

app.get("/api/test", (req, res) => {
  res.status(200).json({ success: "Backend is working." });
});

app.listen(PORT, () => {
  console.log(`App listening on: ${PORT}`);
});
