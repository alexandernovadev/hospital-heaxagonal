import { DomainError } from "../../../../shared/domain/DomainError";

export class InvalidPhoneNumberError extends DomainError {
  constructor(message: string = "Invalid Phone Number") {
    super(message, "InvalidPhoneNumberError");
  }
}
