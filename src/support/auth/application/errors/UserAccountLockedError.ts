import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";

export class UserAccountLockedError extends ApplicationError {
  constructor(message: string = "User account is locked.") {
    super(message, "UserAccountLockedError");
  }
}