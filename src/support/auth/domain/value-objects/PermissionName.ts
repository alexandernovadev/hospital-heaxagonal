import { InvalidPermissionNameError } from "../errors/InvalidPermissionNameError";

export class PermissionName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(name: string): PermissionName {
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new InvalidPermissionNameError("Permission name cannot be empty.");
    }

    if (trimmedName.length < 3) {
      throw new InvalidPermissionNameError("Permission name must be at least 3 characters long.");
    }

    if (trimmedName.length > 50) {
      throw new InvalidPermissionNameError("Permission name cannot be longer than 50 characters.");
    }

    // ⚙️ Comentario: Expresión regular para permitir solo letras y números. No espacios ni caracteres especiales.
    const permissionNameRegex = /^[a-zA-Z0-9]+$/;

    if (!permissionNameRegex.test(trimmedName)) {
      throw new InvalidPermissionNameError("Permission name can only contain letters and numbers.");
    }

    return new PermissionName(trimmedName);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PermissionName | null | undefined): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof PermissionName)) {
      return false;
    }
    return this.value === other.value;
  }
}
