//?Built the Router
const express = require("express");
//Modular version of an Express application used to handle routing for a specific endpoint, allowing us to define routes and middleware in a modular and organized way.
const router = express.Router();
const Joi = require("joi");

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

//? Add routes to the router

//GET all
router.get("/", (req, res) => {
  res.send(courses);
});

//GET one
router.get("/:id", (req, res) => {
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id)
  );
  if (!course)
    return res.status(404).send("The course with the given id was not found");

  res.send(course);
});

//POST
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
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

//*Global function
function validate(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(course);
}

//?Export the router
module.exports = router;
