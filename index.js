require("dotenv").config();
const startupDebugger = require("debug")("app:startup");
const dbDebugger = require("debug")("app:db");
const config = require("config");
//Builds the server
const express = require("express");
const app = express();
//Routers
const courses = require("./routes/courses");
const home = require("./routes/home");

//?Template Engines:
app.set("view engine", "pug");

//? Configuration settings:
console.log("Application Name: " + config.get("name"));
console.log("Mial Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

//? Debugger:
if (app.get("env") === "development") {
  startupDebugger("Morgan enabled");
  dbDebugger("Database debugger enabled");
}

//?Middleware functions: Take a request object and either returns a response to the client or passes the control to another Middleware function
app.use(express.json()); // Reads the request and parses it body into a JSON object, setting the req.body object
app.use((req, res, next) => {
  next(); //Pass control to the next middleware function in the pipeline, preventing the request-response cycle from hanging without termination.
});
app.use("/api/courses", courses); // For any routes that start with /api/courses express should use the courses router
app.use("/", home); //For the route to home, express should use the home router

//? Environment Variables: When hosting environments for node applications we have the PORT environment variable.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
