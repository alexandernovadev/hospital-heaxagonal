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

export class AuthenticateUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly passwordService: IPasswordService
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
      // Si el email no es válido, se lanza un DomainError que el cliente debe manejar como un error de aplicación
      throw error;
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError("User not found.");
    }

    // 3. Comparar la contraseña
    const isPasswordValid = await this.passwordService.comparePassword(
      command.password,
      user.getPasswordHash()
    );
    if (!isPasswordValid) {
      throw new InvalidPasswordError("Invalid password.");
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
    // await this.eventPublisher.publish(UserLoggedInEvent.create(user.getId()));

    // 6. Devolver respuesta
    return {
      userId: user.getId().getValue(),
      username: user.getUsername().getValue(),
      email: user.getEmail().getValue(),
      token: accessTokenVO.getValue(),
      refreshToken: refreshTokenVO.getValue(),
    };
  }
}
