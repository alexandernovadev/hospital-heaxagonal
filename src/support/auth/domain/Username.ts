import { InvalidUsernameError } from "./errors/InvalidUsernameError";

export class Username {
  private readonly username: string;

  private constructor(username: string) {
    this.username = username;
  }

  public static create(name: string): Username {
    
    if (name.trim() === "") {
      throw new InvalidUsernameError("Username must not be empty");
    }

    if (name.length < 4 || name.length > 50) {
      throw new InvalidUsernameError(
        "Username must be between 4 and 50 characters"
      );
    }

    if (name.includes("@") || name.includes("#") || name.includes("$")) {
      throw new InvalidUsernameError(
        "Username must not include special characters"
      );
    }

    // Letras Mayúsculas: Se debe convertir a minúsculas
    // para evitar problemas de comparación.
    return new Username(name.toLowerCase());
  }

  public getValue(): string {
    return this.username;
  }

  public equals(other: Username): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof Username)) {
      return false;
    }
    return this.username === other.username;
  }
}
