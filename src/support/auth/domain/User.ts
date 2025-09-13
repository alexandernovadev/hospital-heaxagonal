import { Email } from "./Email";
import { PasswordHash } from "./PasswordHash";
import { UserID } from "./UserId";
import { Username } from "./Username";

export class User {
  private readonly id: UserID;
  private username: Username;
  private passwordHash: PasswordHash;
  private email: Email;
  private updatedAt: Date;
  private readonly createdAt: Date;

  private constructor(
    id: UserID,
    username: Username,
    passwordHash: PasswordHash,
    email: Email
  ) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.email = email;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public static create(
    id: UserID,
    username: Username,
    passwordHash: PasswordHash,
    email: Email
  ): User {
    return new User(id, username, passwordHash, email);
  }

  // change methods

  changePassword(passwordHash: PasswordHash): void {
    if (this.passwordHash.equals(passwordHash)) {
      return;
    }
    this.passwordHash = passwordHash;
    this.updatedAt = new Date();
  }

  changeEmail(email: Email): void {
    if (this.email.equals(email)) {
      return;
    }
    this.email = email;
    this.updatedAt = new Date();
  }

  changeUsername(username: Username): void {
    if (this.username.equals(username)) {
      return;
    }
    this.username = username;
    this.updatedAt = new Date();
  }

  equals(other: User): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof User)) {
      return false;
    }
    return this.id.equals(other.id);
  }

  // getters
  public getId(): UserID {
    return this.id;
  }

  public getUsername(): Username {
    return this.username;
  }

  public getPasswordHash(): PasswordHash {
    return this.passwordHash;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  public getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }
}
