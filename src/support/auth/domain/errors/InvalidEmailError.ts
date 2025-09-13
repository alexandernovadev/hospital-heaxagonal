import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidEmailError extends DomainError {
  constructor(message: string = "Invalid email address format.") {
    super(message, "InvalidEmailError");
  }
}
