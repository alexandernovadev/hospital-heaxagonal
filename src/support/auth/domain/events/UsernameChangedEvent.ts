import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { UserID } from "../value-objects/UserId";
import { Username } from "../value-objects/Username";

export class UsernameChangedEvent extends DomainEvent {
  public readonly userId: UserID;
  public readonly oldUsername: Username;
  public readonly newUsername: Username;

  private constructor(
    userId: UserID,
    oldUsername: Username,
    newUsername: Username,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(eventId, occurredOn);
    this.userId = userId;
    this.oldUsername = oldUsername;
    this.newUsername = newUsername;
  }

  public static create(
    userId: UserID,
    oldUsername: Username,
    newUsername: Username
  ): UsernameChangedEvent {
    return new UsernameChangedEvent(userId, oldUsername, newUsername);
  }
}
