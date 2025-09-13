import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { Email } from "../value-objects/Email";
import { UserID } from "../value-objects/UserId";
import { Username } from "../value-objects/Username";

export class UserRegisteredEvent extends DomainEvent {
  public readonly userId: UserID;
  public readonly username: Username;
  public readonly email: Email;

  private constructor(
    userId: UserID,
    username: Username,
    email: Email,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(eventId, occurredOn);
    this.userId = userId;
    this.username = username;
    this.email = email;
  }

  public static create(
    userId: UserID,
    username: Username,
    email: Email
  ): UserRegisteredEvent {
    // Aquí no se realizan validaciones de los objetos internos (userId, username, email)
    // porque se asume que ya son Value Objects válidos al ser creados.
    return new UserRegisteredEvent(userId, username, email);
  }
}
