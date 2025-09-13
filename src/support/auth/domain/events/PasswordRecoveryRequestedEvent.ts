import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { Email } from "../value-objects/Email";

export class PasswordRecoveryRequestedEvent extends DomainEvent {
  public readonly email: Email;

  private constructor(
    email: Email,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(eventId, occurredOn);
    this.email = email;
  }

  public static create(email: Email): PasswordRecoveryRequestedEvent {
    return new PasswordRecoveryRequestedEvent(email);
  }
}
