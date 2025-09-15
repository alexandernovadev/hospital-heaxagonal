import { RegisterUser } from "./RegisterUser";
import { PasswordHash } from "../../../domain/value-objects/PasswordHash";
import { Email } from "../../../domain/value-objects/Email";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordService } from "../../ports/IPasswordService";
import { IEventPublisher } from "../../ports/IEventPublisher";
import { UserRegisteredEvent } from "../../../domain/events/UserRegisteredEvent";
import { WeakPasswordError } from "../../errors/WeakPasswordError";
import { User } from "../../../domain/entities/User";
import { UserID } from "../../../domain/value-objects/UserId";
import { Username } from "../../../domain/value-objects/Username";
import { DuplicateUsernameError } from "../../errors/DuplicateUsernameError";
import { DuplicateEmailError } from "../../errors/DuplicateEmailError";
import { PasswordHashingFailedError } from "../../../../../shared/application/errors/PasswordHashingFailedError";
import { RegisterUserCommand } from "../../dtos/RegisterUserCommand";

describe("RegisterUser", () => {
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockPasswordService: jest.Mocked<IPasswordService>;
  let mockEventPublisher: jest.Mocked<IEventPublisher>;
  let registerUser: RegisterUser;

  const validUsername = "testuser";
  const validEmail = "test@example.com";
  const strongPassword = "StrongPassword123!";
  const hashedPassword = PasswordHash.create(
    "$2a$10$abcdefghijklmnopqrstuvwxyzaabcdefghijklmnopqrstuv"
  ); // 60 chars

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      exists: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    mockPasswordService = {
      hashPassword: jest.fn().mockResolvedValue(hashedPassword),
      comparePassword: jest.fn(),
    };
    mockEventPublisher = {
      publish: jest.fn(),
    };

    registerUser = new RegisterUser(
      mockUserRepository,
      mockPasswordService,
      mockEventPublisher
    );
  });

  it("should register a user successfully and publish a UserRegisteredEvent", async () => {
    mockUserRepository.findByUsername.mockResolvedValue(null);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(undefined);

    const command: RegisterUserCommand = {
      username: validUsername,
      email: validEmail,
      password: strongPassword,
    };

    const response = await registerUser.execute(command);

    expect(response.message).toBe("User registered successfully.");
    expect(response.username).toBe(validUsername);
    expect(response.email).toBe(validEmail);
    expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
      strongPassword
    );
    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    expect(mockEventPublisher.publish).toHaveBeenCalledTimes(1);
    expect(mockEventPublisher.publish).toHaveBeenCalledWith(
      expect.any(UserRegisteredEvent)
    );
  });

  it("should throw WeakPasswordError if password is too weak", async () => {
    const weakPassword = "123";
    // Simulate PasswordHash.create throwing an error if the password is too weak
    mockPasswordService.hashPassword.mockImplementation(() => {
      throw new WeakPasswordError(
        "Password must be at least 8 characters long." as string
      );
    });

    const command: RegisterUserCommand = {
      username: validUsername,
      email: validEmail,
      password: weakPassword,
    };

    await expect(registerUser.execute(command)).rejects.toThrow(
      WeakPasswordError
    );
    expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(weakPassword);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it("should throw DuplicateUsernameError if username already exists", async () => {
    mockUserRepository.findByUsername.mockResolvedValue(
      User.create(
        UserID.createNew(),
        Username.create(validUsername),
        PasswordHash.create(hashedPassword.getValue() as string),
        Email.create("other@example.com")
      )
    );
    mockUserRepository.findByEmail.mockResolvedValue(null);

    const command: RegisterUserCommand = {
      username: validUsername,
      email: validEmail,
      password: strongPassword,
    };

    await expect(registerUser.execute(command)).rejects.toThrow(
      DuplicateUsernameError
    );
    expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
      strongPassword
    );
    expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(
      Username.create(validUsername)
    );
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it("should throw DuplicateEmailError if email already exists", async () => {
    mockUserRepository.findByUsername.mockResolvedValue(null);
    mockUserRepository.findByEmail.mockResolvedValue(User.create(
        UserID.createNew(),
        Username.create("otheruser"),
        PasswordHash.create(hashedPassword.getValue() as string),
        Email.create(validEmail)
       )
     );

    const command: RegisterUserCommand = {
      username: validUsername,
      email: validEmail,
      password: strongPassword,
    };

    await expect(registerUser.execute(command)).rejects.toThrow(
      DuplicateEmailError
    );
    expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
      strongPassword
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      Email.create(validEmail)
    );
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });

  it("should throw PasswordHashingFailedError if password hashing fails", async () => {
    mockUserRepository.findByUsername.mockResolvedValue(null);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockPasswordService.hashPassword.mockRejectedValue(
      new PasswordHashingFailedError("Failed to hash password." as string)
    );

    const command: RegisterUserCommand = {
      username: validUsername,
      email: validEmail,
      password: strongPassword,
    };

    await expect(registerUser.execute(command)).rejects.toThrow(
      PasswordHashingFailedError
    );
    expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(
      strongPassword
    );
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockEventPublisher.publish).not.toHaveBeenCalled();
  });
});
