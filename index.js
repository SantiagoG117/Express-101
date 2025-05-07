const Joi = require("joi");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json()); //enable parsing of JSON objects in the body of a request

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

const schema = validate();

app.get("/", (request, response) => {
  //Route handler
  response.send("Welcome to our website!!!");
});

//GET all
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

//GET one
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id)
  );
  if (!course)
    return res.status(404).send("The course with the given id was not found");

  res.send(course);
});

//POST
app.post("/api/courses/", (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  //Read the course object in the body of the request and use its properties to create a new course object.
  const course = {
    id: courses.length + 1,
    name: req.body.name, //We assume that in the request body we have an object with the name property
  };
  //Add the new course object to the courses array
  courses.push(course);

  //By convention when adding a new object to the server we return it in the body of the response. The reason for this is because usually the client needs to know the id of the new object
  res.send(course);
});

//PUT
app.put("/api/courses/:id", (req, res) => {
  //Look up the existing course
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id)
  );
  //If the course does not exist, return 404 (Resource not found)
  if (!course)
    return res.status(404).send("The course with the given id was not found");

  //Validate the course to make sure it is in good shape
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Update the course and return it
  course.name = req.body.name;
  res.send(course);
});

//DELETE
app.delete("/api/courses/:id", (req, res) => {
  // Look up the existing course by id
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id)
  );
  if (!course)
    return res.status(404).send("The course with the given id was not found");

  // Remove the course from the array and return it
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

/* 
  ? Environment Variables: 
    When hosting environments for node applications we have the PORT environment variable. An environment variable is a variable that is part of the environment in which
    a process runs. 
*/
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

//? Global functions
function validate(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}
