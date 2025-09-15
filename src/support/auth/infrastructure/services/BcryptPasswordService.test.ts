import { BcryptPasswordService } from "./BcryptPasswordService";
import { PasswordHashingFailedError } from "../../../../shared/application/errors/PasswordHashingFailedError";
import * as bcrypt from "bcryptjs";
import { PasswordHash } from "../../domain/value-objects/PasswordHash";

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("BcryptPasswordService", () => {
  let bcryptService: BcryptPasswordService;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    bcryptService = new BcryptPasswordService();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should hash a password successfully", async () => {
    const password = "mySecretPassword";
    const mockBcryptHash = "$2b$10$rinaO4LUKL6Or4xpP78O5OZUOZWCL/.A1GkRH/MApfRKXDfORhuL6"; // 60 chars
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockBcryptHash);

    const hashedPassword = await bcryptService.hashPassword(password);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword.getValue()).not.toBe(password);
    expect(hashedPassword.getValue()).toMatch(/^\$2[ab]?\$\d{2}\$[.\/A-Za-z0-9]{53}$/);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
  });

  it("should compare a password successfully", async () => {
    const password = "mySecretPassword";
    const hashedPasswordValue = "$2b$10$rinaO4LUKL6Or4xpP78O5OZUOZWCL/.A1GkRH/MApfRKXDfORhuL6";
    const hashedPassword = PasswordHash.create(hashedPasswordValue);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const isMatch = await bcryptService.comparePassword(password, hashedPassword);
    expect(isMatch).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPasswordValue);
  });

  it("should return false for a mismatched password", async () => {
    const password = "mySecretPassword";
    const wrongPassword = "wrongPassword";
    const hashedPasswordValue = "$2b$10$rinaO4LUKL6Or4xpP78O5OZUOZWCL/.A1GkRH/MApfRKXDfORhuL6";
    const hashedPassword = PasswordHash.create(hashedPasswordValue);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const isMatch = await bcryptService.comparePassword(wrongPassword, hashedPassword);
    expect(isMatch).toBe(false);
    expect(bcrypt.compare).toHaveBeenCalledWith(wrongPassword, hashedPasswordValue);
  });

  it("should throw PasswordHashingFailedError if hashing fails", async () => {
    (bcrypt.hash as jest.Mock).mockRejectedValue(new Error("bcrypt hash error"));

    const password = "mySecretPassword";

    await expect(bcryptService.hashPassword(password)).rejects.toThrow(PasswordHashingFailedError);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error hashing password:",
      new Error("bcrypt hash error")
    );
  });

  it("should throw PasswordHashingFailedError if compare fails due to invalid hash", async () => {
    const password = "mySecretPassword";
    const hashedPasswordValue = "$2b$10$rinaO4LUKL6Or4xpP78O5OZUOZWCL/.A1GkRH/MApfRKXDfORhuL6";
    const hashedPassword = PasswordHash.create(hashedPasswordValue);
    (bcrypt.compare as jest.Mock).mockRejectedValue(new Error("bcrypt compare error"));

    await expect(
      bcryptService.comparePassword(password, hashedPassword)
    ).rejects.toThrow(PasswordHashingFailedError);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPasswordValue);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error comparing password:",
      new Error("bcrypt compare error")
    );
  });
});
