import { DomainError } from "../../../shared/domain/DomainError";

export class InvalidPermissionError extends DomainError {
  constructor(message: string = "Invalid permission") {
    super(message, "InvalidPermissionError");
  }
}
