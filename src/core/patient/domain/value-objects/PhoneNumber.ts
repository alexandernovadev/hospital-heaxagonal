import { InvalidPhoneNumberError } from "../errors/InvalidPhoneNumberError";

export class PhoneNumber {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): PhoneNumber {
    if (!value || value.trim() === "") {
      throw new InvalidPhoneNumberError("Phone number cannot be empty.");
    }

    const phoneRegex = /^[0-9\s+\-]{7,}$/;
    if (!phoneRegex.test(value)) {
      throw new InvalidPhoneNumberError(
        "Phone number must contain at least 7 digits and only numbers, spaces, hyphens, or a plus sign."
      );
    }

    return new PhoneNumber(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PhoneNumber): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof PhoneNumber)) {
      return false;
    }
    return this.value === other.value;
  }
}
