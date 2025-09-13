import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { Email } from "../value-objects/Email";
import { UserID } from "../value-objects/UserId";

export class UserEmailChangedEvent extends DomainEvent {
  public readonly userId: UserID;
  public readonly oldEmail: Email;
  public readonly newEmail: Email;

  private constructor(
    userId: UserID,
    oldEmail: Email,
    newEmail: Email,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(eventId, occurredOn);
    this.userId = userId;
    this.oldEmail = oldEmail;
    this.newEmail = newEmail;
  }

  public static create(
    userId: UserID,
    oldEmail: Email,
    newEmail: Email
  ): UserEmailChangedEvent {
    return new UserEmailChangedEvent(userId, oldEmail, newEmail);
  }
}
