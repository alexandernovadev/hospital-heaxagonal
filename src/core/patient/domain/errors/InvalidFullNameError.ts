import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidFullNameError extends DomainError {
  constructor(message: string = "Invalid Full Name") {
    super(message, "InvalidFullNameError");
  }
}
