import { BcryptPasswordService } from "./support/auth/infrastructure/services/BcryptPasswordService";
import { JwtTokenService } from "./support/auth/infrastructure/services/JwtTokenService";
import { InMemoryUserRepository } from "./support/auth/infrastructure/repositories/InMemoryUserRepository";
import { InMemoryEventPublisher } from "./support/auth/infrastructure/event-publishers/InMemoryEventPublisher";
import { RegisterUser } from "./support/auth/application/use-cases/registeruser/RegisterUser";
import { AuthenticateUser } from "./support/auth/application/use-cases/authenticateuser/AuthenticateUser";
import { AuthController } from "./support/auth/infrastructure/controllers/AuthController";

// ⚙️ Importaciones para Patient Context
import { InMemoryPatientRepository } from "./core/patient/infrastructure/repositories/InMemoryPatientRepository";
import { RegisterPatient } from "./core/patient/application/use-cases/registerpatient/RegisterPatient";
import { PatientController } from "./core/patient/infrastructure/controllers/PatientController";

// 🚀 Definición del ServiceContainer
export const serviceContainer = (() => {
  // Auth Context
  const passwordService = new BcryptPasswordService();
  const tokenService = new JwtTokenService();
  const userRepository = new InMemoryUserRepository();
  const eventPublisher = new InMemoryEventPublisher();

  const registerUserUseCase = new RegisterUser(
    userRepository,
    passwordService,
    eventPublisher
  );
  const authenticateUserUseCase = new AuthenticateUser(
    userRepository,
    tokenService,
    passwordService,
    eventPublisher
  );
  const authController = new AuthController(
    registerUserUseCase,
    authenticateUserUseCase
  );

  // Patient Context
  const patientRepository = new InMemoryPatientRepository();
  const registerPatientUseCase = new RegisterPatient(patientRepository);
  const patientController = new PatientController(registerPatientUseCase);

  return {
    auth: {
      controllers: {
        authController,
      },
      useCases: {
        registerUser: registerUserUseCase,
        authenticateUser: authenticateUserUseCase,
      }, // Puedes añadir más aquí si es necesario
    },
    patient: {
      controllers: {
        patientController,
      },
      useCases: {
        registerPatient: registerPatientUseCase,
      },
    },
  };
})();
