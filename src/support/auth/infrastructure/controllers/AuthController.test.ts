import { AuthController } from "./AuthController";
import { Request, Response } from "express";
import { RegisterUser } from "../../application/use-cases/registeruser/RegisterUser";
import { AuthenticateUser } from "../../application/use-cases/authenticateuser/AuthenticateUser";
import { WeakPasswordError } from "../../application/errors/WeakPasswordError";
import { DuplicateUsernameError } from "../../application/errors/DuplicateUsernameError";
import { DuplicateEmailError } from "../../application/errors/DuplicateEmailError";
import { PasswordHashingFailedError } from "../../../../shared/application/errors/PasswordHashingFailedError";
import { InvalidCredentialsError } from "../../application/errors/InvalidCredentialsError";
import { UserAccountLockedError } from "../../application/errors/UserAccountLockedError";
import { TokenGenerationFailedError } from "../../application/errors/TokenGenerationFailedError";
import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";
import { RegisterUserCommand } from "../../application/dtos/RegisterUserCommand";
import { UserRegisteredResponse } from "../../application/dtos/UserRegisteredResponse";
import { AuthenticationCommand } from "../../application/dtos/AuthenticationCommand";
import { AuthenticationResponse } from "../../application/dtos/AuthenticationResponse";
import { TestApplicationError } from "../../../../shared/application/errors/TestApplicationError";
import { UserID } from "../../domain/value-objects/UserId";

const mockRouter = {
  post: jest.fn(),
} as any;

jest.mock("express", () => ({
  Router: jest.fn(() => mockRouter),
}));

jest.mock("../../application/use-cases/registeruser/RegisterUser", () => {
  return {
    RegisterUser: jest.fn().mockImplementation(() => {
      return {
        execute: jest.fn(),
      };
    }),
  };
});

jest.mock(
  "../../application/use-cases/authenticateuser/AuthenticateUser",
  () => {
    return {
      AuthenticateUser: jest.fn().mockImplementation(() => {
        return {
          execute: jest.fn(),
        };
      }),
    };
  }
);

