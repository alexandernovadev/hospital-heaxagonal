import { InvalidPasswordHashError } from "../errors/InvalidPasswordHashError";

export class PasswordHash {
  private readonly hash: string;

  private constructor(hash: string) {
    this.hash = hash;
  }

  public static create(hash: string): PasswordHash {
    if (hash.trim() === "") {
      throw new InvalidPasswordHashError("Password hash must not be empty");
    }
    if (hash.length !== 60) {
      throw new InvalidPasswordHashError(
        "Password hash must be exactly 60 characters long (bcrypt format)"
      );
    }

    return new PasswordHash(hash);
  }

  public getValue(): string {
    return this.hash;
  }

  // @important: compare the hash, not the object
  public equals(other: PasswordHash): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof PasswordHash)) {
      return false;
    }
    return this.hash === other.hash;
  }
}
