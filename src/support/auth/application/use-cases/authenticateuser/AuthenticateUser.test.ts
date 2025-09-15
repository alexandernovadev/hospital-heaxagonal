import { AuthenticateUser } from "./AuthenticateUser";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../ports/ITokenService";
import { IPasswordService } from "../../ports/IPasswordService";
import { IEventPublisher } from "../../ports/IEventPublisher";
import { AuthenticationCommand } from "../../dtos/AuthenticationCommand";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { InvalidPasswordError } from "../../errors/InvalidPasswordError";
import { TokenGenerationFailedError } from "../../errors/TokenGenerationFailedError";
import { User } from "../../../domain/entities/User";
import { UserID } from "../../../domain/value-objects/UserId";
import { Username } from "../../../domain/value-objects/Username";
import { Email } from "../../../domain/value-objects/Email";
import { PasswordHash } from "../../../domain/value-objects/PasswordHash";
import { JWTToken } from "../../../domain/value-objects/JWTToken";
import { RefreshToken } from "../../../domain/value-objects/RefreshToken";
import { UserLoggedInEvent } from "../../../domain/events/UserLoggedInEvent";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsError";

describe("AuthenticateUser", () => {
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockTokenService: jest.Mocked<ITokenService>;
  let mockPasswordService: jest.Mocked<IPasswordService>;
  let mockEventPublisher: jest.Mocked<IEventPublisher>;
  let authenticateUser: AuthenticateUser;

  const validEmail = "test@example.com";
  const validPassword = "StrongPassword123!";
  const hashedPassword = PasswordHash.create(
    "$2a$10$abcdefghijklmnopqrstuvwxyzaabcdefghijklmnopqrstuv"
  ); // 60 chars
  const accessToken = JWTToken.create("mockAccessToken");
  const refreshToken = RefreshToken.create("mockRefreshToken");
  const userId = UserID.createNew();
  const username = Username.create("testuser");
  const userEmail = Email.create(validEmail);

  let user: User;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      exists: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    mockTokenService = {
      generateAccessToken: jest.fn().mockResolvedValue(accessToken),
      generateRefreshToken: jest.fn().mockResolvedValue(refreshToken),
    };
    mockPasswordService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn().mockResolvedValue(true),
    };
    mockEventPublisher = {
      publish: jest.fn(),
    };

    user = User.create(userId, username, hashedPassword, userEmail);

    mockUserRepository.findByEmail.mockResolvedValue(user);

    authenticateUser = new AuthenticateUser(
      mockUserRepository,
      mockTokenService,
      mockPasswordService,
      mockEventPublisher
    );
  });

  it("should authenticate a user successfully and publish a UserLoggedInEvent", async () => {
    const command: AuthenticationCommand = {
      email: validEmail,
      password: validPassword,
    };

    const response = await authenticateUser.execute(command);

    expect(response.userId).toBe(userId.getValue());
    expect(response.username).toBe(username.getValue());
    expect(response.email).toBe(validEmail);
    expect(response.accessToken).toBe(accessToken.getValue());
    expect(response.refreshToken).toBe(refreshToken.getValue());
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userEmail);
    expect(mockPasswordService.comparePassword).toHaveBeenCalledWith(
      validPassword,
      hashedPassword
    );
    expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(
      userId,
      [],
      []
    );
    expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith(userId);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.any(UserLoggedInEvent)
    );
  });

  it("should throw InvalidCredentialsError if user is not found", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const command: AuthenticationCommand = {
      email: validEmail,
      password: validPassword,
    };

    await expect(authenticateUser.execute(command)).rejects.toThrow(
      InvalidCredentialsError
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userEmail);
    expect(mockPasswordService.comparePassword).not.toHaveBeenCalled();
    expect(mockTokenService.generateAccessToken).not.toHaveBeenCalled();
    expect(mockTokenService.generateRefreshToken).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it("should throw InvalidCredentialsError if password is incorrect", async () => {
    mockPasswordService.comparePassword.mockResolvedValue(false);

    const command: AuthenticationCommand = {
      email: validEmail,
      password: validPassword,
    };

    await expect(authenticateUser.execute(command)).rejects.toThrow(
      InvalidCredentialsError
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userEmail);
    expect(mockPasswordService.comparePassword).toHaveBeenCalledWith(
      validPassword,
      hashedPassword
    );
    expect(mockTokenService.generateAccessToken).not.toHaveBeenCalled();
    expect(mockTokenService.generateRefreshToken).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it("should throw TokenGenerationFailedError if access token generation fails", async () => {
    mockTokenService.generateAccessToken.mockRejectedValue(
      new TokenGenerationFailedError()
    );

    const command: AuthenticationCommand = {
      email: validEmail,
      password: validPassword,
    };

    await expect(authenticateUser.execute(command)).rejects.toThrow(
      TokenGenerationFailedError
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userEmail);
    expect(mockPasswordService.comparePassword).toHaveBeenCalledWith(
      validPassword,
      hashedPassword
    );
    expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(
      userId,
      [],
      []
    );
    expect(mockTokenService.generateRefreshToken).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it("should throw TokenGenerationFailedError if refresh token generation fails", async () => {
    mockTokenService.generateRefreshToken.mockRejectedValue(
      new TokenGenerationFailedError()
    );

    const command: AuthenticationCommand = {
      email: validEmail,
      password: validPassword,
    };

    await expect(authenticateUser.execute(command)).rejects.toThrow(
      TokenGenerationFailedError
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userEmail);
    expect(mockPasswordService.comparePassword).toHaveBeenCalledWith(
      validPassword,
      hashedPassword
    );
    expect(mockTokenService.generateAccessToken).toHaveBeenCalledWith(
      userId,
      [],
      []
    );
    expect(mockTokenService.generateRefreshToken).toHaveBeenCalledWith(userId);
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it("should throw InvalidCredentialsError if email format is invalid", async () => {
    const invalidEmail = "invalid-email";
    const command: AuthenticationCommand = {
      email: invalidEmail,
      password: validPassword,
    };

    await expect(authenticateUser.execute(command)).rejects.toThrow(
      InvalidCredentialsError
    );
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    expect(mockPasswordService.comparePassword).not.toHaveBeenCalled();
    expect(mockTokenService.generateAccessToken).not.toHaveBeenCalled();
    expect(mockTokenService.generateRefreshToken).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });
});
