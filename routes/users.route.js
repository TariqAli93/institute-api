import Users from "../controllers/users.controller.js";

const userRoutes = app => {
  app.get("/users", Users.FindUsers);
  app.get("/users/:id", Users.FindUserById);
  app.get("/students", Users.FindStudents);
  app.get("/students/:id", Users.FindStudentById);
  app.get("/teachers", Users.FindTeachers);
  app.get("/teachers/:id", Users.FindTeacherById);
  app.post("/login", Users.LoginHandler);
};

export default userRoutes;
