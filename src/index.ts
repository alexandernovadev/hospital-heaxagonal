import express from "express";
import {
  authRouter,
  patientRouter,
} from "./shared/infrastructure/ServiceContainer";

const app = express();
const port = 3000;

app.use(express.json());

// 🔄 Montar las rutas de los controladores desde el ServiceContainer
app.use("/auth", authRouter);
app.use("/patients", patientRouter);

app.get("/", (req, res) => {
  res.send(
    `Hello World! The Auth and Patient modules are running and configured!`
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Auth routes available at http://localhost:${port}/auth`);
  console.log(`Patient routes available at http://localhost:${port}/patients`);
});
