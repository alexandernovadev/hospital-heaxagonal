import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidPatientIdError extends DomainError {
  constructor(message: string = "Invalid Patient ID") {
    super(message, "InvalidPatientIdError");
  }
}
