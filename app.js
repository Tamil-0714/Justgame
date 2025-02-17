const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // Session expires in 1 minute
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));


app.get("/login", (req, res) => {
  res.render("login");
});
// Authentication route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "Jaya" && password === "Jaya123") {
    req.session.user = username;
    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

// Dashboard route (protected)
app.get("/", (req, res) => {
  console.log("this is session ", req.session);
  if (!req.session.user) {
    return res.redirect("/login");
  }
  res.render("index");
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
