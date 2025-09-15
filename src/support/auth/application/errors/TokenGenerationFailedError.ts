import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";

export class TokenGenerationFailedError extends ApplicationError {
  constructor(message: string = "Failed to generate token.") {
    super(message, "TokenGenerationFailedError");
  }
}
