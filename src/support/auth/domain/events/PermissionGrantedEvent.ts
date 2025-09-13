import { DomainEvent } from "../../../../shared/domain/DomainEvent";
import { PermissionId } from "../value-objects/PermissionId";
import { UserID } from "../value-objects/UserId";

export class PermissionGrantedEvent extends DomainEvent {
  public readonly userId: UserID;
  public readonly permissionId: PermissionId;

  private constructor(
    userId: UserID,
    permissionId: PermissionId,
    eventId?: string,
    occurredOn?: Date
  ) {
    super(eventId, occurredOn);
    this.userId = userId;
    this.permissionId = permissionId;
  }

  public static create(
    userId: UserID,
    permissionId: PermissionId
  ): PermissionGrantedEvent {
    return new PermissionGrantedEvent(userId, permissionId);
  }
}
