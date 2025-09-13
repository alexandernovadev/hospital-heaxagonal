import { InvalidPermissionDescriptionError } from "../errors/InvalidPermissionDescriptionError";

export class PermissionDescription {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(description: string): PermissionDescription {
    const trimmedDescription = description.trim();

    if (trimmedDescription === "") {
      throw new InvalidPermissionDescriptionError("Permission description cannot be empty.");
    }

    if (trimmedDescription.length < 4 || trimmedDescription.length > 255) {
      throw new InvalidPermissionDescriptionError(
        "Permission description must be between 4 and 255 characters."
      );
    }

    // Reglas específicas: permitir más flexibilidad que en el nombre, pero evitar ciertos caracteres de control
    if (/[<>&]/.test(trimmedDescription)) {
      throw new InvalidPermissionDescriptionError(
        "Permission description must not include HTML/XML special characters (<, >, &)."
      );
    }

    return new PermissionDescription(trimmedDescription);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PermissionDescription): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (!(other instanceof PermissionDescription)) {
      return false;
    }
    return this.value === other.value;
  }
}
