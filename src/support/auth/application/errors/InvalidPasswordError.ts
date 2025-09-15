import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";

export class InvalidPasswordError extends ApplicationError {
  constructor(message: string = "Invalid password.") {
    super(message, "InvalidPasswordError");
  }
}