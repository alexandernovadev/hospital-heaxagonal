import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { UserID } from "../value-objects/UserId";

export class PasswordResetCompletedEvent extends DomainEvent {
  public readonly userId: UserID;

  private constructor(
    userId: UserID,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(eventId, occurredOn);
    this.userId = userId;
  }

  public static create(userId: UserID): PasswordResetCompletedEvent {
    return new PasswordResetCompletedEvent(userId);
  }
}
