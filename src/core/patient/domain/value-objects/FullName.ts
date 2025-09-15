import { InvalidFullNameError } from "../errors/InvalidFullNameError";

export class FullName {
  private readonly firstName: string;
  private readonly lastName: string;

  private constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public static create(firstName: string, lastName: string): FullName {
    if (!firstName || firstName.trim() === "") {
      throw new InvalidFullNameError("First name cannot be empty.");
    }
    if (!lastName || lastName.trim() === "") {
      throw new InvalidFullNameError("Last name cannot be empty.");
    }

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;
    if (!nameRegex.test(firstName)) {
      throw new InvalidFullNameError("First name contains invalid characters.");
    }
    if (!nameRegex.test(lastName)) {
      throw new InvalidFullNameError("Last name contains invalid characters.");
    }

    return new FullName(firstName, lastName);
  }

  public getFirstName(): string {
    return this.firstName;
  }

  public getLastName(): string {
    return this.lastName;
  }

  public getValue(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public equals(other: FullName): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof FullName)) {
      return false;
    }
    return this.firstName === other.firstName && this.lastName === other.lastName;
  }
}
