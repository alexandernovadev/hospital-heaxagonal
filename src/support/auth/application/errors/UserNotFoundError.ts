import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";

export class UserNotFoundError extends ApplicationError {
  constructor(message: string = "User not found.") {
    super(message, "UserNotFoundError");
  }
}