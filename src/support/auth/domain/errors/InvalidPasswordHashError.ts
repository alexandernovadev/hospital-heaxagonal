import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidPasswordHashError extends DomainError {
  constructor(message: string = "Invalid password hash") {
    super(message, "InvalidPasswordHashError");
  }
}
