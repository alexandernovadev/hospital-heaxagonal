import { ApplicationError } from "./ApplicationError";

export class PasswordHashingFailedError extends ApplicationError {
  constructor(message: string = "Failed to hash password due to an internal error.") {
    super(message, "PasswordHashingFailedError");
  }
}
