import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidPermissionDescriptionError extends DomainError {
  constructor(message: string = "Invalid permission description format.") {
    super(message, "InvalidPermissionDescriptionError");
  }
}
