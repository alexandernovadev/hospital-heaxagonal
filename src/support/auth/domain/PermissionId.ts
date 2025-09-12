import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { InvalidPermissionError } from "./InvalidPermissionError";

export class PermissionId {
  private readonly id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static createNew(): PermissionId {
    return new PermissionId(uuidv4());
  }

  public static fromString(id: string): PermissionId {
    if (!uuidValidate(id)) {
      throw new InvalidPermissionError("Invalid PermissionID format.");
    }
    return new PermissionId(id);
  }

  public equals(other: PermissionId): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof PermissionId)) {
      return false;
    }
    return this.id === other.id;
  }

  public getValue(): string {
    return this.id;
  }
}
