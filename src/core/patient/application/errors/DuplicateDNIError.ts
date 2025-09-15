import { ApplicationError } from "../../../../shared/application/errors/ApplicationError";

export class DuplicateDNIError extends ApplicationError {
  constructor(message: string = "Patient with this DNI already exists.") {
    super(message, "DuplicateDNIError");
  }
}
