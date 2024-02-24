import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "../routes/users.route.js";
import studentRoutes from "../routes/students.route.js";
import teacherRoutes from "../routes/teachers.route.js";
import translateErrors from "../middlewares/translateErrors.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));
app.use(morgan("dev"));
app.use(translateErrors);

userRoutes(app);
studentRoutes(app);
teacherRoutes(app);

export default app;
