import Users from "../controllers/users.controller.js";

const userRoutes = app => {
  app.get("/users", Users.FindUsers);
  app.post("/users", Users.RegisterUsers);
  app.get("/users/:id", Users.FindUserById);
  app.put("/users/:id", Users.UpdateUsers);
  app.put("/users/trash/:id", Users.SoftDelete);
  app.delete("/users/:id", Users.HardDelete);
  app.post("/login", Users.LoginHandler);
};

export default userRoutes;
