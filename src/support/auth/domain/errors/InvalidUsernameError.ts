import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidUsernameError extends DomainError {
  constructor(message: string = "Invalid username") {
    super(message, "InvalidUsernameError");
  }
}