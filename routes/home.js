//? Built the Router
const express = require("express");
const router = express.Router();

//? Add routes to the home router
router.get("/", (req, res) => {
  res.render("index", {
    title: "My Express App",
    message: "Welcome to our app!",
  });
});

//? Export the router
module.exports = router;
