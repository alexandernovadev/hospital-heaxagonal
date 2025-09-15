import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidAddressError extends DomainError {
  constructor(message: string = "Invalid Address") {
    super(message, "InvalidAddressError");
  }
}
