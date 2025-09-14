import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";

export class DuplicateUsernameError extends ApplicationError {
  constructor(message: string = "The provided username is already in use.") {
    super(message, "DuplicateUsernameError");
  }
}
