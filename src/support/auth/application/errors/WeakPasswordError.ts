import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";

export class WeakPasswordError extends ApplicationError {
  constructor(message: string = "Password does not meet complexity requirements.") {
    super(message, "WeakPasswordError");
  }
}
