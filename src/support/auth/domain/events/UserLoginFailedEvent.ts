import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { Username } from "../value-objects/Username";

export class UserLoginFailedEvent extends DomainEvent {
  public readonly username: Username;
  public readonly ipAddress?: string; // Podríamos querer registrar la IP para seguridad

  private constructor(
    username: Username,
    ipAddress?: string,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(eventId, occurredOn);
    this.username = username;
    this.ipAddress = ipAddress;
  }

  public static create(
    username: Username,
    ipAddress?: string
  ): UserLoginFailedEvent {
    return new UserLoginFailedEvent(username, ipAddress);
  }
}
