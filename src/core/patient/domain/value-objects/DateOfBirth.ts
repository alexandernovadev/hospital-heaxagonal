import { InvalidDateOfBirthError } from "../errors/InvalidDateOfBirthError";

export class DateOfBirth {
  private readonly value: Date;

  private constructor(value: Date) {
    this.value = value;
  }

  public static create(value: Date): DateOfBirth {
    if (value.getTime() > new Date().getTime()) {
      throw new InvalidDateOfBirthError("Date of birth cannot be in the future.");
    }
    return new DateOfBirth(value);
  }

  public getValue(): Date {
    return new Date(this.value);
  }

  public getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  public equals(other: DateOfBirth): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof DateOfBirth)) {
      return false;
    }
    return this.value.getTime() === other.value.getTime();
  }
}
