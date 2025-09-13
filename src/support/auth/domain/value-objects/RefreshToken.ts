import { InvalidRefreshTokenError } from "../errors/InvalidRefreshTokenError";

export class RefreshToken {
  private readonly token: string;

  private constructor(token: string) {
    this.token = token;
  }

  public static create(token: string): RefreshToken {
    const trimmedToken = token.trim();

    if (trimmedToken === "") {
      throw new InvalidRefreshTokenError("Refresh token cannot be empty.");
    }

    // Asumimos que los Refresh Tokens son cadenas opacas pero no vacías.
    // Si tuvieran un formato específico (ej. UUID), se añadiría aquí esa validación.
    // Para este caso, la validación principal es que no esté vacío.

    return new RefreshToken(trimmedToken);
  }

  public getValue(): string {
    return this.token;
  }

  public equals(other: RefreshToken): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof RefreshToken)) {
      return false;
    }
    return this.token === other.token;
  }
}
