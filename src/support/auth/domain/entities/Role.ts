import { RoleId } from "../value-objects/RoleId";
import { RoleName } from "../value-objects/RoleName";
import { RoleDescription } from "../value-objects/RoleDescription";
import { InvalidRoleError } from "../errors/InvalidRoleError";

export class Role {
  private readonly id: RoleId;
  private name: RoleName;
  private description: RoleDescription;
  private updatedAt: Date;
  private readonly createdAt: Date;

  private constructor(
    id: RoleId,
    name: RoleName,
    description: RoleDescription
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  public static create(
    id: RoleId,
    name: RoleName,
    description: RoleDescription
  ): Role {
    if (id === null || id === undefined) {
      throw new Error("Role ID cannot be null or undefined");
    }

    if (!(id instanceof RoleId)) {
      throw new Error("Role ID must be a RoleId instance");
    }
    return new Role(id, name, description);
  }

  changeName(newName: RoleName): void {
    if (this.name.equals(newName)) {
      return;
    }
    this.name = newName;
    this.updatedAt = new Date();
  }

  changeDescription(newDescription: RoleDescription): void {
    if (this.description.equals(newDescription)) {
      return;
    }
    this.description = newDescription;
    this.updatedAt = new Date();
  }

  equals(other: Role): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof Role)) {
      return false;
    }
    return this.id.equals(other.id);
  }

  public getId(): RoleId {
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
