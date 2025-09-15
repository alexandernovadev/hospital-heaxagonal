import { InvalidUsernameError } from "../errors/InvalidUsernameError";

export class Username {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(username: string): Username {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      throw new InvalidUsernameError("Username cannot be empty.");
    }

    if (trimmedUsername.length < 3) {
      throw new InvalidUsernameError("Username must be at least 3 characters long.");
    }

    if (trimmedUsername.length > 50) {
      throw new InvalidUsernameError("Username cannot be longer than 50 characters.");
    }

    // ⚙️ Comentario: Expresión regular para permitir solo letras, números, puntos y guiones bajos.
    // No debe comenzar o terminar con punto o guion bajo, y no debe tener puntos o guiones bajos consecutivos.
    const usernameRegex = /^[a-z0-9](?:[a-z0-9._-]*[a-z0-9])?$/i;

    if (!usernameRegex.test(trimmedUsername.toLowerCase())) {
      throw new InvalidUsernameError(
        "Username can only contain letters, numbers, dots, hyphens, and underscores, and cannot start or end with a special character, or have consecutive special characters."
      );
    }

    return new Username(trimmedUsername.toLowerCase());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Username | null | undefined): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof Username)) {
      return false;
    }
    return this.value === other.value;
  }
}
