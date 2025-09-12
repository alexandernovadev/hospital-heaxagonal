import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { InvalidRoleError } from "./InvalidRoleError";

export class RoleId {
  private readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static createNew(): RoleId {
    return new RoleId(uuidv4());
  }

  public static fromString(id: string): RoleId {
    if (!uuidValidate(id)) {
      throw new InvalidRoleError("Invalid RoleID format.");
    }
    return new RoleId(id);
  }

  public getValue(): string {
    return this.id;
  }

  public equals(other: RoleId): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof RoleId)) {
      return false;
    }
    return this.id === other.id;
  }
}
