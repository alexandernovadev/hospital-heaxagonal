import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidPermissionNameError extends DomainError {
  constructor(message: string = "Invalid permission name format.") {
    super(message, "InvalidPermissionNameError");
  }
}
