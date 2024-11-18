const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Simulating a database
const users = [
  {
    username: "john_doe",
    email: "john@example.com",
    password: "1234",
    question: "Your favorite color?",
    answer: "blue",
  },
];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

app.get("/login", (req, res) => {
  const { alert } = req.query;
  res.render("login", { alert });
});
app.get("/register", (req, res) => res.render("register"));
app.get("/forgot-password", (req, res) => {
  const { alert } = req.query;
  res.render("forgot-password", { question: null, email: null, alert });
});
app.get("/dashboard", (req, res) => res.render("dashboard"));

// Login handling
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (user) {
    if (user.password === password) {
      res.redirect("/dashboard");
    } else {
      res.redirect("/login?alert=Incorrect password");
    }
  } else {
    res.redirect("/login?alert=User not found");
  }
});

// Registration handling
app.post("/register", (req, res) => {
  const { username, email, password, question, custom_question, answer } = req.body;
  const securityQuestion = custom_question || question;

  users.push({ username, email, password, question: securityQuestion, answer });
  res.redirect("/login?alert=Registration successful, please log in");
});

// Forgot Password handling - Fetch Security Question
app.post("/forgot-password-fetch", (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email === email);

  if (user) {
    res.render("forgot-password", { question: user.question, email: user.email, alert: null });
  } else {
    res.redirect("/forgot-password?alert=Email not found");
  }
});

// Forgot Password handling - Reset Password
app.post("/reset-password", (req, res) => {
  const { email, answer, newPassword } = req.body;
  const user = users.find((u) => u.email === email);

  if (user && user.answer.toLowerCase() === answer.toLowerCase()) {
    user.password = newPassword; // Update password
    res.redirect("/login?alert=Password reset successful, please log in");
  } else {
    res.redirect("/forgot-password?alert=Incorrect security answer");
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
