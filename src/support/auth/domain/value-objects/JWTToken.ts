import { InvalidJWTTokenError } from "../errors/InvalidJWTTokenError";

export class JWTToken {
  private readonly token: string;

  private constructor(token: string) {
    this.token = token;
  }

  public static create(token: string): JWTToken {
    const trimmedToken = token.trim();

    if (trimmedToken === "") {
      throw new InvalidJWTTokenError("JWT token cannot be empty.");
    }

    // Un JWT tiene 3 partes separadas por puntos: header.payload.signature
    // Esta es una validación de formato básica, no criptográfica.
    const parts = trimmedToken.split('.');
    if (parts.length !== 3) {
      throw new InvalidJWTTokenError("JWT token has an invalid structure. Expected 3 parts.");
    }

    return new JWTToken(trimmedToken);
  }

  public getValue(): string {
    return this.token;
  }

  public equals(other: JWTToken): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof JWTToken)) {
      return false;
    }
    return this.token === other.token;
  }
}
