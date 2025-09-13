import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { RoleId } from "../value-objects/RoleId";
import { UserID } from "../value-objects/UserId";

export class RoleAssignedEvent extends DomainEvent {
  public readonly userId: UserID;
  public readonly roleId: RoleId;

  private constructor(
    userId: UserID,
    roleId: RoleId,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(eventId, occurredOn);
    this.userId = userId;
    this.roleId = roleId;
  }

  public static create(userId: UserID, roleId: RoleId): RoleAssignedEvent {
    return new RoleAssignedEvent(userId, roleId);
  }
}
