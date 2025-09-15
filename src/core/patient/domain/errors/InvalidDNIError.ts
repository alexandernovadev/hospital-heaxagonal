import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidDNIError extends DomainError {
  constructor(message: string = "Invalid DNI") {
    super(message, "InvalidDNIError");
  }
}
