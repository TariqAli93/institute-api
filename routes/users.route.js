import Users from "../controllers/users.controller.js";

const userRoutes = (app) => {
  app.get("/api/users", Users.FindUsers);
  app.get("/api/users/:id", Users.FindUserById);
  app.get("/api/students", Users.FindStudents);
  app.get("/api/students/:id", Users.FindStudentById);
  app.get("/api/teachers", Users.FindTeachers);
  app.get("/api/teachers/:id", Users.FindTeacherById);
  app.post("/api/login", Users.LoginHandler);
};

export default userRoutes;
