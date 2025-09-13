import { PermissionId } from "../value-objects/PermissionId";
import { PermissionName } from "../value-objects/PermissionName";
import { PermissionDescription } from "../value-objects/PermissionDescription";
import { InvalidPermissionError } from "../errors/InvalidPermissionError";

export class Permission {
  private readonly id: PermissionId;
  private name: PermissionName;
  private description: PermissionDescription;
  private updatedAt: Date;
  private readonly createdAt: Date;

  private constructor(
    id: PermissionId,
    name: PermissionName,
    description: PermissionDescription
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public static create(
    id: PermissionId,
    name: PermissionName,
    description: PermissionDescription
  ): Permission {
    // La validación del ID se mantiene aquí, ya que el VO PermissionId solo valida su formato, no si es null/undefined
    if (id === null || id === undefined) {
      throw new InvalidPermissionError(
        "Permission ID cannot be null or undefined."
      );
    }

    if (!(id instanceof PermissionId)) {
      throw new InvalidPermissionError(
        "Permission ID must be an instance of PermissionId."
      );
    }
    return new Permission(id, name, description);
  }

  changeName(newName: PermissionName): void {
    if (this.name.equals(newName)) {
      return;
    }
    this.name = newName;
    this.updatedAt = new Date();
  }

  changeDescription(newDescription: PermissionDescription): void {
    if (this.description.equals(newDescription)) {
      return;
    }
    this.description = newDescription;
    this.updatedAt = new Date();
  }

  equals(other: Permission): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof Permission)) {
      return false;
    }
    return this.id.equals(other.id);
  }

  public getId(): PermissionId {
    return this.id;
  }

  public getName(): string {
    return this.name.getValue();
  }

  public getDescription(): string {
    return this.description.getValue();
  }

  public getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  public getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }
}
