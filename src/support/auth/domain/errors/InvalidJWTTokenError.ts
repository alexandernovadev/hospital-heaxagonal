import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidJWTTokenError extends DomainError {
  constructor(message: string = "Invalid JWT token format.") {
    super(message, "InvalidJWTTokenError");
  }
}
