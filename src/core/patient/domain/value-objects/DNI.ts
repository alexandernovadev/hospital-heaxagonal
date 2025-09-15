import { InvalidDNIError } from "../errors/InvalidDNIError";

export class DNI {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): DNI {
    if (!value || value.trim() === "") {
      throw new InvalidDNIError("DNI cannot be empty.");
    }

    const dniRegex = /^[0-9]{8}[A-Za-z]$/;
    if (!dniRegex.test(value)) {
      throw new InvalidDNIError("DNI must be 8 digits followed by a letter (e.g., 12345678A).");
    }

    return new DNI(value.toUpperCase());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: DNI): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof DNI)) {
      return false;
    }
    return this.value === other.value;
  }
}
