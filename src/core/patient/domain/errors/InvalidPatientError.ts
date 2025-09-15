import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidPatientError extends DomainError {
  constructor(message: string = "Invalid Patient") {
    super(message, "InvalidPatientError");
  }
}
