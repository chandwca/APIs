//inport Express Module-Setting up an HTTP server.
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const authConfig = require("./auth-config");

//Return an instance of Express
const app = express();
//application running on port 3000
const port = 3000;

app.use(
  session({
    secret: authConfig.secretKey,
    resave: true,
    saveUninitialized: true,
  })
);
// Passport.js configuration

app.use(authConfig.initialize);
app.use(authConfig.session);

//Reload browser to see changes(Serve all static files of the application)
app.use(express.static("public"));
//middleware that prepares incoming datae understood by the server
app.use(bodyParser.json());

let initialTitle = { title: "Hello World" };

app.post("/login", authConfig.authenticateLocal, (req, res) => {
  let token = authConfig.generateToken(req.user);
  res.json({
    message: "Login successful",
    token: token,
    user: req.user,
    successReturnToOrRedirect: "/",
  });
});
app.get("/", (req, res) => {
  let token = req.headers.authorization?.split(" ")[1];
  console.log("token", token);
  if (token) {
    try {
      const decoded = authConfig.verifyToken(token);
      console.log(`${decoded.username} is logged in.`);
      res.json({
        message: "User is logged in",
        username: decoded.username,
      });
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
  // console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.json(initialTitle);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

//update
app.put("/", (req, res) => {
  const userEnteredTitle = req.body.title;
  initialTitle = userEnteredTitle;
  res.json({ title: initialTitle });
});
app.post("/", (req, res) => {
  const newValue = req.body;
  initialTitle = { ...initialTitle, ...newValue };
  res.json({ ...newValue, ...initialTitle });
});

//To start responding to requests, the server needs to  listen to requests on a specified port using app.listen(port).
//The second arrgument is a callback function - called when the server is running ready to recive responses.
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
