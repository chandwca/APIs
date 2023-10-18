const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const secretKey = crypto.randomBytes(32).toString("hex");

// Dummy users for local authentication
const users = [
  { id: 1, username: "Chetna", password: "chetna" },
  { id: 2, username: "Suba", password: "suba" },
];

passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Incorrect username or password." });
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  authenticateLocal: passport.authenticate("local", { session: true }),
  generateToken: (user) =>
    jwt.sign({ id: user.id, username: user.username }, secretKey, {
      expiresIn: "1h",
    }),
  verifyToken: (token) => jwt.verify(token, secretKey),
  secretKey,
};
