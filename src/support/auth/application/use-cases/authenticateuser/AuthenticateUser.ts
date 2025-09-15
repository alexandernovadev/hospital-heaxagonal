import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../ports/ITokenService";
import { AuthenticationCommand } from "../../dtos/AuthenticationCommand";
import { AuthenticationResponse } from "../../dtos/AuthenticationResponse";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { IPasswordService } from "../../ports/IPasswordService";
import { Email } from "../../../domain/value-objects/Email";
import { InvalidPasswordError } from "../../errors/InvalidPasswordError";
import { TokenGenerationFailedError } from "../../errors/TokenGenerationFailedError";
import { JWTToken } from "../../../domain/value-objects/JWTToken";
import { RefreshToken } from "../../../domain/value-objects/RefreshToken";
import { IEventPublisher } from "../../ports/IEventPublisher";
import { UserLoggedInEvent } from "../../../domain/events/UserLoggedInEvent";
import { UserAccountLockedError } from "../../errors/UserAccountLockedError"; // ➕ Comentario: Nueva importación para UserAccountLockedError
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsError"; // ➕ Comentario: Nueva importación para InvalidCredentialsError

export class AuthenticateUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly passwordService: IPasswordService,
    private eventPublisher: IEventPublisher // ✅ Comentario: Asegurado que eventPublisher está inyectado
  ) {}

  async execute(
    command: AuthenticationCommand
  ): Promise<AuthenticationResponse> {
    // 1. Validar la entrada (command.email, command.password) - ya se hace implícitamente por los VOs o en el paso siguiente

    // 2. Crear Value Object para el email (y buscar por email o username)
    let email: Email;
    try {
      email = Email.create(command.email);
    } catch (error) {
      // ❌ Comentario: Consolidamos errores de formato de email en InvalidCredentialsError para seguridad.
      throw new InvalidCredentialsError("Invalid email format or credentials."); 
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // ❌ Comentario: En vez de UserNotFoundError, lanzamos InvalidCredentialsError para evitar enumeración de usuarios.
      throw new InvalidCredentialsError("Invalid credentials provided.");
    }

    // ➕ Comentario: Paso 2.5: Verificar si la cuenta del usuario está bloqueada.
    // Asumiendo que User.ts tendrá un método para verificar el estado de bloqueo, ej. user.isLocked()
    // Por ahora, como User.ts no tiene un campo para 'locked', lo saltamos o lo dejamos como un TODO.
    // if (user.isLocked()) {
    //   throw new UserAccountLockedError("User account is locked.");
    // }

    // 3. Comparar la contraseña
    const isPasswordValid = await this.passwordService.comparePassword(
      command.password,
      user.getPasswordHash()
    );
    if (!isPasswordValid) {
      // ❌ Comentario: En vez de InvalidPasswordError, lanzamos InvalidCredentialsError para seguridad.
      throw new InvalidCredentialsError("Invalid credentials provided.");
    }

    // 4. Generar tokens de autenticación
    let accessTokenVO: JWTToken;
    let refreshTokenVO: RefreshToken;

    try {
      // Asumiendo que el UserEntity puede dar los roles y permisos si los tuviera (para futura implementación)
      accessTokenVO = await this.tokenService.generateAccessToken(
        user.getId(),
        [],
        []
      );
      refreshTokenVO = await this.tokenService.generateRefreshToken(
        user.getId()
      );
    } catch (error) {
      throw new TokenGenerationFailedError(
        "Failed to generate authentication tokens." 
      );
    }

    // 5. Publicar Evento de Dominio (opcional, pero buena práctica)
    await this.eventPublisher.publish(UserLoggedInEvent.create(user.getId())); // ✅ Comentario: Publicación de evento activada

    // 6. Devolver respuesta
    return {
      userId: user.getId().getValue(),
      username: user.getUsername().getValue(),
      email: user.getEmail().getValue(),
      accessToken: accessTokenVO.getValue(), // ✅ Comentario: Renombrado de 'token' a 'accessToken' en la respuesta
      refreshToken: refreshTokenVO.getValue(),
    };
  }
}
