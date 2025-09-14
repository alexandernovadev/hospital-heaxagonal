import { ApplicationError } from "./ApplicationError";

export class DuplicateUsernameError extends ApplicationError {
  constructor(message: string = "The provided username is already in use.") {
    super(message, "DuplicateUsernameError");
  }
}
