import Students from "../controllers/students.controller.js";

const studentRoutes = app => {
  app.get("/students", Students.FindStudents);
  app.get("/students/:id", Students.FindStudentsById);
  app.post("/students", Students.RegisterStudents);
};

export default studentRoutes;
