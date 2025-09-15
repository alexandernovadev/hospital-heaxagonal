import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidDateOfBirthError extends DomainError {
  constructor(message: string = "Invalid Date of Birth") {
    super(message, "InvalidDateOfBirthError");
  }
}
