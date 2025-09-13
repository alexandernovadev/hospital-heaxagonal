import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidUserError extends DomainError {
  constructor(message: string = "Invalid user") {
    super(message, "InvalidUserError");
  }
}