import { InvalidPermissionNameError } from "../errors/InvalidPermissionNameError";

export class PermissionName {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(name: string): PermissionName {
    const trimmedName = name.trim();

    if (trimmedName === "") {
      throw new InvalidPermissionNameError("Permission name cannot be empty.");
    }

    if (trimmedName.length < 4 || trimmedName.length > 50) {
      throw new InvalidPermissionNameError(
        "Permission name must be between 4 and 50 characters."
      );
    }

    // Reglas específicas: no permitir caracteres especiales, similar a RoleName
    if (/[^a-zA-Z0-9\s-]/.test(trimmedName)) {
      throw new InvalidPermissionNameError(
        "Permission name must not include special characters (except hyphens and spaces)."
      );
    }

    return new PermissionName(trimmedName);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PermissionName): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof PermissionName)) {
      return false;
    }
    return this.value === other.value;
  }
}
