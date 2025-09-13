import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidRefreshTokenError extends DomainError {
  constructor(message: string = "Invalid refresh token format.") {
    super(message, "InvalidRefreshTokenError");
  }
}