describe("AuthController", () => {
  let mockRegisterUser: jest.Mocked<RegisterUser>;
  let mockAuthenticateUser: jest.Mocked<AuthenticateUser>;
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // We need to cast to any first because the mocked constructor returns an object with only `execute`.
    mockRegisterUser = new RegisterUser(
      null as any,
      null as any,
      null as any
    ) as any;
    mockAuthenticateUser = new AuthenticateUser(
      null as any,
      null as any,
      null as any,
      null as any
    ) as any;

    authController = new AuthController(mockRegisterUser, mockAuthenticateUser);

    mockRequest = { body: {} };
    mockResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    statusSpy = jest.spyOn(mockResponse, "status");
    jsonSpy = jest.spyOn(mockResponse, "json");
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Clear mockRouter calls as it's mocked globally
    mockRouter.post.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it("should initialize routes on construction", () => {
    expect(mockRouter.post).toHaveBeenCalledTimes(2);
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/register",
      expect.any(Function)
    );
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/login",
      expect.any(Function)
    );
  });

  describe("register", () => {
    const registerCommand: RegisterUserCommand = {
      username: "testuser",
      email: "test@example.com",
      password: "StrongPassword123!",
    };
    const registerResponse: UserRegisteredResponse = {
      message: "User registered successfully.",
      username: "testuser",
      email: "test@example.com",
      userId: UserID.createNew().getValue(),
    };

    it("should register a user successfully and return 201", async () => {
      mockRequest.body = registerCommand;
      mockRegisterUser.execute.mockResolvedValue(registerResponse);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockRegisterUser.execute).toHaveBeenCalledWith(registerCommand);
      expect(statusSpy).toHaveBeenCalledWith(201);
      expect(jsonSpy).toHaveBeenCalledWith(registerResponse);
    });

    it("should handle WeakPasswordError and return 400", async () => {
      mockRequest.body = registerCommand;
      const error = new WeakPasswordError("Password is too weak.");
      mockRegisterUser.execute.mockRejectedValue(error);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ message: error.message });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle DuplicateUsernameError and return 409", async () => {
      mockRequest.body = registerCommand;
      const error = new DuplicateUsernameError("Username already exists.");
      mockRegisterUser.execute.mockRejectedValue(error);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(409);
      expect(jsonSpy).toHaveBeenCalledWith({ message: error.message });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle DuplicateEmailError and return 409", async () => {
      mockRequest.body = registerCommand;
      const error = new DuplicateEmailError("Email already registered.");
      mockRegisterUser.execute.mockRejectedValue(error);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(409);
      expect(jsonSpy).toHaveBeenCalledWith({ message: error.message });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle PasswordHashingFailedError and return 500", async () => {
      mockRequest.body = registerCommand;
      const error = new PasswordHashingFailedError("Failed to hash password.");
      mockRegisterUser.execute.mockRejectedValue(error);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({ message: error.message });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle ApplicationError and return 400", async () => {
      mockRequest.body = registerCommand;
      const error = new TestApplicationError("Generic application error.");
      mockRegisterUser.execute.mockRejectedValue(error);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ message: error.message });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle generic errors and return 500", async () => {
      mockRequest.body = registerCommand;
      const error = new Error("Something unexpected happened.");
      mockRegisterUser.execute.mockRejectedValue(error);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: "An unexpected error occurred.",
      });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("authenticate", () => {
    const authCommand: AuthenticationCommand = {
      email: "test@example.com",
      password: "StrongPassword123!",
    };
    const authResponse: AuthenticationResponse = {
      userId: "some-user-id",
      username: "testuser",
      email: "test@example.com",
      accessToken: "mockAccessToken",
      refreshToken: "mockRefreshToken",
    };

    it("should authenticate a user successfully and return 200", async () => {
      mockRequest.body = authCommand;
      mockAuthenticateUser.execute.mockResolvedValue(authResponse);

      await authController.authenticate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockAuthenticateUser.execute).toHaveBeenCalledWith(authCommand);
      expect(statusSpy).toHaveBeenCalledWith(200);
      expect(jsonSpy).toHaveBeenCalledWith(authResponse);
    });

    it("should handle InvalidCredentialsError and return 401", async () => {
      mockRequest.body = authCommand;
      const error = new InvalidCredentialsError(
        "Invalid credentials provided."
      );
      mockAuthenticateUser.execute.mockRejectedValue(error);

      await authController.authenticate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(401);
      expect(jsonSpy).toHaveBeenCalledWith({ message: error.message });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle UserAccountLockedError and return 403", async () => {
      mockRequest.body = authCommand;
      const error = new UserAccountLockedError("User account is locked.");
      mockAuthenticateUser.execute.mockRejectedValue(error);

      await authController.authenticate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(403);
      expect(jsonSpy).toHaveBeenCalledWith({ message: error.message });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle TokenGenerationFailedError and return 500", async () => {
      mockRequest.body = authCommand;
      const error = new TokenGenerationFailedError(
        "Failed to generate tokens."
      );
      mockAuthenticateUser.execute.mockRejectedValue(error);

      await authController.authenticate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({ message: error.message });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle ApplicationError and return 400", async () => {
      mockRequest.body = authCommand;
      const error = new TestApplicationError("Generic application error.");
      mockAuthenticateUser.execute.mockRejectedValue(error);

      await authController.authenticate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(400);
      expect(jsonSpy).toHaveBeenCalledWith({ message: error.message });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it("should handle generic errors and return 500", async () => {
      mockRequest.body = authCommand;
      const error = new Error("Something unexpected happened.");
      mockAuthenticateUser.execute.mockRejectedValue(error);

      await authController.authenticate(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusSpy).toHaveBeenCalledWith(500);
      expect(jsonSpy).toHaveBeenCalledWith({
        message: "An unexpected error occurred.",
      });
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
