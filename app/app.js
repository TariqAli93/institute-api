import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "../routes/users.route.js";
import translateErrors from "../middlewares/translateErrors.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: true }));
app.use(morgan("dev"));
app.use(translateErrors);

userRoutes(app);

export default app;
