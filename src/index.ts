import express from "express";
// ⚙️ Comentario: Importaciones de Implementaciones de Infraestructura
import { BcryptPasswordService } from "./support/auth/infrastructure/services/BcryptPasswordService";
import { JwtTokenService } from "./support/auth/infrastructure/services/JwtTokenService";
import { InMemoryUserRepository } from "./support/auth/infrastructure/repositories/InMemoryUserRepository";
import { InMemoryEventPublisher } from "./support/auth/infrastructure/event-publishers/InMemoryEventPublisher";

// ⚙️ Comentario: Importaciones de Infraestructura del contexto Patient
import { InMemoryPatientRepository } from "./core/patient/infrastructure/repositories/InMemoryPatientRepository";
import { PatientController } from "./core/patient/infrastructure/controllers/PatientController";

// ⚙️ Comentario: Importaciones de Casos de Uso
import { RegisterUser } from "./support/auth/application/use-cases/registeruser/RegisterUser";
import { AuthenticateUser } from "./support/auth/application/use-cases/authenticateuser/AuthenticateUser";

// ⚙️ Comentario: Importaciones de Casos de Uso del contexto Patient
import { RegisterPatient } from "./core/patient/application/use-cases/registerpatient/RegisterPatient";

// ⚙️ Comentario: Importación del Controlador
import { AuthController } from "./support/auth/infrastructure/controllers/AuthController";

const app = express();
const port = 3000;

app.use(express.json());

// 🚀 Comentario: Composición de la Aplicación (Inyección de Dependencias manual)
// Instanciar implementaciones de infraestructura del contexto Auth
const passwordService = new BcryptPasswordService();
const tokenService = new JwtTokenService();
const userRepository = new InMemoryUserRepository();
const eventPublisher = new InMemoryEventPublisher();

// Instanciar implementaciones de infraestructura del contexto Patient
const patientRepository = new InMemoryPatientRepository();

// Instanciar Casos de Uso del contexto Auth, inyectando dependencias
const registerUser = new RegisterUser(
  userRepository,
  passwordService,
  eventPublisher
);
const authenticateUser = new AuthenticateUser(
  userRepository,
  tokenService,
  passwordService,
  eventPublisher
);

// Instanciar Casos de Uso del contexto Patient, inyectando dependencias
const registerPatient = new RegisterPatient(patientRepository);

// Instanciar Controlador del contexto Auth, inyectando Casos de Uso
const authController = new AuthController(registerUser, authenticateUser);

// Instanciar Controlador del contexto Patient, inyectando Casos de Uso
const patientController = new PatientController(registerPatient);

// Montar las rutas de los controladores
app.use("/auth", authController.router); // 🔄 Comentario: Todas las rutas de AuthController irán bajo /auth
app.use("/patients", patientController.router); // 🔄 Comentario: Todas las rutas de PatientController irán bajo /patients

app.get("/", (req, res) => {
  res.send(`Hello World! The Auth and Patient modules are running and configured!`); // 🔄 Comentario: Mensaje de bienvenida actualizado
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Auth routes available at http://localhost:${port}/auth`);
  console.log(`Patient routes available at http://localhost:${port}/patients`);
});
