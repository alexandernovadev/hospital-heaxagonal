import { JwtTokenService } from "./JwtTokenService";
import { JWTToken } from "../../domain/value-objects/JWTToken";
import { RefreshToken } from "../../domain/value-objects/RefreshToken";
import * as jwt from "jsonwebtoken";
import { TokenGenerationFailedError } from "../../application/errors/TokenGenerationFailedError";
import { UserID } from "../../domain/value-objects/UserId";

// Mock the jsonwebtoken library
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn((payload, secret, options) => {
    if (secret === "mockErrorSecret") {
      throw new Error("Mock token generation error");
    }
    return `mock_${secret}_token`;
  }),
  // Add verify method if it were part of ITokenService and needed testing
  verify: jest.fn(),
}));

describe("JwtTokenService", () => {
  let jwtTokenService: JwtTokenService;
  const userId = UserID.createNew();
  const JWT_SECRET_ORIGINAL = process.env.JWT_SECRET;
  const REFRESH_SECRET_ORIGINAL = process.env.REFRESH_SECRET;

  beforeEach(() => {
    jest.clearAllMocks();
    // Set mock environment variables for consistent testing
    process.env.JWT_SECRET = "test_jwt_secret";
    process.env.REFRESH_SECRET = "test_refresh_secret";
    jwtTokenService = new JwtTokenService();
  });

  afterEach(() => {
    // Restore original environment variables
    process.env.JWT_SECRET = JWT_SECRET_ORIGINAL;
    process.env.REFRESH_SECRET = REFRESH_SECRET_ORIGINAL;
  });

  it("should generate an access token successfully", async () => {
    const roles = ["admin"];
    const permissions = ["create", "read"];

    const accessToken = await jwtTokenService.generateAccessToken(
      userId,
      roles,
      permissions
    );

    expect(accessToken).toBeInstanceOf(JWTToken);
    expect(accessToken.getValue()).toBe("mock_test_jwt_secret_token");
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: userId.getValue(),
        roles: roles,
        permissions: permissions,
      },
      "test_jwt_secret",
      { expiresIn: "1h" }
    );
  });

  it("should generate a refresh token successfully", async () => {
    const refreshToken = await jwtTokenService.generateRefreshToken(userId);

    expect(refreshToken).toBeInstanceOf(RefreshToken);
    expect(refreshToken.getValue()).toBe("mock_test_refresh_secret_token");
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: userId.getValue(),
      },
      "test_refresh_secret",
      { expiresIn: "7d" }
    );
  });

  it("should throw TokenGenerationFailedError when access token generation fails", async () => {
    // Temporarily change the secret to trigger the mock error
    process.env.JWT_SECRET = "mockErrorSecret";
    jwtTokenService = new JwtTokenService(); // Re-initialize to pick up new secret

    await expect(
      jwtTokenService.generateAccessToken(userId)
    ).rejects.toThrow(TokenGenerationFailedError);
    expect(jwt.sign).toHaveBeenCalled();
  });

  it("should throw TokenGenerationFailedError when refresh token generation fails", async () => {
    // Temporarily change the secret to trigger the mock error
    process.env.REFRESH_SECRET = "mockErrorSecret";
    jwtTokenService = new JwtTokenService(); // Re-initialize to pick up new secret

    await expect(
      jwtTokenService.generateRefreshToken(userId)
    ).rejects.toThrow(TokenGenerationFailedError);
    expect(jwt.sign).toHaveBeenCalled();
  });
});
