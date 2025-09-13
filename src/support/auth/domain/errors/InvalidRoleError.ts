import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidRoleError extends DomainError {
  constructor(message: string = "Invalid role ID") {
    super(message, "Invalid RoleError");
  }
}
