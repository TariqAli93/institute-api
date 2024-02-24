import Teachers from "../controllers/teachers.controller.js";

const teacherRoutes = app => {
  app.get("/teachers", Teachers.FindTeachers);
  app.get("/teachers/:id", Teachers.FindTeacherById);
};

export default teacherRoutes;
