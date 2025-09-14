import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";

export class DuplicateEmailError extends ApplicationError {
  constructor(message: string = "The provided email address is already in use.") {
    super(message, "DuplicateEmailError");
  }
}
