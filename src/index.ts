import express from "express";
// ⚙️ Comentario: Importaciones de Implementaciones de Infraestructura
import { BcryptPasswordService } from "./support/auth/infrastructure/services/BcryptPasswordService";
import { JwtTokenService } from "./support/auth/infrastructure/services/JwtTokenService";
import { InMemoryUserRepository } from "./support/auth/infrastructure/repositories/InMemoryUserRepository";
import { InMemoryEventPublisher } from "./support/auth/infrastructure/event-publishers/InMemoryEventPublisher";
// ⚙️ Comentario: Importaciones de Casos de Uso
import { RegisterUser } from "./support/auth/application/use-cases/registeruser/RegisterUser";
import { AuthenticateUser } from "./support/auth/application/use-cases/authenticateuser/AuthenticateUser";
// ⚙️ Comentario: Importación del Controlador
import { AuthController } from "./support/auth/infrastructure/controllers/AuthController";

const app = express();
const port = 3000;

app.use(express.json());

// 🚀 Comentario: Composición de la Aplicación (Inyección de Dependencias manual)
// Instanciar implementaciones de infraestructura
const passwordService = new BcryptPasswordService();
const tokenService = new JwtTokenService();
const userRepository = new InMemoryUserRepository();
const eventPublisher = new InMemoryEventPublisher();

// Instanciar Casos de Uso, inyectando dependencias
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

// Instanciar Controlador, inyectando Casos de Uso
const authController = new AuthController(registerUser, authenticateUser);

// Montar las rutas del controlador
app.use("/auth", authController.router); // 🔄 Comentario: Todas las rutas de AuthController irán bajo /auth

app.get("/", (req, res) => {
  res.send(`Hello World! The Auth module is running and configured!`); // 🔄 Comentario: Mensaje de bienvenida actualizado
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Auth routes available at http://localhost:${port}/auth`);
});
