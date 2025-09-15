import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";

export class InvalidCredentialsError extends ApplicationError {
  constructor(message: string = "Invalid credentials provided.") {
    super(message, "InvalidCredentialsError");
  }
}