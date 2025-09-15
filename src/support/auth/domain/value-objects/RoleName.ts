import { InvalidRoleNameError } from "../errors/InvalidRoleNameError";

export class RoleName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(name: string): RoleName {
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new InvalidRoleNameError("Role name cannot be empty.");
    }

    if (trimmedName.length < 3) {
      throw new InvalidRoleNameError("Role name must be at least 3 characters long.");
    }

    if (trimmedName.length > 50) {
      throw new InvalidRoleNameError("Role name cannot be longer than 50 characters.");
    }

    // ⚙️ Comentario: Expresión regular para permitir solo letras y números. No espacios ni caracteres especiales.
    const roleNameRegex = /^[a-zA-Z0-9]+$/;

    if (!roleNameRegex.test(trimmedName)) {
      throw new InvalidRoleNameError("Role name can only contain letters and numbers.");
    }

    return new RoleName(trimmedName);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: RoleName | null | undefined): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof RoleName)) {
      return false;
    }
    return this.value === other.value;
  }
}
