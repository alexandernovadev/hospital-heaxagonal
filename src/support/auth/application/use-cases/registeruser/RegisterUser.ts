import { UserID } from "../../../domain/value-objects/UserId";
import { Username } from "../../../domain/value-objects/Username";
import { Email } from "../../../domain/value-objects/Email";
import { PasswordHash } from "../../../domain/value-objects/PasswordHash";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../ports/IPasswordService";
import { IEventPublisher } from "../../ports/IEventPublisher";
import { RegisterUserCommand } from "../../dtos/RegisterUserCommand";
import { UserRegisteredResponse } from "../../dtos/UserRegisteredResponse";
import { UserRegisteredEvent } from "../../../domain/events/UserRegisteredEvent";
import { WeakPasswordError } from "../../errors/WeakPasswordError";
import { DuplicateUsernameError } from "../../errors/DuplicateUsernameError";
import { DuplicateEmailError } from "../../errors/DuplicateEmailError";
import { PasswordHashingFailedError } from "../../../../../shared/application/errors/PasswordHashingFailedError";

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
    private eventPublisher: IEventPublisher
  ) {}

  public async execute(
    command: RegisterUserCommand
  ): Promise<UserRegisteredResponse> {
    // 1. Validaciones a nivel de aplicación (ej. contraseña vacía, longitud mínima aquí si no es del VO)
    if (!command.password || command.password.length < 8) {
      throw new WeakPasswordError("Password must be at least 8 characters long.");
    }

    // 2. Crear Value Objects del Dominio (con su propia validación)
    let username: Username;
    let email: Email;
    try {
      username = Username.create(command.username);
      email = Email.create(command.email);
    } catch (error) {
      // Si la validación del VO falla, relanzar el error de dominio específico
      throw error; 
    }

    // 3. Verificar si el usuario ya existe por username o email (reglas de aplicación/dominio)
    const existingUserByUsername = await this.userRepository.findByUsername(
      username
    );
    if (existingUserByUsername) {
      throw new DuplicateUsernameError("Username already exists.");
    }

    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new DuplicateEmailError("Email already exists.");
    }

    // 4. Hashear la contraseña (delegado al servicio de infraestructura)
    let passwordHash: PasswordHash;
    try {
      passwordHash = await this.passwordService.hashPassword(
        command.password
      );
    } catch (error) {
      throw new PasswordHashingFailedError("Failed to hash password.");
    }

    // 5. Crear la Entidad de Dominio
    const userId = UserID.createNew();
    const newUser = User.create(userId, username, passwordHash, email);

    // 6. Persistir la Entidad
    await this.userRepository.save(newUser);

    // 7. Publicar Evento de Dominio
    const userRegisteredEvent = UserRegisteredEvent.create(
      newUser.getId(),
      newUser.getUsername(),
      newUser.getEmail()
    );
    await this.eventPublisher.publish(userRegisteredEvent);

    // 8. Devolver respuesta
    return {
      userId: newUser.getId().getValue(),
      username: newUser.getUsername().getValue(),
      email: newUser.getEmail().getValue(),
      message: "User registered successfully.",
    };
  }
}
