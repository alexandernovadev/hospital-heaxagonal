import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { UserID } from "../value-objects/UserId";

export class UserAccountUnlockedEvent extends DomainEvent {
  public readonly userId: UserID;

  private constructor(
    userId: UserID,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(eventId, occurredOn);
    this.userId = userId;
  }

  public static create(userId: UserID): UserAccountUnlockedEvent {
    return new UserAccountUnlockedEvent(userId);
  }
}
