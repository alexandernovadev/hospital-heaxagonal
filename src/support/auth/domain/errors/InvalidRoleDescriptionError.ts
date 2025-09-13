import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidRoleDescriptionError extends DomainError {
  constructor(message: string = "Invalid role description format.") {
    super(message, "InvalidRoleDescriptionError");
  }
}
