import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidRoleNameError extends DomainError {
  constructor(message: string = "Invalid role name format.") {
    super(message, "InvalidRoleNameError");
  }
}
